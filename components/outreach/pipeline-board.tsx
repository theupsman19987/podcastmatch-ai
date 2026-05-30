"use client"

import { motion } from "motion/react"
import { cn } from "@/lib/utils"
import { useOutreach }      from "@/components/outreach/outreach-context"
import { PipelineColumn }   from "@/components/outreach/pipeline-column"
import { PipelineEmpty }    from "@/components/outreach/outreach-empty"
import { OutreachCard }     from "@/components/outreach/outreach-card"
import { ColumnEmpty }      from "@/components/outreach/outreach-empty"
import {
  type OutreachStage,
  STAGE_ORDER,
  STAGE_CONFIG,
} from "@/components/outreach/outreach-mock"

/* ═══════════════════════════════════════════════════════════
   PipelineBoard — responsive Kanban layout.

   Desktop (lg+): All 6 columns side-by-side, overflow-x scroll.
   Mobile (<lg): Tab selector → single stage view (vertical cards).
   ═══════════════════════════════════════════════════════════ */

/* ── Mobile: stage tab bar ────────────────────────────────── */
function MobileStageTabs() {
  const { activeStage, setActiveStage, countByStage } = useOutreach()

  return (
    <div
      className="flex overflow-x-auto gap-1.5 pb-1 lg:hidden"
      role="tablist"
      aria-label="Pipeline stages"
      style={{ scrollbarWidth: "none" }}
    >
      {STAGE_ORDER.map(stage => {
        const cfg    = STAGE_CONFIG[stage]
        const count  = countByStage[stage]
        const active = activeStage === stage

        return (
          <button
            key={stage}
            role="tab"
            aria-selected={active}
            onClick={() => setActiveStage(stage)}
            className={cn(
              "relative flex shrink-0 items-center gap-1.5 rounded-[var(--radius-lg)]",
              "border px-3 py-1.5 text-[11px] font-semibold whitespace-nowrap",
              "transition-all duration-200",
              active
                ? `${cfg.color} ${cfg.border} ${cfg.bg}`
                : "border-border/40 bg-muted/20 text-muted-foreground hover:text-foreground"
            )}
          >
            <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", active ? cfg.dot : "bg-muted-foreground/40")} aria-hidden="true" />
            {cfg.shortLabel}
            {count > 0 && (
              <span className={cn(
                "inline-flex h-4 min-w-[16px] items-center justify-center rounded-full px-1 text-[9px] font-bold tabular-nums",
                active ? `${cfg.bg} ${cfg.color}` : "bg-muted/60 text-muted-foreground"
              )}>
                {count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

/* ── Mobile: single stage cards ──────────────────────────── */
function MobileStageView() {
  const { activeStage, entriesByStage } = useOutreach()
  const entries = entriesByStage[activeStage]
  const cfg     = STAGE_CONFIG[activeStage]

  return (
    <div className="flex flex-col gap-3 lg:hidden">
      {/* Column label */}
      <div className={cn(
        "flex items-center gap-2 rounded-[var(--radius-lg)] px-3 py-2 text-[11px] font-semibold",
        cfg.bg, cfg.color
      )}>
        <span className={cn("h-2 w-2 rounded-full shrink-0", cfg.dot)} aria-hidden="true" />
        {cfg.label}
        <span className="ml-auto opacity-70">{entries.length} card{entries.length !== 1 ? "s" : ""}</span>
      </div>

      {entries.length === 0 ? (
        <ColumnEmpty stage={activeStage} />
      ) : (
        entries.map((entry, i) => (
          <OutreachCard key={entry.id} entry={entry} index={i} />
        ))
      )}
    </div>
  )
}

/* ── Desktop: full Kanban board ───────────────────────────── */
function DesktopBoard() {
  const { entriesByStage } = useOutreach()

  return (
    <div
      className="hidden lg:flex gap-4 overflow-x-auto pb-4"
      role="region"
      aria-label="Outreach pipeline board"
      style={{ scrollbarWidth: "thin" }}
    >
      {STAGE_ORDER.map(stage => (
        <PipelineColumn
          key={stage}
          stage={stage}
          entries={entriesByStage[stage]}
        />
      ))}
    </div>
  )
}

/* ── Main export ──────────────────────────────────────────── */
export function PipelineBoard() {
  const { total, entries } = useOutreach()

  if (total === 0 && entries.length === 0) {
    return <PipelineEmpty />
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="flex flex-col gap-3"
    >
      {/* Mobile tab bar */}
      <MobileStageTabs />

      {/* Mobile single-stage view */}
      <MobileStageView />

      {/* Desktop full Kanban */}
      <DesktopBoard />
    </motion.div>
  )
}
