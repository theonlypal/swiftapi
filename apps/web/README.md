# SwiftAPI Web Application

Next.js 14 application for API monitoring and job scheduling.

## Architecture

- Framework: Next.js 14 (App Router)
- Database: Prisma ORM with PostgreSQL/SQLite
- Authentication: NextAuth.js with GitHub OAuth
- Payments: Stripe Checkout and Customer Portal
- Styling: Tailwind CSS

## Development

```bash
# Install dependencies
pnpm install

# Setup environment
cp .env.example .env.local

# Run database migrations
pnpm prisma generate
pnpm prisma migrate dev

# Start development server
pnpm dev
```

Visit http://localhost:3000

## Environment Configuration

Required variables:

```bash
# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<generate-with-openssl-rand-base64-32>
APP_URL=http://localhost:3000

# Database
DATABASE_URL=file:./dev.db

# GitHub OAuth
GITHUB_ID=<github-oauth-client-id>
GITHUB_SECRET=<github-oauth-client-secret>

# Stripe
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
STRIPE_PRICE_ID=price_xxx

# Optional: Telegram Alerts
TELEGRAM_BOT_TOKEN=<bot-token>
TELEGRAM_CHAT_ID=<chat-id>

# Cron Authentication
CRON_SECRET=<random-secret>
```

## Project Structure

```
app/
├── (app)/              # Authenticated routes
│   └── dashboard/      # User dashboard
├── (marketing)/        # Public marketing pages
├── api/                # API routes
│   ├── auth/           # NextAuth endpoints
│   ├── jobs/           # Job management
│   ├── exec/           # Execution proxy
│   ├── stripe/         # Payment webhooks
│   └── _cron/          # Scheduled job execution
├── m/                  # Mobile-optimized monitor
└── layout.tsx          # Root layout

lib/
├── prisma.ts           # Database client
├── auth.ts             # NextAuth configuration
├── stripe.ts           # Stripe client
├── alerts.ts           # Telegram notifications
├── rate.ts             # Rate limiting
└── jsonpath.ts         # JSONPath evaluation

components/
├── HeroDemo.tsx        # Landing page demo
├── JobCardMobile.tsx   # Mobile job card
└── JobsListMobile.tsx  # Mobile job list
```

## API Routes

- `POST /api/jobs` - Create job
- `GET /api/jobs` - List jobs
- `POST /api/jobs/[id]/run` - Execute job manually
- `POST /api/exec` - Proxy API requests (requires API key)
- `POST /api/_cron/jobs` - Scheduled job execution (requires CRON_SECRET)
- `POST /api/stripe/checkout` - Create checkout session
- `POST /api/stripe/webhook` - Handle Stripe events

## Database Schema

13 models including:
- User (authentication)
- Account (OAuth accounts)
- Session (user sessions)
- Job (API monitoring jobs)
- JobRun (execution history)
- Subscription (Stripe subscriptions)
- ApiKey (API authentication)

## Build

```bash
# Type checking
pnpm type-check

# Build for production
pnpm build

# Start production server
pnpm start
```

## Deployment

See root `DEPLOYMENT_GUIDE.md` for Vercel deployment instructions.
