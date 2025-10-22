import redis
import os
from typing import Optional
from datetime import datetime, timedelta

redis_client = redis.Redis.from_url(
    os.getenv("REDIS_URL", "redis://localhost:6379"),
    decode_responses=True
)

RATE_LIMITS = {
    "free": {"requests_per_minute": 10, "requests_per_hour": 100},
    "indie": {"requests_per_minute": 100, "requests_per_hour": 5000},
    "pro": {"requests_per_minute": 500, "requests_per_hour": 50000},
    "enterprise": {"requests_per_minute": 5000, "requests_per_hour": float('inf')}
}

class RateLimiter:
    def __init__(self, user_id: str, tier: str):
        self.user_id = user_id
        self.tier = tier
        self.limits = RATE_LIMITS.get(tier, RATE_LIMITS["free"])

    def is_allowed(self) -> tuple[bool, Optional[int]]:
        """Check if request is allowed. Returns (allowed, retry_after_seconds)"""
        minute_key = f"rate_limit:{self.user_id}:minute"
        hour_key = f"rate_limit:{self.user_id}:hour"

        minute_count = redis_client.get(minute_key)
        hour_count = redis_client.get(hour_key)

        minute_count = int(minute_count) if minute_count else 0
        hour_count = int(hour_count) if hour_count else 0

        if minute_count >= self.limits["requests_per_minute"]:
            ttl = redis_client.ttl(minute_key)
            return False, max(ttl, 1)

        if hour_count >= self.limits["requests_per_hour"]:
            ttl = redis_client.ttl(hour_key)
            return False, max(ttl, 1)

        pipe = redis_client.pipeline()
        pipe.incr(minute_key)
        pipe.expire(minute_key, 60)
        pipe.incr(hour_key)
        pipe.expire(hour_key, 3600)
        pipe.execute()

        return True, None

    def get_current_usage(self) -> dict:
        """Get current rate limit usage"""
        minute_key = f"rate_limit:{self.user_id}:minute"
        hour_key = f"rate_limit:{self.user_id}:hour"

        minute_count = redis_client.get(minute_key) or 0
        hour_count = redis_client.get(hour_key) or 0

        return {
            "minute": {
                "used": int(minute_count),
                "limit": self.limits["requests_per_minute"],
                "remaining": max(0, self.limits["requests_per_minute"] - int(minute_count))
            },
            "hour": {
                "used": int(hour_count),
                "limit": self.limits["requests_per_hour"],
                "remaining": max(0, self.limits["requests_per_hour"] - int(hour_count))
            }
        }
