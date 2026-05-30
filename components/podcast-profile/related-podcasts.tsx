"use client"

import Link from "next/link"
import { motion } from "motion/react"
import { ArrowRight, Users, TrendingUp, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { type DiscoveryPodcast, COVER_GRADIENTS } from "@/components/discovery/mock-data"
import { AiScoreBadge } from "@/components/ui/ai-score-badge"

/* ═══════════════════════════════════════════════════════════
   RelatedPodcasts — compact cards for 3-4 similar shows.
   Creates perceived platform depth.
   ═══════════════════════════════════════════════════════════ */

const VIS_CLS: Record<DiscoveryPodcast["visibilityPotential"], string> = {
  "very-high": "text-[var(--premium-gold)]",
  "high":      "text-primary",
  "medium":    "text-[var(--premium-cyan)]",
  "growing":   "text-[oklch(0.70_0.16_145)]",
}

interface RelatedPodcastsProps {
  related: DiscoveryPodcast[]
}

export function RelatedPodcasts({ related }: RelatedPodcastsProps) {
  if (related.length === 0) return null

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.45 }}
      aria-labelledby="related-heading"
      className="flex flex-col gap-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-muted-foreground" aria-hidden="true" />
          <h2 id="related-heading" className="text-sm font-semibold text-foreground">
            Similar Opportunities
          </h2>
        </div>
        <Link
          href="/dashboard/discover"
          className="flex items-center gap-1 text-[11px] font-medium text-primary transition-colors hover:text-primary/80"
        >
          View all <ArrowRight className="size-3" aria-hidden="true" />
        </Link>
      </div>

      {/* Cards grid */}
      <div
        className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        role="list"
      >
        {related.map((podcast, i) => {
          const gradient = COVER_GRADIENTS[podcast.coverIndex % COVER_GRADIENTS.length]
          const initials = podcast.name.split(" ").map(w => w[0]).join("").slice(0, 2)

          return (
            <motion.div
              key={podcast.id}
              role="listitem"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65 + i * 0.07, duration: 0.35 }}
            >
              <Link
                href={`/dashboard/discover/${podcast.id}`}
                className={cn(
                  "group flex items-center gap-3 rounded-[var(--radius-xl)] border border-border bg-card p-3.5",
                  "shadow-[var(--shadow-card)] transition-all duration-200",
                  "hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-[var(--shadow-md),var(--glow-subtle)]"
                )}
                aria-label={`View ${podcast.name} — ${podcast.matchScore}% match`}
              >
                {/* Cover */}
                <div
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[var(--radius-lg)] text-[11px] font-black text-white/30"
                  style={{ background: gradient }}
                  aria-hidden="true"
                >
                  {initials}
                </div>

                {/* Info */}
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <p className="truncate text-[12px] font-semibold text-foreground transition-colors group-hover:text-primary">
                    {podcast.name}
                  </p>
                  <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="size-3" aria-hidden="true" />{podcast.audienceSize}K
                    </span>
                    <span className={cn("flex items-center gap-1", VIS_CLS[podcast.visibilityPotential])}>
                      <TrendingUp className="size-3" aria-hidden="true" />
                      {podcast.visibilityPotential === "very-high" ? "Very High" : podcast.visibilityPotential.charAt(0).toUpperCase() + podcast.visibilityPotential.slice(1)}
                    </span>
                  </div>
                </div>

                {/* Score */}
                <AiScoreBadge score={podcast.matchScore} size="sm" label="" />
              </Link>
            </motion.div>
          )
        })}
      </div>
    </motion.section>
  )
}
