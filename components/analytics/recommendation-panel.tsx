"use client"

import { motion } from "motion/react"
import { Compass, Clock, TrendingUp, Sparkles, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { MOCK_RECOMMENDATIONS, type Recommendation } from "@/components/analytics/analytics-mock"

/* ═══════════════════════════════════════════════════════════
   RecommendationPanel — 4 AI recommendation cards.
   ═══════════════════════════════════════════════════════════ */

const ICON_MAP: Record<string, React.ElementType> = {
  "compass":     Compass,
  "clock":       Clock,
  "trending-up": TrendingUp,
  "sparkles":    Sparkles,
}

const COLOR_STYLES: Record<Recommendation["color"], {
  icon:   string
  badge:  string
  badgeBg: string
  badgeBorder: string
  btn:    string
  glow:   string
  topLine: string
}> = {
  primary: {
    icon:        "text-primary",
    badge:       "text-primary",
    badgeBg:     "bg-primary/8",
    badgeBorder: "border-primary/25",
    btn:         "text-primary hover:text-primary/80",
    glow:        "hover:shadow-[0_0_20px_oklch(0.55_0.22_264/0.12)]",
    topLine:     "from-primary/0 via-primary/30 to-primary/0",
  },
  cyan: {
    icon:        "text-[var(--premium-cyan)]",
    badge:       "text-[var(--premium-cyan)]",
    badgeBg:     "bg-[oklch(0.70_0.16_200/0.08)]",
    badgeBorder: "border-[oklch(0.70_0.16_200/0.25)]",
    btn:         "text-[var(--premium-cyan)] hover:text-[oklch(0.80_0.14_200)]",
    glow:        "hover:shadow-[0_0_20px_oklch(0.70_0.16_200/0.12)]",
    topLine:     "from-[oklch(0.70_0.16_200/0)] via-[oklch(0.70_0.16_200/0.30)] to-[oklch(0.70_0.16_200/0)]",
  },
  gold: {
    icon:        "text-[var(--premium-gold)]",
    badge:       "text-[var(--premium-gold)]",
    badgeBg:     "bg-[oklch(0.78_0.15_83/0.08)]",
    badgeBorder: "border-[oklch(0.78_0.15_83/0.25)]",
    btn:         "text-[var(--premium-gold)] hover:text-[oklch(0.85_0.13_83)]",
    glow:        "hover:shadow-[0_0_20px_oklch(0.78_0.15_83/0.12)]",
    topLine:     "from-[oklch(0.78_0.15_83/0)] via-[oklch(0.78_0.15_83/0.30)] to-[oklch(0.78_0.15_83/0)]",
  },
  green: {
    icon:        "text-[oklch(0.70_0.16_145)]",
    badge:       "text-[oklch(0.70_0.16_145)]",
    badgeBg:     "bg-[oklch(0.55_0.16_145/0.08)]",
    badgeBorder: "border-[oklch(0.55_0.16_145/0.25)]",
    btn:         "text-[oklch(0.70_0.16_145)] hover:text-[oklch(0.78_0.14_145)]",
    glow:        "hover:shadow-[0_0_20px_oklch(0.55_0.16_145/0.12)]",
    topLine:     "from-[oklch(0.55_0.16_145/0)] via-[oklch(0.65_0.15_145/0.30)] to-[oklch(0.55_0.16_145/0)]",
  },
}

function RecommendationCard({ rec, index }: { rec: Recommendation; index: number }) {
  const Icon  = ICON_MAP[rec.icon] ?? Sparkles
  const styles = COLOR_STYLES[rec.color]

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.06 + index * 0.08 }}
      className={cn(
        "group relative flex flex-col gap-3 overflow-hidden",
        "rounded-[var(--radius-xl)] border border-border/60 p-4",
        "bg-card/70 backdrop-blur-sm shadow-[var(--shadow-card)]",
        "transition-all duration-300",
        styles.glow
      )}
    >
      {/* Top accent line */}
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 h-px",
          "bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300",
          styles.topLine
        )}
      />

      {/* Icon + badge row */}
      <div className="flex items-center justify-between">
        <div className={cn(
          "flex h-9 w-9 items-center justify-center rounded-[var(--radius-lg)]",
          "border border-border/50 bg-muted/30"
        )}>
          <Icon className={cn("size-4.5", styles.icon)} aria-hidden="true" />
        </div>
        <span className={cn(
          "rounded-full border px-2 py-0.5 text-[9px] font-bold",
          styles.badge, styles.badgeBg, styles.badgeBorder
        )}>
          {rec.badge}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-1.5 flex-1">
        <h3 className="text-[13px] font-bold text-foreground leading-snug">{rec.title}</h3>
        <p className="text-[11px] text-muted-foreground leading-relaxed">{rec.body}</p>
      </div>

      {/* Action */}
      <button
        className={cn(
          "flex items-center gap-1 text-[11px] font-semibold transition-colors",
          styles.btn
        )}
      >
        {rec.action}
        <ArrowRight
          className="size-3 transition-transform duration-200 group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      </button>
    </motion.div>
  )
}

export function RecommendationPanel({ className }: { className?: string }) {
  return (
    <div
      className={cn("flex flex-col gap-4", className)}
      role="region"
      aria-label="AI recommendations"
    >
      {/* Section header */}
      <div className="flex items-center gap-2">
        <Sparkles className="size-4 text-primary/60" aria-hidden="true" />
        <span className="text-sm font-bold text-foreground">AI Recommendations</span>
        <span className="text-[11px] text-muted-foreground">— personalized growth actions</span>
      </div>

      {/* Cards grid */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {MOCK_RECOMMENDATIONS.map((rec, i) => (
          <RecommendationCard key={rec.id} rec={rec} index={i} />
        ))}
      </div>
    </div>
  )
}
