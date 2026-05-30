"use client"

import { motion, AnimatePresence } from "motion/react"
import { LayoutGrid, List, ChevronDown, SlidersHorizontal, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { useDiscovery } from "@/components/discovery/discovery-context"
import { DiscoveryCard } from "@/components/discovery/discovery-card"

/* ═══════════════════════════════════════════════════════════
   DiscoveryResultsGrid — result controls + paginated grid.
   ═══════════════════════════════════════════════════════════ */

/* ── Loading skeleton ─────────────────────────────────────── */
function SkeletonCard() {
  return (
    <div className="flex flex-col overflow-hidden rounded-[var(--radius-xl)] border border-border bg-card" aria-hidden="true">
      <div className="h-36 w-full animate-pulse bg-muted/60" />
      <div className="flex flex-col gap-3 p-4">
        <div className="h-3.5 w-3/4 animate-pulse rounded-full bg-muted" />
        <div className="h-2.5 w-1/2 animate-pulse rounded-full bg-muted/70" />
        <div className="h-2 w-full animate-pulse rounded-full bg-muted/50" />
        <div className="h-2 w-5/6 animate-pulse rounded-full bg-muted/50" />
        <div className="flex gap-1.5 mt-1">
          <div className="h-4 w-16 animate-pulse rounded-md bg-muted/60" />
          <div className="h-4 w-20 animate-pulse rounded-md bg-muted/60" />
        </div>
        <div className="flex justify-between pt-1 border-t border-border/30">
          <div className="h-6 w-14 animate-pulse rounded-md bg-muted/60" />
          <div className="h-6 w-16 animate-pulse rounded-md bg-muted/60" />
        </div>
      </div>
    </div>
  )
}

/* ── No results empty state ───────────────────────────────── */
function EmptyResults({ hasQuery }: { hasQuery: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center gap-4 py-20 text-center"
    >
      {/* Animated icon */}
      <div className="relative flex h-16 w-16 items-center justify-center">
        <div
          className="absolute h-16 w-16 rounded-full opacity-15"
          style={{ background: "radial-gradient(circle, oklch(0.58 0.220 255), transparent)" }}
        />
        <Sparkles className="size-7 text-primary/40" aria-hidden="true" />
      </div>
      <div className="flex flex-col gap-1.5 max-w-xs">
        <p className="text-base font-semibold text-foreground">
          {hasQuery ? "No matching podcasts" : "No podcasts match these filters"}
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {hasQuery
            ? `Try different keywords, or browse all podcasts by clearing your search.`
            : `Adjust your filters above to see more opportunities.`
          }
        </p>
      </div>
    </motion.div>
  )
}

/* ── Sort dropdown ────────────────────────────────────────── */
function SortDropdown() {
  const { sortBy, setSortBy } = useDiscovery()
  const labels: Record<typeof sortBy, string> = {
    match:    "Match Score",
    audience: "Audience Size",
    activity: "Host Activity",
  }
  return (
    <div className="relative group">
      <button
        className="flex h-8 items-center gap-1.5 rounded-[var(--radius-md)] border border-border/60
                   bg-muted/30 px-3 text-[12px] font-medium text-muted-foreground
                   transition-colors hover:border-border hover:text-foreground"
        aria-label="Sort results"
        aria-haspopup="listbox"
      >
        Sort: {labels[sortBy]}
        <ChevronDown className="size-3.5" aria-hidden="true" />
      </button>
      <div
        role="listbox"
        aria-label="Sort options"
        className="absolute right-0 top-[calc(100%+4px)] z-20 hidden group-focus-within:flex
                   w-44 flex-col rounded-[var(--radius-lg)] border border-border bg-card
                   py-1.5 shadow-[var(--shadow-lg)] group-hover:flex"
      >
        {(["match", "audience", "activity"] as const).map(s => (
          <button
            key={s}
            role="option"
            aria-selected={sortBy === s}
            onClick={() => setSortBy(s)}
            className={cn(
              "flex h-8 items-center px-3 text-[12px] transition-colors",
              sortBy === s
                ? "bg-primary/10 font-semibold text-primary"
                : "text-foreground/80 hover:bg-muted/50"
            )}
          >
            {labels[s]}
          </button>
        ))}
      </div>
    </div>
  )
}

/* ── Main results grid ────────────────────────────────────── */
export function DiscoveryResultsGrid() {
  const {
    results,
    query,
    isSearching,
    viewMode,
    setViewMode,
    toggleSaved,
    activeFilterCount,
    openFilterDrawer,
  } = useDiscovery()

  const showLoading = isSearching

  return (
    <div className="flex flex-1 flex-col gap-4 min-w-0">

      {/* ── Controls row ──────────────────────────────── */}
      <div className="flex items-center gap-3 flex-wrap">

        {/* Mobile filter toggle */}
        <button
          onClick={openFilterDrawer}
          className="flex xl:hidden h-8 items-center gap-1.5 rounded-[var(--radius-md)] border border-border/60
                     bg-muted/30 px-3 text-[12px] font-medium text-muted-foreground
                     transition-colors hover:border-border hover:text-foreground"
          aria-label="Open filters"
        >
          <SlidersHorizontal className="size-3.5" aria-hidden="true" />
          Filters
          {activeFilterCount > 0 && (
            <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-primary/15 px-1 text-[9px] font-bold text-primary">
              {activeFilterCount}
            </span>
          )}
        </button>

        {/* Result count */}
        <div className="flex items-center gap-1.5">
          <AnimatePresence mode="wait">
            {showLoading ? (
              <motion.span
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-1.5 text-[12px] text-muted-foreground"
                aria-live="polite"
              >
                <Sparkles className="size-3 text-primary animate-pulse" aria-hidden="true" />
                AI searching…
              </motion.span>
            ) : (
              <motion.span
                key="count"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-[12px] text-muted-foreground"
                aria-live="polite"
              >
                <span className="font-semibold text-foreground">{results.length}</span> podcast{results.length !== 1 ? "s" : ""} found
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Sort */}
        <SortDropdown />

        {/* View mode toggle */}
        <div className="flex items-center rounded-[var(--radius-md)] border border-border/60 bg-muted/30">
          {(["grid", "list"] as const).map(mode => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              aria-label={`${mode} view`}
              aria-pressed={viewMode === mode}
              className={cn(
                "flex h-8 w-8 items-center justify-center transition-colors",
                "first:rounded-l-[var(--radius-md)] last:rounded-r-[var(--radius-md)]",
                viewMode === mode
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {mode === "grid"
                ? <LayoutGrid className="size-3.5" aria-hidden="true" />
                : <List className="size-3.5" aria-hidden="true" />
              }
            </button>
          ))}
        </div>
      </div>

      {/* ── Results ───────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {showLoading ? (
          /* Loading skeletons */
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={cn(
              "grid gap-4",
              viewMode === "grid"
                ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3"
                : "grid-cols-1"
            )}
            aria-label="Loading results"
            aria-busy="true"
          >
            {viewMode === "grid"
              ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
              : Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-4 rounded-[var(--radius-xl)] border border-border bg-card p-4" aria-hidden="true">
                    <div className="h-14 w-14 animate-pulse rounded-[var(--radius-lg)] bg-muted" />
                    <div className="flex flex-1 flex-col gap-2">
                      <div className="h-3 w-3/5 animate-pulse rounded-full bg-muted" />
                      <div className="h-2.5 w-2/5 animate-pulse rounded-full bg-muted/70" />
                    </div>
                    <div className="h-7 w-16 animate-pulse rounded-full bg-muted" />
                  </div>
                ))
            }
          </motion.div>
        ) : results.length === 0 ? (
          <EmptyResults key="empty" hasQuery={!!query} />
        ) : (
          /* Results */
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={cn(
              "grid gap-4",
              viewMode === "grid"
                ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3"
                : "grid-cols-1"
            )}
            role="list"
            aria-label={`${results.length} podcast results`}
          >
            {results.map((podcast, i) => (
              <DiscoveryCard
                key={podcast.id}
                podcast={podcast}
                onSave={toggleSaved}
                index={i}
                viewMode={viewMode}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
