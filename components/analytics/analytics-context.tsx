"use client"

import { createContext, useContext, useState, useMemo } from "react"
import {
  type TimeRange,
  type DataPoint,
  VISIBILITY_SERIES,
  MATCH_TREND_SERIES,
  METRIC_VALUES,
  SPARK_VISIBILITY,
  SPARK_REACH,
  SPARK_MATCH,
  SPARK_MOMENTUM,
  SPARK_OUTREACH,
  SPARK_RESPONSE,
} from "@/components/analytics/analytics-mock"

/* ═══════════════════════════════════════════════════════════
   AnalyticsContext — time-range state + derived chart data.
   Swap static series with real API calls when backend ready.
   ═══════════════════════════════════════════════════════════ */

interface MetricSnapshot {
  current:  number
  previous: number
  pctDelta: number   // positive = growth
  spark:    number[]
}

interface AnalyticsContextValue {
  range:          TimeRange
  setRange:       (r: TimeRange) => void

  /* Chart series for the selected range */
  visibilitySeries:  DataPoint[]
  matchTrendSeries:  DataPoint[]

  /* Per-metric snapshots */
  metrics: {
    visibility: MetricSnapshot
    reach:      MetricSnapshot
    match:      MetricSnapshot
    momentum:   MetricSnapshot
    outreach:   MetricSnapshot
    response:   MetricSnapshot
  }
}

const AnalyticsContext = createContext<AnalyticsContextValue | null>(null)

function buildSnapshot(
  current: number,
  previous: number,
  spark: number[],
): MetricSnapshot {
  const pctDelta = previous === 0 ? 0 : Math.round(((current - previous) / previous) * 100)
  return { current, previous, pctDelta, spark }
}

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const [range, setRange] = useState<TimeRange>("30d")

  const value = useMemo((): AnalyticsContextValue => {
    const mv = METRIC_VALUES[range]

    return {
      range,
      setRange,
      visibilitySeries: VISIBILITY_SERIES[range],
      matchTrendSeries:  MATCH_TREND_SERIES[range],
      metrics: {
        visibility: buildSnapshot(mv.visibility[0], mv.visibility[1], SPARK_VISIBILITY[range]),
        reach:      buildSnapshot(mv.reach[0],      mv.reach[1],      SPARK_REACH[range]),
        match:      buildSnapshot(mv.match[0],      mv.match[1],      SPARK_MATCH[range]),
        momentum:   buildSnapshot(mv.momentum[0],   mv.momentum[1],   SPARK_MOMENTUM[range]),
        outreach:   buildSnapshot(mv.outreach[0],   mv.outreach[1],   SPARK_OUTREACH[range]),
        response:   buildSnapshot(mv.response[0],   mv.response[1],   SPARK_RESPONSE[range]),
      },
    }
  }, [range])

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  )
}

export function useAnalytics(): AnalyticsContextValue {
  const ctx = useContext(AnalyticsContext)
  if (!ctx) throw new Error("useAnalytics must be used within <AnalyticsProvider>")
  return ctx
}
