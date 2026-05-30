/* ═══════════════════════════════════════════════════════════
   Outreach Pipeline — mock data + types.
   Swap MOCK_OUTREACH with a real API/database fetch in
   outreach-context.tsx when the backend is ready.
   ═══════════════════════════════════════════════════════════ */

export type OutreachStage =
  | "new"
  | "ready"
  | "contacted"
  | "responded"
  | "booked"
  | "completed"

export type OutreachBadgeType =
  | "high-priority"
  | "ai-recommended"
  | "fast-responder"
  | "growing-audience"

export type AIInsightType =
  | "host-active"
  | "high-response"
  | "strong-alignment"
  | "best-window"
  | "trending"

export type SortMode    = "match" | "recent" | "response" | "audience"
export type FilterStage = OutreachStage | "all"

export interface OutreachEntry {
  id:                  string
  podcastName:         string
  hostName:            string
  categories:          string[]
  matchScore:          number       // 70–99
  audienceAlignment:   number       // 0–100
  audienceSize:        number       // thousands
  stage:               OutreachStage
  badges:              OutreachBadgeType[]
  insights:            AIInsightType[]
  responseRate:        number       // predicted % likelihood
  lastActivity:        string
  outreachDate?:       string       // display string — set when stage ≥ "contacted"
  coverIndex:          number       // 0–5
  visibilityPotential: "very-high" | "high" | "medium" | "growing"
  savedTimestamp:      number       // ms
  notes?:              string
}

export interface ActivityEntry {
  id:          string
  type:        "saved" | "host-active" | "stage-moved" | "momentum" | "response" | "booked"
  podcastName: string
  message:     string
  time:        string
  highlight:   boolean
}

/* ── Ordered stage list (used for "move to next" logic) ── */
export const STAGE_ORDER: OutreachStage[] = [
  "new", "ready", "contacted", "responded", "booked", "completed",
]

/* ── Stage display config (imported by board + badges) ─── */
export const STAGE_CONFIG: Record<
  OutreachStage,
  { label: string; shortLabel: string; color: string; bg: string; border: string; dot: string }
> = {
  new: {
    label:      "New Opportunities",
    shortLabel: "New",
    color:      "text-muted-foreground",
    bg:         "bg-muted/25",
    border:     "border-border/40",
    dot:        "bg-muted-foreground/60",
  },
  ready: {
    label:      "Ready for Outreach",
    shortLabel: "Ready",
    color:      "text-primary",
    bg:         "bg-primary/8",
    border:     "border-primary/25",
    dot:        "bg-primary",
  },
  contacted: {
    label:      "Contacted",
    shortLabel: "Contacted",
    color:      "text-[var(--premium-cyan)]",
    bg:         "bg-[oklch(0.70_0.16_200/0.08)]",
    border:     "border-[oklch(0.70_0.16_200/0.25)]",
    dot:        "bg-[var(--premium-cyan)]",
  },
  responded: {
    label:      "Responded",
    shortLabel: "Responded",
    color:      "text-[var(--premium-gold)]",
    bg:         "bg-[oklch(0.78_0.15_83/0.08)]",
    border:     "border-[oklch(0.78_0.15_83/0.25)]",
    dot:        "bg-[var(--premium-gold)]",
  },
  booked: {
    label:      "Booked",
    shortLabel: "Booked",
    color:      "text-[oklch(0.70_0.16_145)]",
    bg:         "bg-[oklch(0.55_0.16_145/0.08)]",
    border:     "border-[oklch(0.55_0.16_145/0.25)]",
    dot:        "bg-[oklch(0.65_0.15_145)]",
  },
  completed: {
    label:      "Completed",
    shortLabel: "Done",
    color:      "text-[oklch(0.60_0.12_200)]",
    bg:         "bg-[oklch(0.45_0.10_200/0.08)]",
    border:     "border-[oklch(0.45_0.10_200/0.20)]",
    dot:        "bg-[oklch(0.55_0.12_200)]",
  },
}

/* ── Mock outreach entries ───────────────────────────────── */
export const MOCK_OUTREACH: OutreachEntry[] = [
  /* ── New ────────────────────────────────────────────────── */
  {
    id: "3",
    podcastName:         "Tech Startup Insider",
    hostName:            "James Park",
    categories:          ["Technology", "Entrepreneurship"],
    matchScore:          96,
    audienceAlignment:   94,
    audienceSize:        67,
    stage:               "new",
    badges:              ["ai-recommended", "high-priority"],
    insights:            ["host-active", "best-window"],
    responseRate:        82,
    lastActivity:        "Published 2 days ago",
    coverIndex:          2,
    visibilityPotential: "very-high",
    savedTimestamp:      Date.now() - 2 * 86400000,
  },
  {
    id: "7",
    podcastName:         "Women in Leadership",
    hostName:            "Dr. Priya Nair",
    categories:          ["Leadership", "Personal Development"],
    matchScore:          87,
    audienceAlignment:   86,
    audienceSize:        78,
    stage:               "new",
    badges:              ["growing-audience"],
    insights:            ["strong-alignment", "trending"],
    responseRate:        64,
    lastActivity:        "Published 3 days ago",
    coverIndex:          0,
    visibilityPotential: "high",
    savedTimestamp:      Date.now() - 3 * 86400000,
  },
  {
    id: "12",
    podcastName:         "Future of Work",
    hostName:            "Nina Yamamoto",
    categories:          ["Technology", "Leadership"],
    matchScore:          85,
    audienceAlignment:   83,
    audienceSize:        63,
    stage:               "new",
    badges:              ["ai-recommended"],
    insights:            ["host-active"],
    responseRate:        71,
    lastActivity:        "Published 2 days ago",
    coverIndex:          5,
    visibilityPotential: "high",
    savedTimestamp:      Date.now() - 5 * 86400000,
  },
  /* ── Ready ──────────────────────────────────────────────── */
  {
    id: "1",
    podcastName:         "The Founder's Mindset",
    hostName:            "David Chen",
    categories:          ["Entrepreneurship", "Business", "Mindset"],
    matchScore:          95,
    audienceAlignment:   92,
    audienceSize:        45,
    stage:               "ready",
    badges:              ["ai-recommended", "high-priority"],
    insights:            ["high-response", "best-window"],
    responseRate:        79,
    lastActivity:        "Published 4 days ago",
    coverIndex:          0,
    visibilityPotential: "high",
    savedTimestamp:      Date.now() - 4 * 86400000,
    notes:               "Loves founder-led recovery stories. Mention the $2M ARR milestone.",
  },
  {
    id: "2",
    podcastName:         "Leadership Lab",
    hostName:            "Sarah Mitchell",
    categories:          ["Leadership", "Business"],
    matchScore:          89,
    audienceAlignment:   85,
    audienceSize:        128,
    stage:               "ready",
    badges:              ["fast-responder"],
    insights:            ["strong-alignment"],
    responseRate:        88,
    lastActivity:        "Published 1 week ago",
    coverIndex:          1,
    visibilityPotential: "high",
    savedTimestamp:      Date.now() - 14 * 86400000,
    notes:               "Sarah responds within 24 hrs. Pitch during Tuesday–Thursday window.",
  },
  /* ── Contacted ──────────────────────────────────────────── */
  {
    id: "6",
    podcastName:         "Faith & Business",
    hostName:            "Marcus Webb",
    categories:          ["Faith", "Business", "Entrepreneurship"],
    matchScore:          91,
    audienceAlignment:   89,
    audienceSize:        34,
    stage:               "contacted",
    badges:              ["ai-recommended"],
    insights:            ["host-active"],
    responseRate:        67,
    lastActivity:        "Outreach sent 3 days ago",
    outreachDate:        "3 days ago",
    coverIndex:          5,
    visibilityPotential: "medium",
    savedTimestamp:      Date.now() - 7 * 86400000,
  },
  {
    id: "9",
    podcastName:         "Recovery Stories",
    hostName:            "Emma Castillo",
    categories:          ["Health & Wellness", "Personal Development"],
    matchScore:          92,
    audienceAlignment:   91,
    audienceSize:        19,
    stage:               "contacted",
    badges:              ["growing-audience"],
    insights:            ["high-response", "trending"],
    responseRate:        74,
    lastActivity:        "Outreach sent 5 days ago",
    outreachDate:        "5 days ago",
    coverIndex:          2,
    visibilityPotential: "growing",
    savedTimestamp:      Date.now() - 8 * 86400000,
  },
  /* ── Responded ──────────────────────────────────────────── */
  {
    id: "11",
    podcastName:         "The Resilience Project",
    hostName:            "Dr. Michael Santos",
    categories:          ["Personal Development", "Mindset"],
    matchScore:          90,
    audienceAlignment:   87,
    audienceSize:        31,
    stage:               "responded",
    badges:              ["ai-recommended", "fast-responder"],
    insights:            ["high-response", "strong-alignment"],
    responseRate:        91,
    lastActivity:        "Replied 1 day ago",
    outreachDate:        "8 days ago",
    coverIndex:          4,
    visibilityPotential: "growing",
    savedTimestamp:      Date.now() - 15 * 86400000,
    notes:               "Interested! Requested a brief guest intro doc. Scheduling soon.",
  },
  /* ── Booked ─────────────────────────────────────────────── */
  {
    id: "b1",
    podcastName:         "Growth Mindset Weekly",
    hostName:            "Tara Singh",
    categories:          ["Mindset", "Entrepreneurship"],
    matchScore:          94,
    audienceAlignment:   90,
    audienceSize:        55,
    stage:               "booked",
    badges:              ["high-priority", "ai-recommended"],
    insights:            ["strong-alignment"],
    responseRate:        96,
    lastActivity:        "Recording on Jun 4",
    outreachDate:        "3 weeks ago",
    coverIndex:          3,
    visibilityPotential: "high",
    savedTimestamp:      Date.now() - 21 * 86400000,
    notes:               "Interview confirmed for Jun 4 at 2pm EST. Topic: scaling a creator-led brand.",
  },
  /* ── Completed ──────────────────────────────────────────── */
  {
    id: "c1",
    podcastName:         "Creator Economy Now",
    hostName:            "Alex Rivera",
    categories:          ["Business", "Entrepreneurship"],
    matchScore:          88,
    audienceAlignment:   84,
    audienceSize:        82,
    stage:               "completed",
    badges:              ["ai-recommended"],
    insights:            [],
    responseRate:        100,
    lastActivity:        "Episode published May 15",
    outreachDate:        "6 weeks ago",
    coverIndex:          1,
    visibilityPotential: "high",
    savedTimestamp:      Date.now() - 45 * 86400000,
    notes:               "Great episode. 12K plays in first 48 hrs. Follow up with host next quarter.",
  },
]

/* ── Activity feed ────────────────────────────────────────── */
export const MOCK_ACTIVITY: ActivityEntry[] = [
  {
    id: "a1",
    type:        "host-active",
    podcastName: "Tech Startup Insider",
    message:     "Host published a new episode and opened a guest booking window",
    time:        "Just now",
    highlight:   true,
  },
  {
    id: "a2",
    type:        "response",
    podcastName: "The Resilience Project",
    message:     "Host replied to your outreach — scheduling is in progress",
    time:        "1 hour ago",
    highlight:   true,
  },
  {
    id: "a3",
    type:        "momentum",
    podcastName: "Women in Leadership",
    message:     "Audience grew +28% — AI flagged a visibility opportunity",
    time:        "Yesterday",
    highlight:   false,
  },
  {
    id: "a4",
    type:        "stage-moved",
    podcastName: "Growth Mindset Weekly",
    message:     "Interview officially confirmed — moved to Booked",
    time:        "2 days ago",
    highlight:   false,
  },
  {
    id: "a5",
    type:        "saved",
    podcastName: "Future of Work",
    message:     "AI matched this podcast at 85% — added to your pipeline",
    time:        "5 days ago",
    highlight:   false,
  },
  {
    id: "a6",
    type:        "booked",
    podcastName: "Creator Economy Now",
    message:     "Episode went live — 12K plays in the first 48 hours",
    time:        "2 weeks ago",
    highlight:   false,
  },
]

/* ── Pipeline summary stats ─────────────────────────────── */
export const PIPELINE_STATS = {
  total:         MOCK_OUTREACH.length,
  responded:     MOCK_OUTREACH.filter(e => e.stage === "responded").length,
  booked:        MOCK_OUTREACH.filter(e => e.stage === "booked").length,
  completed:     MOCK_OUTREACH.filter(e => e.stage === "completed").length,
  avgMatch:      Math.round(MOCK_OUTREACH.reduce((s, e) => s + e.matchScore, 0) / MOCK_OUTREACH.length),
}
