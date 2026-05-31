"use client"

import Link from "next/link"
import { motion } from "motion/react"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { COVER_GRADIENTS, type DiscoveryPodcast } from "@/components/discovery/mock-data"
import { RANK_CONFIG, type MatchResult } from "@/lib/matching/match-engine"

/* ═══════════════════════════════════════════════════════════
   TopMatchCard — premium horizontal match card for the
   AI Matches hub. Shows score, rank, and explanation bullets.
   ═══════════════════════════════════════════════════════════ */

interface TopMatchCardProps {
  podcast: DiscoveryPodcast
  match:   MatchResult
  index?:  number
}

export function TopMatchCard({ podcast, match, index = 0 }: TopMatchCardProps) {
  const cover  = COVER_GRADIENTS[podcast.coverIndex % COVER_GRADIENTS.length]
  const rank   = RANK_CONFIG[match.opportunityRank]
  const isElite = match.opportunityRank === "elite"

  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.07, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "group relative flex items-start gap-5 rounded-[var(--radius-xl)] border p-5",
        "transition-all duration-200 hover:-translate-y-0.5",
        "bg-card shadow-[var(--shadow-card)]",
        isElite
          ? "border-[oklch(0.78_0.15_83/0.30)] hover:border-[oklch(0.78_0.15_83/0.50)] hover:shadow-[var(--shadow-lg)]"
          : "border-border hover:border-primary/25 hover:shadow-[var(--shadow-lg)]"
      )}
    >
      {/* Top-edge glow */}
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 h-px",
          isElite
            ? "bg-gradient-to-r from-transparent via-[var(--premium-gold)]/30 to-transparent"
            : "bg-gradient-to-r from-transparent via-primary/20 to-transparent"
        )}
      />

      {/* Cover */}
      <div
        className="relative h-16 w-16 shrink-0 rounded-[var(--radius-lg)] flex items-center justify-center overflow-hidden"
        style={{ background: cover }}
        aria-hidden="true"
      >
        <span className="text-sm font-black text-white/35 select-none">
          {podcast.name.split(" ").map(w => w[0]).join("").slice(0, 2)}
        </span>
        {/* Rank indicator overlay */}
        <div className={cn(
          "absolute inset-0 opacity-20",
          isElite ? "bg-[var(--premium-gold)]" : ""
        )} />
      </div>

      {/* Info */}
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="min-w-0">
            <Link
              href={`/dashboard/discover/${podcast.id}`}
              className="text-[14px] font-bold text-foreground transition-colors group-hover:text-primary line-clamp-1 hover:underline underline-offset-2"
            >
              {podcast.name}
            </Link>
            <p className="text-[11px] text-muted-foreground mt-0.5">Hosted by {podcast.host}</p>
          </div>
          <span className={cn(
            "shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-bold tabular-nums",
            isElite
              ? "border-[oklch(0.78_0.15_83/0.35)] bg-[oklch(0.78_0.15_83/0.12)] gradient-text-gold"
              : "border-primary/35 bg-primary/10 gradient-text-primary"
          )}>
            {podcast.matchScore}% Match
          </span>
        </div>

        {/* Rank + categories */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className={cn(
            "rounded-full border px-2 py-0.5 text-[10px] font-semibold",
            rank.color, rank.border, rank.bg
          )}>
            {rank.label}
          </span>
          {podcast.categories.slice(0, 2).map(cat => (
            <span
              key={cat}
              className="rounded-md border border-border/40 bg-muted/20 px-2 py-0.5 text-[10px] text-muted-foreground/80"
            >
              {cat}
            </span>
          ))}
        </div>

        {/* Match explanations (condensed) */}
        <div className="flex flex-col gap-1.5">
          {match.whyThisMatches.slice(0, 2).map(exp => (
            <div key={exp.label} className="flex items-start gap-2">
              <span
                className={cn(
                  "mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full",
                  exp.tier === "gold"    ? "bg-[var(--premium-gold)]"  :
                  exp.tier === "primary" ? "bg-primary"                 :
                  "bg-[var(--premium-cyan)]"
                )}
                aria-hidden="true"
              />
              <p className="text-[11px] leading-snug text-muted-foreground/80 line-clamp-1">
                <span className={cn(
                  "font-semibold mr-1",
                  exp.tier === "gold"    ? "text-[var(--premium-gold)]"  :
                  exp.tier === "primary" ? "text-primary"                 :
                  "text-[var(--premium-cyan)]"
                )}>
                  {exp.label}:
                </span>
                {exp.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <Link
        href={`/dashboard/discover/${podcast.id}`}
        className={cn(
          "group/btn flex shrink-0 items-center gap-1.5 self-center rounded-[var(--radius-lg)] border px-3 py-2",
          "text-[11px] font-semibold transition-all duration-150",
          isElite
            ? "border-[oklch(0.78_0.15_83/0.30)] bg-[oklch(0.78_0.15_83/0.08)] text-[var(--premium-gold)] hover:bg-[oklch(0.78_0.15_83/0.15)]"
            : "border-primary/30 bg-primary/08 text-primary hover:bg-primary/15"
        )}
        aria-label={`View full match details for ${podcast.name}`}
      >
        View Match
        <ArrowRight className="size-3 transition-transform duration-150 group-hover/btn:translate-x-0.5" aria-hidden="true" />
      </Link>
    </motion.article>
  )
}
