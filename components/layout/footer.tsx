import * as React from "react"
import Link from "next/link"
import { Mic2 } from "lucide-react"
import { cn } from "@/lib/utils"

const NAV_LINKS = [
  { label: "Discover",        href: "/discover"      },
  { label: "How It Works",    href: "/how-it-works"  },
  { label: "Features",        href: "/features"      },
  { label: "Success Stories", href: "/success"       },
  { label: "Pricing",         href: "/pricing"       },
  { label: "Contact",         href: "/contact"       },
]

const LEGAL_LINKS = [
  { label: "Privacy Policy",   href: "#" },
  { label: "Terms of Service", href: "#" },
  { label: "Cookie Policy",    href: "#" },
  { label: "GDPR",             href: "#" },
]

/* ══════════════════════════════════════════════════════
   Footer
   ══════════════════════════════════════════════════════ */
export function Footer() {
  return (
    <footer
      className="relative border-t border-border"
      aria-label="Site footer"
    >
      {/* ── Subtle top glow connector ────────────────── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, oklch(0.58 0.22 255 / 0.35) 30%, oklch(0.70 0.16 200 / 0.35) 70%, transparent)",
        }}
      />

      {/* ── Very subtle background grid ──────────────── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: [
            "linear-gradient(oklch(0.6 0.1 255) 1px, transparent 1px)",
            "linear-gradient(90deg, oklch(0.6 0.1 255) 1px, transparent 1px)",
          ].join(", "),
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

        {/* ── MAIN ROW ───────────────────────────────── */}
        <div className="py-14 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-10">

          {/* Brand ──────────────────────────────────── */}
          <div className="flex flex-col gap-3">
            <Link href="/" className="flex items-center gap-2.5 group" aria-label="PodcastMatch AI home">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-[var(--radius-sm)]",
                  "gradient-primary shadow-[var(--shadow-btn)]",
                  "transition-shadow duration-200 group-hover:shadow-[var(--glow-primary)]"
                )}
              >
                <Mic2 className="size-4 text-white" aria-hidden="true" />
              </div>
              <span className="text-[15px] font-bold text-foreground tracking-tight">
                PodcastMatch{" "}
                <span className="gradient-text-primary">AI</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-[240px]">
              AI-powered podcast visibility for creators who refuse to stay invisible.
            </p>
          </div>

          {/* Nav links ──────────────────────────────── */}
          <nav aria-label="Site navigation">
            <ul className="flex flex-wrap gap-x-8 gap-y-3" role="list">
              {NAV_LINKS.map(link => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors duration-150 hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

        </div>

        {/* ── BOTTOM BAR ─────────────────────────────── */}
        <div className="border-t border-border/50 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">

          <p className="text-xs text-muted-foreground/50 order-2 sm:order-1">
            © {new Date().getFullYear()} PodcastMatch AI. All rights reserved.
          </p>

          <nav aria-label="Legal links" className="order-1 sm:order-2">
            <ul className="flex items-center gap-4" role="list">
              {LEGAL_LINKS.map((link, i) => (
                <li key={link.label} className="flex items-center gap-4">
                  <Link
                    href={link.href}
                    className="text-xs text-muted-foreground/45 transition-colors hover:text-muted-foreground"
                  >
                    {link.label}
                  </Link>
                  {i < LEGAL_LINKS.length - 1 && (
                    <span className="text-border/60 text-xs" aria-hidden="true">·</span>
                  )}
                </li>
              ))}
            </ul>
          </nav>

        </div>

      </div>
    </footer>
  )
}
