import * as React from "react"
import { cn } from "@/lib/utils"
import { Star, Quote, Play } from "lucide-react"

/* ═══════════════════════════════════════════════════════════
   TestimonialCard — featured and compact variants for social
   proof sections, marquee rows, and success story panels.

   Connect to real data: replace static arrays in the parent
   section with API responses mapped to TestimonialData.
   ═══════════════════════════════════════════════════════════ */

export type AvatarColor =
  | "blue"
  | "purple"
  | "gold"
  | "cyan"
  | "green"
  | "rose"

const AVATAR_GRADIENTS: Record<AvatarColor, string> = {
  blue:   "linear-gradient(135deg, oklch(0.42 0.22 255), oklch(0.28 0.18 255))",
  purple: "linear-gradient(135deg, oklch(0.42 0.20 280), oklch(0.28 0.16 270))",
  gold:   "linear-gradient(135deg, oklch(0.52 0.16 75), oklch(0.36 0.12 68))",
  cyan:   "linear-gradient(135deg, oklch(0.42 0.16 200), oklch(0.28 0.12 195))",
  green:  "linear-gradient(135deg, oklch(0.42 0.16 145), oklch(0.28 0.12 140))",
  rose:   "linear-gradient(135deg, oklch(0.48 0.20 18),  oklch(0.32 0.15 8))",
}

/* ── Sub-components ─────────────────────────────────────── */

function Stars({ count = 5 }: { count?: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            "size-3.5 flex-shrink-0",
            i < count
              ? "fill-[var(--premium-gold)] text-[var(--premium-gold)]"
              : "fill-muted text-muted"
          )}
          aria-hidden="true"
        />
      ))}
    </div>
  )
}

function ResultBadge({ text }: { text: string }) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-1",
        "border-[oklch(0.55_0.16_145/0.30)] bg-[oklch(0.42_0.16_145/0.12)]",
        "text-[11px] font-semibold text-[oklch(0.72_0.16_145)]"
      )}
    >
      <span
        className="h-1.5 w-1.5 rounded-full bg-[oklch(0.65_0.15_145)]"
        aria-hidden="true"
      />
      {text}
    </div>
  )
}

function VideoPreview({ thumbnailColor }: { thumbnailColor: AvatarColor }) {
  const gradient = AVATAR_GRADIENTS[thumbnailColor]
  return (
    <div
      className="relative mt-4 h-28 w-full overflow-hidden rounded-xl border border-white/8"
      style={{ background: gradient }}
      aria-label="Video testimonial preview"
    >
      {/* Subtle noise overlay */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
        }}
        aria-hidden="true"
      />
      {/* Play button */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className={cn(
            "flex items-center justify-center rounded-full",
            "h-10 w-10 bg-white/20 backdrop-blur-sm border border-white/30",
            "shadow-[0_4px_20px_oklch(0_0_0/0.35)]"
          )}
        >
          <Play className="size-4 fill-white text-white ml-0.5" aria-hidden="true" />
        </div>
      </div>
      {/* Label */}
      <div className="absolute bottom-2.5 left-3">
        <span className="rounded-md bg-black/40 px-2 py-0.5 text-[10px] font-semibold text-white/90 backdrop-blur-sm">
          Watch Story
        </span>
      </div>
    </div>
  )
}

/* ── Types ──────────────────────────────────────────────── */

export interface TestimonialData {
  id:             string
  name:           string
  title:          string
  company:        string
  avatarColor:    AvatarColor
  avatarInitials: string
  quote:          string
  stars:          number
  result:         string
  hasVideoPreview?: boolean
  variant?:       "featured" | "default"
}

export interface CompactTestimonialData {
  id:             string
  name:           string
  title:          string
  avatarColor:    AvatarColor
  avatarInitials: string
  quote:          string
  stars:          number
}

/* ── Featured / Default testimonial card ────────────────── */

export interface TestimonialCardProps {
  data:       TestimonialData
  className?: string
}

export function TestimonialCard({ data, className }: TestimonialCardProps) {
  const isFeatured = data.variant === "featured"

  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden",
        "rounded-[var(--radius-xl)] border border-border bg-card",
        "shadow-[var(--shadow-card)] transition-all duration-250",
        "hover:-translate-y-1.5 hover:border-primary/30",
        "hover:shadow-[var(--shadow-lg),var(--glow-primary)]",
        isFeatured && "lg:col-span-2",
        className
      )}
    >
      {/* Top-edge highlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px
                   bg-gradient-to-r from-transparent via-white/12 to-transparent"
      />

      <div className={cn("flex flex-col gap-4 p-5", isFeatured && "sm:p-6")}>

        {/* Header: avatar + name + stars */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div
              className="flex h-11 w-11 flex-shrink-0 items-center justify-center
                         rounded-full text-sm font-bold text-white shadow-md"
              style={{ background: AVATAR_GRADIENTS[data.avatarColor] }}
              aria-hidden="true"
            >
              {data.avatarInitials}
            </div>

            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground leading-tight">
                {data.name}
              </p>
              <p className="text-xs text-muted-foreground leading-tight mt-0.5 truncate">
                {data.title} · {data.company}
              </p>
            </div>
          </div>

          <Stars count={data.stars} />
        </div>

        {/* Quote */}
        <div className="relative">
          <Quote
            className="absolute -top-1 -left-0.5 size-5 text-primary/20"
            aria-hidden="true"
          />
          <blockquote
            className={cn(
              "pl-5 text-sm text-foreground/85 leading-relaxed",
              isFeatured && "text-[15px]"
            )}
          >
            &ldquo;{data.quote}&rdquo;
          </blockquote>
        </div>

        {/* Result badge */}
        <ResultBadge text={data.result} />

        {/* Video preview — featured only */}
        {isFeatured && data.hasVideoPreview && (
          <VideoPreview thumbnailColor={data.avatarColor} />
        )}

      </div>
    </article>
  )
}

/* ── Compact card (for marquee) ─────────────────────────── */

export interface CompactTestimonialCardProps {
  data:       CompactTestimonialData
  className?: string
}

export function CompactTestimonialCard({ data, className }: CompactTestimonialCardProps) {
  return (
    <div
      className={cn(
        "relative flex flex-col gap-3 overflow-hidden",
        "rounded-[var(--radius-lg)] border border-border bg-card",
        "w-[280px] flex-shrink-0 p-4",
        "shadow-[var(--shadow-card)]",
        className
      )}
    >
      {/* Top-edge highlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px
                   bg-gradient-to-r from-transparent via-white/10 to-transparent"
      />

      {/* Header */}
      <div className="flex items-center gap-2.5">
        <div
          className="flex h-8 w-8 flex-shrink-0 items-center justify-center
                     rounded-full text-[11px] font-bold text-white"
          style={{ background: AVATAR_GRADIENTS[data.avatarColor] }}
          aria-hidden="true"
        >
          {data.avatarInitials}
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold text-foreground leading-tight">{data.name}</p>
          <p className="text-[10px] text-muted-foreground leading-tight truncate">{data.title}</p>
        </div>
        <div className="ml-auto flex-shrink-0">
          <Stars count={data.stars} />
        </div>
      </div>

      {/* Quote */}
      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
        &ldquo;{data.quote}&rdquo;
      </p>
    </div>
  )
}
