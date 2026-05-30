"use client"

import { motion } from "motion/react"
import {
  User, SlidersHorizontal, KeyRound, Bell,
  CreditCard, Receipt, Shield, AlertTriangle,
} from "lucide-react"
import type { SettingsSectionId } from "./settings-mock"

interface NavItem {
  id: SettingsSectionId
  label: string
  Icon: React.ElementType
  group: string
  danger?: boolean
}

const NAV_ITEMS: NavItem[] = [
  { id: "profile",         label: "Profile Settings",      Icon: User,             group: "Account"     },
  { id: "creator-prefs",   label: "Creator Preferences",   Icon: SlidersHorizontal,group: "Account"     },
  { id: "account",         label: "Account Settings",      Icon: KeyRound,         group: "Account"     },
  { id: "notifications",   label: "Notification Center",   Icon: Bell,             group: "Preferences" },
  { id: "subscription",    label: "Subscription & Billing",Icon: CreditCard,       group: "Billing"     },
  { id: "billing-history", label: "Billing History",       Icon: Receipt,          group: "Billing"     },
  { id: "security",        label: "Security Center",       Icon: Shield,           group: "Security"    },
  { id: "danger-zone",     label: "Danger Zone",           Icon: AlertTriangle,    group: "Security", danger: true },
]

const GROUPS = ["Account", "Preferences", "Billing", "Security"]

interface Props {
  active: SettingsSectionId
  onChange: (id: SettingsSectionId) => void
}

export function SettingsNav({ active, onChange }: Props) {
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col gap-1 w-56 shrink-0">
        {GROUPS.map(group => {
          const items = NAV_ITEMS.filter(i => i.group === group)
          return (
            <div key={group} className="mb-2">
              <p className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-widest px-3 mb-1">
                {group}
              </p>
              {items.map(({ id, label, Icon, danger }) => {
                const isActive = active === id
                return (
                  <button
                    key={id}
                    onClick={() => onChange(id)}
                    className={`relative w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left text-xs font-semibold transition-all duration-150 ${
                      isActive
                        ? danger
                          ? "bg-destructive/10 text-destructive border border-destructive/25"
                          : "bg-primary/10 text-primary border border-primary/25"
                        : danger
                        ? "text-destructive/70 hover:bg-destructive/8 hover:text-destructive"
                        : "text-muted-foreground hover:bg-card/60 hover:text-foreground"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="settings-nav-pill"
                        className={`absolute inset-0 rounded-xl ${danger ? "bg-destructive/8" : "bg-primary/8"}`}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                    <Icon className="w-3.5 h-3.5 shrink-0 relative" />
                    <span className="relative">{label}</span>
                  </button>
                )
              })}
            </div>
          )
        })}
      </aside>

      {/* Mobile horizontal tabs */}
      <div className="md:hidden flex gap-1.5 overflow-x-auto pb-3 scrollbar-hide -mx-4 px-4">
        {NAV_ITEMS.map(({ id, label, Icon, danger }) => {
          const isActive = active === id
          return (
            <button
              key={id}
              onClick={() => onChange(id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 border transition-all duration-150 ${
                isActive
                  ? danger
                    ? "bg-destructive/10 border-destructive/30 text-destructive"
                    : "bg-primary/10 border-primary/30 text-primary"
                  : "bg-card/40 border-border/30 text-muted-foreground"
              }`}
            >
              <Icon className="w-3 h-3" />
              {label}
            </button>
          )
        })}
      </div>
    </>
  )
}
