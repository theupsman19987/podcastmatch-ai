/* ═══════════════════════════════════════════════════════════
   Pure client-safe utilities for performance-based scoring.
   No "use server" — safe to import in client components.
   ═══════════════════════════════════════════════════════════ */

import type { ContactMethodPerformanceMap } from "@/lib/outreach/intelligence"

/* ── Match score boost from contact method performance ───── */
export function contactMethodBoost(
  rank:    number,
  perfMap: ContactMethodPerformanceMap,
): number {
  const perf = perfMap[rank]
  if (!perf || perf.attempts < 3) return 0

  // Weighted signal: response rate matters more than booking rate
  const signal = perf.responseRate * 0.7 + perf.bookingRate * 0.3

  if (signal >= 70) return 10
  if (signal >= 50) return 6
  if (signal >= 35) return 3
  if (signal >= 20) return 0
  return -3  // penalise consistently low-performing methods
}

/* ── Human-readable performance label ───────────────────── */
export function performanceLabel(
  rank:    number,
  perfMap: ContactMethodPerformanceMap,
): { text: string; tier: "high" | "medium" | "low" } | null {
  const perf = perfMap[rank]
  if (!perf || perf.attempts < 3) return null

  if (perf.responseRate >= 50) {
    return {
      text: `${perf.responseRate}% response rate across ${perf.attempts} pitches`,
      tier: "high",
    }
  }
  if (perf.responseRate >= 25) {
    return {
      text: `${perf.responseRate}% response rate across ${perf.attempts} pitches`,
      tier: "medium",
    }
  }
  return {
    text: `${perf.responseRate}% response rate — lower than average`,
    tier: "low",
  }
}
