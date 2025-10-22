import stripe
import os
from typing import Dict, Optional
from models import TierEnum

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

TIER_PRICES = {
    TierEnum.FREE: 0,
    TierEnum.INDIE: 4900,
    TierEnum.PRO: 19900,
    TierEnum.ENTERPRISE: 99900
}

TIER_LIMITS = {
    TierEnum.FREE: 1000,
    TierEnum.INDIE: 10000,
    TierEnum.PRO: 100000,
    TierEnum.ENTERPRISE: float('inf')
}

TRANSACTION_FEE_PERCENT = 0.02
PER_CALL_FEE = 0.05

def create_customer(email: str, name: Optional[str] = None) -> str:
    """Create Stripe customer and return customer ID"""
    customer = stripe.Customer.create(
        email=email,
        name=name,
        metadata={"source": "swiftapi"}
    )
    return customer.id

def create_subscription(customer_id: str, tier: TierEnum) -> Dict:
    """Create subscription for tier"""
    if tier == TierEnum.FREE:
        return {"id": None, "status": "active"}

    price_id = get_price_id(tier)
    subscription = stripe.Subscription.create(
        customer=customer_id,
        items=[{"price": price_id}],
        payment_behavior="default_incomplete",
        expand=["latest_invoice.payment_intent"]
    )

    return {
        "id": subscription.id,
        "status": subscription.status,
        "client_secret": subscription.latest_invoice.payment_intent.client_secret
        if subscription.latest_invoice else None
    }

def get_price_id(tier: TierEnum) -> str:
    """Get Stripe price ID for tier"""
    price_ids = {
        TierEnum.INDIE: os.getenv("STRIPE_PRICE_INDIE"),
        TierEnum.PRO: os.getenv("STRIPE_PRICE_PRO"),
        TierEnum.ENTERPRISE: os.getenv("STRIPE_PRICE_ENTERPRISE")
    }
    return price_ids.get(tier, "")

def cancel_subscription(subscription_id: str) -> bool:
    """Cancel subscription at period end"""
    try:
        stripe.Subscription.modify(
            subscription_id,
            cancel_at_period_end=True
        )
        return True
    except stripe.error.StripeError:
        return False

def create_payment_intent(amount: int, customer_id: str, metadata: Dict) -> Dict:
    """Create payment intent for transaction fee capture"""
    intent = stripe.PaymentIntent.create(
        amount=amount,
        currency="usd",
        customer=customer_id,
        metadata=metadata,
        application_fee_amount=int(amount * TRANSACTION_FEE_PERCENT)
    )
    return {
        "id": intent.id,
        "client_secret": intent.client_secret,
        "status": intent.status
    }

def calculate_fee(transaction_amount: float, api_calls: int) -> float:
    """Calculate fee: 2% of transaction or $0.05 per call, whichever is less"""
    transaction_fee = transaction_amount * TRANSACTION_FEE_PERCENT
    per_call_fee = api_calls * PER_CALL_FEE
    return min(transaction_fee, per_call_fee)

def verify_webhook_signature(payload: bytes, sig_header: str) -> bool:
    """Verify Stripe webhook signature"""
    try:
        stripe.Webhook.construct_event(
            payload, sig_header, os.getenv("STRIPE_WEBHOOK_SECRET")
        )
        return True
    except stripe.error.SignatureVerificationError:
        return False
