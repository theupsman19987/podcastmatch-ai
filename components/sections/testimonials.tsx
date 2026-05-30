"use client"

import * as React from "react"
import { useRef } from "react"
import { motion, useInView } from "motion/react"
import {
  TrendingUp,
  Users,
  Activity,
  Star,
  Sparkles,
  ArrowRight,
  Shield,
  MessageSquareQuote,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  TestimonialCard,
  CompactTestimonialCard,
  type TestimonialData,
  type CompactTestimonialData,
} from "@/components/ui/testimonial-card"
import { AIInsightPanel } from "@/components/ui/ai-insight-panel"
import { Marquee } from "@/components/ui/marquee"
import { NumberTicker } from "@/components/ui/number-ticker"
import { Button } from "@/components/ui/button"

/* ── Featured testimonials ──────────────────────────────── */
const FEATURED_TESTIMONIALS: TestimonialData[] = [
  {
    id:             "t1",
    name:           "Sarah Chen",
    title:          "Executive Coach & Speaker",
    company:        "Chen Leadership Co.",
    avatarColor:    "blue",
    avatarInitials: "SC",
    quote:
      "PodcastMatch AI completely transformed how I grow my speaking business. Within 60 days I'd appeared on 14 shows in my exact niche — the AI found hosts who were actively looking for someone with my background. My coaching waitlist went from 2 weeks to 4 months.",
    stars:          5,
    result:         "14 bookings in 60 days",
    hasVideoPreview: true,
    variant:        "featured",
  },
  {
    id:             "t2",
    name:           "Marcus Williams",
    title:          "SaaS Founder",
    company:        "FlowMetrics",
    avatarColor:    "gold",
    avatarInitials: "MW",
    quote:
      "I used to spend hours cold-pitching with a 3% response rate. PodcastMatch AI's targeting is so precise that my first 5 pitches landed 4 interviews — shows with audiences that became actual paying customers.",
    stars:          5,
    result:         "4 of 5 pitches accepted",
    variant:        "default",
  },
  {
    id:             "t3",
    name:           "Jordan Rivera",
    title:          "Health & Wellness Author",
    company:        "Vitality Press",
    avatarColor:    "cyan",
    avatarInitials: "JR",
    quote:
      "The AI match score is genuinely accurate. Every show it surfaced at 90+ was a perfect fit — aligned audience, open host, right timing. I launched my book on 22 podcasts in one month.",
    stars:          5,
    result:         "22 shows for book launch",
    variant:        "default",
  },
]

/* ── Compact marquee testimonials ───────────────────────── */
const MARQUEE_ROW_A: CompactTestimonialData[] = [
  {
    id:             "m1",
    name:           "Priya Kapoor",
    title:          "Business Strategist",
    avatarColor:    "purple",
    avatarInitials: "PK",
    quote:          "Booked 8 podcasts in my first month. The AI picked shows I never would have found on my own.",
    stars:          5,
  },
  {
    id:             "m2",
    name:           "Derek Osei",
    title:          "Tech Entrepreneur",
    avatarColor:    "green",
    avatarInitials: "DO",
    quote:          "My LinkedIn following grew 3× after the podcast tour PodcastMatch AI put together for me.",
    stars:          5,
  },
  {
    id:             "m3",
    name:           "Melissa Grant",
    title:          "Marketing Consultant",
    avatarColor:    "rose",
    avatarInitials: "MG",
    quote:          "The pitch templates combined with the AI targeting are unbeatable. 60% acceptance rate.",
    stars:          5,
  },
  {
    id:             "m4",
    name:           "Tyler Brooks",
    title:          "Mindset Coach",
    avatarColor:    "blue",
    avatarInitials: "TB",
    quote:          "I was skeptical at first. Then I got 3 interview offers in my first week on the platform.",
    stars:          5,
  },
  {
    id:             "m5",
    name:           "Amara Diallo",
    title:          "Career Development Speaker",
    avatarColor:    "cyan",
    avatarInitials: "AD",
    quote:          "Finally, a platform that actually understands my niche. Every recommendation is spot-on.",
    stars:          5,
  },
]

const MARQUEE_ROW_B: CompactTestimonialData[] = [
  {
    id:             "m6",
    name:           "Nathan Cole",
    title:          "Startup Advisor",
    avatarColor:    "gold",
    avatarInitials: "NC",
    quote:          "Generated $40K in new consulting contracts from appearances PodcastMatch AI unlocked.",
    stars:          5,
  },
  {
    id:             "m7",
    name:           "Sophia Andersen",
    title:          "Brand Strategist",
    avatarColor:    "purple",
    avatarInitials: "SA",
    quote:          "The AI knows which hosts want guests before the host even posts about it. It's remarkable.",
    stars:          5,
  },
  {
    id:             "m8",
    name:           "James Okafor",
    title:          "Financial Coach",
    avatarColor:    "green",
    avatarInitials: "JO",
    quote:          "PodcastMatch AI is the growth lever I wish I'd had three years ago. ROI is off the charts.",
    stars:          5,
  },
  {
    id:             "m9",
    name:           "Lisa Tran",
    title:          "Wellness Entrepreneur",
    avatarColor:    "rose",
    avatarInitials: "LT",
    quote:          "Appeared on 11 top-tier health podcasts in 6 weeks. My email list grew by 2,800 subscribers.",
    stars:          5,
  },
]

/* ── Trust metrics ──────────────────────────────────────── */
const TRUST_METRICS = [
  { value: 15000, suffix: "+", label: "Guests Placed",      prefix: "" },
  { value: 98,    suffix: "%", label: "Satisfaction Rate",  prefix: "" },
  { value: 3.2,   suffix: "×", label: "Avg. Audience Reach", prefix: "", decimalPlaces: 1 },
  { value: 4.9,   suffix: "★", label: "Platform Rating",   prefix: "", decimalPlaces: 1 },
]

/* ── Success insight panels ─────────────────────────────── */
const SUCCESS_INSIGHTS = [
  {
    icon:       TrendingUp,
    title:      "Average Bookings Per Month",
    value:      "8.4 shows",
    color:      "gold"    as const,
    floatDelay: "0s",
  },
  {
    icon:       Users,
    title:      "New Audience Reached",
    value:      "~180K listeners",
    color:      "primary" as const,
    floatDelay: "-2.5s",
  },
  {
    icon:       Activity,
    title:      "Guest Conversion Rate",
    value:      "3.7× industry avg",
    color:      "cyan"    as const,
    floatDelay: "-4s",
  },
]

/* ── Fade-in helper ─────────────────────────────────────── */
function useFadeInView() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })
  return { ref, isInView }
}

/* ══════════════════════════════════════════════════════════
   TestimonialsSection
   ══════════════════════════════════════════════════════════ */
export function TestimonialsSection() {
  return (
    <section
      className="relative overflow-hidden py-28"
      aria-labelledby="testimonials-heading"
    >
      {/* ── BACKGROUND ─────────────────────────────────────── */}

      {/* Top connector */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-48"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.09 0.028 252 / 0.55) 0%, transparent 100%)",
        }}
      />

      {/* Gold orb — left (warm, trustworthy) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-64 top-1/4 h-[700px] w-[700px] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(ellipse at center, oklch(0.78 0.15 83 / 0.055), transparent 65%)",
        }}
      />

      {/* Blue orb — right */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-48 bottom-1/4 h-[600px] w-[600px] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(ellipse at center, oklch(0.58 0.22 255 / 0.05), transparent 65%)",
        }}
      />

      {/* ── CONTENT ──────────────────────────────────────────── */}
      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

        <SectionHeader />
        <TrustMetrics />
        <FeaturedGrid />
        <MarqueeRows />
        <SuccessPanels />
        <BottomCTA />

      </div>
    </section>
  )
}

/* ── Section Header ─────────────────────────────────────── */
function SectionHeader() {
  const { ref, isInView } = useFadeInView()

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="text-center"
    >
      {/* Badge */}
      <div
        className="mb-5 inline-flex items-center gap-1.5 rounded-full
                   border border-primary/25 bg-primary/8 px-3 py-1.5
                   text-xs font-semibold text-primary"
      >
        <MessageSquareQuote className="size-3" aria-hidden="true" />
        Real Results, Real People
      </div>

      <h2
        id="testimonials-heading"
        className="text-h2 mx-auto max-w-2xl"
      >
        Guests Who{" "}
        <span className="gradient-text-primary text-glow-primary">
          Transformed Their Reach
        </span>
      </h2>

      <p className="mx-auto mt-5 max-w-lg text-base text-muted-foreground leading-relaxed">
        Thousands of experts, coaches, founders, and authors have used PodcastMatch AI to
        land high-visibility interviews, grow their audiences, and convert listeners into clients.
      </p>
    </motion.div>
  )
}

/* ── Trust metrics row ──────────────────────────────────── */
function TrustMetrics() {
  const { ref, isInView } = useFadeInView()

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
      className="mt-12 mb-16 grid grid-cols-2 sm:grid-cols-4 gap-px overflow-hidden
                 rounded-[var(--radius-xl)] border border-border bg-border"
    >
      {TRUST_METRICS.map((metric, i) => (
        <motion.div
          key={metric.label}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.2 + i * 0.08 }}
          className="flex flex-col items-center justify-center gap-1 bg-card py-6 px-4"
        >
          <div className="text-2xl font-bold text-foreground tabular-nums">
            {metric.prefix}
            <NumberTicker
              value={metric.value}
              decimalPlaces={(metric as { decimalPlaces?: number }).decimalPlaces ?? 0}
              suffix={metric.suffix}
            />
          </div>
          <p className="text-xs text-muted-foreground text-center">{metric.label}</p>
        </motion.div>
      ))}
    </motion.div>
  )
}

/* ── Featured testimonials grid ─────────────────────────── */
function FeaturedGrid() {
  const { ref, isInView } = useFadeInView()

  return (
    <div
      ref={ref}
      className="grid grid-cols-1 lg:grid-cols-3 gap-5"
    >
      {FEATURED_TESTIMONIALS.map((testimonial, i) => (
        <motion.div
          key={testimonial.id}
          initial={{ opacity: 0, y: 28 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{
            duration: 0.6,
            ease: [0.16, 1, 0.3, 1],
            delay: 0.1 + i * 0.1,
          }}
          className={cn(
            testimonial.variant === "featured" && "lg:col-span-2"
          )}
        >
          <TestimonialCard data={testimonial} className="h-full" />
        </motion.div>
      ))}
    </div>
  )
}

/* ── Dual marquee ───────────────────────────────────────── */
function MarqueeRows() {
  const { ref, isInView } = useFadeInView()

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
      className="mt-14 flex flex-col gap-3"
      aria-label="More customer testimonials"
    >
      {/* Row A — scrolls left */}
      <Marquee speed={50} pauseOnHover>
        {MARQUEE_ROW_A.map(t => (
          <CompactTestimonialCard key={t.id} data={t} className="mx-2" />
        ))}
      </Marquee>

      {/* Row B — scrolls right */}
      <Marquee speed={65} pauseOnHover direction="right">
        {MARQUEE_ROW_B.map(t => (
          <CompactTestimonialCard key={t.id} data={t} className="mx-2" />
        ))}
      </Marquee>
    </motion.div>
  )
}

/* ── Success insight panels ─────────────────────────────── */
function SuccessPanels() {
  const { ref, isInView } = useFadeInView()

  return (
    <div
      ref={ref}
      className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4"
    >
      {SUCCESS_INSIGHTS.map((insight, i) => (
        <motion.div
          key={insight.title}
          initial={{ opacity: 0, y: 18 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{
            duration: 0.5,
            ease: [0.16, 1, 0.3, 1],
            delay: 0.1 + i * 0.1,
          }}
        >
          <AIInsightPanel
            icon={insight.icon}
            title={insight.title}
            value={insight.value}
            color={insight.color}
            floatDelay={insight.floatDelay}
          />
        </motion.div>
      ))}
    </div>
  )
}

/* ── Bottom CTA ─────────────────────────────────────────── */
function BottomCTA() {
  const { ref, isInView } = useFadeInView()

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
      className="mt-14 flex flex-col items-center gap-4"
    >
      {/* Social proof line */}
      <div className="flex items-center gap-2">
        {/* Avatar stack */}
        <div className="flex -space-x-2" aria-hidden="true">
          {(["blue", "gold", "cyan", "purple", "green"] as const).map((color, i) => (
            <div
              key={color}
              className="h-7 w-7 rounded-full border-2 border-background text-[10px]
                         font-bold text-white flex items-center justify-center"
              style={{
                background: {
                  blue:   "linear-gradient(135deg, oklch(0.42 0.22 255), oklch(0.28 0.18 255))",
                  gold:   "linear-gradient(135deg, oklch(0.52 0.16 75),  oklch(0.36 0.12 68))",
                  cyan:   "linear-gradient(135deg, oklch(0.42 0.16 200), oklch(0.28 0.12 195))",
                  purple: "linear-gradient(135deg, oklch(0.42 0.20 280), oklch(0.28 0.16 270))",
                  green:  "linear-gradient(135deg, oklch(0.42 0.16 145), oklch(0.28 0.12 140))",
                }[color],
                zIndex: 5 - i,
              }}
            />
          ))}
        </div>
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className="size-3 fill-[var(--premium-gold)] text-[var(--premium-gold)]"
                aria-hidden="true"
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">
            Trusted by <span className="font-semibold text-foreground">15,000+</span> creators
          </span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <Button variant="premium" size="lg" className="gap-2">
          <Sparkles className="size-4" aria-hidden="true" />
          Start Your Success Story
          <ArrowRight className="size-4" aria-hidden="true" />
        </Button>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Shield className="size-3 text-primary" aria-hidden="true" />
          No credit card required
        </div>
      </div>
    </motion.div>
  )
}
