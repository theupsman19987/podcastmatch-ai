import { Resend } from "resend"

export const resend = new Resend(process.env.RESEND_API_KEY)

export const FROM    = process.env.RESEND_FROM        ?? "hello@podcastmatchai.com"
export const ADMIN   = process.env.RESEND_ADMIN_EMAIL ?? "theupsman1998@gmail.com"
