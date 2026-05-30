import * as React from "react"
import { cn } from "@/lib/utils"
import {
  Eye, Star, Send, Calendar,
  Radio, TrendingUp, RefreshCw, Zap,
} from "lucide-react"
import {
  type TrackingStatus,
  type AlertSignal,
  type SavedBadge,
} from "@/components/saved/saved-mock"

/* ═══════════════════════════════════════════════════════════
   Watchlist badge system — reusable across all watchlist UI.
   TrackingBadge: watching | high-priority | contacted | scheduled
   AlertBadge: host-active | audience-growing | opportunity-increasing | recently-updated
   SavedOpportunityBadge: trending | ai-recommended | growing-audience | high-opportunity
   ═══════════════════════════════════════════════════════════ */

/* ── Tracking status badge ────────────────────────────────── */
const TRACKING: Record<
  TrackingStatus,
  { label: string; icon: React.ElementType; cls: string; dot: string }
> = {
  "watching": {
    label: "Watching",
    icon:  Eye,
    cls:   "border-primary/30 bg-primary/10 text-primary",
    dot:   "bg-primary",
  },
  "high-priority": {
    label: "High Priority",
    icon:  Star,
    cls:   "border-[oklch(0.78_0.15_83/0.35)] bg-[oklch(0.78_0.15_83/0.12)] text-[var(--premium-gold)]",
    dot:   "bg-[var(--premium-gold)]",
  },
  "contacted": {
    label: "Contacted",
    icon:  Send,
    cls:   "border-[oklch(0.55_0.16_145/0.30)] bg-[oklch(0.55_0.16_145/0.10)] text-[oklch(0.70_0.16_145)]",
    dot:   "bg-[oklch(0.65_0.15_145)]",
  },
  "scheduled": {
    label: "Scheduled",
    icon:  Calendar,
    cls:   "border-[oklch(0.55_0.18_290/0.30)] bg-[oklch(0.55_0.18_290/0.10)] text-[oklch(0.70_0.18_290)]",
    dot:   "bg-[oklch(0.65_0.18_290)]",
  },
}

export function TrackingBadge({
  status,
  size = "sm",
  className,
}: {
  status:    TrackingStatus
  size?:     "xs" | "sm" | "md"
  className?: string
}) {
  const t = TRACKING[status]
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border font-semibold",
        size === "xs" ? "px-1.5 py-0.5 text-[9px]"
        : size === "sm" ? "px-2 py-0.5 text-[10px]"
        : "px-2.5 py-1 text-xs",
        t.cls,
        className
      )}
    >
      <t.icon
        className={cn("shrink-0", size === "xs" ? "size-2.5" : "size-3")}
        aria-hidden="true"
      />
      {t.label}
    </span>
  )
}

/* ── Alert signal badge ───────────────────────────────────── */
const ALERT: Record<
  AlertSignal,
  { label: string; icon: React.ElementType; cls: string }
> = {
  "host-active": {
    label: "Host Active",
    icon:  Radio,
    cls:   "border-[oklch(0.55_0.16_145/0.25)] bg-[oklch(0.55_0.16_145/0.08)] text-[oklch(0.70_0.16_145)]",
  },
  "audience-growing": {
    label: "Audience Growing",
    icon:  TrendingUp,
    cls:   "border-[oklch(0.70_0.16_200/0.25)] bg-[oklch(0.70_0.16_200/0.08)] text-[var(--premium-cyan)]",
  },
  "opportunity-increasing": {
    label: "Opportunity Rising",
    icon:  Zap,
    cls:   "border-[oklch(0.78_0.15_83/0.25)] bg-[oklch(0.78_0.15_83/0.08)] text-[var(--premium-gold)]",
  },
  "recently-updated": {
    label: "Updated",
    icon:  RefreshCw,
    cls:   "border-primary/22 bg-primary/07 text-primary/80",
  },
}

export function AlertBadge({
  signal,
  className,
}: {
  signal:    AlertSignal
  className?: string
}) {
  const a = ALERT[signal]
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[9px] font-semibold",
        a.cls,
        className
      )}
    >
      <a.icon className="size-2.5 shrink-0" aria-hidden="true" />
      {a.label}
    </span>
  )
}

/* ── Saved opportunity badge ──────────────────────────────── */
const SAVED_BADGE: Record<
  SavedBadge,
  { label: string; cls: string }
> = {
  "trending":         { label: "Trending",          cls: "bg-[oklch(0.60_0.200_30/0.12)] text-[oklch(0.75_0.18_30)] border-[oklch(0.60_0.200_30/0.22)]"   },
  "ai-recommended":   { label: "AI Pick",           cls: "bg-primary/10 text-primary border-primary/22"                                                    },
  "growing-audience": { label: "Growing Audience",  cls: "bg-[oklch(0.70_0.16_200/0.10)] text-[var(--premium-cyan)] border-[oklch(0.70_0.16_200/0.22)]"  },
  "high-opportunity": { label: "High Opportunity",  cls: "bg-[oklch(0.78_0.15_83/0.10)] text-[var(--premium-gold)] border-[oklch(0.78_0.15_83/0.22)]"    },
}

export function SavedOpportunityBadge({
  badge,
  className,
}: {
  badge:     SavedBadge
  className?: string
}) {
  const b = SAVED_BADGE[badge]
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold",
        b.cls,
        className
      )}
    >
      {b.label}
    </span>
  )
}
