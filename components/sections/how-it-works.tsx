"use client"

import * as React from "react"
import { Fragment, useRef } from "react"
import { motion, useInView } from "motion/react"
import {
  Fingerprint,
  BrainCircuit,
  Target,
  Rocket,
  Database,
  Zap,
  Sparkles,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { WorkflowCard, type WorkflowAccent } from "@/components/ui/workflow-card"
import { BeamConnector } from "@/components/ui/beam-connector"

/* ── Step data ──────────────────────────────────────────────── */
interface StepItem {
  id:          string
  step:        number
  icon:        React.ElementType
  title:       string
  description: string
  insightText: string
  accentColor: WorkflowAccent
}

const STEPS: StepItem[] = [
  {
    id:          "profile",
    step:        1,
    icon:        Fingerprint,
    title:       "Deep Creator Intelligence",
    description:
      "We map your niche, content voice, audience demographics, and brand positioning into a precision creator profile that powers every downstream match.",
    insightText: "Profile Score: 97/100",
    accentColor: "primary",
  },
  {
    id:          "discovery",
    step:        2,
    icon:        BrainCircuit,
    title:       "AI Podcast Discovery Engine",
    description:
      "Our engine cross-references 50,000+ verified shows against your profile, evaluating 40+ compatibility signals to surface high-probability opportunities.",
    insightText: "847 Shows Analyzed",
    accentColor: "cyan",
  },
  {
    id:          "scoring",
    step:        3,
    icon:        Target,
    title:       "Audience Alignment Scoring",
    description:
      "Every opportunity is ranked by real audience overlap, host engagement velocity, and booking probability — not keyword tags or manual guessing.",
    insightText: "92% Audience Match",
    accentColor: "gold",
  },
  {
    id:          "results",
    step:        4,
    icon:        Rocket,
    title:       "Smart Results, Pitch-Ready",
    description:
      "You receive a curated shortlist of top-fit shows, each paired with an AI-written pitch script tailored to the host's style and listener expectations.",
    insightText: "High Booking Probability",
    accentColor: "green",
  },
]

type BeamColor = "primary" | "cyan" | "gold"
const STEP_BEAMS: BeamColor[] = ["primary", "cyan", "gold"]

/* ── Platform intelligence signals ─────────────────────────── */
interface SignalItem {
  icon:      React.ElementType
  label:     string
  desc:      string
  iconBg:    string
  iconColor: string
  border:    string
}

const SIGNALS: SignalItem[] = [
  {
    icon:      BrainCircuit,
    label:     "40+ AI Scoring Signals",
    desc:      "Topic relevance, audience overlap, host booking frequency, listener demographics, and 35+ additional precision factors.",
    iconBg:    "bg-primary/12",
    iconColor: "text-primary",
    border:    "border-primary/15 hover:border-primary/35",
  },
  {
    icon:      Database,
    label:     "50K+ Verified Shows",
    desc:      "A continuously updated database tracking host availability, engagement rates, and booking windows in real time.",
    iconBg:    "bg-[oklch(0.70_0.16_200/0.12)]",
    iconColor: "text-[var(--premium-cyan)]",
    border:    "border-[oklch(0.70_0.16_200/0.15)] hover:border-[oklch(0.70_0.16_200/0.35)]",
  },
  {
    icon:      Zap,
    label:     "Under 3 Seconds",
    desc:      "Instant AI analysis from creator profile to a ranked shortlist — no manual filtering, no wasted outreach.",
    iconBg:    "bg-[oklch(0.78_0.15_83/0.12)]",
    iconColor: "text-[var(--premium-gold)]",
    border:    "border-[oklch(0.78_0.15_83/0.15)] hover:border-[oklch(0.78_0.15_83/0.35)]",
  },
]

/* ── Shared animation helper ────────────────────────────────── */
function useFadeInView() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })
  return { ref, isInView }
}

/* ══════════════════════════════════════════════════════════════
   Main Section
   ══════════════════════════════════════════════════════════════ */
export function HowItWorksSection() {
  return (
    <section
      className="relative overflow-hidden py-28"
      aria-labelledby="how-it-works-heading"
    >
      {/* ── BACKGROUND ───────────────────────────────────────── */}

      {/* AI dot grid */}
      <div
        aria-hidden="true"
        className="ai-dot-grid pointer-events-none absolute inset-0"
      />

      {/* Center radial glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2
                   h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, oklch(0.58 0.22 255 / 0.06) 0%, transparent 65%)",
        }}
      />

      {/* Top gradient — connects from stats section */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-32"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.10 0.030 252 / 0.70) 0%, transparent 100%)",
        }}
      />

      {/* ── CONTENT ──────────────────────────────────────────── */}
      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

        <SectionHeader />
        <WorkflowFlow />
        <PlatformIntelligence />

      </div>
    </section>
  )
}

/* ── Section Header ─────────────────────────────────────────── */
function SectionHeader() {
  const { ref, isInView } = useFadeInView()

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="mb-20 text-center"
    >
      {/* Badge */}
      <div
        className="mb-5 inline-flex items-center gap-1.5 rounded-full
                   border border-primary/25 bg-primary/8 px-3 py-1.5
                   text-xs font-semibold text-primary"
      >
        <Sparkles className="size-3" aria-hidden="true" />
        AI Discovery Engine
      </div>

      {/* Heading */}
      <h2
        id="how-it-works-heading"
        className="text-h2 mx-auto max-w-2xl"
      >
        Built to Find Podcasts That{" "}
        <span className="gradient-text-primary text-glow-primary">
          Actually Book You
        </span>
      </h2>

      {/* Subheadline */}
      <p className="mx-auto mt-5 max-w-lg text-base text-muted-foreground leading-relaxed">
        PodcastMatch AI goes beyond keyword searches. It analyzes your expertise, voice positioning,
        and audience alignment to surface high-probability podcast opportunities — then helps you
        close them.
      </p>
    </motion.div>
  )
}

/* ── Workflow Steps ─────────────────────────────────────────── */
function WorkflowFlow() {
  const { ref, isInView } = useFadeInView()

  return (
    <div ref={ref}>

      {/* Desktop: horizontal flex with beam connectors */}
      <div
        className="hidden lg:flex items-start"
        role="list"
        aria-label="AI podcast matching workflow steps"
      >
        {STEPS.map((step, i) => (
          <Fragment key={step.id}>
            <motion.div
              className="flex-1 min-w-0"
              role="listitem"
              initial={{ opacity: 0, y: 28 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.6,
                ease: [0.16, 1, 0.3, 1],
                delay: 0.1 + i * 0.13,
              }}
            >
              <WorkflowCard {...step} />
            </motion.div>

            {i < STEPS.length - 1 && (
              <motion.div
                className="flex-shrink-0"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.35 + i * 0.13 }}
              >
                <BeamConnector
                  color={STEP_BEAMS[i] ?? "primary"}
                  delay={i * 0.9}
                />
              </motion.div>
            )}
          </Fragment>
        ))}
      </div>

      {/* Mobile: vertical stack with beam connectors */}
      <div
        className="flex lg:hidden flex-col"
        role="list"
        aria-label="AI podcast matching workflow steps"
      >
        {STEPS.map((step, i) => (
          <Fragment key={step.id}>
            <motion.div
              role="listitem"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.5,
                ease: [0.16, 1, 0.3, 1],
                delay: 0.08 + i * 0.1,
              }}
            >
              <WorkflowCard {...step} />
            </motion.div>

            {i < STEPS.length - 1 && (
              <BeamConnector
                vertical
                color={STEP_BEAMS[i] ?? "primary"}
              />
            )}
          </Fragment>
        ))}
      </div>

    </div>
  )
}

/* ── Platform Intelligence Row ──────────────────────────────── */
function PlatformIntelligence() {
  const { ref, isInView } = useFadeInView()

  return (
    <div ref={ref} className="mt-20">

      {/* Label */}
      <motion.p
        className="text-label mb-6 text-center"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.05 }}
      >
        Inside the AI
      </motion.p>

      {/* Signal cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {SIGNALS.map((signal, i) => (
          <motion.div
            key={signal.label}
            initial={{ opacity: 0, y: 18 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{
              duration: 0.5,
              ease: [0.16, 1, 0.3, 1],
              delay: 0.1 + i * 0.09,
            }}
            className={cn(
              "flex gap-3 rounded-[var(--radius-xl)] p-5",
              "border bg-card/60 backdrop-blur-sm",
              "transition-colors duration-200",
              signal.border
            )}
          >
            {/* Icon */}
            <div
              className={cn(
                "flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg",
                signal.iconBg
              )}
            >
              <signal.icon
                className={cn("size-4", signal.iconColor)}
                aria-hidden="true"
              />
            </div>

            {/* Text */}
            <div className="flex min-w-0 flex-col gap-1">
              <p className="text-sm font-semibold text-foreground">{signal.label}</p>
              <p className="text-xs text-muted-foreground leading-snug">{signal.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

    </div>
  )
}
