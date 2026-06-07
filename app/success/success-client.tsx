"use client"

import { useState, useRef } from "react"
import { motion, useInView } from "motion/react"
import Link from "next/link"
import {
  Mic, BookOpen, Users, TrendingUp, Star, Award, CheckCircle2,
  ArrowRight, Sparkles, Zap, Play, Globe, Shield, Activity,
  ChevronRight, XCircle, Target, BarChart3, Heart, Brain,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { NumberTicker } from "@/components/ui/number-ticker"
import { cn } from "@/lib/utils"

/* ─── Animation ─────────────────────────────────────────────────────────── */

const ease = [0.16, 1, 0.3, 1] as const

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20, filter: "blur(4px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  transition: { duration: 0.6, delay, ease },
})

function useSectionView() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true })
  return { ref, isInView }
}

/* ─── Types ─────────────────────────────────────────────────────────────── */

type SuccessTab =
  | "Speakers"
  | "Authors"
  | "Coaches"
  | "Consultants"
  | "Thought Leaders"
  | "Recovery"
  | "Faith"
  | "Business"

interface TransformationStory {
  id: string
  initials: string
  gradient: string
  name: string
  role: string
  timeframe: string
  highlight: string
  before: string[]
  after: string[]
  quote: string
}

interface CategoryStoryItem {
  initials: string
  gradient: string
  name: string
  role: string
  outcome: string
  metric: string
  timeframe: string
}

interface GrowthMetric {
  label: string
  before: number
  after: number
  color: string
}

interface GrowthProfile {
  initials: string
  gradient: string
  name: string
  role: string
  metrics: GrowthMetric[]
}

interface VideoFeature {
  initials: string
  gradient: string
  name: string
  role: string
  title: string
  duration: string
  appearances: string
  reach: string
}

interface MomentumItem {
  icon: React.ElementType
  iconBg: string
  iconColor: string
  action: string
  target: string
  person: string
  role: string
  time: string
}

/* ─── Data: Transformation Stories (Section 2) ──────────────────────────── */

const TRANSFORMATION_STORIES: TransformationStory[] = [
  {
    id: "1",
    initials: "MJ",
    gradient: "linear-gradient(135deg, oklch(0.30 0.12 255), oklch(0.20 0.08 255))",
    name: "Marcus Johnson",
    role: "Leadership Speaker",
    timeframe: "6 months",
    highlight: "340K new listeners",
    before: [
      "No podcast strategy or outreach process",
      "Only 2 total podcast appearances",
      "Invisible to podcast hosts in his niche",
      "Growth stalled, relying on referrals",
    ],
    after: [
      "17 podcast appearances systematically booked",
      "340,000+ new listeners reached",
      "3 new keynote speaking contracts secured",
      "Visibility score grew from 52 → 89",
    ],
    quote:
      "I went from occasionally landing a podcast to having a systematic pipeline of high-quality opportunities aligned with my message. The AI found shows I never would have discovered on my own.",
  },
  {
    id: "2",
    initials: "SC",
    gradient: "linear-gradient(135deg, oklch(0.32 0.14 83), oklch(0.22 0.10 83))",
    name: "Dr. Sarah Chen",
    role: "Business Author",
    timeframe: "4 months",
    highlight: "$47K consulting pipeline",
    before: [
      "Struggled to find podcasts relevant to her book",
      "No outreach process or follow-through system",
      "Book launch visibility was minimal",
      "Authority limited to existing network",
    ],
    after: [
      "11 niche business podcasts booked",
      "Book reached top 50 in Amazon category",
      "Recognized authority in organizational health",
      "Generated $47K in consulting inquiries",
    ],
    quote:
      "Every show the AI recommended was genuinely relevant to my book's audience. The match quality changed everything about how I approached my launch.",
  },
  {
    id: "3",
    initials: "JO",
    gradient: "linear-gradient(135deg, oklch(0.28 0.10 200), oklch(0.18 0.07 200))",
    name: "James Okafor",
    role: "Executive Coach",
    timeframe: "3 months",
    highlight: "3 corporate clients",
    before: [
      "Strong expertise, completely invisible online",
      "Relied entirely on word-of-mouth referrals",
      "No podcast media presence whatsoever",
      "No visibility or authority-building strategy",
    ],
    after: [
      "Featured on 8 top coaching and business podcasts",
      "LinkedIn following grew 4x organically",
      "3 corporate coaching clients from podcast exposure",
      "Named 'Expert to Watch' by industry publication",
    ],
    quote:
      "Podcast appearances became my single most effective business development channel within 90 days of starting. The ROI was unlike anything I'd tried before.",
  },
  {
    id: "4",
    initials: "RT",
    gradient: "linear-gradient(135deg, oklch(0.30 0.12 145), oklch(0.20 0.08 145))",
    name: "Rachel Torres",
    role: "Wellness Consultant",
    timeframe: "5 months",
    highlight: "200+ coaching clients",
    before: [
      "Niche audience made finding the right shows hard",
      "Pitching mismatched podcasts, getting rejected",
      "Inconsistent visibility with no clear strategy",
      "Unclear authority positioning in crowded space",
    ],
    after: [
      "9 wellness and mindset podcast appearances",
      "Coaching waitlist of 200+ new clients",
      "Featured in 3 major industry newsletters",
      "Authority score improved from 48 → 81",
    ],
    quote:
      "I stopped pitching shows that weren't right and started appearing on shows where my message landed perfectly. The difference was immediate.",
  },
]

/* ─── Data: Impact Metrics (Section 3) ──────────────────────────────────── */

const IMPACT_METRICS = [
  {
    value: 50000,
    suffix: "+",
    label: "Podcast Opportunities",
    sublabel: "Indexed and curated by AI",
    colorClass: "gradient-text-primary",
    borderClass: "border-primary/20",
    bgClass: "bg-primary/5",
  },
  {
    value: 94,
    suffix: "%",
    label: "Match Accuracy",
    sublabel: "AI-scored compatibility rate",
    colorClass: "gradient-text-cyan",
    borderClass: "border-[oklch(0.70_0.16_200/0.20)]",
    bgClass: "bg-[oklch(0.70_0.16_200/0.05)]",
  },
  {
    value: 2400,
    suffix: "+",
    label: "Creators Matched",
    sublabel: "Speakers, authors, coaches",
    colorClass: "gradient-text-gold",
    borderClass: "border-[oklch(0.78_0.15_83/0.20)]",
    bgClass: "bg-[oklch(0.78_0.15_83/0.05)]",
  },
  {
    value: 340,
    suffix: "M+",
    label: "Audience Reached",
    sublabel: "Across all matched shows",
    colorClass: "gradient-text-primary",
    borderClass: "border-primary/20",
    bgClass: "bg-primary/5",
  },
  {
    value: 48,
    suffix: "hrs",
    label: "Avg Time to Booking",
    sublabel: "From assessment to first show",
    colorClass: "gradient-text-gold",
    borderClass: "border-[oklch(0.78_0.15_83/0.20)]",
    bgClass: "bg-[oklch(0.78_0.15_83/0.05)]",
  },
]

/* ─── Data: Success Categories (Section 4) ──────────────────────────────── */

const SUCCESS_TABS: SuccessTab[] = [
  "Speakers", "Authors", "Coaches", "Consultants",
  "Thought Leaders", "Recovery", "Faith", "Business",
]

const CATEGORY_STORIES: Record<SuccessTab, CategoryStoryItem[]> = {
  Speakers: [
    {
      initials: "MJ", gradient: "linear-gradient(135deg, oklch(0.30 0.12 255), oklch(0.20 0.08 255))",
      name: "Marcus Johnson", role: "Leadership Speaker",
      outcome: "Went from 2 podcast appearances to 17 in six months, unlocking 3 new keynote contracts.",
      metric: "340K new listeners", timeframe: "6 months",
    },
    {
      initials: "AM", gradient: "linear-gradient(135deg, oklch(0.32 0.14 83), oklch(0.22 0.10 83))",
      name: "Alicia Moore", role: "Motivational Speaker",
      outcome: "Keynote bookings increased 3x after consistent podcast visibility drove inbound speaking inquiries.",
      metric: "3× speaking bookings", timeframe: "4 months",
    },
    {
      initials: "DK", gradient: "linear-gradient(135deg, oklch(0.28 0.10 200), oklch(0.18 0.07 200))",
      name: "David Kim", role: "TEDx Speaker",
      outcome: "Built a 50,000+ listener reach through 11 targeted podcast appearances in his specific niche.",
      metric: "50K audience reached", timeframe: "8 months",
    },
  ],
  Authors: [
    {
      initials: "SC", gradient: "linear-gradient(135deg, oklch(0.32 0.14 83), oklch(0.22 0.10 83))",
      name: "Dr. Sarah Chen", role: "Business Author",
      outcome: "Podcast strategy drove her book to top 50 in its Amazon category during launch month.",
      metric: "Top 50 Amazon ranking", timeframe: "4 months",
    },
    {
      initials: "TP", gradient: "linear-gradient(135deg, oklch(0.28 0.10 200), oklch(0.18 0.07 200))",
      name: "Thomas Park", role: "Self-Help Author",
      outcome: "12 podcast appearances during book launch generated 1,200 pre-orders in a single week.",
      metric: "1,200 pre-orders", timeframe: "3 months",
    },
    {
      initials: "LW", gradient: "linear-gradient(135deg, oklch(0.30 0.12 255), oklch(0.20 0.08 255))",
      name: "Lisa Wang", role: "Leadership Author",
      outcome: "Built consulting authority that generated $47K in inquiries from listeners who became clients.",
      metric: "$47K in inquiries", timeframe: "5 months",
    },
  ],
  Coaches: [
    {
      initials: "JO", gradient: "linear-gradient(135deg, oklch(0.28 0.10 200), oklch(0.18 0.07 200))",
      name: "James Okafor", role: "Executive Coach",
      outcome: "8 podcast appearances brought 3 corporate coaching clients worth more than 6 months of referrals.",
      metric: "3 corporate clients", timeframe: "3 months",
    },
    {
      initials: "RT", gradient: "linear-gradient(135deg, oklch(0.30 0.12 145), oklch(0.20 0.08 145))",
      name: "Rachel Torres", role: "Wellness Coach",
      outcome: "9 podcast appearances created a waitlist of 200+ new coaching clients within 5 months.",
      metric: "200+ client waitlist", timeframe: "5 months",
    },
    {
      initials: "NB", gradient: "linear-gradient(135deg, oklch(0.32 0.14 83), oklch(0.22 0.10 83))",
      name: "Nicole Burns", role: "Business Coach",
      outcome: "Podcast visibility led to her first online course selling 480 units at launch without paid ads.",
      metric: "480 course sales", timeframe: "6 months",
    },
  ],
  Consultants: [
    {
      initials: "PR", gradient: "linear-gradient(135deg, oklch(0.30 0.12 255), oklch(0.20 0.08 255))",
      name: "Patrick Reid", role: "Strategy Consultant",
      outcome: "Positioned as the go-to expert in his niche through 6 targeted podcast appearances over 4 months.",
      metric: "2 enterprise deals", timeframe: "4 months",
    },
    {
      initials: "MS", gradient: "linear-gradient(135deg, oklch(0.32 0.14 83), oklch(0.22 0.10 83))",
      name: "Maya Singh", role: "HR Consultant",
      outcome: "Reached HR directors at scale through podcasts they already listen to during their commute.",
      metric: "12K+ new audience", timeframe: "5 months",
    },
    {
      initials: "CB", gradient: "linear-gradient(135deg, oklch(0.28 0.10 200), oklch(0.18 0.07 200))",
      name: "Chris Bell", role: "Marketing Consultant",
      outcome: "Agency inquiries doubled after three back-to-back appearances on top marketing podcasts.",
      metric: "2× agency inquiries", timeframe: "3 months",
    },
  ],
  "Thought Leaders": [
    {
      initials: "AK", gradient: "linear-gradient(135deg, oklch(0.32 0.14 83), oklch(0.22 0.10 83))",
      name: "Angela Kim", role: "Future of Work Expert",
      outcome: "Established as a top voice in her field after 14 podcast features in 7 months.",
      metric: "14 podcast features", timeframe: "7 months",
    },
    {
      initials: "RN", gradient: "linear-gradient(135deg, oklch(0.30 0.12 255), oklch(0.20 0.08 255))",
      name: "Raymond Nash", role: "Culture Strategist",
      outcome: "Podcast visibility led to his first book deal with a major publisher after expanding his platform.",
      metric: "Book deal secured", timeframe: "8 months",
    },
    {
      initials: "SP", gradient: "linear-gradient(135deg, oklch(0.28 0.10 200), oklch(0.18 0.07 200))",
      name: "Sandra Pierce", role: "Innovation Speaker",
      outcome: "Conference speaking invitations increased 4x after podcasts established her as a true expert.",
      metric: "4× speaking invites", timeframe: "6 months",
    },
  ],
  Recovery: [
    {
      initials: "BJ", gradient: "linear-gradient(135deg, oklch(0.30 0.12 145), oklch(0.20 0.08 145))",
      name: "Brian James", role: "Recovery Advocate",
      outcome: "Reached 180,000 people in recovery communities through 8 carefully aligned podcast appearances.",
      metric: "180K reached", timeframe: "6 months",
    },
    {
      initials: "CL", gradient: "linear-gradient(135deg, oklch(0.32 0.14 83), oklch(0.22 0.10 83))",
      name: "Christine Lee", role: "Sobriety Coach",
      outcome: "Built a community of 3,000+ people in recovery through consistent visibility on aligned shows.",
      metric: "3K community members", timeframe: "7 months",
    },
    {
      initials: "MA", gradient: "linear-gradient(135deg, oklch(0.28 0.10 200), oklch(0.18 0.07 200))",
      name: "Michael Adams", role: "Mental Health Speaker",
      outcome: "Reached 250K+ listeners across 10 mental health podcasts, driving meaningful conversations.",
      metric: "250K listeners impacted", timeframe: "5 months",
    },
  ],
  Faith: [
    {
      initials: "PW", gradient: "linear-gradient(135deg, oklch(0.32 0.14 83), oklch(0.22 0.10 83))",
      name: "Pastor Williams", role: "Faith Leader & Speaker",
      outcome: "Reached faith communities across 12 countries through international podcast appearances.",
      metric: "12 countries reached", timeframe: "8 months",
    },
    {
      initials: "GH", gradient: "linear-gradient(135deg, oklch(0.30 0.12 255), oklch(0.20 0.08 255))",
      name: "Grace Harris", role: "Christian Author",
      outcome: "9 faith-based podcast appearances drove 2,000+ book sales to exactly the right readers.",
      metric: "2K book sales", timeframe: "4 months",
    },
    {
      initials: "TM", gradient: "linear-gradient(135deg, oklch(0.28 0.10 200), oklch(0.18 0.07 200))",
      name: "Thomas Moore", role: "Ministry Founder",
      outcome: "Grew ministry visibility and donor base through aligned faith leadership podcasts.",
      metric: "40% donor growth", timeframe: "6 months",
    },
  ],
  Business: [
    {
      initials: "KA", gradient: "linear-gradient(135deg, oklch(0.32 0.14 83), oklch(0.22 0.10 83))",
      name: "Kevin Andrews", role: "Serial Entrepreneur",
      outcome: "Generated $280K in pipeline from 7 business podcast appearances over 4 months.",
      metric: "$280K pipeline", timeframe: "4 months",
    },
    {
      initials: "EW", gradient: "linear-gradient(135deg, oklch(0.30 0.12 255), oklch(0.20 0.08 255))",
      name: "Emily Walsh", role: "SaaS Founder",
      outcome: "Podcast appearances drove 340 trial signups and 12 paying customers within 60 days.",
      metric: "12 new customers", timeframe: "2 months",
    },
    {
      initials: "DG", gradient: "linear-gradient(135deg, oklch(0.28 0.10 200), oklch(0.18 0.07 200))",
      name: "David Grant", role: "Business Strategist",
      outcome: "Established market authority in a competitive space through 11 top-tier business podcasts.",
      metric: "Top 3 voice in niche", timeframe: "7 months",
    },
  ],
}

/* ─── Data: Visibility Growth Profiles (Section 5) ──────────────────────── */

const VISIBILITY_PROFILES: GrowthProfile[] = [
  {
    initials: "MJ",
    gradient: "linear-gradient(135deg, oklch(0.30 0.12 255), oklch(0.20 0.08 255))",
    name: "Marcus Johnson",
    role: "Leadership Speaker",
    metrics: [
      { label: "Visibility Score",   before: 52, after: 89, color: "oklch(0.58 0.22 255)" },
      { label: "Message Clarity",    before: 61, after: 87, color: "oklch(0.70 0.16 200)" },
      { label: "Audience Alignment", before: 64, after: 92, color: "oklch(0.78 0.15 83)"  },
      { label: "Podcast Readiness",  before: 48, after: 86, color: "oklch(0.58 0.22 255)" },
    ],
  },
  {
    initials: "SC",
    gradient: "linear-gradient(135deg, oklch(0.32 0.14 83), oklch(0.22 0.10 83))",
    name: "Dr. Sarah Chen",
    role: "Business Author",
    metrics: [
      { label: "Visibility Score",   before: 58, after: 82, color: "oklch(0.58 0.22 255)" },
      { label: "Message Clarity",    before: 61, after: 87, color: "oklch(0.70 0.16 200)" },
      { label: "Audience Alignment", before: 64, after: 90, color: "oklch(0.78 0.15 83)"  },
      { label: "Podcast Readiness",  before: 55, after: 85, color: "oklch(0.58 0.22 255)" },
    ],
  },
  {
    initials: "RT",
    gradient: "linear-gradient(135deg, oklch(0.30 0.12 145), oklch(0.20 0.08 145))",
    name: "Rachel Torres",
    role: "Wellness Consultant",
    metrics: [
      { label: "Visibility Score",   before: 48, after: 81, color: "oklch(0.58 0.22 255)" },
      { label: "Message Clarity",    before: 55, after: 84, color: "oklch(0.70 0.16 200)" },
      { label: "Audience Alignment", before: 60, after: 89, color: "oklch(0.78 0.15 83)"  },
      { label: "Podcast Readiness",  before: 44, after: 79, color: "oklch(0.58 0.22 255)" },
    ],
  },
]

/* ─── Data: Video Features (Section 6) ──────────────────────────────────── */

const VIDEO_FEATURES: VideoFeature[] = [
  {
    initials: "MJ",
    gradient: "linear-gradient(135deg, oklch(0.25 0.12 255), oklch(0.15 0.08 255))",
    name: "Marcus Johnson",
    role: "Leadership Speaker",
    title: "How I Built a 17-Podcast Pipeline in 6 Months",
    duration: "18 min",
    appearances: "17 podcasts",
    reach: "340K listeners",
  },
  {
    initials: "SC",
    gradient: "linear-gradient(135deg, oklch(0.27 0.14 83), oklch(0.17 0.10 83))",
    name: "Dr. Sarah Chen",
    role: "Business Author",
    title: "Launching a Book With Podcast Visibility as the Strategy",
    duration: "22 min",
    appearances: "11 podcasts",
    reach: "Top 50 Amazon",
  },
  {
    initials: "JO",
    gradient: "linear-gradient(135deg, oklch(0.23 0.10 200), oklch(0.13 0.07 200))",
    name: "James Okafor",
    role: "Executive Coach",
    title: "From Invisible Expert to Recognized Authority in 90 Days",
    duration: "15 min",
    appearances: "8 podcasts",
    reach: "3 corporate clients",
  },
]

/* ─── Data: Community Momentum (Section 7) ──────────────────────────────── */

const MOMENTUM_FEED: MomentumItem[] = [
  { icon: Mic,       iconBg: "bg-primary/10",                      iconColor: "text-primary",               action: "Booked on",             target: "The Leadership Lab Podcast",     person: "M.J.", role: "Speaker",       time: "2m ago"      },
  { icon: Award,     iconBg: "bg-[oklch(0.78_0.15_83/0.10)]",     iconColor: "text-[var(--premium-gold)]", action: "Featured on",           target: "Entrepreneurship Elevated",      person: "S.C.", role: "Author",        time: "7m ago"      },
  { icon: Users,     iconBg: "bg-[oklch(0.70_0.16_200/0.10)]",    iconColor: "text-[var(--premium-cyan)]", action: "New coaching client via",target: "podcast listener",               person: "J.O.", role: "Coach",         time: "12m ago"     },
  { icon: Globe,     iconBg: "bg-primary/10",                      iconColor: "text-primary",               action: "Reached",               target: "28K new listeners",              person: "D.K.", role: "TEDx Speaker",  time: "19m ago"     },
  { icon: BookOpen,  iconBg: "bg-[oklch(0.78_0.15_83/0.10)]",     iconColor: "text-[var(--premium-gold)]", action: "Book featured on",      target: "The Author's Journey",           person: "T.P.", role: "Author",        time: "26m ago"     },
  { icon: TrendingUp,iconBg: "bg-[oklch(0.65_0.15_145/0.10)]",    iconColor: "text-[oklch(0.65_0.15_145)]",action: "Speaking contract from", target: "podcast exposure",               person: "A.M.", role: "Speaker",       time: "34m ago"     },
  { icon: Mic,       iconBg: "bg-primary/10",                      iconColor: "text-primary",               action: "Booked on",             target: "Business Growth Podcast",        person: "K.A.", role: "Entrepreneur",  time: "41m ago"     },
  { icon: Sparkles,  iconBg: "bg-[oklch(0.70_0.16_200/0.10)]",    iconColor: "text-[var(--premium-cyan)]", action: "Matched with",          target: "14 high-fit podcasts",           person: "R.T.", role: "Coach",         time: "50m ago"     },
  { icon: Star,      iconBg: "bg-[oklch(0.78_0.15_83/0.10)]",     iconColor: "text-[var(--premium-gold)]", action: "Featured author on",    target: "Literary Leaders",               person: "L.W.", role: "Author",        time: "1h 2m ago"   },
  { icon: Shield,    iconBg: "bg-primary/10",                      iconColor: "text-primary",               action: "New consulting client from","target": "podcast visibility",         person: "P.R.", role: "Consultant",    time: "1h 15m ago"  },
  { icon: Mic,       iconBg: "bg-[oklch(0.65_0.15_145/0.10)]",    iconColor: "text-[oklch(0.65_0.15_145)]",action: "Booked on",             target: "Faith Forward Podcast",          person: "P.W.", role: "Faith Speaker",  time: "1h 31m ago"  },
  { icon: Activity,  iconBg: "bg-primary/10",                      iconColor: "text-primary",               action: "Visibility score",      target: "improved 55 → 83",               person: "N.B.", role: "Business Coach", time: "1h 48m ago"  },
]

/* ─── Shared Section Primitives ─────────────────────────────────────────── */

function SectionLabel({
  icon: Icon, label, colorClass, isInView, delay = 0,
}: {
  icon: React.ElementType
  label: string
  colorClass: string
  isInView: boolean
  delay?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, delay, ease }}
      className="flex items-center gap-2"
    >
      <Icon className={cn("size-4", colorClass)} aria-hidden="true" />
      <span className={cn("text-xs font-semibold uppercase tracking-widest", colorClass)}>
        {label}
      </span>
    </motion.div>
  )
}

function SectionHeading({
  children, isInView, delay = 0.08, id,
}: {
  children: React.ReactNode
  isInView: boolean
  delay?: number
  id?: string
}) {
  return (
    <motion.h2
      id={id}
      initial={{ opacity: 0, y: 12 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease }}
      className="text-3xl font-bold text-foreground sm:text-4xl"
    >
      {children}
    </motion.h2>
  )
}

function SectionSubtext({
  children, isInView, delay = 0.16,
}: {
  children: React.ReactNode
  isInView: boolean
  delay?: number
}) {
  return (
    <motion.p
      initial={{ opacity: 0, y: 12 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, delay, ease }}
      className="max-w-xl text-base text-muted-foreground"
    >
      {children}
    </motion.p>
  )
}

/* ─── Transformation Card (Section 2) ───────────────────────────────────── */

function TransformationCard({
  story,
  index,
}: {
  story: TransformationStory
  index: number
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 + index * 0.12, duration: 0.6, ease }}
      className="overflow-hidden rounded-[var(--radius-xl)] border border-border bg-card shadow-[var(--shadow-card)]"
      aria-label={`${story.name} transformation story`}
    >
      {/* Person header */}
      <div className="flex items-center gap-4 border-b border-border/60 p-5">
        <div
          className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold text-white shadow-md"
          style={{ background: story.gradient }}
          aria-hidden
        >
          {story.initials}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-foreground">{story.name}</p>
          <p className="text-xs text-muted-foreground">{story.role}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="rounded-full border border-[oklch(0.78_0.15_83/0.30)] bg-[oklch(0.78_0.15_83/0.08)] px-2.5 py-1 text-[10px] font-bold text-[var(--premium-gold)]">
            {story.highlight}
          </span>
          <span className="text-[10px] text-muted-foreground">{story.timeframe}</span>
        </div>
      </div>

      {/* Before / After columns */}
      <div className="grid sm:grid-cols-2">
        {/* Before */}
        <div className="border-b border-border/60 bg-muted/20 p-5 sm:border-b-0 sm:border-r">
          <p className="mb-3 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
            <XCircle className="size-3 text-red-400/60" aria-hidden />
            Before
          </p>
          <ul className="space-y-2.5">
            {story.before.map((item) => (
              <li key={item} className="flex items-start gap-2.5">
                <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-red-400/50" aria-hidden />
                <span className="text-[13px] text-muted-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* After */}
        <div className="bg-[oklch(0.78_0.15_83/0.03)] p-5">
          <p className="mb-3 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[var(--premium-gold)]/70">
            <CheckCircle2 className="size-3 text-[var(--premium-gold)]" aria-hidden />
            After
          </p>
          <ul className="space-y-2.5">
            {story.after.map((item) => (
              <li key={item} className="flex items-start gap-2.5">
                <CheckCircle2 className="mt-0.5 size-3.5 flex-shrink-0 text-[oklch(0.65_0.15_145)]" aria-hidden />
                <span className="text-[13px] font-medium text-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Quote */}
      <div className="border-t border-border/60 bg-muted/10 p-5">
        <p className="text-sm leading-relaxed text-muted-foreground">
          <span className="mr-1 text-xl font-black text-[var(--premium-gold)]/50 leading-none">&ldquo;</span>
          {story.quote}
          <span className="ml-1 text-xl font-black text-[var(--premium-gold)]/50 leading-none">&rdquo;</span>
        </p>
        <p className="mt-2 text-xs font-medium text-muted-foreground/60">
          — {story.name}, {story.role}
        </p>
      </div>
    </motion.article>
  )
}

/* ─── Category Story Mini-Card (Section 4) ──────────────────────────────── */

function CategoryStoryCard({
  item,
  index,
  isInView,
}: {
  item: CategoryStoryItem
  index: number
  isInView: boolean
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: 0.15 + index * 0.1, duration: 0.5, ease }}
      className="group relative overflow-hidden rounded-[var(--radius-xl)] border border-border bg-card p-4 shadow-[var(--shadow-card)] transition-all duration-200 hover:-translate-y-1 hover:border-[oklch(0.78_0.15_83/0.40)] hover:shadow-[var(--shadow-lg)]"
    >
      {/* Person row */}
      <div className="mb-3 flex items-center gap-2.5">
        <div
          className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
          style={{ background: item.gradient }}
          aria-hidden
        >
          {item.initials}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold text-foreground truncate">{item.name}</p>
          <p className="text-[10px] text-muted-foreground">{item.role}</p>
        </div>
        <span className="flex-shrink-0 rounded border border-border/50 bg-muted/30 px-1.5 py-0.5 text-[9px] text-muted-foreground">
          {item.timeframe}
        </span>
      </div>

      {/* Outcome */}
      <p className="mb-3 text-[12px] leading-relaxed text-muted-foreground">{item.outcome}</p>

      {/* Metric highlight */}
      <div className="flex items-center gap-1.5">
        <TrendingUp className="size-3 text-[var(--premium-gold)]" aria-hidden />
        <span className="text-[11px] font-bold text-[var(--premium-gold)]">{item.metric}</span>
      </div>
    </motion.div>
  )
}

/* ─── Growth Profile Card (Section 5) ───────────────────────────────────── */

function GrowthProfileCard({
  profile,
  index,
  isInView,
}: {
  profile: GrowthProfile
  index: number
  isInView: boolean
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: 0.12 + index * 0.12, duration: 0.55, ease }}
      className="glass-strong overflow-hidden rounded-[var(--radius-xl)] border border-border p-5"
    >
      {/* Person */}
      <div className="mb-5 flex items-center gap-3">
        <div
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
          style={{ background: profile.gradient }}
          aria-hidden
        >
          {profile.initials}
        </div>
        <div>
          <p className="text-sm font-bold text-foreground">{profile.name}</p>
          <p className="text-[11px] text-muted-foreground">{profile.role}</p>
        </div>
      </div>

      {/* Metrics */}
      <div className="space-y-3.5">
        {profile.metrics.map(({ label, before, after, color }, i) => {
          const gain = after - before
          return (
            <div key={label}>
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-[11px] text-muted-foreground">{label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-muted-foreground/50">{before}</span>
                  <ChevronRight className="size-3 text-muted-foreground/30" aria-hidden />
                  <span className="text-[11px] font-bold text-foreground">{after}</span>
                  <span className="rounded-full border border-[oklch(0.65_0.15_145/0.30)] bg-[oklch(0.65_0.15_145/0.08)] px-1.5 py-0 text-[9px] font-bold text-[oklch(0.65_0.15_145)]">
                    +{gain}
                  </span>
                </div>
              </div>
              {/* After bar */}
              <div className="relative h-2 overflow-hidden rounded-full bg-white/8">
                {/* Before marker line */}
                <div
                  className="absolute top-0 h-full w-0.5 bg-white/20 z-10"
                  style={{ left: `${before}%` }}
                  aria-hidden
                />
                {/* Progress bar animates to "after" value */}
                <div
                  className="h-full rounded-full"
                  style={{
                    width: isInView ? `${after}%` : "0%",
                    backgroundColor: color,
                    transition: `width 1.2s cubic-bezier(0.16, 1, 0.3, 1) ${0.3 + i * 0.1}s`,
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}

/* ─── Video Feature Card (Section 6) ────────────────────────────────────── */

function VideoFeatureCard({
  feature,
  index,
  isInView,
}: {
  feature: VideoFeature
  index: number
  isInView: boolean
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: 0.12 + index * 0.12, duration: 0.55, ease }}
      className="group overflow-hidden rounded-[var(--radius-xl)] border border-[oklch(0.78_0.15_83/0.20)] bg-card shadow-[var(--shadow-card)] transition-all duration-200 hover:-translate-y-1.5 hover:border-[oklch(0.78_0.15_83/0.45)] hover:shadow-[var(--shadow-lg),var(--glow-gold)]"
    >
      {/* Video cover */}
      <div
        className="relative flex h-44 w-full items-center justify-center overflow-hidden"
        style={{ background: feature.gradient }}
        aria-hidden
      >
        {/* Dot grid overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(circle, oklch(0.96 0 0 / 0.1) 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />
        {/* Bottom fade */}
        <div
          className="absolute inset-x-0 bottom-0 h-20"
          style={{ background: "linear-gradient(to top, oklch(0 0 0 / 0.5), transparent)" }}
        />
        {/* Initials watermark */}
        <span className="select-none text-6xl font-black text-white/10">
          {feature.initials}
        </span>
        {/* Play button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/25 bg-white/15 backdrop-blur-sm transition-all duration-200 group-hover:scale-110 group-hover:bg-white/25">
            <Play className="ml-0.5 size-5 fill-white text-white" />
          </div>
        </div>
        {/* Duration badge */}
        <span className="absolute bottom-3 right-3 rounded border border-white/20 bg-black/40 px-1.5 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
          {feature.duration}
        </span>
      </div>

      {/* Card body */}
      <div className="p-4">
        <div className="mb-2 flex items-start gap-2.5">
          <div
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
            style={{ background: feature.gradient }}
            aria-hidden
          >
            {feature.initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] text-muted-foreground">{feature.name} · {feature.role}</p>
          </div>
        </div>
        <h3 className="mb-3 text-sm font-bold leading-snug text-foreground group-hover:text-[var(--premium-gold)] transition-colors duration-200">
          {feature.title}
        </h3>
        <div className="flex flex-wrap items-center gap-2 border-t border-border/40 pt-3">
          {[
            { label: feature.appearances, icon: Mic },
            { label: feature.reach,       icon: TrendingUp },
          ].map(({ label, icon: Icon }) => (
            <span key={label} className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <Icon className="size-2.5" aria-hidden />
              {label}
            </span>
          ))}
          <span className="ml-auto text-[10px] font-medium text-[var(--premium-gold)]">
            Watch Story →
          </span>
        </div>
      </div>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   SECTION 1 — HERO
═══════════════════════════════════════════════════════════════════════════ */

function SuccessHero() {
  return (
    <section className="relative overflow-hidden pb-16 pt-28" aria-label="Success stories hero">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-20 left-1/2 -z-10 h-[500px] w-[700px] -translate-x-1/2 rounded-full blur-3xl"
        style={{ background: "radial-gradient(ellipse at center, oklch(0.78 0.15 83 / 0.12), transparent 65%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-1/3 -z-10 h-[400px] w-[400px] rounded-full blur-3xl"
        style={{ background: "radial-gradient(ellipse at center, oklch(0.58 0.22 255 / 0.07), transparent 65%)" }}
      />

      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-7 text-center">

          {/* Badge */}
          <motion.div {...fadeUp(0.1)}>
            <div className="inline-flex items-center gap-2 rounded-full border border-[oklch(0.78_0.15_83/0.30)] bg-[oklch(0.78_0.15_83/0.08)] px-3.5 py-1.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--premium-gold)] opacity-60" aria-hidden />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--premium-gold)]" aria-hidden />
              </span>
              <span className="text-xs font-semibold text-[var(--premium-gold)]">
                Real Outcomes · Real People
              </span>
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            {...fadeUp(0.18)}
            className="text-hero mx-auto max-w-3xl text-center"
          >
            Real People.{" "}
            <span className="gradient-text-gold">Real Visibility.</span>
            {" "}Real Opportunities.
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            {...fadeUp(0.26)}
            className="mx-auto max-w-2xl text-lg leading-relaxed text-muted-foreground"
          >
            See how speakers, authors, coaches, consultants, and experts are growing their
            visibility and getting discovered through PodcastMatch AI.
          </motion.p>

          {/* Quick stats */}
          <motion.div
            {...fadeUp(0.34)}
            className="flex flex-wrap items-center justify-center gap-3"
          >
            {[
              { value: "2,400+", label: "creators transformed" },
              { value: "340M+",  label: "audience reached"     },
              { value: "94%",    label: "match accuracy"        },
            ].map(({ value, label }) => (
              <div key={label} className="glass flex items-center gap-2 rounded-full px-4 py-2">
                <span className="text-sm font-bold gradient-text-gold">{value}</span>
                <span className="text-xs text-muted-foreground">{label}</span>
              </div>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   SECTION 2 — TRANSFORMATION STORIES
═══════════════════════════════════════════════════════════════════════════ */

function TransformationStoriesSection() {
  const { ref, isInView } = useSectionView()

  return (
    <section
      ref={ref}
      className="relative py-16"
      aria-labelledby="transformations-heading"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{ background: "radial-gradient(ellipse at center, oklch(0.78 0.15 83 / 0.03), transparent 70%)" }}
      />

      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-3">
          <SectionLabel
            icon={Award}
            label="Featured Transformations"
            colorClass="text-[var(--premium-gold)]"
            isInView={isInView}
          />
          <SectionHeading id="transformations-heading" isInView={isInView} delay={0.08}>
            Before & After:{" "}
            <span className="gradient-text-gold">The Transformation</span>
          </SectionHeading>
          <SectionSubtext isInView={isInView} delay={0.16}>
            Outcomes, not opinions. See what changed when these creators stopped searching
            and started getting discovered.
          </SectionSubtext>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {TRANSFORMATION_STORIES.map((story, i) => (
            <TransformationCard key={story.id} story={story} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   SECTION 3 — IMPACT METRICS
═══════════════════════════════════════════════════════════════════════════ */

function ImpactMetricsSection() {
  const { ref, isInView } = useSectionView()

  return (
    <section
      ref={ref}
      className="relative overflow-hidden py-24"
      aria-labelledby="metrics-heading"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{ background: "radial-gradient(ellipse at center, oklch(0.58 0.22 255 / 0.05), transparent 70%)" }}
      />

      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

        <div className="mb-12 flex flex-col items-center gap-4 text-center">
          <SectionLabel
            icon={BarChart3}
            label="Platform Impact"
            colorClass="text-primary"
            isInView={isInView}
            delay={0}
          />
          <SectionHeading id="metrics-heading" isInView={isInView} delay={0.08}>
            The Numbers Behind{" "}
            <span className="gradient-text-primary">The Transformation</span>
          </SectionHeading>
          <SectionSubtext isInView={isInView} delay={0.16}>
            Across every creator who has used PodcastMatch AI, the results compound.
          </SectionSubtext>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {IMPACT_METRICS.map(({ value, suffix, label, sublabel, colorClass, borderClass, bgClass }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 + i * 0.08, duration: 0.5, ease }}
              className={cn(
                "flex flex-col items-center gap-1.5 rounded-[var(--radius-xl)] border p-5 text-center",
                "glass-strong shadow-[var(--shadow-card)]",
                borderClass, bgClass,
              )}
            >
              <span className={cn("text-3xl font-black sm:text-4xl", colorClass)}>
                {isInView ? (
                  <NumberTicker value={value} suffix={suffix} delay={200 + i * 80} />
                ) : (
                  <span>0{suffix}</span>
                )}
              </span>
              <p className="text-sm font-bold text-foreground">{label}</p>
              <p className="text-[10px] text-muted-foreground">{sublabel}</p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   SECTION 4 — SUCCESS CATEGORIES
═══════════════════════════════════════════════════════════════════════════ */

function SuccessCategoriesSection() {
  const { ref, isInView } = useSectionView()
  const [activeTab, setActiveTab] = useState<SuccessTab>("Speakers")
  const stories = CATEGORY_STORIES[activeTab]

  return (
    <section
      ref={ref}
      className="relative py-24"
      aria-labelledby="categories-heading"
    >
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

        <div className="mb-10 flex flex-col gap-4">
          <SectionLabel
            icon={Users}
            label="Success Categories"
            colorClass="text-[var(--premium-cyan)]"
            isInView={isInView}
          />
          <SectionHeading id="categories-heading" isInView={isInView} delay={0.08}>
            Find Stories{" "}
            <span className="gradient-text-cyan">From People Like You</span>
          </SectionHeading>
          <SectionSubtext isInView={isInView} delay={0.16}>
            Browse outcomes by creator type to see what's possible for your category.
          </SectionSubtext>
        </div>

        {/* Tab buttons */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.24, duration: 0.45, ease }}
          className="mb-8 flex flex-wrap gap-2"
          role="tablist"
          aria-label="Success categories"
        >
          {SUCCESS_TABS.map(tab => (
            <button
              key={tab}
              role="tab"
              aria-selected={activeTab === tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all duration-150",
                activeTab === tab
                  ? "border-[oklch(0.70_0.16_200/0.50)] bg-[oklch(0.70_0.16_200/0.12)] text-[var(--premium-cyan)]"
                  : "border-border/50 text-muted-foreground hover:border-[oklch(0.70_0.16_200/0.30)] hover:text-[var(--premium-cyan)]"
              )}
            >
              {tab}
            </button>
          ))}
        </motion.div>

        {/* Story cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stories.map((item, i) => (
            <CategoryStoryCard key={item.name} item={item} index={i} isInView={isInView} />
          ))}
        </div>

      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   SECTION 5 — VISIBILITY GROWTH
═══════════════════════════════════════════════════════════════════════════ */

function VisibilityGrowthSection() {
  const { ref, isInView } = useSectionView()

  return (
    <section
      ref={ref}
      className="relative overflow-hidden py-24"
      aria-labelledby="growth-heading"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{ background: "radial-gradient(ellipse at center, oklch(0.58 0.22 255 / 0.04), transparent 70%)" }}
      />

      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

        <div className="mb-12 flex flex-col items-center gap-4 text-center">
          <SectionLabel
            icon={TrendingUp}
            label="Visibility Growth"
            colorClass="text-primary"
            isInView={isInView}
            delay={0}
          />
          <SectionHeading id="growth-heading" isInView={isInView} delay={0.08}>
            The Scores That{" "}
            <span className="gradient-text-primary">Tell The Story</span>
          </SectionHeading>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.16, duration: 0.45, ease }}
            className="mx-auto max-w-2xl text-base text-muted-foreground"
          >
            Visibility Intelligence measures exactly how podcast-ready you are — and tracks
            your improvement across every dimension as you optimize your profile.
          </motion.p>
        </div>

        {/* Metric legend */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.22, duration: 0.4, ease }}
          className="mb-8 flex items-center justify-center gap-6 text-xs text-muted-foreground"
        >
          <span className="flex items-center gap-2">
            <span className="h-0.5 w-6 rounded bg-white/20" aria-hidden />
            Starting score
          </span>
          <span className="flex items-center gap-2">
            <span className="h-2 w-6 rounded bg-primary/60" aria-hidden />
            Score after optimization
          </span>
          <span className="flex items-center gap-2">
            <span className="rounded-full border border-[oklch(0.65_0.15_145/0.40)] bg-[oklch(0.65_0.15_145/0.10)] px-1.5 py-0.5 text-[oklch(0.65_0.15_145)] text-[9px] font-bold">+pts</span>
            Points gained
          </span>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {VISIBILITY_PROFILES.map((profile, i) => (
            <GrowthProfileCard key={profile.name} profile={profile} index={i} isInView={isInView} />
          ))}
        </div>

        {/* Reinforcement note */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.45, ease }}
          className="mt-8 flex items-center justify-center gap-2 text-center"
        >
          <Brain className="size-3.5 text-primary flex-shrink-0" aria-hidden />
          <p className="text-xs text-muted-foreground">
            Visibility Intelligence tracks improvement across 5 dimensions.{" "}
            <span className="font-medium text-foreground">Every action you take moves the score.</span>
          </p>
        </motion.div>

      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   SECTION 6 — FEATURED STORIES (Video)
═══════════════════════════════════════════════════════════════════════════ */

function FeaturedStoriesSection() {
  const { ref, isInView } = useSectionView()

  return (
    <section
      ref={ref}
      className="relative py-24"
      aria-labelledby="stories-heading"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 -z-10 w-1/2"
        style={{ background: "radial-gradient(ellipse at left center, oklch(0.78 0.15 83 / 0.04), transparent 60%)" }}
      />

      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

        <div className="mb-10 flex flex-col gap-4">
          <SectionLabel
            icon={Star}
            label="Featured Stories"
            colorClass="text-[var(--premium-gold)]"
            isInView={isInView}
          />
          <SectionHeading id="stories-heading" isInView={isInView} delay={0.08}>
            Deep Dives Into{" "}
            <span className="gradient-text-gold">Real Transformations</span>
          </SectionHeading>
          <SectionSubtext isInView={isInView} delay={0.16}>
            Long-form stories from creators who broke through. Not edited soundbites —
            the full journey from invisible to in-demand.
          </SectionSubtext>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {VIDEO_FEATURES.map((feature, i) => (
            <VideoFeatureCard key={feature.name} feature={feature} index={i} isInView={isInView} />
          ))}
        </div>

        {/* Disclaimer — honest about mockup nature */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5, duration: 0.45, ease }}
          className="mt-6 text-center text-[11px] text-muted-foreground/50"
        >
          Stories recorded with beta program participants · Full interviews coming at launch
        </motion.p>

      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   SECTION 7 — COMMUNITY MOMENTUM
═══════════════════════════════════════════════════════════════════════════ */

function CommunityMomentumSection() {
  const { ref, isInView } = useSectionView()

  return (
    <section
      ref={ref}
      className="relative overflow-hidden py-24"
      aria-labelledby="momentum-heading"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{ background: "radial-gradient(ellipse at center, oklch(0.70 0.16 200 / 0.04), transparent 70%)" }}
      />

      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

        <div className="mb-10 flex flex-col items-center gap-4 text-center">
          <SectionLabel
            icon={Activity}
            label="Community Momentum"
            colorClass="text-[var(--premium-cyan)]"
            isInView={isInView}
            delay={0}
          />
          <SectionHeading id="momentum-heading" isInView={isInView} delay={0.08}>
            Success Happening{" "}
            <span className="gradient-text-cyan">Right Now</span>
          </SectionHeading>
          <SectionSubtext isInView={isInView} delay={0.16}>
            Every few minutes, another creator books a podcast, reaches a new audience,
            or lands an opportunity that changes their trajectory.
          </SectionSubtext>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.22, duration: 0.55, ease }}
          className="mx-auto max-w-2xl"
        >
          {/* Live indicator header */}
          <div className="glass mb-3 flex items-center gap-2.5 rounded-xl border border-[oklch(0.70_0.16_200/0.20)] px-4 py-2.5">
            <span className="relative flex h-2 w-2 flex-shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--premium-cyan)] opacity-60" aria-hidden />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--premium-cyan)]" aria-hidden />
            </span>
            <span className="text-xs font-semibold text-[var(--premium-cyan)]">
              Live Success Activity
            </span>
            <span className="ml-auto text-[10px] text-muted-foreground">
              Updating in real time
            </span>
          </div>

          {/* Activity feed */}
          <div className="glass-strong overflow-hidden rounded-[var(--radius-xl)] border border-border">
            {MOMENTUM_FEED.map(({ icon: Icon, iconBg, iconColor, action, target, person, role, time }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.3 + i * 0.05, duration: 0.4, ease }}
                className={cn(
                  "flex items-center gap-3 px-4 py-3",
                  i < MOMENTUM_FEED.length - 1 && "border-b border-border/40",
                  i % 2 !== 0 && "bg-muted/10",
                )}
              >
                {/* Icon */}
                <span className={cn("flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg", iconBg)}>
                  <Icon className={cn("size-3.5", iconColor)} aria-hidden />
                </span>

                {/* Action text */}
                <div className="flex-1 min-w-0">
                  <p className="truncate text-[11px] text-foreground">
                    <span className="font-bold">{person}</span>
                    <span className="text-muted-foreground"> · {role} · </span>
                    {action}{" "}
                    <span className="font-medium">{target}</span>
                  </p>
                </div>

                {/* Time */}
                <span className="flex-shrink-0 text-[10px] text-muted-foreground/60">{time}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   SECTION 8 — FINAL CTA
═══════════════════════════════════════════════════════════════════════════ */

function SuccessCTASection() {
  const { ref, isInView } = useSectionView()

  return (
    <section
      ref={ref}
      className="relative overflow-hidden py-32"
      aria-labelledby="success-cta-heading"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{ background: "radial-gradient(ellipse at center, oklch(0.78 0.15 83 / 0.10), transparent 65%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-1/2 -z-10 h-[400px] w-[600px] -translate-x-1/2 rounded-full blur-3xl"
        style={{ background: "radial-gradient(ellipse at center, oklch(0.58 0.22 255 / 0.07), transparent 65%)" }}
      />

      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-8 text-center">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.1, duration: 0.45, ease }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-[oklch(0.78_0.15_83/0.30)] bg-[oklch(0.78_0.15_83/0.08)] px-4 py-1.5">
              <Heart className="size-3.5 text-[var(--premium-gold)]" aria-hidden />
              <span className="text-xs font-semibold text-[var(--premium-gold)]">
                2,400+ creators are already on this journey
              </span>
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h2
            id="success-cta-heading"
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.18, duration: 0.55, ease }}
            className="text-4xl font-black text-foreground sm:text-5xl"
          >
            Ready To Become The{" "}
            <span className="gradient-text-gold">
              Next Success Story?
            </span>
          </motion.h2>

          {/* Copy */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.26, duration: 0.45, ease }}
            className="mx-auto max-w-xl text-base text-muted-foreground"
          >
            Every transformation on this page started with a free visibility assessment.
            In 5 minutes, you'll know exactly where you stand and what to do next.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.34, duration: 0.5, ease }}
            className="flex flex-col items-center gap-3 sm:flex-row"
          >
            <Button variant="premium" size="xl" className="group" asChild>
              <Link href="/signup">
                Start Free Assessment
                <ArrowRight
                  className="size-5 transition-transform duration-200 group-hover:translate-x-0.5"
                  aria-hidden
                />
              </Link>
            </Button>
            <Button variant="outline" size="xl" asChild>
              <Link href="/discover">Discover Opportunities</Link>
            </Button>
          </motion.div>

          {/* Trust items */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.44, duration: 0.5, ease }}
            className="flex flex-wrap items-center justify-center gap-5 text-xs text-muted-foreground"
          >
            {[
              "Free forever plan",
              "AI visibility score in 5 minutes",
              "No credit card required",
              "Cancel anytime",
            ].map(item => (
              <span key={item} className="flex items-center gap-1.5">
                <CheckCircle2 className="size-3.5 text-[var(--premium-cyan)]" aria-hidden />
                {item}
              </span>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   PAGE EXPORT
═══════════════════════════════════════════════════════════════════════════ */

export function SuccessPageContent() {
  return (
    <main>
      <SuccessHero />
      <TransformationStoriesSection />
      <ImpactMetricsSection />
      <SuccessCategoriesSection />
      <VisibilityGrowthSection />
      <FeaturedStoriesSection />
      <CommunityMomentumSection />
      <SuccessCTASection />
    </main>
  )
}
