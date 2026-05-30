import { type Metadata } from "next"
import { NotificationsProvider }  from "@/components/notifications/notifications-context"
import { NotificationsHeader }    from "@/components/notifications/notifications-header"
import { NotificationsFilters }   from "@/components/notifications/notifications-filters"
import { ActivityTimeline }       from "@/components/notifications/activity-timeline"
import { AIAlertPanel }           from "@/components/notifications/ai-alert-panel"

/* ═══════════════════════════════════════════════════════════
   /dashboard/notifications — AI Notifications + Activity Center
   ═══════════════════════════════════════════════════════════ */

export const metadata: Metadata = {
  title:  "Notifications | PodcastMatch AI",
  robots: { index: false, follow: false },
}

export default function NotificationsPage() {
  return (
    <NotificationsProvider>
      <div className="flex flex-col gap-6 px-4 py-6 md:px-6 lg:px-8 max-w-screen-2xl mx-auto w-full">

        {/* ── Page header ──────────────────────────────────── */}
        <NotificationsHeader />

        {/* ── Filter tabs ──────────────────────────────────── */}
        <NotificationsFilters />

        {/* ── Main layout: timeline + AI alert panel ───────── */}
        <div className="flex gap-6 items-start">

          {/* Activity timeline (flex-1) */}
          <div className="min-w-0 flex-1">
            <ActivityTimeline />
          </div>

          {/* AI alert panel (sticky, xl+ only) */}
          <aside className="hidden xl:block w-72 shrink-0 sticky top-[calc(var(--topbar-h,56px)+24px)]">
            <AIAlertPanel />
          </aside>

        </div>

        {/* ── Mobile-only AI alert panel (below feed) ──────── */}
        <div className="xl:hidden">
          <AIAlertPanel />
        </div>

      </div>
    </NotificationsProvider>
  )
}
