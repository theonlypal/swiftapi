# SwiftAPI TypeScript/JavaScript SDK

Official TypeScript/JavaScript SDK for SwiftAPI - Unified infrastructure API for AI agents.

## Installation

```bash
npm install @swiftapi/sdk
# or
yarn add @swiftapi/sdk
```

## Quick Start

```typescript
import { SwiftAPI, TierEnum } from '@swiftapi/sdk';

// Initialize with API key
const client = new SwiftAPI({ apiKey: 'sk_your_api_key_here' });

// Or authenticate with email/password
const client = new SwiftAPI();
await client.login('your@email.com', 'your_password');

// Get current user info
const user = await client.getCurrentUser();
console.log(`Current tier: ${user.tier}`);

// Create API key
const apiKey = await client.createAPIKey('Production Key');
console.log(`New API key: ${apiKey.key}`);

// Get usage statistics
const usage = await client.getUsage();
console.log(`API calls this month: ${usage.calls.month}`);
```

## Authentication

### Using API Key

```typescript
import { SwiftAPI } from '@swiftapi/sdk';

const client = new SwiftAPI({
  apiKey: 'sk_your_api_key_here',
});
```

### Using Email/Password

```typescript
import { SwiftAPI } from '@swiftapi/sdk';

const client = new SwiftAPI();
const response = await client.login('your@email.com', 'your_password');
console.log(`Access token: ${response.access_token}`);
```

### Creating Account

```typescript
import { SwiftAPI } from '@swiftapi/sdk';

const client = new SwiftAPI();
const response = await client.signup('your@email.com', 'secure_password');
console.log(`User created: ${response.user.email}`);
```

## API Reference

### User Management

#### Get Current User

```typescript
const user = await client.getCurrentUser();
console.log(user.email);
console.log(user.tier);
console.log(user.monthly_volume);
```

### API Keys

#### Create API Key

```typescript
const apiKey = await client.createAPIKey('Production Key');
console.log(`Key: ${apiKey.key}`);
console.log(`Created: ${apiKey.created_at}`);
```

#### List API Keys

```typescript
const keys = await client.listAPIKeys();
keys.forEach((key) => {
  console.log(`${key.name}: ${key.is_active ? 'Active' : 'Revoked'}`);
});
```

#### Delete API Key

```typescript
await client.deleteAPIKey('key_id_here');
```

### Subscriptions

#### Upgrade Tier

```typescript
import { TierEnum } from '@swiftapi/sdk';

const subscription = await client.createSubscription(TierEnum.PRO);
if (subscription.client_secret) {
  console.log(`Complete payment at: ${subscription.client_secret}`);
}
```

### Payments

#### Create Payment

```typescript
const transaction = await client.createPayment(100.0, 'usd', {
  order_id: '12345',
});
console.log(`Transaction ID: ${transaction.id}`);
console.log(`Fee amount: ${transaction.fee_amount}`);
```

### Usage Tracking

#### Get Usage Statistics

```typescript
const usage = await client.getUsage();
console.log(`Tier: ${usage.tier}`);
console.log(`API calls today: ${usage.calls.today}`);
console.log(`API calls this month: ${usage.calls.month}`);
console.log(`Rate limit remaining (minute): ${usage.rate_limits.minute_remaining}`);
```

## Error Handling

```typescript
import {
  SwiftAPI,
  AuthenticationError,
  RateLimitError,
  SwiftAPIError,
} from '@swiftapi/sdk';

const client = new SwiftAPI({ apiKey: 'sk_test_key' });

try {
  const user = await client.getCurrentUser();
} catch (error) {
  if (error instanceof AuthenticationError) {
    console.error(`Authentication failed: ${error.message}`);
  } else if (error instanceof RateLimitError) {
    console.error(`Rate limit exceeded: ${error.message}`);
  } else if (error instanceof SwiftAPIError) {
    console.error(`API error: ${error.message}`);
  }
}
```

## TypeScript Support

This SDK is written in TypeScript and provides full type definitions out of the box.

```typescript
import { User, APIKey, Usage, TierEnum } from '@swiftapi/sdk';

const user: User = await client.getCurrentUser();
const keys: APIKey[] = await client.listAPIKeys();
const usage: Usage = await client.getUsage();
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
