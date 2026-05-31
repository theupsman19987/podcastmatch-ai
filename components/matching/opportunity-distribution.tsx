"use client"

import { useRef } from "react"
import { motion, useInView } from "motion/react"
import { cn } from "@/lib/utils"
import { RANK_CONFIG, type OpportunityRank } from "@/lib/matching/match-engine"

/* ═══════════════════════════════════════════════════════════
   OpportunityDistribution — visual breakdown of all podcast
   matches by rank tier. Bar chart with count + percentage.
   ═══════════════════════════════════════════════════════════ */

const RANK_ORDER: OpportunityRank[] = ["elite", "strong", "good", "emerging"]

interface OpportunityDistributionProps {
  distribution: Record<OpportunityRank, number>
  total:        number
}

export function OpportunityDistribution({ distribution, total }: OpportunityDistributionProps) {
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref as React.RefObject<Element>, { once: true })

  return (
    <div
      ref={ref}
      className="rounded-[var(--radius-xl)] border border-border bg-card shadow-[var(--shadow-card)] overflow-hidden"
    >
      {/* Top-edge highlight */}
      <div
        aria-hidden
        className="h-px w-full bg-gradient-to-r from-transparent via-primary/20 to-transparent"
      />

      <div className="p-6 flex flex-col gap-5">
        {RANK_ORDER.map((rank, i) => {
          const count = distribution[rank] ?? 0
          const pct   = total > 0 ? Math.round((count / total) * 100) : 0
          const cfg   = RANK_CONFIG[rank]

          return (
            <div key={rank} className="flex items-center gap-4">
              {/* Label */}
              <div className="w-40 shrink-0">
                <p className={cn("text-[12px] font-bold", cfg.color)}>{cfg.label}</p>
                <p className="text-[10px] text-muted-foreground">
                  {count} podcast{count !== 1 ? "s" : ""}
                </p>
              </div>

              {/* Bar */}
              <div className="flex-1 h-3 overflow-hidden rounded-full bg-muted">
                <motion.div
                  className="h-full rounded-full gradient-primary"
                  initial={{ width: 0 }}
                  animate={inView ? { width: `${pct}%` } : {}}
                  transition={{
                    delay:    0.15 + i * 0.1,
                    duration: 0.7,
                    ease:     [0.16, 1, 0.3, 1],
                  }}
                  style={
                    rank === "elite"
                      ? { background: "oklch(0.78 0.150 83)" }
                      : rank === "good"
                      ? { background: "oklch(0.70 0.160 200)" }
                      : rank === "emerging"
                      ? { background: "oklch(0.65 0.150 145)" }
                      : undefined
                  }
                />
              </div>

              {/* Percentage */}
              <span className={cn("w-10 shrink-0 text-right text-[12px] font-bold tabular-nums", cfg.color)}>
                {pct}%
              </span>

              {/* Rank badge */}
              <span className={cn(
                "hidden sm:inline-flex shrink-0 items-center rounded-full border px-2 py-0.5 text-[9px] font-semibold",
                cfg.color, cfg.border, cfg.bg
              )}>
                {rank.toUpperCase()}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
