"use client"

import { useRef } from "react"
import { motion, useInView } from "motion/react"
import { Eye, Target, Compass, ArrowUpRight } from "lucide-react"
import { NumberTicker } from "@/components/ui/number-ticker"
import { Badge } from "@/components/ui/badge"

/* ── Types & Data ───────────────────────────────────────────── */

type AccentKey = "primary" | "cyan" | "gold"

const ACCENT: Record<AccentKey, {
  iconBg: string; iconBorder: string; iconColor: string; lineColor: string
}> = {
  primary: {
    iconBg:    "oklch(0.58 0.22 255 / 0.12)",
    iconBorder:"oklch(0.58 0.22 255 / 0.25)",
    iconColor: "var(--primary)",
    lineColor: "var(--primary)",
  },
  cyan: {
    iconBg:    "oklch(0.70 0.16 200 / 0.12)",
    iconBorder:"oklch(0.70 0.16 200 / 0.25)",
    iconColor: "var(--premium-cyan)",
    lineColor: "var(--premium-cyan)",
  },
  gold: {
    iconBg:    "oklch(0.78 0.15 83 / 0.12)",
    iconBorder:"oklch(0.78 0.15 83 / 0.25)",
    iconColor: "var(--premium-gold)",
    lineColor: "var(--premium-gold)",
  },
}

const PILLARS = [
  {
    icon:   Eye,
    title:  "Visibility Intelligence",
    body:   "We score your profile against thousands of host preferences, topic taxonomies, and audience data points — surfacing exactly where your message will have the most impact.",
    accent: "primary" as AccentKey,
  },
  {
    icon:   Target,
    title:  "Audience Alignment",
    body:   "Every recommendation is backed by real audience overlap analysis, ensuring your message reaches listeners already primed to care about what you have to say.",
    accent: "cyan" as AccentKey,
  },
  {
    icon:   Compass,
    title:  "Opportunity Discovery",
    body:   "Go beyond keywords. Our engine analyzes booking patterns, host activity signals, and niche demand to surface high-fit opportunities others miss entirely.",
    accent: "gold" as AccentKey,
  },
]

const CREDIBILITY = [
  { value: 50,  suffix: "K+", label: "Podcasts Indexed",              decimalPlaces: 0 },
  { value: 500, suffix: "K+", label: "Opportunities Discovered",      decimalPlaces: 0 },
  { value: 2.4, suffix: "M+", label: "AI Matches Generated",          decimalPlaces: 1 },
  { value: 48,  suffix: "+",  label: "Audience Categories Analyzed",  decimalPlaces: 0 },
]

/* ── Hook ───────────────────────────────────────────────────── */
function useFade() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.15 })
  return { ref, isInView }
}

/* ══════════════════════════════════════════════════════════════
   About Section
   ══════════════════════════════════════════════════════════════ */
export function AboutSection() {
  const header = useFade()

  return (
    <section
      className="relative overflow-hidden py-24"
      aria-label="About PodcastMatch AI — AI Visibility Intelligence Platform"
    >

      {/* ── BACKGROUND ─────────────────────────────────────── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, oklch(0.96 0 0 / 0.08), transparent)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[600px] w-[900px] -translate-x-1/2 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(ellipse at center, oklch(0.58 0.22 255 / 0.07), transparent 65%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 top-1/2 -z-10 h-[400px] w-[400px] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(ellipse at center, oklch(0.78 0.15 83 / 0.05), transparent 65%)",
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        {/* ══════════════════════════════════════════════════
            SECTION HEADER
            ══════════════════════════════════════════════════ */}
        <motion.div
          ref={header.ref}
          className="mx-auto mb-16 flex max-w-3xl flex-col items-center gap-5 text-center"
          initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
          animate={header.isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        >
          <Badge variant="ai">
            <span aria-hidden>✦</span> The Platform
          </Badge>

          <h2 className="text-h2 max-w-2xl">
            Not a Directory.{" "}
            <span className="gradient-text-primary">
              An Intelligence Platform.
            </span>
          </h2>

          <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
            Most creators struggle not because they lack expertise — but because the right
            hosts never find them. The podcast ecosystem is vast, fragmented, and nearly
            impossible to navigate manually. Opportunities slip by. Time is wasted.{" "}
            <span className="text-foreground font-medium">Reach stays small.</span>
          </p>

          <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
            PodcastMatch AI changes that. We built a proprietary intelligence layer that maps
            your expertise, authority signals, and audience to the podcasts where your voice
            will resonate most — giving creators{" "}
            <span className="text-foreground font-medium">
              precision targeting that previously only existed for major publishers
            </span>{" "}
            and large agencies.
          </p>
        </motion.div>

        {/* ══════════════════════════════════════════════════
            THREE VALUE PILLARS
            ══════════════════════════════════════════════════ */}
        <div className="mb-12 grid gap-5 md:grid-cols-3">
          {PILLARS.map((pillar, i) => (
            <PillarCard key={pillar.title} {...pillar} index={i} />
          ))}
        </div>

        {/* ══════════════════════════════════════════════════
            CREDIBILITY STRIP
            ══════════════════════════════════════════════════ */}
        <CredibilityStrip />

      </div>
    </section>
  )
}

/* ── Pillar Card ─────────────────────────────────────────────── */
function PillarCard({
  icon: Icon,
  title,
  body,
  accent,
  index,
}: (typeof PILLARS)[number] & { index: number }) {
  const { ref, isInView } = useFade()
  const styles = ACCENT[accent]

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28, filter: "blur(6px)" }}
      animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="group relative flex flex-col gap-5 rounded-[var(--radius-xl)]
                 border border-[var(--glass-border)] bg-[var(--glass-bg)]
                 p-7 backdrop-blur-lg transition-all duration-300
                 hover:-translate-y-1 hover:border-[var(--glass-border-hover)]
                 hover:bg-[var(--glass-bg-hover)]"
    >
      {/* Top-edge shimmer line on hover */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px rounded-t-[var(--radius-xl)]
                   opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `linear-gradient(90deg, transparent, ${styles.lineColor}, transparent)`,
        }}
      />

      {/* Icon container */}
      <div
        className="flex h-11 w-11 items-center justify-center rounded-[var(--radius-lg)]"
        style={{
          background: styles.iconBg,
          border:     `1px solid ${styles.iconBorder}`,
        }}
      >
        <Icon
          className="size-5"
          style={{ color: styles.iconColor }}
          aria-hidden
        />
      </div>

      {/* Text */}
      <div className="flex flex-col gap-2.5">
        <h3
          className="text-base font-semibold tracking-tight text-foreground"
          style={{ fontFamily: "var(--font-syne, var(--font-heading, system-ui))" }}
        >
          {title}
        </h3>
        <p className="text-sm leading-relaxed text-muted-foreground">{body}</p>
      </div>

      {/* Arrow — fades in on hover */}
      <div className="mt-auto">
        <ArrowUpRight
          className="size-4 opacity-0 transition-all duration-200 group-hover:opacity-60"
          style={{ color: styles.iconColor }}
          aria-hidden
        />
      </div>
    </motion.div>
  )
}

/* ── Credibility Strip ───────────────────────────────────────── */
function CredibilityStrip() {
  const { ref, isInView } = useFade()

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
      animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      className="relative overflow-hidden rounded-[var(--radius-2xl)]
                 border border-[var(--glass-border)] bg-[var(--glass-bg)]
                 px-8 py-10 backdrop-blur-xl"
    >
      {/* Top glow line */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, oklch(0.58 0.22 255 / 0.30), transparent)",
        }}
      />

      {/* Center ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 -z-0 h-[180px] w-[600px] -translate-x-1/2 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(ellipse at center, oklch(0.58 0.22 255 / 0.07), transparent 70%)",
        }}
      />

      <div
        className="relative grid grid-cols-2 gap-10 md:grid-cols-4"
        role="list"
        aria-label="Platform credibility statistics"
      >
        {CREDIBILITY.map(({ value, suffix, label, decimalPlaces }, i) => (
          <div
            key={label}
            role="listitem"
            className="flex flex-col items-center gap-2 text-center"
          >
            <p
              className="text-3xl font-bold tracking-tight gradient-text-primary tabular-nums"
              style={{ fontFamily: "var(--font-syne, system-ui)" }}
            >
              <NumberTicker
                value={value}
                suffix={suffix}
                delay={i * 120}
                decimalPlaces={decimalPlaces}
              />
            </p>
            <p className="max-w-[120px] text-xs font-medium leading-snug text-muted-foreground">
              {label}
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
