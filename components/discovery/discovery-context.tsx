"use client"

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react"
import {
  type DiscoveryPodcast,
  type DiscoveryFilters,
  DEFAULT_FILTERS,
  MOCK_PODCASTS,
} from "@/components/discovery/mock-data"

/* ═══════════════════════════════════════════════════════════
   DiscoveryContext — single source of truth for the
   AI Podcast Discovery Engine.

   Swap MOCK_PODCASTS with a real API call here when ready —
   every UI component reads from the same computed `results`.
   ═══════════════════════════════════════════════════════════ */

type SortMode = "match" | "audience" | "activity"
type ViewMode = "grid" | "list"

interface DiscoveryContextValue {
  /* Search */
  query:          string
  setQuery:       (q: string) => void
  isSearching:    boolean

  /* Filters */
  filters:            DiscoveryFilters
  setFilter:          <K extends keyof DiscoveryFilters>(key: K, val: DiscoveryFilters[K]) => void
  toggleCategory:     (cat: string) => void
  resetFilters:       () => void
  activeFilterCount:  number
  filterDrawerOpen:   boolean
  openFilterDrawer:   () => void
  closeFilterDrawer:  () => void

  /* View */
  viewMode:    ViewMode
  setViewMode: (m: ViewMode) => void
  sortBy:      SortMode
  setSortBy:   (s: SortMode) => void

  /* Results */
  results:      DiscoveryPodcast[]
  toggleSaved:  (id: string) => void
}

const DiscoveryContext = createContext<DiscoveryContextValue | null>(null)

export function DiscoveryProvider({ children }: { children: React.ReactNode }) {
  const [query,           setQueryRaw]      = useState("")
  const [debouncedQuery,  setDebouncedQuery] = useState("")
  const [isSearching,     setIsSearching]   = useState(false)
  const [filters,         setFilters]       = useState<DiscoveryFilters>(DEFAULT_FILTERS)
  const [viewMode,        setViewMode]      = useState<ViewMode>("grid")
  const [sortBy,          setSortBy]        = useState<SortMode>("match")
  const [filterDrawerOpen,setFilterDrawer]  = useState(false)
  const [podcasts,        setPodcasts]      = useState<DiscoveryPodcast[]>(MOCK_PODCASTS)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  /* Debounce query — 400ms */
  const setQuery = useCallback((q: string) => {
    setQueryRaw(q)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (q.trim()) setIsSearching(true)
    debounceRef.current = setTimeout(() => {
      setDebouncedQuery(q)
      setIsSearching(false)
    }, 420)
  }, [])

  useEffect(() => () => { if (debounceRef.current) clearTimeout(debounceRef.current) }, [])

  /* Filter helpers */
  const setFilter = useCallback(<K extends keyof DiscoveryFilters>(
    key: K,
    val: DiscoveryFilters[K]
  ) => setFilters(prev => ({ ...prev, [key]: val })), [])

  const toggleCategory = useCallback((cat: string) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(cat)
        ? prev.categories.filter(c => c !== cat)
        : [...prev.categories, cat],
    }))
  }, [])

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS)
    setQueryRaw("")
    setDebouncedQuery("")
  }, [])

  const activeFilterCount = useMemo(() => {
    let n = filters.categories.length
    if (filters.audienceSize        !== "any") n++
    if (filters.hostActivity        !== "any") n++
    if (filters.guestAcceptance     !== "any") n++
    if (filters.minMatch            > 0)       n++
    if (filters.visibilityPotential !== "any") n++
    return n
  }, [filters])

  /* Computed filtered + sorted results */
  const results = useMemo<DiscoveryPodcast[]>(() => {
    const q = debouncedQuery.toLowerCase().trim()

    return podcasts
      .filter(p => {
        if (q) {
          const haystack = [p.name, p.host, p.description, ...p.categories].join(" ").toLowerCase()
          if (!haystack.includes(q)) return false
        }
        if (filters.categories.length > 0 && !p.categories.some(c => filters.categories.includes(c))) return false
        if (filters.hostActivity !== "any"        && p.hostActivity        !== filters.hostActivity)        return false
        if (filters.guestAcceptance !== "any"     && p.guestAcceptance     !== filters.guestAcceptance)     return false
        if (filters.visibilityPotential !== "any" && p.visibilityPotential !== filters.visibilityPotential) return false
        if (filters.minMatch > 0 && p.matchScore < filters.minMatch) return false
        if (filters.audienceSize !== "any") {
          const s = p.audienceSize
          if (filters.audienceSize === "<10k"     && s >= 10)             return false
          if (filters.audienceSize === "10-50k"   && (s < 10 || s >= 50)) return false
          if (filters.audienceSize === "50-100k"  && (s < 50 || s >= 100))return false
          if (filters.audienceSize === "100k+"    && s < 100)             return false
        }
        return true
      })
      .sort((a, b) => {
        if (sortBy === "match")    return b.matchScore   - a.matchScore
        if (sortBy === "audience") return b.audienceSize - a.audienceSize
        const order: Record<string, number> = { weekly: 0, biweekly: 1, monthly: 2 }
        return order[a.hostActivity] - order[b.hostActivity]
      })
  }, [podcasts, debouncedQuery, filters, sortBy])

  /* Toggle saved state */
  const toggleSaved = useCallback((id: string) => {
    setPodcasts(prev => prev.map(p => p.id === id ? { ...p, saved: !p.saved } : p))
  }, [])

  const value: DiscoveryContextValue = {
    query,
    setQuery,
    isSearching,
    filters,
    setFilter,
    toggleCategory,
    resetFilters,
    activeFilterCount,
    filterDrawerOpen,
    openFilterDrawer:  () => setFilterDrawer(true),
    closeFilterDrawer: () => setFilterDrawer(false),
    viewMode,
    setViewMode,
    sortBy,
    setSortBy,
    results,
    toggleSaved,
  }

  return (
    <DiscoveryContext.Provider value={value}>
      {children}
    </DiscoveryContext.Provider>
  )
}

export function useDiscovery(): DiscoveryContextValue {
  const ctx = useContext(DiscoveryContext)
  if (!ctx) throw new Error("useDiscovery must be used within <DiscoveryProvider>")
  return ctx
}
