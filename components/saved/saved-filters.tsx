"use client"

import * as React from "react"
import { motion, AnimatePresence } from "motion/react"
import { ChevronDown, SlidersHorizontal, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useSaved } from "@/components/saved/saved-context"
import {
  type FilterStatus,
  type SortMode,
} from "@/components/saved/saved-mock"

/* ═══════════════════════════════════════════════════════════
   SavedFilters — status tabs + sort + category pills
   ═══════════════════════════════════════════════════════════ */

const STATUS_TABS: { value: FilterStatus; label: string }[] = [
  { value: "all",           label: "All"          },
  { value: "watching",      label: "Watching"     },
  { value: "high-priority", label: "High Priority"},
  { value: "contacted",     label: "Contacted"    },
  { value: "scheduled",     label: "Scheduled"    },
]

const SORT_OPTIONS: { value: SortMode; label: string }[] = [
  { value: "match",         label: "Highest Match"    },
  { value: "recent",        label: "Recently Saved"   },
  { value: "host-activity", label: "Most Active Hosts"},
  { value: "opportunity",   label: "Top Opportunity"  },
]

const ALL_CATS = [
  "Entrepreneurship", "Technology", "Business",
  "Leadership", "Personal Development", "Mindset",
  "Faith", "Health & Wellness",
]

/* ── Sort dropdown ────────────────────────────────────────── */
function SortDropdown() {
  const { sortBy, setSortBy } = useSaved()
  const [open, setOpen] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)
  const current = SORT_OPTIONS.find(o => o.value === sortBy)!

  React.useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className={cn(
          "inline-flex items-center gap-2 rounded-[var(--radius-lg)] border px-3 py-1.5",
          "text-xs font-semibold text-foreground transition-all duration-200",
          "bg-card/60 backdrop-blur-sm border-border/60",
          "hover:border-primary/40 hover:bg-card/80",
          open && "border-primary/40 bg-card/80"
        )}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <SlidersHorizontal className="size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
        <span>{current.label}</span>
        <ChevronDown
          className={cn(
            "size-3.5 shrink-0 text-muted-foreground transition-transform duration-200",
            open && "rotate-180"
          )}
          aria-hidden="true"
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            aria-label="Sort by"
            initial={{ opacity: 0, y: -4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0,  scale: 1 }}
            exit={{   opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className={cn(
              "absolute right-0 top-full z-50 mt-1.5 min-w-[180px]",
              "rounded-[var(--radius-lg)] border border-border/70",
              "bg-card/95 backdrop-blur-md shadow-[var(--shadow-card)] py-1"
            )}
          >
            {SORT_OPTIONS.map(opt => (
              <li key={opt.value}>
                <button
                  role="option"
                  aria-selected={sortBy === opt.value}
                  onClick={() => { setSortBy(opt.value); setOpen(false) }}
                  className={cn(
                    "w-full px-3 py-2 text-left text-xs font-medium transition-colors",
                    sortBy === opt.value
                      ? "text-primary bg-primary/8"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                  )}
                >
                  {opt.value === sortBy && (
                    <span className="mr-1.5 text-primary">✓</span>
                  )}
                  {opt.label}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ── Category pills row ───────────────────────────────────── */
function CategoryPills() {
  const { filterCategories, toggleCategory } = useSaved()

  return (
    <AnimatePresence>
      {filterCategories.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{   opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className="flex flex-wrap items-center gap-2 overflow-hidden"
        >
          <span className="text-[10px] text-muted-foreground font-medium">Filtered:</span>
          {filterCategories.map(cat => (
            <motion.button
              key={cat}
              initial={{ opacity: 0, scale: 0.88 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{   opacity: 0, scale: 0.88 }}
              onClick={() => toggleCategory(cat)}
              className={cn(
                "inline-flex items-center gap-1 rounded-full border px-2 py-0.5",
                "text-[10px] font-semibold text-primary border-primary/30 bg-primary/8",
                "hover:border-primary/50 hover:bg-primary/15 transition-colors"
              )}
            >
              {cat}
              <X className="size-2.5" aria-hidden="true" />
            </motion.button>
          ))}
          <button
            onClick={() => filterCategories.forEach(c => toggleCategory(c))}
            className="text-[10px] text-muted-foreground hover:text-foreground underline underline-offset-2"
          >
            Clear all
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ── All category pills (toggle-able) ────────────────────── */
function AllCategoryPills() {
  const { filterCategories, toggleCategory } = useSaved()
  const [show, setShow] = React.useState(false)

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <button
        onClick={() => setShow(v => !v)}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-[var(--radius-lg)] border px-2.5 py-1",
          "text-[11px] font-semibold transition-colors duration-150",
          show
            ? "border-primary/40 bg-primary/10 text-primary"
            : "border-border/50 bg-muted/20 text-muted-foreground hover:text-foreground hover:border-border"
        )}
      >
        Categories
        <ChevronDown
          className={cn(
            "size-3 transition-transform duration-200",
            show && "rotate-180"
          )}
          aria-hidden="true"
        />
      </button>

      <AnimatePresence>
        {show && ALL_CATS.map((cat, i) => {
          const active = filterCategories.includes(cat)
          return (
            <motion.button
              key={cat}
              initial={{ opacity: 0, scale: 0.88 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{   opacity: 0, scale: 0.88 }}
              transition={{ delay: i * 0.02 }}
              onClick={() => toggleCategory(cat)}
              className={cn(
                "rounded-full border px-2.5 py-0.5 text-[11px] font-medium transition-all duration-150",
                active
                  ? "border-primary/40 bg-primary/12 text-primary"
                  : "border-border/40 bg-muted/20 text-muted-foreground hover:border-primary/30 hover:text-foreground"
              )}
            >
              {cat}
            </motion.button>
          )
        })}
      </AnimatePresence>
    </div>
  )
}

/* ── Main export ──────────────────────────────────────────── */
export function SavedFilters() {
  const { filterStatus, setFilterStatus, counts } = useSaved()

  return (
    <div className="flex flex-col gap-3">

      {/* Status tabs + sort row */}
      <div className="flex items-center justify-between gap-3 flex-wrap">

        {/* Status tabs */}
        <div
          role="tablist"
          aria-label="Filter by tracking status"
          className={cn(
            "flex items-center gap-0.5 rounded-[var(--radius-lg)] border border-border/50",
            "bg-card/40 backdrop-blur-sm p-0.5"
          )}
        >
          {STATUS_TABS.map(tab => {
            const count = counts[tab.value]
            const active = filterStatus === tab.value
            return (
              <button
                key={tab.value}
                role="tab"
                aria-selected={active}
                onClick={() => setFilterStatus(tab.value)}
                className={cn(
                  "relative rounded-[var(--radius-md)] px-3 py-1.5 text-xs font-semibold",
                  "transition-all duration-200 whitespace-nowrap",
                  active
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {active && (
                  <motion.span
                    layoutId="saved-filter-pill"
                    className="absolute inset-0 rounded-[var(--radius-md)] bg-background shadow-sm border border-border/60"
                    transition={{ type: "spring", bounce: 0.18, duration: 0.35 }}
                  />
                )}
                <span className="relative flex items-center gap-1.5">
                  {tab.label}
                  {count > 0 && (
                    <span
                      className={cn(
                        "inline-flex h-4 min-w-[16px] items-center justify-center rounded-full",
                        "px-1 text-[10px] font-bold tabular-nums",
                        active
                          ? "bg-primary/15 text-primary"
                          : "bg-muted/60 text-muted-foreground"
                      )}
                    >
                      {count}
                    </span>
                  )}
                </span>
              </button>
            )
          })}
        </div>

        {/* Sort dropdown */}
        <SortDropdown />
      </div>

      {/* Category row */}
      <AllCategoryPills />

      {/* Active category filter pills */}
      <CategoryPills />

    </div>
  )
}
