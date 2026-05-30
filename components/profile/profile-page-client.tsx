"use client"

import { useMemo } from "react"
import { generateProfile } from "@/lib/profile/generate-profile"
import { ProfileHeader }            from "./profile-header"
import { BrandIdentity }            from "./brand-identity"
import { StrengthDashboard }        from "./strength-dashboard"
import { AIInsightsPanel }          from "./ai-insights-panel"
import { CategoryAlignmentCards }   from "./category-alignment-cards"
import { SpeakingTopics }           from "./speaking-topics"
import { AudienceProfileSection }   from "./audience-profile-section"
import { QuickActions }             from "./quick-actions"

export function ProfilePageClient() {
  const profile = useMemo(() => {
    if (typeof window === "undefined") return generateProfile(null)
    try {
      const raw = localStorage.getItem("podmatch_creator_dna")
      return generateProfile(raw ? JSON.parse(raw) : null)
    } catch {
      return generateProfile(null)
    }
  }, [])

  return (
    <div className="flex flex-col gap-6 px-4 py-6 md:px-6 lg:px-8 max-w-screen-xl mx-auto w-full">
      <ProfileHeader profile={profile} />
      <BrandIdentity profile={profile} />
      <StrengthDashboard profile={profile} />
      <AIInsightsPanel profile={profile} />
      <CategoryAlignmentCards profile={profile} />
      <SpeakingTopics profile={profile} />
      <AudienceProfileSection profile={profile} />
      <QuickActions />
    </div>
  )
}
