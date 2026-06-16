/* ═══════════════════════════════════════════════════════════
   Deduplication — prevents the same podcast from appearing
   multiple times in results from different sources.

   PRIMARY KEY: normalized rssFeed URL
   SECONDARY:   fuzzy name + host match (for same podcast on
                multiple platforms with different RSS URLs)

   DUPLICATE PREVENTION STRATEGY:
   1. Normalize RSS URL (remove tracking params, trailing slashes)
   2. If same RSS URL → keep higher-quality record (by source priority)
   3. If different RSS but same name+host → flag as probable duplicate
   4. All dedup decisions are logged for audit
   ═══════════════════════════════════════════════════════════ */

import type { PodcastRecord, DeduplicationResult, DataSource } from "@/lib/podcasts/schema"

/* Source quality priority (highest first) */
const SOURCE_PRIORITY: Record<DataSource, number> = {
  "curated":       5,   // manually enriched > all API sources
  "apple":         4,
  "podcast-index": 3,
  "spotify":       2,
  "podchaser":     2,
  "listen-notes":  1,
  "mock":          0,
}

/* ── URL normalization ────────────────────────────────────── */
function normalizeUrl(url: string): string {
  try {
    const u = new URL(url.toLowerCase().trim())
    // Remove common tracking params
    u.searchParams.delete("utm_source")
    u.searchParams.delete("utm_medium")
    u.searchParams.delete("utm_campaign")
    u.searchParams.delete("at")        // Apple affiliate
    u.searchParams.delete("ct")        // iTunes
    // Normalize scheme to https
    u.protocol = "https:"
    // Remove trailing slash
    return u.toString().replace(/\/$/, "")
  } catch {
    return url.toLowerCase().trim().replace(/\/$/, "")
  }
}

/* ── Name similarity (simple normalized Levenshtein) ──────── */
function normalizeName(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+(podcast|show|the|a|an)\s+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

function areProbableDuplicates(a: PodcastRecord, b: PodcastRecord): boolean {
  const nameA = normalizeName(a.name)
  const nameB = normalizeName(b.name)
  const hostA = a.host.toLowerCase().split(" ")[0]  // first name only
  const hostB = b.host.toLowerCase().split(" ")[0]

  // Same normalized name AND same first-name host → probable duplicate
  return nameA === nameB && hostA === hostB
}

/* ── Main dedup function ──────────────────────────────────── */
export function deduplicatePodcasts(records: PodcastRecord[]): DeduplicationResult {
  const seen      = new Map<string, PodcastRecord>()   // rssKey → winner
  const duplicates: DeduplicationResult["duplicates"] = []

  for (const record of records) {
    const rssKey = normalizeUrl(record.rssFeed)

    if (seen.has(rssKey)) {
      const existing = seen.get(rssKey)!
      const existingPriority = SOURCE_PRIORITY[existing.source] ?? 0
      const newPriority      = SOURCE_PRIORITY[record.source]   ?? 0

      if (newPriority > existingPriority) {
        // New record is from a higher-quality source — replace
        seen.set(rssKey, record)
        duplicates.push({ kept: record, duplicate: existing, reason: "same-rss-higher-source-quality" })
      } else {
        // Keep existing — log the duplicate
        duplicates.push({ kept: existing, duplicate: record, reason: "same-rss-url" })
      }
    } else {
      seen.set(rssKey, record)
    }
  }

  // Secondary pass: flag probable duplicates (different RSS, same name+host)
  const unique = Array.from(seen.values())
  for (let i = 0; i < unique.length; i++) {
    for (let j = i + 1; j < unique.length; j++) {
      if (areProbableDuplicates(unique[i], unique[j])) {
        // Keep the one with higher source priority
        const pi = SOURCE_PRIORITY[unique[i].source] ?? 0
        const pj = SOURCE_PRIORITY[unique[j].source] ?? 0
        if (pi >= pj) {
          duplicates.push({ kept: unique[i], duplicate: unique[j], reason: "probable-duplicate-name-host" })
          unique.splice(j, 1)
          j--
        } else {
          duplicates.push({ kept: unique[j], duplicate: unique[i], reason: "probable-duplicate-name-host" })
          unique.splice(i, 1)
          i--
          break
        }
      }
    }
  }

  return { unique, duplicates }
}

/** Quick dedup for a single source — just by RSS URL. */
export function deduplicateByRss<T extends { rssFeed: string }>(records: T[]): T[] {
  const seen = new Set<string>()
  return records.filter(r => {
    const key = normalizeUrl(r.rssFeed)
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}
