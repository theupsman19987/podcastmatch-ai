"use client"

import * as React from "react"
import Link from "next/link"
import { motion } from "motion/react"
import {
  Mic2, ExternalLink, Trash2, Send,
  Users, TrendingUp, Activity,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useSaved } from "@/components/saved/saved-context"
import {
  TrackingBadge,
  AlertBadge,
  SavedOpportunityBadge,
} from "@/components/saved/watchlist-badges"
import { type SavedOpportunity } from "@/components/saved/saved-mock"

/* ═══════════════════════════════════════════════════════════
   SavedCard — one entry in the saved pipeline grid.
   ═══════════════════════════════════════════════════════════ */

/* Shared gradient covers — mirrors COVER_GRADIENTS in discovery */
const COVER_GRADIENTS = [
  "linear-gradient(135deg, oklch(0.45 0.18 264) 0%, oklch(0.55 0.20 290) 100%)",
  "linear-gradient(135deg, oklch(0.40 0.16 200) 0%, oklch(0.50 0.18 230) 100%)",
  "linear-gradient(135deg, oklch(0.50 0.18 30)  0%, oklch(0.55 0.20 60)  100%)",
  "linear-gradient(135deg, oklch(0.40 0.15 145) 0%, oklch(0.50 0.18 170) 100%)",
  "linear-gradient(135deg, oklch(0.45 0.20 310) 0%, oklch(0.50 0.18 340) 100%)",
  "linear-gradient(135deg, oklch(0.45 0.18 83)  0%, oklch(0.55 0.20 60)  100%)",
]

const ACTIVITY_LABEL: Record<SavedOpportunity["hostActivity"], string> = {
  weekly:    "Weekly",
  biweekly:  "Bi-weekly",
  monthly:   "Monthly",
}
const ACTIVITY_DOT: Record<SavedOpportunity["hostActivity"], string> = {
  weekly:   "bg-[oklch(0.60_0.18_145)]",
  biweekly: "bg-[var(--premium-cyan)]",
  monthly:  "bg-muted-foreground",
}

const VIS_LABEL: Record<SavedOpportunity["visibilityPotential"], string> = {
  "very-high": "Very High",
  "high":      "High",
  "medium":    "Medium",
  "growing":   "Growing",
}
const VIS_COLOR: Record<SavedOpportunity["visibilityPotential"], string> = {
  "very-high": "text-[var(--premium-gold)]",
  "high":      "text-primary",
  "medium":    "text-[var(--premium-cyan)]",
  "growing":   "text-[oklch(0.70_0.16_145)]",
}

/* ── Alignment bar ────────────────────────────────────────── */
function AlignmentBar({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className="h-1 flex-1 rounded-full bg-muted/40 overflow-hidden"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${value}% audience alignment`}
      >
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-primary/60 to-primary"
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
        />
      </div>
      <span className="text-[10px] tabular-nums font-semibold text-primary/80">
        {value}%
      </span>
    </div>
  )
}

/* ── Score ring ───────────────────────────────────────────── */
function ScoreRing({ score }: { score: number }) {
  const color =
    score >= 90 ? "text-[var(--premium-gold)]   stroke-[oklch(0.78_0.15_83)]"
    : score >= 80 ? "text-primary                 stroke-primary"
    :               "text-[var(--premium-cyan)]   stroke-[oklch(0.70_0.16_200)]"

  const R  = 20
  const circ = 2 * Math.PI * R
  const dash = (score / 100) * circ

  return (
    <div className="relative flex items-center justify-center" style={{ width: 52, height: 52 }}>
      <svg width="52" height="52" viewBox="0 0 52 52" fill="none" aria-hidden="true"
        className="-rotate-90">
        <circle cx="26" cy="26" r={R} strokeWidth="3" className="stroke-muted/30" />
        <motion.circle
          cx="26" cy="26" r={R}
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
          className={color.split(" ")[1]}
          strokeDasharray={`${circ} ${circ}`}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: circ - dash }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.15 }}
        />
      </svg>
      <span className={cn("absolute text-[13px] font-bold tabular-nums", color.split(" ")[0])}>
        {score}
      </span>
    </div>
  )
}

/* ── Card ─────────────────────────────────────────────────── */
export function SavedCard({
  opportunity,
  index,
}: {
  opportunity: SavedOpportunity
  index: number
}) {
  const { removeSaved } = useSaved()
  const [removing, setRemoving] = React.useState(false)

  const gradient = COVER_GRADIENTS[opportunity.coverIndex % COVER_GRADIENTS.length]
  const initials = opportunity.name
    .split(" ")
    .slice(0, 2)
    .map(w => w[0])
    .join("")
    .toUpperCase()

  function handleRemove() {
    setRemoving(true)
    setTimeout(() => removeSaved(opportunity.id), 300)
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: removing ? 0 : 1, y: removing ? -8 : 0, scale: removing ? 0.96 : 1 }}
      transition={{ duration: 0.3, delay: removing ? 0 : index * 0.05 }}
      className={cn(
        "group relative flex flex-col gap-4 overflow-hidden",
        "rounded-[var(--radius-xl)] border border-border/60",
        "bg-card/60 backdrop-blur-sm p-4",
        "shadow-[var(--shadow-card)]",
        "transition-shadow duration-300 hover:shadow-[var(--shadow-card-hover)]",
        "hover:border-border/80"
      )}
    >
      {/* Top-edge glow on hover */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px
                   bg-gradient-to-r from-transparent via-primary/20 to-transparent
                   opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />

      {/* ── Row 1: Cover + meta + score ─────────────────────── */}
      <div className="flex items-start gap-3">

        {/* Cover art */}
        <div
          className="relative h-14 w-14 shrink-0 rounded-[var(--radius-lg)] overflow-hidden"
          style={{ background: gradient }}
          aria-hidden="true"
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <Mic2 className="size-4 text-white/30" />
          </div>
          <div
            className="absolute inset-0 flex items-center justify-center
                       text-xs font-bold text-white/90 tracking-wide"
          >
            {initials}
          </div>
        </div>

        {/* Name + host + tracking badge */}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <Link
                href={`/dashboard/discover/${opportunity.id}`}
                className="block truncate text-sm font-bold text-foreground
                           hover:text-primary transition-colors leading-snug"
              >
                {opportunity.name}
              </Link>
              <p className="text-[11px] text-muted-foreground mt-0.5 truncate">
                by {opportunity.host}
              </p>
            </div>
            <TrackingBadge status={opportunity.trackingStatus} size="xs" className="shrink-0 mt-0.5" />
          </div>

          {/* Categories */}
          <div className="mt-1.5 flex flex-wrap gap-1">
            {opportunity.categories.slice(0, 2).map(cat => (
              <span
                key={cat}
                className="rounded-full bg-muted/40 px-2 py-0.5 text-[9px] font-medium text-muted-foreground"
              >
                {cat}
              </span>
            ))}
          </div>
        </div>

        {/* Match score ring */}
        <div className="shrink-0">
          <ScoreRing score={opportunity.matchScore} />
        </div>
      </div>

      {/* ── Row 2: Badges ───────────────────────────────────── */}
      {opportunity.badges.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {opportunity.badges.map(b => (
            <SavedOpportunityBadge key={b} badge={b} />
          ))}
        </div>
      )}

      {/* ── Row 3: Metrics ──────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-2 text-center">
        {/* Audience size */}
        <div className="flex flex-col gap-0.5 rounded-[var(--radius-md)] bg-muted/20 px-2 py-1.5">
          <div className="flex items-center justify-center gap-1 text-[9px] text-muted-foreground">
            <Users className="size-2.5" aria-hidden="true" />
            Audience
          </div>
          <span className="text-xs font-bold tabular-nums text-foreground">
            {opportunity.audienceSize}K
          </span>
        </div>

        {/* Growth */}
        <div className="flex flex-col gap-0.5 rounded-[var(--radius-md)] bg-muted/20 px-2 py-1.5">
          <div className="flex items-center justify-center gap-1 text-[9px] text-muted-foreground">
            <TrendingUp className="size-2.5" aria-hidden="true" />
            Growth
          </div>
          <span className={cn(
            "text-xs font-bold tabular-nums",
            opportunity.audienceGrowth > 0 ? "text-[oklch(0.70_0.16_145)]" : "text-muted-foreground"
          )}>
            +{opportunity.audienceGrowth}%
          </span>
        </div>

        {/* Visibility */}
        <div className="flex flex-col gap-0.5 rounded-[var(--radius-md)] bg-muted/20 px-2 py-1.5">
          <div className="flex items-center justify-center gap-1 text-[9px] text-muted-foreground">
            <Activity className="size-2.5" aria-hidden="true" />
            Visibility
          </div>
          <span className={cn("text-xs font-bold", VIS_COLOR[opportunity.visibilityPotential])}>
            {VIS_LABEL[opportunity.visibilityPotential]}
          </span>
        </div>
      </div>

      {/* ── Row 4: Audience alignment bar ───────────────────── */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between text-[10px] text-muted-foreground">
          <span>Audience alignment</span>
          <span className="flex items-center gap-1">
            <span
              className={cn("inline-block h-1.5 w-1.5 rounded-full", ACTIVITY_DOT[opportunity.hostActivity])}
              aria-hidden="true"
            />
            {ACTIVITY_LABEL[opportunity.hostActivity]}
          </span>
        </div>
        <AlignmentBar value={opportunity.audienceAlignment} />
      </div>

      {/* ── Row 5: Alert signals ────────────────────────────── */}
      {opportunity.alerts.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {opportunity.alerts.map(sig => (
            <AlertBadge key={sig} signal={sig} />
          ))}
        </div>
      )}

      {/* ── Row 6: Footer (last activity + actions) ─────────── */}
      <div className="flex items-center justify-between gap-2 border-t border-border/30 pt-3">
        <span className="text-[10px] text-muted-foreground truncate">
          {opportunity.lastActivity}
        </span>

        <div className="flex items-center gap-1.5 shrink-0">
          {/* View profile */}
          <Link
            href={`/dashboard/discover/${opportunity.id}`}
            className={cn(
              "inline-flex items-center gap-1 rounded-[var(--radius-md)] border px-2 py-1",
              "text-[10px] font-semibold text-muted-foreground border-border/50",
              "hover:text-foreground hover:border-border transition-colors"
            )}
          >
            <ExternalLink className="size-3" aria-hidden="true" />
            View
          </Link>

          {/* Outreach */}
          <button
            className={cn(
              "inline-flex items-center gap-1 rounded-[var(--radius-md)] border px-2 py-1",
              "text-[10px] font-semibold border-primary/30 bg-primary/8 text-primary",
              "hover:bg-primary/15 hover:border-primary/50 transition-colors"
            )}
          >
            <Send className="size-3" aria-hidden="true" />
            Pitch
          </button>

          {/* Remove */}
          <button
            onClick={handleRemove}
            aria-label="Remove from saved"
            className={cn(
              "inline-flex items-center justify-center rounded-[var(--radius-md)]",
              "h-6 w-6 text-muted-foreground/50 border border-transparent",
              "hover:text-destructive hover:border-destructive/30 hover:bg-destructive/8",
              "transition-colors"
            )}
          >
            <Trash2 className="size-3" aria-hidden="true" />
          </button>
        </div>
      </div>
    </motion.article>
  )
}
