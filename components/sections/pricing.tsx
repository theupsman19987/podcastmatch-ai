"use client"

import * as React from "react"
import { useState, useRef } from "react"
import { motion, useInView } from "motion/react"
import {
  Shield,
  CreditCard,
  Brain,
  Users,
  Lock,
  Sparkles,
  Gift,
  CheckCircle2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  PricingCard,
  type PricingPlanData,
  type BillingPeriod,
} from "@/components/ui/pricing-card"

/* ── Plan data ──────────────────────────────────────────── */
const PLANS: PricingPlanData[] = [
  {
    id:           "starter",
    name:         "Starter",
    tagline:      "Begin discovering high-fit podcast opportunities matched to your niche.",
    monthlyPrice: 29,
    annualPrice:  23,
    currency:     "$",
    features: [
      "AI Podcast Discovery — 50 matches/month",
      "Audience Alignment Scoring",
      "Host Activity Insights",
      "Opportunity Queue",
      "Pitch Email Templates (5/month)",
      "7-day match history",
    ],
    ctaLabel:     "Start Free Trial",
    highlight:    false,
    stripePriceId: { monthly: "price_starter_monthly", annual: "price_starter_annual" },
  },
  {
    id:           "professional",
    name:         "Professional",
    tagline:      "Scale your visibility across every corner of the podcast landscape.",
    badge:        "Most Popular",
    monthlyPrice: 79,
    annualPrice:  63,
    currency:     "$",
    featuresLabel: "Everything in Starter, plus:",
    features: [
      "Unlimited AI Podcast Matches",
      "Advanced Visibility Analytics",
      "Priority Opportunity Queue",
      "AI-Generated Pitch Personalization",
      "Booking Probability Scoring",
      "90-day Match History",
      "Host Contact Tracking",
    ],
    ctaLabel:     "Start Free Trial",
    highlight:    true,
    stripePriceId: { monthly: "price_professional_monthly", annual: "price_professional_annual" },
  },
  {
    id:           "visibility-pro",
    name:         "Visibility Pro",
    tagline:      "Dedicated strategy and unlimited power for established creators and speakers.",
    monthlyPrice: 149,
    annualPrice:  119,
    currency:     "$",
    featuresLabel: "Everything in Professional, plus:",
    features: [
      "White-Glove Onboarding",
      "Dedicated Visibility Strategist",
      "Custom Audience Targeting",
      "Multi-Profile Management (up to 3)",
      "API Access",
      "Priority Support & SLA",
    ],
    ctaLabel:     "Start Free Trial",
    highlight:    false,
    stripePriceId: { monthly: "price_vp_monthly", annual: "price_vp_annual" },
  },
]

/* ── Trust items ────────────────────────────────────────── */
const TRUST_ITEMS = [
  { icon: Shield,     label: "Cancel Anytime" },
  { icon: CreditCard, label: "No Credit Card Required" },
  { icon: Brain,      label: "AI-Powered Discovery" },
  { icon: Users,      label: "15,000+ Creators" },
  { icon: Lock,       label: "Secure & Private" },
]

/* ── Fade-in helper ─────────────────────────────────────── */
function useFadeInView() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })
  return { ref, isInView }
}

/* ══════════════════════════════════════════════════════════
   PricingSection
   ══════════════════════════════════════════════════════════ */
export function PricingSection() {
  const [billing, setBilling] = useState<BillingPeriod>("monthly")

  return (
    <section
      className="relative overflow-hidden py-28"
      aria-labelledby="pricing-heading"
    >
      {/* ── BACKGROUND ─────────────────────────────────────── */}

      {/* Top connector */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-48"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.09 0.028 252 / 0.55) 0%, transparent 100%)",
        }}
      />

      {/* Primary blue orb — top center */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-[600px] w-[800px] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(ellipse at center, oklch(0.58 0.22 255 / 0.055), transparent 65%)",
        }}
      />

      {/* Gold orb — bottom left */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -left-48 h-[600px] w-[600px] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(ellipse at center, oklch(0.78 0.15 83 / 0.05), transparent 65%)",
        }}
      />

      {/* Subtle purple orb — bottom right */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -right-48 h-[500px] w-[500px] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(ellipse at center, oklch(0.45 0.18 270 / 0.04), transparent 65%)",
        }}
      />

      {/* ── CONTENT ──────────────────────────────────────────── */}
      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

        <SectionHeader />
        <BillingToggle billing={billing} onChangeBilling={setBilling} />
        <PricingGrid billing={billing} />
        <TrustPills />
        <PricingNote />

      </div>
    </section>
  )
}

/* ── Section Header ─────────────────────────────────────── */
function SectionHeader() {
  const { ref, isInView } = useFadeInView()

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="text-center"
    >
      {/* Free trial badge — primary CTA emphasis */}
      <div
        className="mb-5 inline-flex items-center gap-2 rounded-full px-4 py-2
                   border text-sm font-semibold"
        style={{
          borderColor: "oklch(0.78 0.15 83 / 0.30)",
          background:  "oklch(0.78 0.15 83 / 0.07)",
          color:       "var(--premium-gold)",
        }}
      >
        <Gift className="size-3.5 flex-shrink-0" aria-hidden="true" />
        14-Day Free Trial on Every Plan &nbsp;·&nbsp; No Credit Card Required
      </div>

      <h2
        id="pricing-heading"
        className="text-h2 mx-auto max-w-2xl"
      >
        Transparent Pricing for{" "}
        <span className="gradient-text-primary text-glow-primary">
          Real Creator Growth
        </span>
      </h2>

      <p className="mx-auto mt-5 max-w-lg text-base text-muted-foreground leading-relaxed">
        Every plan gives you full access to AI podcast matching, visibility scoring, and
        opportunity discovery. Start free, upgrade anytime — cancel whenever you want.
      </p>
    </motion.div>
  )
}

/* ── Billing toggle ─────────────────────────────────────── */
function BillingToggle({
  billing,
  onChangeBilling,
}: {
  billing:          BillingPeriod
  onChangeBilling:  (b: BillingPeriod) => void
}) {
  const { ref, isInView } = useFadeInView()

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 12 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
      className="mt-10 mb-14 flex items-center justify-center"
      role="group"
      aria-label="Billing period selector"
    >
      <div
        className="flex items-center rounded-full border border-border bg-muted/20 p-1 gap-1"
      >
        <button
          type="button"
          onClick={() => onChangeBilling("monthly")}
          className={cn(
            "rounded-full px-5 py-2 text-sm font-medium transition-all duration-200",
            billing === "monthly"
              ? "bg-primary text-white shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
          aria-pressed={billing === "monthly"}
        >
          Monthly
        </button>

        <button
          type="button"
          onClick={() => onChangeBilling("annual")}
          className={cn(
            "flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition-all duration-200",
            billing === "annual"
              ? "bg-primary text-white shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
          aria-pressed={billing === "annual"}
        >
          Annual
          <span
            className={cn(
              "rounded-full px-1.5 py-0.5 text-[10px] font-bold transition-colors duration-200",
              billing === "annual"
                ? "bg-white/20 text-white"
                : "bg-[oklch(0.78_0.15_83/0.15)] text-[var(--premium-gold)]"
            )}
          >
            Save 20%
          </span>
        </button>
      </div>
    </motion.div>
  )
}

/* ── Pricing grid ───────────────────────────────────────── */
function PricingGrid({ billing }: { billing: BillingPeriod }) {
  const { ref, isInView } = useFadeInView()

  return (
    <div
      ref={ref}
      className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start"
    >
      {PLANS.map((plan, i) => (
        <motion.div
          key={plan.id}
          initial={{ opacity: 0, y: 32 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{
            duration: 0.6,
            ease: [0.16, 1, 0.3, 1],
            delay: 0.08 + i * 0.1,
          }}
          className={cn(
            plan.highlight && "lg:-translate-y-5"
          )}
        >
          <PricingCard data={plan} billing={billing} />
        </motion.div>
      ))}
    </div>
  )
}

/* ── Trust pills ────────────────────────────────────────── */
function TrustPills() {
  const { ref, isInView } = useFadeInView()

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 12 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
      className="mt-14 flex flex-wrap items-center justify-center gap-3"
    >
      {TRUST_ITEMS.map((item, i) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, scale: 0.92 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.35, delay: 0.15 + i * 0.06 }}
          className={cn(
            "flex items-center gap-1.5 rounded-full border border-border",
            "bg-muted/25 px-3.5 py-1.5 text-xs font-medium text-muted-foreground"
          )}
        >
          <item.icon className="size-3 text-primary flex-shrink-0" aria-hidden="true" />
          {item.label}
        </motion.div>
      ))}
    </motion.div>
  )
}

/* ── Pricing note ───────────────────────────────────────── */
function PricingNote() {
  const { ref, isInView } = useFadeInView()

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ duration: 0.5, delay: 0.15 }}
      className="mt-8 flex flex-col items-center gap-3"
    >
      {/* Included features reminder */}
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground/60">
        {[
          "Full access during trial",
          "Downgrade or cancel anytime",
          "AI features available immediately",
          "No setup fees",
        ].map(item => (
          <span key={item} className="flex items-center gap-1">
            <CheckCircle2 className="size-3 text-primary/50" aria-hidden="true" />
            {item}
          </span>
        ))}
      </div>

      <p className="text-center text-[11px] text-muted-foreground/40">
        Pricing shown in USD. Annual billing applied as a single annual payment.
        All plans include a 14-day free trial.
      </p>
    </motion.div>
  )
}
