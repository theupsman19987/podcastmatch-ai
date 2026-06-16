"use client"

/* ═══════════════════════════════════════════════════════════
   PerformanceContext — distributes aggregate contact method
   performance data (fetched server-side once per page load)
   to all cards in the discovery grid.
   ═══════════════════════════════════════════════════════════ */

import { createContext, useContext } from "react"
import type { ContactMethodPerformanceMap } from "@/lib/outreach/intelligence"

const PerformanceContext = createContext<ContactMethodPerformanceMap>({})

export function PerformanceProvider({
  data,
  children,
}: {
  data:     ContactMethodPerformanceMap
  children: React.ReactNode
}) {
  return (
    <PerformanceContext.Provider value={data}>
      {children}
    </PerformanceContext.Provider>
  )
}

export function usePerformance(): ContactMethodPerformanceMap {
  return useContext(PerformanceContext)
}
