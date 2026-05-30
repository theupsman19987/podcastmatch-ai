"use client"

import { useRef } from "react"
import { motion, useInView } from "motion/react"
import {
  Radio,
  Sparkles,
  Target,
  Users,
  Mic2,
  Eye,
  Star,
  CheckCircle2,
  BrainCircuit,
  Activity,
  Database,
  PenLine,
  BarChart2,
  Zap,
  Trophy,
  Quote,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Marquee } from "@/components/ui/marquee"
import { Badge } from "@/components/ui/badge"
import { CardBadge } from "@/components/ui/card"

/* ── Types ──────────────────────────────────────────────────── */
type AccentKey = "primary" | "cyan" | "gold"

const ACCENT_STYLES: Record<AccentKey, {
  iconBg: string; iconColor: string; headlineClass: string
  hoverBorder: string; hoverGlow: string
}> = {
  primary: {
    iconBg:        "bg-primary/12",
    iconColor:     "text-primary",
    headlineClass: "gradient-text-primary",
    hoverBorder:   "hover:border-primary/35",
    hoverGlow:     "hover:shadow-[var(--shadow-card),var(--glow-primary)]",
  },
  cyan: {
    iconBg:        "bg-[oklch(0.70_0.16_200/0.12)]",
    iconColor:     "text-[var(--premium-cyan)]",
    headlineClass: "gradient-text-cyan",
    hoverBorder:   "hover:border-[oklch(0.70_0.16_200/0.35)]",
    hoverGlow:     "hover:shadow-[var(--shadow-card),var(--glow-cyan)]",
  },
  gold: {
    iconBg:        "bg-[oklch(0.78_0.15_83/0.12)]",
    iconColor:     "text-[var(--premium-gold)]",
    headlineClass: "gradient-text-gold",
    hoverBorder:   "hover:border-[oklch(0.78_0.15_83/0.35)]",
    hoverGlow:     "hover:shadow-[var(--shadow-card),var(--glow-gold)]",
  },
}

/* ── Data ───────────────────────────────────────────────────── */

const CAPABILITIES = [
  {
    id:          "podcasts",
    icon:         Radio,
    headline:    "50,000+",
    label:       "Podcasts Indexed",
    description: "Continuously analyzed podcast database spanning business, leadership, faith, recovery, personal development, health, and creator-focused shows.",
    accent:      "primary" as AccentKey,
  },
  {
    id:          "categories",
    icon:         BarChart2,
    headline:    "48",
    label:       "Audience Categories",
    description: "Deep audience segmentation to help creators identify where their message resonates most.",
    accent:      "cyan" as AccentKey,
  },
  {
    id:          "matching",
    icon:         BrainCircuit,
    headline:    "AI-Powered",
    label:       "Matching Engine",
    description: "Analyzes creator identity, audience alignment, expertise, and podcast fit to surface highly relevant opportunities.",
    accent:      "gold" as AccentKey,
  },
  {
    id:          "visibility",
    icon:         Eye,
    headline:    "Intelligent",
    label:       "Visibility System",
    description: "Tracks positioning, discoverability, and audience alignment to help creators increase podcast booking potential.",
    accent:      "primary" as AccentKey,
  },
]

const MARQUEE_ITEMS = [
  { icon: Star,         text: "Rated 4.9/5 by 2,400+ creators" },
  { icon: Zap,          text: '"Booked 7 shows in 30 days" — Sarah M.' },
  { icon: Trophy,       text: "#1 Podcast Discovery Platform" },
  { icon: Sparkles,     text: "98% AI match accuracy on every search" },
  { icon: Quote,        text: '"Found my niche audience in minutes" — Marcus L.' },
  { icon: Users,        text: "2.4M+ monthly audience reach unlocked" },
  { icon: CheckCircle2, text: "Verified contact data for every host" },
  { icon: Quote,        text: '"Booked within 48 hours of joining" — Jordan K.' },
  { icon: Mic2,         text: "12,000+ podcast hosts actively booking guests" },
  { icon: Star,         text: '"Best tool for speaker growth I\'ve used" — Alex P.' },
]

const TESTIMONIALS = [
  {
    quote:
      "Booked 7 podcast interviews in 30 days. The AI found shows with audiences that were literally built for my message — audiences I would have never discovered manually.",
    author:   "Sarah Mitchell",
    role:     "Executive Business Coach",
    stat:     "147 new followers",
    statSub:  "from first booking",
    delay:    0,
    featured: false,
  },
  {
    quote:
      "I pitched 40 podcasts manually over 6 months and heard nothing. PodcastMatch AI found a better-aligned show in 4 minutes and wrote the pitch. I was booked the next day.",
    author:   "Marcus Lee",
    role:     "Bestselling Author",
    stat:     "Best tool",
    statSub:  "I added this year",
    delay:    0.1,
    featured: true,
  },
  {
    quote:
      "The match score was 94%. The host was actively booking. I sent the AI-written pitch and was recording the episode within 48 hours. Zero wasted time.",
    author:   "Jordan Kim",
    role:     "Keynote Speaker & Founder",
    stat:     "22K audience",
    statSub:  "reached in one episode",
    delay:    0.2,
    featured: false,
  },
]

const TRUST_INDICATORS = [
  { icon: BrainCircuit, label: "AI-Powered Discovery" },
  { icon: Target,       label: "Smart Audience Matching" },
  { icon: Activity,     label: "Host Activity Signals" },
  { icon: Database,     label: "Verified Host Database" },
  { icon: PenLine,      label: "Auto Pitch Writer" },
  { icon: BarChart2,    label: "Booking Analytics" },
  { icon: Zap,          label: "Real-Time Availability" },
  { icon: CheckCircle2, label: "Quality-Scored Contacts" },
]

/* ── Fade-up animation helper ──────────────────────────────── */
function useFadeInView() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })
  return { ref, isInView }
}

/* ══════════════════════════════════════════════════════════════
   Main Section
   ══════════════════════════════════════════════════════════════ */
export function StatsSection() {
  return (
    <section
      className="relative overflow-hidden py-24"
      aria-label="PodcastMatch AI platform capabilities"
    >

      {/* ── BACKGROUND ─────────────────────────────────────── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-40 -z-10"
        style={{
          background:
            "linear-gradient(to bottom, oklch(0.08 0.025 255 / 0), var(--background) 100%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-1/4 -z-10 h-[500px] w-[500px] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(ellipse at center, oklch(0.70 0.16 200 / 0.07), transparent 65%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 bottom-1/4 -z-10 h-[400px] w-[400px] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(ellipse at center, oklch(0.78 0.15 83 / 0.06), transparent 65%)",
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        {/* ══════════════════════════════════════════════════
            SECTION HEADER
            ══════════════════════════════════════════════════ */}
        <SectionHeader />

        {/* ══════════════════════════════════════════════════
            CAPABILITIES GRID
            ══════════════════════════════════════════════════ */}
        <CapabilitiesGrid />

        {/* ══════════════════════════════════════════════════
            MARQUEE TRUST BANNER
            ══════════════════════════════════════════════════ */}
        <MarqueeBanner />

        {/* ══════════════════════════════════════════════════
            TESTIMONIALS
            ══════════════════════════════════════════════════ */}
        <TestimonialsGrid />

        {/* ══════════════════════════════════════════════════
            TRUST INDICATORS
            ══════════════════════════════════════════════════ */}
        <TrustIndicators />

      </div>
    </section>
  )
}

/* ── Section Header ──────────────────────────────────────────── */
function SectionHeader() {
  const { ref, isInView } = useFadeInView()

  return (
    <motion.div
      ref={ref}
      className="mb-16 flex flex-col items-center gap-4 text-center"
      initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
      animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
    >
      <Badge variant="ai">
        <span aria-hidden>✦</span> Platform Capabilities
      </Badge>

      <h2 className="text-h2 max-w-2xl">
        Precision Matching.{" "}
        <span className="gradient-text-primary">Not Just Search.</span>
      </h2>

      <p className="max-w-xl text-base text-muted-foreground leading-relaxed">
        PodcastMatch AI is built on a proprietary intelligence layer — not a keyword
        filter. Every match is generated by systems designed to understand creator
        identity, audience fit, and podcast context at depth.
      </p>
    </motion.div>
  )
}

/* ── Capabilities Grid ───────────────────────────────────────── */
function CapabilitiesGrid() {
  return (
    <div
      className="mb-20 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
      role="list"
      aria-label="Platform capabilities"
    >
      {CAPABILITIES.map((cap, i) => (
        <AnimatedItem key={cap.id} index={i} role="listitem">
          <CapabilityCard {...cap} index={i} />
        </AnimatedItem>
      ))}
    </div>
  )
}

/* ── Capability Card ─────────────────────────────────────────── */
function CapabilityCard({
  icon: Icon,
  headline,
  label,
  description,
  accent,
}: (typeof CAPABILITIES)[number] & { index: number }) {
  const styles = ACCENT_STYLES[accent]

  return (
    <div
      className={cn(
        "group relative flex h-full flex-col gap-3 rounded-[var(--radius-xl)] p-6",
        "border border-border bg-card",
        "shadow-[var(--shadow-card)]",
        "transition-all duration-200",
        "hover:-translate-y-0.5",
        styles.hoverBorder,
        styles.hoverGlow,
      )}
    >
      {/* Icon */}
      <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", styles.iconBg)}>
        <Icon className={cn("size-5", styles.iconColor)} aria-hidden />
      </div>

      {/* Headline */}
      <div className={cn("text-4xl font-bold leading-none tracking-tight", styles.headlineClass)}>
        {headline}
      </div>

      {/* Label + description */}
      <div className="flex flex-col gap-1">
        <p className="text-sm font-semibold text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground leading-snug">{description}</p>
      </div>

      {/* Top-edge highlight */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-t-[var(--radius-xl)]
                   bg-gradient-to-r from-transparent via-[oklch(0.96_0_0/0.10)] to-transparent"
      />
    </div>
  )
}

/* ── Marquee Banner ──────────────────────────────────────────── */
function MarqueeBanner() {
  const { ref, isInView } = useFadeInView()

  return (
    <motion.div
      ref={ref}
      className="mb-20"
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      aria-label="Social proof ticker"
    >
      <div className="mb-6 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <Marquee speed={45} pauseOnHover>
        <div className="flex items-center gap-10">
          {MARQUEE_ITEMS.map(({ icon: Icon, text }, i) => (
            <div
              key={i}
              className="flex flex-shrink-0 items-center gap-2.5 rounded-full
                         border border-[var(--glass-border)] bg-[var(--glass-bg)]
                         px-4 py-2"
            >
              <Icon className="size-3.5 flex-shrink-0 text-primary" aria-hidden="true" />
              <span className="whitespace-nowrap text-xs text-muted-foreground">{text}</span>
            </div>
          ))}
        </div>
      </Marquee>

      <div className="mt-6 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
    </motion.div>
  )
}

/* ── Testimonials Grid ───────────────────────────────────────── */
function TestimonialsGrid() {
  return (
    <div className="mb-16">
      <AnimatedItem index={0} className="mb-8 text-center">
        <p className="text-label">Creator Success Stories</p>
        <h3 className="text-h3 mt-2">
          Real Creators.{" "}
          <span className="gradient-text-primary">Real Bookings.</span>
        </h3>
      </AnimatedItem>

      <div className="grid gap-5 md:grid-cols-3" role="list" aria-label="Creator testimonials">
        {TESTIMONIALS.map((t, i) => (
          <TestimonialCard key={t.author} {...t} index={i} />
        ))}
      </div>
    </div>
  )
}

/* ── Single Testimonial Card ─────────────────────────────────── */
function TestimonialCard({
  quote,
  author,
  role,
  stat,
  statSub,
  featured,
  index,
}: (typeof TESTIMONIALS)[number] & { index: number }) {
  const { ref, isInView } = useFadeInView()

  const floatDelay = `${index * -2.2}s`

  return (
    <motion.div
      ref={ref}
      role="listitem"
      initial={{ opacity: 0, y: 28, filter: "blur(6px)" }}
      animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
      transition={{
        duration: 0.65,
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <div
        className={[
          "animate-float h-full",
          featured
            ? "rounded-[var(--radius-xl)] border border-primary/25 bg-card shadow-[var(--shadow-md),var(--glow-primary)]"
            : "rounded-[var(--radius-xl)] border border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-lg",
          "p-6 flex flex-col gap-4 transition-all duration-200",
          "hover:-translate-y-0.5",
          featured
            ? "hover:shadow-[var(--shadow-lg),var(--glow-primary-lg)]"
            : "hover:border-[var(--glass-border-hover)] hover:bg-[var(--glass-bg-hover)]",
        ].join(" ")}
        style={{ animationDelay: floatDelay }}
      >
        {featured && (
          <CardBadge color="blue" className="self-start">
            ✦ Most Cited
          </CardBadge>
        )}

        <div className="flex gap-0.5" aria-label="5 out of 5 stars">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className="size-3.5 fill-[var(--premium-gold)] text-[var(--premium-gold)]"
              aria-hidden="true"
            />
          ))}
        </div>

        <blockquote className="flex-1 text-sm leading-relaxed text-foreground/90">
          <Quote className="mb-2 size-4 text-primary/40" aria-hidden="true" />
          {quote}
        </blockquote>

        <div className="flex items-center gap-3 border-t border-[var(--glass-border)] pt-4">
          <div
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center
                       rounded-full gradient-primary"
            aria-hidden="true"
          >
            <span className="text-[10px] font-bold text-white">
              {author.split(" ").map((n) => n[0]).join("")}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-foreground leading-none">{author}</p>
            <p className="mt-0.5 text-xs text-muted-foreground truncate">{role}</p>
          </div>
          <div className="flex-shrink-0 text-right">
            <p className="text-xs font-bold gradient-text-primary">{stat}</p>
            <p className="text-[10px] text-muted-foreground">{statSub}</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

/* ── Trust Indicators ────────────────────────────────────────── */
function TrustIndicators() {
  const { ref, isInView } = useFadeInView()

  return (
    <motion.div
      ref={ref}
      className="flex flex-col items-center gap-5"
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <p className="text-label">What Makes Every Match Intelligent</p>

      <div
        className="flex flex-wrap justify-center gap-2.5"
        role="list"
        aria-label="Platform capabilities"
      >
        {TRUST_INDICATORS.map(({ icon: Icon, label }) => (
          <div
            key={label}
            role="listitem"
            className="glass flex items-center gap-2 rounded-full px-3.5 py-2
                       transition-colors duration-150
                       hover:bg-[var(--glass-bg-hover)] hover:border-[var(--glass-border-hover)]"
          >
            <Icon className="size-3.5 flex-shrink-0 text-primary" aria-hidden="true" />
            <span className="text-xs font-medium text-muted-foreground">{label}</span>
          </div>
        ))}
      </div>

      <p className="text-xs text-muted-foreground/60 text-center max-w-md leading-relaxed">
        PodcastMatch AI combines verified host data, audience alignment scoring,
        and real-time activity signals to make every podcast match meaningful.
      </p>
    </motion.div>
  )
}

/* ── AnimatedItem — scroll-triggered fade-up wrapper ─────────── */
function AnimatedItem({
  children,
  index = 0,
  className,
  role,
}: {
  children: React.ReactNode
  index?: number
  className?: string
  role?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-60px 0px" })

  return (
    <motion.div
      ref={ref}
      role={role}
      className={className}
      initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
      animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
      transition={{
        duration: 0.6,
        delay: index * 0.07,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  )
}
