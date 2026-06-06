"use client"

import { useRef } from "react"
import { motion, useInView } from "motion/react"
import { ConversionBanner } from "@/components/ui/conversion-banner"

/* ══════════════════════════════════════════════════════════
   FinalCtaSection
   ══════════════════════════════════════════════════════════ */
export function FinalCtaSection() {
  const ref     = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })

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


    </section>
  )
}
