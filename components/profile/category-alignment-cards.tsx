"use client"

import { motion } from "motion/react"
import { LayoutGrid, TrendingUp } from "lucide-react"
import type { GeneratedProfile, CategoryAlignment } from "@/lib/profile/generate-profile"

function opportunityColor(strength: string) {
  if (strength === "High")   return "bg-yellow-500/10 border-yellow-500/30 text-yellow-400"
  if (strength === "Medium") return "bg-primary/10 border-primary/30 text-primary"
  return "bg-muted/30 border-border/40 text-muted-foreground"
}

function alignmentColor(pct: number) {
  if (pct >= 80) return "oklch(0.85 0.16 85)"
  if (pct >= 65) return "oklch(var(--primary))"
  if (pct >= 50) return "oklch(0.72 0.17 200)"
  return "oklch(0.55 0.08 240)"
}

function CategoryCard({ item, index }: { item: CategoryAlignment; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, delay: 0.1 + index * 0.06 }}
      className="relative flex flex-col gap-3 p-4 rounded-xl border border-border/40 bg-card/50 hover:border-primary/30 hover:bg-card/80 transition-colors duration-200"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-foreground/90 leading-tight">{item.name}</span>
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${opportunityColor(item.opportunityStrength)}`}>
          {item.opportunityStrength}
        </span>
      </div>

      {/* Alignment bar */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Alignment</span>
          <span className="text-xs font-bold text-foreground">{item.alignment}%</span>
        </div>
        <div className="h-1.5 w-full bg-border/20 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: alignmentColor(item.alignment) }}
            initial={{ width: 0 }}
            animate={{ width: `${item.alignment}%` }}
            transition={{ duration: 0.8, delay: 0.2 + index * 0.06, ease: "easeOut" }}
          />
        </div>
      </div>

      <p className="text-[11px] text-muted-foreground leading-snug">{item.recommendationLevel}</p>
    </motion.div>
  )
}

interface Props { profile: GeneratedProfile }

export function CategoryAlignmentCards({ profile }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.25 }}
      className="relative rounded-2xl border border-border/60 bg-card/70 backdrop-blur-sm shadow-[var(--shadow-card)] overflow-hidden"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      <div className="p-6 md:p-8">
        <div className="flex items-center gap-2.5 mb-6">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 border border-primary/20">
            <LayoutGrid className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-foreground">Category Alignment</h2>
            <p className="text-xs text-muted-foreground">Podcast categories matched to your DNA</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {profile.categoryAlignments.map((item, i) => (
            <CategoryCard key={item.name} item={item} index={i} />
          ))}
        </div>
      </div>
    </motion.div>
  )
}
