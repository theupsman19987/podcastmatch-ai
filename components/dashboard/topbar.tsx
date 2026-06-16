"use client"

import { useState } from "react"
import { motion } from "motion/react"
import { Search, Bell, ChevronDown, Menu, Zap, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useSidebar } from "@/components/dashboard/sidebar-context"

/* ═══════════════════════════════════════════════════════════
   DashboardTopbar — fixed header for the dashboard shell.
   Contains: mobile menu toggle | page title | search |
             AI status | notifications | profile dropdown.
   ═══════════════════════════════════════════════════════════ */

export function DashboardTopbar({
  title = "Dashboard",
  firstName,
  initials,
  avatarUrl,
}: {
  title?:     string
  firstName?: string
  initials?:  string
  avatarUrl?: string | null
}) {
  const { openMobile } = useSidebar()
  const [profileOpen, setProfileOpen] = useState(false)
  const displayName    = firstName || "Account"
  const displayInitials = initials || "?"

  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex h-14 shrink-0 items-center gap-3",
        "border-b border-border/50 bg-card/80 px-4 sm:px-6",
        "backdrop-blur-[20px] backdrop-saturate-150"
      )}
      role="banner"
    >
      {/* ── Mobile menu toggle ────────────────────────────── */}
      <button
        onClick={openMobile}
        aria-label="Open navigation menu"
        aria-controls="mobile-dashboard-menu"
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg
                   text-muted-foreground transition-colors duration-150
                   hover:bg-[var(--glass-bg)] hover:text-foreground lg:hidden"
      >
        <Menu className="size-4" aria-hidden="true" />
      </button>

      {/* ── Page title ────────────────────────────────────── */}
      <div className="hidden sm:flex flex-col justify-center min-w-0 mr-2">
        <h1 className="text-sm font-semibold text-foreground tracking-tight leading-none">{title}</h1>
        <p className="mt-0.5 text-[10px] text-muted-foreground leading-none">PodcastMatch AI</p>
      </div>

      {/* ── Divider ───────────────────────────────────────── */}
      <div className="hidden sm:block h-5 w-px bg-border/60 shrink-0" aria-hidden="true" />

      {/* ── Search ────────────────────────────────────────── */}
      <div className="relative flex-1 max-w-sm">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground/60"
          aria-hidden="true"
        />
        <input
          type="search"
          placeholder="Search podcasts, matches…"
          aria-label="Search dashboard"
          className={cn(
            "h-8 w-full rounded-[var(--radius-md)] border border-border/60 bg-muted/40",
            "pl-8 pr-3 text-sm text-foreground placeholder:text-muted-foreground/50",
            "transition-all duration-200 outline-none",
            "focus:border-primary/40 focus:bg-muted/60 focus:shadow-[var(--glow-subtle)]"
          )}
        />
        <kbd
          className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2
                     hidden rounded border border-border/50 bg-muted px-1
                     text-[9px] font-medium text-muted-foreground/50 sm:inline-flex"
          aria-hidden="true"
        >
          ⌘K
        </kbd>
      </div>

      {/* ── Right cluster ─────────────────────────────────── */}
      <div className="ml-auto flex items-center gap-1.5">

        {/* AI Status pill */}
        <AIStatusPill />

        {/* Platform status */}
        <div
          aria-label="All systems operational"
          title="All systems operational"
          className="hidden md:flex items-center gap-1.5 rounded-full border border-[oklch(0.55_0.16_145/0.25)]
                     bg-[oklch(0.55_0.16_145/0.06)] px-2.5 py-1 cursor-default
                     transition-colors hover:bg-[oklch(0.55_0.16_145/0.10)]"
        >
          <CheckCircle2 className="size-3 text-[oklch(0.70_0.16_145)]" aria-hidden="true" />
          <span className="text-[10px] font-medium text-[oklch(0.70_0.16_145)]">All systems go</span>
        </div>

        {/* Notifications */}
        <button
          aria-label="Notifications — 3 unread"
          className="relative flex h-8 w-8 items-center justify-center rounded-lg
                     text-muted-foreground transition-colors duration-150
                     hover:bg-[var(--glass-bg)] hover:text-foreground"
        >
          <Bell className="size-4" aria-hidden="true" />
          <span
            aria-hidden="true"
            className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-primary
                       shadow-[0_0_6px_oklch(0.58_0.220_255/0.80)]"
          />
        </button>

        {/* Profile dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(p => !p)}
            aria-expanded={profileOpen}
            aria-haspopup="menu"
            aria-label="Account menu"
            className="flex h-8 items-center gap-1.5 rounded-lg border border-border/50
                       bg-muted/40 px-2 text-sm transition-all duration-150
                       hover:border-border hover:bg-muted/60"
          >
            <div className="flex h-5 w-5 items-center justify-center rounded-full gradient-primary text-[9px] font-bold text-white overflow-hidden shrink-0" aria-hidden="true">
              {avatarUrl
                ? <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
                : displayInitials
              }
            </div>
            <span className="hidden text-[12px] font-medium text-foreground sm:block">{displayName}</span>
            <ChevronDown className={cn("size-3 text-muted-foreground transition-transform duration-150", profileOpen && "rotate-180")} aria-hidden="true" />
          </button>

          {/* Clickaway overlay — only interactive when open */}
          {profileOpen && (
            <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)} aria-hidden="true" />
          )}

          {/* Dropdown — always mounted so fade-out can play */}
          <motion.div
            role="menu"
            aria-label="Account options"
            animate={{ opacity: profileOpen ? 1 : 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            style={{ pointerEvents: profileOpen ? "auto" : "none" }}
            className={cn(
              "absolute right-0 top-[calc(100%+6px)] z-20 w-48",
              "rounded-[var(--radius-lg)] border border-border bg-card",
              "shadow-[var(--shadow-lg)] py-1.5"
            )}
          >
            {/* User name header inside dropdown */}
            <div className="px-3 py-2 border-b border-border/40 mb-1">
              <p className="text-[12px] font-semibold text-foreground truncate">{displayName}</p>
              <a href="/" className="text-[11px] text-primary hover:underline">← Home page</a>
            </div>
            {[
              { label: "Profile",          href: "/dashboard/profile" },
              { label: "Account Settings", href: "/dashboard/settings" },
              { label: "Billing",          href: "/dashboard/billing" },
              { label: "Sign Out",         href: "/login", danger: true },
            ].map(item => (
              <a
                key={item.label}
                href={item.href}
                role="menuitem"
                onClick={() => setProfileOpen(false)}
                className={cn(
                  "flex h-8 items-center px-3 text-[13px] transition-colors duration-100",
                  item.danger
                    ? "text-destructive hover:bg-destructive/10"
                    : "text-foreground/80 hover:bg-[var(--glass-bg)] hover:text-foreground"
                )}
              >
                {item.label}
              </a>
            ))}
          </motion.div>
        </div>

      </div>
    </header>
  )
}

/* ── AI Status pill ───────────────────────────────────────── */
function AIStatusPill() {
  return (
    <div
      aria-label="AI matching engine active — 847 new matches"
      title="AI matching engine active — 847 new matches today"
      className="hidden sm:flex items-center gap-1.5 rounded-full border border-[oklch(0.70_0.16_200/0.20)]
                 bg-[oklch(0.70_0.16_200/0.06)] px-2.5 py-1 cursor-default
                 transition-colors hover:border-[oklch(0.70_0.16_200/0.35)] hover:bg-[oklch(0.70_0.16_200/0.10)]"
    >
      {/* Pulsing dot */}
      <span className="relative flex h-1.5 w-1.5 shrink-0">
        <span
          className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--premium-cyan)] opacity-60"
          aria-hidden="true"
        />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--premium-cyan)]" aria-hidden="true" />
      </span>
      <Zap className="size-3 text-[var(--premium-cyan)]" aria-hidden="true" />
      <span className="text-[10px] font-semibold tracking-wide text-[var(--premium-cyan)]">
        AI Active
      </span>
    </div>
  )
}
