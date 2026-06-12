"use client"

import { useState, useRef } from "react"
import { motion } from "motion/react"
import { User, Check, Loader2 } from "lucide-react"
import { saveBio } from "@/lib/actions/user-profile"
import { cn } from "@/lib/utils"

const MAX = 500

interface Props {
  initialBio?: string | null
}

export function ProfileBio({ initialBio }: Props) {
  const [bio,     setBio]     = useState(initialBio ?? "")
  const [saving,  setSaving]  = useState(false)
  const [saved,   setSaved]   = useState(false)
  const [error,   setError]   = useState<string | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  async function handleSave() {
    if (saving) return
    setSaving(true)
    setSaved(false)
    setError(null)

    const { error: err } = await saveBio(bio)
    setSaving(false)

    if (err) {
      setError("Couldn't save — try again.")
    } else {
      setSaved(true)
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => setSaved(false), 2500)
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

      <div className="p-6 md:p-8">
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
            onClick={handleSave}
            disabled={saving}
            className={cn(
              "flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200",
              saved
                ? "bg-[oklch(0.55_0.16_145/0.15)] border border-[oklch(0.55_0.16_145/0.30)] text-[oklch(0.70_0.16_145)]"
                : "bg-primary/10 border border-primary/25 text-primary hover:bg-primary/15"
            )}
          >
            {saving  ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
            {saved   ? <Check className="w-3 h-3" /> : null}
            {saving ? "Saving…" : saved ? "Saved" : "Save"}
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

        {error && <p className="mt-2 text-xs text-destructive">{error}</p>}
      </div>
    </motion.div>
  )
}
