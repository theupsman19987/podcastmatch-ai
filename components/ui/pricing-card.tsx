import * as React from "react"
import { cn } from "@/lib/utils"
import { CheckCircle2, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

/* ═══════════════════════════════════════════════════════════
   PricingCard — reusable pricing plan card.

   Stripe integration: populate stripePriceId.monthly and
   stripePriceId.annual, then pass onCtaClick to
   createCheckoutSession(priceId). The resolved price ID
   (based on the current billing period) is passed back
   via onCtaClick(priceId).

   Feature gating: use plan.id to determine which features
   are unlocked in your middleware / session logic.
   ═══════════════════════════════════════════════════════════ */

export type BillingPeriod = "monthly" | "annual"

export interface PricingPlanData {
  id:             string
  name:           string
  tagline:        string
  badge?:         string
  monthlyPrice:   number
  annualPrice:    number   // per month, billed annually
  currency:       string
  features:       string[]
  featuresLabel?: string
  ctaLabel:       string
  highlight:      boolean
  /** Populate when Stripe is live — currently placeholder strings */
  stripePriceId?: { monthly: string; annual: string }
}

export interface PricingCardProps {
  data:        PricingPlanData
  billing:     BillingPeriod
  /** TODO: replace with createCheckoutSession(priceId) when Stripe is wired */
  onCtaClick?: (stripePriceId: string) => void
  className?:  string
}

/* ── Feature row ──────────────────────────────────────────── */
function FeatureItem({ text, highlight }: { text: string; highlight: boolean }) {
  return (
    <li className="flex items-start gap-2.5">
      <CheckCircle2
        className={cn(
          "mt-px size-[15px] flex-shrink-0",
          highlight
            ? "text-primary"
            : "text-[oklch(0.65_0.15_145)]"
        )}
        aria-hidden="true"
      />
      <span className="text-sm text-foreground/80 leading-snug">{text}</span>
    </li>
  )
}

/* ── Main card ────────────────────────────────────────────── */
export function PricingCard({ data, billing, onCtaClick, className }: PricingCardProps) {
  const isAnnual    = billing === "annual"
  const price       = isAnnual ? data.annualPrice : data.monthlyPrice
  const annualTotal = data.annualPrice * 12
  const yearlySaved = (data.monthlyPrice - data.annualPrice) * 12

  return (
    <article
      className={cn(
        "relative flex flex-col overflow-hidden",
        "rounded-[var(--radius-xl)] border bg-card",
        "shadow-[var(--shadow-card)] transition-all duration-300",
        "hover:-translate-y-2",
        data.highlight
          ? "border-primary/45 shadow-[var(--shadow-lg),var(--glow-primary)]"
          : [
              "border-border",
              "hover:border-primary/25",
              "hover:shadow-[var(--shadow-lg)]",
            ],
        className
      )}
    >
      {/* ── Top accent band ──────────────────────────────── */}
      {data.highlight ? (
        <div
          aria-hidden="true"
          className="h-[3px] w-full flex-shrink-0"
          style={{
            background:
              "linear-gradient(90deg, oklch(0.58 0.22 255), oklch(0.70 0.16 200), oklch(0.78 0.15 83))",
          }}
        />
      ) : (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-px
                     bg-gradient-to-r from-transparent via-white/10 to-transparent"
        />
      )}

      <div className="flex flex-1 flex-col gap-5 p-6">

        {/* ── Plan badge + name + tagline ─────────────────── */}
        <div className="flex flex-col gap-2">
          {data.badge && (
            <div
              className="self-start inline-flex items-center gap-1 rounded-full
                         border border-primary/30 bg-primary/10 px-2.5 py-1
                         text-[11px] font-semibold text-primary"
            >
              <Sparkles className="size-3" aria-hidden="true" />
              {data.badge}
            </div>
          )}
          <h3 className="text-[18px] font-bold text-foreground leading-tight">
            {data.name}
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {data.tagline}
          </p>
        </div>

        {/* ── Price display ───────────────────────────────── */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-end gap-2 flex-wrap">
            <span
              className="text-[44px] font-bold text-foreground tabular-nums leading-none"
            >
              {data.currency}{price}
            </span>
            <div className="mb-1.5 flex items-baseline gap-1.5">
              <span className="text-sm text-muted-foreground">/month</span>
              {isAnnual && (
                <span className="text-sm text-muted-foreground/45 line-through">
                  {data.currency}{data.monthlyPrice}
                </span>
              )}
            </div>
          </div>

          {isAnnual ? (
            <p className="text-xs font-medium text-[oklch(0.65_0.15_145)]">
              Billed {data.currency}{annualTotal}/yr &nbsp;·&nbsp; Save {data.currency}{yearlySaved}/yr
            </p>
          ) : (
            <p className="text-xs text-muted-foreground/55">
              Or save 20% with annual billing
            </p>
          )}
        </div>

        {/* ── Feature list ────────────────────────────────── */}
        <div className="flex flex-1 flex-col gap-3">
          {data.featuresLabel && (
            <div
              className="flex items-center gap-2"
              aria-label={data.featuresLabel}
            >
              <div className="h-px flex-1 bg-border" aria-hidden="true" />
              <span className="flex-shrink-0 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/50">
                {data.featuresLabel}
              </span>
              <div className="h-px flex-1 bg-border" aria-hidden="true" />
            </div>
          )}
          <ul className="flex flex-col gap-2.5" role="list">
            {data.features.map(feature => (
              <FeatureItem
                key={feature}
                text={feature}
                highlight={data.highlight}
              />
            ))}
          </ul>
        </div>

        {/* ── CTA ─────────────────────────────────────────── */}
        <div className="mt-auto flex flex-col gap-2 pt-1">
          <Button
            variant={data.highlight ? "premium" : "outline"}
            size="lg"
            className="w-full"
            onClick={
              data.stripePriceId
                ? () => onCtaClick?.(data.stripePriceId![billing])
                : undefined
            }
          >
            {data.ctaLabel}
          </Button>
          <p className="text-center text-[11px] text-muted-foreground/55">
            14-day free trial &nbsp;·&nbsp; No credit card required
          </p>
        </div>

      </div>
    </article>
  )
}
