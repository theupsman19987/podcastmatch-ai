import { type Metadata } from "next"
import { SavedProvider }   from "@/components/saved/saved-context"
import { SavedHeader }     from "@/components/saved/saved-header"
import { SavedFilters }    from "@/components/saved/saved-filters"
import { SavedGrid }       from "@/components/saved/saved-grid"
import { AIAlertPanel }    from "@/components/saved/ai-alert-panel"

/* ═══════════════════════════════════════════════════════════
   /dashboard/saved — Saved Opportunities + AI Watchlist
   ═══════════════════════════════════════════════════════════ */

export const metadata: Metadata = {
  title:  "Saved Opportunities | PodcastMatch AI",
  robots: { index: false, follow: false },
}

export default function SavedPage() {
  return (
    <SavedProvider>
      <div className="flex flex-col gap-6 px-4 py-6 md:px-6 lg:px-8 max-w-screen-2xl mx-auto w-full">

        {/* ── Page header ──────────────────────────────────── */}
        <SavedHeader />

        {/* ── Main layout: results + alert panel ──────────── */}
        <div className="flex gap-6 items-start">

          {/* Left col — filters + grid */}
          <div className="min-w-0 flex-1 flex flex-col gap-4">
            <SavedFilters />
            <SavedGrid />
          </div>

          {/* Right col — AI alert panel (hidden on mobile) */}
          <aside className="hidden xl:block w-72 shrink-0 sticky top-[calc(var(--topbar-h,56px)+24px)]">
            <AIAlertPanel />
          </aside>

        </div>
      </div>
    </SavedProvider>
  )
}
