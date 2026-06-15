"use client"

import { AnimatePresence, motion } from "motion/react"
import { Loader2, CheckCircle2, TrendingUp, TrendingDown } from "lucide-react"
import { useScoringStatus } from "./scoring-status-context"
import { cn } from "@/lib/utils"

export function ScoreStatusBar() {
  const { status, delta } = useScoringStatus()
  const visible = status !== "idle"
  const isDone  = status === "done"

  const deltaLabel =
    delta === null ? null :
    delta === 0    ? "No change" :
    delta > 0      ? `+${delta} pts` :
                     `${delta} pts`

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="score-status-bar"
          role="status"
          aria-live="polite"
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0,  scale: 1    }}
          exit={{    opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className={cn(
            "fixed bottom-6 right-6 z-50 flex items-center gap-2.5",
            "rounded-xl border px-4 py-2.5 shadow-xl backdrop-blur-md",
            isDone
              ? "border-[oklch(0.55_0.16_145/0.35)] bg-[oklch(0.12_0.04_145/0.95)] text-[oklch(0.75_0.16_145)]"
              : "border-primary/30 bg-card/95 text-foreground"
          )}
        >
          {isDone
            ? <CheckCircle2 className="size-4 shrink-0 text-[oklch(0.70_0.16_145)]" aria-hidden="true" />
            : <Loader2      className="size-4 shrink-0 animate-spin text-primary"    aria-hidden="true" />
          }

          <span className="text-[13px] font-medium leading-none">
            {isDone ? "Visibility Score updated" : "Updating score…"}
          </span>

          {isDone && deltaLabel && (
            <>
              <span className={cn(
                "text-[11px] font-bold px-1.5 py-0.5 rounded-md leading-none",
                delta !== null && delta > 0
                  ? "bg-[oklch(0.55_0.16_145/0.25)] text-[oklch(0.78_0.16_145)]"
                  : delta !== null && delta < 0
                    ? "bg-destructive/15 text-destructive"
                    : "bg-muted/60 text-muted-foreground"
              )}>
                {deltaLabel}
              </span>
              {delta !== null && delta > 0 && (
                <TrendingUp   className="size-3 shrink-0 text-[oklch(0.70_0.16_145)]" aria-hidden="true" />
              )}
              {delta !== null && delta < 0 && (
                <TrendingDown className="size-3 shrink-0 text-destructive"            aria-hidden="true" />
              )}
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
