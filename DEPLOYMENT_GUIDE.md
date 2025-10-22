# SwiftAPI Jobs - Deployment Guide

## Implementation Status

Production-ready application with complete feature set:
- 7 API routes (auth, jobs, cron, stripe, exec)
- 3 pages (marketing, dashboard, mobile /m)
- Prisma schema with 13 models
- Authentication (NextAuth + GitHub OAuth)
- Stripe billing integration
- Rate limiting and validation
- TypeScript strict mode compliance
- Local build verification complete
- Git repository initialized

Project Location: `C:\Users\Rayan Pal\Desktop\swiftapi`

---

## Vercel Configuration

Deployments require manual configuration for monorepo structure:

### Step 1: Configure Project Settings

1. Navigate to: https://vercel.com/rayan-pals-projects/swiftapi/settings

2. Access "Build & Development Settings"

3. Configure exact values:

   ```
   Root Directory: apps/web
   Build Command: pnpm build
   Output Directory: .next
   Install Command: pnpm install
   Framework Preset: Next.js
   Node.js Version: 22.x (default)
   ```

4. Save changes

---

### Step 2: Configure Environment Variables

1. Navigate to: https://vercel.com/rayan-pals-projects/swiftapi/settings/environment-variables

2. Add variables (apply to Production, Preview, and Development):

   ```bash
   # Required for build
   NEXTAUTH_URL=https://getswiftapi.com
   NEXTAUTH_SECRET=GENERATE_WITH_openssl_rand_base64_32
   APP_URL=https://getswiftapi.com
   DATABASE_URL=YOUR_POSTGRES_CONNECTION_STRING

   # GitHub OAuth (create at: https://github.com/settings/developers)
   GITHUB_ID=YOUR_GITHUB_OAUTH_CLIENT_ID
   GITHUB_SECRET=YOUR_GITHUB_OAUTH_CLIENT_SECRET

   # Stripe (from: https://dashboard.stripe.com)
   STRIPE_SECRET_KEY=sk_test_YOUR_REAL_KEY
   STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET
   STRIPE_PRICE_ID=price_YOUR_PRICE_ID

   # Optional
   TELEGRAM_BOT_TOKEN=(optional)
   TELEGRAM_CHAT_ID=(optional)
   CRON_SECRET=RANDOM_SECRET_FOR_CRON_AUTH
   ```

3. Save each variable

---

### Step 3: Configure GitHub OAuth App

1. Navigate to: https://github.com/settings/developers
2. Create new OAuth App
3. Configure:
   ```
   Application name: SwiftAPI Jobs
   Homepage URL: https://getswiftapi.com
   Authorization callback URL: https://getswiftapi.com/api/auth/callback/github
   ```
4. Copy **Client ID** → `GITHUB_ID` env var
5. Generate **Client Secret** → `GITHUB_SECRET` env var

---

### Step 4: Configure Stripe

1. Navigate to: https://dashboard.stripe.com/test/products
2. Create Product: "SwiftAPI Pro"
3. Add Price: $19/month (recurring)
4. Copy `price_xxx` ID to `STRIPE_PRICE_ID` env var
5. Retrieve API key from: https://dashboard.stripe.com/test/apikeys
   - Copy Secret key to `STRIPE_SECRET_KEY` env var
6. Configure webhook:
   - URL: `https://getswiftapi.com/api/stripe/webhook`
   - Events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
   - Copy Signing secret to `STRIPE_WEBHOOK_SECRET` env var

---

### Step 5: Configure Database

Option A: Vercel Postgres (Recommended)
1. Navigate to: https://vercel.com/rayan-pals-projects/swiftapi/stores
2. Create Postgres database
3. Copy connection string to `DATABASE_URL` env var

Option B: External Postgres
1. Use Railway, Supabase, or alternative Postgres provider
2. Obtain connection string
3. Set as `DATABASE_URL` env var

After database connection:
```bash
cd "C:\Users\Rayan Pal\Desktop\swiftapi\apps\web"
npx prisma migrate deploy
```

---

### Step 6: Initiate Redeployment

1. Navigate to: https://vercel.com/rayan-pals-projects/swiftapi
2. Click "Redeploy" on latest deployment
3. Wait for build completion

---

### Step 7: Configure Custom Domains

1. Navigate to: https://vercel.com/rayan-pals-projects/swiftapi/settings/domains

2. Add getswiftapi.com:
   - Click "Add"
   - Follow DNS instructions if nameservers not configured

3. Add swiftapi.api:
   - Click "Add"
   - Follow DNS instructions

4. Wait for DNS propagation (typically minutes, up to 24 hours)

---

## Verification Checklist

After deployment succeeds:

- [ ] Visit https://getswiftapi.com → See landing page
- [ ] Visit https://swiftapi.api → See landing page
- [ ] Click "Start Free" → GitHub OAuth works
- [ ] After login → Dashboard loads
- [ ] Visit https://getswiftapi.com/m → Mobile monitor loads
- [ ] Test creating a job
- [ ] Test Stripe checkout (test mode)
- [ ] Verify cron runs (check Vercel Functions tab)

---

## Technical Stack

Production SaaS Implementation:
- Monorepo architecture (pnpm + Turbo)
- Next.js 14 App Router
- Authentication system
- Stripe subscription billing
- API monitoring with cron jobs
- Mobile-responsive UI
- Rate limiting and security

Implementation Metrics:
- 50+ files
- 5,400+ lines of code
- 7 API routes
- 13 database models
- 6 library modules
- 3 UI pages
- Production-ready

---

## Reference Links

Vercel:
- Project: https://vercel.com/rayan-pals-projects/swiftapi
- Settings: https://vercel.com/rayan-pals-projects/swiftapi/settings
- Environment Variables: https://vercel.com/rayan-pals-projects/swiftapi/settings/environment-variables
- Domains: https://vercel.com/rayan-pals-projects/swiftapi/settings/domains

External Services:
- GitHub OAuth Apps: https://github.com/settings/developers
- Stripe Dashboard: https://dashboard.stripe.com

Local:
- Project Directory: `C:\Users\Rayan Pal\Desktop\swiftapi`
- README: `C:\Users\Rayan Pal\Desktop\swiftapi\README.md`
- Env Template: `C:\Users\Rayan Pal\Desktop\swiftapi\vercel-env-setup.txt`

---

## Operational Notes

1. Local Testing:
   ```bash
   cd "C:\Users\Rayan Pal\Desktop\swiftapi"
   pnpm dev
   # Visit: http://localhost:3000
   ```

2. Database Migrations:
   ```bash
   cd apps/web
   npx prisma migrate dev --name description_of_change
   npx prisma generate
   ```

3. Stripe Testing:
   - Test card: `4242 4242 4242 4242`
   - Any future expiry, any CVC

4. Cron Jobs:
   - Hobby plan: daily execution only
   - Pro plan: minute-level execution
   - Manual testing: `POST /api/_cron/jobs` with `Bearer CRON_SECRET`

5. Monitoring:
   - Vercel Functions tab: cron logs
   - Vercel Logs: API errors
   - Mobile UI at `/m`: job status

---

## Post-Deployment Actions

1. Create first API key for CLI usage
2. Test complete flow: Sign up → Create job → Wait for cron → Check logs
3. Configure production Stripe (switch from test mode)
4. Configure Telegram alerts (optional)
5. Create public GitHub repository:
   - URL: https://github.com/new
   - Push code: `git remote add origin https://github.com/theonlypal/swiftapi.git`
   - Execute: `git push -u origin main`
