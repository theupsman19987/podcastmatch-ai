"use client"

import { motion } from "motion/react"
import { Users, Target, AlertCircle, CheckCircle2 } from "lucide-react"
import type { GeneratedProfile } from "@/lib/profile/generate-profile"

const QUADRANTS = [
  { key: "primaryAudience",   label: "Primary Audience",     Icon: Users,        color: "text-primary",    bg: "bg-primary/10 border-primary/20" },
  { key: "secondaryAudience", label: "Secondary Audience",   Icon: Target,       color: "text-cyan-400",   bg: "bg-cyan-500/10 border-cyan-500/20" },
  { key: "audienceChallenges",label: "Audience Challenges",  Icon: AlertCircle,  color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/20" },
  { key: "audienceOutcomes",  label: "Audience Outcomes",    Icon: CheckCircle2, color: "text-emerald-400",bg: "bg-emerald-500/10 border-emerald-500/20" },
] as const

interface Props { profile: GeneratedProfile }

export function AudienceProfileSection({ profile }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.35 }}
      className="relative rounded-2xl border border-border/60 bg-card/70 backdrop-blur-sm shadow-[var(--shadow-card)] overflow-hidden"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      <div className="p-6 md:p-8">
        <div className="flex items-center gap-2.5 mb-6">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 border border-primary/20">
            <Users className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-foreground">Audience Profile</h2>
            <p className="text-xs text-muted-foreground">Who you reach and what you deliver them</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {QUADRANTS.map(({ key, label, Icon, color, bg }, i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.15 + i * 0.07 }}
              className="flex flex-col gap-2.5 p-4 rounded-xl border border-border/40 bg-card/40"
            >
              <div className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-md border flex items-center justify-center ${bg}`}>
                  <Icon className={`w-3.5 h-3.5 ${color}`} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{label}</span>
              </div>
              <p className="text-sm text-foreground/85 leading-relaxed">
                {profile[key]}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
