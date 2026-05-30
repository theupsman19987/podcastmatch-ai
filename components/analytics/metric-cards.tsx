"use client"

import { motion } from "motion/react"
import {
  Eye, Users, Sparkles, Zap, Send, MessageCircle,
  TrendingUp, TrendingDown, Minus,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAnalytics } from "@/components/analytics/analytics-context"

/* ═══════════════════════════════════════════════════════════
   MetricCards — 6 KPI overview cards with inline sparklines.
   ═══════════════════════════════════════════════════════════ */

/* ── Sparkline ────────────────────────────────────────────── */
function Sparkline({
  values,
  color,
  width = 80,
  height = 28,
}: {
  values: number[]
  color:  string
  width?: number
  height?: number
}) {
  const n   = values.length
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1
  const pad = 2

  const pts = values
    .map((v, i) => {
      const x = pad + (i / (n - 1)) * (width - pad * 2)
      const y = height - pad - ((v - min) / range) * (height - pad * 2)
      return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(" ")

  const areaClose = ` ${(pad + (n - 1) / (n - 1) * (width - pad * 2)).toFixed(1)},${height} ${pad},${height}`

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      aria-hidden="true"
      className="shrink-0"
    >
      <defs>
        <linearGradient id={`spark-fill-${color.replace(/[^a-z]/gi, "")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="currentColor" stopOpacity="0.30" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      {/* Area fill */}
      <polyline
        points={`${pts} ${areaClose}`}
        fill={`url(#spark-fill-${color.replace(/[^a-z]/gi, "")})`}
        stroke="none"
        className={color}
      />
      {/* Line */}
      <polyline
        points={pts}
        fill="none"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={color}
        style={{ stroke: "currentColor" }}
      />
      {/* End dot */}
      {(() => {
        const lastPt = pts.split(" ").pop()!
        const [lx, ly] = lastPt.split(",")
        return <circle cx={lx} cy={ly} r="2" fill="currentColor" className={color} />
      })()}
    </svg>
  )
}

/* ── Single metric card ───────────────────────────────────── */
interface CardDef {
  id:      keyof ReturnType<typeof useAnalytics>["metrics"]
  label:   string
  icon:    React.ElementType
  format:  (v: number) => string
  insight: string
  color:   string
  glow:    string
  bg:      string
}

const CARDS: CardDef[] = [
  {
    id:      "visibility",
    label:   "Visibility Score",
    icon:    Eye,
    format:  v => `${v}/100`,
    insight: "Up from last period",
    color:   "text-primary",
    glow:    "shadow-[0_0_20px_oklch(0.55_0.22_264/0.15)]",
    bg:      "bg-primary/5",
  },
  {
    id:      "reach",
    label:   "Audience Reach",
    icon:    Users,
    format:  v => `${v}K`,
    insight: "Potential listener reach",
    color:   "text-[var(--premium-cyan)]",
    glow:    "shadow-[0_0_20px_oklch(0.70_0.16_200/0.12)]",
    bg:      "bg-[oklch(0.70_0.16_200/0.05)]",
  },
  {
    id:      "match",
    label:   "AI Match Quality",
    icon:    Sparkles,
    format:  v => `${v}%`,
    insight: "All-time high",
    color:   "text-[var(--premium-gold)]",
    glow:    "shadow-[0_0_20px_oklch(0.78_0.15_83/0.12)]",
    bg:      "bg-[oklch(0.78_0.15_83/0.05)]",
  },
  {
    id:      "momentum",
    label:   "Discovery Momentum",
    icon:    Zap,
    format:  v => `${v} matches`,
    insight: "New AI matches found",
    color:   "text-[oklch(0.70_0.16_145)]",
    glow:    "shadow-[0_0_20px_oklch(0.55_0.16_145/0.12)]",
    bg:      "bg-[oklch(0.55_0.16_145/0.05)]",
  },
  {
    id:      "outreach",
    label:   "Outreach Activity",
    icon:    Send,
    format:  v => `${v} pitches`,
    insight: "Podcasts contacted",
    color:   "text-[oklch(0.65_0.18_290)]",
    glow:    "shadow-[0_0_20px_oklch(0.55_0.18_290/0.12)]",
    bg:      "bg-[oklch(0.55_0.18_290/0.05)]",
  },
  {
    id:      "response",
    label:   "Response Rate",
    icon:    MessageCircle,
    format:  v => `${v}%`,
    insight: "Host reply rate",
    color:   "text-[oklch(0.75_0.18_30)]",
    glow:    "shadow-[0_0_20px_oklch(0.60_0.200_30/0.12)]",
    bg:      "bg-[oklch(0.60_0.200_30/0.05)]",
  },
]

function MetricCard({ def, index }: { def: CardDef; index: number }) {
  const { metrics } = useAnalytics()
  const snap = metrics[def.id]
  const Icon = def.icon

  const TrendIcon =
    snap.pctDelta > 0 ? TrendingUp :
    snap.pctDelta < 0 ? TrendingDown : Minus

  const trendColor =
    snap.pctDelta > 0 ? "text-[oklch(0.70_0.16_145)]" :
    snap.pctDelta < 0 ? "text-destructive" :
    "text-muted-foreground"

  const sparkColor = def.color

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.08 + index * 0.06 }}
      className={cn(
        "group relative flex flex-col gap-3 overflow-hidden",
        "rounded-[var(--radius-xl)] border border-border/60 p-4",
        "bg-card/70 backdrop-blur-sm",
        "transition-all duration-300",
        "hover:border-border/80",
        def.glow,
      )}
    >
      {/* Top-edge glow on hover */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px
                   bg-gradient-to-r from-transparent via-current to-transparent
                   opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ color: "currentColor" }}
      />

      {/* Faint bg tint */}
      <div aria-hidden className={cn("absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-[var(--radius-xl)]", def.bg)} />

      {/* Header row */}
      <div className="relative flex items-center justify-between">
        <div className={cn(
          "flex h-8 w-8 items-center justify-center rounded-[var(--radius-md)]",
          "border border-border/50 bg-muted/30"
        )}>
          <Icon className={cn("size-4", def.color)} aria-hidden="true" />
        </div>
        <Sparkline values={snap.spark} color={sparkColor} />
      </div>

      {/* Value */}
      <div className="relative flex flex-col gap-0.5">
        <span className={cn("text-2xl font-bold tabular-nums tracking-tight", def.color)}>
          {def.format(snap.current)}
        </span>
        <span className="text-[11px] font-semibold text-muted-foreground">{def.label}</span>
      </div>

      {/* Trend + insight */}
      <div className="relative flex items-center justify-between">
        <div className={cn("flex items-center gap-1 text-[10px] font-semibold", trendColor)}>
          <TrendIcon className="size-3" aria-hidden="true" />
          {snap.pctDelta > 0 ? "+" : ""}{snap.pctDelta}%
        </div>
        <span className="text-[10px] text-muted-foreground">{def.insight}</span>
      </div>
    </motion.div>
  )
}

export function MetricCards() {
  return (
    <div
      className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-6"
      role="region"
      aria-label="Analytics metric overview"
    >
      {CARDS.map((def, i) => (
        <MetricCard key={def.id} def={def} index={i} />
      ))}
    </div>
  )
}
