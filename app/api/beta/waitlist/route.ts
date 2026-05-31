/*
 * POST /api/beta/waitlist
 * Adds an email to the beta waitlist.
 *
 * Body: { email: string; name?: string; role?: string }
 * Returns: { success: true } or { error: string }
 */

import { NextRequest, NextResponse } from "next/server"
import { createClient }              from "@/lib/supabase/server"

export async function POST(request: NextRequest): Promise<NextResponse> {
  let body: { email?: string; name?: string; role?: string }
  try {
    body = await request.json() as typeof body
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }

  const email = body.email?.trim().toLowerCase()
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "A valid email address is required" }, { status: 400 })
  }

  try {
    const supabase = await createClient()
    const { error } = await supabase.from("beta_waitlist").upsert(
      {
        email,
        name:       body.name?.trim() ?? null,
        role:       body.role?.trim() ?? null,
        joined_at:  new Date().toISOString(),
      },
      { onConflict: "email", ignoreDuplicates: true }
    )

    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("[beta/waitlist]", err)
    return NextResponse.json({ error: "Failed to join waitlist. Try again." }, { status: 500 })
  }
}
