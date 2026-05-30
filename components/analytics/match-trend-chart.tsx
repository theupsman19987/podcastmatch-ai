"use client"

import { useRef } from "react"
import { motion } from "motion/react"
import { useInView } from "motion/react"
import { cn } from "@/lib/utils"
import { useAnalytics } from "@/components/analytics/analytics-context"

/* ═══════════════════════════════════════════════════════════
   MatchTrendChart — animated SVG bar chart.
   Shows AI match quality trend over the selected period.
   ═══════════════════════════════════════════════════════════ */

const W    = 320
const H    = 180
const PAD  = { top: 16, right: 8, bottom: 28, left: 32 }
const CHART_W = W - PAD.left - PAD.right
const CHART_H = H - PAD.top  - PAD.bottom

function barColor(score: number) {
  if (score >= 90) return { fill: "oklch(0.78 0.15 83)",  glow: "oklch(0.78 0.15 83 / 0.4)"  }
  if (score >= 85) return { fill: "oklch(0.65 0.22 264)", glow: "oklch(0.55 0.22 264 / 0.3)" }
  return               { fill: "oklch(0.70 0.16 200)",   glow: "oklch(0.70 0.16 200 / 0.3)"  }
}

export function MatchTrendChart({ className }: { className?: string }) {
  const { matchTrendSeries } = useAnalytics()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref as React.RefObject<Element>, { once: true })

  const data  = matchTrendSeries
  const n     = data.length
  const min   = 60
  const max   = 100

  const barGap   = 6
  const barW     = Math.max(12, (CHART_W - barGap * (n + 1)) / n)
  const totalUsed = n * barW + (n + 1) * barGap
  const offsetX   = (CHART_W - totalUsed) / 2

  const scaleY = (v: number) => ((v - min) / (max - min)) * CHART_H

  /* 3 y-axis ticks */
  const yTicks = [65, 75, 85, 95]

  return (
    <div
      ref={ref}
      className={cn(
        "relative overflow-hidden rounded-[var(--radius-xl)] border border-border/60",
        "bg-card/70 backdrop-blur-sm p-4 shadow-[var(--shadow-card)]",
        className
      )}
      role="img"
      aria-label="AI match quality trend chart"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px
                   bg-gradient-to-r from-transparent via-[var(--premium-gold)]/30 to-transparent"
      />

      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-bold text-foreground">Match Quality Trend</span>
          <span className="text-[11px] text-muted-foreground">AI match score over time</span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px]">
          <span className="inline-block h-2 w-2 rounded-sm bg-[var(--premium-gold)]" aria-hidden="true" />
          <span className="text-muted-foreground">90%+</span>
          <span className="inline-block h-2 w-2 rounded-sm bg-primary" aria-hidden="true" />
          <span className="text-muted-foreground">85%+</span>
        </div>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} width="100%" aria-hidden="true">
        <defs>
          {data.map((d, i) => {
            const bc = barColor(d.value)
            return (
              <linearGradient key={i} id={`bar-grad-${i}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor={bc.fill} stopOpacity="1" />
                <stop offset="100%" stopColor={bc.fill} stopOpacity="0.5" />
              </linearGradient>
            )
          })}
        </defs>

        {/* Y-axis grid */}
        {yTicks.map(tick => {
          const y = PAD.top + CHART_H - scaleY(tick)
          return (
            <g key={tick}>
              <line
                x1={PAD.left} y1={y} x2={PAD.left + CHART_W} y2={y}
                stroke="oklch(0.5 0 0 / 0.10)" strokeDasharray="3 4" strokeWidth="1"
              />
              <text x={PAD.left - 4} y={y + 3.5} textAnchor="end" fontSize="8" fill="oklch(0.5 0 0 / 0.55)">
                {tick}
              </text>
            </g>
          )
        })}

        {/* Bars */}
        {data.map((d, i) => {
          const bc     = barColor(d.value)
          const bh     = scaleY(d.value)
          const bx     = PAD.left + offsetX + barGap + i * (barW + barGap)
          const by     = PAD.top + CHART_H - bh
          const labelY = H - 8

          return (
            <g key={i}>
              {/* Bar */}
              <motion.rect
                x={bx} y={by}
                width={barW}
                rx="3" ry="3"
                fill={`url(#bar-grad-${i})`}
                initial={{ height: 0, y: PAD.top + CHART_H }}
                animate={inView ? { height: bh, y: by } : {}}
                transition={{ duration: 0.6, delay: 0.1 + i * 0.07, ease: "easeOut" }}
              />

              {/* Glow under bar */}
              {inView && (
                <motion.rect
                  x={bx + 2} y={PAD.top + CHART_H - 4}
                  width={barW - 4} height="8" rx="3"
                  fill={bc.glow}
                  style={{ filter: "blur(4px)" }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.8 }}
                  transition={{ delay: 0.4 + i * 0.07 }}
                />
              )}

              {/* Score label above bar */}
              {inView && (
                <motion.text
                  x={bx + barW / 2} y={by - 4}
                  textAnchor="middle" fontSize="8" fontWeight="700"
                  fill={barColor(d.value).fill}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.55 + i * 0.07 }}
                >
                  {d.value}
                </motion.text>
              )}

              {/* X label */}
              <text x={bx + barW / 2} y={labelY} textAnchor="middle" fontSize="8" fill="oklch(0.5 0 0 / 0.55)">
                {d.label}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
