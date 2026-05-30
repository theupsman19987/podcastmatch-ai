import type { Metadata } from "next"
import { QuickStatsRow } from "@/components/dashboard/quick-stats"
import {
  AIMatchInsightsWidget,
  RecentOpportunitiesWidget,
  AudienceAlignmentWidget,
  VisibilityScoreWidget,
  CreatorMomentumWidget,
} from "@/components/dashboard/placeholder-modules"

export const metadata: Metadata = {
  title: "Dashboard — PodcastMatch AI",
}

/* ── Section header ───────────────────────────────────────── */
function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-4 flex flex-col gap-0.5">
      <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
    </div>
  )
}

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8 max-w-[1400px]">

      {/* ── Welcome header ────────────────────────────────── */}
      <div className="flex flex-col gap-1">
        <h1 className="text-h3 font-bold text-foreground">
          Good morning, <span className="gradient-text-primary">Jane</span> 👋
        </h1>
        <p className="text-sm text-muted-foreground">
          Your AI matching engine found <span className="font-semibold text-[var(--premium-cyan)]">12 new opportunities</span> since your last visit.
        </p>
      </div>

      {/* ── Quick stats ───────────────────────────────────── */}
      <section aria-labelledby="quick-stats-heading">
        <h2 id="quick-stats-heading" className="sr-only">Quick stats</h2>
        <QuickStatsRow />
      </section>

      {/* ── Main grid row 1: AI Insights + Visibility ─────── */}
      <section aria-labelledby="ai-insights-heading">
        <SectionHeader
          title="AI Intelligence"
          subtitle="Real-time matching powered by your profile"
        />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* AI Match Insights — spans 2 cols */}
          <div className="lg:col-span-2">
            <AIMatchInsightsWidget />
          </div>
          {/* Visibility Score — 1 col */}
          <VisibilityScoreWidget />
        </div>
      </section>

      {/* ── Main grid row 2: Opportunities ────────────────── */}
      <section aria-labelledby="opportunities-heading">
        <SectionHeader
          title="Recent Opportunities"
          subtitle="Podcasts you've interacted with recently"
        />
        <RecentOpportunitiesWidget />
      </section>

      {/* ── Main grid row 3: Audience + Momentum ──────────── */}
      <section aria-labelledby="insights-heading">
        <SectionHeader
          title="Creator Insights"
          subtitle="How your brand and momentum are performing"
        />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <AudienceAlignmentWidget />
          <CreatorMomentumWidget />
        </div>
      </section>

    </div>
  )
}
