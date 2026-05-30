"use client"

import { motion } from "motion/react"
import { TrendingUp, Zap, Sparkles, Clock, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { MOCK_AI_INSIGHTS, type AIInsight } from "@/components/analytics/analytics-mock"

/* ═══════════════════════════════════════════════════════════
   AIInsightPanel — large AI analysis insight section.
   ═══════════════════════════════════════════════════════════ */

const TONE_CONFIG: Record<
  AIInsight["tone"],
  { icon: React.ElementType; color: string; bg: string; border: string; dot: string }
> = {
  positive: {
    icon:   TrendingUp,
    color:  "text-[oklch(0.70_0.16_145)]",
    bg:     "bg-[oklch(0.55_0.16_145/0.08)]",
    border: "border-[oklch(0.55_0.16_145/0.25)]",
    dot:    "bg-[oklch(0.65_0.15_145)]",
  },
  opportunity: {
    icon:   Zap,
    color:  "text-[var(--premium-gold)]",
    bg:     "bg-[oklch(0.78_0.15_83/0.08)]",
    border: "border-[oklch(0.78_0.15_83/0.25)]",
    dot:    "bg-[var(--premium-gold)]",
  },
  alert: {
    icon:   Clock,
    color:  "text-[oklch(0.65_0.18_30)]",
    bg:     "bg-[oklch(0.60_0.200_30/0.08)]",
    border: "border-[oklch(0.60_0.200_30/0.22)]",
    dot:    "bg-[oklch(0.65_0.18_30)]",
  },
  info: {
    icon:   Sparkles,
    color:  "text-primary/80",
    bg:     "bg-primary/6",
    border: "border-primary/22",
    dot:    "bg-primary",
  },
}

/* ── Confidence arc ───────────────────────────────────────── */
function ConfidenceArc({ value, color }: { value: number; color: string }) {
  const R    = 14
  const circ = 2 * Math.PI * R
  const dash = (value / 100) * circ

  return (
    <div className="relative flex items-center justify-center" style={{ width: 38, height: 38 }}>
      <svg width="38" height="38" viewBox="0 0 38 38" aria-hidden="true" className="-rotate-90">
        <circle cx="19" cy="19" r={R} fill="none" strokeWidth="3" stroke="oklch(0.3 0 0 / 0.25)" />
        <motion.circle
          cx="19" cy="19" r={R}
          fill="none"
          strokeWidth="3"
          strokeLinecap="round"
          stroke="currentColor"
          className={color}
          strokeDasharray={`${circ} ${circ}`}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: circ - dash }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        />
      </svg>
      <span className={cn("absolute text-[10px] font-bold tabular-nums", color)}>
        {value}
      </span>
    </div>
  )
}

/* ── Single insight card ──────────────────────────────────── */
function InsightCard({ insight, index }: { insight: AIInsight; index: number }) {
  const cfg  = TONE_CONFIG[insight.tone]
  const Icon = cfg.icon

  return (
    <motion.div
      initial={{ opacity: 0, x: 8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, delay: 0.08 + index * 0.08 }}
      className={cn(
        "group flex gap-3 rounded-[var(--radius-lg)] border p-3.5",
        "transition-all duration-200 hover:border-border/80",
        cfg.border, cfg.bg
      )}
    >
      {/* Icon */}
      <div className={cn(
        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
        "border border-border/40 bg-card/60"
      )}>
        <Icon className={cn("size-4", cfg.color)} aria-hidden="true" />
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="text-[12px] font-bold text-foreground leading-tight">{insight.title}</p>
          <ConfidenceArc value={insight.confidence} color={cfg.color} />
        </div>
        <p className="mt-1 text-[11px] text-muted-foreground leading-relaxed">{insight.body}</p>

        {/* Metric chip */}
        <div className="mt-2 flex items-center gap-2">
          <span className={cn(
            "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[9px] font-bold",
            cfg.color, cfg.border
          )}>
            <span className={cn("inline-block h-1.5 w-1.5 rounded-full", cfg.dot)} aria-hidden="true" />
            {insight.metric}: {insight.metricDelta}
          </span>
          <button className={cn(
            "ml-auto flex items-center gap-0.5 text-[10px] font-semibold",
            cfg.color,
            "opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          )}>
            View detail
            <ChevronRight className="size-3" aria-hidden="true" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

/* ── Panel ────────────────────────────────────────────────── */
export function AIInsightPanel({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[var(--radius-xl)] border border-border/60",
        "bg-card/60 backdrop-blur-sm shadow-[var(--shadow-card)]",
        className
      )}
      role="region"
      aria-label="AI intelligence insights"
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
          <span className="text-sm font-bold text-foreground">AI Intelligence</span>
          <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary/15 px-1.5 text-[10px] font-bold text-primary tabular-nums">
            {MOCK_AI_INSIGHTS.length}
          </span>
        </div>
        <span className="text-[10px] text-muted-foreground">Confidence: avg {Math.round(MOCK_AI_INSIGHTS.reduce((s, i) => s + i.confidence, 0) / MOCK_AI_INSIGHTS.length)}%</span>
      </div>

      {/* Insights */}
      <div className="flex flex-col gap-2 p-3">
        {MOCK_AI_INSIGHTS.map((insight, i) => (
          <InsightCard key={insight.id} insight={insight} index={i} />
        ))}
      </div>

      {/* Footer */}
      <div className="border-t border-border/40 px-4 py-3">
        <div className="rounded-[var(--radius-lg)] bg-primary/6 border border-primary/15 px-3 py-2">
          <p className="text-[10px] text-muted-foreground leading-relaxed">
            <span className="font-semibold text-primary/80">AI analyzes</span>{" "}
            host activity patterns, audience growth signals, and engagement metrics every 2 hours to surface actionable insights.
          </p>
        </div>
      </div>
    </div>
  )
}
