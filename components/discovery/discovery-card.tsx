"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "motion/react"
import { Bookmark, BookmarkCheck, ArrowRight, Users, Zap, TrendingUp, Sparkles, Flame, BarChart3 } from "lucide-react"
import { cn } from "@/lib/utils"
import { type DiscoveryPodcast, COVER_GRADIENTS } from "@/components/discovery/mock-data"
import { AiScoreBadge } from "@/components/ui/ai-score-badge"
import { OpportunityRankBadge } from "@/components/matching/opportunity-rank-badge"

/* ═══════════════════════════════════════════════════════════
   DiscoveryCard — rich podcast result card for the discovery engine.
   Visual only — connect onSave + onPitch to backend when ready.
   ═══════════════════════════════════════════════════════════ */

/* ── Badge config ─────────────────────────────────────────── */
const BADGE_CONFIG: Record<
  DiscoveryPodcast["badges"][number],
  { label: string; icon: React.ElementType; cls: string }
> = {
  "ai-recommended": {
    label: "AI Pick",
    icon: Sparkles,
    cls:  "bg-primary/15 text-primary border-primary/25",
  },
  "trending": {
    label: "Trending",
    icon: Flame,
    cls:  "bg-[oklch(0.60_0.200_30/0.15)] text-[oklch(0.75_0.18_30)] border-[oklch(0.60_0.200_30/0.25)]",
  },
  "high-engagement": {
    label: "High Engagement",
    icon: BarChart3,
    cls:  "bg-[oklch(0.78_0.15_83/0.12)] text-[var(--premium-gold)] border-[oklch(0.78_0.15_83/0.22)]",
  },
  "fast-growing": {
    label: "Fast Growing",
    icon: TrendingUp,
    cls:  "bg-[oklch(0.55_0.16_145/0.12)] text-[oklch(0.70_0.16_145)] border-[oklch(0.55_0.16_145/0.22)]",
  },
}

/* ── Activity indicator ───────────────────────────────────── */
const ACTIVITY_DOT: Record<DiscoveryPodcast["hostActivity"], string> = {
  weekly:   "bg-[oklch(0.65_0.15_145)]",
  biweekly: "bg-[oklch(0.75_0.14_83)]",
  monthly:  "bg-muted-foreground/60",
}
const ACTIVITY_LABEL: Record<DiscoveryPodcast["hostActivity"], string> = {
  weekly:   "Posts weekly",
  biweekly: "Bi-weekly",
  monthly:  "Monthly",
}

/* ── Active status indicator ──────────────────────────────── */
const STATUS_DOT: Record<string, string> = {
  active:   "bg-[oklch(0.65_0.15_145)]",
  hiatus:   "bg-[oklch(0.78_0.15_83)]",
  inactive: "bg-muted-foreground/40",
}
const STATUS_LABEL: Record<string, string> = {
  active:   "Active",
  hiatus:   "On Hiatus",
  inactive: "Inactive",
}

/* ── Visibility badge ─────────────────────────────────────── */
const VIS_STYLES: Record<DiscoveryPodcast["visibilityPotential"], { label: string; cls: string }> = {
  "very-high": { label: "Very High Visibility",  cls: "bg-[oklch(0.78_0.15_83/0.10)] text-[var(--premium-gold)] border-[oklch(0.78_0.15_83/0.25)]" },
  "high":      { label: "High Visibility",        cls: "bg-primary/10 text-primary border-primary/25" },
  "medium":    { label: "Good Visibility",        cls: "bg-[oklch(0.70_0.16_200/0.10)] text-[var(--premium-cyan)] border-[oklch(0.70_0.16_200/0.25)]" },
  "growing":   { label: "Growing",               cls: "bg-[oklch(0.55_0.16_145/0.10)] text-[oklch(0.70_0.16_145)] border-[oklch(0.55_0.16_145/0.25)]" },
}

interface DiscoveryCardProps {
  podcast:    DiscoveryPodcast
  onSave:     (id: string) => void
  index?:     number
  viewMode?:  "grid" | "list"
}

export function DiscoveryCard({ podcast, onSave, index = 0, viewMode = "grid" }: DiscoveryCardProps) {
  const [pitchHovered, setPitchHovered] = useState(false)
  const coverGradient = COVER_GRADIENTS[podcast.coverIndex % COVER_GRADIENTS.length]
  const vis = VIS_STYLES[podcast.visibilityPotential]
  const priorityBadges = podcast.badges.slice(0, 2)

  if (viewMode === "list") return <DiscoveryCardList podcast={podcast} onSave={onSave} index={index} />

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.05, 0.35), duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "group relative flex flex-col rounded-[var(--radius-xl)] overflow-hidden",
        "border border-border bg-card shadow-[var(--shadow-card)]",
        "transition-all duration-200 hover:-translate-y-1",
        "hover:border-primary/25 hover:shadow-[var(--shadow-lg),var(--glow-subtle)]"
      )}
    >
      {/* ── Cover ─────────────────────────────────────── */}
      <div
        className="relative h-36 w-full flex items-center justify-center overflow-hidden"
        style={podcast.artwork ? undefined : { background: coverGradient }}
        aria-hidden="true"
      >
        {/* Real artwork image */}
        {podcast.artwork ? (
          <img
            src={podcast.artwork}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <>
            {/* Texture overlay for gradient covers */}
            <div className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: "radial-gradient(circle, oklch(0.96 0 0 / 0.06) 1px, transparent 1px)",
                backgroundSize: "20px 20px",
              }}
            />
            {/* Podcast initials */}
            <span className="relative text-3xl font-black text-white/30 select-none tracking-tight">
              {podcast.name.split(" ").map(w => w[0]).join("").slice(0, 3)}
            </span>
          </>
        )}

        {/* Cover glow on hover */}
        <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />

        {/* Badges — top right */}
        {priorityBadges.length > 0 && (
          <div className="absolute right-2 top-2 flex flex-col gap-1.5">
            {priorityBadges.map(badge => {
              const b = BADGE_CONFIG[badge]
              return (
                <span key={badge} className={cn(
                  "flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold backdrop-blur-sm",
                  b.cls
                )}>
                  <b.icon className="size-2.5" aria-hidden="true" />
                  {b.label}
                </span>
              )
            })}
          </div>
        )}

        {/* Match score — bottom left */}
        <div className="absolute bottom-2 left-2">
          <AiScoreBadge score={podcast.matchScore} size="sm" />
        </div>
      </div>

      {/* ── Content ───────────────────────────────────── */}
      <div className="flex flex-1 flex-col gap-3 p-4">

        {/* Name + host */}
        <div>
          <Link
            href={`/dashboard/discover/${podcast.id}`}
            className="text-[14px] font-bold text-foreground leading-snug transition-colors group-hover:text-primary line-clamp-1 hover:underline underline-offset-2"
            tabIndex={0}
          >
            {podcast.name}
          </Link>
          <p className="mt-0.5 text-[11px] text-muted-foreground">Hosted by {podcast.host}</p>
        </div>

        {/* Description */}
        <p className="text-[11px] text-muted-foreground/80 leading-relaxed line-clamp-2">
          {podcast.description}
        </p>

        {/* Audience alignment bar */}
        <div>
          <div className="mb-1 flex items-center justify-between">
            <span className="text-[10px] text-muted-foreground/70">Audience Alignment</span>
            <span className="text-[10px] font-semibold text-foreground">{podcast.audienceAlignment}%</span>
          </div>
          <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
            <motion.div
              className="h-full rounded-full gradient-primary"
              initial={{ width: 0 }}
              animate={{ width: `${podcast.audienceAlignment}%` }}
              transition={{ delay: 0.2 + index * 0.04, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
        </div>

        {/* Meta row: activity + audience */}
        <div className="flex flex-wrap items-center gap-2.5 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className={cn("h-1.5 w-1.5 rounded-full", ACTIVITY_DOT[podcast.hostActivity])} aria-hidden="true" />
            {ACTIVITY_LABEL[podcast.hostActivity]}
          </span>
          {podcast.activityStatus && podcast.activityStatus !== "active" && (
            <span className="flex items-center gap-1">
              <span className={cn("h-1.5 w-1.5 rounded-full", STATUS_DOT[podcast.activityStatus])} aria-hidden="true" />
              {STATUS_LABEL[podcast.activityStatus]}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Users className="size-3" aria-hidden="true" />
            {podcast.audienceSize}K listeners
          </span>
          <span className={cn("flex items-center gap-1 rounded-full border px-1.5 py-0.5", vis.cls)}>
            <TrendingUp className="size-2.5" aria-hidden="true" />
            {vis.label}
          </span>
          {podcast.guestFriendlyScore !== undefined && (
            <span className="flex items-center gap-1 rounded-full border border-[oklch(0.55_0.16_145/0.25)] bg-[oklch(0.55_0.16_145/0.10)] px-1.5 py-0.5 text-[oklch(0.70_0.16_145)]">
              <Zap className="size-2.5" aria-hidden="true" />
              {podcast.guestFriendlyScore}% guest friendly
            </span>
          )}
        </div>

        {/* Category tags + opportunity rank */}
        <div className="flex flex-wrap items-center gap-1">
          <OpportunityRankBadge score={podcast.matchScore} size="xs" />
          {podcast.categories.slice(0, 2).map(cat => (
            <span
              key={cat}
              className="rounded-md border border-border/40 bg-muted/20 px-2 py-0.5 text-[10px] font-medium text-muted-foreground/80"
            >
              {cat}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="mt-auto flex items-center justify-between pt-1 border-t border-border/30">
          <button
            onClick={() => onSave(podcast.id)}
            aria-label={podcast.saved ? `Remove ${podcast.name} from saved` : `Save ${podcast.name}`}
            className={cn(
              "flex items-center gap-1.5 rounded-[var(--radius-md)] px-2.5 py-1.5",
              "text-[11px] font-medium transition-all duration-150",
              podcast.saved
                ? "text-primary bg-primary/10 hover:bg-primary/15"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            {podcast.saved
              ? <BookmarkCheck className="size-3.5" aria-hidden="true" />
              : <Bookmark className="size-3.5" aria-hidden="true" />
            }
            {podcast.saved ? "Saved" : "Save"}
          </button>

          <button
            onMouseEnter={() => setPitchHovered(true)}
            onMouseLeave={() => setPitchHovered(false)}
            aria-label={`Pitch to ${podcast.name}`}
            className="flex items-center gap-1.5 rounded-[var(--radius-md)] bg-primary/12 px-3 py-1.5
                       text-[11px] font-semibold text-primary
                       transition-all duration-150 hover:bg-primary hover:text-white"
          >
            <Zap className="size-3.5" aria-hidden="true" />
            Pitch
            <motion.span animate={{ x: pitchHovered ? 2 : 0 }} transition={{ duration: 0.15 }}>
              <ArrowRight className="size-3" aria-hidden="true" />
            </motion.span>
          </button>
        </div>
      </div>

      {/* Top-edge highlight */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px
                   bg-gradient-to-r from-transparent via-[oklch(0.96_0_0/0.09)] to-transparent"
      />
    </motion.article>
  )
}

/* ── List view variant ────────────────────────────────────── */
function DiscoveryCardList({ podcast, onSave, index = 0 }: Omit<DiscoveryCardProps, "viewMode">) {
  const coverGradient = COVER_GRADIENTS[podcast.coverIndex % COVER_GRADIENTS.length]
  const vis = VIS_STYLES[podcast.visibilityPotential]

  return (
    <motion.article
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: Math.min(index * 0.04, 0.3), duration: 0.35 }}
      className={cn(
        "group relative flex items-center gap-4 rounded-[var(--radius-xl)] p-4",
        "border border-border bg-card shadow-[var(--shadow-card)]",
        "transition-all duration-150 hover:border-primary/25 hover:bg-card/90"
      )}
    >
      {/* Cover */}
      <div
        className="relative h-14 w-14 shrink-0 rounded-[var(--radius-lg)] flex items-center justify-center overflow-hidden"
        style={{ background: coverGradient }}
        aria-hidden="true"
      >
        <span className="text-xs font-black text-white/40 select-none">
          {podcast.name.split(" ").map(w => w[0]).join("").slice(0, 2)}
        </span>
      </div>

      {/* Info */}
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="text-[13px] font-bold text-foreground transition-colors group-hover:text-primary line-clamp-1">
            {podcast.name}
          </h3>
          {podcast.badges.includes("ai-recommended") && (
            <span className="flex items-center gap-1 rounded-full border border-primary/25 bg-primary/12 px-1.5 py-0.5 text-[9px] font-semibold text-primary">
              <Sparkles className="size-2" aria-hidden="true" /> AI Pick
            </span>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2.5 text-[10px] text-muted-foreground">
          <span>{podcast.host}</span>
          <span className="flex items-center gap-1">
            <span className={cn("h-1.5 w-1.5 rounded-full", ACTIVITY_DOT[podcast.hostActivity])} aria-hidden="true" />
            {ACTIVITY_LABEL[podcast.hostActivity]}
          </span>
          <span className="flex items-center gap-1"><Users className="size-3" aria-hidden="true" />{podcast.audienceSize}K</span>
          <span className={cn("flex items-center gap-1 rounded-full border px-1.5 py-0.5", vis.cls)}>
            <TrendingUp className="size-2.5" aria-hidden="true" />{vis.label}
          </span>
        </div>
      </div>

      {/* Score + actions */}
      <div className="flex shrink-0 items-center gap-2">
        <AiScoreBadge score={podcast.matchScore} size="sm" />
        <button
          onClick={() => onSave(podcast.id)}
          aria-label={podcast.saved ? "Remove from saved" : "Save"}
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-lg transition-colors",
            podcast.saved
              ? "bg-primary/12 text-primary"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          {podcast.saved
            ? <BookmarkCheck className="size-3.5" aria-hidden="true" />
            : <Bookmark className="size-3.5" aria-hidden="true" />
          }
        </button>
        <button
          aria-label={`Pitch to ${podcast.name}`}
          className="flex h-8 items-center gap-1.5 rounded-lg bg-primary/12 px-2.5 text-[11px] font-semibold text-primary transition-all hover:bg-primary hover:text-white"
        >
          <Zap className="size-3" aria-hidden="true" /> Pitch
        </button>
      </div>
    </motion.article>
  )
}
