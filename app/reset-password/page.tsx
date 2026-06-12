import type { Metadata } from "next"
import { Suspense } from "react"
import Link from "next/link"
import { Mic2, Loader2 } from "lucide-react"
import { AuthBackground }    from "@/components/auth/auth-background"
import { AuthBrandingPanel } from "@/components/auth/auth-branding"
import { ResetPasswordClient } from "./reset-password-client"

export const metadata: Metadata = {
  title: "Set New Password — PodcastMatch AI",
  description: "Set a new password for your PodcastMatch AI account.",
  robots: { index: false, follow: false },
}

export default function ResetPasswordPage() {
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

            {/* Suspense required for useSearchParams inside ResetPasswordClient */}
            <Suspense
              fallback={
                <div className="glass-strong rounded-[var(--radius-xl)] border border-border/40 p-10 flex justify-center">
                  <Loader2 className="size-6 animate-spin text-muted-foreground" aria-hidden="true" />
                </div>
              }
            >
              <ResetPasswordClient />
            </Suspense>

          </div>
        </div>

      </div>
    </main>
  )
}
