/* ═══════════════════════════════════════════════════════════
   GET /api/podcasts — Podcast search + discovery endpoint.

   Data source priority:
   1. `podcasts` Supabase table (curated + contact-enriched)
   2. Podcast Index API (live search, if API key configured)
   3. Mock data (development fallback)

   Query params:
     q         — search term (optional)
     category  — single category name (optional)
     page      — 1-indexed page (default 1)
     pageSize  — results per page (default 40, max 50)
   ═══════════════════════════════════════════════════════════ */

import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { MOCK_PODCASTS } from "@/components/discovery/mock-data"
import { CATEGORY_SEARCH_TERMS } from "@/lib/podcasts/category-map"
import { normalizePodcastIndex } from "@/lib/podcasts/normalize"
import { deduplicateByRss } from "@/lib/podcasts/deduplicate"
import { enrichAll, enrichToDiscoveryPodcast } from "@/lib/podcasts/enrich"
import { isConfigured, searchByTerm, getTrending } from "@/lib/podcasts/sources/podcast-index"
import { computeContactMethodRank, getBestContact, CONTACT_METHOD_LABELS } from "@/lib/podcasts/contact-rank"
import type { PodcastApiResponse } from "@/lib/podcasts/schema"
import type { DiscoveryPodcast } from "@/components/discovery/mock-data"
import type { Database } from "@/lib/supabase/database.types"

type PodcastRow = Database["public"]["Tables"]["podcasts"]["Row"]

const DEFAULT_PAGE_SIZE = 40
const MAX_PAGE_SIZE     = 50

/* ── Normalize a curated DB row → DiscoveryPodcast ───────── */
function normalizeDbRow(row: PodcastRow): DiscoveryPodcast {
  const contactFields = {
    producerEmail:  row.producer_email,
    hostEmail:      row.host_email,
    bookingEmail:   row.booking_email,
    contactFormUrl: row.contact_form_url,
    bookingLink:    row.booking_link,
    linkedinUrl:    row.linkedin_url,
    instagramUrl:   row.instagram_url,
  }
  const rank        = computeContactMethodRank(contactFields)
  const bestContact = getBestContact(contactFields)

  // Feed through the standard enrichment pipeline so scores/badges are consistent
  const base = enrichToDiscoveryPodcast({
    id:             `curated_${row.slug}`,
    externalId:     row.slug,
    source:         "curated",
    name:           row.podcast_name,
    host:           row.host_name,
    description:    row.description ?? "",
    categories:     row.categories,
    rssFeed:        row.rss_feed_url ?? row.website ?? `https://podcasts.apple.com`,
    website:        row.website     ?? undefined,
    appleUrl:       row.apple_url   ?? undefined,
    spotifyUrl:     row.spotify_url ?? undefined,
    episodeCount:   row.episode_count,
    lastPublished:  row.last_episode_date ?? undefined,
    language:       row.language,
    artwork:        row.artwork_url ?? undefined,
    guestFriendly:  row.accepts_guests,
    activityStatus: row.activity_status as "active" | "hiatus" | "inactive",
    importedAt:     row.created_at,
  })

  // Override quality-driven match score for curated entries
  const qualityBoost = Math.round((row.quality_score - 50) / 5)

  return {
    ...base,
    source:            "curated",
    matchScore:        Math.min(98, Math.max(50, base.matchScore + qualityBoost)),
    audienceAlignment: Math.min(98, Math.max(50, base.audienceAlignment + qualityBoost)),
    // Contact intelligence fields
    contactMethodRank: rank,
    bestContactMethod: bestContact ? CONTACT_METHOD_LABELS[rank] : undefined,
    bestContactValue:  bestContact?.value,
    producerName:      row.producer_name      ?? undefined,
    producerEmail:     row.producer_email     ?? undefined,
    hostEmail:         row.host_email         ?? undefined,
    bookingEmail:      row.booking_email      ?? undefined,
    contactFormUrl:    row.contact_form_url   ?? undefined,
    bookingLink:       row.booking_link       ?? undefined,
    instagramUrl:      row.instagram_url      ?? undefined,
    linkedinUrl:       row.linkedin_url       ?? undefined,
    youtubeUrl:        row.youtube_url        ?? undefined,
    guestRequirements: row.guest_requirements ?? undefined,
    typicalGuestType:  row.typical_guest_type ?? undefined,
    qualityScore:      row.quality_score,
    curated:           row.curated,
  }
}

/* ── DB-first response ────────────────────────────────────── */
async function buildDbResponse(
  q:        string,
  category: string,
  page:     number,
  pageSize: number
): Promise<PodcastApiResponse | null> {
  try {
    const supabase = await createClient()
    let query = supabase
      .from("podcasts")
      .select("*")
      .eq("activity_status", "active")

    if (category) {
      query = query.contains("categories", [category])
    }

    if (q.trim()) {
      query = query.or(
        `podcast_name.ilike.%${q}%,host_name.ilike.%${q}%,description.ilike.%${q}%`
      )
    }

    const { data, error } = await query
      .order("quality_score", { ascending: false })
      .order("episode_count", { ascending: false })

    if (error || !data || data.length === 0) return null

    const enriched   = data.map(normalizeDbRow)
    const total      = enriched.length
    const totalPages = Math.max(1, Math.ceil(total / pageSize))
    const start      = (page - 1) * pageSize
    const slice      = enriched.slice(start, start + pageSize)

    return { data: slice, total, page, pageSize, totalPages, source: "curated" }
  } catch {
    return null
  }
}

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

/* ── Podcast Index fallback ───────────────────────────────── */
async function buildRealResponse(
  q:        string,
  category: string,
  page:     number,
  pageSize: number
): Promise<PodcastApiResponse> {
  let searchTerm = q.trim()

  if (!searchTerm && category) {
    searchTerm = CATEGORY_SEARCH_TERMS[category] ?? category
  }

  if (!searchTerm) {
    searchTerm = "business entrepreneurship leadership"
  }

  const fetchMax = Math.min(MAX_PAGE_SIZE * 3, 100)
  const raw = searchTerm
    ? await searchByTerm(searchTerm, fetchMax)
    : await getTrending(fetchMax)

  const records = normalizePodcastIndex(raw)
  const unique  = deduplicateByRss(records)

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
    // 1. Try curated DB
    const dbResponse = await buildDbResponse(q, category, page, pageSize)
    if (dbResponse) {
      return NextResponse.json(dbResponse, {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
          "X-Data-Source": "curated-db",
        },
      })
    }

    // 2. Try Podcast Index API
    if (isConfigured()) {
      const apiResponse = await buildRealResponse(q, category, page, pageSize)
      return NextResponse.json(apiResponse, {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
          "X-Data-Source": "podcast-index",
        },
      })
    }

    // 3. Mock fallback
    return NextResponse.json(buildMockResponse(q, page, pageSize), {
      headers: { "X-Data-Source": "mock" },
    })
  } catch (err) {
    console.error("[/api/podcasts] Error:", err)
    return NextResponse.json(buildMockResponse(q, page, pageSize))
  }
}
