"use server"

import { createClient } from "@/lib/supabase/server"
import type { GeneratedProfile } from "@/lib/profile/generate-profile"
import type { Json }             from "@/lib/supabase/database.types"

/* ── Save / overwrite creator profile ───────────────────── */
export async function saveCreatorProfile(
  profile: GeneratedProfile
): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Not authenticated" }

  const brandIdentity: Json = {
    missionStatement:   profile.missionStatement,
    coreMessage:        profile.coreMessage,
    primaryExpertise:   profile.primaryExpertise,
    audienceServed:     profile.audienceServed,
    creatorPositioning: profile.creatorPositioning,
  }

  const strengths: Json = {
    audienceMatchStrength: profile.audienceMatchStrength,
    topicAuthority:        profile.topicAuthority,
    visibilityPotential:   profile.visibilityPotential,
    podcastCompatibility:  profile.podcastCompatibility,
    creatorMomentum:       profile.creatorMomentum,
  }

  const audienceProfile: Json = {
    audienceType:       profile.audienceType,
    primaryAudience:    profile.primaryAudience,
    secondaryAudience:  profile.secondaryAudience,
    audienceChallenges: profile.audienceChallenges,
    audienceOutcomes:   profile.audienceOutcomes,
  }

  const { error } = await supabase
    .from("creator_profiles")
    .upsert(
      {
        user_id:            user.id,
        archetype:          profile.creatorArchetype,
        category:           profile.category,
        title:              profile.title,
        brand_identity:     brandIdentity,
        strengths,
        audience_profile:   audienceProfile,
        speaking_topics:    profile.speakingTopics,
        visibility_score:   profile.visibilityScore,
        ai_alignment_score: profile.aiAlignmentScore,
        raw_dna_data:       {} as Json,
        updated_at:         new Date().toISOString(),
      },
      { onConflict: "user_id" }
    )

  if (error) return { error: error.message }
  return {}
}

/* ── Load creator profile ────────────────────────────────── */
export async function getCreatorProfile(): Promise<{
  data?: GeneratedProfile
  error?: string
}> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return {}

  const { data, error } = await supabase
    .from("creator_profiles")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle()

  if (error) return { error: error.message }
  if (!data)  return {}

  const bi  = (data.brand_identity   ?? {}) as Record<string, string>
  const str = (data.strengths        ?? {}) as Record<string, number>
  const ap  = (data.audience_profile ?? {}) as Record<string, string>

  return {
    data: {
      title:               data.title              ?? "",
      category:            data.category           ?? "",
      visibilityScore:     data.visibility_score,
      aiAlignmentScore:    data.ai_alignment_score,
      audienceType:        ap.audienceType         ?? "",
      creatorArchetype:    data.archetype          ?? "",
      missionStatement:    bi.missionStatement     ?? "",
      coreMessage:         bi.coreMessage          ?? "",
      primaryExpertise:    bi.primaryExpertise     ?? "",
      audienceServed:      bi.audienceServed       ?? "",
      creatorPositioning:  bi.creatorPositioning   ?? "",
      audienceMatchStrength: str.audienceMatchStrength ?? 0,
      topicAuthority:        str.topicAuthority        ?? 0,
      visibilityPotential:   str.visibilityPotential   ?? 0,
      podcastCompatibility:  str.podcastCompatibility  ?? 0,
      creatorMomentum:       str.creatorMomentum       ?? 0,
      insights:              [],
      categoryAlignments:    [],
      speakingTopics:        data.speaking_topics ?? [],
      primaryAudience:       ap.primaryAudience   ?? "",
      secondaryAudience:     ap.secondaryAudience ?? "",
      audienceChallenges:    ap.audienceChallenges ?? "",
      audienceOutcomes:      ap.audienceOutcomes   ?? "",
    },
  }
}
