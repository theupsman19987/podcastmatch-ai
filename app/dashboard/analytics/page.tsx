import { type Metadata } from "next"
import { AnalyticsProvider }    from "@/components/analytics/analytics-context"
import { AnalyticsHeader }      from "@/components/analytics/analytics-header"
import { MetricCards }          from "@/components/analytics/metric-cards"
import { VisibilityChart }      from "@/components/analytics/visibility-chart"
import { MatchTrendChart }      from "@/components/analytics/match-trend-chart"
import { MomentumTracker }      from "@/components/analytics/momentum-tracker"
import { AIInsightPanel }       from "@/components/analytics/ai-insight-panel"
import { RecommendationPanel }  from "@/components/analytics/recommendation-panel"
import { AnalyticsActivity }    from "@/components/analytics/analytics-activity"

/* ═══════════════════════════════════════════════════════════
   /dashboard/analytics — AI Analytics + Visibility Intelligence
   ═══════════════════════════════════════════════════════════ */

export const metadata: Metadata = {
  title:  "Analytics | PodcastMatch AI",
  robots: { index: false, follow: false },
}

export default function AnalyticsPage() {
  return (
    <AnalyticsProvider>
      <div className="flex flex-col gap-6 px-4 py-6 md:px-6 lg:px-8 max-w-screen-2xl mx-auto w-full">

        {/* ── Header + time range ──────────────────────────── */}
        <AnalyticsHeader />

        {/* ── 6 KPI metric cards ───────────────────────────── */}
        <MetricCards />

        {/* ── Main row: visibility chart + right panel ─────── */}
        <div className="flex gap-6 items-start">

          {/* Visibility chart (grows) */}
          <VisibilityChart className="min-w-0 flex-1" />

          {/* Right column: insights + activity (xl+) */}
          <div className="hidden xl:flex w-80 shrink-0 flex-col gap-4 sticky top-[calc(var(--topbar-h,56px)+24px)]">
            <AIInsightPanel />
            <AnalyticsActivity />
          </div>

        </div>

        {/* ── Secondary row: momentum + match trend ────────── */}
        <div className="flex gap-6 items-start flex-wrap lg:flex-nowrap">
          <MomentumTracker className="w-full lg:flex-1" />
          <MatchTrendChart  className="w-full lg:flex-1" />
        </div>

        {/* ── AI recommendations ───────────────────────────── */}
        <RecommendationPanel />

        {/* ── Mobile-only: insights + activity below charts ── */}
        <div className="flex flex-col gap-4 xl:hidden">
          <AIInsightPanel />
          <AnalyticsActivity />
        </div>

      </div>
    </AnalyticsProvider>
  )
}
