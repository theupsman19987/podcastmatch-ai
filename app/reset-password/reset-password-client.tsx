"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "motion/react"
import { ArrowRight, ArrowLeft, Loader2, AlertCircle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { AuthInput } from "@/components/auth/auth-input"
import { ShimmerButton } from "@/components/ui/shimmer-button"

export function ResetPasswordClient() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [stage, setStage] = useState<"exchanging" | "form" | "error">("exchanging")
  const [stageError, setStageError] = useState<string | null>(null)
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [formError, setFormError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const code = searchParams.get("code")
    if (!code) {
      setStageError("No reset code found. Please request a new password reset link.")
      setStage("error")
      return
    }

    // Exchange the PKCE code for a recovery session using the browser client.
    // This must happen client-side so GoTrue can issue a session the browser owns
    // directly — server-side exchange produces a session the browser never fully
    // inherits, which causes updateUser to fail silently.
    createClient()
      .auth.exchangeCodeForSession(code)
      .then(({ error }) => {
        if (error) {
          setStageError(error.message)
          setStage("error")
        } else {
          setStage("form")
        }
      })
  }, [searchParams])

  async function handleSubmit(evt: React.FormEvent) {
    evt.preventDefault()
    setFormError(null)

    if (password.length < 8) {
      setFormError("Password must be at least 8 characters")
      return
    }
    if (password !== confirm) {
      setFormError("Passwords do not match")
      return
    }

    setIsLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password })
    if (error) {
      setFormError(error.message)
      setIsLoading(false)
      return
    }

    await supabase.auth.signOut()
    router.push("/login?message=password_updated")
  }

  /* ── Exchanging code ──────────────────────────────────────── */
  if (stage === "exchanging") {
    return (
      <div className="glass-strong rounded-[var(--radius-xl)] border border-border/40 p-10 flex flex-col items-center gap-4 text-center">
        <Loader2 className="size-7 animate-spin text-primary" aria-hidden="true" />
        <p className="text-sm text-muted-foreground">Verifying your reset link…</p>
      </div>
    )
  }

  /* ── Error state ──────────────────────────────────────────── */
  if (stage === "error") {
    return (
      <motion.div
        className="glass-strong rounded-[var(--radius-xl)] border border-border/40 p-8 flex flex-col items-center gap-5 text-center"
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full border border-red-500/20 bg-red-500/10">
          <AlertCircle className="size-6 text-red-400" aria-hidden="true" />
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-base font-semibold text-foreground">Reset link invalid</p>
          <p className="text-sm text-muted-foreground">
            {stageError ?? "This link has expired or has already been used."}
          </p>
        </div>
        <Link
          href="/forgot-password"
          className="text-sm font-medium text-primary transition-colors hover:text-primary/80"
        >
          Request a new reset link
        </Link>
      </motion.div>
    )
  }

  /* ── Password form ────────────────────────────────────────── */
  return (
    <motion.div
      className="glass-strong rounded-[var(--radius-xl)] border border-border/40 p-7 sm:p-8"
      initial={{ opacity: 0, y: 22, filter: "blur(8px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="mb-6 flex flex-col gap-1.5">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Set new password</h1>
        <p className="text-sm text-muted-foreground">
          Choose a strong password — at least 8 characters.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <AuthInput
          id="password"
          label="New password"
          type="password"
          placeholder="Min. 8 characters"
          value={password}
          onChange={v => { setPassword(v); setFormError(null) }}
          error={formError ?? undefined}
          autoComplete="new-password"
          required
          disabled={isLoading}
        />
        <AuthInput
          id="confirm"
          label="Confirm password"
          type="password"
          placeholder="Repeat new password"
          value={confirm}
          onChange={v => { setConfirm(v); setFormError(null) }}
          autoComplete="new-password"
          required
          disabled={isLoading}
        />

        <ShimmerButton
          type="submit"
          variant="premium"
          size="lg"
          className="mt-1 w-full"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              Updating…
            </>
          ) : (
            <>
              Update Password
              <ArrowRight className="size-4" aria-hidden="true" />
            </>
          )}
        </ShimmerButton>
      </form>

      <Link
        href="/login"
        className="mt-6 flex items-center justify-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" aria-hidden="true" />
        Back to sign in
      </Link>
    </motion.div>
  )
}
