"use client"

import { useState, useEffect, useCallback } from "react"
import { usePathname, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "motion/react"
import Link from "next/link"
import { Menu, ArrowRight, LogOut } from "lucide-react"
import { ShimmerButton } from "@/components/ui/shimmer-button"
import { NavLogo } from "@/components/navigation/nav-logo"
import { MobileMenu } from "@/components/navigation/mobile-menu"
import { createClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"

/* ── Navigation structure ───────────────────────────────────── */
const NAV_LINKS = [
  { label: "Overview",         href: "/",              description: "Platform overview" },
  { label: "Discover",          href: "/discover",      description: "AI-curated opportunities for you" },
  { label: "How It Works",     href: "/how-it-works",  description: "See the AI matching process" },
  { label: "Features",         href: "/features",      description: "Everything the platform offers" },
  { label: "Success Stories",  href: "/success",       description: "Creators who got booked" },
  { label: "Pricing",          href: "/pricing",       description: "Free and Pro plans" },
  { label: "Dashboard",        href: "/dashboard",     description: "Your booking workspace" },
]

/* ── Navbar ─────────────────────────────────────────────────── */
export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  /* Auth state — sync on mount and on every auth change */
  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(({ data }) => {
      setIsLoggedIn(!!data.session)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setIsLoggedIn(!!session)
    })
    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = useCallback(async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }, [router])

  /* Scroll detection — passive for performance */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll() // set initial state
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  /* Lock body scroll while mobile menu is open */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [mobileOpen])

  /* Close mobile menu on route change */
  useEffect(() => { setMobileOpen(false) }, [pathname])

  const closeMobile = useCallback(() => setMobileOpen(false), [])

  return (
    <>
      {/* ══════════════════════════════════════════════════════
          HEADER ELEMENT
          Entrance: slides down from above on page load.
          Scroll: transitions from transparent → dark glass.
          ══════════════════════════════════════════════════════ */}
      <motion.header
        /* Entrance animation — one-time, fires on mount */
        initial={{ y: -72, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.55, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
        /* Scroll-aware styles via inline — allows smooth CSS transition
           across background, blur, border, and shadow simultaneously */
        style={{
          transition:
            "background 280ms cubic-bezier(0.16,1,0.3,1), " +
            "backdrop-filter 280ms cubic-bezier(0.16,1,0.3,1), " +
            "-webkit-backdrop-filter 280ms cubic-bezier(0.16,1,0.3,1), " +
            "border-color 280ms cubic-bezier(0.16,1,0.3,1), " +
            "box-shadow 280ms cubic-bezier(0.16,1,0.3,1), " +
            "height 280ms cubic-bezier(0.16,1,0.3,1)",
          background: scrolled
            ? "oklch(0.08 0.025 255 / 0.88)"
            : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "blur(0px)",
          WebkitBackdropFilter: scrolled ? "blur(20px)" : "blur(0px)",
          borderBottomColor: scrolled
            ? "oklch(0.22 0.050 250 / 0.80)"
            : "transparent",
          boxShadow: scrolled ? "var(--shadow-sm)" : "none",
        }}
        className="fixed inset-x-0 top-0 z-50 border-b"
        role="banner"
      >
        <nav
          aria-label="PodcastMatch AI main navigation"
          className={cn(
            "container mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8",
            "transition-[height] duration-300",
            scrolled ? "h-14" : "h-16"
          )}
        >

          {/* ── LOGO ─────────────────────────────────────── */}
          <NavLogo />

          {/* ── DESKTOP NAV LINKS ────────────────────────── */}
          <div
            className="hidden items-center gap-0.5 lg:flex"
            role="list"
          >
            {NAV_LINKS.map(({ label, href }) => (
              <NavLink
                key={href}
                href={href}
                label={label}
                isActive={pathname === href || pathname.startsWith(href + "/")}
              />
            ))}
          </div>

          {/* ── RIGHT CLUSTER ────────────────────────────── */}
          <div className="flex items-center gap-2.5">

            {/* AI live indicator — hidden on small screens */}
            <AIIndicator />

            {/* Desktop CTA / Logout */}
            <div className="hidden sm:block">
              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="flex h-9 items-center gap-1.5 rounded-lg border border-border/60 bg-muted/30 px-4
                             text-sm font-medium text-muted-foreground
                             transition-all duration-150
                             hover:border-border hover:bg-muted/60 hover:text-foreground"
                  aria-label="Sign out"
                >
                  <LogOut className="size-3.5" aria-hidden="true" />
                  Log Out
                </button>
              ) : (
                <ShimmerButton variant="premium" size="sm" className="group h-9 gap-1.5 px-4">
                  Start Matching
                  <ArrowRight
                    className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </ShimmerButton>
              )}
            </div>

            {/* Mobile hamburger — visible below lg */}
            <button
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              className="flex h-9 w-9 items-center justify-center rounded-lg
                         text-muted-foreground transition-colors duration-150
                         hover:bg-[var(--glass-bg)] hover:text-foreground
                         lg:hidden"
            >
              <Menu className="size-5" aria-hidden="true" />
            </button>

          </div>
        </nav>
      </motion.header>

      {/* ── MOBILE MENU ──────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <MobileMenu
            links={NAV_LINKS}
            pathname={pathname}
            onClose={closeMobile}
          />
        )}
      </AnimatePresence>
    </>
  )
}

/* ── NavLink ──────────────────────────────────────────────────
   Desktop navigation link with:
   - Active state: foreground text + small blue dot below
   - Hover: text brightens + subtle background fill
   ─────────────────────────────────────────────────────────── */
function NavLink({
  href,
  label,
  isActive,
}: {
  href: string
  label: string
  isActive: boolean
}) {
  return (
    <Link
      href={href}
      role="listitem"
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "relative rounded-md px-3.5 py-2 text-[14px] font-bold transition-all duration-150",
        "hover:bg-[var(--glass-bg)] hover:text-foreground",
        isActive
          ? "text-foreground"
          : "text-muted-foreground"
      )}
    >
      {label}

      {/* Active indicator — small dot that fades in */}
      <AnimatePresence>
        {isActive && (
          <motion.span
            layoutId="nav-active-dot"
            className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-primary"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.2 }}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>
    </Link>
  )
}

/* ── AIIndicator ──────────────────────────────────────────────
   Small pill that communicates live AI activity.
   Visible on md+ screens. Subtle cyan pulse dot.
   ─────────────────────────────────────────────────────────── */
function AIIndicator() {
  return (
    <div
      aria-label="AI matching engine is active"
      title="AI matching engine — 847 new matches found today"
      className="hidden cursor-default items-center gap-1.5 rounded-full
                 border border-[oklch(0.70_0.16_200/0.20)]
                 bg-[oklch(0.70_0.16_200/0.05)]
                 px-2.5 py-1 md:flex
                 transition-colors duration-150
                 hover:border-[oklch(0.70_0.16_200/0.35)]
                 hover:bg-[oklch(0.70_0.16_200/0.08)]"
    >
      {/* Pulsing live dot */}
      <span className="relative flex h-1.5 w-1.5 flex-shrink-0">
        <span
          className="absolute inline-flex h-full w-full animate-ping rounded-full
                     bg-[var(--premium-cyan)] opacity-60"
          aria-hidden="true"
        />
        <span
          className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--premium-cyan)]"
          aria-hidden="true"
        />
      </span>
      <span className="text-[10px] font-medium tracking-wide text-[var(--premium-cyan)]">
        AI Matching Live
      </span>
    </div>
  )
}
