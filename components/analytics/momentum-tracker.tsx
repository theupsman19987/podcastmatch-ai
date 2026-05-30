"use client"

import { useRef } from "react"
import { motion } from "motion/react"
import { useInView } from "motion/react"
import { cn } from "@/lib/utils"
import { MOCK_MOMENTUM, type MomentumDimension } from "@/components/analytics/analytics-mock"

/* ═══════════════════════════════════════════════════════════
   MomentumTracker — 4 animated arc rings for creator momentum.
   ═══════════════════════════════════════════════════════════ */

const COLOR_MAP: Record<MomentumDimension["color"], { stroke: string; glow: string; text: string; bg: string }> = {
  primary: {
    stroke: "oklch(0.65 0.22 264)",
    glow:   "oklch(0.55 0.22 264 / 0.40)",
    text:   "text-primary",
    bg:     "bg-primary/8",
  },
  cyan: {
    stroke: "oklch(0.70 0.16 200)",
    glow:   "oklch(0.70 0.16 200 / 0.35)",
    text:   "text-[var(--premium-cyan)]",
    bg:     "bg-[oklch(0.70_0.16_200/0.08)]",
  },
  gold: {
    stroke: "oklch(0.78 0.15 83)",
    glow:   "oklch(0.78 0.15 83 / 0.35)",
    text:   "text-[var(--premium-gold)]",
    bg:     "bg-[oklch(0.78_0.15_83/0.08)]",
  },
  green: {
    stroke: "oklch(0.65 0.15 145)",
    glow:   "oklch(0.55 0.16 145 / 0.35)",
    text:   "text-[oklch(0.70_0.16_145)]",
    bg:     "bg-[oklch(0.55_0.16_145/0.08)]",
  },
}

/* ── Single ring ──────────────────────────────────────────── */
function MomentumRing({
  dim,
  delay,
}: {
  dim:   MomentumDimension
  delay: number
}) {
  const ref    = useRef<SVGCircleElement>(null)
  const divRef = useRef<HTMLDivElement>(null)
  const inView = useInView(divRef as React.RefObject<Element>, { once: true })

  const R    = 36
  const circ = 2 * Math.PI * R
  const dash = (dim.value / 100) * circ
  const cols = COLOR_MAP[dim.color]

  return (
    <motion.div
      ref={divRef}
      initial={{ opacity: 0, scale: 0.88 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay }}
      className={cn(
        "flex flex-col items-center gap-3 rounded-[var(--radius-xl)] border border-border/50 p-4",
        "bg-card/60 backdrop-blur-sm shadow-[var(--shadow-card)]"
      )}
    >
      {/* Ring */}
      <div className="relative flex items-center justify-center">
        <svg width="96" height="96" viewBox="0 0 96 96" aria-hidden="true" className="-rotate-90">
          {/* Track */}
          <circle cx="48" cy="48" r={R} fill="none" strokeWidth="5" stroke="oklch(0.3 0 0 / 0.3)" />
          {/* Progress arc */}
          <motion.circle
            ref={ref}
            cx="48" cy="48" r={R}
            fill="none"
            strokeWidth="5"
            strokeLinecap="round"
            stroke={cols.stroke}
            strokeDasharray={`${circ} ${circ}`}
            style={{ filter: `drop-shadow(0 0 6px ${cols.glow})` }}
            initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: inView ? circ - dash : circ }}
            transition={{ duration: 1.0, delay: delay + 0.1, ease: "easeOut" }}
          />
        </svg>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className={cn("text-xl font-bold tabular-nums leading-none", cols.text)}
            initial={{ opacity: 0 }}
            animate={{ opacity: inView ? 1 : 0 }}
            transition={{ delay: delay + 0.4 }}
          >
            {dim.value}
          </motion.span>
          <span className="text-[9px] text-muted-foreground mt-0.5">/ 100</span>
        </div>
      </div>

      {/* Dimension label */}
      <div className="flex flex-col items-center gap-1 text-center">
        <span className="text-xs font-semibold text-foreground leading-tight">{dim.label}</span>
        <span className={cn(
          "rounded-full border px-2 py-0.5 text-[9px] font-bold",
          cols.text, cols.bg,
          dim.color === "primary"
            ? "border-primary/25"
            : dim.color === "cyan"
            ? "border-[oklch(0.70_0.16_200/0.25)]"
            : dim.color === "gold"
            ? "border-[oklch(0.78_0.15_83/0.25)]"
            : "border-[oklch(0.55_0.16_145/0.25)]"
        )}>
          {dim.delta}
        </span>
      </div>
    </motion.div>
  )
}

/* ── Main export ──────────────────────────────────────────── */
export function MomentumTracker({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[var(--radius-xl)] border border-border/60",
        "bg-card/50 backdrop-blur-sm p-4 shadow-[var(--shadow-card)]",
        className
      )}
      role="region"
      aria-label="Creator momentum tracker"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px
                   bg-gradient-to-r from-transparent via-primary/20 to-transparent"
      />

      <div className="mb-4 flex flex-col gap-0.5">
        <span className="text-sm font-bold text-foreground">Creator Momentum</span>
        <span className="text-[11px] text-muted-foreground">AI-tracked velocity across 4 growth dimensions</span>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {MOCK_MOMENTUM.map((dim, i) => (
          <MomentumRing key={dim.id} dim={dim} delay={i * 0.1} />
        ))}
      </div>
    </div>
  )
}
