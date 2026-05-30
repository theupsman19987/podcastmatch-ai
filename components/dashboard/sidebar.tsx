"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { AnimatePresence, motion } from "motion/react"
import {
  LayoutDashboard,
  Search,
  Sparkles,
  Bookmark,
  Send,
  BarChart3,
  Bell,
  Settings,
  ChevronLeft,
  X,
  Mic2,
  UserRound,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useSidebar } from "@/components/dashboard/sidebar-context"

/* ── Navigation structure ───────────────────────────────────── */
const NAV_GROUPS = [
  {
    label: "Overview",
    items: [
      { label: "Dashboard",   href: "/dashboard",           icon: LayoutDashboard },
    ],
  },
  {
    label: "Discover",
    items: [
      { label: "Discover Podcasts", href: "/dashboard/discover", icon: Search    },
      { label: "AI Matches",        href: "/dashboard/matches",  icon: Sparkles  },
    ],
  },
  {
    label: "Manage",
    items: [
      { label: "Saved Opportunities", href: "/dashboard/saved",    icon: Bookmark },
      { label: "Outreach",            href: "/dashboard/outreach", icon: Send     },
    ],
  },
  {
    label: "Insights",
    items: [
      { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
    ],
  },
  {
    label: "Creator",
    items: [
      { label: "My Profile", href: "/dashboard/profile", icon: UserRound },
    ],
  },
]

const BOTTOM_ITEMS = [
  { label: "Notifications", href: "/dashboard/notifications", icon: Bell,     badge: 3 },
  { label: "Settings",      href: "/dashboard/settings",      icon: Settings, badge: 0 },
]

/* ═══════════════════════════════════════════════════════════
   Sidebar — desktop version (fixed left panel)
   ═══════════════════════════════════════════════════════════ */
export function DashboardSidebar() {
  const { collapsed, toggleCollapsed } = useSidebar()
  const pathname = usePathname()

  return (
    <motion.aside
      animate={{ width: collapsed ? 64 : 240 }}
      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "relative hidden lg:flex flex-col shrink-0",
        "border-r border-border bg-card",
        "overflow-hidden"
      )}
      style={{ minHeight: "100dvh" }}
      aria-label="Dashboard navigation"
    >
      {/* ── Logo ──────────────────────────────────────────── */}
      <div className="flex h-14 shrink-0 items-center border-b border-border/50 px-4">
        <Link
          href="/dashboard"
          className="flex min-w-0 items-center gap-2.5 group"
          aria-label="PodcastMatch AI dashboard"
        >
          <div
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[var(--radius-sm)]
                       gradient-primary shadow-[var(--glow-subtle)]
                       transition-shadow duration-200 group-hover:shadow-[var(--glow-primary)]"
          >
            <Mic2 className="size-3.5 text-white" aria-hidden="true" />
          </div>
          <AnimatePresence initial={false}>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -6 }}
                transition={{ duration: 0.18 }}
                className="truncate text-[13px] font-bold text-foreground tracking-tight whitespace-nowrap"
              >
                PodcastMatch{" "}
                <span className="gradient-text-primary">AI</span>
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
      </div>

      {/* ── Nav groups ────────────────────────────────────── */}
      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto overflow-x-hidden py-3 px-2">
        {NAV_GROUPS.map(group => (
          <div key={group.label} className="mb-1">
            <AnimatePresence initial={false}>
              {!collapsed && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="mb-1 px-2.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50 select-none"
                >
                  {group.label}
                </motion.p>
              )}
            </AnimatePresence>

            <div className="flex flex-col gap-0.5">
              {group.items.map(item => (
                <SidebarItem
                  key={item.href}
                  {...item}
                  isActive={pathname === item.href}
                  collapsed={collapsed}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* ── Bottom items ──────────────────────────────────── */}
      <div className="flex flex-col gap-0.5 border-t border-border/50 px-2 py-3">
        {BOTTOM_ITEMS.map(item => (
          <SidebarItem
            key={item.href}
            {...item}
            isActive={pathname === item.href}
            collapsed={collapsed}
          />
        ))}
      </div>

      {/* ── User profile ──────────────────────────────────── */}
      <div className="border-t border-border/50 px-2 py-3">
        <div className={cn(
          "flex items-center gap-2.5 rounded-[var(--radius-lg)] px-2 py-2",
          "transition-colors duration-150 hover:bg-[var(--glass-bg)] cursor-pointer"
        )}>
          <div
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full gradient-primary text-[11px] font-bold text-white"
            aria-hidden="true"
          >
            JD
          </div>
          <AnimatePresence initial={false}>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -4 }}
                transition={{ duration: 0.15 }}
                className="flex min-w-0 flex-col"
              >
                <span className="truncate text-[12px] font-semibold text-foreground">Jane Doe</span>
                <span className="truncate text-[10px] text-muted-foreground">Pro Plan</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Collapse toggle ───────────────────────────────── */}
      <button
        onClick={toggleCollapsed}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        className={cn(
          "absolute -right-3 top-16 z-10 flex h-6 w-6 items-center justify-center",
          "rounded-full border border-border bg-card shadow-[var(--shadow-sm)]",
          "text-muted-foreground transition-all duration-150",
          "hover:border-border/80 hover:text-foreground hover:shadow-[var(--glow-subtle)]"
        )}
      >
        <motion.span
          animate={{ rotate: collapsed ? 180 : 0 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        >
          <ChevronLeft className="size-3" aria-hidden="true" />
        </motion.span>
      </button>
    </motion.aside>
  )
}

/* ═══════════════════════════════════════════════════════════
   MobileSidebarDrawer — slide-in panel for small screens
   ═══════════════════════════════════════════════════════════ */
export function MobileSidebarDrawer() {
  const { mobileOpen, closeMobile } = useSidebar()
  const pathname = usePathname()

  return (
    <AnimatePresence>
      {mobileOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm lg:hidden"
            onClick={closeMobile}
            aria-hidden="true"
          />

          {/* Drawer */}
          <motion.div
            key="drawer"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-card lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            id="mobile-dashboard-menu"
          >
            {/* Header */}
            <div className="flex h-14 items-center justify-between border-b border-border/50 px-4">
              <Link href="/dashboard" onClick={closeMobile} className="flex items-center gap-2.5 group">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[var(--radius-sm)] gradient-primary shadow-[var(--glow-subtle)]">
                  <Mic2 className="size-3.5 text-white" aria-hidden="true" />
                </div>
                <span className="text-[13px] font-bold text-foreground tracking-tight">
                  PodcastMatch <span className="gradient-text-primary">AI</span>
                </span>
              </Link>
              <button
                onClick={closeMobile}
                aria-label="Close navigation menu"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-[var(--glass-bg)] hover:text-foreground transition-colors"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </div>

            {/* Nav */}
            <nav className="flex flex-1 flex-col gap-1 overflow-y-auto py-3 px-2">
              {NAV_GROUPS.map((group, gi) => (
                <motion.div
                  key={group.label}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.22, delay: gi * 0.04 }}
                  className="mb-1"
                >
                  <p className="mb-1 px-2.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50 select-none">
                    {group.label}
                  </p>
                  <div className="flex flex-col gap-0.5">
                    {group.items.map(item => (
                      <SidebarItem
                        key={item.href}
                        {...item}
                        isActive={pathname === item.href}
                        collapsed={false}
                        onClick={closeMobile}
                      />
                    ))}
                  </div>
                </motion.div>
              ))}
            </nav>

            {/* Bottom */}
            <div className="flex flex-col gap-0.5 border-t border-border/50 px-2 py-3">
              {BOTTOM_ITEMS.map(item => (
                <SidebarItem
                  key={item.href}
                  {...item}
                  isActive={pathname === item.href}
                  collapsed={false}
                  onClick={closeMobile}
                />
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

/* ── SidebarItem — shared nav link ────────────────────────── */
function SidebarItem({
  label,
  href,
  icon: Icon,
  badge = 0,
  isActive,
  collapsed,
  onClick,
}: {
  label:      string
  href:       string
  icon:       React.ElementType
  badge?:     number
  isActive:   boolean
  collapsed:  boolean
  onClick?:   () => void
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={isActive ? "page" : undefined}
      title={collapsed ? label : undefined}
      className={cn(
        "group relative flex h-8 items-center gap-2.5 rounded-[var(--radius-md)] px-2.5",
        "text-sm transition-all duration-150",
        isActive
          ? "bg-primary/12 text-primary font-medium"
          : "text-muted-foreground hover:bg-[var(--glass-bg)] hover:text-foreground"
      )}
    >
      {/* Active left bar */}
      {isActive && (
        <motion.span
          layoutId="sidebar-active-bar"
          className="absolute inset-y-1 left-0 w-0.5 rounded-full bg-primary"
          transition={{ duration: 0.2 }}
          aria-hidden="true"
        />
      )}

      <Icon className={cn("size-4 shrink-0", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} aria-hidden="true" />

      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -4 }}
            transition={{ duration: 0.15 }}
            className="flex-1 truncate text-[13px] whitespace-nowrap"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>

      {/* Notification badge */}
      {badge > 0 && !collapsed && (
        <span className="ml-auto flex h-4 min-w-4 items-center justify-center rounded-full bg-primary/20 px-1 text-[10px] font-semibold text-primary">
          {badge}
        </span>
      )}
      {badge > 0 && collapsed && (
        <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
      )}
    </Link>
  )
}
