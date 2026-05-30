"use client"

import { motion } from "motion/react"
import { Brain, TrendingUp, Star } from "lucide-react"
import type { GeneratedProfile, ProfileInsight } from "@/lib/profile/generate-profile"

const TYPE_ICONS = {
  strength:       TrendingUp,
  opportunity:    Star,
  recommendation: Brain,
} as const

function InsightCard({ insight, index }: { insight: ProfileInsight; index: number }) {
  const Icon = TYPE_ICONS[insight.type] ?? Brain

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 + index * 0.08 }}
      className="relative flex items-start gap-3.5 p-4 rounded-xl border border-border/40 bg-card/50 hover:bg-card/80 hover:border-primary/30 transition-colors duration-200"
    >
      <div className="shrink-0 w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mt-0.5">
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1 capitalize">{insight.type}</p>
        <p className="text-sm text-foreground/85 leading-relaxed">{insight.message}</p>
      </div>
    </motion.div>
  )
}

interface Props { profile: GeneratedProfile }

export function AIInsightsPanel({ profile }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="relative rounded-2xl border border-border/60 bg-card/70 backdrop-blur-sm shadow-[var(--shadow-card)] overflow-hidden"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      <div className="p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 border border-primary/20">
              <Brain className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-foreground">AI Insights</h2>
              <p className="text-xs text-muted-foreground">Personalized from your Creator DNA</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            <span className="text-[10px] font-semibold text-primary uppercase tracking-wider">Live</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {profile.insights.map((insight, i) => (
            <InsightCard key={i} insight={insight} index={i} />
          ))}
        </div>
      </div>
    </motion.div>
  )
}
