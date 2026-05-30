"use client"

import { motion } from "motion/react"
import Link from "next/link"
import { Send, Inbox, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { type OutreachStage, STAGE_CONFIG } from "@/components/outreach/outreach-mock"

/* ═══════════════════════════════════════════════════════════
   OutreachEmptyState — per-column and full-page empty states.
   ═══════════════════════════════════════════════════════════ */

/* ── Per-column empty slot (inline, compact) ─────────────── */
export function ColumnEmpty({ stage }: { stage: OutreachStage }) {
  const cfg = STAGE_CONFIG[stage]

  const copy: Record<OutreachStage, { title: string; body: string }> = {
    new:       { title: "No new opportunities",   body: "AI will surface matches here." },
    ready:     { title: "Nothing queued yet",      body: "Mark opportunities as ready to pitch." },
    contacted: { title: "No active outreach",      body: "Podcasts you've pitched appear here." },
    responded: { title: "Awaiting replies",        body: "Responses from hosts show up here." },
    booked:    { title: "No interviews booked",    body: "Confirmed recordings land here." },
    completed: { title: "No completed interviews", body: "Finished episodes are logged here." },
  }

  const text = copy[stage]

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-2 rounded-[var(--radius-lg)]",
        "border border-dashed py-8 px-4 text-center",
        cfg.border
      )}
    >
      <Inbox className={cn("size-5 opacity-40", cfg.color)} aria-hidden="true" />
      <p className="text-[11px] font-semibold text-muted-foreground">{text.title}</p>
      <p className="text-[10px] text-muted-foreground/60 max-w-[160px] leading-relaxed">{text.body}</p>
    </div>
  )
}

/* ── Full-page empty (no pipeline entries at all) ────────── */
export function PipelineEmpty() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        "flex flex-col items-center justify-center gap-6",
        "rounded-[var(--radius-xl)] border border-dashed border-border/50",
        "bg-card/30 px-8 py-20 text-center",
      )}
    >
      {/* Icon */}
      <div className="relative flex h-16 w-16 items-center justify-center">
        <div
          aria-hidden
          className="absolute inset-0 rounded-full bg-primary/8 animate-pulse"
          style={{ animationDuration: "3s" }}
        />
        <div className="relative flex h-12 w-12 items-center justify-center rounded-full border border-border/60 bg-card shadow-[var(--shadow-card)]">
          <Send className="size-5 text-primary/60" aria-hidden="true" />
        </div>
      </div>

      {/* Copy */}
      <div className="flex flex-col gap-2 max-w-xs">
        <h3 className="text-base font-bold text-foreground">Your outreach pipeline is empty</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Save podcasts from the discovery engine and move them into your outreach pipeline to start building relationships.
        </p>
      </div>

      {/* CTA */}
      <div className="flex flex-col items-center gap-3">
        <Link
          href="/dashboard/discover"
          className={cn(
            "inline-flex items-center gap-2 rounded-[var(--radius-lg)] px-5 py-2.5",
            "text-sm font-semibold text-white",
            "bg-gradient-to-r from-primary to-[oklch(0.60_0.20_290)]",
            "shadow-[0_0_20px_oklch(0.55_0.22_264/0.35)]",
            "hover:shadow-[0_0_28px_oklch(0.55_0.22_264/0.50)]",
            "transition-shadow duration-300"
          )}
        >
          <Sparkles className="size-4" aria-hidden="true" />
          Discover Podcasts
        </Link>
        <p className="text-[11px] text-muted-foreground flex items-center gap-1.5">
          <Sparkles className="size-3 text-primary/50" aria-hidden="true" />
          AI matches are ready and waiting
        </p>
      </div>
    </motion.div>
  )
}
