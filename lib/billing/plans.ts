/*
 * Subscription plan definitions.
 * Set real Stripe Price IDs in .env after creating products in Stripe Dashboard.
 *
 * FUTURE EXPANSION:
 * - Add yearly pricing (20% discount)
 * - Add team/agency tiers
 * - Add usage-based pricing (per outreach sent)
 */

export type PlanId = "free" | "creator-pro" | "visibility-pro" | "enterprise"

export interface BillingPlan {
  id:          PlanId
  name:        string
  tagline:     string
  price:       string          // Display string
  priceMonthly: number        // USD cents (0 = free, -1 = custom)
  period:      string | null
  stripePriceId: string | null  // Set via env vars
  popular:     boolean
  cta:         string
  features:    string[]
}

export const BILLING_PLANS: BillingPlan[] = [
  {
    id:           "free",
    name:         "Starter",
    tagline:      "Explore the platform",
    price:        "Free",
    priceMonthly: 0,
    period:       null,
    stripePriceId: null,
    popular:      false,
    cta:          "Get Started",
    features: [
      "10 podcast discoveries/month",
      "Basic match scores",
      "1 saved opportunity",
      "Email support",
    ],
  },
  {
    id:           "creator-pro",
    name:         "Creator Pro",
    tagline:      "For serious creators",
    price:        "$29",
    priceMonthly: 2900,
    period:       "/month",
    stripePriceId: process.env.STRIPE_PRICE_CREATOR_PRO ?? null,
    popular:      true,
    cta:          "Start 14-Day Trial",
    features: [
      "Unlimited podcast discoveries",
      "AI match scores + explanations",
      "Unlimited saved opportunities",
      "Creator DNA assessment",
      "Outreach angle generator",
      "Priority support",
    ],
  },
  {
    id:           "visibility-pro",
    name:         "Visibility Pro",
    tagline:      "Maximum exposure",
    price:        "$79",
    priceMonthly: 7900,
    period:       "/month",
    stripePriceId: process.env.STRIPE_PRICE_VISIBILITY_PRO ?? null,
    popular:      false,
    cta:          "Upgrade to Pro",
    features: [
      "Everything in Creator Pro",
      "Advanced audience alignment",
      "Visibility recommendations",
      "Category ranking reports",
      "Early access to new features",
      "Dedicated account manager",
    ],
  },
  {
    id:           "enterprise",
    name:         "Enterprise",
    tagline:      "For agencies & teams",
    price:        "Custom",
    priceMonthly: -1,
    period:       null,
    stripePriceId: null,
    popular:      false,
    cta:          "Contact Sales",
    features: [
      "Everything in Visibility Pro",
      "Multi-seat access",
      "White-label options",
      "Custom integrations",
      "SLA guarantee",
      "Dedicated onboarding",
    ],
  },
]

export function getPlanById(id: PlanId): BillingPlan {
  return BILLING_PLANS.find(p => p.id === id) ?? BILLING_PLANS[0]
}
