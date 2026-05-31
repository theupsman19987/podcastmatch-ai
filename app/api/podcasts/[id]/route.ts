/* ═══════════════════════════════════════════════════════════
   GET /api/podcasts/[id] — single podcast lookup.

   ID formats:
   - "pi_920666"  → Podcast Index ID prefix
   - "mock_123"   → mock data ID prefix
   - Any other    → look up in MOCK_PODCASTS by id field

   FUTURE EXPANSION:
   - Add "ap_12345" for Apple ID prefix
   - Add "sp_abc"   for Spotify ID prefix
   - Replace mock lookup with database query
   ═══════════════════════════════════════════════════════════ */

import { NextRequest, NextResponse } from "next/server"
import { MOCK_PODCASTS } from "@/components/discovery/mock-data"
import { normalizePodcastIndex } from "@/lib/podcasts/normalize"
import { enrichToDiscoveryPodcast } from "@/lib/podcasts/enrich"
import { isConfigured, getFeedById } from "@/lib/podcasts/sources/podcast-index"

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id } = await params

  /* Podcast Index record */
  if (id.startsWith("pi_") && isConfigured()) {
    try {
      const feedId = id.slice(3)
      const feed   = await getFeedById(feedId)
      if (feed) {
        const [record] = normalizePodcastIndex([feed])
        const podcast  = enrichToDiscoveryPodcast(record)
        return NextResponse.json({ data: podcast, source: "podcast-index" }, {
          headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200" },
        })
      }
    } catch {
      /* fall through to mock */
    }
  }

  /* Mock data lookup */
  const podcast = MOCK_PODCASTS.find(p => p.id === id) ?? null
  if (!podcast) {
    return NextResponse.json({ error: "Podcast not found" }, { status: 404 })
  }
  return NextResponse.json({ data: { ...podcast, source: "mock" }, source: "mock" })
}
