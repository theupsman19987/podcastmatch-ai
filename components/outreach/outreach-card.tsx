"use client"

import * as React from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "motion/react"
import {
  Mic2, ExternalLink, Send, ChevronRight,
  ChevronDown, Users, StickyNote, X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useOutreach }  from "@/components/outreach/outreach-context"
import { OutreachBadge, InsightBadge, StageBadge } from "@/components/outreach/outreach-badges"
import {
  type OutreachEntry,
  type OutreachStage,
  STAGE_ORDER,
  STAGE_CONFIG,
} from "@/components/outreach/outreach-mock"

/* ═══════════════════════════════════════════════════════════
   OutreachCard — Kanban card for one pipeline entry.
   ═══════════════════════════════════════════════════════════ */

const COVER_GRADIENTS = [
  "linear-gradient(135deg, oklch(0.45 0.18 264) 0%, oklch(0.55 0.20 290) 100%)",
  "linear-gradient(135deg, oklch(0.40 0.16 200) 0%, oklch(0.50 0.18 230) 100%)",
  "linear-gradient(135deg, oklch(0.50 0.18 30)  0%, oklch(0.55 0.20 60)  100%)",
  "linear-gradient(135deg, oklch(0.40 0.15 145) 0%, oklch(0.50 0.18 170) 100%)",
  "linear-gradient(135deg, oklch(0.45 0.20 310) 0%, oklch(0.50 0.18 340) 100%)",
  "linear-gradient(135deg, oklch(0.45 0.18 83)  0%, oklch(0.55 0.20 60)  100%)",
]

/* ── Response probability bar ─────────────────────────────── */
function ResponseBar({ value }: { value: number }) {
  const color =
    value >= 80 ? "from-[oklch(0.55_0.16_145)] to-[oklch(0.65_0.15_145)]"
    : value >= 60 ? "from-[oklch(0.60_0.18_200)] to-[var(--premium-cyan)]"
    : value >= 40 ? "from-[oklch(0.68_0.15_60)] to-[var(--premium-gold)]"
    : "from-muted-foreground/40 to-muted-foreground/60"

  const textColor =
    value >= 80 ? "text-[oklch(0.70_0.16_145)]"
    : value >= 60 ? "text-[var(--premium-cyan)]"
    : value >= 40 ? "text-[var(--premium-gold)]"
    : "text-muted-foreground"

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between text-[10px]">
        <span className="text-muted-foreground">Response probability</span>
        <span className={cn("font-bold tabular-nums", textColor)}>{value}%</span>
      </div>
      <div
        className="h-1 w-full rounded-full bg-muted/40 overflow-hidden"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <motion.div
          className={cn("h-full rounded-full bg-gradient-to-r", color)}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
        />
      </div>
    </div>
  )
}

/* ── Move stage popover ───────────────────────────────────── */
function MoveStageMenu({
  currentStage,
  onMove,
  onClose,
}: {
  currentStage: OutreachStage
  onMove:       (stage: OutreachStage) => void
  onClose:      () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -4, scale: 0.97 }}
      animate={{ opacity: 1, y: 0,  scale: 1 }}
      exit={{   opacity: 0, y: -4, scale: 0.97 }}
      transition={{ duration: 0.14 }}
      className={cn(
        "absolute bottom-full right-0 z-50 mb-1 min-w-[200px]",
        "rounded-[var(--radius-lg)] border border-border/70",
        "bg-card/98 backdrop-blur-md shadow-[var(--shadow-card)] py-1"
      )}
      role="menu"
    >
      <p className="px-3 py-1.5 text-[9px] font-semibold uppercase tracking-widest text-muted-foreground">
        Move to stage
      </p>
      {STAGE_ORDER.map(stage => {
        const cfg = STAGE_CONFIG[stage]
        const isCurrent = stage === currentStage
        return (
          <button
            key={stage}
            role="menuitem"
            disabled={isCurrent}
            onClick={() => { onMove(stage); onClose() }}
            className={cn(
              "flex w-full items-center gap-2 px-3 py-2 text-left text-xs font-medium transition-colors",
              isCurrent
                ? "text-muted-foreground/40 cursor-default"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
            )}
          >
            <span className={cn("inline-block h-1.5 w-1.5 rounded-full shrink-0", cfg.dot)} aria-hidden="true" />
            {cfg.label}
            {isCurrent && (
              <span className="ml-auto text-[9px] text-muted-foreground/50">current</span>
            )}
          </button>
        )
      })}
    </motion.div>
  )
}

/* ── Notes panel ──────────────────────────────────────────── */
function NotesPanel({
  notes,
  onSave,
  onClose,
}: {
  notes:   string
  onSave:  (n: string) => void
  onClose: () => void
}) {
  const [draft, setDraft] = React.useState(notes ?? "")

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{   opacity: 0, height: 0 }}
      transition={{ duration: 0.2 }}
      className="overflow-hidden border-t border-border/30 pt-3"
    >
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[10px] font-semibold text-muted-foreground">Notes</span>
        <button onClick={onClose} className="text-muted-foreground/50 hover:text-muted-foreground">
          <X className="size-3" aria-hidden="true" />
        </button>
      </div>
      <textarea
        value={draft}
        onChange={e => setDraft(e.target.value)}
        placeholder="Add context, talking points, or follow-up reminders..."
        rows={3}
        className={cn(
          "w-full resize-none rounded-[var(--radius-md)] border border-border/50 bg-muted/20",
          "px-2.5 py-2 text-[11px] text-foreground placeholder:text-muted-foreground/60",
          "focus:outline-none focus:border-primary/30 focus:ring-1 focus:ring-primary/15",
          "transition-all duration-200"
        )}
      />
      <button
        onClick={() => { onSave(draft); onClose() }}
        className="mt-1.5 text-[10px] font-semibold text-primary hover:text-primary/80 transition-colors"
      >
        Save notes
      </button>
    </motion.div>
  )
}

/* ── Main card ────────────────────────────────────────────── */
export function OutreachCard({
  entry,
  index,
}: {
  entry: OutreachEntry
  index: number
}) {
  const { moveStage, advanceStage, updateNotes } = useOutreach()
  const [showMove,  setShowMove]  = React.useState(false)
  const [showNotes, setShowNotes] = React.useState(false)
  const moveRef = React.useRef<HTMLDivElement>(null)

  const gradient = COVER_GRADIENTS[entry.coverIndex % COVER_GRADIENTS.length]
  const stageCfg = STAGE_CONFIG[entry.stage]
  const nextStage = STAGE_ORDER[STAGE_ORDER.indexOf(entry.stage) + 1]

  const initials = entry.podcastName
    .split(" ")
    .slice(0, 2)
    .map(w => w[0])
    .join("")
    .toUpperCase()

  /* Close move popover on outside click */
  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (moveRef.current && !moveRef.current.contains(e.target as Node)) setShowMove(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{   opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.25, delay: index * 0.04 }}
      className={cn(
        "group relative flex flex-col gap-3 overflow-visible",
        "rounded-[var(--radius-xl)] border border-border/60",
        "bg-card/70 backdrop-blur-sm",
        "shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)]",
        "transition-shadow duration-300"
      )}
    >
      {/* Stage accent top line */}
      <div
        aria-hidden
        className={cn(
          "absolute inset-x-0 top-0 h-[2px] rounded-t-[var(--radius-xl)]",
          stageCfg.bg
        )}
        style={{
          background: `linear-gradient(to right, transparent, ${
            entry.stage === "new"       ? "oklch(0.55 0.08 264 / 0.4)"  :
            entry.stage === "ready"     ? "oklch(0.55 0.22 264 / 0.6)"  :
            entry.stage === "contacted" ? "oklch(0.70 0.16 200 / 0.5)"  :
            entry.stage === "responded" ? "oklch(0.78 0.15 83 / 0.5)"   :
            entry.stage === "booked"    ? "oklch(0.65 0.15 145 / 0.6)"  :
                                          "oklch(0.55 0.12 200 / 0.4)"
          }, transparent)`,
        }}
      />

      <div className="flex flex-col gap-3 p-3.5">

        {/* ── Row 1: Cover + name + score ─────────────────── */}
        <div className="flex items-start gap-2.5">
          {/* Cover */}
          <div
            className="relative h-10 w-10 shrink-0 rounded-[var(--radius-md)] overflow-hidden"
            style={{ background: gradient }}
            aria-hidden="true"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <Mic2 className="size-3.5 text-white/25" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white/90">
              {initials}
            </div>
          </div>

          {/* Name + host */}
          <div className="min-w-0 flex-1">
            <Link
              href={`/dashboard/discover/${entry.id}`}
              className="block truncate text-[13px] font-bold text-foreground hover:text-primary transition-colors leading-tight"
            >
              {entry.podcastName}
            </Link>
            <p className="text-[11px] text-muted-foreground mt-0.5 truncate">
              {entry.hostName}
            </p>
          </div>

          {/* Match score */}
          <div
            className={cn(
              "flex h-9 w-9 shrink-0 flex-col items-center justify-center rounded-full",
              "border-2 text-[12px] font-bold tabular-nums",
              entry.matchScore >= 90
                ? "border-[oklch(0.78_0.15_83/0.5)] text-[var(--premium-gold)] bg-[oklch(0.78_0.15_83/0.08)]"
                : entry.matchScore >= 80
                ? "border-primary/40 text-primary bg-primary/8"
                : "border-[oklch(0.70_0.16_200/0.4)] text-[var(--premium-cyan)] bg-[oklch(0.70_0.16_200/0.08)]"
            )}
          >
            {entry.matchScore}
          </div>
        </div>

        {/* ── Row 2: Badges ───────────────────────────────── */}
        {entry.badges.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {entry.badges.map(b => (
              <OutreachBadge key={b} badge={b} />
            ))}
          </div>
        )}

        {/* ── Row 3: Audience + response bar ──────────────── */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
            <Users className="size-3" aria-hidden="true" />
            <span className="font-semibold text-foreground">{entry.audienceSize}K</span>
            listeners ·{" "}
            <span className="font-semibold text-foreground">{entry.audienceAlignment}%</span>
            {" "}alignment
          </div>
          <ResponseBar value={entry.responseRate} />
        </div>

        {/* ── Row 4: AI insights ──────────────────────────── */}
        {entry.insights.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {entry.insights.map(ins => (
              <InsightBadge key={ins} insight={ins} />
            ))}
          </div>
        )}

        {/* ── Notes panel ─────────────────────────────────── */}
        <AnimatePresence>
          {showNotes && (
            <NotesPanel
              notes={entry.notes ?? ""}
              onSave={n => updateNotes(entry.id, n)}
              onClose={() => setShowNotes(false)}
            />
          )}
        </AnimatePresence>

        {/* ── Footer: last activity + actions ─────────────── */}
        <div className="flex items-center justify-between gap-1 border-t border-border/30 pt-2.5">
          <span className="text-[10px] text-muted-foreground truncate">
            {entry.lastActivity}
          </span>

          <div className="flex items-center gap-1 shrink-0">

            {/* Notes toggle */}
            <button
              onClick={() => setShowNotes(v => !v)}
              aria-label="Toggle notes"
              className={cn(
                "inline-flex items-center justify-center h-6 w-6 rounded-[var(--radius-md)]",
                "border transition-colors",
                showNotes
                  ? "border-primary/30 bg-primary/8 text-primary"
                  : "border-transparent text-muted-foreground/50 hover:border-border hover:text-muted-foreground"
              )}
            >
              <StickyNote className="size-3" aria-hidden="true" />
            </button>

            {/* View profile */}
            <Link
              href={`/dashboard/discover/${entry.id}`}
              className="inline-flex items-center gap-1 rounded-[var(--radius-md)] border border-border/50 px-2 py-1 text-[10px] font-semibold text-muted-foreground hover:text-foreground hover:border-border transition-colors"
            >
              <ExternalLink className="size-3" aria-hidden="true" />
              View
            </Link>

            {/* Pitch */}
            {entry.stage !== "completed" && (
              <button className="inline-flex items-center gap-1 rounded-[var(--radius-md)] border border-primary/30 bg-primary/8 px-2 py-1 text-[10px] font-semibold text-primary hover:bg-primary/15 hover:border-primary/50 transition-colors">
                <Send className="size-3" aria-hidden="true" />
                Pitch
              </button>
            )}

            {/* Move stage */}
            <div ref={moveRef} className="relative">
              <button
                onClick={() => setShowMove(v => !v)}
                aria-label="Move to stage"
                aria-haspopup="menu"
                aria-expanded={showMove}
                className={cn(
                  "inline-flex items-center gap-0.5 rounded-[var(--radius-md)] border px-2 py-1",
                  "text-[10px] font-semibold transition-colors",
                  showMove
                    ? "border-primary/40 bg-primary/10 text-primary"
                    : "border-border/50 text-muted-foreground hover:text-foreground hover:border-border"
                )}
              >
                <ChevronRight className="size-3" aria-hidden="true" />
                {nextStage ? STAGE_CONFIG[nextStage].shortLabel : "Done"}
                <ChevronDown className="size-2.5 ml-0.5" aria-hidden="true" />
              </button>

              <AnimatePresence>
                {showMove && (
                  <MoveStageMenu
                    currentStage={entry.stage}
                    onMove={stage => moveStage(entry.id, stage)}
                    onClose={() => setShowMove(false)}
                  />
                )}
              </AnimatePresence>
            </div>

          </div>
        </div>

      </div>
    </motion.article>
  )
}
