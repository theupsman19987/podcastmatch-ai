"use client"

import { useRef } from "react"
import { motion, useInView } from "motion/react"
import { TrendingUp, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { RANK_CONFIG, type CategoryRecommendation } from "@/lib/matching/match-engine"

/* ═══════════════════════════════════════════════════════════
   VisibilityRecommendations — cross-category opportunity cards.
   Shows AI-analyzed category rankings from the podcast database.

   FUTURE AI INTEGRATION POINT:
   Replace recs prop with output from
   /api/match/recommendations (POST { creatorDna })
   ═══════════════════════════════════════════════════════════ */

function RecCard({ rec, index }: { rec: CategoryRecommendation; index: number }) {
  const ref  = useRef<HTMLDivElement>(null)
  const inView = useInView(ref as React.RefObject<Element>, { once: true })
  const rank = RANK_CONFIG[rec.rank]

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.06, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "flex flex-col gap-3 rounded-[var(--radius-xl)] border p-5",
        "transition-all duration-150 hover:-translate-y-0.5",
        "bg-card shadow-[var(--shadow-card)]",
        "border-border"
      )}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[13px] font-bold text-foreground leading-tight">{rec.category}</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            {rec.podcastCount} podcast{rec.podcastCount !== 1 ? "s" : ""} in your range
          </p>
        </div>
        <span className={cn(
          "shrink-0 rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide",
          rank.color, rank.border, rank.bg
        )}>
          {rec.strength}% avg
        </span>
      </div>

      {/* Strength bar */}
      <div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <motion.div
            className="h-full rounded-full gradient-primary"
            initial={{ width: 0 }}
            animate={inView ? { width: `${rec.strength}%` } : {}}
            transition={{ delay: 0.2 + index * 0.05, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
      </div>

      {/* Rank badge */}
      <div className="flex items-center justify-between">
        <span className={cn(
          "rounded-full border px-2 py-0.5 text-[10px] font-semibold",
          rank.color, rank.border, rank.bg
        )}>
          {rank.label}
        </span>
        <span className="flex items-center gap-1 text-[10px] text-muted-foreground/60">
          <TrendingUp className="size-3" aria-hidden="true" />
        </span>
      </div>

      {/* Insight */}
      <p className="text-[11px] leading-relaxed text-muted-foreground/80 border-t border-border/30 pt-3">
        {rec.insight}
      </p>
    </motion.div>
  )
}

interface VisibilityRecommendationsProps {
  recs: CategoryRecommendation[]
}

export function VisibilityRecommendations({ recs }: VisibilityRecommendationsProps) {
  return (
    <section aria-labelledby="vis-rec-heading">
      <div className="flex items-center gap-3 mb-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
          <Sparkles className="size-4 text-primary" aria-hidden="true" />
        </div>
        <div>
          <h2 id="vis-rec-heading" className="text-[14px] font-bold text-foreground">
            Visibility Recommendations
          </h2>
          <p className="text-[11px] text-muted-foreground">
            AI-ranked categories based on your creator profile
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {recs.map((rec, i) => (
          <RecCard key={rec.category} rec={rec} index={i} />
        ))}
      </div>
    </section>
  )
}
