-- ═══════════════════════════════════════════════════════════════════════════
--  PodcastMatch AI — Phase 2: Data Cleanup & Validation
--  Migration 009: Functions for deduplication, abandonment flagging,
--                 category normalization, and URL/email validation.
--
--  These are utility functions — run manually or schedule via pg_cron.
--  None of them modify data destructively (flag only, never delete).
--
--  Run AFTER migrations 007 and 008.
-- ═══════════════════════════════════════════════════════════════════════════

-- ── 1. Duplicate Detection ────────────────────────────────────────────────
-- Flags records with the same RSS feed URL as duplicates.
-- The oldest record (earliest created_at) is kept; others are flagged.
-- Returns: count of records flagged as duplicates.

CREATE OR REPLACE FUNCTION flag_duplicate_podcasts()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_count INTEGER := 0;
BEGIN
  -- Reset existing duplicate flags first (re-runnable)
  UPDATE public.podcasts SET is_duplicate = false, duplicate_of = NULL
  WHERE is_duplicate = true;

  -- Flag RSS-feed duplicates — keep the earliest created row
  WITH keepers AS (
    SELECT DISTINCT ON (rss_feed_url) id, rss_feed_url
    FROM public.podcasts
    WHERE rss_feed_url IS NOT NULL
    ORDER BY rss_feed_url, created_at ASC
  ),
  dupes AS (
    SELECT p.id AS dupe_id, k.id AS keeper_id
    FROM public.podcasts p
    JOIN keepers k ON k.rss_feed_url = p.rss_feed_url
    WHERE p.id <> k.id
  )
  UPDATE public.podcasts p
  SET is_duplicate = true, duplicate_of = dupes.keeper_id
  FROM dupes
  WHERE p.id = dupes.dupe_id;

  GET DIAGNOSTICS v_count = ROW_COUNT;

  -- Also flag name+host duplicates (no RSS feed on either)
  WITH name_keepers AS (
    SELECT DISTINCT ON (lower(podcast_name), lower(host_name)) id
    FROM public.podcasts
    WHERE rss_feed_url IS NULL
    ORDER BY lower(podcast_name), lower(host_name), created_at ASC
  ),
  name_dupes AS (
    SELECT p.id AS dupe_id, nk.id AS keeper_id
    FROM public.podcasts p
    JOIN name_keepers nk
      ON lower(p.podcast_name) = (
           SELECT lower(p2.podcast_name) FROM public.podcasts p2 WHERE p2.id = nk.id
         )
      AND lower(p.host_name) = (
           SELECT lower(p2.host_name) FROM public.podcasts p2 WHERE p2.id = nk.id
         )
    WHERE p.id <> nk.id
      AND p.rss_feed_url IS NULL
      AND NOT p.is_duplicate
  )
  UPDATE public.podcasts p
  SET is_duplicate = true, duplicate_of = name_dupes.keeper_id
  FROM name_dupes
  WHERE p.id = name_dupes.dupe_id;

  GET DIAGNOSTICS v_count = v_count + ROW_COUNT;
  RETURN v_count;
END;
$$;


-- ── 2. Abandoned Podcast Detection ───────────────────────────────────────
-- Flags podcasts with no episode in > 12 months as abandoned.
-- Also sets activity_status = 'inactive'.
-- Returns: count of newly flagged records.

CREATE OR REPLACE FUNCTION flag_abandoned_podcasts()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_count INTEGER := 0;
BEGIN
  UPDATE public.podcasts
  SET
    abandoned_flag  = true,
    activity_status = 'inactive'
  WHERE (
    -- Last episode more than 12 months ago
    (last_episode_date IS NOT NULL
      AND last_episode_date < CURRENT_DATE - INTERVAL '365 days')
    OR
    -- No episode date and record is older than 6 months
    (last_episode_date IS NULL
      AND created_at < now() - INTERVAL '180 days')
  )
  AND abandoned_flag = false
  AND activity_status <> 'inactive';

  GET DIAGNOSTICS v_count = ROW_COUNT;
  RETURN v_count;
END;
$$;


-- ── 3. Category Standardization ──────────────────────────────────────────
-- Maps common raw category strings into our internal taxonomy.
-- Only updates rows where category_standardized = false.
-- Returns: count of rows updated.

CREATE OR REPLACE FUNCTION standardize_podcast_categories()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_count INTEGER := 0;
BEGIN
  -- Normalize common Apple/Spotify categories to our internal labels
  UPDATE public.podcasts
  SET
    category = CASE
      WHEN lower(category) LIKE '%entrepreneur%'                      THEN 'Entrepreneurship'
      WHEN lower(category) LIKE '%business%'                          THEN 'Business'
      WHEN lower(category) LIKE '%leadership%'                        THEN 'Leadership'
      WHEN lower(category) LIKE '%personal develop%'
        OR lower(category) LIKE '%self improve%'                      THEN 'Personal Development'
      WHEN lower(category) LIKE '%faith%'
        OR lower(category) LIKE '%spiritual%'
        OR lower(category) LIKE '%christian%'                         THEN 'Faith & Spirituality'
      WHEN lower(category) LIKE '%health%'
        OR lower(category) LIKE '%wellness%'                          THEN 'Health & Wellness'
      WHEN lower(category) LIKE '%mental health%'
        OR lower(category) LIKE '%mental illness%'                    THEN 'Mental Health'
      WHEN lower(category) LIKE '%recover%'
        OR lower(category) LIKE '%sobriety%'
        OR lower(category) LIKE '%addiction%'                         THEN 'Recovery'
      WHEN lower(category) LIKE '%sport%'
        OR lower(category) LIKE '%athlete%'
        OR lower(category) LIKE '%performance%'                       THEN 'Sports & Performance'
      WHEN lower(category) LIKE '%parent%'
        OR lower(category) LIKE '%family%'                            THEN 'Parenting'
      WHEN lower(category) LIKE '%true crime%'
        OR lower(category) LIKE '%storytelling%'                      THEN 'True Crime & Storytelling'
      WHEN lower(category) LIKE '%society%'
        OR lower(category) LIKE '%culture%'
        OR lower(category) LIKE '%science%'                           THEN 'Society & Culture'
      WHEN lower(category) LIKE '%motivat%'
        OR lower(category) LIKE '%inspir%'                            THEN 'Motivation'
      ELSE category  -- keep as-is if no match
    END,
    category_standardized = true
  WHERE category_standardized = false;

  GET DIAGNOSTICS v_count = ROW_COUNT;
  RETURN v_count;
END;
$$;


-- ── 4. Contact Validation ─────────────────────────────────────────────────
-- View that surfaces records with malformed emails or dead-looking URLs.
-- Use this to prioritize manual review — it never modifies data.

CREATE OR REPLACE VIEW podcast_contact_validation AS
SELECT
  id,
  slug,
  podcast_name,
  host_name,
  activity_status,
  contact_method_rank,
  contact_confidence,

  -- Email format checks (basic regex)
  CASE WHEN producer_email IS NOT NULL
    AND producer_email NOT LIKE '%@%.%' THEN 'INVALID'
    ELSE 'ok'
  END AS producer_email_status,

  CASE WHEN host_email IS NOT NULL
    AND host_email NOT LIKE '%@%.%' THEN 'INVALID'
    ELSE 'ok'
  END AS host_email_status,

  CASE WHEN booking_email IS NOT NULL
    AND booking_email NOT LIKE '%@%.%' THEN 'INVALID'
    ELSE 'ok'
  END AS booking_email_status,

  -- URL format checks
  CASE WHEN website IS NOT NULL
    AND website NOT LIKE 'http%' THEN 'MISSING_PROTOCOL'
    ELSE 'ok'
  END AS website_status,

  CASE WHEN contact_form_url IS NOT NULL
    AND contact_form_url NOT LIKE 'http%' THEN 'MISSING_PROTOCOL'
    ELSE 'ok'
  END AS contact_form_status,

  -- Flag records that need attention
  CASE
    WHEN is_duplicate THEN 'duplicate'
    WHEN abandoned_flag THEN 'abandoned'
    WHEN contact_method_rank = 7 THEN 'no_contact'
    WHEN contact_confidence = 'low' AND NOT outreach_ready THEN 'needs_verification'
    ELSE 'ok'
  END AS overall_status,

  website_verified,
  website_verified_at,
  last_verified_at,
  notes

FROM public.podcasts
ORDER BY
  CASE WHEN is_duplicate THEN 0
       WHEN abandoned_flag THEN 1
       WHEN contact_method_rank = 7 THEN 2
       ELSE 3
  END,
  podcast_name;


-- ── 5. Intelligence Summary View ─────────────────────────────────────────
-- Quick overview of the database health and scoring distribution.

CREATE OR REPLACE VIEW podcast_intelligence_summary AS
SELECT
  COUNT(*)                                          AS total_podcasts,
  COUNT(*) FILTER (WHERE activity_status = 'active')    AS active,
  COUNT(*) FILTER (WHERE activity_status = 'hiatus')    AS on_hiatus,
  COUNT(*) FILTER (WHERE activity_status = 'inactive')  AS inactive,
  COUNT(*) FILTER (WHERE abandoned_flag)                AS abandoned,
  COUNT(*) FILTER (WHERE is_duplicate)                  AS duplicates,
  COUNT(*) FILTER (WHERE accepts_guests)                AS accepts_guests,
  COUNT(*) FILTER (WHERE outreach_ready)                AS outreach_ready,
  COUNT(*) FILTER (WHERE contact_method_rank = 1)       AS has_booking_form,
  COUNT(*) FILTER (WHERE contact_method_rank = 2)       AS has_producer_email,
  COUNT(*) FILTER (WHERE contact_method_rank = 7)       AS no_contact,
  COUNT(*) FILTER (WHERE faith_based)                   AS faith_based,
  COUNT(*) FILTER (WHERE business_focused)              AS business_focused,
  COUNT(*) FILTER (WHERE personal_development)          AS personal_development,
  COUNT(*) FILTER (WHERE leadership_focused)            AS leadership_focused,
  COUNT(*) FILTER (WHERE entrepreneurship_focused)      AS entrepreneurship_focused,
  ROUND(AVG(authority_score))                           AS avg_authority_score,
  ROUND(AVG(guest_friendliness_score))                  AS avg_friendliness_score,
  ROUND(AVG(visibility_score))                          AS avg_visibility_score,
  ROUND(AVG(response_probability_score))                AS avg_response_score,
  COUNT(*) FILTER (WHERE enrichment_status = 'complete') AS fully_enriched,
  COUNT(*) FILTER (WHERE curated)                       AS curated
FROM public.podcasts;


-- ── Run cleanup on existing data ──────────────────────────────────────────

SELECT flag_abandoned_podcasts();
SELECT standardize_podcast_categories();
SELECT flag_duplicate_podcasts();
