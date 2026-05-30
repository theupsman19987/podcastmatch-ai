"use client"

import { motion } from "motion/react"
import { RefreshCw, TrendingUp, Search, Compass } from "lucide-react"
import Link from "next/link"

const ACTIONS = [
  {
    label: "Update Profile",
    description: "Retake the Creator DNA Assessment",
    Icon: RefreshCw,
    href: "/onboarding/creator-dna",
    variant: "outline" as const,
  },
  {
    label: "Improve Visibility",
    description: "Get tips to boost your score",
    Icon: TrendingUp,
    href: "/dashboard",
    variant: "primary" as const,
  },
  {
    label: "Discover Matches",
    description: "Find podcasts aligned to your DNA",
    Icon: Search,
    href: "/dashboard",
    variant: "primary" as const,
  },
  {
    label: "View Opportunities",
    description: "Explore open guest spots",
    Icon: Compass,
    href: "/dashboard",
    variant: "outline" as const,
  },
]

export function QuickActions() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
      className="relative rounded-2xl border border-border/60 bg-card/70 backdrop-blur-sm shadow-[var(--shadow-card)] overflow-hidden"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      <div className="p-6 md:p-8">
        <h2 className="text-sm font-bold text-foreground mb-5">Quick Actions</h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {ACTIONS.map(({ label, description, Icon, href, variant }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.15 + i * 0.06 }}
            >
              <Link
                href={href}
                className={`flex flex-col items-center gap-2.5 p-4 rounded-xl border text-center transition-all duration-200 group
                  ${variant === "primary"
                    ? "border-primary/30 bg-primary/8 hover:bg-primary/15 hover:border-primary/50"
                    : "border-border/40 bg-card/40 hover:bg-card/80 hover:border-primary/25"
                  }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-200
                  ${variant === "primary"
                    ? "bg-primary/15 border border-primary/25 group-hover:bg-primary/25"
                    : "bg-border/20 border border-border/30 group-hover:bg-primary/10 group-hover:border-primary/20"
                  }`}>
                  <Icon className={`w-4 h-4 transition-colors duration-200 ${variant === "primary" ? "text-primary" : "text-muted-foreground group-hover:text-primary"}`} />
                </div>
                <div>
                  <p className={`text-xs font-bold mb-0.5 ${variant === "primary" ? "text-primary" : "text-foreground/80 group-hover:text-foreground"}`}>
                    {label}
                  </p>
                  <p className="text-[10px] text-muted-foreground leading-snug">{description}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
