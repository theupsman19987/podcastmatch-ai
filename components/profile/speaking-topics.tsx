"use client"

import { motion } from "motion/react"
import { MessageSquare } from "lucide-react"
import type { GeneratedProfile } from "@/lib/profile/generate-profile"

interface Props { profile: GeneratedProfile }

export function SpeakingTopics({ profile }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="relative rounded-2xl border border-border/60 bg-card/70 backdrop-blur-sm shadow-[var(--shadow-card)] overflow-hidden"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      <div className="p-6 md:p-8">
        <div className="flex items-center gap-2.5 mb-6">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 border border-primary/20">
            <MessageSquare className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-foreground">Speaking Topics</h2>
            <p className="text-xs text-muted-foreground">Your highest-resonance conversation topics</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {profile.speakingTopics.map((topic, i) => (
            <motion.span
              key={topic}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.1 + i * 0.05 }}
              className="px-3 py-1.5 rounded-full text-xs font-semibold border border-primary/25 bg-primary/8 text-primary hover:bg-primary/15 hover:border-primary/40 transition-colors duration-150 cursor-default"
            >
              {topic}
            </motion.span>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
