"use client"

import { motion } from "motion/react"
import { Sparkles, TrendingUp, Bookmark, Star, Bell } from "lucide-react"
import { cn } from "@/lib/utils"
import { useSaved } from "@/components/saved/saved-context"

/* ═══════════════════════════════════════════════════════════
   SavedHeader — page title + creator momentum bar.
   Communicates that the AI is actively managing the pipeline.
   ═══════════════════════════════════════════════════════════ */

export function SavedHeader() {
  const { total, counts } = useSaved()

  const momentumStats = [
    {
      icon:  Bookmark,
      label: "Saved",
      value: total,
      color: "text-foreground",
      bg:    "bg-muted/30",
    },
    {
      icon:  Bell,
      label: "Active Alerts",
      value: 4,
      color: "text-[var(--premium-cyan)]",
      bg:    "bg-[oklch(0.70_0.16_200/0.08)]",
    },
    {
      icon:  Star,
      label: "High Priority",
      value: counts["high-priority"],
      color: "text-[var(--premium-gold)]",
      bg:    "bg-[oklch(0.78_0.15_83/0.08)]",
    },
    {
      icon:  TrendingUp,
      label: "Momentum",
      value: "+23%",
      color: "text-[oklch(0.70_0.16_145)]",
      bg:    "bg-[oklch(0.55_0.16_145/0.08)]",
    },
  ]

  return (
    <header className="flex flex-col gap-5">

      {/* ── Title block ───────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col gap-1.5"
      >
        <div className="flex items-center gap-2">
          <div className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" aria-hidden="true" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-widest text-primary/70">
            AI Watchlist Active
          </span>
        </div>
        <h1 className="text-h3 font-bold text-foreground">
          Your Visibility <span className="gradient-text-primary">Pipeline</span>
        </h1>
        <p className="text-sm text-muted-foreground max-w-xl">
          AI is actively monitoring{" "}
          <span className="font-semibold text-foreground">{total} saved opportunities</span>{" "}
          for audience shifts, host activity, and optimal outreach windows.
        </p>
      </motion.div>

      {/* ── Momentum bar ──────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12, duration: 0.4 }}
        className="relative overflow-hidden rounded-[var(--radius-xl)] border border-border bg-card p-4 shadow-[var(--shadow-card)]"
        role="region"
        aria-label="Pipeline momentum metrics"
      >
        {/* Top-edge highlight */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px
                     bg-gradient-to-r from-transparent via-primary/20 to-transparent"
        />

        <div className="flex flex-wrap items-center gap-3 sm:gap-6">

          {/* Stats */}
          <div className="flex flex-wrap gap-3" role="list">
            {momentumStats.map((stat, i) => (
              <motion.div
                key={stat.label}
                role="listitem"
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.18 + i * 0.06, duration: 0.3 }}
                className={cn(
                  "flex items-center gap-2 rounded-[var(--radius-lg)] px-3 py-2",
                  stat.bg
                )}
              >
                <stat.icon className={cn("size-3.5 shrink-0", stat.color)} aria-hidden="true" />
                <span className={cn("text-sm font-bold tabular-nums", stat.color)}>
                  {stat.value}
                </span>
                <span className="text-[11px] text-muted-foreground">{stat.label}</span>
              </motion.div>
            ))}
          </div>

          {/* Divider */}
          <div className="hidden h-8 w-px bg-border/50 sm:block" aria-hidden="true" />

          {/* Insight text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-2 text-[11px] text-muted-foreground"
          >
            <Sparkles className="size-3.5 shrink-0 text-primary/60" aria-hidden="true" />
            <span>
              <span className="font-semibold text-[var(--premium-cyan)]">3 tracked podcasts</span>
              {" "}showing new activity signals this week
            </span>
          </motion.div>

        </div>
      </motion.div>

    </header>
  )
}
