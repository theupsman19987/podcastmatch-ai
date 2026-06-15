"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "motion/react"
import { User, Globe, Check, Loader2, AlertCircle } from "lucide-react"
import { saveBio } from "@/lib/actions/user-profile"
import { getSettings, updateProfileSettings } from "@/lib/actions/settings"
import { cn } from "@/lib/utils"

const MAX = 500
const URL_RE = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/i

interface Props {
  initialBio?: string | null
}

export function ProfileBio({ initialBio }: Props) {
  const [bio,        setBio]        = useState(initialBio ?? "")
  const [website,    setWebsite]    = useState("")
  const [bioSaving,  setBioSaving]  = useState(false)
  const [bioSaved,   setBioSaved]   = useState(false)
  const [bioError,   setBioError]   = useState<string | null>(null)
  const [webSaving,  setWebSaving]  = useState(false)
  const [webSaved,   setWebSaved]   = useState(false)
  const [webError,   setWebError]   = useState<string | null>(null)
  const bioTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const webTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  /* Load saved website on mount */
  useEffect(() => {
    getSettings().then(result => {
      const w = result.data?.profile_settings?.website
      if (typeof w === "string" && w) setWebsite(w)
    }).catch(() => {})
  }, [])

  async function handleSaveBio() {
    if (bioSaving) return
    setBioSaving(true); setBioSaved(false); setBioError(null)
    const { error } = await saveBio(bio)
    setBioSaving(false)
    if (error) { setBioError("Couldn't save — try again.") }
    else {
      setBioSaved(true)
      if (bioTimer.current) clearTimeout(bioTimer.current)
      bioTimer.current = setTimeout(() => setBioSaved(false), 2500)
    }
  }

  async function handleSaveWebsite() {
    if (webSaving) return
    if (website && !URL_RE.test(website)) {
      setWebError("Enter a valid URL (e.g. https://yoursite.com)")
      return
    }
    setWebSaving(true); setWebSaved(false); setWebError(null)
    const { error } = await updateProfileSettings({ website: website.trim() })
    setWebSaving(false)
    if (error) { setWebError("Couldn't save — try again.") }
    else {
      setWebSaved(true)
      if (webTimer.current) clearTimeout(webTimer.current)
      webTimer.current = setTimeout(() => setWebSaved(false), 2500)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.05 }}
      className="relative rounded-2xl border border-border/60 bg-card/70 backdrop-blur-sm shadow-[var(--shadow-card)] overflow-hidden"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      <div className="p-6 md:p-8 flex flex-col gap-8">

        {/* ── Website field ──────────────────────────────── */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 border border-primary/20">
                <Globe className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-foreground">Your Website</h2>
                <p className="text-xs text-muted-foreground">Boosts authority and discoverability with podcast hosts</p>
              </div>
            </div>
            <button
              onClick={handleSaveWebsite}
              disabled={webSaving}
              className={cn(
                "flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200",
                webSaved
                  ? "bg-[oklch(0.55_0.16_145/0.15)] border border-[oklch(0.55_0.16_145/0.30)] text-[oklch(0.70_0.16_145)]"
                  : "bg-primary/10 border border-primary/25 text-primary hover:bg-primary/15"
              )}
            >
              {webSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
              {webSaved  ? <Check   className="w-3 h-3" /> : null}
              {webSaving ? "Saving…" : webSaved ? "Saved" : "Save"}
            </button>
          </div>

          <div className="relative flex items-center">
            <Globe className="absolute left-3.5 w-4 h-4 text-muted-foreground/40 pointer-events-none" />
            <input
              type="url"
              value={website}
              onChange={e => { setWebsite(e.target.value); setWebError(null) }}
              placeholder="https://yourwebsite.com"
              className={cn(
                "w-full pl-10 pr-4 py-3 rounded-xl border bg-card/50 backdrop-blur-sm",
                "text-sm text-foreground placeholder:text-muted-foreground/50",
                "focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20",
                "transition-all duration-200",
                webError ? "border-destructive/50" : "border-border/40"
              )}
            />
          </div>
          {webError && (
            <p className="mt-1.5 flex items-center gap-1.5 text-xs text-destructive">
              <AlertCircle className="w-3 h-3 shrink-0" /> {webError}
            </p>
          )}
        </div>

        {/* ── Bio / About Me ─────────────────────────────── */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 border border-primary/20">
                <User className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-foreground">About Me</h2>
                <p className="text-xs text-muted-foreground">Introduce yourself to podcast hosts</p>
              </div>
            </div>
            <button
              onClick={handleSaveBio}
              disabled={bioSaving}
              className={cn(
                "flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200",
                bioSaved
                  ? "bg-[oklch(0.55_0.16_145/0.15)] border border-[oklch(0.55_0.16_145/0.30)] text-[oklch(0.70_0.16_145)]"
                  : "bg-primary/10 border border-primary/25 text-primary hover:bg-primary/15"
              )}
            >
              {bioSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
              {bioSaved  ? <Check   className="w-3 h-3" /> : null}
              {bioSaving ? "Saving…" : bioSaved ? "Saved" : "Save"}
            </button>
          </div>

          <div className="relative">
            <textarea
              value={bio}
              onChange={e => setBio(e.target.value.slice(0, MAX))}
              placeholder="Write a short bio that tells podcast hosts who you are, what you do, and why you're a compelling guest…"
              rows={5}
              className={cn(
                "w-full resize-none rounded-xl border border-border/40 bg-card/50 backdrop-blur-sm",
                "px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground/50",
                "focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20",
                "transition-all duration-200 leading-relaxed"
              )}
            />
            <span className="absolute bottom-3 right-4 text-xs text-muted-foreground/40">
              {bio.length}/{MAX}
            </span>
          </div>
          {bioError && <p className="mt-2 text-xs text-destructive">{bioError}</p>}
        </div>

      </div>
    </motion.div>
  )
}
