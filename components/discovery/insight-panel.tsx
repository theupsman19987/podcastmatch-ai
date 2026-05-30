"use client"

import { motion } from "motion/react"
import {
  Sparkles, Bell, TrendingUp, Eye, Zap, Users, ArrowRight, Flame
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useDiscovery } from "@/components/discovery/discovery-context"

/* ═══════════════════════════════════════════════════════════
   DiscoveryInsightPanel — right-hand AI intelligence panel.
   Shows opportunity alerts, category trends, and visibility
   signals. Visual only — wire to real API data when ready.
   ═══════════════════════════════════════════════════════════ */

const ALERTS = [
  {
    icon:    Bell,
    label:   "Actively Booking",
    body:    "Tech Startup Insider is accepting guest pitches this week",
    accent:  "text-[var(--premium-cyan)]",
    bg:      "bg-[oklch(0.70_0.16_200/0.06)]",
    border:  "border-[oklch(0.70_0.16_200/0.15)]",
  },
  {
    icon:    Flame,
    label:   "Trending Topic",
    body:    "AI & Entrepreneurship shows 41% more bookings this month",
    accent:  "text-[oklch(0.75_0.18_30)]",
    bg:      "bg-[oklch(0.60_0.20_30/0.06)]",
    border:  "border-[oklch(0.60_0.20_30/0.15)]",
  },
  {
    icon:    Sparkles,
    label:   "AI Insight",
    body:    "Your profile matches 3 new shows with open guest slots",
    accent:  "text-primary",
    bg:      "bg-primary/5",
    border:  "border-primary/15",
  },
]

const TRENDING_CATEGORIES = [
  { label: "Entrepreneurship",    delta: "+41%", hot: true  },
  { label: "Leadership",          delta: "+23%", hot: false },
  { label: "Health & Wellness",   delta: "+18%", hot: false },
]

const VISIBILITY_SIGNALS = [
  { label: "Profile Strength",   pct: 74, color: "gradient-primary"                   },
  { label: "Topic Demand",       pct: 88, color: "bg-[var(--premium-cyan)]"            },
  { label: "Match Velocity",     pct: 62, color: "bg-[var(--premium-gold)]"            },
]

/* ── Panel section header ─────────────────────────────────── */
function PanelSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
        {title}
      </p>
      {children}
    </div>
  )
}

/* ── Main panel ───────────────────────────────────────────── */
export function DiscoveryInsightPanel() {
  const { results } = useDiscovery()
  const savedCount = results.filter(p => p.saved).length

  return (
    <aside
      className="hidden 2xl:flex w-[260px] shrink-0 flex-col gap-1"
      aria-label="AI insights panel"
    >
      {/* ── Panel header ──────────────────────────────── */}
      <div className="mb-4 flex items-center gap-2">
        <div className="relative flex h-1.5 w-1.5 shrink-0">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" aria-hidden="true" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
        </div>
        <h2 className="text-sm font-semibold text-foreground">AI Intelligence</h2>
      </div>

      <div className="flex flex-col gap-5">

        {/* ── Quick metrics ─────────────────────────────── */}
        <div className="grid grid-cols-2 gap-2">
          {[
            { icon: Eye,    label: "Podcasts",     value: "847",       color: "text-[var(--premium-cyan)]" },
            { icon: Users,  label: "Saved",         value: String(savedCount || 1), color: "text-primary" },
            { icon: Zap,    label: "Match Rate",    value: "92%",       color: "text-[var(--premium-gold)]" },
            { icon: TrendingUp, label: "Velocity",  value: "+12",       color: "text-[oklch(0.70_0.16_145)]" },
          ].map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07, duration: 0.3 }}
              className="flex flex-col gap-1 rounded-[var(--radius-lg)] border border-border/40 bg-muted/20 p-2.5"
            >
              <m.icon className={cn("size-3.5", m.color)} aria-hidden="true" />
              <span className={cn("text-lg font-bold leading-none", m.color)}>{m.value}</span>
              <span className="text-[10px] text-muted-foreground">{m.label}</span>
            </motion.div>
          ))}
        </div>

        {/* ── Opportunity alerts ────────────────────────── */}
        <PanelSection title="Opportunity Alerts">
          <div className="flex flex-col gap-2">
            {ALERTS.map((alert, i) => (
              <motion.div
                key={alert.label}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.08, duration: 0.3 }}
                className={cn(
                  "rounded-[var(--radius-lg)] border p-2.5",
                  alert.bg, alert.border
                )}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <alert.icon className={cn("size-3", alert.accent)} aria-hidden="true" />
                  <span className={cn("text-[10px] font-semibold", alert.accent)}>{alert.label}</span>
                </div>
                <p className="text-[10px] leading-relaxed text-muted-foreground">{alert.body}</p>
              </motion.div>
            ))}
          </div>
        </PanelSection>

        {/* ── Trending categories ───────────────────────── */}
        <PanelSection title="Trending in Your Niche">
          <div className="flex flex-col gap-1.5">
            {TRENDING_CATEGORIES.map((cat, i) => (
              <motion.div
                key={cat.label}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25 + i * 0.06 }}
                className="flex items-center justify-between rounded-[var(--radius-md)] px-2.5 py-1.5
                           border border-border/30 bg-muted/10 hover:bg-muted/20 transition-colors cursor-default"
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  {cat.hot && <Flame className="size-3 shrink-0 text-[oklch(0.75_0.18_30)]" aria-hidden="true" />}
                  <span className="truncate text-[11px] text-foreground/80 font-medium">{cat.label}</span>
                </div>
                <span className="shrink-0 text-[10px] font-semibold text-[oklch(0.70_0.16_145)]">{cat.delta}</span>
              </motion.div>
            ))}
          </div>
        </PanelSection>

        {/* ── Visibility signals ────────────────────────── */}
        <PanelSection title="Your Visibility Signals">
          <div className="flex flex-col gap-3">
            {VISIBILITY_SIGNALS.map((sig, i) => (
              <div key={sig.label}>
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-[10px] text-muted-foreground">{sig.label}</span>
                  <span className="text-[10px] font-semibold text-foreground">{sig.pct}%</span>
                </div>
                <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
                  <motion.div
                    className={cn("h-full rounded-full", sig.color)}
                    initial={{ width: 0 }}
                    animate={{ width: `${sig.pct}%` }}
                    transition={{ delay: 0.4 + i * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>
              </div>
            ))}
          </div>
        </PanelSection>

        {/* ── Upgrade CTA ───────────────────────────────── */}
        <div className="rounded-[var(--radius-xl)] border border-[oklch(0.78_0.15_83/0.25)] bg-[oklch(0.78_0.15_83/0.06)] p-3.5">
          <div className="mb-2 flex items-center gap-1.5">
            <Sparkles className="size-3.5 text-[var(--premium-gold)]" aria-hidden="true" />
            <span className="text-[11px] font-semibold text-[var(--premium-gold)]">Full AI Reports</span>
          </div>
          <p className="mb-3 text-[10px] leading-relaxed text-muted-foreground">
            Get deep audience analysis, pitch timing, and success probability scores.
          </p>
          <button className="flex w-full items-center justify-center gap-1.5 rounded-[var(--radius-md)]
                             bg-[oklch(0.78_0.15_83/0.15)] py-1.5 text-[11px] font-semibold
                             text-[var(--premium-gold)] transition-colors hover:bg-[oklch(0.78_0.15_83/0.25)]">
            Upgrade to Pro <ArrowRight className="size-3" aria-hidden="true" />
          </button>
        </div>

      </div>
    </aside>
  )
}
