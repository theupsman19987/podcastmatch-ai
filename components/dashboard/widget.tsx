import * as React from "react"
import { cn } from "@/lib/utils"

/* ═══════════════════════════════════════════════════════════
   DashboardWidget — reusable glass widget container.
   Plug any content into the children slot.
   Future modules (analytics, AI feeds, etc.) all use this.
   ═══════════════════════════════════════════════════════════ */

type AccentColor = "primary" | "cyan" | "gold" | "green" | "none"

const ACCENT_STYLES: Record<AccentColor, { border: string; glow: string; badge: string; iconBg: string; iconColor: string }> = {
  primary: {
    border:    "hover:border-primary/30",
    glow:      "hover:shadow-[var(--shadow-card),var(--glow-subtle)]",
    badge:     "bg-primary/12 text-primary border-primary/20",
    iconBg:    "bg-primary/10",
    iconColor: "text-primary",
  },
  cyan: {
    border:    "hover:border-[oklch(0.70_0.16_200/0.30)]",
    glow:      "hover:shadow-[var(--shadow-card),var(--glow-cyan)]",
    badge:     "bg-[oklch(0.70_0.16_200/0.12)] text-[var(--premium-cyan)] border-[oklch(0.70_0.16_200/0.20)]",
    iconBg:    "bg-[oklch(0.70_0.16_200/0.10)]",
    iconColor: "text-[var(--premium-cyan)]",
  },
  gold: {
    border:    "hover:border-[oklch(0.78_0.15_83/0.30)]",
    glow:      "hover:shadow-[var(--shadow-card),var(--glow-gold)]",
    badge:     "bg-[oklch(0.78_0.15_83/0.12)] text-[var(--premium-gold)] border-[oklch(0.78_0.15_83/0.20)]",
    iconBg:    "bg-[oklch(0.78_0.15_83/0.10)]",
    iconColor: "text-[var(--premium-gold)]",
  },
  green: {
    border:    "hover:border-[oklch(0.55_0.16_145/0.30)]",
    glow:      "hover:shadow-[var(--shadow-card),0_0_20px_oklch(0.55_0.16_145/0.20)]",
    badge:     "bg-[oklch(0.55_0.16_145/0.12)] text-[oklch(0.70_0.16_145)] border-[oklch(0.55_0.16_145/0.20)]",
    iconBg:    "bg-[oklch(0.55_0.16_145/0.10)]",
    iconColor: "text-[oklch(0.70_0.16_145)]",
  },
  none: {
    border:    "hover:border-border/60",
    glow:      "",
    badge:     "bg-muted text-muted-foreground border-border",
    iconBg:    "bg-muted",
    iconColor: "text-muted-foreground",
  },
}

export interface DashboardWidgetProps {
  title:        string
  description?: string
  icon?:        React.ElementType
  badge?:       string
  accent?:      AccentColor
  action?:      React.ReactNode
  children:     React.ReactNode
  className?:   string
  noPadding?:   boolean
}

export function DashboardWidget({
  title,
  description,
  icon: Icon,
  badge,
  accent = "none",
  action,
  children,
  className,
  noPadding = false,
}: DashboardWidgetProps) {
  const a = ACCENT_STYLES[accent]

  return (
    <div
      className={cn(
        "group relative flex flex-col rounded-[var(--radius-xl)]",
        "border border-border bg-card shadow-[var(--shadow-card)]",
        "transition-all duration-200",
        a.border,
        a.glow,
        className
      )}
    >
      {/* Top-edge highlight */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-t-[var(--radius-xl)]
                   bg-gradient-to-r from-transparent via-[oklch(0.96_0_0/0.08)] to-transparent"
      />

      {/* Widget header */}
      <div className="flex items-center justify-between gap-3 border-b border-border/50 px-5 py-4">
        <div className="flex items-center gap-2.5 min-w-0">
          {Icon && (
            <div className={cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-lg", a.iconBg)}>
              <Icon className={cn("size-3.5", a.iconColor)} aria-hidden="true" />
            </div>
          )}
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="truncate text-sm font-semibold text-foreground">{title}</h3>
              {badge && (
                <span className={cn(
                  "inline-flex shrink-0 items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                  a.badge
                )}>
                  {badge}
                </span>
              )}
            </div>
            {description && (
              <p className="mt-0.5 truncate text-xs text-muted-foreground">{description}</p>
            )}
          </div>
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>

      {/* Widget body */}
      <div className={cn("flex-1", !noPadding && "p-5")}>
        {children}
      </div>
    </div>
  )
}

/* ── WidgetSkeleton — loading placeholder row ─────────────── */
export function WidgetSkeleton({ rows = 3, className }: { rows?: number; className?: string }) {
  return (
    <div className={cn("flex flex-col gap-3", className)} aria-hidden="true">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="h-8 w-8 shrink-0 animate-pulse rounded-lg bg-muted" />
          <div className="flex flex-1 flex-col gap-1.5">
            <div className="h-3 animate-pulse rounded-full bg-muted" style={{ width: `${60 + i * 10}%` }} />
            <div className="h-2.5 animate-pulse rounded-full bg-muted/60" style={{ width: `${40 + i * 8}%` }} />
          </div>
          <div className="h-5 w-12 animate-pulse rounded-full bg-muted" />
        </div>
      ))}
    </div>
  )
}

/* ── WidgetEmptyState — zero-data placeholder ─────────────── */
export function WidgetEmptyState({
  icon: Icon,
  message,
  className,
}: {
  icon?: React.ElementType
  message: string
  className?: string
}) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-2 py-8 text-center", className)}>
      {Icon && <Icon className="size-8 text-muted-foreground/40" aria-hidden="true" />}
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  )
}
