import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap",
    "rounded-[var(--radius-md)] text-sm font-medium cursor-pointer select-none",
    "transition-all duration-200",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
    "focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "disabled:pointer-events-none disabled:opacity-40",
    "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  ].join(" "),
  {
    variants: {
      variant: {
        /* Primary — Electric Blue CTA */
        default: [
          "bg-primary text-primary-foreground font-semibold",
          "shadow-[var(--shadow-btn)]",
          "hover:bg-primary/90 hover:shadow-[var(--shadow-btn-hover)] hover:-translate-y-px",
          "active:translate-y-0 active:scale-[0.98]",
        ].join(" "),

        /* Secondary — Royal Blue */
        secondary: [
          "bg-secondary text-secondary-foreground",
          "border border-border",
          "hover:bg-secondary/80 hover:border-primary/40",
          "active:scale-[0.98]",
        ].join(" "),

        /* Ghost — transparent fill */
        ghost: [
          "text-foreground bg-transparent",
          "hover:bg-muted hover:text-foreground",
          "active:scale-[0.98]",
        ].join(" "),

        /* Outline — border-only */
        outline: [
          "border border-border bg-transparent text-foreground",
          "hover:bg-secondary/50 hover:border-primary/40",
          "active:scale-[0.98]",
        ].join(" "),

        /* Destructive */
        destructive: [
          "bg-destructive text-destructive-foreground",
          "hover:bg-destructive/90",
          "active:scale-[0.98]",
        ].join(" "),

        /* Link */
        link: "text-primary underline-offset-4 hover:underline",

        /* Premium Glow — Blue→Cyan gradient with electric glow */
        premium: [
          "gradient-primary text-white font-semibold tracking-wide",
          "shadow-[var(--shadow-btn-premium)]",
          "border border-[oklch(0.70_0.16_200/0.20)]",
          "hover:shadow-[var(--glow-cyan-lg)] hover:-translate-y-0.5",
          "active:translate-y-0 active:scale-[0.98]",
        ].join(" "),

        /* Gold — Premium warm accent */
        gold: [
          "gradient-gold text-[oklch(0.08_0.025_255)] font-semibold",
          "shadow-[var(--shadow-btn-gold)]",
          "hover:shadow-[var(--glow-gold-lg)] hover:-translate-y-0.5",
          "active:translate-y-0 active:scale-[0.98]",
        ].join(" "),
      },
      size: {
        xs:      "h-7  px-3   text-xs rounded-[var(--radius-xs)]",
        sm:      "h-8  px-4   text-xs",
        default: "h-10 px-5   py-2",
        lg:      "h-12 px-8   text-base",
        xl:      "h-14 px-10  text-base font-semibold tracking-wide",
        icon:    "h-10 w-10",
        "icon-sm": "h-8 w-8",
        "icon-lg": "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
