@AGENTS.md

# PodcastMatch AI — Project Intelligence

## Stack
Next.js 16 · Tailwind v4 · TypeScript · Supabase (self-hosted on Coolify) · Stripe (post-beta) · Framer Motion (`motion/react`) · shadcn/ui

## Git — always push both branches
```
git push origin master && git push origin master:main
```

---

## Supabase — Schema Reference

All tables have RLS enabled. Always use server client for mutations.

| Table | Key columns |
|---|---|
| `profiles` | id, email, full_name, avatar_url |
| `dna_assessments` | user_id, answers (Json), completed, completed_at |
| `creator_profiles` | user_id, archetype, category, title, brand_identity (Json), strengths (Json), audience_profile (Json), speaking_topics (string[]), visibility_score, ai_alignment_score |
| `saved_podcasts` | user_id, podcast_id, podcast_data (Json) |
| `match_history` | user_id, podcast_id, score, status |
| `user_settings` | user_id, profile_settings (Json) |
| `analytics_events` | user_id, event_name, properties (Json) |
| `subscriptions` | user_id, stripe_customer_id, status, plan_id, current_period_end |
| `beta_waitlist` | email, name, created_at |
| `feedback` | user_id, message, rating, page |

### Supabase patterns
- Browser client: `createBrowserClient<Database>()` from `@/lib/supabase/client`
- Server client: `createServerClient<Database>()` from `@/lib/supabase/server`
- Every table type needs `Relationships: []` or TypeScript gives `never` errors
- Cast Json: `JSON.parse(JSON.stringify(value)) as Json`
- All server actions need `"use server"` at top of file

---

## Security — apply to every edit

Before finishing any code change, verify:
- [ ] No secrets or API keys hardcoded — use `process.env.*`
- [ ] User input is never passed raw to a database query
- [ ] Auth-protected routes check session before returning data
- [ ] `NEXT_PUBLIC_*` vars contain nothing sensitive (they ship to the browser)
- [ ] Supabase queries use RLS — never bypass with service role key in client code
- [ ] No `dangerouslySetInnerHTML` with user-controlled content
- [ ] File uploads (if added): validate type and size server-side

---

## TypeScript — known constraints

- `motion/react` `useInView` does NOT accept `margin` — use `{ once: true }` only
- `lucide-react` installed version lacks Instagram, Linkedin, Youtube — use Camera, Briefcase, Film
- Next.js 16 params are a Promise: `const { id } = await params`
- Stripe API version: `"2026-05-27.dahlia"`
- `Json` type cast: `JSON.parse(JSON.stringify(value)) as Json`
- `"use server"` required at top of every server action file
- ConditionalShell hides navbar/footer on: `/login`, `/signup`, `/dashboard/*`, `/onboarding/*`

---

## shadcn/ui — installed components

button · card · badge · input · select · checkbox · accordion · dialog · drawer · sheet · sidebar · navigation-menu · breadcrumb · pagination · tabs · command · popover · tooltip · skeleton · progress · separator · scroll-area · label · form · radio-group · switch · toggle-group · sonner · table · calendar · slider · avatar

Custom UI: shimmer-button · number-ticker · marquee · workflow-card · beam-connector · stat-card · ai-score-badge · ai-insight-panel · podcast-result-card · featured-podcast-card · testimonial-card · pricing-card · conversion-banner

Design tokens: `--premium-cyan` · `--premium-gold` · `gradient-primary` · `gradient-text-primary` · `gradient-text-cyan` · `gradient-text-gold` · `glass` · `glow-primary` · `glow-cyan-lg` · `glow-gold` · `text-hero` · `text-label`

---

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_APP_URL
STRIPE_SECRET_KEY          # post-beta
STRIPE_WEBHOOK_SECRET      # post-beta
STRIPE_PRICE_CREATOR_PRO   # post-beta
STRIPE_PRICE_VISIBILITY_PRO # post-beta
PODCAST_INDEX_API_KEY
PODCAST_INDEX_API_SECRET
```

---

## What is real vs mock

**Real (Supabase-backed):** auth · DNA assessment · creator profile · saved podcasts · profile settings · beta waitlist · feedback widget · Stripe checkout (post-beta)

**Still mock:** dashboard home stats · profile settings pre-fill · analytics charts · outreach pipeline · notifications · AI matching (heuristic only)
