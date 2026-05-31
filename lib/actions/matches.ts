"use server"

import { createClient } from "@/lib/supabase/server"
import type { DiscoveryPodcast } from "@/components/discovery/mock-data"
import type { MatchResult }      from "@/lib/matching/match-engine"
import type { Json }             from "@/lib/supabase/database.types"

/* ── Record that a match was viewed ──────────────────────── */
export async function recordMatchView(
  podcast:     DiscoveryPodcast,
  matchResult: MatchResult
): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return {}  // Silent — not critical

  const { error } = await supabase
    .from("match_history")
    .upsert(
      {
        user_id:     user.id,
        podcast_id:  podcast.id,
        match_score: podcast.matchScore,
        match_data:  JSON.parse(JSON.stringify(matchResult)) as Json,
        viewed_at:   new Date().toISOString(),
      },
      { onConflict: "user_id,podcast_id" }
    )

  if (error) return { error: error.message }
  return {}
}

/* ── Toggle saved state on a match ──────────────────────── */
export async function toggleSavedMatch(
  podcastId: string
): Promise<{ saved?: boolean; error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Not authenticated" }

  const { data: existing } = await supabase
    .from("match_history")
    .select("saved")
    .eq("user_id", user.id)
    .eq("podcast_id", podcastId)
    .maybeSingle()

  const newSaved = !(existing?.saved ?? false)

  const { error } = await supabase
    .from("match_history")
    .upsert(
      {
        user_id:     user.id,
        podcast_id:  podcastId,
        match_score: 0,
        match_data:  {} as Json,
        saved:       newSaved,
      },
      { onConflict: "user_id,podcast_id" }
    )

  if (error) return { error: error.message }
  return { saved: newSaved }
}

/* ── Get full match history ──────────────────────────────── */
export async function getMatchHistory(): Promise<{
  data?: Array<{
    podcast_id:  string
    match_score: number
    match_data:  unknown
    saved:       boolean
    viewed_at:   string | null
  }>
  error?: string
}> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Not authenticated" }

  const { data, error } = await supabase
    .from("match_history")
    .select("podcast_id, match_score, match_data, saved, viewed_at")
    .eq("user_id", user.id)
    .order("viewed_at", { ascending: false, nullsFirst: false })
    .limit(200)

  if (error) return { error: error.message }
  return { data: data ?? [] }
}

/* ── Get saved matches only ──────────────────────────────── */
export async function getSavedMatches(): Promise<{
  data?: string[]   // array of podcast_ids
  error?: string
}> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return {}

  const { data, error } = await supabase
    .from("match_history")
    .select("podcast_id")
    .eq("user_id", user.id)
    .eq("saved", true)

  if (error) return { error: error.message }
  return { data: (data ?? []).map(r => r.podcast_id) }
}
