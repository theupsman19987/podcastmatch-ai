/* ═══════════════════════════════════════════════════════════
   Discovery Engine — mock data + TypeScript types
   Replace MOCK_PODCASTS with API response when backend is live.
   All filtering, sorting, and display logic reads from these types.
   ═══════════════════════════════════════════════════════════ */

export type HostActivity      = "weekly" | "biweekly" | "monthly"
export type GuestAcceptance   = "open" | "selective"
export type VisibilityTier    = "very-high" | "high" | "medium" | "growing"
export type PodcastBadge      = "trending" | "high-engagement" | "fast-growing" | "ai-recommended"

export interface DiscoveryPodcast {
  id:                  string
  name:                string
  host:                string
  description:         string
  categories:          string[]
  matchScore:          number           // 70–99
  audienceSize:        number           // in thousands
  audienceAlignment:   number           // 0–100
  hostActivity:        HostActivity
  guestAcceptance:     GuestAcceptance
  visibilityPotential: VisibilityTier
  badges:              PodcastBadge[]
  coverIndex:          number           // 0–5, maps to COVER_GRADIENTS
  saved:               boolean
}

export interface DiscoveryFilters {
  categories:          string[]
  audienceSize:        string   // "any" | "<10k" | "10-50k" | "50-100k" | "100k+"
  hostActivity:        string   // "any" | "weekly" | "biweekly" | "monthly"
  guestAcceptance:     string   // "any" | "open" | "selective"
  minMatch:            number   // 0 | 70 | 80 | 85 | 90
  visibilityPotential: string   // "any" | "very-high" | "high" | "medium" | "growing"
}

export const DEFAULT_FILTERS: DiscoveryFilters = {
  categories:          [],
  audienceSize:        "any",
  hostActivity:        "any",
  guestAcceptance:     "any",
  minMatch:            0,
  visibilityPotential: "any",
}

/* Six gradient cover styles — index 0–5 */
export const COVER_GRADIENTS = [
  "linear-gradient(135deg, oklch(0.58 0.220 255), oklch(0.70 0.160 200))",   // blue → cyan
  "linear-gradient(135deg, oklch(0.55 0.180 83),  oklch(0.78 0.150 83))",    // amber → gold
  "linear-gradient(135deg, oklch(0.52 0.180 290), oklch(0.58 0.220 255))",   // violet → blue
  "linear-gradient(135deg, oklch(0.48 0.160 160), oklch(0.65 0.160 200))",   // teal → cyan
  "linear-gradient(135deg, oklch(0.60 0.200 30),  oklch(0.52 0.180 290))",   // orange → violet
  "linear-gradient(135deg, oklch(0.42 0.200 280), oklch(0.58 0.220 255))",   // indigo → blue
] as const

export const ALL_CATEGORIES = [
  "Business",
  "Entrepreneurship",
  "Leadership",
  "Technology",
  "Personal Development",
  "Health & Wellness",
  "Faith",
  "Marketing",
  "Mindset",
]

export const MOCK_PODCASTS: DiscoveryPodcast[] = [
  {
    id: "1",
    name: "The Founder's Mindset",
    host: "David Chen",
    description: "Weekly conversations with founders about building resilient businesses and mental strength in the startup journey.",
    categories: ["Entrepreneurship", "Business", "Mindset"],
    matchScore: 95,
    audienceSize: 45,
    audienceAlignment: 92,
    hostActivity: "weekly",
    guestAcceptance: "open",
    visibilityPotential: "high",
    badges: ["ai-recommended", "trending"],
    coverIndex: 0,
    saved: false,
  },
  {
    id: "2",
    name: "Leadership Lab",
    host: "Sarah Mitchell",
    description: "Evidence-based leadership strategies for modern executives and team builders navigating complex organizations.",
    categories: ["Leadership", "Business"],
    matchScore: 89,
    audienceSize: 128,
    audienceAlignment: 85,
    hostActivity: "weekly",
    guestAcceptance: "selective",
    visibilityPotential: "high",
    badges: ["high-engagement"],
    coverIndex: 1,
    saved: true,
  },
  {
    id: "3",
    name: "Tech Startup Insider",
    host: "James Park",
    description: "Real talk from tech founders about product-market fit, AI-driven growth, and what it actually takes to scale.",
    categories: ["Technology", "Entrepreneurship"],
    matchScore: 96,
    audienceSize: 67,
    audienceAlignment: 94,
    hostActivity: "weekly",
    guestAcceptance: "open",
    visibilityPotential: "very-high",
    badges: ["ai-recommended", "fast-growing"],
    coverIndex: 2,
    saved: false,
  },
  {
    id: "4",
    name: "Mindset Mastery",
    host: "Dr. Lisa Torres",
    description: "Deep psychology and neuroscience-backed conversations for peak mental performance and lasting personal growth.",
    categories: ["Personal Development", "Mindset"],
    matchScore: 88,
    audienceSize: 23,
    audienceAlignment: 88,
    hostActivity: "biweekly",
    guestAcceptance: "open",
    visibilityPotential: "growing",
    badges: [],
    coverIndex: 3,
    saved: false,
  },
  {
    id: "5",
    name: "The Creator Economy",
    host: "Marco Rivera",
    description: "Monetization, audience building, and creative business models for independent creators building in public.",
    categories: ["Business", "Marketing"],
    matchScore: 84,
    audienceSize: 92,
    audienceAlignment: 82,
    hostActivity: "weekly",
    guestAcceptance: "selective",
    visibilityPotential: "high",
    badges: ["trending"],
    coverIndex: 4,
    saved: false,
  },
  {
    id: "6",
    name: "Faith & Business",
    host: "Marcus Webb",
    description: "Where faith meets entrepreneurship — purpose-driven business conversations that honor your values and your vision.",
    categories: ["Faith", "Business", "Entrepreneurship"],
    matchScore: 91,
    audienceSize: 34,
    audienceAlignment: 89,
    hostActivity: "weekly",
    guestAcceptance: "open",
    visibilityPotential: "medium",
    badges: ["ai-recommended"],
    coverIndex: 5,
    saved: false,
  },
  {
    id: "7",
    name: "Women in Leadership",
    host: "Dr. Priya Nair",
    description: "Amplifying women's voices in executive spaces, boardrooms, and entrepreneurship with real stories and strategy.",
    categories: ["Leadership", "Personal Development"],
    matchScore: 87,
    audienceSize: 78,
    audienceAlignment: 86,
    hostActivity: "weekly",
    guestAcceptance: "open",
    visibilityPotential: "high",
    badges: ["high-engagement", "trending"],
    coverIndex: 0,
    saved: false,
  },
  {
    id: "8",
    name: "Growth Hacking Decoded",
    host: "Alex Hoffman",
    description: "Tactical growth strategies, data-driven marketing frameworks, and viral product mechanics for B2B and B2C.",
    categories: ["Marketing", "Business"],
    matchScore: 83,
    audienceSize: 41,
    audienceAlignment: 80,
    hostActivity: "biweekly",
    guestAcceptance: "selective",
    visibilityPotential: "medium",
    badges: [],
    coverIndex: 1,
    saved: false,
  },
  {
    id: "9",
    name: "Recovery Stories",
    host: "Emma Castillo",
    description: "Honest, healing conversations about addiction recovery, resilience, mental health, and building life after hardship.",
    categories: ["Health & Wellness", "Personal Development"],
    matchScore: 92,
    audienceSize: 19,
    audienceAlignment: 91,
    hostActivity: "weekly",
    guestAcceptance: "open",
    visibilityPotential: "growing",
    badges: ["ai-recommended", "fast-growing"],
    coverIndex: 2,
    saved: false,
  },
  {
    id: "10",
    name: "Bold Moves Podcast",
    host: "Ryan Carter",
    description: "Stories of calculated risk-taking, massive pivots, and building audacious businesses in uncertain markets.",
    categories: ["Entrepreneurship", "Business"],
    matchScore: 86,
    audienceSize: 55,
    audienceAlignment: 84,
    hostActivity: "weekly",
    guestAcceptance: "open",
    visibilityPotential: "high",
    badges: ["trending"],
    coverIndex: 3,
    saved: false,
  },
  {
    id: "11",
    name: "The Resilience Project",
    host: "Dr. Michael Santos",
    description: "Building emotional resilience through adversity — real stories from leaders who broke and rebuilt stronger.",
    categories: ["Personal Development", "Health & Wellness", "Mindset"],
    matchScore: 90,
    audienceSize: 31,
    audienceAlignment: 87,
    hostActivity: "biweekly",
    guestAcceptance: "open",
    visibilityPotential: "growing",
    badges: ["ai-recommended"],
    coverIndex: 4,
    saved: false,
  },
  {
    id: "12",
    name: "Future of Work",
    host: "Nina Yamamoto",
    description: "The evolving workplace — AI transformation, remote culture, and leadership in distributed, global teams.",
    categories: ["Technology", "Leadership", "Business"],
    matchScore: 85,
    audienceSize: 63,
    audienceAlignment: 83,
    hostActivity: "weekly",
    guestAcceptance: "selective",
    visibilityPotential: "high",
    badges: ["high-engagement", "fast-growing"],
    coverIndex: 5,
    saved: false,
  },
]
