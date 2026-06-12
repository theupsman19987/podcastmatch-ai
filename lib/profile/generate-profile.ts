import type { DNAFormData } from "@/components/onboarding/dna-context"

export interface ProfileInsight {
  id: string
  icon: string
  message: string
  score?: number
  type: "strength" | "opportunity" | "recommendation"
}

export interface CategoryAlignment {
  name: string
  alignment: number
  opportunityStrength: "High" | "Medium" | "Emerging"
  recommendationLevel: "Highly Recommended" | "Recommended" | "Explore"
}

export interface GeneratedProfile {
  // Header
  title: string
  category: string
  visibilityScore: number
  aiAlignmentScore: number
  audienceType: string
  creatorArchetype: string

  // Brand Identity
  missionStatement: string
  coreMessage: string
  primaryExpertise: string
  audienceServed: string
  creatorPositioning: string

  // Strengths (0–100)
  audienceMatchStrength: number
  topicAuthority: number
  visibilityPotential: number
  podcastCompatibility: number
  creatorMomentum: number

  // AI Insights
  insights: ProfileInsight[]

  // Category Alignments
  categoryAlignments: CategoryAlignment[]

  // Speaking Topics
  speakingTopics: string[]

  // Audience
  primaryAudience: string
  secondaryAudience: string
  audienceChallenges: string
  audienceOutcomes: string
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function clamp(n: number, lo: number, hi: number) {
  return Math.min(Math.max(Math.round(n), lo), hi)
}

// ─── Score Computations ──────────────────────────────────────────────────────

function visibilityScore(d: DNAFormData) {
  let s = 45
  if (d.s6_previousPodcasts.includes("multiple")) s += 18
  else if (d.s6_previousPodcasts.includes("few")) s += 10
  else if (d.s6_previousPodcasts.includes("once")) s += 5
  if (d.s6_socialMediaActivity.includes("Very active")) s += 14
  else if (d.s6_socialMediaActivity.includes("Active")) s += 9
  else if (d.s6_socialMediaActivity.includes("Moderate")) s += 5
  if (d.s6_publishedWork.includes("Multiple")) s += 12
  else if (d.s6_publishedWork && !d.s6_publishedWork.includes("None") && !d.s6_publishedWork.includes("progress")) s += 6
  if (d.s6_publicSpeaking.includes("regularly")) s += 7
  return clamp(s, 45, 96)
}

function alignmentScore(d: DNAFormData) {
  let s = 50
  if (d.s7_centralMessage.join(" ").length > 10) s += 10
  if (d.s7_oneRememberedThing.length > 20) s += 8
  if (d.s4_uniqueVoice.length > 20) s += 7
  if (d.s7_missionCategory.length > 0) s += 7
  if (d.s7_creatorArchetype) s += 5
  if (d.s2_primaryTopic.length > 0) s += 5
  if (d.s3_audienceType) s += 5
  return clamp(s, 50, 97)
}

function audienceMatchScore(d: DNAFormData) {
  let s = 50
  if (d.s3_audienceBenefits.length > 30) s += 10
  if (d.s3_audienceChallenge.length > 20) s += 8
  if (d.s3_ageGroup) s += 6
  if (d.s3_audienceType) s += 8
  if (d.s3_audienceOutcome.length > 20) s += 8
  if (d.s1_podcastMotivation.length >= 2) s += 5
  return clamp(s, 50, 95)
}

function topicAuthorityScore(d: DNAFormData) {
  let s = 48
  if (d.s2_primaryTopic.length > 0) s += 8
  if (d.s2_speakForHour.length > 0) s += 8
  if (d.s2_problemSolved.length > 30) s += 8
  if (d.s2_personalResults.length > 30) s += 8
  if (d.s2_expertiseCategory.includes("Thought Leader") || d.s2_expertiseCategory.includes("Executive")) s += 10
  else if (d.s2_expertiseCategory.includes("Expert") || d.s2_expertiseCategory.includes("Author")) s += 7
  if (d.s6_publishedWork.includes("Multiple")) s += 8
  else if (d.s6_publishedWork && !d.s6_publishedWork.includes("None") && !d.s6_publishedWork.includes("progress")) s += 5
  return clamp(s, 48, 97)
}

function visibilityPotentialScore(d: DNAFormData) {
  let s = 45
  if (d.s6_socialMediaActivity.includes("Very active")) s += 18
  else if (d.s6_socialMediaActivity.includes("Active")) s += 12
  else if (d.s6_socialMediaActivity.includes("Moderate")) s += 7
  if (d.s6_previousPodcasts.includes("multiple")) s += 14
  else if (d.s6_previousPodcasts.includes("few")) s += 8
  if (d.s6_publicSpeaking.includes("regularly")) s += 10
  if (d.s6_readiness.includes("immediately")) s += 5
  if (d.s6_publishedWork.includes("Multiple")) s += 8
  return clamp(s, 45, 95)
}

function podcastCompatScore(d: DNAFormData) {
  let s = 52
  if (d.s6_previousPodcasts.includes("multiple")) s += 15
  else if (d.s6_previousPodcasts.includes("few")) s += 8
  else if (d.s6_previousPodcasts.includes("once")) s += 4
  if (["Conversational", "Storytelling", "Inspirational"].some(x => d.s4_speakingStyle.includes(x))) s += 10
  else if (d.s4_speakingStyle.length > 0) s += 6
  if (d.s4_teachingStyle) s += 5
  if (d.s5_podcastFormats.length > 0) s += 5
  if (d.s6_publicSpeaking.includes("regularly")) s += 8
  return clamp(s, 52, 97)
}

// ─── Category Alignment ──────────────────────────────────────────────────────

const ALIGNMENT_CATS = [
  "Leadership",
  "Mindset & Purpose",
  "Spirituality & Faith",
  "Business & Entrepreneurship",
  "Health & Recovery",
  "Personal Development",
]

const TOPIC_BOOSTS: Record<string, [string, string]> = {
  "Business & Entrepreneurship": ["Business & Entrepreneurship", "Leadership"],
  "Technology & Innovation":     ["Business & Entrepreneurship", "Mindset & Purpose"],
  "Health & Wellness":           ["Health & Recovery", "Personal Development"],
  "Personal Development":        ["Personal Development", "Mindset & Purpose"],
  "Finance & Investing":         ["Business & Entrepreneurship", "Mindset & Purpose"],
  "Leadership & Management":     ["Leadership", "Business & Entrepreneurship"],
  "Marketing & Branding":        ["Business & Entrepreneurship", "Personal Development"],
  "Science & Research":          ["Mindset & Purpose", "Personal Development"],
  "Arts & Culture":              ["Personal Development", "Mindset & Purpose"],
  "Spirituality & Mindfulness":  ["Spirituality & Faith", "Mindset & Purpose"],
  "Parenting & Family":          ["Personal Development", "Health & Recovery"],
  "Education & Learning":        ["Personal Development", "Leadership"],
}

const POD_MAP: Record<string, string> = {
  "Business":             "Business & Entrepreneurship",
  "Entrepreneurship":     "Business & Entrepreneurship",
  "Health & Wellness":    "Health & Recovery",
  "Personal Development": "Personal Development",
  "Finance & Money":      "Business & Entrepreneurship",
  "Leadership":           "Leadership",
  "Technology":           "Business & Entrepreneurship",
  "Marketing":            "Business & Entrepreneurship",
  "Society & Culture":    "Mindset & Purpose",
  "Education":            "Personal Development",
  "Spirituality & Faith": "Spirituality & Faith",
}

function computeCategoryAlignments(d: DNAFormData): CategoryAlignment[] {
  const scores: Record<string, number> = {}
  ALIGNMENT_CATS.forEach(c => { scores[c] = 32 })

  const boosts = TOPIC_BOOSTS[d.s2_primaryTopic[0] ?? ""]
  if (boosts) {
    scores[boosts[0]] = (scores[boosts[0]] ?? 32) + 40
    scores[boosts[1]] = (scores[boosts[1]] ?? 32) + 22
  }

  d.s5_podcastCategories.forEach(pc => {
    const mapped = POD_MAP[pc]
    if (mapped) scores[mapped] = Math.min((scores[mapped] ?? 32) + 18, 95)
  })

  if (d.s7_missionCategory.some(m => m.includes("Empower") || m.includes("Inspire"))) {
    scores["Personal Development"] = Math.min((scores["Personal Development"] ?? 32) + 10, 95)
  }
  if (d.s7_missionCategory.some(m => m.includes("Grow") || m.includes("Disrupt"))) {
    scores["Business & Entrepreneurship"] = Math.min((scores["Business & Entrepreneurship"] ?? 32) + 10, 95)
  }
  if (d.s7_missionCategory.some(m => m.includes("Heal") || m.includes("community"))) {
    scores["Health & Recovery"] = Math.min((scores["Health & Recovery"] ?? 32) + 10, 95)
  }

  return ALIGNMENT_CATS.map(name => {
    const alignment = clamp(scores[name] ?? 32, 28, 95)
    return {
      name,
      alignment,
      opportunityStrength: alignment >= 74 ? "High" : alignment >= 54 ? "Medium" : "Emerging",
      recommendationLevel: alignment >= 74 ? "Highly Recommended" : alignment >= 54 ? "Recommended" : "Explore",
    } as CategoryAlignment
  }).sort((a, b) => b.alignment - a.alignment)
}

// ─── AI Insights ─────────────────────────────────────────────────────────────

function computeInsights(d: DNAFormData, cats: CategoryAlignment[], vpScore: number): ProfileInsight[] {
  const top = cats[0]
  const style = d.s4_speakingStyle[0] || "communication"
  const audience = d.s3_audienceType || d.s3_ageGroup || "your target audience"
  return [
    {
      id: "top-cat",
      icon: "🎯",
      message: `Your strongest category alignment is ${top?.name ?? "Personal Development"} at ${top?.alignment ?? 72}% — podcast hosts in this space are actively looking for guests like you.`,
      score: top?.alignment,
      type: "strength",
    },
    {
      id: "comm-style",
      icon: "🎤",
      message: `Your ${style} communication style scores highest with podcast audiences seeking depth, authenticity, and actionable perspective.`,
      type: "strength",
    },
    {
      id: "visibility",
      icon: "📈",
      message: `Your visibility potential is ${vpScore >= 74 ? "above average" : vpScore >= 60 ? "growing steadily" : "ready to build"} — consistent podcast appearances will accelerate your reach significantly.`,
      score: vpScore,
      type: vpScore >= 74 ? "strength" : "opportunity",
    },
    {
      id: "audience",
      icon: "👥",
      message: `Your audience alignment is strongest with shows serving ${audience}, creating high conversion potential from each appearance.`,
      type: "recommendation",
    },
  ]
}

// ─── Speaking Topics ─────────────────────────────────────────────────────────

function computeTopics(d: DNAFormData): string[] {
  const topics = new Set<string>()
  d.s2_primaryTopic.forEach(t => topics.add(t.split(" & ")[0]))
  d.s5_podcastCategories.slice(0, 5).forEach(c => topics.add(c))
  if (d.s7_missionCategory.some(m => m.includes("Empower"))) topics.add("Personal Empowerment")
  if (d.s7_missionCategory.some(m => m.includes("Disrupt"))) topics.add("Innovation")
  if (d.s7_missionCategory.some(m => m.includes("Heal"))) topics.add("Healing & Recovery")
  return Array.from(topics).slice(0, 7)
}

// ─── Mock DNA (fallback when no assessment has been taken) ───────────────────

export const MOCK_DNA: DNAFormData = {
  s1_podcastMotivation: ["Share an important message", "Build authority & credibility", "Find ideal clients"],
  s2_primaryTopic: ["Personal Development", "Health & Wellness"],
  s2_speakForHour: ["Personal Development", "Health & Wellness"],
  s2_problemSolved: "I help high achievers escape burnout cycles and build sustainable success systems that actually last.",
  s2_personalResults: "Built a 7-figure coaching practice, spoken at 50+ events, authored 2 books, built a 120K following.",
  s2_expertiseCategory: "Thought Leader",
  s3_audienceBenefits: "High-performing professionals who want to achieve more without sacrificing their health and relationships.",
  s3_ageGroup: "35 – 44",
  s3_audienceChallenge: "They are high achievers caught in the hustle trap — succeeding on the outside but burning out inside.",
  s3_audienceType: "Corporate professionals & executives",
  s3_audienceOutcome: "A sustainable success blueprint they can apply immediately to reclaim their energy and results.",
  s4_speakingStyle: ["Inspirational", "Storytelling"],
  s4_teachingStyle: "Stories and examples",
  s4_uniqueVoice: "I combine neuroscience with personal experience to make high performance feel achievable, not intimidating.",
  s5_podcastCategories: ["Personal Development", "Leadership", "Health & Wellness", "Business"],
  s5_podcastFormats: ["Long-form interview (60+ min)", "Story-driven narrative"],
  s6_previousPodcasts: "Yes, multiple times",
  s6_publicSpeaking: "Yes, regularly",
  s6_publishedWork: "Multiple of the above",
  s6_socialMediaActivity: "Active — several times a week",
  s6_readiness: "Ready immediately",
  s7_missionCategory: ["Empower individuals", "Inspire action"],
  s7_creatorArchetype: "The Mentor",
  s7_centralMessage: ["Sustainable success requires aligned systems", "Leadership starts within before it scales outward"],
  s7_oneRememberedThing: "You can have everything you have been chasing — just not by burning yourself out to get it.",
}

// ─── Main Generator ───────────────────────────────────────────────────────────

export function generateProfile(raw: unknown): GeneratedProfile {
  const d = (raw as DNAFormData | null) ?? MOCK_DNA

  const am = audienceMatchScore(d)
  const ta = topicAuthorityScore(d)
  const vp = visibilityPotentialScore(d)
  const pc = podcastCompatScore(d)
  const cm = clamp((am + ta + vp + pc) / 4 + 3, 50, 96)
  const cats = computeCategoryAlignments(d)

  return {
    title:            d.s2_expertiseCategory || "Creator",
    category:         d.s2_primaryTopic.join(" & ") || "Personal Development",
    visibilityScore:  visibilityScore(d),
    aiAlignmentScore: alignmentScore(d),
    audienceType:     d.s3_audienceType || d.s3_ageGroup || "Professionals & Leaders",
    creatorArchetype: d.s7_creatorArchetype || "The Expert",

    missionStatement: d.s7_centralMessage.join(". ") || "Helping others achieve transformative results through authentic expertise and lived experience.",
    coreMessage:      d.s7_oneRememberedThing || d.s7_centralMessage.join(". ") || "Your message has the power to change lives. Let us amplify it.",
    primaryExpertise: d.s2_primaryTopic.join(" & ") || "Personal Development",
    audienceServed:   d.s3_audienceType || (d.s3_audienceBenefits.slice(0, 80)) || "Professionals seeking growth",
    creatorPositioning: (d.s7_centralMessage.join(". ").slice(0, 120)) || (d.s7_oneRememberedThing.slice(0, 120)) || "A unique authoritative voice in your field.",

    audienceMatchStrength: am,
    topicAuthority:        ta,
    visibilityPotential:   vp,
    podcastCompatibility:  pc,
    creatorMomentum:       cm,

    insights: computeInsights(d, cats, vp),
    categoryAlignments: cats,
    speakingTopics: computeTopics(d),

    primaryAudience:   d.s3_audienceType || "Professionals & Leaders",
    secondaryAudience: d.s3_ageGroup || "Ages 25–44",
    audienceChallenges: d.s3_audienceChallenge || "Navigating complex professional and personal growth challenges.",
    audienceOutcomes:   d.s3_audienceOutcome || "Clarity, direction, and the confidence to take decisive action.",
  }
}
