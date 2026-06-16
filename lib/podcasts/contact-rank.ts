/* ═══════════════════════════════════════════════════════════
   Contact Method Rank — determines the best way to reach
   a podcast for booking purposes.

   Rank  Label             Why
   ────  ────────────────  ──────────────────────────────────
    1    Booking Form      Submissions reach the booker directly;
                           podcasts often prefer structured pitches
    2    Producer Email    Producer books guests — most direct email
    3    Booking Email     Dedicated address; usually monitored
    4    Host Email        Direct but host may not manage their cal
    5    LinkedIn          Professional cold intro
    6    Instagram         Last-resort DM for lifestyle shows
    7    No contact        Research needed

   Mirror of the GENERATED column in the `podcasts` DB table.
   Use these helpers client-side to avoid re-querying the DB.
   ═══════════════════════════════════════════════════════════ */

import type { ContactMethodRank } from "./schema"

export const CONTACT_METHOD_LABELS: Record<ContactMethodRank, string> = {
  1: "Booking Form",
  2: "Producer Email",
  3: "Booking Email",
  4: "Host Email",
  5: "LinkedIn",
  6: "Instagram",
  7: "No Contact Found",
}

export const CONTACT_METHOD_DESCRIPTIONS: Record<ContactMethodRank, string> = {
  1: "Submit a guest pitch via their booking form",
  2: "Email the producer — they handle guest bookings",
  3: "Use the dedicated booking email address",
  4: "Email the host directly",
  5: "Connect on LinkedIn with a personalized note",
  6: "DM on Instagram",
  7: "No contact method found — research required",
}

interface ContactFields {
  producerEmail?:  string | null
  hostEmail?:      string | null
  bookingEmail?:   string | null
  contactFormUrl?: string | null
  bookingLink?:    string | null  // treated as rank 1 alongside contactFormUrl
  linkedinUrl?:    string | null
  instagramUrl?:   string | null
}

export function computeContactMethodRank(fields: ContactFields): ContactMethodRank {
  if (fields.contactFormUrl || fields.bookingLink) return 1
  if (fields.producerEmail)                        return 2
  if (fields.bookingEmail)                         return 3
  if (fields.hostEmail)                            return 4
  if (fields.linkedinUrl)                          return 5
  if (fields.instagramUrl)                         return 6
  return 7
}

export interface BestContact {
  rank:        ContactMethodRank
  label:       string
  description: string
  value:       string   // the URL or email address
  isForm:      boolean  // true for rank 1 (open in browser)
  isEmail:     boolean  // true for ranks 2-4
}

export function getBestContact(fields: ContactFields): BestContact | null {
  const rank = computeContactMethodRank(fields)
  if (rank === 7) return null

  const value =
    rank === 1 ? (fields.contactFormUrl ?? fields.bookingLink ?? "") :
    rank === 2 ? fields.producerEmail! :
    rank === 3 ? fields.bookingEmail! :
    rank === 4 ? fields.hostEmail! :
    rank === 5 ? fields.linkedinUrl! :
                 fields.instagramUrl!

  return {
    rank,
    label:       CONTACT_METHOD_LABELS[rank],
    description: CONTACT_METHOD_DESCRIPTIONS[rank],
    value,
    isForm:      rank === 1,
    isEmail:     rank >= 2 && rank <= 4,
  }
}

/** Visual confidence color for a given rank. */
export function contactRankColor(rank: ContactMethodRank): "green" | "blue" | "amber" | "gray" {
  if (rank <= 3) return "green"   // booking form + direct emails
  if (rank === 4) return "blue"   // host email — still useful
  if (rank <= 6) return "amber"   // social fallback
  return "gray"
}

/** Whether the rank indicates actionable contact info exists. */
export function hasActionableContact(rank: ContactMethodRank): boolean {
  return rank <= 4
}
