"use client"

import * as React from "react"
import { useRef } from "react"
import { motion, useInView } from "motion/react"
import {
  Briefcase,
  TrendingUp,
  Brain,
  Zap,
  Flame,
  BookOpen,
  Trophy,
  Star,
  Users,
  Sparkles,
  ArrowRight,
  Shield,
  ScanSearch,
  BarChart2,
  Eye,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  FeaturedPodcastCard,
  type FeaturedPodcastData,
} from "@/components/ui/featured-podcast-card"
import { Button } from "@/components/ui/button"

/* ── Featured podcast data ──────────────────────────────────── */
const FEATURED_PODCASTS: FeaturedPodcastData[] = [
  {
    id:            "fp1",
    name:          "The Tim Ferriss Show",
    category:      "Business & Lifestyle",
    description:   "World-class performers deconstructed",
    listenerCount: "7.1M",
    matchScore:    94,
    hostActivity:  "Books Quarterly",
    activityLevel: "medium",
    badge:         "Trending",
    coverStyle:    "blue-electric",
    coverIcon:     Briefcase,
    tags:          ["Business", "Performance"],
  },
  {
    id:            "fp2",
    name:          "How I Built This",
    category:      "Entrepreneurship",
    description:   "Entrepreneurs behind iconic companies",
    listenerCount: "4.8M",
    matchScore:    91,
    hostActivity:  "Books Monthly",
    activityLevel: "medium",
    badge:         "High Visibility",
    coverStyle:    "gold-amber",
    coverIcon:     TrendingUp,
    tags:          ["Startups", "Founders"],
  },
  {
    id:            "fp3",
    name:          "The School of Greatness",
    category:      "Personal Development",
    description:   "Lessons from the world's greatest minds",
    listenerCount: "3.5M",
    matchScore:    93,
    hostActivity:  "Books Weekly",
    activityLevel: "high",
    badge:         "High Engagement",
    coverStyle:    "purple-royal",
    coverIcon:     Brain,
    tags:          ["Mindset", "Success"],
  },
  {
    id:            "fp4",
    name:          "Smart Passive Income",
    category:      "Creator Economy",
    description:   "Build automated income streams online",
    listenerCount: "2.9M",
    matchScore:    89,
    hostActivity:  "Books Monthly",
    activityLevel: "high",
    badge:         "Fast Growing",
    coverStyle:    "green-forest",
    coverIcon:     Zap,
    tags:          ["Online Business", "Creators"],
  },
  {
    id:            "fp5",
    name:          "Impact Theory",
    category:      "Mindset & Business",
    description:   "Changing the way you see the world",
    listenerCount: "2.2M",
    matchScore:    92,
    hostActivity:  "Books Weekly",
    activityLevel: "high",
    badge:         "Trending",
    coverStyle:    "indigo-deep",
    coverIcon:     Flame,
    tags:          ["Mindset", "Philosophy"],
  },
  {
    id:            "fp6",
    name:          "The Knowledge Project",
    category:      "Strategy & Thinking",
    description:   "Master the best of what others have figured out",
    listenerCount: "1.9M",
    matchScore:    88,
    hostActivity:  "Books Monthly",
    activityLevel: "medium",
    badge:         "High Engagement",
    coverStyle:    "cyan-teal",
    coverIcon:     BookOpen,
    tags:          ["Strategy", "Mental Models"],
  },
  {
    id:            "fp7",
    name:          "Finding Mastery",
    category:      "Peak Performance",
    description:   "Conversations with world-class performers",
    listenerCount: "1.6M",
    matchScore:    90,
    hostActivity:  "Books Monthly",
    activityLevel: "high",
    badge:         "Fast Growing",
    coverStyle:    "orange-fire",
    coverIcon:     Trophy,
    tags:          ["Performance", "Psychology"],
  },
  {
    id:            "fp8",
    name:          "The Marie Forleo Podcast",
    category:      "Business & Life",
    description:   "Everything is figureoutable",
    listenerCount: "1.4M",
    matchScore:    87,
    hostActivity:  "Books Seasonally",
    activityLevel: "low",
    badge:         "High Visibility",
    coverStyle:    "rose-crimson",
    coverIcon:     Star,
    tags:          ["Business", "Inspiration"],
  },
]

/* ── Trust credibility pills ────────────────────────────────── */
const TRUST_ITEMS = [
  { icon: ScanSearch, label: "Smart Podcast Discovery" },
  { icon: Eye,        label: "AI Visibility Analysis" },
  { icon: Users,      label: "Audience Alignment Engine" },
  { icon: BarChart2,  label: "Creator Opportunity Scoring" },
]

/* ── Section insight panels ─────────────────────────────────── */
/* ── Fade-in helper ─────────────────────────────────────────── */
function useFadeInView() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })
  return { ref, isInView }
}

/* ══════════════════════════════════════════════════════════════
   FeaturedPodcastsSection
   ══════════════════════════════════════════════════════════════ */
export function FeaturedPodcastsSection() {
  return (
    <section
      className="relative overflow-hidden py-28"
      aria-labelledby="featured-podcasts-heading"
    >
      {/* ── BACKGROUND ───────────────────────────────────────── */}

      {/* Top connector from search experience section */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-48"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.09 0.028 252 / 0.60) 0%, transparent 100%)",
        }}
      />

      {/* Gold orb — top right */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-48 top-0 h-[700px] w-[700px] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(ellipse at center, oklch(0.78 0.15 83 / 0.06), transparent 65%)",
        }}
      />

      {/* Primary blue orb — center bottom */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 left-1/2 -translate-x-1/2 h-[600px] w-[900px] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(ellipse at center, oklch(0.58 0.22 255 / 0.06), transparent 65%)",
        }}
      />

      {/* ── CONTENT ──────────────────────────────────────────── */}
      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

        <SectionHeader />
        <TrustPills />
        <PodcastShowcase />
        <BottomCTA />

      </div>
    </section>
  )
}

/* ── Section Header ─────────────────────────────────────────── */
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
        <Sparkles className="size-3" aria-hidden="true" />
        Curated Opportunities
      </div>

      <h2
        id="featured-podcasts-heading"
        className="text-h2 mx-auto max-w-2xl"
      >
        Your Next Podcast Stage{" "}
        <span className="gradient-text-primary text-glow-primary">
          Is Already Live
        </span>
      </h2>

      <p className="mx-auto mt-5 max-w-lg text-base text-muted-foreground leading-relaxed">
        PodcastMatch AI continuously surfaces high-visibility podcast opportunities aligned
        with your niche, your message, and the audience you&apos;re built to reach. Every show
        below is accepting guest pitches right now.
      </p>
    </motion.div>
  )
}

/* ── Trust pills ────────────────────────────────────────────── */
function TrustPills() {
  const { ref, isInView } = useFadeInView()

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 12 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
      className="mt-8 mb-14 flex flex-wrap items-center justify-center gap-3"
    >
      {TRUST_ITEMS.map((item, i) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, scale: 0.92 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.15 + i * 0.06 }}
          className={cn(
            "flex items-center gap-1.5 rounded-full border border-border",
            "bg-muted/25 px-3.5 py-1.5 text-xs font-medium text-muted-foreground"
          )}
        >
          <item.icon className="size-3 text-primary flex-shrink-0" aria-hidden="true" />
          {item.label}
        </motion.div>
      ))}
    </motion.div>
  )
}

/* ── Podcast showcase ───────────────────────────────────────── */
function PodcastShowcase() {
  const { ref, isInView } = useFadeInView()

  return (
    <div ref={ref}>

      {/* Desktop/Tablet: responsive grid */}
      <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {FEATURED_PODCASTS.map((podcast, i) => (
          <motion.div
            key={podcast.id}
            initial={{ opacity: 0, y: 28 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{
              duration: 0.55,
              ease: [0.16, 1, 0.3, 1],
              delay: 0.08 + i * 0.06,
            }}
          >
            <FeaturedPodcastCard data={podcast} />
          </motion.div>
        ))}
      </div>

      {/* Mobile: horizontal snap carousel */}
      <div className="sm:hidden -mx-4 overflow-hidden">
        <div
          className="flex gap-4 overflow-x-auto px-4 pb-4 snap-x snap-mandatory"
          style={{ WebkitOverflowScrolling: "touch", scrollBehavior: "smooth" }}
        >
          {FEATURED_PODCASTS.map((podcast, i) => (
            <motion.div
              key={podcast.id}
              className="flex-shrink-0 w-[78vw] snap-start"
              initial={{ opacity: 0, x: 16 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{
                duration: 0.5,
                ease: [0.16, 1, 0.3, 1],
                delay: 0.06 + i * 0.04,
              }}
            >
              <FeaturedPodcastCard data={podcast} />
            </motion.div>
          ))}
        </div>
        <p className="mt-1 px-4 text-center text-[11px] text-muted-foreground/45">
          Swipe to explore more opportunities →
        </p>
      </div>

    </div>
  )
}

/* ── Bottom CTA ─────────────────────────────────────────────── */
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
      <p className="text-sm text-muted-foreground text-center">
        50,000+ verified podcast opportunities &nbsp;·&nbsp; AI-updated daily
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <Button variant="premium" size="lg" className="gap-2">
          View All Podcast Opportunities
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
