import type { Metadata } from "next"
import { createClient }    from "@/lib/supabase/server"
import { SidebarProvider } from "@/components/dashboard/sidebar-context"
import { DashboardShell }  from "@/components/dashboard/dashboard-shell"
import { FeedbackWidget }  from "@/components/beta/feedback-widget"

export const metadata: Metadata = {
  title: "Dashboard — PodcastMatch AI",
  description: "Your AI-powered podcast booking workspace.",
  robots: { index: false, follow: false },
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const rawName  = (user?.user_metadata?.full_name as string | undefined) ?? user?.email ?? ""
  const firstName = rawName.split(" ")[0] || "Account"
  const initials  = rawName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n: string) => n[0].toUpperCase())
    .join("") || "?"

  const profileResult = user
    ? await supabase.from("profiles").select("avatar_url").eq("id", user.id).single()
    : null
  const avatarUrl = profileResult?.data?.avatar_url ?? null

  return (
    <SidebarProvider>
      <DashboardShell firstName={firstName} initials={initials} avatarUrl={avatarUrl}>
        {children}
      </DashboardShell>
      <FeedbackWidget />
    </SidebarProvider>
  )
}
