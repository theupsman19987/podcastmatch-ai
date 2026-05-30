"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import {
  Bookmark, BookmarkCheck, Zap, Eye, Bell, ArrowRight,
  Sparkles, TrendingUp, Target, ShieldCheck,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { type DiscoveryPodcast } from "@/components/discovery/mock-data"

/* ═══════════════════════════════════════════════════════════
   ProfileActions — sticky sidebar with CTAs and AI insights.
   Desktop: fixed right column.
   Mobile: pinned bottom bar + floating modal for insight pills.
   ═══════════════════════════════════════════════════════════ */

const FLOATING_INSIGHTS = [
  {
    icon:    TrendingUp,
    title:   "High Visibility Opportunity",
    body:    "This podcast reaches your exact target audience",
    accent:  "text-[var(--premium-gold)]",
    border:  "border-[oklch(0.78_0.15_83/0.25)]",
    bg:      "bg-[oklch(0.78_0.15_83/0.06)]",
  },
  {
    icon:    Target,
    title:   "Trending Audience Category",
    body:    "Entrepreneurship content is up 41% this month",
    accent:  "text-[var(--premium-cyan)]",
    border:  "border-[oklch(0.70_0.16_200/0.25)]",
    bg:      "bg-[oklch(0.70_0.16_200/0.06)]",
  },
  {
    icon:    ShieldCheck,
    title:   "Strong Engagement Signals",
    body:    "Episodes average 82% listen-through rate",
    accent:  "text-primary",
    border:  "border-primary/22",
    bg:      "bg-primary/05",
  },
]

interface ProfileActionsProps {
  podcast:    DiscoveryPodcast
  onSave?:    (id: string) => void
  className?: string
}

export function ProfileActions({ podcast, onSave, className }: ProfileActionsProps) {
  const [saved,         setSaved]         = useState(podcast.saved)
  const [outreachHover, setOutreachHover] = useState(false)
  const [tracked,       setTracked]       = useState(false)

  function handleSave() {
    setSaved(p => !p)
    onSave?.(podcast.id)
  }

  return (
    <aside className={cn("flex flex-col gap-4", className)} aria-label="Podcast opportunity actions">

      {/* ── Primary actions card ─────────────────────── */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.25, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="rounded-[var(--radius-xl)] border border-border bg-card p-5 shadow-[var(--shadow-card)]"
      >
        {/* Top-edge highlight */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-t-[var(--radius-xl)]
                     bg-gradient-to-r from-transparent via-primary/20 to-transparent"
        />

        {/* Score pill */}
        <div className="mb-4 flex items-center justify-between">
          <span className="text-[11px] font-semibold text-muted-foreground">Your Match</span>
          <span className={cn(
            "rounded-full border px-2.5 py-0.5 text-sm font-black tabular-nums",
            podcast.matchScore >= 90
              ? "border-[oklch(0.78_0.15_83/0.35)] bg-[oklch(0.78_0.15_83/0.12)] gradient-text-gold"
              : "border-primary/35 bg-primary/10 gradient-text-primary"
          )}>
            {podcast.matchScore}%
          </span>
        </div>

        {/* CTA buttons */}
        <div className="flex flex-col gap-2.5">

          {/* Start Outreach — primary */}
          <button
            onMouseEnter={() => setOutreachHover(true)}
            onMouseLeave={() => setOutreachHover(false)}
            aria-label={`Start outreach to ${podcast.name}`}
            className="group relative w-full overflow-hidden rounded-[var(--radius-lg)]
                       gradient-primary py-3 text-sm font-semibold text-white
                       shadow-[var(--shadow-btn-premium)]
                       transition-all duration-200 hover:-translate-y-0.5
                       hover:shadow-[var(--shadow-btn-premium),var(--glow-primary)]"
          >
            {/* Shimmer */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r
                         from-transparent via-white/10 to-transparent group-hover:animate-shimmer-sweep"
            />
            <span className="flex items-center justify-center gap-2">
              <Zap className="size-4" aria-hidden="true" />
              Start Outreach
              <motion.span animate={{ x: outreachHover ? 3 : 0 }} transition={{ duration: 0.15 }}>
                <ArrowRight className="size-4" aria-hidden="true" />
              </motion.span>
            </span>
          </button>

          {/* Save / Unsave */}
          <button
            onClick={handleSave}
            aria-label={saved ? "Remove from saved opportunities" : "Save this opportunity"}
            aria-pressed={saved}
            className={cn(
              "flex items-center justify-center gap-2 rounded-[var(--radius-lg)] border py-2.5 text-sm font-semibold",
              "transition-all duration-200 hover:-translate-y-0.5",
              saved
                ? "border-primary/30 bg-primary/10 text-primary hover:bg-primary/15"
                : "border-border bg-muted/30 text-muted-foreground hover:border-border/80 hover:text-foreground"
            )}
          >
            <AnimatePresence mode="wait">
              {saved ? (
                <motion.span
                  key="saved"
                  initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }}
                  className="flex items-center gap-2"
                >
                  <BookmarkCheck className="size-4" aria-hidden="true" /> Saved
                </motion.span>
              ) : (
                <motion.span
                  key="unsaved"
                  initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }}
                  className="flex items-center gap-2"
                >
                  <Bookmark className="size-4" aria-hidden="true" /> Save Opportunity
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          {/* Track */}
          <button
            onClick={() => setTracked(p => !p)}
            aria-pressed={tracked}
            aria-label={tracked ? "Untrack opportunity" : "Track this opportunity"}
            className={cn(
              "flex items-center justify-center gap-2 rounded-[var(--radius-lg)] border py-2.5 text-sm font-medium",
              "transition-all duration-150",
              tracked
                ? "border-[oklch(0.78_0.15_83/0.30)] bg-[oklch(0.78_0.15_83/0.10)] text-[var(--premium-gold)]"
                : "border-border bg-transparent text-muted-foreground hover:text-foreground hover:border-border/80"
            )}
          >
            <Bell className="size-4" aria-hidden="true" />
            {tracked ? "Tracking" : "Track Opportunity"}
          </button>

          {/* View Similar */}
          <button
            aria-label="View similar podcasts"
            className="flex items-center justify-center gap-2 rounded-[var(--radius-lg)] py-2 text-[12px]
                       font-medium text-primary transition-colors hover:text-primary/80"
          >
            <Eye className="size-3.5" aria-hidden="true" />
            View Similar Podcasts
          </button>
        </div>
      </motion.div>

      {/* ── Floating AI insights ─────────────────────── */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.35, duration: 0.4 }}
        className="flex flex-col gap-2.5"
        aria-label="AI opportunity insights"
      >
        <p className="px-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">
          AI Insights
        </p>
        {FLOATING_INSIGHTS.map((insight, i) => (
          <motion.div
            key={insight.title}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + i * 0.08 }}
            className={cn(
              "flex items-start gap-3 rounded-[var(--radius-lg)] border p-3",
              "transition-all duration-150 hover:-translate-y-0.5",
              insight.bg, insight.border
            )}
          >
            <insight.icon className={cn("mt-0.5 size-3.5 shrink-0", insight.accent)} aria-hidden="true" />
            <div className="flex flex-col gap-0.5">
              <span className={cn("text-[11px] font-semibold", insight.accent)}>{insight.title}</span>
              <span className="text-[10px] leading-relaxed text-muted-foreground">{insight.body}</span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* ── AI Confidence chip ───────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="flex items-center justify-center gap-1.5 rounded-[var(--radius-lg)] border border-border/40 bg-muted/20 py-2.5"
      >
        <Sparkles className="size-3 text-primary/60" aria-hidden="true" />
        <span className="text-[10px] text-muted-foreground">
          AI confidence: <span className="font-semibold text-foreground">High</span>
        </span>
      </motion.div>

    </aside>
  )
}

/* ── Mobile action bar — pinned at bottom on small screens ── */
export function MobileActionBar({ podcast }: { podcast: DiscoveryPodcast }) {
  const [saved, setSaved] = useState(podcast.saved)

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 flex items-center gap-2 border-t border-border/60
                    bg-card/90 px-4 py-3 backdrop-blur-[20px] lg:hidden">
      <button
        onClick={() => setSaved(p => !p)}
        aria-label={saved ? "Remove from saved" : "Save opportunity"}
        aria-pressed={saved}
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-lg)] border transition-colors",
          saved ? "border-primary/30 bg-primary/10 text-primary" : "border-border bg-muted/30 text-muted-foreground"
        )}
      >
        {saved ? <BookmarkCheck className="size-4" aria-hidden="true" /> : <Bookmark className="size-4" aria-hidden="true" />}
      </button>
      <button
        className="flex flex-1 items-center justify-center gap-2 rounded-[var(--radius-lg)]
                   gradient-primary py-2.5 text-sm font-semibold text-white
                   shadow-[var(--shadow-btn-premium)] transition-all hover:opacity-90"
        aria-label={`Start outreach to ${podcast.name}`}
      >
        <Zap className="size-4" aria-hidden="true" />
        Start Outreach
      </button>
    </div>
  )
}
