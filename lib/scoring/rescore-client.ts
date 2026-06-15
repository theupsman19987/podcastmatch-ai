"use client"

import { computeAndSaveScore } from "@/lib/actions/scoring"
import type { ScoringResult } from "@/lib/actions/scoring"

/**
 * Single-flight, debounced scoring scheduler.
 *
 * Guarantees:
 *  - Only one computeAndSaveScore() runs at a time per browser session.
 *  - Calls within 300ms of each other are coalesced into one compute.
 *  - If a new save arrives while a compute is already in-flight, the
 *    loop re-runs once after the current compute settles so ALL changes
 *    are reflected in the final persisted score.
 *  - computeAndSaveScore() always fetches fresh DB state, so stale
 *    local data is never used.
 */

let debounceTimer: ReturnType<typeof setTimeout> | null = null
let inFlight:      Promise<ScoringResult> | null = null
let needsRerun:    boolean = false

async function runLoop(): Promise<ScoringResult> {
  let result!: ScoringResult
  do {
    needsRerun = false
    result = await computeAndSaveScore()
  } while (needsRerun)
  return result
}

export function scheduleRescore(): Promise<ScoringResult> {
  // Every call resets the 300ms window — absorbs rapid sequential saves
  if (debounceTimer) clearTimeout(debounceTimer)

  // If already in-flight, mark for one follow-up run and share the promise
  if (inFlight) {
    needsRerun = true
    return inFlight
  }

  // Fire after 300ms of silence
  return new Promise<ScoringResult>((resolve, reject) => {
    debounceTimer = setTimeout(() => {
      debounceTimer = null
      inFlight = runLoop().finally(() => { inFlight = null })
      inFlight.then(resolve, reject)
    }, 300)
  })
}
