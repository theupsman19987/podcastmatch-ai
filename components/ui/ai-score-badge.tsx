import * as React from "react"
import { cn } from "@/lib/utils"

/* ═══════════════════════════════════════════════════════════
   AiScoreBadge — compact AI match score indicator.
   Used in: podcast result cards, dashboard match panels,
            AI reports, booking probability displays.

   Score tiers drive color automatically:
     90+  → gold
     80–89 → primary (electric blue)
     <80  → cyan
   ═══════════════════════════════════════════════════════════ */

type ScoreTier = "gold" | "primary" | "cyan"

function getTier(score: number): ScoreTier {
  if (score >= 90) return "gold"
  if (score >= 80) return "primary"
  return "cyan"
}

const TIER_STYLES: Record<ScoreTier, { number: string; bg: string; border: string }> = {
  gold: {
    number: "gradient-text-gold",
    bg:     "bg-[oklch(0.78_0.15_83/0.10)]",
    border: "border-[oklch(0.78_0.15_83/0.28)]",
  },
  primary: {
    number: "gradient-text-primary",
    bg:     "bg-primary/10",
    border: "border-primary/28",
  },
  cyan: {
    number: "gradient-text-cyan",
    bg:     "bg-[oklch(0.70_0.16_200/0.10)]",
    border: "border-[oklch(0.70_0.16_200/0.28)]",
  },
}

export interface AiScoreBadgeProps {
  score:      number
  label?:     string
  size?:      "sm" | "md"
  className?: string
}

export function AiScoreBadge({
  score,
  label = "Match",
  size = "md",
  className,
}: AiScoreBadgeProps) {
  const t = TIER_STYLES[getTier(score)]

  return (
    <div
      className={cn(
        "inline-flex items-baseline gap-1 rounded-full border",
        t.bg,
        t.border,
        size === "md" ? "px-3 py-1" : "px-2 py-0.5",
        className
      )}
    >
      <span
        className={cn(
          "font-bold leading-none tabular-nums",
          t.number,
          size === "md" ? "text-xl" : "text-sm"
        )}
      >
        {score}%
      </span>
      <span
        className={cn(
          "font-semibold text-muted-foreground",
          size === "md" ? "text-[11px]" : "text-[10px]"
        )}
      >
        {label}
      </span>
    </div>
  )
}
