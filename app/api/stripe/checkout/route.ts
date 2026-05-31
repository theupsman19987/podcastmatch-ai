/*
 * POST /api/stripe/checkout
 * Creates a Stripe Checkout session for a subscription plan.
 *
 * Body: { priceId: string; successUrl?: string; cancelUrl?: string }
 * Returns: { url: string }
 */

import { NextRequest, NextResponse } from "next/server"
import { stripe, isStripeConfigured } from "@/lib/billing/stripe"
import { createClient }              from "@/lib/supabase/server"
import { headers }                   from "next/headers"

export async function POST(request: NextRequest): Promise<NextResponse> {
  if (!isStripeConfigured() || !stripe) {
    return NextResponse.json(
      { error: "Billing is not configured. Contact support." },
      { status: 503 }
    )
  }

  /* Auth check */
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body      = await request.json() as { priceId?: string; successUrl?: string; cancelUrl?: string }
  const priceId   = body.priceId
  const headersList = await headers()
  const origin    = headersList.get("origin") ?? process.env.NEXT_PUBLIC_APP_URL ?? ""

  if (!priceId) {
    return NextResponse.json({ error: "priceId is required" }, { status: 400 })
  }

  try {
    /* Look up or create Stripe customer */
    let customerId: string | undefined

    const { data: settings } = await supabase
      .from("user_settings")
      .select("account_settings")
      .eq("user_id", user.id)
      .maybeSingle()

    const accountSettings = (settings?.account_settings ?? {}) as Record<string, unknown>
    if (typeof accountSettings.stripe_customer_id === "string") {
      customerId = accountSettings.stripe_customer_id
    }

    if (!customerId) {
      const customer = await stripe.customers.create({
        email:    user.email,
        metadata: { supabase_user_id: user.id },
      })
      customerId = customer.id

      /* Persist customer ID */
      await supabase.from("user_settings").upsert(
        {
          user_id:          user.id,
          account_settings: { ...accountSettings, stripe_customer_id: customerId },
          updated_at:       new Date().toISOString(),
        },
        { onConflict: "user_id" }
      )
    }

    const session = await stripe.checkout.sessions.create({
      customer:   customerId,
      mode:       "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${body.successUrl ?? origin + "/dashboard/settings?tab=billing&success=1"}`,
      cancel_url:  `${body.cancelUrl  ?? origin + "/dashboard/settings?tab=billing&cancelled=1"}`,
      subscription_data: {
        metadata: { supabase_user_id: user.id },
      },
      allow_promotion_codes: true,
      billing_address_collection: "auto",
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error("[stripe/checkout]", err)
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 })
  }
}
