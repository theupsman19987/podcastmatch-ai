"use client"

/* ═══════════════════════════════════════════════════════════
   ContactMethodBadge — shows the best way to get booked on
   a specific podcast. Rank-aware copy, color, and tooltip.

   Used in:
   - DiscoveryCard (grid + list) — compact mode
   - Podcast detail page — panel mode (showPanel=true)
   ═══════════════════════════════════════════════════════════ */

import { Flame, Zap, ExternalLink, Mail, Briefcase, Camera, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ContactMethodRank } from "@/lib/podcasts/schema"

/* ── Per-rank configuration ───────────────────────────────── */
interface RankConfig {
  tier:      string               // header label
  action:    string               // primary action label
  ctaLabel:  string               // CTA button text
  tierIcon:  React.ElementType    // tier-level indicator icon
  actionIcon: React.ElementType   // action type icon
  wrapCls:   string               // border + bg
  tierCls:   string               // tier label text color
  actionCls: string               // action label text color
  bullets:   [string, string, string]
}

const RANK_CONFIG: Record<Exclude<ContactMethodRank, 7>, RankConfig> = {
  1: {
    tier:       "BEST CONTACT METHOD",
    action:     "Apply via Guest Form",
    ctaLabel:   "Apply Now",
    tierIcon:   Flame,
    actionIcon: ExternalLink,
    wrapCls:    "border-[oklch(0.55_0.16_145/0.35)] bg-[oklch(0.55_0.16_145/0.08)]",
    tierCls:    "text-[oklch(0.70_0.16_145)]",
    actionCls:  "text-[oklch(0.78_0.16_145)]",
    bullets: [
      "Preferred submission method for this show",
      "Fastest path to the booking team",
      "Used to review and approve every guest",
    ],
  },
  2: {
    tier:       "BEST CONTACT METHOD",
    action:     "Email the Producer",
    ctaLabel:   "Send Email",
    tierIcon:   Flame,
    actionIcon: Mail,
    wrapCls:    "border-[oklch(0.55_0.16_145/0.35)] bg-[oklch(0.55_0.16_145/0.08)]",
    tierCls:    "text-[oklch(0.70_0.16_145)]",
    actionCls:  "text-[oklch(0.78_0.16_145)]",
    bullets: [
      "Producer manages all guest bookings",
      "Higher response rate than contacting the host",
      "Decision-maker for who gets on the show",
    ],
  },
  3: {
    tier:       "BEST CONTACT METHOD",
    action:     "Send to Booking Email",
    ctaLabel:   "Send Email",
    tierIcon:   Flame,
    actionIcon: Mail,
    wrapCls:    "border-primary/30 bg-primary/8",
    tierCls:    "text-primary",
    actionCls:  "text-primary/90",
    bullets: [
      "Dedicated address monitored for pitches",
      "Reaches the right person directly",
      "More reliable than general contact options",
    ],
  },
  4: {
    tier:       "BEST OPTION",
    action:     "Contact the Host",
    ctaLabel:   "Send Email",
    tierIcon:   Zap,
    actionIcon: Mail,
    wrapCls:    "border-[oklch(0.78_0.15_83/0.30)] bg-[oklch(0.78_0.15_83/0.07)]",
    tierCls:    "text-[var(--premium-gold)]",
    actionCls:  "text-[oklch(0.82_0.13_83)]",
    bullets: [
      "Direct line to the host",
      "Best when no dedicated booking contact exists",
      "Keep your pitch concise and highly personalized",
    ],
  },
  5: {
    tier:       "ALTERNATIVE",
    action:     "Reach out on LinkedIn",
    ctaLabel:   "Message on LinkedIn",
    tierIcon:   Zap,
    actionIcon: Briefcase,
    wrapCls:    "border-border/40 bg-muted/15",
    tierCls:    "text-muted-foreground",
    actionCls:  "text-foreground/70",
    bullets: [
      "Professional introduction works well here",
      "Reference their content in your message",
      "Keep it short — lead with your topic angle",
    ],
  },
  6: {
    tier:       "LAST OPTION",
    action:     "Send Instagram DM",
    ctaLabel:   "DM on Instagram",
    tierIcon:   Zap,
    actionIcon: Camera,
    wrapCls:    "border-border/40 bg-muted/15",
    tierCls:    "text-muted-foreground",
    actionCls:  "text-foreground/70",
    bullets: [
      "Works best for lifestyle and personal shows",
      "Keep the message very short — one paragraph",
      "Link to your media kit in your profile bio",
    ],
  },
}

const TOOLTIP_TEXT =
  "Podcasts respond best when you use their preferred contact method. " +
  "This is the highest-converting way to get booked on this show."

/* ── Compact badge (used on discovery cards) ──────────────── */
export function ContactMethodBadge({
  rank,
  className,
}: {
  rank: ContactMethodRank
  className?: string
}) {
  if (rank === 7) return null
  const cfg        = RANK_CONFIG[rank]
  const TierIcon   = cfg.tierIcon
  const ActionIcon = cfg.actionIcon

  return (
    <div className={cn("group/cm relative", className)}>
      <div className={cn(
        "flex flex-col gap-0.5 rounded-lg border px-2.5 py-1.5 cursor-default select-none",
        cfg.wrapCls
      )}>
        {/* Tier label */}
        <span className={cn("flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest", cfg.tierCls)}>
          <TierIcon className="size-2.5 shrink-0" aria-hidden="true" />
          {cfg.tier}
        </span>
        {/* Action label */}
        <span className={cn("flex items-center gap-1 text-[11px] font-semibold leading-tight", cfg.actionCls)}>
          <ActionIcon className="size-3 shrink-0" aria-hidden="true" />
          {cfg.action}
        </span>
      </div>

      {/* Hover tooltip */}
      <div
        role="tooltip"
        className={cn(
          "pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2",
          "w-56 rounded-xl border border-border bg-card/95 px-3 py-2.5 shadow-xl backdrop-blur-sm",
          "text-center text-[11px] leading-relaxed text-muted-foreground",
          "opacity-0 invisible transition-all duration-150",
          "group-hover/cm:opacity-100 group-hover/cm:visible"
        )}
      >
        {TOOLTIP_TEXT}
        {/* Caret */}
        <span
          aria-hidden
          className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-border"
        />
      </div>
    </div>
  )
}

/* ── CTA button label ─────────────────────────────────────── */
export function contactCtaLabel(rank: ContactMethodRank): string {
  if (rank === 7) return "Pitch"
  return RANK_CONFIG[rank].ctaLabel
}

/* ── Expanded detail panel (used on podcast detail page) ─── */
export function ContactMethodPanel({
  rank,
  contactValue,
  className,
}: {
  rank:          ContactMethodRank
  contactValue?: string
  className?:    string
}) {
  if (rank === 7) return null
  const cfg        = RANK_CONFIG[rank]
  const TierIcon   = cfg.tierIcon
  const ActionIcon = cfg.actionIcon

  return (
    <div className={cn(
      "rounded-xl border p-4 space-y-3",
      cfg.wrapCls, className
    )}>
      {/* Header */}
      <div className="flex items-center gap-2">
        <TierIcon className={cn("size-4 shrink-0", cfg.tierCls)} aria-hidden="true" />
        <div>
          <p className={cn("text-[9px] font-bold uppercase tracking-widest leading-none mb-0.5", cfg.tierCls)}>
            {cfg.tier}
          </p>
          <p className={cn("text-[13px] font-bold leading-tight", cfg.actionCls)}>
            {cfg.action}
          </p>
        </div>
      </div>

      {/* Bullet points */}
      <ul className="space-y-1.5">
        {cfg.bullets.map(b => (
          <li key={b} className="flex items-start gap-2 text-[11px] text-muted-foreground">
            <CheckCircle2 className={cn("size-3 shrink-0 mt-0.5", cfg.tierCls)} aria-hidden="true" />
            {b}
          </li>
        ))}
      </ul>

      {/* CTA */}
      {contactValue && (
        <a
          href={rank === 1 || rank >= 5 ? contactValue : `mailto:${contactValue}`}
          target={rank === 1 || rank >= 5 ? "_blank" : undefined}
          rel={rank === 1 || rank >= 5 ? "noopener noreferrer" : undefined}
          className={cn(
            "flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5",
            "text-[12px] font-semibold transition-all duration-150",
            rank <= 2
              ? "bg-[oklch(0.55_0.16_145/0.20)] text-[oklch(0.78_0.16_145)] hover:bg-[oklch(0.55_0.16_145/0.30)]"
              : rank === 3
                ? "bg-primary/15 text-primary hover:bg-primary/25"
                : rank === 4
                  ? "bg-[oklch(0.78_0.15_83/0.15)] text-[var(--premium-gold)] hover:bg-[oklch(0.78_0.15_83/0.25)]"
                  : "bg-muted/30 text-foreground/80 hover:bg-muted/50"
          )}
        >
          <ActionIcon className="size-3.5" aria-hidden="true" />
          {cfg.ctaLabel} →
        </a>
      )}

      {/* Microcopy */}
      <p className="text-center text-[10px] text-muted-foreground/70 leading-relaxed">
        Use the recommended method to increase your chances of getting booked.
      </p>
    </div>
  )
}
