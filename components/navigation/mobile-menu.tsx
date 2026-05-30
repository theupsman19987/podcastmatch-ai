"use client"

import { useEffect } from "react"
import { motion } from "motion/react"
import Link from "next/link"
import { X, ArrowRight, Sparkles } from "lucide-react"
import { ShimmerButton } from "@/components/ui/shimmer-button"
import { NavLogo } from "@/components/navigation/nav-logo"
import { cn } from "@/lib/utils"

interface NavLink {
  label: string
  href: string
  description?: string
}

interface MobileMenuProps {
  links: NavLink[]
  pathname: string
  onClose: () => void
}

export function MobileMenu({ links, pathname, onClose }: MobileMenuProps) {
  /* ── ESC to close ─────────────────────────────────── */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [onClose])

  return (
    <>
      {/* ── BACKDROP ───────────────────────────────────── */}
      <motion.div
        aria-hidden="true"
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
      />

      {/* ── SLIDE PANEL ────────────────────────────────── */}
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className="fixed bottom-0 right-0 top-0 z-50 flex w-[min(85vw,380px)] flex-col
                   border-l border-[var(--glass-border)]
                   shadow-[var(--shadow-2xl)]"
        style={{ background: "oklch(0.10 0.028 252 / 0.96)", backdropFilter: "blur(28px)", WebkitBackdropFilter: "blur(28px)" }}
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 280 }}
      >

        {/* ── PANEL HEADER ─────────────────────────────── */}
        <div className="flex items-center justify-between border-b border-[var(--glass-border)] px-5 py-4">
          <NavLogo />
          <button
            onClick={onClose}
            aria-label="Close navigation menu"
            className="flex h-8 w-8 items-center justify-center rounded-md
                       text-muted-foreground transition-colors duration-150
                       hover:bg-muted hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* ── NAV LINKS ────────────────────────────────── */}
        <nav
          className="flex-1 overflow-y-auto px-4 py-5"
          aria-label="Mobile navigation"
        >
          <div className="flex flex-col gap-1">
            {links.map(({ label, href, description }, i) => {
              const isActive = pathname === href
              return (
                <motion.div
                  key={href}
                  initial={{ opacity: 0, x: 18 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.32,
                    delay: 0.06 + i * 0.04,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <Link
                    href={href}
                    onClick={onClose}
                    className={cn(
                      "group flex items-center justify-between rounded-xl px-4 py-3.5",
                      "text-sm font-medium transition-all duration-150",
                      isActive
                        ? "border border-[var(--glass-border-hover)] bg-[var(--glass-bg-hover)] text-foreground"
                        : "border border-transparent text-muted-foreground hover:bg-[var(--glass-bg)] hover:text-foreground"
                    )}
                  >
                    <div className="min-w-0">
                      <span className="block">{label}</span>
                      {description && (
                        <span className="mt-0.5 block text-xs text-muted-foreground/70">
                          {description}
                        </span>
                      )}
                    </div>
                    {isActive ? (
                      <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                    ) : (
                      <ArrowRight
                        className="size-3.5 flex-shrink-0 text-muted-foreground/40
                                   transition-transform duration-150 group-hover:translate-x-0.5
                                   group-hover:text-muted-foreground"
                      />
                    )}
                  </Link>
                </motion.div>
              )
            })}
          </div>

          {/* ── AI INDICATOR (mobile) ────────────────────── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.3 }}
            className="mt-6 flex items-center gap-2 rounded-xl border border-[var(--glass-border)]
                       bg-[var(--glass-bg)] px-4 py-3"
          >
            <Sparkles className="size-3.5 text-[var(--premium-cyan)] flex-shrink-0" />
            <div>
              <p className="text-xs font-medium text-foreground">AI Matching Engine</p>
              <p className="text-[11px] text-muted-foreground">847 new matches found today</p>
            </div>
            <span className="relative ml-auto flex h-2 w-2 flex-shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--premium-cyan)] opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--premium-cyan)]" />
            </span>
          </motion.div>
        </nav>

        {/* ── BOTTOM CTA ───────────────────────────────── */}
        <motion.div
          className="border-t border-[var(--glass-border)] px-5 pb-8 pt-5"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <ShimmerButton variant="premium" size="lg" className="group w-full">
            Start Matching Free
            <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </ShimmerButton>
          <p className="mt-3 text-center text-[11px] text-muted-foreground">
            No credit card required · Cancel anytime
          </p>
        </motion.div>

      </motion.div>
    </>
  )
}
