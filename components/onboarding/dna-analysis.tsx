"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "motion/react"
import { CheckCircle2, Sparkles } from "lucide-react"
import { useDNA } from "./dna-context"
import { completeDnaAssessment } from "@/lib/actions/dna"
import { saveCreatorProfile }    from "@/lib/actions/profile"
import { generateProfile }       from "@/lib/profile/generate-profile"
import { trackClientEvent }      from "@/lib/analytics/track"

const ANALYSIS_STEPS = [
  "Mapping your expertise profile...",
  "Profiling your target audience...",
  "Identifying podcast opportunities...",
  "Building your creator identity...",
  "Generating AI match scores...",
  "Preparing your dashboard...",
]

export function DNAAnalysis() {
  const router = useRouter()
  const { formData } = useDNA()
  const [revealed, setRevealed] = useState(0)
  const [savesDone, setSavesDone] = useState(false)

  useEffect(() => {
    try {
      localStorage.setItem("podmatch_creator_dna", JSON.stringify(formData))
    } catch { /* ignore */ }

    const profile = generateProfile(formData)
    Promise.allSettled([
      completeDnaAssessment(formData),
      saveCreatorProfile(profile),
      trackClientEvent({ event: "dna_completed" }),
    ]).then(() => setSavesDone(true))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (revealed < ANALYSIS_STEPS.length) {
      const t = setTimeout(() => setRevealed(r => r + 1), revealed === 0 ? 600 : 550)
      return () => clearTimeout(t)
    }
    // Wait for the Supabase write before navigating so the profile page reads
    // the new answers instead of the previous assessment's data. Fall back to
    // 3 s if the write is unusually slow.
    const t = setTimeout(() => router.push("/dashboard"), savesDone ? 900 : 3000)
    return () => clearTimeout(t)
  }, [revealed, savesDone, router])

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center w-full max-w-sm mx-auto"
    >
      {/* Pulsing orb */}
      <div className="relative mb-10">
        <div className="w-24 h-24 rounded-full bg-primary/8 border border-primary/20 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-primary/12 border border-primary/25 flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-7 h-7 text-primary" />
            </motion.div>
          </div>
        </div>
        <motion.div
          className="absolute inset-0 rounded-full border border-primary/15"
          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute inset-0 rounded-full border border-primary/10"
          animate={{ scale: [1, 1.8, 1], opacity: [0.3, 0, 0.3] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
        />
      </div>

      <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-3 leading-tight">
        Analyzing Your Creator DNA
      </h1>
      <p className="text-muted-foreground text-sm md:text-base max-w-xs mb-10 leading-relaxed">
        Building your creator profile and identifying your strongest podcast opportunities.
      </p>

      <div className="flex flex-col gap-3 w-full text-left">
        <AnimatePresence>
          {ANALYSIS_STEPS.slice(0, revealed).map((label, i) => {
            const isDone = i < revealed - 1
            const isActive = i === revealed - 1
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -14 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="flex items-center gap-3"
              >
                <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-colors duration-300 ${
                  isDone ? "bg-primary/15" : "bg-border/20"
                }`}>
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                  ) : isActive ? (
                    <motion.div
                      className="w-2 h-2 rounded-full bg-primary"
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 0.7, repeat: Infinity }}
                    />
                  ) : null}
                </div>
                <span className={`text-sm transition-colors duration-300 ${
                  isDone ? "text-muted-foreground line-through" : "text-foreground"
                }`}>
                  {label}
                </span>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
