"use client"

import { motion } from "motion/react"
import { Brain, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import type { MatchExplanation } from "@/lib/matching/match-engine"

/* ═══════════════════════════════════════════════════════════
   WhyThisMatches — personalized AI explanation panel.
   Shows 3 category-derived match explanations per podcast.

   FUTURE AI INTEGRATION POINT:
   Replace explanations prop with streamed LLM output from
   /api/match/explain?podcastId=X&creatorId=Y
   ═══════════════════════════════════════════════════════════ */

const TIER_STYLES: Record<MatchExplanation["tier"], {
  dot:    string
  label:  string
  border: string
  bg:     string
}> = {
  gold:    { dot: "bg-[var(--premium-gold)]",    label: "text-[var(--premium-gold)]",  border: "border-[oklch(0.78_0.15_83/0.20)]",   bg: "bg-[oklch(0.78_0.15_83/0.05)]"   },
  primary: { dot: "bg-primary",                  label: "text-primary",                border: "border-primary/20",                   bg: "bg-primary/05"                   },
  cyan:    { dot: "bg-[var(--premium-cyan)]",    label: "text-[var(--premium-cyan)]",  border: "border-[oklch(0.70_0.16_200/0.20)]",  bg: "bg-[oklch(0.70_0.16_200/0.05)]"  },
}

interface WhyThisMatchesProps {
  explanations: MatchExplanation[]
}

export function WhyThisMatches({ explanations }: WhyThisMatchesProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.55, duration: 0.4 }}
      aria-labelledby="why-heading"
      className="rounded-[var(--radius-xl)] border border-border bg-card shadow-[var(--shadow-card)] overflow-hidden"
    >
      {/* Top-edge highlight */}
      <div
        aria-hidden
        className="h-px w-full bg-gradient-to-r from-transparent via-primary/20 to-transparent"
      />

      {/* Header */}
      <div className="flex items-center gap-2.5 border-b border-border/50 px-6 py-4">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
          <Brain className="size-3.5 text-primary" aria-hidden="true" />
        </div>
        <h2 id="why-heading" className="text-sm font-semibold text-foreground">
          Why This Matches
        </h2>
        <span className="ml-auto flex items-center gap-1 text-[10px] font-medium text-muted-foreground/60">
          <Sparkles className="size-3" aria-hidden="true" />
          AI Generated
        </span>
      </div>

      {/* Explanations */}
      <div className="flex flex-col divide-y divide-border/20 px-6 py-2">
        {explanations.map((exp, i) => {
          const styles = TIER_STYLES[exp.tier]
          return (
            <motion.div
              key={exp.label}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.65 + i * 0.08, duration: 0.35 }}
              className={cn(
                "flex items-start gap-4 py-4 rounded-[var(--radius-md)] my-1 px-3",
                "border",
                styles.border, styles.bg
              )}
            >
              <span
                className={cn("mt-1.5 h-2 w-2 shrink-0 rounded-full", styles.dot)}
                aria-hidden="true"
              />
              <div className="flex flex-col gap-1">
                <span className={cn("text-[11px] font-bold uppercase tracking-wide", styles.label)}>
                  {exp.label}
                </span>
                <p className="text-[12px] leading-relaxed text-muted-foreground/90">
                  {exp.text}
                </p>
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.section>
  )
}
