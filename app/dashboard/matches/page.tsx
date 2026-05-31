import type { Metadata } from "next"
import Link from "next/link"
import { Sparkles, Target, Trophy, TrendingUp, Search } from "lucide-react"
import { MOCK_PODCASTS } from "@/components/discovery/mock-data"
import {
  computeMatch,
  getOpportunityRank,
  getVisibilityRecommendations,
  RANK_CONFIG,
  type OpportunityRank,
} from "@/lib/matching/match-engine"
import { TopMatchCard } from "@/components/matching/top-match-card"
import { VisibilityRecommendations } from "@/components/matching/visibility-recommendations"
import { OpportunityDistribution } from "@/components/matching/opportunity-distribution"

/* ═══════════════════════════════════════════════════════════
   AI Matches hub — /dashboard/matches
   Server component: computes all match data at build/request time.

   FUTURE AI INTEGRATION POINT:
   Replace MOCK_PODCASTS + computeMatch with
   fetch('/api/match/ranked', { creatorId }) to get
   server-sorted, LLM-scored results.
   ═══════════════════════════════════════════════════════════ */

export const metadata: Metadata = {
  title:  "AI Matches — PodcastMatch AI",
  robots: { index: false, follow: false },
}

const RANK_ICONS: Record<OpportunityRank, React.ElementType> = {
  elite:    Trophy,
  strong:   Target,
  good:     TrendingUp,
  emerging: Sparkles,
}

export default function MatchesPage() {
  /* ── Compute all matches server-side ──────────────────── */
  const allMatches = MOCK_PODCASTS
    .map(p => ({ podcast: p, match: computeMatch(p) }))
    .sort((a, b) => b.podcast.matchScore - a.podcast.matchScore)

  const topMatches   = allMatches.slice(0, 6)
  const visRecs      = getVisibilityRecommendations(MOCK_PODCASTS)
  const avgScore     = Math.round(
    MOCK_PODCASTS.reduce((a, p) => a + p.matchScore, 0) / MOCK_PODCASTS.length
  )
  const eliteCount   = MOCK_PODCASTS.filter(p => p.matchScore >= 90).length
  const bestCategory = visRecs[0]?.category ?? "Business"

  const distribution: Record<OpportunityRank, number> = {
    elite:    MOCK_PODCASTS.filter(p => getOpportunityRank(p.matchScore) === "elite").length,
    strong:   MOCK_PODCASTS.filter(p => getOpportunityRank(p.matchScore) === "strong").length,
    good:     MOCK_PODCASTS.filter(p => getOpportunityRank(p.matchScore) === "good").length,
    emerging: MOCK_PODCASTS.filter(p => getOpportunityRank(p.matchScore) === "emerging").length,
  }

  /* ── Stats ─────────────────────────────────────────────── */
  const STATS = [
    {
      label:  "Total Matches",
      value:  String(MOCK_PODCASTS.length),
      sub:    "podcasts analyzed",
      icon:   Target,
      color:  "text-primary",
      bg:     "bg-primary/10 border-primary/20",
    },
    {
      label:  "Elite Opportunities",
      value:  String(eliteCount),
      sub:    "90%+ match score",
      icon:   Trophy,
      color:  "text-[var(--premium-gold)]",
      bg:     "bg-[oklch(0.78_0.15_83/0.10)] border-[oklch(0.78_0.15_83/0.25)]",
    },
    {
      label:  "Average Match Score",
      value:  `${avgScore}%`,
      sub:    "across all podcasts",
      icon:   Sparkles,
      color:  "text-[var(--premium-cyan)]",
      bg:     "bg-[oklch(0.70_0.16_200/0.10)] border-[oklch(0.70_0.16_200/0.25)]",
    },
    {
      label:  "Best Category",
      value:  bestCategory,
      sub:    `${visRecs[0]?.strength ?? 0}% avg match`,
      icon:   TrendingUp,
      color:  "text-[oklch(0.70_0.16_145)]",
      bg:     "bg-[oklch(0.55_0.16_145/0.08)] border-[oklch(0.55_0.16_145/0.25)]",
    },
  ] as const

  return (
    <div className="px-4 py-6 md:px-6 lg:px-8 max-w-screen-xl mx-auto w-full flex flex-col gap-10">

      {/* ── Page header ───────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">AI Match Intelligence</h1>
            <p className="text-xs text-muted-foreground">
              Personalized opportunities ranked by your creator profile
            </p>
          </div>
        </div>

        {/* Live indicator */}
        <div className="flex items-center gap-2 rounded-full border border-primary/20 bg-primary/08 px-3 py-1.5">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
          </span>
          <span className="text-[10px] font-semibold text-primary">AI Matching Active</span>
        </div>
      </div>

      {/* ── Stats row ─────────────────────────────────────── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {STATS.map(stat => (
          <div
            key={stat.label}
            className={`flex flex-col gap-3 rounded-[var(--radius-xl)] border p-5 bg-card shadow-[var(--shadow-card)] ${stat.bg}`}
          >
            <div className={`flex h-8 w-8 items-center justify-center rounded-xl border ${stat.bg}`}>
              <stat.icon className={`size-4 ${stat.color}`} aria-hidden="true" />
            </div>
            <div>
              <p className={`text-[22px] font-black leading-none tabular-nums ${stat.color}`}>
                {stat.value}
              </p>
              <p className="text-[11px] font-semibold text-foreground mt-1">{stat.label}</p>
              <p className="text-[10px] text-muted-foreground/70">{stat.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Top Matches ───────────────────────────────────── */}
      <section aria-labelledby="top-matches-heading">
        <div className="flex items-center justify-between gap-4 mb-5">
          <div>
            <h2 id="top-matches-heading" className="text-[14px] font-bold text-foreground">
              Top Matches
            </h2>
            <p className="text-[11px] text-muted-foreground">
              Your highest-scoring personalized opportunities
            </p>
          </div>
          <Link
            href="/dashboard/discover"
            className="flex items-center gap-1.5 rounded-[var(--radius-md)] border border-border/50 bg-muted/20 px-3 py-1.5 text-[11px] font-medium text-muted-foreground transition-colors hover:border-primary/30 hover:text-primary"
          >
            <Search className="size-3" aria-hidden="true" />
            Browse All
          </Link>
        </div>

        <div className="flex flex-col gap-3">
          {topMatches.map(({ podcast, match }, i) => (
            <TopMatchCard key={podcast.id} podcast={podcast} match={match} index={i} />
          ))}
        </div>
      </section>

      {/* ── Opportunity Distribution ──────────────────────── */}
      <section aria-labelledby="dist-heading">
        <div className="mb-5">
          <h2 id="dist-heading" className="text-[14px] font-bold text-foreground">
            Opportunity Distribution
          </h2>
          <p className="text-[11px] text-muted-foreground">
            How your {MOCK_PODCASTS.length} matches break down by rank tier
          </p>
        </div>
        <OpportunityDistribution distribution={distribution} total={MOCK_PODCASTS.length} />
      </section>

      {/* ── Visibility Recommendations ────────────────────── */}
      <VisibilityRecommendations recs={visRecs} />

    </div>
  )
}
