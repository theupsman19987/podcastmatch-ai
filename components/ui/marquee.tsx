import * as React from "react"
import { cn } from "@/lib/utils"

/* ═══════════════════════════════════════════════════════════
   Marquee — infinite-scroll ticker.
   Uses CSS animation only (no JS), server-component safe.

   Children are duplicated internally for a seamless loop.
   Edge fade is applied via mask-image.
   ═══════════════════════════════════════════════════════════ */

interface MarqueeProps {
  children: React.ReactNode
  /** Total seconds for one full loop. Default: 40 */
  speed?: number
  /** Scroll direction. Default: "left" */
  direction?: "left" | "right"
  /** Pause animation on hover. Default: true */
  pauseOnHover?: boolean
  /** Remove the left/right edge fade. Default: false */
  noFade?: boolean
  className?: string
}

export function Marquee({
  children,
  speed = 40,
  direction = "left",
  pauseOnHover = true,
  noFade = false,
  className,
}: MarqueeProps) {
  return (
    <div
      className={cn("flex overflow-hidden", className)}
      style={
        noFade
          ? undefined
          : {
              maskImage:
                "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
              WebkitMaskImage:
                "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
            }
      }
    >
      {/* Two identical copies → seamless loop at the -50% midpoint */}
      <div
        className={cn(
          "flex flex-shrink-0 gap-6",
          direction === "left" ? "animate-marquee" : "animate-marquee-reverse",
          pauseOnHover && "hover:[animation-play-state:paused]"
        )}
        style={
          { "--marquee-speed": `${speed}s` } as React.CSSProperties
        }
        aria-hidden="true"
      >
        {children}
        {children}
      </div>
    </div>
  )
}
