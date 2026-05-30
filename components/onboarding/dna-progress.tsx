"use client"

import { motion } from "motion/react"
import { TOTAL_STEPS } from "./dna-context"

const STEP_LABELS = [
  "Your Story",
  "Your Expertise",
  "Your Audience",
  "Communication Style",
  "Podcast Interests",
  "Visibility & Experience",
  "Creator Positioning",
]

export function DNAProgress({ step }: { step: number }) {
  const pct = Math.round((step / TOTAL_STEPS) * 100)

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-primary uppercase tracking-widest">
            Step {step} of {TOTAL_STEPS}
          </span>
          <span className="w-1 h-1 rounded-full bg-border/60 inline-block" />
          <span className="text-sm text-muted-foreground">{STEP_LABELS[step - 1]}</span>
        </div>
        <span className="text-xs font-medium text-muted-foreground">{pct}% complete</span>
      </div>

      <div className="h-0.5 w-full bg-border/25 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-primary via-primary to-[oklch(0.72_0.17_200)]"
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </div>

      <div className="flex items-center gap-1 mt-3">
        {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
          <motion.div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors duration-500 ${
              i < step ? "bg-primary" : "bg-border/25"
            }`}
            animate={{ opacity: i < step ? 1 : 0.5 }}
            transition={{ duration: 0.3 }}
          />
        ))}
      </div>
    </div>
  )
}
