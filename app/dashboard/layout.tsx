import type { Metadata } from "next"
import { SidebarProvider }   from "@/components/dashboard/sidebar-context"
import { DashboardShell }    from "@/components/dashboard/dashboard-shell"
import { FeedbackWidget }    from "@/components/beta/feedback-widget"

export const metadata: Metadata = {
  title: "Dashboard — PodcastMatch AI",
  description: "Your AI-powered podcast booking workspace.",
  robots: { index: false, follow: false },
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <DashboardShell>
        {children}
      </DashboardShell>
      {/* Beta feedback widget — fixed bottom-right */}
      <FeedbackWidget />
    </SidebarProvider>
  )
}
