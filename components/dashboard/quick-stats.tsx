"use client"

import { motion } from "motion/react"
import { Sparkles, Bookmark, Send, Mic2 } from "lucide-react"
import { cn } from "@/lib/utils"

/* ═══════════════════════════════════════════════════════════
   QuickStatsRow — 4 animated KPI cards at the top of dashboard.
   Placeholder values. Slot real data in later.
   ═══════════════════════════════════════════════════════════ */

const STATS = [
  {
    label:       "AI Matches",
    value:       "847",
    delta:       "+12 today",
    deltaUp:     true,
    icon:        Sparkles,
    accent:      "cyan",
    iconBg:      "bg-[oklch(0.70_0.16_200/0.10)]",
    iconColor:   "text-[var(--premium-cyan)]",
    valueClass:  "gradient-text-cyan",
    borderHover: "hover:border-[oklch(0.70_0.16_200/0.30)]",
    glowHover:   "hover:shadow-[var(--shadow-card),var(--glow-cyan)]",
  },
  {
    label:       "Saved",
    value:       "23",
    delta:       "+3 this week",
    deltaUp:     true,
    icon:        Bookmark,
    accent:      "primary",
    iconBg:      "bg-primary/10",
    iconColor:   "text-primary",
    valueClass:  "gradient-text-primary",
    borderHover: "hover:border-primary/30",
    glowHover:   "hover:shadow-[var(--shadow-card),var(--glow-subtle)]",
  },
  {
    label:       "Outreach Sent",
    value:       "8",
    delta:       "5 responses",
    deltaUp:     true,
    icon:        Send,
    accent:      "gold",
    iconBg:      "bg-[oklch(0.78_0.15_83/0.10)]",
    iconColor:   "text-[var(--premium-gold)]",
    valueClass:  "gradient-text-gold",
    borderHover: "hover:border-[oklch(0.78_0.15_83/0.30)]",
    glowHover:   "hover:shadow-[var(--shadow-card),var(--glow-gold)]",
  },
  {
    label:       "Interviews Booked",
    value:       "2",
    delta:       "1 this month",
    deltaUp:     true,
    icon:        Mic2,
    accent:      "green",
    iconBg:      "bg-[oklch(0.55_0.16_145/0.10)]",
    iconColor:   "text-[oklch(0.70_0.16_145)]",
    valueClass:  "text-[oklch(0.70_0.16_145)]",
    borderHover: "hover:border-[oklch(0.55_0.16_145/0.30)]",
    glowHover:   "hover:shadow-[var(--shadow-card),0_0_20px_oklch(0.55_0.16_145/0.20)]",
  },
]

export function QuickStatsRow() {
  return (
    <div
      className="grid grid-cols-2 gap-3 xl:grid-cols-4"
      role="list"
      aria-label="Dashboard quick stats"
    >
      {STATS.map((stat, i) => (
        <motion.div
          key={stat.label}
          role="listitem"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.07, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className={cn(
            "group relative flex flex-col gap-3 rounded-[var(--radius-xl)] border border-border bg-card p-5",
            "shadow-[var(--shadow-card)] transition-all duration-200",
            "hover:-translate-y-0.5",
            stat.borderHover,
            stat.glowHover
          )}
        >
          {/* Top-edge shimmer */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-t-[var(--radius-xl)]
                       bg-gradient-to-r from-transparent via-[oklch(0.96_0_0/0.09)] to-transparent"
          />

          {/* Icon */}
          <div className={cn("flex h-9 w-9 items-center justify-center rounded-xl", stat.iconBg)}>
            <stat.icon className={cn("size-4", stat.iconColor)} aria-hidden="true" />
          </div>

          {/* Value */}
          <p className={cn("text-3xl font-bold leading-none tracking-tight", stat.valueClass)}>
            {stat.value}
          </p>

          {/* Label + delta */}
          <div>
            <p className="text-sm font-semibold text-foreground">{stat.label}</p>
            <p className={cn(
              "mt-0.5 text-[11px]",
              stat.deltaUp ? "text-[oklch(0.70_0.16_145)]" : "text-destructive"
            )}>
              {stat.deltaUp ? "↑ " : "↓ "}{stat.delta}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
