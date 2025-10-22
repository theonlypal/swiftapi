# SWIFTAPI - QUICK FIX FOR 404 ERROR

## 🚨 PROBLEM IDENTIFIED

All deployments are **ERRORING** because Vercel doesn't know to look in `apps/web` for a monorepo.

**Current Status**: `DEPLOYMENT_NOT_FOUND` → 404 on all URLs

---

## ✅ 2-MINUTE FIX

### Step 1: Fix Vercel Build Settings

1. **Open**: https://vercel.com/rayan-pals-projects/swiftapi/settings

2. **Scroll down** to "Build & Development Settings"

3. **Click "OVERRIDE"** button

4. **Set EXACTLY**:
   ```
   Root Directory: apps/web
   Build Command: pnpm build
   Output Directory: .next
   Install Command: pnpm install
   ```

5. **Click "Save"**

### Step 2: Redeploy

1. **Go to**: https://vercel.com/rayan-pals-projects/swiftapi

2. **Click "Redeploy"** on the latest deployment

3. **Wait 2 minutes** - it will succeed this time!

4. **Test**: Visit `https://swiftapi-rayan-pals-projects.vercel.app`
   - Should see your landing page ✅

---

## 🌐 FIX DNS (Do After Deployment Works)

### Problem
Your domain `getswiftapi.com` is resolving to IPs `64.29.17.1, 216.198.79.65` which are NOT Vercel.

### Solution

1. **Log into your domain registrar** (where you bought getswiftapi.com)

2. **Find DNS/Nameserver settings**

3. **Change nameservers to**:
   ```
   ns1.vercel-dns.com
   ns2.vercel-dns.com
   ```

4. **Wait 5-10 minutes** for DNS propagation

5. **Add domain in Vercel**:
   - Go to: https://vercel.com/rayan-pals-projects/swiftapi/settings/domains
   - Click "Add"
   - Type: `getswiftapi.com`
   - Click "Add"

6. **Repeat for**: `swiftapi.api`

---

## 📋 ENVIRONMENT VARIABLES (Add Later - Won't Block Build)

You asked for the list - here it is:

```bash
# REQUIRED (but build will work without them for now)
NEXTAUTH_URL=https://getswiftapi.com
NEXTAUTH_SECRET=generate_with_openssl_rand_base64_32
APP_URL=https://getswiftapi.com
DATABASE_URL=postgresql://your_postgres_connection

# GITHUB OAUTH (create at github.com/settings/developers)
GITHUB_ID=your_client_id
GITHUB_SECRET=your_client_secret

# STRIPE (from dashboard.stripe.com)
STRIPE_SECRET_KEY=sk_test_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_secret
STRIPE_PRICE_ID=price_your_id

# OPTIONAL
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
CRON_SECRET=random_string
```

**Add these at**: https://vercel.com/rayan-pals-projects/swiftapi/settings/environment-variables

**But NOT required** to fix the 404 - the build will complete without them now!

---

## ✅ VERIFICATION

After Root Directory is set and you redeploy:

```bash
# Test default Vercel URL
curl -I https://swiftapi-rayan-pals-projects.vercel.app
```

**Should return**: `HTTP/1.1 200 OK` ✅
**NOT**: `404 Not Found` ❌

After DNS is fixed and domain added:

```bash
# Test custom domain
curl -I https://getswiftapi.com
```

**Should return**: `HTTP/1.1 200 OK` ✅

---

## 🎯 SUMMARY

**Issue**: Vercel can't find your Next.js app (404)
**Cause**: Root Directory not set for monorepo
**Fix**: Set `Root Directory: apps/web` → Redeploy
**Time**: 2 minutes

**Secondary Issue**: DNS not pointing to Vercel
**Cause**: Nameservers wrong
**Fix**: Point to `ns1.vercel-dns.com` + `ns2.vercel-dns.com`
**Time**: 5-10 minutes (propagation)

---

## 🚀 DO THIS NOW

1. ✅ Set Root Directory to `apps/web`
2. ✅ Click Redeploy
3. ⏰ Wait 2 minutes
4. ✅ Test the .vercel.app URL
5. 🌐 Fix DNS (after step 4 works)

**Then you're LIVE! 🔥**

---

Generated with Claude Code via Happy
