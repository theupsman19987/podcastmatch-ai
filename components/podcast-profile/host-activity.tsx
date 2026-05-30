"use client"

import { motion } from "motion/react"
import { Radio, UserCheck, Clock, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"
import { type ActivityItem, type HostProfile } from "@/components/podcast-profile/profile-mock"

/* ═══════════════════════════════════════════════════════════
   HostActivity — shows host publishing, acceptance, and
   growth signals. Creates urgency and trust around timing.
   ═══════════════════════════════════════════════════════════ */

const ACTIVITY_CONFIG: Record<
  ActivityItem["type"],
  { icon: React.ElementType; accent: string; bg: string; border: string; dot: string }
> = {
  published:  {
    icon: Radio,
    accent: "text-[oklch(0.70_0.16_145)]",
    bg:     "bg-[oklch(0.55_0.16_145/0.08)]",
    border: "border-[oklch(0.55_0.16_145/0.20)]",
    dot:    "bg-[oklch(0.65_0.15_145)]",
  },
  accepting: {
    icon: UserCheck,
    accent: "text-primary",
    bg:     "bg-primary/06",
    border: "border-primary/18",
    dot:    "bg-primary",
  },
  responsive: {
    icon: Clock,
    accent: "text-[var(--premium-cyan)]",
    bg:     "bg-[oklch(0.70_0.16_200/0.07)]",
    border: "border-[oklch(0.70_0.16_200/0.18)]",
    dot:    "bg-[var(--premium-cyan)]",
  },
  growing: {
    icon: TrendingUp,
    accent: "text-[var(--premium-gold)]",
    bg:     "bg-[oklch(0.78_0.15_83/0.07)]",
    border: "border-[oklch(0.78_0.15_83/0.18)]",
    dot:    "bg-[var(--premium-gold)]",
  },
}

interface HostActivityProps {
  activity:    ActivityItem[]
  hostProfile: HostProfile
}

export function HostActivity({ activity, hostProfile }: HostActivityProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.4 }}
      aria-labelledby="host-activity-heading"
      className="flex flex-col gap-5 rounded-[var(--radius-xl)] border border-border bg-card p-6 shadow-[var(--shadow-card)]"
    >
      <div className="flex items-center gap-2">
        <div className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[oklch(0.65_0.15_145)] opacity-60" aria-hidden="true" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[oklch(0.65_0.15_145)]" aria-hidden="true" />
        </div>
        <h2 id="host-activity-heading" className="text-sm font-semibold text-foreground">
          Host Activity
        </h2>
        <span className="ml-auto text-[10px] font-medium text-[oklch(0.70_0.16_145)]">Live signals</span>
      </div>

      {/* Activity cards grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2" role="list">
        {activity.map((item, i) => {
          const cfg = ACTIVITY_CONFIG[item.type]
          return (
            <motion.div
              key={item.label}
              role="listitem"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 + i * 0.08, duration: 0.35 }}
              className={cn(
                "flex items-start gap-3 rounded-[var(--radius-lg)] border p-3.5",
                "transition-all duration-150 hover:-translate-y-0.5",
                cfg.bg, cfg.border
              )}
            >
              <div className={cn("mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg", cfg.bg)}>
                <cfg.icon className={cn("size-3.5", cfg.accent)} aria-hidden="true" />
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className={cn("text-[12px] font-semibold", cfg.accent)}>{item.label}</span>
                <span className="text-[10px] text-muted-foreground">{item.meta}</span>
              </div>
              {/* Live dot */}
              <span className={cn("mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full", cfg.dot)} aria-hidden="true" />
            </motion.div>
          )
        })}
      </div>

      {/* Host stats row */}
      <div className="flex flex-wrap gap-4 rounded-[var(--radius-lg)] border border-border/40 bg-muted/20 px-4 py-3.5">
        {[
          { label: "Response Time",   value: hostProfile.responseTime   },
          { label: "Acceptance Rate", value: `${hostProfile.acceptanceRate}%` },
          { label: "Last Booked",     value: hostProfile.lastBooked     },
          { label: "Total Guests",    value: `${hostProfile.totalGuests}+` },
        ].map(stat => (
          <div key={stat.label} className="flex flex-col gap-0.5 min-w-[100px]">
            <span className="text-[10px] text-muted-foreground/60">{stat.label}</span>
            <span className="text-[12px] font-semibold text-foreground">{stat.value}</span>
          </div>
        ))}
      </div>
    </motion.section>
  )
}
