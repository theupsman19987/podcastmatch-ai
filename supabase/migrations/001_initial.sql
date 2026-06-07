-- ═══════════════════════════════════════════════════════════════════════════
--  Migration 001: Initial Schema
--  Tables: profiles, dna_assessments, creator_profiles,
--          saved_podcasts, match_history, user_settings
--
--  Run in Supabase Dashboard → SQL Editor → New Query → Run
--  STATUS: Must be run before any users sign up.
-- ═══════════════════════════════════════════════════════════════════════════

-- ─── profiles (id mirrors auth.users.id) ─────────────────────────────────────

CREATE TABLE IF NOT EXISTS profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT NOT NULL,
  full_name   TEXT,
  avatar_url  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select_own"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "profiles_update_own"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "profiles_insert_own"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ─── dna_assessments ─────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS dna_assessments (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  answers      JSONB NOT NULL DEFAULT '{}',
  completed    BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id)
);

ALTER TABLE dna_assessments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "dna_all_own"
  ON dna_assessments FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ─── creator_profiles ────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS creator_profiles (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id            UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  archetype          TEXT,
  category           TEXT,
  title              TEXT,
  brand_identity     JSONB NOT NULL DEFAULT '{}',
  strengths          JSONB NOT NULL DEFAULT '{}',
  audience_profile   JSONB NOT NULL DEFAULT '{}',
  speaking_topics    TEXT[] NOT NULL DEFAULT '{}',
  visibility_score   INTEGER NOT NULL DEFAULT 0,
  ai_alignment_score INTEGER NOT NULL DEFAULT 0,
  raw_dna_data       JSONB NOT NULL DEFAULT '{}',
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id)
);

ALTER TABLE creator_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "creator_profiles_all_own"
  ON creator_profiles FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ─── saved_podcasts ──────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS saved_podcasts (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  podcast_id   TEXT NOT NULL,
  podcast_data JSONB NOT NULL DEFAULT '{}',
  saved_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, podcast_id)
);

ALTER TABLE saved_podcasts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "saved_podcasts_all_own"
  ON saved_podcasts FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ─── match_history ───────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS match_history (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  podcast_id  TEXT NOT NULL,
  match_score INTEGER NOT NULL,
  match_data  JSONB NOT NULL DEFAULT '{}',
  viewed_at   TIMESTAMPTZ,
  saved       BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE match_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "match_history_select_own"
  ON match_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "match_history_insert_own"
  ON match_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "match_history_update_own"
  ON match_history FOR UPDATE
  USING (auth.uid() = user_id);

-- ─── user_settings ───────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS user_settings (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  profile_settings      JSONB NOT NULL DEFAULT '{}',
  notification_settings JSONB NOT NULL DEFAULT '{}',
  creator_preferences   JSONB NOT NULL DEFAULT '{}',
  account_settings      JSONB NOT NULL DEFAULT '{}',
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id)
);

ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_settings_all_own"
  ON user_settings FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ─── Auto-create profile + settings on new user ──────────────────────────────

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name)
    VALUES (
      new.id,
      new.email,
      new.raw_user_meta_data->>'full_name'
    )
    ON CONFLICT (id) DO NOTHING;

  INSERT INTO user_settings (user_id)
    VALUES (new.id)
    ON CONFLICT (user_id) DO NOTHING;

  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
