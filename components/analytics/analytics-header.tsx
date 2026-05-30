"use client"

import { motion } from "motion/react"
import { Brain, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAnalytics } from "@/components/analytics/analytics-context"
import { type TimeRange } from "@/components/analytics/analytics-mock"

/* ═══════════════════════════════════════════════════════════
   AnalyticsHeader — title + inline time-range picker.
   ═══════════════════════════════════════════════════════════ */

const RANGES: { value: TimeRange; label: string }[] = [
  { value: "7d",  label: "7 days"  },
  { value: "30d", label: "30 days" },
  { value: "90d", label: "90 days" },
  { value: "all", label: "All time"},
]

export function AnalyticsHeader() {
  const { range, setRange, metrics } = useAnalytics()

  return (
    <header className="flex flex-col gap-5">

      {/* ── Title + time range ───────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-wrap items-start justify-between gap-4"
      >
        {/* Left: title block */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <div className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" aria-hidden="true" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
            </div>
            <span className="text-[11px] font-semibold uppercase tracking-widest text-primary/70">
              AI Intelligence Active
            </span>
          </div>
          <h1 className="text-h3 font-bold text-foreground">
            Visibility <span className="gradient-text-primary">Intelligence</span> Dashboard
          </h1>
          <p className="text-sm text-muted-foreground max-w-xl">
            AI is continuously analyzing your{" "}
            <span className="font-semibold text-foreground">creator visibility signals</span>,{" "}
            podcast match quality, and outreach momentum across the platform.
          </p>
        </div>

        {/* Right: time range selector */}
        <div
          role="group"
          aria-label="Select time range"
          className={cn(
            "flex items-center gap-0.5 self-start rounded-[var(--radius-lg)]",
            "border border-border/50 bg-card/50 backdrop-blur-sm p-0.5"
          )}
        >
          {RANGES.map(r => (
            <button
              key={r.value}
              onClick={() => setRange(r.value)}
              aria-pressed={range === r.value}
              className={cn(
                "relative rounded-[var(--radius-md)] px-3 py-1.5 text-xs font-semibold",
                "transition-all duration-200",
                range === r.value
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {range === r.value && (
                <motion.span
                  layoutId="analytics-range-pill"
                  className="absolute inset-0 rounded-[var(--radius-md)] bg-background shadow-sm border border-border/50"
                  transition={{ type: "spring", bounce: 0.18, duration: 0.35 }}
                />
              )}
              <span className="relative">{r.label}</span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* ── AI status bar ────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12, duration: 0.4 }}
        className={cn(
          "relative overflow-hidden rounded-[var(--radius-xl)] border border-border",
          "bg-card p-4 shadow-[var(--shadow-card)]"
        )}
        role="region"
        aria-label="AI analysis status"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px
                     bg-gradient-to-r from-transparent via-primary/20 to-transparent"
        />

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <div className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full",
              "border border-primary/30 bg-primary/10"
            )}>
              <Brain className="size-4 text-primary" aria-hidden="true" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[11px] font-semibold text-foreground">AI Analysis Up-to-Date</span>
              <span className="text-[10px] text-muted-foreground">Last scan: 2 minutes ago</span>
            </div>
          </div>

          <div className="h-6 w-px bg-border/50 hidden sm:block" aria-hidden="true" />

          {[
            { label: "Visibility Score",  value: `${metrics.visibility.current}`,          delta: `+${metrics.visibility.pctDelta}%`,  color: "text-primary"                },
            { label: "Audience Reach",    value: `${metrics.reach.current}K`,              delta: `+${metrics.reach.pctDelta}%`,       color: "text-[var(--premium-cyan)]"  },
            { label: "AI Match Quality",  value: `${metrics.match.current}%`,              delta: `+${metrics.match.pctDelta}%`,       color: "text-[var(--premium-gold)]"  },
            { label: "Response Rate",     value: `${metrics.response.current}%`,           delta: `+${metrics.response.pctDelta}%`,    color: "text-[oklch(0.70_0.16_145)]" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + i * 0.05 }}
              className="flex items-center gap-2"
            >
              <span className={cn("text-sm font-bold tabular-nums", stat.color)}>{stat.value}</span>
              <span className="text-[10px] text-muted-foreground">{stat.label}</span>
              <span className="text-[10px] font-semibold text-[oklch(0.70_0.16_145)]">{stat.delta}</span>
            </motion.div>
          ))}

          <div className="ml-auto flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <Sparkles className="size-3.5 text-primary/60" aria-hidden="true" />
            <span>4 new AI insights available</span>
          </div>
        </div>
      </motion.div>

    </header>
  )
}
