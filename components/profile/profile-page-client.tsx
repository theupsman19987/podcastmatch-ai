"use client"

import { useState, useEffect } from "react"
import { generateProfile }          from "@/lib/profile/generate-profile"
import type { GeneratedProfile }    from "@/lib/profile/generate-profile"
import { getDnaAssessment }         from "@/lib/actions/dna"
import { ProfileHeader }            from "./profile-header"
import { ProfileBio }               from "./profile-bio"
import { BrandIdentity }            from "./brand-identity"
import { StrengthDashboard }        from "./strength-dashboard"
import { AIInsightsPanel }          from "./ai-insights-panel"
import { CategoryAlignmentCards }   from "./category-alignment-cards"
import { SpeakingTopics }           from "./speaking-topics"
import { AudienceProfileSection }   from "./audience-profile-section"
import { QuickActions }             from "./quick-actions"
import { MediaKit }                 from "./media-kit"

function loadFromLocalStorage() {
  try {
    const raw = localStorage.getItem("podmatch_creator_dna")
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

interface Props {
  firstName?:       string
  initials?:        string
  initialAvatarUrl?: string | null
  initialBio?:      string | null
}

export function ProfilePageClient({ firstName, initials, initialAvatarUrl, initialBio }: Props) {
  /* Start with localStorage so the page never flashes empty */
  const [profile, setProfile] = useState<GeneratedProfile>(() => {
    if (typeof window === "undefined") return generateProfile(null)
    return generateProfile(loadFromLocalStorage())
  })
  const [avatarUrl, setAvatarUrl] = useState<string | null>(initialAvatarUrl ?? null)

  useEffect(() => {
    /* Try loading the more-complete Supabase version */
    getDnaAssessment().then(result => {
      if (result.data?.answers) {
        setProfile(generateProfile(result.data.answers))
      }
    }).catch(() => { /* keep localStorage version */ })
  }, [])

  return (
    <div className="flex flex-col gap-6 px-4 py-6 md:px-6 lg:px-8 max-w-screen-xl mx-auto w-full">
      <div id="section-header">
        <ProfileHeader
          profile={profile}
          firstName={firstName}
          initials={initials}
          avatarUrl={avatarUrl}
          onAvatarChange={setAvatarUrl}
        />
      </div>
      <div id="section-bio">
        <ProfileBio initialBio={initialBio} />
      </div>
      <div id="section-positioning">
        <BrandIdentity profile={profile} />
      </div>
      <StrengthDashboard profile={profile} />
      <AIInsightsPanel profile={profile} />
      <CategoryAlignmentCards profile={profile} />
      <div id="section-speaking-topics">
        <SpeakingTopics profile={profile} />
      </div>
      <AudienceProfileSection profile={profile} />
      <div id="section-media-kit">
        <MediaKit profile={profile} />
      </div>
      <QuickActions />
    </div>
  )
}
