import { NextRequest, NextResponse } from "next/server"
import { getResend, FROM, ADMIN } from "@/lib/resend"
import {
  welcomeEmailHtml,
  welcomeEmailText,
  adminSignupHtml,
} from "@/lib/email/templates"

export async function POST(req: NextRequest) {
  try {
    const { name, email } = await req.json() as { name?: string; email?: string }

    if (!email || !name) {
      return NextResponse.json({ error: "name and email required" }, { status: 400 })
    }

    const firstName = name.split(" ")[0] ?? name

    /* Send both emails in parallel */
    await Promise.all([
      /* Welcome email → new user */
      getResend().emails.send({
        from:    FROM,
        to:      email,
        subject: `Welcome to PodcastMatch AI, ${firstName}! 🎙️`,
        html:    welcomeEmailHtml(firstName),
        text:    welcomeEmailText(firstName),
      }),
      /* Admin notification → Gmail */
      getResend().emails.send({
        from:    FROM,
        to:      ADMIN,
        subject: `🎉 New signup: ${name} (${email})`,
        html:    adminSignupHtml(name, email),
      }),
    ])

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("[email/welcome]", err)
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
  }
}
