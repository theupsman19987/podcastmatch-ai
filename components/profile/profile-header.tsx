"use client"

import { useRef, useState } from "react"
import { motion } from "motion/react"
import { Camera, Sparkles, TrendingUp, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { saveAvatarUrl } from "@/lib/actions/user-profile"
import { useScoringStatus } from "./scoring-status-context"
import type { GeneratedProfile } from "@/lib/profile/generate-profile"

function ScoreArc({
  score,
  label,
  color   = "primary",
  pulsing = false,
}: {
  score:    number
  label:    string
  color?:   "primary" | "gold"
  pulsing?: boolean
}) {
  const size   = 72
  const r      = 29
  const c      = 2 * Math.PI * r
  const offset = c * (1 - score / 100)
  const stroke = color === "gold" ? "oklch(0.85 0.16 85)" : "oklch(var(--primary))"

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative">
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2} cy={size / 2} r={r}
            fill="none" stroke="currentColor" strokeWidth={3}
            className="text-border/30"
          />
          <motion.circle
            cx={size / 2} cy={size / 2} r={r}
            fill="none" stroke={stroke} strokeWidth={3}
            strokeDasharray={c}
            strokeLinecap="round"
            initial={{ strokeDashoffset: c }}
            animate={{
              strokeDashoffset: offset,
              opacity: pulsing ? [1, 0.4, 1] : 1,
            }}
            transition={{
              strokeDashoffset: { duration: 1.2, delay: 0.3, ease: "easeOut" },
              opacity: pulsing
                ? { repeat: Infinity, duration: 1.1, ease: "easeInOut" }
                : { duration: 0.3 },
            }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span
            key={score}
            initial={{ scale: 1.15, opacity: 0.6 }}
            animate={{ scale: 1,    opacity: 1   }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="text-base font-bold text-foreground"
          >
            {score}
          </motion.span>
        </div>
      </div>
      <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider text-center leading-tight max-w-[64px]">
        {label}
      </span>
    </div>
  )
}

interface Props {
  profile:              GeneratedProfile
  firstName?:           string
  initials?:            string
  avatarUrl?:           string | null
  onAvatarChange?:      (url: string) => void
  liveVisibilityScore?: number
  scorePulsing?:        boolean
}

export function ProfileHeader({
  profile,
  firstName,
  initials,
  avatarUrl,
  onAvatarChange,
  liveVisibilityScore,
  scorePulsing = false,
}: Props) {
  const { triggerRescore } = useScoringStatus()
  const fileRef            = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error,     setError]     = useState<string | null>(null)

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) { setError("Please select an image file."); return }
    if (file.size > 2 * 1024 * 1024)     { setError("Image must be under 2 MB.");    return }

    setError(null)
    setUploading(true)

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setError("Not signed in."); return }

      const ext  = file.name.split(".").pop() ?? "jpg"
      const path = `${user.id}/avatar.${ext}`

      const { error: uploadErr } = await supabase.storage
        .from("avatars")
        .upload(path, file, { upsert: true, contentType: file.type })

      if (uploadErr) { setError("Upload failed — try again."); return }

      const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(path)
      const publicUrl = `${urlData.publicUrl}?t=${Date.now()}`

      const { error: saveErr } = await saveAvatarUrl(publicUrl)
      if (saveErr) { setError("Saved image but couldn't update profile."); return }

      triggerRescore()        // fire-and-forget — ScoreStatusBar handles UX
      onAvatarChange?.(publicUrl)
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ""
    }
  }

  const displayName    = firstName || profile.title || "Creator"
  const visScore       = liveVisibilityScore ?? profile.visibilityScore

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative rounded-2xl border border-border/60 bg-card/70 backdrop-blur-sm shadow-[var(--shadow-card)] overflow-hidden"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      <div className="absolute top-0 left-0 w-80 h-40 rounded-full bg-primary/4 blur-3xl pointer-events-none" />

      <div className="relative p-6 md:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">

          {/* Avatar with upload */}
          <div className="relative shrink-0 group">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-[0_0_28px_oklch(var(--primary)/0.15)] overflow-hidden">
              {avatarUrl ? (
                <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl md:text-3xl font-bold gradient-text-primary select-none">
                  {initials || displayName.slice(0, 2).toUpperCase()}
                </span>
              )}
            </div>

            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              aria-label="Upload profile photo"
              className="absolute inset-0 rounded-2xl flex items-center justify-center
                         bg-black/50 opacity-0 group-hover:opacity-100
                         transition-opacity duration-200 cursor-pointer"
            >
              {uploading
                ? <Loader2 className="w-5 h-5 text-white animate-spin" />
                : <Camera  className="w-5 h-5 text-white" />
              }
            </button>

            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="sr-only"
              onChange={handleFileChange}
            />

            <div className="absolute -bottom-1.5 -right-1.5 flex items-center gap-1 bg-primary/15 border border-primary/30 rounded-full px-2 py-0.5">
              <Sparkles className="w-2.5 h-2.5 text-primary" />
              <span className="text-[9px] font-bold text-primary uppercase tracking-wider">AI</span>
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            {error && <p className="mb-2 text-[11px] text-destructive">{error}</p>}
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-xs font-bold text-primary uppercase tracking-widest">Creator Profile</span>
              <span className="w-1 h-1 rounded-full bg-border/60 inline-block" />
              <span className="text-xs text-muted-foreground">AI Generated</span>
            </div>

            <h1 className="text-xl md:text-2xl font-bold text-foreground mb-2 leading-tight">
              {profile.title} · {profile.category}
            </h1>

            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 border border-primary/20 text-primary">
                {profile.creatorArchetype}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-card border border-border/50 text-muted-foreground">
                {profile.audienceType}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <TrendingUp className="w-3 h-3 text-primary" />
              <span>Powered by Creator DNA Assessment</span>
            </div>
          </div>

          {/* Score Arcs — key on score triggers re-animation on change */}
          <div className="flex items-center gap-6 sm:gap-8 shrink-0">
            <ScoreArc
              key={`vis-${visScore}`}
              score={visScore}
              label="Visibility Score"
              pulsing={scorePulsing}
            />
            <ScoreArc
              score={profile.aiAlignmentScore}
              label="AI Alignment"
              color="gold"
            />
          </div>
        </div>
      </div>
    </motion.div>
  )
}
