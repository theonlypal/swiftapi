# SwiftAPI

Unified infrastructure API for AI agents - payments, billing, identity, and usage tracking in one simple API.

## Overview

SwiftAPI provides the infrastructure layer that AI agent developers need to monetize their agents and manage users at scale. Built on Stripe, PostgreSQL, and Redis for production-grade reliability.

### Key Features

- **Payment Processing** - Accept payments with 2% fee or $0.05/call (whichever less)
- **Subscription Billing** - Tiered plans from Free to Enterprise
- **API Key Management** - Secure authentication for AI agents
- **Usage Tracking** - Real-time metering and rate limiting
- **Developer Dashboard** - Monitor usage, manage keys, track revenue

## Quick Start

### 1. Sign Up

```bash
curl -X POST https://api.getswiftapi.com/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"you@example.com","password":"secure_password"}'
```

### 2. Install SDK

**Python:**
```bash
pip install swiftapi
```

**TypeScript:**
```bash
npm install @swiftapi/sdk
```

### 3. Make Your First Request

**Python:**
```python
from swiftapi import SwiftAPI

client = SwiftAPI(api_key="sk_your_api_key")
user = client.get_current_user()
print(f"Tier: {user.tier}")
```

**TypeScript:**
```typescript
import { SwiftAPI } from '@swiftapi/sdk';

const client = new SwiftAPI({ apiKey: 'sk_your_api_key' });
const user = await client.getCurrentUser();
console.log(`Tier: ${user.tier}`);
```

## Documentation

- [Quick Start Guide](./docs/QUICKSTART.md)
- [API Reference](./docs/API_REFERENCE.md)
- [Python SDK](./sdk/python/README.md)
- [TypeScript SDK](./sdk/typescript/README.md)

## Pricing

| Tier | Price/Month | API Calls | Rate Limit |
|------|-------------|-----------|------------|
| Free | $0 | 1,000 | 10/min |
| Indie | $49 | 10,000 | 100/min |
| Pro | $199 | 100,000 | 500/min |
| Enterprise | $999 | Unlimited | 5,000/min |

**Transaction Fees:** 2% or $0.05 per API call (whichever is less)

## Architecture

```
┌─────────────────┐
│  Next.js        │  Developer Dashboard
│  Frontend       │  (React, TailwindCSS)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  FastAPI        │  REST API
│  Backend        │  (Python, Uvicorn)
└────────┬────────┘
         │
         ├────────────────┐
         │                │
         ▼                ▼
┌─────────────┐   ┌─────────────┐
│ PostgreSQL  │   │   Redis     │
│ (SQLAlchemy)│   │ (Rate Limit)│
└─────────────┘   └─────────────┘
         │
         ▼
┌─────────────────┐
│     Stripe      │  Payment Processing
│    Connect      │  (2% fee capture)
└─────────────────┘
```

## Tech Stack

**Backend:**
- FastAPI (Python)
- PostgreSQL (SQLAlchemy ORM)
- Redis (Rate limiting)
- Stripe (Payments)
- JWT (Authentication)

**Frontend:**
- Next.js 14
- TypeScript
- TailwindCSS
- Recharts (Analytics)

**SDKs:**
- Python (requests, pydantic)
- TypeScript (axios)

## Repository Structure

```
swiftapi/
├── backend/              # FastAPI backend
│   ├── main.py          # API endpoints
│   ├── models.py        # Database models
│   ├── auth.py          # Authentication
│   ├── stripe_service.py # Payment processing
│   ├── rate_limiter.py  # Rate limiting
│   └── database.py      # Database connection
├── frontend/            # Next.js frontend
│   ├── src/
│   │   ├── pages/      # Dashboard pages
│   │   ├── components/ # React components
│   │   ├── lib/        # API client
│   │   └── types/      # TypeScript types
│   └── package.json
├── sdk/
│   ├── python/         # Python SDK
│   └── typescript/     # TypeScript SDK
└── docs/               # Documentation
    ├── API_REFERENCE.md
    └── QUICKSTART.md
```

## Development

### Backend Setup

```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
# Configure DATABASE_URL, STRIPE_SECRET_KEY, etc.
uvicorn main:app --reload
```

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

### Environment Variables

**Backend (.env):**
```bash
DATABASE_URL=postgresql://user:password@localhost:5432/swiftapi
REDIS_URL=redis://localhost:6379
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
SECRET_KEY=your-secret-key-here
```

**Frontend (.env.local):**
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Deployment

### Vercel (Recommended)

**Frontend:**
```bash
vercel --prod
```

**Backend:**
Deploy to any Python-compatible platform:
- Railway
- Render
- Fly.io
- AWS Lambda (with Mangum)

### Domain Configuration

- Primary: getswiftapi.com
- API: api.getswiftapi.com
- Alternative: swiftapi.ai

## API Endpoints

### Authentication
- `POST /auth/signup` - Create account
- `POST /auth/login` - Get access token
- `GET /auth/me` - Get current user

### API Keys
- `POST /api-keys` - Create API key
- `GET /api-keys` - List all keys
- `DELETE /api-keys/{id}` - Revoke key

### Subscriptions
- `POST /subscriptions` - Upgrade tier

### Payments
- `POST /payments` - Process payment

### Usage
- `GET /usage` - Get statistics

## Use Cases

### AI Agent Monetization

```python
# AI agent charges user for service
transaction = client.create_payment(
    amount=9.99,
    metadata={"agent_id": "agent_123", "service": "analysis"}
)
```

### SaaS Billing

```python
# Track usage and bill monthly
usage = client.get_usage()
monthly_bill = usage.calls.month * 0.01  # $0.01 per call
```

### Multi-Tenant Platform

```python
# Each customer gets isolated API key
customer_key = client.create_api_key(f"Customer_{id}")
```

## Security

- JWT authentication with HS256
- API keys with Bearer token format
- Stripe webhook signature verification
- Rate limiting by tier
- PostgreSQL with parameterized queries
- HTTPS required in production

## Contributing

We welcome contributions! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

See [CONTRIBUTING.md](./CONTRIBUTING.md) for details.

## Support

- **Documentation:** https://docs.getswiftapi.com
- **GitHub Issues:** https://github.com/theonlypal/swiftapi/issues
- **Email:** support@getswiftapi.com
- **Discord:** https://discord.gg/swiftapi

**Response Times:**
- Free: 48 hours
- Indie: 24 hours
- Pro: 4 hours
- Enterprise: 1 hour + phone

## License

MIT License - see [LICENSE](./LICENSE) for details.

## Built With

SwiftAPI is built on the shoulders of giants:

- [FastAPI](https://fastapi.tiangolo.com/) - Modern Python web framework
- [Next.js](https://nextjs.org/) - React framework
- [Stripe](https://stripe.com/) - Payment processing
- [PostgreSQL](https://www.postgresql.org/) - Database
- [Redis](https://redis.io/) - Caching and rate limiting

## Roadmap

- [x] Core API infrastructure
- [x] Payment processing
- [x] Subscription management
- [x] Dashboard
- [x] Python SDK
- [x] TypeScript SDK
- [ ] Webhooks system
- [ ] Usage-based billing
- [ ] Team management
- [ ] OAuth 2.0 (KYA - Know Your Agent)
- [ ] GraphQL API
- [ ] Mobile SDKs (iOS, Android)

---

Built with focus by [Rayan Pal](https://github.com/theonlypal)
