-- ═══════════════════════════════════════════════════════════════════════════
--  PodcastMatch AI — Contact Intelligence Layer
--  Migration 003: podcasts table
--
--  Paste into: Supabase Studio → SQL Editor → New Query → Run
--  Safe to re-run (all statements are idempotent).
--
--  Design principle: this is a CURATED table managed by platform admins.
--  It is NOT user-generated. RLS allows public reads, no client writes.
--  All inserts/updates go through service role or SQL Editor.
--
--  contact_method_rank is a STORED GENERATED column — auto-computed from
--  which contact fields are populated. 1 = best, 7 = last resort.
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.podcasts (

  -- ── Identity ──────────────────────────────────────────────────────────────
  id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  slug                TEXT        NOT NULL UNIQUE,        -- e.g. "entrepreneurs-on-fire"

  -- ── Core metadata ─────────────────────────────────────────────────────────
  podcast_name        TEXT        NOT NULL,
  host_name           TEXT        NOT NULL,
  description         TEXT,
  artwork_url         TEXT,

  -- ── Taxonomy ──────────────────────────────────────────────────────────────
  category            TEXT        NOT NULL,               -- primary internal category
  categories          TEXT[]      NOT NULL DEFAULT '{}',  -- all internal categories

  -- ── Platform links ────────────────────────────────────────────────────────
  rss_feed_url        TEXT        UNIQUE,                 -- primary dedup key; NULL until parsed
  website             TEXT,
  apple_url           TEXT,
  spotify_url         TEXT,

  -- ── Content stats ─────────────────────────────────────────────────────────
  episode_count       INTEGER     NOT NULL DEFAULT 0,
  last_episode_date   DATE,
  language            TEXT        NOT NULL DEFAULT 'en',
  activity_status     TEXT        NOT NULL DEFAULT 'active'
                        CHECK (activity_status IN ('active','hiatus','inactive')),

  -- ── Contact Intelligence ───────────────────────────────────────────────────
  --   Fill these from: RSS itunes:owner, website research, Podchaser, etc.
  producer_name       TEXT,
  producer_email      TEXT,
  host_email          TEXT,
  booking_email       TEXT,
  contact_form_url    TEXT,
  booking_link        TEXT,

  -- ── Social ────────────────────────────────────────────────────────────────
  instagram_url       TEXT,
  linkedin_url        TEXT,
  youtube_url         TEXT,
  twitter_url         TEXT,

  -- ── Guest system ──────────────────────────────────────────────────────────
  accepts_guests      BOOLEAN     NOT NULL DEFAULT true,
  guest_requirements  TEXT,                               -- free text or bullets
  typical_guest_type  TEXT,                               -- e.g. "CEOs, founders, authors"

  -- ── Contact method rank (auto-computed, never set manually) ───────────────
  --   1 = producer_email  (most direct — producer books guests)
  --   2 = host_email
  --   3 = booking_email
  --   4 = contact_form_url
  --   5 = linkedin_url
  --   6 = instagram_url
  --   7 = no known contact (website only)
  contact_method_rank INTEGER GENERATED ALWAYS AS (
    CASE
      WHEN producer_email    IS NOT NULL THEN 1
      WHEN host_email        IS NOT NULL THEN 2
      WHEN booking_email     IS NOT NULL THEN 3
      WHEN contact_form_url  IS NOT NULL THEN 4
      WHEN linkedin_url      IS NOT NULL THEN 5
      WHEN instagram_url     IS NOT NULL THEN 6
      ELSE 7
    END
  ) STORED,

  -- ── RSS enrichment cache ───────────────────────────────────────────────────
  rss_owner_name      TEXT,                               -- from <itunes:owner><itunes:name>
  rss_owner_email     TEXT,                               -- from <itunes:owner><itunes:email>
  rss_parsed_at       TIMESTAMPTZ,

  -- ── Admin / quality ───────────────────────────────────────────────────────
  enrichment_status   TEXT        NOT NULL DEFAULT 'pending'
                        CHECK (enrichment_status IN ('pending','partial','complete')),
  quality_score       INTEGER     NOT NULL DEFAULT 50
                        CHECK (quality_score BETWEEN 0 AND 100),
  curated             BOOLEAN     NOT NULL DEFAULT false, -- true = manually verified
  notes               TEXT,                               -- internal admin notes

  -- ── Timestamps ────────────────────────────────────────────────────────────
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── Row Level Security ──────────────────────────────────────────────────────

ALTER TABLE public.podcasts ENABLE ROW LEVEL SECURITY;

-- Anyone (anon or authenticated) can read — this is public discovery data
DROP POLICY IF EXISTS "podcasts: public read" ON public.podcasts;
CREATE POLICY "podcasts: public read"
  ON public.podcasts FOR SELECT
  USING (true);

-- No INSERT/UPDATE/DELETE policies → only service role can mutate.
-- Use Supabase SQL Editor or seed scripts to add/update records.

-- ── Indexes ────────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS podcasts_category_idx         ON public.podcasts (category);
CREATE INDEX IF NOT EXISTS podcasts_activity_status_idx  ON public.podcasts (activity_status);
CREATE INDEX IF NOT EXISTS podcasts_accepts_guests_idx   ON public.podcasts (accepts_guests);
CREATE INDEX IF NOT EXISTS podcasts_contact_rank_idx     ON public.podcasts (contact_method_rank);
CREATE INDEX IF NOT EXISTS podcasts_quality_score_idx    ON public.podcasts (quality_score DESC);
CREATE INDEX IF NOT EXISTS podcasts_categories_gin_idx   ON public.podcasts USING gin(categories);

-- Full-text search on name + host + description
CREATE INDEX IF NOT EXISTS podcasts_fts_idx ON public.podcasts
  USING gin(to_tsvector('english',
    coalesce(podcast_name,'') || ' ' ||
    coalesce(host_name,'')    || ' ' ||
    coalesce(description,'')
  ));
