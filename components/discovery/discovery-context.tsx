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
import type { PodcastApiResponse } from "@/lib/podcasts/schema"

/* ═══════════════════════════════════════════════════════════
   DiscoveryContext — single source of truth for the
   AI Podcast Discovery Engine.

   Data flow:
   1. Initial state: MOCK_PODCASTS (instant render, no flash)
   2. On mount: fetch /api/podcasts → replace with API data
   3. On search: fetch /api/podcasts?q=term → replace
   4. Load More: fetch /api/podcasts?page=N → append

   FUTURE AI INTEGRATION POINT:
   Replace fetchPodcasts() API call with a server action or
   AI-powered ranking endpoint when real scoring is ready.
   ═══════════════════════════════════════════════════════════ */

const PAGE_SIZE = 40

type SortMode = "match" | "audience" | "activity"
type ViewMode = "grid" | "list"

interface DiscoveryContextValue {
  /* Search */
  query:       string
  setQuery:    (q: string) => void
  isSearching: boolean

  /* Filters */
  filters:           DiscoveryFilters
  setFilter:         <K extends keyof DiscoveryFilters>(key: K, val: DiscoveryFilters[K]) => void
  toggleCategory:    (cat: string) => void
  resetFilters:      () => void
  activeFilterCount: number
  filterDrawerOpen:  boolean
  openFilterDrawer:  () => void
  closeFilterDrawer: () => void

  /* View */
  viewMode:    ViewMode
  setViewMode: (m: ViewMode) => void
  sortBy:      SortMode
  setSortBy:   (s: SortMode) => void

  /* Results + pagination */
  results:     DiscoveryPodcast[]
  toggleSaved: (id: string) => void
  isLoading:   boolean
  hasMore:     boolean
  loadMore:    () => void
  dataSource:  string   // "mock" | "podcast-index" | etc.
}

const DiscoveryContext = createContext<DiscoveryContextValue | null>(null)

export function DiscoveryProvider({ children }: { children: React.ReactNode }) {
  const [query,            setQueryRaw]      = useState("")
  const [debouncedQuery,   setDebouncedQuery] = useState("")
  const [isSearching,      setIsSearching]   = useState(false)
  const [filters,          setFilters]       = useState<DiscoveryFilters>(DEFAULT_FILTERS)
  const [viewMode,         setViewMode]      = useState<ViewMode>("grid")
  const [sortBy,           setSortBy]        = useState<SortMode>("match")
  const [filterDrawerOpen, setFilterDrawer]  = useState(false)

  /* Podcast data state — start with mock for instant render */
  const [podcasts,   setPodcasts]  = useState<DiscoveryPodcast[]>(MOCK_PODCASTS)
  const [isLoading,  setIsLoading] = useState(false)
  const [hasMore,    setHasMore]   = useState(false)
  const [page,       setPage]      = useState(1)
  const [dataSource, setDataSource] = useState("mock")

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  /* ── API fetch ──────────────────────────────────────────── */
  const fetchPodcasts = useCallback(async (
    q:      string,
    pg:     number,
    append: boolean
  ) => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({
        q:        q.trim(),
        page:     String(pg),
        pageSize: String(PAGE_SIZE),
      })
      const res  = await fetch(`/api/podcasts?${params}`)
      const json = await res.json() as PodcastApiResponse

      if (append) {
        setPodcasts(prev => {
          const existingIds = new Set(prev.map(p => p.id))
          const newOnes = json.data.filter(p => !existingIds.has(p.id))
          return [...prev, ...newOnes]
        })
      } else {
        setPodcasts(json.data)
      }

      setHasMore(pg < json.totalPages)
      setPage(pg)
      setDataSource(json.source)
    } catch {
      /* Keep existing data — never break the UI */
    } finally {
      setIsLoading(false)
    }
  }, [])

  /* Initial load on mount */
  useEffect(() => {
    fetchPodcasts("", 1, false)
  }, [fetchPodcasts])

  /* Re-fetch when debounced query changes */
  useEffect(() => {
    if (debouncedQuery !== "") {
      fetchPodcasts(debouncedQuery, 1, false)
    }
  }, [debouncedQuery, fetchPodcasts])

  /* ── Debounce query ─────────────────────────────────────── */
  const setQuery = useCallback((q: string) => {
    setQueryRaw(q)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (q.trim()) setIsSearching(true)
    debounceRef.current = setTimeout(() => {
      setDebouncedQuery(q)
      setIsSearching(false)
      if (!q.trim()) {
        // Empty search — reload initial set
        fetchPodcasts("", 1, false)
      }
    }, 420)
  }, [fetchPodcasts])

  useEffect(() => () => { if (debounceRef.current) clearTimeout(debounceRef.current) }, [])

  /* ── Filter helpers ─────────────────────────────────────── */
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
    fetchPodcasts("", 1, false)
  }, [fetchPodcasts])

  const activeFilterCount = useMemo(() => {
    let n = filters.categories.length
    if (filters.audienceSize        !== "any") n++
    if (filters.hostActivity        !== "any") n++
    if (filters.guestAcceptance     !== "any") n++
    if (filters.minMatch            > 0)       n++
    if (filters.visibilityPotential !== "any") n++
    if (filters.activityStatus      !== "any") n++
    if (filters.guestFriendlyMin    > 0)       n++
    return n
  }, [filters])

  /* ── Load more ──────────────────────────────────────────── */
  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      fetchPodcasts(debouncedQuery, page + 1, true)
    }
  }, [fetchPodcasts, debouncedQuery, isLoading, hasMore, page])

  /* ── Client-side filter + sort on loaded data ───────────── */
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
        if (filters.activityStatus !== "any" && p.activityStatus !== filters.activityStatus) return false
        if (filters.guestFriendlyMin > 0 && (p.guestFriendlyScore ?? 0) < filters.guestFriendlyMin) return false
        return true
      })
      .sort((a, b) => {
        if (sortBy === "match")    return b.matchScore   - a.matchScore
        if (sortBy === "audience") return b.audienceSize - a.audienceSize
        const order: Record<string, number> = { weekly: 0, biweekly: 1, monthly: 2 }
        return order[a.hostActivity] - order[b.hostActivity]
      })
  }, [podcasts, debouncedQuery, filters, sortBy])

  /* ── Toggle saved ───────────────────────────────────────── */
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
    isLoading,
    hasMore,
    loadMore,
    dataSource,
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
