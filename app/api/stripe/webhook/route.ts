/*
 * POST /api/stripe/webhook
 * Handles Stripe webhook events to keep the database in sync.
 *
 * SETUP:
 * 1. Stripe Dashboard → Webhooks → Add endpoint → /api/stripe/webhook
 * 2. Select events: checkout.session.completed, customer.subscription.*
 * 3. Copy the webhook signing secret to STRIPE_WEBHOOK_SECRET
 *
 * Or use Stripe CLI for local testing:
 *   stripe listen --forward-to localhost:3000/api/stripe/webhook
 */

import { NextRequest, NextResponse } from "next/server"
import { stripe, isStripeConfigured } from "@/lib/billing/stripe"
import { createClient }              from "@/lib/supabase/server"
import type Stripe                   from "stripe"
import type { Json }                 from "@/lib/supabase/database.types"

export async function POST(request: NextRequest): Promise<NextResponse> {
  if (!isStripeConfigured() || !stripe) {
    return NextResponse.json({ received: true })
  }

  const body      = await request.text()
  const signature = request.headers.get("stripe-signature") ?? ""
  const secret    = process.env.STRIPE_WEBHOOK_SECRET

  if (!secret) {
    console.error("[stripe/webhook] STRIPE_WEBHOOK_SECRET is not set")
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, secret)
  } catch (err) {
    console.error("[stripe/webhook] Signature verification failed:", err)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  const supabase = await createClient()

  try {
    switch (event.type) {

      /* ── Checkout completed → subscription created ─────────── */
      case "checkout.session.completed": {
        const session    = event.data.object as Stripe.Checkout.Session
        const userId     = (session.metadata as Record<string, string> | null)?.supabase_user_id
        if (!userId || !session.subscription) break

        await supabase.from("subscriptions").upsert(
          {
            user_id:         userId,
            stripe_customer_id:     session.customer as string,
            stripe_subscription_id: session.subscription as string,
            status:          "active",
            plan_id:         "creator-pro",   // Refine via price lookup if needed
            current_period_start: new Date().toISOString(),
            current_period_end:   null,
            metadata:        { session_id: session.id } as Json,
            updated_at:      new Date().toISOString(),
          },
          { onConflict: "user_id" }
        )
        break
      }

      /* ── Subscription updated (upgrade, downgrade, renewal) ─── */
      case "customer.subscription.updated": {
        const sub    = event.data.object as Stripe.Subscription
        const userId = sub.metadata?.supabase_user_id
        if (!userId) break

        await supabase.from("subscriptions").upsert(
          {
            user_id:                userId,
            stripe_customer_id:     sub.customer as string,
            stripe_subscription_id: sub.id,
            status:                 sub.status,
            current_period_start:   new Date((sub as unknown as { current_period_start: number }).current_period_start * 1000).toISOString(),
            current_period_end:     new Date((sub as unknown as { current_period_end: number }).current_period_end   * 1000).toISOString(),
            metadata:               sub.metadata as unknown as Json,
            updated_at:             new Date().toISOString(),
          },
          { onConflict: "user_id" }
        )
        break
      }

      /* ── Subscription cancelled ────────────────────────────── */
      case "customer.subscription.deleted": {
        const sub    = event.data.object as Stripe.Subscription
        const userId = sub.metadata?.supabase_user_id
        if (!userId) break

        await supabase.from("subscriptions")
          .update({ status: "cancelled", updated_at: new Date().toISOString() })
          .eq("user_id", userId)
        break
      }

      default:
        /* Acknowledge unhandled events */
        break
    }
  } catch (err) {
    console.error("[stripe/webhook] Handler error:", err)
    /* Return 200 anyway — we don't want Stripe to retry indefinitely */
  }

  return NextResponse.json({ received: true })
}
