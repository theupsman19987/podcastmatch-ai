import type { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { DashboardHomeContent } from "./dashboard-client"

export const metadata: Metadata = {
  title: "Dashboard — PodcastMatch AI",
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  /* ── Real user first name ──────────────────────────────── */
  const rawName   = (user?.user_metadata?.full_name as string | undefined) ?? user?.email ?? ""
  const firstName = rawName.split(" ")[0] || "there"
  const userId    = user?.id ?? ""

  const startOfDay = new Date()
  startOfDay.setHours(0, 0, 0, 0)

  /* ── DB queries (parallel) ─────────────────────────────── */
  const [savedResult, matchResult, todayResult, profileResult] = await Promise.all([
    supabase
      .from("saved_podcasts")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId),
    supabase
      .from("match_history")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId),
    supabase
      .from("match_history")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .gte("created_at", startOfDay.toISOString()),
    supabase
      .from("creator_profiles")
      .select("visibility_score")
      .eq("user_id", userId)
      .single(),
  ])

  return (
    <DashboardHomeContent
      firstName={firstName}
      visibilityScore={profileResult.data?.visibility_score ?? 74}
      savedCount={savedResult.count ?? 0}
      matchCount={matchResult.count ?? 0}
      newToday={todayResult.count ?? 0}
    />
  )
}
