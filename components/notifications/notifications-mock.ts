/* ═══════════════════════════════════════════════════════════
   Notifications + Activity Center — mock data + types.
   Replace MOCK_NOTIFICATIONS + MOCK_AI_ALERTS with real
   API/WebSocket events in notifications-context.tsx when ready.
   ═══════════════════════════════════════════════════════════ */

export type NotificationType =
  | "match-found"
  | "host-active"
  | "audience-trend"
  | "visibility-window"
  | "score-improved"
  | "outreach-update"
  | "ai-alert"

export type NotificationPriority = "critical" | "high" | "medium" | "low"

export type FilterCategory =
  | "all"
  | "high-priority"
  | "matches"
  | "host-activity"
  | "audience"
  | "outreach"

export interface NotificationItem {
  id:          string
  type:        NotificationType
  priority:    NotificationPriority
  title:       string
  body:        string
  podcastName?: string
  timeLabel:   string              // display string
  timestamp:   number              // ms — used for grouping
  isRead:      boolean
  badge?:      "high-priority" | "ai-recommended" | "trending" | "fast-moving"
  actionLabel?: string             // primary CTA label
  actionHref?:  string             // link for primary CTA
  insight?:     string             // short AI insight chip text
}

export type DateGroup = "today" | "yesterday" | "week" | "older"

export interface PanelAlert {
  id:         string
  title:      string
  body:       string
  confidence: number
  color:      "primary" | "cyan" | "gold" | "green"
  actionLabel: string
  actionHref?: string
}

/* ── Category filter config ───────────────────────────────── */
export const FILTER_CATEGORIES: {
  value: FilterCategory
  label: string
  types: NotificationType[] | null   // null = all
}[] = [
  { value: "all",           label: "All Activity",     types: null                                                           },
  { value: "high-priority", label: "High Priority",    types: null                                                           },
  { value: "matches",       label: "Podcast Matches",  types: ["match-found", "score-improved"]                              },
  { value: "host-activity", label: "Host Activity",    types: ["host-active"]                                                },
  { value: "audience",      label: "Audience Trends",  types: ["audience-trend", "visibility-window"]                        },
  { value: "outreach",      label: "Outreach Updates", types: ["outreach-update"]                                            },
]

/* ── Helpers ──────────────────────────────────────────────── */
const NOW = Date.now()
const DAY = 86400000

function ago(ms: number) { return NOW - ms }

/* ── Mock notifications ───────────────────────────────────── */
export const MOCK_NOTIFICATIONS: NotificationItem[] = [
  /* ── Today (unread) ───────────────────────────────────── */
  {
    id:          "n1",
    type:        "host-active",
    priority:    "critical",
    title:       "Host Opened Guest Booking — Act Now",
    body:        "Tech Startup Insider host James Park just activated guest booking. This window typically closes within 72 hours.",
    podcastName: "Tech Startup Insider",
    timeLabel:   "Just now",
    timestamp:   ago(5 * 60000),
    isRead:      false,
    badge:       "fast-moving",
    actionLabel: "View Podcast",
    actionHref:  "/dashboard/discover/3",
    insight:     "Window closes in ~72 hrs",
  },
  {
    id:          "n2",
    type:        "audience-trend",
    priority:    "high",
    title:       "Audience Surge: Recovery Stories +44%",
    body:        "Listener count grew 44% in 7 days. AI detects elevated engagement — your outreach success probability is now at its highest.",
    podcastName: "Recovery Stories",
    timeLabel:   "12 min ago",
    timestamp:   ago(12 * 60000),
    isRead:      false,
    badge:       "trending",
    actionLabel: "Start Outreach",
    actionHref:  "/dashboard/outreach",
    insight:     "Best window: this week",
  },
  {
    id:          "n3",
    type:        "match-found",
    priority:    "high",
    title:       "New AI Match: The Daily Creative — 94%",
    body:        "AI detected a new high-compatibility podcast match. Your audience alignment score is 91% — one of your strongest matches to date.",
    podcastName: "The Daily Creative",
    timeLabel:   "1 hour ago",
    timestamp:   ago(60 * 60000),
    isRead:      false,
    badge:       "ai-recommended",
    actionLabel: "View Match",
    actionHref:  "/dashboard/discover",
    insight:     "94% AI match score",
  },
  {
    id:          "n4",
    type:        "score-improved",
    priority:    "medium",
    title:       "Visibility Score Improved to 78",
    body:        "Your platform visibility score rose from 75 to 78 (+3 pts) based on profile updates and increased outreach activity.",
    timeLabel:   "2 hours ago",
    timestamp:   ago(2 * 60 * 60000),
    isRead:      false,
    actionLabel: "View Analytics",
    actionHref:  "/dashboard/analytics",
    insight:     "+3 pts this week",
  },
  {
    id:          "n5",
    type:        "outreach-update",
    priority:    "high",
    title:       "Response Received: Leadership Lab",
    body:        "Host Sarah Mitchell replied to your pitch. She's interested and requesting a brief guest profile document before scheduling.",
    podcastName: "Leadership Lab",
    timeLabel:   "3 hours ago",
    timestamp:   ago(3 * 60 * 60000),
    isRead:      false,
    badge:       "high-priority",
    actionLabel: "View Conversation",
    actionHref:  "/dashboard/outreach",
    insight:     "Schedule this week",
  },
  /* ── Yesterday (mixed read/unread) ────────────────────── */
  {
    id:          "n6",
    type:        "visibility-window",
    priority:    "high",
    title:       "Visibility Window: Women in Leadership",
    body:        "This podcast is reaching peak engagement levels. AI analysis shows 3 days remaining in the optimal outreach window.",
    podcastName: "Women in Leadership",
    timeLabel:   "Yesterday, 2:14 PM",
    timestamp:   ago(DAY + 2 * 60 * 60000),
    isRead:      false,
    badge:       "fast-moving",
    actionLabel: "Pitch Now",
    actionHref:  "/dashboard/outreach",
    insight:     "3 days remaining",
  },
  {
    id:          "n7",
    type:        "host-active",
    priority:    "medium",
    title:       "Future of Work Published New Episode",
    body:        "Host Nina Yamamoto released a new episode and updated her guest booking preferences. Profile alignment remains at 83%.",
    podcastName: "Future of Work",
    timeLabel:   "Yesterday, 11:30 AM",
    timestamp:   ago(DAY + 4 * 60 * 60000),
    isRead:      true,
    actionLabel: "View Podcast",
    actionHref:  "/dashboard/discover/12",
  },
  {
    id:          "n8",
    type:        "score-improved",
    priority:    "medium",
    title:       "AI Match Quality: All-Time High of 91%",
    body:        "Your overall AI match quality score reached 91% — the highest since joining. This reflects stronger profile-to-podcast alignment.",
    timeLabel:   "Yesterday, 9:00 AM",
    timestamp:   ago(DAY + 6 * 60 * 60000),
    isRead:      true,
    actionLabel: "View Analytics",
    actionHref:  "/dashboard/analytics",
    insight:     "All-time high",
  },
  {
    id:          "n9",
    type:        "match-found",
    priority:    "low",
    title:       "4 New Podcasts Added to Your Feed",
    body:        "AI discovered 4 new podcast opportunities matching your creator profile. Match scores range from 82% to 87%.",
    timeLabel:   "Yesterday, 8:00 AM",
    timestamp:   ago(DAY + 7 * 60 * 60000),
    isRead:      true,
    actionLabel: "Browse Matches",
    actionHref:  "/dashboard/discover",
  },
  /* ── Earlier this week ─────────────────────────────────── */
  {
    id:          "n10",
    type:        "outreach-update",
    priority:    "high",
    title:       "The Resilience Project Wants to Schedule",
    body:        "Dr. Michael Santos replied with scheduling availability. He prefers Thursday afternoons for guest interviews.",
    podcastName: "The Resilience Project",
    timeLabel:   "3 days ago",
    timestamp:   ago(3 * DAY),
    isRead:      true,
    badge:       "high-priority",
    actionLabel: "Schedule Interview",
    actionHref:  "/dashboard/outreach",
  },
  {
    id:          "n11",
    type:        "audience-trend",
    priority:    "medium",
    title:       "Audience Spikes: 3 Health & Wellness Podcasts",
    body:        "AI detected above-average listener growth across 3 Health & Wellness podcasts that match your creator profile at 89%+.",
    timeLabel:   "4 days ago",
    timestamp:   ago(4 * DAY),
    isRead:      true,
    actionLabel: "View Trends",
    actionHref:  "/dashboard/analytics",
    insight:     "89%+ alignment",
  },
  {
    id:          "n12",
    type:        "outreach-update",
    priority:    "medium",
    title:       "Faith & Business: 8 Days No Response",
    body:        "AI flagged that your outreach to Faith & Business has gone 8 days without a reply. Consider a follow-up or moving on.",
    podcastName: "Faith & Business",
    timeLabel:   "5 days ago",
    timestamp:   ago(5 * DAY),
    isRead:      true,
    actionLabel: "View Pipeline",
    actionHref:  "/dashboard/outreach",
  },
  {
    id:          "n13",
    type:        "ai-alert",
    priority:    "low",
    title:       "Weekly AI Digest: 12 Matches, 3 Expiring",
    body:        "This week: 12 new AI matches discovered, 3 visibility windows expiring soon, and your outreach success rate is up 18%.",
    timeLabel:   "6 days ago",
    timestamp:   ago(6 * DAY),
    isRead:      true,
    actionLabel: "View Report",
    actionHref:  "/dashboard/analytics",
  },
]

/* ── AI Alert Panel items ─────────────────────────────────── */
export const MOCK_PANEL_ALERTS: PanelAlert[] = [
  {
    id:          "pa1",
    title:       "Booking Window Open",
    body:        "Tech Startup Insider host is actively accepting guests. AI gives this a 92% success probability for outreach this week.",
    confidence:  92,
    color:       "gold",
    actionLabel: "Pitch Now",
    actionHref:  "/dashboard/outreach",
  },
  {
    id:          "pa2",
    title:       "Best Outreach Timing",
    body:        "AI analysis of host reply patterns shows Tuesday 9–11am ET yields the highest response rate for your target category.",
    confidence:  87,
    color:       "cyan",
    actionLabel: "Schedule",
    actionHref:  "/dashboard/outreach",
  },
  {
    id:          "pa3",
    title:       "Audience Alignment Surge",
    body:        "Recovery Stories grew 44% in listeners who match your creator profile. Outreach probability at seasonal high.",
    confidence:  89,
    color:       "green",
    actionLabel: "View Podcast",
    actionHref:  "/dashboard/saved",
  },
  {
    id:          "pa4",
    title:       "Profile Score Opportunity",
    body:        "3 quick profile actions could raise your AI match quality from 91% to 95% — unlocking 8 additional high-match podcasts.",
    confidence:  84,
    color:       "primary",
    actionLabel: "Optimize Profile",
  },
]

/* ── Date grouping helper ─────────────────────────────────── */
export function getDateGroup(timestamp: number): DateGroup {
  const diffDays = (Date.now() - timestamp) / 86400000
  if (diffDays < 1)   return "today"
  if (diffDays < 2)   return "yesterday"
  if (diffDays < 7)   return "week"
  return "older"
}

export const DATE_GROUP_LABELS: Record<DateGroup, string> = {
  today:     "Today",
  yesterday: "Yesterday",
  week:      "Earlier This Week",
  older:     "Older",
}
