"use client"

import { cn } from "@/lib/utils"
import { getOpportunityRank, RANK_CONFIG, type OpportunityRank } from "@/lib/matching/match-engine"

interface OpportunityRankBadgeProps {
  score?:  number
  rank?:   OpportunityRank
  size?:   "xs" | "sm" | "md"
}

export function OpportunityRankBadge({ score, rank: rankProp, size = "sm" }: OpportunityRankBadgeProps) {
  const rank = rankProp ?? (score !== undefined ? getOpportunityRank(score) : "emerging")
  const cfg  = RANK_CONFIG[rank]

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border font-semibold leading-none",
        size === "xs" && "px-1.5 py-0.5 text-[9px]",
        size === "sm" && "px-2 py-0.5 text-[10px]",
        size === "md" && "px-2.5 py-1 text-[11px]",
        cfg.color, cfg.border, cfg.bg
      )}
    >
      {cfg.label}
    </span>
  )
}
