"use client"

import { motion } from "motion/react"
import Link from "next/link"
import { Bell, Sparkles, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useNotifications } from "@/components/notifications/notifications-context"

/* ═══════════════════════════════════════════════════════════
   NotificationsEmpty — two states:
   · "no-filter-results" — current filter has nothing to show
   · "all-clear"         — inbox genuinely empty
   ═══════════════════════════════════════════════════════════ */

function EmptyBase({
  icon:  Icon,
  title,
  body,
  cta,
}: {
  icon:  React.ElementType
  title: string
  body:  string
  cta:   React.ReactNode
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        "flex flex-col items-center justify-center gap-6 text-center",
        "rounded-[var(--radius-xl)] border border-dashed border-border/50",
        "bg-card/30 px-8 py-16"
      )}
    >
      <div className="relative flex h-16 w-16 items-center justify-center">
        <div
          aria-hidden
          className="absolute inset-0 rounded-full bg-primary/8 animate-pulse"
          style={{ animationDuration: "3s" }}
        />
        <div className="relative flex h-12 w-12 items-center justify-center rounded-full border border-border/60 bg-card shadow-[var(--shadow-card)]">
          <Icon className="size-5 text-primary/60" aria-hidden="true" />
        </div>
      </div>

      <div className="flex flex-col gap-2 max-w-xs">
        <h3 className="text-base font-bold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
      </div>

      <div className="flex flex-col items-center gap-3">
        {cta}
        <p className="text-[11px] text-muted-foreground flex items-center gap-1.5">
          <Sparkles className="size-3 text-primary/50" aria-hidden="true" />
          AI will notify you the moment opportunities emerge
        </p>
      </div>
    </motion.div>
  )
}

export function NotificationsEmpty() {
  const { filter, setFilter } = useNotifications()

  /* Filter returned nothing, but other categories have items */
  if (filter !== "all") {
    return (
      <EmptyBase
        icon={Bell}
        title="Nothing here for this filter"
        body="No notifications match your current category. Try switching to a different filter or view all activity."
        cta={
          <button
            onClick={() => setFilter("all")}
            className={cn(
              "inline-flex items-center gap-2 rounded-[var(--radius-lg)] border px-4 py-2",
              "text-sm font-semibold border-border hover:border-primary/40",
              "bg-card hover:bg-primary/5 text-foreground transition-colors"
            )}
          >
            View all activity
          </button>
        }
      />
    )
  }

  /* Inbox fully empty */
  return (
    <EmptyBase
      icon={CheckCircle2}
      title="You're all caught up"
      body="No new notifications. AI is actively monitoring your saved podcasts for host activity, audience signals, and outreach opportunities."
      cta={
        <Link
          href="/dashboard/discover"
          className={cn(
            "inline-flex items-center gap-2 rounded-[var(--radius-lg)] px-5 py-2.5",
            "text-sm font-semibold text-white",
            "bg-gradient-to-r from-primary to-[oklch(0.60_0.20_290)]",
            "shadow-[0_0_20px_oklch(0.55_0.22_264/0.35)]",
            "hover:shadow-[0_0_28px_oklch(0.55_0.22_264/0.50)]",
            "transition-shadow duration-300"
          )}
        >
          <Sparkles className="size-4" aria-hidden="true" />
          Discover More Podcasts
        </Link>
      }
    />
  )
}
