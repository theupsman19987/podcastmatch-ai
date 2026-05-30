import * as React from "react"
import { cn } from "@/lib/utils"
import {
  Star, Sparkles, Zap, TrendingUp,
  Radio, BarChart2, Clock, Target,
} from "lucide-react"
import {
  type OutreachStage,
  type OutreachBadgeType,
  type AIInsightType,
  STAGE_CONFIG,
} from "@/components/outreach/outreach-mock"

/* ═══════════════════════════════════════════════════════════
   Outreach badge system — reusable across the pipeline.
   StageBadge: pipeline stage indicator
   OutreachBadge: card-level labels (priority, AI pick, etc.)
   InsightBadge: AI signal floating chips
   ═══════════════════════════════════════════════════════════ */

/* ── Stage badge ──────────────────────────────────────────── */
export function StageBadge({
  stage,
  size = "sm",
  className,
}: {
  stage:      OutreachStage
  size?:      "xs" | "sm" | "md"
  className?: string
}) {
  const cfg = STAGE_CONFIG[stage]
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-semibold",
        size === "xs" ? "px-1.5 py-0.5 text-[9px]"
        : size === "sm" ? "px-2 py-0.5 text-[10px]"
        : "px-2.5 py-1 text-xs",
        cfg.color, cfg.border, cfg.bg,
        className
      )}
    >
      <span className={cn("inline-block h-1.5 w-1.5 rounded-full shrink-0", cfg.dot)} aria-hidden="true" />
      {cfg.shortLabel}
    </span>
  )
}

/* ── Outreach card badge ──────────────────────────────────── */
const BADGE: Record<
  OutreachBadgeType,
  { label: string; icon: React.ElementType; cls: string }
> = {
  "high-priority": {
    label: "High Priority",
    icon:  Star,
    cls:   "border-[oklch(0.78_0.15_83/0.35)] bg-[oklch(0.78_0.15_83/0.10)] text-[var(--premium-gold)]",
  },
  "ai-recommended": {
    label: "AI Pick",
    icon:  Sparkles,
    cls:   "border-primary/30 bg-primary/8 text-primary",
  },
  "fast-responder": {
    label: "Fast Responder",
    icon:  Zap,
    cls:   "border-[oklch(0.70_0.16_200/0.30)] bg-[oklch(0.70_0.16_200/0.08)] text-[var(--premium-cyan)]",
  },
  "growing-audience": {
    label: "Growing Audience",
    icon:  TrendingUp,
    cls:   "border-[oklch(0.55_0.16_145/0.30)] bg-[oklch(0.55_0.16_145/0.08)] text-[oklch(0.70_0.16_145)]",
  },
}

export function OutreachBadge({
  badge,
  className,
}: {
  badge:     OutreachBadgeType
  className?: string
}) {
  const b = BADGE[badge]
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold",
        b.cls,
        className
      )}
    >
      <b.icon className="size-2.5 shrink-0" aria-hidden="true" />
      {b.label}
    </span>
  )
}

/* ── AI Insight badge ─────────────────────────────────────── */
const INSIGHT: Record<
  AIInsightType,
  { label: string; icon: React.ElementType; cls: string }
> = {
  "host-active": {
    label: "Host Active",
    icon:  Radio,
    cls:   "border-[oklch(0.55_0.16_145/0.25)] bg-[oklch(0.55_0.16_145/0.08)] text-[oklch(0.70_0.16_145)]",
  },
  "high-response": {
    label: "High Response Rate",
    icon:  BarChart2,
    cls:   "border-[oklch(0.70_0.16_200/0.25)] bg-[oklch(0.70_0.16_200/0.08)] text-[var(--premium-cyan)]",
  },
  "strong-alignment": {
    label: "Strong Alignment",
    icon:  Target,
    cls:   "border-primary/22 bg-primary/7 text-primary/80",
  },
  "best-window": {
    label: "Best Window Open",
    icon:  Clock,
    cls:   "border-[oklch(0.78_0.15_83/0.25)] bg-[oklch(0.78_0.15_83/0.08)] text-[var(--premium-gold)]",
  },
  "trending": {
    label: "Trending",
    icon:  TrendingUp,
    cls:   "border-[oklch(0.60_0.200_30/0.22)] bg-[oklch(0.60_0.200_30/0.08)] text-[oklch(0.75_0.18_30)]",
  },
}

export function InsightBadge({
  insight,
  className,
}: {
  insight:   AIInsightType
  className?: string
}) {
  const ins = INSIGHT[insight]
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[9px] font-semibold",
        ins.cls,
        className
      )}
    >
      <ins.icon className="size-2.5 shrink-0" aria-hidden="true" />
      {ins.label}
    </span>
  )
}
