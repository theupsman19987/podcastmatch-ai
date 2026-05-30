"use client"

import { motion } from "motion/react"
import { Sparkles } from "lucide-react"
import type { GeneratedProfile } from "@/lib/profile/generate-profile"

interface RowProps { label: string; value: string }

function Row({ label, value }: RowProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 py-3.5 border-b border-border/30 last:border-0">
      <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider shrink-0 sm:w-40 pt-0.5">
        {label}
      </span>
      <p className="text-sm text-foreground/90 leading-relaxed flex-1">{value}</p>
    </div>
  )
}

interface Props { profile: GeneratedProfile }

export function BrandIdentity({ profile }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="relative rounded-2xl border border-border/60 bg-card/70 backdrop-blur-sm shadow-[var(--shadow-card)] overflow-hidden"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      <div className="p-6 md:p-8">
        <div className="flex items-center gap-2.5 mb-6">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 border border-primary/20">
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-foreground">AI Brand Profile</h2>
            <p className="text-xs text-muted-foreground">Generated from your Creator DNA Assessment</p>
          </div>
        </div>

        <div className="divide-y divide-border/0">
          <Row label="Mission Statement"  value={profile.missionStatement} />
          <Row label="Core Message"       value={profile.coreMessage} />
          <Row label="Primary Expertise"  value={profile.primaryExpertise} />
          <Row label="Audience Served"    value={profile.audienceServed} />
          <Row label="Creator Positioning" value={profile.creatorPositioning} />
        </div>
      </div>
    </motion.div>
  )
}
