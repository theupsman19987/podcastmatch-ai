-- ═══════════════════════════════════════════════════════════════════════════
--  PodcastMatch AI — Phase 2: Intelligence Scoring Engine
--  Migration 008: Modular scoring framework
--
--  Computes 4 stored scores on every INSERT/UPDATE:
--    authority_score            — credibility & longevity
--    guest_friendliness_score   — how open the podcast is to guests
--    visibility_score           — cross-platform reach
--    response_probability_score — likelihood of getting a reply
--
--  Scores are modular — adjust the weights in this function without touching
--  the schema. Each score is 0–100. No AI required.
--
--  Run AFTER migration 007.
-- ═══════════════════════════════════════════════════════════════════════════

-- ── Core scoring function ─────────────────────────────────────────────────

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
  v_contact_rank     INTEGER;
BEGIN
  SELECT * INTO r FROM public.podcasts WHERE id = p_id;
  IF NOT FOUND THEN RETURN; END IF;

  -- ── Authority Score (0–100) ───────────────────────────────────────────
  -- Signals: episode volume, active status, recency, curation quality

  -- Episode volume (max 30 pts)
  v_authority := LEAST(30, COALESCE(r.episode_count, 0) / 10);

  -- Activity status (max 30 pts)
  v_authority := v_authority + CASE r.activity_status
    WHEN 'active'   THEN 30
    WHEN 'hiatus'   THEN 10
    WHEN 'inactive' THEN  0
    ELSE 0
  END;

  -- Recency of last episode (max 20 pts)
  IF r.last_episode_date IS NOT NULL THEN
    v_authority := v_authority + CASE
      WHEN r.last_episode_date >= CURRENT_DATE - INTERVAL '30  days' THEN 20
      WHEN r.last_episode_date >= CURRENT_DATE - INTERVAL '90  days' THEN 15
      WHEN r.last_episode_date >= CURRENT_DATE - INTERVAL '180 days' THEN 10
      WHEN r.last_episode_date >= CURRENT_DATE - INTERVAL '365 days' THEN  5
      ELSE 0
    END;
  END IF;

  -- Curation & quality (max 20 pts)
  IF r.curated THEN v_authority := v_authority + 15; END IF;
  IF COALESCE(r.quality_score, 0) >= 80 THEN v_authority := v_authority + 5; END IF;

  v_authority := LEAST(100, GREATEST(0, v_authority));

  -- ── Guest Friendliness Score (0–100) ──────────────────────────────────
  -- Hard gate: if podcast doesn't accept guests, score is 0

  IF NOT COALESCE(r.accepts_guests, true) THEN
    v_friendliness := 0;
  ELSE
    -- Base for accepting guests (40 pts)
    v_friendliness := 40;

    -- No formal application required (15 pts)
    IF NOT COALESCE(r.guest_application_required, false) THEN
      v_friendliness := v_friendliness + 15;
    END IF;

    -- Contact accessibility (max 20 pts)
    IF r.contact_form_url IS NOT NULL OR r.booking_link IS NOT NULL THEN
      v_friendliness := v_friendliness + 20;
    ELSIF r.booking_email IS NOT NULL OR r.producer_email IS NOT NULL THEN
      v_friendliness := v_friendliness + 12;
    ELSIF r.host_email IS NOT NULL THEN
      v_friendliness := v_friendliness + 8;
    END IF;

    -- Guest frequency signal (max 15 pts)
    v_friendliness := v_friendliness + CASE r.avg_guest_frequency
      WHEN 'every_episode' THEN 15
      WHEN 'weekly'        THEN 12
      WHEN 'biweekly'      THEN  9
      WHEN 'monthly'       THEN  6
      WHEN 'occasional'    THEN  3
      WHEN 'rarely'        THEN  1
      ELSE 0
    END;

    -- Remote-friendly (10 pts)
    IF COALESCE(r.remote_interviews, true) THEN
      v_friendliness := v_friendliness + 10;
    END IF;
  END IF;

  v_friendliness := LEAST(100, GREATEST(0, v_friendliness));

  -- ── Visibility Score (0–100) ──────────────────────────────────────────
  -- Signals: episode volume, platform presence, social footprint, activity

  -- Episode volume tiers (max 30 pts)
  v_visibility := CASE
    WHEN COALESCE(r.episode_count, 0) >= 500 THEN 30
    WHEN COALESCE(r.episode_count, 0) >= 200 THEN 25
    WHEN COALESCE(r.episode_count, 0) >= 100 THEN 20
    WHEN COALESCE(r.episode_count, 0) >= 50  THEN 15
    WHEN COALESCE(r.episode_count, 0) >= 20  THEN 10
    WHEN COALESCE(r.episode_count, 0) >= 5   THEN  5
    ELSE 0
  END;

  -- Social footprint (max 30 pts)
  IF r.youtube_url   IS NOT NULL THEN v_visibility := v_visibility + 10; END IF;
  IF r.linkedin_url  IS NOT NULL THEN v_visibility := v_visibility +  8; END IF;
  IF r.instagram_url IS NOT NULL THEN v_visibility := v_visibility +  7; END IF;
  IF r.twitter_url   IS NOT NULL THEN v_visibility := v_visibility +  5; END IF;

  -- Platform presence (max 20 pts)
  IF r.apple_url     IS NOT NULL THEN v_visibility := v_visibility + 10; END IF;
  IF r.spotify_url   IS NOT NULL THEN v_visibility := v_visibility + 10; END IF;

  -- Website (10 pts)
  IF r.website IS NOT NULL THEN v_visibility := v_visibility + 10; END IF;

  -- Active publishing bonus (10 pts)
  IF r.activity_status = 'active' THEN v_visibility := v_visibility + 10; END IF;

  v_visibility := LEAST(100, GREATEST(0, v_visibility));

  -- ── Response Probability Score (0–100) ────────────────────────────────
  -- Base from contact_method_rank (recompute inline — GENERATED cols may lag)

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

  -- Outreach readiness boost
  IF COALESCE(r.outreach_ready, false) THEN v_response := v_response + 10; END IF;

  -- Contact confidence boost
  v_response := v_response + CASE r.contact_confidence
    WHEN 'high'   THEN 8
    WHEN 'medium' THEN 4
    ELSE 0
  END;

  -- Penalties
  IF COALESCE(r.abandoned_flag, false)  THEN v_response := v_response - 30; END IF;
  IF r.activity_status = 'inactive'     THEN v_response := v_response - 20; END IF;
  IF r.activity_status = 'hiatus'       THEN v_response := v_response - 10; END IF;
  IF COALESCE(r.is_duplicate, false)    THEN v_response := 0;               END IF;

  v_response := LEAST(100, GREATEST(0, v_response));

  -- ── Write scores ──────────────────────────────────────────────────────
  UPDATE public.podcasts SET
    authority_score            = v_authority,
    guest_friendliness_score   = v_friendliness,
    visibility_score           = v_visibility,
    response_probability_score = v_response
  WHERE id = p_id;

END;
$$;


-- ── Trigger: auto-score on INSERT / UPDATE ────────────────────────────────

CREATE OR REPLACE FUNCTION trigger_refresh_podcast_scores()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Guard: skip if we are already inside a score-refresh UPDATE
  -- (prevents infinite trigger recursion)
  IF pg_trigger_depth() > 1 THEN
    RETURN NEW;
  END IF;

  PERFORM compute_podcast_intelligence_scores(NEW.id);
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS refresh_scores_on_upsert ON public.podcasts;
CREATE TRIGGER refresh_scores_on_upsert
  AFTER INSERT OR UPDATE ON public.podcasts
  FOR EACH ROW
  EXECUTE FUNCTION trigger_refresh_podcast_scores();


-- ── Batch helper: re-score all existing rows ──────────────────────────────
-- Run this manually after initial migration or after adjusting weights.

CREATE OR REPLACE FUNCTION refresh_all_podcast_scores()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_count INTEGER := 0;
  v_id    UUID;
BEGIN
  FOR v_id IN SELECT id FROM public.podcasts LOOP
    PERFORM compute_podcast_intelligence_scores(v_id);
    v_count := v_count + 1;
  END LOOP;
  RETURN v_count;
END;
$$;

-- Score all existing rows immediately
SELECT refresh_all_podcast_scores();
