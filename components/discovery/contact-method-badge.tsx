"use client"

/* ═══════════════════════════════════════════════════════════
   ContactMethodBadge — rank-aware badge showing the best way
   to get booked on a specific podcast.

   Props:
     rank       — ContactMethodRank (1-7)
     compact    — true for list-view inline (no context text)
     className  — wrapper override
   ═══════════════════════════════════════════════════════════ */

import { Flame, Zap, ExternalLink, Mail, Briefcase, Camera, CheckCircle2, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"
import { usePerformance } from "@/components/discovery/performance-context"
import type { ContactMethodRank } from "@/lib/podcasts/schema"

/* ── Per-rank configuration ───────────────────────────────── */
interface RankConfig {
  tier:             string
  action:           string
  ctaLabel:         string
  contextText:      string   // short supporting text under action
  confidenceLabel:  string   // "High Success Path" | "Strong Option" | "Backup Method"
  tierIcon:         React.ElementType
  actionIcon:       React.ElementType
  wrapCls:          string   // border + bg
  tierCls:          string   // tier label text
  actionCls:        string   // action label text
  contextCls:       string   // context text
  confidenceCls:    string   // confidence badge
  confidenceDotCls: string   // dot color
  bullets:          [string, string, string]
}

const RANK_CONFIG: Record<Exclude<ContactMethodRank, 7>, RankConfig> = {
  1: {
    tier:            "BEST CONTACT METHOD",
    action:          "Apply via Guest Form",
    ctaLabel:        "Apply Now",
    contextText:     "Preferred by this show — highest chance of response",
    confidenceLabel: "High Success Path",
    tierIcon:        Flame,
    actionIcon:      ExternalLink,
    wrapCls:         "border-[oklch(0.55_0.16_145/0.35)] bg-[oklch(0.55_0.16_145/0.08)]",
    tierCls:         "text-[oklch(0.70_0.16_145)]",
    actionCls:       "text-[oklch(0.78_0.16_145)]",
    contextCls:      "text-[oklch(0.65_0.12_145)]",
    confidenceCls:   "bg-[oklch(0.55_0.16_145/0.15)] text-[oklch(0.70_0.16_145)] border-[oklch(0.55_0.16_145/0.25)]",
    confidenceDotCls:"bg-[oklch(0.65_0.15_145)]",
    bullets: [
      "Preferred submission method for this show",
      "Fastest path to the booking team",
      "Used to review and approve every guest",
    ],
  },
  2: {
    tier:            "BEST CONTACT METHOD",
    action:          "Email the Producer",
    ctaLabel:        "Send Email",
    contextText:     "Handled by the booking decision-maker",
    confidenceLabel: "High Success Path",
    tierIcon:        Flame,
    actionIcon:      Mail,
    wrapCls:         "border-[oklch(0.55_0.16_145/0.35)] bg-[oklch(0.55_0.16_145/0.08)]",
    tierCls:         "text-[oklch(0.70_0.16_145)]",
    actionCls:       "text-[oklch(0.78_0.16_145)]",
    contextCls:      "text-[oklch(0.65_0.12_145)]",
    confidenceCls:   "bg-[oklch(0.55_0.16_145/0.15)] text-[oklch(0.70_0.16_145)] border-[oklch(0.55_0.16_145/0.25)]",
    confidenceDotCls:"bg-[oklch(0.65_0.15_145)]",
    bullets: [
      "Producer manages all guest bookings",
      "Higher response rate than contacting the host",
      "Decision-maker for who gets on the show",
    ],
  },
  3: {
    tier:            "BEST CONTACT METHOD",
    action:          "Send to Booking Email",
    ctaLabel:        "Send Email",
    contextText:     "Designed for guest requests",
    confidenceLabel: "Strong Option",
    tierIcon:        Flame,
    actionIcon:      Mail,
    wrapCls:         "border-primary/30 bg-primary/8",
    tierCls:         "text-primary",
    actionCls:       "text-primary/90",
    contextCls:      "text-primary/60",
    confidenceCls:   "bg-primary/12 text-primary border-primary/25",
    confidenceDotCls:"bg-primary",
    bullets: [
      "Dedicated address monitored for pitches",
      "Reaches the right person directly",
      "More reliable than general contact options",
    ],
  },
  4: {
    tier:            "BEST OPTION",
    action:          "Contact the Host",
    ctaLabel:        "Send Email",
    contextText:     "Less reliable — use if no better option exists",
    confidenceLabel: "Backup Method",
    tierIcon:        Zap,
    actionIcon:      Mail,
    wrapCls:         "border-[oklch(0.78_0.15_83/0.30)] bg-[oklch(0.78_0.15_83/0.07)]",
    tierCls:         "text-[var(--premium-gold)]",
    actionCls:       "text-[oklch(0.82_0.13_83)]",
    contextCls:      "text-[oklch(0.72_0.10_83)]",
    confidenceCls:   "bg-[oklch(0.78_0.15_83/0.12)] text-[var(--premium-gold)] border-[oklch(0.78_0.15_83/0.25)]",
    confidenceDotCls:"bg-[oklch(0.78_0.15_83)]",
    bullets: [
      "Direct line to the host",
      "Best when no dedicated booking contact exists",
      "Keep your pitch concise and highly personalized",
    ],
  },
  5: {
    tier:            "ALTERNATIVE",
    action:          "Reach out on LinkedIn",
    ctaLabel:        "Message on LinkedIn",
    contextText:     "Professional intro — reference their recent content",
    confidenceLabel: "Backup Method",
    tierIcon:        Zap,
    actionIcon:      Briefcase,
    wrapCls:         "border-border/40 bg-muted/15",
    tierCls:         "text-muted-foreground",
    actionCls:       "text-foreground/75",
    contextCls:      "text-muted-foreground/70",
    confidenceCls:   "bg-muted/30 text-muted-foreground border-border/30",
    confidenceDotCls:"bg-muted-foreground/50",
    bullets: [
      "Professional introduction works well here",
      "Reference their content in your message",
      "Keep it short — lead with your topic angle",
    ],
  },
  6: {
    tier:            "LAST OPTION",
    action:          "Send Instagram DM",
    ctaLabel:        "DM on Instagram",
    contextText:     "Last resort — keep your message very short",
    confidenceLabel: "Backup Method",
    tierIcon:        Zap,
    actionIcon:      Camera,
    wrapCls:         "border-border/40 bg-muted/15",
    tierCls:         "text-muted-foreground",
    actionCls:       "text-foreground/75",
    contextCls:      "text-muted-foreground/70",
    confidenceCls:   "bg-muted/30 text-muted-foreground border-border/30",
    confidenceDotCls:"bg-muted-foreground/50",
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

/* ── Compact badge (list view inline) ────────────────────── */
function CompactBadge({ rank, cfg }: { rank: Exclude<ContactMethodRank, 7>; cfg: RankConfig }) {
  const TierIcon   = cfg.tierIcon
  const ActionIcon = cfg.actionIcon
  return (
    <span className={cn(
      "inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5",
      cfg.wrapCls
    )}>
      <TierIcon   className={cn("size-2.5 shrink-0", cfg.tierCls)} aria-hidden="true" />
      <ActionIcon className={cn("size-2.5 shrink-0", cfg.actionCls)} aria-hidden="true" />
      <span className={cn("text-[9px] font-semibold", cfg.actionCls)}>{cfg.action}</span>
    </span>
  )
}

/* ── Full badge (grid view) ───────────────────────────────── */
function FullBadge({ cfg, rank }: { cfg: RankConfig; rank: Exclude<ContactMethodRank, 7> }) {
  const TierIcon   = cfg.tierIcon
  const ActionIcon = cfg.actionIcon
  const perfMap    = usePerformance()
  const perf       = perfMap[rank]

  // Only show performance signal when we have meaningful data (≥3 attempts)
  const showPerf = perf && perf.attempts >= 3
  const perfHighResponse = showPerf && perf.responseRate >= 40
  const perfHighBooking  = showPerf && perf.bookingRate  >= 20

  return (
    <div className={cn(
      "flex flex-col gap-1 rounded-lg border px-2.5 py-2 cursor-default select-none",
      cfg.wrapCls
    )}>
      {/* Row 1: tier label + confidence signal */}
      <div className="flex items-center justify-between gap-2">
        <span className={cn("flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest shrink-0", cfg.tierCls)}>
          <TierIcon className="size-2.5" aria-hidden="true" />
          {cfg.tier}
        </span>
        <span className={cn(
          "flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[8px] font-semibold shrink-0",
          cfg.confidenceCls
        )}>
          <span className={cn("h-1 w-1 rounded-full", cfg.confidenceDotCls)} aria-hidden="true" />
          {cfg.confidenceLabel}
        </span>
      </div>

      {/* Row 2: action label */}
      <span className={cn("flex items-center gap-1.5 text-[11px] font-semibold leading-tight", cfg.actionCls)}>
        <ActionIcon className="size-3 shrink-0" aria-hidden="true" />
        {cfg.action}
      </span>

      {/* Row 3: context text */}
      <span className={cn("text-[10px] leading-snug pl-[18px]", cfg.contextCls)}>
        {cfg.contextText}
      </span>

      {/* Row 4: live performance signal (only when data exists) */}
      {showPerf && (perfHighResponse || perfHighBooking) && (
        <div className="flex flex-wrap items-center gap-1.5 pt-1 mt-0.5 border-t border-current/10 pl-[18px]">
          {perfHighResponse && (
            <span className="flex items-center gap-1 rounded-full border border-[oklch(0.55_0.16_145/0.30)] bg-[oklch(0.55_0.16_145/0.10)] px-1.5 py-0.5 text-[8px] font-semibold text-[oklch(0.70_0.16_145)]">
              <TrendingUp className="size-2" aria-hidden="true" />
              {perf.responseRate}% response rate
            </span>
          )}
          {perfHighBooking && (
            <span className="flex items-center gap-1 rounded-full border border-[oklch(0.78_0.15_83/0.30)] bg-[oklch(0.78_0.15_83/0.10)] px-1.5 py-0.5 text-[8px] font-semibold text-[var(--premium-gold)]">
              <CheckCircle2 className="size-2" aria-hidden="true" />
              Books frequently
            </span>
          )}
        </div>
      )}
    </div>
  )
}

/* ── Public component ─────────────────────────────────────── */
export function ContactMethodBadge({
  rank,
  compact = false,
  className,
}: {
  rank:       ContactMethodRank
  compact?:   boolean
  className?: string
}) {
  if (rank === 7) return null
  const cfg = RANK_CONFIG[rank]

  if (compact) {
    return <CompactBadge rank={rank} cfg={cfg} />
  }

  return (
    <div className={cn("group/cm relative", className)}>
      <FullBadge cfg={cfg} rank={rank} />

      {/* Hover tooltip */}
      <div
        role="tooltip"
        className={cn(
          "pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2",
          "w-60 rounded-xl border border-border bg-card/95 px-3 py-2.5 shadow-xl backdrop-blur-sm",
          "text-center text-[11px] leading-relaxed text-muted-foreground",
          "opacity-0 invisible transition-all duration-150",
          "group-hover/cm:opacity-100 group-hover/cm:visible"
        )}
      >
        {TOOLTIP_TEXT}
        <span
          aria-hidden
          className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-border"
        />
      </div>
    </div>
  )
}

/* ── CTA label helper ─────────────────────────────────────── */
export function contactCtaLabel(rank: ContactMethodRank): string {
  if (rank === 7) return "Pitch"
  return RANK_CONFIG[rank].ctaLabel
}

/* ── Analytics event helper ───────────────────────────────── */
export function contactAnalyticsEvent(rank: ContactMethodRank): import("@/lib/analytics/track").AnalyticsEvent | null {
  if (rank === 1)              return "clicked_apply"
  if (rank >= 2 && rank <= 4) return "clicked_email"
  if (rank === 5)             return "clicked_linkedin"
  if (rank === 6)             return "clicked_instagram"
  return null
}

/* ── Expanded detail panel (podcast detail page) ─────────── */
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
  const isLink     = rank === 1 || rank >= 5
  const perfMap    = usePerformance()
  const perf       = perfMap[rank]
  const showPerf   = perf && perf.attempts >= 3

  return (
    <div className={cn("rounded-xl border p-4 space-y-3", cfg.wrapCls, className)}>
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
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
        <span className={cn(
          "flex items-center gap-1 rounded-full border px-2 py-0.5 text-[9px] font-semibold shrink-0",
          cfg.confidenceCls
        )}>
          <span className={cn("h-1 w-1 rounded-full", cfg.confidenceDotCls)} aria-hidden="true" />
          {cfg.confidenceLabel}
        </span>
      </div>

      {/* Context */}
      <p className={cn("text-[11px] leading-snug", cfg.contextCls)}>{cfg.contextText}</p>

      {/* Bullets */}
      <ul className="space-y-1.5">
        {cfg.bullets.map(b => (
          <li key={b} className="flex items-start gap-2 text-[11px] text-muted-foreground">
            <CheckCircle2 className={cn("size-3 shrink-0 mt-0.5", cfg.tierCls)} aria-hidden="true" />
            {b}
          </li>
        ))}
      </ul>

      {/* Live performance signal */}
      {showPerf && (
        <div className="flex flex-wrap gap-2 rounded-lg border border-[oklch(0.55_0.16_145/0.25)] bg-[oklch(0.55_0.16_145/0.06)] px-3 py-2">
          <div className="flex items-center gap-1.5 text-[10px] text-[oklch(0.70_0.16_145)]">
            <TrendingUp className="size-3 shrink-0" aria-hidden="true" />
            <span>
              <strong>{perf.responseRate}%</strong> response rate ·{" "}
              <strong>{perf.bookingRate}%</strong> booking rate
              <span className="text-muted-foreground/60 ml-1">from {perf.attempts} users</span>
            </span>
          </div>
        </div>
      )}

      {/* Microcopy */}
      <p className="text-center text-[10px] text-muted-foreground/70 leading-relaxed">
        Use the recommended method to increase your chances of getting booked.
      </p>

      {/* CTA */}
      {contactValue && (
        <a
          href={isLink ? contactValue : `mailto:${contactValue}`}
          target={isLink ? "_blank" : undefined}
          rel={isLink ? "noopener noreferrer" : undefined}
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
    </div>
  )
}
