import { type Metadata } from "next"
import { ProfileProvider }           from "@/components/profile/profile-context"
import { ProfileHeader }             from "@/components/profile/profile-header"
import { BrandSummary }              from "@/components/profile/brand-summary"
import { StrengthVisualization }     from "@/components/profile/strength-visualization"
import { CategoryAlignment }         from "@/components/profile/category-alignment"
import { ProfileEditor }             from "@/components/profile/profile-editor"
import { AIProfileInsights }         from "@/components/profile/ai-profile-insights"
import { ProfileRecommendations }    from "@/components/profile/profile-recommendations"

/* ═══════════════════════════════════════════════════════════
   /dashboard/profile — Creator Profile + AI Brand Identity
   ═══════════════════════════════════════════════════════════ */

export const metadata: Metadata = {
  title:  "Creator Profile | PodcastMatch AI",
  robots: { index: false, follow: false },
}

export default function ProfilePage() {
  return (
    <ProfileProvider>
      <div className="flex flex-col gap-6 px-4 py-6 md:px-6 lg:px-8 max-w-screen-2xl mx-auto w-full">

        {/* ── Cinematic profile header (full-width) ─────── */}
        <ProfileHeader />

        {/* ── Main body: left content + right sidebar ───── */}
        <div className="flex gap-6 items-start">

          {/* ── Left column: main profile content ─────────── */}
          <div className="min-w-0 flex-1 flex flex-col gap-8">

            {/* AI brand summary + completeness */}
            <BrandSummary />

            {/* 5-ring strength visualization */}
            <StrengthVisualization />

            {/* 6-card category alignment grid */}
            <CategoryAlignment />

            {/* Editable profile modules */}
            <ProfileEditor />

          </div>

          {/* ── Right column: AI panels (sticky, xl+ only) ─── */}
          <aside className="hidden xl:flex xl:flex-col gap-6 w-80 shrink-0 sticky top-[calc(var(--topbar-h,56px)+24px)]">

            {/* AI profile analysis */}
            <AIProfileInsights />

            {/* AI growth recommendations */}
            <ProfileRecommendations />

          </aside>

        </div>

        {/* ── Mobile-only AI panels (below main content) ── */}
        <div className="xl:hidden flex flex-col gap-6">
          <AIProfileInsights />
          <ProfileRecommendations />
        </div>

      </div>
    </ProfileProvider>
  )
}
