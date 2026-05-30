import * as React from "react"
import { cn } from "@/lib/utils"
import { Users, TrendingUp, Activity, Zap, Eye } from "lucide-react"
import { AiScoreBadge } from "@/components/ui/ai-score-badge"

/* ═══════════════════════════════════════════════════════════
   FeaturedPodcastCard — cinematic showcase card for
   high-visibility podcast opportunities.

   Used in: featured podcasts section, dashboard opportunity
            feed, search results grid, recommendation panels.

   Connect to real data: swap the static FEATURED_PODCASTS[]
   array in the parent section with an API response mapped
   to FeaturedPodcastData. All display logic is props-driven.
   ═══════════════════════════════════════════════════════════ */

export type OpportunityBadgeType =
  | "Trending"
  | "High Engagement"
  | "Fast Growing"
  | "High Visibility"

export type CoverStyle =
  | "blue-electric"
  | "cyan-teal"
  | "gold-amber"
  | "purple-royal"
  | "rose-crimson"
  | "green-forest"
  | "indigo-deep"
  | "orange-fire"

/* ── Cover gradients & icon tint ────────────────────────── */
const COVER: Record<CoverStyle, { gradient: string; iconColor: string }> = {
  "blue-electric": {
    gradient:  "linear-gradient(135deg, oklch(0.42 0.22 255), oklch(0.24 0.18 255))",
    iconColor: "oklch(0.82 0.15 255 / 0.22)",
  },
  "cyan-teal": {
    gradient:  "linear-gradient(135deg, oklch(0.42 0.16 200), oklch(0.27 0.12 195))",
    iconColor: "oklch(0.88 0.12 200 / 0.22)",
  },
  "gold-amber": {
    gradient:  "linear-gradient(135deg, oklch(0.52 0.16 75), oklch(0.34 0.12 68))",
    iconColor: "oklch(0.90 0.12 78 / 0.22)",
  },
  "purple-royal": {
    gradient:  "linear-gradient(135deg, oklch(0.42 0.20 280), oklch(0.27 0.16 270))",
    iconColor: "oklch(0.86 0.14 280 / 0.22)",
  },
  "rose-crimson": {
    gradient:  "linear-gradient(135deg, oklch(0.48 0.20 18), oklch(0.31 0.15 8))",
    iconColor: "oklch(0.88 0.14 14 / 0.22)",
  },
  "green-forest": {
    gradient:  "linear-gradient(135deg, oklch(0.42 0.16 145), oklch(0.27 0.12 140))",
    iconColor: "oklch(0.86 0.12 145 / 0.22)",
  },
  "indigo-deep": {
    gradient:  "linear-gradient(135deg, oklch(0.38 0.20 265), oklch(0.24 0.16 260))",
    iconColor: "oklch(0.82 0.14 265 / 0.22)",
  },
  "orange-fire": {
    gradient:  "linear-gradient(135deg, oklch(0.52 0.18 52), oklch(0.35 0.14 43))",
    iconColor: "oklch(0.90 0.14 48 / 0.22)",
  },
}

/* ── Cover-matched hover accent ─────────────────────────── */
const HOVER: Record<CoverStyle, { border: string; glow: string }> = {
  "blue-electric": {
    border: "hover:border-primary/40",
    glow:   "hover:shadow-[var(--shadow-lg),var(--glow-primary)]",
  },
  "cyan-teal": {
    border: "hover:border-[oklch(0.70_0.16_200/0.40)]",
    glow:   "hover:shadow-[var(--shadow-lg),var(--glow-cyan)]",
  },
  "gold-amber": {
    border: "hover:border-[oklch(0.78_0.15_83/0.40)]",
    glow:   "hover:shadow-[var(--shadow-lg),var(--glow-gold)]",
  },
  "purple-royal": {
    border: "hover:border-[oklch(0.60_0.20_280/0.40)]",
    glow:   "hover:shadow-[var(--shadow-lg),0_0_32px_oklch(0.42_0.20_280/0.28)]",
  },
  "rose-crimson": {
    border: "hover:border-[oklch(0.58_0.20_18/0.40)]",
    glow:   "hover:shadow-[var(--shadow-lg),0_0_32px_oklch(0.48_0.20_18/0.28)]",
  },
  "green-forest": {
    border: "hover:border-[oklch(0.55_0.16_145/0.40)]",
    glow:   "hover:shadow-[var(--shadow-lg),0_0_32px_oklch(0.42_0.16_145/0.28)]",
  },
  "indigo-deep": {
    border: "hover:border-[oklch(0.55_0.20_265/0.40)]",
    glow:   "hover:shadow-[var(--shadow-lg),0_0_32px_oklch(0.38_0.20_265/0.28)]",
  },
  "orange-fire": {
    border: "hover:border-[oklch(0.65_0.18_52/0.40)]",
    glow:   "hover:shadow-[var(--shadow-lg),0_0_32px_oklch(0.52_0.18_52/0.28)]",
  },
}

/* ── Opportunity badge styles ───────────────────────────── */
const BADGE_STYLE: Record<
  OpportunityBadgeType,
  { bg: string; text: string; border: string; icon: React.ElementType }
> = {
  "Trending": {
    bg:     "bg-[oklch(0.78_0.15_83/0.15)]",
    text:   "text-[var(--premium-gold)]",
    border: "border-[oklch(0.78_0.15_83/0.30)]",
    icon:   TrendingUp,
  },
  "High Engagement": {
    bg:     "bg-[oklch(0.70_0.16_200/0.15)]",
    text:   "text-[var(--premium-cyan)]",
    border: "border-[oklch(0.70_0.16_200/0.30)]",
    icon:   Activity,
  },
  "Fast Growing": {
    bg:     "bg-[oklch(0.55_0.16_145/0.15)]",
    text:   "text-[oklch(0.70_0.16_145)]",
    border: "border-[oklch(0.55_0.16_145/0.30)]",
    icon:   Zap,
  },
  "High Visibility": {
    bg:     "bg-primary/12",
    text:   "text-primary",
    border: "border-primary/28",
    icon:   Eye,
  },
}

const ACTIVITY_DOT: Record<"high" | "medium" | "low", string> = {
  high:   "bg-[oklch(0.65_0.15_145)]",
  medium: "bg-[oklch(0.75_0.14_83)]",
  low:    "bg-muted-foreground",
}

/* ── Types ──────────────────────────────────────────────── */
export interface FeaturedPodcastData {
  id:            string
  name:          string
  category:      string
  description:   string
  listenerCount: string
  matchScore:    number
  hostActivity:  string
  activityLevel: "high" | "medium" | "low"
  badge?:        OpportunityBadgeType
  coverStyle:    CoverStyle
  coverIcon:     React.ElementType
  tags:          string[]
}

/* ── Opportunity badge sub-component ────────────────────── */
function OpportunityBadge({ badge }: { badge: OpportunityBadgeType }) {
  const s = BADGE_STYLE[badge]
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5",
        "text-[10px] font-semibold backdrop-blur-sm",
        s.bg, s.text, s.border
      )}
    >
      <s.icon className="size-2.5" aria-hidden="true" />
      {badge}
    </div>
  )
}

/* ── Main card ───────────────────────────────────────────── */
export interface FeaturedPodcastCardProps {
  data:       FeaturedPodcastData
  className?: string
}

export function FeaturedPodcastCard({ data, className }: FeaturedPodcastCardProps) {
  const cover = COVER[data.coverStyle]
  const h     = HOVER[data.coverStyle]
  const dot   = ACTIVITY_DOT[data.activityLevel]

  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden",
        "rounded-[var(--radius-xl)] border border-border bg-card",
        "shadow-[var(--shadow-card)] transition-all duration-250",
        "hover:-translate-y-2",
        h.border,
        h.glow,
        className
      )}
    >
      {/* ── Cover area ─────────────────────────────────── */}
      <div
        className="relative h-36 overflow-hidden flex-shrink-0"
        style={{ background: cover.gradient }}
      >
        {/* Large background icon — tinted, scales on hover */}
        <div className="absolute inset-0 flex items-center justify-center">
          <data.coverIcon
            className="size-[72px] transition-transform duration-400 group-hover:scale-110"
            style={{ color: cover.iconColor }}
            aria-hidden="true"
          />
        </div>

        {/* Bottom vignette for text legibility */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, transparent 40%, oklch(0 0 0 / 0.50) 100%)",
          }}
          aria-hidden="true"
        />

        {/* Category label — bottom left */}
        <div className="absolute bottom-2.5 left-3">
          <span className="rounded-md bg-black/40 px-2 py-0.5 text-[10px] font-semibold text-white/90 backdrop-blur-sm">
            {data.category}
          </span>
        </div>

        {/* Opportunity badge — top right */}
        {data.badge && (
          <div className="absolute top-2.5 right-2.5">
            <OpportunityBadge badge={data.badge} />
          </div>
        )}
      </div>

      {/* ── Content ────────────────────────────────────── */}
      <div className="flex flex-1 flex-col gap-2.5 p-4">
        {/* Name */}
        <h3
          className="text-[15px] font-bold text-foreground leading-snug
                     group-hover:text-primary transition-colors duration-200"
        >
          {data.name}
        </h3>

        {/* Listener count */}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Users className="size-3 flex-shrink-0" aria-hidden="true" />
          <span>{data.listenerCount} listeners</span>
        </div>

        {/* Score + host activity */}
        <div className="flex items-center justify-between">
          <AiScoreBadge score={data.matchScore} size="sm" />
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className={cn("h-1.5 w-1.5 flex-shrink-0 rounded-full", dot)} aria-hidden="true" />
            <span>{data.hostActivity}</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {data.tags.slice(0, 2).map(tag => (
            <span
              key={tag}
              className="rounded-md border border-border bg-muted/30 px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Top-edge highlight */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px
                   bg-gradient-to-r from-transparent via-white/12 to-transparent"
      />
    </article>
  )
}
