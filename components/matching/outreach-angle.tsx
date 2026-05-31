"use client"

import { motion } from "motion/react"
import { Zap, MessageSquare, ChevronRight } from "lucide-react"
import type { OutreachAngle } from "@/lib/matching/match-engine"

/* ═══════════════════════════════════════════════════════════
   OutreachAngle — recommended pitch strategy per podcast.
   Derived from podcast categories via mock match engine.

   FUTURE AI INTEGRATION POINT:
   Replace angle prop with LLM output from
   /api/match/outreach?podcastId=X&creatorId=Y
   ═══════════════════════════════════════════════════════════ */

interface OutreachAngleProps {
  angle: OutreachAngle
}

export function OutreachAngleCard({ angle }: OutreachAngleProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.65, duration: 0.4 }}
      aria-labelledby="outreach-heading"
      className="rounded-[var(--radius-xl)] border border-[oklch(0.78_0.15_83/0.25)] bg-[oklch(0.78_0.15_83/0.04)] shadow-[var(--shadow-card)] overflow-hidden"
    >
      {/* Top-edge highlight */}
      <div
        aria-hidden
        className="h-px w-full bg-gradient-to-r from-transparent via-[var(--premium-gold)]/30 to-transparent"
      />

      {/* Header */}
      <div className="flex items-center gap-2.5 border-b border-[oklch(0.78_0.15_83/0.15)] px-6 py-4">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[oklch(0.78_0.15_83/0.12)] border border-[oklch(0.78_0.15_83/0.25)]">
          <Zap className="size-3.5 text-[var(--premium-gold)]" aria-hidden="true" />
        </div>
        <h2 id="outreach-heading" className="text-sm font-semibold text-foreground">
          Recommended Outreach Angle
        </h2>
        <span className="ml-auto rounded-full border border-[oklch(0.78_0.15_83/0.30)] bg-[oklch(0.78_0.15_83/0.10)] px-2 py-0.5 text-[9px] font-bold text-[var(--premium-gold)] uppercase tracking-wide">
          AI Suggested
        </span>
      </div>

      <div className="flex flex-col gap-5 p-6">
        {/* Headline */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50 mb-1.5">
            Lead With
          </p>
          <h3 className="text-[17px] font-black gradient-text-gold leading-tight">
            {angle.headline}
          </h3>
        </div>

        {/* Description */}
        <p className="text-[12px] leading-relaxed text-muted-foreground/85">
          {angle.description}
        </p>

        {/* Suggested topics */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50 mb-2.5">
            Suggested Conversation Angles
          </p>
          <div className="flex flex-col gap-2">
            {angle.suggestedTopics.map((topic, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.75 + i * 0.06 }}
                className="flex items-start gap-2.5 rounded-[var(--radius-md)] border border-border/30 bg-card/60 px-3 py-2.5"
              >
                <ChevronRight className="mt-0.5 size-3 shrink-0 text-[var(--premium-gold)]" aria-hidden="true" />
                <p className="text-[11px] leading-snug text-muted-foreground/90">{topic}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Tone */}
        <div className="flex items-center gap-3 rounded-[var(--radius-md)] border border-[oklch(0.78_0.15_83/0.20)] bg-[oklch(0.78_0.15_83/0.06)] px-4 py-3">
          <MessageSquare className="size-3.5 shrink-0 text-[var(--premium-gold)]" aria-hidden="true" />
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground/50">Recommended Tone</p>
            <p className="text-[12px] font-semibold text-[var(--premium-gold)]">{angle.tone}</p>
          </div>
        </div>
      </div>
    </motion.section>
  )
}
