/* ═══════════════════════════════════════════════════════════
   Podcast Profile — rich mock data extension.
   The base podcast comes from DiscoveryPodcast (mock-data.ts).
   This adds all detail-page fields.
   Replace PROFILE_EXTENSION with a real API call
   in page.tsx when the backend is ready.
   ═══════════════════════════════════════════════════════════ */

export interface EpisodeItem {
  title: string
  date:  string
  topic: string
}

export interface AudienceSegment {
  label: string
  pct:   number
}

export interface AIFactor {
  label:       string
  score:       number
  description: string
}

export interface HostProfile {
  responseTime:   string
  acceptanceRate: number
  lastBooked:     string
  totalGuests:    number
}

export interface ActivityItem {
  type:  "published" | "accepting" | "responsive" | "growing"
  label: string
  meta:  string
}

/* Shared rich profile extension — identical for all podcasts in demo.
   In production, fetch per-podcast from API. */
export const PROFILE_EXTENSION = {
  episodeLength:      "45–60 min",
  publishingSchedule: "Every Tuesday",
  guestStyle:         "Conversational, story-driven deep dives",
  totalEpisodes:      187,
  estimatedReach:     "450K",

  recentEpisodes: [
    { title: "Building in Public: The Honest Truth",   date: "2 days ago",  topic: "Entrepreneurship" },
    { title: "From 0 to $1M Without VC Funding",       date: "9 days ago",  topic: "Business"         },
    { title: "How AI is Changing the Founder Game",    date: "16 days ago", topic: "Technology"       },
    { title: "The Uncomfortable Side of Scaling Fast", date: "23 days ago", topic: "Leadership"       },
  ] as EpisodeItem[],

  audienceSegments: [
    { label: "Entrepreneurs & Founders", pct: 38 },
    { label: "Tech Professionals",       pct: 28 },
    { label: "Business Owners",          pct: 20 },
    { label: "Executives & Leaders",     pct: 14 },
  ] as AudienceSegment[],

  aiFactors: [
    {
      label:       "Audience Alignment",
      score:       94,
      description: "Their listeners and your expertise overlap heavily in entrepreneurship and business growth",
    },
    {
      label:       "Topic Relevance",
      score:       91,
      description: "Your content maps directly to their top-performing episode categories",
    },
    {
      label:       "Host Compatibility",
      score:       88,
      description: "Interview style and guest profile history indicates strong conversational fit",
    },
    {
      label:       "Visibility Potential",
      score:       96,
      description: "Their reach and episode sharing behavior suggests high post-interview visibility",
    },
  ] as AIFactor[],

  hostProfile: {
    responseTime:   "Usually within 24–48 hours",
    acceptanceRate: 72,
    lastBooked:     "3 days ago",
    totalGuests:    187,
  } as HostProfile,

  recentActivity: [
    { type: "published",  label: "New episode published",       meta: "2 days ago"   },
    { type: "accepting",  label: "Currently accepting guests",  meta: "Active now"   },
    { type: "responsive", label: "High guest response rate",    meta: "This month"   },
    { type: "growing",    label: "+23% audience growth",        meta: "Last 90 days" },
  ] as ActivityItem[],

  /* Keyword tags for related audience signals */
  audienceSignals: [
    "Startup Mindset",
    "Business Growth",
    "Leadership",
    "AI & Tech",
    "Founder Stories",
  ],
}
