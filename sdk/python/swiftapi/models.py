from enum import Enum
from typing import Optional
from datetime import datetime
from pydantic import BaseModel, EmailStr


class TierEnum(str, Enum):
    FREE = "free"
    INDIE = "indie"
    PRO = "pro"
    ENTERPRISE = "enterprise"


class User(BaseModel):
    id: str
    email: EmailStr
    tier: TierEnum
    monthly_volume: float
    created_at: datetime


class APIKey(BaseModel):
    id: str
    name: str
    key: Optional[str] = None
    is_active: bool
    created_at: datetime
    last_used_at: Optional[datetime] = None


class Subscription(BaseModel):
    id: str
    tier: TierEnum
    status: str
    client_secret: Optional[str] = None


class Transaction(BaseModel):
    id: str
    amount: float
    fee_amount: float
    status: str
    currency: str
    client_secret: Optional[str] = None


class RateLimitUsage(BaseModel):
    minute_remaining: int
    hour_remaining: int


class UsageCalls(BaseModel):
    today: int
    month: int


class Usage(BaseModel):
    tier: TierEnum
    monthly_volume: float
    rate_limits: RateLimitUsage
    calls: UsageCalls
