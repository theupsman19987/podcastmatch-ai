"use client"

import { useRef } from "react"
import { motion } from "motion/react"
import { useInView } from "motion/react"
import { BarChart3, Sparkles } from "lucide-react"
import type { GeneratedProfile } from "@/lib/profile/generate-profile"

function scoreColor(score: number) {
  if (score >= 85) return "oklch(0.85 0.16 85)"   // gold
  if (score >= 70) return "oklch(var(--primary))"  // primary blue
  if (score >= 55) return "oklch(0.72 0.17 200)"   // cyan
  return "oklch(0.55 0.08 240)"                     // muted
}

function scoreTier(score: number) {
  if (score >= 85) return { label: "Elite", bg: "bg-yellow-500/10 border-yellow-500/30 text-yellow-400" }
  if (score >= 70) return { label: "Strong", bg: "bg-primary/10 border-primary/30 text-primary" }
  if (score >= 55) return { label: "Growing", bg: "bg-cyan-500/10 border-cyan-500/30 text-cyan-400" }
  return { label: "Building", bg: "bg-muted/30 border-border/40 text-muted-foreground" }
}

interface BarProps { label: string; score: number; delay?: number }

function StrengthBar({ label, score, delay = 0 }: BarProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref as React.RefObject<Element>, { once: true })
  const tier = scoreTier(score)

  return (
    <div ref={ref} className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground/80">{label}</span>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${tier.bg}`}>
            {tier.label}
          </span>
          <span className="text-sm font-bold text-foreground">{score}</span>
        </div>
      </div>
      <div className="h-1.5 w-full bg-border/20 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: scoreColor(score) }}
          initial={{ width: 0 }}
          animate={{ width: inView ? `${score}%` : 0 }}
          transition={{ duration: 0.9, delay, ease: "easeOut" }}
        />
      </div>
    </div>
  )
}

interface Props { profile: GeneratedProfile }

export function StrengthDashboard({ profile }: Props) {
  const strengths = [
    { label: "Audience Match Strength",  score: profile.audienceMatchStrength },
    { label: "Topic Authority",          score: profile.topicAuthority },
    { label: "Visibility Potential",     score: profile.visibilityPotential },
    { label: "Podcast Compatibility",    score: profile.podcastCompatibility },
    { label: "Creator Momentum",         score: profile.creatorMomentum },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      className="relative rounded-2xl border border-border/60 bg-card/70 backdrop-blur-sm shadow-[var(--shadow-card)] overflow-hidden"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      <div className="p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 border border-primary/20">
              <BarChart3 className="w-4 h-4 text-primary" />
            </div>
            <h2 className="text-sm font-bold text-foreground">Creator Strength Dashboard</h2>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/8 border border-primary/20">
            <Sparkles className="w-3 h-3 text-primary" />
            <span className="text-xs font-semibold text-primary">AI Scored</span>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          {strengths.map(({ label, score }, i) => (
            <StrengthBar key={label} label={label} score={score} delay={i * 0.1} />
          ))}
        </div>
      </div>
    </motion.div>
  )
}
