"use server"

/* ═══════════════════════════════════════════════════════════
   Outreach Intelligence — aggregate performance data that
   feeds back into matching and contact method signals.

   Uses SECURITY DEFINER RPCs so individual outreach rows
   stay private behind RLS while aggregate signals are
   shared to improve outcomes for all users.
   ═══════════════════════════════════════════════════════════ */

import { createClient } from "@/lib/supabase/server"

/* ── Shared types ────────────────────────────────────────── */
export interface ContactMethodStats {
  attempts:     number
  responses:    number
  bookings:     number
  responseRate: number   // 0–100
  bookingRate:  number   // 0–100
}

export type ContactMethodPerformanceMap = Record<number, ContactMethodStats>

export interface PodcastStats {
  attempts:     number
  responses:    number
  bookings:     number
  responseRate: number
  bookingRate:  number
}

/* ── Fetch aggregate contact method performance ──────────── */
export async function getContactMethodPerformance(): Promise<ContactMethodPerformanceMap> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase.rpc("get_contact_method_performance")
    if (error || !data || !Array.isArray(data)) return {}

    return Object.fromEntries(
      (data as Array<{
        contact_method_rank: number
        total_outreaches:    string | number
        responses:           string | number
        bookings:            string | number
        response_rate:       string | number
        booking_rate:        string | number
      }>).map(row => [
        row.contact_method_rank,
        {
          attempts:     Number(row.total_outreaches),
          responses:    Number(row.responses),
          bookings:     Number(row.bookings),
          responseRate: Number(row.response_rate),
          bookingRate:  Number(row.booking_rate),
        },
      ])
    )
  } catch {
    return {}
  }
}

/* ── Fetch per-podcast performance ───────────────────────── */
export async function getPodcastPerformance(podcastId: string): Promise<PodcastStats | null> {
  try {
    const supabase = await createClient()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any).rpc("get_podcast_performance", {
      p_podcast_id: podcastId,
    })
    if (error || !data || !Array.isArray(data) || data.length === 0) return null

    const row = data[0] as {
      total_outreaches: string | number
      responses:        string | number
      bookings:         string | number
      response_rate:    string | number
      booking_rate:     string | number
    }

    return {
      attempts:     Number(row.total_outreaches),
      responses:    Number(row.responses),
      bookings:     Number(row.bookings),
      responseRate: Number(row.response_rate),
      bookingRate:  Number(row.booking_rate),
    }
  } catch {
    return null
  }
}

// Pure calculation utilities live in lib/outreach/boost.ts (client-safe, no "use server")
