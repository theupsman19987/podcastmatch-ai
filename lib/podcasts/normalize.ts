/* ═══════════════════════════════════════════════════════════
   Normalization — converts raw source API responses to
   the canonical PodcastRecord format.

   Add a new normalize* function for each new data source.
   All functions return PodcastRecord[] — types are hidden
   inside each normalizer.
   ═══════════════════════════════════════════════════════════ */

import type { PIFeed } from "@/lib/podcasts/sources/podcast-index"
import type { PodcastRecord, ActivityStatus } from "@/lib/podcasts/schema"
import { normalizeCategories } from "@/lib/podcasts/category-map"

/* ── Shared utilities ─────────────────────────────────────── */

function deriveActivityStatus(lastUpdateTime?: number, dead?: boolean): ActivityStatus {
  if (dead) return "inactive"
  if (!lastUpdateTime) return "active"
  const daysSince = (Date.now() / 1000 - lastUpdateTime) / 86400
  if (daysSince <= 90)  return "active"
  if (daysSince <= 180) return "hiatus"
  return "inactive"
}

function normalizeHost(author: string, ownerName: string): string {
  const candidate = author.trim() || ownerName.trim()
  // Strip common suffixes like "Podcast", "Show", "Media" at end
  return candidate
    .replace(/\s+(podcast|show|media|productions?|network)$/i, "")
    .trim() || "Unknown Host"
}

function normalizeDescription(raw: string): string {
  // Strip HTML tags
  return raw
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 500)  // cap at 500 chars
}

function toIso(unixTimestamp: number): string {
  return new Date(unixTimestamp * 1000).toISOString()
}

/* ── Podcast Index normalizer ─────────────────────────────── */
export function normalizePodcastIndex(feeds: PIFeed[]): PodcastRecord[] {
  const now = new Date().toISOString()

  return feeds.map(feed => {
    const rawCats = feed.categories
      ? Object.values(feed.categories)
      : []

    const categories = normalizeCategories(rawCats, "podcast-index")

    return {
      id:             `pi_${feed.id}`,
      externalId:     String(feed.id),
      source:         "podcast-index" as const,

      name:           feed.title.trim(),
      host:           normalizeHost(feed.author, feed.ownerName),
      description:    normalizeDescription(feed.description),

      categories,
      rawCategories:  rawCats,

      rssFeed:        feed.url || feed.originalUrl,
      website:        feed.link || undefined,
      appleUrl:       feed.itunesId
                        ? `https://podcasts.apple.com/podcast/id${feed.itunesId}`
                        : undefined,
      spotifyUrl:     undefined,     // PI doesn't provide Spotify URLs
      podcastUrl:     undefined,

      episodeCount:   feed.episodeCount || 0,
      lastPublished:  feed.lastUpdateTime ? toIso(feed.lastUpdateTime) : undefined,
      language:       feed.language || "en",

      artwork:        feed.artwork || feed.image || undefined,

      guestFriendly:  true,          // unknown → assume willing
      activityStatus: deriveActivityStatus(feed.lastUpdateTime, feed.dead === 1),

      importedAt:     now,
    } satisfies PodcastRecord
  })
}

/* ── Apple Podcasts normalizer (future) ───────────────────── */
// FUTURE AI INTEGRATION POINT:
// When Apple Search API access is available, add:
// export function normalizeApple(results: AppleResult[]): PodcastRecord[] { ... }

/* ── Spotify normalizer (future) ──────────────────────────── */
// FUTURE AI INTEGRATION POINT:
// export function normalizeSpotify(shows: SpotifyShow[]): PodcastRecord[] { ... }

/* ── Listen Notes normalizer (future) ────────────────────── */
// FUTURE AI INTEGRATION POINT:
// export function normalizeListenNotes(results: LNResult[]): PodcastRecord[] { ... }
