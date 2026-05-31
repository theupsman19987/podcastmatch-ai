/* ═══════════════════════════════════════════════════════════
   Enrichment — converts PodcastRecord (raw import data) into
   DiscoveryPodcast (display-ready format with computed fields).

   This is the bridge between the import pipeline and the UI.
   All computed fields (matchScore, badges, audienceSize, etc.)
   are derived here using deterministic heuristics.

   FUTURE AI INTEGRATION POINT:
   Replace computeMatchScore() with a call to the AI scoring
   endpoint: POST /api/match/score { podcastId, creatorDna }
   Replace estimateAudienceSize() with real listener data from
   Spotify/Podchaser/Listen Notes when available.
   ═══════════════════════════════════════════════════════════ */

import type { PodcastRecord } from "@/lib/podcasts/schema"
import type {
  DiscoveryPodcast,
  HostActivity,
  GuestAcceptance,
  VisibilityTier,
  PodcastBadge,
  ActivityStatus,
} from "@/components/discovery/mock-data"

/* ── Cover index — consistent gradient per podcast ─────────── */
function coverIndexFromId(id: string): number {
  let hash = 0
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0
  }
  return hash % 6
}

/* ── Deterministic numeric seed from ID ───────────────────── */
function seedFromId(id: string): number {
  let h = 0
  for (let i = 0; i < id.length; i++) h = (h * 37 + id.charCodeAt(i)) >>> 0
  return h
}

/* ── Match score — category-based heuristic ───────────────── */
const HIGH_VALUE_CATS = new Set([
  "Business", "Entrepreneurship", "Leadership", "Marketing", "Finance & Investing",
])
const MED_VALUE_CATS = new Set([
  "Technology", "Personal Development", "Health & Wellness",
  "Women in Business", "Sports & Performance",
])

function computeMatchScore(categories: string[], seed: number): number {
  let score = 58
  for (const c of categories) {
    if (HIGH_VALUE_CATS.has(c)) score += 10
    else if (MED_VALUE_CATS.has(c)) score += 6
    else score += 3
  }
  score = Math.min(96, score)
  return Math.max(50, score + (seed % 9) - 4)
}

/* ── Audience size estimation ─────────────────────────────── */
function estimateAudienceSize(episodeCount: number, seed: number): number {
  const base = episodeCount > 500 ? 130
             : episodeCount > 300 ? 80
             : episodeCount > 150 ? 45
             : episodeCount > 75  ? 22
             : episodeCount > 25  ? 12
             : 6
  return Math.round(base + (seed % Math.max(1, Math.floor(base / 3))))
}

/* ── Host activity from last published date ───────────────── */
function deriveHostActivity(lastPublished?: string): HostActivity {
  if (!lastPublished) return "monthly"
  const days = (Date.now() - new Date(lastPublished).getTime()) / 86_400_000
  if (days <= 10) return "weekly"
  if (days <= 25) return "biweekly"
  return "monthly"
}

/* ── Visibility potential from audience + activity ─────────── */
function deriveVisibility(audienceSize: number, activity: HostActivity): VisibilityTier {
  if (audienceSize >= 100) return "very-high"
  if (audienceSize >= 50  || (audienceSize >= 30 && activity === "weekly")) return "high"
  if (audienceSize >= 20) return "medium"
  return "growing"
}

/* ── Guest friendly score ─────────────────────────────────── */
function computeGuestFriendlyScore(
  guestFriendly: boolean,
  episodeCount:  number,
  seed:          number
): number {
  const base = guestFriendly
    ? (episodeCount > 100 ? 85 : 73)
    : 55
  return Math.min(98, base + (seed % 12))
}

/* ── Badges ───────────────────────────────────────────────── */
function deriveBadges(
  matchScore:    number,
  audienceSize:  number,
  activity:      HostActivity,
  seed:          number
): PodcastBadge[] {
  const badges: PodcastBadge[] = []
  if (matchScore >= 88)                        badges.push("ai-recommended")
  if (audienceSize >= 80 && activity === "weekly") badges.push("trending")
  if (audienceSize >= 50)                      badges.push("high-engagement")
  if (seed % 5 === 0 && matchScore >= 75)      badges.push("fast-growing")
  return badges.slice(0, 2)
}

/* ── Audience type string ─────────────────────────────────── */
function deriveAudienceType(categories: string[]): string {
  const primary = categories[0] ?? "General"
  const map: Record<string, string> = {
    "Business":             "Business Professionals",
    "Entrepreneurship":     "Entrepreneurs & Founders",
    "Leadership":           "Executives & Leaders",
    "Marketing":            "Marketers & Growth Teams",
    "Finance & Investing":  "Investors & Finance Pros",
    "Technology":           "Tech Professionals",
    "Health & Wellness":    "Health-Conscious Individuals",
    "Personal Development": "Self-Improvers",
    "Faith & Spirituality": "Faith Community",
    "Spirituality":         "Spiritual Seekers",
    "Women in Business":    "Women Entrepreneurs",
    "Education":            "Lifelong Learners",
    "Society & Culture":    "Culture & Ideas Enthusiasts",
    "Science":              "Science Enthusiasts",
    "Sports & Performance": "Performance-Minded Athletes",
    "Parenting":            "Parents & Families",
  }
  return map[primary] ?? `${primary} Enthusiasts`
}

/* ── Estimated reach string ───────────────────────────────── */
function formatReach(audienceSize: number): string {
  const reach = audienceSize * 4  // rough reach multiplier
  if (reach >= 1000) return `${(reach / 1000).toFixed(1)}M`
  if (reach >= 100)  return `${Math.round(reach / 10) * 10}K`
  return `${reach}K`
}

/* ── Main enrich function ─────────────────────────────────── */
export function enrichToDiscoveryPodcast(record: PodcastRecord): DiscoveryPodcast {
  const seed          = seedFromId(record.id)
  const matchScore    = computeMatchScore(record.categories, seed)
  const audienceSize  = estimateAudienceSize(record.episodeCount, seed)
  const hostActivity  = deriveHostActivity(record.lastPublished)
  const visibility    = deriveVisibility(audienceSize, hostActivity)
  const guestScore    = computeGuestFriendlyScore(record.guestFriendly, record.episodeCount, seed)
  const guestAcc: GuestAcceptance = record.guestFriendly ? "open" : "selective"
  const badges        = deriveBadges(matchScore, audienceSize, hostActivity, seed)

  return {
    id:                  record.id,
    name:                record.name,
    host:                record.host,
    description:         record.description,
    categories:          record.categories,
    subcategory:         record.rawCategories?.[0],

    website:             record.website    ?? "",
    podcastUrl:          record.podcastUrl ?? record.rssFeed ?? "",
    appleUrl:            record.appleUrl   ?? "",
    spotifyUrl:          record.spotifyUrl ?? "",

    audienceType:        deriveAudienceType(record.categories),
    audienceSize,
    estimatedReach:      formatReach(audienceSize),

    episodeCount:        record.episodeCount,
    hostActivity,
    activityStatus:      record.activityStatus as ActivityStatus,

    matchScore,
    audienceAlignment:   Math.min(98, matchScore + (seed % 8) - 3),
    guestFriendlyScore:  guestScore,
    guestAcceptance:     guestAcc,
    visibilityPotential: visibility,
    badges,

    coverIndex:          coverIndexFromId(record.id),
    saved:               false,

    /* Real data fields (optional on DiscoveryPodcast) */
    rssFeed:        record.rssFeed,
    artwork:        record.artwork,
    lastPublished:  record.lastPublished,
    language:       record.language,
    source:         record.source,
  }
}

/** Enrich an array in one pass. */
export function enrichAll(records: PodcastRecord[]): DiscoveryPodcast[] {
  return records.map(enrichToDiscoveryPodcast)
}
