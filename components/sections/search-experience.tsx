"use client"

import * as React from "react"
import { useRef, useState, useEffect } from "react"
import { motion, AnimatePresence, useInView } from "motion/react"
import {
  Search,
  Sparkles,
  Cpu,
  CheckCircle2,
  Radio,
  Clock,
  Users,
  Activity,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { PodcastResultCard, type PodcastData } from "@/components/ui/podcast-result-card"
import { AIInsightPanel } from "@/components/ui/ai-insight-panel"

/* ── Search query cycle ─────────────────────────────────────── */
const SEARCH_QUERIES: string[] = [
  "Leadership Podcasts",
  "Mindset & Growth Shows",
  "Faith-Based Creators",
  "Business Growth Strategy",
  "Recovery & Resilience Stories",
]

/* ── Podcast pool ───────────────────────────────────────────── */
const PODCASTS: PodcastData[] = [
  {
    id:            "p1",
    name:          "The Leadership Edge",
    category:      "Business & Leadership",
    listenerCount: "2.8M",
    matchScore:    94,
    hostActivity:  "Books Weekly",
    activityLevel: "high",
    tags:          ["Leadership", "Executive", "Strategy"],
    visibility:    "Very High",
    isRecommended: true,
  },
  {
    id:            "p2",
    name:          "Mindset Mastery Show",
    category:      "Personal Development",
    listenerCount: "1.4M",
    matchScore:    91,
    hostActivity:  "Active Booker",
    activityLevel: "high",
    tags:          ["Mindset", "Growth", "Psychology"],
    visibility:    "High",
    isRecommended: true,
  },
  {
    id:            "p3",
    name:          "The Faith Forward Podcast",
    category:      "Spirituality",
    listenerCount: "890K",
    matchScore:    88,
    hostActivity:  "Books Monthly",
    activityLevel: "medium",
    tags:          ["Faith", "Community", "Values"],
    visibility:    "Rising",
    isRecommended: false,
  },
  {
    id:            "p4",
    name:          "Scale & Grow Daily",
    category:      "Entrepreneurship",
    listenerCount: "3.2M",
    matchScore:    96,
    hostActivity:  "Books Weekly",
    activityLevel: "high",
    tags:          ["Growth", "Entrepreneurship", "Revenue"],
    visibility:    "Very High",
    isRecommended: true,
  },
  {
    id:            "p5",
    name:          "Resilience Radio",
    category:      "Health & Wellness",
    listenerCount: "650K",
    matchScore:    87,
    hostActivity:  "Active Booker",
    activityLevel: "high",
    tags:          ["Recovery", "Resilience", "Wellness"],
    visibility:    "Rising",
    isRecommended: false,
  },
  {
    id:            "p6",
    name:          "The High Performance Blueprint",
    category:      "Productivity",
    listenerCount: "2.1M",
    matchScore:    93,
    hostActivity:  "Books Weekly",
    activityLevel: "high",
    tags:          ["Productivity", "Performance", "Success"],
    visibility:    "High",
    isRecommended: true,
  },
  {
    id:            "p7",
    name:          "Creator Economy Insider",
    category:      "Creator Economy",
    listenerCount: "1.8M",
    matchScore:    90,
    hostActivity:  "Active Booker",
    activityLevel: "high",
    tags:          ["Creators", "Monetization", "Content"],
    visibility:    "Very High",
    isRecommended: true,
  },
  {
    id:            "p8",
    name:          "The Breakthrough Blueprint",
    category:      "Personal Development",
    listenerCount: "720K",
    matchScore:    86,
    hostActivity:  "Books Monthly",
    activityLevel: "medium",
    tags:          ["Breakthroughs", "Transformation", "Coaching"],
    visibility:    "Growing",
    isRecommended: false,
  },
]

/* Results per query — indices into PODCASTS */
const RESULT_SETS: PodcastData[][] = [
  [PODCASTS[0], PODCASTS[1], PODCASTS[5]],  // Leadership
  [PODCASTS[1], PODCASTS[6], PODCASTS[7]],  // Mindset
  [PODCASTS[2], PODCASTS[1], PODCASTS[4]],  // Faith
  [PODCASTS[3], PODCASTS[0], PODCASTS[6]],  // Business
  [PODCASTS[4], PODCASTS[7], PODCASTS[5]],  // Recovery
]

/* ── Phase types ────────────────────────────────────────────── */
type SearchPhase = "idle" | "typing" | "scanning" | "results" | "clearing"

/* ── Fade-in helper ─────────────────────────────────────────── */
function useFadeInView() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })
  return { ref, isInView }
}

/* ══════════════════════════════════════════════════════════════
   SearchExperienceSection
   ══════════════════════════════════════════════════════════════ */
export function SearchExperienceSection() {
  return (
    <section
      className="relative overflow-hidden py-28"
      aria-labelledby="search-experience-heading"
    >
      {/* ── BACKGROUND ───────────────────────────────────────── */}

      {/* Top connector from how-it-works */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-40"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.09 0.028 252 / 0.75) 0%, transparent 100%)",
        }}
      />

      {/* Primary blue orb — upper left */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-20 h-[600px] w-[600px] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(ellipse at center, oklch(0.58 0.22 255 / 0.09), transparent 65%)",
        }}
      />

      {/* Cyan orb — lower right */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 bottom-0 h-[500px] w-[500px] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(ellipse at center, oklch(0.70 0.16 200 / 0.07), transparent 65%)",
        }}
      />

      {/* ── CONTENT ──────────────────────────────────────────── */}
      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

        <SectionHeader />

        {/* 3-column layout: insight panels | simulator | insight panels */}
        <div className="mt-14 flex items-start gap-5">

          {/* ── LEFT insight panels (xl+ only) ──────────────── */}
          <LeftInsightPanels />

          {/* ── Main search simulator ───────────────────────── */}
          <div className="flex-1 min-w-0">
            <SearchSimulator />
          </div>

          {/* ── RIGHT insight panels (xl+ only) ─────────────── */}
          <RightInsightPanels />

        </div>
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
        <Activity className="size-3" aria-hidden="true" />
        Live AI Matching Engine
      </div>

      <h2
        id="search-experience-heading"
        className="text-h2 mx-auto max-w-2xl"
      >
        AI Podcast Discovery,{" "}
        <span className="gradient-text-primary text-glow-primary">
          Happening in Real Time
        </span>
      </h2>

      <p className="mx-auto mt-5 max-w-lg text-base text-muted-foreground leading-relaxed">
        Watch the AI scan 50,000+ verified shows — scoring audience alignment, host booking
        signals, and niche relevance to surface your highest-probability opportunities instantly.
      </p>
    </motion.div>
  )
}

/* ── Left floating panels ───────────────────────────────────── */
function LeftInsightPanels() {
  const { ref, isInView } = useFadeInView()

  return (
    <div
      ref={ref}
      className="hidden xl:flex flex-col gap-3 w-44 flex-shrink-0"
    >
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
      >
        <AIInsightPanel
          icon={Radio}
          title="AI Active Host Detected"
          value="Books Weekly"
          color="primary"
          floatDelay="0s"
        />
      </motion.div>

      <motion.div
        className="mt-6"
        initial={{ opacity: 0, x: -20 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.55 }}
      >
        <AIInsightPanel
          icon={Clock}
          title="Booking Window Open"
          value="Now Accepting Guests"
          color="green"
          floatDelay="-3.5s"
        />
      </motion.div>
    </div>
  )
}

/* ── Right floating panels ──────────────────────────────────── */
function RightInsightPanels() {
  const { ref, isInView } = useFadeInView()

  return (
    <div
      ref={ref}
      className="hidden xl:flex flex-col gap-3 w-44 flex-shrink-0"
    >
      <motion.div
        className="mt-24"
        initial={{ opacity: 0, x: 20 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
      >
        <AIInsightPanel
          icon={Users}
          title="Audience Overlap Score"
          value="94% Match"
          color="gold"
          floatDelay="-5s"
        />
      </motion.div>

      <motion.div
        className="mt-4"
        initial={{ opacity: 0, x: 20 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.65 }}
      >
        <AIInsightPanel
          icon={Sparkles}
          title="Creator Alignment"
          value="Strong"
          color="cyan"
          floatDelay="-2s"
        />
      </motion.div>
    </div>
  )
}

/* ── Search Bar display ─────────────────────────────────────── */
interface SearchBarDisplayProps {
  value: string
  phase: SearchPhase
}

function SearchBarDisplay({ value, phase }: SearchBarDisplayProps) {
  const isTyping   = phase === "typing"
  const isScanning = phase === "scanning"
  const hasResults = phase === "results"

  return (
    <div className="relative" role="search" aria-label="AI podcast search demonstration">
      {/* Glass bar */}
      <div
        className={cn(
          "flex items-center gap-4 rounded-2xl px-5 py-4",
          "glass-strong transition-all duration-400",
          isScanning
            ? "border border-primary/60 shadow-[var(--shadow-lg),var(--glow-primary)]"
            : hasResults
              ? "border border-primary/35 shadow-[var(--shadow-md),var(--glow-subtle)]"
              : "border border-border shadow-[var(--shadow-card)]"
        )}
      >
        {/* Icon */}
        <Search
          className={cn(
            "size-5 flex-shrink-0 transition-colors duration-300",
            isScanning ? "text-primary" : "text-muted-foreground/60"
          )}
          aria-hidden="true"
        />

        {/* Text */}
        <div
          className="flex-1 min-w-0 select-none"
          aria-live="polite"
          aria-label={`Current query: ${value || "waiting"}`}
        >
          {value ? (
            <span className="text-lg font-medium text-foreground">{value}</span>
          ) : (
            <span className="text-lg text-muted-foreground/35">
              AI-powered podcast discovery...
            </span>
          )}
          {isTyping && (
            <span
              className="ml-0.5 inline-block h-[1.1em] w-0.5 translate-y-[0.1em] rounded-sm
                         bg-primary animate-cursor-blink"
              aria-hidden="true"
            />
          )}
        </div>

        {/* Right: scanning pulse + AI badge */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {isScanning && (
            <div
              className="relative flex h-4 w-4 items-center justify-center"
              aria-label="AI scanning in progress"
            >
              <span className="h-2 w-2 rounded-full bg-primary" />
              <span
                className="absolute h-2 w-2 rounded-full bg-primary animate-ai-ring-pulse"
                aria-hidden="true"
              />
              <span
                className="absolute h-2 w-2 rounded-full bg-primary animate-ai-ring-pulse"
                style={{ animationDelay: "0.55s" }}
                aria-hidden="true"
              />
            </div>
          )}
          <div className="flex h-7 items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-3">
            <Cpu className="size-3 text-primary" aria-hidden="true" />
            <span className="text-[10px] font-bold tracking-widest text-primary">AI</span>
          </div>
        </div>
      </div>

      {/* Scanning progress bar — runs once during scanning phase */}
      <AnimatePresence>
        {isScanning && (
          <div className="overflow-hidden h-0.5">
            <motion.div
              className="h-full gradient-primary rounded-b-full"
              initial={{ width: "0%", opacity: 1 }}
              animate={{ width: "100%", opacity: [1, 1, 0.3] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.4, ease: [0.2, 0, 0.8, 1] }}
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ── Status row ─────────────────────────────────────────────── */
function SearchStatus({ phase }: { phase: SearchPhase }) {
  return (
    <div
      className="mt-3 h-7 flex items-center justify-center"
      aria-live="polite"
      aria-atomic="true"
    >
      <AnimatePresence mode="wait">
        {phase === "typing" && (
          <motion.p
            key="typing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="text-xs text-muted-foreground/50"
          >
            Type a niche or topic to begin AI discovery...
          </motion.p>
        )}

        {phase === "scanning" && (
          <motion.div
            key="scanning"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-2 text-xs text-primary"
          >
            <Sparkles className="size-3" aria-hidden="true" />
            <span>Scanning 50,000+ podcasts for alignment...</span>
          </motion.div>
        )}

        {phase === "results" && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-2 text-xs"
          >
            <CheckCircle2
              className="size-3 text-[oklch(0.65_0.15_145)] flex-shrink-0"
              aria-hidden="true"
            />
            <span className="font-medium text-foreground">12 high-match opportunities found</span>
            <span className="text-muted-foreground hidden sm:inline">· Showing top 3</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ── Results grid ───────────────────────────────────────────── */
interface ResultsGridProps {
  results:  PodcastData[]
  phase:    SearchPhase
  queryIdx: number
}

function ResultsGrid({ results, phase, queryIdx }: ResultsGridProps) {
  const visible = phase === "results" || phase === "clearing"

  return (
    <div className="mt-5 min-h-[1px]" aria-label="AI-matched podcast opportunities">
      <AnimatePresence mode="wait">
        {visible && results.length > 0 && (
          <motion.div
            key={`results-${queryIdx}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: phase === "clearing" ? 0 : 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: "easeInOut" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {results.map((podcast, i) => (
              <motion.div
                key={podcast.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.45,
                  ease: [0.16, 1, 0.3, 1],
                  delay: i * 0.1,
                }}
              >
                <PodcastResultCard data={podcast} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ── Search Simulator ───────────────────────────────────────── */
function SearchSimulator() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })

  const [phase, setPhase]                 = useState<SearchPhase>("idle")
  const [displayText, setDisplayText]     = useState("")
  const [queryIdx, setQueryIdx]           = useState(0)
  const [currentResults, setCurrentResults] = useState<PodcastData[]>([])

  useEffect(() => {
    if (!isInView) return

    let cancelled = false
    const sleep = (ms: number) => new Promise<void>(res => setTimeout(res, ms))

    async function runSearch() {
      let qIdx = 0

      while (!cancelled) {
        const query = SEARCH_QUERIES[qIdx]

        /* ── Reset ── */
        if (!cancelled) setQueryIdx(qIdx)
        if (!cancelled) setDisplayText("")
        if (!cancelled) setCurrentResults([])
        if (!cancelled) setPhase("typing")

        /* ── Type characters ── */
        for (let i = 1; i <= query.length; i++) {
          if (cancelled) return
          setDisplayText(query.slice(0, i))
          await sleep(58)
        }

        if (cancelled) return
        await sleep(350)

        /* ── Scanning phase ── */
        if (!cancelled) setPhase("scanning")
        await sleep(1600)

        if (cancelled) return

        /* ── Show results ── */
        if (!cancelled) setCurrentResults(RESULT_SETS[qIdx % RESULT_SETS.length])
        if (!cancelled) setPhase("results")
        await sleep(4200)

        if (cancelled) return

        /* ── Clear ── */
        if (!cancelled) setPhase("clearing")
        await sleep(600)

        qIdx = (qIdx + 1) % SEARCH_QUERIES.length
      }
    }

    runSearch()
    return () => { cancelled = true }
  }, [isInView])

  /* Entrance animation */
  const { ref: entranceRef, isInView: entranceInView } = useFadeInView()

  return (
    <motion.div
      ref={entranceRef}
      initial={{ opacity: 0, y: 24 }}
      animate={entranceInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
    >
      {/* Invisible ref for simulation trigger */}
      <div ref={ref} aria-hidden="true" className="absolute" />

      <SearchBarDisplay value={displayText} phase={phase} />
      <SearchStatus phase={phase} />
      <ResultsGrid results={currentResults} phase={phase} queryIdx={queryIdx} />
    </motion.div>
  )
}
