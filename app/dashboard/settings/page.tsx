import { type Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { SettingsShell } from "@/components/settings/settings-shell"
import type { InitialUserData } from "@/components/settings/settings-shell"

export const metadata: Metadata = {
  title:  "Settings | PodcastMatch AI",
  robots: { index: false, follow: false },
}

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  /* Fetch user settings + subscription in parallel */
  const [settingsResult, subscriptionResult] = await Promise.all([
    supabase
      .from("user_settings")
      .select("profile_settings")
      .eq("user_id", user?.id ?? "")
      .maybeSingle(),
    supabase
      .from("subscriptions")
      .select("plan_id, status, current_period_end")
      .eq("user_id", user?.id ?? "")
      .maybeSingle(),
  ])

  const ps  = (settingsResult.data?.profile_settings ?? {}) as Record<string, unknown>
  const sub = subscriptionResult.error ? null : subscriptionResult.data

  const rawName     = (user?.user_metadata?.full_name as string | undefined) ?? ""
  const rawEmail    = user?.email ?? ""
  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "—"

  const planId = (sub?.plan_id ?? "free") as InitialUserData["plan"]

  const initialData: InitialUserData = {
    fullName:    (ps.fullName    as string | undefined) ?? rawName,
    email:       (ps.email       as string | undefined) ?? rawEmail,
    username:    rawEmail.split("@")[0] ?? "",
    memberSince,
    title:       (ps.title       as string | undefined) ?? "",
    bio:         (ps.bio         as string | undefined) ?? "",
    website:     (ps.website     as string | undefined) ?? "",
    location:    (ps.location    as string | undefined) ?? "",
    social: {
      twitter:   (ps.twitter     as string | undefined) ?? "",
      linkedin:  (ps.linkedin    as string | undefined) ?? "",
      youtube:   (ps.youtube     as string | undefined) ?? "",
      instagram: (ps.instagram   as string | undefined) ?? "",
    },
    plan:        planId,
    planStatus:  sub?.status ?? "free",
    nextBilling: sub?.current_period_end
      ? new Date(sub.current_period_end).toLocaleDateString("en-US", {
          month: "long", day: "numeric", year: "numeric",
        })
      : null,
  }

  return <SettingsShell initialData={initialData} />
}
