"use client"

import { motion } from "motion/react"
import { Mic2, Sparkles, TrendingUp } from "lucide-react"
import type { GeneratedProfile } from "@/lib/profile/generate-profile"

function ScoreArc({ score, label, color = "primary" }: { score: number; label: string; color?: "primary" | "gold" }) {
  const size = 72
  const r = 29
  const c = 2 * Math.PI * r
  const offset = c * (1 - score / 100)
  const stroke = color === "gold" ? "oklch(0.85 0.16 85)" : "oklch(var(--primary))"

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative">
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor" strokeWidth={3} className="text-border/30" />
          <motion.circle
            cx={size / 2} cy={size / 2} r={r}
            fill="none" stroke={stroke} strokeWidth={3}
            strokeDasharray={c}
            initial={{ strokeDashoffset: c }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-base font-bold text-foreground">{score}</span>
        </div>
      </div>
      <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider text-center leading-tight max-w-[64px]">
        {label}
      </span>
    </div>
  )
}

interface Props { profile: GeneratedProfile }

export function ProfileHeader({ profile }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative rounded-2xl border border-border/60 bg-card/70 backdrop-blur-sm shadow-[var(--shadow-card)] overflow-hidden"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      <div className="absolute top-0 left-0 w-80 h-40 rounded-full bg-primary/4 blur-3xl pointer-events-none" />

      <div className="relative p-6 md:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">

          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-[0_0_28px_oklch(var(--primary)/0.15)]">
              <Mic2 className="w-9 h-9 md:w-10 md:h-10 text-primary" />
            </div>
            <div className="absolute -bottom-1.5 -right-1.5 flex items-center gap-1 bg-primary/15 border border-primary/30 rounded-full px-2 py-0.5">
              <Sparkles className="w-2.5 h-2.5 text-primary" />
              <span className="text-[9px] font-bold text-primary uppercase tracking-wider">AI</span>
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-xs font-bold text-primary uppercase tracking-widest">Creator Profile</span>
              <span className="w-1 h-1 rounded-full bg-border/60 inline-block" />
              <span className="text-xs text-muted-foreground">AI Generated</span>
            </div>

            <h1 className="text-xl md:text-2xl font-bold text-foreground mb-2 leading-tight">
              {profile.title} · {profile.category}
            </h1>

            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 border border-primary/20 text-primary">
                {profile.creatorArchetype}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-card border border-border/50 text-muted-foreground">
                {profile.audienceType}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <TrendingUp className="w-3 h-3 text-primary" />
              <span>Powered by Creator DNA Assessment</span>
            </div>
          </div>

          {/* Score Arcs */}
          <div className="flex items-center gap-6 sm:gap-8 shrink-0">
            <ScoreArc score={profile.visibilityScore} label="Visibility Score" />
            <ScoreArc score={profile.aiAlignmentScore} label="AI Alignment" color="gold" />
          </div>
        </div>
      </div>
    </motion.div>
  )
}
