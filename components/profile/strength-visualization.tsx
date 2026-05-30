"use client"

import { useRef } from "react"
import { motion } from "motion/react"
import { useInView } from "motion/react"
import { cn } from "@/lib/utils"
import { MOCK_STRENGTHS, type StrengthDimension } from "@/components/profile/profile-mock"

/* ═══════════════════════════════════════════════════════════
   StrengthVisualization — 5 animated arc rings for creator
   strength dimensions.
   ═══════════════════════════════════════════════════════════ */

const COLOR_MAP: Record<
  StrengthDimension["color"],
  { stroke: string; text: string; bg: string; border: string; badge: string; badgeBg: string }
> = {
  primary: {
    stroke: "oklch(0.65 0.22 264)",
    text:   "text-primary",
    bg:     "bg-primary/8",
    border: "border-primary/25",
    badge:  "text-primary",
    badgeBg:"bg-primary/10",
  },
  cyan: {
    stroke: "oklch(0.70 0.16 200)",
    text:   "text-[var(--premium-cyan)]",
    bg:     "bg-[oklch(0.70_0.16_200/0.08)]",
    border: "border-[oklch(0.70_0.16_200/0.25)]",
    badge:  "text-[var(--premium-cyan)]",
    badgeBg:"bg-[oklch(0.70_0.16_200/0.10)]",
  },
  gold: {
    stroke: "oklch(0.78 0.15 83)",
    text:   "text-[var(--premium-gold)]",
    bg:     "bg-[oklch(0.78_0.15_83/0.08)]",
    border: "border-[oklch(0.78_0.15_83/0.25)]",
    badge:  "text-[var(--premium-gold)]",
    badgeBg:"bg-[oklch(0.78_0.15_83/0.10)]",
  },
  green: {
    stroke: "oklch(0.65 0.15 145)",
    text:   "text-[oklch(0.70_0.16_145)]",
    bg:     "bg-[oklch(0.55_0.16_145/0.08)]",
    border: "border-[oklch(0.55_0.16_145/0.25)]",
    badge:  "text-[oklch(0.70_0.16_145)]",
    badgeBg:"bg-[oklch(0.55_0.16_145/0.10)]",
  },
  purple: {
    stroke: "oklch(0.65 0.18 290)",
    text:   "text-[oklch(0.70_0.18_290)]",
    bg:     "bg-[oklch(0.55_0.18_290/0.08)]",
    border: "border-[oklch(0.55_0.18_290/0.25)]",
    badge:  "text-[oklch(0.70_0.18_290)]",
    badgeBg:"bg-[oklch(0.55_0.18_290/0.10)]",
  },
}

function StrengthRing({
  dim,
  delay,
}: {
  dim:   StrengthDimension
  delay: number
}) {
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref as React.RefObject<Element>, { once: true })
  const cols   = COLOR_MAP[dim.color]

  const R    = 34
  const circ = 2 * Math.PI * R
  const dash = (dim.value / 100) * circ

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={cn(
        "group flex flex-col items-center gap-3 rounded-[var(--radius-xl)] border p-4",
        "bg-card/60 backdrop-blur-sm shadow-[var(--shadow-card)]",
        "hover:shadow-[var(--shadow-card-hover)] transition-shadow duration-300",
        cols.border
      )}
    >
      {/* Ring */}
      <div className="relative flex items-center justify-center">
        <svg width="88" height="88" viewBox="0 0 88 88" aria-hidden="true" className="-rotate-90">
          {/* Track */}
          <circle cx="44" cy="44" r={R} fill="none" strokeWidth="4.5" stroke="oklch(0.25 0 0 / 0.35)" />
          {/* Fill */}
          <motion.circle
            cx="44" cy="44" r={R}
            fill="none"
            strokeWidth="4.5"
            strokeLinecap="round"
            stroke={cols.stroke}
            strokeDasharray={`${circ} ${circ}`}
            style={{ filter: `drop-shadow(0 0 5px ${cols.stroke}60)` }}
            initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: inView ? circ - dash : circ }}
            transition={{ duration: 1.0, delay: delay + 0.15, ease: "easeOut" }}
          />
        </svg>

        {/* Center value */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className={cn("text-[18px] font-bold tabular-nums leading-none", cols.text)}
            initial={{ opacity: 0 }}
            animate={{ opacity: inView ? 1 : 0 }}
            transition={{ delay: delay + 0.5 }}
          >
            {dim.value}
          </motion.span>
          <span className="text-[9px] text-muted-foreground/60 mt-0.5">/ 100</span>
        </div>
      </div>

      {/* Label + insight */}
      <div className="flex flex-col items-center gap-1.5 text-center">
        <span className="text-xs font-bold text-foreground leading-tight">{dim.label}</span>
        <p className="text-[10px] text-muted-foreground leading-snug max-w-[120px]">{dim.description}</p>
        <span className={cn(
          "rounded-full border px-2 py-0.5 text-[9px] font-bold",
          cols.badge, cols.badgeBg, cols.border
        )}>
          {dim.insight}
        </span>
      </div>
    </motion.div>
  )
}

export function StrengthVisualization() {
  return (
    <div
      className="flex flex-col gap-4"
      role="region"
      aria-label="Creator strength visualization"
    >
      <div className="flex items-center gap-2">
        <span className="text-sm font-bold text-foreground">Creator Strength Profile</span>
        <span className="text-[11px] text-muted-foreground">— AI-analyzed across 5 dimensions</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {MOCK_STRENGTHS.map((dim, i) => (
          <StrengthRing key={dim.id} dim={dim} delay={i * 0.08} />
        ))}
      </div>
    </div>
  )
}
