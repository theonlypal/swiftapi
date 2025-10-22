# SwiftAPI Documentation

Complete API reference for SwiftAPI - Unified infrastructure API for AI agents.

## Base URL

```
Production: https://api.getswiftapi.com
```

## Authentication

SwiftAPI supports two authentication methods:

### 1. JWT Bearer Token

Obtain an access token via login and include it in requests:

```bash
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### 2. API Key

Create an API key in the dashboard and include it in requests:

```bash
Authorization: Bearer sk_your_api_key
```

## Rate Limits

Rate limits vary by subscription tier:

| Tier | Requests/Minute | Requests/Hour | Monthly Calls |
|------|----------------|---------------|---------------|
| Free | 10 | 100 | 1,000 |
| Indie | 100 | 5,000 | 10,000 |
| Pro | 500 | 50,000 | 100,000 |
| Enterprise | 5,000 | Unlimited | Unlimited |

Rate limit headers are included in all responses:

```
X-RateLimit-Remaining-Minute: 95
X-RateLimit-Remaining-Hour: 4950
```

## Error Codes

| Status Code | Description |
|------------|-------------|
| 200 | Success |
| 400 | Bad Request - Invalid parameters |
| 401 | Unauthorized - Invalid or missing authentication |
| 404 | Not Found - Resource doesn't exist |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error |

### Error Response Format

```json
{
  "detail": "Error message describing what went wrong"
}
```

## Endpoints

### Authentication

#### POST /auth/signup

Create a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "secure_password"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "tier": "free"
  }
}
```

#### POST /auth/login

Authenticate and get access token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "secure_password"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "tier": "free"
  }
}
```

#### GET /auth/me

Get current user information.

**Headers:**
```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Response:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "tier": "pro",
  "monthly_volume": 1250.50,
  "created_at": "2025-10-01T12:00:00Z"
}
```

### API Keys

#### POST /api-keys

Generate a new API key.

**Headers:**
```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Request Body:**
```json
{
  "name": "Production Key"
}
```

**Response:**
```json
{
  "id": "key_550e8400",
  "key": "sk_abc123def456ghi789",
  "name": "Production Key",
  "created_at": "2025-10-22T12:00:00Z"
}
```

**Note:** The `key` field is only returned on creation. Store it securely.

#### GET /api-keys

List all API keys for the current user.

**Headers:**
```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Response:**
```json
[
  {
    "id": "key_550e8400",
    "name": "Production Key",
    "is_active": true,
    "created_at": "2025-10-22T12:00:00Z",
    "last_used_at": "2025-10-22T14:30:00Z"
  },
  {
    "id": "key_660f9500",
    "name": "Development Key",
    "is_active": false,
    "created_at": "2025-10-20T10:00:00Z",
    "last_used_at": null
  }
]
```

#### DELETE /api-keys/{key_id}

Revoke an API key.

**Headers:**
```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Parameters:**
- `key_id` (path) - ID of the API key to revoke

**Response:**
```json
{
  "success": true
}
```

### Subscriptions

#### POST /subscriptions

Upgrade or change subscription tier.

**Headers:**
```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Request Body:**
```json
{
  "tier": "pro"
}
```

**Tiers:**
- `free` - $0/month, 1,000 calls
- `indie` - $49/month, 10,000 calls
- `pro` - $199/month, 100,000 calls
- `enterprise` - $999/month, unlimited calls

**Response:**
```json
{
  "id": "sub_550e8400",
  "tier": "pro",
  "status": "incomplete",
  "client_secret": "pi_3Abc123_secret_Xyz789"
}
```

**Note:** If `client_secret` is present, redirect user to Stripe payment page to complete subscription.

### Payments

#### POST /payments

Process a payment with 2% fee capture.

**Headers:**
```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Request Body:**
```json
{
  "amount": 100.00,
  "currency": "usd",
  "metadata": {
    "order_id": "ORDER_12345",
    "customer_name": "John Doe"
  }
}
```

**Response:**
```json
{
  "id": "txn_550e8400",
  "amount": 100.00,
  "fee_amount": 2.00,
  "status": "requires_payment_method",
  "client_secret": "pi_3Abc123_secret_Xyz789"
}
```

**Fee Calculation:**
SwiftAPI charges the lesser of:
- 2% of transaction amount
- $0.05 per API call

Example: $100 transaction = $2.00 fee (2% of $100)

### Usage

#### GET /usage

Get usage statistics for the current user.

**Headers:**
```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Response:**
```json
{
  "tier": "pro",
  "monthly_volume": 12500.50,
  "rate_limits": {
    "minute_remaining": 495,
    "hour_remaining": 49850
  },
  "calls": {
    "today": 1250,
    "month": 45678
  }
}
```

### Health

#### GET /health

Check API health status.

**Response:**
```json
{
  "status": "healthy",
  "version": "1.0.0"
}
```

## Code Examples

### Python

```python
from swiftapi import SwiftAPI

# Initialize client
client = SwiftAPI(api_key="sk_your_api_key")

# Get current user
user = client.get_current_user()
print(f"Tier: {user.tier}")

# Create payment
transaction = client.create_payment(
    amount=100.00,
    metadata={"order_id": "12345"}
)
print(f"Fee: ${transaction.fee_amount}")
```

### TypeScript

```typescript
import { SwiftAPI } from '@swiftapi/sdk';

// Initialize client
const client = new SwiftAPI({ apiKey: 'sk_your_api_key' });

// Get current user
const user = await client.getCurrentUser();
console.log(`Tier: ${user.tier}`);

// Create payment
const transaction = await client.createPayment(100.0, 'usd', {
  order_id: '12345',
});
console.log(`Fee: $${transaction.fee_amount}`);
```

### cURL

```bash
# Login
curl -X POST https://api.getswiftapi.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}'

# Create API Key
curl -X POST https://api.getswiftapi.com/api-keys \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Production Key"}'

# Create Payment
curl -X POST https://api.getswiftapi.com/payments \
  -H "Authorization: Bearer sk_your_api_key" \
  -H "Content-Type: application/json" \
  -d '{"amount":100.00,"currency":"usd","metadata":{"order_id":"12345"}}'
```

## Webhooks

SwiftAPI can send webhooks for important events:

- `payment.succeeded` - Payment completed successfully
- `payment.failed` - Payment failed
- `subscription.created` - New subscription created
- `subscription.updated` - Subscription tier changed
- `subscription.cancelled` - Subscription cancelled

Configure webhook endpoints in your dashboard.

### Webhook Signature Verification

All webhooks include a signature header for verification:

```
Stripe-Signature: t=1234567890,v1=abc123...
```

Use Stripe's webhook verification to ensure authenticity.

## Best Practices

1. **Store API keys securely** - Never commit keys to version control
2. **Handle rate limits gracefully** - Implement exponential backoff
3. **Use webhooks for async events** - Don't poll for payment status
4. **Validate all inputs** - Check data before sending to API
5. **Monitor usage** - Track API calls to avoid hitting limits

## Support

- Documentation: https://docs.getswiftapi.com
- GitHub: https://github.com/theonlypal/swiftapi
- Email: support@getswiftapi.com
- Status Page: https://status.getswiftapi.com

## Changelog

### v1.0.0 (2025-10-22)
- Initial release
- Authentication endpoints
- API key management
- Subscription management
- Payment processing
- Usage tracking
