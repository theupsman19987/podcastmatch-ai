"use client"

import { motion } from "motion/react"
import { TrendingUp, Zap, Sparkles, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { MOCK_PROFILE_INSIGHTS, type AIProfileInsight } from "@/components/profile/profile-mock"

/* ═══════════════════════════════════════════════════════════
   AIProfileInsights — right-column AI analysis panel.
   ═══════════════════════════════════════════════════════════ */

const TONE_CFG: Record<
  AIProfileInsight["tone"],
  { icon: React.ElementType; color: string; bg: string; border: string; dot: string; arc: string }
> = {
  positive: {
    icon:   TrendingUp,
    color:  "text-[oklch(0.70_0.16_145)]",
    bg:     "bg-[oklch(0.55_0.16_145/0.08)]",
    border: "border-[oklch(0.55_0.16_145/0.22)]",
    dot:    "bg-[oklch(0.65_0.15_145)]",
    arc:    "oklch(0.65 0.15 145)",
  },
  opportunity: {
    icon:   Zap,
    color:  "text-[var(--premium-gold)]",
    bg:     "bg-[oklch(0.78_0.15_83/0.08)]",
    border: "border-[oklch(0.78_0.15_83/0.22)]",
    dot:    "bg-[var(--premium-gold)]",
    arc:    "oklch(0.78 0.15 83)",
  },
  info: {
    icon:   Sparkles,
    color:  "text-primary/80",
    bg:     "bg-primary/6",
    border: "border-primary/20",
    dot:    "bg-primary",
    arc:    "oklch(0.65 0.22 264)",
  },
}

function ConfidenceRing({ value, stroke }: { value: number; stroke: string }) {
  const R    = 11
  const circ = 2 * Math.PI * R
  const dash = (value / 100) * circ

  return (
    <div className="relative flex items-center justify-center" style={{ width: 30, height: 30 }}>
      <svg width="30" height="30" viewBox="0 0 30 30" aria-hidden="true" className="-rotate-90">
        <circle cx="15" cy="15" r={R} fill="none" strokeWidth="2.5" stroke="oklch(0.3 0 0 / 0.3)" />
        <motion.circle
          cx="15" cy="15" r={R}
          fill="none" strokeWidth="2.5" strokeLinecap="round"
          stroke={stroke}
          strokeDasharray={`${circ} ${circ}`}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: circ - dash }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
        />
      </svg>
      <span className="absolute text-[8px] font-bold text-foreground/80">{value}</span>
    </div>
  )
}

function InsightCard({ insight, index }: { insight: AIProfileInsight; index: number }) {
  const cfg  = TONE_CFG[insight.tone]
  const Icon = cfg.icon

  return (
    <motion.div
      initial={{ opacity: 0, x: 8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: 0.1 + index * 0.08 }}
      className={cn(
        "group flex gap-3 rounded-[var(--radius-lg)] border p-3",
        "transition-colors hover:brightness-110",
        cfg.border, cfg.bg
      )}
    >
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border/40 bg-card/60">
        <Icon className={cn("size-3.5", cfg.color)} aria-hidden="true" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="text-[11px] font-bold text-foreground leading-tight">{insight.title}</p>
          <ConfidenceRing value={insight.confidence} stroke={cfg.arc} />
        </div>
        <p className="mt-1 text-[10px] text-muted-foreground leading-relaxed">{insight.body}</p>
      </div>
    </motion.div>
  )
}

export function AIProfileInsights({ className }: { className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      className={cn(
        "relative overflow-hidden rounded-[var(--radius-xl)] border border-border/60",
        "bg-card/60 backdrop-blur-sm shadow-[var(--shadow-card)]",
        className
      )}
      role="region"
      aria-label="AI profile insights"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px
                   bg-gradient-to-r from-transparent via-primary/25 to-transparent"
      />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/40 px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" aria-hidden="true" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
          </div>
          <span className="text-xs font-bold text-foreground">AI Profile Analysis</span>
          <span className="inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-primary/15 px-1 text-[9px] font-bold text-primary">
            {MOCK_PROFILE_INSIGHTS.length}
          </span>
        </div>
        <span className="text-[10px] text-muted-foreground">avg {Math.round(MOCK_PROFILE_INSIGHTS.reduce((s,i) => s + i.confidence, 0) / MOCK_PROFILE_INSIGHTS.length)}% confidence</span>
      </div>

      {/* Insights */}
      <div className="flex flex-col gap-2 p-3">
        {MOCK_PROFILE_INSIGHTS.map((insight, i) => (
          <InsightCard key={insight.id} insight={insight} index={i} />
        ))}
      </div>

      {/* Footer */}
      <div className="border-t border-border/40 px-4 py-3">
        <button className="flex w-full items-center justify-between text-[11px] font-semibold text-muted-foreground hover:text-foreground transition-colors group">
          <span className="flex items-center gap-1.5">
            <Sparkles className="size-3 text-primary/50 group-hover:text-primary/70 transition-colors" aria-hidden="true" />
            Full profile report
          </span>
          <ChevronRight className="size-3.5 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
        </button>
      </div>

      {/* AI note */}
      <div className="mx-3 mb-3 rounded-[var(--radius-lg)] border border-primary/15 bg-primary/5 px-3 py-2">
        <p className="text-[10px] text-muted-foreground leading-relaxed">
          <span className="font-semibold text-primary/80">AI re-analyzes</span>{" "}
          your profile every time you update keywords, topics, or complete a podcast appearance.
        </p>
      </div>
    </motion.div>
  )
}
