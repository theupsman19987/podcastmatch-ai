"use client"

import { motion } from "motion/react"
import { Bell, CheckCheck, Sparkles, Zap } from "lucide-react"
import { cn } from "@/lib/utils"
import { useNotifications } from "@/components/notifications/notifications-context"

/* ═══════════════════════════════════════════════════════════
   NotificationsHeader — title + summary bar + mark-all-read.
   ═══════════════════════════════════════════════════════════ */

export function NotificationsHeader() {
  const { totalUnread, counts, markAllRead } = useNotifications()

  const stats = [
    { label: "Unread",       value: totalUnread,           color: "text-primary",                bg: "bg-primary/8"                        },
    { label: "High Priority", value: counts["high-priority"], color: "text-[var(--premium-gold)]",  bg: "bg-[oklch(0.78_0.15_83/0.08)]"       },
    { label: "Matches",      value: counts["matches"],     color: "text-[var(--premium-cyan)]",  bg: "bg-[oklch(0.70_0.16_200/0.08)]"      },
    { label: "Outreach",     value: counts["outreach"],    color: "text-[oklch(0.70_0.16_145)]", bg: "bg-[oklch(0.55_0.16_145/0.08)]"      },
  ]

  return (
    <header className="flex flex-col gap-5">

      {/* ── Title ────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-wrap items-start justify-between gap-4"
      >
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <div className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" aria-hidden="true" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
            </div>
            <span className="text-[11px] font-semibold uppercase tracking-widest text-primary/70">
              Live Intelligence Feed
            </span>
          </div>
          <h1 className="text-h3 font-bold text-foreground">
            AI Opportunity <span className="gradient-text-primary">Signal Center</span>
          </h1>
          <p className="text-sm text-muted-foreground max-w-xl">
            AI is continuously scanning{" "}
            <span className="font-semibold text-foreground">podcast hosts, audience signals, and visibility windows</span>{" "}
            — surfacing the moments that matter most for your creator growth.
          </p>
        </div>

        {/* Mark all read */}
        {totalUnread > 0 && (
          <motion.button
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            onClick={markAllRead}
            className={cn(
              "inline-flex items-center gap-2 self-start rounded-[var(--radius-lg)] border px-3 py-1.5",
              "text-xs font-semibold text-muted-foreground border-border/50",
              "hover:text-foreground hover:border-border bg-card/50 backdrop-blur-sm",
              "transition-colors duration-200"
            )}
          >
            <CheckCheck className="size-3.5" aria-hidden="true" />
            Mark all read
          </motion.button>
        )}
      </motion.div>

      {/* ── Summary bar ──────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12, duration: 0.4 }}
        className={cn(
          "relative overflow-hidden rounded-[var(--radius-xl)] border border-border",
          "bg-card p-4 shadow-[var(--shadow-card)]"
        )}
        role="region"
        aria-label="Notification summary"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px
                     bg-gradient-to-r from-transparent via-primary/20 to-transparent"
        />

        <div className="flex flex-wrap items-center gap-3 sm:gap-6">

          {/* Bell icon */}
          <div className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
            "border border-primary/25 bg-primary/8"
          )}>
            <Bell className="size-4 text-primary" aria-hidden="true" />
          </div>

          {/* Stat chips */}
          <div className="flex flex-wrap gap-2.5" role="list">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                role="listitem"
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.18 + i * 0.06 }}
                className={cn(
                  "flex items-center gap-2 rounded-[var(--radius-lg)] px-3 py-1.5",
                  s.bg
                )}
              >
                <span className={cn("text-sm font-bold tabular-nums", s.color)}>{s.value}</span>
                <span className="text-[11px] text-muted-foreground">{s.label}</span>
              </motion.div>
            ))}
          </div>

          <div className="hidden h-8 w-px bg-border/50 sm:block" aria-hidden="true" />

          {/* AI monitoring note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.44 }}
            className="flex items-center gap-2 text-[11px] text-muted-foreground"
          >
            <Sparkles className="size-3.5 text-primary/60 shrink-0" aria-hidden="true" />
            <span>
              <span className="font-semibold text-[var(--premium-cyan)]">AI scanned</span>{" "}
              podcast signals 6 minutes ago
            </span>
          </motion.div>

          {/* Live indicator */}
          <div className="ml-auto flex items-center gap-1.5 text-[10px] font-semibold text-[oklch(0.70_0.16_145)]">
            <Zap className="size-3" aria-hidden="true" />
            Live
          </div>

        </div>
      </motion.div>

    </header>
  )
}
