import { type Metadata } from "next"
import { createClient }       from "@/lib/supabase/server"
import { ProfilePageClient }  from "@/components/profile/profile-page-client"
import type { ScoreBreakdown } from "@/lib/scoring/visibility-score"

export const metadata: Metadata = {
  title:  "Creator Profile | PodcastMatch AI",
  robots: { index: false, follow: false },
}

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const rawName   = (user?.user_metadata?.full_name as string | undefined) ?? user?.email ?? ""
  const firstName = rawName.split(" ")[0] || ""
  const initials  = rawName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n: string) => n[0].toUpperCase())
    .join("") || "?"

  const [profileResult, settingsResult] = user
    ? await Promise.all([
        supabase.from("profiles").select("avatar_url, bio").eq("id", user.id).single(),
        supabase.from("user_settings").select("profile_settings").eq("user_id", user.id).maybeSingle(),
      ])
    : [null, null]

  const avatarUrl = profileResult?.data?.avatar_url ?? null
  const bio       = profileResult?.data?.bio ?? null

  const ps = (settingsResult?.data?.profile_settings ?? {}) as Record<string, unknown>
  const initialBreakdown = (ps?.score_breakdown ?? null) as ScoreBreakdown | null

  return (
    <ProfilePageClient
      firstName={firstName}
      initials={initials}
      initialAvatarUrl={avatarUrl}
      initialBio={bio}
      initialBreakdown={initialBreakdown}
    />
  )
}
