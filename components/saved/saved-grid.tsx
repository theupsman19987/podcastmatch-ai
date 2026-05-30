"use client"

import { useSaved }         from "@/components/saved/saved-context"
import { SavedCard }        from "@/components/saved/saved-card"
import { SavedEmptyState }  from "@/components/saved/empty-state"
import { AnimatePresence, motion } from "motion/react"

/* ═══════════════════════════════════════════════════════════
   SavedGrid — responsive grid of SavedCards + empty states.
   ═══════════════════════════════════════════════════════════ */

export function SavedGrid() {
  const { results } = useSaved()

  if (results.length === 0) {
    return <SavedEmptyState />
  }

  return (
    <motion.div
      layout
      className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4"
    >
      <AnimatePresence mode="popLayout">
        {results.map((opp, i) => (
          <SavedCard key={opp.id} opportunity={opp} index={i} />
        ))}
      </AnimatePresence>
    </motion.div>
  )
}
