"use client"

import { motion } from "motion/react"
import {
  BrainCircuit,
  ChevronRight,
  Sparkles,
  Zap,
  Send,
  Mic2,
} from "lucide-react"
import {
  Card,
  CardBadge,
} from "@/components/ui/card"
import { NumberTicker } from "@/components/ui/number-ticker"

const MOCK_MATCHES = [
  {
    show: "Masters of Scale",
    host: "Reid Hoffman",
    score: 97,
    listeners: "1.2M listeners",
    accentClass: "bg-[var(--premium-cyan)]",
    scoreClass: "gradient-text-cyan",
  },
  {
    show: "How I Built This",
    host: "Guy Raz · NPR",
    score: 94,
    listeners: "890K listeners",
    accentClass: "bg-primary",
    scoreClass: "gradient-text-primary",
  },
  {
    show: "The Knowledge Project",
    host: "Shane Parrish",
    score: 91,
    listeners: "440K listeners",
    accentClass: "bg-[var(--premium-gold)]",
    scoreClass: "gradient-text-gold",
  },
]

const AI_METRICS = [
  { label: "Topic Alignment",  value: 92, color: "bg-primary" },
  { label: "Audience Fit",     value: 88, color: "bg-[var(--premium-cyan)]" },
  { label: "Credibility Score",value: 95, color: "bg-[var(--premium-gold)]" },
]

export function AIDashboardMockup() {
  return (
    /* Outer shell — sized to give floating cards room to overflow */
    <div className="relative w-full max-w-[480px] h-[560px]">

      {/* ── AMBIENT BACKGROUND GLOW ─────────────────────────── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 rounded-3xl blur-3xl opacity-40"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, oklch(0.58 0.22 255 / 0.25), oklch(0.70 0.16 200 / 0.10) 60%, transparent 80%)",
        }}
      />

      {/* ══════════════════════════════════════════════════════
          MAIN DASHBOARD CARD
          Floats with animate-float, has primary glow
          ══════════════════════════════════════════════════════ */}
      <motion.div
        className="absolute left-[40px] top-[40px] right-0 bottom-0 animate-float"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        <Card variant="glass" className="h-full p-5 glow-primary overflow-hidden">

          {/* ── CARD HEADER ──────────────────────────────── */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg gradient-primary shadow-[var(--glow-subtle)]">
                <BrainCircuit className="size-3.5 text-white" />
              </div>
              <span className="text-sm font-semibold text-foreground">AI Match Engine</span>
            </div>
            <CardBadge color="cyan" className="gap-1.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping-dot absolute inline-flex h-full w-full rounded-full bg-[var(--premium-cyan)] opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--premium-cyan)]" />
              </span>
              Live
            </CardBadge>
          </div>

          {/* ── PROFILE ROW ──────────────────────────────── */}
          <div className="glass rounded-xl p-3 mb-3 flex items-center gap-3">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full gradient-primary">
              <span className="text-[10px] font-bold text-white">JD</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">James Davidson</p>
              <p className="truncate text-xs text-muted-foreground">Leadership Coach · Author</p>
            </div>
            <span className="text-xs font-semibold text-[var(--premium-cyan)]">
              <NumberTicker value={98} suffix="%" duration={1200} delay={600} />
              {" "}fit
            </span>
          </div>

          {/* ── MATCH LIST HEADER ────────────────────────── */}
          <div className="mb-2 flex items-center justify-between">
            <span className="text-label">Top Matches</span>
            <span className="text-xs text-muted-foreground">847 found</span>
          </div>

          {/* ── MATCH LIST ───────────────────────────────── */}
          <div className="mb-3 flex flex-col gap-1.5">
            {MOCK_MATCHES.map((match, i) => (
              <motion.div
                key={match.show}
                className="glass flex cursor-default items-center gap-3 rounded-lg px-3 py-2.5
                           hover:bg-[var(--glass-bg-hover)] hover:border-[var(--glass-border-hover)]
                           transition-colors duration-150"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.5 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              >
                <span className={`h-2 w-2 flex-shrink-0 rounded-full ${match.accentClass}`} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium text-foreground">{match.show}</p>
                  <p className="truncate text-[10px] text-muted-foreground">{match.host}</p>
                </div>
                <div className="flex flex-col items-end gap-0.5">
                  <span className={`text-xs font-bold ${match.scoreClass}`}>
                    <NumberTicker value={match.score} suffix="%" duration={1000} delay={600 + i * 100} />
                  </span>
                  <span className="text-[10px] text-muted-foreground">{match.listeners}</span>
                </div>
                <ChevronRight className="size-3 flex-shrink-0 text-muted-foreground" />
              </motion.div>
            ))}
          </div>

          {/* ── AI ANALYSIS PANEL ────────────────────────── */}
          <motion.div
            className="glass rounded-xl p-3"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.75, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="mb-2.5 flex items-center gap-2">
              <Sparkles className="size-3 text-[var(--premium-cyan)]" />
              <span className="text-xs font-medium text-foreground">AI Analysis</span>
            </div>
            <div className="space-y-2">
              {AI_METRICS.map((metric, i) => (
                <div key={metric.label} className="flex items-center gap-2">
                  <span className="w-28 flex-shrink-0 text-[10px] text-muted-foreground">
                    {metric.label}
                  </span>
                  <div className="h-1 flex-1 overflow-hidden rounded-full bg-muted/50">
                    <motion.div
                      className={`h-full rounded-full ${metric.color}`}
                      initial={{ width: "0%" }}
                      animate={{ width: `${metric.value}%` }}
                      transition={{
                        duration: 1.0,
                        delay: 0.8 + i * 0.1,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                    />
                  </div>
                  <span className="w-7 text-right text-[10px] text-muted-foreground">
                    <NumberTicker value={metric.value} suffix="%" duration={900} delay={800 + i * 100} />
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

        </Card>
      </motion.div>

      {/* ══════════════════════════════════════════════════════
          FLOATING MINI-CARD 1 — "New Match" (top-right)
          Offset float phase, cyan glow
          ══════════════════════════════════════════════════════ */}
      <motion.div
        className="absolute right-0 top-0 z-10 w-[176px] animate-float-alt"
        initial={{ opacity: 0, y: -12, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <Card variant="glass" className="p-3.5 glow-cyan-lg shadow-[var(--shadow-float)]">
          <div className="mb-2 flex items-center gap-2">
            <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full
                            bg-[oklch(0.70_0.16_200/0.15)]">
              <Zap className="size-3 text-[var(--premium-cyan)]" />
            </div>
            <span className="text-xs font-semibold text-foreground">New Match!</span>
          </div>
          <p className="mb-2 text-[11px] leading-snug text-muted-foreground">
            Tim Ferriss Show<br />
            <span className="text-foreground font-medium">94% compatible</span>
          </p>
          <div className="flex items-center gap-1.5">
            <div className="h-1 flex-1 overflow-hidden rounded-full bg-muted/50">
              <div className="h-full w-[94%] rounded-full gradient-primary" />
            </div>
            <span className="text-[10px] font-semibold text-[var(--premium-cyan)]">94%</span>
          </div>
        </Card>
      </motion.div>

      {/* ══════════════════════════════════════════════════════
          FLOATING MINI-CARD 2 — "Pitch Sent" (bottom-left)
          Slower float phase, gold glow
          ══════════════════════════════════════════════════════ */}
      <motion.div
        className="absolute -bottom-2 left-0 z-10 w-[172px] animate-float"
        style={{ animationDelay: "-3s" }}
        initial={{ opacity: 0, y: 12, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
      >
        <Card variant="glass" className="p-3.5 glow-gold shadow-[var(--shadow-float)]">
          <div className="mb-2 flex items-center gap-2">
            <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full
                            bg-[oklch(0.78_0.15_83/0.15)]">
              <Send className="size-3 text-[var(--premium-gold)]" />
            </div>
            <span className="text-xs font-semibold text-foreground">Pitch Sent</span>
            <CardBadge color="gold" className="ml-auto px-1.5 py-0 text-[9px]">Auto</CardBadge>
          </div>
          <p className="text-[11px] leading-snug text-muted-foreground">
            How I Built This<br />
            <span className="text-foreground font-medium">Avg reply: 2.4 days</span>
          </p>
        </Card>
      </motion.div>

      {/* ── STAT PILL (floating bottom-right) ─────────────── */}
      <motion.div
        className="absolute bottom-12 right-2 z-10"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="glass flex items-center gap-1.5 rounded-full px-3 py-1.5 glow-subtle">
          <Mic2 className="size-3 text-primary" />
          <span className="text-xs font-semibold text-foreground">
            <NumberTicker value={50} suffix="K+" duration={1400} delay={1000} />
          </span>
          <span className="text-[10px] text-muted-foreground">podcasts indexed</span>
        </div>
      </motion.div>

    </div>
  )
}
