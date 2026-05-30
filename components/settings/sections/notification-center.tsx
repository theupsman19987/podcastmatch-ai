"use client"

import { useState } from "react"
import { Bell, SaveIcon } from "lucide-react"
import { SettingsCard, SectionHeader, Toggle, SaveButton } from "../settings-ui"
import { MOCK_NOTIFICATIONS } from "../settings-mock"
import type { NotificationPref } from "../settings-mock"
import type { SaveState } from "../settings-ui"

type SaveStateLoc = "idle" | "saving" | "saved"

export function NotificationCenter() {
  const [prefs, setPrefs] = useState<NotificationPref[]>(MOCK_NOTIFICATIONS)
  const [saveState, setSaveState] = useState<SaveStateLoc>("idle")

  function toggle(id: string) {
    setPrefs(p => p.map(n => n.id === id ? { ...n, enabled: !n.enabled } : n))
  }

  function handleSave() {
    setSaveState("saving")
    setTimeout(() => { setSaveState("saved"); setTimeout(() => setSaveState("idle"), 2000) }, 900)
  }

  return (
    <div className="flex flex-col gap-5">
      <SettingsCard delay={0}>
        <div className="p-6 md:p-8">
          <SectionHeader
            icon={<Bell className="w-4 h-4 text-primary" />}
            title="Notification Center"
            description="Control what alerts you receive and how"
          />

          <div className="flex flex-col gap-3">
            {prefs.map((pref, i) => (
              <div
                key={pref.id}
                className="flex items-center justify-between gap-4 p-4 rounded-xl border border-border/30 bg-card/40 hover:bg-card/60 transition-colors duration-150"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-sm font-semibold text-foreground">{pref.label}</p>
                    {pref.enabled && (
                      <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-primary/10 border border-primary/20 text-primary uppercase tracking-wider">
                        On
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground leading-snug">{pref.description}</p>
                </div>
                <Toggle checked={pref.enabled} onChange={() => toggle(pref.id)} />
              </div>
            ))}
          </div>
        </div>
      </SettingsCard>

      <SettingsCard delay={0.05}>
        <div className="p-6 md:p-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-foreground">Quiet Hours</p>
              <p className="text-xs text-muted-foreground mt-0.5">Pause all notifications between 10 PM and 7 AM</p>
            </div>
            <Toggle checked={true} onChange={() => {}} />
          </div>
        </div>
      </SettingsCard>

      <div className="flex justify-end">
        <SaveButton state={saveState as SaveState} onClick={handleSave} />
      </div>
    </div>
  )
}
