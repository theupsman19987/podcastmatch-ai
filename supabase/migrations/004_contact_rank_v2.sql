-- ═══════════════════════════════════════════════════════════════════════════
--  PodcastMatch AI — Contact Rank v2
--  Migration 004: update contact_method_rank priority order
--
--  CHANGE: booking forms (contact_form_url / booking_link) are now rank 1.
--  Real-world insight: podcasts prefer structured guest submissions over
--  cold emails — forms reach the right person and are actively monitored.
--
--  OLD priority: producer_email(1) > host_email(2) > booking_email(3) > form(4)
--  NEW priority: booking_form(1)   > producer_email(2) > booking_email(3) > host_email(4)
--
--  PostgreSQL does not support ALTER COLUMN on GENERATED columns.
--  We must DROP and re-ADD the column — all stored values are recomputed.
--
--  Paste into: Supabase Studio → SQL Editor → New Query → Run
-- ═══════════════════════════════════════════════════════════════════════════

ALTER TABLE public.podcasts DROP COLUMN IF EXISTS contact_method_rank;

ALTER TABLE public.podcasts ADD COLUMN contact_method_rank INTEGER GENERATED ALWAYS AS (
  CASE
    -- Rank 1: booking form (contact form URL or direct booking link)
    --         Preferred by most podcasts — submissions reach the booker
    WHEN contact_form_url IS NOT NULL OR booking_link IS NOT NULL THEN 1
    -- Rank 2: producer email — the person who actually manages guest bookings
    WHEN producer_email   IS NOT NULL THEN 2
    -- Rank 3: dedicated booking email — usually monitored specifically for pitches
    WHEN booking_email    IS NOT NULL THEN 3
    -- Rank 4: host email — direct but host may not manage their own calendar
    WHEN host_email       IS NOT NULL THEN 4
    -- Rank 5: LinkedIn — professional cold intro when no direct contact exists
    WHEN linkedin_url     IS NOT NULL THEN 5
    -- Rank 6: Instagram — last-resort social DM for lifestyle/personal shows
    WHEN instagram_url    IS NOT NULL THEN 6
    -- Rank 7: no known contact method — requires manual research
    ELSE 7
  END
) STORED;

-- Recreate the index on the updated column
DROP INDEX IF EXISTS podcasts_contact_rank_idx;
CREATE INDEX podcasts_contact_rank_idx ON public.podcasts (contact_method_rank);
