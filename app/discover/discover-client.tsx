"use client"

import { useState, useRef } from "react"
import { motion, useInView } from "motion/react"
import Link from "next/link"
import {
  Sparkles, Mic, TrendingUp, Bookmark, BookmarkCheck,
  ArrowRight, Users, Zap, Eye, Search, Heart,
  BookOpen, Award, ChevronRight, CheckCircle2,
  Activity, Flame, Lock, BarChart3, Globe, Brain,
} from "lucide-react"
import { AiScoreBadge } from "@/components/ui/ai-score-badge"
import { Button } from "@/components/ui/button"
import { NumberTicker } from "@/components/ui/number-ticker"
import { cn } from "@/lib/utils"

/* ─────────────────────────────────────────────────────────────
   ANIMATION
───────────────────────────────────────────────────────────── */

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

/* ─────────────────────────────────────────────────────────────
   TYPES
───────────────────────────────────────────────────────────── */

type VisibilityImpact = "Very High" | "High" | "Rising"
type BadgeType =
  | "AI Recommended"
  | "Trending"
  | "High Engagement"
  | "Fast Growing"
  | "High Visibility"
type TrendingTab =
  | "Leadership"
  | "Entrepreneurship"
  | "Personal Development"
  | "Faith"
  | "Recovery"
  | "Coaching"
  | "Keynote Speaker"
  | "Public Speaker"
  | "Author"

interface RecommendedPodcast {
  id: string
  name: string
  host: string
  category: string
  matchScore: number
  audienceAlignment: number
  authorityRating: number
  visibilityImpact: VisibilityImpact
  listenerCount: string
  badge: BadgeType
  coverGradient: string
  tags: string[]
}

interface OpportunityCategory {
  icon: React.ElementType
  label: string
  count: number
  description: string
  colorClass: string
  bgClass: string
  borderClass: string
}

interface TrendingShow {
  name: string
  host: string
  growth: string
  listeners: string
  matchScore: number
  tag: string
}

interface PremiumShow {
  name: string
  host: string
  listenerCount: string
  matchScore: number
  category: string
  coverGradient: string
  authorityScore: number
  tags: string[]
}

interface HiddenGem {
  name: string
  host: string
  listenerCount: string
  matchScore: number
  category: string
  coverGradient: string
  engagementRate: string
  insight: string
}

/* ─────────────────────────────────────────────────────────────
   MOCK DATA
───────────────────────────────────────────────────────────── */

const RECOMMENDED: RecommendedPodcast[] = [
  {
    id: "1",
    name: "The Tim Ferriss Show",
    host: "Tim Ferriss",
    category: "Business & Lifestyle",
    matchScore: 94,
    audienceAlignment: 91,
    authorityRating: 9.6,
    visibilityImpact: "Very High",
    listenerCount: "5.2M",
    badge: "High Engagement",
    coverGradient: "linear-gradient(135deg, oklch(0.42 0.22 255), oklch(0.24 0.18 255))",
    tags: ["Business", "Lifestyle", "Productivity"],
  },
  {
    id: "2",
    name: "Masters of Scale",
    host: "Reid Hoffman",
    category: "Entrepreneurship",
    matchScore: 92,
    audienceAlignment: 89,
    authorityRating: 9.3,
    visibilityImpact: "Very High",
    listenerCount: "1.2M",
    badge: "Trending",
    coverGradient: "linear-gradient(135deg, oklch(0.42 0.16 200), oklch(0.27 0.12 195))",
    tags: ["Entrepreneurship", "Leadership", "Scaling"],
  },
  {
    id: "3",
    name: "Dare to Lead",
    host: "Brené Brown",
    category: "Leadership",
    matchScore: 93,
    audienceAlignment: 94,
    authorityRating: 9.5,
    visibilityImpact: "Very High",
    listenerCount: "1.1M",
    badge: "AI Recommended",
    coverGradient: "linear-gradient(135deg, oklch(0.52 0.16 75), oklch(0.34 0.12 68))",
    tags: ["Leadership", "Courage", "Culture"],
  },
  {
    id: "4",
    name: "Impact Theory",
    host: "Tom Bilyeu",
    category: "Personal Development",
    matchScore: 89,
    audienceAlignment: 86,
    authorityRating: 8.9,
    visibilityImpact: "High",
    listenerCount: "850K",
    badge: "Fast Growing",
    coverGradient: "linear-gradient(135deg, oklch(0.42 0.20 280), oklch(0.27 0.16 270))",
    tags: ["Mindset", "Success", "Self-Improvement"],
  },
  {
    id: "5",
    name: "The School of Greatness",
    host: "Lewis Howes",
    category: "Success & Motivation",
    matchScore: 87,
    audienceAlignment: 83,
    authorityRating: 8.7,
    visibilityImpact: "High",
    listenerCount: "780K",
    badge: "High Visibility",
    coverGradient: "linear-gradient(135deg, oklch(0.38 0.20 265), oklch(0.24 0.16 260))",
    tags: ["Motivation", "Greatness", "Athletes"],
  },
  {
    id: "6",
    name: "How I Built This",
    host: "Guy Raz · NPR",
    category: "Entrepreneurship",
    matchScore: 88,
    audienceAlignment: 85,
    authorityRating: 9.1,
    visibilityImpact: "High",
    listenerCount: "890K",
    badge: "High Engagement",
    coverGradient: "linear-gradient(135deg, oklch(0.42 0.16 145), oklch(0.27 0.12 140))",
    tags: ["Startups", "Founders", "Business Stories"],
  },
]

const OPPORTUNITY_CATEGORIES: OpportunityCategory[] = [
  {
    icon: Award,
    label: "Leadership Podcasts Seeking Guests",
    count: 47,
    description: "Shows actively booking leadership experts right now",
    colorClass: "text-primary",
    bgClass: "bg-primary/10",
    borderClass: "border-primary/20 hover:border-primary/40 hover:shadow-[var(--glow-primary)]",
  },
  {
    icon: BarChart3,
    label: "Business Shows Accepting Applications",
    count: 83,
    description: "Business podcasts with verified open guest slots",
    colorClass: "text-[var(--premium-cyan)]",
    bgClass: "bg-[oklch(0.70_0.16_200/0.10)]",
    borderClass: "border-[oklch(0.70_0.16_200/0.20)] hover:border-[oklch(0.70_0.16_200/0.40)] hover:shadow-[var(--glow-cyan)]",
  },
  {
    icon: TrendingUp,
    label: "Fast Growing Shows",
    count: 124,
    description: "Growing 20%+ month over month — early mover advantage",
    colorClass: "text-[oklch(0.70_0.16_145)]",
    bgClass: "bg-[oklch(0.55_0.16_145/0.10)]",
    borderClass: "border-[oklch(0.55_0.16_145/0.20)] hover:border-[oklch(0.55_0.16_145/0.40)]",
  },
  {
    icon: BookOpen,
    label: "Author Interview Opportunities",
    count: 31,
    description: "Podcasts that spotlight authors and their ideas",
    colorClass: "text-[var(--premium-gold)]",
    bgClass: "bg-[oklch(0.78_0.15_83/0.10)]",
    borderClass: "border-[oklch(0.78_0.15_83/0.20)] hover:border-[oklch(0.78_0.15_83/0.40)] hover:shadow-[var(--glow-gold)]",
  },
  {
    icon: Mic,
    label: "Speaker Spotlight Opportunities",
    count: 56,
    description: "Stages built specifically for professional speakers",
    colorClass: "text-[oklch(0.72_0.18_280)]",
    bgClass: "bg-[oklch(0.42_0.20_280/0.10)]",
    borderClass: "border-[oklch(0.42_0.20_280/0.20)] hover:border-[oklch(0.42_0.20_280/0.40)]",
  },
  {
    icon: Heart,
    label: "Faith & Purpose Podcasts",
    count: 38,
    description: "Faith-based communities with deeply engaged audiences",
    colorClass: "text-[oklch(0.72_0.18_20)]",
    bgClass: "bg-[oklch(0.48_0.20_18/0.10)]",
    borderClass: "border-[oklch(0.48_0.20_18/0.20)] hover:border-[oklch(0.48_0.20_18/0.40)]",
  },
]

const TRENDING_TABS: TrendingTab[] = [
  "Leadership",
  "Entrepreneurship",
  "Personal Development",
  "Faith",
  "Recovery",
  "Coaching",
  "Keynote Speaker",
  "Public Speaker",
  "Author",
]

const TRENDING_BY_TAB: Record<TrendingTab, TrendingShow[]> = {
  Leadership: [
    { name: "Dare to Lead", host: "Brené Brown", growth: "+18%", listeners: "1.1M", matchScore: 93, tag: "Leadership" },
    { name: "The Diary of a CEO", host: "Steven Bartlett", growth: "+31%", listeners: "2.8M", matchScore: 89, tag: "Leadership" },
    { name: "Lead to Win", host: "Michael Hyatt", growth: "+12%", listeners: "420K", matchScore: 91, tag: "Leadership" },
    { name: "EntreLeadership", host: "Ramsey Solutions", growth: "+9%", listeners: "380K", matchScore: 86, tag: "Business" },
  ],
  Entrepreneurship: [
    { name: "How I Built This", host: "Guy Raz · NPR", growth: "+14%", listeners: "890K", matchScore: 88, tag: "Startups" },
    { name: "Masters of Scale", host: "Reid Hoffman", growth: "+22%", listeners: "1.2M", matchScore: 92, tag: "Scale" },
    { name: "My First Million", host: "Sam & Shaan", growth: "+41%", listeners: "560K", matchScore: 84, tag: "Business" },
    { name: "Founder's Journal", host: "Alex Lieberman", growth: "+27%", listeners: "210K", matchScore: 82, tag: "Founders" },
  ],
  "Personal Development": [
    { name: "Impact Theory", host: "Tom Bilyeu", growth: "+19%", listeners: "850K", matchScore: 89, tag: "Mindset" },
    { name: "The School of Greatness", host: "Lewis Howes", growth: "+11%", listeners: "780K", matchScore: 87, tag: "Success" },
    { name: "On Purpose", host: "Jay Shetty", growth: "+25%", listeners: "1.4M", matchScore: 85, tag: "Purpose" },
    { name: "Feel Better Live More", host: "Dr. Rangan Chatterjee", growth: "+16%", listeners: "640K", matchScore: 83, tag: "Wellness" },
  ],
  "Keynote Speaker": [
    { name: "The Speaker Lab", host: "Grant Baldwin", growth: "+28%", listeners: "310K", matchScore: 94, tag: "Speaking" },
    { name: "Speakernomics", host: "Grant Baldwin", growth: "+19%", listeners: "88K", matchScore: 91, tag: "Business" },
    { name: "Backstage Pass", host: "Mike Ganino", growth: "+22%", listeners: "64K", matchScore: 89, tag: "Speaking" },
    { name: "The Wealthy Speaker", host: "Jane Atkinson", growth: "+14%", listeners: "52K", matchScore: 92, tag: "Career" },
  ],
  "Public Speaker": [
    { name: "Talk Like TED", host: "Carmine Gallo", growth: "+17%", listeners: "210K", matchScore: 90, tag: "Speaking" },
    { name: "Speak Up with Laura Camacho", host: "Laura Camacho", growth: "+31%", listeners: "74K", matchScore: 93, tag: "Communication" },
    { name: "The Public Speaker", host: "Lisa B. Marshall", growth: "+11%", listeners: "180K", matchScore: 87, tag: "Speaking" },
    { name: "Communication Coach", host: "Alex Lyon", growth: "+24%", listeners: "96K", matchScore: 88, tag: "Skills" },
  ],
  "Author": [
    { name: "The Creative Penn", host: "Joanna Penn", growth: "+16%", listeners: "220K", matchScore: 95, tag: "Writing" },
    { name: "The Author Stack", host: "Tim Grahl", growth: "+22%", listeners: "58K", matchScore: 92, tag: "Authors" },
    { name: "Your First Book", host: "Rob Kosberg", growth: "+18%", listeners: "42K", matchScore: 90, tag: "Publishing" },
    { name: "The Bestseller Experiment", host: "Mark Stay & Mark Desvaux", growth: "+13%", listeners: "78K", matchScore: 88, tag: "Authors" },
  ],
  Faith: [
    { name: "Joel Osteen Podcast", host: "Joel Osteen", growth: "+8%", listeners: "2.1M", matchScore: 82, tag: "Faith" },
    { name: "The Bible Project", host: "Tim Mackie", growth: "+14%", listeners: "890K", matchScore: 88, tag: "Biblical" },
    { name: "Elevation with Steven Furtick", host: "Steven Furtick", growth: "+19%", listeners: "1.3M", matchScore: 84, tag: "Christian" },
    { name: "Craig Groeschel Leadership", host: "Craig Groeschel", growth: "+11%", listeners: "430K", matchScore: 91, tag: "Faith-Led" },
  ],
  Recovery: [
    { name: "Sober Reality", host: "Anna David", growth: "+34%", listeners: "180K", matchScore: 90, tag: "Recovery" },
    { name: "The Recovered Life", host: "Dr. Paul Hokemeyer", growth: "+28%", listeners: "95K", matchScore: 88, tag: "Healing" },
    { name: "Recovery Revolution", host: "Multiple Hosts", growth: "+21%", listeners: "140K", matchScore: 86, tag: "Sobriety" },
    { name: "Addiction Unlimited", host: "Angela Pugh", growth: "+15%", listeners: "210K", matchScore: 92, tag: "Wellness" },
  ],
  Coaching: [
    { name: "The Tony Robbins Podcast", host: "Tony Robbins", growth: "+6%", listeners: "1.8M", matchScore: 86, tag: "Coaching" },
    { name: "Coaching for Leaders", host: "Dave Stachowiak", growth: "+13%", listeners: "320K", matchScore: 91, tag: "Leadership" },
    { name: "Better Every Day", host: "Multiple Hosts", growth: "+22%", listeners: "170K", matchScore: 87, tag: "Growth" },
    { name: "ICF Coach Talk", host: "ICF", growth: "+18%", listeners: "140K", matchScore: 89, tag: "Professional" },
  ],
}

const SEARCH_SUGGESTIONS = [
  "Entrepreneurs who want to scale their business",
  "Faith-based audiences looking for purpose",
  "Recovery community and wellness seekers",
  "Leadership professionals in Fortune 500 companies",
  "Authors building a readership and platform",
  "Coaches growing their private practice",
]

const PREMIUM_SHOWS: PremiumShow[] = [
  {
    name: "The Tim Ferriss Show",
    host: "Tim Ferriss",
    listenerCount: "5.2M",
    matchScore: 94,
    category: "Business & Lifestyle",
    coverGradient: "linear-gradient(135deg, oklch(0.42 0.22 255), oklch(0.24 0.18 255))",
    authorityScore: 9.8,
    tags: ["Business", "Productivity", "Lifestyle"],
  },
  {
    name: "Hidden Brain",
    host: "Shankar Vedantam · NPR",
    listenerCount: "4.1M",
    matchScore: 91,
    category: "Psychology & Science",
    coverGradient: "linear-gradient(135deg, oklch(0.52 0.16 75), oklch(0.34 0.12 68))",
    authorityScore: 9.6,
    tags: ["Psychology", "Behavior", "Science"],
  },
  {
    name: "WorkLife with Adam Grant",
    host: "Adam Grant · TED",
    listenerCount: "2.3M",
    matchScore: 90,
    category: "Work & Psychology",
    coverGradient: "linear-gradient(135deg, oklch(0.42 0.16 200), oklch(0.27 0.12 195))",
    authorityScore: 9.4,
    tags: ["Work", "Psychology", "TED"],
  },
]

const HIDDEN_GEMS: HiddenGem[] = [
  {
    name: "Authentic Leaders Edge",
    host: "Colleen Slaughter",
    listenerCount: "22K",
    matchScore: 96,
    category: "Leadership",
    coverGradient: "linear-gradient(135deg, oklch(0.42 0.22 255), oklch(0.24 0.18 255))",
    engagementRate: "94%",
    insight: "Tiny audience, massive engagement — 1-in-4 listeners take direct action after each episode",
  },
  {
    name: "Faith Driven Entrepreneur",
    host: "Henry Kaestner",
    listenerCount: "48K",
    matchScore: 93,
    category: "Faith & Business",
    coverGradient: "linear-gradient(135deg, oklch(0.52 0.16 75), oklch(0.34 0.12 68))",
    engagementRate: "89%",
    insight: "Highly loyal community. Guest appearances drive measurable referrals and buyer intent",
  },
  {
    name: "Recovery Elevator",
    host: "Paul Churchill",
    listenerCount: "35K",
    matchScore: 95,
    category: "Recovery & Sobriety",
    coverGradient: "linear-gradient(135deg, oklch(0.42 0.16 200), oklch(0.27 0.12 195))",
    engagementRate: "91%",
    insight: "Underserved niche. Zero guest competition. Active booking schedule with open calendar",
  },
  {
    name: "The Thought Leader Revolution",
    host: "Nicky Billou",
    listenerCount: "18K",
    matchScore: 92,
    category: "Coaching & Consulting",
    coverGradient: "linear-gradient(135deg, oklch(0.42 0.20 280), oklch(0.27 0.16 270))",
    engagementRate: "87%",
    insight: "Niche audience of coaches and consultants. High conversion to paid engagements for guests",
  },
]

/* ─────────────────────────────────────────────────────────────
   BADGE STYLE MAPS
───────────────────────────────────────────────────────────── */

const BADGE_STYLES: Record<BadgeType, string> = {
  "AI Recommended":  "bg-primary/15 text-primary border-primary/25",
  "Trending":        "bg-[oklch(0.78_0.15_83/0.15)] text-[var(--premium-gold)] border-[oklch(0.78_0.15_83/0.25)]",
  "High Engagement": "bg-[oklch(0.70_0.16_200/0.15)] text-[var(--premium-cyan)] border-[oklch(0.70_0.16_200/0.25)]",
  "Fast Growing":    "bg-[oklch(0.55_0.16_145/0.12)] text-[oklch(0.70_0.16_145)] border-[oklch(0.55_0.16_145/0.22)]",
  "High Visibility": "bg-[oklch(0.42_0.20_280/0.12)] text-[oklch(0.72_0.18_280)] border-[oklch(0.42_0.20_280/0.22)]",
}

const BADGE_ICONS: Record<BadgeType, React.ElementType> = {
  "AI Recommended":  Sparkles,
  "Trending":        Flame,
  "High Engagement": Activity,
  "Fast Growing":    TrendingUp,
  "High Visibility": Eye,
}

const VIS_STYLES: Record<VisibilityImpact, string> = {
  "Very High": "bg-[oklch(0.78_0.15_83/0.12)] text-[var(--premium-gold)] border-[oklch(0.78_0.15_83/0.25)]",
  "High":      "bg-primary/10 text-primary border-primary/25",
  "Rising":    "bg-[oklch(0.70_0.16_200/0.10)] text-[var(--premium-cyan)] border-[oklch(0.70_0.16_200/0.25)]",
}

/* ─────────────────────────────────────────────────────────────
   SHARED SECTION LABEL
───────────────────────────────────────────────────────────── */

function SectionLabel({
  icon: Icon,
  label,
  colorClass,
  isInView,
  delay = 0,
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
      <span className={cn("text-xs font-semibold uppercase tracking-widest", colorClass)}>{label}</span>
    </motion.div>
  )
}

function SectionHeading({
  children,
  isInView,
  delay = 0.08,
  id,
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
  children,
  isInView,
  delay = 0.16,
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

/* ─────────────────────────────────────────────────────────────
   RECOMMENDATION CARD  (Section 1)
───────────────────────────────────────────────────────────── */

function RecommendationCard({ pod, index }: { pod: RecommendedPodcast; index: number }) {
  const [saved, setSaved] = useState(false)
  const BadgeIcon = BADGE_ICONS[pod.badge]

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 + index * 0.07, duration: 0.5, ease }}
      className={cn(
        "group relative flex flex-col overflow-hidden",
        "rounded-[var(--radius-xl)] border border-border bg-card",
        "shadow-[var(--shadow-card)] transition-all duration-200",
        "hover:-translate-y-1.5 hover:border-primary/30",
        "hover:shadow-[var(--shadow-lg),var(--glow-subtle)]",
      )}
    >
      {/* Cover */}
      <div
        className="relative h-40 w-full flex-shrink-0 overflow-hidden"
        style={{ background: pod.coverGradient }}
        aria-hidden="true"
      >
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage:
              "radial-gradient(circle, oklch(0.96 0 0 / 0.07) 1px, transparent 1px)",
            backgroundSize: "18px 18px",
          }}
        />
        <span className="absolute inset-0 flex items-center justify-center text-4xl font-black text-white/20 select-none tracking-tight">
          {pod.name.split(" ").map(w => w[0]).join("").slice(0, 2)}
        </span>
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(180deg, transparent 50%, oklch(0 0 0 / 0.50) 100%)" }}
        />
        {/* Match score */}
        <div className="absolute bottom-3 left-3">
          <AiScoreBadge score={pod.matchScore} size="sm" />
        </div>
        {/* Badge */}
        <div className="absolute right-3 top-3">
          <span className={cn(
            "flex items-center gap-1 rounded-full border px-2 py-0.5",
            "text-[10px] font-semibold backdrop-blur-sm",
            BADGE_STYLES[pod.badge],
          )}>
            <BadgeIcon className="size-2.5" aria-hidden="true" />
            {pod.badge}
          </span>
        </div>
        {/* Category */}
        <span className="absolute bottom-3 right-3 rounded-md bg-black/40 px-2 py-0.5 text-[10px] font-medium text-white/85 backdrop-blur-sm">
          {pod.category}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-3.5 p-4">
        {/* Name + host */}
        <div>
          <h3 className="text-[15px] font-bold leading-snug text-foreground transition-colors duration-200 group-hover:text-primary">
            {pod.name}
          </h3>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Users className="size-3 flex-shrink-0" aria-hidden="true" />
            <span>Hosted by {pod.host} · {pod.listenerCount} listeners</span>
          </div>
        </div>

        {/* Metrics */}
        <div className="space-y-2.5">
          {/* Audience Alignment */}
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-[10px] font-medium text-muted-foreground/70">Audience Alignment</span>
              <span className="text-[10px] font-bold text-foreground">{pod.audienceAlignment}%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted/60">
              <motion.div
                className="h-full rounded-full gradient-primary"
                initial={{ width: 0 }}
                animate={{ width: `${pod.audienceAlignment}%` }}
                transition={{ delay: 0.3 + index * 0.05, duration: 0.7, ease }}
              />
            </div>
          </div>
          {/* Authority Rating */}
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-medium text-muted-foreground/70">Authority Rating</span>
            <span className="text-[10px] font-bold gradient-text-gold">{pod.authorityRating}/10</span>
          </div>
          {/* Visibility Impact */}
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-medium text-muted-foreground/70">Visibility Impact</span>
            <span className={cn(
              "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold",
              VIS_STYLES[pod.visibilityImpact],
            )}>
              <Eye className="size-2.5" aria-hidden="true" />
              {pod.visibilityImpact}
            </span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {pod.tags.slice(0, 2).map(tag => (
            <span
              key={tag}
              className="rounded-md border border-border/50 bg-muted/25 px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* CTAs */}
        <div className="mt-auto flex items-center gap-2 border-t border-border/30 pt-3">
          <Link
            href="/signup"
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-primary/12 px-3 py-2
                       text-[12px] font-semibold text-primary transition-all duration-150
                       hover:bg-primary hover:text-white"
          >
            View Match
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </Link>
          <button
            onClick={() => setSaved(s => !s)}
            aria-label={saved ? "Remove from saved" : "Save opportunity"}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-150",
              saved
                ? "bg-primary/15 text-primary"
                : "bg-muted/30 text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            {saved
              ? <BookmarkCheck className="size-4" aria-hidden="true" />
              : <Bookmark className="size-4" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Top-edge highlight */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
      />
    </motion.article>
  )
}

/* ─────────────────────────────────────────────────────────────
   OPPORTUNITY CATEGORY CARD  (Section 2)
───────────────────────────────────────────────────────────── */

function OpportunityCategoryCard({
  cat,
  index,
  isInView,
}: {
  cat: OpportunityCategory
  index: number
  isInView: boolean
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: 0.1 + index * 0.06, duration: 0.45, ease }}
      className={cn(
        "group relative flex flex-col gap-4 rounded-[var(--radius-xl)] p-5",
        "border bg-card shadow-[var(--shadow-card)]",
        "transition-all duration-200 hover:-translate-y-1 cursor-pointer",
        cat.borderClass,
      )}
    >
      {/* Icon */}
      <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", cat.bgClass)}>
        <cat.icon className={cn("size-5", cat.colorClass)} aria-hidden="true" />
      </div>

      {/* Count */}
      <div>
        <div className={cn("text-2xl font-black tabular-nums", cat.colorClass)}>
          <NumberTicker value={cat.count} />
        </div>
        <div className="mt-0.5 text-[11px] text-muted-foreground/60">opportunities</div>
      </div>

      {/* Text */}
      <div className="flex flex-col gap-1">
        <h3 className="text-[13px] font-bold leading-snug text-foreground">{cat.label}</h3>
        <p className="text-[11px] leading-relaxed text-muted-foreground">{cat.description}</p>
      </div>

      {/* CTA */}
      <div className={cn("flex items-center gap-1 text-[11px] font-semibold transition-colors duration-150", cat.colorClass)}>
        Explore
        <ChevronRight
          className="size-3.5 transition-transform duration-150 group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      </div>
    </motion.div>
  )
}

/* ─────────────────────────────────────────────────────────────
   TRENDING ROW  (Section 3)
───────────────────────────────────────────────────────────── */

function TrendingPodcastRow({ show, index }: { show: TrendingShow; index: number }) {
  return (
    <motion.div
      key={show.name}
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05, duration: 0.35, ease }}
      className="group flex items-center gap-4 rounded-[var(--radius-lg)] p-3 transition-colors duration-150 hover:bg-muted/30 cursor-pointer"
    >
      <span className="w-5 text-center text-sm font-black tabular-nums text-muted-foreground/30">
        {index + 1}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-[13px] font-bold text-foreground transition-colors duration-150 group-hover:text-primary">
            {show.name}
          </p>
          <span className="flex-shrink-0 rounded-md border border-border/40 bg-muted/20 px-1.5 py-0.5 text-[9px] font-medium text-muted-foreground/70">
            {show.tag}
          </span>
        </div>
        <p className="mt-0.5 text-[10px] text-muted-foreground">{show.host} · {show.listeners} listeners</p>
      </div>
      <div className="flex flex-shrink-0 items-center gap-2">
        <span className="flex items-center gap-0.5 text-[11px] font-bold text-[oklch(0.65_0.15_145)]">
          <TrendingUp className="size-3" aria-hidden="true" />
          {show.growth}
        </span>
        <AiScoreBadge score={show.matchScore} size="sm" />
      </div>
    </motion.div>
  )
}

/* ─────────────────────────────────────────────────────────────
   PREMIUM SHOW CARD  (Section 5)
───────────────────────────────────────────────────────────── */

function PremiumShowCard({
  show,
  index,
  isInView,
}: {
  show: PremiumShow
  index: number
  isInView: boolean
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: 0.2 + index * 0.1, duration: 0.55, ease }}
      className="group relative flex flex-col overflow-hidden rounded-[var(--radius-xl)] border border-[oklch(0.78_0.15_83/0.20)] bg-card shadow-[var(--shadow-card)] transition-all duration-200 hover:-translate-y-1.5 hover:border-[oklch(0.78_0.15_83/0.45)] hover:shadow-[var(--shadow-lg),var(--glow-gold)]"
    >
      {/* Cover */}
      <div
        className="relative h-36 w-full overflow-hidden"
        style={{ background: show.coverGradient }}
        aria-hidden="true"
      >
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: "radial-gradient(circle, oklch(0.96 0 0 / 0.07) 1px, transparent 1px)",
            backgroundSize: "18px 18px",
          }}
        />
        <span className="absolute inset-0 flex items-center justify-center text-4xl font-black text-white/20 select-none">
          {show.name.split(" ").map(w => w[0]).join("").slice(0, 2)}
        </span>
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(180deg, transparent 50%, oklch(0 0 0 / 0.50) 100%)" }}
        />
        <div className="absolute right-3 top-3">
          <span className="flex items-center gap-1 rounded-full border border-[oklch(0.78_0.15_83/0.35)] bg-[oklch(0.78_0.15_83/0.20)] px-2.5 py-1 text-[10px] font-bold text-[var(--premium-gold)] backdrop-blur-sm">
            <Award className="size-2.5" aria-hidden="true" />
            Premium
          </span>
        </div>
        <div className="absolute bottom-3 left-3">
          <AiScoreBadge score={show.matchScore} size="sm" />
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <h3 className="text-[15px] font-bold leading-snug text-foreground transition-colors duration-200 group-hover:text-[var(--premium-gold)]">
            {show.name}
          </h3>
          <p className="mt-0.5 text-xs text-muted-foreground">{show.host}</p>
        </div>
        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users className="size-3" aria-hidden="true" />
            {show.listenerCount} listeners
          </div>
          <span className="font-bold gradient-text-gold">{show.authorityScore}/10 Authority</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {show.tags.slice(0, 2).map(tag => (
            <span
              key={tag}
              className="rounded-md border border-[oklch(0.78_0.15_83/0.20)] bg-[oklch(0.78_0.15_83/0.08)] px-2 py-0.5 text-[10px] font-medium text-[var(--premium-gold)]"
            >
              {tag}
            </span>
          ))}
        </div>
        <Link
          href="/signup"
          className="mt-auto flex w-full items-center justify-center gap-1.5 rounded-lg border border-[oklch(0.78_0.15_83/0.25)] bg-[oklch(0.78_0.15_83/0.10)] px-3 py-2 text-[12px] font-semibold text-[var(--premium-gold)] transition-all duration-150 hover:bg-[oklch(0.78_0.15_83/0.22)] hover:border-[oklch(0.78_0.15_83/0.45)]"
        >
          View Opportunity
          <ArrowRight className="size-3.5" aria-hidden="true" />
        </Link>
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[oklch(0.78_0.15_83/0.30)] to-transparent"
      />
    </motion.article>
  )
}

/* ─────────────────────────────────────────────────────────────
   HIDDEN GEM CARD  (Section 6)
───────────────────────────────────────────────────────────── */

function HiddenGemCard({
  gem,
  index,
  isInView,
}: {
  gem: HiddenGem
  index: number
  isInView: boolean
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: 0.15 + index * 0.08, duration: 0.45, ease }}
      className="group relative flex gap-4 rounded-[var(--radius-xl)] border border-border bg-card p-4 shadow-[var(--shadow-card)] transition-all duration-200 hover:border-[oklch(0.70_0.16_200/0.35)] hover:shadow-[var(--shadow-md),var(--glow-cyan)]"
    >
      {/* Cover thumbnail */}
      <div
        className="h-14 w-14 shrink-0 rounded-[var(--radius-lg)] overflow-hidden flex items-center justify-center"
        style={{ background: gem.coverGradient }}
        aria-hidden="true"
      >
        <span className="text-xs font-black text-white/30 select-none">
          {gem.name.split(" ").map(w => w[0]).join("").slice(0, 2)}
        </span>
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1 flex flex-col gap-1.5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-[13px] font-bold leading-snug text-foreground transition-colors duration-200 group-hover:text-[var(--premium-cyan)]">
              {gem.name}
            </h3>
            <p className="mt-0.5 text-[10px] text-muted-foreground">
              {gem.host} · {gem.listenerCount} listeners
            </p>
          </div>
          <AiScoreBadge score={gem.matchScore} size="sm" />
        </div>

        {/* AI Insight */}
        <div className="flex items-start gap-1.5 rounded-lg border border-[oklch(0.70_0.16_200/0.15)] bg-[oklch(0.70_0.16_200/0.07)] px-2.5 py-2">
          <Zap className="mt-0.5 size-3 shrink-0 text-[var(--premium-cyan)]" aria-hidden="true" />
          <p className="text-[10px] leading-relaxed text-muted-foreground">{gem.insight}</p>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[10px] font-semibold text-[var(--premium-cyan)]">
            {gem.engagementRate} engagement rate
          </span>
          <span className="rounded-md border border-border/40 bg-muted/20 px-1.5 py-0.5 text-[9px] font-medium text-muted-foreground/70">
            {gem.category}
          </span>
        </div>
      </div>
    </motion.article>
  )
}

/* ─────────────────────────────────────────────────────────────
   PAGE HERO
───────────────────────────────────────────────────────────── */

function PageHero() {
  return (
    <section
      className="relative overflow-hidden pb-16 pt-28"
      aria-label="Discover opportunities hero"
    >
      {/* Blue radial */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-20 left-1/2 -z-10 h-[500px] w-[700px] -translate-x-1/2 rounded-full blur-3xl"
        style={{ background: "radial-gradient(ellipse at center, oklch(0.58 0.22 255 / 0.12), transparent 65%)" }}
      />
      {/* Cyan accent right */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-1/3 -z-10 h-[400px] w-[400px] rounded-full blur-3xl"
        style={{ background: "radial-gradient(ellipse at center, oklch(0.70 0.16 200 / 0.07), transparent 65%)" }}
      />

      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-6 text-center">

          {/* AI Active badge */}
          <motion.div {...fadeUp(0.1)}>
            <div className="inline-flex items-center gap-2 rounded-full border border-[oklch(0.70_0.16_200/0.25)] bg-[oklch(0.70_0.16_200/0.08)] px-3.5 py-1.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--premium-cyan)] opacity-60" aria-hidden="true" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--premium-cyan)]" aria-hidden="true" />
              </span>
              <span className="text-xs font-semibold text-[var(--premium-cyan)]">
                AI Opportunity Engine · Active
              </span>
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1 {...fadeUp(0.18)} className="text-hero text-center">
            Opportunities{" "}
            <span className="gradient-text-primary text-glow-primary">Curated For You</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            {...fadeUp(0.26)}
            className="mx-auto max-w-2xl text-lg leading-relaxed text-muted-foreground"
          >
            Based on your expertise, audience goals, and visibility profile —{" "}
            not a keyword search.
          </motion.p>

          {/* Live stats */}
          <motion.div
            {...fadeUp(0.34)}
            className="flex flex-wrap items-center justify-center gap-3"
          >
            {([
              { value: 847, suffix: "", label: "matches analyzed today" },
              { value: 50,  suffix: "K+", label: "shows indexed" },
              { value: 94,  suffix: "%", label: "match accuracy" },
            ] as const).map(({ value, suffix, label }) => (
              <div key={label} className="glass flex items-center gap-2 rounded-full px-4 py-2">
                <span className="text-sm font-bold gradient-text-primary">
                  <NumberTicker value={value} suffix={suffix} />
                </span>
                <span className="text-xs text-muted-foreground">{label}</span>
              </div>
            ))}
          </motion.div>

          {/* CTAs */}
          <motion.div
            {...fadeUp(0.42)}
            className="flex flex-col items-center gap-3 sm:flex-row"
          >
            <Button variant="premium" size="xl" className="group" asChild>
              <Link href="/signup">
                Get My Matches Free
                <ArrowRight
                  className="size-5 transition-transform duration-200 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>
            </Button>
            <Button variant="outline" size="xl" asChild>
              <Link href="/how-it-works">See How It Works</Link>
            </Button>
          </motion.div>

        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────────
   SECTION 1 — AI Discovery Feed
───────────────────────────────────────────────────────────── */

function AIDiscoveryFeed() {
  const { ref, isInView } = useSectionView()

  return (
    <section
      ref={ref}
      className="relative overflow-hidden py-20"
      aria-labelledby="recommended-heading"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[400px] w-[800px] -translate-x-1/2 rounded-full blur-3xl opacity-50"
        style={{ background: "radial-gradient(ellipse at center, oklch(0.58 0.22 255 / 0.08), transparent 65%)" }}
      />

      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-3">
          <SectionLabel icon={Sparkles} label="AI Discovery Feed" colorClass="text-primary" isInView={isInView} />
          <SectionHeading id="recommended-heading" isInView={isInView}>
            Recommended{" "}
            <span className="gradient-text-primary">For You</span>
          </SectionHeading>
          <SectionSubtext isInView={isInView}>
            Based on your expertise, audience, goals, and visibility profile.
          </SectionSubtext>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {RECOMMENDED.map((pod, i) => (
            <RecommendationCard key={pod.id} pod={pod} index={i} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.7, duration: 0.4 }}
          className="mt-8 flex justify-center"
        >
          <Button variant="outline" size="lg" asChild>
            <Link href="/signup" className="group gap-2">
              <Sparkles className="size-4 text-primary" aria-hidden="true" />
              Unlock All Matches
              <ChevronRight
                className="size-4 transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────────
   SECTION 2 — Visibility Opportunities
───────────────────────────────────────────────────────────── */

function VisibilityOpportunities() {
  const { ref, isInView } = useSectionView()

  return (
    <section
      ref={ref}
      className="relative overflow-hidden py-20"
      aria-labelledby="visibility-heading"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-1/2 -z-10 h-[400px] w-[500px] -translate-y-1/2 rounded-full blur-3xl opacity-40"
        style={{ background: "radial-gradient(ellipse at center, oklch(0.70 0.16 200 / 0.10), transparent 65%)" }}
      />

      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-3">
          <SectionLabel icon={Globe} label="Visibility Opportunities" colorClass="text-[var(--premium-cyan)]" isInView={isInView} />
          <SectionHeading id="visibility-heading" isInView={isInView}>
            Grow Your{" "}
            <span className="gradient-text-cyan">Visibility</span>
          </SectionHeading>
          <SectionSubtext isInView={isInView}>
            Curated opportunity categories actively seeking guests right now.
          </SectionSubtext>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {OPPORTUNITY_CATEGORIES.map((cat, i) => (
            <Link key={cat.label} href="/signup">
              <OpportunityCategoryCard cat={cat} index={i} isInView={isInView} />
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────────
   SECTION 3 — Trending In Your Space
───────────────────────────────────────────────────────────── */

function TrendingSection() {
  const [activeTab, setActiveTab] = useState<TrendingTab>("Leadership")
  const { ref, isInView } = useSectionView()

  return (
    <section
      ref={ref}
      className="relative overflow-hidden py-20"
      aria-labelledby="trending-heading"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute left-0 top-1/2 -z-10 h-[400px] w-[500px] -translate-y-1/2 rounded-full blur-3xl opacity-30"
        style={{ background: "radial-gradient(ellipse at center, oklch(0.58 0.22 255 / 0.10), transparent 65%)" }}
      />

      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-3">
          <SectionLabel icon={Flame} label="Trending" colorClass="text-[oklch(0.75_0.18_30)]" isInView={isInView} />
          <SectionHeading id="trending-heading" isInView={isInView}>
            Trending In{" "}
            <span className="gradient-text-primary">Your Space</span>
          </SectionHeading>
          <SectionSubtext isInView={isInView}>
            Fast-growing shows in categories that match your expertise and audience.
          </SectionSubtext>
        </div>

        {/* Tab switcher */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.24, duration: 0.4, ease }}
          className="mb-6 flex flex-wrap gap-2"
          role="tablist"
          aria-label="Trending categories"
        >
          {TRENDING_TABS.map(tab => (
            <button
              key={tab}
              role="tab"
              aria-selected={activeTab === tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "rounded-full border px-4 py-1.5 text-[12px] font-semibold transition-all duration-150",
                activeTab === tab
                  ? "border-primary bg-primary text-white"
                  : "border-border bg-muted/30 text-muted-foreground hover:border-primary/40 hover:text-foreground",
              )}
            >
              {tab}
            </button>
          ))}
        </motion.div>

        {/* Tab panel */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, ease }}
          role="tabpanel"
          className="glass rounded-[var(--radius-xl)] border border-border/50 p-4"
        >
          <div className="divide-y divide-border/30">
            {TRENDING_BY_TAB[activeTab].map((show, i) => (
              <TrendingPodcastRow key={show.name} show={show} index={i} />
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.55 }}
          className="mt-6 flex justify-center"
        >
          <Button variant="outline" size="sm" asChild>
            <Link href="/signup" className="gap-1.5">
              See All Trending Shows
              <ChevronRight className="size-3.5" aria-hidden="true" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────────
   SECTION 4 — AI Discovery Search
───────────────────────────────────────────────────────────── */

function AIDiscoverySearchSection() {
  const [query, setQuery] = useState("")
  const { ref, isInView } = useSectionView()

  return (
    <section
      ref={ref}
      className="relative overflow-hidden py-20"
      aria-labelledby="search-heading"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{ background: "radial-gradient(ellipse at 50% 50%, oklch(0.58 0.22 255 / 0.05), transparent 70%)" }}
      />

      <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
        <SectionLabel
          icon={Brain}
          label="AI Discovery Search"
          colorClass="text-primary"
          isInView={isInView}
          delay={0}
        />

        <div className="mt-3 mb-4">
          <SectionHeading id="search-heading" isInView={isInView}>
            Describe Your{" "}
            <span className="gradient-text-primary">Ideal Audience</span>
          </SectionHeading>
        </div>

        <SectionSubtext isInView={isInView}>
          Our AI finds podcasts where your people are already listening.
          No keywords. Just describe them in plain language.
        </SectionSubtext>

        {/* Search input */}
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.55, delay: 0.28, ease }}
          className="relative mt-10"
        >
          <div className="glass-strong relative flex items-center gap-3 rounded-[var(--radius-xl)] border border-border p-4 shadow-[var(--shadow-float)] transition-all duration-200 focus-within:border-primary/50 focus-within:shadow-[var(--shadow-float),var(--glow-primary)]">
            <Search className="size-5 flex-shrink-0 text-muted-foreground" aria-hidden="true" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Describe the audience you want to reach..."
              className="flex-1 bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground/50"
              aria-label="Describe your target audience"
            />
            <Link
              href="/signup"
              className="flex-shrink-0 flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-[13px] font-semibold text-white transition-all duration-150 hover:bg-primary/90 hover:shadow-[var(--glow-primary)]"
            >
              Find Matches
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </Link>
          </div>
        </motion.div>

        {/* Suggestion chips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.45, duration: 0.4 }}
          className="mt-5 flex flex-wrap justify-center gap-2"
        >
          {SEARCH_SUGGESTIONS.map(s => (
            <button
              key={s}
              onClick={() => setQuery(s)}
              className="rounded-full border border-border/50 bg-muted/30 px-3 py-1.5 text-left text-[11px] font-medium text-muted-foreground transition-all duration-150 hover:border-primary/40 hover:bg-primary/8 hover:text-foreground"
            >
              &ldquo;{s}&rdquo;
            </button>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────────
   SECTION 5 — Premium Opportunities
───────────────────────────────────────────────────────────── */

function PremiumOpportunitiesSection() {
  const { ref, isInView } = useSectionView()

  return (
    <section
      ref={ref}
      className="relative overflow-hidden py-20"
      aria-labelledby="premium-heading"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[400px] w-[700px] -translate-x-1/2 rounded-full blur-3xl opacity-30"
        style={{ background: "radial-gradient(ellipse at center, oklch(0.78 0.15 83 / 0.15), transparent 65%)" }}
      />

      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-3">
          <SectionLabel icon={Award} label="Premium" colorClass="text-[var(--premium-gold)]" isInView={isInView} />
          <SectionHeading id="premium-heading" isInView={isInView}>
            High-Authority{" "}
            <span className="gradient-text-gold">Opportunities</span>
          </SectionHeading>
          <SectionSubtext isInView={isInView}>
            The largest audiences and highest-credibility shows in your category.
          </SectionSubtext>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PREMIUM_SHOWS.map((show, i) => (
            <PremiumShowCard key={show.name} show={show} index={i} isInView={isInView} />
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────────
   SECTION 6 — Hidden Gems
───────────────────────────────────────────────────────────── */

function HiddenGemsSection() {
  const { ref, isInView } = useSectionView()

  return (
    <section
      ref={ref}
      className="relative overflow-hidden py-20"
      aria-labelledby="gems-heading"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 bottom-0 -z-10 h-[400px] w-[500px] rounded-full blur-3xl opacity-30"
        style={{ background: "radial-gradient(ellipse at center, oklch(0.70 0.16 200 / 0.10), transparent 65%)" }}
      />

      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-3">
          <SectionLabel icon={Zap} label="Hidden Gems" colorClass="text-[var(--premium-cyan)]" isInView={isInView} />
          <SectionHeading id="gems-heading" isInView={isInView}>
            Opportunities{" "}
            <span className="gradient-text-cyan">Others Miss</span>
          </SectionHeading>
          <SectionSubtext isInView={isInView}>
            High-engagement niche audiences your competitors haven&apos;t found — yet.
          </SectionSubtext>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {HIDDEN_GEMS.map((gem, i) => (
            <HiddenGemCard key={gem.name} gem={gem} index={i} isInView={isInView} />
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────────
   SECTION 7 — Saved Opportunities (gated)
───────────────────────────────────────────────────────────── */

function SavedOpportunitiesSection() {
  const { ref, isInView } = useSectionView()

  return (
    <section
      ref={ref}
      className="relative overflow-hidden py-20"
      aria-labelledby="saved-heading"
    >
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-3">
          <SectionLabel icon={Bookmark} label="Saved Opportunities" colorClass="text-primary" isInView={isInView} />
          <SectionHeading id="saved-heading" isInView={isInView}>
            Your Saved{" "}
            <span className="gradient-text-primary">Opportunities</span>
          </SectionHeading>
          <SectionSubtext isInView={isInView}>
            Recently saved, favorited, and in review.
          </SectionSubtext>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.28, duration: 0.5, ease }}
          className="relative"
        >
          {/* Blurred preview cards */}
          <div
            className="pointer-events-none select-none grid gap-4 sm:grid-cols-3"
            aria-hidden
          >
            {[
              { name: "The Tim Ferriss Show", score: 94, label: "Business & Lifestyle" },
              { name: "Dare to Lead", score: 93, label: "Leadership" },
              { name: "Masters of Scale", score: 92, label: "Entrepreneurship" },
            ].map(item => (
              <div
                key={item.name}
                className="flex items-center gap-3 rounded-[var(--radius-xl)] border border-border bg-card p-4"
              >
                <div className="h-10 w-10 flex-shrink-0 rounded-lg gradient-primary" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-bold text-foreground">{item.name}</p>
                  <p className="text-[10px] text-muted-foreground">{item.label}</p>
                </div>
                <AiScoreBadge score={item.score} size="sm" />
              </div>
            ))}
          </div>

          {/* Overlay */}
          <div className="absolute inset-0 flex items-center justify-center rounded-[var(--radius-xl)] backdrop-blur-md">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-card">
                <Lock className="size-5 text-muted-foreground" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">Sign up to save and track opportunities</p>
                <p className="mt-1 text-xs text-muted-foreground">Free account · No credit card required</p>
              </div>
              <Button variant="premium" size="sm" asChild>
                <Link href="/signup" className="gap-1.5">
                  Create Free Account
                  <ArrowRight className="size-3.5" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────────
   FINAL CTA
───────────────────────────────────────────────────────────── */

function DiscoverCTASection() {
  const { ref, isInView } = useSectionView()

  return (
    <section
      ref={ref}
      className="relative overflow-hidden py-24"
      aria-label="Get started CTA"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{ background: "linear-gradient(180deg, transparent 0%, oklch(0.12 0.025 255 / 0.5) 50%, transparent 100%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
        style={{ background: "radial-gradient(ellipse at center, oklch(0.58 0.22 255 / 0.10), transparent 65%)" }}
      />

      <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease }}
          className="flex flex-col items-center gap-6"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-1.5">
            <CheckCircle2 className="size-3.5 text-primary" aria-hidden="true" />
            <span className="text-xs font-semibold text-primary">Free forever plan available</span>
          </div>

          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
            Stop Searching.{" "}
            <span className="gradient-text-primary">Start Getting Discovered.</span>
          </h2>

          <p className="max-w-xl text-lg text-muted-foreground">
            Join 2,400+ creators using PodcastMatch AI to land interviews on podcasts
            their audiences actually listen to.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button variant="premium" size="xl" className="group" asChild>
              <Link href="/signup">
                Get Matched Free
                <ArrowRight
                  className="size-5 transition-transform duration-200 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>
            </Button>
            <Button variant="outline" size="xl" asChild>
              <Link href="/pricing">View Pricing</Link>
            </Button>
          </div>

          <p className="text-xs text-muted-foreground">
            No credit card required · Cancel anytime · Free forever plan
          </p>
        </motion.div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────────
   MAIN EXPORT
───────────────────────────────────────────────────────────── */

export function DiscoverPageContent() {
  return (
    <main id="main-content">
      <PageHero />
      <AIDiscoveryFeed />
      <VisibilityOpportunities />
      <TrendingSection />
      <AIDiscoverySearchSection />
      <PremiumOpportunitiesSection />
      <HiddenGemsSection />
      <SavedOpportunitiesSection />
      <DiscoverCTASection />
    </main>
  )
}
