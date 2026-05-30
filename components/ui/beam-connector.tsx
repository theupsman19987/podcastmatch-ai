import * as React from "react"
import { cn } from "@/lib/utils"

/* ═══════════════════════════════════════════════════════════
   BeamConnector — animated light beam between workflow steps.
   CSS-only, server-component safe.

   Horizontal variant: sits between cards in desktop flex row.
   Vertical variant:   sits between cards in mobile stack.

   The "sweep" effect uses background-position animation on a
   gradient — no JS width measurements required.
   ═══════════════════════════════════════════════════════════ */

type BeamColor = "primary" | "cyan" | "gold"

const BEAM: Record<BeamColor, { track: string; bright: string }> = {
  primary: {
    track:  "oklch(0.58 0.22 255 / 0.18)",
    bright: "oklch(0.68 0.22 255 / 0.95)",
  },
  cyan: {
    track:  "oklch(0.70 0.16 200 / 0.18)",
    bright: "oklch(0.78 0.16 200 / 0.95)",
  },
  gold: {
    track:  "oklch(0.78 0.15 83 / 0.18)",
    bright: "oklch(0.90 0.15 83 / 0.95)",
  },
}

export interface BeamConnectorProps {
  color?:    BeamColor
  delay?:    number
  vertical?: boolean
  className?: string
}

export function BeamConnector({
  color = "primary",
  delay = 0,
  vertical = false,
  className,
}: BeamConnectorProps) {
  const b = BEAM[color]

  /* ── Vertical (mobile stack) ──────────────────────────── */
  if (vertical) {
    return (
      <div
        className={cn("flex justify-start items-center h-8 pl-7", className)}
        aria-hidden="true"
      >
        <div
          className="w-px h-full rounded-full"
          style={{
            background: `linear-gradient(180deg, ${b.bright} 0%, ${b.track} 60%, transparent 100%)`,
            opacity: 0.6,
          }}
        />
      </div>
    )
  }

  /* ── Horizontal (desktop row) ─────────────────────────── */
  return (
    <div
      className={cn(
        "relative hidden lg:flex items-start w-14 flex-shrink-0 pt-11 px-0.5",
        className
      )}
      aria-hidden="true"
    >
      <div className="relative w-full">
        {/* Static track */}
        <div
          className="h-px w-full rounded-full"
          style={{ background: b.track }}
        />
        {/* Traveling light pulse */}
        <div
          className="absolute inset-0 h-px animate-beam-sweep rounded-full"
          style={{
            background: `linear-gradient(90deg,
              transparent 0%,
              transparent 25%,
              ${b.bright} 50%,
              transparent 75%,
              transparent 100%
            )`,
            backgroundSize: "300% 100%",
            animationDelay: `${delay}s`,
          }}
        />
      </div>
    </div>
  )
}
