"use client"

import { motion } from "motion/react"
import { Compass, Sparkles, Zap, Leaf, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { MOCK_PROFILE_RECS, type ProfileRecommendation } from "@/components/profile/profile-mock"

/* ═══════════════════════════════════════════════════════════
   ProfileRecommendations — AI action recommendation cards.
   ═══════════════════════════════════════════════════════════ */

const COLOR_CFG: Record<
  ProfileRecommendation["color"],
  { icon: string; badge: string; badgeBg: string; badgeBorder: string; btn: string; glow: string; topLine: string }
> = {
  primary: {
    icon:        "text-primary",
    badge:       "text-primary",
    badgeBg:     "bg-primary/8",
    badgeBorder: "border-primary/25",
    btn:         "text-primary hover:text-primary/80",
    glow:        "hover:shadow-[0_0_18px_oklch(0.55_0.22_264/0.12)]",
    topLine:     "from-primary/0 via-primary/25 to-primary/0",
  },
  cyan: {
    icon:        "text-[var(--premium-cyan)]",
    badge:       "text-[var(--premium-cyan)]",
    badgeBg:     "bg-[oklch(0.70_0.16_200/0.08)]",
    badgeBorder: "border-[oklch(0.70_0.16_200/0.25)]",
    btn:         "text-[var(--premium-cyan)] hover:text-[oklch(0.80_0.14_200)]",
    glow:        "hover:shadow-[0_0_18px_oklch(0.70_0.16_200/0.12)]",
    topLine:     "from-[oklch(0.70_0.16_200/0)] via-[oklch(0.70_0.16_200/0.25)] to-[oklch(0.70_0.16_200/0)]",
  },
  gold: {
    icon:        "text-[var(--premium-gold)]",
    badge:       "text-[var(--premium-gold)]",
    badgeBg:     "bg-[oklch(0.78_0.15_83/0.08)]",
    badgeBorder: "border-[oklch(0.78_0.15_83/0.25)]",
    btn:         "text-[var(--premium-gold)] hover:text-[oklch(0.85_0.13_83)]",
    glow:        "hover:shadow-[0_0_18px_oklch(0.78_0.15_83/0.12)]",
    topLine:     "from-[oklch(0.78_0.15_83/0)] via-[oklch(0.78_0.15_83/0.25)] to-[oklch(0.78_0.15_83/0)]",
  },
  green: {
    icon:        "text-[oklch(0.70_0.16_145)]",
    badge:       "text-[oklch(0.70_0.16_145)]",
    badgeBg:     "bg-[oklch(0.55_0.16_145/0.08)]",
    badgeBorder: "border-[oklch(0.55_0.16_145/0.25)]",
    btn:         "text-[oklch(0.70_0.16_145)] hover:text-[oklch(0.78_0.14_145)]",
    glow:        "hover:shadow-[0_0_18px_oklch(0.55_0.16_145/0.12)]",
    topLine:     "from-[oklch(0.55_0.16_145/0)] via-[oklch(0.65_0.15_145/0.25)] to-[oklch(0.55_0.16_145/0)]",
  },
}

const ICON_MAP: Record<string, React.ElementType> = {
  primary: Compass,
  cyan:    Sparkles,
  gold:    Zap,
  green:   Leaf,
}

function RecCard({ rec, index }: { rec: ProfileRecommendation; index: number }) {
  const cfg  = COLOR_CFG[rec.color]
  const Icon = ICON_MAP[rec.color] ?? Sparkles

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.06 + index * 0.07 }}
      className={cn(
        "group relative flex flex-col gap-3 overflow-hidden",
        "rounded-[var(--radius-xl)] border border-border/60 p-4",
        "bg-card/70 backdrop-blur-sm shadow-[var(--shadow-card)]",
        "transition-all duration-300",
        cfg.glow
      )}
    >
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 h-px",
          "bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300",
          cfg.topLine
        )}
      />

      <div className="flex items-center justify-between">
        <div className={cn(
          "flex h-8 w-8 items-center justify-center rounded-[var(--radius-md)]",
          "border border-border/50 bg-muted/30"
        )}>
          <Icon className={cn("size-4", cfg.icon)} aria-hidden="true" />
        </div>
        <span className={cn(
          "rounded-full border px-2 py-0.5 text-[9px] font-bold",
          cfg.badge, cfg.badgeBg, cfg.badgeBorder
        )}>
          {rec.badge}
        </span>
      </div>

      <div className="flex flex-col gap-1 flex-1">
        <h3 className="text-[12px] font-bold text-foreground leading-snug">{rec.title}</h3>
        <p className="text-[11px] text-muted-foreground leading-relaxed">{rec.body}</p>
      </div>

      <button className={cn(
        "flex items-center gap-1 text-[11px] font-semibold transition-colors self-start group/btn",
        cfg.btn
      )}>
        {rec.action}
        <ArrowRight className="size-3 group-hover/btn:translate-x-0.5 transition-transform duration-200" aria-hidden="true" />
      </button>
    </motion.div>
  )
}

export function ProfileRecommendations({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="flex items-center gap-2">
        <Sparkles className="size-4 text-primary/60" aria-hidden="true" />
        <span className="text-sm font-bold text-foreground">AI Growth Recommendations</span>
        <span className="text-[11px] text-muted-foreground">— personalized for your profile</span>
      </div>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
        {MOCK_PROFILE_RECS.map((rec, i) => (
          <RecCard key={rec.id} rec={rec} index={i} />
        ))}
      </div>
    </div>
  )
}
