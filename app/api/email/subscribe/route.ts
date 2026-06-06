import { NextRequest, NextResponse } from "next/server"
import { getResend, FROM, ADMIN } from "@/lib/resend"
import {
  subscriberConfirmHtml,
  adminSubscriberHtml,
} from "@/lib/email/templates"

export async function POST(req: NextRequest) {
  try {
    const { email, source } = await req.json() as { email?: string; source?: string }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "valid email required" }, { status: 400 })
    }

    await Promise.all([
      /* Confirmation → subscriber */
      getResend().emails.send({
        from:    FROM,
        to:      email,
        subject: "You're on the list — PodcastMatch AI 🎙️",
        html:    subscriberConfirmHtml(email),
      }),
      /* Notification → admin Gmail */
      getResend().emails.send({
        from:    FROM,
        to:      ADMIN,
        subject: `📬 New subscriber: ${email}`,
        html:    adminSubscriberHtml(email, source ?? "footer"),
      }),
    ])

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("[email/subscribe]", err)
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
  }
}
