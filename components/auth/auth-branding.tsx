import Link from "next/link"
import { Mic2, Sparkles, CheckCircle2, TrendingUp, Users } from "lucide-react"
import { cn } from "@/lib/utils"

const FEATURES = [
  "AI discovery across 50,000+ verified podcast shows",
  "Audience alignment scoring and match intelligence",
  "Smart pitch personalization written in your voice",
  "Real-time booking probability and opportunity queue",
]

const MATCH_PREVIEW = {
  name:     "The Creator Mindset Show",
  category: "Business · Entrepreneurship",
  score:    94,
  audience: 87,
  booking:  "HIGH",
  listeners: "42K",
}

const TESTIMONIAL = {
  quote:    "PodcastMatch AI got me booked on 12 shows in my first month. Nothing else comes close.",
  name:     "Sarah Chen",
  title:    "Executive Coach & Author",
  initials: "SC",
}

export function AuthBrandingPanel() {
  return (
    <div className="relative flex h-full min-h-dvh flex-col justify-between px-10 py-10 xl:px-14 xl:py-14">

      {/* Subtle panel tint */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ background: "linear-gradient(155deg, oklch(0.58 0.22 255 / 0.055) 0%, transparent 55%, oklch(0.70 0.16 200 / 0.035) 100%)" }}
      />

      {/* Right-edge separator */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 w-px"
        style={{ background: "linear-gradient(180deg, transparent 0%, oklch(0.6 0.12 255 / 0.18) 25%, oklch(0.6 0.12 255 / 0.18) 75%, transparent 100%)" }}
      />

      {/* ── Logo ─────────────────────────────────────────────── */}
      <Link
        href="/"
        className="flex items-center gap-2.5 group self-start"
        aria-label="PodcastMatch AI home"
      >
        <div className={cn(
          "flex h-9 w-9 items-center justify-center rounded-[var(--radius-sm)]",
          "gradient-primary shadow-[var(--shadow-btn)]",
          "transition-shadow duration-200 group-hover:shadow-[var(--glow-primary)]",
        )}>
          <Mic2 className="size-[18px] text-white" aria-hidden="true" />
        </div>
        <span className="text-[15px] font-bold text-foreground tracking-tight">
          PodcastMatch{" "}
          <span className="gradient-text-primary">AI</span>
        </span>
      </Link>

      {/* ── Center content ───────────────────────────────────── */}
      <div className="flex flex-col gap-8 py-10">

        {/* AI badge */}
        <div className="inline-flex self-start items-center gap-1.5 rounded-full border border-primary/20 bg-primary/8 px-3 py-1.5 text-[11px] font-semibold text-primary">
          <Sparkles className="size-3" aria-hidden="true" />
          AI-Powered Podcast Discovery
        </div>

        {/* Headline */}
        <div className="flex flex-col gap-4">
          <h2 className="text-[2rem] xl:text-[2.35rem] font-bold text-foreground leading-tight tracking-tight">
            Your Next Podcast<br />
            <span className="gradient-text-primary text-glow-primary">Opportunity</span><br />
            Is Already Out There.
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-[360px]">
            PodcastMatch AI surfaces verified shows in your exact niche — analyzes audience fit,
            scores booking probability, and writes a personalized pitch on your behalf.
          </p>
        </div>

        {/* Feature list */}
        <ul className="flex flex-col gap-2.5" role="list">
          {FEATURES.map(f => (
            <li key={f} className="flex items-start gap-2.5 text-sm text-muted-foreground">
              <CheckCircle2 className="size-4 flex-shrink-0 text-primary mt-0.5" aria-hidden="true" />
              {f}
            </li>
          ))}
        </ul>

        {/* AI Match Preview Card */}
        <div
          className="glass rounded-[var(--radius-lg)] p-4 flex flex-col gap-3"
          style={{ maxWidth: "310px" }}
          aria-label="Sample AI podcast match"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-col gap-0.5 min-w-0">
              <p className="text-xs font-semibold text-foreground truncate">{MATCH_PREVIEW.name}</p>
              <p className="text-[10px] text-muted-foreground/55">{MATCH_PREVIEW.category}</p>
            </div>
            <div className="flex-shrink-0 rounded-full gradient-primary px-2 py-0.5 text-[10px] font-bold text-white">
              {MATCH_PREVIEW.score}%
            </div>
          </div>

          {/* Audience alignment bar */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-muted-foreground/55 flex items-center gap-1">
                <Users className="size-2.5" aria-hidden="true" />
                Audience Alignment
              </span>
              <span className="text-[10px] font-medium text-primary">{MATCH_PREVIEW.audience}%</span>
            </div>
            <div className="h-1 rounded-full overflow-hidden" style={{ background: "oklch(0.3 0.02 255 / 0.35)" }}>
              <div
                className="h-full rounded-full gradient-primary"
                style={{ width: `${MATCH_PREVIEW.audience}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-[10px]">
            <span className="text-muted-foreground/55 flex items-center gap-1">
              <TrendingUp className="size-2.5" aria-hidden="true" />
              Booking Probability
            </span>
            <span className="font-bold" style={{ color: "var(--premium-cyan)" }}>
              {MATCH_PREVIEW.booking}
            </span>
          </div>
        </div>
      </div>

      {/* ── Testimonial ──────────────────────────────────────── */}
      <div className="glass rounded-[var(--radius-lg)] p-5 flex flex-col gap-3 max-w-[380px]">
        <p className="text-sm text-foreground/75 leading-relaxed italic">
          "{TESTIMONIAL.quote}"
        </p>
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full gradient-primary text-[10px] font-bold text-white">
            {TESTIMONIAL.initials}
          </div>
          <div>
            <p className="text-xs font-semibold text-foreground">{TESTIMONIAL.name}</p>
            <p className="text-[11px] text-muted-foreground/55">{TESTIMONIAL.title}</p>
          </div>
        </div>
      </div>

    </div>
  )
}
