-- ═══════════════════════════════════════════════════════════════════════════
--  PodcastMatch AI — Phase 2 Final: Creator-Specific Alignment Architecture
--  Migration 013: podcast_creator_alignment table + refactored scoring engine
--
--  PROBLEM SOLVED:
--  audience_alignment_score and match_quality_score were stored on the podcast
--  record — meaning one creator's scores overwrote another's.
--
--  SOLUTION:
--  - podcast_creator_alignment stores one row per (podcast, creator) pair
--  - Each creator gets their own scores — no overwriting possible
--  - Triggers auto-recalculate when creator DNA or podcast intelligence changes
--  - match_quality_score is now the primary ranking score for discovery
--
--  SCORE ARCHITECTURE (after this migration):
--  ON podcasts table (podcast attributes — no creator context needed):
--    authority_score, guest_friendliness_score, visibility_score,
--    response_probability_score
--
--  ON podcast_creator_alignment (creator-specific relationship scores):
--    topic_score, audience_score, niche_score, guest_openness_score,
--    audience_alignment_score, match_quality_score
--
--  Run AFTER migrations 003–012.
-- ═══════════════════════════════════════════════════════════════════════════


-- ═══════════════════════════════════════════════════════════════════════════
--  STEP 1: Create podcast_creator_alignment table
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.podcast_creator_alignment (

  id                      UUID        PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Relationship keys
  podcast_id              UUID        NOT NULL REFERENCES public.podcasts(id)  ON DELETE CASCADE,
  user_id                 UUID        NOT NULL REFERENCES auth.users(id)        ON DELETE CASCADE,

  -- ── Component scores (explainability layer) ───────────────────────────
  -- Stored separately so we can tell creators exactly why a score is high/low.
  -- "Topic Alignment: 95 | Audience Alignment: 88 | Niche: 94 | Openness: 90"

  topic_score             INTEGER     NOT NULL DEFAULT 0 CHECK (topic_score           BETWEEN 0 AND 100),
  audience_score          INTEGER     NOT NULL DEFAULT 0 CHECK (audience_score         BETWEEN 0 AND 100),
  niche_score             INTEGER     NOT NULL DEFAULT 0 CHECK (niche_score            BETWEEN 0 AND 100),
  guest_openness_score    INTEGER     NOT NULL DEFAULT 0 CHECK (guest_openness_score   BETWEEN 0 AND 100),

  -- ── Composite scores ─────────────────────────────────────────────────
  -- audience_alignment_score = weighted composite of the 4 component scores above
  -- match_quality_score = primary ranking score combining all 5 podcast scores

  audience_alignment_score INTEGER    NOT NULL DEFAULT 0 CHECK (audience_alignment_score BETWEEN 0 AND 100),
  match_quality_score      INTEGER    NOT NULL DEFAULT 0 CHECK (match_quality_score      BETWEEN 0 AND 100),

  -- ── Metadata ─────────────────────────────────────────────────────────
  computed_at             TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- One row per creator/podcast pair — no overwriting possible
  UNIQUE (podcast_id, user_id)
);

-- ── Row Level Security ────────────────────────────────────────────────────

ALTER TABLE public.podcast_creator_alignment ENABLE ROW LEVEL SECURITY;

-- Creators can only read their own alignment records
DROP POLICY IF EXISTS "alignment: user reads own rows" ON public.podcast_creator_alignment;
CREATE POLICY "alignment: user reads own rows"
  ON public.podcast_creator_alignment FOR SELECT
  USING (user_id = auth.uid());

-- No client writes — scoring engine runs server-side via service role
-- INSERT / UPDATE / DELETE go through SECURITY DEFINER functions only

-- ── Indexes ───────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS pca_user_id_idx              ON public.podcast_creator_alignment (user_id);
CREATE INDEX IF NOT EXISTS pca_podcast_id_idx           ON public.podcast_creator_alignment (podcast_id);
CREATE INDEX IF NOT EXISTS pca_match_quality_idx        ON public.podcast_creator_alignment (user_id, match_quality_score DESC);
CREATE INDEX IF NOT EXISTS pca_alignment_idx            ON public.podcast_creator_alignment (user_id, audience_alignment_score DESC);
CREATE INDEX IF NOT EXISTS pca_computed_at_idx          ON public.podcast_creator_alignment (computed_at DESC);


-- ═══════════════════════════════════════════════════════════════════════════
--  STEP 2: Update podcast scoring trigger — remove creator-specific scores
--  authority, friendliness, visibility, response stay on the podcast record.
--  audience_alignment and match_quality move to podcast_creator_alignment.
-- ═══════════════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION compute_podcast_intelligence_scores(p_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  r                   RECORD;
  v_authority         INTEGER := 0;
  v_friendliness      INTEGER := 0;
  v_visibility        INTEGER := 0;
  v_response          INTEGER := 0;
  v_contact_rank      INTEGER;
BEGIN
  SELECT * INTO r FROM public.podcasts WHERE id = p_id;
  IF NOT FOUND THEN RETURN; END IF;

  -- ── Authority Score ────────────────────────────────────────────────────
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

  -- ── Guest Friendliness Score ───────────────────────────────────────────
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
      WHEN 'every_episode' THEN 15 WHEN 'weekly'   THEN 12 WHEN 'biweekly' THEN 9
      WHEN 'monthly'       THEN  6 WHEN 'occasional' THEN 3 WHEN 'rarely'  THEN 1
      ELSE 0
    END;
    IF COALESCE(r.remote_interviews, true) THEN v_friendliness := v_friendliness + 10; END IF;
  END IF;
  v_friendliness := LEAST(100, GREATEST(0, v_friendliness));

  -- ── Visibility Score ───────────────────────────────────────────────────
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

  -- ── Response Probability Score ─────────────────────────────────────────
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
    WHEN 1 THEN 75 WHEN 2 THEN 65 WHEN 3 THEN 60 WHEN 4 THEN 50
    WHEN 5 THEN 30 WHEN 6 THEN 20 ELSE 5
  END;
  IF COALESCE(r.outreach_ready, false)  THEN v_response := v_response + 10; END IF;
  v_response := v_response + CASE r.contact_confidence
    WHEN 'high' THEN 8 WHEN 'medium' THEN 4 ELSE 0
  END;
  IF COALESCE(r.abandoned_flag, false)  THEN v_response := v_response - 30; END IF;
  IF r.activity_status = 'inactive'     THEN v_response := v_response - 20; END IF;
  IF r.activity_status = 'hiatus'       THEN v_response := v_response - 10; END IF;
  IF COALESCE(r.is_duplicate, false)    THEN v_response := 0;               END IF;
  v_response := LEAST(100, GREATEST(0, v_response));

  -- ── Write podcast-level scores only ───────────────────────────────────
  -- audience_alignment_score and match_quality_score are now in
  -- podcast_creator_alignment — NOT written here.
  UPDATE public.podcasts SET
    authority_score            = v_authority,
    guest_friendliness_score   = v_friendliness,
    visibility_score           = v_visibility,
    response_probability_score = v_response
  WHERE id = p_id;

END;
$$;


-- ═══════════════════════════════════════════════════════════════════════════
--  STEP 3: upsert_creator_alignment(podcast_id, user_id)
--  Computes all 6 creator-specific scores and writes to the alignment table.
--  This is the single authoritative write path for creator scores.
-- ═══════════════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION upsert_creator_alignment(
  p_podcast_id UUID,
  p_user_id    UUID
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  pod              RECORD;
  creator          RECORD;

  -- Component scores
  v_topic          INTEGER := 0;
  v_audience       INTEGER := 0;
  v_niche          INTEGER := 0;
  v_openness       INTEGER := 0;

  -- Composites
  v_alignment      INTEGER := 0;
  v_match_quality  INTEGER := 0;

  -- Helpers
  v_niche_count    INTEGER := 0;
BEGIN
  SELECT * INTO pod     FROM public.podcasts         WHERE id       = p_podcast_id;
  SELECT * INTO creator FROM public.creator_profiles WHERE user_id  = p_user_id;

  IF NOT FOUND THEN RETURN; END IF;
  IF pod.id IS NULL THEN RETURN; END IF;

  -- Hard gate: podcast not accepting guests = no alignment
  IF NOT COALESCE(pod.accepts_guests, true) THEN
    INSERT INTO public.podcast_creator_alignment
      (podcast_id, user_id, topic_score, audience_score, niche_score,
       guest_openness_score, audience_alignment_score, match_quality_score,
       computed_at, updated_at)
    VALUES
      (p_podcast_id, p_user_id, 0, 0, 0, 0, 0, 0, now(), now())
    ON CONFLICT (podcast_id, user_id) DO UPDATE SET
      topic_score              = 0,
      audience_score           = 0,
      niche_score              = 0,
      guest_openness_score     = 0,
      audience_alignment_score = 0,
      match_quality_score      = 0,
      computed_at              = now(),
      updated_at               = now();
    RETURN;
  END IF;

  -- ── Component Score A: Topic Overlap (0–100) ──────────────────────────
  -- How well does the creator's speaking topics match what this podcast covers?
  -- Uses creator.speaking_topics vs podcast guest_expertise_areas + audience_goals
  -- + audience_pain_points + description keyword check

  IF creator.speaking_topics IS NOT NULL AND array_length(creator.speaking_topics, 1) > 0 THEN

    -- Count matches against podcast's topic arrays
    SELECT COUNT(*)::INTEGER INTO v_topic
    FROM unnest(creator.speaking_topics) t(topic)
    WHERE EXISTS (
      SELECT 1 FROM unnest(
        COALESCE(pod.guest_expertise_areas, '{}') ||
        COALESCE(pod.audience_goals, '{}')        ||
        COALESCE(pod.audience_pain_points, '{}')
      ) p(term)
      WHERE lower(p.term) LIKE '%' || lower(t.topic) || '%'
         OR lower(t.topic) LIKE '%' || lower(p.term) || '%'
    );

    -- Normalize to 0–80 based on what fraction of topics matched
    v_topic := LEAST(80, (v_topic * 80) / GREATEST(1, array_length(creator.speaking_topics, 1)));

    -- Bonus: creator category appears in podcast description (up to 20 pts)
    IF pod.description IS NOT NULL AND creator.category IS NOT NULL THEN
      IF lower(pod.description) LIKE '%' || lower(creator.category) || '%' THEN
        v_topic := LEAST(100, v_topic + 20);
      END IF;
    END IF;

    -- Bonus: creator category matches podcast category or subcategory (10 pts)
    IF creator.category IS NOT NULL THEN
      IF lower(COALESCE(pod.category,'')) LIKE '%' || lower(creator.category) || '%'
      OR lower(COALESCE(pod.subcategory,'')) LIKE '%' || lower(creator.category) || '%' THEN
        v_topic := LEAST(100, v_topic + 10);
      END IF;
    END IF;
  END IF;

  v_topic := LEAST(100, GREATEST(0, v_topic));

  -- ── Component Score B: Audience Overlap (0–100) ───────────────────────
  -- Does the creator serve the same people this podcast speaks to?
  -- Uses creator.speaking_topics vs podcast target_audience + pain_points
  -- + geographic fit

  IF creator.speaking_topics IS NOT NULL AND array_length(creator.speaking_topics, 1) > 0 THEN

    SELECT COUNT(*)::INTEGER INTO v_audience
    FROM unnest(creator.speaking_topics) t(topic)
    WHERE
      lower(COALESCE(pod.target_audience,'')) LIKE '%' || lower(t.topic) || '%'
      OR EXISTS (
        SELECT 1 FROM unnest(COALESCE(pod.audience_pain_points, '{}')) p(term)
        WHERE lower(p.term) LIKE '%' || lower(t.topic) || '%'
           OR lower(t.topic) LIKE '%' || lower(p.term) || '%'
      );

    v_audience := LEAST(80, (v_audience * 80) / GREATEST(1, array_length(creator.speaking_topics, 1)));

    -- Geographic bonus: global or unset = no penalty (20 pts)
    IF pod.geographic_focus IS NULL OR lower(pod.geographic_focus) = 'global' THEN
      v_audience := LEAST(100, v_audience + 20);
    END IF;
  END IF;

  v_audience := LEAST(100, GREATEST(0, v_audience));

  -- ── Component Score C: Niche Alignment (0–100) ────────────────────────
  -- How strongly do this podcast's category flags match the creator's category?
  -- Faith, business, leadership, entrepreneurship, personal development.

  v_niche := 0;
  v_niche_count := 0;

  IF creator.category IS NOT NULL THEN

    -- Faith alignment
    IF pod.faith_based THEN
      IF lower(creator.category) LIKE '%faith%'
      OR lower(creator.category) LIKE '%spiritual%'
      OR lower(creator.category) LIKE '%christian%' THEN
        v_niche := v_niche + 25; v_niche_count := v_niche_count + 1;
      ELSE
        v_niche := v_niche - 15; -- Faith-specific show, non-faith creator
      END IF;
    END IF;

    -- Business alignment
    IF pod.business_focused THEN
      IF lower(creator.category) LIKE '%business%'
      OR lower(creator.category) LIKE '%entrepreneur%'
      OR lower(creator.category) LIKE '%leadership%'
      OR lower(creator.category) LIKE '%finance%' THEN
        v_niche := v_niche + 20; v_niche_count := v_niche_count + 1;
      END IF;
    END IF;

    -- Leadership alignment
    IF pod.leadership_focused THEN
      IF lower(creator.category) LIKE '%leader%'
      OR lower(creator.category) LIKE '%executive%'
      OR lower(creator.category) LIKE '%management%' THEN
        v_niche := v_niche + 20; v_niche_count := v_niche_count + 1;
      END IF;
    END IF;

    -- Entrepreneurship alignment
    IF pod.entrepreneurship_focused THEN
      IF lower(creator.category) LIKE '%entrepreneur%'
      OR lower(creator.category) LIKE '%startup%'
      OR lower(creator.category) LIKE '%founder%'
      OR lower(creator.category) LIKE '%business%' THEN
        v_niche := v_niche + 20; v_niche_count := v_niche_count + 1;
      END IF;
    END IF;

    -- Personal development alignment
    IF pod.personal_development THEN
      IF lower(creator.category) LIKE '%personal%'
      OR lower(creator.category) LIKE '%motivat%'
      OR lower(creator.category) LIKE '%coach%'
      OR lower(creator.category) LIKE '%mindset%'
      OR lower(creator.category) LIKE '%growth%' THEN
        v_niche := v_niche + 20; v_niche_count := v_niche_count + 1;
      END IF;
    END IF;

  END IF;

  -- Industry focus overlap via speaking topics
  IF creator.speaking_topics IS NOT NULL AND pod.industry_focus IS NOT NULL
     AND array_length(pod.industry_focus, 1) > 0 THEN
    DECLARE
      v_industry_overlap INTEGER;
    BEGIN
      SELECT COUNT(*)::INTEGER INTO v_industry_overlap
      FROM unnest(creator.speaking_topics) t(topic)
      WHERE EXISTS (
        SELECT 1 FROM unnest(pod.industry_focus) i(ind)
        WHERE lower(i.ind) LIKE '%' || lower(t.topic) || '%'
           OR lower(t.topic) LIKE '%' || lower(i.ind) || '%'
      );
      v_niche := v_niche + LEAST(15, v_industry_overlap * 5);
    END;
  END IF;

  -- Stacking bonus: multiple matching niches = highly relevant show
  IF v_niche_count >= 3 THEN v_niche := LEAST(100, v_niche + 15); END IF;
  IF v_niche_count >= 2 THEN v_niche := LEAST(100, v_niche + 10); END IF;

  -- Base of 20 so a partial match doesn't score 0
  IF v_niche_count > 0 AND v_niche < 20 THEN v_niche := 20; END IF;

  v_niche := LEAST(100, GREATEST(0, v_niche));

  -- ── Component Score D: Guest Openness Signal (0–100) ──────────────────
  -- Is this podcast actively seeking guests like this creator?
  -- experience_level match + frequency + remote + application friction

  v_openness := 0;

  -- Base for accepting guests (40 pts)
  v_openness := 40;

  -- Experience level match (25 pts)
  v_openness := v_openness + CASE pod.guest_experience_level
    WHEN 'any'         THEN 25
    WHEN 'established' THEN
      CASE WHEN creator.archetype IN ('thought leader','author','speaker','expert') THEN 25 ELSE 15 END
    WHEN 'expert'      THEN
      CASE WHEN lower(COALESCE(creator.archetype,'')) LIKE '%expert%' THEN 25 ELSE 10 END
    WHEN 'emerging'    THEN 15
    ELSE 15  -- unknown = neutral
  END;

  -- Remote interviews (15 pts — platform is remote-first)
  IF COALESCE(pod.remote_interviews, true) THEN v_openness := v_openness + 15; END IF;

  -- Active guest frequency (max 15 pts)
  v_openness := v_openness + CASE pod.avg_guest_frequency
    WHEN 'every_episode' THEN 15
    WHEN 'weekly'        THEN 12
    WHEN 'biweekly'      THEN  9
    WHEN 'monthly'       THEN  6
    WHEN 'occasional'    THEN  3
    WHEN 'rarely'        THEN  1
    ELSE 0
  END;

  -- No application required (5 pts — lower friction)
  IF NOT COALESCE(pod.guest_application_required, false) THEN
    v_openness := v_openness + 5;
  END IF;

  v_openness := LEAST(100, GREATEST(0, v_openness));

  -- ── Audience Alignment Composite (0–100) ─────────────────────────────
  -- Weighted composite of the 4 component scores.
  -- Weights: topic 30% | audience 25% | niche 30% | openness 15%

  v_alignment := (
    (v_topic    * 30) +
    (v_audience * 25) +
    (v_niche    * 30) +
    (v_openness * 15)
  ) / 100;

  v_alignment := LEAST(100, GREATEST(0, v_alignment));

  -- ── Match Quality Composite (0–100) ──────────────────────────────────
  -- Primary ranking score — includes both podcast attributes and creator alignment.
  -- Weights: alignment 35% | authority 20% | friendliness 20% | response 15% | visibility 10%

  SELECT
    (v_alignment               * 35 +
     COALESCE(p.authority_score,0) * 20 +
     COALESCE(p.guest_friendliness_score,0) * 20 +
     COALESCE(p.response_probability_score,0) * 15 +
     COALESCE(p.visibility_score,0) * 10) / 100
  INTO v_match_quality
  FROM public.podcasts p
  WHERE p.id = p_podcast_id;

  v_match_quality := LEAST(100, GREATEST(0, COALESCE(v_match_quality, 0)));

  -- ── UPSERT into podcast_creator_alignment ────────────────────────────
  INSERT INTO public.podcast_creator_alignment
    (podcast_id, user_id,
     topic_score, audience_score, niche_score, guest_openness_score,
     audience_alignment_score, match_quality_score,
     computed_at, updated_at)
  VALUES
    (p_podcast_id, p_user_id,
     v_topic, v_audience, v_niche, v_openness,
     v_alignment, v_match_quality,
     now(), now())
  ON CONFLICT (podcast_id, user_id) DO UPDATE SET
    topic_score              = EXCLUDED.topic_score,
    audience_score           = EXCLUDED.audience_score,
    niche_score              = EXCLUDED.niche_score,
    guest_openness_score     = EXCLUDED.guest_openness_score,
    audience_alignment_score = EXCLUDED.audience_alignment_score,
    match_quality_score      = EXCLUDED.match_quality_score,
    computed_at              = now(),
    updated_at               = now();

END;
$$;


-- ═══════════════════════════════════════════════════════════════════════════
--  STEP 4: refresh_alignment_scores_for_user(user_id)
--  Scores all active podcasts for one creator. Call after DNA assessment.
-- ═══════════════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION refresh_alignment_scores_for_user(p_user_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_count  INTEGER := 0;
  v_pod_id UUID;
BEGIN
  FOR v_pod_id IN
    SELECT id FROM public.podcasts
    WHERE is_duplicate    = false
      AND activity_status <> 'inactive'
  LOOP
    PERFORM upsert_creator_alignment(v_pod_id, p_user_id);
    v_count := v_count + 1;
  END LOOP;
  RETURN v_count;
END;
$$;


-- ═══════════════════════════════════════════════════════════════════════════
--  STEP 5: refresh_podcast_alignment_scores(podcast_id)
--  When a podcast's intelligence fields change, recalculate for ALL creators
--  who already have an alignment record for that podcast.
-- ═══════════════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION refresh_podcast_alignment_scores(p_podcast_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_count   INTEGER := 0;
  v_user_id UUID;
BEGIN
  FOR v_user_id IN
    SELECT user_id FROM public.podcast_creator_alignment
    WHERE podcast_id = p_podcast_id
  LOOP
    PERFORM upsert_creator_alignment(p_podcast_id, v_user_id);
    v_count := v_count + 1;
  END LOOP;
  RETURN v_count;
END;
$$;


-- ═══════════════════════════════════════════════════════════════════════════
--  STEP 6: Trigger — creator_profiles UPDATE → refresh alignment scores
--  Fires when a creator updates their DNA profile, archetype, category,
--  or speaking topics. Automatically recalculates all their podcast scores.
-- ═══════════════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION trigger_refresh_alignment_on_creator_update()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Only recalculate if the fields that affect alignment actually changed
  IF (
    NEW.speaking_topics   IS DISTINCT FROM OLD.speaking_topics   OR
    NEW.category          IS DISTINCT FROM OLD.category          OR
    NEW.archetype         IS DISTINCT FROM OLD.archetype         OR
    NEW.audience_profile  IS DISTINCT FROM OLD.audience_profile
  ) THEN
    PERFORM refresh_alignment_scores_for_user(NEW.user_id);
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS refresh_alignment_on_creator_update ON public.creator_profiles;
CREATE TRIGGER refresh_alignment_on_creator_update
  AFTER UPDATE ON public.creator_profiles
  FOR EACH ROW
  EXECUTE FUNCTION trigger_refresh_alignment_on_creator_update();


-- ═══════════════════════════════════════════════════════════════════════════
--  STEP 7: Trigger — podcasts UPDATE → refresh affected creator alignments
--  Fires when podcast intelligence fields change.
--  Only recalculates for creators who already have an alignment record.
-- ═══════════════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION trigger_refresh_alignment_on_podcast_update()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF pg_trigger_depth() > 1 THEN RETURN NEW; END IF;

  -- Only recalculate if intelligence fields changed
  IF (
    NEW.guest_expertise_areas    IS DISTINCT FROM OLD.guest_expertise_areas    OR
    NEW.audience_goals           IS DISTINCT FROM OLD.audience_goals           OR
    NEW.audience_pain_points     IS DISTINCT FROM OLD.audience_pain_points     OR
    NEW.target_audience          IS DISTINCT FROM OLD.target_audience          OR
    NEW.industry_focus           IS DISTINCT FROM OLD.industry_focus           OR
    NEW.faith_based              IS DISTINCT FROM OLD.faith_based              OR
    NEW.business_focused         IS DISTINCT FROM OLD.business_focused         OR
    NEW.personal_development     IS DISTINCT FROM OLD.personal_development     OR
    NEW.leadership_focused       IS DISTINCT FROM OLD.leadership_focused       OR
    NEW.entrepreneurship_focused IS DISTINCT FROM OLD.entrepreneurship_focused OR
    NEW.accepts_guests           IS DISTINCT FROM OLD.accepts_guests           OR
    NEW.guest_experience_level   IS DISTINCT FROM OLD.guest_experience_level   OR
    NEW.remote_interviews        IS DISTINCT FROM OLD.remote_interviews        OR
    NEW.avg_guest_frequency      IS DISTINCT FROM OLD.avg_guest_frequency      OR
    NEW.activity_status          IS DISTINCT FROM OLD.activity_status
  ) THEN
    PERFORM refresh_podcast_alignment_scores(NEW.id);
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS refresh_alignment_on_podcast_update ON public.podcasts;
CREATE TRIGGER refresh_alignment_on_podcast_update
  AFTER UPDATE ON public.podcasts
  FOR EACH ROW
  EXECUTE FUNCTION trigger_refresh_alignment_on_podcast_update();


-- ═══════════════════════════════════════════════════════════════════════════
--  STEP 8: Backfill — generate alignment records for all existing creators
--  Loops every creator_profile × every active podcast.
--  Safe to re-run (UPSERT logic — no data loss).
-- ═══════════════════════════════════════════════════════════════════════════

DO $$
DECLARE
  v_user_id UUID;
  v_total   INTEGER := 0;
BEGIN
  FOR v_user_id IN SELECT user_id FROM public.creator_profiles LOOP
    v_total := v_total + refresh_alignment_scores_for_user(v_user_id);
  END LOOP;

  RAISE NOTICE 'Backfill complete: % alignment records created/updated', v_total;
END;
$$;


-- ═══════════════════════════════════════════════════════════════════════════
--  GRANTS
-- ═══════════════════════════════════════════════════════════════════════════

GRANT EXECUTE ON FUNCTION upsert_creator_alignment(UUID, UUID)              TO authenticated;
GRANT EXECUTE ON FUNCTION refresh_alignment_scores_for_user(UUID)           TO authenticated;
GRANT EXECUTE ON FUNCTION refresh_podcast_alignment_scores(UUID)            TO authenticated;
