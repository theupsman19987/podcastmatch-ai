"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button, type ButtonProps } from "@/components/ui/button"

interface ShimmerButtonProps extends ButtonProps {
  shimmerColor?: string
}

const ShimmerButton = React.forwardRef<HTMLButtonElement, ShimmerButtonProps>(
  ({ className, children, shimmerColor = "oklch(1 0 0 / 0.22)", ...props }, ref) => {
    return (
      <Button
        ref={ref}
        className={cn("relative overflow-hidden", className)}
        {...props}
      >
        {/* Shimmer sweep */}
        <span
          aria-hidden="true"
          className="animate-shimmer-sweep pointer-events-none absolute inset-0 w-[40%]"
          style={{
            background: `linear-gradient(105deg, transparent 20%, ${shimmerColor} 50%, transparent 80%)`,
          }}
        />
        {/* Content above shimmer */}
        <span className="relative z-10 inline-flex items-center gap-2">
          {children}
        </span>
      </Button>
    )
  }
)
ShimmerButton.displayName = "ShimmerButton"

export { ShimmerButton }
