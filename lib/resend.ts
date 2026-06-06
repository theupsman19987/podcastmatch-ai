import { Resend } from "resend"

let _resend: Resend | null = null

export function getResend(): Resend {
  if (!_resend) {
    const key = process.env.RESEND_API_KEY
    if (!key) throw new Error("Missing RESEND_API_KEY environment variable")
    _resend = new Resend(key)
  }
  return _resend
}

export const FROM    = process.env.RESEND_FROM        ?? "hello@podcastmatchai.com"
export const ADMIN   = process.env.RESEND_ADMIN_EMAIL ?? "theupsman1998@gmail.com"
