import type { Metadata } from "next"
import { createClient }           from "@/lib/supabase/server"
import { getOrInitScore }          from "@/lib/actions/scoring"
import { DashboardHomeContent }   from "./dashboard-client"

export const metadata: Metadata = {
  title: "Dashboard — PodcastMatch AI",
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const rawName   = (user?.user_metadata?.full_name as string | undefined) ?? user?.email ?? ""
  const firstName = rawName.split(" ")[0] || "there"
  const userId    = user?.id ?? ""

  const startOfDay = new Date()
  startOfDay.setHours(0, 0, 0, 0)

  /* Parallel: activity counts + scoring */
  const [savedResult, matchResult, todayResult, dnaResult, scoring] = await Promise.all([
    supabase.from("saved_podcasts")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId),
    supabase.from("match_history")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId),
    supabase.from("match_history")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .gte("created_at", startOfDay.toISOString()),
    supabase.from("dna_assessments")
      .select("completed", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("completed", true),
    getOrInitScore(),
  ])

  return (
    <DashboardHomeContent
      firstName={firstName}
      savedCount={savedResult.count ?? 0}
      matchCount={matchResult.count ?? 0}
      newToday={todayResult.count ?? 0}
      hasDna={(dnaResult.count ?? 0) > 0}
      scoring={scoring}
    />
  )
}
