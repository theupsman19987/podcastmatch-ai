/* ═══════════════════════════════════════════════════════════
   Migration 005 — Outreach Log
   Tracks the full lifecycle of a user's podcast outreach
   attempt: initiated → followed up → got response → booked.

   RUN IN SUPABASE STUDIO → SQL Editor.
   ═══════════════════════════════════════════════════════════ */

CREATE TABLE IF NOT EXISTS public.outreach_log (
  id                   UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id              UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  /* Podcast context */
  podcast_id           TEXT        NOT NULL,
  podcast_name         TEXT        NOT NULL,

  /* Which method was used and the exact URL/email */
  contact_method_rank  INTEGER     NOT NULL CHECK (contact_method_rank BETWEEN 1 AND 6),
  contact_value        TEXT,          -- the URL or email address actually used

  /* When did the user initiate contact */
  contacted_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  /* Outcome steps (set by the user via check-in prompts) */
  followed_up          BOOLEAN     NOT NULL DEFAULT FALSE,
  followed_up_at       TIMESTAMPTZ,
  got_response         BOOLEAN     NOT NULL DEFAULT FALSE,
  got_response_at      TIMESTAMPTZ,
  got_booked           BOOLEAN     NOT NULL DEFAULT FALSE,
  got_booked_at        TIMESTAMPTZ,

  notes                TEXT,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

/* ── RLS — user can only read/write their own rows ─────── */
ALTER TABLE public.outreach_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "outreach_log: user select"
  ON public.outreach_log FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "outreach_log: user insert"
  ON public.outreach_log FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "outreach_log: user update"
  ON public.outreach_log FOR UPDATE
  USING (auth.uid() = user_id);

/* ── Indexes ───────────────────────────────────────────── */
CREATE INDEX outreach_log_user_idx      ON public.outreach_log(user_id);
CREATE INDEX outreach_log_podcast_idx   ON public.outreach_log(podcast_id);
CREATE INDEX outreach_log_time_idx      ON public.outreach_log(contacted_at DESC);
CREATE INDEX outreach_log_method_idx    ON public.outreach_log(contact_method_rank);
CREATE INDEX outreach_log_pending_idx   ON public.outreach_log(user_id, got_booked, contacted_at DESC);
