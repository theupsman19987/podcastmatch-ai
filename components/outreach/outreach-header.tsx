"use client"

import { motion } from "motion/react"
import { Send, Mic2, CheckCircle2, TrendingUp, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { useOutreach } from "@/components/outreach/outreach-context"
import { PIPELINE_STATS } from "@/components/outreach/outreach-mock"

/* ═══════════════════════════════════════════════════════════
   OutreachHeader — pipeline title + KPI momentum bar.
   ═══════════════════════════════════════════════════════════ */

export function OutreachHeader() {
  const { total, countByStage } = useOutreach()

  const stats = [
    {
      icon:  Send,
      label: "In Pipeline",
      value: total,
      color: "text-foreground",
      bg:    "bg-muted/30",
    },
    {
      icon:  Mic2,
      label: "Responded",
      value: countByStage.responded,
      color: "text-[var(--premium-gold)]",
      bg:    "bg-[oklch(0.78_0.15_83/0.08)]",
    },
    {
      icon:  CheckCircle2,
      label: "Booked",
      value: countByStage.booked + countByStage.completed,
      color: "text-[oklch(0.70_0.16_145)]",
      bg:    "bg-[oklch(0.55_0.16_145/0.08)]",
    },
    {
      icon:  TrendingUp,
      label: "Avg Match",
      value: `${PIPELINE_STATS.avgMatch}%`,
      color: "text-primary",
      bg:    "bg-primary/8",
    },
  ]

  return (
    <header className="flex flex-col gap-5">

      {/* ── Title ────────────────────────────────────────── */}
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
            Outreach Pipeline Active
          </span>
        </div>
        <h1 className="text-h3 font-bold text-foreground">
          Your Visibility <span className="gradient-text-primary">Outreach Engine</span>
        </h1>
        <p className="text-sm text-muted-foreground max-w-xl">
          AI is actively tracking{" "}
          <span className="font-semibold text-foreground">{total} podcast relationships</span>{" "}
          — monitoring host activity, response windows, and booking opportunities in real time.
        </p>
      </motion.div>

      {/* ── KPI bar ──────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12, duration: 0.4 }}
        className={cn(
          "relative overflow-hidden rounded-[var(--radius-xl)] border border-border",
          "bg-card p-4 shadow-[var(--shadow-card)]"
        )}
        role="region"
        aria-label="Pipeline momentum metrics"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px
                     bg-gradient-to-r from-transparent via-primary/20 to-transparent"
        />

        <div className="flex flex-wrap items-center gap-3 sm:gap-6">

          <div className="flex flex-wrap gap-3" role="list">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                role="listitem"
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.18 + i * 0.06, duration: 0.3 }}
                className={cn(
                  "flex items-center gap-2 rounded-[var(--radius-lg)] px-3 py-2",
                  s.bg
                )}
              >
                <s.icon className={cn("size-3.5 shrink-0", s.color)} aria-hidden="true" />
                <span className={cn("text-sm font-bold tabular-nums", s.color)}>{s.value}</span>
                <span className="text-[11px] text-muted-foreground">{s.label}</span>
              </motion.div>
            ))}
          </div>

          <div className="hidden h-8 w-px bg-border/50 sm:block" aria-hidden="true" />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.42 }}
            className="flex items-center gap-2 text-[11px] text-muted-foreground"
          >
            <Sparkles className="size-3.5 shrink-0 text-primary/60" aria-hidden="true" />
            <span>
              <span className="font-semibold text-[var(--premium-cyan)]">
                {countByStage.responded} host{countByStage.responded !== 1 ? "s" : ""}
              </span>{" "}
              responded to outreach this week
            </span>
          </motion.div>

        </div>
      </motion.div>

    </header>
  )
}
