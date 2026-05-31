import Stripe from "stripe"

/*
 * Stripe server-side client — singleton.
 * This file must only be imported in server components / API routes.
 *
 * SETUP:
 * 1. Create a Stripe account at stripe.com
 * 2. Copy your Secret Key to STRIPE_SECRET_KEY in Coolify env vars
 * 3. Create products and prices in Stripe Dashboard → copy Price IDs
 * 4. Set STRIPE_PRICE_CREATOR_PRO and STRIPE_PRICE_VISIBILITY_PRO
 * 5. Set STRIPE_WEBHOOK_SECRET (from Stripe CLI or webhook settings)
 */

if (!process.env.STRIPE_SECRET_KEY) {
  /* Non-fatal during build; fatal at runtime in production */
  if (process.env.NODE_ENV === "production") {
    console.warn("[Stripe] STRIPE_SECRET_KEY is not set — billing will be unavailable")
  }
}

export const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion:  "2026-05-27.dahlia",
      typescript:   true,
      appInfo: {
        name:    "PodcastMatch AI",
        version: "1.0.0",
      },
    })
  : null

export function isStripeConfigured(): boolean {
  return !!stripe
}
