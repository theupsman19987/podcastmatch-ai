-- ═══════════════════════════════════════════════════════════════════════════
--  PodcastMatch AI — Phase 2: Podcast Intelligence Schema
--  Migration 007: Expand podcasts table into a structured intelligence database
--
--  Adds: audience intelligence, guest intelligence, contact confidence,
--        matching score columns, and data quality flags.
--
--  Safe to re-run (all ADD COLUMN IF NOT EXISTS).
--  Run AFTER migrations 003 and 004.
-- ═══════════════════════════════════════════════════════════════════════════

-- ── Basic Information Additions ────────────────────────────────────────────

ALTER TABLE public.podcasts ADD COLUMN IF NOT EXISTS co_host_name TEXT;

ALTER TABLE public.podcasts ADD COLUMN IF NOT EXISTS publishing_frequency TEXT
  CHECK (publishing_frequency IN ('daily','multiple_weekly','weekly','biweekly','monthly','irregular'));

-- ── Contact Intelligence Additions ────────────────────────────────────────

-- Manual override: admin can pin a preferred method regardless of rank
ALTER TABLE public.podcasts ADD COLUMN IF NOT EXISTS preferred_contact_method TEXT
  CHECK (preferred_contact_method IN ('booking_form','producer_email','booking_email','host_email','linkedin','instagram','none'));

-- How confident are we that this contact info is correct?
ALTER TABLE public.podcasts ADD COLUMN IF NOT EXISTS contact_confidence TEXT NOT NULL DEFAULT 'low'
  CHECK (contact_confidence IN ('low','medium','high'));

-- When was the contact info last manually verified?
ALTER TABLE public.podcasts ADD COLUMN IF NOT EXISTS contact_verified_at TIMESTAMPTZ;

-- Admin marks a podcast as ready for outreach (all required fields verified)
ALTER TABLE public.podcasts ADD COLUMN IF NOT EXISTS outreach_ready BOOLEAN NOT NULL DEFAULT false;

-- Internal notes on contact approach (e.g. "pitch Kelly the producer directly")
ALTER TABLE public.podcasts ADD COLUMN IF NOT EXISTS contact_notes TEXT;

-- ── Audience Intelligence ─────────────────────────────────────────────────

-- Free text description of the primary audience
ALTER TABLE public.podcasts ADD COLUMN IF NOT EXISTS target_audience TEXT;

-- Array of pain points the audience faces (used for alignment scoring)
ALTER TABLE public.podcasts ADD COLUMN IF NOT EXISTS audience_pain_points TEXT[] NOT NULL DEFAULT '{}';

-- Array of audience goals/aspirations
ALTER TABLE public.podcasts ADD COLUMN IF NOT EXISTS audience_goals TEXT[] NOT NULL DEFAULT '{}';

-- Industry sectors the podcast serves
ALTER TABLE public.podcasts ADD COLUMN IF NOT EXISTS industry_focus TEXT[] NOT NULL DEFAULT '{}';

-- What experience level is the audience?
ALTER TABLE public.podcasts ADD COLUMN IF NOT EXISTS experience_level TEXT
  CHECK (experience_level IN ('beginner','intermediate','advanced','expert','all'));

-- Primary geographic market (e.g. "US","Global","UK","Australia")
ALTER TABLE public.podcasts ADD COLUMN IF NOT EXISTS geographic_focus TEXT;

-- Boolean flags for fast audience filtering
ALTER TABLE public.podcasts ADD COLUMN IF NOT EXISTS faith_based             BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE public.podcasts ADD COLUMN IF NOT EXISTS business_focused        BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE public.podcasts ADD COLUMN IF NOT EXISTS personal_development    BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE public.podcasts ADD COLUMN IF NOT EXISTS leadership_focused      BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE public.podcasts ADD COLUMN IF NOT EXISTS entrepreneurship_focused BOOLEAN NOT NULL DEFAULT false;

-- ── Guest Intelligence ────────────────────────────────────────────────────

-- Does the podcast require a formal application to be a guest?
ALTER TABLE public.podcasts ADD COLUMN IF NOT EXISTS guest_application_required BOOLEAN NOT NULL DEFAULT false;

-- Topics/skills the podcast is actively looking for in guests
ALTER TABLE public.podcasts ADD COLUMN IF NOT EXISTS guest_expertise_areas TEXT[] NOT NULL DEFAULT '{}';

-- What level of guest does the podcast prefer?
ALTER TABLE public.podcasts ADD COLUMN IF NOT EXISTS guest_experience_level TEXT
  CHECK (guest_experience_level IN ('emerging','established','expert','any'));

-- Interview format flags
ALTER TABLE public.podcasts ADD COLUMN IF NOT EXISTS remote_interviews  BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE public.podcasts ADD COLUMN IF NOT EXISTS video_interviews   BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE public.podcasts ADD COLUMN IF NOT EXISTS audio_only         BOOLEAN NOT NULL DEFAULT false;

-- Typical interview duration in minutes
ALTER TABLE public.podcasts ADD COLUMN IF NOT EXISTS interview_length_min INTEGER;

-- How often does the podcast feature guests?
ALTER TABLE public.podcasts ADD COLUMN IF NOT EXISTS avg_guest_frequency TEXT
  CHECK (avg_guest_frequency IN ('every_episode','weekly','biweekly','monthly','occasional','rarely'));

-- ── Matching Intelligence Scores ──────────────────────────────────────────
-- Computed by the scoring engine (migration 008).
-- Stored here for fast filtering and sorting — no AI needed.

-- How established/credible is this podcast? (episode volume + recency + curation)
ALTER TABLE public.podcasts ADD COLUMN IF NOT EXISTS authority_score INTEGER NOT NULL DEFAULT 0
  CHECK (authority_score BETWEEN 0 AND 100);

-- How open and accessible is this podcast to guests?
ALTER TABLE public.podcasts ADD COLUMN IF NOT EXISTS guest_friendliness_score INTEGER NOT NULL DEFAULT 0
  CHECK (guest_friendliness_score BETWEEN 0 AND 100);

-- How visible/discoverable is this podcast across platforms?
ALTER TABLE public.podcasts ADD COLUMN IF NOT EXISTS visibility_score INTEGER NOT NULL DEFAULT 0
  CHECK (visibility_score BETWEEN 0 AND 100);

-- Based on contact rank + confidence + outreach readiness, how likely is a response?
ALTER TABLE public.podcasts ADD COLUMN IF NOT EXISTS response_probability_score INTEGER NOT NULL DEFAULT 0
  CHECK (response_probability_score BETWEEN 0 AND 100);

-- ── Data Quality & Cleanup Flags ──────────────────────────────────────────

-- If this record is a duplicate, point to the one we're keeping
ALTER TABLE public.podcasts ADD COLUMN IF NOT EXISTS duplicate_of UUID REFERENCES public.podcasts(id);
ALTER TABLE public.podcasts ADD COLUMN IF NOT EXISTS is_duplicate BOOLEAN NOT NULL DEFAULT false;

-- Has the podcast website been confirmed live?
ALTER TABLE public.podcasts ADD COLUMN IF NOT EXISTS website_verified     BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE public.podcasts ADD COLUMN IF NOT EXISTS website_verified_at  TIMESTAMPTZ;

-- Has active publishing been confirmed (episode within last 90 days)?
ALTER TABLE public.podcasts ADD COLUMN IF NOT EXISTS publishing_verified  BOOLEAN NOT NULL DEFAULT false;

-- When was this record last reviewed by an admin?
ALTER TABLE public.podcasts ADD COLUMN IF NOT EXISTS last_verified_at     TIMESTAMPTZ;

-- True if podcast shows no activity for > 12 months
ALTER TABLE public.podcasts ADD COLUMN IF NOT EXISTS abandoned_flag       BOOLEAN NOT NULL DEFAULT false;

-- Have the categories been normalized to our internal taxonomy?
ALTER TABLE public.podcasts ADD COLUMN IF NOT EXISTS category_standardized BOOLEAN NOT NULL DEFAULT false;

-- ── New Indexes ───────────────────────────────────────────────────────────

-- Score indexes for sorting/filtering by intelligence scores
CREATE INDEX IF NOT EXISTS podcasts_authority_score_idx          ON public.podcasts (authority_score DESC);
CREATE INDEX IF NOT EXISTS podcasts_guest_friendliness_score_idx ON public.podcasts (guest_friendliness_score DESC);
CREATE INDEX IF NOT EXISTS podcasts_visibility_score_idx         ON public.podcasts (visibility_score DESC);
CREATE INDEX IF NOT EXISTS podcasts_response_probability_idx     ON public.podcasts (response_probability_score DESC);

-- Boolean audience filters
CREATE INDEX IF NOT EXISTS podcasts_faith_based_idx             ON public.podcasts (faith_based) WHERE faith_based = true;
CREATE INDEX IF NOT EXISTS podcasts_business_idx                ON public.podcasts (business_focused) WHERE business_focused = true;
CREATE INDEX IF NOT EXISTS podcasts_personal_dev_idx            ON public.podcasts (personal_development) WHERE personal_development = true;
CREATE INDEX IF NOT EXISTS podcasts_leadership_idx              ON public.podcasts (leadership_focused) WHERE leadership_focused = true;
CREATE INDEX IF NOT EXISTS podcasts_entrepreneurship_idx        ON public.podcasts (entrepreneurship_focused) WHERE entrepreneurship_focused = true;

-- Guest intelligence
CREATE INDEX IF NOT EXISTS podcasts_accepts_guests_idx          ON public.podcasts (accepts_guests) WHERE accepts_guests = true;
CREATE INDEX IF NOT EXISTS podcasts_outreach_ready_idx          ON public.podcasts (outreach_ready) WHERE outreach_ready = true;
CREATE INDEX IF NOT EXISTS podcasts_abandoned_idx               ON public.podcasts (abandoned_flag) WHERE abandoned_flag = true;
CREATE INDEX IF NOT EXISTS podcasts_is_duplicate_idx            ON public.podcasts (is_duplicate) WHERE is_duplicate = true;

-- GIN indexes for array filtering
CREATE INDEX IF NOT EXISTS podcasts_industry_focus_gin_idx      ON public.podcasts USING gin(industry_focus);
CREATE INDEX IF NOT EXISTS podcasts_guest_expertise_gin_idx     ON public.podcasts USING gin(guest_expertise_areas);
CREATE INDEX IF NOT EXISTS podcasts_audience_goals_gin_idx      ON public.podcasts USING gin(audience_goals);
CREATE INDEX IF NOT EXISTS podcasts_audience_pain_gin_idx       ON public.podcasts USING gin(audience_pain_points);
