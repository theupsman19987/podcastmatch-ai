/* ═══════════════════════════════════════════════════════════
   Analytics + Visibility Intelligence — mock data + types.
   Swap all MOCK_* with real API calls in analytics-context.tsx
   when the backend analytics pipeline is ready.
   ═══════════════════════════════════════════════════════════ */

export type TimeRange = "7d" | "30d" | "90d" | "all"

export interface DataPoint {
  label: string
  value: number
}

/* ── Per-metric sparkline series ─────────────────────────── */
export type SparkSeries = Record<TimeRange, number[]>

/* ── Main visibility chart series ────────────────────────── */
export type ChartSeries = Record<TimeRange, DataPoint[]>

/* ── AI Insight ──────────────────────────────────────────── */
export type InsightTone = "positive" | "opportunity" | "alert" | "info"

export interface AIInsight {
  id:          string
  tone:        InsightTone
  title:       string
  body:        string
  confidence:  number     // 0–100
  metric:      string     // short metric label shown in chip
  metricDelta: string     // e.g. "+12%" or "↑ Strong"
}

/* ── Recommendation ──────────────────────────────────────── */
export interface Recommendation {
  id:      string
  icon:    string         // key for icon map in component
  title:   string
  body:    string
  action:  string
  badge:   string
  color:   "primary" | "cyan" | "gold" | "green"
}

/* ── Activity ─────────────────────────────────────────────── */
export type AnalyticsEventType =
  | "match-found"
  | "score-improved"
  | "host-active"
  | "audience-trend"
  | "outreach-sent"
  | "response-received"

export interface AnalyticsEvent {
  id:      string
  type:    AnalyticsEventType
  title:   string
  body:    string
  time:    string
  delta?:  string     // e.g. "+3 pts"
  fresh:   boolean
}

/* ── Momentum dimension ───────────────────────────────────── */
export interface MomentumDimension {
  id:     string
  label:  string
  value:  number      // 0–100
  delta:  string      // display string
  color:  "primary" | "cyan" | "gold" | "green"
}

/* ═══════════════════════════════════════════════════════════
   CHART DATA
   ═══════════════════════════════════════════════════════════ */

/* ── Visibility growth — main area chart ─────────────────── */
export const VISIBILITY_SERIES: ChartSeries = {
  "7d": [
    { label: "Mon", value: 72 }, { label: "Tue", value: 74 },
    { label: "Wed", value: 73 }, { label: "Thu", value: 76 },
    { label: "Fri", value: 75 }, { label: "Sat", value: 77 },
    { label: "Sun", value: 78 },
  ],
  "30d": [
    { label: "May 1",  value: 62 }, { label: "May 4",  value: 64 },
    { label: "May 7",  value: 67 }, { label: "May 10", value: 68 },
    { label: "May 13", value: 70 }, { label: "May 16", value: 72 },
    { label: "May 19", value: 74 }, { label: "May 22", value: 75 },
    { label: "May 25", value: 77 }, { label: "May 28", value: 78 },
  ],
  "90d": [
    { label: "Mar 3",  value: 48 }, { label: "Mar 10", value: 52 },
    { label: "Mar 17", value: 55 }, { label: "Mar 24", value: 58 },
    { label: "Mar 31", value: 60 }, { label: "Apr 7",  value: 63 },
    { label: "Apr 14", value: 66 }, { label: "Apr 21", value: 68 },
    { label: "Apr 28", value: 71 }, { label: "May 5",  value: 73 },
    { label: "May 12", value: 75 }, { label: "May 19", value: 77 },
    { label: "May 26", value: 78 },
  ],
  "all": [
    { label: "Jun",  value: 30 }, { label: "Jul",  value: 35 },
    { label: "Aug",  value: 40 }, { label: "Sep",  value: 46 },
    { label: "Oct",  value: 52 }, { label: "Nov",  value: 57 },
    { label: "Dec",  value: 60 }, { label: "Jan",  value: 64 },
    { label: "Feb",  value: 68 }, { label: "Mar",  value: 72 },
    { label: "Apr",  value: 75 }, { label: "May",  value: 78 },
  ],
}

/* ── Match quality — bar chart (weekly) ─────────────────── */
export const MATCH_TREND_SERIES: ChartSeries = {
  "7d":  [
    { label: "Mon", value: 88 }, { label: "Tue", value: 90 },
    { label: "Wed", value: 89 }, { label: "Thu", value: 91 },
    { label: "Fri", value: 91 }, { label: "Sat", value: 90 },
    { label: "Sun", value: 91 },
  ],
  "30d": [
    { label: "W1", value: 83 }, { label: "W2", value: 85 },
    { label: "W3", value: 87 }, { label: "W4", value: 89 },
    { label: "W5", value: 91 },
  ],
  "90d": [
    { label: "Mar W1", value: 78 }, { label: "Mar W3", value: 80 },
    { label: "Apr W1", value: 82 }, { label: "Apr W3", value: 85 },
    { label: "May W1", value: 87 }, { label: "May W3", value: 89 },
    { label: "May W4", value: 91 },
  ],
  "all": [
    { label: "Jun", value: 70 }, { label: "Aug", value: 74 },
    { label: "Oct", value: 79 }, { label: "Dec", value: 83 },
    { label: "Feb", value: 87 }, { label: "Apr", value: 90 },
    { label: "May", value: 91 },
  ],
}

/* ── Metric sparklines (8 points each range) ─────────────── */
export const SPARK_VISIBILITY: SparkSeries  = {
  "7d":  [72, 74, 73, 75, 76, 77, 77, 78],
  "30d": [62, 64, 67, 68, 70, 72, 75, 78],
  "90d": [48, 53, 58, 62, 66, 70, 74, 78],
  "all": [30, 38, 46, 54, 62, 68, 74, 78],
}

export const SPARK_REACH: SparkSeries = {
  "7d":  [810, 820, 815, 830, 838, 842, 844, 847],
  "30d": [650, 680, 710, 730, 760, 790, 820, 847],
  "90d": [400, 480, 540, 600, 660, 720, 790, 847],
  "all": [120, 200, 320, 450, 580, 680, 770, 847],
}

export const SPARK_MATCH: SparkSeries = {
  "7d":  [88, 89, 90, 89, 91, 90, 91, 91],
  "30d": [83, 85, 86, 87, 88, 89, 90, 91],
  "90d": [76, 79, 81, 83, 85, 87, 89, 91],
  "all": [70, 73, 76, 79, 82, 85, 88, 91],
}

export const SPARK_MOMENTUM: SparkSeries = {
  "7d":  [2, 3, 2, 4, 3, 5, 4, 5],
  "30d": [6, 8, 7, 9, 10, 11, 12, 14],
  "90d": [10, 14, 18, 22, 25, 28, 31, 34],
  "all": [4, 8, 12, 18, 22, 26, 30, 34],
}

export const SPARK_OUTREACH: SparkSeries = {
  "7d":  [0, 1, 0, 1, 1, 0, 1, 2],
  "30d": [2, 2, 3, 2, 3, 3, 4, 4],
  "90d": [4, 5, 6, 6, 7, 8, 9, 10],
  "all": [1, 2, 3, 5, 6, 7, 9, 10],
}

export const SPARK_RESPONSE: SparkSeries = {
  "7d":  [65, 68, 67, 70, 68, 72, 71, 73],
  "30d": [55, 58, 60, 63, 65, 67, 70, 73],
  "90d": [40, 48, 52, 56, 60, 65, 70, 73],
  "all": [25, 35, 45, 52, 58, 64, 70, 73],
}

/* ── Current + previous values per range ─────────────────── */
export const METRIC_VALUES: Record<
  TimeRange,
  { visibility: [number, number]; reach: [number, number]; match: [number, number]; momentum: [number, number]; outreach: [number, number]; response: [number, number] }
> = {
  "7d":  { visibility: [78, 72], reach: [847,  810], match: [91, 88], momentum: [5,  2], outreach: [2,  0], response: [73, 65] },
  "30d": { visibility: [78, 62], reach: [847,  650], match: [91, 83], momentum: [14, 6], outreach: [4,  2], response: [73, 55] },
  "90d": { visibility: [78, 48], reach: [847,  400], match: [91, 76], momentum: [34, 10], outreach: [10, 4], response: [73, 40] },
  "all": { visibility: [78, 30], reach: [847,  120], match: [91, 70], momentum: [34, 4],  outreach: [10, 1], response: [73, 25] },
}

/* ═══════════════════════════════════════════════════════════
   STATIC MOCK CONTENT
   ═══════════════════════════════════════════════════════════ */

export const MOCK_AI_INSIGHTS: AIInsight[] = [
  {
    id:          "i1",
    tone:        "positive",
    title:       "Audience Alignment Strengthening",
    body:        "Your profile attributes align with 94% of your top-matched podcast audiences. Listener overlap has grown significantly over the past 30 days.",
    confidence:  94,
    metric:      "Alignment",
    metricDelta: "+8 pts",
  },
  {
    id:          "i2",
    tone:        "opportunity",
    title:       "High-Visibility Window Detected",
    body:        "Three podcasts in your saved pipeline are experiencing above-average listener growth this week. This is an optimal outreach window.",
    confidence:  87,
    metric:      "Opportunity",
    metricDelta: "3 open",
  },
  {
    id:          "i3",
    tone:        "positive",
    title:       "Match Quality Trend Accelerating",
    body:        "Your AI match quality improved from 83% to 91% over 30 days — driven by profile enrichment and audience keyword alignment.",
    confidence:  91,
    metric:      "Match Score",
    metricDelta: "+8%",
  },
  {
    id:          "i4",
    tone:        "opportunity",
    title:       "Optimal Outreach Timing Identified",
    body:        "AI analysis shows Tuesday–Thursday, 9–11am ET yields the highest host response rates for your target podcast categories.",
    confidence:  89,
    metric:      "Response Window",
    metricDelta: "↑ Tue–Thu",
  },
]

export const MOCK_RECOMMENDATIONS: Recommendation[] = [
  {
    id:     "r1",
    icon:   "compass",
    title:  "Expand into Health & Wellness",
    body:   "AI detected a +44% audience growth spike in this niche. Your profile attributes align at 89% with top podcasts in this category.",
    action: "Explore Podcasts",
    badge:  "High Visibility",
    color:  "cyan",
  },
  {
    id:     "r2",
    icon:   "clock",
    title:  "Best Outreach Window: Tue–Thu",
    body:   "Hosts in your pipeline are most responsive Tuesday to Thursday between 9am–11am ET. AI-detected based on reply pattern analysis.",
    action: "Schedule Outreach",
    badge:  "AI Timing",
    color:  "gold",
  },
  {
    id:     "r3",
    icon:   "trending-up",
    title:  "3 Podcasts With Audience Spikes",
    body:   "Tech Startup Insider, Women in Leadership, and Recovery Stories each gained 20%+ audience growth this week — pitch now.",
    action: "View Opportunities",
    badge:  "Act Now",
    color:  "green",
  },
  {
    id:     "r4",
    icon:   "sparkles",
    title:  "Reach 95% Profile Match Score",
    body:   "Add 3 specific keywords to your creator bio and a media kit link to unlock higher match scores across 12 additional podcasts.",
    action: "Optimize Profile",
    badge:  "Quick Win",
    color:  "primary",
  },
]

export const MOCK_ANALYTICS_EVENTS: AnalyticsEvent[] = [
  {
    id:    "e1",
    type:  "match-found",
    title: "New AI Match Found",
    body:  "Tech Startup Insider — 96% match score detected",
    time:  "Just now",
    delta: "+96%",
    fresh: true,
  },
  {
    id:    "e2",
    type:  "score-improved",
    title: "Visibility Score Improved",
    body:  "Your overall visibility score rose to 78",
    time:  "2 hours ago",
    delta: "+3 pts",
    fresh: true,
  },
  {
    id:    "e3",
    type:  "host-active",
    title: "Host Activity Detected",
    body:  "Women in Leadership — host recently published",
    time:  "Yesterday",
    delta: undefined,
    fresh: false,
  },
  {
    id:    "e4",
    type:  "audience-trend",
    title: "Audience Trend Rising",
    body:  "Recovery Stories gained +44% listeners this week",
    time:  "2 days ago",
    delta: "+44%",
    fresh: false,
  },
  {
    id:    "e5",
    type:  "response-received",
    title: "Response Received",
    body:  "The Resilience Project host replied to your pitch",
    time:  "3 days ago",
    delta: undefined,
    fresh: false,
  },
  {
    id:    "e6",
    type:  "score-improved",
    title: "Match Quality Improved",
    body:  "AI match quality reached 91% — all-time high",
    time:  "1 week ago",
    delta: "+8%",
    fresh: false,
  },
]

export const MOCK_MOMENTUM: MomentumDimension[] = [
  { id: "vis",      label: "Visibility Score",   value: 78, delta: "+12% this week",  color: "primary" },
  { id: "reach",    label: "Audience Reach",      value: 85, delta: "+23% growth",     color: "cyan"    },
  { id: "match",    label: "Match Quality",        value: 91, delta: "+8% this month", color: "gold"    },
  { id: "outreach", label: "Outreach Momentum",   value: 70, delta: "+18% response",  color: "green"   },
]
