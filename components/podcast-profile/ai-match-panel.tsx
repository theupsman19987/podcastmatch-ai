"use client"

import { useRef } from "react"
import { motion, useInView } from "motion/react"
import { Sparkles, ShieldCheck } from "lucide-react"
import { cn } from "@/lib/utils"
import { type DiscoveryPodcast } from "@/components/discovery/mock-data"
import { type AIFactor } from "@/components/podcast-profile/profile-mock"

/* ═══════════════════════════════════════════════════════════
   AIMatchPanel — the main AI analysis display.
   Radial score arc + 4 factor breakdown bars + confidence.
   ═══════════════════════════════════════════════════════════ */

/* ── Radial score visualization ───────────────────────────── */
function RadialScore({ score }: { score: number }) {
  const ref = useRef<SVGCircleElement>(null)
  const inView = useInView({ current: ref.current } as React.RefObject<Element>, { once: true })

  const R = 72
  const circumference = 2 * Math.PI * R
  const progress = score / 100

  /* Tier colors */
  const tierColor =
    score >= 90 ? "oklch(0.78 0.150 83)"      // gold
    : score >= 80 ? "oklch(0.58 0.220 255)"    // primary
    : "oklch(0.70 0.160 200)"                  // cyan

  const tierLabel =
    score >= 95 ? "Perfect Match"
    : score >= 85 ? "Strong Match"
    : "Good Match"

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative flex items-center justify-center">
        <svg
          width="176"
          height="176"
          viewBox="0 0 176 176"
          aria-label={`AI match score: ${score}%`}
          role="img"
        >
          {/* Background glow */}
          <circle
            cx="88" cy="88" r={R + 16}
            fill={`${tierColor.replace(")", " / 0.05)")}`}
          />
          {/* Track ring */}
          <circle
            cx="88" cy="88" r={R}
            fill="none"
            stroke="oklch(0.22 0.050 250)"
            strokeWidth="9"
          />
          {/* Progress arc */}
          <motion.circle
            ref={ref}
            cx="88" cy="88" r={R}
            fill="none"
            stroke={tierColor}
            strokeWidth="9"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={inView ? { strokeDashoffset: circumference * (1 - progress) } : {}}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            transform="rotate(-90 88 88)"
            style={{ filter: `drop-shadow(0 0 8px ${tierColor} / 0.55)` }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute flex flex-col items-center gap-0.5">
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
            className={cn(
              "text-4xl font-black leading-none tabular-nums",
              score >= 90 ? "gradient-text-gold"
              : score >= 80 ? "gradient-text-primary"
              : "gradient-text-cyan"
            )}
          >
            {score}%
          </motion.span>
          <span className="text-[11px] font-semibold text-muted-foreground">Match</span>
        </div>
      </div>

      {/* Tier badge */}
      <motion.div
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className={cn(
          "flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold",
          score >= 90
            ? "border-[oklch(0.78_0.15_83/0.30)] bg-[oklch(0.78_0.15_83/0.10)] text-[var(--premium-gold)]"
            : "border-primary/30 bg-primary/10 text-primary"
        )}
      >
        <ShieldCheck className="size-3.5" aria-hidden="true" />
        {tierLabel}
      </motion.div>
    </div>
  )
}

/* ── Single factor row ────────────────────────────────────── */
function FactorRow({ factor, index }: { factor: AIFactor; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref as React.RefObject<Element>, { once: true })

  const barColor =
    factor.score >= 90 ? "gradient-primary"
    : factor.score >= 80 ? "bg-[var(--premium-cyan)]"
    : "bg-primary"

  return (
    <div ref={ref} className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[13px] font-semibold text-foreground">{factor.label}</span>
        <span className={cn(
          "text-[12px] font-bold tabular-nums",
          factor.score >= 90 ? "gradient-text-gold"
          : factor.score >= 80 ? "gradient-text-primary"
          : "gradient-text-cyan"
        )}>
          {factor.score}%
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <motion.div
          className={cn("h-full rounded-full", barColor)}
          initial={{ width: 0 }}
          animate={inView ? { width: `${factor.score}%` } : {}}
          transition={{ delay: 0.3 + index * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>

      <p className="text-[11px] leading-relaxed text-muted-foreground/80">
        {factor.description}
      </p>
    </div>
  )
}

/* ── Main AI Match Panel ──────────────────────────────────── */
interface AIMatchPanelProps {
  podcast:   DiscoveryPodcast
  aiFactors: AIFactor[]
}

export function AIMatchPanel({ podcast, aiFactors }: AIMatchPanelProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      aria-labelledby="ai-match-heading"
      className="rounded-[var(--radius-xl)] border border-border bg-card shadow-[var(--shadow-card)] overflow-hidden"
    >
      {/* Top-edge highlight */}
      <div
        aria-hidden
        className="h-px w-full bg-gradient-to-r from-transparent via-primary/25 to-transparent"
      />

      {/* Panel header */}
      <div className="flex items-center gap-2.5 border-b border-border/50 px-6 py-4">
        <div className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" aria-hidden="true" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
        </div>
        <h2 id="ai-match-heading" className="text-sm font-semibold text-foreground">
          AI Match Analysis
        </h2>
        <span className="ml-auto flex items-center gap-1 text-[10px] font-medium text-muted-foreground/60">
          <Sparkles className="size-3" aria-hidden="true" />
          Personalized to your profile
        </span>
      </div>

      <div className="p-6">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-10">

          {/* Radial score */}
          <div className="flex justify-center lg:justify-start">
            <RadialScore score={podcast.matchScore} />
          </div>

          {/* Factor breakdown */}
          <div className="flex flex-1 flex-col gap-5">
            <p className="text-[12px] text-muted-foreground leading-relaxed">
              The AI analyzed your creator profile against this podcast&apos;s audience, topics, and
              booking history to generate this match score.
            </p>
            {aiFactors.map((factor, i) => (
              <FactorRow key={factor.label} factor={factor} index={i} />
            ))}
          </div>

        </div>
      </div>

      {/* Confidence footer */}
      <div className="flex items-center gap-2 border-t border-border/40 bg-muted/20 px-6 py-3">
        <ShieldCheck className="size-3.5 text-[oklch(0.70_0.16_145)]" aria-hidden="true" />
        <p className="text-[11px] text-muted-foreground">
          <span className="font-semibold text-[oklch(0.70_0.16_145)]">High AI Confidence</span>
          {" — "} Score derived from 14 audience and content signals
        </p>
      </div>
    </motion.section>
  )
}
