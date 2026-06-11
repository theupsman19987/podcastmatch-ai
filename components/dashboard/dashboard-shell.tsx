"use client"

import { useSidebar } from "@/components/dashboard/sidebar-context"
import { DashboardSidebar, MobileSidebarDrawer } from "@/components/dashboard/sidebar"
import { DashboardTopbar } from "@/components/dashboard/topbar"
import { AIDashboardAtmosphere } from "@/components/dashboard/ai-atmosphere"
import { motion } from "motion/react"

/* ═══════════════════════════════════════════════════════════
   DashboardShell — outermost layout wrapper.
   Sidebar + topbar + scrollable content area.
   All dashboard pages render as children inside the content.
   ═══════════════════════════════════════════════════════════ */

export function DashboardShell({
  children,
  title,
  firstName,
  initials,
  avatarUrl,
}: {
  children:   React.ReactNode
  title?:     string
  firstName?: string
  initials?:  string
  avatarUrl?: string | null
}) {
  const { collapsed } = useSidebar()

  return (
    <div className="relative flex min-h-dvh bg-background">
      {/* Ambient AI atmosphere — fixed, behind everything */}
      <AIDashboardAtmosphere />

      {/* ── Desktop sidebar ───────────────────────────────── */}
      <DashboardSidebar />

      {/* ── Mobile drawer ─────────────────────────────────── */}
      <MobileSidebarDrawer />

      {/* ── Main content column ───────────────────────────── */}
      <motion.div
        animate={{ marginLeft: 0 }}
        className="relative z-10 flex min-w-0 flex-1 flex-col"
      >
        <DashboardTopbar title={title} firstName={firstName} initials={initials} avatarUrl={avatarUrl} />

        <main
          id="main-content"
          className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8"
          tabIndex={-1}
        >
          {children}
        </main>
      </motion.div>
    </div>
  )
}
