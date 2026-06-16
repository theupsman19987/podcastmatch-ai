"use server"

/* ═══════════════════════════════════════════════════════════
   RSS Owner Parser — extracts <itunes:owner> from RSS feeds.

   Used to discover producer/host emails that podcast owners
   register with Apple Podcasts. This is often the best
   contact point for booking inquiries.

   Run server-side only — never expose RSS fetching to the
   browser (CORS, no-redirect policies on many feeds).
   ═══════════════════════════════════════════════════════════ */

export interface RSSOwnerInfo {
  ownerName:   string | null
  ownerEmail:  string | null
  feedTitle?:  string | null   // cross-check against stored podcast_name
  parsedAt:    string
}

const TIMEOUT_MS  = 8_000
const USER_AGENT  = "PodcastMatchAI/1.0 (contact-intelligence; +https://podcastmatchai.com)"

function extractTag(xml: string, tag: string): string | null {
  const m = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"))
  return m?.[1]?.trim().replace(/\s+/g, " ") ?? null
}

function extractItunesOwnerBlock(xml: string): string {
  return xml.match(/<itunes:owner>([\s\S]*?)<\/itunes:owner>/i)?.[1] ?? ""
}

/**
 * Fetch and parse an RSS feed to extract iTunes owner contact info.
 * Designed for server-side use inside server actions or API routes.
 * Never throws — always returns a result with parsedAt set.
 */
export async function parseRSSOwner(feedUrl: string): Promise<RSSOwnerInfo> {
  const parsedAt = new Date().toISOString()

  try {
    const res = await fetch(feedUrl, {
      method:  "GET",
      headers: {
        "User-Agent": USER_AGENT,
        "Accept":     "application/rss+xml, application/xml, text/xml, */*",
      },
      signal: AbortSignal.timeout(TIMEOUT_MS),
      // Next.js: don't cache these — always fetch fresh for enrichment jobs
      cache: "no-store",
    })

    if (!res.ok) {
      return { ownerName: null, ownerEmail: null, parsedAt }
    }

    // Limit to first 64 KB — owner block is always near the top of a feed
    const buffer = await res.arrayBuffer()
    const xml    = new TextDecoder("utf-8").decode(buffer.slice(0, 65_536))

    const ownerBlock = extractItunesOwnerBlock(xml)
    const ownerName  = extractTag(ownerBlock, "itunes:name")
    const ownerEmail = extractTag(ownerBlock, "itunes:email")

    // Also extract feed title for cross-reference
    const channelBlock = xml.match(/<channel>([\s\S]*?)<item/i)?.[1] ?? xml
    const feedTitle    = extractTag(channelBlock, "title")

    return { ownerName, ownerEmail, feedTitle, parsedAt }
  } catch {
    return { ownerName: null, ownerEmail: null, parsedAt }
  }
}

/**
 * Batch-parse multiple RSS feeds. Returns a map of feedUrl → result.
 * Rate-limited to concurrency=3 to avoid hammering servers.
 */
export async function parseRSSOwnerBatch(
  feedUrls: string[],
  concurrency = 3,
): Promise<Map<string, RSSOwnerInfo>> {
  const results = new Map<string, RSSOwnerInfo>()
  const queue   = [...feedUrls]

  while (queue.length > 0) {
    const batch = queue.splice(0, concurrency)
    const resolved = await Promise.all(
      batch.map(async url => ({ url, info: await parseRSSOwner(url) }))
    )
    for (const { url, info } of resolved) results.set(url, info)
  }

  return results
}
