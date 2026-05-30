"use client"

import { motion } from "motion/react"
import { Sparkles, Edit2, Eye, Star, TrendingUp, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"
import { useProfile } from "@/components/profile/profile-context"
import { CREATOR_META } from "@/components/profile/profile-mock"

/* ═══════════════════════════════════════════════════════════
   ProfileHeader — cinematic creator hero card.
   ═══════════════════════════════════════════════════════════ */

/* ── Score arc (compact) ──────────────────────────────────── */
function ScoreArc({
  value,
  label,
  color,
  stroke,
}: {
  value:  number
  label:  string
  color:  string
  stroke: string
}) {
  const R    = 22
  const circ = 2 * Math.PI * R
  const dash = (value / 100) * circ

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative flex items-center justify-center" style={{ width: 56, height: 56 }}>
        <svg width="56" height="56" viewBox="0 0 56 56" aria-hidden="true" className="-rotate-90">
          <circle cx="28" cy="28" r={R} fill="none" strokeWidth="3.5" stroke="oklch(0.25 0 0 / 0.5)" />
          <motion.circle
            cx="28" cy="28" r={R}
            fill="none"
            strokeWidth="3.5"
            strokeLinecap="round"
            stroke={stroke}
            strokeDasharray={`${circ} ${circ}`}
            initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: circ - dash }}
            transition={{ duration: 1.0, ease: "easeOut", delay: 0.3 }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn("text-[13px] font-bold tabular-nums leading-none", color)}>{value}</span>
          <span className="text-[8px] text-muted-foreground/60 mt-0.5">/ 100</span>
        </div>
      </div>
      <span className="text-[10px] font-semibold text-muted-foreground text-center leading-tight">{label}</span>
    </div>
  )
}

/* ── Completeness bar ─────────────────────────────────────── */
function CompletionBar({ value }: { value: number }) {
  const color =
    value >= 80 ? "from-[oklch(0.65_0.15_145)] to-[oklch(0.70_0.16_145)]"
    : value >= 60 ? "from-primary to-[oklch(0.60_0.20_290)]"
    : "from-[oklch(0.65_0.18_30)] to-[var(--premium-gold)]"

  return (
    <div className="flex items-center gap-2 text-[10px]">
      <span className="text-muted-foreground shrink-0">Profile</span>
      <div className="flex-1 h-1 rounded-full bg-muted/40 overflow-hidden min-w-[80px]">
        <motion.div
          className={cn("h-full rounded-full bg-gradient-to-r", color)}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.9, ease: "easeOut", delay: 0.5 }}
        />
      </div>
      <span className="font-bold tabular-nums text-foreground shrink-0">{value}%</span>
    </div>
  )
}

/* ── Main header ──────────────────────────────────────────── */
export function ProfileHeader() {
  const { creator, isEditing, startEdit } = useProfile()
  const meta = CREATOR_META

  const initials = creator.name
    .split(" ")
    .slice(0, 2)
    .map(w => w[0])
    .join("")
    .toUpperCase()

  const categories = creator.topics.slice(0, 4)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "relative overflow-hidden rounded-[var(--radius-xl)] border border-border/60",
        "bg-card/70 backdrop-blur-sm shadow-[var(--shadow-card)]"
      )}
      role="banner"
    >
      {/* ── Gradient atmosphere ──────────────────────────── */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 60% 80% at 15% 50%, oklch(0.55 0.22 264 / 0.08) 0%, transparent 70%), radial-gradient(ellipse 40% 60% at 85% 30%, oklch(0.78 0.15 83 / 0.05) 0%, transparent 70%)",
        }}
      />
      {/* Top-edge glow */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent pointer-events-none"
      />
      {/* Subtle dot grid */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.015] pointer-events-none"
        style={{ backgroundImage: "radial-gradient(circle, oklch(0.9 0 0) 1px, transparent 1px)", backgroundSize: "24px 24px" }}
      />

      <div className="relative flex flex-col gap-6 p-6 md:p-8">

        {/* ── Top row ──────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-6 items-start">

          {/* Avatar */}
          <div className="relative flex-shrink-0">
            {/* Glow ring */}
            <div
              aria-hidden
              className="absolute -inset-2 rounded-full opacity-40"
              style={{ background: "radial-gradient(circle, oklch(0.55 0.22 264 / 0.4) 0%, transparent 70%)" }}
            />
            {/* Animated ring */}
            <motion.div
              aria-hidden
              className="absolute -inset-1 rounded-full border border-primary/30"
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
            {/* Avatar */}
            <div
              className="relative flex h-20 w-20 md:h-24 md:w-24 items-center justify-center rounded-full border-2 border-primary/40 text-2xl font-bold text-white"
              style={{ background: "linear-gradient(135deg, oklch(0.45 0.18 264) 0%, oklch(0.55 0.20 290) 100%)" }}
            >
              {initials}
            </div>
            {/* AI badge */}
            <div className={cn(
              "absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full",
              "border border-primary/40 bg-primary text-white shadow-md"
            )}>
              <Sparkles className="size-3" aria-hidden="true" />
            </div>
          </div>

          {/* Name + title + meta */}
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex flex-col gap-1">
                <h1 className="text-xl md:text-2xl font-bold text-foreground leading-tight">
                  {creator.name}
                </h1>
                <p className="text-sm text-muted-foreground font-medium">{creator.title}</p>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <span className="inline-flex items-center gap-1 rounded-full border border-primary/25 bg-primary/8 px-2 py-0.5 text-[10px] font-bold text-primary">
                    <Sparkles className="size-2.5" aria-hidden="true" />
                    {meta.creatorType}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
                    <Calendar className="size-3" aria-hidden="true" />
                    Member since {meta.memberSince}
                  </span>
                </div>
              </div>

              {/* Edit button */}
              {!isEditing && (
                <button
                  onClick={startEdit}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-[var(--radius-lg)] border px-3 py-1.5",
                    "text-xs font-semibold text-muted-foreground border-border/50",
                    "hover:text-foreground hover:border-border bg-card/50 backdrop-blur-sm",
                    "transition-colors duration-200 shrink-0"
                  )}
                >
                  <Edit2 className="size-3.5" aria-hidden="true" />
                  Edit Profile
                </button>
              )}
            </div>

            {/* Scores + profile completion */}
            <div className="mt-4 flex flex-wrap items-center gap-6">
              <ScoreArc
                value={meta.visibilityScore}
                label="Visibility Score"
                color="text-primary"
                stroke="oklch(0.65 0.22 264)"
              />
              <ScoreArc
                value={meta.aiAlignmentScore}
                label="AI Alignment"
                color="text-[var(--premium-gold)]"
                stroke="oklch(0.78 0.15 83)"
              />
              <div className="flex-1 min-w-[160px] flex flex-col gap-2">
                <CompletionBar value={meta.profileComplete} />
                <div className="flex flex-wrap gap-2">
                  {[
                    { icon: Eye,        label: meta.totalPodcastFits + " podcast fits",  color: "text-[var(--premium-cyan)]"      },
                    { icon: TrendingUp, label: meta.creatorMomentum + " momentum",       color: "text-[oklch(0.70_0.16_145)]"     },
                    { icon: Star,       label: meta.topNiche + " authority",             color: "text-[var(--premium-gold)]"      },
                  ].map(stat => (
                    <span key={stat.label} className={cn("flex items-center gap-1 text-[10px] font-semibold", stat.color)}>
                      <stat.icon className="size-3 shrink-0" aria-hidden="true" />
                      {stat.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Category tags ─────────────────────────────── */}
        <div className="flex flex-wrap gap-2" role="list" aria-label="Creator categories">
          {categories.map(tag => (
            <span
              key={tag}
              role="listitem"
              className="rounded-full border border-border/50 bg-muted/30 px-2.5 py-1 text-[11px] font-semibold text-foreground/80"
            >
              {tag}
            </span>
          ))}
          {creator.topics.length > 4 && (
            <span className="rounded-full border border-border/40 bg-muted/20 px-2.5 py-1 text-[11px] text-muted-foreground">
              +{creator.topics.length - 4} more
            </span>
          )}
        </div>

        {/* ── AI scan indicator ─────────────────────────── */}
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
          <div className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" aria-hidden="true" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
          </div>
          AI profile scan completed {meta.lastAIScan} — {meta.totalPodcastFits} matching podcasts identified
        </div>

      </div>
    </motion.div>
  )
}
