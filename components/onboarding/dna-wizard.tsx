"use client"

import { AnimatePresence, motion } from "motion/react"
import { Mic2 } from "lucide-react"
import { useDNA, TOTAL_STEPS } from "./dna-context"
import { DNAProgress } from "./dna-progress"
import { DNAAnalysis } from "./dna-analysis"
import { Step1Story } from "./steps/step-1-story"
import { Step2Expertise } from "./steps/step-2-expertise"
import { Step3Audience } from "./steps/step-3-audience"
import { Step4Communication } from "./steps/step-4-communication"
import { Step5Interests } from "./steps/step-5-interests"
import { Step6Visibility } from "./steps/step-6-visibility"
import { Step7Positioning } from "./steps/step-7-positioning"

const STEPS = [
  Step1Story,
  Step2Expertise,
  Step3Audience,
  Step4Communication,
  Step5Interests,
  Step6Visibility,
  Step7Positioning,
]

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 56 : -56, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit:  (dir: number) => ({ x: dir > 0 ? -56 : 56, opacity: 0 }),
}

export function DNAWizard() {
  const { step, direction, complete } = useDNA()
  const StepComponent = STEPS[step - 1]

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Ambient atmosphere */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden>
        <div className="absolute top-1/4 left-1/5 w-[480px] h-[480px] rounded-full bg-primary/4 blur-[80px]" />
        <div className="absolute bottom-1/3 right-1/5 w-[360px] h-[360px] rounded-full bg-primary/3 blur-[60px]" />
        <div
          className="absolute inset-0 opacity-[0.012]"
          style={{
            backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-center pt-8 pb-4 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 border border-primary/20">
            <Mic2 className="w-4 h-4 text-primary" />
          </div>
          <span className="text-sm font-semibold text-foreground/70 tracking-wide">PodcastMatch AI</span>
        </div>
      </header>

      {/* Main */}
      <main className="relative z-10 flex-1 flex flex-col items-center px-4 pb-16 pt-6">
        {complete ? (
          <DNAAnalysis />
        ) : (
          <>
            {/* Progress */}
            <div className="w-full max-w-2xl mb-8">
              <DNAProgress step={step} />
            </div>

            {/* Step */}
            <div className="w-full max-w-2xl">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={step}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.28, ease: "easeInOut" }}
                >
                  <StepComponent />
                </motion.div>
              </AnimatePresence>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
