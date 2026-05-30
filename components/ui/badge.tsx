import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        /* Status badges */
        default:     "bg-primary/15    text-primary         border-primary/25",
        secondary:   "bg-secondary     text-secondary-foreground border-border",
        destructive: "bg-destructive/15 text-destructive    border-destructive/25",
        outline:     "bg-transparent   text-foreground      border-border",

        /* Premium color badges */
        cyan:   "bg-[oklch(0.70_0.16_200/0.12)] text-[var(--premium-cyan)] border-[oklch(0.70_0.16_200/0.25)]",
        gold:   "bg-[oklch(0.78_0.15_83/0.12)]  text-[var(--premium-gold)] border-[oklch(0.78_0.15_83/0.25)]",
        green:  "bg-[oklch(0.55_0.16_145/0.12)] text-[oklch(0.70_0.16_145)] border-[oklch(0.55_0.16_145/0.25)]",
        amber:  "bg-[oklch(0.72_0.17_60/0.12)]  text-[oklch(0.78_0.17_60)] border-[oklch(0.72_0.17_60/0.25)]",
        purple: "bg-[oklch(0.55_0.18_290/0.12)] text-[oklch(0.72_0.18_290)] border-[oklch(0.55_0.18_290/0.25)]",

        /* AI / special */
        ai: [
          "bg-gradient-to-r from-primary/15 to-[oklch(0.70_0.16_200/0.15)]",
          "text-[var(--premium-cyan)] border-[oklch(0.70_0.16_200/0.30)]",
        ].join(" "),

        /* Muted / subdued */
        muted: "bg-muted text-muted-foreground border-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
