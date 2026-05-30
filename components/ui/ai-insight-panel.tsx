import * as React from "react"
import { cn } from "@/lib/utils"

/* ═══════════════════════════════════════════════════════════
   AIInsightPanel — small floating intelligence card.
   Used in: search experience section, AI dashboard widgets,
            match intelligence overlays, feature callouts.

   CSS animate-float handles the hovering effect.
   Wrap in a Framer Motion div in the parent for entrance.
   ═══════════════════════════════════════════════════════════ */

type PanelColor = "primary" | "cyan" | "gold" | "green"

const COLOR: Record<
  PanelColor,
  { dot: string; iconBg: string; iconColor: string; glowHover: string }
> = {
  primary: {
    dot:       "bg-primary",
    iconBg:    "bg-primary/12",
    iconColor: "text-primary",
    glowHover: "hover:shadow-[var(--shadow-float),var(--glow-subtle)]",
  },
  cyan: {
    dot:       "bg-[var(--premium-cyan)]",
    iconBg:    "bg-[oklch(0.70_0.16_200/0.12)]",
    iconColor: "text-[var(--premium-cyan)]",
    glowHover: "hover:shadow-[var(--shadow-float),var(--glow-cyan)]",
  },
  gold: {
    dot:       "bg-[var(--premium-gold)]",
    iconBg:    "bg-[oklch(0.78_0.15_83/0.12)]",
    iconColor: "text-[var(--premium-gold)]",
    glowHover: "hover:shadow-[var(--shadow-float),var(--glow-gold)]",
  },
  green: {
    dot:       "bg-[oklch(0.70_0.16_145)]",
    iconBg:    "bg-[oklch(0.55_0.16_145/0.12)]",
    iconColor: "text-[oklch(0.70_0.16_145)]",
    glowHover: "hover:shadow-[var(--shadow-float),0_0_18px_oklch(0.55_0.16_145/0.22)]",
  },
}

export interface AIInsightPanelProps {
  icon:         React.ElementType
  title:        string
  value?:       string
  color?:       PanelColor
  floatDelay?:  string
  className?:   string
}

export function AIInsightPanel({
  icon: Icon,
  title,
  value,
  color = "primary",
  floatDelay = "0s",
  className,
}: AIInsightPanelProps) {
  const c = COLOR[color]

  return (
    <div
      className={cn(
        "glass-strong rounded-[var(--radius-xl)] px-4 py-3.5",
        "shadow-[var(--shadow-float)]",
        "transition-shadow duration-200",
        c.glowHover,
        "animate-float",
        className
      )}
      style={{ animationDelay: floatDelay }}
    >
      {/* Status dot + icon */}
      <div className="flex items-center gap-2">
        <div className="relative flex-shrink-0 flex h-2 w-2 items-center justify-center">
          <span className={cn("absolute h-2 w-2 rounded-full", c.dot)} aria-hidden="true" />
          <span className={cn("absolute h-2 w-2 rounded-full animate-ping-dot", c.dot)} aria-hidden="true" />
        </div>
        <div className={cn("flex h-6 w-6 items-center justify-center rounded-md", c.iconBg)}>
          <Icon className={cn("size-3.5", c.iconColor)} aria-hidden="true" />
        </div>
      </div>

      {/* Text */}
      <p className="mt-2 text-[11px] font-medium text-muted-foreground leading-snug">{title}</p>
      {value && (
        <p className={cn("mt-0.5 text-sm font-bold", c.iconColor)}>{value}</p>
      )}
    </div>
  )
}
