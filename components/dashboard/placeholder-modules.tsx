"use client"

import { motion } from "motion/react"
import {
  Sparkles,
  Mic2,
  Users,
  Eye,
  TrendingUp,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  Send,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { DashboardWidget } from "@/components/dashboard/widget"

/* ═══════════════════════════════════════════════════════════
   Placeholder Dashboard Modules
   Visual-only foundation. Real data slots in later.
   ═══════════════════════════════════════════════════════════ */

/* ── 1. AI Match Insights ────────────────────────────────── */
const MOCK_MATCHES = [
  { name: "The Startup Mindset Podcast",   host: "David Chen",      score: 96, topic: "Entrepreneurship" },
  { name: "Women in Leadership",           host: "Sarah Mitchell",  score: 91, topic: "Leadership"       },
  { name: "Tech Founders Weekly",          host: "James Park",      score: 88, topic: "Technology"       },
]

export function AIMatchInsightsWidget() {
  return (
    <DashboardWidget
      title="AI Match Insights"
      description="Personalized to your expertise"
      icon={Sparkles}
      badge="3 New"
      accent="cyan"
      action={
        <button className="flex items-center gap-1 text-[11px] font-medium text-primary transition-colors hover:text-primary/80">
          View all <ArrowUpRight className="size-3" aria-hidden="true" />
        </button>
      }
    >
      <div className="flex flex-col gap-3">
        {MOCK_MATCHES.map((match, i) => (
          <motion.div
            key={match.name}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.07, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="group flex items-center gap-3 rounded-[var(--radius-lg)] border border-border/40
                       bg-muted/30 px-3 py-2.5 transition-all duration-150
                       hover:border-[oklch(0.70_0.16_200/0.25)] hover:bg-[oklch(0.70_0.16_200/0.05)]"
          >
            {/* Podcast icon */}
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[oklch(0.70_0.16_200/0.10)]">
              <Mic2 className="size-3.5 text-[var(--premium-cyan)]" aria-hidden="true" />
            </div>

            {/* Info */}
            <div className="min-w-0 flex-1">
              <p className="truncate text-[12px] font-semibold text-foreground">{match.name}</p>
              <p className="truncate text-[10px] text-muted-foreground">{match.host} · {match.topic}</p>
            </div>

            {/* Score badge */}
            <div className={cn(
              "flex h-7 w-9 shrink-0 items-center justify-center rounded-lg text-[11px] font-bold",
              match.score >= 95
                ? "bg-[oklch(0.78_0.15_83/0.15)] text-[var(--premium-gold)]"
                : match.score >= 90
                  ? "bg-primary/12 text-primary"
                  : "bg-[oklch(0.70_0.16_200/0.12)] text-[var(--premium-cyan)]"
            )}>
              {match.score}
            </div>
          </motion.div>
        ))}

        {/* Skeleton placeholder row — "loading more" feel */}
        <div className="flex items-center gap-3 rounded-[var(--radius-lg)] border border-dashed border-border/30 px-3 py-2.5 opacity-40" aria-hidden="true">
          <div className="h-8 w-8 animate-pulse rounded-lg bg-muted" />
          <div className="flex flex-1 flex-col gap-1.5">
            <div className="h-2.5 w-3/5 animate-pulse rounded-full bg-muted" />
            <div className="h-2 w-2/5 animate-pulse rounded-full bg-muted/60" />
          </div>
          <div className="h-7 w-9 animate-pulse rounded-lg bg-muted" />
        </div>
      </div>
    </DashboardWidget>
  )
}

/* ── 2. Recent Podcast Opportunities ─────────────────────── */
const MOCK_OPPORTUNITIES = [
  { name: "Founder Stories",       status: "New",       time: "2h ago",     icon: "FS" },
  { name: "The Creator Economy",   status: "Contacted", time: "1d ago",     icon: "CE" },
  { name: "Bold Moves Podcast",    status: "Saved",     time: "3d ago",     icon: "BM" },
  { name: "Growth Hacking Weekly", status: "Reviewed",  time: "5d ago",     icon: "GH" },
]

const STATUS_STYLES: Record<string, string> = {
  New:       "bg-primary/12 text-primary border-primary/20",
  Contacted: "bg-[oklch(0.78_0.15_83/0.12)] text-[var(--premium-gold)] border-[oklch(0.78_0.15_83/0.20)]",
  Saved:     "bg-[oklch(0.70_0.16_200/0.12)] text-[var(--premium-cyan)] border-[oklch(0.70_0.16_200/0.20)]",
  Reviewed:  "bg-muted text-muted-foreground border-border",
}

export function RecentOpportunitiesWidget() {
  return (
    <DashboardWidget
      title="Recent Opportunities"
      description="Podcasts you've interacted with"
      icon={Mic2}
      accent="primary"
      action={
        <button className="flex items-center gap-1 text-[11px] font-medium text-primary transition-colors hover:text-primary/80">
          Browse all <ArrowUpRight className="size-3" aria-hidden="true" />
        </button>
      }
    >
      <div className="flex flex-col divide-y divide-border/30">
        {MOCK_OPPORTUNITIES.map((item, i) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.28 }}
            className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0
                       transition-colors duration-150 hover:bg-muted/20 rounded-[var(--radius-md)] px-1"
          >
            {/* Avatar */}
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg
                            bg-secondary text-[10px] font-bold text-muted-foreground">
              {item.icon}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-[12px] font-semibold text-foreground">{item.name}</p>
              <p className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <Clock className="size-2.5" aria-hidden="true" /> {item.time}
              </p>
            </div>

            <span className={cn(
              "shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold",
              STATUS_STYLES[item.status] ?? STATUS_STYLES["Reviewed"]
            )}>
              {item.status}
            </span>
          </motion.div>
        ))}
      </div>
    </DashboardWidget>
  )
}

/* ── 3. Audience Alignment ───────────────────────────────── */
export function AudienceAlignmentWidget() {
  const segments = [
    { label: "Entrepreneurs",   pct: 72, color: "bg-primary" },
    { label: "Tech Founders",   pct: 58, color: "bg-[var(--premium-cyan)]" },
    { label: "Coaches",         pct: 44, color: "bg-[var(--premium-gold)]" },
  ]

  return (
    <DashboardWidget
      title="Audience Alignment"
      description="How your expertise resonates"
      icon={Users}
      accent="gold"
      badge="Pro"
    >
      <div className="flex flex-col gap-4">
        {/* Circular score placeholder */}
        <div className="flex items-center gap-4">
          <div className="relative flex h-16 w-16 shrink-0 items-center justify-center">
            <svg className="absolute inset-0" viewBox="0 0 64 64" aria-hidden="true">
              <circle cx="32" cy="32" r="26" fill="none" stroke="oklch(0.22 0.050 250)" strokeWidth="5" />
              <circle
                cx="32" cy="32" r="26"
                fill="none"
                stroke="oklch(0.78 0.150 83)"
                strokeWidth="5"
                strokeDasharray={`${2 * Math.PI * 26 * 0.82} ${2 * Math.PI * 26}`}
                strokeLinecap="round"
                strokeDashoffset={2 * Math.PI * 26 * 0.25}
                style={{ filter: "drop-shadow(0 0 6px oklch(0.78 0.150 83 / 0.50))" }}
              />
            </svg>
            <span className="text-base font-bold gradient-text-gold">82%</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Strong Alignment</p>
            <p className="text-[11px] text-muted-foreground leading-snug">Your expertise matches<br />high-intent podcast audiences</p>
          </div>
        </div>

        {/* Segment bars */}
        <div className="flex flex-col gap-2.5">
          {segments.map((seg, i) => (
            <div key={seg.label}>
              <div className="mb-1 flex items-center justify-between">
                <span className="text-[11px] text-muted-foreground">{seg.label}</span>
                <span className="text-[11px] font-semibold text-foreground">{seg.pct}%</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <motion.div
                  className={cn("h-full rounded-full", seg.color)}
                  initial={{ width: 0 }}
                  animate={{ width: `${seg.pct}%` }}
                  transition={{ delay: 0.3 + i * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardWidget>
  )
}

/* ── 4. Visibility Score ──────────────────────────────────── */
export function VisibilityScoreWidget() {
  return (
    <DashboardWidget
      title="Visibility Score"
      description="Your platform reach index"
      icon={Eye}
      accent="primary"
    >
      <div className="flex flex-col items-center justify-center gap-3 py-2">
        {/* Score display */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
          className="relative"
        >
          <span className="text-5xl font-bold gradient-text-primary text-glow-primary">45</span>
          <span className="absolute -right-6 bottom-2 text-sm font-medium text-muted-foreground">/100</span>
        </motion.div>

        {/* Label */}
        <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-0.5 text-[11px] font-semibold text-primary">
          Growing
        </span>

        {/* Progress bar */}
        <div className="w-full">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <motion.div
              className="h-full rounded-full gradient-primary"
              initial={{ width: 0 }}
              animate={{ width: "45%" }}
              transition={{ delay: 0.4, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              style={{ boxShadow: "var(--glow-subtle)" }}
            />
          </div>
          <div className="mt-1.5 flex justify-between text-[9px] text-muted-foreground/60">
            <span>0</span><span>50</span><span>100</span>
          </div>
        </div>

        <p className="text-center text-[11px] leading-relaxed text-muted-foreground">
          Complete your profile and book 2 more interviews to reach <span className="text-foreground font-medium">Expert (85+)</span>
        </p>
      </div>
    </DashboardWidget>
  )
}

/* ── 5. Creator Momentum ──────────────────────────────────── */
const MOMENTUM_STATS = [
  { label: "Pitches Sent",  value: 8,  icon: Send,         color: "text-[var(--premium-cyan)]", bg: "bg-[oklch(0.70_0.16_200/0.10)]" },
  { label: "Responses",     value: 5,  icon: CheckCircle2, color: "text-[var(--premium-gold)]", bg: "bg-[oklch(0.78_0.15_83/0.10)]"  },
  { label: "Booked",        value: 2,  icon: Mic2,         color: "text-[oklch(0.70_0.16_145)]",bg: "bg-[oklch(0.55_0.16_145/0.10)]" },
]

export function CreatorMomentumWidget() {
  return (
    <DashboardWidget
      title="Creator Momentum"
      description="This month's outreach activity"
      icon={TrendingUp}
      accent="green"
    >
      <div className="flex flex-col gap-3">
        {/* Stat row */}
        <div className="grid grid-cols-3 gap-2">
          {MOMENTUM_STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.3 }}
              className="flex flex-col items-center gap-1.5 rounded-[var(--radius-lg)] border border-border/40 bg-muted/20 p-2.5"
            >
              <div className={cn("flex h-7 w-7 items-center justify-center rounded-lg", stat.bg)}>
                <stat.icon className={cn("size-3.5", stat.color)} aria-hidden="true" />
              </div>
              <span className={cn("text-xl font-bold", stat.color)}>{stat.value}</span>
              <span className="text-center text-[9px] font-medium leading-tight text-muted-foreground">{stat.label}</span>
            </motion.div>
          ))}
        </div>

        {/* Trend line placeholder */}
        <div className="rounded-[var(--radius-lg)] border border-border/30 bg-muted/20 px-3 py-2.5">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground/60">30-Day Trend</p>
          <svg
            viewBox="0 0 160 36"
            className="w-full"
            aria-label="Outreach trend graph (placeholder)"
            role="img"
          >
            <polyline
              points="0,30 20,26 40,22 60,18 80,20 100,14 120,10 140,8 160,4"
              fill="none"
              stroke="oklch(0.70 0.160 200)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.7"
            />
            <polygon
              points="0,30 20,26 40,22 60,18 80,20 100,14 120,10 140,8 160,4 160,36 0,36"
              fill="url(#momentum-grad)"
              opacity="0.12"
            />
            <defs>
              <linearGradient id="momentum-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="oklch(0.70 0.160 200)" />
                <stop offset="100%" stopColor="oklch(0.70 0.160 200 / 0)" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    </DashboardWidget>
  )
}
