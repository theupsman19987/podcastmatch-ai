"use client"

import Link from "next/link"
import { motion } from "motion/react"
import { ArrowLeft, Users, Mic2, TrendingUp, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { type DiscoveryPodcast, COVER_GRADIENTS } from "@/components/discovery/mock-data"
import { AiScoreBadge } from "@/components/ui/ai-score-badge"

/* ═══════════════════════════════════════════════════════════
   ProfileHeader — cinematic hero for the podcast detail page.
   Shows: cover art, name, host, tags, match score, key metrics.
   ═══════════════════════════════════════════════════════════ */

const ACTIVITY_LABEL: Record<DiscoveryPodcast["hostActivity"], string> = {
  weekly:   "Weekly episodes",
  biweekly: "Bi-weekly episodes",
  monthly:  "Monthly episodes",
}

const ACTIVITY_DOT: Record<DiscoveryPodcast["hostActivity"], string> = {
  weekly:   "bg-[oklch(0.65_0.15_145)]",
  biweekly: "bg-[oklch(0.75_0.14_83)]",
  monthly:  "bg-muted-foreground/50",
}

const VIS_BADGE: Record<DiscoveryPodcast["visibilityPotential"], { label: string; cls: string }> = {
  "very-high": { label: "Very High Visibility", cls: "bg-[oklch(0.78_0.15_83/0.18)] text-[var(--premium-gold)] border-[oklch(0.78_0.15_83/0.35)]" },
  "high":      { label: "High Visibility",      cls: "bg-primary/15 text-primary border-primary/30" },
  "medium":    { label: "Good Visibility",      cls: "bg-[oklch(0.70_0.16_200/0.15)] text-[var(--premium-cyan)] border-[oklch(0.70_0.16_200/0.30)]" },
  "growing":   { label: "Growing",              cls: "bg-[oklch(0.55_0.16_145/0.15)] text-[oklch(0.70_0.16_145)] border-[oklch(0.55_0.16_145/0.30)]" },
}

const ACCEPT_STYLES: Record<DiscoveryPodcast["guestAcceptance"], { label: string; cls: string }> = {
  open:      { label: "Open for Guests",    cls: "bg-[oklch(0.55_0.16_145/0.15)] text-[oklch(0.70_0.16_145)] border-[oklch(0.55_0.16_145/0.30)]" },
  selective: { label: "Selective Booking",  cls: "bg-[oklch(0.78_0.15_83/0.12)] text-[var(--premium-gold)] border-[oklch(0.78_0.15_83/0.25)]" },
}

interface ProfileHeaderProps {
  podcast: DiscoveryPodcast
}

export function ProfileHeader({ podcast }: ProfileHeaderProps) {
  const coverGradient = COVER_GRADIENTS[podcast.coverIndex % COVER_GRADIENTS.length]
  const vis = VIS_BADGE[podcast.visibilityPotential]
  const accept = ACCEPT_STYLES[podcast.guestAcceptance]
  const initials = podcast.name.split(" ").map(w => w[0]).join("").slice(0, 3)

  return (
    <header>
      {/* ── Back navigation ───────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-5"
      >
        <Link
          href="/dashboard/discover"
          className="inline-flex items-center gap-1.5 text-[12px] font-medium text-muted-foreground
                     transition-colors hover:text-foreground"
          aria-label="Back to discover"
        >
          <ArrowLeft className="size-3.5" aria-hidden="true" />
          Discover Podcasts
        </Link>
      </motion.div>

      {/* ── Hero card ─────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative overflow-hidden rounded-[var(--radius-2xl)] border border-border bg-card shadow-[var(--shadow-xl)]"
      >
        {/* Background gradient layer */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{ background: coverGradient }}
          aria-hidden="true"
        />

        {/* Grid overlay */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: "radial-gradient(circle, oklch(0.96 0 0 / 0.04) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        {/* Top edge color band */}
        <div
          className="absolute inset-x-0 top-0 h-1.5 rounded-t-[var(--radius-2xl)]"
          style={{ background: coverGradient }}
          aria-hidden="true"
        />

        <div className="relative px-6 py-7 sm:px-8 sm:py-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-7">

            {/* ── Cover art ─────────────────────────────── */}
            <motion.div
              initial={{ scale: 0.88, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
              className="relative mx-auto sm:mx-0 h-[120px] w-[120px] shrink-0 sm:h-[140px] sm:w-[140px]"
            >
              <div
                className="h-full w-full rounded-[var(--radius-xl)] flex items-center justify-center shadow-[var(--shadow-xl)]"
                style={{
                  background: coverGradient,
                  boxShadow: "var(--shadow-xl), 0 0 40px oklch(0.58 0.220 255 / 0.25)",
                }}
              >
                {/* Texture */}
                <div className="absolute inset-0 rounded-[var(--radius-xl)] opacity-20"
                  style={{
                    backgroundImage: "radial-gradient(circle, oklch(0.96 0 0 / 0.08) 1px, transparent 1px)",
                    backgroundSize: "16px 16px",
                  }}
                  aria-hidden="true"
                />
                <Mic2 className="absolute bottom-2 right-2 size-5 text-white/20" aria-hidden="true" />
                <span className="text-4xl font-black text-white/30 select-none tracking-tight">
                  {initials}
                </span>
              </div>

              {/* AI Recommended badge */}
              {podcast.badges.includes("ai-recommended") && (
                <div
                  className="absolute -right-2 -top-2 flex items-center gap-1 rounded-full border
                             border-primary/30 bg-card px-2 py-0.5 shadow-[var(--shadow-sm)]"
                >
                  <Sparkles className="size-2.5 text-primary" aria-hidden="true" />
                  <span className="text-[9px] font-bold text-primary">AI Pick</span>
                </div>
              )}
            </motion.div>

            {/* ── Info block ────────────────────────────── */}
            <div className="flex min-w-0 flex-1 flex-col gap-4 text-center sm:text-left">

              {/* Categories */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15 }}
                className="flex flex-wrap justify-center gap-1.5 sm:justify-start"
              >
                {podcast.categories.map(cat => (
                  <span
                    key={cat}
                    className="rounded-md border border-border/50 bg-muted/30 px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
                  >
                    {cat}
                  </span>
                ))}
              </motion.div>

              {/* Name */}
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18, duration: 0.4 }}
              >
                <h1 className="text-2xl font-bold text-foreground tracking-tight sm:text-3xl">
                  {podcast.name}
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Hosted by <span className="font-semibold text-foreground">{podcast.host}</span>
                </p>
              </motion.div>

              {/* Key badges row */}
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.22, duration: 0.4 }}
                className="flex flex-wrap justify-center gap-2 sm:justify-start"
              >
                <AiScoreBadge score={podcast.matchScore} size="md" label="AI Match" />

                <span className={cn(
                  "inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[11px] font-semibold",
                  accept.cls
                )}>
                  <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
                  {accept.label}
                </span>

                <span className={cn(
                  "inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[11px] font-semibold",
                  vis.cls
                )}>
                  <TrendingUp className="size-3" aria-hidden="true" />
                  {vis.label}
                </span>
              </motion.div>

              {/* Metrics row */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.28 }}
                className="flex flex-wrap justify-center gap-x-5 gap-y-1.5 sm:justify-start"
              >
                {[
                  {
                    icon: Users,
                    label: `${podcast.audienceSize}K listeners`,
                  },
                  {
                    icon: Mic2,
                    label: ACTIVITY_LABEL[podcast.hostActivity],
                    dotColor: ACTIVITY_DOT[podcast.hostActivity],
                  },
                ].map(item => (
                  <span
                    key={item.label}
                    className="flex items-center gap-1.5 text-xs text-muted-foreground"
                  >
                    {item.dotColor && (
                      <span className={cn("h-1.5 w-1.5 rounded-full", item.dotColor)} aria-hidden="true" />
                    )}
                    <item.icon className="size-3.5" aria-hidden="true" />
                    {item.label}
                  </span>
                ))}
              </motion.div>

            </div>
          </div>
        </div>
      </motion.div>
    </header>
  )
}
