# PodcastMatch AI — Beta Launch Checklist

Complete all items below before opening beta access.

---

## 1. Supabase Database Migrations

### Migration 001 — Initial Schema
**File:** `supabase/migrations/001_initial.sql`
**Status:** Run once before any users sign up.

**Steps:**
1. Go to [Supabase Dashboard](https://supabase.com/dashboard) → your project → SQL Editor
2. Click **New Query**
3. Paste the contents of `supabase/migrations/001_initial.sql`
4. Click **Run**

**Creates:** `profiles`, `dna_assessments`, `creator_profiles`, `saved_podcasts`, `match_history`, `user_settings`
**Also installs:** `handle_new_user()` trigger — auto-creates `profiles` + `user_settings` rows on every new signup.

---

### Migration 002 — Analytics & Billing
**File:** `supabase/migrations/002_analytics_billing.sql`
**Status:** Must be run before beta launch.

**Steps:**
1. Go to Supabase Dashboard → SQL Editor → New Query
2. Paste the contents of `supabase/migrations/002_analytics_billing.sql`
3. Click **Run**

**Creates:** `analytics_events`, `subscriptions`, `beta_waitlist`, `feedback`

---

## 2. Coolify Environment Variables

**Location:** Coolify → App `pxje85zuexv9vj98u3yni3mp` → Environment Variables tab

| Variable | Required | Source |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Supabase Dashboard → Project Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Supabase Dashboard → Project Settings → API → anon public key |
| `STRIPE_SECRET_KEY` | ✅ | Stripe Dashboard → Developers → API Keys → Secret key |
| `STRIPE_WEBHOOK_SECRET` | ✅ | Stripe Dashboard → Webhooks → your endpoint → Signing secret |
| `STRIPE_PRICE_CREATOR_PRO` | ✅ | Stripe Dashboard → Product catalog → Creator Pro → price ID (starts with `price_`) |
| `STRIPE_PRICE_VISIBILITY_PRO` | ✅ | Stripe Dashboard → Product catalog → Visibility Pro → price ID |
| `PODCAST_INDEX_API_KEY` | ⚠️ Optional | [podcastindex.org/signup](https://podcastindex.org/signup) — falls back to mock data if absent |
| `PODCAST_INDEX_API_SECRET` | ⚠️ Optional | same as above |
| `NEXT_PUBLIC_APP_URL` | ✅ | `https://podmatch.ai` |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Optional | Google Search Console |

**After saving variables, trigger a redeploy:**
```
GET http://72.62.168.96:8000/api/v1/deploy?uuid=pxje85zuexv9vj98u3yni3mp&force=false
Authorization: Bearer <token — see reference_coolify.md>
```

---

## 3. Stripe Webhook Setup

**Why:** The webhook keeps the `subscriptions` table in sync when users pay, upgrade, or cancel. Without it, the billing UI shows the wrong plan.

**Steps:**
1. Go to [Stripe Dashboard](https://dashboard.stripe.com) → Developers → Webhooks
2. Click **+ Add endpoint**
3. Set **Endpoint URL:** `https://podmatch.ai/api/stripe/webhook`
4. Under **Events to listen to**, select:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Click **Add endpoint**
6. On the endpoint detail page, click **Reveal** under **Signing secret**
7. Copy the value (starts with `whsec_`) → paste into `STRIPE_WEBHOOK_SECRET` in Coolify

**Local testing (Stripe CLI):**
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

**Webhook handler:** `app/api/stripe/webhook/route.ts`
Handles: `checkout.session.completed` → upserts subscription row, `customer.subscription.updated` → syncs status + period dates, `customer.subscription.deleted` → marks cancelled.

---

## 4. Supabase Auth Redirect URLs

**Why:** Password reset emails and OAuth callbacks redirect through `/auth/callback`. Supabase blocks the redirect if the URL is not in its allowlist, causing users to hit a 404 or error after clicking the reset link.

**Steps:**
1. Go to Supabase Dashboard → Authentication → URL Configuration
2. Under **Site URL**, set: `https://podmatch.ai`
3. Under **Redirect URLs**, add all of the following:
   ```
   https://podmatch.ai/auth/callback
   http://localhost:3000/auth/callback
   ```
4. Click **Save**

**Auth routes in use:**
- `/auth/callback` — exchanges code for session, redirects to `/dashboard` or `?next=` param
- `/update-password` — password reset destination (reached via `?next=/update-password` in the reset email link)
- `/forgot-password` — sends reset email with redirect to `/auth/callback?next=/update-password`

---

## Summary

| # | Item | Owner | Status |
|---|---|---|---|
| 1 | Run migration 001 in Supabase | Dev/Ops | ☐ |
| 2 | Run migration 002 in Supabase | Dev/Ops | ☐ |
| 3 | Set all Coolify environment variables | Dev/Ops | ☐ |
| 4 | Create Stripe products + copy price IDs to Coolify | Dev/Ops | ☐ |
| 5 | Create Stripe webhook endpoint for `podmatch.ai` | Dev/Ops | ☐ |
| 6 | Copy Stripe webhook signing secret to Coolify | Dev/Ops | ☐ |
| 7 | Set Supabase Site URL to `https://podmatch.ai` | Dev/Ops | ☐ |
| 8 | Add redirect URL `https://podmatch.ai/auth/callback` to Supabase | Dev/Ops | ☐ |
| 9 | Trigger Coolify redeploy after env vars are set | Dev/Ops | ☐ |
| 10 | Smoke test signup → DNA → dashboard → billing on production | QA | ☐ |
