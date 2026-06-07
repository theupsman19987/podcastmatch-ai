"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "motion/react"
import { ArrowRight, Loader2, ArrowLeft } from "lucide-react"
import { AuthInput } from "@/components/auth/auth-input"
import { ShimmerButton } from "@/components/ui/shimmer-button"
import { updatePasswordAction } from "@/lib/actions/auth"

export function UpdatePasswordForm() {
  const [password,  setPassword]  = useState("")
  const [confirm,   setConfirm]   = useState("")
  const [error,     setError]     = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(evt: React.FormEvent) {
    evt.preventDefault()
    setError(null)

    if (password.length < 8) {
      setError("Password must be at least 8 characters")
      return
    }
    if (password !== confirm) {
      setError("Passwords do not match")
      return
    }

    setIsLoading(true)
    try {
      const result = await updatePasswordAction(password)
      if (result?.error) {
        setError(result.error)
        setIsLoading(false)
      }
      /* On success updatePasswordAction calls redirect("/dashboard") — page navigates */
    } catch {
      /* redirect() throws a special Next.js error — expected on success */
    }
  }

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
          onChange={v => { setPassword(v); setError(null) }}
          error={error ?? undefined}
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
          onChange={v => { setConfirm(v); setError(null) }}
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
