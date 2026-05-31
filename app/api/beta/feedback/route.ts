/*
 * POST /api/beta/feedback
 * Submits user feedback / bug report.
 *
 * Body: { type: "bug"|"feature"|"general"; message: string; page?: string }
 */

import { NextRequest, NextResponse } from "next/server"
import { createClient }              from "@/lib/supabase/server"
import type { Json }                 from "@/lib/supabase/database.types"

export async function POST(request: NextRequest): Promise<NextResponse> {
  let body: { type?: string; message?: string; page?: string }
  try {
    body = await request.json() as typeof body
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }

  const message = body.message?.trim()
  if (!message || message.length < 10) {
    return NextResponse.json({ error: "Feedback must be at least 10 characters" }, { status: 400 })
  }

  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const { error } = await supabase.from("feedback").insert({
      user_id:    user?.id ?? null,
      type:       body.type ?? "general",
      message,
      page:       body.page ?? null,
      metadata:   {} as Json,
      created_at: new Date().toISOString(),
    })

    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("[beta/feedback]", err)
    return NextResponse.json({ error: "Failed to submit feedback. Try again." }, { status: 500 })
  }
}
