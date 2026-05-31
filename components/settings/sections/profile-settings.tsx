"use client"

import { useState } from "react"
import { User, Camera, Globe, MapPin, MessageSquare, Briefcase, Film, AtSign } from "lucide-react"
import { SettingsCard, SectionHeader, FieldRow, TextInput, TextArea, Divider, SaveButton } from "../settings-ui"
import { MOCK_USER } from "../settings-mock"
import type { SaveState } from "../settings-ui"
import { updateProfileSettings } from "@/lib/actions/settings"

type SaveStateLoc = "idle" | "saving" | "saved"

export function ProfileSettings() {
  const [name,     setName]     = useState(MOCK_USER.name)
  const [title,    setTitle]    = useState(MOCK_USER.title)
  const [bio,      setBio]      = useState(MOCK_USER.bio)
  const [website,  setWebsite]  = useState(MOCK_USER.website)
  const [location, setLocation] = useState(MOCK_USER.location)
  const [social,   setSocial]   = useState(MOCK_USER.social)
  const [saveState, setSaveState] = useState<SaveStateLoc>("idle")

  async function handleSave() {
    setSaveState("saving")
    await updateProfileSettings({ fullName: name, title, bio, website, location })
    setSaveState("saved")
    setTimeout(() => setSaveState("idle"), 2000)
  }

  function setSocialField(key: keyof typeof social, val: string) {
    setSocial(s => ({ ...s, [key]: val }))
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Avatar */}
      <SettingsCard delay={0}>
        <div className="p-6 md:p-8">
          <SectionHeader
            icon={<User className="w-4 h-4 text-primary" />}
            title="Profile Settings"
            description="Manage your public creator profile"
          />
          <div className="flex items-center gap-5 mb-6">
            <div className="relative shrink-0">
              <div className="w-20 h-20 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <User className="w-9 h-9 text-primary/60" />
              </div>
              <button className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full bg-primary border-2 border-card flex items-center justify-center hover:bg-primary/80 transition-colors">
                <Camera className="w-3.5 h-3.5 text-white" />
              </button>
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">{name}</p>
              <p className="text-xs text-muted-foreground mb-2">{title}</p>
              <button className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-border/40 text-muted-foreground hover:border-primary/30 hover:text-primary transition-colors">
                Upload Photo
              </button>
            </div>
          </div>

          <FieldRow label="Full Name">
            <TextInput value={name} onChange={e => setName(e.target.value)} placeholder="Your name" />
          </FieldRow>
          <FieldRow label="Professional Title" hint="Shown under your name on your profile">
            <TextInput value={title} onChange={e => setTitle(e.target.value)} placeholder="Coach, Author, Speaker..." />
          </FieldRow>
          <FieldRow label="Bio" hint="Up to 300 characters">
            <TextArea rows={4} value={bio} onChange={e => setBio(e.target.value)} placeholder="Tell your story..." maxLength={300} />
            <p className="text-[10px] text-muted-foreground mt-1">{bio.length}/300</p>
          </FieldRow>
          <FieldRow label="Website">
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <TextInput value={website} onChange={e => setWebsite(e.target.value)} placeholder="yoursite.com" className="pl-8" />
            </div>
          </FieldRow>
          <FieldRow label="Location">
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <TextInput value={location} onChange={e => setLocation(e.target.value)} placeholder="City, State" className="pl-8" />
            </div>
          </FieldRow>
        </div>
      </SettingsCard>

      {/* Social Links */}
      <SettingsCard delay={0.05}>
        <div className="p-6 md:p-8">
          <SectionHeader
            icon={<Globe className="w-4 h-4 text-primary" />}
            title="Social Links"
            description="Connect your social platforms"
          />
          {([
            { key: "twitter",   Icon: MessageSquare, prefix: "@",   placeholder: "username"     },
            { key: "linkedin",  Icon: Briefcase,     prefix: "in/", placeholder: "linkedin-url" },
            { key: "youtube",   Icon: Film,          prefix: "",    placeholder: "channel name" },
            { key: "instagram", Icon: Camera,        prefix: "@",   placeholder: "username"     },
          ] as const).map(({ key, Icon, prefix, placeholder }) => (
            <FieldRow key={key} label={key.charAt(0).toUpperCase() + key.slice(1)}>
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-card/60 border border-border/30 shrink-0">
                  <Icon className="w-3.5 h-3.5 text-muted-foreground" />
                </div>
                {prefix && <span className="text-xs text-muted-foreground shrink-0">{prefix}</span>}
                <TextInput
                  value={social[key]}
                  onChange={e => setSocialField(key, e.target.value)}
                  placeholder={placeholder}
                />
              </div>
            </FieldRow>
          ))}
        </div>
      </SettingsCard>

      <div className="flex justify-end">
        <SaveButton state={saveState as SaveState} onClick={handleSave} />
      </div>
    </div>
  )
}
