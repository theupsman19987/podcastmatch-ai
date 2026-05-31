"use client"

import { Globe, ExternalLink, Music, Radio } from "lucide-react"
import { cn } from "@/lib/utils"
import type { DiscoveryPodcast } from "@/components/discovery/mock-data"

/* ═══════════════════════════════════════════════════════════
   PodcastLinks — website, Apple Podcasts, Spotify links.
   Shown on the podcast detail page below PodcastDetails.
   ═══════════════════════════════════════════════════════════ */

interface LinkButtonProps {
  href: string
  icon: React.ElementType
  label: string
  sublabel: string
  cls: string
}

function LinkButton({ href, icon: Icon, label, sublabel, cls }: LinkButtonProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "flex items-center gap-3 rounded-[var(--radius-lg)] border px-4 py-3",
        "transition-all duration-150 hover:-translate-y-0.5",
        "group",
        cls
      )}
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-current/20 bg-current/10">
        <Icon className="size-4" aria-hidden="true" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="text-[12px] font-bold leading-tight">{label}</span>
        <span className="truncate text-[10px] opacity-70">{sublabel}</span>
      </div>
      <ExternalLink className="size-3.5 shrink-0 opacity-0 transition-opacity group-hover:opacity-60" aria-hidden="true" />
    </a>
  )
}

interface PodcastLinksProps {
  podcast: DiscoveryPodcast
}

export function PodcastLinks({ podcast }: PodcastLinksProps) {
  const links = [
    podcast.website  && {
      href:     podcast.website,
      icon:     Globe,
      label:    "Official Website",
      sublabel: podcast.website.replace(/^https?:\/\//, ""),
      cls:      "border-border/50 bg-card text-foreground hover:border-primary/30 hover:bg-primary/5",
    },
    podcast.appleUrl && {
      href:     podcast.appleUrl,
      icon:     Music,
      label:    "Apple Podcasts",
      sublabel: "Listen on Apple Podcasts",
      cls:      "border-[oklch(0.65_0.20_330/0.30)] bg-[oklch(0.65_0.20_330/0.06)] text-[oklch(0.70_0.18_330)] hover:bg-[oklch(0.65_0.20_330/0.12)]",
    },
    podcast.spotifyUrl && {
      href:     podcast.spotifyUrl,
      icon:     Radio,
      label:    "Spotify",
      sublabel: "Listen on Spotify",
      cls:      "border-[oklch(0.65_0.16_145/0.30)] bg-[oklch(0.65_0.16_145/0.06)] text-[oklch(0.68_0.16_145)] hover:bg-[oklch(0.65_0.16_145/0.12)]",
    },
  ].filter(Boolean) as LinkButtonProps[]

  if (links.length === 0) return null

  return (
    <div className="rounded-[var(--radius-xl)] border border-border bg-card shadow-[var(--shadow-card)] overflow-hidden">
      {/* Top-edge glow */}
      <div
        aria-hidden
        className="h-px w-full bg-gradient-to-r from-transparent via-primary/20 to-transparent"
      />

      <div className="p-5">
        <p className="mb-4 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/60">
          Listen &amp; Visit
        </p>
        <div className="flex flex-col gap-2.5">
          {links.map(link => (
            <LinkButton key={link.href} {...link} />
          ))}
        </div>
      </div>
    </div>
  )
}
