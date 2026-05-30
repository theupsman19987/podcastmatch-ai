"use client"

import {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
} from "react"
import {
  type NotificationItem,
  type FilterCategory,
  type DateGroup,
  MOCK_NOTIFICATIONS,
  FILTER_CATEGORIES,
  getDateGroup,
  DATE_GROUP_LABELS,
} from "@/components/notifications/notifications-mock"

/* ═══════════════════════════════════════════════════════════
   NotificationsContext — filter, read, dismiss state.
   Swap MOCK_NOTIFICATIONS with a real API/WebSocket source
   in the provider when the backend is ready.
   ═══════════════════════════════════════════════════════════ */

interface GroupedFeed {
  group:  DateGroup
  label:  string
  items:  NotificationItem[]
}

interface NotificationsContextValue {
  /* Data */
  feed:        GroupedFeed[]
  totalUnread: number
  counts:      Record<FilterCategory, number>

  /* Filter */
  filter:      FilterCategory
  setFilter:   (f: FilterCategory) => void

  /* Actions */
  markRead:    (id: string) => void
  markAllRead: () => void
  dismiss:     (id: string) => void
}

const NotificationsContext = createContext<NotificationsContextValue | null>(null)

/* ── Compute count for a filter category ─────────────────── */
function countForFilter(items: NotificationItem[], cat: FilterCategory): number {
  const def = FILTER_CATEGORIES.find(f => f.value === cat)!
  return items.filter(item => {
    if (cat === "high-priority") return item.priority === "critical" || item.priority === "high"
    if (!def.types)              return true
    return def.types.includes(item.type)
  }).length
}

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const [items,  setItems]  = useState<NotificationItem[]>(MOCK_NOTIFICATIONS)
  const [filter, setFilter] = useState<FilterCategory>("all")

  /* ── Filtered list ────────────────────────────────────── */
  const filtered = useMemo(() => {
    const def = FILTER_CATEGORIES.find(f => f.value === filter)!
    return items.filter(item => {
      if (filter === "high-priority") return item.priority === "critical" || item.priority === "high"
      if (!def.types)                 return true
      return def.types.includes(item.type)
    })
  }, [items, filter])

  /* ── Grouped feed ─────────────────────────────────────── */
  const feed = useMemo((): GroupedFeed[] => {
    const groups: Record<DateGroup, NotificationItem[]> = {
      today: [], yesterday: [], week: [], older: [],
    }
    filtered.forEach(item => groups[getDateGroup(item.timestamp)].push(item))

    const order: DateGroup[] = ["today", "yesterday", "week", "older"]
    return order
      .filter(g => groups[g].length > 0)
      .map(g => ({ group: g, label: DATE_GROUP_LABELS[g], items: groups[g] }))
  }, [filtered])

  /* ── Counts for filter tabs ───────────────────────────── */
  const counts = useMemo((): Record<FilterCategory, number> => {
    return Object.fromEntries(
      FILTER_CATEGORIES.map(f => [f.value, countForFilter(items, f.value)])
    ) as Record<FilterCategory, number>
  }, [items])

  const totalUnread = useMemo(
    () => items.filter(i => !i.isRead).length,
    [items]
  )

  const markRead    = useCallback((id: string) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, isRead: true } : i))
  }, [])

  const markAllRead = useCallback(() => {
    setItems(prev => prev.map(i => ({ ...i, isRead: true })))
  }, [])

  const dismiss     = useCallback((id: string) => {
    setItems(prev => prev.filter(i => i.id !== id))
  }, [])

  return (
    <NotificationsContext.Provider value={{
      feed,
      totalUnread,
      counts,
      filter,
      setFilter,
      markRead,
      markAllRead,
      dismiss,
    }}>
      {children}
    </NotificationsContext.Provider>
  )
}

export function useNotifications(): NotificationsContextValue {
  const ctx = useContext(NotificationsContext)
  if (!ctx) throw new Error("useNotifications must be used within <NotificationsProvider>")
  return ctx
}
