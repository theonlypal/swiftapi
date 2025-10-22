# SwiftAPI Jobs

**API Monitoring on Autopilot** - Schedule API calls, validate responses, get instant alerts.

## Features

- 🔄 **Scheduled Monitoring** - Run API checks every 1m, 5m, 15m, or hourly
- ✅ **Smart Validation** - Check HTTP status + JSONPath assertions
- 📱 **Mobile-First UI** - Monitor from anywhere at `/m`
- 🚨 **Instant Alerts** - Telegram notifications on failures
- 💳 **Stripe Billing** - Free tier + Pro subscription
- 🔐 **GitHub Auth** - Secure authentication via NextAuth.js

## Quick Start

### Prerequisites

- Node.js 18+
- pnpm 9+
- GitHub OAuth App ([create one](https://github.com/settings/developers))
- Stripe account (test mode)

### Installation

```bash
# Clone the repo
git clone https://github.com/yourusername/swiftapi.git
cd swiftapi

# Install dependencies
pnpm install

# Setup environment
cd apps/web
cp .env.example .env.local

# Edit .env.local with your keys:
# - GITHUB_ID & GITHUB_SECRET
# - STRIPE_SECRET_KEY & STRIPE_PRICE_ID
# - NEXTAUTH_SECRET (generate with: openssl rand -base64 32)

# Run migrations
pnpm prisma generate
pnpm prisma migrate dev

# Start dev server
cd ../..
pnpm dev
```

Visit `http://localhost:3000`

## Environment Variables

```bash
# Auth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<generate-random-32-bytes>
APP_URL=http://localhost:3000

# GitHub OAuth
GITHUB_ID=<your-github-client-id>
GITHUB_SECRET=<your-github-client-secret>

# Database
DATABASE_URL=file:./dev.db  # SQLite for dev, postgres://... for prod

# Stripe
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
STRIPE_PRICE_ID=price_xxx  # Create a recurring price in Stripe

# Telegram Alerts (optional)
TELEGRAM_BOT_TOKEN=<your-bot-token>
TELEGRAM_CHAT_ID=<your-chat-id>

# Cron
CRON_SECRET=<random-secret>  # For authenticating Vercel Cron
```

## Stripe Setup

1. Create a product in [Stripe Dashboard](https://dashboard.stripe.com/products)
2. Add a recurring price (e.g., $19/month)
3. Copy the `price_xxx` ID to `STRIPE_PRICE_ID`
4. Setup webhook endpoint: `https://yourapp.com/api/stripe/webhook`
5. Copy webhook secret to `STRIPE_WEBHOOK_SECRET`
6. Enable events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`

## API Examples

### Create a Job

```bash
curl -X POST http://localhost:3000/api/jobs \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=<your-session>" \
  -d '{
    "name": "httpbin-ok",
    "url": "https://httpbin.org/status/200",
    "method": "GET",
    "schedule": "5m",
    "expectStatus": 200
  }'
```

### With JSONPath Validation

```bash
curl -X POST http://localhost:3000/api/jobs \
  -H "Content-Type: application/json" \
  -d '{
    "name": "api-health",
    "url": "https://api.example.com/health",
    "method": "GET",
    "schedule": "1m",
    "expectStatus": 200,
    "expectJsonPath": "$.status",
    "expectValue": "ok"
  }'
```

### Manual Run

```bash
curl -X POST http://localhost:3000/api/jobs/<JOB_ID>/run
```

### Exec Proxy (with API key)

```bash
curl -X POST http://localhost:3000/api/exec \
  -H "Authorization: Bearer <API_KEY>" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://httpbin.org/post",
    "method": "POST",
    "body": {"hello": "world"}
  }'
```

## Pricing

| Feature | Free | Pro ($19/mo) |
|---------|------|--------------|
| Jobs | 1 | 20 |
| Min Interval | 15m | 1m |
| Logs Retention | 7 days | 90 days |
| Telegram Alerts | ❌ | ✅ |

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
pnpm add -g vercel

# Link project
vercel link

# Set environment variables
vercel env add NEXTAUTH_SECRET
vercel env add GITHUB_ID
vercel env add GITHUB_SECRET
vercel env add STRIPE_SECRET_KEY
vercel env add STRIPE_WEBHOOK_SECRET
vercel env add STRIPE_PRICE_ID
vercel env add DATABASE_URL  # Use Vercel Postgres or other hosted DB

# Deploy
vercel --prod
```

### Setup Vercel Cron

In `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/_cron/jobs",
      "schedule": "* * * * *"
    }
  ]
}
```

Set `CRON_SECRET` env var and use it to authenticate the cron endpoint.

## Mobile Monitor

Visit `/m` on your phone for a mobile-optimized job monitor with:
- Real-time status indicators (green = pass, red = fail)
- One-tap manual runs
- Auto-refresh every 10 seconds

## Architecture

- **Framework**: Next.js 14 (App Router)
- **Database**: Prisma + SQLite (dev) / Postgres (prod)
- **Auth**: NextAuth.js + GitHub OAuth
- **Payments**: Stripe Checkout + Customer Portal
- **Background Jobs**: Vercel Cron
- **Alerts**: Telegram Bot API

## Development

```bash
# Run dev server
pnpm dev

# Build for production
pnpm build

# Run type checks
pnpm -r type-check

# Lint
pnpm lint
```

## License

MIT

---

Built with ❤️ using Next.js, Prisma, and Stripe
