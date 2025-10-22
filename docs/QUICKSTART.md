# SwiftAPI Quick Start Guide

Get started with SwiftAPI in 5 minutes.

## Step 1: Create Account

Sign up at [getswiftapi.com](https://getswiftapi.com/signup)

```bash
curl -X POST https://api.getswiftapi.com/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "you@example.com",
    "password": "secure_password"
  }'
```

Response:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "you@example.com",
    "tier": "free"
  }
}
```

## Step 2: Create API Key

```bash
curl -X POST https://api.getswiftapi.com/api-keys \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "My First Key"}'
```

Response:
```json
{
  "id": "key_550e8400",
  "key": "sk_abc123def456ghi789",
  "name": "My First Key",
  "created_at": "2025-10-22T12:00:00Z"
}
```

**Important:** Store this key securely. You won't see it again.

## Step 3: Install SDK

### Python

```bash
pip install swiftapi
```

### TypeScript/JavaScript

```bash
npm install @swiftapi/sdk
```

## Step 4: Make Your First Request

### Python

```python
from swiftapi import SwiftAPI

# Initialize client with your API key
client = SwiftAPI(api_key="sk_abc123def456ghi789")

# Get your account info
user = client.get_current_user()
print(f"Email: {user.email}")
print(f"Tier: {user.tier}")

# Check usage
usage = client.get_usage()
print(f"API calls this month: {usage.calls.month}")
print(f"Rate limit remaining: {usage.rate_limits.minute_remaining}")
```

### TypeScript

```typescript
import { SwiftAPI } from '@swiftapi/sdk';

// Initialize client with your API key
const client = new SwiftAPI({ apiKey: 'sk_abc123def456ghi789' });

// Get your account info
const user = await client.getCurrentUser();
console.log(`Email: ${user.email}`);
console.log(`Tier: ${user.tier}`);

// Check usage
const usage = await client.getUsage();
console.log(`API calls this month: ${usage.calls.month}`);
console.log(`Rate limit remaining: ${usage.rate_limits.minute_remaining}`);
```

## Step 5: Process Your First Payment

### Python

```python
from swiftapi import SwiftAPI

client = SwiftAPI(api_key="sk_abc123def456ghi789")

# Create a payment
transaction = client.create_payment(
    amount=100.00,
    currency="usd",
    metadata={
        "order_id": "ORDER_12345",
        "customer": "john@example.com"
    }
)

print(f"Transaction ID: {transaction.id}")
print(f"Amount: ${transaction.amount}")
print(f"SwiftAPI Fee: ${transaction.fee_amount}")
print(f"Status: {transaction.status}")

# If client_secret is present, redirect to Stripe
if transaction.client_secret:
    print(f"Complete payment: {transaction.client_secret}")
```

### TypeScript

```typescript
import { SwiftAPI } from '@swiftapi/sdk';

const client = new SwiftAPI({ apiKey: 'sk_abc123def456ghi789' });

// Create a payment
const transaction = await client.createPayment(100.0, 'usd', {
  order_id: 'ORDER_12345',
  customer: 'john@example.com',
});

console.log(`Transaction ID: ${transaction.id}`);
console.log(`Amount: $${transaction.amount}`);
console.log(`SwiftAPI Fee: $${transaction.fee_amount}`);
console.log(`Status: ${transaction.status}`);

// If client_secret is present, redirect to Stripe
if (transaction.client_secret) {
  console.log(`Complete payment: ${transaction.client_secret}`);
}
```

## Understanding Fees

SwiftAPI charges the **lesser** of:
- 2% of transaction amount
- $0.05 per API call

### Examples:

**Large transaction:**
- $1,000 payment = $20 fee (2% of $1,000)
- Better than: 200 API calls × $0.05 = $10
- You pay: $10 (the lesser amount)

**Small transaction:**
- $1 payment = $0.02 fee (2% of $1)
- Better than: $0.05 per call
- You pay: $0.02 (the lesser amount)

## Next Steps

### Upgrade Your Plan

Start with Free tier (1,000 calls/month), then upgrade as you grow:

```python
from swiftapi import SwiftAPI, TierEnum

client = SwiftAPI(api_key="sk_abc123def456ghi789")

# Upgrade to Pro tier
subscription = client.create_subscription(TierEnum.PRO)
print(f"New tier: {subscription.tier}")
```

### Available Tiers:

| Tier | Price | Monthly Calls | Rate Limit |
|------|-------|---------------|------------|
| Free | $0 | 1,000 | 10/min |
| Indie | $49 | 10,000 | 100/min |
| Pro | $199 | 100,000 | 500/min |
| Enterprise | $999 | Unlimited | 5,000/min |

### Explore Documentation

- [Full API Reference](./API_REFERENCE.md)
- [Python SDK Docs](../sdk/python/README.md)
- [TypeScript SDK Docs](../sdk/typescript/README.md)

### Join Community

- GitHub: https://github.com/theonlypal/swiftapi
- Discord: https://discord.gg/swiftapi
- Twitter: https://twitter.com/swiftapi

## Common Use Cases

### AI Agent Payments

```python
# AI agent processes payment for user
transaction = client.create_payment(
    amount=9.99,
    metadata={
        "agent_id": "agent_123",
        "service": "content_generation",
        "user_id": "user_456"
    }
)
```

### Usage-Based Billing

```python
# Track API calls and bill monthly
usage = client.get_usage()
monthly_cost = usage.calls.month * 0.001  # $0.001 per call
print(f"This month's bill: ${monthly_cost}")
```

### Multi-Tenant SaaS

```python
# Each customer gets their own API key
customer_key = client.create_api_key(f"Customer_{customer_id}")

# Track usage per customer
customer_client = SwiftAPI(api_key=customer_key.key)
customer_usage = customer_client.get_usage()
```

## Troubleshooting

### Authentication Error

```
AuthenticationError: Invalid credentials
```

**Fix:** Check your API key or access token is correct.

### Rate Limit Error

```
RateLimitError: Rate limit exceeded
```

**Fix:**
1. Implement exponential backoff
2. Upgrade to higher tier
3. Batch requests where possible

### Payment Failed

```
Transaction status: failed
```

**Fix:**
1. Check Stripe account is active
2. Verify customer payment method
3. Review transaction logs in dashboard

## Support

Need help? We're here:

- Email: support@getswiftapi.com
- GitHub Issues: https://github.com/theonlypal/swiftapi/issues
- Live Chat: https://getswiftapi.com/chat

**Response times:**
- Free: 48 hours
- Indie: 24 hours
- Pro: 4 hours
- Enterprise: 1 hour + phone support
