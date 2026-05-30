"use client"

import { useRef, useMemo } from "react"
import { motion } from "motion/react"
import { useInView } from "motion/react"
import { cn } from "@/lib/utils"
import { useAnalytics } from "@/components/analytics/analytics-context"

/* ═══════════════════════════════════════════════════════════
   VisibilityChart — animated SVG area chart.
   Main chart for the analytics dashboard.
   ═══════════════════════════════════════════════════════════ */

const W   = 560
const H   = 200
const PAD = { top: 16, right: 16, bottom: 32, left: 36 }

const CHART_W = W - PAD.left - PAD.right
const CHART_H = H - PAD.top  - PAD.bottom

/* ── Path computation ─────────────────────────────────────── */
function buildPaths(values: number[]) {
  const n   = values.length
  if (n < 2) return { line: "", area: "", points: [] as { x: number; y: number; v: number }[] }

  const min = Math.floor(Math.min(...values) * 0.9)
  const max = Math.ceil( Math.max(...values) * 1.05)

  const scaleX = (i: number) => PAD.left + (i / (n - 1)) * CHART_W
  const scaleY = (v: number) => PAD.top  + CHART_H - ((v - min) / (max - min)) * CHART_H

  const xs = values.map((_, i) => scaleX(i))
  const ys = values.map(v => scaleY(v))

  /* Smooth bezier: midpoint control points */
  let line = `M ${xs[0].toFixed(1)},${ys[0].toFixed(1)}`
  for (let i = 0; i < n - 1; i++) {
    const cx = ((xs[i] + xs[i + 1]) / 2).toFixed(1)
    line += ` C ${cx},${ys[i].toFixed(1)} ${cx},${ys[i + 1].toFixed(1)} ${xs[i + 1].toFixed(1)},${ys[i + 1].toFixed(1)}`
  }

  const bottomY = (PAD.top + CHART_H).toFixed(1)
  const area = `${line} L ${xs[n - 1].toFixed(1)},${bottomY} L ${xs[0].toFixed(1)},${bottomY} Z`

  const points = xs.map((x, i) => ({ x, y: ys[i], v: values[i] }))

  return { line, area, points, min, max }
}

/* ── Y-axis tick values ───────────────────────────────────── */
function yTicks(min: number, max: number, count = 4): number[] {
  const step = Math.ceil((max - min) / count / 5) * 5
  const ticks: number[] = []
  for (let v = Math.ceil(min / step) * step; v <= max; v += step) ticks.push(v)
  return ticks.slice(0, count + 1)
}

/* ── Main component ───────────────────────────────────────── */
export function VisibilityChart({ className }: { className?: string }) {
  const { visibilitySeries, range } = useAnalytics()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref as React.RefObject<Element>, { once: true })

  const values  = visibilitySeries.map(p => p.value)
  const labels  = visibilitySeries.map(p => p.label)
  const paths   = useMemo(() => buildPaths(values), [values])
  const min     = paths.min ?? 0
  const max     = paths.max ?? 100
  const ticks   = useMemo(() => yTicks(min, max), [min, max])

  /* Decide which X labels to show (show at most 6) */
  const labelIndices = useMemo(() => {
    const n = labels.length
    if (n <= 6) return labels.map((_, i) => i)
    const step = Math.floor(n / 5)
    return [0, step, step * 2, step * 3, step * 4, n - 1]
  }, [labels])

  const GRAD_ID   = "vis-area-fill"
  const GLOW_ID   = "vis-line-glow"
  const CLIP_ID   = "vis-clip"

  const scaleX = (i: number) => PAD.left + (i / (values.length - 1)) * CHART_W
  const scaleY = (v: number) => PAD.top + CHART_H - ((v - min) / (max - min)) * CHART_H

  return (
    <div
      ref={ref}
      className={cn(
        "relative overflow-hidden rounded-[var(--radius-xl)] border border-border/60",
        "bg-card/70 backdrop-blur-sm p-4 shadow-[var(--shadow-card)]",
        className
      )}
      role="img"
      aria-label={`Visibility score growth chart — ${range}`}
    >
      {/* Top-edge highlight */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px
                   bg-gradient-to-r from-transparent via-primary/30 to-transparent"
      />

      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-bold text-foreground">Visibility Score Growth</span>
          <span className="text-[11px] text-muted-foreground">AI-tracked momentum over time</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="inline-block h-0.5 w-6 rounded-full bg-primary" aria-hidden="true" />
          Visibility index
        </div>
      </div>

      {/* Chart */}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={GRAD_ID} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="oklch(0.55 0.22 264)" stopOpacity="0.35" />
            <stop offset="75%"  stopColor="oklch(0.55 0.22 264)" stopOpacity="0.06" />
            <stop offset="100%" stopColor="oklch(0.55 0.22 264)" stopOpacity="0" />
          </linearGradient>
          <filter id={GLOW_ID} x="-20%" y="-100%" width="140%" height="300%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <clipPath id={CLIP_ID}>
            <rect x={PAD.left} y={PAD.top} width={CHART_W} height={CHART_H} />
          </clipPath>
        </defs>

        {/* Grid lines */}
        {ticks.map(tick => {
          const y = scaleY(tick)
          return (
            <g key={tick}>
              <line
                x1={PAD.left} y1={y} x2={PAD.left + CHART_W} y2={y}
                stroke="oklch(0.5 0 0 / 0.12)" strokeDasharray="3 5" strokeWidth="1"
              />
              <text
                x={PAD.left - 6} y={y + 4}
                textAnchor="end" fontSize="9" fill="oklch(0.5 0 0 / 0.6)"
              >
                {tick}
              </text>
            </g>
          )
        })}

        {/* X-axis labels */}
        {labelIndices.map(i => {
          const x = scaleX(i)
          return (
            <text
              key={i}
              x={x} y={H - 6}
              textAnchor="middle" fontSize="9" fill="oklch(0.5 0 0 / 0.55)"
            >
              {labels[i]}
            </text>
          )
        })}

        {/* Clipped chart content */}
        <g clipPath={`url(#${CLIP_ID})`}>
          {/* Area fill */}
          {paths.area && (
            <motion.path
              d={paths.area}
              fill={`url(#${GRAD_ID})`}
              stroke="none"
              initial={{ opacity: 0 }}
              animate={{ opacity: inView ? 1 : 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            />
          )}

          {/* Line (animated draw) */}
          {paths.line && (
            <motion.path
              d={paths.line}
              fill="none"
              stroke="oklch(0.65 0.22 264)"
              strokeWidth="2"
              strokeLinecap="round"
              filter={`url(#${GLOW_ID})`}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: inView ? 1 : 0, opacity: inView ? 1 : 0 }}
              transition={{ duration: 1.4, ease: "easeOut", delay: 0.1 }}
            />
          )}

          {/* Data point dots */}
          {inView && paths.points.map((pt, i) => (
            <motion.circle
              key={i}
              cx={pt.x} cy={pt.y} r="3"
              fill="oklch(0.65 0.22 264)"
              stroke="oklch(0.15 0 0)"
              strokeWidth="1.5"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.8 + i * 0.04, duration: 0.25 }}
            />
          ))}
        </g>

        {/* Current value callout */}
        {inView && paths.points.length > 0 && (() => {
          const last = paths.points[paths.points.length - 1]
          return (
            <motion.g
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.35 }}
            >
              <rect
                x={last.x - 22} y={last.y - 22}
                width="44" height="16" rx="4"
                fill="oklch(0.55 0.22 264)"
              />
              <text
                x={last.x} y={last.y - 10}
                textAnchor="middle" fontSize="9" fontWeight="700"
                fill="white"
              >
                {last.v}
              </text>
            </motion.g>
          )
        })()}
      </svg>
    </div>
  )
}
