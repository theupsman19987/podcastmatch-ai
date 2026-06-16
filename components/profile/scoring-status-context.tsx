"use client"

import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react"
import { scheduleRescore } from "@/lib/scoring/rescore-client"
import type { ScoreBreakdown } from "@/lib/scoring/visibility-score"

export type ScoringStatus = "idle" | "computing" | "done"

interface ScoringStatusContextValue {
  status:         ScoringStatus
  breakdown:      ScoreBreakdown | null
  delta:          number | null
  triggerRescore: () => void
  dismiss:        () => void
}

const Ctx = createContext<ScoringStatusContextValue | null>(null)

export function ScoringStatusProvider({
  children,
  initialBreakdown,
}: {
  children:          ReactNode
  initialBreakdown?: ScoreBreakdown | null
}) {
  const [status,    setStatus]    = useState<ScoringStatus>("idle")
  const [breakdown, setBreakdown] = useState<ScoreBreakdown | null>(initialBreakdown ?? null)
  const [delta,     setDelta]     = useState<number | null>(null)
  const prevTotalRef = useRef<number | null>(initialBreakdown?.total ?? null)
  const resetTimer   = useRef<ReturnType<typeof setTimeout> | null>(null)

  const dismiss = useCallback(() => {
    if (resetTimer.current) clearTimeout(resetTimer.current)
    setStatus("idle")
    setDelta(null)
  }, [])

  const triggerRescore = useCallback(() => {
    if (resetTimer.current) clearTimeout(resetTimer.current)
    setStatus("computing")
    setDelta(null)

    scheduleRescore()
      .then(result => {
        const prev = prevTotalRef.current
        const next = result.breakdown.total
        const d    = prev !== null ? next - prev : null
        prevTotalRef.current = next
        setDelta(d)
        setBreakdown(result.breakdown)
        setStatus("done")
        resetTimer.current = setTimeout(() => {
          setStatus("idle")
          setDelta(null)
        }, 4000)
      })
      .catch(() => setStatus("idle"))
  }, [])

  return (
    <Ctx.Provider value={{ status, breakdown, delta, triggerRescore, dismiss }}>
      {children}
    </Ctx.Provider>
  )
}

export function useScoringStatus() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error("useScoringStatus must be within ScoringStatusProvider")
  return ctx
}
