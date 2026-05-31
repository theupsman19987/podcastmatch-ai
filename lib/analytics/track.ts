"use server"

/*
 * Lightweight in-app event tracking backed by Supabase.
 * No third-party SDK required — all data stays in your database.
 *
 * FUTURE AI INTEGRATION POINT:
 * Replace or augment with PostHog / Plausible / GA4 by adding
 * their SDK calls alongside the Supabase insert below.
 */

import { createClient } from "@/lib/supabase/server"

/* ── Event catalogue ─────────────────────────────────────────── */
export type AnalyticsEvent =
  | "user_registered"
  | "dna_completed"
  | "profile_viewed"
  | "match_viewed"
  | "podcast_saved"
  | "podcast_unsaved"
  | "checkout_started"
  | "subscription_created"
  | "subscription_cancelled"
  | "feedback_submitted"
  | "waitlist_joined"
  | "discovery_searched"
  | "load_more_clicked"

export interface TrackPayload {
  event:      AnalyticsEvent
  properties?: Record<string, unknown>
}

/* ── Server action ───────────────────────────────────────────── */
export async function trackEvent(payload: TrackPayload): Promise<void> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    await supabase.from("analytics_events").insert({
      user_id:     user?.id ?? null,
      event:       payload.event,
      properties:  JSON.parse(JSON.stringify(payload.properties ?? {})) as import("@/lib/supabase/database.types").Json,
      occurred_at: new Date().toISOString(),
    })
  } catch {
    /* Never throw — analytics must not break the app */
  }
}

/* ── Client-side helper (calls the server action) ────────────── */
export async function trackClientEvent(payload: TrackPayload): Promise<void> {
  await trackEvent(payload)
}
