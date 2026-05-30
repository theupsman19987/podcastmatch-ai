import { type Metadata } from "next"
import { OutreachProvider }  from "@/components/outreach/outreach-context"
import { OutreachHeader }    from "@/components/outreach/outreach-header"
import { OutreachFilters }   from "@/components/outreach/outreach-filters"
import { PipelineBoard }     from "@/components/outreach/pipeline-board"
import { ActivityFeed }      from "@/components/outreach/activity-feed"

/* ═══════════════════════════════════════════════════════════
   /dashboard/outreach — Outreach Pipeline + Contact Management
   ═══════════════════════════════════════════════════════════ */

export const metadata: Metadata = {
  title:  "Outreach Pipeline | PodcastMatch AI",
  robots: { index: false, follow: false },
}

export default function OutreachPage() {
  return (
    <OutreachProvider>
      <div className="flex flex-col gap-6 px-4 py-6 md:px-6 lg:px-8 max-w-screen-2xl mx-auto w-full">

        {/* ── Page header ──────────────────────────────────── */}
        <OutreachHeader />

        {/* ── Filters ──────────────────────────────────────── */}
        <OutreachFilters />

        {/* ── Main layout: board + activity feed ───────────── */}
        <div className="flex gap-6 items-start min-w-0">

          {/* Pipeline board (grows to fill, scrolls internally on desktop) */}
          <div className="min-w-0 flex-1 overflow-hidden">
            <PipelineBoard />
          </div>

          {/* Activity feed (fixed width, sticky, xl+ only) */}
          <aside className="hidden xl:block w-72 shrink-0 sticky top-[calc(var(--topbar-h,56px)+24px)]">
            <ActivityFeed />
          </aside>

        </div>

      </div>
    </OutreachProvider>
  )
}
