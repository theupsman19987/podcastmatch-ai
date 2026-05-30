"use client"

import { motion } from "motion/react"
import { Sparkles, CheckCircle2, Circle, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { useProfile } from "@/components/profile/profile-context"
import { CREATOR_META } from "@/components/profile/profile-mock"

/* ═══════════════════════════════════════════════════════════
   BrandSummary — creator identity card + profile completion.
   ═══════════════════════════════════════════════════════════ */

/* ── Type match indicator ─────────────────────────────────── */
function TypeMatch() {
  const meta = CREATOR_META
  const score = meta.typeMatchScore

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-[var(--radius-lg)] border border-border/40 p-4",
        "bg-muted/15"
      )}
    >
      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">
        Creator Identity
      </span>

      <div className="flex items-center gap-3">
        {/* Self-declared */}
        <div className="flex-1 flex flex-col gap-1">
          <span className="text-[9px] text-muted-foreground/60 uppercase tracking-wider">You identify as</span>
          <span className="text-[13px] font-bold text-foreground">{meta.creatorType}</span>
        </div>

        {/* Match bridge */}
        <div className="flex flex-col items-center gap-1 shrink-0">
          <div className={cn(
            "flex h-8 w-14 items-center justify-center rounded-full border text-[10px] font-bold",
            score >= 85
              ? "border-[oklch(0.65_0.15_145/0.35)] bg-[oklch(0.55_0.16_145/0.12)] text-[oklch(0.70_0.16_145)]"
              : "border-primary/30 bg-primary/8 text-primary"
          )}>
            {score}%
          </div>
          <span className="text-[9px] text-muted-foreground/50">match</span>
        </div>

        {/* AI detected */}
        <div className="flex-1 flex flex-col gap-1 text-right">
          <span className="text-[9px] text-muted-foreground/60 uppercase tracking-wider">AI detects</span>
          <span className="text-[13px] font-bold text-foreground">{meta.aiDetectedType}</span>
        </div>
      </div>

      <p className="text-[11px] text-muted-foreground leading-relaxed">
        Your self-identified creator type and AI-detected positioning are {score >= 85 ? "highly aligned" : "moderately aligned"}. AI analysis is based on your bio, topics, keywords, and engagement patterns.
      </p>
    </div>
  )
}

/* ── Profile completion checklist ────────────────────────── */
function CompletionChecklist() {
  const incomplete = CREATOR_META.completionItems.filter(i => !i.done)
  const complete   = CREATOR_META.completionItems.filter(i => i.done)

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Complete Your Profile</span>
        <span className="text-[10px] text-muted-foreground">{complete.length}/{CREATOR_META.completionItems.length} done</span>
      </div>

      {/* Incomplete items */}
      <div className="flex flex-col gap-1.5">
        {incomplete.map(item => (
          <div key={item.label} className="flex items-center gap-2.5 group cursor-pointer">
            <Circle className="size-3.5 shrink-0 text-muted-foreground/30" aria-hidden="true" />
            <span className="text-[11px] text-muted-foreground">{item.label}</span>
            <ChevronRight className="size-3 text-muted-foreground/30 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
          </div>
        ))}
        {complete.slice(0, 2).map(item => (
          <div key={item.label} className="flex items-center gap-2.5 opacity-40">
            <CheckCircle2 className="size-3.5 shrink-0 text-[oklch(0.65_0.15_145)]" aria-hidden="true" />
            <span className="text-[11px] text-foreground line-through">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Main component ───────────────────────────────────────── */
export function BrandSummary() {
  const { creator } = useProfile()

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.08 }}
      className={cn(
        "relative overflow-hidden rounded-[var(--radius-xl)] border border-border/60",
        "bg-card/70 backdrop-blur-sm p-5 shadow-[var(--shadow-card)]"
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px
                   bg-gradient-to-r from-transparent via-primary/20 to-transparent"
      />

      <div className="flex flex-col gap-5">
        {/* Section title */}
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-primary/60" aria-hidden="true" />
          <span className="text-sm font-bold text-foreground">Creator Brand Identity</span>
        </div>

        {/* Type match */}
        <TypeMatch />

        {/* Bio preview */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">
            Creator Bio
          </span>
          <p className="text-[12px] text-foreground/80 leading-relaxed line-clamp-4">
            {creator.bio}
          </p>
        </div>

        {/* Estimated reach */}
        <div className={cn(
          "flex items-center justify-between rounded-[var(--radius-lg)] border border-[oklch(0.70_0.16_200/0.25)]",
          "bg-[oklch(0.70_0.16_200/0.06)] px-4 py-3"
        )}>
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] text-muted-foreground">Estimated reach per episode</span>
            <span className="text-base font-bold text-[var(--premium-cyan)] tabular-nums">
              {CREATOR_META.audienceSize}
            </span>
          </div>
          <div className="flex flex-col gap-0.5 text-right">
            <span className="text-[10px] text-muted-foreground">Matching podcasts</span>
            <span className="text-base font-bold text-primary tabular-nums">
              {CREATOR_META.totalPodcastFits}
            </span>
          </div>
        </div>

        {/* Completion checklist */}
        <CompletionChecklist />
      </div>
    </motion.div>
  )
}
