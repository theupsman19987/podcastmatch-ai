"use client"

import { useRef } from "react"
import { motion, useInView } from "motion/react"
import {
  Sparkles,
  Eye,
  TrendingUp,
  CheckCircle2,
  XCircle,
  ArrowRight,
  BrainCircuit,
  Mic2,
  Globe,
  FileText,
  Lightbulb,
  Shield,
  Bookmark,
  BarChart3,
  UserCheck,
  Users,
  Star,
  Fingerprint,
  Rocket,
  ChevronRight,
  Target,
  AlertTriangle,
  Zap,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Link from "next/link"

/* ── Animation helpers ────────────────────────────────────── */
function useSectionView() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true })
  return { ref, isInView }
}

function fadeUp(delay = 0) {
  return {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] as const },
  }
}

/* ── Shared primitives ────────────────────────────────────── */
function StepBadge({
  number,
  of = 5,
  color = "primary",
}: {
  number: number
  of?: number
  color?: "primary" | "gold" | "cyan"
}) {
  const styles = {
    primary: "border-primary/30 bg-primary/10 text-primary",
    gold:    "border-[oklch(0.78_0.15_83/0.30)] bg-[oklch(0.78_0.15_83/0.10)] text-[var(--premium-gold)]",
    cyan:    "border-[oklch(0.70_0.16_200/0.30)] bg-[oklch(0.70_0.16_200/0.10)] text-[var(--premium-cyan)]",
  }
  return (
    <span className={cn(
      "mb-4 inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-widest",
      styles[color]
    )}>
      Step 0{number} of 0{of}
    </span>
  )
}

function EyebrowLabel({
  children,
  color = "primary",
}: {
  children: React.ReactNode
  color?: "primary" | "gold" | "cyan"
}) {
  const styles = {
    primary: "border-primary/25 bg-primary/8 text-primary",
    gold:    "border-[oklch(0.78_0.15_83/0.30)] bg-[oklch(0.78_0.15_83/0.08)] text-[var(--premium-gold)]",
    cyan:    "border-[oklch(0.70_0.16_200/0.25)] bg-[oklch(0.70_0.16_200/0.08)] text-[var(--premium-cyan)]",
  }
  return (
    <div className={cn(
      "mb-5 inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold",
      styles[color]
    )}>
      <Sparkles className="size-3" aria-hidden="true" />
      {children}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   SECTION 1 — HERO
   ───────────────────────────────────────────────────────────── */
function HowItWorksHero() {
  const OVERVIEW_STEPS = [
    "Visibility Profile",
    "AI Analysis",
    "Personal Insights",
    "Opportunity Discovery",
    "Growth Tracking",
  ]

  return (
    <section
      className="relative overflow-hidden pb-24 pt-32"
      aria-labelledby="hiw-hero-heading"
    >
      {/* Background */}
      <div aria-hidden className="ai-dot-grid pointer-events-none absolute inset-0" />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[640px] w-[1000px] -translate-x-1/2"
        style={{ background: "radial-gradient(ellipse at 50% 0%, oklch(0.55 0.22 250 / 0.09) 0%, transparent 60%)" }}
      />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">

          <motion.div {...fadeUp(0.1)}>
            <EyebrowLabel>Visibility Intelligence Platform</EyebrowLabel>
          </motion.div>

          <motion.h1
            id="hiw-hero-heading"
            className="text-hero"
            {...fadeUp(0.2)}
          >
            How PodcastMatch AI Finds{" "}
            <span className="gradient-text-primary text-glow-primary">
              The Right Opportunities
            </span>{" "}
            For You
          </motion.h1>

          <motion.p
            className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed"
            {...fadeUp(0.3)}
          >
            Discover how our visibility intelligence system analyzes your expertise, audience,
            and goals — then connects you with podcasts that align with your message, not just
            your keywords.
          </motion.p>

          <motion.div
            className="mt-8 flex flex-wrap items-center justify-center gap-3"
            {...fadeUp(0.4)}
          >
            <Button variant="premium" size="lg" asChild>
              <Link href="/signup">
                Start Free Assessment <ArrowRight className="ml-1.5 size-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/discover">Explore Opportunities</Link>
            </Button>
          </motion.div>

          {/* 5-step pipeline overview */}
          <motion.div
            className="mx-auto mt-12 flex max-w-2xl flex-wrap items-center justify-center gap-x-1 gap-y-2"
            {...fadeUp(0.5)}
          >
            {OVERVIEW_STEPS.map((label, i) => (
              <div key={label} className="flex items-center gap-1">
                <div className="flex items-center gap-1.5 rounded-full border border-border/40 bg-muted/20 px-3 py-1">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary/15 text-[9px] font-bold text-primary">
                    {i + 1}
                  </span>
                  <span className="text-[11px] font-medium text-muted-foreground">{label}</span>
                </div>
                {i < OVERVIEW_STEPS.length - 1 && (
                  <ChevronRight className="size-3 text-muted-foreground/30" aria-hidden="true" />
                )}
              </div>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────────
   STEP 1 — Complete Your Visibility Profile
   Text left | Mockup right
   ───────────────────────────────────────────────────────────── */
function Step1ProfileSection() {
  const { ref, isInView } = useSectionView()

  const questions = [
    { label: "What's your primary expertise area?",    done: true  },
    { label: "Who is your ideal audience?",            done: true  },
    { label: "What outcomes do you help people get?",  done: false },
    { label: "What's your communication style?",       done: false },
  ]

  const chips = [
    { label: "Business Strategy",   checked: true  },
    { label: "Leadership",          checked: true  },
    { label: "Tech & Innovation",   checked: false },
    { label: "Personal Growth",     checked: false },
  ]

  return (
    <section
      ref={ref}
      className="relative overflow-hidden py-24"
      aria-labelledby="step1-heading"
    >
      {/* Subtle left glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-48 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full"
        style={{ background: "radial-gradient(circle, oklch(0.55 0.22 250 / 0.06) 0%, transparent 65%)" }}
      />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">

          {/* ── Text ─────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <StepBadge number={1} color="primary" />

            <h2 id="step1-heading" className="text-h2 mb-4">
              Complete Your{" "}
              <span className="gradient-text-primary">Visibility Profile</span>
            </h2>

            <p className="text-base text-muted-foreground leading-relaxed mb-6">
              Answer a series of guided questions about your expertise, audience, experience,
              goals, and message. This isn&apos;t a form — it&apos;s an intelligence intake.
              Every answer sharpens the AI&apos;s understanding of who you are and who needs
              to hear you.
            </p>

            <div className="space-y-3">
              {[
                { icon: Fingerprint, text: "Deep expertise mapping — beyond job titles" },
                { icon: UserCheck,   text: "Audience profile aligned to podcast listeners" },
                { icon: Target,      text: "Communication style and authority positioning" },
                { icon: Lightbulb,   text: "Goals, experience, and visibility potential" },
              ].map((item, i) => (
                <motion.div
                  key={item.text}
                  className="flex items-start gap-3"
                  initial={{ opacity: 0, x: -12 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.2 + i * 0.08, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <item.icon className="size-3.5 text-primary" aria-hidden="true" />
                  </div>
                  <p className="text-sm text-muted-foreground pt-0.5">{item.text}</p>
                </motion.div>
              ))}
            </div>

            <motion.p
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/8 px-4 py-2 text-xs font-semibold text-primary"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <Zap className="size-3" aria-hidden="true" />
              Outcome: The platform begins understanding exactly who you are
            </motion.p>
          </motion.div>

          {/* ── Profile Assessment Mockup ─────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="relative rounded-[var(--radius-xl)] border border-border bg-card p-6 shadow-[var(--shadow-lg)]">
              {/* Top shimmer */}
              <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-t-[var(--radius-xl)] bg-gradient-to-r from-transparent via-primary/25 to-transparent" />

              {/* Header */}
              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-md gradient-primary shadow-[var(--glow-subtle)]">
                    <Fingerprint className="size-3 text-white" aria-hidden="true" />
                  </div>
                  <span className="text-xs font-semibold text-foreground">Visibility Profile</span>
                </div>
                <span className="text-[10px] text-muted-foreground">Step 3 of 7</span>
              </div>

              {/* Progress bar */}
              <div className="mb-5">
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-[10px] text-muted-foreground">Profile completion</span>
                  <span className="text-[10px] font-semibold text-primary">42%</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <motion.div
                    className="h-full rounded-full gradient-primary"
                    initial={{ width: 0 }}
                    animate={isInView ? { width: "42%" } : { width: 0 }}
                    transition={{ delay: 0.5, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                    style={{ boxShadow: "var(--glow-subtle)" }}
                  />
                </div>
              </div>

              {/* Current question */}
              <p className="mb-4 text-sm font-semibold text-foreground">
                What best describes your primary expertise area?
              </p>

              {/* Chips */}
              <div className="mb-5 grid grid-cols-2 gap-2">
                {chips.map((chip, i) => (
                  <motion.div
                    key={chip.label}
                    initial={{ opacity: 0, y: 6 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.4 + i * 0.07, duration: 0.35 }}
                    className={cn(
                      "flex items-center gap-2 rounded-[var(--radius-lg)] border px-3 py-2 text-xs font-medium cursor-default",
                      chip.checked
                        ? "border-primary/35 bg-primary/10 text-primary"
                        : "border-border/50 bg-muted/20 text-muted-foreground"
                    )}
                  >
                    <div className={cn(
                      "flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-sm border",
                      chip.checked
                        ? "border-primary bg-primary"
                        : "border-muted-foreground/40 bg-transparent"
                    )}>
                      {chip.checked && <CheckCircle2 className="size-3 text-white" aria-hidden="true" />}
                    </div>
                    {chip.label}
                  </motion.div>
                ))}
              </div>

              {/* Progress dots */}
              <div className="mb-5 flex items-center gap-1.5">
                {questions.map((q, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <div className={cn(
                      "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[9px] font-bold",
                      q.done
                        ? "bg-primary/15 text-primary"
                        : i === 2
                        ? "border border-primary/40 bg-transparent text-primary"
                        : "border border-border/40 bg-transparent text-muted-foreground/40"
                    )}>
                      {q.done ? <CheckCircle2 className="size-3 text-primary" aria-hidden="true" /> : i + 1}
                    </div>
                    {i < questions.length - 1 && (
                      <div className={cn("h-px w-4 rounded-full", q.done ? "bg-primary/30" : "bg-border/30")} />
                    )}
                  </div>
                ))}
                <span className="ml-2 text-[10px] text-muted-foreground">Question {3} of {questions.length + 3}</span>
              </div>

              {/* Nav buttons */}
              <div className="flex items-center justify-between border-t border-border/30 pt-4">
                <button className="text-xs text-muted-foreground hover:text-foreground transition-colors">← Back</button>
                <div className="flex h-8 items-center gap-1 rounded-lg bg-primary px-4 text-xs font-semibold text-white shadow-[var(--glow-subtle)] cursor-default">
                  Continue <ArrowRight className="size-3 ml-1" aria-hidden="true" />
                </div>
              </div>
            </div>

          </motion.div>

        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────────
   STEP 2 — Analyze Your Visibility Potential (CENTERPIECE)
   Full-width spotlight — this is the Visibility Score reveal
   ───────────────────────────────────────────────────────────── */
const RING_R    = 80
const RING_CIRC = 2 * Math.PI * RING_R

const SUBSCORES = [
  { label: "Authority Score",    score: 84, color: "var(--premium-gold)",   barBg: "bg-[oklch(0.78_0.15_83/0.10)]",   barFill: "bg-[var(--premium-gold)]"   },
  { label: "Audience Alignment", score: 81, color: "var(--premium-cyan)",   barBg: "bg-[oklch(0.70_0.16_200/0.10)]",  barFill: "bg-[var(--premium-cyan)]"   },
  { label: "Message Clarity",    score: 73, color: "var(--primary)",        barBg: "bg-primary/10",                   barFill: "bg-primary"                 },
  { label: "Podcast Readiness",  score: 77, color: "var(--premium-cyan)",   barBg: "bg-[oklch(0.70_0.16_200/0.10)]",  barFill: "bg-[var(--premium-cyan)]"   },
  { label: "Growth Potential",   score: 89, color: "oklch(0.70 0.16 145)",  barBg: "bg-[oklch(0.55_0.16_145/0.10)]",  barFill: "bg-[oklch(0.70_0.16_145)]"  },
]

function Step2VisibilitySection() {
  const { ref, isInView } = useSectionView()
  const score  = 74
  const filled = RING_CIRC * (score / 100)

  return (
    <section
      ref={ref}
      className="relative overflow-hidden py-24"
      aria-labelledby="step2-heading"
    >
      {/* Full-width center glow — makes this section feel distinct */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-full"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, oklch(0.55 0.22 250 / 0.05) 0%, transparent 65%)",
        }}
      />
      <div aria-hidden className="ai-dot-grid pointer-events-none absolute inset-0 opacity-40" />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <StepBadge number={2} color="gold" />
          <h2 id="step2-heading" className="text-h2 mx-auto max-w-2xl">
            Analyze Your{" "}
            <span className="gradient-text-gold">Visibility Potential</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground leading-relaxed">
            Our AI evaluates your authority, audience alignment, communication strengths, and
            podcast readiness. For the first time, you&apos;ll see exactly how visible you are —
            and precisely what&apos;s holding you back.
          </p>
        </motion.div>

        {/* Visibility Score showcase card */}
        <motion.div
          className="relative overflow-hidden rounded-[var(--radius-xl)] border border-[oklch(0.78_0.15_83/0.20)] bg-card shadow-[var(--shadow-lg),var(--glow-gold)]"
          initial={{ opacity: 0, y: 28 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Gold shimmer top */}
          <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[oklch(0.78_0.15_83/0.50)] to-transparent" />
          {/* Ambient glow */}
          <div aria-hidden className="pointer-events-none absolute right-0 top-0 h-64 w-64 rounded-full bg-[oklch(0.78_0.15_83/0.04)] blur-3xl" />

          <div className="flex flex-col items-center gap-10 p-8 lg:flex-row lg:gap-16 lg:p-12">

            {/* ── Ring gauge ─────────────────────────────── */}
            <div className="relative shrink-0">
              <div className="relative h-52 w-52">
                <svg viewBox="0 0 200 200" className="h-full w-full" aria-hidden="true">
                  <defs>
                    <linearGradient id="hiw-ring-grad" gradientUnits="userSpaceOnUse" x1="20" y1="100" x2="180" y2="100">
                      <stop offset="0%" stopColor="oklch(0.55 0.22 250)" />
                      <stop offset="50%" stopColor="oklch(0.70 0.16 200)" />
                      <stop offset="100%" stopColor="oklch(0.78 0.15 83)" />
                    </linearGradient>
                  </defs>
                  {/* Track */}
                  <circle cx="100" cy="100" r={RING_R} fill="none" stroke="oklch(0.22 0.05 250)" strokeWidth="10" />
                  {/* Filled arc */}
                  <motion.circle
                    cx="100" cy="100" r={RING_R}
                    fill="none"
                    stroke="url(#hiw-ring-grad)"
                    strokeWidth="10"
                    strokeLinecap="round"
                    transform="rotate(-90 100 100)"
                    initial={{ strokeDasharray: `0 ${RING_CIRC.toFixed(2)}` }}
                    animate={isInView
                      ? { strokeDasharray: `${filled.toFixed(2)} ${RING_CIRC.toFixed(2)}` }
                      : { strokeDasharray: `0 ${RING_CIRC.toFixed(2)}` }
                    }
                    transition={{ duration: 1.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    style={{ filter: "drop-shadow(0 0 16px oklch(0.55 0.22 250 / 0.50))" }}
                  />
                </svg>
                {/* Score overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <motion.span
                    className="text-[56px] font-bold leading-none gradient-text-primary"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ delay: 0.7, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
                  >
                    {score}
                  </motion.span>
                  <span className="mt-1 text-xs font-medium text-muted-foreground">/ 100</span>
                </div>
              </div>

              {/* Status badge below ring */}
              <motion.div
                className="mt-3 flex justify-center"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.9, duration: 0.4 }}
              >
                <span className="rounded-full border border-primary/25 bg-primary/10 px-4 py-1 text-xs font-semibold text-primary">
                  Growing
                </span>
              </motion.div>
            </div>

            {/* ── Subscores + text ────────────────────────── */}
            <div className="flex-1 min-w-0">
              <div className="mb-2 flex items-center gap-2">
                <Eye className="size-4 text-[var(--premium-gold)]" aria-hidden="true" />
                <span className="text-sm font-semibold text-[var(--premium-gold)] uppercase tracking-widest text-[11px]">
                  Visibility Intelligence Report
                </span>
              </div>
              <h3 className="mb-1 text-xl font-bold text-foreground">
                Your Expert Presence, Quantified
              </h3>
              <p className="mb-6 text-sm text-muted-foreground">
                Five dimensions. One number. Your complete picture of podcast readiness.
              </p>

              <div className="space-y-3">
                {SUBSCORES.map((sub, i) => (
                  <motion.div
                    key={sub.label}
                    initial={{ opacity: 0, x: 16 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.3 + i * 0.09, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    className="flex items-center gap-3"
                  >
                    <span className="w-36 shrink-0 text-[12px] font-medium text-muted-foreground">
                      {sub.label}
                    </span>
                    <div className={cn("h-1.5 flex-1 overflow-hidden rounded-full", sub.barBg)}>
                      <motion.div
                        className={cn("h-full rounded-full", sub.barFill)}
                        initial={{ width: 0 }}
                        animate={isInView ? { width: `${sub.score}%` } : { width: 0 }}
                        transition={{ delay: 0.5 + i * 0.09, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                      />
                    </div>
                    <span className="w-7 shrink-0 text-right text-[12px] font-bold" style={{ color: sub.color }}>
                      {sub.score}
                    </span>
                  </motion.div>
                ))}
              </div>

              <motion.div
                className="mt-6 rounded-[var(--radius-lg)] border border-[oklch(0.78_0.15_83/0.20)] bg-[oklch(0.78_0.15_83/0.05)] p-4"
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.9, duration: 0.5 }}
              >
                <p className="text-xs text-muted-foreground">
                  <span className="font-semibold text-[var(--premium-gold)]">This is the first platform</span> to give
                  you a real visibility score — not just a list of podcasts. You&apos;ll know exactly
                  where you stand and exactly what to improve.
                </p>
              </motion.div>
            </div>

          </div>
        </motion.div>

      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────────
   STEP 3 — Receive Personalized Insights (Coaching feel)
   Mockup left | Text right
   ───────────────────────────────────────────────────────────── */
const GAP_ITEMS = [
  { label: "No website detected",        pts: "-8",  icon: Globe    },
  { label: "Missing media kit",          pts: "-6",  icon: FileText },
  { label: "Unclear expert positioning", pts: "-5",  icon: Target   },
  { label: "No speaker bio uploaded",    pts: "-4",  icon: UserCheck},
  { label: "Missing social proof",       pts: "-4",  icon: Shield   },
]

const ACTIONS = [
  { label: "Add your website URL",    pts: "+8",  icon: Globe     },
  { label: "Create a 1-page media kit", pts: "+6", icon: FileText  },
  { label: "Define your signature topic",pts: "+5",icon: Lightbulb },
  { label: "Upload speaker bio",       pts: "+4",  icon: UserCheck },
  { label: "Add 3 client testimonials",pts: "+4",  icon: Star      },
]

function Step3InsightsSection() {
  const { ref, isInView } = useSectionView()

  return (
    <section
      ref={ref}
      className="relative overflow-hidden py-24"
      aria-labelledby="step3-heading"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-48 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full"
        style={{ background: "radial-gradient(circle, oklch(0.70 0.16 200 / 0.05) 0%, transparent 65%)" }}
      />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">

          {/* ── Gap Analysis Mockup ───────────────────────── */}
          <motion.div
            className="order-2 lg:order-1"
            initial={{ opacity: 0, x: -24 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="relative grid grid-cols-1 gap-3 sm:grid-cols-2">

              {/* Gaps panel */}
              <div className="rounded-[var(--radius-xl)] border border-red-500/20 bg-card p-5 shadow-[var(--shadow-card)]">
                <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-t-[var(--radius-xl)] bg-gradient-to-r from-transparent via-red-500/20 to-transparent" />
                <div className="mb-3 flex items-center gap-2">
                  <AlertTriangle className="size-4 text-red-400" aria-hidden="true" />
                  <span className="text-xs font-bold uppercase tracking-wide text-red-400">Visibility Gaps</span>
                </div>
                <div className="space-y-2">
                  {GAP_ITEMS.map((g, i) => (
                    <motion.div
                      key={g.label}
                      className="flex items-center justify-between gap-2"
                      initial={{ opacity: 0, x: -8 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: 0.3 + i * 0.07, duration: 0.35 }}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <XCircle className="size-3.5 shrink-0 text-red-400/70" aria-hidden="true" />
                        <span className="text-[11px] text-muted-foreground truncate">{g.label}</span>
                      </div>
                      <span className="shrink-0 rounded bg-red-500/10 px-1.5 py-0.5 text-[10px] font-bold text-red-400">
                        {g.pts}
                      </span>
                    </motion.div>
                  ))}
                </div>
                <div className="mt-3 rounded-lg border border-red-500/15 bg-red-500/5 px-3 py-2">
                  <p className="text-[10px] font-semibold text-red-400">Score impact: −27 pts hidden</p>
                </div>
              </div>

              {/* Actions panel */}
              <div className="rounded-[var(--radius-xl)] border border-[oklch(0.55_0.16_145/0.25)] bg-card p-5 shadow-[var(--shadow-card)]">
                <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-t-[var(--radius-xl)] bg-gradient-to-r from-transparent via-[oklch(0.55_0.16_145/0.30)] to-transparent" />
                <div className="mb-3 flex items-center gap-2">
                  <Rocket className="size-4 text-[oklch(0.70_0.16_145)]" aria-hidden="true" />
                  <span className="text-xs font-bold uppercase tracking-wide text-[oklch(0.70_0.16_145)]">
                    Improvements
                  </span>
                </div>
                <div className="space-y-2">
                  {ACTIONS.map((a, i) => (
                    <motion.div
                      key={a.label}
                      className="flex items-center justify-between gap-2"
                      initial={{ opacity: 0, x: 8 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: 0.35 + i * 0.07, duration: 0.35 }}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <CheckCircle2 className="size-3.5 shrink-0 text-[oklch(0.70_0.16_145)]" aria-hidden="true" />
                        <span className="text-[11px] text-muted-foreground truncate">{a.label}</span>
                      </div>
                      <span className="shrink-0 rounded bg-[oklch(0.55_0.16_145/0.12)] px-1.5 py-0.5 text-[10px] font-bold text-[oklch(0.70_0.16_145)]">
                        {a.pts}
                      </span>
                    </motion.div>
                  ))}
                </div>
                <div className="mt-3 rounded-lg border border-[oklch(0.55_0.16_145/0.20)] bg-[oklch(0.55_0.16_145/0.06)] px-3 py-2">
                  <p className="text-[10px] font-semibold text-[oklch(0.70_0.16_145)]">Unlock potential: +27 pts</p>
                </div>
              </div>

            </div>
          </motion.div>

          {/* ── Text ─────────────────────────────────────── */}
          <motion.div
            className="order-1 lg:order-2"
            initial={{ opacity: 0, x: 24 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <StepBadge number={3} color="primary" />

            <h2 id="step3-heading" className="text-h2 mb-4">
              Receive{" "}
              <span className="gradient-text-primary">Personalized Insights</span>
            </h2>

            <p className="text-base text-muted-foreground leading-relaxed mb-6">
              This isn&apos;t a score. It&apos;s a roadmap. PodcastMatch AI acts as your
              visibility coach — surfacing exactly what&apos;s preventing you from getting booked
              and showing you the precise actions that will move the needle.
            </p>

            <div className="space-y-3 mb-6">
              {[
                "Specific gaps ranked by visibility impact",
                "Improvement actions with measurable score outcomes",
                "No website? No media kit? The platform tells you exactly what to fix and why",
                "Prioritized roadmap — highest impact actions first",
              ].map((text, i) => (
                <motion.div
                  key={text}
                  className="flex items-start gap-2.5"
                  initial={{ opacity: 0, x: 12 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.2 + i * 0.08, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                  <p className="text-sm text-muted-foreground">{text}</p>
                </motion.div>
              ))}
            </div>

            <motion.div
              className="rounded-[var(--radius-lg)] border border-primary/20 bg-primary/5 p-4"
              initial={{ opacity: 0, y: 8 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              <p className="text-xs font-semibold text-primary mb-1">Not just a matching engine.</p>
              <p className="text-xs text-muted-foreground">
                Most platforms help you search. PodcastMatch AI helps you become the expert
                that podcast hosts want to book.
              </p>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────────
   STEP 4 — Discover High Alignment Opportunities
   Text left | Mockup right
   ───────────────────────────────────────────────────────────── */
const MATCH_PODS = [
  {
    name: "The Startup Mindset Podcast",
    host: "David Chen",
    listeners: "82K",
    audienceFit: 94,
    matchScore: 96,
    topic: "Entrepreneurship",
    impact: "High Visibility",
    isTop: true,
  },
  {
    name: "Women in Leadership",
    host: "Sarah Mitchell",
    listeners: "47K",
    audienceFit: 88,
    matchScore: 91,
    topic: "Leadership",
    impact: "Strong Reach",
    isTop: false,
  },
  {
    name: "Tech Founders Weekly",
    host: "James Park",
    listeners: "31K",
    audienceFit: 82,
    matchScore: 88,
    topic: "Technology",
    impact: "Growing Audience",
    isTop: false,
  },
]

function Step4DiscoverySection() {
  const { ref, isInView } = useSectionView()

  return (
    <section
      ref={ref}
      className="relative overflow-hidden py-24"
      aria-labelledby="step4-heading"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -left-48 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full"
        style={{ background: "radial-gradient(circle, oklch(0.70 0.16 200 / 0.06) 0%, transparent 65%)" }}
      />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2 lg:gap-16">

          {/* ── Text ─────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <StepBadge number={4} color="cyan" />

            <h2 id="step4-heading" className="text-h2 mb-4">
              Discover High Alignment{" "}
              <span className="gradient-text-cyan">Opportunities</span>
            </h2>

            <p className="text-base text-muted-foreground leading-relaxed mb-6">
              Your curated podcast recommendations aren&apos;t based on keywords — they&apos;re
              built from your full visibility profile. Every recommendation is scored by
              how well it aligns with your expertise, audience, and visibility goals.
            </p>

            <div className="space-y-4 mb-6">
              {[
                { icon: BrainCircuit, label: "Match Score",           desc: "AI-calculated fit between your profile and the show's audience" },
                { icon: Users,        label: "Audience Fit",          desc: "Listener demographics aligned to your ideal client profile"     },
                { icon: Target,       label: "Topic Alignment",       desc: "How closely your expertise maps to the podcast's content focus" },
                { icon: TrendingUp,   label: "Visibility Potential",  desc: "The estimated reach and authority boost from appearing on this show" },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  className="flex items-start gap-3"
                  initial={{ opacity: 0, x: -12 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.2 + i * 0.08, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[oklch(0.70_0.16_200/0.10)]">
                    <item.icon className="size-4 text-[var(--premium-cyan)]" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* ── Podcast cards mockup ──────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-3"
          >
            {MATCH_PODS.map((pod, i) => {
              const isGold = pod.matchScore >= 95
              const isBlue = pod.matchScore >= 90 && !isGold
              const scoreColor = isGold ? "text-[var(--premium-gold)]" : isBlue ? "text-primary" : "text-[var(--premium-cyan)]"
              const scoreBg    = isGold
                ? "bg-[oklch(0.78_0.15_83/0.12)] border-[oklch(0.78_0.15_83/0.25)]"
                : isBlue ? "bg-primary/10 border-primary/25"
                : "bg-[oklch(0.70_0.16_200/0.10)] border-[oklch(0.70_0.16_200/0.25)]"

              return (
                <motion.div
                  key={pod.name}
                  initial={{ opacity: 0, y: 14 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.25 + i * 0.12, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className={cn(
                    "relative rounded-[var(--radius-xl)] border bg-card p-4 shadow-[var(--shadow-card)]",
                    pod.isTop ? "border-[oklch(0.78_0.15_83/0.25)] ring-1 ring-[oklch(0.78_0.15_83/0.15)]" : "border-border"
                  )}
                >
                  {pod.isTop && (
                    <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-t-[var(--radius-xl)] bg-gradient-to-r from-transparent via-[oklch(0.78_0.15_83/0.40)] to-transparent" />
                  )}

                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[oklch(0.70_0.16_200/0.10)]">
                      <Mic2 className="size-4 text-[var(--premium-cyan)]" aria-hidden="true" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-semibold text-foreground">{pod.name}</p>
                      <p className="text-[11px] text-muted-foreground">{pod.host} · {pod.listeners} listeners</p>
                    </div>
                    <div className={cn(
                      "flex h-10 w-11 shrink-0 flex-col items-center justify-center rounded-lg border text-center",
                      scoreBg
                    )}>
                      <span className={cn("text-[14px] font-bold leading-none", scoreColor)}>{pod.matchScore}</span>
                      <span className="text-[8px] text-muted-foreground">match</span>
                    </div>
                  </div>

                  {/* Audience fit bar */}
                  <div className="mt-3">
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-[10px] text-muted-foreground">Audience Fit</span>
                      <span className="text-[10px] font-semibold text-foreground">{pod.audienceFit}%</span>
                    </div>
                    <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
                      <motion.div
                        className="h-full rounded-full gradient-primary"
                        initial={{ width: 0 }}
                        animate={isInView ? { width: `${pod.audienceFit}%` } : { width: 0 }}
                        transition={{ delay: 0.5 + i * 0.12, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                      />
                    </div>
                  </div>

                  <div className="mt-2 flex items-center gap-2">
                    <span className={cn(
                      "rounded-full border px-2 py-0.5 text-[9px] font-semibold",
                      isGold
                        ? "border-[oklch(0.78_0.15_83/0.25)] bg-[oklch(0.78_0.15_83/0.10)] text-[var(--premium-gold)]"
                        : isBlue ? "border-primary/25 bg-primary/8 text-primary"
                        : "border-[oklch(0.70_0.16_200/0.25)] bg-[oklch(0.70_0.16_200/0.08)] text-[var(--premium-cyan)]"
                    )}>
                      {pod.impact}
                    </span>
                    <span className="rounded-full border border-border/40 bg-muted/20 px-2 py-0.5 text-[9px] text-muted-foreground">
                      {pod.topic}
                    </span>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>

        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────────
   STEP 5 — Take Action And Grow
   Mockup left | Text right
   ───────────────────────────────────────────────────────────── */
function Step5GrowthSection() {
  const { ref, isInView } = useSectionView()

  const GROWTH_ACTIONS = [
    { icon: Bookmark,   color: "text-[var(--premium-cyan)]",   bg: "bg-[oklch(0.70_0.16_200/0.10)]", label: "Save Opportunities",      desc: "Build your curated pipeline of high-fit shows"    },
    { icon: BarChart3,  color: "text-primary",                  bg: "bg-primary/10",                  label: "Track Progress",           desc: "Monitor outreach, responses, and bookings"        },
    { icon: UserCheck,  color: "text-[var(--premium-gold)]",   bg: "bg-[oklch(0.78_0.15_83/0.10)]",  label: "Improve Your Profile",     desc: "Complete actions that increase your score"        },
    { icon: TrendingUp, color: "text-[oklch(0.70_0.16_145)]",  bg: "bg-[oklch(0.55_0.16_145/0.10)]", label: "Grow Your Score",          desc: "Watch your Visibility Score rise with each action"},
    { icon: Star,       color: "text-[var(--premium-gold)]",   bg: "bg-[oklch(0.78_0.15_83/0.10)]",  label: "Build Authority Over Time", desc: "Compound visibility as your profile strengthens" },
  ]

  const scoreStages = [
    { label: "Start",   score: 62, note: "Initial assessment"    },
    { label: "Week 2",  score: 68, note: "Profile completed"     },
    { label: "Week 4",  score: 74, note: "Gaps closed"           },
    { label: "Month 2", score: 81, note: "First appearances"     },
    { label: "Month 3", score: 89, note: "Expert level"          },
  ]

  return (
    <section
      ref={ref}
      className="relative overflow-hidden py-24"
      aria-labelledby="step5-heading"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full"
        style={{ background: "radial-gradient(circle, oklch(0.78 0.15 83 / 0.05) 0%, transparent 65%)" }}
      />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2 lg:gap-16">

          {/* ── Growth visual mockup ─────────────────────── */}
          <motion.div
            className="order-2 lg:order-1"
            initial={{ opacity: 0, x: -24 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="rounded-[var(--radius-xl)] border border-[oklch(0.78_0.15_83/0.20)] bg-card p-6 shadow-[var(--shadow-card)]">
              <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-t-[var(--radius-xl)] bg-gradient-to-r from-transparent via-[oklch(0.78_0.15_83/0.35)] to-transparent" />

              <div className="mb-4 flex items-center gap-2">
                <Eye className="size-4 text-[var(--premium-gold)]" aria-hidden="true" />
                <span className="text-xs font-semibold text-foreground">Visibility Score Growth</span>
              </div>

              {/* Score trajectory */}
              <div className="mb-6">
                <svg viewBox="0 0 300 80" className="w-full" aria-hidden="true">
                  <defs>
                    <linearGradient id="growth-line-grad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="oklch(0.55 0.22 250)" />
                      <stop offset="100%" stopColor="oklch(0.78 0.15 83)" />
                    </linearGradient>
                    <linearGradient id="growth-area-grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="oklch(0.55 0.22 250)" stopOpacity="0.20" />
                      <stop offset="100%" stopColor="oklch(0.55 0.22 250)" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {/* Area fill */}
                  <polygon
                    points="0,80 0,62 75,52 150,42 225,25 300,8 300,80"
                    fill="url(#growth-area-grad)"
                  />
                  {/* Line */}
                  <polyline
                    points="0,62 75,52 150,42 225,25 300,8"
                    fill="none"
                    stroke="url(#growth-line-grad)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {/* Dots */}
                  {scoreStages.map((s, i) => {
                    const x = i * 75
                    const y = [62, 52, 42, 25, 8][i]
                    return (
                      <circle
                        key={s.label}
                        cx={x} cy={y} r="4"
                        fill="oklch(0.78 0.15 83)"
                        stroke="oklch(0.14 0.03 252)"
                        strokeWidth="1.5"
                      />
                    )
                  })}
                </svg>

                {/* Stage labels */}
                <div className="flex items-start justify-between">
                  {scoreStages.map((s, i) => (
                    <motion.div
                      key={s.label}
                      className="flex flex-col items-center"
                      initial={{ opacity: 0, y: 6 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ delay: 0.4 + i * 0.1, duration: 0.35 }}
                    >
                      <span className={cn(
                        "text-[11px] font-bold",
                        i === scoreStages.length - 1 ? "text-[var(--premium-gold)]" : "text-foreground"
                      )}>
                        {s.score}
                      </span>
                      <span className="text-[9px] text-muted-foreground">{s.label}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Pipeline stages */}
              <div className="space-y-2.5">
                {[
                  { label: "Saved Opportunities",   count: 12, color: "bg-[var(--premium-cyan)]" },
                  { label: "Outreach Sent",          count: 8,  color: "bg-primary"               },
                  { label: "Responses Received",     count: 5,  color: "bg-[var(--premium-gold)]" },
                  { label: "Interviews Booked",      count: 2,  color: "bg-[oklch(0.70_0.16_145)]"},
                ].map((stage, i) => (
                  <div key={stage.label} className="flex items-center gap-3">
                    <span className="w-36 shrink-0 text-[11px] text-muted-foreground">{stage.label}</span>
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                      <motion.div
                        className={cn("h-full rounded-full", stage.color)}
                        initial={{ width: 0 }}
                        animate={isInView ? { width: `${stage.count * 8}%` } : { width: 0 }}
                        transition={{ delay: 0.6 + i * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                      />
                    </div>
                    <span className="w-4 shrink-0 text-right text-[11px] font-semibold text-foreground">{stage.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* ── Text ─────────────────────────────────────── */}
          <motion.div
            className="order-1 lg:order-2"
            initial={{ opacity: 0, x: 24 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <StepBadge number={5} color="gold" />

            <h2 id="step5-heading" className="text-h2 mb-4">
              Take Action{" "}
              <span className="gradient-text-gold">And Grow</span>
            </h2>

            <p className="text-base text-muted-foreground leading-relaxed mb-6">
              PodcastMatch AI isn&apos;t a one-time search. It&apos;s a system. Every action you
              take — every improvement, every saved opportunity, every outreach — compounds
              into a stronger profile, a higher score, and more visibility.
            </p>

            <div className="space-y-3">
              {GROWTH_ACTIONS.map((action, i) => (
                <motion.div
                  key={action.label}
                  className="flex items-start gap-3 rounded-[var(--radius-lg)] border border-border/40 bg-card px-4 py-3 shadow-[var(--shadow-card)]"
                  initial={{ opacity: 0, x: 12 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.2 + i * 0.08, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", action.bg)}>
                    <action.icon className={cn("size-4", action.color)} aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-[12px] font-semibold text-foreground">{action.label}</p>
                    <p className="text-[11px] text-muted-foreground">{action.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────────
   SECTION 7 — The PodcastMatch AI Difference
   ───────────────────────────────────────────────────────────── */
const TRADITIONAL = [
  "Search a database of podcasts",
  "Browse generic listings",
  "Guess which shows fit your niche",
  "Send cold pitches into the void",
  "Hope someone responds",
  "No idea why you were or weren't booked",
  "No growth tracking or feedback",
]

const PODMATCH_AI = [
  "Complete a Visibility Assessment",
  "Receive your AI-generated Visibility Score",
  "Get a personalized Improvement Roadmap",
  "Discover curated, high-match opportunities",
  "AI matching based on 40+ compatibility signals",
  "Track growth and score improvement over time",
  "Build authority with every action you take",
]

function TheDifferenceSection() {
  const { ref, isInView } = useSectionView()

  return (
    <section
      ref={ref}
      className="relative overflow-hidden py-24"
      aria-labelledby="difference-heading"
    >
      <div aria-hidden className="ai-dot-grid pointer-events-none absolute inset-0 opacity-30" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent 0%, oklch(0.55 0.22 250 / 0.20) 50%, transparent 100%)" }}
      />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <motion.div
          className="mb-14 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <EyebrowLabel color="gold">Why It Matters</EyebrowLabel>
          <h2 id="difference-heading" className="text-h2 mx-auto max-w-2xl">
            The{" "}
            <span className="gradient-text-gold">PodcastMatch AI</span>{" "}
            Difference
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground leading-relaxed">
            Most platforms help you search for podcasts. We help you become the expert that
            podcast hosts want to book.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

          {/* Traditional Platforms */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.65, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="relative overflow-hidden rounded-[var(--radius-xl)] border border-border bg-muted/20 p-6 shadow-[var(--shadow-card)]"
          >
            <div className="mb-5">
              <span className="mb-2 inline-block rounded-full border border-border/60 bg-muted/30 px-3 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Traditional Platforms
              </span>
              <p className="text-sm text-muted-foreground">
                Search-based. Passive. Hope-driven.
              </p>
            </div>

            <div className="space-y-2.5">
              {TRADITIONAL.map((item, i) => (
                <motion.div
                  key={item}
                  className="flex items-start gap-3"
                  initial={{ opacity: 0, x: -8 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.2 + i * 0.07, duration: 0.35 }}
                >
                  <XCircle className="mt-0.5 size-4 shrink-0 text-muted-foreground/40" aria-hidden="true" />
                  <p className="text-sm text-muted-foreground">{item}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* PodcastMatch AI */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.65, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="relative overflow-hidden rounded-[var(--radius-xl)] border border-[oklch(0.78_0.15_83/0.25)] bg-card p-6 shadow-[var(--shadow-card),var(--glow-gold)]"
          >
            {/* Top shimmer */}
            <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-t-[var(--radius-xl)] bg-gradient-to-r from-transparent via-[oklch(0.78_0.15_83/0.50)] to-transparent" />
            {/* Corner glow */}
            <div aria-hidden className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[oklch(0.78_0.15_83/0.08)] blur-2xl" />

            <div className="relative mb-5">
              <span className="mb-2 inline-block rounded-full border border-[oklch(0.78_0.15_83/0.35)] bg-[oklch(0.78_0.15_83/0.10)] px-3 py-1 text-xs font-semibold text-[var(--premium-gold)] uppercase tracking-wide">
                PodcastMatch AI
              </span>
              <p className="text-sm text-muted-foreground">
                Intelligence-led. Proactive. Growth-focused.
              </p>
            </div>

            <div className="relative space-y-2.5">
              {PODMATCH_AI.map((item, i) => (
                <motion.div
                  key={item}
                  className="flex items-start gap-3"
                  initial={{ opacity: 0, x: 8 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.25 + i * 0.07, duration: 0.35 }}
                >
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-[var(--premium-gold)]" aria-hidden="true" />
                  <p className="text-sm text-foreground font-medium">{item}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

        </div>

        {/* Bottom capability row */}
        <motion.div
          className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4"
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {[
            { icon: BrainCircuit, label: "AI-Powered Analysis",    color: "text-primary",               bg: "bg-primary/10",                  border: "border-primary/20"                   },
            { icon: Eye,          label: "Visibility Intelligence", color: "text-[var(--premium-gold)]", bg: "bg-[oklch(0.78_0.15_83/0.10)]",  border: "border-[oklch(0.78_0.15_83/0.20)]"   },
            { icon: Target,       label: "Precision Matching",      color: "text-[var(--premium-cyan)]", bg: "bg-[oklch(0.70_0.16_200/0.10)]", border: "border-[oklch(0.70_0.16_200/0.20)]"  },
            { icon: TrendingUp,   label: "Authority Building",      color: "text-[oklch(0.70_0.16_145)]",bg: "bg-[oklch(0.55_0.16_145/0.10)]", border: "border-[oklch(0.55_0.16_145/0.20)]"  },
          ].map((cap, i) => (
            <div
              key={cap.label}
              className={cn(
                "flex flex-col items-center gap-2 rounded-[var(--radius-xl)] border p-4 text-center",
                cap.bg, cap.border
              )}
            >
              <div className={cn("flex h-9 w-9 items-center justify-center rounded-xl", cap.bg)}>
                <cap.icon className={cn("size-4", cap.color)} aria-hidden="true" />
              </div>
              <span className="text-[11px] font-semibold text-foreground">{cap.label}</span>
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────────
   SECTION 8 — Final CTA
   ───────────────────────────────────────────────────────────── */
function HowItWorksCTASection() {
  const { ref, isInView } = useSectionView()

  return (
    <section
      ref={ref}
      className="relative overflow-hidden py-28"
      aria-labelledby="hiw-cta-heading"
    >
      {/* Gold ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/2"
        style={{ background: "radial-gradient(ellipse, oklch(0.78 0.15 83 / 0.08) 0%, transparent 60%)" }}
      />
      <div aria-hidden className="ai-dot-grid pointer-events-none absolute inset-0 opacity-40" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent 0%, oklch(0.78 0.15 83 / 0.25) 50%, transparent 100%)" }}
      />

      <div className="relative z-10 mx-auto max-w-3xl px-4 text-center sm:px-6">

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        >
          <EyebrowLabel color="gold">Your Visibility Starts Here</EyebrowLabel>

          <h2
            id="hiw-cta-heading"
            className="text-h2 mb-6"
          >
            Ready To Discover Your{" "}
            <span className="gradient-text-gold">
              Visibility Score?
            </span>
          </h2>

          <p className="mx-auto mb-8 max-w-xl text-lg text-muted-foreground leading-relaxed">
            Take the free assessment, see your score, and get your personalized roadmap —
            no credit card required.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button variant="premium" size="lg" asChild>
              <Link href="/signup">
                Start Free Assessment <ArrowRight className="ml-1.5 size-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/discover">Explore Opportunities</Link>
            </Button>
          </div>

          {/* Trust signals */}
          <motion.div
            className="mt-8 flex flex-wrap items-center justify-center gap-4"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            {[
              "No credit card required",
              "Free Visibility Assessment included",
              "Personalized roadmap in minutes",
            ].map((trust) => (
              <div key={trust} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <CheckCircle2 className="size-3 text-[var(--premium-gold)]" aria-hidden="true" />
                {trust}
              </div>
            ))}
          </motion.div>
        </motion.div>

      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════
   Main Export
   ═══════════════════════════════════════════════════════════ */
export function HowItWorksPageContent() {
  return (
    <div>
      <HowItWorksHero />
      <Step1ProfileSection />
      <Step2VisibilitySection />
      <Step3InsightsSection />
      <Step4DiscoverySection />
      <Step5GrowthSection />
      <TheDifferenceSection />
      <HowItWorksCTASection />
    </div>
  )
}
