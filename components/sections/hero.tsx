"use client"

import { motion } from "motion/react"
import { ArrowRight, Play, CheckCircle2, Mic, Users, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ShimmerButton } from "@/components/ui/shimmer-button"
import { NumberTicker } from "@/components/ui/number-ticker"
import { CardBadge } from "@/components/ui/card"
import { AIDashboardMockup } from "@/components/hero/ai-dashboard-mockup"

/* ── Animation variants ─────────────────────────────────────── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 22, filter: "blur(6px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  transition: { duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] as const },
})

const TRUST_STATS = [
  {
    icon: Mic,
    value: 50,
    suffix: "K+",
    label: "Podcasts indexed",
    colorClass: "text-primary",
  },
  {
    icon: TrendingUp,
    value: 94,
    suffix: "%",
    label: "Match accuracy",
    colorClass: "text-[var(--premium-cyan)]",
  },
  {
    icon: Users,
    value: 48,
    suffix: "hrs",
    label: "Avg time to booking",
    colorClass: "text-[var(--premium-gold)]",
  },
]

const AVATAR_INITIALS = ["JR", "ML", "SK", "AT"]

/* ══════════════════════════════════════════════════════════════
   Hero Section
   ══════════════════════════════════════════════════════════════ */
export function Hero() {
  return (
    <section
      className="relative flex min-h-[100dvh] items-center overflow-hidden"
      aria-label="PodcastMatch AI — AI-powered podcast guest booking platform"
    >

      {/* ── CINEMATIC BACKGROUND ─────────────────────────────── */}
      {/* Animated grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-20 hero-grid opacity-70"
      />

      {/* Primary radial glow — top center, Electric Blue */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/2 -z-10 h-[700px] w-[900px] -translate-x-1/2 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(ellipse at center, oklch(0.58 0.22 255 / 0.14), transparent 65%)",
        }}
      />

      {/* Secondary glow — right side, Cyan */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-1/3 -z-10 h-[500px] w-[500px] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(ellipse at center, oklch(0.70 0.16 200 / 0.08), transparent 65%)",
        }}
      />

      {/* Gold accent — top-left corner */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-20 -top-20 -z-10 h-[360px] w-[360px] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(ellipse at center, oklch(0.78 0.15 83 / 0.06), transparent 65%)",
        }}
      />

      {/* Bottom fade out */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 inset-x-0 -z-10 h-40 bg-gradient-to-t from-background to-transparent"
      />

      {/* ── CONTENT GRID ─────────────────────────────────────── */}
      <div className="container mx-auto w-full px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:gap-8 xl:gap-10">

          {/* ════════════════════════════════════════════════════
              LEFT COLUMN — 45% — Messaging & CTAs
              ════════════════════════════════════════════════════ */}
          <div className="flex w-full flex-col gap-7 lg:w-[45%]">

            {/* LAUNCH BADGE */}
            <motion.div {...fadeUp(0.1)}>
              <CardBadge color="gold" className="inline-flex gap-2 px-3 py-1 text-xs">
                <span className="relative flex h-1.5 w-1.5 flex-shrink-0">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--premium-gold)] opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--premium-gold)]" />
                </span>
                AI-Powered Podcast Matching — Now in Beta
              </CardBadge>
            </motion.div>

            {/* HEADLINE */}
            <motion.div {...fadeUp(0.18)}>
              <h1 className="text-hero" data-speakable="hero-headline">
                Get Booked on{" "}
                <span className="gradient-text-primary text-glow-primary">
                  Podcasts
                </span>
                {" "}That Actually<br className="hidden sm:block" />
                Move the Needle
              </h1>
            </motion.div>

            {/* SUBHEADLINE */}
            <motion.p
              {...fadeUp(0.26)}
              className="text-lg leading-relaxed text-muted-foreground"
            >
              PodcastMatch AI analyzes your expertise, audience, and goals to surface
              verified podcast opportunities in your exact niche — then writes a
              personalized pitch and tracks every booking automatically.
              Built for{" "}
              <span className="text-foreground font-medium">
                speakers, authors, coaches, and thought leaders
              </span>
              {" "}who refuse to be overlooked.
            </motion.p>

            {/* CTA ROW */}
            <motion.div
              {...fadeUp(0.34)}
              className="flex flex-col gap-3 sm:flex-row"
            >
              <ShimmerButton variant="premium" size="xl" className="group">
                Get AI Matches Free
                <ArrowRight className="size-5 transition-transform duration-200 group-hover:translate-x-0.5" />
              </ShimmerButton>

              <Button variant="outline" size="xl" className="group gap-3">
                <span
                  className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full
                             bg-primary/15 transition-colors duration-200 group-hover:bg-primary/25"
                >
                  <Play className="size-3.5 fill-primary text-primary ml-0.5" />
                </span>
                See How It Works
              </Button>
            </motion.div>

            {/* TRUST ROW */}
            <motion.div {...fadeUp(0.44)} className="space-y-4">

              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {AVATAR_INITIALS.map((initials, i) => (
                    <div
                      key={initials}
                      className="flex h-7 w-7 items-center justify-center rounded-full border-2
                                 border-background gradient-primary text-[9px] font-bold text-white"
                      style={{ zIndex: AVATAR_INITIALS.length - i }}
                    >
                      {initials}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  Trusted by{" "}
                  <span className="font-medium text-foreground">2,400+ creators</span>
                  {" "}and growing
                </p>
              </div>

              <div className="flex flex-wrap gap-2.5">
                {TRUST_STATS.map(({ icon: Icon, value, suffix, label, colorClass }, i) => (
                  <div
                    key={label}
                    className="glass flex items-center gap-2 rounded-full px-4 py-2"
                  >
                    <Icon className={`size-3.5 flex-shrink-0 ${colorClass}`} />
                    <span className={`text-sm font-bold ${colorClass}`}>
                      <NumberTicker value={value} suffix={suffix} delay={i * 150} />
                    </span>
                    <span className="text-xs text-muted-foreground">{label}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="size-3.5 flex-shrink-0 text-[var(--premium-cyan)]" />
                <span className="text-xs text-muted-foreground">
                  Free forever plan · No credit card required · Cancel anytime
                </span>
              </div>

            </motion.div>

          </div>
          {/* ════ END LEFT COLUMN ════ */}

          {/* ════════════════════════════════════════════════════
              RIGHT COLUMN — 55% — AI Dashboard Mockup
              ════════════════════════════════════════════════════ */}
          <motion.div
            className="hidden w-full lg:flex lg:w-[55%] items-center justify-center"
            initial={{ opacity: 0, x: 40, scale: 0.95, filter: "blur(10px)" }}
            animate={{ opacity: 1, x: 0, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.85, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            <AIDashboardMockup />
          </motion.div>
          {/* ════ END RIGHT COLUMN ════ */}

        </div>
      </div>
    </section>
  )
}
