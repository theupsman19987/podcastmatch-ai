"use client"

import { motion, AnimatePresence } from "motion/react"
import { cn } from "@/lib/utils"
import { useNotifications } from "@/components/notifications/notifications-context"
import { NotificationCard }  from "@/components/notifications/notification-card"
import { NotificationsEmpty } from "@/components/notifications/notifications-empty"

/* ═══════════════════════════════════════════════════════════
   ActivityTimeline — grouped notification feed by date.
   ═══════════════════════════════════════════════════════════ */

/* ── Date group header ────────────────────────────────────── */
function GroupHeader({ label, count, hasUnread }: { label: string; count: number; hasUnread: boolean }) {
  return (
    <div className="flex items-center gap-3 py-1">
      <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/70">
        {label}
      </span>
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-semibold text-muted-foreground/50 tabular-nums">
          {count}
        </span>
        {hasUnread && (
          <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 border border-primary/20 px-1.5 py-0.5 text-[9px] font-bold text-primary">
            {count === 1 ? "1 new" : `${count} new`}
          </span>
        )}
      </div>
      <div className="flex-1 h-px bg-border/30" aria-hidden="true" />
    </div>
  )
}

export function ActivityTimeline() {
  const { feed } = useNotifications()

  if (feed.length === 0 || feed.every(g => g.items.length === 0)) {
    return <NotificationsEmpty />
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-6"
      role="feed"
      aria-label="Notification activity timeline"
    >
      {feed.map((group, groupIdx) => {
        const unreadInGroup = group.items.filter(i => !i.isRead).length
        let cardOffset = 0
        feed.slice(0, groupIdx).forEach(g => { cardOffset += g.items.length })

        return (
          <section key={group.group} aria-label={group.label}>
            <GroupHeader
              label={group.label}
              count={group.items.length}
              hasUnread={unreadInGroup > 0}
            />

            <div className="mt-3 flex flex-col gap-2.5">
              <AnimatePresence mode="popLayout" initial={false}>
                {group.items.map((item, itemIdx) => (
                  <NotificationCard
                    key={item.id}
                    item={item}
                    index={cardOffset + itemIdx}
                  />
                ))}
              </AnimatePresence>
            </div>
          </section>
        )
      })}
    </motion.div>
  )
}
