"use client"

import { useState } from "react"
import Link         from "next/link"
import { motion }   from "motion/react"
import { ArrowRight, Loader2, CheckCircle2, ArrowLeft } from "lucide-react"
import { AuthInput }    from "@/components/auth/auth-input"
import { ShimmerButton } from "@/components/ui/shimmer-button"
import { createClient }  from "@/lib/supabase/client"

export function ForgotPasswordForm() {
  const [email,     setEmail]     = useState("")
  const [error,     setError]     = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [success,   setSuccess]   = useState(false)

  async function handleSubmit(evt: React.FormEvent) {
    evt.preventDefault()
    setError(null)

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter a valid email address")
      return
    }

    setIsLoading(true)
    // resetPasswordForEmail must run in the browser so the PKCE code verifier
    // is stored in browser storage. exchangeCodeForSession on /reset-password
    // reads from the same storage on the same origin — no mismatch possible.
    const supabase = createClient()
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email.trim(),
      { redirectTo: `${window.location.origin}/reset-password` }
    )
    setIsLoading(false)

    if (resetError) {
      setError(resetError.message)
    } else {
      setSuccess(true)
    }
  }

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="glass-strong rounded-[var(--radius-xl)] border border-border/40 p-10 flex flex-col items-center gap-4 text-center"
      >
        <div
          className="flex h-14 w-14 items-center justify-center rounded-full gradient-primary"
          style={{ boxShadow: "var(--glow-primary)" }}
        >
          <CheckCircle2 className="size-7 text-white" aria-hidden="true" />
        </div>
        <div className="flex flex-col gap-1.5">
          <p className="text-base font-semibold text-foreground">Check your email</p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We sent a password reset link to{" "}
            <span className="font-medium text-foreground">{email}</span>.
            <br />
            It expires in 1 hour.
          </p>
        </div>
        <Link
          href="/login"
          className="mt-2 text-sm font-medium text-primary transition-colors hover:text-primary/80"
        >
          Back to sign in
        </Link>
      </motion.div>
    )
  }

  return (
    <motion.div
      className="glass-strong rounded-[var(--radius-xl)] border border-border/40 p-7 sm:p-8"
      initial={{ opacity: 0, y: 22, filter: "blur(8px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Heading */}
      <div className="mb-6 flex flex-col gap-1.5">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Reset your password</h1>
        <p className="text-sm text-muted-foreground">
          Enter your email and we&apos;ll send you a reset link.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <AuthInput
          id="email"
          label="Email address"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={v => { setEmail(v); setError(null) }}
          error={error ?? undefined}
          autoComplete="email"
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
              Sending…
            </>
          ) : (
            <>
              Send Reset Link
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
