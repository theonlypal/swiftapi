from fastapi import FastAPI, Depends, HTTPException, status, Header, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from typing import Optional
import secrets
import models
import auth
from database import get_db, engine
from rate_limiter import RateLimiter
import stripe_service
from pydantic import BaseModel, EmailStr

models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="SwiftAPI",
    description="Unified infrastructure API for AI agents",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SignupRequest(BaseModel):
    email: EmailStr
    password: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class CreateAPIKeyRequest(BaseModel):
    name: str

class SubscriptionRequest(BaseModel):
    tier: models.TierEnum

class PaymentRequest(BaseModel):
    amount: float
    currency: str = "usd"
    metadata: Optional[dict] = {}

@app.post("/auth/signup")
def signup(request: SignupRequest, db: Session = Depends(get_db)):
    """Create new user account"""
    existing = db.query(models.User).filter(models.User.email == request.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    stripe_customer = stripe_service.create_customer(request.email)

    user = models.User(
        email=request.email,
        hashed_password=auth.get_password_hash(request.password),
        stripe_customer_id=stripe_customer,
        tier=models.TierEnum.FREE
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    access_token = auth.create_access_token(data={"sub": user.id})

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "tier": user.tier
        }
    }

@app.post("/auth/login")
def login(request: LoginRequest, db: Session = Depends(get_db)):
    """Authenticate and get access token"""
    user = db.query(models.User).filter(models.User.email == request.email).first()
    if not user or not auth.verify_password(request.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token = auth.create_access_token(data={"sub": user.id})

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "tier": user.tier
        }
    }

@app.get("/auth/me")
def get_current_user_info(current_user: models.User = Depends(auth.get_current_user)):
    """Get current user information"""
    return {
        "id": current_user.id,
        "email": current_user.email,
        "tier": current_user.tier,
        "monthly_volume": current_user.monthly_volume,
        "created_at": current_user.created_at
    }

@app.post("/api-keys")
def create_api_key(
    request: CreateAPIKeyRequest,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    """Generate new API key"""
    key = f"sk_{secrets.token_urlsafe(32)}"

    api_key = models.APIKey(
        key=key,
        user_id=current_user.id,
        name=request.name
    )
    db.add(api_key)
    db.commit()
    db.refresh(api_key)

    return {
        "id": api_key.id,
        "key": api_key.key,
        "name": api_key.name,
        "created_at": api_key.created_at
    }

@app.get("/api-keys")
def list_api_keys(
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    """List all API keys"""
    keys = db.query(models.APIKey).filter(models.APIKey.user_id == current_user.id).all()
    return [
        {
            "id": key.id,
            "name": key.name,
            "is_active": key.is_active,
            "created_at": key.created_at,
            "last_used_at": key.last_used_at
        }
        for key in keys
    ]

@app.delete("/api-keys/{key_id}")
def delete_api_key(
    key_id: str,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    """Revoke API key"""
    key = db.query(models.APIKey).filter(
        models.APIKey.id == key_id,
        models.APIKey.user_id == current_user.id
    ).first()

    if not key:
        raise HTTPException(status_code=404, detail="API key not found")

    key.is_active = False
    db.commit()

    return {"success": True}

@app.post("/subscriptions")
def create_subscription(
    request: SubscriptionRequest,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    """Upgrade/change subscription tier"""
    result = stripe_service.create_subscription(current_user.stripe_customer_id, request.tier)

    subscription = models.Subscription(
        user_id=current_user.id,
        stripe_subscription_id=result["id"],
        tier=request.tier,
        status=result["status"]
    )
    db.add(subscription)

    current_user.tier = request.tier
    db.commit()
    db.refresh(subscription)

    return {
        "id": subscription.id,
        "tier": subscription.tier,
        "status": subscription.status,
        "client_secret": result.get("client_secret")
    }

@app.post("/payments")
def create_payment(
    request: PaymentRequest,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    """Process payment with 2% fee capture"""
    amount_cents = int(request.amount * 100)
    metadata = {**request.metadata, "user_id": current_user.id}

    result = stripe_service.create_payment_intent(
        amount_cents,
        current_user.stripe_customer_id,
        metadata
    )

    fee_amount = request.amount * stripe_service.TRANSACTION_FEE_PERCENT

    transaction = models.Transaction(
        user_id=current_user.id,
        stripe_payment_intent_id=result["id"],
        amount=request.amount,
        fee_amount=fee_amount,
        currency=request.currency,
        status=result["status"]
    )
    db.add(transaction)
    db.commit()
    db.refresh(transaction)

    return {
        "id": transaction.id,
        "amount": transaction.amount,
        "fee_amount": transaction.fee_amount,
        "status": transaction.status,
        "client_secret": result["client_secret"]
    }

@app.get("/usage")
def get_usage(
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    """Get usage statistics"""
    rate_limiter = RateLimiter(current_user.id, current_user.tier)
    rate_limit_usage = rate_limiter.get_current_usage()

    today = datetime.utcnow().date()
    daily_calls = db.query(models.UsageLog).filter(
        models.UsageLog.user_id == current_user.id,
        models.UsageLog.created_at >= today
    ).count()

    monthly_calls = db.query(models.UsageLog).filter(
        models.UsageLog.user_id == current_user.id,
        models.UsageLog.created_at >= datetime.utcnow() - timedelta(days=30)
    ).count()

    return {
        "tier": current_user.tier,
        "monthly_volume": current_user.monthly_volume,
        "rate_limits": rate_limit_usage,
        "calls": {
            "today": daily_calls,
            "month": monthly_calls
        }
    }

@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "version": "1.0.0"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
