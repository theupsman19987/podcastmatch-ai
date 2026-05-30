"use client"

import { motion, AnimatePresence } from "motion/react"
import { cn } from "@/lib/utils"
import { OutreachCard }   from "@/components/outreach/outreach-card"
import { ColumnEmpty }    from "@/components/outreach/outreach-empty"
import { type OutreachEntry, type OutreachStage, STAGE_CONFIG } from "@/components/outreach/outreach-mock"

/* ═══════════════════════════════════════════════════════════
   PipelineColumn — one Kanban column (stage header + cards).
   ═══════════════════════════════════════════════════════════ */

export function PipelineColumn({
  stage,
  entries,
}: {
  stage:   OutreachStage
  entries: OutreachEntry[]
}) {
  const cfg   = STAGE_CONFIG[stage]
  const count = entries.length

  return (
    <div
      className={cn(
        "flex w-[272px] shrink-0 flex-col gap-3 rounded-[var(--radius-xl)]",
        "border border-border/40 bg-muted/10 p-3"
      )}
      role="region"
      aria-label={`${cfg.label} column`}
    >
      {/* ── Column header ─────────────────────────────────── */}
      <div
        className={cn(
          "flex items-center justify-between rounded-[var(--radius-lg)] px-3 py-2",
          cfg.bg
        )}
      >
        <div className="flex items-center gap-2">
          <span className={cn("inline-block h-2 w-2 rounded-full shrink-0", cfg.dot)} aria-hidden="true" />
          <span className={cn("text-[11px] font-semibold", cfg.color)}>
            {cfg.label}
          </span>
        </div>
        <span
          className={cn(
            "inline-flex h-5 min-w-[20px] items-center justify-center rounded-full",
            "px-1.5 text-[10px] font-bold tabular-nums",
            count > 0
              ? `${cfg.bg} ${cfg.color} border ${cfg.border}`
              : "bg-muted/30 text-muted-foreground/50"
          )}
        >
          {count}
        </span>
      </div>

      {/* ── Card list ─────────────────────────────────────── */}
      <div className="flex flex-col gap-2.5 min-h-[120px]">
        <AnimatePresence mode="popLayout" initial={false}>
          {entries.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{   opacity: 0 }}
            >
              <ColumnEmpty stage={stage} />
            </motion.div>
          ) : (
            entries.map((entry, i) => (
              <OutreachCard key={entry.id} entry={entry} index={i} />
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
