"use client"

import * as React from "react"
import { motion, AnimatePresence } from "motion/react"
import { Search, ChevronDown, SlidersHorizontal, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useOutreach } from "@/components/outreach/outreach-context"
import { type SortMode } from "@/components/outreach/outreach-mock"

/* ═══════════════════════════════════════════════════════════
   OutreachFilters — search + sort + category pills
   ═══════════════════════════════════════════════════════════ */

const SORT_OPTIONS: { value: SortMode; label: string }[] = [
  { value: "match",    label: "Highest Match"      },
  { value: "recent",   label: "Recently Added"     },
  { value: "response", label: "Best Response Rate" },
  { value: "audience", label: "Largest Audience"   },
]

const ALL_CATS = [
  "Entrepreneurship", "Technology", "Business",
  "Leadership", "Personal Development", "Mindset",
  "Faith", "Health & Wellness",
]

function SortDropdown() {
  const { sortBy, setSortBy } = useOutreach()
  const [open, setOpen] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)
  const current = SORT_OPTIONS.find(o => o.value === sortBy)!

  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
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
          "text-xs font-semibold bg-card/60 backdrop-blur-sm border-border/60 text-foreground",
          "hover:border-primary/40 hover:bg-card/80 transition-all duration-200",
          open && "border-primary/40 bg-card/80"
        )}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <SlidersHorizontal className="size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
        <span>{current.label}</span>
        <ChevronDown
          className={cn("size-3.5 shrink-0 text-muted-foreground transition-transform duration-200", open && "rotate-180")}
          aria-hidden="true"
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            initial={{ opacity: 0, y: -4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0,  scale: 1 }}
            exit={{   opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className={cn(
              "absolute right-0 top-full z-50 mt-1.5 min-w-[190px]",
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
                  {sortBy === opt.value && <span className="mr-1.5 text-primary">✓</span>}
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

export function OutreachFilters() {
  const { query, setQuery, filterCategories, toggleCategory } = useOutreach()
  const [showCats, setShowCats] = React.useState(false)

  return (
    <div className="flex flex-col gap-3">

      {/* Search + sort row */}
      <div className="flex items-center gap-3 flex-wrap">

        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search podcast or host..."
            aria-label="Search pipeline"
            className={cn(
              "w-full rounded-[var(--radius-lg)] border border-border/60 bg-card/60 backdrop-blur-sm",
              "pl-9 pr-4 py-1.5 text-xs text-foreground placeholder:text-muted-foreground",
              "focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20",
              "transition-all duration-200"
            )}
          />
          <AnimatePresence>
            {query && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{   opacity: 0, scale: 0.8 }}
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="size-3.5" aria-hidden="true" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Category toggle */}
        <button
          onClick={() => setShowCats(v => !v)}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-[var(--radius-lg)] border px-3 py-1.5",
            "text-xs font-semibold transition-colors duration-150",
            showCats
              ? "border-primary/40 bg-primary/10 text-primary"
              : "border-border/50 bg-muted/20 text-muted-foreground hover:text-foreground hover:border-border"
          )}
        >
          Categories
          <ChevronDown
            className={cn("size-3 transition-transform duration-200", showCats && "rotate-180")}
            aria-hidden="true"
          />
          {filterCategories.length > 0 && (
            <span className="inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-primary/15 px-1 text-[10px] font-bold text-primary tabular-nums">
              {filterCategories.length}
            </span>
          )}
        </button>

        {/* Sort */}
        <SortDropdown />
      </div>

      {/* Category pills */}
      <AnimatePresence>
        {showCats && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{   opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-wrap gap-1.5 overflow-hidden"
          >
            {ALL_CATS.map((cat, i) => {
              const active = filterCategories.includes(cat)
              return (
                <motion.button
                  key={cat}
                  initial={{ opacity: 0, scale: 0.88 }}
                  animate={{ opacity: 1, scale: 1 }}
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
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active filter chips */}
      <AnimatePresence>
        {filterCategories.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{   opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-wrap items-center gap-2 overflow-hidden"
          >
            <span className="text-[10px] text-muted-foreground font-medium">Filtered by:</span>
            {filterCategories.map(cat => (
              <motion.button
                key={cat}
                initial={{ opacity: 0, scale: 0.88 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{   opacity: 0, scale: 0.88 }}
                onClick={() => toggleCategory(cat)}
                className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold text-primary border-primary/30 bg-primary/8 hover:border-primary/50 hover:bg-primary/15 transition-colors"
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

    </div>
  )
}
