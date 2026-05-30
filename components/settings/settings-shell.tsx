"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { Settings } from "lucide-react"
import { SettingsNav } from "./settings-nav"
import { ProfileSettings }      from "./sections/profile-settings"
import { CreatorPreferences }   from "./sections/creator-preferences"
import { AccountSettings }      from "./sections/account-settings"
import { NotificationCenter }   from "./sections/notification-center"
import { SubscriptionBilling }  from "./sections/subscription-billing"
import { BillingHistory }       from "./sections/billing-history"
import { SecurityCenter }       from "./sections/security-center"
import { DangerZone }           from "./sections/danger-zone"
import type { SettingsSectionId } from "./settings-mock"

const SECTION_TITLES: Record<SettingsSectionId, string> = {
  "profile":         "Profile Settings",
  "creator-prefs":   "Creator Preferences",
  "account":         "Account Settings",
  "notifications":   "Notification Center",
  "subscription":    "Subscription & Billing",
  "billing-history": "Billing History",
  "security":        "Security Center",
  "danger-zone":     "Danger Zone",
}

function ActiveSection({ id }: { id: SettingsSectionId }) {
  switch (id) {
    case "profile":         return <ProfileSettings />
    case "creator-prefs":   return <CreatorPreferences />
    case "account":         return <AccountSettings />
    case "notifications":   return <NotificationCenter />
    case "subscription":    return <SubscriptionBilling />
    case "billing-history": return <BillingHistory />
    case "security":        return <SecurityCenter />
    case "danger-zone":     return <DangerZone />
  }
}

export function SettingsShell() {
  const [active, setActive] = useState<SettingsSectionId>("profile")

  return (
    <div className="px-4 py-6 md:px-6 lg:px-8 max-w-screen-xl mx-auto w-full">

      {/* Page header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
          <Settings className="w-4 h-4 text-primary" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-foreground">Settings</h1>
          <p className="text-xs text-muted-foreground">Manage your account, preferences, and billing</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        <SettingsNav active={active} onChange={setActive} />

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Section breadcrumb */}
          <div className="flex items-center gap-2 mb-5">
            <span className="text-xs text-muted-foreground">Settings</span>
            <span className="text-xs text-muted-foreground">/</span>
            <span className="text-xs font-semibold text-foreground">{SECTION_TITLES[active]}</span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
            >
              <ActiveSection id={active} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
