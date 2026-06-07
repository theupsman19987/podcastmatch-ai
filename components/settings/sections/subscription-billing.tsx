"use client"

import { useState } from "react"
import { motion }   from "motion/react"
import { CreditCard, Check, Sparkles, Zap, Building2, Star, Loader2, ExternalLink } from "lucide-react"
import { SettingsCard, SectionHeader } from "../settings-ui"
import { PLANS } from "../settings-mock"
import type { Plan } from "../settings-mock"
import type { InitialUserData } from "../settings-shell"
import { BILLING_PLANS } from "@/lib/billing/plans"
import { trackClientEvent } from "@/lib/analytics/track"

const PLAN_ICONS = {
  "free":           Star,
  "creator-pro":    Sparkles,
  "visibility-pro": Zap,
  "enterprise":     Building2,
} as const

const PLAN_DISPLAY_NAMES: Record<string, string> = {
  "free":           "Free",
  "creator-pro":    "Creator Pro",
  "visibility-pro": "Visibility Pro",
  "enterprise":     "Enterprise",
}

/* ── Upgrade / manage button ─────────────────────────────── */
function UpgradeButton({ plan, isCurrent }: { plan: Plan; isCurrent: boolean }) {
  const [loading, setLoading] = useState(false)

  if (isCurrent) {
    return (
      <button disabled className="w-full py-2.5 rounded-xl text-xs font-bold border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 cursor-default">
        ✓ Active
      </button>
    )
  }

  if (plan.id === "enterprise") {
    return (
      <a
        href="mailto:hello@podmatch.ai?subject=Enterprise%20Plan%20Inquiry"
        className="flex w-full items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold border border-border/40 bg-card/40 text-muted-foreground hover:border-primary/30 hover:text-primary transition-colors"
      >
        {plan.cta} <ExternalLink className="size-3" aria-hidden="true" />
      </a>
    )
  }

  async function handleUpgrade() {
    const billingPlan = BILLING_PLANS.find(p => p.id === plan.id)
    if (!billingPlan?.stripePriceId) {
      alert("Billing is not yet active. Check back soon!")
      return
    }

    setLoading(true)
    trackClientEvent({ event: "checkout_started", properties: { plan: plan.id } }).catch(() => {})

    try {
      const res  = await fetch("/api/stripe/checkout", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ priceId: billingPlan.stripePriceId }),
      })
      const json = await res.json() as { url?: string; error?: string }
      if (json.url) {
        window.location.href = json.url
      } else {
        alert(json.error ?? "Something went wrong. Please try again.")
        setLoading(false)
      }
    } catch {
      alert("Network error. Please try again.")
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleUpgrade}
      disabled={loading}
      className="flex w-full items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold border border-primary/40 bg-primary/15 text-primary hover:bg-primary/25 hover:border-primary/60 transition-all duration-150 disabled:opacity-60 disabled:cursor-wait"
    >
      {loading ? <><Loader2 className="size-3.5 animate-spin" aria-hidden="true" /> Processing…</> : plan.cta}
    </button>
  )
}

function PlanCard({ plan, isCurrent, index }: { plan: Plan; isCurrent: boolean; index: number }) {
  const Icon = PLAN_ICONS[plan.id]

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.05 + index * 0.07 }}
      className={`relative flex flex-col p-5 rounded-2xl border transition-colors duration-150 ${
        isCurrent
          ? "border-primary/50 bg-primary/8 shadow-[0_0_24px_oklch(var(--primary)/0.08)]"
          : plan.popular
          ? "border-primary/25 bg-card/50 hover:border-primary/40"
          : "border-border/40 bg-card/40 hover:border-border/60"
      }`}
    >
      {plan.popular && !isCurrent && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-bold bg-primary border-0 text-white uppercase tracking-wider">
          Most Popular
        </div>
      )}
      {isCurrent && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500 text-white uppercase tracking-wider">
          Current Plan
        </div>
      )}

      <div className="flex items-center gap-2.5 mb-4">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${isCurrent ? "bg-primary/15 border-primary/30" : "bg-card/60 border-border/30"}`}>
          <Icon className={`w-4 h-4 ${isCurrent ? "text-primary" : "text-muted-foreground"}`} />
        </div>
        <div>
          <p className="text-sm font-bold text-foreground">{plan.name}</p>
          <p className="text-[10px] text-muted-foreground">{plan.tagline}</p>
        </div>
      </div>

      <div className="mb-4">
        <span className="text-2xl font-bold text-foreground">{plan.price}</span>
        {plan.period && <span className="text-xs text-muted-foreground ml-1">{plan.period}</span>}
      </div>

      <ul className="flex flex-col gap-1.5 mb-5 flex-1">
        {plan.features.map(f => (
          <li key={f} className="flex items-start gap-2 text-xs text-muted-foreground">
            <Check className="w-3 h-3 text-primary shrink-0 mt-0.5" />
            {f}
          </li>
        ))}
      </ul>

      <UpgradeButton plan={plan} isCurrent={isCurrent} />
    </motion.div>
  )
}

async function openBillingPortal() {
  try {
    const res  = await fetch("/api/stripe/portal", { method: "POST" })
    const json = await res.json() as { url?: string; error?: string }
    if (json.url) {
      window.location.href = json.url
    } else {
      alert(json.error ?? "Could not open billing portal. Contact support.")
    }
  } catch {
    alert("Network error. Please try again.")
  }
}

export function SubscriptionBilling({ initialData }: { initialData?: InitialUserData }) {
  const currentPlan  = initialData?.plan ?? "free"
  const planStatus   = initialData?.planStatus ?? "free"
  const nextBilling  = initialData?.nextBilling ?? "—"
  const planName     = PLAN_DISPLAY_NAMES[currentPlan] ?? "Free"
  const statusLabel  = planStatus.charAt(0).toUpperCase() + planStatus.slice(1)

  const summaryItems = [
    { label: "Current Plan",   value: planName      },
    { label: "Status",         value: statusLabel   },
    { label: "Next Billing",   value: nextBilling   },
    { label: "Payment Method", value: "Billing portal" },
  ] as const

  return (
    <div className="flex flex-col gap-5">
      {/* Current billing summary */}
      <SettingsCard delay={0}>
        <div className="p-6 md:p-8">
          <SectionHeader
            icon={<CreditCard className="w-4 h-4 text-primary" />}
            title="Subscription & Billing"
            description="Manage your plan and payment details"
          />

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {summaryItems.map(({ label, value }) => (
              <div key={label} className="p-3.5 rounded-xl border border-border/30 bg-card/40">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">{label}</p>
                <p className="text-sm font-semibold text-foreground leading-snug">{value}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3 mt-4">
            <button
              onClick={openBillingPortal}
              className="px-4 py-2 rounded-xl text-xs font-semibold border border-border/40 text-muted-foreground hover:border-primary/30 hover:text-primary transition-colors"
            >
              Manage Billing
            </button>
            <button
              onClick={openBillingPortal}
              className="px-4 py-2 rounded-xl text-xs font-semibold border border-border/40 text-muted-foreground hover:border-destructive/40 hover:text-destructive transition-colors"
            >
              Cancel Subscription
            </button>
          </div>
        </div>
      </SettingsCard>

      {/* Plan cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 pt-2">
        {PLANS.map((plan, i) => (
          <PlanCard key={plan.id} plan={plan} isCurrent={plan.id === currentPlan} index={i} />
        ))}
      </div>
    </div>
  )
}
