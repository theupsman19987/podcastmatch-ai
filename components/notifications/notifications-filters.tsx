"use client"

import { motion } from "motion/react"
import { cn } from "@/lib/utils"
import { useNotifications } from "@/components/notifications/notifications-context"
import {
  FILTER_CATEGORIES,
  type FilterCategory,
} from "@/components/notifications/notifications-mock"

/* ═══════════════════════════════════════════════════════════
   NotificationsFilters — category tab bar with live counts.
   ═══════════════════════════════════════════════════════════ */

export function NotificationsFilters() {
  const { filter, setFilter, counts } = useNotifications()

  return (
    <div
      role="tablist"
      aria-label="Filter notifications by category"
      className="flex overflow-x-auto gap-1 pb-0.5"
      style={{ scrollbarWidth: "none" }}
    >
      {FILTER_CATEGORIES.map((cat) => {
        const active = filter === cat.value
        const count  = counts[cat.value as FilterCategory]

        return (
          <button
            key={cat.value}
            role="tab"
            aria-selected={active}
            onClick={() => setFilter(cat.value as FilterCategory)}
            className={cn(
              "relative shrink-0 flex items-center gap-1.5 rounded-[var(--radius-lg)]",
              "border px-3 py-1.5 text-xs font-semibold whitespace-nowrap",
              "transition-all duration-200",
              active
                ? "border-primary/35 bg-primary/10 text-primary"
                : "border-border/40 bg-card/40 text-muted-foreground hover:text-foreground hover:border-border/70 backdrop-blur-sm"
            )}
          >
            {active && (
              <motion.span
                layoutId="notif-filter-bg"
                className="absolute inset-0 rounded-[var(--radius-lg)] bg-primary/8 border border-primary/25"
                transition={{ type: "spring", bounce: 0.18, duration: 0.35 }}
              />
            )}
            <span className="relative">{cat.label}</span>
            {count > 0 && (
              <span
                className={cn(
                  "relative inline-flex h-4 min-w-[16px] items-center justify-center rounded-full px-1 text-[9px] font-bold tabular-nums",
                  active
                    ? "bg-primary/15 text-primary"
                    : "bg-muted/60 text-muted-foreground"
                )}
              >
                {count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
