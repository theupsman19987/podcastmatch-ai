"use client"

import { motion } from "motion/react"
import Link from "next/link"
import { Bookmark, SearchX, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { useSaved } from "@/components/saved/saved-context"

/* ═══════════════════════════════════════════════════════════
   SavedEmptyState — two variants:
   · "no-saved"    → user has nothing saved yet
   · "no-results"  → active filters returned 0 results
   ═══════════════════════════════════════════════════════════ */

function EmptyBase({
  icon: Icon,
  title,
  body,
  cta,
}: {
  icon:  React.ElementType
  title: string
  body:  string
  cta:   React.ReactNode
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        "flex flex-col items-center justify-center gap-6 rounded-[var(--radius-xl)]",
        "border border-dashed border-border/50 bg-card/30",
        "px-8 py-16 text-center",
      )}
    >
      {/* Icon ring */}
      <div className="relative flex h-16 w-16 items-center justify-center">
        <div
          aria-hidden
          className="absolute inset-0 rounded-full bg-primary/8 animate-pulse"
          style={{ animationDuration: "3s" }}
        />
        <div className="relative flex h-12 w-12 items-center justify-center rounded-full border border-border/60 bg-card shadow-[var(--shadow-card)]">
          <Icon className="size-5 text-primary/60" aria-hidden="true" />
        </div>
      </div>

      {/* Copy */}
      <div className="flex flex-col gap-2 max-w-xs">
        <h3 className="text-base font-bold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
      </div>

      {/* CTA */}
      <div className="flex flex-col items-center gap-3">
        {cta}
        <p className="text-[11px] text-muted-foreground flex items-center gap-1.5">
          <Sparkles className="size-3 text-primary/50" aria-hidden="true" />
          AI will monitor saved podcasts and surface opportunities
        </p>
      </div>
    </motion.div>
  )
}

export function SavedEmptyState() {
  const { total, setFilterStatus, filterCategories, toggleCategory } = useSaved()

  /* Variant: no results after filtering */
  if (total > 0) {
    return (
      <EmptyBase
        icon={SearchX}
        title="No matches for your filters"
        body="Your current filter combination returned no results. Try adjusting the status tabs or clearing category filters."
        cta={
          <button
            onClick={() => {
              setFilterStatus("all")
              filterCategories.forEach(c => toggleCategory(c))
            }}
            className={cn(
              "inline-flex items-center gap-2 rounded-[var(--radius-lg)] border px-4 py-2",
              "text-sm font-semibold border-border hover:border-primary/40",
              "bg-card hover:bg-primary/5 text-foreground transition-colors"
            )}
          >
            Clear all filters
          </button>
        }
      />
    )
  }

  /* Variant: nothing saved at all */
  return (
    <EmptyBase
      icon={Bookmark}
      title="Your pipeline is empty"
      body="Save podcasts from the discovery engine and the AI will start tracking guest opportunities, host activity, and audience signals for you."
      cta={
        <Link
          href="/dashboard/discover"
          className={cn(
            "inline-flex items-center gap-2 rounded-[var(--radius-lg)] px-5 py-2.5",
            "text-sm font-semibold text-white",
            "bg-gradient-to-r from-primary to-[oklch(0.60_0.20_290)]",
            "shadow-[0_0_20px_oklch(0.55_0.22_264/0.35)]",
            "hover:shadow-[0_0_28px_oklch(0.55_0.22_264/0.50)]",
            "transition-shadow duration-300"
          )}
        >
          <Sparkles className="size-4" aria-hidden="true" />
          Discover Podcasts
        </Link>
      }
    />
  )
}
