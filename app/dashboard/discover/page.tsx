import type { Metadata } from "next"
import { DiscoveryProvider } from "@/components/discovery/discovery-context"
import { DiscoverySearchBar } from "@/components/discovery/search-bar"
import { DiscoveryFilterSidebar, DiscoveryFilterDrawer } from "@/components/discovery/filter-panel"
import { DiscoveryResultsGrid } from "@/components/discovery/results-grid"
import { DiscoveryInsightPanel } from "@/components/discovery/insight-panel"

export const metadata: Metadata = {
  title: "Discover Podcasts — PodcastMatch AI",
  description: "AI-powered podcast discovery. Find perfectly matched podcast opportunities in seconds.",
}

/* ═══════════════════════════════════════════════════════════
   AI Podcast Discovery Engine page.
   Layout: SearchBar | [FilterSidebar · Results · InsightPanel]
   All filtering/sorting state lives in DiscoveryProvider.
   Backend data: swap MOCK_PODCASTS in mock-data.ts with
   an API call inside discovery-context.tsx when ready.
   ═══════════════════════════════════════════════════════════ */

export default function DiscoverPage() {
  return (
    <DiscoveryProvider>

      {/* Mobile filter drawer (portal-style, rendered at body level via fixed positioning) */}
      <DiscoveryFilterDrawer />

      <div className="flex flex-col gap-6 max-w-[1600px]">

        {/* ── Page header ─────────────────────────────── */}
        <div className="flex flex-col gap-1">
          <h1 className="text-h3 font-bold text-foreground">
            Discover <span className="gradient-text-primary">Podcasts</span>
          </h1>
          <p className="text-sm text-muted-foreground">
            AI is scanning <span className="font-semibold text-foreground">50,000+</span> active shows to surface your best opportunities.
          </p>
        </div>

        {/* ── Search bar ──────────────────────────────── */}
        <DiscoverySearchBar />

        {/* ── Main layout: Filters | Results | Insights ── */}
        <div className="flex gap-6 items-start">

          {/* Left: filter sidebar (xl+) */}
          <DiscoveryFilterSidebar />

          {/* Center: results */}
          <DiscoveryResultsGrid />

          {/* Right: AI insight panel (2xl+) */}
          <DiscoveryInsightPanel />

        </div>

      </div>
    </DiscoveryProvider>
  )
}
