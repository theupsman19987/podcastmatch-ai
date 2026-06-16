-- ═══════════════════════════════════════════════════════════════════════════
--  PodcastMatch AI — Phase 2: Audience Alignment in the Trigger Engine
--  Migration 012: Add audience_alignment_score to the auto-scoring trigger.
--
--  ARCHITECTURE NOTE:
--  audience_alignment_score has two modes:
--
--  1. TRIGGER MODE (this migration):
--     Computed from the podcast's own data alone — no creator needed.
--     Measures how well-defined the podcast's audience is and how strongly
--     it maps to the platform's core creator categories.
--     Fires automatically on every INSERT / UPDATE.
--
--  2. QUERY-TIME MODE (migration 011):
--     compute_audience_alignment_score(podcast_id, user_id)
--     Computes true creator-vs-podcast alignment at match time.
--     Called from the API when ranking results for a specific creator.
--
--  match_quality_score now includes all five scores:
--     authority + guest_friendliness + visibility + response + audience_alignment
--     weighted so audience_alignment carries the most weight (35%).
--
--  Run AFTER migrations 007, 008, 009, 010, 011.
-- ═══════════════════════════════════════════════════════════════════════════


-- ── Rebuild the core scoring function with audience_alignment ─────────────

CREATE OR REPLACE FUNCTION compute_podcast_intelligence_scores(p_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  r                   RECORD;

  -- ── Score variables ────────────────────────────────────────────────────
  v_authority         INTEGER := 0;
  v_friendliness      INTEGER := 0;
  v_visibility        INTEGER := 0;
  v_response          INTEGER := 0;
  v_alignment         INTEGER := 0;
  v_match_quality     INTEGER := 0;

  -- Helpers
  v_contact_rank      INTEGER;
  v_niche_count       INTEGER := 0;
  v_data_richness     INTEGER := 0;

  -- ── Audience alignment weights (must sum to 100) ───────────────────────
  w_topic_strength    CONSTANT INTEGER := 25;
  w_audience_def      CONSTANT INTEGER := 25;
  w_niche_alignment   CONSTANT INTEGER := 30;
  w_guest_openness    CONSTANT INTEGER := 20;

  -- Dimension sub-scores
  v_topic_strength    INTEGER := 0;
  v_audience_def      INTEGER := 0;
  v_niche_alignment   INTEGER := 0;
  v_guest_openness    INTEGER := 0;

  -- ── Match quality weights (must sum to 100) ────────────────────────────
  w_alignment_mq      CONSTANT INTEGER := 35;
  w_authority_mq      CONSTANT INTEGER := 20;
  w_friendliness_mq   CONSTANT INTEGER := 20;
  w_response_mq       CONSTANT INTEGER := 15;
  w_visibility_mq     CONSTANT INTEGER := 10;

BEGIN
  SELECT * INTO r FROM public.podcasts WHERE id = p_id;
  IF NOT FOUND THEN RETURN; END IF;

  -- ════════════════════════════════════════════════════════════════════════
  --  SCORE 1: Authority (0–100)
  --  Signals: episode volume, activity status, recency, curation quality
  -- ════════════════════════════════════════════════════════════════════════

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

  -- ════════════════════════════════════════════════════════════════════════
  --  SCORE 2: Guest Friendliness (0–100)
  --  Signals: accepts guests, booking accessibility, frequency, remote ok
  -- ════════════════════════════════════════════════════════════════════════

  IF NOT COALESCE(r.accepts_guests, true) THEN
    v_friendliness := 0;
  ELSE
    v_friendliness := 40; -- Base for accepting guests

    IF NOT COALESCE(r.guest_application_required, false) THEN
      v_friendliness := v_friendliness + 15;
    END IF;

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

    IF COALESCE(r.remote_interviews, true) THEN
      v_friendliness := v_friendliness + 10;
    END IF;
  END IF;

  v_friendliness := LEAST(100, GREATEST(0, v_friendliness));

  -- ════════════════════════════════════════════════════════════════════════
  --  SCORE 3: Visibility (0–100)
  --  Signals: episode volume tiers, social footprint, platform presence
  -- ════════════════════════════════════════════════════════════════════════

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

  -- ════════════════════════════════════════════════════════════════════════
  --  SCORE 4: Response Probability (0–100)
  --  Signals: contact method rank, confidence, outreach readiness, health
  -- ════════════════════════════════════════════════════════════════════════

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

  IF COALESCE(r.outreach_ready, false)   THEN v_response := v_response + 10; END IF;
  v_response := v_response + CASE r.contact_confidence
    WHEN 'high'   THEN 8
    WHEN 'medium' THEN 4
    ELSE 0
  END;

  IF COALESCE(r.abandoned_flag, false)   THEN v_response := v_response - 30; END IF;
  IF r.activity_status = 'inactive'      THEN v_response := v_response - 20; END IF;
  IF r.activity_status = 'hiatus'        THEN v_response := v_response - 10; END IF;
  IF COALESCE(r.is_duplicate, false)     THEN v_response := 0;               END IF;

  v_response := LEAST(100, GREATEST(0, v_response));

  -- ════════════════════════════════════════════════════════════════════════
  --  SCORE 5: Audience Alignment (0–100)
  --  Computed from the podcast's own intelligence data — no creator needed.
  --  Four dimensions, each weighted:
  --
  --  Dimension A — Topic Strength (25%)
  --    How richly defined are the podcast's topic / expertise signals?
  --    Inputs: guest_expertise_areas, audience_goals, audience_pain_points,
  --            target_audience, subcategory
  --
  --  Dimension B — Audience Definition (25%)
  --    How clearly is the podcast's audience described?
  --    Inputs: target_audience, industry_focus, experience_level,
  --            geographic_focus
  --
  --  Dimension C — Niche Alignment (30%)
  --    How strongly does this podcast map to the platform's creator categories?
  --    Inputs: faith_based, business_focused, personal_development,
  --            leadership_focused, entrepreneurship_focused + flags stack
  --
  --  Dimension D — Guest Openness Signal (20%)
  --    Does the podcast actively seek guests like our creators?
  --    Inputs: accepts_guests, guest_experience_level, guest_expertise_areas,
  --            avg_guest_frequency, remote_interviews
  -- ════════════════════════════════════════════════════════════════════════

  -- ── Dimension A: Topic Strength ──────────────────────────────────────
  v_topic_strength := 0;

  -- guest_expertise_areas is populated (10 pts)
  IF array_length(r.guest_expertise_areas, 1) > 0 THEN
    v_topic_strength := v_topic_strength + 10;
    -- More topics = richer signal (up to 10 more pts)
    v_topic_strength := v_topic_strength + LEAST(10, array_length(r.guest_expertise_areas, 1) * 2);
  END IF;

  -- audience_goals is populated (10 pts)
  IF array_length(r.audience_goals, 1) > 0 THEN
    v_topic_strength := v_topic_strength + 10;
    v_topic_strength := v_topic_strength + LEAST(5, array_length(r.audience_goals, 1));
  END IF;

  -- audience_pain_points is populated (5 pts)
  IF array_length(r.audience_pain_points, 1) > 0 THEN
    v_topic_strength := v_topic_strength + LEAST(10, array_length(r.audience_pain_points, 1) * 2);
  END IF;

  -- target_audience text is filled (10 pts)
  IF r.target_audience IS NOT NULL AND length(r.target_audience) > 10 THEN
    v_topic_strength := v_topic_strength + 10;
  END IF;

  -- subcategory is set (5 pts)
  IF r.subcategory IS NOT NULL THEN
    v_topic_strength := v_topic_strength + 5;
  END IF;

  v_topic_strength := LEAST(100, GREATEST(0, v_topic_strength));

  -- ── Dimension B: Audience Definition ─────────────────────────────────
  v_audience_def := 0;

  -- industry_focus is populated (25 pts, scales with count)
  IF array_length(r.industry_focus, 1) > 0 THEN
    v_audience_def := v_audience_def + LEAST(25, array_length(r.industry_focus, 1) * 8);
  END IF;

  -- experience_level is set (25 pts)
  IF r.experience_level IS NOT NULL THEN
    v_audience_def := v_audience_def + 25;
  END IF;

  -- target_audience text (25 pts)
  IF r.target_audience IS NOT NULL AND length(r.target_audience) > 10 THEN
    v_audience_def := v_audience_def + 25;
  END IF;

  -- geographic_focus is set (15 pts)
  IF r.geographic_focus IS NOT NULL THEN
    v_audience_def := v_audience_def + 15;
  END IF;

  -- description is rich (10 pts)
  IF r.description IS NOT NULL AND length(r.description) > 100 THEN
    v_audience_def := v_audience_def + 10;
  END IF;

  v_audience_def := LEAST(100, GREATEST(0, v_audience_def));

  -- ── Dimension C: Niche Alignment ─────────────────────────────────────
  -- Each boolean flag that is TRUE = this podcast actively serves that niche.
  -- Flags that match our platform's primary creator categories score higher.
  -- Stacking flags (e.g. business + leadership) shows clear niche strength.

  v_niche_count := 0;
  IF r.faith_based             THEN v_niche_count := v_niche_count + 1; END IF;
  IF r.business_focused        THEN v_niche_count := v_niche_count + 1; END IF;
  IF r.personal_development    THEN v_niche_count := v_niche_count + 1; END IF;
  IF r.leadership_focused      THEN v_niche_count := v_niche_count + 1; END IF;
  IF r.entrepreneurship_focused THEN v_niche_count := v_niche_count + 1; END IF;

  -- Base: 20 pts per flag (max 100 at 5 flags)
  v_niche_alignment := LEAST(100, v_niche_count * 20);

  -- Bonus for high-value combinations used by the platform's target creators
  IF r.business_focused AND r.leadership_focused        THEN v_niche_alignment := LEAST(100, v_niche_alignment + 10); END IF;
  IF r.business_focused AND r.entrepreneurship_focused  THEN v_niche_alignment := LEAST(100, v_niche_alignment + 10); END IF;
  IF r.personal_development AND r.leadership_focused    THEN v_niche_alignment := LEAST(100, v_niche_alignment + 10); END IF;
  IF r.personal_development AND r.faith_based           THEN v_niche_alignment := LEAST(100, v_niche_alignment + 10); END IF;

  -- Penalty: no flags AND no industry_focus = unclassified podcast (hard to align)
  IF v_niche_count = 0 AND array_length(r.industry_focus, 1) IS NULL THEN
    v_niche_alignment := 0;
  END IF;

  v_niche_alignment := LEAST(100, GREATEST(0, v_niche_alignment));

  -- ── Dimension D: Guest Openness Signal ───────────────────────────────
  v_guest_openness := 0;

  IF COALESCE(r.accepts_guests, true) THEN
    v_guest_openness := 40; -- Base

    -- Guest experience level set (20 pts)
    v_guest_openness := v_guest_openness + CASE r.guest_experience_level
      WHEN 'any'         THEN 20
      WHEN 'established' THEN 15
      WHEN 'expert'      THEN 10
      WHEN 'emerging'    THEN 10
      ELSE 0
    END;

    -- Remote interviews accepted (20 pts — platform is remote-first)
    IF COALESCE(r.remote_interviews, true) THEN
      v_guest_openness := v_guest_openness + 20;
    END IF;

    -- Active guest frequency (max 20 pts)
    v_guest_openness := v_guest_openness + CASE r.avg_guest_frequency
      WHEN 'every_episode' THEN 20
      WHEN 'weekly'        THEN 16
      WHEN 'biweekly'      THEN 12
      WHEN 'monthly'       THEN  8
      WHEN 'occasional'    THEN  4
      WHEN 'rarely'        THEN  1
      ELSE 0
    END;
  END IF;

  v_guest_openness := LEAST(100, GREATEST(0, v_guest_openness));

  -- ── Weighted audience alignment composite ─────────────────────────────
  v_alignment := (
    (v_topic_strength  * w_topic_strength) +
    (v_audience_def    * w_audience_def)   +
    (v_niche_alignment * w_niche_alignment)+
    (v_guest_openness  * w_guest_openness)
  ) / 100;

  v_alignment := LEAST(100, GREATEST(0, v_alignment));

  -- ════════════════════════════════════════════════════════════════════════
  --  SCORE 6: Match Quality (0–100)
  --  Primary recommendation score — composite of all 5 podcast scores.
  --  audience_alignment carries the most weight (35%) because it determines
  --  whether this podcast is even relevant for the platform's creators.
  --
  --  Weights:
  --    audience_alignment    35% — is this podcast for our type of creator?
  --    authority             20% — is the show credible and established?
  --    guest_friendliness    20% — can our creator actually get on?
  --    response_probability  15% — will they reply?
  --    visibility            10% — what is the exposure value?
  -- ════════════════════════════════════════════════════════════════════════

  v_match_quality := (
    (v_alignment    * w_alignment_mq)    +
    (v_authority    * w_authority_mq)    +
    (v_friendliness * w_friendliness_mq) +
    (v_response     * w_response_mq)     +
    (v_visibility   * w_visibility_mq)
  ) / 100;

  v_match_quality := LEAST(100, GREATEST(0, v_match_quality));

  -- ════════════════════════════════════════════════════════════════════════
  --  Write all 6 scores
  -- ════════════════════════════════════════════════════════════════════════

  UPDATE public.podcasts SET
    authority_score            = v_authority,
    guest_friendliness_score   = v_friendliness,
    visibility_score           = v_visibility,
    response_probability_score = v_response,
    audience_alignment_score   = v_alignment,
    match_quality_score        = v_match_quality
  WHERE id = p_id;

END;
$$;


-- ── Backfill: score all existing records ──────────────────────────────────

SELECT refresh_all_podcast_scores();
