"use client"

import { motion, AnimatePresence } from "motion/react"
import { Bell, Radio, TrendingUp, Zap, RefreshCw, ChevronRight, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  type AlertSignal,
  type AIAlert,
  MOCK_AI_ALERTS,
} from "@/components/saved/saved-mock"

/* ═══════════════════════════════════════════════════════════
   AIAlertPanel — right-column live AI alerts feed.
   Shows MOCK_AI_ALERTS; swap for real API when backend ready.
   ═══════════════════════════════════════════════════════════ */

const ALERT_CONFIG: Record<
  AlertSignal,
  { icon: React.ElementType; color: string; bg: string; dot: string }
> = {
  "host-active": {
    icon:  Radio,
    color: "text-[oklch(0.70_0.16_145)]",
    bg:    "bg-[oklch(0.55_0.16_145/0.08)]",
    dot:   "bg-[oklch(0.65_0.15_145)]",
  },
  "audience-growing": {
    icon:  TrendingUp,
    color: "text-[var(--premium-cyan)]",
    bg:    "bg-[oklch(0.70_0.16_200/0.08)]",
    dot:   "bg-[var(--premium-cyan)]",
  },
  "opportunity-increasing": {
    icon:  Zap,
    color: "text-[var(--premium-gold)]",
    bg:    "bg-[oklch(0.78_0.15_83/0.08)]",
    dot:   "bg-[var(--premium-gold)]",
  },
  "recently-updated": {
    icon:  RefreshCw,
    color: "text-primary/80",
    bg:    "bg-primary/6",
    dot:   "bg-primary",
  },
}

function AlertItem({ alert, index }: { alert: AIAlert; index: number }) {
  const cfg = ALERT_CONFIG[alert.type]
  const Icon = cfg.icon

  return (
    <motion.div
      initial={{ opacity: 0, x: 8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 + index * 0.07, duration: 0.3 }}
      className={cn(
        "flex gap-3 rounded-[var(--radius-lg)] p-3 transition-colors",
        "hover:bg-muted/20",
        cfg.bg
      )}
    >
      {/* Icon column */}
      <div className="relative mt-0.5 shrink-0">
        <div
          className={cn(
            "flex h-7 w-7 items-center justify-center rounded-full",
            "border border-border/40 bg-card/60"
          )}
        >
          <Icon className={cn("size-3.5", cfg.color)} aria-hidden="true" />
        </div>
        {/* Pulsing dot */}
        <span
          className={cn(
            "absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full",
            cfg.dot
          )}
          aria-hidden="true"
        />
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-semibold text-foreground leading-snug truncate">
          {alert.podcastName}
        </p>
        <p className="mt-0.5 text-[10px] text-muted-foreground leading-relaxed">
          {alert.message}
        </p>
        <p className="mt-1 text-[9px] text-muted-foreground/60">{alert.time}</p>
      </div>
    </motion.div>
  )
}

export function AIAlertPanel() {
  const alerts = MOCK_AI_ALERTS

  return (
    <motion.aside
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className={cn(
        "flex flex-col gap-0 overflow-hidden",
        "rounded-[var(--radius-xl)] border border-border/60",
        "bg-card/60 backdrop-blur-sm shadow-[var(--shadow-card)]"
      )}
      aria-label="AI activity alerts"
    >
      {/* Panel header */}
      <div className="relative flex items-center justify-between gap-2 border-b border-border/40 px-4 py-3">
        {/* Top-edge highlight */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px
                     bg-gradient-to-r from-transparent via-primary/25 to-transparent"
        />

        <div className="flex items-center gap-2">
          <div className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" aria-hidden="true" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
          </div>
          <span className="text-xs font-semibold text-foreground">AI Alerts</span>
          <span
            className={cn(
              "inline-flex h-4 min-w-[16px] items-center justify-center rounded-full",
              "px-1 text-[10px] font-bold bg-primary/15 text-primary tabular-nums"
            )}
          >
            {alerts.length}
          </span>
        </div>

        <Bell className="size-3.5 text-muted-foreground" aria-hidden="true" />
      </div>

      {/* Alerts list */}
      <div className="flex flex-col gap-0 p-2">
        <AnimatePresence initial={false}>
          {alerts.map((alert, i) => (
            <AlertItem key={alert.id} alert={alert} index={i} />
          ))}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="border-t border-border/40 px-4 py-3">
        <button
          className={cn(
            "flex w-full items-center justify-between",
            "text-[11px] font-semibold text-muted-foreground",
            "hover:text-foreground transition-colors group"
          )}
        >
          <span className="flex items-center gap-1.5">
            <Sparkles className="size-3 text-primary/50 group-hover:text-primary/70 transition-colors" aria-hidden="true" />
            View all activity
          </span>
          <ChevronRight className="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </button>
      </div>

      {/* AI monitoring footer */}
      <div
        className={cn(
          "mx-3 mb-3 rounded-[var(--radius-lg)] px-3 py-2",
          "bg-primary/6 border border-primary/15"
        )}
      >
        <p className="text-[10px] text-muted-foreground leading-relaxed">
          <span className="font-semibold text-primary/80">AI is actively watching</span>{" "}
          your saved podcasts for new episodes, guest slots, and audience signals.
        </p>
      </div>
    </motion.aside>
  )
}
