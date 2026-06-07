-- ═══════════════════════════════════════════════════════════════════════════
--  Migration 002: Analytics & Billing
--  Tables: analytics_events, subscriptions, beta_waitlist, feedback
--
--  Run in Supabase Dashboard → SQL Editor → New Query → Run
--  STATUS: Must be run before beta launch.
--  Depends on: 001_initial.sql (auth.users must exist)
-- ═══════════════════════════════════════════════════════════════════════════

-- ─── analytics_events ────────────────────────────────────────────────────────
-- user_id is nullable: anonymous events are tracked before login.

CREATE TABLE IF NOT EXISTS analytics_events (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  event       TEXT NOT NULL,
  properties  JSONB NOT NULL DEFAULT '{}',
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "analytics_select_own"
  ON analytics_events FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "analytics_insert_any"
  ON analytics_events FOR INSERT
  WITH CHECK (true);

-- ─── subscriptions (Stripe subscription sync) ────────────────────────────────

CREATE TABLE IF NOT EXISTS subscriptions (
  id                     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id     TEXT,
  stripe_subscription_id TEXT,
  status                 TEXT NOT NULL DEFAULT 'free',
  plan_id                TEXT NOT NULL DEFAULT 'free',
  current_period_start   TIMESTAMPTZ,
  current_period_end     TIMESTAMPTZ,
  metadata               JSONB NOT NULL DEFAULT '{}',
  created_at             TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at             TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id)
);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "subscriptions_select_own"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- Webhook route uses service role key which bypasses RLS — no additional
-- INSERT/UPDATE policy required for the Stripe webhook handler.

-- ─── beta_waitlist ───────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS beta_waitlist (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email     TEXT NOT NULL,
  name      TEXT,
  role      TEXT,
  invited   BOOLEAN NOT NULL DEFAULT false,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (email)
);

ALTER TABLE beta_waitlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "waitlist_insert_any"
  ON beta_waitlist FOR INSERT
  WITH CHECK (true);

-- ─── feedback ────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS feedback (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  type       TEXT NOT NULL,
  message    TEXT NOT NULL,
  page       TEXT,
  metadata   JSONB NOT NULL DEFAULT '{}',
  resolved   BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "feedback_insert_any"
  ON feedback FOR INSERT
  WITH CHECK (true);

CREATE POLICY "feedback_select_own"
  ON feedback FOR SELECT
  USING (auth.uid() = user_id);
