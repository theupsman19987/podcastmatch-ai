/* ═══════════════════════════════════════════════════════════
   Saved Opportunities + AI Watchlist — mock data + types.
   Replace MOCK_SAVED with a real API/database fetch in
   saved-context.tsx when the backend is ready.
   ═══════════════════════════════════════════════════════════ */

export type TrackingStatus   = "watching" | "high-priority" | "contacted" | "scheduled"
export type AlertSignal      = "host-active" | "audience-growing" | "opportunity-increasing" | "recently-updated"
export type SavedBadge       = "trending" | "ai-recommended" | "growing-audience" | "high-opportunity"
export type VisibilityTier   = "very-high" | "high" | "medium" | "growing"
export type HostActivityFreq = "weekly" | "biweekly" | "monthly"

export type SortMode         = "match" | "recent" | "host-activity" | "opportunity"
export type FilterStatus     = "all" | TrackingStatus

export interface SavedOpportunity {
  id:                  string
  name:                string
  host:                string
  categories:          string[]
  matchScore:          number       // 70–99
  audienceAlignment:   number       // 0–100
  audienceSize:        number       // in thousands
  hostActivity:        HostActivityFreq
  visibilityPotential: VisibilityTier
  coverIndex:          number       // 0–5 → COVER_GRADIENTS
  savedDate:           string       // display string
  savedTimestamp:      number       // ms — used for "Recent" sort
  trackingStatus:      TrackingStatus
  badges:              SavedBadge[]
  alerts:              AlertSignal[]
  audienceGrowth:      number       // % delta (positive = growing)
  lastActivity:        string       // e.g. "Published 2 days ago"
}

export const MOCK_SAVED: SavedOpportunity[] = [
  {
    id: "3",
    name: "Tech Startup Insider",
    host: "James Park",
    categories: ["Technology", "Entrepreneurship"],
    matchScore: 96,
    audienceAlignment: 94,
    audienceSize: 67,
    hostActivity: "weekly",
    visibilityPotential: "very-high",
    coverIndex: 2,
    savedDate: "2 days ago",
    savedTimestamp: Date.now() - 2 * 86400000,
    trackingStatus: "high-priority",
    badges: ["ai-recommended", "high-opportunity"],
    alerts: ["host-active", "opportunity-increasing"],
    audienceGrowth: 31,
    lastActivity: "Published 2 days ago",
  },
  {
    id: "1",
    name: "The Founder's Mindset",
    host: "David Chen",
    categories: ["Entrepreneurship", "Business", "Mindset"],
    matchScore: 95,
    audienceAlignment: 92,
    audienceSize: 45,
    hostActivity: "weekly",
    visibilityPotential: "high",
    coverIndex: 0,
    savedDate: "4 days ago",
    savedTimestamp: Date.now() - 4 * 86400000,
    trackingStatus: "watching",
    badges: ["trending", "ai-recommended"],
    alerts: ["recently-updated", "audience-growing"],
    audienceGrowth: 23,
    lastActivity: "Published 4 days ago",
  },
  {
    id: "6",
    name: "Faith & Business",
    host: "Marcus Webb",
    categories: ["Faith", "Business", "Entrepreneurship"],
    matchScore: 91,
    audienceAlignment: 89,
    audienceSize: 34,
    hostActivity: "weekly",
    visibilityPotential: "medium",
    coverIndex: 5,
    savedDate: "1 week ago",
    savedTimestamp: Date.now() - 7 * 86400000,
    trackingStatus: "contacted",
    badges: ["ai-recommended"],
    alerts: ["host-active"],
    audienceGrowth: 12,
    lastActivity: "Published 1 week ago",
  },
  {
    id: "9",
    name: "Recovery Stories",
    host: "Emma Castillo",
    categories: ["Health & Wellness", "Personal Development"],
    matchScore: 92,
    audienceAlignment: 91,
    audienceSize: 19,
    hostActivity: "weekly",
    visibilityPotential: "growing",
    coverIndex: 2,
    savedDate: "1 week ago",
    savedTimestamp: Date.now() - 8 * 86400000,
    trackingStatus: "watching",
    badges: ["growing-audience", "ai-recommended"],
    alerts: ["audience-growing", "opportunity-increasing"],
    audienceGrowth: 44,
    lastActivity: "Published 5 days ago",
  },
  {
    id: "2",
    name: "Leadership Lab",
    host: "Sarah Mitchell",
    categories: ["Leadership", "Business"],
    matchScore: 89,
    audienceAlignment: 85,
    audienceSize: 128,
    hostActivity: "weekly",
    visibilityPotential: "high",
    coverIndex: 1,
    savedDate: "2 weeks ago",
    savedTimestamp: Date.now() - 14 * 86400000,
    trackingStatus: "scheduled",
    badges: ["high-opportunity"],
    alerts: [],
    audienceGrowth: 8,
    lastActivity: "Published 1 week ago",
  },
  {
    id: "11",
    name: "The Resilience Project",
    host: "Dr. Michael Santos",
    categories: ["Personal Development", "Mindset"],
    matchScore: 90,
    audienceAlignment: 87,
    audienceSize: 31,
    hostActivity: "biweekly",
    visibilityPotential: "growing",
    coverIndex: 4,
    savedDate: "2 weeks ago",
    savedTimestamp: Date.now() - 15 * 86400000,
    trackingStatus: "watching",
    badges: ["ai-recommended"],
    alerts: ["recently-updated"],
    audienceGrowth: 19,
    lastActivity: "Published 10 days ago",
  },
  {
    id: "7",
    name: "Women in Leadership",
    host: "Dr. Priya Nair",
    categories: ["Leadership", "Personal Development"],
    matchScore: 87,
    audienceAlignment: 86,
    audienceSize: 78,
    hostActivity: "weekly",
    visibilityPotential: "high",
    coverIndex: 0,
    savedDate: "3 weeks ago",
    savedTimestamp: Date.now() - 21 * 86400000,
    trackingStatus: "watching",
    badges: ["trending", "high-opportunity"],
    alerts: ["audience-growing"],
    audienceGrowth: 28,
    lastActivity: "Published 3 days ago",
  },
  {
    id: "12",
    name: "Future of Work",
    host: "Nina Yamamoto",
    categories: ["Technology", "Leadership"],
    matchScore: 85,
    audienceAlignment: 83,
    audienceSize: 63,
    hostActivity: "weekly",
    visibilityPotential: "high",
    coverIndex: 5,
    savedDate: "1 month ago",
    savedTimestamp: Date.now() - 30 * 86400000,
    trackingStatus: "high-priority",
    badges: ["growing-audience"],
    alerts: ["opportunity-increasing", "audience-growing"],
    audienceGrowth: 16,
    lastActivity: "Published 2 days ago",
  },
]

/* Quick stats derived from mock data */
export const WATCHLIST_STATS = {
  total:        MOCK_SAVED.length,
  tracking:     MOCK_SAVED.filter(o => o.trackingStatus !== "contacted" && o.trackingStatus !== "scheduled").length,
  highPriority: MOCK_SAVED.filter(o => o.trackingStatus === "high-priority").length,
  contacted:    MOCK_SAVED.filter(o => o.trackingStatus === "contacted").length,
  scheduled:    MOCK_SAVED.filter(o => o.trackingStatus === "scheduled").length,
  withAlerts:   MOCK_SAVED.filter(o => o.alerts.length > 0).length,
}

/* Active AI alerts — shown in the alert panel */
export interface AIAlert {
  id:      string
  podcastName: string
  type:    AlertSignal
  message: string
  time:    string
}

export const MOCK_AI_ALERTS: AIAlert[] = [
  {
    id: "a1",
    podcastName: "Tech Startup Insider",
    type: "host-active",
    message: "Host published a new episode and is actively booking guests this week",
    time: "2 hours ago",
  },
  {
    id: "a2",
    podcastName: "Women in Leadership",
    type: "audience-growing",
    message: "Audience grew +28% in the last 7 days — visibility window is opening",
    time: "Yesterday",
  },
  {
    id: "a3",
    podcastName: "Recovery Stories",
    type: "opportunity-increasing",
    message: "Listener engagement up 41% — strong moment to pitch this week",
    time: "2 days ago",
  },
  {
    id: "a4",
    podcastName: "The Founder's Mindset",
    type: "recently-updated",
    message: "Your AI match score improved to 97% based on your updated profile",
    time: "3 days ago",
  },
]
