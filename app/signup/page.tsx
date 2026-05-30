import type { Metadata } from "next"
import Link from "next/link"
import { Mic2 } from "lucide-react"
import { AuthBackground } from "@/components/auth/auth-background"
import { AuthBrandingPanel } from "@/components/auth/auth-branding"
import { SignupForm } from "@/components/auth/signup-form"

export const metadata: Metadata = {
  title: "Create Account — PodcastMatch AI | AI Podcast Discovery Platform",
  description:
    "Join 15,000+ creators on PodcastMatch AI. Discover AI-matched podcast opportunities, get personalized pitches, and grow your podcast visibility today.",
}

export default function SignupPage() {
  return (
    <main
      id="main-content"
      className="relative min-h-dvh overflow-hidden"
      aria-label="PodcastMatch AI — create account"
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

            {/* Mobile logo — only shown below lg */}
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

            <SignupForm />

          </div>
        </div>

      </div>
    </main>
  )
}
