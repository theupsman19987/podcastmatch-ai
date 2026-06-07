"use client"

import { useState } from "react"
import { KeyRound, Mail, AtSign, Lock, Smartphone, Eye, EyeOff } from "lucide-react"
import { SettingsCard, SectionHeader, FieldRow, TextInput, Toggle, Divider } from "../settings-ui"
import type { InitialUserData } from "../settings-shell"

export function AccountSettings({ initialData }: { initialData?: InitialUserData }) {
  const [email,      setEmail]    = useState(initialData?.email    ?? "")
  const [username,   setUsername] = useState(initialData?.username ?? "")
  const [showPass,   setShowPass] = useState(false)
  const [twoFactor,  setTwoFactor]= useState(false)
  const [editEmail,  setEditEmail]= useState(false)
  const [editUser,   setEditUser] = useState(false)

  return (
    <div className="flex flex-col gap-5">
      <SettingsCard delay={0}>
        <div className="p-6 md:p-8">
          <SectionHeader
            icon={<KeyRound className="w-4 h-4 text-primary" />}
            title="Account Settings"
            description="Manage your login credentials and security preferences"
          />

          {/* Email */}
          <FieldRow label="Email Address" hint="Used for login and notifications">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <TextInput
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  disabled={!editEmail}
                  placeholder="email@example.com"
                  className={`pl-8 ${!editEmail ? "opacity-70" : ""}`}
                />
              </div>
              <button
                onClick={() => setEditEmail(v => !v)}
                className="px-3 py-2 rounded-xl text-xs font-semibold border border-border/40 text-muted-foreground hover:border-primary/30 hover:text-primary transition-colors shrink-0"
              >
                {editEmail ? "Cancel" : "Change"}
              </button>
            </div>
            {editEmail && (
              <p className="text-[10px] text-yellow-400 mt-1.5">
                A verification email will be sent to your new address.
              </p>
            )}
          </FieldRow>

          {/* Username */}
          <FieldRow label="Username" hint="Your unique @handle on PodcastMatch AI">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <TextInput
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  disabled={!editUser}
                  placeholder="username"
                  className={`pl-8 ${!editUser ? "opacity-70" : ""}`}
                />
              </div>
              <button
                onClick={() => setEditUser(v => !v)}
                className="px-3 py-2 rounded-xl text-xs font-semibold border border-border/40 text-muted-foreground hover:border-primary/30 hover:text-primary transition-colors shrink-0"
              >
                {editUser ? "Cancel" : "Change"}
              </button>
            </div>
          </FieldRow>

          <Divider />

          {/* Password */}
          <FieldRow label="Password" hint="Must be at least 12 characters">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <TextInput
                  type={showPass ? "text" : "password"}
                  defaultValue="••••••••••••"
                  disabled
                  className="pl-8 pr-10 opacity-70"
                />
                <button
                  onClick={() => setShowPass(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
              <button className="px-3 py-2 rounded-xl text-xs font-semibold border border-border/40 text-muted-foreground hover:border-primary/30 hover:text-primary transition-colors shrink-0">
                Change
              </button>
            </div>
          </FieldRow>

          <Divider />

          {/* 2FA */}
          <FieldRow label="Two-Factor Auth" hint="Add an extra layer of login security">
            <div className="flex items-center justify-between gap-4 p-3.5 rounded-xl border border-border/30 bg-card/40">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-card/60 border border-border/30 flex items-center justify-center">
                  <Smartphone className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">Authenticator App</p>
                  <p className="text-[10px] text-muted-foreground">
                    {twoFactor ? "2FA is active — your account is protected" : "Not enabled — recommended for security"}
                  </p>
                </div>
              </div>
              <Toggle checked={twoFactor} onChange={setTwoFactor} />
            </div>
            {!twoFactor && (
              <p className="text-[10px] text-yellow-400 mt-2 flex items-center gap-1">
                ⚠ Enabling 2FA significantly improves your account security.
              </p>
            )}
          </FieldRow>
        </div>
      </SettingsCard>

      <SettingsCard delay={0.05}>
        <div className="p-6 md:p-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-foreground">Member Since</p>
              <p className="text-xs text-muted-foreground mt-0.5">{initialData?.memberSince ?? "—"}</p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-primary/10 border border-primary/20 text-primary uppercase tracking-wider">
              {initialData?.plan ?? "free"}
            </span>
          </div>
        </div>
      </SettingsCard>
    </div>
  )
}
