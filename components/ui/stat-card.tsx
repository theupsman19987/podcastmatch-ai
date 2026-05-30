import * as React from "react"
import { cn } from "@/lib/utils"
import { NumberTicker } from "@/components/ui/number-ticker"

/* ═══════════════════════════════════════════════════════════
   StatCard — reusable animated metric card.
   Used in: homepage stats section, dashboard panels,
            pricing page, and any future KPI displays.

   Accent colors control icon bg, number gradient, and glow.
   ═══════════════════════════════════════════════════════════ */

type AccentColor = "primary" | "cyan" | "gold" | "green"

const ACCENT: Record<
  AccentColor,
  { iconBg: string; iconColor: string; numberClass: string; hoverBorder: string; hoverGlow: string }
> = {
  primary: {
    iconBg:       "bg-primary/12",
    iconColor:    "text-primary",
    numberClass:  "gradient-text-primary",
    hoverBorder:  "hover:border-primary/35",
    hoverGlow:    "hover:shadow-[var(--shadow-card),var(--glow-primary)]",
  },
  cyan: {
    iconBg:       "bg-[oklch(0.70_0.16_200/0.12)]",
    iconColor:    "text-[var(--premium-cyan)]",
    numberClass:  "gradient-text-cyan",
    hoverBorder:  "hover:border-[oklch(0.70_0.16_200/0.35)]",
    hoverGlow:    "hover:shadow-[var(--shadow-card),var(--glow-cyan)]",
  },
  gold: {
    iconBg:       "bg-[oklch(0.78_0.15_83/0.12)]",
    iconColor:    "text-[var(--premium-gold)]",
    numberClass:  "gradient-text-gold",
    hoverBorder:  "hover:border-[oklch(0.78_0.15_83/0.35)]",
    hoverGlow:    "hover:shadow-[var(--shadow-card),var(--glow-gold)]",
  },
  green: {
    iconBg:       "bg-[oklch(0.55_0.16_145/0.12)]",
    iconColor:    "text-[oklch(0.70_0.16_145)]",
    numberClass:  "text-[oklch(0.70_0.16_145)] text-glow-cyan",
    hoverBorder:  "hover:border-[oklch(0.55_0.16_145/0.35)]",
    hoverGlow:    "hover:shadow-[var(--shadow-card),0_0_24px_oklch(0.55_0.16_145/0.25)]",
  },
}

export interface StatCardProps {
  value: number
  suffix?: string
  prefix?: string
  decimalPlaces?: number
  label: string
  description?: string
  icon?: React.ElementType
  accentColor?: AccentColor
  delay?: number
  className?: string
  /** Pass true to skip the count-up animation (e.g. dashboard real-time data) */
  staticValue?: boolean
}

export function StatCard({
  value,
  suffix = "",
  prefix = "",
  decimalPlaces = 0,
  label,
  description,
  icon: Icon,
  accentColor = "primary",
  delay = 0,
  className,
  staticValue = false,
}: StatCardProps) {
  const accent = ACCENT[accentColor]

  return (
    <div
      className={cn(
        /* Base card */
        "group relative flex flex-col gap-3 rounded-[var(--radius-xl)] p-6",
        "border border-border bg-card",
        "shadow-[var(--shadow-card)]",
        /* Hover transitions */
        "transition-all duration-200",
        "hover:-translate-y-0.5",
        accent.hoverBorder,
        accent.hoverGlow,
        className
      )}
    >
      {/* Icon */}
      {Icon && (
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-xl",
            accent.iconBg
          )}
        >
          <Icon className={cn("size-5", accent.iconColor)} aria-hidden="true" />
        </div>
      )}

      {/* Number */}
      <div className={cn("text-4xl font-bold leading-none tracking-tight", accent.numberClass)}>
        {staticValue ? (
          <span>{prefix}{value.toFixed(decimalPlaces)}{suffix}</span>
        ) : (
          <NumberTicker
            value={value}
            prefix={prefix}
            suffix={suffix}
            decimalPlaces={decimalPlaces}
            delay={delay}
            duration={1600}
          />
        )}
      </div>

      {/* Label */}
      <div>
        <p className="text-sm font-semibold text-foreground">{label}</p>
        {description && (
          <p className="mt-0.5 text-xs text-muted-foreground leading-snug">{description}</p>
        )}
      </div>

      {/* Subtle top-edge highlight — adds depth */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-t-[var(--radius-xl)]
                   bg-gradient-to-r from-transparent via-[oklch(0.96_0_0/0.10)] to-transparent"
      />
    </div>
  )
}
