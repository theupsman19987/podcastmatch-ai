import * as React from "react"
import { cn } from "@/lib/utils"
import { Users, TrendingUp, CheckCircle2, ExternalLink } from "lucide-react"
import { AiScoreBadge } from "@/components/ui/ai-score-badge"

/* ═══════════════════════════════════════════════════════════
   PodcastResultCard — rich podcast match result card.
   Used in: search experience section, dashboard results,
            AI match reports, recommendation feeds.

   Connect to real data: swap static PODCASTS[] with API
   response — all display logic is driven by props.
   ═══════════════════════════════════════════════════════════ */

export interface PodcastData {
  id:            string
  name:          string
  category:      string
  listenerCount: string
  matchScore:    number
  hostActivity:  string
  activityLevel: "high" | "medium" | "low"
  tags:          string[]
  visibility:    "Very High" | "High" | "Rising" | "Growing"
  isRecommended: boolean
}

const ACTIVITY_DOT: Record<PodcastData["activityLevel"], string> = {
  high:   "bg-[oklch(0.65_0.15_145)]",
  medium: "bg-[oklch(0.75_0.14_83)]",
  low:    "bg-muted-foreground",
}

const VIS_STYLE: Record<
  PodcastData["visibility"],
  { bg: string; text: string; border: string }
> = {
  "Very High": {
    bg:     "bg-[oklch(0.78_0.15_83/0.10)]",
    text:   "text-[var(--premium-gold)]",
    border: "border-[oklch(0.78_0.15_83/0.25)]",
  },
  High: {
    bg:     "bg-primary/10",
    text:   "text-primary",
    border: "border-primary/25",
  },
  Rising: {
    bg:     "bg-[oklch(0.70_0.16_200/0.10)]",
    text:   "text-[var(--premium-cyan)]",
    border: "border-[oklch(0.70_0.16_200/0.25)]",
  },
  Growing: {
    bg:     "bg-[oklch(0.55_0.16_145/0.10)]",
    text:   "text-[oklch(0.70_0.16_145)]",
    border: "border-[oklch(0.55_0.16_145/0.25)]",
  },
}

export interface PodcastResultCardProps {
  data:       PodcastData
  className?: string
}

export function PodcastResultCard({ data, className }: PodcastResultCardProps) {
  const vis = VIS_STYLE[data.visibility]
  const dot = ACTIVITY_DOT[data.activityLevel]

  return (
    <article
      className={cn(
        "group relative flex flex-col gap-3 rounded-[var(--radius-xl)] p-5",
        "border border-border bg-card shadow-[var(--shadow-card)]",
        "transition-all duration-200 hover:-translate-y-0.5",
        "hover:border-primary/30 hover:shadow-[var(--shadow-md),var(--glow-subtle)]",
        className
      )}
    >
      {/* Category row + score badge */}
      <div className="flex items-start justify-between gap-2">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60 leading-none pt-0.5">
          {data.category}
        </span>
        <AiScoreBadge score={data.matchScore} size="sm" />
      </div>

      {/* Podcast name */}
      <div>
        <h3
          className="text-[15px] font-bold text-foreground leading-snug
                     group-hover:text-primary transition-colors duration-200"
        >
          {data.name}
        </h3>
        <div className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Users className="size-3 flex-shrink-0" aria-hidden="true" />
          <span>{data.listenerCount} listeners</span>
        </div>
      </div>

      {/* Host activity + visibility */}
      <div className="flex flex-wrap items-center gap-2.5">
        <div className="flex items-center gap-1.5">
          <span className={cn("h-1.5 w-1.5 flex-shrink-0 rounded-full", dot)} aria-hidden="true" />
          <span className="text-xs text-muted-foreground">{data.hostActivity}</span>
        </div>
        <div
          className={cn(
            "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold",
            vis.bg, vis.text, vis.border
          )}
        >
          <TrendingUp className="size-2.5" aria-hidden="true" />
          {data.visibility} Visibility
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5">
        {data.tags.slice(0, 3).map(tag => (
          <span
            key={tag}
            className="rounded-md border border-border bg-muted/30 px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-auto flex items-center justify-between pt-1">
        {data.isRecommended ? (
          <div className="inline-flex items-center gap-1 text-[10px] font-semibold text-primary">
            <CheckCircle2 className="size-3" aria-hidden="true" />
            AI Recommended
          </div>
        ) : (
          <div />
        )}
        {/* Connect to router.push(`/podcasts/${data.id}`) when backend is live */}
        <button
          type="button"
          className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground
                     hover:text-primary transition-colors duration-150"
          aria-label={`View opportunity for ${data.name}`}
        >
          View Opportunity
          <ExternalLink className="size-3" aria-hidden="true" />
        </button>
      </div>

      {/* Top-edge highlight */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-t-[var(--radius-xl)]
                   bg-gradient-to-r from-transparent via-white/8 to-transparent"
      />
    </article>
  )
}
