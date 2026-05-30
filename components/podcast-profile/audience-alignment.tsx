"use client"

import { useRef } from "react"
import { motion, useInView } from "motion/react"
import { Users, Sparkles, Target } from "lucide-react"
import { cn } from "@/lib/utils"
import { type DiscoveryPodcast } from "@/components/discovery/mock-data"
import { type AudienceSegment } from "@/components/podcast-profile/profile-mock"

/* ═══════════════════════════════════════════════════════════
   AudienceAlignment — audience overlap visualizations.
   Shows segment breakdown + alignment signals + AI insights.
   ═══════════════════════════════════════════════════════════ */

const SEGMENT_COLORS = [
  { bar: "gradient-primary",                    dot: "bg-primary"                         },
  { bar: "bg-[var(--premium-cyan)]",            dot: "bg-[var(--premium-cyan)]"           },
  { bar: "bg-[var(--premium-gold)]",            dot: "bg-[var(--premium-gold)]"           },
  { bar: "bg-[oklch(0.55_0.180_290)]",          dot: "bg-[oklch(0.55_0.180_290)]"         },
]

const AI_SIGNALS = [
  { label: "Audience Niche Match",     value: "Very Strong",  tier: "gold"    },
  { label: "Content Compatibility",   value: "Strong",       tier: "primary" },
  { label: "Listener Demographics",   value: "Aligned",      tier: "cyan"    },
]

const SIGNAL_STYLES: Record<string, { text: string; badge: string }> = {
  gold:    { text: "text-[var(--premium-gold)]",                          badge: "bg-[oklch(0.78_0.15_83/0.12)] text-[var(--premium-gold)] border-[oklch(0.78_0.15_83/0.22)]"          },
  primary: { text: "text-primary",                                        badge: "bg-primary/10 text-primary border-primary/22"                                                         },
  cyan:    { text: "text-[var(--premium-cyan)]",                          badge: "bg-[oklch(0.70_0.16_200/0.10)] text-[var(--premium-cyan)] border-[oklch(0.70_0.16_200/0.22)]"        },
}

/* ── Donut chart ──────────────────────────────────────────── */
function DonutChart({ alignment }: { alignment: number }) {
  const ref = useRef<SVGCircleElement>(null)
  const inView = useInView({ current: ref.current } as React.RefObject<Element>, { once: true })

  const R = 48
  const circumference = 2 * Math.PI * R

  return (
    <div className="relative flex h-[120px] w-[120px] shrink-0 items-center justify-center">
      <svg width="120" height="120" viewBox="0 0 120 120" aria-label={`Audience alignment: ${alignment}%`} role="img">
        {/* Track */}
        <circle cx="60" cy="60" r={R} fill="none" stroke="oklch(0.22 0.050 250)" strokeWidth="7" />
        {/* Progress */}
        <motion.circle
          ref={ref}
          cx="60" cy="60" r={R}
          fill="none"
          stroke="oklch(0.58 0.220 255)"
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={inView ? { strokeDashoffset: circumference * (1 - alignment / 100) } : {}}
          transition={{ duration: 1.1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          transform="rotate(-90 60 60)"
          style={{ filter: "drop-shadow(0 0 6px oklch(0.58 0.220 255 / 0.50))" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-xl font-black gradient-text-primary">{alignment}%</span>
        <span className="text-[9px] text-muted-foreground">Aligned</span>
      </div>
    </div>
  )
}

interface AudienceAlignmentProps {
  podcast:          DiscoveryPodcast
  audienceSegments: AudienceSegment[]
  audienceSignals:  string[]
}

export function AudienceAlignment({ podcast, audienceSegments, audienceSignals }: AudienceAlignmentProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref as React.RefObject<Element>, { once: true })

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.4 }}
      aria-labelledby="audience-alignment-heading"
      className="flex flex-col gap-5 rounded-[var(--radius-xl)] border border-border bg-card p-6 shadow-[var(--shadow-card)]"
    >
      <div className="flex items-center gap-2">
        <Target className="size-4 text-muted-foreground" aria-hidden="true" />
        <h2 id="audience-alignment-heading" className="text-sm font-semibold text-foreground">
          Audience Alignment
        </h2>
        <span className="ml-auto flex items-center gap-1 text-[10px] font-medium text-primary">
          <Sparkles className="size-3" aria-hidden="true" />
          AI Verified
        </span>
      </div>

      {/* Top row: donut + segments */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-7">

        {/* Donut */}
        <DonutChart alignment={podcast.audienceAlignment} />

        {/* Segment bars */}
        <div ref={ref} className="flex flex-1 flex-col gap-3" role="list" aria-label="Audience segments">
          {audienceSegments.map((seg, i) => {
            const colors = SEGMENT_COLORS[i % SEGMENT_COLORS.length]
            return (
              <div key={seg.label} role="listitem">
                <div className="mb-1 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className={cn("h-2 w-2 shrink-0 rounded-full", colors.dot)} aria-hidden="true" />
                    <span className="text-[11px] text-muted-foreground">{seg.label}</span>
                  </div>
                  <span className="text-[11px] font-semibold text-foreground">{seg.pct}%</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <motion.div
                    className={cn("h-full rounded-full", colors.bar)}
                    initial={{ width: 0 }}
                    animate={inView ? { width: `${seg.pct}%` } : {}}
                    transition={{ delay: 0.5 + i * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* AI Signals */}
      <div className="flex flex-col gap-3">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">
          AI Alignment Signals
        </p>
        <div className="flex flex-col gap-2">
          {AI_SIGNALS.map((signal, i) => {
            const style = SIGNAL_STYLES[signal.tier]
            return (
              <motion.div
                key={signal.label}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.07 }}
                className="flex items-center justify-between rounded-[var(--radius-md)] border border-border/40 bg-muted/15 px-3.5 py-2.5"
              >
                <div className="flex items-center gap-2">
                  <Users className="size-3.5 text-muted-foreground/60" aria-hidden="true" />
                  <span className="text-[12px] text-foreground/80">{signal.label}</span>
                </div>
                <span className={cn(
                  "rounded-full border px-2.5 py-0.5 text-[10px] font-semibold",
                  style.badge
                )}>
                  {signal.value}
                </span>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Audience signal keywords */}
      <div className="flex flex-wrap gap-1.5">
        {audienceSignals.map((sig, i) => (
          <motion.span
            key={sig}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 + i * 0.04 }}
            className="flex items-center gap-1 rounded-full border border-primary/20 bg-primary/08 px-2.5 py-0.5
                       text-[10px] font-medium text-primary/80"
          >
            <Sparkles className="size-2.5" aria-hidden="true" />
            {sig}
          </motion.span>
        ))}
      </div>
    </motion.section>
  )
}
