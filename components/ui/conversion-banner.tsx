import * as React from "react"
import { cn } from "@/lib/utils"
import {
  ArrowRight,
  ChevronRight,
  Shield,
  CreditCard,
  Brain,
  Zap,
} from "lucide-react"
import { ShimmerButton } from "@/components/ui/shimmer-button"
import { Button } from "@/components/ui/button"

/* ═══════════════════════════════════════════════════════════
   ConversionBanner — reusable CTA banner component.

   Drop on any page that needs a conversion moment:
   - Final homepage CTA (hero variant, with cinematic wrapper)
   - Campaign landing pages
   - Feature page closers
   - Dashboard upgrade prompts (compact variant)
   - Pricing page top / bottom banners

   Stripe integration: replace the CTA button's onClick with
   createCheckoutSession() or router.push('/signup').
   ═══════════════════════════════════════════════════════════ */

const TRUST_ITEMS = [
  { icon: CreditCard, label: "No Credit Card Required" },
  { icon: Shield,     label: "Cancel Anytime" },
  { icon: Brain,      label: "AI-Powered Discovery" },
  { icon: Zap,        label: "Active in Minutes" },
]

export interface ConversionBannerProps {
  /** First line of heading — white text */
  headline?:        string
  /** Second line of heading — gradient text */
  headlineAccent?:  string
  /** Paragraph below the headline */
  subheadline?:     string
  /** Primary CTA label */
  ctaLabel?:        string
  /** Secondary CTA label — pass null to hide */
  secondaryLabel?:  string | null
  /** Show the trust items row. Default: true */
  showTrust?:       boolean
  /** hero = large (homepage sections), compact = smaller (inline use) */
  variant?:         "hero" | "compact"
  /** Forwarded to the h2 for aria-labelledby on the parent section */
  headingId?:       string
  className?:       string
}

export function ConversionBanner({
  headline        = "Your Voice Belongs",
  headlineAccent  = "On Bigger Stages",
  subheadline     = "PodcastMatch AI matches you with verified podcast opportunities perfectly aligned to your niche, your message, and your audience. Thousands of hosts are booking guests right now — let the AI find yours.",
  ctaLabel        = "Start Your 14-Day Free Trial",
  secondaryLabel  = "See How It Works",
  showTrust       = true,
  variant         = "hero",
  headingId,
  className,
}: ConversionBannerProps) {
  const isHero = variant === "hero"

  return (
    <div
      className={cn("flex flex-col items-center text-center", className)}
    >
      {/* Headline ──────────────────────────────────────────── */}
      <h2
        id={headingId}
        className={cn(
          "mx-auto font-bold leading-tight tracking-tight",
          isHero ? "text-h1 max-w-2xl" : "text-h2 max-w-xl"
        )}
      >
        {headline}{" "}
        <span className="gradient-text-primary text-glow-primary block">
          {headlineAccent}
        </span>
      </h2>

      {/* Subheadline ────────────────────────────────────────── */}
      <p
        className={cn(
          "mx-auto mt-6 leading-relaxed text-muted-foreground",
          isHero ? "max-w-xl text-lg" : "max-w-md text-base"
        )}
      >
        {subheadline}
      </p>

      {/* CTA buttons ─────────────────────────────────────────── */}
      <div
        className={cn(
          "flex flex-col sm:flex-row items-center justify-center gap-4",
          isHero ? "mt-10" : "mt-8"
        )}
      >
        {/* Primary — shimmer + pulsing glow aura */}
        <div className="relative flex-shrink-0">
          {/* Pulsing glow behind button */}
          <div
            className="absolute inset-0 -z-10 rounded-[var(--radius-md)]
                       bg-primary/20 blur-xl animate-pulse"
            aria-hidden="true"
          />
          <ShimmerButton
            variant="premium"
            size={isHero ? "xl" : "lg"}
            className={cn(
              "shadow-[var(--shadow-btn-premium),0_0_40px_oklch(0.58_0.22_255/0.20)]",
              "hover:shadow-[var(--glow-cyan-lg),0_0_60px_oklch(0.58_0.22_255/0.30)]"
            )}
          >
            {ctaLabel}
            <ArrowRight aria-hidden="true" />
          </ShimmerButton>
        </div>

        {/* Secondary */}
        {secondaryLabel !== null && secondaryLabel && (
          <Button
            variant="outline"
            size={isHero ? "lg" : "default"}
            className="gap-2"
          >
            {secondaryLabel}
            <ChevronRight aria-hidden="true" />
          </Button>
        )}
      </div>

      {/* Trust strip ─────────────────────────────────────────── */}
      {showTrust && (
        <div
          className={cn(
            "flex flex-wrap items-center justify-center gap-x-6 gap-y-2",
            isHero ? "mt-8" : "mt-6"
          )}
        >
          {TRUST_ITEMS.map(item => (
            <span
              key={item.label}
              className="flex items-center gap-1.5 text-xs text-muted-foreground/65"
            >
              <item.icon
                className="size-3 flex-shrink-0 text-primary/60"
                aria-hidden="true"
              />
              {item.label}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
