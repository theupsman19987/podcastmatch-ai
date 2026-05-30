"use client"

import Link from "next/link"
import { motion } from "motion/react"
import { Zap, ArrowRight, ChevronRight, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { MOCK_PANEL_ALERTS, type PanelAlert } from "@/components/notifications/notifications-mock"

/* ═══════════════════════════════════════════════════════════
   AIAlertPanel — sticky right-column real-time alert cards.
   ═══════════════════════════════════════════════════════════ */

const COLOR_CFG: Record<
  PanelAlert["color"],
  { icon: string; label: string; bg: string; border: string; dot: string; btn: string; arc: string }
> = {
  primary: {
    icon:   "text-primary",
    label:  "text-primary",
    bg:     "bg-primary/6",
    border: "border-primary/20",
    dot:    "bg-primary",
    btn:    "text-primary border-primary/30 bg-primary/8 hover:bg-primary/15",
    arc:    "oklch(0.65 0.22 264)",
  },
  cyan: {
    icon:   "text-[var(--premium-cyan)]",
    label:  "text-[var(--premium-cyan)]",
    bg:     "bg-[oklch(0.70_0.16_200/0.07)]",
    border: "border-[oklch(0.70_0.16_200/0.20)]",
    dot:    "bg-[var(--premium-cyan)]",
    btn:    "text-[var(--premium-cyan)] border-[oklch(0.70_0.16_200/0.30)] bg-[oklch(0.70_0.16_200/0.08)] hover:bg-[oklch(0.70_0.16_200/0.15)]",
    arc:    "oklch(0.70 0.16 200)",
  },
  gold: {
    icon:   "text-[var(--premium-gold)]",
    label:  "text-[var(--premium-gold)]",
    bg:     "bg-[oklch(0.78_0.15_83/0.07)]",
    border: "border-[oklch(0.78_0.15_83/0.22)]",
    dot:    "bg-[var(--premium-gold)]",
    btn:    "text-[var(--premium-gold)] border-[oklch(0.78_0.15_83/0.30)] bg-[oklch(0.78_0.15_83/0.08)] hover:bg-[oklch(0.78_0.15_83/0.15)]",
    arc:    "oklch(0.78 0.15 83)",
  },
  green: {
    icon:   "text-[oklch(0.70_0.16_145)]",
    label:  "text-[oklch(0.70_0.16_145)]",
    bg:     "bg-[oklch(0.55_0.16_145/0.07)]",
    border: "border-[oklch(0.55_0.16_145/0.22)]",
    dot:    "bg-[oklch(0.65_0.15_145)]",
    btn:    "text-[oklch(0.70_0.16_145)] border-[oklch(0.55_0.16_145/0.30)] bg-[oklch(0.55_0.16_145/0.08)] hover:bg-[oklch(0.55_0.16_145/0.15)]",
    arc:    "oklch(0.65 0.15 145)",
  },
}

/* ── Confidence arc ───────────────────────────────────────── */
function ConfidenceArc({ value, color }: { value: number; color: string }) {
  const R    = 12
  const circ = 2 * Math.PI * R
  const dash = (value / 100) * circ

  return (
    <div className="relative flex items-center justify-center" style={{ width: 32, height: 32 }}>
      <svg width="32" height="32" viewBox="0 0 32 32" aria-hidden="true" className="-rotate-90">
        <circle cx="16" cy="16" r={R} fill="none" strokeWidth="2.5" stroke="oklch(0.3 0 0 / 0.25)" />
        <motion.circle
          cx="16" cy="16" r={R}
          fill="none"
          strokeWidth="2.5"
          strokeLinecap="round"
          stroke={color}
          strokeDasharray={`${circ} ${circ}`}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: circ - dash }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
        />
      </svg>
      <span className="absolute text-[8px] font-bold tabular-nums text-foreground/80">
        {value}
      </span>
    </div>
  )
}

/* ── Alert card ───────────────────────────────────────────── */
function AlertCard({ alert, index }: { alert: PanelAlert; index: number }) {
  const cfg = COLOR_CFG[alert.color]

  return (
    <motion.div
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: 0.1 + index * 0.08 }}
      className={cn(
        "flex flex-col gap-2.5 rounded-[var(--radius-lg)] border p-3",
        cfg.bg, cfg.border
      )}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-1.5">
          {/* Pulsing live dot */}
          <span className="relative flex h-1.5 w-1.5 shrink-0">
            <span className={cn("absolute inline-flex h-full w-full animate-ping rounded-full opacity-60", cfg.dot)} aria-hidden="true" />
            <span className={cn("relative inline-flex h-1.5 w-1.5 rounded-full", cfg.dot)} aria-hidden="true" />
          </span>
          <span className={cn("text-[11px] font-bold leading-tight", cfg.label)}>
            {alert.title}
          </span>
        </div>
        <ConfidenceArc value={alert.confidence} color={cfg.arc} />
      </div>

      {/* Body */}
      <p className="text-[10px] text-muted-foreground leading-relaxed">{alert.body}</p>

      {/* Action */}
      {alert.actionHref ? (
        <Link
          href={alert.actionHref}
          className={cn(
            "inline-flex items-center gap-1 rounded-[var(--radius-md)] border px-2 py-1",
            "text-[10px] font-semibold transition-colors self-start group/btn",
            cfg.btn
          )}
        >
          {alert.actionLabel}
          <ArrowRight
            className="size-3 transition-transform group-hover/btn:translate-x-0.5"
            aria-hidden="true"
          />
        </Link>
      ) : (
        <button
          className={cn(
            "inline-flex items-center gap-1 rounded-[var(--radius-md)] border px-2 py-1",
            "text-[10px] font-semibold transition-colors self-start",
            cfg.btn
          )}
        >
          {alert.actionLabel}
          <ArrowRight className="size-3" aria-hidden="true" />
        </button>
      )}
    </motion.div>
  )
}

/* ── Main panel ───────────────────────────────────────────── */
export function AIAlertPanel({ className }: { className?: string }) {
  return (
    <motion.aside
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      className={cn(
        "flex flex-col overflow-hidden",
        "rounded-[var(--radius-xl)] border border-border/60",
        "bg-card/60 backdrop-blur-sm shadow-[var(--shadow-card)]",
        className
      )}
      aria-label="AI opportunity alerts"
    >
      {/* Header */}
      <div className="relative flex items-center justify-between border-b border-border/40 px-4 py-3">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px
                     bg-gradient-to-r from-transparent via-primary/25 to-transparent"
        />
        <div className="flex items-center gap-2">
          <Zap className="size-3.5 text-primary/70" aria-hidden="true" />
          <span className="text-xs font-bold text-foreground">AI Alerts</span>
          <span className="inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-primary/15 px-1 text-[9px] font-bold text-primary tabular-nums">
            {MOCK_PANEL_ALERTS.length}
          </span>
        </div>
        <span className="text-[10px] text-[oklch(0.70_0.16_145)] font-semibold flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.65_0.15_145)] animate-pulse" aria-hidden="true" />
          Live
        </span>
      </div>

      {/* Alert cards */}
      <div className="flex flex-col gap-2 p-3">
        {MOCK_PANEL_ALERTS.map((alert, i) => (
          <AlertCard key={alert.id} alert={alert} index={i} />
        ))}
      </div>

      {/* Footer */}
      <div className="border-t border-border/40 px-4 py-3">
        <button className="flex w-full items-center justify-between text-[11px] font-semibold text-muted-foreground hover:text-foreground transition-colors group">
          <span className="flex items-center gap-1.5">
            <Sparkles className="size-3 text-primary/50 group-hover:text-primary/70 transition-colors" aria-hidden="true" />
            Configure alerts
          </span>
          <ChevronRight className="size-3.5 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
        </button>
      </div>

      {/* AI note */}
      <div className="mx-3 mb-3 rounded-[var(--radius-lg)] border border-primary/15 bg-primary/5 px-3 py-2">
        <p className="text-[10px] text-muted-foreground leading-relaxed">
          <span className="font-semibold text-primary/80">AI recalibrates</span>{" "}
          signal confidence every 2 hours based on host activity, audience momentum, and your outreach history.
        </p>
      </div>
    </motion.aside>
  )
}
