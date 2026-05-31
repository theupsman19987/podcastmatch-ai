-- ═══════════════════════════════════════════════════════════════════════════
--  PodcastMatch AI — Phase 7: Analytics, Billing & Beta Tables
--  Run AFTER 001_initial_schema.sql
-- ═══════════════════════════════════════════════════════════════════════════

-- ── 1. Analytics Events ──────────────────────────────────────────────────────
-- Lightweight in-app event log. No third-party required.

create table if not exists public.analytics_events (
  id          uuid        default gen_random_uuid() primary key,
  user_id     uuid        references auth.users on delete set null,
  event       text        not null,
  properties  jsonb       not null default '{}',
  occurred_at timestamptz not null default now()
);

-- Index for per-user queries and event-type aggregation
create index if not exists analytics_events_user_idx    on public.analytics_events (user_id);
create index if not exists analytics_events_event_idx   on public.analytics_events (event);
create index if not exists analytics_events_time_idx    on public.analytics_events (occurred_at desc);

-- RLS: users can read their own events; write is server-only (service role)
alter table public.analytics_events enable row level security;
create policy "analytics: read own events"
  on public.analytics_events for select
  using (auth.uid() = user_id);

-- ── 2. Subscriptions ─────────────────────────────────────────────────────────
-- Synced from Stripe webhooks. One row per user.

create table if not exists public.subscriptions (
  id                     uuid        default gen_random_uuid() primary key,
  user_id                uuid        references auth.users on delete cascade not null,
  stripe_customer_id     text        not null,
  stripe_subscription_id text        not null,
  status                 text        not null default 'inactive',   -- active | trialing | past_due | cancelled
  plan_id                text        not null default 'free',
  current_period_start   timestamptz,
  current_period_end     timestamptz,
  metadata               jsonb       not null default '{}',
  created_at             timestamptz default now() not null,
  updated_at             timestamptz default now() not null,
  unique (user_id)
);

alter table public.subscriptions enable row level security;
create policy "subscriptions: read own"
  on public.subscriptions for select
  using (auth.uid() = user_id);

-- ── 3. Beta Waitlist ─────────────────────────────────────────────────────────

create table if not exists public.beta_waitlist (
  id         uuid        default gen_random_uuid() primary key,
  email      text        not null unique,
  name       text,
  role       text,
  invited    boolean     not null default false,
  joined_at  timestamptz default now() not null
);

-- Public write-only (upsert via service role); no reads from client
alter table public.beta_waitlist enable row level security;
-- No select policy — only readable by admins via service role

-- ── 4. Feedback ──────────────────────────────────────────────────────────────

create table if not exists public.feedback (
  id         uuid        default gen_random_uuid() primary key,
  user_id    uuid        references auth.users on delete set null,
  type       text        not null default 'general',  -- bug | feature | general
  message    text        not null,
  page       text,
  metadata   jsonb       not null default '{}',
  resolved   boolean     not null default false,
  created_at timestamptz default now() not null
);

alter table public.feedback enable row level security;
create policy "feedback: read own"
  on public.feedback for select
  using (auth.uid() = user_id);
