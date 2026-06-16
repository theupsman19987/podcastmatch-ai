"use server"

import { createClient } from "@/lib/supabase/server"
import { computeScore } from "@/lib/scoring/visibility-score"
import type { ScoreBreakdown, ImprovementFlags, ScoringResult } from "@/lib/scoring/visibility-score"
import type { Json } from "@/lib/supabase/database.types"

export type { ScoringResult }

export async function computeAndSaveScore(): Promise<ScoringResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    const empty = { authority: 0, clarity: 0, audience: 0, readiness: 0, growth: 0, total: 0 }
    const emptyFlags = Object.fromEntries(
      ["websiteAdded","mediaKitReady","publishedWork","bioSubstantial","oneLinerPresent",
       "topicsDefined","assessmentComplete","audienceDescribed","audienceChallengeDefined",
       "audienceOutcomeDefined","bioCompleted","profileComplete","bookingReady",
       "recentActivity","hasSavedMatches","recentAssessment"].map(k => [k, false])
    ) as ImprovementFlags
    return { breakdown: empty, flags: emptyFlags }
  }

  /* Parallel data fetch */
  const [profileRes, creatorRes, dnaRes, settingsRes, savedRes] = await Promise.all([
    supabase.from("profiles")
      .select("bio, avatar_url, full_name")
      .eq("id", user.id)
      .maybeSingle(),
    supabase.from("creator_profiles")
      .select("speaking_topics, brand_identity, audience_profile, updated_at")
      .eq("user_id", user.id)
      .maybeSingle(),
    supabase.from("dna_assessments")
      .select("completed, completed_at, answers")
      .eq("user_id", user.id)
      .maybeSingle(),
    supabase.from("user_settings")
      .select("profile_settings")
      .eq("user_id", user.id)
      .maybeSingle(),
    supabase.from("saved_podcasts")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id),
  ])

  /* Extract fields */
  const profile  = profileRes.data
  const creator  = creatorRes.data
  const dna      = dnaRes.data
  const settings = settingsRes.data
  const answers  = dna?.answers as Record<string, unknown> | null

  const profileSettings = (settings?.profile_settings ?? {}) as Record<string, unknown>

  const brandId  = creator?.brand_identity as Record<string, unknown> | null
  const audProf  = creator?.audience_profile as Record<string, unknown> | null

  const { breakdown, flags } = computeScore({
    bio:              profile?.bio ?? null,
    websiteUrl:       (profileSettings?.website as string | undefined) ?? null,
    avatarUrl:        profile?.avatar_url ?? null,
    fullName:         profile?.full_name ?? null,
    speakingTopics:   creator?.speaking_topics ?? [],
    brandIdentityPopulated:   !!brandId && Object.keys(brandId).length > 0,
    audienceProfilePopulated: !!audProf && Object.keys(audProf).length > 0,
    dnaCompleted:     dna?.completed ?? false,
    dnaCompletedAt:   dna?.completed_at ?? null,
    dnaPublishedWork:      (answers?.s6_publishedWork as string | undefined) ?? null,
    dnaAudienceType:       (answers?.s3_audienceType  as string | undefined) ?? null,
    dnaAudienceChallenge:  (answers?.s3_audienceChallenge as string | undefined) ?? null,
    dnaAudienceOutcome:    (answers?.s3_audienceOutcome   as string | undefined) ?? null,
    dnaOneRememberedThing: (answers?.s7_oneRememberedThing as string | undefined) ?? null,
    savedCount:       savedRes.count ?? 0,
    profileUpdatedAt: creator?.updated_at ?? null,
  })

  /* Persist updated score */
  const scoreJson:  Json = JSON.parse(JSON.stringify(breakdown))
  const flagsJson:  Json = JSON.parse(JSON.stringify(flags))

  await supabase.from("creator_profiles").upsert(
    {
      user_id:          user.id,
      visibility_score: breakdown.total,
      updated_at:       new Date().toISOString(),
    },
    { onConflict: "user_id" }
  )

  /* Persist breakdown + flags to profile_settings for fast dashboard reads */
  await supabase.from("user_settings").upsert(
    {
      user_id:          user.id,
      profile_settings: {
        ...(profileSettings as object),
        score_breakdown: scoreJson,
        score_flags:     flagsJson,
      } as Json,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" }
  )

  return { breakdown, flags }
}

/* ── Read stored score (no recompute) ───────────────────────
   Returns the last-persisted score + flags from profile_settings.
   Falls back to computeAndSaveScore() on first visit (no stored score). */
export async function getOrInitScore(): Promise<ScoringResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    const empty = { authority: 0, clarity: 0, audience: 0, readiness: 0, growth: 0, total: 0 }
    const emptyFlags = Object.fromEntries(
      ["websiteAdded","mediaKitReady","publishedWork","bioSubstantial","oneLinerPresent",
       "topicsDefined","assessmentComplete","audienceDescribed","audienceChallengeDefined",
       "audienceOutcomeDefined","bioCompleted","profileComplete","bookingReady",
       "recentActivity","hasSavedMatches","recentAssessment"].map(k => [k, false])
    ) as ImprovementFlags
    return { breakdown: empty, flags: emptyFlags }
  }

  const { data: settings } = await supabase
    .from("user_settings")
    .select("profile_settings")
    .eq("user_id", user.id)
    .maybeSingle()

  const ps = (settings?.profile_settings ?? {}) as Record<string, unknown>
  const storedBreakdown = ps?.score_breakdown as ScoreBreakdown | undefined
  const storedFlags     = ps?.score_flags     as ImprovementFlags | undefined

  if (storedBreakdown && typeof storedBreakdown.total === "number" && storedFlags) {
    return { breakdown: storedBreakdown, flags: storedFlags }
  }

  /* First-time user — compute and persist */
  return computeAndSaveScore()
}
