/* ═══════════════════════════════════════════════════════════
   Podcast Data Schema — unified import-layer types.

   PodcastRecord is the canonical type returned by all data
   sources (Podcast Index, Apple, Spotify, scrapers).
   enrich() in lib/podcasts/enrich.ts converts it to
   DiscoveryPodcast for display components.

   FUTURE DATA SOURCES:
   - Listen Notes:  add source = "listen-notes"
   - Podchaser:     add source = "podchaser"
   - Spotify:       add source = "spotify"
   All sources must normalize to PodcastRecord before storage.
   ═══════════════════════════════════════════════════════════ */

export type DataSource = "podcast-index" | "apple" | "spotify" | "listen-notes" | "podchaser" | "mock"

export type ActivityStatus = "active" | "hiatus" | "inactive"

/* ── Canonical podcast record ─────────────────────────────── */
export interface PodcastRecord {
  id:             string           // normalized: source_externalId (e.g. "pi_920666")
  externalId:     string           // raw ID from source API
  source:         DataSource

  /* Required fields */
  name:           string
  host:           string           // normalized author/owner name
  description:    string

  /* Taxonomy */
  categories:     string[]         // normalized to our 17 internal categories
  rawCategories?: string[]         // original from source (for debugging/re-mapping)

  /* Platform links */
  rssFeed:        string           // PRIMARY dedup key — RSS feed URL
  website?:       string
  appleUrl?:      string
  spotifyUrl?:    string
  podcastUrl?:    string           // generic deep link

  /* Content stats */
  episodeCount:   number
  lastPublished?: string           // ISO-8601 datetime
  language:       string           // BCP-47, e.g. "en"

  /* Media */
  artwork?:       string           // CDN URL from source

  /* Guest intelligence */
  guestFriendly:  boolean          // defaults to true (unknown = likely willing)

  /* Activity */
  activityStatus: ActivityStatus   // derived from lastPublished + dead flag

  /* Metadata */
  importedAt:     string           // ISO-8601 — when we fetched this record
}

/* ── Search request params ────────────────────────────────── */
export interface PodcastSearchParams {
  q?:             string           // full-text search
  category?:      string           // single category filter
  language?:      string           // language filter
  activityStatus?: ActivityStatus
  guestFriendly?: boolean
  page?:          number           // 1-indexed
  pageSize?:      number           // default 40
}

/* ── API response envelope ────────────────────────────────── */
export interface PodcastApiResponse {
  data:       import("@/components/discovery/mock-data").DiscoveryPodcast[]
  total:      number
  page:       number
  pageSize:   number
  totalPages: number
  source:     DataSource | "mock"
}

/* ── Duplicate detection ─────────────────────────────────── */
export interface DeduplicationResult {
  unique:     PodcastRecord[]
  duplicates: Array<{ kept: PodcastRecord; duplicate: PodcastRecord; reason: string }>
}
