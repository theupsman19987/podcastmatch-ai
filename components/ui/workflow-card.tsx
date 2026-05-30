import * as React from "react"
import { cn } from "@/lib/utils"

/* ═══════════════════════════════════════════════════════════
   WorkflowCard — reusable AI workflow step card.
   Used in: How It Works section, dashboard onboarding,
            feature pages, AI reports, product tours.

   Accent system mirrors StatCard for visual consistency.
   ═══════════════════════════════════════════════════════════ */

export type WorkflowAccent = "primary" | "cyan" | "gold" | "green"

const ACCENT: Record<
  WorkflowAccent,
  {
    stepNum:     string
    iconBg:      string
    iconColor:   string
    borderHover: string
    glowHover:   string
    pillBg:      string
    pillText:    string
    pillDot:     string
  }
> = {
  primary: {
    stepNum:     "text-primary/60",
    iconBg:      "bg-primary/12",
    iconColor:   "text-primary",
    borderHover: "hover:border-primary/40",
    glowHover:   "hover:shadow-[var(--shadow-card),var(--glow-primary)]",
    pillBg:      "bg-primary/10 border-primary/20",
    pillText:    "text-primary",
    pillDot:     "bg-primary",
  },
  cyan: {
    stepNum:     "text-[var(--premium-cyan)]/60",
    iconBg:      "bg-[oklch(0.70_0.16_200/0.12)]",
    iconColor:   "text-[var(--premium-cyan)]",
    borderHover: "hover:border-[oklch(0.70_0.16_200/0.40)]",
    glowHover:   "hover:shadow-[var(--shadow-card),var(--glow-cyan)]",
    pillBg:      "bg-[oklch(0.70_0.16_200/0.10)] border-[oklch(0.70_0.16_200/0.20)]",
    pillText:    "text-[var(--premium-cyan)]",
    pillDot:     "bg-[var(--premium-cyan)]",
  },
  gold: {
    stepNum:     "text-[var(--premium-gold)]/60",
    iconBg:      "bg-[oklch(0.78_0.15_83/0.12)]",
    iconColor:   "text-[var(--premium-gold)]",
    borderHover: "hover:border-[oklch(0.78_0.15_83/0.40)]",
    glowHover:   "hover:shadow-[var(--shadow-card),var(--glow-gold)]",
    pillBg:      "bg-[oklch(0.78_0.15_83/0.10)] border-[oklch(0.78_0.15_83/0.20)]",
    pillText:    "text-[var(--premium-gold)]",
    pillDot:     "bg-[var(--premium-gold)]",
  },
  green: {
    stepNum:     "text-[oklch(0.70_0.16_145)]/60",
    iconBg:      "bg-[oklch(0.55_0.16_145/0.12)]",
    iconColor:   "text-[oklch(0.70_0.16_145)]",
    borderHover: "hover:border-[oklch(0.55_0.16_145/0.40)]",
    glowHover:   "hover:shadow-[var(--shadow-card),0_0_24px_oklch(0.55_0.16_145/0.25)]",
    pillBg:      "bg-[oklch(0.55_0.16_145/0.10)] border-[oklch(0.55_0.16_145/0.20)]",
    pillText:    "text-[oklch(0.70_0.16_145)]",
    pillDot:     "bg-[oklch(0.70_0.16_145)]",
  },
}

export interface WorkflowCardProps {
  step:         number
  icon:         React.ElementType
  title:        string
  description:  string
  insightText?: string
  accentColor?: WorkflowAccent
  className?:   string
}

export function WorkflowCard({
  step,
  icon: Icon,
  title,
  description,
  insightText,
  accentColor = "primary",
  className,
}: WorkflowCardProps) {
  const a = ACCENT[accentColor]

  return (
    <article
      className={cn(
        "group relative flex flex-col gap-4 rounded-[var(--radius-xl)] p-6",
        "border border-border bg-card shadow-[var(--shadow-card)]",
        "transition-all duration-200 hover:-translate-y-1",
        a.borderHover,
        a.glowHover,
        className
      )}
    >
      {/* Icon + step number row */}
      <div className="flex items-center justify-between">
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-xl",
            a.iconBg
          )}
        >
          <Icon className={cn("size-5", a.iconColor)} aria-hidden="true" />
        </div>
        <span
          className={cn(
            "font-mono text-[11px] font-bold tracking-widest",
            a.stepNum
          )}
          aria-label={`Step ${step}`}
        >
          {String(step).padStart(2, "0")}
        </span>
      </div>

      {/* Text content */}
      <div className="flex flex-col gap-1.5 flex-1">
        <h3 className="text-[15px] font-semibold text-foreground leading-snug">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </div>

      {/* AI insight indicator */}
      {insightText && (
        <div
          className={cn(
            "inline-flex items-center gap-1.5 self-start rounded-full px-2.5 py-1",
            "border text-[11px] font-medium",
            a.pillBg,
            a.pillText
          )}
        >
          <span
            className={cn("size-1.5 flex-shrink-0 rounded-full animate-ping-dot", a.pillDot)}
            aria-hidden="true"
          />
          {insightText}
        </div>
      )}

      {/* Top-edge highlight */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-t-[var(--radius-xl)]
                   bg-gradient-to-r from-transparent via-white/10 to-transparent"
      />
    </article>
  )
}
