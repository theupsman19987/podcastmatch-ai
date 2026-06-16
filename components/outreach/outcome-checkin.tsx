"use client"

/* ═══════════════════════════════════════════════════════════
   OutcomeCheckin — dashboard widget that prompts the user
   to report what happened after their outreach attempts.

   Shows up to N pending outreaches (contacted > 3 days ago,
   not yet marked as booked). Each card walks through:
     1. Did you follow up?
     2. Did they respond?
     3. Did you get booked?
   ═══════════════════════════════════════════════════════════ */

import { useState, useTransition, useEffect } from "react"
import { CheckCircle2, X, Radio } from "lucide-react"
import { cn } from "@/lib/utils"
import { CONTACT_METHOD_LABELS } from "@/lib/podcasts/contact-rank"
import type { ContactMethodRank } from "@/lib/podcasts/schema"
import {
  getPendingOutcomes,
  updateOutcomeStep,
  type OutreachLogRow,
  type OutcomeStep,
} from "@/lib/outreach/actions"

/* ── Format a date for display ───────────────────────────── */
function daysAgo(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime()
  const d  = Math.floor(ms / 86_400_000)
  if (d === 0) return "today"
  if (d === 1) return "yesterday"
  return `${d} days ago`
}

/* ── Next step logic ─────────────────────────────────────── */
function nextStep(row: OutreachLogRow): { step: OutcomeStep; question: string } | null {
  if (!row.followed_up)  return { step: "followed_up",  question: "Did you follow up?" }
  if (!row.got_response) return { step: "got_response", question: "Did they respond?" }
  if (!row.got_booked)   return { step: "got_booked",   question: "Did you get booked? 🎉" }
  return null
}

/* ── Single outreach row ─────────────────────────────────── */
function CheckinRow({
  row,
  onUpdate,
  onDismiss,
}: {
  row:       OutreachLogRow
  onUpdate:  (id: string, step: OutcomeStep) => Promise<void>
  onDismiss: (id: string) => void
}) {
  const [pending, startTransition] = useTransition()
  const [done,    setDone]         = useState(false)
  const next = nextStep(row)

  if (!next || done) return null

  const label = CONTACT_METHOD_LABELS[row.contact_method_rank as ContactMethodRank] ?? "Contact"

  return (
    <div className={cn(
      "flex items-center gap-3 rounded-xl border border-border/40 bg-card px-3.5 py-3",
      "transition-opacity", pending && "opacity-60"
    )}>
      {/* Left: podcast info */}
      <div className="min-w-0 flex-1">
        <p className="text-[12px] font-semibold text-foreground truncate">{row.podcast_name}</p>
        <p className="text-[10px] text-muted-foreground mt-0.5">
          {label} · contacted {daysAgo(row.contacted_at)}
        </p>
        <p className="mt-1.5 text-[11px] font-medium text-foreground/80">{next.question}</p>
      </div>

      {/* Right: Yes / Not yet */}
      <div className="flex shrink-0 items-center gap-1.5">
        <button
          disabled={pending}
          onClick={() => {
            startTransition(async () => {
              await onUpdate(row.id, next.step)
              setDone(true)
            })
          }}
          className={cn(
            "flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold transition-all",
            "bg-[oklch(0.55_0.16_145/0.15)] text-[oklch(0.70_0.16_145)]",
            "hover:bg-[oklch(0.55_0.16_145/0.25)] disabled:opacity-50"
          )}
        >
          <CheckCircle2 className="size-3" aria-hidden="true" />
          Yes
        </button>
        <button
          disabled={pending}
          onClick={() => onDismiss(row.id)}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground/60 transition-colors hover:bg-muted hover:text-muted-foreground"
          aria-label="Dismiss"
        >
          <X className="size-3.5" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}

/* ── Public widget ───────────────────────────────────────── */
export function OutcomeCheckin() {
  const [rows,       setRows]       = useState<OutreachLogRow[]>([])
  const [dismissed,  setDismissed]  = useState<Set<string>>(new Set())
  const [loaded,     setLoaded]     = useState(false)

  useEffect(() => {
    getPendingOutcomes(5)
      .then(data => { setRows(data); setLoaded(true) })
      .catch(() => setLoaded(true))
  }, [])

  const visible = rows.filter(r => !dismissed.has(r.id) && nextStep(r) !== null)

  if (!loaded || visible.length === 0) return null

  async function handleUpdate(id: string, step: OutcomeStep) {
    await updateOutcomeStep(id, step)
    // Refresh from server to reflect new state
    const updated = await getPendingOutcomes(5)
    setRows(updated)
  }

  function handleDismiss(id: string) {
    setDismissed(prev => new Set([...prev, id]))
  }

  return (
    <div className="rounded-2xl border border-border/40 bg-card/60 p-4 space-y-3">
      <div className="flex items-center gap-2">
        <Radio className="size-3.5 text-primary" aria-hidden="true" />
        <h3 className="text-[12px] font-bold text-foreground">Outreach Check-In</h3>
        <span className="ml-auto rounded-full bg-primary/12 px-2 py-0.5 text-[10px] font-semibold text-primary">
          {visible.length} pending
        </span>
      </div>
      <div className="space-y-2">
        {visible.map(row => (
          <CheckinRow
            key={row.id}
            row={row}
            onUpdate={handleUpdate}
            onDismiss={handleDismiss}
          />
        ))}
      </div>
      <p className="text-[10px] text-muted-foreground/60 text-center">
        Your responses help us show you what&apos;s actually working.
      </p>
    </div>
  )
}
