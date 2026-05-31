/* ═══════════════════════════════════════════════════════════
   GET /api/podcasts — Podcast search + discovery endpoint.

   Behavior:
   1. If PODCAST_INDEX_API_KEY is set → fetch from Podcast Index
   2. Otherwise → return normalized mock data as fallback

   Query params:
     q         — search term (optional)
     category  — single category name (optional)
     page      — 1-indexed page (default 1)
     pageSize  — results per page (default 40, max 50)

   FUTURE EXPANSION:
   - Add source= param to select Apple, Spotify, etc.
   - Add language= param
   - Add sort= param (score, date, popularity)
   - Add a database layer between API fetch and response
     to enable persistent storage and cross-session caching
   ═══════════════════════════════════════════════════════════ */

import { NextRequest, NextResponse } from "next/server"
import { MOCK_PODCASTS } from "@/components/discovery/mock-data"
import { CATEGORY_SEARCH_TERMS } from "@/lib/podcasts/category-map"
import { normalizePodcastIndex } from "@/lib/podcasts/normalize"
import { deduplicateByRss } from "@/lib/podcasts/deduplicate"
import { enrichAll } from "@/lib/podcasts/enrich"
import { isConfigured, searchByTerm, getTrending } from "@/lib/podcasts/sources/podcast-index"
import type { PodcastApiResponse } from "@/lib/podcasts/schema"
import type { DiscoveryPodcast } from "@/components/discovery/mock-data"

const DEFAULT_PAGE_SIZE = 40
const MAX_PAGE_SIZE     = 50

/* ── Mock data fallback ───────────────────────────────────── */
function buildMockResponse(
  q:        string,
  page:     number,
  pageSize: number
): PodcastApiResponse {
  let filtered: DiscoveryPodcast[] = MOCK_PODCASTS

  if (q) {
    const term = q.toLowerCase()
    filtered = MOCK_PODCASTS.filter(p =>
      [p.name, p.host, p.description, ...p.categories].join(" ").toLowerCase().includes(term)
    )
  }

  const total      = filtered.length
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const start      = (page - 1) * pageSize
  const data       = filtered.slice(start, start + pageSize)
    .map(p => ({ ...p, source: "mock" as const }))

  return { data, total, page, pageSize, totalPages, source: "mock" }
}

/* ── Real data fetch ──────────────────────────────────────── */
async function buildRealResponse(
  q:        string,
  category: string,
  page:     number,
  pageSize: number
): Promise<PodcastApiResponse> {
  let searchTerm = q.trim()

  // Append category-specific keywords if no free-text query
  if (!searchTerm && category) {
    searchTerm = CATEGORY_SEARCH_TERMS[category] ?? category
  }

  // Default: fetch trending business/leadership podcasts for blank search
  if (!searchTerm) {
    searchTerm = "business entrepreneurship leadership"
  }

  // Fetch more than needed to allow dedup + page slicing
  const fetchMax = Math.min(MAX_PAGE_SIZE * 3, 100)
  const raw = searchTerm
    ? await searchByTerm(searchTerm, fetchMax)
    : await getTrending(fetchMax)

  const records = normalizePodcastIndex(raw)
  const unique  = deduplicateByRss(records)

  // Category filter (post-dedup)
  const filtered = category
    ? unique.filter(r => r.categories.includes(category))
    : unique

  const enriched   = enrichAll(filtered)
  const total      = enriched.length
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const start      = (page - 1) * pageSize
  const data       = enriched
    .slice(start, start + pageSize)
    .map(p => ({ ...p, source: "podcast-index" as const }))

  return { data, total, page, pageSize, totalPages, source: "podcast-index" }
}

/* ── Route handler ────────────────────────────────────────── */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const sp       = request.nextUrl.searchParams
  const q        = sp.get("q")        ?? ""
  const category = sp.get("category") ?? ""
  const page     = Math.max(1, parseInt(sp.get("page") ?? "1", 10))
  const pageSize = Math.min(MAX_PAGE_SIZE, parseInt(sp.get("pageSize") ?? String(DEFAULT_PAGE_SIZE), 10))

  try {
    const response = isConfigured()
      ? await buildRealResponse(q, category, page, pageSize)
      : buildMockResponse(q, page, pageSize)

    return NextResponse.json(response, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        "X-Data-Source": response.source,
      },
    })
  } catch (err) {
    console.error("[/api/podcasts] Error:", err)
    // Always fall back to mock data — the UI should never break
    return NextResponse.json(buildMockResponse(q, page, pageSize))
  }
}
