import type { Metadata } from "next"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Mic2 } from "lucide-react"
import { createClient }          from "@/lib/supabase/server"
import { AuthBackground }        from "@/components/auth/auth-background"
import { AuthBrandingPanel }     from "@/components/auth/auth-branding"
import { UpdatePasswordForm }    from "@/components/auth/update-password-form"

export const metadata: Metadata = {
  title: "Set New Password — PodcastMatch AI",
  description: "Set a new password for your PodcastMatch AI account.",
  robots: { index: false, follow: false },
}

export default async function UpdatePasswordPage() {
  /* Verify the user has a valid session (established by /auth/callback) */
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login?error=session_expired")

  return (
    <main
      id="main-content"
      className="relative min-h-dvh overflow-hidden"
      aria-label="PodcastMatch AI — set new password"
    >
      <AuthBackground />

      <div className="flex min-h-dvh">

        {/* ── Left: branding panel (desktop only) ─────────── */}
        <div className="hidden lg:block lg:w-[52%] xl:w-[55%]">
          <AuthBrandingPanel />
        </div>

        {/* ── Right: form panel ───────────────────────────── */}
        <div className="flex w-full lg:w-[48%] xl:w-[45%] min-h-dvh items-start lg:items-center justify-center py-10 px-6 sm:px-10">
          <div className="w-full max-w-[420px]">

            {/* Mobile logo */}
            <Link
              href="/"
              className="mb-7 flex items-center gap-2.5 group lg:hidden"
              aria-label="PodcastMatch AI home"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-sm)] gradient-primary shadow-[var(--shadow-btn)] transition-shadow duration-200 group-hover:shadow-[var(--glow-primary)]">
                <Mic2 className="size-4 text-white" aria-hidden="true" />
              </div>
              <span className="text-[15px] font-bold text-foreground tracking-tight">
                PodcastMatch{" "}
                <span className="gradient-text-primary">AI</span>
              </span>
            </Link>

            <UpdatePasswordForm />

          </div>
        </div>

      </div>
    </main>
  )
}
