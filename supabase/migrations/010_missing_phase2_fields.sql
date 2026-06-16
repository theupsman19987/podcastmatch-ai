-- ═══════════════════════════════════════════════════════════════════════════
--  PodcastMatch AI — Phase 2: Missing Fields
--  Migration 010: subcategory, primary_email, audience_alignment_score,
--                 match_quality_score
--
--  Run AFTER migrations 007, 008, 009.
-- ═══════════════════════════════════════════════════════════════════════════

-- Basic Information
ALTER TABLE public.podcasts ADD COLUMN IF NOT EXISTS subcategory TEXT;

-- Contact Information
ALTER TABLE public.podcasts ADD COLUMN IF NOT EXISTS primary_email TEXT;

-- Matching Intelligence Scores
ALTER TABLE public.podcasts ADD COLUMN IF NOT EXISTS audience_alignment_score INTEGER NOT NULL DEFAULT 0
  CHECK (audience_alignment_score BETWEEN 0 AND 100);

ALTER TABLE public.podcasts ADD COLUMN IF NOT EXISTS match_quality_score INTEGER NOT NULL DEFAULT 0
  CHECK (match_quality_score BETWEEN 0 AND 100);

-- Indexes
CREATE INDEX IF NOT EXISTS podcasts_subcategory_idx             ON public.podcasts (subcategory);
CREATE INDEX IF NOT EXISTS podcasts_audience_alignment_idx      ON public.podcasts (audience_alignment_score DESC);
CREATE INDEX IF NOT EXISTS podcasts_match_quality_idx           ON public.podcasts (match_quality_score DESC);


-- ── Update scoring engine to include match_quality_score ──────────────────
-- match_quality_score = composite of all 4 stored scores (equal weight).
-- audience_alignment_score starts at 0 and is updated when a creator profile
-- is matched — it is user-context-dependent and set externally.

CREATE OR REPLACE FUNCTION compute_podcast_intelligence_scores(p_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  r                  RECORD;
  v_authority        INTEGER := 0;
  v_friendliness     INTEGER := 0;
  v_visibility       INTEGER := 0;
  v_response         INTEGER := 0;
  v_match_quality    INTEGER := 0;
  v_contact_rank     INTEGER;
BEGIN
  SELECT * INTO r FROM public.podcasts WHERE id = p_id;
  IF NOT FOUND THEN RETURN; END IF;

  -- ── Authority Score (0–100) ───────────────────────────────────────────
  v_authority := LEAST(30, COALESCE(r.episode_count, 0) / 10);
  v_authority := v_authority + CASE r.activity_status
    WHEN 'active'   THEN 30
    WHEN 'hiatus'   THEN 10
    WHEN 'inactive' THEN  0
    ELSE 0
  END;
  IF r.last_episode_date IS NOT NULL THEN
    v_authority := v_authority + CASE
      WHEN r.last_episode_date >= CURRENT_DATE - INTERVAL '30  days' THEN 20
      WHEN r.last_episode_date >= CURRENT_DATE - INTERVAL '90  days' THEN 15
      WHEN r.last_episode_date >= CURRENT_DATE - INTERVAL '180 days' THEN 10
      WHEN r.last_episode_date >= CURRENT_DATE - INTERVAL '365 days' THEN  5
      ELSE 0
    END;
  END IF;
  IF r.curated THEN v_authority := v_authority + 15; END IF;
  IF COALESCE(r.quality_score, 0) >= 80 THEN v_authority := v_authority + 5; END IF;
  v_authority := LEAST(100, GREATEST(0, v_authority));

  -- ── Guest Friendliness Score (0–100) ──────────────────────────────────
  IF NOT COALESCE(r.accepts_guests, true) THEN
    v_friendliness := 0;
  ELSE
    v_friendliness := 40;
    IF NOT COALESCE(r.guest_application_required, false) THEN v_friendliness := v_friendliness + 15; END IF;
    IF r.contact_form_url IS NOT NULL OR r.booking_link IS NOT NULL THEN
      v_friendliness := v_friendliness + 20;
    ELSIF r.booking_email IS NOT NULL OR r.producer_email IS NOT NULL THEN
      v_friendliness := v_friendliness + 12;
    ELSIF r.host_email IS NOT NULL THEN
      v_friendliness := v_friendliness + 8;
    END IF;
    v_friendliness := v_friendliness + CASE r.avg_guest_frequency
      WHEN 'every_episode' THEN 15
      WHEN 'weekly'        THEN 12
      WHEN 'biweekly'      THEN  9
      WHEN 'monthly'       THEN  6
      WHEN 'occasional'    THEN  3
      WHEN 'rarely'        THEN  1
      ELSE 0
    END;
    IF COALESCE(r.remote_interviews, true) THEN v_friendliness := v_friendliness + 10; END IF;
  END IF;
  v_friendliness := LEAST(100, GREATEST(0, v_friendliness));

  -- ── Visibility Score (0–100) ──────────────────────────────────────────
  v_visibility := CASE
    WHEN COALESCE(r.episode_count, 0) >= 500 THEN 30
    WHEN COALESCE(r.episode_count, 0) >= 200 THEN 25
    WHEN COALESCE(r.episode_count, 0) >= 100 THEN 20
    WHEN COALESCE(r.episode_count, 0) >= 50  THEN 15
    WHEN COALESCE(r.episode_count, 0) >= 20  THEN 10
    WHEN COALESCE(r.episode_count, 0) >= 5   THEN  5
    ELSE 0
  END;
  IF r.youtube_url   IS NOT NULL THEN v_visibility := v_visibility + 10; END IF;
  IF r.linkedin_url  IS NOT NULL THEN v_visibility := v_visibility +  8; END IF;
  IF r.instagram_url IS NOT NULL THEN v_visibility := v_visibility +  7; END IF;
  IF r.twitter_url   IS NOT NULL THEN v_visibility := v_visibility +  5; END IF;
  IF r.apple_url     IS NOT NULL THEN v_visibility := v_visibility + 10; END IF;
  IF r.spotify_url   IS NOT NULL THEN v_visibility := v_visibility + 10; END IF;
  IF r.website       IS NOT NULL THEN v_visibility := v_visibility + 10; END IF;
  IF r.activity_status = 'active' THEN v_visibility := v_visibility + 10; END IF;
  v_visibility := LEAST(100, GREATEST(0, v_visibility));

  -- ── Response Probability Score (0–100) ────────────────────────────────
  v_contact_rank := CASE
    WHEN r.contact_form_url IS NOT NULL OR r.booking_link IS NOT NULL THEN 1
    WHEN r.producer_email   IS NOT NULL THEN 2
    WHEN r.booking_email    IS NOT NULL THEN 3
    WHEN r.host_email       IS NOT NULL THEN 4
    WHEN r.linkedin_url     IS NOT NULL THEN 5
    WHEN r.instagram_url    IS NOT NULL THEN 6
    ELSE 7
  END;
  v_response := CASE v_contact_rank
    WHEN 1 THEN 75
    WHEN 2 THEN 65
    WHEN 3 THEN 60
    WHEN 4 THEN 50
    WHEN 5 THEN 30
    WHEN 6 THEN 20
    ELSE        5
  END;
  IF COALESCE(r.outreach_ready, false) THEN v_response := v_response + 10; END IF;
  v_response := v_response + CASE r.contact_confidence
    WHEN 'high'   THEN 8
    WHEN 'medium' THEN 4
    ELSE 0
  END;
  IF COALESCE(r.abandoned_flag, false)  THEN v_response := v_response - 30; END IF;
  IF r.activity_status = 'inactive'     THEN v_response := v_response - 20; END IF;
  IF r.activity_status = 'hiatus'       THEN v_response := v_response - 10; END IF;
  IF COALESCE(r.is_duplicate, false)    THEN v_response := 0;               END IF;
  v_response := LEAST(100, GREATEST(0, v_response));

  -- ── Match Quality Score (0–100) ───────────────────────────────────────
  -- Composite of all 4 podcast-level scores (equal weight 25% each).
  -- audience_alignment_score is excluded here — it is creator-context-specific
  -- and updated separately when matching runs.
  v_match_quality := (v_authority + v_friendliness + v_visibility + v_response) / 4;
  v_match_quality := LEAST(100, GREATEST(0, v_match_quality));

  -- ── Write scores ──────────────────────────────────────────────────────
  UPDATE public.podcasts SET
    authority_score            = v_authority,
    guest_friendliness_score   = v_friendliness,
    visibility_score           = v_visibility,
    response_probability_score = v_response,
    match_quality_score        = v_match_quality
  WHERE id = p_id;

END;
$$;

-- Re-score all existing rows with the updated function
SELECT refresh_all_podcast_scores();
