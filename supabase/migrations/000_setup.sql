-- ═══════════════════════════════════════════════════════════════════════════
--  PodcastMatch AI — Complete Database Setup (idempotent, run once)
--  Paste into: Supabase Studio → SQL Editor → New Query → Run
--  Safe to re-run at any time.
-- ═══════════════════════════════════════════════════════════════════════════

-- ── 1. profiles ─────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT        NOT NULL,
  full_name   TEXT,
  avatar_url  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles: own row only" ON public.profiles;
CREATE POLICY "profiles: own row only"
  ON public.profiles FOR ALL
  USING      (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ── 2. dna_assessments ──────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.dna_assessments (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  answers      JSONB       NOT NULL DEFAULT '{}',
  completed    BOOLEAN     NOT NULL DEFAULT false,
  completed_at TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id)
);

ALTER TABLE public.dna_assessments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "dna_assessments: own rows only" ON public.dna_assessments;
CREATE POLICY "dna_assessments: own rows only"
  ON public.dna_assessments FOR ALL
  USING      (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ── 3. creator_profiles ─────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.creator_profiles (
  id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  archetype           TEXT,
  category            TEXT,
  title               TEXT,
  brand_identity      JSONB       NOT NULL DEFAULT '{}',
  strengths           JSONB       NOT NULL DEFAULT '{}',
  audience_profile    JSONB       NOT NULL DEFAULT '{}',
  speaking_topics     TEXT[]      NOT NULL DEFAULT '{}',
  visibility_score    INTEGER     NOT NULL DEFAULT 0,
  ai_alignment_score  INTEGER     NOT NULL DEFAULT 0,
  raw_dna_data        JSONB       NOT NULL DEFAULT '{}',
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id)
);

ALTER TABLE public.creator_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "creator_profiles: own rows only" ON public.creator_profiles;
CREATE POLICY "creator_profiles: own rows only"
  ON public.creator_profiles FOR ALL
  USING      (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ── 4. saved_podcasts ───────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.saved_podcasts (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  podcast_id   TEXT        NOT NULL,
  podcast_data JSONB       NOT NULL DEFAULT '{}',
  saved_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, podcast_id)
);

ALTER TABLE public.saved_podcasts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "saved_podcasts: own rows only" ON public.saved_podcasts;
CREATE POLICY "saved_podcasts: own rows only"
  ON public.saved_podcasts FOR ALL
  USING      (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ── 5. match_history ────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.match_history (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  podcast_id  TEXT        NOT NULL,
  match_score INTEGER     NOT NULL DEFAULT 0,
  match_data  JSONB       NOT NULL DEFAULT '{}',
  viewed_at   TIMESTAMPTZ,
  saved       BOOLEAN     NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, podcast_id)
);

ALTER TABLE public.match_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "match_history: own rows only" ON public.match_history;
CREATE POLICY "match_history: own rows only"
  ON public.match_history FOR ALL
  USING      (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ── 6. user_settings ────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.user_settings (
  id                    UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  profile_settings      JSONB       NOT NULL DEFAULT '{}',
  notification_settings JSONB       NOT NULL DEFAULT '{}',
  creator_preferences   JSONB       NOT NULL DEFAULT '{}',
  account_settings      JSONB       NOT NULL DEFAULT '{}',
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id)
);

ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "user_settings: own rows only" ON public.user_settings;
CREATE POLICY "user_settings: own rows only"
  ON public.user_settings FOR ALL
  USING      (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ── 7. analytics_events ─────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.analytics_events (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  event       TEXT        NOT NULL,
  properties  JSONB       NOT NULL DEFAULT '{}',
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "analytics_events: select own" ON public.analytics_events;
DROP POLICY IF EXISTS "analytics_events: insert any" ON public.analytics_events;
CREATE POLICY "analytics_events: select own"
  ON public.analytics_events FOR SELECT
  USING (auth.uid() = user_id);
CREATE POLICY "analytics_events: insert any"
  ON public.analytics_events FOR INSERT
  WITH CHECK (true);

-- ── 8. subscriptions ────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.subscriptions (
  id                     UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id     TEXT,
  stripe_subscription_id TEXT,
  status                 TEXT        NOT NULL DEFAULT 'free',
  plan_id                TEXT        NOT NULL DEFAULT 'free',
  current_period_start   TIMESTAMPTZ,
  current_period_end     TIMESTAMPTZ,
  metadata               JSONB       NOT NULL DEFAULT '{}',
  created_at             TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at             TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id)
);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "subscriptions: select own" ON public.subscriptions;
CREATE POLICY "subscriptions: select own"
  ON public.subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- ── 9. beta_waitlist ────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.beta_waitlist (
  id        UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  email     TEXT        NOT NULL UNIQUE,
  name      TEXT,
  role      TEXT,
  invited   BOOLEAN     NOT NULL DEFAULT false,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.beta_waitlist ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "beta_waitlist: insert any" ON public.beta_waitlist;
CREATE POLICY "beta_waitlist: insert any"
  ON public.beta_waitlist FOR INSERT
  WITH CHECK (true);

-- ── 10. feedback ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.feedback (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  type       TEXT        NOT NULL,
  message    TEXT        NOT NULL,
  page       TEXT,
  metadata   JSONB       NOT NULL DEFAULT '{}',
  resolved   BOOLEAN     NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "feedback: insert any" ON public.feedback;
DROP POLICY IF EXISTS "feedback: select own" ON public.feedback;
CREATE POLICY "feedback: insert any"
  ON public.feedback FOR INSERT
  WITH CHECK (true);
CREATE POLICY "feedback: select own"
  ON public.feedback FOR SELECT
  USING (auth.uid() = user_id);

-- ── 11. Trigger: auto-create profile + settings on signup ───────────────────
--  EXCEPTION block ensures a trigger bug can never block user creation.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name'
  )
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.user_settings (user_id)
  VALUES (new.id)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN new;
EXCEPTION WHEN OTHERS THEN
  -- Log the error but never block signup
  RAISE WARNING 'handle_new_user failed for user %: %', new.id, SQLERRM;
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
