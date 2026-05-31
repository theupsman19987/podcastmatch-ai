/* ═══════════════════════════════════════════════════════════
   Match Engine — deterministic mock AI matching logic.

   FUTURE AI INTEGRATION POINT:
   Replace computeMatch() with a call to /api/match
   (POST { podcastId, creatorDna }) that returns MatchResult.
   Replace getVisibilityRecommendations() with
   /api/match/recommendations (POST { creatorDna }).
   All UI components accept MatchResult directly — swap the
   data source here only.
   ═══════════════════════════════════════════════════════════ */

import type { DiscoveryPodcast } from "@/components/discovery/mock-data"

/* ── Core types ───────────────────────────────────────────── */
export type OpportunityRank = "elite" | "strong" | "good" | "emerging"

export interface MatchExplanation {
  label: string
  text:  string
  tier:  "gold" | "primary" | "cyan"
}

export interface OutreachAngle {
  headline:        string
  description:     string
  suggestedTopics: string[]
  tone:            string
}

export interface AlignmentBreakdown {
  audienceOverlap:     number
  topicAlignment:      number
  guestCompatibility:  number
  visibilityPotential: number
}

export interface MatchResult {
  opportunityRank:    OpportunityRank
  whyThisMatches:     MatchExplanation[]
  outreachAngle:      OutreachAngle
  alignmentBreakdown: AlignmentBreakdown
}

export interface CategoryRecommendation {
  category:     string
  strength:     number
  podcastCount: number
  insight:      string
  rank:         OpportunityRank
}

/* ── Rank thresholds ─────────────────────────────────────── */
export const RANK_CONFIG: Record<OpportunityRank, {
  label:  string
  color:  string
  border: string
  bg:     string
}> = {
  elite:    { label: "Elite Opportunity",    color: "text-[var(--premium-gold)]",  border: "border-[oklch(0.78_0.15_83/0.35)]",   bg: "bg-[oklch(0.78_0.15_83/0.10)]"   },
  strong:   { label: "Strong Opportunity",   color: "text-primary",                border: "border-primary/35",                   bg: "bg-primary/10"                   },
  good:     { label: "Good Opportunity",     color: "text-[var(--premium-cyan)]",  border: "border-[oklch(0.70_0.16_200/0.35)]",  bg: "bg-[oklch(0.70_0.16_200/0.10)]"  },
  emerging: { label: "Emerging Opportunity", color: "text-[oklch(0.70_0.16_145)]", border: "border-[oklch(0.55_0.16_145/0.30)]",  bg: "bg-[oklch(0.55_0.16_145/0.08)]"  },
}

export function getOpportunityRank(score: number): OpportunityRank {
  if (score >= 90) return "elite"
  if (score >= 80) return "strong"
  if (score >= 70) return "good"
  return "emerging"
}

/* ── Category explanation library ────────────────────────── */
const CAT_EXPLANATIONS: Record<string, MatchExplanation> = {
  "Business":             { label: "Audience Overlap",    text: "Your business expertise maps directly to this audience's growth mindset and aspirations.",              tier: "gold"    },
  "Entrepreneurship":     { label: "Topic Alignment",     text: "Your founder journey creates the authentic narrative this show's entrepreneurial listeners crave.",     tier: "gold"    },
  "Leadership":           { label: "Authority Match",     text: "Your leadership background gives you immediate credibility with this podcast's executive audience.",    tier: "gold"    },
  "Marketing":            { label: "Audience Overlap",    text: "Your marketing insights align with what this audience actively seeks out and shares with peers.",       tier: "primary" },
  "Technology":           { label: "Topic Alignment",     text: "Your tech perspective offers the depth and specificity this audience values and acts on.",              tier: "primary" },
  "Health & Wellness":    { label: "Mission Alignment",   text: "Your wellness message resonates deeply with this podcast's purpose-driven and loyalty-high community.", tier: "cyan"    },
  "Personal Development": { label: "Audience Overlap",    text: "Listeners here are actively building the mindset your content was made for.",                          tier: "primary" },
  "Finance & Investing":  { label: "Authority Match",     text: "Your financial insight positions you as a trusted voice this audience is ready and eager to hear.",    tier: "gold"    },
  "Faith & Spirituality": { label: "Mission Alignment",   text: "Your values-led story creates a rare and powerful connection with this show's faith community.",       tier: "cyan"    },
  "Women in Business":    { label: "Audience Overlap",    text: "Your experience speaks directly to the ambitions of this show's majority female entrepreneurial base.", tier: "primary" },
  "Education":            { label: "Topic Alignment",     text: "Your educational depth and accessible style is exactly what this audience engages with and shares.",    tier: "cyan"    },
  "Society & Culture":    { label: "Mission Alignment",   text: "Your cultural perspective and storytelling ability fits this show's thought-leadership format.",        tier: "cyan"    },
  "Science":              { label: "Topic Alignment",     text: "Your analytical, evidence-based perspective is a natural fit for this show's intelligent audience.",    tier: "primary" },
  "Sports & Performance": { label: "Authority Match",     text: "Your performance mindset and results-focused approach resonates with this competitive audience.",       tier: "gold"    },
  "Parenting":            { label: "Mission Alignment",   text: "Your family story and values connect authentically with this show's highly engaged parent community.", tier: "cyan"    },
  "Spirituality":         { label: "Mission Alignment",   text: "Your personal faith journey aligns with what this audience is actively searching for.",                tier: "cyan"    },
}

const FALLBACK_EXPLANATIONS: MatchExplanation[] = [
  { label: "Communication Style",  text: "Your storytelling approach matches this host's preferred conversational guest format.",    tier: "primary" },
  { label: "Guest Compatibility",  text: "Your interview experience and message clarity make you an ideal guest for this show.",     tier: "cyan"    },
  { label: "Visibility Potential", text: "This podcast's sharing behavior suggests strong post-interview reach and amplification.",  tier: "gold"    },
]

/* ── Outreach angle library ───────────────────────────────── */
const CAT_OUTREACH: Record<string, Pick<OutreachAngle, "headline" | "tone">> = {
  "Business":             { headline: "Lead with Results",            tone: "Confident, data-backed, story-driven"  },
  "Entrepreneurship":     { headline: "Share the Founder's Journey",  tone: "Vulnerable, inspiring, honest"         },
  "Leadership":           { headline: "Speak to the Leader's Path",   tone: "Authoritative, empathetic, visionary"  },
  "Marketing":            { headline: "Teach a Proven Framework",     tone: "Strategic, tactical, value-first"      },
  "Technology":           { headline: "Demystify the Complex",        tone: "Clear, curious, forward-thinking"      },
  "Health & Wellness":    { headline: "Personal Story First",         tone: "Warm, evidence-based, human"           },
  "Personal Development": { headline: "Challenge a Common Belief",    tone: "Provocative, actionable, relatable"    },
  "Finance & Investing":  { headline: "Share Counterintuitive Wins",  tone: "Analytical, honest, plain-spoken"      },
  "Faith & Spirituality": { headline: "Lead with Your Story",         tone: "Humble, authentic, values-driven"      },
  "Women in Business":    { headline: "Celebrate the Unspoken Win",   tone: "Empowering, honest, aspirational"      },
  "Education":            { headline: "Teach the One Thing",          tone: "Clear, curious, depth-first"           },
  "Sports & Performance": { headline: "Bring the Performance Mindset",tone: "Energetic, disciplined, results-driven" },
}

function buildTopics(primaryCat: string, podcast: DiscoveryPodcast): string[] {
  const cat2 = podcast.categories[1] ?? primaryCat
  return [
    `The turning point that reshaped your approach to ${primaryCat.toLowerCase()}`,
    `How your background in ${primaryCat.toLowerCase()} produces measurable, repeatable results`,
    `The intersection of ${primaryCat} and ${cat2} you've personally navigated`,
    `What ${primaryCat} audiences consistently misunderstand — and the real fix`,
  ]
}

/* ── Alignment breakdown (deterministic from matchScore) ──── */
function getAlignmentBreakdown(podcast: DiscoveryPodcast): AlignmentBreakdown {
  const base = podcast.matchScore
  const seed = podcast.name.length
  return {
    audienceOverlap:     clamp(base + (seed % 7) - 3),
    topicAlignment:      clamp(base + ((seed * 3) % 9) - 4),
    guestCompatibility:  clamp(base - (seed % 5)),
    visibilityPotential: clamp(base + ((seed * 2) % 8) - 2),
  }
}

function clamp(n: number): number {
  return Math.min(99, Math.max(50, Math.round(n)))
}

/* ── Main compute function ────────────────────────────────── */
export function computeMatch(podcast: DiscoveryPodcast): MatchResult {
  const opportunityRank = getOpportunityRank(podcast.matchScore)

  const whyThisMatches: MatchExplanation[] = []
  const seenLabels = new Set<string>()
  for (const cat of podcast.categories.slice(0, 3)) {
    const exp = CAT_EXPLANATIONS[cat]
    if (exp && !seenLabels.has(exp.label) && whyThisMatches.length < 3) {
      whyThisMatches.push(exp)
      seenLabels.add(exp.label)
    }
  }
  for (const g of FALLBACK_EXPLANATIONS) {
    if (whyThisMatches.length >= 3) break
    if (!seenLabels.has(g.label)) {
      whyThisMatches.push(g)
      seenLabels.add(g.label)
    }
  }

  const primaryCat = podcast.categories[0] ?? "Business"
  const catOutreach = CAT_OUTREACH[primaryCat] ?? { headline: "Lead with Your Story", tone: "Authentic, confident, value-first" }

  const outreachAngle: OutreachAngle = {
    headline: catOutreach.headline,
    description: `Position yourself as the credible, relatable voice this audience is ready to hear. Open with your most transformational result, then reference the host's recent episode on "${podcast.categories[1] ?? primaryCat}" to show you've done your homework. Keep the pitch under 150 words.`,
    suggestedTopics: buildTopics(primaryCat, podcast),
    tone: catOutreach.tone,
  }

  return {
    opportunityRank,
    whyThisMatches,
    outreachAngle,
    alignmentBreakdown: getAlignmentBreakdown(podcast),
  }
}

/* ── Cross-podcast visibility recommendations ────────────── */
const CAT_INSIGHTS: Record<string, string> = {
  "Business":             "Business podcasts represent your highest-volume opportunity — consistent audience overlap across all shows.",
  "Entrepreneurship":     "Entrepreneurship shows have audiences primed for your founder narrative and builder credibility.",
  "Leadership":           "Leadership podcasts show the strongest match score average — your authority positioning is a natural fit.",
  "Marketing":            "Marketing audiences actively seek the practical frameworks and case studies you're positioned to teach.",
  "Technology":           "Tech podcast listeners are early adopters who amplify content rapidly — high visibility multiplier.",
  "Health & Wellness":    "Wellness audiences have unusually high trust and loyalty — strong foundation for long-term visibility.",
  "Personal Development": "Personal development shows are growing 40%+ faster than the podcast average — a rising tide.",
  "Finance & Investing":  "Finance audiences are high-intent and respond strongly to outcome-focused, results-driven stories.",
  "Faith & Spirituality": "Faith-based audiences align strongly with your personal story and values — a rare authentic fit.",
  "Women in Business":    "Women in business podcasts show growing audience compatibility and strong engagement rates.",
  "Education":            "Education podcasts reward subject-matter depth — a natural fit for your expertise positioning.",
  "Society & Culture":    "Culture podcasts offer reach into audiences outside your current core — strong expansion opportunity.",
  "Science":              "Science shows give you credibility signals that carry across multiple other audience categories.",
  "Sports & Performance": "Performance-focused audiences resonate with results-driven narratives — high engagement and sharing.",
  "Parenting":            "Parenting podcasts offer access to a high-trust, values-aligned community with strong word-of-mouth.",
  "Spirituality":         "Spirituality listeners seek transformation — your story and message are positioned to deliver it.",
}

export function getVisibilityRecommendations(
  podcasts: DiscoveryPodcast[]
): CategoryRecommendation[] {
  const catMap = new Map<string, number[]>()
  for (const p of podcasts) {
    for (const c of p.categories) {
      if (!catMap.has(c)) catMap.set(c, [])
      catMap.get(c)!.push(p.matchScore)
    }
  }

  const recs: CategoryRecommendation[] = []
  for (const [cat, scores] of catMap.entries()) {
    const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
    recs.push({
      category:     cat,
      strength:     avg,
      podcastCount: scores.length,
      insight:      CAT_INSIGHTS[cat] ?? `${cat} podcasts show strong compatibility with your creator profile.`,
      rank:         getOpportunityRank(avg),
    })
  }

  return recs.sort((a, b) => b.strength - a.strength).slice(0, 8)
}
