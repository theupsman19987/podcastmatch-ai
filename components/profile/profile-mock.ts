/* ═══════════════════════════════════════════════════════════
   Creator Profile + AI Brand Identity — mock data + types.
   Replace MOCK_CREATOR with a real API/session fetch in
   profile-context.tsx when the backend is ready.
   ═══════════════════════════════════════════════════════════ */

export type VisibilityTier = "very-high" | "high" | "medium" | "growing"

export interface SocialLinks {
  instagram: string
  linkedin:  string
  website:   string
  youtube:   string
}

export interface CreatorFormData {
  name:         string
  title:        string
  bio:          string
  topics:       string[]
  audienceGoal: string
  keywords:     string[]
  socialLinks:  SocialLinks
}

export interface StrengthDimension {
  id:          string
  label:       string
  value:       number       // 0–100
  description: string
  color:       "primary" | "cyan" | "gold" | "green" | "purple"
  insight:     string
}

export interface CategoryAlignment {
  id:              string
  label:           string
  emoji:           string
  alignment:       number        // 0–100
  visibility:      VisibilityTier
  trending:        boolean
  aiRecommended:   boolean
  description:     string
  podcastCount:    number        // matching podcasts
}

export interface AIProfileInsight {
  id:          string
  title:       string
  body:        string
  confidence:  number
  tone:        "positive" | "opportunity" | "info"
}

export interface ProfileRecommendation {
  id:      string
  title:   string
  body:    string
  action:  string
  color:   "primary" | "cyan" | "gold" | "green"
  badge:   string
}

/* ── Mock creator data ────────────────────────────────────── */
export const MOCK_CREATOR: CreatorFormData = {
  name:  "Jordan Mills",
  title: "Leadership Speaker & Mindset Coach",
  bio:   "I help driven professionals unlock their full leadership potential through mindset shifts, strategic thinking, and faith-grounded resilience. Over 8 years speaking at conferences, hosting corporate trainings, and building community for growth-oriented leaders.",
  topics: [
    "Leadership Development",
    "Mindset Mastery",
    "Faith & Business",
    "Resilience Building",
    "Executive Presence",
    "Team Dynamics",
  ],
  audienceGoal: "Grow authority in the leadership and mindset space through high-alignment podcast appearances that reach ambitious professionals and faith-driven entrepreneurs.",
  keywords: [
    "leadership", "mindset", "entrepreneurship", "faith-driven",
    "resilience", "executive", "growth", "coaching", "speaker",
    "business", "personal development", "transformation",
  ],
  socialLinks: {
    instagram: "@jordanmillsleads",
    linkedin:  "linkedin.com/in/jordanmills",
    website:   "jordanmills.com",
    youtube:   "@jordanmillsspeaks",
  },
}

/* ── Creator identity meta ────────────────────────────────── */
export const CREATOR_META = {
  visibilityScore:    78,
  aiAlignmentScore:   91,
  profileComplete:    72,           // %
  creatorType:        "Leadership Authority",
  aiDetectedType:     "Mindset & Business Expert",
  typeMatchScore:     88,           // how aligned user-declared vs AI-detected
  audienceSize:       "12K–18K",    // estimated reach per episode
  creatorMomentum:    "+23%",
  totalPodcastFits:   47,           // podcasts matching profile
  topNiche:           "Leadership",
  lastAIScan:         "2 hours ago",
  memberSince:        "Oct 2023",
  completionItems: [
    { label: "Add a speaking reel link",          done: false },
    { label: "Upload a professional headshot",    done: false },
    { label: "Add 3 more creator keywords",       done: false },
    { label: "Verify your social profiles",       done: false },
    { label: "Complete your audience profile",    done: true  },
    { label: "Set podcast category preferences",  done: true  },
    { label: "Write your creator bio",            done: true  },
  ],
}

/* ── Strength dimensions ──────────────────────────────────── */
export const MOCK_STRENGTHS: StrengthDimension[] = [
  {
    id:          "audience-match",
    label:       "Audience Match",
    value:       87,
    description: "How well your content resonates with target listener demographics",
    color:       "primary",
    insight:     "Top 20% of creators",
  },
  {
    id:          "visibility",
    label:       "Visibility Potential",
    value:       78,
    description: "Platform-wide visibility score based on profile strength and activity",
    color:       "cyan",
    insight:     "+12% this month",
  },
  {
    id:          "topic-authority",
    label:       "Topic Authority",
    value:       91,
    description: "Depth and credibility signals within your primary content niche",
    color:       "gold",
    insight:     "All-time high",
  },
  {
    id:          "podcast-compat",
    label:       "Podcast Compatibility",
    value:       84,
    description: "AI match quality across your saved and discovered podcasts",
    color:       "green",
    insight:     "47 strong matches",
  },
  {
    id:          "momentum",
    label:       "Creator Momentum",
    value:       70,
    description: "Growth velocity across outreach, matches, and platform engagement",
    color:       "purple",
    insight:     "+23% growth",
  },
]

/* ── Category alignments ──────────────────────────────────── */
export const MOCK_CATEGORIES: CategoryAlignment[] = [
  {
    id:            "mindset",
    label:         "Mindset",
    emoji:         "🧠",
    alignment:     94,
    visibility:    "high",
    trending:      true,
    aiRecommended: true,
    description:   "Your mindset content shows the deepest keyword and audience overlap across matched podcasts.",
    podcastCount:  18,
  },
  {
    id:            "leadership",
    label:         "Leadership",
    emoji:         "🎯",
    alignment:     92,
    visibility:    "very-high",
    trending:      false,
    aiRecommended: true,
    description:   "Highest visibility potential. Leadership podcast audiences align strongly with your speaker profile.",
    podcastCount:  14,
  },
  {
    id:            "personal-dev",
    label:         "Personal Development",
    emoji:         "🌱",
    alignment:     89,
    visibility:    "high",
    trending:      false,
    aiRecommended: true,
    description:   "Strong fit with personal development audiences actively seeking expert guests.",
    podcastCount:  22,
  },
  {
    id:            "business",
    label:         "Business",
    emoji:         "💼",
    alignment:     87,
    visibility:    "high",
    trending:      false,
    aiRecommended: false,
    description:   "Growing alignment. Your entrepreneurship and executive content resonates with business audiences.",
    podcastCount:  16,
  },
  {
    id:            "faith",
    label:         "Faith & Spirituality",
    emoji:         "✨",
    alignment:     78,
    visibility:    "growing",
    trending:      false,
    aiRecommended: false,
    description:   "Faith-grounded messaging increasing in alignment as this category's audience expands.",
    podcastCount:  9,
  },
  {
    id:            "health",
    label:         "Health & Wellness",
    emoji:         "💪",
    alignment:     71,
    visibility:    "medium",
    trending:      true,
    aiRecommended: false,
    description:   "Emerging alignment through resilience and mental performance content crossover.",
    podcastCount:  7,
  },
]

/* ── AI profile insights ──────────────────────────────────── */
export const MOCK_PROFILE_INSIGHTS: AIProfileInsight[] = [
  {
    id:         "pi1",
    title:      "Strongest Alignment: Leadership + Mindset",
    body:       "Your creator profile shows a 92–94% alignment with leadership and mindset podcasts — your highest-performing combination on the platform.",
    confidence: 94,
    tone:       "positive",
  },
  {
    id:         "pi2",
    title:      "Business Compatibility Rising",
    body:       "Audience compatibility with Business podcasts grew 8% over the past 30 days, likely driven by your entrepreneurship and executive presence content.",
    confidence: 87,
    tone:       "opportunity",
  },
  {
    id:         "pi3",
    title:      "Faith-Based Visibility Trending Up",
    body:       "Faith-driven podcast audiences are showing above-average growth this quarter. Your faith-grounded messaging positions you well for emerging visibility windows.",
    confidence: 82,
    tone:       "opportunity",
  },
  {
    id:         "pi4",
    title:      "Creator Momentum: Top 15% on Platform",
    body:       "Based on outreach activity, match quality growth, and profile engagement, your creator momentum is in the top 15% of all active creators this month.",
    confidence: 91,
    tone:       "positive",
  },
]

/* ── Profile recommendations ──────────────────────────────── */
export const MOCK_PROFILE_RECS: ProfileRecommendation[] = [
  {
    id:     "pr1",
    title:  "Expand Into Leadership Speaking Category",
    body:   "AI detected 14 Leadership podcasts with 90%+ match scores actively booking. Your authority signal is strong — pitch now.",
    action: "View Matches",
    color:  "primary",
    badge:  "High Visibility",
  },
  {
    id:     "pr2",
    title:  "Add 3 Keywords to Boost Business Alignment",
    body:   "Adding 'executive coaching', 'C-suite', and 'strategic leadership' to your keywords could raise Business category alignment from 87% to 93%.",
    action: "Edit Keywords",
    color:  "cyan",
    badge:  "Quick Win",
  },
  {
    id:     "pr3",
    title:  "Mindset Content Is Trending This Week",
    body:   "3 high-traffic mindset podcasts opened guest booking windows. Your 94% alignment makes these your highest-probability outreach targets.",
    action: "Pitch Now",
    color:  "gold",
    badge:  "Act Fast",
  },
  {
    id:     "pr4",
    title:  "Add Speaking Reel to Reach Score 95%",
    body:   "A media kit link and speaking reel video would raise your profile completeness from 72% to 95%, unlocking 8 additional AI-matched podcasts.",
    action: "Update Profile",
    color:  "green",
    badge:  "Profile Boost",
  },
]
