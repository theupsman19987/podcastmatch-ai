"use client"

import {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
} from "react"
import {
  type OutreachEntry,
  type OutreachStage,
  type FilterStage,
  type SortMode,
  MOCK_OUTREACH,
  STAGE_ORDER,
} from "@/components/outreach/outreach-mock"

/* ═══════════════════════════════════════════════════════════
   OutreachContext — state for the Outreach Pipeline.
   Swap MOCK_OUTREACH with a real API fetch when ready.
   ═══════════════════════════════════════════════════════════ */

interface OutreachContextValue {
  /* Data */
  entries:            OutreachEntry[]
  entriesByStage:     Record<OutreachStage, OutreachEntry[]>
  total:              number
  countByStage:       Record<OutreachStage, number>

  /* Filters */
  query:              string
  setQuery:           (q: string) => void
  filterCategories:   string[]
  toggleCategory:     (cat: string) => void
  sortBy:             SortMode
  setSortBy:          (s: SortMode) => void

  /* Active stage (mobile Kanban tab) */
  activeStage:        OutreachStage
  setActiveStage:     (s: OutreachStage) => void

  /* Actions */
  moveStage:          (id: string, stage: OutreachStage) => void
  advanceStage:       (id: string) => void
  updateNotes:        (id: string, notes: string) => void
  removeEntry:        (id: string) => void
}

const OutreachContext = createContext<OutreachContextValue | null>(null)

function applySort(entries: OutreachEntry[], sortBy: SortMode): OutreachEntry[] {
  return [...entries].sort((a, b) => {
    switch (sortBy) {
      case "match":    return b.matchScore      - a.matchScore
      case "recent":   return b.savedTimestamp  - a.savedTimestamp
      case "response": return b.responseRate    - a.responseRate
      case "audience": return b.audienceSize    - a.audienceSize
      default:         return 0
    }
  })
}

export function OutreachProvider({ children }: { children: React.ReactNode }) {
  const [entries,          setEntries]          = useState<OutreachEntry[]>(MOCK_OUTREACH)
  const [query,            setQuery]            = useState("")
  const [filterCategories, setFilterCategories] = useState<string[]>([])
  const [sortBy,           setSortBy]           = useState<SortMode>("match")
  const [activeStage,      setActiveStage]      = useState<OutreachStage>("new")

  /* ── Filtered + sorted entries ───────────────────────── */
  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim()
    return entries.filter(e => {
      if (q && !e.podcastName.toLowerCase().includes(q) && !e.hostName.toLowerCase().includes(q)) return false
      if (filterCategories.length > 0 && !e.categories.some(c => filterCategories.includes(c))) return false
      return true
    })
  }, [entries, query, filterCategories])

  const entriesByStage = useMemo((): Record<OutreachStage, OutreachEntry[]> => {
    const sorted = applySort(filtered, sortBy)
    return {
      new:       sorted.filter(e => e.stage === "new"),
      ready:     sorted.filter(e => e.stage === "ready"),
      contacted: sorted.filter(e => e.stage === "contacted"),
      responded: sorted.filter(e => e.stage === "responded"),
      booked:    sorted.filter(e => e.stage === "booked"),
      completed: sorted.filter(e => e.stage === "completed"),
    }
  }, [filtered, sortBy])

  const countByStage = useMemo((): Record<OutreachStage, number> => ({
    new:       entries.filter(e => e.stage === "new").length,
    ready:     entries.filter(e => e.stage === "ready").length,
    contacted: entries.filter(e => e.stage === "contacted").length,
    responded: entries.filter(e => e.stage === "responded").length,
    booked:    entries.filter(e => e.stage === "booked").length,
    completed: entries.filter(e => e.stage === "completed").length,
  }), [entries])

  const toggleCategory = useCallback((cat: string) => {
    setFilterCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    )
  }, [])

  const moveStage = useCallback((id: string, stage: OutreachStage) => {
    setEntries(prev => prev.map(e => e.id === id ? { ...e, stage } : e))
  }, [])

  const advanceStage = useCallback((id: string) => {
    setEntries(prev => prev.map(e => {
      if (e.id !== id) return e
      const idx = STAGE_ORDER.indexOf(e.stage)
      const next = STAGE_ORDER[Math.min(idx + 1, STAGE_ORDER.length - 1)]
      return { ...e, stage: next }
    }))
  }, [])

  const updateNotes = useCallback((id: string, notes: string) => {
    setEntries(prev => prev.map(e => e.id === id ? { ...e, notes } : e))
  }, [])

  const removeEntry = useCallback((id: string) => {
    setEntries(prev => prev.filter(e => e.id !== id))
  }, [])

  return (
    <OutreachContext.Provider value={{
      entries:          filtered,
      entriesByStage,
      total:            entries.length,
      countByStage,
      query,
      setQuery,
      filterCategories,
      toggleCategory,
      sortBy,
      setSortBy,
      activeStage,
      setActiveStage,
      moveStage,
      advanceStage,
      updateNotes,
      removeEntry,
    }}>
      {children}
    </OutreachContext.Provider>
  )
}

export function useOutreach(): OutreachContextValue {
  const ctx = useContext(OutreachContext)
  if (!ctx) throw new Error("useOutreach must be used within <OutreachProvider>")
  return ctx
}
