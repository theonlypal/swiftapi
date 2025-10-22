# SwiftAPI - 404 Error Resolution

## Problem Analysis

All deployments fail because Vercel cannot locate the Next.js app in the monorepo structure.

Current Status: `DEPLOYMENT_NOT_FOUND` - 404 on all URLs

---

## Resolution Steps

### Step 1: Configure Vercel Build Settings

1. Open: https://vercel.com/rayan-pals-projects/swiftapi/settings

2. Navigate to "Build & Development Settings"

3. Click "OVERRIDE"

4. Set exact values:
   ```
   Root Directory: apps/web
   Build Command: pnpm build
   Output Directory: .next
   Install Command: pnpm install
   ```

5. Save changes

### Step 2: Redeploy

1. Navigate to: https://vercel.com/rayan-pals-projects/swiftapi

2. Click "Redeploy" on latest deployment

3. Wait approximately 2 minutes for build completion

4. Verify: Visit `https://swiftapi-rayan-pals-projects.vercel.app`
   - Should display landing page

---

## DNS Configuration

### Problem
Domain `getswiftapi.com` resolves to IPs `64.29.17.1, 216.198.79.65` (non-Vercel infrastructure).

### Solution

1. Access domain registrar (where getswiftapi.com was purchased)

2. Locate DNS/Nameserver settings

3. Update nameservers:
   ```
   ns1.vercel-dns.com
   ns2.vercel-dns.com
   ```

4. Wait 5-10 minutes for DNS propagation

5. Add domain in Vercel:
   - Navigate to: https://vercel.com/rayan-pals-projects/swiftapi/settings/domains
   - Click "Add"
   - Enter: `getswiftapi.com`
   - Confirm

6. Repeat for: `swiftapi.api`

---

## Environment Variables

Configuration (non-blocking for build):

```bash
# Required (build succeeds without these, but features need them)
NEXTAUTH_URL=https://getswiftapi.com
NEXTAUTH_SECRET=generate_with_openssl_rand_base64_32
APP_URL=https://getswiftapi.com
DATABASE_URL=postgresql://your_postgres_connection

# GitHub OAuth (create at github.com/settings/developers)
GITHUB_ID=your_client_id
GITHUB_SECRET=your_client_secret

# Stripe (from dashboard.stripe.com)
STRIPE_SECRET_KEY=sk_test_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_secret
STRIPE_PRICE_ID=price_your_id

# Optional
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
CRON_SECRET=random_string
```

Add at: https://vercel.com/rayan-pals-projects/swiftapi/settings/environment-variables

Note: Build completes without environment variables. Add them to enable authentication, database, and billing features.

---

## Verification

After Root Directory configuration and redeployment:

```bash
# Test Vercel URL
curl -I https://swiftapi-rayan-pals-projects.vercel.app
```

Expected: `HTTP/1.1 200 OK`

After DNS configuration and domain addition:

```bash
# Test custom domain
curl -I https://getswiftapi.com
```

Expected: `HTTP/1.1 200 OK`

---

## Summary

Issue: Vercel cannot locate Next.js app (404)
Cause: Root Directory not configured for monorepo
Fix: Set `Root Directory: apps/web` and redeploy
Duration: ~2 minutes

Secondary Issue: DNS not pointing to Vercel
Cause: Incorrect nameservers
Fix: Update to `ns1.vercel-dns.com` + `ns2.vercel-dns.com`
Duration: 5-10 minutes (propagation)

---

## Action Items

1. Set Root Directory to `apps/web`
2. Initiate redeployment
3. Wait ~2 minutes
4. Verify .vercel.app URL
5. Configure DNS (after step 4 succeeds)
