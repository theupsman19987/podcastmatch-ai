"use client"

import * as React from "react"
import Link from "next/link"
import { motion } from "motion/react"
import {
  Sparkles, Radio, TrendingUp, Eye,
  BarChart2, Send, Zap, X,
  ArrowRight, Bookmark, Bell,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useNotifications } from "@/components/notifications/notifications-context"
import {
  type NotificationItem,
  type NotificationPriority,
  type NotificationType,
} from "@/components/notifications/notifications-mock"

/* ═══════════════════════════════════════════════════════════
   NotificationCard — single notification entry in the feed.
   ═══════════════════════════════════════════════════════════ */

/* ── Priority config ──────────────────────────────────────── */
const PRIORITY_CFG: Record<
  NotificationPriority,
  { border: string; glow: string; dot: string; badge: string; badgeBg: string; badgeBorder: string }
> = {
  critical: {
    border:      "border-l-[oklch(0.65_0.22_30)]",
    glow:        "shadow-[0_0_16px_oklch(0.60_0.22_30/0.12)]",
    dot:         "bg-[oklch(0.65_0.22_30)] animate-pulse",
    badge:       "text-[oklch(0.70_0.22_30)]",
    badgeBg:     "bg-[oklch(0.60_0.22_30/0.10)]",
    badgeBorder: "border-[oklch(0.60_0.22_30/0.30)]",
  },
  high: {
    border:      "border-l-[var(--premium-gold)]",
    glow:        "shadow-[0_0_16px_oklch(0.78_0.15_83/0.10)]",
    dot:         "bg-[var(--premium-gold)]",
    badge:       "text-[var(--premium-gold)]",
    badgeBg:     "bg-[oklch(0.78_0.15_83/0.10)]",
    badgeBorder: "border-[oklch(0.78_0.15_83/0.28)]",
  },
  medium: {
    border:      "border-l-primary",
    glow:        "",
    dot:         "bg-primary",
    badge:       "text-primary",
    badgeBg:     "bg-primary/8",
    badgeBorder: "border-primary/25",
  },
  low: {
    border:      "border-l-border",
    glow:        "",
    dot:         "bg-muted-foreground/50",
    badge:       "text-muted-foreground",
    badgeBg:     "bg-muted/30",
    badgeBorder: "border-border/40",
  },
}

/* ── Type config ──────────────────────────────────────────── */
const TYPE_CFG: Record<
  NotificationType,
  { icon: React.ElementType; label: string; color: string }
> = {
  "match-found":       { icon: Sparkles,  label: "New Match",        color: "text-primary"                    },
  "host-active":       { icon: Radio,     label: "Host Active",      color: "text-[oklch(0.70_0.16_145)]"     },
  "audience-trend":    { icon: TrendingUp,label: "Audience Trend",   color: "text-[var(--premium-cyan)]"      },
  "visibility-window": { icon: Eye,       label: "Visibility Alert", color: "text-[var(--premium-gold)]"      },
  "score-improved":    { icon: BarChart2, label: "Score Update",     color: "text-primary/80"                  },
  "outreach-update":   { icon: Send,      label: "Outreach Update",  color: "text-[oklch(0.65_0.18_290)]"     },
  "ai-alert":          { icon: Zap,       label: "AI Alert",         color: "text-[var(--premium-gold)]"      },
}

/* ── Badge labels ─────────────────────────────────────────── */
const BADGE_LABEL: Record<NonNullable<NotificationItem["badge"]>, string> = {
  "high-priority":  "High Priority",
  "ai-recommended": "AI Pick",
  "trending":       "Trending",
  "fast-moving":    "Act Fast",
}

export function NotificationCard({
  item,
  index,
}: {
  item:  NotificationItem
  index: number
}) {
  const { markRead, dismiss } = useNotifications()
  const [dismissed, setDismissed] = React.useState(false)
  const pCfg = PRIORITY_CFG[item.priority]
  const tCfg = TYPE_CFG[item.type]
  const Icon = tCfg.icon

  function handleDismiss() {
    setDismissed(true)
    setTimeout(() => dismiss(item.id), 260)
  }

  return (
    <motion.article
      layout
      initial={{ opacity: 0, x: -8 }}
      animate={{
        opacity: dismissed ? 0 : 1,
        x:       dismissed ? -16 : 0,
        height:  dismissed ? 0 : "auto",
      }}
      transition={{ duration: 0.26, delay: dismissed ? 0 : index * 0.04 }}
      onClick={() => !item.isRead && markRead(item.id)}
      className={cn(
        "group relative flex gap-3.5 overflow-hidden cursor-pointer",
        "rounded-[var(--radius-xl)] border border-l-2 border-border/50 p-4",
        "bg-card/60 backdrop-blur-sm",
        "transition-all duration-300",
        "hover:border-border/80 hover:bg-card/80",
        pCfg.border,
        !item.isRead && [
          "bg-card/80 border-border/60",
          pCfg.glow,
        ]
      )}
      role="article"
      aria-label={item.title}
    >
      {/* Top-edge highlight for unread */}
      {!item.isRead && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px
                     bg-gradient-to-r from-transparent via-primary/20 to-transparent"
        />
      )}

      {/* ── Unread indicator dot ───────────────────────────── */}
      <div className="absolute right-3 top-3 flex items-center gap-2">
        {!item.isRead && (
          <span className={cn("h-2 w-2 rounded-full shrink-0", pCfg.dot)} aria-label="Unread" />
        )}
        <button
          onClick={e => { e.stopPropagation(); handleDismiss() }}
          aria-label="Dismiss notification"
          className={cn(
            "flex h-5 w-5 items-center justify-center rounded-full",
            "text-muted-foreground/40 hover:text-muted-foreground",
            "opacity-0 group-hover:opacity-100 transition-all duration-150"
          )}
        >
          <X className="size-3" aria-hidden="true" />
        </button>
      </div>

      {/* ── Icon column ───────────────────────────────────── */}
      <div
        className={cn(
          "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
          "border border-border/50 bg-card/80"
        )}
        aria-hidden="true"
      >
        <Icon className={cn("size-4", tCfg.color)} />
      </div>

      {/* ── Content ───────────────────────────────────────── */}
      <div className="min-w-0 flex-1 pr-8">

        {/* Type label + badge + time */}
        <div className="flex flex-wrap items-center gap-1.5 mb-1">
          <span className={cn("text-[10px] font-bold uppercase tracking-wide", tCfg.color)}>
            {tCfg.label}
          </span>

          {item.badge && (
            <span className={cn(
              "inline-flex items-center rounded-full border px-1.5 py-0.5 text-[9px] font-bold",
              pCfg.badge, pCfg.badgeBg, pCfg.badgeBorder
            )}>
              {BADGE_LABEL[item.badge]}
            </span>
          )}

          <span className="ml-auto text-[10px] text-muted-foreground/60 tabular-nums shrink-0">
            {item.timeLabel}
          </span>
        </div>

        {/* Title */}
        <h3
          className={cn(
            "text-[13px] font-bold leading-snug mb-1",
            item.isRead ? "text-foreground/80" : "text-foreground"
          )}
        >
          {item.title}
        </h3>

        {/* Body */}
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          {item.body}
        </p>

        {/* AI insight chip */}
        {item.insight && (
          <div className="mt-2">
            <span className={cn(
              "inline-flex items-center gap-1 rounded-full border px-2 py-0.5",
              "text-[9px] font-bold",
              pCfg.badge, pCfg.badgeBg, pCfg.badgeBorder
            )}>
              <Sparkles className="size-2.5 shrink-0" aria-hidden="true" />
              {item.insight}
            </span>
          </div>
        )}

        {/* Action row */}
        <div className="mt-3 flex items-center gap-2 flex-wrap">
          {item.actionLabel && item.actionHref && (
            <Link
              href={item.actionHref}
              onClick={e => e.stopPropagation()}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-[var(--radius-md)]",
                "border border-primary/30 bg-primary/8 px-2.5 py-1",
                "text-[11px] font-semibold text-primary",
                "hover:bg-primary/15 hover:border-primary/50",
                "transition-colors duration-200 group/btn"
              )}
            >
              {item.actionLabel}
              <ArrowRight
                className="size-3 transition-transform duration-200 group-hover/btn:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          )}

          <button
            onClick={e => { e.stopPropagation(); markRead(item.id) }}
            className={cn(
              "inline-flex items-center gap-1 rounded-[var(--radius-md)]",
              "border border-border/40 px-2 py-1",
              "text-[11px] font-semibold text-muted-foreground",
              "hover:text-foreground hover:border-border",
              "transition-colors duration-200"
            )}
          >
            <Bookmark className="size-3" aria-hidden="true" />
            Save
          </button>

          <button
            onClick={e => { e.stopPropagation(); markRead(item.id) }}
            className={cn(
              "inline-flex items-center gap-1 rounded-[var(--radius-md)]",
              "border border-border/40 px-2 py-1",
              "text-[11px] font-semibold text-muted-foreground",
              "hover:text-foreground hover:border-border",
              "transition-colors duration-200"
            )}
          >
            <Bell className="size-3" aria-hidden="true" />
            Track
          </button>
        </div>

      </div>
    </motion.article>
  )
}
