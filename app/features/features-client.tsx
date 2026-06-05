"use client"

import { useRef } from "react"
import { motion, useInView } from "motion/react"
import Link from "next/link"
import {
  Eye, Brain, Users, TrendingUp, Target, BookOpen,
  CheckCircle2, XCircle, AlertCircle, ArrowRight,
  Star, Zap, BarChart3, Shield, Bookmark, Sparkles,
  Clock, ChevronRight, Award, Globe, Activity,
  Compass, LineChart, Folder, MessageSquare, Search,
  Bell, FileText,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

/* ─── Animation ─────────────────────────────────────────────────────────── */

const ease = [0.16, 1, 0.3, 1] as const

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20, filter: "blur(4px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  transition: { duration: 0.6, delay, ease },
})

function useSectionView() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true })
  return { ref, isInView }
}

/* ─── Shared Section Primitives ─────────────────────────────────────────── */

function SectionLabel({
  icon: Icon,
  label,
  colorClass,
  isInView,
  delay = 0,
}: {
  icon: React.ElementType
  label: string
  colorClass: string
  isInView: boolean
  delay?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, delay, ease }}
      className="flex items-center gap-2"
    >
      <Icon className={cn("size-4", colorClass)} aria-hidden="true" />
      <span className={cn("text-xs font-semibold uppercase tracking-widest", colorClass)}>
        {label}
      </span>
    </motion.div>
  )
}

function SectionHeading({
  children,
  isInView,
  delay = 0.08,
  id,
}: {
  children: React.ReactNode
  isInView: boolean
  delay?: number
  id?: string
}) {
  return (
    <motion.h2
      id={id}
      initial={{ opacity: 0, y: 12 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease }}
      className="text-3xl font-bold text-foreground sm:text-4xl"
    >
      {children}
    </motion.h2>
  )
}

function SectionSubtext({
  children,
  isInView,
  delay = 0.16,
}: {
  children: React.ReactNode
  isInView: boolean
  delay?: number
}) {
  return (
    <motion.p
      initial={{ opacity: 0, y: 12 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, delay, ease }}
      className="max-w-xl text-base text-muted-foreground"
    >
      {children}
    </motion.p>
  )
}

/* ─── Data ──────────────────────────────────────────────────────────────── */

const VISIBILITY_METRICS = [
  { label: "Visibility Score",   value: 78, colorClass: "text-primary",               barColor: "oklch(0.58 0.22 255)" },
  { label: "Authority Score",    value: 65, colorClass: "text-[var(--premium-cyan)]",  barColor: "oklch(0.70 0.16 200)" },
  { label: "Audience Alignment", value: 82, colorClass: "text-[var(--premium-gold)]",  barColor: "oklch(0.78 0.15 83)"  },
  { label: "Message Clarity",    value: 71, colorClass: "text-primary",               barColor: "oklch(0.58 0.22 255)" },
  { label: "Growth Potential",   value: 88, colorClass: "text-[var(--premium-cyan)]",  barColor: "oklch(0.70 0.16 200)" },
]

const GAP_ITEMS: { label: string; severity: "high" | "medium" }[] = [
  { label: "No media kit found",            severity: "high"   },
  { label: "Website authority: Low",        severity: "high"   },
  { label: "Positioning statement unclear", severity: "medium" },
  { label: "No social proof indicators",    severity: "high"   },
  { label: "Limited content footprint",     severity: "medium" },
]

const IMPROVEMENT_ACTIONS = [
  { action: "Create a professional media kit",       points: 8 },
  { action: "Add authority credentials to profile",  points: 6 },
  { action: "Clarify your core message",             points: 5 },
  { action: "Add testimonials and case studies",     points: 7 },
  { action: "Build a consistent content presence",   points: 4 },
]

const DISCOVERY_FEED = [
  {
    name: "The Tim Ferriss Show",
    host: "Tim Ferriss",
    matchScore: 94,
    tag: "Entrepreneurship",
    gradient: "linear-gradient(135deg, oklch(0.30 0.12 255), oklch(0.20 0.08 255))",
  },
  {
    name: "How I Built This",
    host: "Guy Raz",
    matchScore: 88,
    tag: "Business",
    gradient: "linear-gradient(135deg, oklch(0.28 0.10 200), oklch(0.18 0.07 200))",
  },
  {
    name: "The Ed Mylett Show",
    host: "Ed Mylett",
    matchScore: 91,
    tag: "Leadership",
    gradient: "linear-gradient(135deg, oklch(0.32 0.14 83), oklch(0.22 0.10 83))",
  },
]

const MATCH_DIMENSIONS = [
  { label: "Topic Alignment",        value: 96, color: "oklch(0.58 0.22 255)" },
  { label: "Audience Fit",           value: 92, color: "oklch(0.70 0.16 200)" },
  { label: "Authority Compatibility", value: 88, color: "oklch(0.78 0.15 83)"  },
  { label: "Visibility Potential",   value: 97, color: "oklch(0.58 0.22 255)" },
  { label: "Opportunity Score",      value: 91, color: "oklch(0.70 0.16 200)" },
]

const COMPARISON_ROWS = [
  { label: "Visibility Intelligence",   traditional: false, podmatch: true  },
  { label: "Improvement Roadmap",       traditional: false, podmatch: true  },
  { label: "AI Podcast Discovery",      traditional: false, podmatch: true  },
  { label: "AI Match Scoring",          traditional: false, podmatch: true  },
  { label: "Authority Analysis",        traditional: false, podmatch: true  },
  { label: "Growth Tracking",           traditional: false, podmatch: true  },
  { label: "Audience Alignment Score",  traditional: false, podmatch: true  },
  { label: "Keyword Search",            traditional: true,  podmatch: true  },
  { label: "Directory Listings",        traditional: true,  podmatch: false },
  { label: "Cold Outreach Blasting",    traditional: true,  podmatch: false },
]

const PIPELINE_COLUMNS = [
  {
    label: "Saved",
    borderColor: "border-primary/25",
    labelColor: "text-primary/70",
    cards: [
      { name: "The Tim Ferriss Show", score: 94 },
      { name: "Masters of Scale",     score: 88 },
    ],
  },
  {
    label: "In Progress",
    borderColor: "border-[oklch(0.70_0.16_200/0.25)]",
    labelColor: "text-[var(--premium-cyan)]/70",
    cards: [
      { name: "How I Built This",    score: 91 },
      { name: "School of Greatness", score: 86 },
    ],
  },
  {
    label: "Applied",
    borderColor: "border-[oklch(0.78_0.15_83/0.25)]",
    labelColor: "text-[var(--premium-gold)]/70",
    cards: [
      { name: "Entrepreneurs on Fire", score: 83 },
    ],
  },
]

/* ─── Mockup: Visibility Dashboard ─────────────────────────────────────── */

function VisibilityDashboardMockup() {
  const r = 48
  const C = 2 * Math.PI * r
  const pct = 0.78
  const filled = +(C * pct).toFixed(1)
  const gap    = +(C * (1 - pct)).toFixed(1)

  return (
    <div className="glass-strong relative overflow-hidden rounded-[var(--radius-xl)] border border-primary/20 p-5 shadow-[var(--shadow-lg),var(--glow-subtle)]">
      {/* Live header */}
      <div className="mb-5 flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
        </span>
        <span className="text-xs font-semibold text-primary">
          Visibility Intelligence · Live Analysis
        </span>
      </div>

      {/* Ring + metrics */}
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">

        {/* Score ring */}
        <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
          <svg
            viewBox="0 0 120 120"
            className="h-32 w-32"
            aria-label="Visibility score: 78 out of 100"
          >
            <circle
              cx="60" cy="60" r={r}
              fill="none"
              stroke="oklch(0.25 0.05 255 / 0.25)"
              strokeWidth="9"
            />
            <circle
              cx="60" cy="60" r={r}
              fill="none"
              stroke="oklch(0.58 0.22 255)"
              strokeWidth="9"
              strokeLinecap="round"
              strokeDasharray={`${filled} ${gap}`}
              transform="rotate(-90 60 60)"
              style={{ filter: "drop-shadow(0 0 8px oklch(0.58 0.22 255 / 0.55))" }}
            />
            <text
              x="60" y="52"
              textAnchor="middle"
              dominantBaseline="middle"
              fill="white"
              fontSize="24"
              fontWeight="800"
              fontFamily="system-ui, sans-serif"
            >
              78
            </text>
            <text
              x="60" y="70"
              textAnchor="middle"
              dominantBaseline="middle"
              fill="oklch(0.55 0.06 255)"
              fontSize="10"
              fontFamily="system-ui, sans-serif"
            >
              /100 Score
            </text>
          </svg>
          <p className="text-[10px] text-muted-foreground">Overall Visibility</p>
        </div>

        {/* Metric bars */}
        <div className="flex w-full flex-1 flex-col gap-3">
          {VISIBILITY_METRICS.map(({ label, value, colorClass, barColor }) => (
            <div key={label} className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-muted-foreground">{label}</span>
                <span className={cn("text-[11px] font-bold", colorClass)}>{value}</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-white/8">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${value}%`, backgroundColor: barColor }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-5 flex items-center gap-1.5 border-t border-border/30 pt-3">
        <Zap className="size-3 text-[var(--premium-gold)]" aria-hidden />
        <span className="text-[10px] text-muted-foreground">
          AI-analyzed in real time · Updated 2 min ago
        </span>
      </div>
    </div>
  )
}

/* ─── Mockup: Creator Profile Card ─────────────────────────────────────── */

function ProfileCardMockup() {
  return (
    <div className="glass-strong relative overflow-hidden rounded-[var(--radius-xl)] border border-[oklch(0.70_0.16_200/0.25)] p-5 shadow-[var(--shadow-lg)]">
      {/* Header row */}
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full gradient-primary text-sm font-bold text-white shadow-md">
          SK
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-foreground">Sarah Kellerman</p>
          <p className="text-[11px] text-muted-foreground">Leadership Coach · Author</p>
        </div>
        <span className="flex items-center gap-1 rounded-full border border-[oklch(0.70_0.16_200/0.30)] bg-[oklch(0.70_0.16_200/0.08)] px-2 py-0.5 text-[10px] font-bold text-[var(--premium-cyan)]">
          <CheckCircle2 className="size-2.5" aria-hidden />
          Verified
        </span>
      </div>

      {/* Expertise tags */}
      <div className="mb-3 flex flex-wrap gap-1.5">
        {["Leadership", "Organizational Culture", "Executive Coaching", "Women in Business"].map(tag => (
          <span
            key={tag}
            className="rounded-full border border-border/50 bg-muted/30 px-2 py-0.5 text-[10px] text-muted-foreground"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Audience + positioning */}
      <div className="mb-3 space-y-2">
        <div className="rounded-lg border border-border/40 bg-muted/20 p-2.5">
          <p className="mb-0.5 text-[10px] uppercase tracking-wider text-muted-foreground/60">
            Target Audience
          </p>
          <p className="text-[11px] text-foreground">
            Mid-level managers and aspiring executives in corporate environments
          </p>
        </div>
        <div className="rounded-lg border border-border/40 bg-muted/20 p-2.5">
          <p className="mb-0.5 text-[10px] uppercase tracking-wider text-muted-foreground/60">
            Core Message
          </p>
          <p className="text-[11px] text-foreground">
            Authentic leadership creates cultures that outperform
          </p>
        </div>
      </div>

      {/* Authority indicators */}
      <div className="flex items-center justify-around border-t border-border/30 pt-3">
        {[
          { label: "Authority",  value: "High"     },
          { label: "Reach",      value: "Growing"  },
          { label: "Profile",    value: "Complete" },
        ].map(({ label, value }) => (
          <div key={label} className="text-center">
            <p className="text-[10px] text-muted-foreground">{label}</p>
            <p className="text-[11px] font-bold gradient-text-cyan">{value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── Mockup: Discovery Feed ────────────────────────────────────────────── */

function DiscoveryFeedMockup({ isInView }: { isInView: boolean }) {
  return (
    <div className="space-y-2.5">
      {/* Status bar */}
      <div className="glass flex items-center gap-2 rounded-xl border border-border px-3 py-2">
        <span className="relative flex h-1.5 w-1.5 flex-shrink-0">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--premium-cyan)] opacity-60" aria-hidden />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--premium-cyan)]" aria-hidden />
        </span>
        <span className="text-[10px] font-semibold text-[var(--premium-cyan)]">
          AI Discovery Engine · 847 opportunities curated for you
        </span>
      </div>

      {/* Podcast cards */}
      {DISCOVERY_FEED.map(({ name, host, matchScore, tag, gradient }, i) => (
        <motion.div
          key={name}
          initial={{ opacity: 0, x: -12 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.3 + i * 0.1, duration: 0.45, ease }}
          className="glass flex items-center gap-3 rounded-xl border border-border/60 p-3"
        >
          <div
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg text-[11px] font-bold text-white/50"
            style={{ background: gradient }}
            aria-hidden
          >
            {name.split(" ").map(w => w[0]).join("").slice(0, 2)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate text-[12px] font-bold text-foreground">{name}</p>
            <p className="text-[10px] text-muted-foreground">{host}</p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
              {matchScore}%
            </span>
            <span className="rounded border border-border/40 bg-muted/20 px-1.5 text-[8px] text-muted-foreground">
              {tag}
            </span>
          </div>
        </motion.div>
      ))}

      <p className="text-center text-[10px] text-muted-foreground">
        +844 more opportunities curated for your profile
      </p>
    </div>
  )
}

/* ─── Mockup: AI Match Score ────────────────────────────────────────────── */

function MatchScoreMockup({ isInView }: { isInView: boolean }) {
  return (
    <div className="glass-strong relative overflow-hidden rounded-[var(--radius-xl)] border border-primary/20 p-5 shadow-[var(--shadow-lg),var(--glow-subtle)]">
      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-[10px] text-muted-foreground">Analyzing match with</p>
          <p className="text-sm font-bold text-foreground">The Tim Ferriss Show</p>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-3xl font-black gradient-text-primary">94%</span>
          <span className="text-[10px] text-muted-foreground">match score</span>
        </div>
      </div>

      {/* Dimension bars */}
      <div className="space-y-3">
        {MATCH_DIMENSIONS.map(({ label, value, color }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, x: -8 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3 + i * 0.07, duration: 0.4, ease }}
            className="space-y-1"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground">{label}</span>
              <span className="text-[11px] font-bold text-foreground">{value}%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-white/8">
              <div
                className="h-full rounded-full"
                style={{ width: `${value}%`, backgroundColor: color, boxShadow: `0 0 6px ${color}60` }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* AI insight */}
      <div className="mt-4 flex items-center gap-2 rounded-lg border border-primary/15 bg-primary/5 p-2.5">
        <Brain className="size-3.5 flex-shrink-0 text-primary" aria-hidden />
        <p className="text-[10px] text-muted-foreground">
          AI recommends this show for your{" "}
          <span className="font-medium text-foreground">leadership & culture</span> content angle
        </p>
      </div>
    </div>
  )
}

/* ─── Mockup: Improvement Roadmap ───────────────────────────────────────── */

function RoadmapMockup({ isInView }: { isInView: boolean }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {/* Gaps panel */}
      <div className="glass-strong overflow-hidden rounded-[var(--radius-xl)] border border-red-500/20 p-4">
        <div className="mb-3 flex items-center gap-2">
          <AlertCircle className="size-4 text-red-400" aria-hidden />
          <span className="text-xs font-semibold text-red-400">Gaps Identified</span>
        </div>
        <div className="space-y-2.5">
          {GAP_ITEMS.map(({ label, severity }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, x: -8 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.25 + i * 0.07, duration: 0.4, ease }}
              className="flex items-center gap-2.5"
            >
              <span className={cn(
                "h-2 w-2 flex-shrink-0 rounded-full",
                severity === "high" ? "bg-red-400" : "bg-amber-400"
              )} />
              <span className="flex-1 text-[11px] text-muted-foreground">{label}</span>
              <span className={cn(
                "rounded-full border px-1.5 py-0.5 text-[9px] font-medium",
                severity === "high"
                  ? "border-red-500/30 bg-red-500/10 text-red-400"
                  : "border-amber-500/30 bg-amber-500/10 text-amber-400"
              )}>
                {severity}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Actions panel */}
      <div className="glass-strong overflow-hidden rounded-[var(--radius-xl)] border border-[oklch(0.65_0.15_145/0.25)] p-4">
        <div className="mb-3 flex items-center gap-2">
          <CheckCircle2 className="size-4 text-[oklch(0.65_0.15_145)]" aria-hidden />
          <span className="text-xs font-semibold text-[oklch(0.65_0.15_145)]">
            Recommended Actions
          </span>
        </div>
        <div className="space-y-2.5">
          {IMPROVEMENT_ACTIONS.map(({ action, points }, i) => (
            <motion.div
              key={action}
              initial={{ opacity: 0, x: 8 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.3 + i * 0.07, duration: 0.4, ease }}
              className="flex items-center gap-2"
            >
              <ChevronRight className="size-3 flex-shrink-0 text-[oklch(0.65_0.15_145)]" aria-hidden />
              <span className="flex-1 text-[11px] text-muted-foreground">{action}</span>
              <span className="flex-shrink-0 rounded-full border border-[oklch(0.65_0.15_145/0.30)] bg-[oklch(0.65_0.15_145/0.08)] px-1.5 py-0.5 text-[9px] font-bold text-[oklch(0.65_0.15_145)]">
                +{points} pts
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─── Mockup: Growth Chart ──────────────────────────────────────────────── */

function GrowthChartMockup() {
  const points: [number, number][] = [
    [0, 68], [60, 55], [120, 42], [180, 32], [240, 22], [300, 16],
  ]
  const polyPoints = points.map(([x, y]) => `${x},${y}`).join(" ")
  const polygonPoints = `0,68 ${points.map(([x, y]) => `${x},${y}`).join(" ")} 300,80 0,80`

  return (
    <div className="glass-strong overflow-hidden rounded-[var(--radius-xl)] border border-border p-4">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-foreground">Visibility Score</p>
          <p className="text-[10px] text-muted-foreground">Last 6 months</p>
        </div>
        <div className="flex items-center gap-1.5">
          <TrendingUp className="size-3.5 text-[oklch(0.65_0.15_145)]" aria-hidden />
          <span className="text-sm font-bold text-[oklch(0.65_0.15_145)]">+33 pts</span>
        </div>
      </div>

      {/* Chart */}
      <div className="overflow-hidden rounded-lg bg-black/20 p-2">
        <svg viewBox="0 0 300 80" className="w-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="featChartGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="oklch(0.58 0.22 255)" stopOpacity="0.25" />
              <stop offset="100%" stopColor="oklch(0.58 0.22 255)" stopOpacity="0"    />
            </linearGradient>
          </defs>
          <polygon points={polygonPoints} fill="url(#featChartGrad)" />
          <polyline
            points={polyPoints}
            fill="none"
            stroke="oklch(0.58 0.22 255)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {points.map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="3.5" fill="oklch(0.58 0.22 255)" />
          ))}
        </svg>
        <div className="mt-1 flex justify-between px-1">
          {["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map(m => (
            <span key={m} className="text-[8px] text-muted-foreground">{m}</span>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="mt-3 grid grid-cols-3 gap-2 border-t border-border/30 pt-3">
        {[
          { label: "Started At",     value: "45" },
          { label: "Current Score",  value: "78" },
          { label: "Matches Sent",   value: "23" },
        ].map(({ label, value }) => (
          <div key={label} className="text-center">
            <p className="text-sm font-bold gradient-text-primary">{value}</p>
            <p className="text-[9px] text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── Mockup: Opportunity Pipeline ─────────────────────────────────────── */

function PipelineMockup({ isInView }: { isInView: boolean }) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {PIPELINE_COLUMNS.map(({ label, borderColor, labelColor, cards }, colIdx) => (
        <div
          key={label}
          className={cn(
            "glass-strong overflow-hidden rounded-[var(--radius-xl)] border p-3",
            borderColor
          )}
        >
          <p className={cn("mb-3 text-[11px] font-semibold uppercase tracking-wider", labelColor)}>
            {label} · {cards.length}
          </p>
          <div className="space-y-2">
            {cards.map(({ name, score }, i) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, y: 8 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2 + colIdx * 0.08 + i * 0.06, duration: 0.4, ease }}
                className="flex items-center gap-2 rounded-lg border border-border/40 bg-muted/20 p-2"
              >
                <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md gradient-primary text-[9px] font-bold text-white">
                  {name.split(" ").map(w => w[0]).join("").slice(0, 2)}
                </div>
                <p className="flex-1 min-w-0 truncate text-[10px] font-medium text-foreground">
                  {name}
                </p>
                <span className="text-[9px] font-bold text-primary">{score}%</span>
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   SECTION 1 — HERO
═══════════════════════════════════════════════════════════════════════════ */

function FeaturesHero() {
  return (
    <section className="relative overflow-hidden pb-16 pt-28" aria-label="Features hero">
      {/* Glows */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-20 left-1/2 -z-10 h-[500px] w-[700px] -translate-x-1/2 rounded-full blur-3xl"
        style={{ background: "radial-gradient(ellipse at center, oklch(0.58 0.22 255 / 0.12), transparent 65%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-1/3 -z-10 h-[400px] w-[400px] rounded-full blur-3xl"
        style={{ background: "radial-gradient(ellipse at center, oklch(0.70 0.16 200 / 0.07), transparent 65%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-20 top-1/4 -z-10 h-[350px] w-[350px] rounded-full blur-3xl"
        style={{ background: "radial-gradient(ellipse at center, oklch(0.78 0.15 83 / 0.05), transparent 65%)" }}
      />

      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-7 text-center">

          {/* Badge */}
          <motion.div {...fadeUp(0.1)}>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/8 px-3.5 py-1.5">
              <Sparkles className="size-3.5 text-primary" aria-hidden />
              <span className="text-xs font-semibold text-primary">Capabilities Overview</span>
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            {...fadeUp(0.18)}
            className="text-hero mx-auto max-w-3xl text-center"
          >
            Everything You Need To{" "}
            <span className="gradient-text-primary text-glow-primary">
              Grow Your Podcast Visibility
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            {...fadeUp(0.26)}
            className="mx-auto max-w-2xl text-lg leading-relaxed text-muted-foreground"
          >
            Discover the tools, intelligence, and insights designed to help speakers, authors,
            coaches, consultants, and experts get discovered by the right podcasts.
          </motion.p>

          {/* Capability badges */}
          <motion.div
            {...fadeUp(0.34)}
            className="flex flex-wrap items-center justify-center gap-2.5"
            aria-label="Key capabilities"
          >
            {[
              { label: "Visibility Intelligence", color: "primary" },
              { label: "AI Matching System",      color: "primary" },
              { label: "Discovery Engine",        color: "cyan"    },
              { label: "Growth Tracking",         color: "gold"    },
              { label: "Improvement Roadmap",     color: "gold"    },
              { label: "Creator Profile",         color: "cyan"    },
            ].map(({ label, color }) => (
              <span
                key={label}
                className={cn(
                  "glass rounded-full border px-3.5 py-1.5 text-xs font-medium",
                  color === "primary" && "border-primary/25 text-primary",
                  color === "cyan"    && "border-[oklch(0.70_0.16_200/0.25)] text-[var(--premium-cyan)]",
                  color === "gold"    && "border-[oklch(0.78_0.15_83/0.25)] text-[var(--premium-gold)]",
                )}
              >
                {label}
              </span>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   SECTION 2 — VISIBILITY INTELLIGENCE (Flagship)
═══════════════════════════════════════════════════════════════════════════ */

function VisibilityIntelligenceSection() {
  const { ref, isInView } = useSectionView()

  const capabilities = [
    { icon: Eye,         label: "Visibility Score",    desc: "See exactly how visible you are to podcast hosts right now" },
    { icon: Award,       label: "Authority Score",     desc: "Understand your perceived expertise and credibility level" },
    { icon: Users,       label: "Audience Alignment",  desc: "Measure how well your audience matches each show's listeners" },
    { icon: MessageSquare, label: "Message Clarity",   desc: "Evaluate how clearly your core expertise is communicated" },
    { icon: TrendingUp,  label: "Growth Potential",    desc: "Identify your highest-leverage visibility opportunities" },
  ]

  return (
    <section
      ref={ref}
      className="relative overflow-hidden py-24"
      aria-labelledby="visibility-heading"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 -z-10 w-1/2"
        style={{ background: "radial-gradient(ellipse at left center, oklch(0.58 0.22 255 / 0.05), transparent 60%)" }}
      />

      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-center lg:gap-16">

          {/* Left: content */}
          <div className="flex w-full flex-col gap-6 lg:w-[46%]">
            <SectionLabel
              icon={Brain}
              label="Flagship Capability"
              colorClass="text-primary"
              isInView={isInView}
            />
            <SectionHeading id="visibility-heading" isInView={isInView} delay={0.08}>
              <span className="gradient-text-primary">Visibility Intelligence</span>
            </SectionHeading>
            <SectionSubtext isInView={isInView} delay={0.16}>
              Understand exactly how visible, discoverable, and podcast-ready you are —
              not a guess, but an AI-powered analysis of your specific profile across every
              dimension that podcast hosts actually evaluate.
            </SectionSubtext>

            <div className="space-y-2.5">
              {capabilities.map(({ icon: Icon, label, desc }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, x: -12 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.24 + i * 0.08, duration: 0.45, ease }}
                  className="flex items-start gap-3 rounded-xl border border-border/50 bg-muted/20 p-3"
                >
                  <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="size-3.5 text-primary" aria-hidden />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{label}</p>
                    <p className="text-xs text-muted-foreground">{desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right: dashboard mockup */}
          <motion.div
            className="w-full lg:flex-1"
            initial={{ opacity: 0, x: 30, scale: 0.97 }}
            animate={isInView ? { opacity: 1, x: 0, scale: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.15, ease }}
          >
            <VisibilityDashboardMockup />
          </motion.div>

        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   SECTION 3 — CREATOR PROFILE SYSTEM
═══════════════════════════════════════════════════════════════════════════ */

function CreatorProfileSection() {
  const { ref, isInView } = useSectionView()

  const capabilities = [
    "Professional expert profile with expertise positioning",
    "Expertise categories and speaking topics",
    "Target audience definition and demographics",
    "Positioning statement analysis and refinement",
    "Authority indicators and credential display",
  ]

  const outcomes = [
    { label: "Better Matches",       desc: "Aligned to your actual expertise and message" },
    { label: "Better Opportunities", desc: "Right-fit shows, not just available shows"    },
    { label: "Better Visibility",    desc: "Profile built to be discoverable by hosts"    },
  ]

  return (
    <section
      ref={ref}
      className="relative py-24"
      aria-labelledby="profile-heading"
    >
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-12 lg:flex-row-reverse lg:items-center lg:gap-16">

          {/* Right (reversed): content */}
          <div className="flex w-full flex-col gap-6 lg:w-[46%]">
            <SectionLabel
              icon={BookOpen}
              label="Creator Profile System"
              colorClass="text-[var(--premium-cyan)]"
              isInView={isInView}
            />
            <SectionHeading id="profile-heading" isInView={isInView} delay={0.08}>
              Build A Profile That{" "}
              <span className="gradient-text-cyan">Represents Your Expertise</span>
            </SectionHeading>
            <SectionSubtext isInView={isInView} delay={0.16}>
              Your profile is not a resume. It's the intelligence layer that helps AI match
              you with podcasts genuinely aligned with your message, audience, and authority.
            </SectionSubtext>

            <div className="space-y-2">
              {capabilities.map((cap, i) => (
                <motion.div
                  key={cap}
                  initial={{ opacity: 0, x: 10 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.24 + i * 0.07, duration: 0.4, ease }}
                  className="flex items-start gap-2.5"
                >
                  <CheckCircle2 className="size-4 flex-shrink-0 mt-0.5 text-[var(--premium-cyan)]" aria-hidden />
                  <span className="text-sm text-foreground">{cap}</span>
                </motion.div>
              ))}
            </div>

            {/* Outcome chips */}
            <div className="grid gap-2 sm:grid-cols-3">
              {outcomes.map(({ label, desc }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.44 + i * 0.08, duration: 0.4, ease }}
                  className="rounded-xl border border-[oklch(0.70_0.16_200/0.20)] bg-[oklch(0.70_0.16_200/0.04)] p-3"
                >
                  <p className="text-xs font-bold gradient-text-cyan">{label}</p>
                  <p className="mt-0.5 text-[10px] text-muted-foreground">{desc}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Left (reversed): mockup */}
          <motion.div
            className="w-full lg:flex-1"
            initial={{ opacity: 0, x: -30, scale: 0.97 }}
            animate={isInView ? { opacity: 1, x: 0, scale: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.15, ease }}
          >
            <ProfileCardMockup />
          </motion.div>

        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   SECTION 4 — PODCAST DISCOVERY ENGINE
═══════════════════════════════════════════════════════════════════════════ */

function DiscoveryEngineSection() {
  const { ref, isInView } = useSectionView()

  const capabilities = [
    { icon: Sparkles,   label: "Smart Recommendations",   desc: "Curated to your profile, not reverse-chronological" },
    { icon: Award,      label: "High Authority Shows",     desc: "Established podcasts with proven, engaged audiences" },
    { icon: Globe,      label: "Hidden Gems",              desc: "Rising shows with perfectly aligned listener bases"  },
    { icon: TrendingUp, label: "Trending Opportunities",   desc: "Shows gaining momentum in your exact niche"         },
    { icon: Target,     label: "Niche Audience Discovery", desc: "Highly targeted shows with ideal audience overlap"   },
  ]

  return (
    <section
      ref={ref}
      className="relative overflow-hidden py-24"
      aria-labelledby="discovery-heading"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 -z-10 w-1/2"
        style={{ background: "radial-gradient(ellipse at right center, oklch(0.70 0.16 200 / 0.05), transparent 60%)" }}
      />

      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:gap-16">

          {/* Left: content */}
          <div className="flex w-full flex-col gap-6 lg:w-[44%]">
            <SectionLabel
              icon={Search}
              label="Podcast Discovery Engine"
              colorClass="text-[var(--premium-cyan)]"
              isInView={isInView}
            />
            <SectionHeading id="discovery-heading" isInView={isInView} delay={0.08}>
              Discover Opportunities{" "}
              <span className="gradient-text-cyan">Aligned With Your Message</span>
            </SectionHeading>
            <SectionSubtext isInView={isInView} delay={0.16}>
              Not a search bar. Not a directory. An intelligent discovery engine that surfaces
              podcast opportunities curated specifically to your expertise, audience, and
              visibility goals — updated continuously as you improve your profile.
            </SectionSubtext>

            <div className="space-y-3">
              {capabilities.map(({ icon: Icon, label, desc }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, x: -10 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.24 + i * 0.07, duration: 0.4, ease }}
                  className="flex items-start gap-3"
                >
                  <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg border border-[oklch(0.70_0.16_200/0.20)] bg-[oklch(0.70_0.16_200/0.07)]">
                    <Icon className="size-3.5 text-[var(--premium-cyan)]" aria-hidden />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{label}</p>
                    <p className="text-xs text-muted-foreground">{desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right: discovery feed */}
          <motion.div
            className="w-full lg:flex-1"
            initial={{ opacity: 0, x: 30, scale: 0.97 }}
            animate={isInView ? { opacity: 1, x: 0, scale: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.15, ease }}
          >
            <DiscoveryFeedMockup isInView={isInView} />
          </motion.div>

        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   SECTION 5 — AI MATCHING SYSTEM
═══════════════════════════════════════════════════════════════════════════ */

function AIMatchingSection() {
  const { ref, isInView } = useSectionView()

  const dimensions = [
    { label: "Topic Alignment",        desc: "How well your expertise maps to their content format"     },
    { label: "Audience Fit",           desc: "Overlap between your ideal listener and their subscriber base" },
    { label: "Authority Compatibility", desc: "Your credibility level relative to the show's guest tier" },
    { label: "Visibility Potential",   desc: "Expected reach and exposure from appearing on this show"   },
    { label: "Opportunity Score",      desc: "Composite match score weighted to your current goals"      },
  ]

  return (
    <section
      ref={ref}
      className="relative overflow-hidden py-24"
      aria-labelledby="matching-heading"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{ background: "radial-gradient(ellipse at center, oklch(0.58 0.22 255 / 0.04), transparent 70%)" }}
      />

      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-12 flex flex-col items-center gap-4 text-center">
          <SectionLabel
            icon={Brain}
            label="AI Matching System"
            colorClass="text-primary"
            isInView={isInView}
            delay={0}
          />
          <SectionHeading id="matching-heading" isInView={isInView} delay={0.08}>
            Match With The{" "}
            <span className="gradient-text-primary">Right Podcasts</span>
          </SectionHeading>
          <SectionSubtext isInView={isInView} delay={0.16}>
            Every recommendation comes with a multi-dimensional match score so you know
            exactly why a podcast is right for you — not just a number, but the full reasoning.
          </SectionSubtext>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-12">

          {/* Match mockup */}
          <motion.div
            className="w-full lg:w-[50%]"
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 0.65, delay: 0.2, ease }}
          >
            <MatchScoreMockup isInView={isInView} />
          </motion.div>

          {/* Dimension explanations */}
          <div className="flex w-full flex-col gap-2.5 lg:flex-1">
            {dimensions.map(({ label, desc }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, x: 16 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.28 + i * 0.08, duration: 0.45, ease }}
                className="flex items-start gap-3 rounded-xl border border-border/50 bg-muted/15 p-3.5"
              >
                <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary/15 text-[10px] font-bold text-primary">
                  {i + 1}
                </span>
                <div>
                  <p className="text-sm font-semibold text-foreground">{label}</p>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   SECTION 6 — IMPROVEMENT ROADMAP (Major Differentiator)
═══════════════════════════════════════════════════════════════════════════ */

function ImprovementRoadmapSection() {
  const { ref, isInView } = useSectionView()

  return (
    <section
      ref={ref}
      className="relative overflow-hidden py-24"
      aria-labelledby="roadmap-heading"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{ background: "radial-gradient(ellipse at center, oklch(0.78 0.15 83 / 0.04), transparent 70%)" }}
      />

      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-10 flex flex-col items-center gap-4 text-center">
          <SectionLabel
            icon={Compass}
            label="Major Differentiator"
            colorClass="text-[var(--premium-gold)]"
            isInView={isInView}
            delay={0}
          />
          <SectionHeading id="roadmap-heading" isInView={isInView} delay={0.08}>
            Know Exactly What{" "}
            <span className="gradient-text-gold">To Improve</span>
          </SectionHeading>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.45, delay: 0.16, ease }}
            className="mx-auto max-w-2xl text-base text-muted-foreground"
          >
            Most platforms tell you to search. PodcastMatch AI tells you what's holding you
            back — and exactly what to do about it. This capability exists nowhere else in
            the podcast guest booking space.
          </motion.p>
        </div>

        {/* Call-out banner */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.24, duration: 0.5, ease }}
          className="mb-8 rounded-xl border border-[oklch(0.78_0.15_83/0.25)] bg-[oklch(0.78_0.15_83/0.04)] p-4 text-center"
        >
          <p className="text-sm text-muted-foreground">
            The AI analyzes your profile against{" "}
            <span className="font-semibold text-[var(--premium-gold)]">50+ visibility factors</span>
            {" "}— identifies every gap, then generates a personalized improvement plan
            with measurable point values for each action.
          </p>
        </motion.div>

        {/* Roadmap mockup */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3, duration: 0.55, ease }}
        >
          <RoadmapMockup isInView={isInView} />
        </motion.div>

        {/* Gap example pills */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.45, duration: 0.5, ease }}
          className="mt-8 flex flex-wrap items-center justify-center gap-2"
        >
          <span className="text-xs text-muted-foreground">Common gaps we find:</span>
          {[
            "Missing website",
            "Weak positioning",
            "No media kit",
            "Missing social proof",
            "Limited authority signals",
            "Unclear niche",
            "No speaking reel",
          ].map(gap => (
            <span
              key={gap}
              className="rounded-full border border-red-500/20 bg-red-500/8 px-2.5 py-1 text-[10px] text-red-400"
            >
              {gap}
            </span>
          ))}
        </motion.div>

      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   SECTION 7 — GROWTH TRACKING
═══════════════════════════════════════════════════════════════════════════ */

function GrowthTrackingSection() {
  const { ref, isInView } = useSectionView()

  const capabilities = [
    { icon: BarChart3,   label: "Visibility Score Tracking", desc: "Watch your score rise as you optimize your presence"       },
    { icon: Activity,    label: "Profile Improvements",      desc: "See how each profile update impacts your overall visibility" },
    { icon: Clock,       label: "Opportunity History",       desc: "Track every podcast opportunity you've explored over time"  },
    { icon: Zap,         label: "Match Activity",            desc: "Monitor how AI recommendations evolve with your profile"    },
    { icon: LineChart,   label: "Growth Trends",             desc: "Identify which improvements drive the biggest visibility gains" },
  ]

  return (
    <section
      ref={ref}
      className="relative py-24"
      aria-labelledby="growth-heading"
    >
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-center lg:gap-16">

          {/* Left: content */}
          <div className="flex w-full flex-col gap-6 lg:w-[44%]">
            <SectionLabel
              icon={TrendingUp}
              label="Growth Tracking"
              colorClass="text-primary"
              isInView={isInView}
            />
            <SectionHeading id="growth-heading" isInView={isInView} delay={0.08}>
              Measure{" "}
              <span className="gradient-text-primary">Progress Over Time</span>
            </SectionHeading>
            <SectionSubtext isInView={isInView} delay={0.16}>
              Visibility isn't a static score. It grows as you improve your profile, build
              authority, and create more opportunities. Track every gain and know what's driving it.
            </SectionSubtext>

            <div className="space-y-3">
              {capabilities.map(({ icon: Icon, label, desc }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, x: -10 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.24 + i * 0.07, duration: 0.4, ease }}
                  className="flex items-start gap-3"
                >
                  <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="size-3.5 text-primary" aria-hidden />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{label}</p>
                    <p className="text-xs text-muted-foreground">{desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right: chart mockup */}
          <motion.div
            className="w-full lg:flex-1"
            initial={{ opacity: 0, x: 30, scale: 0.97 }}
            animate={isInView ? { opacity: 1, x: 0, scale: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.2, ease }}
          >
            <GrowthChartMockup />
          </motion.div>

        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   SECTION 8 — OPPORTUNITY MANAGEMENT
═══════════════════════════════════════════════════════════════════════════ */

function OpportunityManagementSection() {
  const { ref, isInView } = useSectionView()

  const capabilities = [
    { icon: Bookmark,  label: "Saved Opportunities",   desc: "Bookmark any show to revisit later"          },
    { icon: Star,      label: "Favorites",              desc: "Mark your highest-priority targets"          },
    { icon: Activity,  label: "Status Tracking",        desc: "Know where every opportunity stands"         },
    { icon: FileText,  label: "Notes",                  desc: "Add research and context to each show"       },
    { icon: Bell,      label: "Follow-up Management",   desc: "Never let a promising lead go cold"          },
  ]

  return (
    <section
      ref={ref}
      className="relative overflow-hidden py-24"
      aria-labelledby="management-heading"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 -z-10 w-1/2"
        style={{ background: "radial-gradient(ellipse at right center, oklch(0.70 0.16 200 / 0.04), transparent 60%)" }}
      />

      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-10 flex flex-col items-center gap-4 text-center">
          <SectionLabel
            icon={Folder}
            label="Opportunity Management"
            colorClass="text-[var(--premium-cyan)]"
            isInView={isInView}
            delay={0}
          />
          <SectionHeading id="management-heading" isInView={isInView} delay={0.08}>
            Organize Opportunities{" "}
            <span className="gradient-text-cyan">In One Place</span>
          </SectionHeading>
          <SectionSubtext isInView={isInView} delay={0.16}>
            Your AI-curated opportunities deserve to be managed, not scattered across
            spreadsheets. Track every show from discovery to booking in a single workspace.
          </SectionSubtext>
        </div>

        {/* Pipeline mockup */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.25, duration: 0.55, ease }}
          className="mb-10"
        >
          <PipelineMockup isInView={isInView} />
        </motion.div>

        {/* Capability pills */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {capabilities.map(({ icon: Icon, label, desc }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 8 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.38 + i * 0.07, duration: 0.4, ease }}
              title={desc}
              className="flex items-center gap-2 rounded-xl border border-border/50 bg-muted/20 px-3.5 py-2"
            >
              <Icon className="size-3.5 text-[var(--premium-cyan)]" aria-hidden />
              <span className="text-xs font-medium text-foreground">{label}</span>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   SECTION 9 — COMPETITIVE COMPARISON
═══════════════════════════════════════════════════════════════════════════ */

function CompetitiveComparisonSection() {
  const { ref, isInView } = useSectionView()

  return (
    <section
      ref={ref}
      className="relative py-24"
      aria-labelledby="comparison-heading"
    >
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-12 flex flex-col items-center gap-4 text-center">
          <SectionLabel
            icon={Shield}
            label="How We Compare"
            colorClass="text-primary"
            isInView={isInView}
            delay={0}
          />
          <SectionHeading id="comparison-heading" isInView={isInView} delay={0.08}>
            Built For Visibility,{" "}
            <span className="gradient-text-primary">Not Search</span>
          </SectionHeading>
          <SectionSubtext isInView={isInView} delay={0.16}>
            Traditional platforms help you search for podcasts. PodcastMatch AI helps you
            become podcast-ready, discoverable, and intelligently matched.
          </SectionSubtext>
        </div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.22, duration: 0.55, ease }}
          className="overflow-hidden rounded-[var(--radius-xl)] border border-border"
        >
          {/* Header row */}
          <div className="grid grid-cols-3 border-b border-border bg-muted/30">
            <div className="p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Capability
              </p>
            </div>
            <div className="border-l border-border p-4 text-center">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Traditional Platforms
              </p>
            </div>
            <div className="border-l border-primary/30 bg-primary/5 p-4 text-center">
              <p className="text-xs font-bold uppercase tracking-wider text-primary">
                PodcastMatch AI
              </p>
            </div>
          </div>

          {/* Data rows */}
          {COMPARISON_ROWS.map(({ label, traditional, podmatch }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, x: -8 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.3 + i * 0.05, duration: 0.35, ease }}
              className={cn(
                "grid grid-cols-3 border-b border-border/40 last:border-0",
                i % 2 !== 0 ? "bg-muted/10" : "bg-transparent",
              )}
            >
              <div className="flex items-center p-3.5 pl-4">
                <p className="text-sm text-foreground">{label}</p>
              </div>
              <div className="flex items-center justify-center border-l border-border/40 p-3.5">
                {traditional
                  ? <CheckCircle2 className="size-4 text-muted-foreground/50" aria-label="Included" />
                  : <XCircle    className="size-4 text-red-500/40"           aria-label="Not included" />
                }
              </div>
              <div className="flex items-center justify-center border-l border-primary/20 bg-primary/5 p-3.5">
                {podmatch
                  ? <CheckCircle2 className="size-4 text-[oklch(0.65_0.15_145)]" aria-label="Included" />
                  : <XCircle    className="size-4 text-red-500/40"             aria-label="Not included" />
                }
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   SECTION 10 — FINAL CTA
═══════════════════════════════════════════════════════════════════════════ */

function FinalCTASection() {
  const { ref, isInView } = useSectionView()

  return (
    <section
      ref={ref}
      className="relative overflow-hidden py-32"
      aria-labelledby="cta-heading"
    >
      {/* Background glows */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{ background: "radial-gradient(ellipse at center, oklch(0.58 0.22 255 / 0.10), transparent 65%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-1/2 -z-10 h-[400px] w-[600px] -translate-x-1/2 rounded-full blur-3xl"
        style={{ background: "radial-gradient(ellipse at center, oklch(0.78 0.15 83 / 0.06), transparent 65%)" }}
      />

      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-8 text-center">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.1, duration: 0.45, ease }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/8 px-4 py-1.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
              </span>
              <span className="text-xs font-semibold text-primary">
                Free · No Credit Card Required
              </span>
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h2
            id="cta-heading"
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.18, duration: 0.55, ease }}
            className="text-4xl font-black sm:text-5xl text-foreground"
          >
            Ready To Discover Your{" "}
            <span className="gradient-text-primary text-glow-primary">
              Visibility Potential?
            </span>
          </motion.h2>

          {/* Supporting copy */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.26, duration: 0.45, ease }}
            className="mx-auto max-w-xl text-base text-muted-foreground"
          >
            Join 2,400+ speakers, authors, coaches, and experts using PodcastMatch AI
            to become more visible, more discoverable, and more podcast-ready.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.34, duration: 0.5, ease }}
            className="flex flex-col items-center gap-3 sm:flex-row"
          >
            <Button variant="premium" size="xl" className="group" asChild>
              <Link href="/signup">
                Start Free Assessment
                <ArrowRight
                  className="size-5 transition-transform duration-200 group-hover:translate-x-0.5"
                  aria-hidden
                />
              </Link>
            </Button>
            <Button variant="outline" size="xl" asChild>
              <Link href="/discover">Explore Opportunities</Link>
            </Button>
          </motion.div>

          {/* Trust row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.44, duration: 0.5, ease }}
            className="flex flex-wrap items-center justify-center gap-5 text-xs text-muted-foreground"
          >
            {[
              "Free forever plan",
              "AI assessment in 5 minutes",
              "Instant visibility score",
              "Cancel anytime",
            ].map(item => (
              <span key={item} className="flex items-center gap-1.5">
                <CheckCircle2 className="size-3.5 text-[var(--premium-cyan)]" aria-hidden />
                {item}
              </span>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   PAGE EXPORT
═══════════════════════════════════════════════════════════════════════════ */

export function FeaturesPageContent() {
  return (
    <main>
      <FeaturesHero />
      <VisibilityIntelligenceSection />
      <CreatorProfileSection />
      <DiscoveryEngineSection />
      <AIMatchingSection />
      <ImprovementRoadmapSection />
      <GrowthTrackingSection />
      <OpportunityManagementSection />
      <CompetitiveComparisonSection />
      <FinalCTASection />
    </main>
  )
}
