"use client"

import * as React from "react"
import { useRef } from "react"
import { motion, useInView } from "motion/react"
import {
  Mic2,
  TrendingUp,
  Sparkles,
  Users,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { ConversionBanner } from "@/components/ui/conversion-banner"
import { AiScoreBadge } from "@/components/ui/ai-score-badge"

/* ── Floating proof cards ─────────────────────────────────
   Positioned absolutely around the CTA content area.
   Visible at xl+ only to avoid overlap on smaller screens.
   Use aria-hidden — these are decorative momentum signals.
   ──────────────────────────────────────────────────────── */

function FloatingPodcastCard() {
  return (
    <div
      className={cn(
        "glass-strong flex flex-col gap-2.5 rounded-[var(--radius-xl)]",
        "border border-border p-3.5 shadow-[var(--shadow-float)]",
        "w-[185px]"
      )}
    >
      <div className="flex items-center gap-2">
        <div
          className="flex h-7 w-7 flex-shrink-0 items-center justify-center
                     rounded-md bg-primary/15"
        >
          <Mic2 className="size-3.5 text-primary" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold text-foreground leading-tight truncate">
            The Tim Ferriss Show
          </p>
          <p className="text-[10px] text-muted-foreground">7.1M listeners</p>
        </div>
      </div>
      <AiScoreBadge score={94} size="sm" />
    </div>
  )
}

function FloatingInsightCard() {
  return (
    <div
      className={cn(
        "glass-strong flex items-center gap-2.5 rounded-[var(--radius-xl)]",
        "border border-border p-3.5 shadow-[var(--shadow-float)]",
        "w-[195px]"
      )}
    >
      <div
        className="flex h-8 w-8 flex-shrink-0 items-center justify-center
                   rounded-md bg-primary/15"
      >
        <Sparkles className="size-3.5 text-primary" aria-hidden="true" />
      </div>
      <div>
        <p className="text-[11px] font-semibold text-foreground leading-tight">
          New Match Found
        </p>
        <p className="text-[10px] text-primary font-medium">
          3 opportunities today
        </p>
      </div>
    </div>
  )
}

function FloatingMetricCard() {
  return (
    <div
      className={cn(
        "glass-strong flex items-center gap-2.5 rounded-[var(--radius-xl)]",
        "border border-border p-3.5 shadow-[var(--shadow-float)]",
        "w-[175px]"
      )}
    >
      <div
        className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md"
        style={{ background: "oklch(0.78 0.15 83 / 0.15)" }}
      >
        <TrendingUp
          className="size-3.5"
          style={{ color: "var(--premium-gold)" }}
          aria-hidden="true"
        />
      </div>
      <div>
        <p className="text-[11px] font-semibold text-foreground leading-tight">
          Audience Match
        </p>
        <p
          className="text-[10px] font-semibold"
          style={{ color: "var(--premium-gold)" }}
        >
          94% alignment
        </p>
      </div>
    </div>
  )
}

function FloatingBookingCard() {
  return (
    <div
      className={cn(
        "glass-strong flex flex-col gap-2 rounded-[var(--radius-xl)]",
        "border border-border p-3.5 shadow-[var(--shadow-float)]",
        "w-[180px]"
      )}
    >
      <div className="flex items-center gap-2">
        <div
          className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md"
          style={{ background: "oklch(0.70 0.16 200 / 0.15)" }}
        >
          <Users
            className="size-3.5"
            style={{ color: "var(--premium-cyan)" }}
            aria-hidden="true"
          />
        </div>
        <p className="text-[11px] font-semibold text-foreground leading-tight">
          Host Accepting
        </p>
      </div>
      <div className="flex items-center gap-1.5">
        <span
          className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[oklch(0.65_0.15_145)] animate-pulse"
          aria-hidden="true"
        />
        <p className="text-[10px] text-muted-foreground">Booking window open</p>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   FinalCtaSection
   ══════════════════════════════════════════════════════════ */
export function FinalCtaSection() {
  const ref     = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })

  /* Floating card entrance config */
  const floaters = [
    {
      card:  <FloatingPodcastCard />,
      pos:   "top-[18%] left-[3%]",
      delay: 0.5,
      float: "animate-float",
      phase: "-0.5s",
    },
    {
      card:  <FloatingInsightCard />,
      pos:   "top-[10%] right-[3%]",
      delay: 0.65,
      float: "animate-float-alt",
      phase: "-2s",
    },
    {
      card:  <FloatingMetricCard />,
      pos:   "bottom-[22%] left-[4%]",
      delay: 0.55,
      float: "animate-float-alt",
      phase: "-3.5s",
    },
    {
      card:  <FloatingBookingCard />,
      pos:   "bottom-[18%] right-[4%]",
      delay: 0.70,
      float: "animate-float",
      phase: "-1.5s",
    },
  ]

  return (
    <section
      className="relative overflow-hidden py-32 lg:py-44"
      aria-labelledby="final-cta-heading"
    >

      {/* ── BACKGROUND ─────────────────────────────────────── */}

      {/* Top connector */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-48"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.09 0.028 252 / 0.60) 0%, transparent 100%)",
        }}
      />

      {/* Spotlight orb — primary blue, center, intentionally bright */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2
                   -translate-x-1/2 -translate-y-1/2
                   h-[900px] w-[900px] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(ellipse at center, oklch(0.58 0.22 255 / 0.10), transparent 68%)",
        }}
      />

      {/* Secondary cyan orb — upper right */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -right-32 h-[600px] w-[600px] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(ellipse at center, oklch(0.70 0.16 200 / 0.05), transparent 65%)",
        }}
      />

      {/* Gold orb — lower left */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -left-32 h-[500px] w-[500px] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(ellipse at center, oklch(0.78 0.15 83 / 0.05), transparent 65%)",
        }}
      />

      {/* Grid overlay — centered radial mask, creates stage-spotlight feel */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: [
            "linear-gradient(oklch(0.15 0.05 255 / 0.04) 1px, transparent 1px)",
            "linear-gradient(90deg, oklch(0.15 0.05 255 / 0.04) 1px, transparent 1px)",
          ].join(", "),
          backgroundSize: "64px 64px",
          maskImage:
            "radial-gradient(ellipse 75% 75% at 50% 50%, black 30%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 75% 75% at 50% 50%, black 30%, transparent 100%)",
        }}
      />

      {/* Edge vignette — dark corners, bright center */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 90% at 50% 50%, transparent 40%, oklch(0.08 0.025 255 / 0.55) 100%)",
        }}
      />

      {/* ── MAIN CONTENT ──────────────────────────────────── */}
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 28 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8"
      >
        <ConversionBanner headingId="final-cta-heading" />
      </motion.div>

      {/* ── FLOATING PROOF CARDS — xl+ only ──────────────── */}
      {floaters.map((f, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.88 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{
            duration: 0.6,
            ease: [0.16, 1, 0.3, 1],
            delay: f.delay,
          }}
          className={cn(
            "pointer-events-none absolute z-20",
            "hidden xl:block",
            f.float,
            f.pos
          )}
          style={{ animationDelay: f.phase }}
          aria-hidden="true"
        >
          {f.card}
        </motion.div>
      ))}

    </section>
  )
}
