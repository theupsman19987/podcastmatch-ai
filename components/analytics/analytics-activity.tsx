"use client"

import { motion, AnimatePresence } from "motion/react"
import {
  Sparkles, TrendingUp, Radio, Users,
  Send, MessageCircle, ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { MOCK_ANALYTICS_EVENTS, type AnalyticsEvent } from "@/components/analytics/analytics-mock"

/* ═══════════════════════════════════════════════════════════
   AnalyticsActivity — live analytics event feed.
   ═══════════════════════════════════════════════════════════ */

const TYPE_CFG: Record<
  AnalyticsEvent["type"],
  { icon: React.ElementType; color: string; bg: string; dot: string }
> = {
  "match-found": {
    icon:  Sparkles,
    color: "text-primary/80",
    bg:    "bg-primary/6",
    dot:   "bg-primary",
  },
  "score-improved": {
    icon:  TrendingUp,
    color: "text-[oklch(0.70_0.16_145)]",
    bg:    "bg-[oklch(0.55_0.16_145/0.08)]",
    dot:   "bg-[oklch(0.65_0.15_145)]",
  },
  "host-active": {
    icon:  Radio,
    color: "text-[var(--premium-cyan)]",
    bg:    "bg-[oklch(0.70_0.16_200/0.08)]",
    dot:   "bg-[var(--premium-cyan)]",
  },
  "audience-trend": {
    icon:  Users,
    color: "text-[var(--premium-gold)]",
    bg:    "bg-[oklch(0.78_0.15_83/0.08)]",
    dot:   "bg-[var(--premium-gold)]",
  },
  "outreach-sent": {
    icon:  Send,
    color: "text-[oklch(0.65_0.18_290)]",
    bg:    "bg-[oklch(0.55_0.18_290/0.08)]",
    dot:   "bg-[oklch(0.65_0.18_290)]",
  },
  "response-received": {
    icon:  MessageCircle,
    color: "text-[var(--premium-cyan)]",
    bg:    "bg-[oklch(0.70_0.16_200/0.08)]",
    dot:   "bg-[var(--premium-cyan)]",
  },
}

function FeedItem({ item, index }: { item: AnalyticsEvent; index: number }) {
  const cfg  = TYPE_CFG[item.type]
  const Icon = cfg.icon

  return (
    <motion.div
      initial={{ opacity: 0, x: 6 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.06 + index * 0.06, duration: 0.28 }}
      className={cn(
        "flex gap-2.5 rounded-[var(--radius-lg)] p-2.5 transition-colors hover:bg-muted/20",
        item.fresh && cfg.bg
      )}
    >
      {/* Icon */}
      <div className="relative mt-0.5 shrink-0">
        <div className="flex h-6 w-6 items-center justify-center rounded-full border border-border/40 bg-card/60">
          <Icon className={cn("size-3", cfg.color)} aria-hidden="true" />
        </div>
        {item.fresh && (
          <span className={cn("absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full", cfg.dot)} aria-hidden="true" />
        )}
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-1">
          <p className="text-[11px] font-semibold text-foreground leading-tight truncate">{item.title}</p>
          {item.delta && (
            <span className={cn("shrink-0 text-[9px] font-bold tabular-nums", cfg.color)}>
              {item.delta}
            </span>
          )}
        </div>
        <p className="mt-0.5 text-[10px] text-muted-foreground leading-snug truncate">{item.body}</p>
        <p className="mt-0.5 text-[9px] text-muted-foreground/55">{item.time}</p>
      </div>
    </motion.div>
  )
}

export function AnalyticsActivity({ className }: { className?: string }) {
  const events = MOCK_ANALYTICS_EVENTS

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[var(--radius-xl)] border border-border/60",
        "bg-card/60 backdrop-blur-sm shadow-[var(--shadow-card)]",
        className
      )}
      role="region"
      aria-label="Analytics activity feed"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px
                   bg-gradient-to-r from-transparent via-primary/20 to-transparent"
      />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/40 px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" aria-hidden="true" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
          </div>
          <span className="text-xs font-bold text-foreground">Activity</span>
          <span className="inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-primary/15 px-1 text-[9px] font-bold text-primary tabular-nums">
            {events.filter(e => e.fresh).length}
          </span>
        </div>
        <span className="text-[10px] text-muted-foreground">Live feed</span>
      </div>

      {/* Feed */}
      <div className="flex flex-col gap-0 p-2">
        <AnimatePresence initial={false}>
          {events.map((item, i) => (
            <FeedItem key={item.id} item={item} index={i} />
          ))}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="border-t border-border/40 px-4 py-2.5">
        <button className="flex w-full items-center justify-between text-[11px] font-semibold text-muted-foreground hover:text-foreground transition-colors group">
          <span className="flex items-center gap-1.5">
            <Sparkles className="size-3 text-primary/50 group-hover:text-primary/70 transition-colors" aria-hidden="true" />
            View all events
          </span>
          <ChevronRight className="size-3.5 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
