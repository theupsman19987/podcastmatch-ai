"use client"

/* ═══════════════════════════════════════════════════════════
   OutreachModal — shown when a user clicks a CTA on a podcast
   card. Displays the rank-appropriate pitch template, lets
   the user copy it, then opens the contact URL and logs the
   outreach attempt.
   ═══════════════════════════════════════════════════════════ */

import { useState, useEffect, useCallback } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Copy, Check, ExternalLink, Mail, Briefcase, Camera, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { getOutreachTemplate } from "@/lib/outreach/templates"
import { logOutreach } from "@/lib/outreach/actions"
import { trackClientEvent } from "@/lib/analytics/track"
import { contactAnalyticsEvent } from "@/components/discovery/contact-method-badge"
import type { ContactMethodRank } from "@/lib/podcasts/schema"

/* ── Types ───────────────────────────────────────────────── */
export interface OutreachPodcast {
  id:            string
  name:          string
  host:          string
  producerName?: string | null
  contactMethodRank?: number
  bestContactValue?:  string
}

interface OutreachModalProps {
  podcast:   OutreachPodcast
  isOpen:    boolean
  onClose:   () => void
}

/* ── Per-rank action label + icon ────────────────────────── */
const RANK_ACTION: Record<number, { label: string; icon: React.ElementType }> = {
  1: { label: "Open Booking Form",   icon: ExternalLink },
  2: { label: "Open Email",          icon: Mail },
  3: { label: "Open Email",          icon: Mail },
  4: { label: "Open Email",          icon: Mail },
  5: { label: "Open LinkedIn",       icon: Briefcase },
  6: { label: "Open Instagram",      icon: Camera },
}

/* ── Subject line copyable field ─────────────────────────── */
function SubjectField({ subject }: { subject: string }) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    await navigator.clipboard.writeText(subject)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  return (
    <div className="rounded-lg border border-border/50 bg-muted/20 px-3 py-2">
      <div className="mb-1 flex items-center justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Subject</span>
        <button
          onClick={copy}
          className="flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          {copied ? <Check className="size-3 text-[oklch(0.65_0.15_145)]" /> : <Copy className="size-3" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <p className="text-[12px] text-foreground">{subject}</p>
    </div>
  )
}

/* ── Main component ──────────────────────────────────────── */
export function OutreachModal({ podcast, isOpen, onClose }: OutreachModalProps) {
  const rank  = podcast.contactMethodRank as ContactMethodRank | undefined
  const value = podcast.bestContactValue

  const template = rank && rank !== 7
    ? getOutreachTemplate(rank, {
        podcastName:  podcast.name,
        producerName: podcast.producerName,
        hostName:     podcast.host,
      })
    : null

  const [message, setMessage] = useState(template?.body ?? "")
  const [copied,  setCopied]  = useState(false)
  const [opening, setOpening] = useState(false)

  // Reset message when template changes (different podcast)
  useEffect(() => {
    if (template) setMessage(template.body)
  }, [podcast.id, rank]) // eslint-disable-line react-hooks/exhaustive-deps

  const copyMessage = useCallback(async () => {
    await navigator.clipboard.writeText(message)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [message])

  const handleOpen = useCallback(async () => {
    if (!rank || !value) return
    setOpening(true)

    // Fire analytics
    const event = contactAnalyticsEvent(rank)
    if (event) {
      trackClientEvent({
        event,
        properties: { podcast_id: podcast.id, podcast_name: podcast.name, rank },
      }).catch(() => {})
    }

    // Copy message to clipboard
    try { await navigator.clipboard.writeText(message) } catch { /* permission denied — skip */ }

    // Log outreach to DB (fire-and-forget)
    logOutreach({
      podcast_id:          podcast.id,
      podcast_name:        podcast.name,
      contact_method_rank: rank,
      contact_value:       value,
    }).catch(() => {})

    // Navigate
    if (rank === 1 || rank >= 5) {
      window.open(value, "_blank", "noopener,noreferrer")
    } else {
      window.location.href = `mailto:${value}`
    }

    setOpening(false)
    onClose()
  }, [rank, value, message, podcast.id, podcast.name, onClose])

  if (!template || !rank) return null

  const action = RANK_ACTION[rank] ?? RANK_ACTION[2]
  const ActionIcon = action.icon

  const placeholderCount = (message.match(/\[YOUR |[\[]/g) ?? []).length
  const hasPlaceholders  = placeholderCount > 0

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className="max-w-lg gap-0 p-0 overflow-hidden">

        {/* Header */}
        <DialogHeader className="border-b border-border/40 px-5 py-4">
          <DialogTitle className="text-[14px] font-bold">
            Pitch Template — {podcast.name}
          </DialogTitle>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Via {template.method} · Edit before sending
          </p>
        </DialogHeader>

        <div className="flex flex-col gap-4 px-5 py-4 max-h-[70vh] overflow-y-auto">

          {/* Subject line (email methods only) */}
          {template.subject && <SubjectField subject={template.subject} />}

          {/* Message textarea */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Message</span>
              {hasPlaceholders && (
                <span className="flex items-center gap-1 rounded-full bg-[oklch(0.78_0.15_83/0.12)] px-2 py-0.5 text-[9px] font-semibold text-[var(--premium-gold)]">
                  Fill in the [BRACKETED] sections
                </span>
              )}
            </div>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              rows={12}
              spellCheck
              className={cn(
                "w-full resize-none rounded-lg border bg-muted/10 px-3 py-2.5",
                "text-[12px] leading-relaxed text-foreground",
                "focus:outline-none focus:ring-1 focus:ring-primary/40",
                "border-border/50 transition-colors"
              )}
            />
          </div>

          {/* Guidance note */}
          <p className="text-[10px] text-muted-foreground/70 leading-relaxed text-center">
            Personalise your message before sending — shows you actually listened to the show.
          </p>
        </div>

        {/* Footer CTA */}
        <div className="flex items-center gap-2.5 border-t border-border/40 px-5 py-3.5">
          <button
            onClick={copyMessage}
            className={cn(
              "flex items-center gap-1.5 rounded-lg border px-3 py-2 text-[11px] font-semibold transition-all",
              copied
                ? "border-[oklch(0.55_0.16_145/0.40)] bg-[oklch(0.55_0.16_145/0.12)] text-[oklch(0.70_0.16_145)]"
                : "border-border/50 bg-muted/20 text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
            {copied ? "Copied!" : "Copy"}
          </button>

          <button
            onClick={handleOpen}
            disabled={opening}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2 text-[12px] font-semibold transition-all",
              "bg-primary text-white hover:bg-primary/90 disabled:opacity-60"
            )}
          >
            <ActionIcon className="size-3.5" aria-hidden="true" />
            Copy &amp; {action.label}
            <ChevronRight className="size-3.5" aria-hidden="true" />
          </button>
        </div>

        {/* Check-in hint */}
        <p className="border-t border-border/30 px-5 py-2.5 text-center text-[10px] text-muted-foreground/60 leading-relaxed">
          We&apos;ll check in later to ask how it went — helping you track what&apos;s actually working.
        </p>
      </DialogContent>
    </Dialog>
  )
}
