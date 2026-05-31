/* ═══════════════════════════════════════════════════════════
   Podcast Index API Client — SERVER ONLY.
   Never import this in client components.

   Auth: SHA1(apiKey + apiSecret + unixTimestamp)
   Docs: https://podcastindex-org.github.io/docs-api/
   Free API key: https://api.podcastindex.org/signup

   FUTURE EXPANSION:
   Add new methods here as Podcast Index API grows.
   Consider adding: getFeed(), getEpisodes(), getTrending()
   ═══════════════════════════════════════════════════════════ */

import { createHash } from "crypto"

const BASE_URL  = "https://api.podcastindex.org/api/1.0"
const MAX_RESULTS = 40

/* ── Raw PI API types ─────────────────────────────────────── */
export interface PIFeed {
  id:                number
  podcastGuid:       string
  title:             string
  url:               string           // RSS feed URL
  originalUrl:       string
  link:              string           // website URL
  description:       string
  author:            string
  ownerName:         string
  image:             string
  artwork:           string
  lastUpdateTime:    number           // unix timestamp
  lastCrawlTime:     number
  itunesId:          number | null
  generator:         string
  language:          string
  type:              number
  medium:            string
  dead:              number           // 0 = alive, 1 = dead
  episodeCount:      number
  locked:            number
  categories:        Record<string, string> | null  // { "12": "Business" }
  crawlErrors:       number
  parseErrors:       number
}

export interface PISearchResponse {
  status:      string
  feeds:       PIFeed[]
  count:       number
  max:         number
  description: string
}

export interface PIByIdResponse {
  status: string
  feed:   PIFeed
}

/* ── Auth header builder ─────────────────────────────────── */
function buildAuthHeaders(): Record<string, string> {
  const apiKey    = process.env.PODCAST_INDEX_API_KEY
  const apiSecret = process.env.PODCAST_INDEX_API_SECRET

  if (!apiKey || !apiSecret) {
    throw new Error("PODCAST_INDEX_API_KEY and PODCAST_INDEX_API_SECRET must be set")
  }

  const authDate   = Math.floor(Date.now() / 1000)
  const hashInput  = `${apiKey}${apiSecret}${authDate}`
  const authToken  = createHash("sha1").update(hashInput).digest("hex")

  return {
    "X-Auth-Key":   apiKey,
    "X-Auth-Date":  String(authDate),
    "Authorization": `Podcast ${authToken}`,
    "User-Agent":   "PodcastMatchAI/1.0 (hi@podmatch.ai)",
    "Accept":       "application/json",
  }
}

/* ── Shared fetcher ─────────────────────────────────────── */
async function piFetch<T>(path: string, params: Record<string, string>): Promise<T> {
  const url = new URL(`${BASE_URL}${path}`)
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))

  const res = await fetch(url.toString(), {
    headers: buildAuthHeaders(),
    next:    { revalidate: 3600 },   // cache for 1 hour
  })

  if (!res.ok) {
    throw new Error(`Podcast Index API error: ${res.status} ${res.statusText}`)
  }

  return res.json() as Promise<T>
}

/* ── Public API methods ──────────────────────────────────── */

/**
 * Search podcasts by keyword term.
 * Used for text search and category-based discovery.
 */
export async function searchByTerm(
  term:  string,
  max:   number = MAX_RESULTS
): Promise<PIFeed[]> {
  const data = await piFetch<PISearchResponse>("/search/byterm", {
    q:    term,
    max:  String(max),
    clean: "true",    // exclude explicit content
    fulltext: "false",
  })
  return (data.feeds ?? []).filter(f => f.dead !== 1 && f.medium !== "music")
}

/**
 * Get trending podcasts — used for the initial/empty discovery page.
 */
export async function getTrending(
  max:      number = MAX_RESULTS,
  language: string = "en"
): Promise<PIFeed[]> {
  const data = await piFetch<{ status: string; feeds: PIFeed[] }>("/podcasts/trending", {
    max:      String(max),
    lang:     language,
    since:    String(Math.floor(Date.now() / 1000) - 60 * 60 * 24 * 7), // last 7 days
  })
  return (data.feeds ?? []).filter(f => f.dead !== 1 && f.medium !== "music")
}

/**
 * Get a single podcast by its Podcast Index feed ID.
 */
export async function getFeedById(feedId: string): Promise<PIFeed | null> {
  try {
    const data = await piFetch<PIByIdResponse>("/podcasts/byfeedid", {
      id: feedId,
    })
    return data.feed ?? null
  } catch {
    return null
  }
}

/**
 * Get a single podcast by RSS feed URL.
 */
export async function getFeedByUrl(rssUrl: string): Promise<PIFeed | null> {
  try {
    const data = await piFetch<PIByIdResponse>("/podcasts/byfeedurl", {
      url: rssUrl,
    })
    return data.feed ?? null
  } catch {
    return null
  }
}

/**
 * Check whether the Podcast Index API is reachable and credentials are valid.
 */
export async function healthCheck(): Promise<boolean> {
  try {
    await piFetch<{ status: string }>("/categories/list", {})
    return true
  } catch {
    return false
  }
}

/** Whether the API is configured (env vars present). */
export function isConfigured(): boolean {
  return !!(process.env.PODCAST_INDEX_API_KEY && process.env.PODCAST_INDEX_API_SECRET)
}
