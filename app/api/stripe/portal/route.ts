/*
 * POST /api/stripe/portal
 * Creates a Stripe Customer Portal session so users can manage their
 * subscriptions (upgrade, downgrade, cancel, update payment method).
 *
 * Returns: { url: string }
 */

import { NextRequest, NextResponse } from "next/server"
import { stripe, isStripeConfigured } from "@/lib/billing/stripe"
import { createClient }              from "@/lib/supabase/server"
import { headers }                   from "next/headers"

export async function POST(_request: NextRequest): Promise<NextResponse> {
  if (!isStripeConfigured() || !stripe) {
    return NextResponse.json(
      { error: "Billing is not configured." },
      { status: 503 }
    )
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    /* Get stored customer ID */
    const { data: settings } = await supabase
      .from("user_settings")
      .select("account_settings")
      .eq("user_id", user.id)
      .maybeSingle()

    const accountSettings = (settings?.account_settings ?? {}) as Record<string, unknown>
    const customerId = accountSettings.stripe_customer_id as string | undefined

    if (!customerId) {
      return NextResponse.json(
        { error: "No billing account found. Please subscribe first." },
        { status: 404 }
      )
    }

    const headersList = await headers()
    const origin      = headersList.get("origin") ?? process.env.NEXT_PUBLIC_APP_URL ?? ""

    const session = await stripe.billingPortal.sessions.create({
      customer:    customerId,
      return_url:  `${origin}/dashboard/settings?tab=billing`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error("[stripe/portal]", err)
    return NextResponse.json({ error: "Failed to open billing portal" }, { status: 500 })
  }
}
