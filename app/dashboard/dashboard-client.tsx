"use client"

import { useRef } from "react"
import { motion, useInView } from "motion/react"
import {
  Eye,
  TrendingUp,
  Mic2,
  Globe,
  FileText,
  ArrowUpRight,
  Bookmark,
  Bell,
  Star,
  Zap,
  Lightbulb,
  BarChart3,
  Shield,
  Radio,
  UserCheck,
  Clock,
  Dna,
  ChevronRight,
  CheckCircle2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Link from "next/link"
import type { ScoringResult, ScoreBreakdown, ImprovementFlags } from "@/lib/actions/scoring"

/* ── Greeting ─────────────────────────────────────────────── */
function getGreeting(): string {
  const h = new Date().getHours()
  if (h < 12) return "Good morning"
  if (h < 17) return "Good afternoon"
  return "Good evening"
}

/* ── Animation helpers ────────────────────────────────────── */
function useSectionView() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true })
  return { ref, isInView }
}

/* ── DNA assessment banner ────────────────────────────────── */
function DNABanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative overflow-hidden rounded-2xl border border-primary/30 bg-primary/6 px-5 py-4 md:px-6"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      <div className="absolute right-0 top-0 h-full w-48 bg-gradient-to-l from-primary/6 to-transparent pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/12 border border-primary/20">
            <Dna className="w-5 h-5 text-primary" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground leading-snug">
              Take your Creator DNA Assessment
            </p>
            <p className="text-xs text-muted-foreground mt-0.5 leading-snug">
              Unlock your real visibility score, AI matches, and full creator profile — takes about 5 minutes.
            </p>
          </div>
        </div>
        <Link
          href="/onboarding/creator-dna"
          className={cn(
            "inline-flex shrink-0 items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold",
            "bg-primary text-primary-foreground shadow-[var(--glow-subtle)]",
            "transition-all duration-150 hover:opacity-90 hover:shadow-[var(--glow-primary)]"
          )}
        >
          Start Assessment <ChevronRight className="w-4 h-4" aria-hidden="true" />
        </Link>
      </div>
    </motion.div>
  )
}

/* ── Score status ─────────────────────────────────────────── */
function getScoreStatus(score: number) {
  if (score >= 90) return { label: "Expert",      color: "text-[var(--premium-gold)]",  bg: "bg-[oklch(0.78_0.15_83/0.15)]",  border: "border-[oklch(0.78_0.15_83/0.30)]"  }
  if (score >= 80) return { label: "Established", color: "text-[var(--premium-cyan)]",  bg: "bg-[oklch(0.70_0.16_200/0.12)]", border: "border-[oklch(0.70_0.16_200/0.25)]" }
  if (score >= 70) return { label: "Growing",     color: "text-primary",                bg: "bg-primary/12",                  border: "border-primary/25"                  }
  if (score >= 50) return { label: "Developing",  color: "text-muted-foreground",       bg: "bg-muted",                       border: "border-border"                      }
  return                  { label: "Starting",    color: "text-muted-foreground",       bg: "bg-muted/60",                    border: "border-border/60"                   }
}

/* ── Props ─────────────────────────────────────────────────── */
export interface DashboardHomeProps {
  firstName:  string
  savedCount: number
  matchCount: number
  newToday:   number
  hasDna:     boolean
  scoring:    ScoringResult
}

/* ═══════════════════════════════════════════════════════════
   Data constants
   ═══════════════════════════════════════════════════════════ */

const RING_R    = 88
const RING_CIRC = 2 * Math.PI * RING_R

/* Normalise sub-scores to 0–100 for bar display */
function buildSubscores(b: ScoreBreakdown) {
  return [
    { label: "Authority",  score: Math.round(b.authority / 25 * 100), color: "var(--premium-gold)",  barBg: "bg-[oklch(0.78_0.15_83/0.10)]",  barFill: "bg-[var(--premium-gold)]"  },
    { label: "Audience",   score: Math.round(b.audience  / 20 * 100), color: "var(--premium-cyan)",  barBg: "bg-[oklch(0.70_0.16_200/0.10)]", barFill: "bg-[var(--premium-cyan)]"  },
    { label: "Clarity",    score: Math.round(b.clarity   / 20 * 100), color: "var(--primary)",       barBg: "bg-primary/10",                  barFill: "bg-primary"                },
    { label: "Readiness",  score: Math.round(b.readiness / 20 * 100), color: "var(--premium-cyan)",  barBg: "bg-[oklch(0.70_0.16_200/0.10)]", barFill: "bg-[var(--premium-cyan)]"  },
    { label: "Growth",     score: Math.round(b.growth    / 15 * 100), color: "oklch(0.70 0.16 145)", barBg: "bg-[oklch(0.55_0.16_145/0.10)]", barFill: "bg-[oklch(0.70_0.16_145)]" },
  ]
}

function buildImprovements(f: ImprovementFlags) {
  return [
    {
      priority: "High",
      pts: 8,
      done: f.websiteAdded,
      icon: Globe,
      title: "Add Your Website",
      desc: f.websiteAdded
        ? "Website linked — hosts can find you."
        : "Link your website to boost authority and discoverability by podcast hosts.",
      action: "Add Now",
      href: "/dashboard/profile#section-bio",
    },
    {
      priority: "High",
      pts: 6,
      done: f.mediaKitReady,
      icon: FileText,
      title: "Create a Media Kit",
      desc: f.mediaKitReady
        ? "Media kit is ready to share."
        : "Complete your bio and DNA assessment to unlock your shareable media kit.",
      action: "Create Kit",
      href: "/dashboard/profile#section-media-kit",
    },
    {
      priority: "Medium",
      pts: 5,
      done: f.bioCompleted,
      icon: UserCheck,
      title: "Complete Your Bio",
      desc: f.bioCompleted
        ? "Bio is looking great."
        : "Fill in your bio so podcast hosts know who you are and why you're a compelling guest.",
      action: "Complete",
      href: "/dashboard/profile#section-bio",
    },
    {
      priority: "Medium",
      pts: 7,
      done: f.topicsDefined,
      icon: Lightbulb,
      title: "Define Signature Topics",
      desc: f.topicsDefined
        ? "3+ speaking topics defined."
        : "Specialists get booked 3× more. Define at least 3 clear speaking topics.",
      action: "Define Topics",
      href: "/dashboard/profile#section-speaking-topics",
    },
    {
      priority: "Medium",
      pts: 8,
      done: f.assessmentComplete,
      icon: Shield,
      title: "Complete DNA Assessment",
      desc: f.assessmentComplete
        ? "Assessment complete — AI profile generated."
        : "Your Creator DNA Assessment unlocks AI matching, positioning, and your full score.",
      action: "Take Assessment",
      href: "/onboarding/creator-dna",
    },
  ]
}

const RECOMMENDED = [
  {
    name: "The Startup Mindset Podcast",
    host: "David Chen",
    listeners: "82K",
    audienceFit: 94,
    impact: "High Visibility",
    matchScore: 96,
    isTopMatch: true,
  },
  {
    name: "Women in Leadership",
    host: "Sarah Mitchell",
    listeners: "47K",
    audienceFit: 88,
    impact: "Strong Reach",
    matchScore: 91,
    isTopMatch: false,
  },
  {
    name: "Tech Founders Weekly",
    host: "James Park",
    listeners: "31K",
    audienceFit: 82,
    impact: "Growing Audience",
    matchScore: 88,
    isTopMatch: false,
  },
]

const RECENT_ACTIVITY = [
  { icon: Bookmark,   color: "text-[var(--premium-cyan)]",  bg: "bg-[oklch(0.70_0.16_200/0.12)]", text: 'Saved "Founder Stories" to your pipeline',          time: "2h ago" },
  { icon: Zap,        color: "text-primary",                bg: "bg-primary/10",                   text: "3 new high-match opportunities found for you",        time: "5h ago" },
  { icon: UserCheck,  color: "text-[var(--premium-gold)]",  bg: "bg-[oklch(0.78_0.15_83/0.12)]",  text: "Profile bio updated — visibility improved +2 pts",    time: "1d ago" },
  { icon: TrendingUp, color: "text-[oklch(0.70_0.16_145)]", bg: "bg-[oklch(0.55_0.16_145/0.10)]", text: "Visibility Score increased from 68 → 74",             time: "3d ago" },
  { icon: Bell,       color: "text-muted-foreground",       bg: "bg-muted/30",                    text: "New outreach template available in your toolkit",     time: "5d ago" },
]

const QUICK_ACTIONS = [
  { label: "Complete Profile",        icon: UserCheck,  href: "/dashboard/profile",   primary: true  },
  { label: "Discover Opportunities",  icon: Radio,      href: "/dashboard/discover",  primary: false },
  { label: "View Matches",            icon: Star,       href: "/dashboard/matches",   primary: false },
  { label: "Saved Opportunities",     icon: Bookmark,   href: "/dashboard/saved",     primary: false },
  { label: "Outreach",                icon: Mic2,       href: "/dashboard/outreach",  primary: false },
  { label: "Analytics",               icon: BarChart3,  href: "/dashboard/analytics", primary: false },
]

/* ══════════════════════════════════════════════════════════════
   Section 1 — Visibility Score Hero
   ══════════════════════════════════════════════════════════════ */
function VisibilityScoreHero({ score, breakdown }: { score: number; breakdown: ScoreBreakdown }) {
  const status   = getScoreStatus(score)
  const filled   = RING_CIRC * (score / 100)
  const SUBSCORES = buildSubscores(breakdown)

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      aria-labelledby="visibility-score-heading"
      className="relative overflow-hidden rounded-[var(--radius-xl)] border border-border bg-card p-6 shadow-[var(--shadow-card)] lg:p-8"
    >
      {/* Top-edge shimmer */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-t-[var(--radius-xl)]
                   bg-gradient-to-r from-transparent via-[oklch(0.96_0_0/0.10)] to-transparent"
      />
      {/* Ambient glow behind ring */}
      <div aria-hidden className="pointer-events-none absolute left-0 top-0 h-64 w-64 rounded-full bg-primary/4 blur-3xl" />

      <div className="relative flex flex-col items-start gap-8 lg:flex-row lg:items-center">

        {/* ── Ring gauge ───────────────────────────────────── */}
        <div className="relative h-44 w-44 shrink-0 lg:h-52 lg:w-52">
          <svg viewBox="0 0 220 220" className="h-full w-full" aria-hidden="true">
            <defs>
              <linearGradient id="vis-ring-grad" gradientUnits="userSpaceOnUse" x1="22" y1="110" x2="198" y2="110">
                <stop offset="0%" stopColor="oklch(0.55 0.22 250)" />
                <stop offset="100%" stopColor="oklch(0.70 0.16 200)" />
              </linearGradient>
            </defs>
            {/* Track */}
            <circle
              cx="110" cy="110" r={RING_R}
              fill="none"
              stroke="oklch(0.22 0.05 250)"
              strokeWidth="10"
            />
            {/* Filled arc */}
            <motion.circle
              cx="110" cy="110" r={RING_R}
              fill="none"
              stroke="url(#vis-ring-grad)"
              strokeWidth="10"
              strokeLinecap="round"
              transform="rotate(-90 110 110)"
              initial={{ strokeDasharray: `0 ${RING_CIRC.toFixed(2)}` }}
              animate={{ strokeDasharray: `${filled.toFixed(2)} ${RING_CIRC.toFixed(2)}` }}
              transition={{ duration: 1.4, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              style={{ filter: "drop-shadow(0 0 14px oklch(0.55 0.22 250 / 0.55))" }}
            />
          </svg>

          {/* Score overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span
              className="text-[52px] font-bold leading-none gradient-text-primary"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
            >
              {score}
            </motion.span>
            <span className="mt-1 text-[11px] font-medium text-muted-foreground">/ 100</span>
          </div>
        </div>

        {/* ── Info + subscores ─────────────────────────────── */}
        <div className="flex-1 min-w-0">
          <div className="mb-4 flex items-start gap-3">
            <div>
              <h2 id="visibility-score-heading" className="mb-1.5 text-xl font-bold text-foreground">
                Visibility Score
              </h2>
              <span className={cn(
                "inline-flex items-center rounded-full border px-3 py-0.5 text-xs font-semibold",
                status.bg, status.color, status.border
              )}>
                {status.label}
              </span>
            </div>
          </div>

          <p className="mb-5 max-w-md text-sm text-muted-foreground">
            Your expert presence across the podcast ecosystem. Complete the improvements below
            to reach{" "}
            <span className="font-medium text-foreground">Expert level (85+)</span> and unlock
            priority booking opportunities.
          </p>

          {/* Subscores */}
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
            {SUBSCORES.map((sub, i) => (
              <motion.div
                key={sub.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 + i * 0.08, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col gap-1.5 rounded-[var(--radius-lg)] border border-border/40 bg-muted/20 px-3 py-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-medium text-muted-foreground">{sub.label}</span>
                  <span className="text-[11px] font-bold" style={{ color: sub.color }}>{sub.score}</span>
                </div>
                <div className={cn("h-1 w-full overflow-hidden rounded-full", sub.barBg)}>
                  <motion.div
                    className={cn("h-full rounded-full", sub.barFill)}
                    initial={{ width: 0 }}
                    animate={{ width: `${sub.score}%` }}
                    transition={{ delay: 0.65 + i * 0.08, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom strip */}
      <div className="relative mt-6 flex flex-col items-start justify-between gap-3 border-t border-border/30 pt-5 sm:flex-row sm:items-center">
        <p className="text-xs text-muted-foreground">
          Complete{" "}
          <span className="font-semibold text-foreground">5 improvements</span> to reach{" "}
          <span className="font-semibold" style={{ color: "var(--premium-gold)" }}>Expert (85+)</span>{" "}
          and unlock priority visibility
        </p>
        <Button variant="outline" size="sm" asChild className="shrink-0">
          <Link href="/dashboard/profile">
            Improve Now <ArrowUpRight className="ml-1 size-3" aria-hidden="true" />
          </Link>
        </Button>
      </div>
    </motion.section>
  )
}

/* ══════════════════════════════════════════════════════════════
   Section 2 — Improvement Opportunities
   ══════════════════════════════════════════════════════════════ */
function ImprovementOpportunitiesSection({ flags }: { flags: ImprovementFlags }) {
  const { ref, isInView } = useSectionView()
  const items = buildImprovements(flags)
  const doneCount = items.filter(i => i.done).length

  return (
    <section ref={ref} aria-labelledby="improvements-heading">
      <div className="mb-4">
        <div className="mb-1 flex items-center gap-2">
          <TrendingUp className="size-4 text-primary" aria-hidden="true" />
          <h2 id="improvements-heading" className="text-sm font-semibold text-foreground">
            Improve Your Visibility
          </h2>
          {doneCount > 0 && (
            <span className="rounded-full border border-[oklch(0.55_0.16_145/0.30)] bg-[oklch(0.55_0.16_145/0.10)] px-2 py-0.5 text-[9px] font-bold text-[oklch(0.70_0.16_145)]">
              {doneCount}/{items.length} done
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground">Complete these actions to increase your score</p>
      </div>

      <div className="flex flex-col gap-2.5">
        {items.map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, x: -10 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: i * 0.07, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              "group relative flex items-center gap-3 rounded-[var(--radius-lg)]",
              "border bg-card px-4 py-3 shadow-[var(--shadow-card)]",
              "transition-all duration-150",
              item.done
                ? "border-border/25 opacity-60"
                : "border-border/40 hover:border-primary/25 hover:bg-muted/10"
            )}
          >
            {/* Priority / done bar */}
            <div
              aria-hidden
              className={cn(
                "absolute inset-y-2 left-0 w-0.5 rounded-r-full",
                item.done
                  ? "bg-[oklch(0.55_0.16_145/0.50)]"
                  : item.priority === "High" ? "bg-red-500/60" : "bg-amber-500/40"
              )}
            />

            {/* Icon */}
            <div className={cn(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
              item.done ? "bg-[oklch(0.55_0.16_145/0.10)]" : "bg-primary/8"
            )}>
              {item.done
                ? <CheckCircle2 className="size-4 text-[oklch(0.70_0.16_145)]" aria-hidden="true" />
                : <item.icon className="size-4 text-primary" aria-hidden="true" />
              }
            </div>

            {/* Text */}
            <div className="min-w-0 flex-1">
              <div className="mb-0.5 flex items-center gap-2">
                <p className="text-[12px] font-semibold text-foreground">{item.title}</p>
                {!item.done && (
                  <span className={cn(
                    "shrink-0 rounded-full border px-1.5 py-px text-[9px] font-bold uppercase tracking-wide",
                    item.priority === "High"
                      ? "border-red-500/30 bg-red-500/10 text-red-400"
                      : "border-amber-500/30 bg-amber-500/10 text-amber-400"
                  )}>
                    {item.priority}
                  </span>
                )}
              </div>
              <p className="truncate text-[11px] text-muted-foreground">{item.desc}</p>
            </div>

            {/* Impact + action */}
            <div className="flex shrink-0 items-center gap-2">
              {item.done ? (
                <span className="rounded-full border border-[oklch(0.55_0.16_145/0.30)] bg-[oklch(0.55_0.16_145/0.10)] px-2 py-0.5 text-[10px] font-bold text-[oklch(0.70_0.16_145)]">
                  ✓ Done
                </span>
              ) : (
                <>
                  <span className="rounded-full border border-[oklch(0.55_0.16_145/0.30)] bg-[oklch(0.55_0.16_145/0.10)] px-2 py-0.5 text-[10px] font-bold text-[oklch(0.70_0.16_145)]">
                    +{item.pts} pts
                  </span>
                  <Button variant="ghost" size="sm" asChild className="h-7 px-2.5 text-[11px]">
                    <Link href={item.href}>{item.action}</Link>
                  </Button>
                </>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════════
   Section 6 — Quick Actions
   ══════════════════════════════════════════════════════════════ */
function QuickActionsSection() {
  const { ref, isInView } = useSectionView()

  return (
    <section ref={ref} aria-labelledby="quick-actions-heading">
      <div className="mb-4">
        <h2 id="quick-actions-heading" className="mb-0.5 text-sm font-semibold text-foreground">
          Quick Actions
        </h2>
        <p className="text-xs text-muted-foreground">Navigate your workspace</p>
      </div>

      <div className="flex flex-col gap-2">
        {QUICK_ACTIONS.map((action, i) => (
          <motion.div
            key={action.label}
            initial={{ opacity: 0, y: 8 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: i * 0.06, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link
              href={action.href}
              className={cn(
                "flex items-center gap-3 rounded-[var(--radius-lg)] border px-4 py-2.5",
                "transition-all duration-150",
                action.primary
                  ? "border-primary/30 bg-primary/8 text-primary hover:border-primary/45 hover:bg-primary/15"
                  : "border-border/40 bg-card text-muted-foreground hover:border-border/60 hover:bg-muted/30 hover:text-foreground"
              )}
            >
              <action.icon
                className={cn("size-4 shrink-0", action.primary ? "text-primary" : "text-muted-foreground")}
                aria-hidden="true"
              />
              <span className="flex-1 text-[12px] font-medium">{action.label}</span>
              <ArrowUpRight className="size-3 opacity-40" aria-hidden="true" />
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════════
   Section 3 — Recommended Opportunities
   ══════════════════════════════════════════════════════════════ */
function RecommendedOpportunitiesSection() {
  const { ref, isInView } = useSectionView()

  return (
    <section ref={ref} aria-labelledby="recommended-heading">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <Star className="size-4 text-[var(--premium-gold)]" aria-hidden="true" />
            <h2 id="recommended-heading" className="text-sm font-semibold text-foreground">
              Recommended Opportunities
            </h2>
          </div>
          <p className="text-xs text-muted-foreground">Top matches for your expertise, right now</p>
        </div>
        <Button variant="ghost" size="sm" asChild className="shrink-0 text-[11px]">
          <Link href="/dashboard/matches">
            View all <ArrowUpRight className="ml-1 size-3" aria-hidden="true" />
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {RECOMMENDED.map((pod, i) => {
          const isGold  = pod.matchScore >= 95
          const isBlue  = pod.matchScore >= 90 && !isGold
          const isCyan  = !isGold && !isBlue
          const scoreColor  = isGold ? "text-[var(--premium-gold)]" : isBlue ? "text-primary" : "text-[var(--premium-cyan)]"
          const scoreBorder = isGold
            ? "border-[oklch(0.78_0.15_83/0.25)] bg-[oklch(0.78_0.15_83/0.10)]"
            : isBlue
            ? "border-primary/25 bg-primary/8"
            : "border-[oklch(0.70_0.16_200/0.25)] bg-[oklch(0.70_0.16_200/0.08)]"
          const impactColor  = isGold ? "text-[var(--premium-gold)] border-[oklch(0.78_0.15_83/0.25)] bg-[oklch(0.78_0.15_83/0.10)]"
            : isBlue ? "text-primary border-primary/25 bg-primary/8"
            : "text-[var(--premium-cyan)] border-[oklch(0.70_0.16_200/0.25)] bg-[oklch(0.70_0.16_200/0.08)]"

          return (
            <motion.div
              key={pod.name}
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.10, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className={cn(
                "relative flex flex-col gap-4 rounded-[var(--radius-xl)]",
                "border border-border bg-card p-5 shadow-[var(--shadow-card)]",
                "transition-all duration-200 hover:border-primary/25 hover:shadow-[var(--shadow-card),var(--glow-subtle)]",
                pod.isTopMatch && "ring-1 ring-[oklch(0.78_0.15_83/0.20)]"
              )}
            >
              {/* Top-match badge */}
              {pod.isTopMatch && (
                <div className="absolute -top-px left-4" aria-label="Top match">
                  <span className="inline-flex items-center gap-1 rounded-b-lg border border-t-0 border-[oklch(0.78_0.15_83/0.30)] bg-[oklch(0.78_0.15_83/0.12)] px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[var(--premium-gold)]">
                    <Star className="size-2.5" aria-hidden="true" /> Top Match
                  </span>
                </div>
              )}

              {/* Header */}
              <div className="mt-1 flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[oklch(0.70_0.16_200/0.10)]">
                  <Mic2 className="size-5 text-[var(--premium-cyan)]" aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-semibold leading-snug text-foreground">{pod.name}</p>
                  <p className="text-[11px] text-muted-foreground">{pod.host} · {pod.listeners} listeners</p>
                </div>
                {/* Match score */}
                <div className={cn(
                  "flex h-9 w-10 shrink-0 flex-col items-center justify-center rounded-lg border text-center",
                  scoreBorder
                )}>
                  <span className={cn("text-[13px] font-bold leading-none", scoreColor)}>{pod.matchScore}</span>
                  <span className="text-[8px] text-muted-foreground">match</span>
                </div>
              </div>

              {/* Audience fit bar */}
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-[10px] text-muted-foreground">Audience Fit</span>
                  <span className="text-[10px] font-semibold text-foreground">{pod.audienceFit}%</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <motion.div
                    className="h-full rounded-full gradient-primary"
                    initial={{ width: 0 }}
                    animate={isInView ? { width: `${pod.audienceFit}%` } : { width: 0 }}
                    transition={{ delay: 0.3 + i * 0.10, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>
              </div>

              {/* Impact badge */}
              <span className={cn(
                "self-start rounded-full border px-2 py-0.5 text-[10px] font-semibold",
                impactColor
              )}>
                {pod.impact}
              </span>

              {/* CTAs */}
              <div className="mt-auto flex gap-2">
                <Button variant="outline" size="sm" asChild className="h-8 flex-1 text-[11px]">
                  <Link href="/dashboard/matches">View</Link>
                </Button>
                <Button size="sm" asChild className="h-8 flex-1 text-[11px]">
                  <Link href="/dashboard/saved">
                    <Bookmark className="mr-1 size-3" aria-hidden="true" /> Save
                  </Link>
                </Button>
              </div>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════════
   Section 4 — Visibility Growth
   ══════════════════════════════════════════════════════════════ */
function VisibilityGrowthSection({ breakdown }: { breakdown: ScoreBreakdown }) {
  const { ref, isInView } = useSectionView()
  const profilePct = Math.round(
    (breakdown.authority / 25 * 0.25 + breakdown.clarity / 20 * 0.25 +
     breakdown.audience  / 20 * 0.25 + breakdown.readiness / 20 * 0.25) * 100
  )

  const metrics = [
    {
      label: "Visibility Score",
      value: String(breakdown.total),
      delta: `${breakdown.total}/100 overall`,
      deltaUp: breakdown.total > 0,
      type: "sparkline" as const,
      points: "0,28 20,24 40,22 60,20 80,18 100,14 120,12 140,8 160,4",
      pct: undefined as number | undefined,
      color: "oklch(0.55 0.22 250)",
      icon: Eye,
    },
    {
      label: "Profile Completion",
      value: `${profilePct}%`,
      delta: profilePct >= 80 ? "Profile strong" : `${100 - profilePct}% left to complete`,
      deltaUp: profilePct >= 50,
      type: "bar" as const,
      points: undefined as string | undefined,
      pct: profilePct,
      color: "var(--premium-cyan)",
      icon: UserCheck,
    },
    {
      label: "Match Quality",
      value: "91",
      delta: "avg match score",
      deltaUp: true,
      type: "sparkline" as const,
      points: "0,30 20,26 40,28 60,22 80,20 100,16 120,14 140,10 160,6",
      pct: undefined as number | undefined,
      color: "oklch(0.78 0.15 83)",
      icon: Star,
    },
    {
      label: "Discovery Activity",
      value: "23",
      delta: "profile views",
      deltaUp: true,
      type: "sparkline" as const,
      points: "0,32 20,30 40,28 60,24 80,20 100,18 120,14 140,10 160,4",
      pct: undefined as number | undefined,
      color: "oklch(0.70 0.16 145)",
      icon: BarChart3,
    },
  ]

  return (
    <section ref={ref} aria-labelledby="growth-heading">
      <div className="mb-4">
        <div className="mb-1 flex items-center gap-2">
          <TrendingUp className="size-4 text-[oklch(0.70_0.16_145)]" aria-hidden="true" />
          <h2 id="growth-heading" className="text-sm font-semibold text-foreground">
            Visibility Growth
          </h2>
        </div>
        <p className="text-xs text-muted-foreground">Your metrics over the last 30 days</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {metrics.map((metric, i) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: i * 0.08, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-3 rounded-[var(--radius-xl)] border border-border bg-card p-4 shadow-[var(--shadow-card)]"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="mb-1 text-[10px] text-muted-foreground">{metric.label}</p>
                <p className="text-xl font-bold text-foreground">{metric.value}</p>
              </div>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-muted/40">
                <metric.icon className="size-3.5 text-muted-foreground" aria-hidden="true" />
              </div>
            </div>

            {/* Sparkline */}
            {metric.type === "sparkline" && metric.points && (
              <svg viewBox="0 0 160 36" className="w-full" aria-hidden="true">
                <defs>
                  <linearGradient id={`spark-grad-${i}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={metric.color} stopOpacity="0.30" />
                    <stop offset="100%" stopColor={metric.color} stopOpacity="0" />
                  </linearGradient>
                </defs>
                <polygon
                  points={`0,36 ${metric.points} 160,36`}
                  fill={`url(#spark-grad-${i})`}
                />
                <polyline
                  points={metric.points}
                  fill="none"
                  stroke={metric.color}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}

            {/* Bar */}
            {metric.type === "bar" && metric.pct !== undefined && (
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: metric.color }}
                  initial={{ width: 0 }}
                  animate={isInView ? { width: `${metric.pct}%` } : { width: 0 }}
                  transition={{ delay: 0.3 + i * 0.08, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
            )}

            <p className={cn(
              "text-[10px]",
              metric.deltaUp ? "text-[oklch(0.70_0.16_145)]" : "text-muted-foreground"
            )}>
              {metric.deltaUp ? "↑ " : ""}{metric.delta}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════════
   Section 5 — Recent Activity
   ══════════════════════════════════════════════════════════════ */
function RecentActivitySection() {
  const { ref, isInView } = useSectionView()

  return (
    <section ref={ref} aria-labelledby="activity-heading">
      <div className="mb-4">
        <div className="mb-1 flex items-center gap-2">
          <Clock className="size-4 text-muted-foreground" aria-hidden="true" />
          <h2 id="activity-heading" className="text-sm font-semibold text-foreground">Recent Activity</h2>
        </div>
        <p className="text-xs text-muted-foreground">Your latest actions and events</p>
      </div>

      <div className="overflow-hidden rounded-[var(--radius-xl)] border border-border bg-card shadow-[var(--shadow-card)]">
        {RECENT_ACTIVITY.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: 8 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: i * 0.07, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              "flex items-start gap-3 px-4 py-3",
              "transition-colors duration-150 hover:bg-muted/20",
              i < RECENT_ACTIVITY.length - 1 && "border-b border-border/30"
            )}
          >
            <div className={cn("mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg", item.bg)}>
              <item.icon className={cn("size-3.5", item.color)} aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[12px] leading-snug text-foreground">{item.text}</p>
              <p className="mt-0.5 flex items-center gap-1 text-[10px] text-muted-foreground">
                <Clock className="size-2.5" aria-hidden="true" /> {item.time}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════════
   Main Export — DashboardHomeContent
   ══════════════════════════════════════════════════════════════ */
export function DashboardHomeContent({
  firstName,
  savedCount,
  matchCount,
  newToday,
  hasDna,
  scoring,
}: DashboardHomeProps) {
  const { breakdown, flags } = scoring
  const visibilityScore = breakdown.total

  return (
    <div className="flex flex-col gap-8 max-w-[1400px]">

      {/* ── Greeting header ───────────────────────────────── */}
      <div className="flex flex-col gap-1">
        <h1 className="text-h3 font-bold text-foreground">
          {getGreeting()}, <span className="gradient-text-primary">{firstName}</span> 👋
        </h1>
        <p className="text-sm text-muted-foreground">
          {newToday > 0
            ? (
              <>
                Your AI engine found{" "}
                <span className="font-semibold text-[var(--premium-cyan)]">
                  {newToday} new {newToday === 1 ? "opportunity" : "opportunities"}
                </span>{" "}
                since your last visit. Here&apos;s where your visibility stands.
              </>
            )
            : "Your Visibility Intelligence is ready. Here's where you stand today."
          }
        </p>
      </div>

      {/* ── DNA assessment CTA (only if not taken yet) ────── */}
      {!hasDna && <DNABanner />}

      {/* ── Section 1: Visibility Score Hero ──────────────── */}
      <VisibilityScoreHero score={visibilityScore} breakdown={breakdown} />

      {/* ── Sections 2 + 6: Improvements | Quick Actions ─── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_280px]">
        <ImprovementOpportunitiesSection flags={flags} />
        <QuickActionsSection />
      </div>

      {/* ── Section 3: Recommended Opportunities ──────────── */}
      <RecommendedOpportunitiesSection />

      {/* ── Sections 4 + 5: Growth | Recent Activity ──────── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <VisibilityGrowthSection breakdown={breakdown} />
        <RecentActivitySection />
      </div>

    </div>
  )
}
