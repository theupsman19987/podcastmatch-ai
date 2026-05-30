"use client"

import { motion } from "motion/react"
import { Clock, Calendar, Mic2, Hash, Radio, Users, BookOpen } from "lucide-react"
import { cn } from "@/lib/utils"
import { type DiscoveryPodcast } from "@/components/discovery/mock-data"
import { type EpisodeItem } from "@/components/podcast-profile/profile-mock"

/* ═══════════════════════════════════════════════════════════
   PodcastDetails — episode info grid + recent episodes.
   ═══════════════════════════════════════════════════════════ */

interface PodcastDetailsProps {
  podcast:         DiscoveryPodcast
  episodeLength:   string
  publishingSchedule: string
  guestStyle:      string
  totalEpisodes:   number
  estimatedReach:  string
  recentEpisodes:  EpisodeItem[]
}

const INFO_GRID = (props: PodcastDetailsProps) => [
  { icon: Clock,   label: "Episode Length",   value: props.episodeLength        },
  { icon: Calendar,label: "Schedule",          value: props.publishingSchedule   },
  { icon: Mic2,    label: "Guest Style",       value: props.guestStyle           },
  { icon: Hash,    label: "Total Episodes",    value: String(props.totalEpisodes) },
  { icon: Radio,   label: "Est. Reach",        value: `${props.estimatedReach}+` },
  { icon: Users,   label: "Audience Size",     value: `${props.podcast.audienceSize}K` },
]

export function PodcastDetails(props: PodcastDetailsProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.4 }}
      aria-labelledby="podcast-details-heading"
      className="flex flex-col gap-5 rounded-[var(--radius-xl)] border border-border bg-card p-6 shadow-[var(--shadow-card)]"
    >
      {/* Top-edge highlight */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-t-[var(--radius-xl)]
                   bg-gradient-to-r from-transparent via-[oklch(0.96_0_0/0.08)] to-transparent"
      />

      {/* Header */}
      <div className="flex items-center gap-2">
        <BookOpen className="size-4 text-muted-foreground" aria-hidden="true" />
        <h2 id="podcast-details-heading" className="text-sm font-semibold text-foreground">
          Podcast Details
        </h2>
      </div>

      {/* Description */}
      <p className="text-[13px] leading-relaxed text-muted-foreground">
        {props.podcast.description}
      </p>

      {/* Info grid */}
      <div
        className="grid grid-cols-2 gap-3 sm:grid-cols-3"
        role="list"
        aria-label="Podcast information"
      >
        {INFO_GRID(props).map((item, i) => (
          <motion.div
            key={item.label}
            role="listitem"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 + i * 0.05, duration: 0.3 }}
            className="flex flex-col gap-1.5 rounded-[var(--radius-lg)] border border-border/40
                       bg-muted/20 p-3 transition-colors hover:bg-muted/30"
          >
            <item.icon className="size-3.5 text-muted-foreground/60" aria-hidden="true" />
            <span className="text-[11px] text-muted-foreground/70">{item.label}</span>
            <span className="text-[13px] font-semibold text-foreground">{item.value}</span>
          </motion.div>
        ))}
      </div>

      {/* Recent episodes */}
      <div className="flex flex-col gap-3">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/50">
          Recent Episodes
        </p>
        <div className="flex flex-col divide-y divide-border/30">
          {props.recentEpisodes.map((ep, i) => (
            <motion.div
              key={ep.title}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.06, duration: 0.3 }}
              className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0
                         transition-colors hover:bg-muted/10 rounded-[var(--radius-md)] px-1"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Mic2 className="size-3.5 text-primary" aria-hidden="true" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[12px] font-medium text-foreground">{ep.title}</p>
                <p className="text-[10px] text-muted-foreground">{ep.topic} · {ep.date}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}
