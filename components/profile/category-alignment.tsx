"use client"

import { useRef } from "react"
import { motion } from "motion/react"
import { useInView } from "motion/react"
import { Sparkles, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"
import { MOCK_CATEGORIES, type CategoryAlignment, type VisibilityTier } from "@/components/profile/profile-mock"

/* ═══════════════════════════════════════════════════════════
   CategoryAlignment — podcast category fit cards grid.
   ═══════════════════════════════════════════════════════════ */

const VIS_CONFIG: Record<VisibilityTier, { label: string; color: string; bg: string; border: string }> = {
  "very-high": { label: "Very High Visibility", color: "text-[var(--premium-gold)]",  bg: "bg-[oklch(0.78_0.15_83/0.10)]",      border: "border-[oklch(0.78_0.15_83/0.28)]"      },
  "high":      { label: "High Visibility",      color: "text-primary",               bg: "bg-primary/8",                        border: "border-primary/25"                      },
  "medium":    { label: "Medium Visibility",    color: "text-[var(--premium-cyan)]", bg: "bg-[oklch(0.70_0.16_200/0.08)]",      border: "border-[oklch(0.70_0.16_200/0.25)]"     },
  "growing":   { label: "Growing Visibility",   color: "text-[oklch(0.70_0.16_145)]",bg: "bg-[oklch(0.55_0.16_145/0.08)]",     border: "border-[oklch(0.55_0.16_145/0.25)]"     },
}

function AlignmentBar({ value, delay }: { value: number; delay: number }) {
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref as React.RefObject<Element>, { once: true })

  const color =
    value >= 90 ? "from-[oklch(0.55_0.22_264)] to-primary"
    : value >= 80 ? "from-primary/70 to-primary"
    : value >= 70 ? "from-[oklch(0.60_0.18_200)] to-[var(--premium-cyan)]"
    : "from-[oklch(0.55_0.16_145/0.8)] to-[oklch(0.65_0.15_145)]"

  return (
    <div
      ref={ref}
      className="h-1.5 w-full overflow-hidden rounded-full bg-muted/35"
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`${value}% alignment`}
    >
      <motion.div
        className={cn("h-full rounded-full bg-gradient-to-r", color)}
        initial={{ width: 0 }}
        animate={{ width: inView ? `${value}%` : 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay }}
      />
    </div>
  )
}

function CategoryCard({ cat, index }: { cat: CategoryAlignment; index: number }) {
  const vis = VIS_CONFIG[cat.visibility]

  const scoreColor =
    cat.alignment >= 90 ? "text-primary"
    : cat.alignment >= 80 ? "text-[var(--premium-cyan)]"
    : "text-[oklch(0.70_0.16_145)]"

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.06 + index * 0.07 }}
      className={cn(
        "group relative flex flex-col gap-3 overflow-hidden",
        "rounded-[var(--radius-xl)] border border-border/60 p-4",
        "bg-card/70 backdrop-blur-sm shadow-[var(--shadow-card)]",
        "hover:shadow-[var(--shadow-card-hover)] hover:border-border/80",
        "transition-all duration-300"
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px
                   bg-gradient-to-r from-transparent via-primary/15 to-transparent
                   opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      />

      {/* Header: emoji + name + badges */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <span className="text-xl leading-none" aria-hidden="true">{cat.emoji}</span>
          <span className="text-[13px] font-bold text-foreground">{cat.label}</span>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {cat.trending && (
            <span className="inline-flex items-center gap-1 rounded-full border border-[oklch(0.60_0.200_30/0.25)] bg-[oklch(0.60_0.200_30/0.10)] px-1.5 py-0.5 text-[9px] font-bold text-[oklch(0.75_0.18_30)]">
              <TrendingUp className="size-2.5" aria-hidden="true" />
              Trending
            </span>
          )}
          {cat.aiRecommended && (
            <span className="inline-flex items-center gap-1 rounded-full border border-primary/25 bg-primary/8 px-1.5 py-0.5 text-[9px] font-bold text-primary">
              <Sparkles className="size-2.5" aria-hidden="true" />
              AI Pick
            </span>
          )}
        </div>
      </div>

      {/* Alignment score + bar */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-muted-foreground">Alignment</span>
          <span className={cn("text-sm font-bold tabular-nums", scoreColor)}>{cat.alignment}%</span>
        </div>
        <AlignmentBar value={cat.alignment} delay={0.12 + index * 0.06} />
      </div>

      {/* Visibility tier */}
      <span className={cn(
        "self-start rounded-full border px-2 py-0.5 text-[9px] font-bold",
        vis.color, vis.bg, vis.border
      )}>
        {vis.label}
      </span>

      {/* Description */}
      <p className="text-[10px] text-muted-foreground leading-relaxed line-clamp-2">
        {cat.description}
      </p>

      {/* Podcast count */}
      <div className="flex items-center justify-between border-t border-border/30 pt-2">
        <span className="text-[10px] text-muted-foreground">{cat.podcastCount} matching podcasts</span>
        <button className="text-[10px] font-semibold text-primary hover:text-primary/80 transition-colors">
          Explore →
        </button>
      </div>
    </motion.div>
  )
}

export function CategoryAlignment() {
  return (
    <div
      className="flex flex-col gap-4"
      role="region"
      aria-label="Podcast category alignment"
    >
      <div className="flex items-center gap-2">
        <span className="text-sm font-bold text-foreground">Podcast Category Alignment</span>
        <span className="text-[11px] text-muted-foreground">— AI-scored fit across {MOCK_CATEGORIES.length} categories</span>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {MOCK_CATEGORIES.map((cat, i) => (
          <CategoryCard key={cat.id} cat={cat} index={i} />
        ))}
      </div>
    </div>
  )
}
