/* ═══════════════════════════════════════════════════════════
   Migration 014 — Admin Metrics Dashboard Functions
   SECURITY DEFINER — bypasses RLS to aggregate cross-user data.
   Access restricted to service_role only (called from admin client).

   RUN IN SUPABASE STUDIO → SQL Editor.
   ═══════════════════════════════════════════════════════════ */

/* ── Section 1: Activation metrics ─────────────────────────── */
CREATE OR REPLACE FUNCTION public.get_admin_activation_metrics()
RETURNS JSON
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public
AS $$
  WITH
  reg AS (
    SELECT COUNT(DISTINCT user_id) AS n
    FROM analytics_events
    WHERE event = 'user_registered' AND user_id IS NOT NULL
  ),
  activated AS (
    SELECT COUNT(DISTINCT user_id) AS n
    FROM analytics_events
    WHERE event = 'match_viewed' AND user_id IS NOT NULL
  ),
  cta AS (
    SELECT COUNT(DISTINCT user_id) AS n
    FROM analytics_events
    WHERE event IN ('clicked_apply','clicked_email','clicked_linkedin','clicked_instagram')
      AND user_id IS NOT NULL
  ),
  tta AS (
    SELECT ROUND(
      AVG(EXTRACT(EPOCH FROM (fc.first_at - r.registered_at)) / 3600)::NUMERIC, 1
    ) AS avg_hours
    FROM (
      SELECT user_id, MIN(occurred_at) AS registered_at
      FROM analytics_events WHERE event = 'user_registered' AND user_id IS NOT NULL
      GROUP BY user_id
    ) r
    JOIN (
      SELECT user_id, MIN(occurred_at) AS first_at
      FROM analytics_events
      WHERE event IN ('clicked_apply','clicked_email','clicked_linkedin','clicked_instagram')
        AND user_id IS NOT NULL
      GROUP BY user_id
    ) fc ON r.user_id = fc.user_id
    WHERE fc.first_at > r.registered_at
  )
  SELECT json_build_object(
    'total_users',                reg.n,
    'activated_users',            activated.n,
    'cta_users',                  cta.n,
    'avg_hours_to_first_action',  tta.avg_hours
  )
  FROM reg, activated, cta, tta;
$$;

REVOKE ALL ON FUNCTION public.get_admin_activation_metrics() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_admin_activation_metrics() TO service_role;


/* ── Section 2: Engagement metrics ─────────────────────────── */
CREATE OR REPLACE FUNCTION public.get_admin_engagement_metrics()
RETURNS JSON
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public
AS $$
  WITH
  outreach_stats AS (
    SELECT
      COUNT(*)                  AS total_outreaches,
      COUNT(DISTINCT user_id)   AS total_users
    FROM outreach_log
  ),
  avg_stat AS (
    SELECT ROUND(
      COUNT(*)::NUMERIC / NULLIF(COUNT(DISTINCT user_id), 0), 1
    ) AS avg_per_user
    FROM outreach_log
  ),
  first_events AS (
    SELECT user_id, MIN(occurred_at) AS first_at
    FROM analytics_events WHERE user_id IS NOT NULL
    GROUP BY user_id
  ),
  returners AS (
    SELECT COUNT(DISTINCT ae.user_id) AS n
    FROM analytics_events ae
    JOIN first_events fe ON ae.user_id = fe.user_id
    WHERE ae.occurred_at > fe.first_at + INTERVAL '24 hours'
      AND ae.occurred_at <= fe.first_at + INTERVAL '72 hours'
  ),
  all_users AS (
    SELECT COUNT(DISTINCT user_id) AS n
    FROM analytics_events WHERE user_id IS NOT NULL
  ),
  checkin AS (
    SELECT ROUND(
      COUNT(*) FILTER (WHERE followed_up OR got_response OR got_booked)::NUMERIC
      / NULLIF(COUNT(*), 0) * 100, 1
    ) AS rate
    FROM outreach_log
  )
  SELECT json_build_object(
    'total_outreaches',        os.total_outreaches,
    'total_outreach_users',    os.total_users,
    'avg_outreach_per_user',   av.avg_per_user,
    'return_rate',             ROUND(r.n::NUMERIC / NULLIF(u.n, 0) * 100, 1),
    'checkin_completion_rate', ci.rate
  )
  FROM outreach_stats os, avg_stat av, returners r, all_users u, checkin ci;
$$;

REVOKE ALL ON FUNCTION public.get_admin_engagement_metrics() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_admin_engagement_metrics() TO service_role;


/* ── Section 3: Outcome metrics ─────────────────────────────── */
CREATE OR REPLACE FUNCTION public.get_admin_outcome_metrics()
RETURNS JSON
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT json_build_object(
    'total_outreaches', COUNT(*),
    'responses',        COUNT(*) FILTER (WHERE got_response),
    'bookings',         COUNT(*) FILTER (WHERE got_booked),
    'follow_ups',       COUNT(*) FILTER (WHERE followed_up),
    'response_rate',    ROUND(COUNT(*) FILTER (WHERE got_response)::NUMERIC / NULLIF(COUNT(*), 0) * 100, 1),
    'booking_rate',     ROUND(COUNT(*) FILTER (WHERE got_booked)::NUMERIC   / NULLIF(COUNT(*), 0) * 100, 1),
    'follow_up_rate',   ROUND(COUNT(*) FILTER (WHERE followed_up)::NUMERIC  / NULLIF(COUNT(*), 0) * 100, 1)
  )
  FROM outreach_log;
$$;

REVOKE ALL ON FUNCTION public.get_admin_outcome_metrics() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_admin_outcome_metrics() TO service_role;


/* ── Section 4a: Top converting podcasts ────────────────────── */
CREATE OR REPLACE FUNCTION public.get_admin_top_podcasts()
RETURNS TABLE (
  podcast_name  TEXT,
  attempts      BIGINT,
  response_rate NUMERIC,
  booking_rate  NUMERIC
)
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    ol.podcast_name::TEXT,
    COUNT(*)::BIGINT                                                     AS attempts,
    ROUND(COUNT(*) FILTER (WHERE ol.got_response)::NUMERIC / NULLIF(COUNT(*), 0) * 100, 1) AS response_rate,
    ROUND(COUNT(*) FILTER (WHERE ol.got_booked)::NUMERIC   / NULLIF(COUNT(*), 0) * 100, 1) AS booking_rate
  FROM outreach_log ol
  WHERE ol.podcast_name IS NOT NULL
  GROUP BY ol.podcast_id, ol.podcast_name
  ORDER BY booking_rate DESC NULLS LAST, response_rate DESC NULLS LAST, COUNT(*) DESC
  LIMIT 15;
$$;

REVOKE ALL ON FUNCTION public.get_admin_top_podcasts() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_admin_top_podcasts() TO service_role;


/* ── Section 4b: Match score vs outcome correlation ─────────── */
CREATE OR REPLACE FUNCTION public.get_admin_match_score_correlation()
RETURNS TABLE (
  score_bucket  TEXT,
  attempts      BIGINT,
  response_rate NUMERIC,
  booking_rate  NUMERIC
)
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    CASE
      WHEN p.match_quality_score < 40 THEN '0–39'
      WHEN p.match_quality_score < 60 THEN '40–59'
      WHEN p.match_quality_score < 75 THEN '60–74'
      WHEN p.match_quality_score < 90 THEN '75–89'
      ELSE '90+'
    END::TEXT                                                              AS score_bucket,
    COUNT(*)::BIGINT                                                       AS attempts,
    ROUND(COUNT(*) FILTER (WHERE ol.got_response)::NUMERIC / NULLIF(COUNT(*), 0) * 100, 1) AS response_rate,
    ROUND(COUNT(*) FILTER (WHERE ol.got_booked)::NUMERIC   / NULLIF(COUNT(*), 0) * 100, 1) AS booking_rate
  FROM outreach_log ol
  JOIN podcasts p ON (
    ol.podcast_id ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
    AND ol.podcast_id::uuid = p.id
  )
  WHERE p.match_quality_score IS NOT NULL
  GROUP BY score_bucket
  ORDER BY MIN(p.match_quality_score);
$$;

REVOKE ALL ON FUNCTION public.get_admin_match_score_correlation() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_admin_match_score_correlation() TO service_role;
