"use server"

/* ═══════════════════════════════════════════════════════════
   Outreach Log — server actions.
   Manages the lifecycle: initiated → followed up →
   got response → got booked.
   ═══════════════════════════════════════════════════════════ */

import { createClient } from "@/lib/supabase/server"
import { trackEvent } from "@/lib/analytics/track"

/* ── Types ───────────────────────────────────────────────── */
export interface OutreachLogRow {
  id:                  string
  podcast_id:          string
  podcast_name:        string
  contact_method_rank: number
  contact_value:       string | null
  contacted_at:        string
  followed_up:         boolean
  followed_up_at:      string | null
  got_response:        boolean
  got_response_at:     string | null
  got_booked:          boolean
  got_booked_at:       string | null
}

export type OutcomeStep = "followed_up" | "got_response" | "got_booked"

/* ── Log a new outreach attempt ──────────────────────────── */
export async function logOutreach(payload: {
  podcast_id:          string
  podcast_name:        string
  contact_method_rank: number
  contact_value?:      string
}): Promise<{ id: string } | null> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data, error } = await supabase
      .from("outreach_log")
      .insert({
        user_id:             user.id,
        podcast_id:          payload.podcast_id,
        podcast_name:        payload.podcast_name,
        contact_method_rank: payload.contact_method_rank,
        contact_value:       payload.contact_value ?? null,
        contacted_at:        new Date().toISOString(),
      })
      .select("id")
      .single()

    if (error || !data) return null
    return { id: data.id }
  } catch {
    return null
  }
}

/* ── Update an outcome step ──────────────────────────────── */
export async function updateOutcomeStep(
  outreachId: string,
  step:       OutcomeStep
): Promise<boolean> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return false

    const now = new Date().toISOString()
    const updateMap: Record<OutcomeStep, object> = {
      followed_up:  { followed_up: true,  followed_up_at: now },
      got_response: { got_response: true, got_response_at: now },
      got_booked:   { got_booked: true,   got_booked_at: now },
    }

    const { error, data } = await supabase
      .from("outreach_log")
      .update(updateMap[step])
      .eq("id", outreachId)
      .eq("user_id", user.id)  // RLS guard at app layer too
      .select("podcast_id, podcast_name, contact_method_rank")
      .single()

    if (error || !data) return false

    const eventMap: Record<OutcomeStep, "did_user_follow_up" | "did_user_get_response" | "did_user_get_booked"> = {
      followed_up:  "did_user_follow_up",
      got_response: "did_user_get_response",
      got_booked:   "did_user_get_booked",
    }

    await trackEvent({
      event: eventMap[step],
      properties: {
        outreach_id:         outreachId,
        podcast_id:          data.podcast_id,
        podcast_name:        data.podcast_name,
        contact_method_rank: data.contact_method_rank,
      },
    })

    return true
  } catch {
    return false
  }
}

/* ── Fetch pending check-ins for dashboard widget ────────── */
export async function getPendingOutcomes(limit = 5): Promise<OutreachLogRow[]> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []

    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()

    const { data, error } = await supabase
      .from("outreach_log")
      .select("id, podcast_id, podcast_name, contact_method_rank, contact_value, contacted_at, followed_up, followed_up_at, got_response, got_response_at, got_booked, got_booked_at")
      .eq("user_id", user.id)
      .eq("got_booked", false)
      .lte("contacted_at", threeDaysAgo)
      .order("contacted_at", { ascending: false })
      .limit(limit)

    if (error || !data) return []
    return data as OutreachLogRow[]
  } catch {
    return []
  }
}

/* ── Contact method conversion stats (Part 2 foundation) ── */
export async function getContactMethodStats(): Promise<
  Record<number, { attempts: number; responses: number; bookings: number; responseRate: number; bookingRate: number }>
> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return {}

    const { data, error } = await supabase
      .from("outreach_log")
      .select("contact_method_rank, got_response, got_booked")
      .eq("user_id", user.id)

    if (error || !data) return {}

    const stats: Record<number, { attempts: number; responses: number; bookings: number }> = {}
    for (const row of data) {
      const r = row.contact_method_rank
      if (!stats[r]) stats[r] = { attempts: 0, responses: 0, bookings: 0 }
      stats[r].attempts++
      if (row.got_response) stats[r].responses++
      if (row.got_booked)   stats[r].bookings++
    }

    return Object.fromEntries(
      Object.entries(stats).map(([rank, s]) => [
        rank,
        {
          ...s,
          responseRate: s.attempts > 0 ? Math.round((s.responses / s.attempts) * 100) : 0,
          bookingRate:  s.attempts > 0 ? Math.round((s.bookings  / s.attempts) * 100) : 0,
        },
      ])
    )
  } catch {
    return {}
  }
}
