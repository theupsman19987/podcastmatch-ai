"use client"

import { useState, useRef } from "react"
import { motion, useInView } from "motion/react"
import Link from "next/link"
import {
  CheckCircle2, XCircle, ArrowRight, Sparkles, Zap,
  Users, Mic, BookOpen, TrendingUp, Shield, Star,
  ChevronDown, BarChart3, Brain, Award, Clock,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { PricingCard, type PricingPlanData, type BillingPeriod } from "@/components/ui/pricing-card"
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

/* ─── Shared Primitives ─────────────────────────────────────────────────── */

function SectionLabel({
  icon: Icon, label, colorClass, isInView, delay = 0,
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
  children, isInView, delay = 0.08, id,
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
  children, isInView, delay = 0.16,
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

/* ─── Data: Plans ───────────────────────────────────────────────────────── */

const PLANS: PricingPlanData[] = [
  {
    id: "starter",
    name: "Starter",
    tagline: "Begin your visibility journey at no cost",
    monthlyPrice: 0,
    annualPrice: 0,
    currency: "$",
    highlight: false,
    ctaLabel: "Start Free",
    featuresLabel: "What's included",
    features: [
      "Basic Visibility Score",
      "5 AI podcast matches per month",
      "Limited Discovery Feed",
      "Save up to 10 opportunities",
      "Community support",
    ],
  },
  {
    id: "professional",
    name: "Professional",
    tagline: "The complete visibility system for serious creators",
    monthlyPrice: 29,
    annualPrice: 19,
    currency: "$",
    badge: "Most Popular",
    highlight: true,
    ctaLabel: "Start Free Trial",
    featuresLabel: "Everything in Starter, plus",
    features: [
      "Full Visibility Intelligence",
      "Unlimited AI podcast matches",
      "Complete Discovery Feed",
      "Improvement Roadmap",
      "Unlimited saved opportunities",
      "Analytics dashboard",
      "Priority opportunities",
      "Email support",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    tagline: "Maximum visibility, authority, and access",
    monthlyPrice: 79,
    annualPrice: 49,
    currency: "$",
    badge: "Best Results",
    highlight: false,
    ctaLabel: "Go Premium",
    featuresLabel: "Everything in Professional, plus",
    features: [
      "Premium & exclusive show access",
      "Priority matching engine",
      "Advanced authority analytics",
      "Monthly 1-on-1 strategy session",
      "Early access to new features",
      "Priority support",
    ],
  },
]

/* ─── Data: ROI Calculator ──────────────────────────────────────────────── */

type ROITab = "Coaching Client" | "Speaking" | "Book Sales" | "Consulting" | "Partnership"

interface ROIItem {
  id: ROITab
  icon: React.ElementType
  label: string
  value: string
  range: string
  multiplier: number
  covered: string
  description: string
  iconBg: string
  iconColor: string
  accentClass: string
}

const ROI_ITEMS: ROIItem[] = [
  {
    id: "Coaching Client",
    icon: Users,
    label: "Coaching Client",
    value: "$3,500",
    range: "Typical value: $2,000 – $10,000",
    multiplier: 121,
    covered: "10 years of Professional",
    description:
      "A single coaching client acquired through a podcast appearance covers over a decade of the Professional plan. Most coaches close their first client within the first 3 appearances.",
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
    accentClass: "gradient-text-primary",
  },
  {
    id: "Speaking",
    icon: Mic,
    label: "Speaking Engagement",
    value: "$5,000",
    range: "Typical value: $2,500 – $25,000",
    multiplier: 172,
    covered: "14 years of Professional",
    description:
      "A single keynote booking generated through podcast visibility covers over 14 years of the Professional plan. Speakers report podcast credibility as their top source of new booking inquiries.",
    iconBg: "bg-[oklch(0.70_0.16_200/0.10)]",
    iconColor: "text-[var(--premium-cyan)]",
    accentClass: "gradient-text-cyan",
  },
  {
    id: "Book Sales",
    icon: BookOpen,
    label: "Book Sales",
    value: "$750",
    range: "50 sales × $15 avg royalty",
    multiplier: 26,
    covered: "26 months of Professional",
    description:
      "Even 50 book sales driven by a single podcast episode covers over two years of access. Authors consistently cite podcast appearances as their highest-ROI promotional channel.",
    iconBg: "bg-[oklch(0.78_0.15_83/0.10)]",
    iconColor: "text-[var(--premium-gold)]",
    accentClass: "gradient-text-gold",
  },
  {
    id: "Consulting",
    icon: TrendingUp,
    label: "Consulting Contract",
    value: "$8,000",
    range: "Typical value: $5,000 – $50,000",
    multiplier: 276,
    covered: "23 years of Professional",
    description:
      "One consulting engagement sourced from the authority built through podcasting pays for over two decades of the platform. Consultants report that podcast credibility closes deals faster.",
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
    accentClass: "gradient-text-primary",
  },
  {
    id: "Partnership",
    icon: Star,
    label: "Strategic Partnership",
    value: "$10,000",
    range: "Typical value: $5,000 – $100,000+",
    multiplier: 345,
    covered: "28 years of Professional",
    description:
      "A single partnership formed through the authority and reach that podcast appearances build generates a return measured in decades. Visibility is the foundation every partnership starts from.",
    iconBg: "bg-[oklch(0.78_0.15_83/0.10)]",
    iconColor: "text-[var(--premium-gold)]",
    accentClass: "gradient-text-gold",
  },
]

/* ─── Data: Feature Comparison ──────────────────────────────────────────── */

interface ComparisonRow {
  label: string
  starter: string | boolean
  professional: string | boolean
  premium: string | boolean
}

const COMPARISON_ROWS: ComparisonRow[] = [
  { label: "Visibility Score",    starter: "Basic",      professional: "Full",       premium: "Full"       },
  { label: "AI Matches / month",  starter: "5",          professional: "Unlimited",  premium: "Unlimited"  },
  { label: "Discovery Feed",      starter: "Limited",    professional: "Full",       premium: "Full"       },
  { label: "Improvement Roadmap", starter: false,        professional: true,         premium: true         },
  { label: "Saved Opportunities", starter: "10",         professional: "Unlimited",  premium: "Unlimited"  },
  { label: "Premium Shows",       starter: false,        professional: false,        premium: true         },
  { label: "Priority Matching",   starter: false,        professional: false,        premium: true         },
  { label: "Analytics Dashboard", starter: false,        professional: true,         premium: true         },
  { label: "Strategy Sessions",   starter: false,        professional: false,        premium: "Monthly"    },
  { label: "Support",             starter: "Community",  professional: "Email",      premium: "Priority"   },
]

/* ─── Data: FAQ ─────────────────────────────────────────────────────────── */

const FAQ_ITEMS = [
  {
    q: "Can I cancel anytime?",
    a: "Yes. There are no long-term contracts. Cancel your subscription at any time from your account settings — no questions asked, no cancellation fees, no friction.",
  },
  {
    q: "How accurate are the AI matches?",
    a: "Our AI achieves 94% match accuracy based on multi-dimensional scoring across topic alignment, audience fit, authority compatibility, and visibility potential. Every recommendation is curated to your specific profile — not a keyword search or random listing.",
  },
  {
    q: "Do I need a website to get started?",
    a: "No. You can start with just your expertise and goals. That said, the Improvement Roadmap will likely identify a professional website as one of your highest-impact visibility gaps — and give you a step-by-step path to address it.",
  },
  {
    q: "Can beginners use PodcastMatch AI?",
    a: "Absolutely. The platform is designed for creators at every visibility level. If you're just starting, your Visibility Score and Improvement Roadmap show you exactly where you stand and what to build first — in order of impact.",
  },
  {
    q: "How does the Visibility Score work?",
    a: "The Visibility Score is an AI analysis of your profile across five dimensions: Visibility, Authority, Audience Alignment, Message Clarity, and Growth Potential. It updates as you improve your profile and complete recommended actions — so every step you take is reflected in real time.",
  },
  {
    q: "What makes this different from a podcast database?",
    a: "Podcast databases help you search. PodcastMatch AI helps you get discovered. We assess your expertise and authority first, identify what's holding your visibility back, then match you with shows where your message will land — not just shows that exist.",
  },
]

/* ─── Data: Risk Reversal ───────────────────────────────────────────────── */

const GUARANTEES = [
  {
    icon: Shield,
    label: "No Long-Term Contracts",
    description: "Month-to-month billing. No annual lock-in unless you choose it.",
  },
  {
    icon: Zap,
    label: "30-Day Free Trial",
    description: "Try Professional free for 30 days. No credit card required to start.",
  },
  {
    icon: Award,
    label: "Free Forever Plan",
    description: "Start free and upgrade only when the value is undeniable.",
  },
  {
    icon: CheckCircle2,
    label: "Transparent Pricing",
    description: "What you see is what you pay. No hidden fees, no surprise charges.",
  },
]

/* ─── Comparison Cell ───────────────────────────────────────────────────── */

function ComparisonCell({
  value,
  isHighlighted,
}: {
  value: string | boolean
  isHighlighted?: boolean
}) {
  if (value === true) {
    return (
      <div className="flex justify-center">
        <CheckCircle2
          className={cn("size-4", isHighlighted ? "text-primary" : "text-[oklch(0.65_0.15_145)]")}
          aria-label="Included"
        />
      </div>
    )
  }
  if (value === false) {
    return (
      <div className="flex justify-center">
        <span className="text-sm text-muted-foreground/30" aria-label="Not included">—</span>
      </div>
    )
  }
  return (
    <p className={cn(
      "text-center text-xs font-medium",
      isHighlighted ? "text-foreground" : "text-muted-foreground",
    )}>
      {value}
    </p>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   SECTION 1 — HERO
═══════════════════════════════════════════════════════════════════════════ */

function PricingHero() {
  return (
    <section className="relative overflow-hidden pb-12 pt-28" aria-label="Pricing hero">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-20 left-1/2 -z-10 h-[500px] w-[700px] -translate-x-1/2 rounded-full blur-3xl"
        style={{ background: "radial-gradient(ellipse at center, oklch(0.58 0.22 255 / 0.11), transparent 65%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-1/3 -z-10 h-[350px] w-[350px] rounded-full blur-3xl"
        style={{ background: "radial-gradient(ellipse at center, oklch(0.78 0.15 83 / 0.06), transparent 65%)" }}
      />

      <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-7 text-center">

          {/* Badge */}
          <motion.div {...fadeUp(0.1)}>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/8 px-3.5 py-1.5">
              <Sparkles className="size-3.5 text-primary" aria-hidden />
              <span className="text-xs font-semibold text-primary">
                Free forever plan available · No credit card required
              </span>
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            {...fadeUp(0.18)}
            className="text-hero mx-auto max-w-3xl text-center"
          >
            Invest In Your{" "}
            <span className="gradient-text-primary text-glow-primary">Visibility</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            {...fadeUp(0.26)}
            className="mx-auto max-w-2xl text-lg leading-relaxed text-muted-foreground"
          >
            PodcastMatch AI helps speakers, authors, coaches, consultants, and experts
            discover opportunities that can grow their audience, authority, and business.
          </motion.p>

          {/* Value examples */}
          <motion.div
            {...fadeUp(0.34)}
            className="flex flex-wrap items-center justify-center gap-3"
          >
            {[
              "New clients",
              "Speaking opportunities",
              "Book sales",
              "Partnerships",
              "Audience growth",
              "Authority",
            ].map(item => (
              <span
                key={item}
                className="glass flex items-center gap-1.5 rounded-full border border-border px-3.5 py-1.5 text-xs text-muted-foreground"
              >
                <CheckCircle2 className="size-3 text-[var(--premium-cyan)]" aria-hidden />
                {item}
              </span>
            ))}
          </motion.div>

          {/* Core value statement */}
          <motion.p
            {...fadeUp(0.42)}
            className="text-sm font-medium text-muted-foreground/70"
          >
            The value is not the software.{" "}
            <span className="text-foreground font-semibold">The value is the opportunities.</span>
          </motion.p>

        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   SECTION 2 — PRICING PLANS
═══════════════════════════════════════════════════════════════════════════ */

function PricingPlansSection({ billing, setBilling }: {
  billing: BillingPeriod
  setBilling: (b: BillingPeriod) => void
}) {
  const { ref, isInView } = useSectionView()

  return (
    <section ref={ref} className="relative py-16" aria-labelledby="plans-heading">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

        {/* Billing toggle */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.08, duration: 0.45, ease }}
          className="mb-10 flex flex-col items-center gap-4"
        >
          <h2 id="plans-heading" className="sr-only">Pricing plans</h2>
          <div
            className="inline-flex items-center rounded-full border border-border bg-muted/30 p-1"
            role="group"
            aria-label="Billing period"
          >
            <button
              onClick={() => setBilling("monthly")}
              aria-pressed={billing === "monthly"}
              className={cn(
                "rounded-full px-5 py-2 text-sm font-medium transition-all duration-150",
                billing === "monthly"
                  ? "bg-foreground text-background shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Monthly
            </button>
            <button
              onClick={() => setBilling("annual")}
              aria-pressed={billing === "annual"}
              className={cn(
                "flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition-all duration-150",
                billing === "annual"
                  ? "bg-foreground text-background shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Annual
              <span className="rounded-full bg-[oklch(0.65_0.15_145)] px-1.5 py-0.5 text-[9px] font-bold text-white">
                SAVE 35%
              </span>
            </button>
          </div>
        </motion.div>

        {/* Cards */}
        <div className="grid gap-6 lg:grid-cols-3 lg:items-start">
          {PLANS.map((plan, i) => {
            const isPremium = plan.id === "premium"
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 24 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.16 + i * 0.1, duration: 0.55, ease }}
                className={cn(
                  "relative",
                  plan.highlight && "lg:-mt-4"
                )}
              >
                {/* Gold ring for Premium */}
                {isPremium && (
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -inset-px rounded-[calc(var(--radius-xl)+1px)]"
                    style={{
                      background:
                        "linear-gradient(135deg, oklch(0.78 0.15 83 / 0.50), transparent 50%, oklch(0.78 0.15 83 / 0.30))",
                    }}
                  />
                )}
                <PricingCard
                  data={plan}
                  billing={billing}
                  className={isPremium ? "border-[oklch(0.78_0.15_83/0.35)]" : undefined}
                />
              </motion.div>
            )
          })}
        </div>

      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   SECTION 3 — ROI CALCULATOR
═══════════════════════════════════════════════════════════════════════════ */

function ROISection() {
  const { ref, isInView } = useSectionView()
  const [activeId, setActiveId] = useState<ROITab>("Coaching Client")
  const active = ROI_ITEMS.find(r => r.id === activeId)!

  return (
    <section
      ref={ref}
      className="relative overflow-hidden py-24"
      aria-labelledby="roi-heading"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{ background: "radial-gradient(ellipse at center, oklch(0.78 0.15 83 / 0.04), transparent 70%)" }}
      />

      <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-12 flex flex-col items-center gap-4 text-center">
          <SectionLabel
            icon={BarChart3}
            label="What One Opportunity Is Worth"
            colorClass="text-[var(--premium-gold)]"
            isInView={isInView}
            delay={0}
          />
          <SectionHeading id="roi-heading" isInView={isInView} delay={0.08}>
            One Opportunity Can{" "}
            <span className="gradient-text-gold">Change Everything</span>
          </SectionHeading>
          <SectionSubtext isInView={isInView} delay={0.16}>
            Compare the value of a single outcome against your monthly subscription.
            This is why we say the value is the opportunity — not the software.
          </SectionSubtext>
        </div>

        {/* Opportunity type selector */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.24, duration: 0.45, ease }}
          className="mb-8 flex flex-wrap justify-center gap-2"
          role="tablist"
          aria-label="Opportunity types"
        >
          {ROI_ITEMS.map(({ id, label, icon: Icon, iconBg, iconColor }) => (
            <button
              key={id}
              role="tab"
              aria-selected={activeId === id}
              onClick={() => setActiveId(id)}
              className={cn(
                "flex items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-medium transition-all duration-150",
                activeId === id
                  ? "border-[oklch(0.78_0.15_83/0.50)] bg-[oklch(0.78_0.15_83/0.10)] text-[var(--premium-gold)]"
                  : "border-border/50 text-muted-foreground hover:border-[oklch(0.78_0.15_83/0.30)] hover:text-[var(--premium-gold)]"
              )}
            >
              <Icon className="size-3.5" aria-hidden />
              {label}
            </button>
          ))}
        </motion.div>

        {/* ROI display */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3, duration: 0.55, ease }}
          className="glass-strong overflow-hidden rounded-[var(--radius-xl)] border border-[oklch(0.78_0.15_83/0.20)]"
        >
          {/* Top bar */}
          <div className="border-b border-border/40 bg-[oklch(0.78_0.15_83/0.03)] px-6 py-4">
            <div className="flex items-center gap-2">
              <span className={cn("flex h-8 w-8 items-center justify-center rounded-lg", active.iconBg)}>
                <active.icon className={cn("size-4", active.iconColor)} aria-hidden />
              </span>
              <p className="text-sm font-bold text-foreground">{active.label}</p>
              <span className="ml-auto text-xs text-muted-foreground">{active.range}</span>
            </div>
          </div>

          {/* Main content */}
          <div className="grid gap-0 sm:grid-cols-3">

            {/* Value column */}
            <div className="flex flex-col items-center justify-center gap-1.5 border-b border-border/40 p-8 text-center sm:border-b-0 sm:border-r">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">
                Typical Opportunity Value
              </p>
              <span className={cn("text-5xl font-black", active.accentClass)}>
                {active.value}
              </span>
              <p className="text-xs text-muted-foreground">{active.label}</p>
            </div>

            {/* Multiplier column */}
            <div className="flex flex-col items-center justify-center gap-1.5 border-b border-border/40 p-8 text-center sm:border-b-0 sm:border-r">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">
                Return on Investment
              </p>
              <span className="text-5xl font-black gradient-text-primary">
                {active.multiplier}×
              </span>
              <p className="text-xs text-muted-foreground">your $29/month</p>
            </div>

            {/* Coverage column */}
            <div className="flex flex-col items-center justify-center gap-1.5 p-8 text-center">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">
                Covers
              </p>
              <span className="text-2xl font-black text-foreground leading-tight">
                {active.covered}
              </span>
              <p className="text-xs text-muted-foreground">from one opportunity</p>
            </div>

          </div>

          {/* Description */}
          <div className="border-t border-border/40 bg-muted/10 px-6 py-4">
            <div className="flex items-start gap-3">
              <Brain className="mt-0.5 size-4 flex-shrink-0 text-primary" aria-hidden />
              <p className="text-sm text-muted-foreground leading-relaxed">
                {active.description}
              </p>
            </div>
          </div>

        </motion.div>

        {/* Closing line */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5, duration: 0.45, ease }}
          className="mt-6 text-center text-sm text-muted-foreground"
        >
          The math is simple.{" "}
          <span className="font-semibold text-foreground">
            The question is: how many opportunities are you currently missing?
          </span>
        </motion.p>

      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   SECTION 4 — FEATURE COMPARISON
═══════════════════════════════════════════════════════════════════════════ */

function FeatureComparisonSection() {
  const { ref, isInView } = useSectionView()

  return (
    <section ref={ref} className="relative py-24" aria-labelledby="comparison-heading">
      <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-12 flex flex-col items-center gap-4 text-center">
          <SectionLabel
            icon={CheckCircle2}
            label="What's Included"
            colorClass="text-primary"
            isInView={isInView}
            delay={0}
          />
          <SectionHeading id="comparison-heading" isInView={isInView} delay={0.08}>
            Plan{" "}
            <span className="gradient-text-primary">Comparison</span>
          </SectionHeading>
          <SectionSubtext isInView={isInView} delay={0.16}>
            A complete look at what each plan includes across every capability.
          </SectionSubtext>
        </div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.22, duration: 0.55, ease }}
          className="overflow-hidden rounded-[var(--radius-xl)] border border-border"
        >
          {/* Table header */}
          <div className="grid grid-cols-4 border-b border-border bg-muted/30">
            <div className="p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Feature
              </p>
            </div>
            {["Starter", "Professional", "Premium"].map((name, i) => (
              <div
                key={name}
                className={cn(
                  "p-4 text-center border-l border-border",
                  i === 1 && "bg-primary/5 border-primary/20"
                )}
              >
                <p className={cn(
                  "text-xs font-bold uppercase tracking-wider",
                  i === 1 ? "text-primary" : i === 2 ? "text-[var(--premium-gold)]" : "text-muted-foreground"
                )}>
                  {name}
                </p>
              </div>
            ))}
          </div>

          {/* Data rows */}
          {COMPARISON_ROWS.map(({ label, starter, professional, premium }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, x: -6 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.3 + i * 0.04, duration: 0.35, ease }}
              className={cn(
                "grid grid-cols-4 border-b border-border/40 last:border-0",
                i % 2 !== 0 ? "bg-muted/10" : "bg-transparent"
              )}
            >
              <div className="flex items-center p-3.5 pl-4">
                <p className="text-sm text-foreground">{label}</p>
              </div>
              <div className="flex items-center justify-center border-l border-border/40 p-3.5">
                <ComparisonCell value={starter} />
              </div>
              <div className="flex items-center justify-center border-l border-primary/20 bg-primary/5 p-3.5">
                <ComparisonCell value={professional} isHighlighted />
              </div>
              <div className="flex items-center justify-center border-l border-border/40 p-3.5">
                <ComparisonCell value={premium} />
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   SECTION 5 — FAQ
═══════════════════════════════════════════════════════════════════════════ */

function FAQSection() {
  const { ref, isInView } = useSectionView()
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section
      ref={ref}
      className="relative overflow-hidden py-24"
      aria-labelledby="faq-heading"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{ background: "radial-gradient(ellipse at center, oklch(0.58 0.22 255 / 0.03), transparent 70%)" }}
      />

      <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-12 flex flex-col items-center gap-4 text-center">
          <SectionLabel
            icon={Brain}
            label="Frequently Asked Questions"
            colorClass="text-[var(--premium-cyan)]"
            isInView={isInView}
            delay={0}
          />
          <SectionHeading id="faq-heading" isInView={isInView} delay={0.08}>
            Everything You Need{" "}
            <span className="gradient-text-cyan">To Know</span>
          </SectionHeading>
        </div>

        {/* Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.55, ease }}
          className="glass-strong overflow-hidden rounded-[var(--radius-xl)] border border-border"
        >
          {FAQ_ITEMS.map(({ q, a }, i) => {
            const isOpen = openIndex === i
            return (
              <div
                key={i}
                className={cn("border-b border-border/50 last:border-0")}
              >
                <button
                  aria-expanded={isOpen}
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="flex w-full items-start justify-between gap-4 px-5 py-4 text-left transition-colors duration-150 hover:bg-muted/20"
                >
                  <span className="text-sm font-semibold text-foreground leading-relaxed">
                    {q}
                  </span>
                  <ChevronDown
                    className={cn(
                      "mt-0.5 size-4 flex-shrink-0 text-muted-foreground transition-transform duration-200",
                      isOpen && "rotate-180"
                    )}
                    aria-hidden
                  />
                </button>
                <div
                  className={cn(
                    "overflow-hidden transition-all duration-300",
                    isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  )}
                >
                  <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">
                    {a}
                  </p>
                </div>
              </div>
            )
          })}
        </motion.div>

      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   SECTION 6 — RISK REVERSAL
═══════════════════════════════════════════════════════════════════════════ */

function RiskReversalSection() {
  const { ref, isInView } = useSectionView()

  return (
    <section ref={ref} className="relative py-16" aria-labelledby="risk-heading">
      <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-10 flex flex-col items-center gap-3 text-center">
          <SectionHeading id="risk-heading" isInView={isInView}>
            Zero{" "}
            <span className="gradient-text-primary">Risk.</span>
            {" "}Real{" "}
            <span className="gradient-text-gold">Results.</span>
          </SectionHeading>
          <SectionSubtext isInView={isInView} delay={0.1}>
            We built PodcastMatch AI to be the kind of product people upgrade because
            they see the value — not because we trapped them.
          </SectionSubtext>
        </div>

        {/* Guarantee cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {GUARANTEES.map(({ icon: Icon, label, description }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.16 + i * 0.08, duration: 0.5, ease }}
              className="glass-strong flex flex-col gap-3 rounded-[var(--radius-xl)] border border-border p-5 text-center"
            >
              <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <Icon className="size-5 text-primary" aria-hidden />
              </span>
              <p className="text-sm font-bold text-foreground">{label}</p>
              <p className="text-xs leading-relaxed text-muted-foreground">{description}</p>
            </motion.div>
          ))}
        </div>

        {/* Additional context */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.45, ease }}
          className="mt-8 flex items-center justify-center gap-2 text-center"
        >
          <Shield className="size-3.5 text-muted-foreground/50 flex-shrink-0" aria-hidden />
          <p className="text-xs text-muted-foreground/60">
            Trusted by 2,400+ speakers, authors, coaches, and experts ·{" "}
            <span className="text-foreground/60">No lock-ins, ever</span>
          </p>
        </motion.div>

      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   SECTION 7 — FINAL CTA
═══════════════════════════════════════════════════════════════════════════ */

function FinalCTASection({ billing }: { billing: BillingPeriod }) {
  const { ref, isInView } = useSectionView()
  const proPrice = billing === "annual" ? 19 : 29

  return (
    <section
      ref={ref}
      className="relative overflow-hidden py-32"
      aria-labelledby="pricing-cta-heading"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{ background: "radial-gradient(ellipse at center, oklch(0.58 0.22 255 / 0.09), transparent 65%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-1/2 -z-10 h-[400px] w-[600px] -translate-x-1/2 rounded-full blur-3xl"
        style={{ background: "radial-gradient(ellipse at center, oklch(0.78 0.15 83 / 0.06), transparent 65%)" }}
      />

      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-8 text-center">

          {/* Price reminder */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.1, duration: 0.45, ease }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/8 px-4 py-1.5">
              <Zap className="size-3.5 text-primary" aria-hidden />
              <span className="text-xs font-semibold text-primary">
                Start free · Professional from ${proPrice}/mo
              </span>
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h2
            id="pricing-cta-heading"
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.18, duration: 0.55, ease }}
            className="text-4xl font-black text-foreground sm:text-5xl"
          >
            Ready To Increase Your{" "}
            <span className="gradient-text-primary text-glow-primary">Visibility?</span>
          </motion.h2>

          {/* Supporting copy */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.26, duration: 0.45, ease }}
            className="mx-auto max-w-xl text-base text-muted-foreground"
          >
            Start free. Get your Visibility Score in 5 minutes. Upgrade when you see
            exactly why the opportunities are worth far more than the cost.
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
                Start Free Trial
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
              "30-day free trial",
              "No credit card required",
              "Cancel anytime",
              "Free forever plan available",
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

export function PricingPageContent() {
  const [billing, setBilling] = useState<BillingPeriod>("monthly")

  return (
    <main>
      <PricingHero />
      <PricingPlansSection billing={billing} setBilling={setBilling} />
      <ROISection />
      <FeatureComparisonSection />
      <FAQSection />
      <RiskReversalSection />
      <FinalCTASection billing={billing} />
    </main>
  )
}
