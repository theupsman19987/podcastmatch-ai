"use client"

import { motion, AnimatePresence } from "motion/react"
import { X, SlidersHorizontal, RotateCcw } from "lucide-react"
import { cn } from "@/lib/utils"
import { useDiscovery } from "@/components/discovery/discovery-context"
import { ALL_CATEGORIES } from "@/components/discovery/mock-data"

/* ═══════════════════════════════════════════════════════════
   DiscoveryFilterPanel — filter sidebar.
   Desktop: sticky left column.
   Mobile: slide-in drawer via filterDrawerOpen state.
   ═══════════════════════════════════════════════════════════ */

/* ── Reusable section wrapper ─────────────────────────────── */
function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2.5">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
        {title}
      </p>
      {children}
    </div>
  )
}

/* ── Segment control (single select) ─────────────────────── */
function SegmentControl({
  options,
  value,
  onChange,
}: {
  options: { label: string; value: string }[]
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="flex flex-wrap gap-1.5" role="group">
      {options.map(opt => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          aria-pressed={value === opt.value}
          className={cn(
            "rounded-[var(--radius-md)] border px-2.5 py-1 text-[11px] font-medium",
            "transition-all duration-150",
            value === opt.value
              ? "border-primary/40 bg-primary/12 text-primary"
              : "border-border/50 bg-muted/20 text-muted-foreground hover:border-border hover:text-foreground"
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

/* ── Category checkbox pill ───────────────────────────────── */
function CategoryPill({ cat, checked, onToggle }: { cat: string; checked: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      aria-pressed={checked}
      className={cn(
        "flex items-center gap-1.5 rounded-[var(--radius-md)] border px-2.5 py-1.5",
        "text-[11px] font-medium transition-all duration-150 w-full text-left",
        checked
          ? "border-primary/40 bg-primary/10 text-primary"
          : "border-border/40 bg-transparent text-muted-foreground hover:border-border/70 hover:text-foreground"
      )}
    >
      <span
        aria-hidden
        className={cn(
          "flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded border transition-colors",
          checked ? "border-primary bg-primary" : "border-border/60"
        )}
      >
        {checked && (
          <svg viewBox="0 0 8 8" className="size-2 text-white" fill="currentColor" aria-hidden="true">
            <path d="M1 4l2 2 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      {cat}
    </button>
  )
}

/* ── The filter content (shared between desktop + drawer) ─── */
function FilterContent() {
  const { filters, toggleCategory, setFilter, resetFilters, activeFilterCount } = useDiscovery()

  return (
    <div className="flex flex-col gap-5">

      {/* Reset */}
      {activeFilterCount > 0 && (
        <button
          onClick={resetFilters}
          className="flex items-center gap-1.5 text-[11px] font-medium text-primary
                     transition-colors hover:text-primary/70"
        >
          <RotateCcw className="size-3" aria-hidden="true" />
          Reset all filters ({activeFilterCount})
        </button>
      )}

      {/* Category */}
      <FilterSection title="Category">
        <div className="flex flex-col gap-1.5">
          {ALL_CATEGORIES.map(cat => (
            <CategoryPill
              key={cat}
              cat={cat}
              checked={filters.categories.includes(cat)}
              onToggle={() => toggleCategory(cat)}
            />
          ))}
        </div>
      </FilterSection>

      {/* Audience size */}
      <FilterSection title="Audience Size">
        <SegmentControl
          value={filters.audienceSize}
          onChange={v => setFilter("audienceSize", v)}
          options={[
            { label: "Any",     value: "any"     },
            { label: "<10K",    value: "<10k"    },
            { label: "10–50K",  value: "10-50k"  },
            { label: "50–100K", value: "50-100k" },
            { label: "100K+",   value: "100k+"   },
          ]}
        />
      </FilterSection>

      {/* Host activity */}
      <FilterSection title="Host Activity">
        <SegmentControl
          value={filters.hostActivity}
          onChange={v => setFilter("hostActivity", v)}
          options={[
            { label: "Any",        value: "any"      },
            { label: "Weekly",     value: "weekly"   },
            { label: "Bi-weekly",  value: "biweekly" },
            { label: "Monthly",    value: "monthly"  },
          ]}
        />
      </FilterSection>

      {/* Guest acceptance */}
      <FilterSection title="Guest Acceptance">
        <SegmentControl
          value={filters.guestAcceptance}
          onChange={v => setFilter("guestAcceptance", v)}
          options={[
            { label: "Any",        value: "any"       },
            { label: "Open",       value: "open"      },
            { label: "Selective",  value: "selective" },
          ]}
        />
      </FilterSection>

      {/* Min match score */}
      <FilterSection title="Audience Match %">
        <SegmentControl
          value={String(filters.minMatch)}
          onChange={v => setFilter("minMatch", Number(v))}
          options={[
            { label: "Any",  value: "0"  },
            { label: "70%+", value: "70" },
            { label: "80%+", value: "80" },
            { label: "85%+", value: "85" },
            { label: "90%+", value: "90" },
          ]}
        />
      </FilterSection>

      {/* Visibility potential */}
      <FilterSection title="Visibility Potential">
        <SegmentControl
          value={filters.visibilityPotential}
          onChange={v => setFilter("visibilityPotential", v)}
          options={[
            { label: "Any",       value: "any"       },
            { label: "Very High", value: "very-high" },
            { label: "High",      value: "high"      },
            { label: "Medium",    value: "medium"    },
            { label: "Growing",   value: "growing"   },
          ]}
        />
      </FilterSection>

      {/* Active status */}
      <FilterSection title="Active Status">
        <SegmentControl
          value={filters.activityStatus}
          onChange={v => setFilter("activityStatus", v)}
          options={[
            { label: "Any",      value: "any"      },
            { label: "Active",   value: "active"   },
            { label: "Hiatus",   value: "hiatus"   },
            { label: "Inactive", value: "inactive" },
          ]}
        />
      </FilterSection>

      {/* Guest friendly score */}
      <FilterSection title="Guest Friendly Score">
        <SegmentControl
          value={String(filters.guestFriendlyMin)}
          onChange={v => setFilter("guestFriendlyMin", Number(v))}
          options={[
            { label: "Any",  value: "0"  },
            { label: "60%+", value: "60" },
            { label: "75%+", value: "75" },
            { label: "85%+", value: "85" },
            { label: "90%+", value: "90" },
          ]}
        />
      </FilterSection>

    </div>
  )
}

/* ── Desktop sidebar ──────────────────────────────────────── */
export function DiscoveryFilterSidebar() {
  return (
    <aside
      className="hidden xl:flex w-[240px] shrink-0 flex-col gap-1"
      aria-label="Discovery filters"
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <SlidersHorizontal className="size-4 text-muted-foreground" aria-hidden="true" />
        <h2 className="text-sm font-semibold text-foreground">Filters</h2>
      </div>
      <FilterContent />
    </aside>
  )
}

/* ── Mobile filter drawer ─────────────────────────────────── */
export function DiscoveryFilterDrawer() {
  const { filterDrawerOpen, closeFilterDrawer, activeFilterCount } = useDiscovery()

  return (
    <AnimatePresence>
      {filterDrawerOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-background/70 backdrop-blur-sm xl:hidden"
            onClick={closeFilterDrawer}
            aria-hidden="true"
          />

          {/* Drawer */}
          <motion.div
            key="drawer"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-border bg-card xl:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Filter options"
          >
            {/* Drawer header */}
            <div className="flex h-14 items-center justify-between border-b border-border/50 px-5">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="size-4 text-muted-foreground" aria-hidden="true" />
                <span className="text-sm font-semibold text-foreground">Filters</span>
                {activeFilterCount > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary/15 px-1.5 text-[10px] font-bold text-primary">
                    {activeFilterCount}
                  </span>
                )}
              </div>
              <button
                onClick={closeFilterDrawer}
                aria-label="Close filters"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground
                           transition-colors hover:bg-muted hover:text-foreground"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </div>

            {/* Drawer content */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <FilterContent />
            </div>

            {/* Apply button */}
            <div className="border-t border-border/50 p-4">
              <button
                onClick={closeFilterDrawer}
                className="w-full rounded-[var(--radius-lg)] bg-primary py-2.5 text-sm font-semibold
                           text-white transition-all hover:bg-primary/90"
              >
                Apply Filters
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
