"use client"

import {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
} from "react"
import {
  type SavedOpportunity,
  type TrackingStatus,
  type FilterStatus,
  type SortMode,
  MOCK_SAVED,
} from "@/components/saved/saved-mock"

/* ═══════════════════════════════════════════════════════════
   SavedContext — state for the Saved Opportunities + Watchlist.
   Swap MOCK_SAVED with a real API fetch when backend is ready.
   All UI reads from `results` — just replace the data source.
   ═══════════════════════════════════════════════════════════ */

interface SavedContextValue {
  /* Data */
  results:          SavedOpportunity[]
  total:            number
  counts:           Record<FilterStatus, number>

  /* Filters */
  filterStatus:     FilterStatus
  setFilterStatus:  (s: FilterStatus) => void
  filterCategories: string[]
  toggleCategory:   (cat: string) => void
  sortBy:           SortMode
  setSortBy:        (s: SortMode) => void

  /* Actions */
  removeSaved:      (id: string) => void
  updateTracking:   (id: string, status: TrackingStatus) => void
}

const SavedContext = createContext<SavedContextValue | null>(null)

/* ── Opportunity sort scoring ─────────────────────────────── */
const VIS_WEIGHT: Record<SavedOpportunity["visibilityPotential"], number> = {
  "very-high": 4, "high": 3, "medium": 2, "growing": 1,
}

function opportunityScore(opp: SavedOpportunity): number {
  return opp.matchScore + opp.alerts.length * 5 + VIS_WEIGHT[opp.visibilityPotential] * 2
}

export function SavedProvider({ children }: { children: React.ReactNode }) {
  const [opportunities,    setOpportunities]    = useState<SavedOpportunity[]>(MOCK_SAVED)
  const [filterStatus,     setFilterStatus]     = useState<FilterStatus>("all")
  const [filterCategories, setFilterCategories] = useState<string[]>([])
  const [sortBy,           setSortBy]           = useState<SortMode>("recent")

  /* ── Computed results ────────────────────────────────── */
  const results = useMemo(() => {
    return opportunities
      .filter(opp => {
        if (filterStatus !== "all" && opp.trackingStatus !== filterStatus) return false
        if (filterCategories.length > 0 && !opp.categories.some(c => filterCategories.includes(c))) return false
        return true
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "match":         return b.matchScore      - a.matchScore
          case "recent":        return b.savedTimestamp  - a.savedTimestamp
          case "host-activity": {
            const order: Record<SavedOpportunity["hostActivity"], number> = { weekly: 0, biweekly: 1, monthly: 2 }
            return order[a.hostActivity] - order[b.hostActivity]
          }
          case "opportunity":   return opportunityScore(b) - opportunityScore(a)
          default:              return 0
        }
      })
  }, [opportunities, filterStatus, filterCategories, sortBy])

  /* ── Status counts for filter tabs ──────────────────── */
  const counts = useMemo((): Record<FilterStatus, number> => ({
    all:           opportunities.length,
    watching:      opportunities.filter(o => o.trackingStatus === "watching").length,
    "high-priority": opportunities.filter(o => o.trackingStatus === "high-priority").length,
    contacted:     opportunities.filter(o => o.trackingStatus === "contacted").length,
    scheduled:     opportunities.filter(o => o.trackingStatus === "scheduled").length,
  }), [opportunities])

  const toggleCategory = useCallback((cat: string) => {
    setFilterCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    )
  }, [])

  const removeSaved = useCallback((id: string) => {
    setOpportunities(prev => prev.filter(o => o.id !== id))
  }, [])

  const updateTracking = useCallback((id: string, status: TrackingStatus) => {
    setOpportunities(prev => prev.map(o => o.id === id ? { ...o, trackingStatus: status } : o))
  }, [])

  return (
    <SavedContext.Provider value={{
      results,
      total: opportunities.length,
      counts,
      filterStatus,
      setFilterStatus,
      filterCategories,
      toggleCategory,
      sortBy,
      setSortBy,
      removeSaved,
      updateTracking,
    }}>
      {children}
    </SavedContext.Provider>
  )
}

export function useSaved(): SavedContextValue {
  const ctx = useContext(SavedContext)
  if (!ctx) throw new Error("useSaved must be used within <SavedProvider>")
  return ctx
}
