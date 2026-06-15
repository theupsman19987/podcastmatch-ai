import { NextRequest, NextResponse } from "next/server"
import { getResend, FROM } from "@/lib/resend"
import { contactNotificationHtml, contactConfirmHtml } from "@/lib/email/templates"

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const CONTACT_INBOX = "hello@podcastmatchai.com"

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message } = await req.json() as {
      name?: string; email?: string; subject?: string; message?: string
    }

    if (!name?.trim())                        return NextResponse.json({ error: "Name is required" },    { status: 400 })
    if (!email || !EMAIL_RE.test(email))      return NextResponse.json({ error: "Valid email required" }, { status: 400 })
    if (!subject?.trim())                     return NextResponse.json({ error: "Subject is required" },  { status: 400 })
    if (!message?.trim() || message.length < 10)
      return NextResponse.json({ error: "Message must be at least 10 characters" }, { status: 400 })

    await Promise.all([
      /* Notification → contact inbox */
      getResend().emails.send({
        from:     FROM,
        to:       CONTACT_INBOX,
        replyTo:  email,
        subject:  `[Contact] ${subject} — ${name}`,
        html:     contactNotificationHtml(name.trim(), email, subject.trim(), message.trim()),
      }),
      /* Confirmation → sender */
      getResend().emails.send({
        from:    FROM,
        to:      email,
        subject: "We got your message — PodcastMatch AI",
        html:    contactConfirmHtml(name.trim()),
      }),
    ])

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("[api/contact]", err)
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 })
  }
}
