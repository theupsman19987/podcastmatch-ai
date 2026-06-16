/* ═══════════════════════════════════════════════════════════
   Migration 006 — Performance Aggregate Functions
   SECURITY DEFINER functions compute aggregate stats across
   ALL users without exposing individual rows (RLS-safe).

   RUN IN SUPABASE STUDIO → SQL Editor.
   ═══════════════════════════════════════════════════════════ */

/* ── Contact method performance (global aggregate) ──────── */
CREATE OR REPLACE FUNCTION public.get_contact_method_performance()
RETURNS TABLE (
  contact_method_rank  INTEGER,
  total_outreaches     BIGINT,
  responses            BIGINT,
  bookings             BIGINT,
  response_rate        NUMERIC,
  booking_rate         NUMERIC
)
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    contact_method_rank,
    COUNT(*)                                        AS total_outreaches,
    COUNT(*) FILTER (WHERE got_response)            AS responses,
    COUNT(*) FILTER (WHERE got_booked)              AS bookings,
    ROUND(
      COUNT(*) FILTER (WHERE got_response)::NUMERIC
      / NULLIF(COUNT(*), 0) * 100, 1
    )                                               AS response_rate,
    ROUND(
      COUNT(*) FILTER (WHERE got_booked)::NUMERIC
      / NULLIF(COUNT(*), 0) * 100, 1
    )                                               AS booking_rate
  FROM public.outreach_log
  GROUP BY contact_method_rank
  HAVING COUNT(*) >= 3        -- only expose ranks with meaningful sample size
  ORDER BY contact_method_rank;
$$;

GRANT EXECUTE ON FUNCTION public.get_contact_method_performance() TO authenticated, anon;

/* ── Per-podcast performance (aggregate by podcast_id) ───── */
CREATE OR REPLACE FUNCTION public.get_podcast_performance(p_podcast_id TEXT)
RETURNS TABLE (
  total_outreaches  BIGINT,
  responses         BIGINT,
  bookings          BIGINT,
  response_rate     NUMERIC,
  booking_rate      NUMERIC
)
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    COUNT(*)                                        AS total_outreaches,
    COUNT(*) FILTER (WHERE got_response)            AS responses,
    COUNT(*) FILTER (WHERE got_booked)              AS bookings,
    ROUND(
      COUNT(*) FILTER (WHERE got_response)::NUMERIC
      / NULLIF(COUNT(*), 0) * 100, 1
    )                                               AS response_rate,
    ROUND(
      COUNT(*) FILTER (WHERE got_booked)::NUMERIC
      / NULLIF(COUNT(*), 0) * 100, 1
    )                                               AS booking_rate
  FROM public.outreach_log
  WHERE podcast_id = p_podcast_id
  HAVING COUNT(*) >= 3;
$$;

GRANT EXECUTE ON FUNCTION public.get_podcast_performance(TEXT) TO authenticated, anon;
