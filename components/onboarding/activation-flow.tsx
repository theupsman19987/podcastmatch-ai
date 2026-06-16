"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "motion/react"
import { Zap, Globe, Sparkles, Lock, CheckCircle2, ArrowRight, Loader2, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"
import { computeScore } from "@/lib/scoring/visibility-score"
import { computeMatch, RANK_CONFIG, getOpportunityRank } from "@/lib/matching/match-engine"
import { saveBio }                    from "@/lib/actions/user-profile"
import { updateProfileSettings }      from "@/lib/actions/settings"
import { completeDnaAssessment }      from "@/lib/actions/dna"
import { saveCreatorProfile }         from "@/lib/actions/profile"
import { computeAndSaveScore }        from "@/lib/actions/scoring"
import { generateProfile }            from "@/lib/profile/generate-profile"
import {
  StepCard, StepHeader, SectionLabel,
  SelectionCard, TagPill, StepTextarea,
} from "./dna-inputs"
import type { DiscoveryPodcast }  from "@/components/discovery/mock-data"
import type { DNAFormData }       from "./dna-context"
import type { ScoreBreakdown, ScoreInput } from "@/lib/scoring/visibility-score"

/* ── Constants ───────────────────────────────────────────────── */

const TOTAL_STEPS = 6

const STEP_PROGRESS = [0, 15, 35, 60, 75, 90, 100]

const STEP_LABELS = [
  "Identity", "Message", "Audience", "Matches", "Authority", "Ready",
]

const ROLES = [
  { value: "speaker",      label: "Speaker / Keynote",   emoji: "🎤", description: "Keynotes, TEDx, events" },
  { value: "coach",        label: "Coach / Mentor",      emoji: "🏆", description: "1:1 or group coaching"  },
  { value: "author",       label: "Author / Writer",     emoji: "📚", description: "Books, courses, content" },
  { value: "consultant",   label: "Consultant",          emoji: "💼", description: "Advisory, strategy"     },
  { value: "entrepreneur", label: "Entrepreneur",        emoji: "🚀", description: "Building a company"      },
  { value: "educator",     label: "Educator / Trainer",  emoji: "🎓", description: "Teaching and training"  },
  { value: "therapist",    label: "Therapist / Health",  emoji: "🧠", description: "Wellbeing and healing"   },
  { value: "creator",      label: "Content Creator",     emoji: "✨", description: "Audience-first creator"  },
]

const TOPICS = [
  "Business & Entrepreneurship", "Personal Development",
  "Health & Wellness",           "Technology",
  "Leadership",                  "Finance & Investing",
  "Marketing & Sales",           "Mental Health",
  "Relationships",               "Education",
  "Creativity",                  "Science",
  "Social Impact",               "Spirituality",
]

const MICRO_WINS: Record<number, string> = {
  1: "+15 pts — Profile started",
  2: "+20 pts — Message defined",
  3: "+25 pts — Audience mapped",
  4: "First matches found!",
  5: "+15 pts — Authority added",
}

/* ── Data types ──────────────────────────────────────────────── */

interface OnboardingData {
  firstName:  string
  role:       string
  topics:     string[]
  oneLiner:   string
  challenge:  string
  outcome:    string
  website:    string
  bio:        string
}

const EMPTY: OnboardingData = {
  firstName: "", role: "", topics: [],
  oneLiner: "", challenge: "", outcome: "",
  website: "", bio: "",
}

/* ── Score preview helper ────────────────────────────────────── */

function previewScore(d: OnboardingData): ScoreBreakdown {
  const input: ScoreInput = {
    bio:                     d.bio.trim().length > 50 ? d.bio : null,
    websiteUrl:              d.website.trim() || null,
    avatarUrl:               null,
    fullName:                d.firstName || null,
    speakingTopics:          d.topics,
    brandIdentityPopulated:  d.oneLiner.length > 20,
    audienceProfilePopulated: d.challenge.length > 0,
    dnaCompleted:            false,
    dnaCompletedAt:          null,
    dnaPublishedWork:        null,
    dnaAudienceType:         null,
    dnaAudienceChallenge:    d.challenge || null,
    dnaAudienceOutcome:      d.outcome   || null,
    dnaOneRememberedThing:   d.oneLiner  || null,
    savedCount:              0,
    profileUpdatedAt:        null,
  }
  return computeScore(input).breakdown
}

/* ── Map onboarding data → DNAFormData ───────────────────────── */

function buildDna(d: OnboardingData): DNAFormData {
  return {
    s1_podcastMotivation:   ["share expertise", "grow audience"],
    s2_primaryTopic:        d.topics.slice(0, 2),
    s2_speakForHour:        d.topics.slice(0, 2),
    s2_problemSolved:       d.challenge,
    s2_personalResults:     d.outcome,
    s2_expertiseCategory:   d.role,
    s3_audienceBenefits:    d.outcome,
    s3_ageGroup:            "",
    s3_audienceChallenge:   d.challenge,
    s3_audienceType:        "",
    s3_audienceOutcome:     d.outcome,
    s4_speakingStyle:       [],
    s4_teachingStyle:       "",
    s4_uniqueVoice:         d.oneLiner,
    s5_podcastCategories:   d.topics,
    s5_podcastFormats:      [],
    s6_previousPodcasts:    "",
    s6_publicSpeaking:      "",
    s6_publishedWork:       "none",
    s6_socialMediaActivity: "",
    s6_readiness:           "",
    s7_missionCategory:     d.topics.slice(0, 2),
    s7_creatorArchetype:    d.role,
    s7_centralMessage:      d.topics.slice(0, 2),
    s7_oneRememberedThing:  d.oneLiner,
  }
}

/* ── Small reusable pieces ───────────────────────────────────── */

function ScoreRing({ score, size = 80, pulsing = false }: { score: number; size?: number; pulsing?: boolean }) {
  const r      = (size / 2) - 6
  const c      = 2 * Math.PI * r
  const offset = c * (1 - score / 100)
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="currentColor" strokeWidth={5} className="text-border/20" />
        <motion.circle
          cx={size/2} cy={size/2} r={r}
          fill="none" stroke="oklch(var(--primary))" strokeWidth={5}
          strokeDasharray={c}
          strokeLinecap="round"
          initial={{ strokeDashoffset: c }}
          animate={{
            strokeDashoffset: offset,
            opacity: pulsing ? [1, 0.4, 1] : 1,
          }}
          transition={{
            strokeDashoffset: { duration: 0.8, ease: "easeOut" },
            opacity: pulsing ? { repeat: Infinity, duration: 1.1 } : { duration: 0.2 },
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          key={score}
          initial={{ scale: 1.2, opacity: 0.5 }}
          animate={{ scale: 1,   opacity: 1   }}
          transition={{ duration: 0.3 }}
          className="text-xl font-bold text-foreground leading-none"
        >
          {score}
        </motion.span>
        <span className="text-[9px] text-muted-foreground uppercase tracking-wide mt-0.5">pts</span>
      </div>
    </div>
  )
}

function BoostBadge({ pts, done, label }: { pts: number; done: boolean; label: string }) {
  return (
    <div className={cn(
      "flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium transition-all duration-300",
      done
        ? "border-[oklch(0.55_0.16_145/0.30)] bg-[oklch(0.55_0.16_145/0.08)] text-[oklch(0.72_0.16_145)]"
        : "border-primary/20 bg-primary/5 text-muted-foreground"
    )}>
      {done
        ? <CheckCircle2 className="size-3.5 text-[oklch(0.72_0.16_145)] shrink-0" />
        : <span className="text-[10px] font-bold text-primary shrink-0">+{pts}</span>
      }
      <span>{label}</span>
    </div>
  )
}

function MicroWinToast({ message, onDone }: { message: string; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2200)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.9 }}
      animate={{ opacity: 1, y: 0,  scale: 1   }}
      exit={{    opacity: 0, y: -12, scale: 0.9 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5
                 rounded-2xl border border-primary/30 bg-card/95 backdrop-blur-md
                 px-5 py-3 shadow-xl shadow-primary/10"
    >
      <Sparkles className="size-4 text-primary shrink-0" />
      <span className="text-sm font-semibold text-foreground">{message}</span>
    </motion.div>
  )
}

function MatchCard({ podcast, locked }: { podcast: DiscoveryPodcast; locked?: boolean }) {
  const rank   = getOpportunityRank(podcast.matchScore)
  const config = RANK_CONFIG[rank]

  return (
    <div className={cn(
      "relative rounded-xl border p-4 transition-all duration-200",
      locked ? "border-border/30 opacity-60" : "border-border/50 bg-card/50 hover:border-border/70"
    )}>
      {locked && (
        <div className="absolute inset-0 rounded-xl flex items-center justify-center bg-background/60 backdrop-blur-[2px] z-10">
          <div className="flex items-center gap-1.5 text-muted-foreground text-xs font-medium">
            <Lock className="size-3.5" />
            Complete profile to unlock
          </div>
        </div>
      )}

      <div className="flex items-start gap-3">
        {podcast.artwork ? (
          <img src={podcast.artwork} alt={podcast.name} className="w-10 h-10 rounded-lg object-cover shrink-0" />
        ) : (
          <div className="w-10 h-10 rounded-lg gradient-primary shrink-0" />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className={cn("text-[10px] font-bold uppercase tracking-wider", config.color)}>
              {config.label}
            </span>
          </div>
          <p className="text-sm font-semibold text-foreground truncate">{podcast.name}</p>
          <p className="text-xs text-muted-foreground truncate">{podcast.host}</p>
        </div>
        <div className="shrink-0 text-right">
          <div className="text-lg font-bold text-foreground">{podcast.matchScore}%</div>
          <div className="text-[10px] text-muted-foreground">match</div>
        </div>
      </div>

      {!locked && (
        <div className="mt-3 flex items-center gap-1.5 flex-wrap">
          {podcast.categories.slice(0, 2).map(c => (
            <span key={c} className="text-[10px] px-2 py-0.5 rounded-full bg-primary/8 border border-primary/15 text-primary/80">
              {c}
            </span>
          ))}
          <span className="ml-auto text-[10px] text-muted-foreground">
            ~{podcast.estimatedReach} reach
          </span>
        </div>
      )}
    </div>
  )
}

/* ── Progress shell ──────────────────────────────────────────── */

function ProgressShell({ step, children }: { step: number; children: React.ReactNode }) {
  const pct = STEP_PROGRESS[step] ?? 0

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top bar */}
      <header className="sticky top-0 z-20 flex items-center gap-4 px-6 py-3
                          border-b border-border/40 bg-background/90 backdrop-blur-md">
        {/* Logo */}
        <div className="flex items-center gap-2 mr-4 shrink-0">
          <div className="w-6 h-6 rounded-md gradient-primary flex items-center justify-center">
            <Zap className="size-3.5 text-white" />
          </div>
          <span className="text-sm font-bold text-foreground hidden sm:block">PodcastMatch AI</span>
        </div>

        {/* Progress bar */}
        <div className="flex-1 relative h-1.5 rounded-full bg-border/30 overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full gradient-primary"
            initial={{ width: "0%" }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>

        {/* Step counter */}
        <div className="shrink-0 flex items-center gap-1 ml-4">
          {STEP_LABELS.map((label, i) => (
            <div key={i} className="flex items-center gap-1">
              <div className={cn(
                "w-1.5 h-1.5 rounded-full transition-all duration-300",
                i + 1 < step  ? "bg-primary scale-90"  :
                i + 1 === step ? "bg-primary scale-125 shadow-[0_0_6px_oklch(var(--primary)/0.6)]" :
                                  "bg-border/40"
              )} />
            </div>
          ))}
          <span className="ml-2 text-[11px] text-muted-foreground font-medium hidden sm:block">
            {step}/{TOTAL_STEPS}
          </span>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 flex items-start justify-center px-4 py-8 md:py-12">
        <div className="w-full max-w-xl">
          {children}
        </div>
      </main>
    </div>
  )
}

/* ── Step variants for AnimatePresence ───────────────────────── */

const stepVariants = {
  enter:  (dir: number) => ({ x: dir > 0 ? 48 : -48, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit:   (dir: number) => ({ x: dir > 0 ? -48 : 48, opacity: 0, transition: { duration: 0.18 } }),
}

/* ── Main component ──────────────────────────────────────────── */

export function ActivationFlow({ initialFirstName }: { initialFirstName?: string }) {
  const router     = useRouter()
  const [step,     setStep]     = useState(1)
  const [dir,      setDir]      = useState(1)
  const [data,     setData]     = useState<OnboardingData>({ ...EMPTY, firstName: initialFirstName ?? "" })
  const [matches,  setMatches]  = useState<DiscoveryPodcast[]>([])
  const [microWin, setMicroWin] = useState<string | null>(null)
  const [score,    setScore]    = useState<ScoreBreakdown | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const savedRef = useRef(false)

  const set = useCallback(<K extends keyof OnboardingData>(key: K, val: OnboardingData[K]) => {
    setData(d => ({ ...d, [key]: val }))
  }, [])

  const toggleTopic = useCallback((topic: string) => {
    setData(d => {
      const has = d.topics.includes(topic)
      if (!has && d.topics.length >= 3) return d
      return { ...d, topics: has ? d.topics.filter(t => t !== topic) : [...d.topics, topic] }
    })
  }, [])

  /* Navigate */
  function goTo(n: number) {
    setDir(n > step ? 1 : -1)
    setStep(n)
  }

  function next() {
    if (step < TOTAL_STEPS) {
      const win = MICRO_WINS[step]
      if (win) setMicroWin(win)
      goTo(step + 1)
    }
  }

  function back() {
    if (step > 1) goTo(step - 1)
  }

  /* Fetch matches when entering step 4 */
  useEffect(() => {
    if (step !== 4 || matches.length > 0) return
    const cat = encodeURIComponent(data.topics[0] ?? "Business")
    fetch(`/api/podcasts?category=${cat}&pageSize=8`)
      .then(r => r.json())
      .then(json => {
        const list: DiscoveryPodcast[] = (json.data ?? []).slice(0, 5)
        setMatches(list)
      })
      .catch(() => {})
  }, [step])

  /* Recompute preview score whenever step ≥ 5 and data changes */
  useEffect(() => {
    if (step >= 5) setScore(previewScore(data))
  }, [step, data.website, data.bio, data.topics, data.oneLiner, data.challenge])

  /* Save everything when entering step 6 */
  useEffect(() => {
    if (step !== 6 || savedRef.current) return
    savedRef.current = true

    async function save() {
      setIsSaving(true)
      try {
        const dna     = buildDna(data)
        const profile = generateProfile(dna)

        await Promise.allSettled([
          updateProfileSettings({ fullName: data.firstName, website: data.website.trim() }),
          saveBio(data.bio),
          completeDnaAssessment(dna),
          saveCreatorProfile(profile),
        ])

        localStorage.setItem("podmatch_creator_dna", JSON.stringify(dna))
        await computeAndSaveScore().catch(() => {})
      } finally {
        setIsSaving(false)
      }
    }

    save()
  }, [step])

  /* ── Step renderers ─────────────────────────────────────── */

  function renderStep() {
    switch (step) {
      /* ── Step 1 — Identity ──────────────────────────────── */
      case 1: return (
        <StepCard>
          <StepHeader
            headline="Let's build your creator profile"
            sub="This helps us match you to the right podcasts — takes under 2 minutes"
          />

          <div className="space-y-6">
            <div>
              <SectionLabel>Your name</SectionLabel>
              <input
                type="text"
                value={data.firstName}
                onChange={e => set("firstName", e.target.value)}
                placeholder="First name"
                className={cn(
                  "w-full px-4 py-3 rounded-xl border border-border/40 bg-card/50 backdrop-blur-sm",
                  "text-sm text-foreground placeholder:text-muted-foreground/50",
                  "focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                )}
              />
            </div>

            <div>
              <SectionLabel>Your primary role</SectionLabel>
              <div className="grid grid-cols-2 gap-2">
                {ROLES.map(r => (
                  <SelectionCard
                    key={r.value}
                    emoji={r.emoji}
                    label={r.label}
                    description={r.description}
                    selected={data.role === r.value}
                    onClick={() => set("role", r.value)}
                  />
                ))}
              </div>
            </div>

            <div>
              <SectionLabel>Your main topics (pick up to 3)</SectionLabel>
              <div className="flex flex-wrap gap-2">
                {TOPICS.map(t => (
                  <TagPill
                    key={t}
                    label={t}
                    selected={data.topics.includes(t)}
                    onClick={() => toggleTopic(t)}
                  />
                ))}
              </div>
            </div>
          </div>

          <Nav
            canNext={!!data.firstName.trim() && !!data.role && data.topics.length > 0}
            onNext={next}
          />
        </StepCard>
      )

      /* ── Step 2 — Message ───────────────────────────────── */
      case 2: return (
        <StepCard>
          <StepHeader
            headline="What do you help people with?"
            sub="Your one-liner becomes your positioning statement with podcast hosts"
          />

          <div className="space-y-4">
            <div>
              <SectionLabel>Your one-liner</SectionLabel>
              <p className="text-xs text-muted-foreground mb-2">
                Try: <em>"I help [who] achieve [result] through [method]"</em>
              </p>
              <StepTextarea
                value={data.oneLiner}
                onChange={v => set("oneLiner", v)}
                placeholder="I help entrepreneurs build scalable systems through lean automation…"
                rows={3}
                wordLimit={50}
              />
            </div>

            <AnimatePresence>
              {data.oneLiner.trim().length > 15 && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{    opacity: 0, y: 8 }}
                  className="rounded-xl border border-primary/25 bg-primary/5 p-4"
                >
                  <p className="text-[10px] font-semibold text-primary/60 uppercase tracking-widest mb-1.5">
                    Your positioning preview
                  </p>
                  <p className="text-sm text-foreground leading-relaxed">{data.oneLiner}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Nav canNext={data.oneLiner.trim().length > 15} onNext={next} onBack={back} />
        </StepCard>
      )

      /* ── Step 3 — Audience ──────────────────────────────── */
      case 3: return (
        <StepCard>
          <StepHeader
            headline="Who do you help, and how?"
            sub="These answers power your AI match scores — be specific"
          />

          <div className="space-y-6">
            <div>
              <SectionLabel>The #1 challenge your audience faces</SectionLabel>
              <StepTextarea
                value={data.challenge}
                onChange={v => set("challenge", v)}
                placeholder="e.g. They struggle to convert leads into clients because they lack a repeatable sales process…"
                rows={3}
                wordLimit={60}
              />
            </div>

            <div>
              <SectionLabel>The transformation you create</SectionLabel>
              <StepTextarea
                value={data.outcome}
                onChange={v => set("outcome", v)}
                placeholder="e.g. They go from inconsistent revenue to a predictable 6-figure pipeline within 90 days…"
                rows={3}
                wordLimit={60}
              />
            </div>
          </div>

          <Nav
            canNext={data.challenge.trim().length > 20 && data.outcome.trim().length > 20}
            onNext={next}
            onBack={back}
          />
        </StepCard>
      )

      /* ── Step 4 — Match Reveal ──────────────────────────── */
      case 4: return (
        <StepCard>
          <StepHeader
            headline="Here are your first matches"
            sub={`Based on your topics in ${data.topics.slice(0,2).join(" & ")} — complete your profile to unlock more`}
          />

          {matches.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-12">
              <Loader2 className="size-6 text-primary animate-spin" />
              <p className="text-sm text-muted-foreground">Finding your best matches…</p>
            </div>
          ) : (
            <div className="space-y-3">
              {matches.map((pod, i) => (
                <motion.div
                  key={pod.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1,  y: 0  }}
                  transition={{ delay: i * 0.08 }}
                >
                  <MatchCard podcast={pod} locked={i >= 3} />
                </motion.div>
              ))}
            </div>
          )}

          {matches.length > 0 && (
            <p className="mt-4 text-center text-xs text-muted-foreground">
              {matches.length} matches found · Add your website and bio to unlock full access
            </p>
          )}

          <Nav canNext={true} onNext={next} onBack={back} nextLabel="Boost my score →" />
        </StepCard>
      )

      /* ── Step 5 — Authority Boost ───────────────────────── */
      case 5: {
        const current = score ?? previewScore(data)
        const hasWeb  = data.website.trim().length > 4
        const hasBio  = data.bio.trim().length > 50

        return (
          <StepCard>
            <StepHeader
              headline="Boost your visibility score"
              sub="Two quick fields that unlock your biggest point gains"
            />

            <div className="flex items-start gap-6 mb-8">
              <div className="shrink-0">
                <ScoreRing score={current.total} size={88} />
                <p className="text-center text-[10px] text-muted-foreground mt-2">Visibility Score</p>
              </div>
              <div className="flex-1 space-y-2 pt-1">
                <BoostBadge pts={8} done={hasWeb}  label="Website added" />
                <BoostBadge pts={5} done={hasBio}  label="Bio written" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Score updates live as you fill in fields.
                </p>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <SectionLabel>Your website</SectionLabel>
                <div className="relative flex items-center">
                  <Globe className="absolute left-3.5 size-4 text-muted-foreground/40 pointer-events-none" />
                  <input
                    type="url"
                    value={data.website}
                    onChange={e => set("website", e.target.value)}
                    placeholder="https://yourwebsite.com"
                    className={cn(
                      "w-full pl-10 pr-4 py-3 rounded-xl border border-border/40 bg-card/50",
                      "text-sm text-foreground placeholder:text-muted-foreground/50",
                      "focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                    )}
                  />
                </div>
              </div>

              <div>
                <SectionLabel>Short bio (50+ chars)</SectionLabel>
                <StepTextarea
                  value={data.bio}
                  onChange={v => set("bio", v)}
                  placeholder="Tell podcast hosts who you are, what you do, and why you're a compelling guest…"
                  rows={4}
                  wordLimit={120}
                />
              </div>
            </div>

            <Nav canNext={true} onNext={next} onBack={back} nextLabel="See my results →" />
          </StepCard>
        )
      }

      /* ── Step 6 — Activation ────────────────────────────── */
      case 6: {
        const final = score ?? previewScore(data)
        return (
          <StepCard>
            <div className="text-center mb-6">
              <motion.div
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1,   opacity: 1   }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="flex justify-center mb-4"
              >
                <div className="relative">
                  <ScoreRing score={final.total} size={112} />
                  {!isSaving && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[oklch(0.55_0.16_145)] flex items-center justify-center"
                    >
                      <CheckCircle2 className="size-4 text-white" />
                    </motion.div>
                  )}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0  }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-2xl font-bold text-foreground mb-1">
                  {isSaving ? "Building your profile…" : "You're ready to get booked"}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {isSaving
                    ? "Saving your profile and generating matches…"
                    : `Your Visibility Score is ${final.total} — here's what we found`
                  }
                </p>
              </motion.div>
            </div>

            {isSaving ? (
              <div className="flex justify-center py-8">
                <Loader2 className="size-6 text-primary animate-spin" />
              </div>
            ) : (
              <>
                {/* Score breakdown */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6"
                >
                  {[
                    { label: "Authority",  val: final.authority, max: 25 },
                    { label: "Clarity",    val: final.clarity,   max: 20 },
                    { label: "Audience",   val: final.audience,  max: 20 },
                    { label: "Readiness",  val: final.readiness, max: 20 },
                  ].map(({ label, val, max }) => (
                    <div key={label} className="rounded-xl border border-border/40 bg-card/50 p-3 text-center">
                      <div className="text-lg font-bold text-foreground">{Math.round(val / max * 100)}</div>
                      <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</div>
                    </div>
                  ))}
                </motion.div>

                {/* Matched podcasts preview */}
                {matches.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0  }}
                    transition={{ delay: 0.5 }}
                    className="mb-6"
                  >
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                      <TrendingUp className="size-3.5 text-primary" />
                      Your top matches — now fully unlocked
                    </p>
                    <div className="space-y-2">
                      {matches.slice(0, 3).map(pod => (
                        <MatchCard key={pod.id} podcast={pod} />
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* CTAs */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0   }}
                  transition={{ delay: 0.6 }}
                  className="flex flex-col sm:flex-row gap-3"
                >
                  <button
                    onClick={() => router.push("/dashboard/discover")}
                    className="flex-1 flex items-center justify-center gap-2 py-3 px-6
                               rounded-xl text-sm font-semibold
                               bg-primary text-primary-foreground
                               shadow-[0_0_24px_oklch(var(--primary)/0.35)]
                               hover:bg-primary/90 hover:shadow-[0_0_32px_oklch(var(--primary)/0.45)]
                               transition-all duration-200"
                  >
                    View Matches <ArrowRight className="size-4" />
                  </button>
                  <button
                    onClick={() => router.push("/dashboard")}
                    className="flex-1 flex items-center justify-center gap-2 py-3 px-6
                               rounded-xl text-sm font-semibold
                               border border-border/50 bg-muted/40 text-foreground
                               hover:border-border hover:bg-muted/60
                               transition-all duration-200"
                  >
                    Go to Dashboard
                  </button>
                </motion.div>
              </>
            )}
          </StepCard>
        )
      }

      default: return null
    }
  }

  return (
    <ProgressShell step={step}>
      <AnimatePresence mode="wait" custom={dir}>
        <motion.div
          key={step}
          custom={dir}
          variants={stepVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
        >
          {renderStep()}
        </motion.div>
      </AnimatePresence>

      {/* Micro-win toast */}
      <AnimatePresence>
        {microWin && (
          <MicroWinToast
            key={microWin + step}
            message={microWin}
            onDone={() => setMicroWin(null)}
          />
        )}
      </AnimatePresence>
    </ProgressShell>
  )
}

/* ── Nav button ──────────────────────────────────────────────── */

function Nav({
  canNext,
  onNext,
  onBack,
  nextLabel = "Continue →",
}: {
  canNext:    boolean
  onNext:     () => void
  onBack?:    () => void
  nextLabel?: string
}) {
  return (
    <div className="flex items-center justify-between pt-6 mt-2">
      {onBack ? (
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground
                     transition-colors rounded-lg hover:bg-muted/30"
        >
          ← Back
        </button>
      ) : (
        <div />
      )}
      <button
        type="button"
        onClick={onNext}
        disabled={!canNext}
        className={cn(
          "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200",
          canNext
            ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_20px_oklch(var(--primary)/0.30)] hover:shadow-[0_0_28px_oklch(var(--primary)/0.40)]"
            : "bg-muted/40 text-muted-foreground cursor-not-allowed"
        )}
      >
        {nextLabel}
      </button>
    </div>
  )
}
