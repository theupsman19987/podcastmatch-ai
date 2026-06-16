-- ═══════════════════════════════════════════════════════════════════════════
--  PodcastMatch AI — Phase 2: Audience Alignment Scoring Engine
--  Migration 011: compute_audience_alignment_score()
--
--  Evaluates how well a podcast audience matches a specific creator profile.
--  No AI required — pure weighted overlap scoring across 5 dimensions:
--    1. Topic overlap        (what the creator speaks about vs podcast topics)
--    2. Audience overlap     (who the creator serves vs who listens)
--    3. Industry overlap     (creator category vs podcast industry focus)
--    4. Creator relevance    (creator archetype vs guest expertise the show seeks)
--    5. Niche relevance      (creator category flags vs podcast boolean flags)
--
--  Returns 0–100. Designed to be called at match/discovery time.
--  Also provides compute_match_quality_with_alignment() which returns the
--  full 5-score composite for ranking search results.
--
--  Run AFTER migrations 007, 008, 009, 010.
-- ═══════════════════════════════════════════════════════════════════════════


-- ── Helper: count overlapping elements between two text arrays ─────────────
-- Returns the number of elements in arr_a that appear (case-insensitive)
-- in arr_b. Used for topic/industry/audience overlap scoring.

CREATE OR REPLACE FUNCTION array_overlap_count(arr_a TEXT[], arr_b TEXT[])
RETURNS INTEGER
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT COUNT(*)::INTEGER
  FROM unnest(arr_a) a(elem)
  WHERE EXISTS (
    SELECT 1 FROM unnest(arr_b) b(elem)
    WHERE lower(b.elem) = lower(a.elem)
       OR lower(b.elem) LIKE '%' || lower(a.elem) || '%'
       OR lower(a.elem) LIKE '%' || lower(b.elem) || '%'
  );
$$;


-- ── Helper: keyword match score ────────────────────────────────────────────
-- Checks if a keyword appears (case-insensitive) anywhere in a text array.
-- Returns 1 if found, 0 if not. Used for niche/flag matching.

CREATE OR REPLACE FUNCTION keyword_in_array(keyword TEXT, arr TEXT[])
RETURNS INTEGER
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT CASE WHEN EXISTS (
    SELECT 1 FROM unnest(arr) elem
    WHERE lower(elem) LIKE '%' || lower(keyword) || '%'
  ) THEN 1 ELSE 0 END;
$$;


-- ── Core: audience alignment score ────────────────────────────────────────
-- p_podcast_id  — the podcast to evaluate
-- p_user_id     — the creator whose profile we are matching against
--
-- Returns INTEGER 0–100.

CREATE OR REPLACE FUNCTION compute_audience_alignment_score(
  p_podcast_id UUID,
  p_user_id    UUID
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  pod              RECORD;
  creator          RECORD;

  -- Raw scores per dimension (each 0–100 before weighting)
  v_topic          INTEGER := 0;
  v_audience       INTEGER := 0;
  v_industry       INTEGER := 0;
  v_relevance      INTEGER := 0;
  v_niche          INTEGER := 0;

  -- Helpers
  v_overlap        INTEGER;
  v_total          INTEGER;
  v_final          INTEGER;

  -- Weights (must sum to 100)
  w_topic          CONSTANT INTEGER := 30;
  w_audience       CONSTANT INTEGER := 25;
  w_industry       CONSTANT INTEGER := 20;
  w_relevance      CONSTANT INTEGER := 15;
  w_niche          CONSTANT INTEGER := 10;
BEGIN
  -- Load podcast
  SELECT * INTO pod FROM public.podcasts WHERE id = p_podcast_id;
  IF NOT FOUND THEN RETURN 0; END IF;

  -- Load creator profile
  SELECT * INTO creator FROM public.creator_profiles WHERE user_id = p_user_id;
  IF NOT FOUND THEN RETURN 0; END IF;

  -- Hard gate: if podcast doesn't accept guests, alignment is irrelevant
  IF NOT COALESCE(pod.accepts_guests, true) THEN RETURN 0; END IF;

  -- ── Dimension 1: Topic Overlap (weight 30) ────────────────────────────
  -- creator.speaking_topics vs podcast guest_expertise_areas + audience_goals
  -- The more the creator's topics match what the podcast covers, the better.

  v_overlap := array_overlap_count(
    creator.speaking_topics,
    pod.guest_expertise_areas || pod.audience_goals || pod.audience_pain_points
  );
  v_total := GREATEST(1, array_length(creator.speaking_topics, 1));

  v_topic := LEAST(100, (v_overlap * 100) / v_total);

  -- Bonus: creator category keyword appears in podcast description
  IF pod.description IS NOT NULL AND creator.category IS NOT NULL THEN
    IF lower(pod.description) LIKE '%' || lower(creator.category) || '%' THEN
      v_topic := LEAST(100, v_topic + 15);
    END IF;
  END IF;

  -- ── Dimension 2: Audience Overlap (weight 25) ─────────────────────────
  -- creator.speaking_topics vs podcast target_audience + audience_pain_points
  -- Evaluates whether the creator addresses the same people the podcast serves.

  v_overlap := array_overlap_count(
    creator.speaking_topics,
    ARRAY[COALESCE(pod.target_audience, '')] || pod.audience_pain_points
  );
  v_total := GREATEST(1, array_length(creator.speaking_topics, 1));

  v_audience := LEAST(100, (v_overlap * 100) / v_total);

  -- Bonus: podcast geographic focus matches (global = no penalty)
  IF pod.geographic_focus IS NULL OR lower(pod.geographic_focus) = 'global' THEN
    v_audience := LEAST(100, v_audience + 10);
  END IF;

  -- ── Dimension 3: Industry Overlap (weight 20) ─────────────────────────
  -- creator.category vs podcast industry_focus[] + categories[]

  v_overlap := 0;
  IF creator.category IS NOT NULL THEN
    v_overlap := keyword_in_array(creator.category, pod.industry_focus)
               + keyword_in_array(creator.category, pod.categories);
  END IF;

  -- Also check speaking topics against industry_focus
  v_overlap := v_overlap + array_overlap_count(
    creator.speaking_topics,
    pod.industry_focus
  );

  v_industry := LEAST(100, v_overlap * 33);

  -- ── Dimension 4: Creator Relevance (weight 15) ────────────────────────
  -- creator.archetype vs podcast guest_experience_level + guest_expertise_areas
  -- Does the podcast seek the type of guest this creator is?

  v_relevance := 50; -- Base: unknown = neutral

  -- Guest experience level match
  IF pod.guest_experience_level IS NOT NULL AND creator.archetype IS NOT NULL THEN
    v_relevance := v_relevance + CASE
      WHEN pod.guest_experience_level = 'any'         THEN 30
      WHEN pod.guest_experience_level = 'expert'
        AND lower(creator.archetype) LIKE '%expert%'  THEN 40
      WHEN pod.guest_experience_level = 'established'
        AND lower(creator.archetype) IN ('expert','thought leader','author','speaker') THEN 30
      WHEN pod.guest_experience_level = 'emerging'    THEN 20
      ELSE 0
    END;
  END IF;

  -- Creator's speaking topics match guest expertise areas the show wants
  IF creator.speaking_topics IS NOT NULL AND pod.guest_expertise_areas IS NOT NULL THEN
    v_overlap := array_overlap_count(creator.speaking_topics, pod.guest_expertise_areas);
    IF v_overlap > 0 THEN
      v_relevance := LEAST(100, v_relevance + (v_overlap * 10));
    END IF;
  END IF;

  v_relevance := LEAST(100, GREATEST(0, v_relevance));

  -- ── Dimension 5: Niche Relevance (weight 10) ──────────────────────────
  -- Match creator category/topics against podcast boolean flags.
  -- Each matching flag adds points. Mismatches on hard niches subtract.

  v_niche := 50; -- Base: neutral

  IF creator.category IS NOT NULL THEN
    -- Faith-based alignment
    IF pod.faith_based AND lower(creator.category) LIKE '%faith%' THEN
      v_niche := LEAST(100, v_niche + 30);
    END IF;
    IF pod.faith_based AND lower(creator.category) NOT LIKE '%faith%'
      AND lower(creator.category) NOT LIKE '%spiritual%'
      AND lower(creator.category) NOT LIKE '%christian%' THEN
      v_niche := GREATEST(0, v_niche - 20); -- Faith-specific show, non-faith creator
    END IF;

    -- Business alignment
    IF pod.business_focused AND (
      lower(creator.category) LIKE '%business%'
      OR lower(creator.category) LIKE '%entrepreneur%'
      OR lower(creator.category) LIKE '%leadership%'
    ) THEN
      v_niche := LEAST(100, v_niche + 20);
    END IF;

    -- Personal development alignment
    IF pod.personal_development AND (
      lower(creator.category) LIKE '%personal%'
      OR lower(creator.category) LIKE '%motivat%'
      OR lower(creator.category) LIKE '%coach%'
    ) THEN
      v_niche := LEAST(100, v_niche + 20);
    END IF;

    -- Leadership alignment
    IF pod.leadership_focused AND lower(creator.category) LIKE '%leader%' THEN
      v_niche := LEAST(100, v_niche + 20);
    END IF;

    -- Entrepreneurship alignment
    IF pod.entrepreneurship_focused AND (
      lower(creator.category) LIKE '%entrepreneur%'
      OR lower(creator.category) LIKE '%startup%'
      OR lower(creator.category) LIKE '%founder%'
    ) THEN
      v_niche := LEAST(100, v_niche + 20);
    END IF;
  END IF;

  -- Bonus: creator speaking topics appear in niche arrays
  v_overlap := array_overlap_count(creator.speaking_topics, pod.audience_goals);
  IF v_overlap > 0 THEN
    v_niche := LEAST(100, v_niche + (v_overlap * 5));
  END IF;

  v_niche := LEAST(100, GREATEST(0, v_niche));

  -- ── Weighted composite ────────────────────────────────────────────────
  v_final := (
    (v_topic     * w_topic)    +
    (v_audience  * w_audience) +
    (v_industry  * w_industry) +
    (v_relevance * w_relevance)+
    (v_niche     * w_niche)
  ) / 100;

  RETURN LEAST(100, GREATEST(0, v_final));
END;
$$;


-- ── Full match quality score including alignment ───────────────────────────
-- Returns a single composite score for ranking a podcast against a creator.
-- Weights:
--   audience_alignment    35% — most important: right audience for this creator
--   authority             20% — credibility of the show
--   guest_friendliness    20% — how easy it is to get on
--   response_probability  15% — how likely they are to reply
--   visibility            10% — reach/exposure value

CREATE OR REPLACE FUNCTION compute_match_quality_with_alignment(
  p_podcast_id UUID,
  p_user_id    UUID
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  pod              RECORD;
  v_alignment      INTEGER;
  v_composite      INTEGER;
BEGIN
  SELECT * INTO pod FROM public.podcasts WHERE id = p_podcast_id;
  IF NOT FOUND THEN RETURN 0; END IF;

  v_alignment := compute_audience_alignment_score(p_podcast_id, p_user_id);

  v_composite := (
    (v_alignment            * 35) +
    (pod.authority_score    * 20) +
    (pod.guest_friendliness_score * 20) +
    (pod.response_probability_score * 15) +
    (pod.visibility_score   * 10)
  ) / 100;

  RETURN LEAST(100, GREATEST(0, v_composite));
END;
$$;


-- ── Batch: update audience_alignment_score for one user ───────────────────
-- Call this after a creator completes their DNA assessment or updates profile.
-- Scores all podcasts against that creator and stores the result.
-- Returns count of podcasts scored.

CREATE OR REPLACE FUNCTION refresh_alignment_scores_for_user(p_user_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_count  INTEGER := 0;
  v_pod_id UUID;
  v_score  INTEGER;
BEGIN
  FOR v_pod_id IN
    SELECT id FROM public.podcasts
    WHERE accepts_guests = true
      AND activity_status <> 'inactive'
      AND is_duplicate = false
  LOOP
    v_score := compute_audience_alignment_score(v_pod_id, p_user_id);

    UPDATE public.podcasts
    SET
      audience_alignment_score = v_score,
      match_quality_score      = compute_match_quality_with_alignment(v_pod_id, p_user_id)
    WHERE id = v_pod_id;

    v_count := v_count + 1;
  END LOOP;

  RETURN v_count;
END;
$$;


-- ── Grant execute to authenticated users ──────────────────────────────────
-- compute_match_quality_with_alignment can be called from the API layer
-- via supabase.rpc() to get a real-time score for any podcast/creator pair.

GRANT EXECUTE ON FUNCTION compute_audience_alignment_score(UUID, UUID)    TO authenticated;
GRANT EXECUTE ON FUNCTION compute_match_quality_with_alignment(UUID, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION refresh_alignment_scores_for_user(UUID)          TO authenticated;
