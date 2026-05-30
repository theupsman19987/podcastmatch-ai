import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

/* ═══════════════════════════════════════════════════════════
   Card variants — all use the dark luxury system.
   Variant   │ Use case
   ──────────┼────────────────────────────────────────────────
   default   │ Standard panel, dashboard sections
   glass     │ Glassmorphism — hero overlays, floating panels
   elevated  │ Hover-lift cards — features, testimonials
   glow      │ Primary blue glow — AI insights, highlights
   premium   │ Gold accent — pricing, VIP features
   outline   │ Border-only — subtle containers
   flat      │ Muted fill — secondary info blocks
   ═══════════════════════════════════════════════════════════ */
const cardVariants = cva(
  "rounded-[var(--radius-lg)] transition-all duration-200",
  {
    variants: {
      variant: {
        default: [
          "bg-card text-card-foreground",
          "border border-border",
          "shadow-[var(--shadow-card)]",
        ].join(" "),

        glass: [
          "bg-[var(--glass-bg)] text-card-foreground",
          "border border-[var(--glass-border)]",
          "backdrop-blur-lg",
          "shadow-[var(--shadow-card)]",
          "hover:bg-[var(--glass-bg-hover)] hover:border-[var(--glass-border-hover)]",
        ].join(" "),

        elevated: [
          "bg-card text-card-foreground",
          "border border-border",
          "shadow-[var(--shadow-md)]",
          "hover:-translate-y-1 hover:shadow-[var(--shadow-xl)]",
          "hover:border-[oklch(0.30_0.06_250)]",
        ].join(" "),

        glow: [
          "bg-card text-card-foreground",
          "border border-primary/20",
          "shadow-[var(--shadow-card),var(--glow-subtle)]",
          "hover:border-primary/40 hover:shadow-[var(--shadow-md),var(--glow-primary)]",
          "hover:-translate-y-0.5",
        ].join(" "),

        premium: [
          "bg-card text-card-foreground",
          "border border-[oklch(0.50_0.10_83/0.35)]",
          "shadow-[var(--shadow-card),var(--glow-gold)]",
          "hover:border-[oklch(0.78_0.15_83/0.50)]",
          "hover:shadow-[var(--shadow-md),var(--glow-gold-lg)]",
          "hover:-translate-y-0.5",
        ].join(" "),

        outline: [
          "bg-transparent text-foreground",
          "border border-border",
          "hover:bg-secondary/20 hover:border-primary/30",
        ].join(" "),

        flat: [
          "bg-muted/40 text-card-foreground",
          "border border-transparent",
        ].join(" "),
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

/* ── Card ──────────────────────────────────────────────────── */
const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof cardVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(cardVariants({ variant }), className)}
    {...props}
  />
))
Card.displayName = "Card"

/* ── CardHeader ────────────────────────────────────────────── */
const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col gap-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

/* ── CardTitle ─────────────────────────────────────────────── */
const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-tight tracking-tight text-foreground",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

/* ── CardDescription ───────────────────────────────────────── */
const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground leading-relaxed", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

/* ── CardContent ───────────────────────────────────────────── */
const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

/* ── CardFooter ────────────────────────────────────────────── */
const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center gap-3 p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

/* ── CardBadge ─────────────────────────────────────────────── */
type BadgeColor = "blue" | "cyan" | "gold" | "green" | "red" | "muted"

const badgeColorMap: Record<BadgeColor, string> = {
  blue:   "bg-primary/15    text-primary         border-primary/25",
  cyan:   "bg-[oklch(0.70_0.16_200/0.15)] text-[var(--premium-cyan)] border-[oklch(0.70_0.16_200/0.25)]",
  gold:   "bg-[oklch(0.78_0.15_83/0.15)]  text-[var(--premium-gold)] border-[oklch(0.78_0.15_83/0.25)]",
  green:  "bg-[oklch(0.55_0.16_145/0.15)] text-[oklch(0.70_0.16_145)] border-[oklch(0.55_0.16_145/0.25)]",
  red:    "bg-destructive/15 text-destructive     border-destructive/25",
  muted:  "bg-muted          text-muted-foreground border-border",
}

const CardBadge = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement> & { color?: BadgeColor }
>(({ className, color = "blue", ...props }, ref) => (
  <span
    ref={ref}
    className={cn(
      "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
      badgeColorMap[color],
      className
    )}
    {...props}
  />
))
CardBadge.displayName = "CardBadge"

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardBadge,
  cardVariants,
}
