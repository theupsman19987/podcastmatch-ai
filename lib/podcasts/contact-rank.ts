/* ═══════════════════════════════════════════════════════════
   Contact Method Rank — determines the best way to reach
   a podcast for booking purposes.

   Rank  Label             Why
   ────  ────────────────  ──────────────────────────────────
    1    Producer Email    Producer books guests — most direct
    2    Host Email        Direct but host may not manage cal
    3    Booking Email     Dedicated address; usually monitored
    4    Contact Form      Slower but reaches the right person
    5    LinkedIn          Professional; good for cold intro
    6    Instagram         Works for lifestyle/personal shows
    7    No contact        Website/research needed

   Mirror of the GENERATED column in the `podcasts` DB table.
   Use these helpers client-side to avoid re-querying the DB.
   ═══════════════════════════════════════════════════════════ */

import type { ContactMethodRank } from "./schema"

export const CONTACT_METHOD_LABELS: Record<ContactMethodRank, string> = {
  1: "Producer Email",
  2: "Host Email",
  3: "Booking Email",
  4: "Contact Form",
  5: "LinkedIn",
  6: "Instagram",
  7: "No Contact Found",
}

export const CONTACT_METHOD_DESCRIPTIONS: Record<ContactMethodRank, string> = {
  1: "Reach the producer directly — they book guests",
  2: "Email the host directly",
  3: "Use the dedicated booking address",
  4: "Submit via the contact/pitch form",
  5: "Connect on LinkedIn with a personalized note",
  6: "DM on Instagram",
  7: "Research additional contact methods",
}

interface ContactFields {
  producerEmail?:  string | null
  hostEmail?:      string | null
  bookingEmail?:   string | null
  contactFormUrl?: string | null
  linkedinUrl?:    string | null
  instagramUrl?:   string | null
}

export function computeContactMethodRank(fields: ContactFields): ContactMethodRank {
  if (fields.producerEmail)  return 1
  if (fields.hostEmail)      return 2
  if (fields.bookingEmail)   return 3
  if (fields.contactFormUrl) return 4
  if (fields.linkedinUrl)    return 5
  if (fields.instagramUrl)   return 6
  return 7
}

export interface BestContact {
  rank:        ContactMethodRank
  label:       string
  description: string
  value:       string   // the email address or URL
  isEmail:     boolean
}

export function getBestContact(fields: ContactFields & {
  bookingLink?: string | null
}): BestContact | null {
  const rank = computeContactMethodRank(fields)
  if (rank === 7) return null

  const value =
    rank === 1 ? fields.producerEmail! :
    rank === 2 ? fields.hostEmail! :
    rank === 3 ? (fields.bookingEmail ?? fields.bookingLink ?? "") :
    rank === 4 ? fields.contactFormUrl! :
    rank === 5 ? fields.linkedinUrl! :
                 fields.instagramUrl!

  return {
    rank,
    label:       CONTACT_METHOD_LABELS[rank],
    description: CONTACT_METHOD_DESCRIPTIONS[rank],
    value,
    isEmail:     rank <= 3,
  }
}

/** Visual confidence badge color for a given rank. */
export function contactRankColor(rank: ContactMethodRank): "green" | "blue" | "amber" | "gray" {
  if (rank <= 2) return "green"
  if (rank <= 3) return "blue"
  if (rank <= 5) return "amber"
  return "gray"
}
