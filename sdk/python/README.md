# SwiftAPI Python SDK

Official Python SDK for SwiftAPI - Unified infrastructure API for AI agents.

## Installation

```bash
pip install swiftapi
```

## Quick Start

```python
from swiftapi import SwiftAPI

# Initialize with API key
client = SwiftAPI(api_key="sk_your_api_key_here")

# Or authenticate with email/password
client = SwiftAPI()
client.login("your@email.com", "your_password")

# Get current user info
user = client.get_current_user()
print(f"Current tier: {user.tier}")

# Create API key
api_key = client.create_api_key("Production Key")
print(f"New API key: {api_key.key}")

# Get usage statistics
usage = client.get_usage()
print(f"API calls this month: {usage.calls.month}")
```

## Authentication

### Using API Key

```python
from swiftapi import SwiftAPI

client = SwiftAPI(api_key="sk_your_api_key_here")
```

### Using Email/Password

```python
from swiftapi import SwiftAPI

client = SwiftAPI()
response = client.login("your@email.com", "your_password")
print(f"Access token: {response['access_token']}")
```

### Creating Account

```python
from swiftapi import SwiftAPI

client = SwiftAPI()
response = client.signup("your@email.com", "secure_password")
print(f"User created: {response['user']['email']}")
```

## API Reference

### User Management

#### Get Current User

```python
user = client.get_current_user()
print(user.email)
print(user.tier)
print(user.monthly_volume)
```

### API Keys

#### Create API Key

```python
api_key = client.create_api_key("Production Key")
print(f"Key: {api_key.key}")
print(f"Created: {api_key.created_at}")
```

#### List API Keys

```python
keys = client.list_api_keys()
for key in keys:
    print(f"{key.name}: {key.is_active}")
```

#### Delete API Key

```python
client.delete_api_key("key_id_here")
```

### Subscriptions

#### Upgrade Tier

```python
from swiftapi import TierEnum

subscription = client.create_subscription(TierEnum.PRO)
if subscription.client_secret:
    print(f"Complete payment at: {subscription.client_secret}")
```

### Payments

#### Create Payment

```python
transaction = client.create_payment(
    amount=100.00,
    currency="usd",
    metadata={"order_id": "12345"}
)
print(f"Transaction ID: {transaction.id}")
print(f"Fee amount: {transaction.fee_amount}")
```

### Usage Tracking

#### Get Usage Statistics

```python
usage = client.get_usage()
print(f"Tier: {usage.tier}")
print(f"API calls today: {usage.calls.today}")
print(f"API calls this month: {usage.calls.month}")
print(f"Rate limit remaining (minute): {usage.rate_limits.minute_remaining}")
```

## Error Handling

```python
from swiftapi import SwiftAPI, AuthenticationError, RateLimitError

client = SwiftAPI(api_key="sk_test_key")

try:
    user = client.get_current_user()
except AuthenticationError as e:
    print(f"Authentication failed: {e.message}")
except RateLimitError as e:
    print(f"Rate limit exceeded: {e.message}")
except SwiftAPIError as e:
    print(f"API error: {e.message}")
```

## Subscription Tiers

- **Free**: 1,000 calls/month, 10 req/min
- **Indie**: 10,000 calls/month, 100 req/min - $49/month
- **Pro**: 100,000 calls/month, 500 req/min - $199/month
- **Enterprise**: Unlimited calls, 5,000 req/min - $999/month

## Support

- Documentation: https://docs.getswiftapi.com
- GitHub: https://github.com/theonlypal/swiftapi
- Email: support@getswiftapi.com

## License

MIT License - see LICENSE file for details
