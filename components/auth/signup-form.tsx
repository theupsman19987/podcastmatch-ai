"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "motion/react"
import { ArrowRight, Loader2, CheckCircle2, Gift } from "lucide-react"
import { AuthInput } from "@/components/auth/auth-input"
import { SocialLoginButtons } from "@/components/auth/social-login-buttons"
import { AuthDivider } from "@/components/auth/auth-divider"
import { ShimmerButton } from "@/components/ui/shimmer-button"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"
import { trackClientEvent } from "@/lib/analytics/track"

/* ── Password strength ─────────────────────────────────────── */
function getStrength(pw: string): { score: number; label: string; barClass: string; textClass: string } {
  const score = [
    pw.length >= 8,
    /[A-Z]/.test(pw),
    /[0-9]/.test(pw),
    /[^A-Za-z0-9]/.test(pw),
  ].filter(Boolean).length

  if (score <= 1) return { score: Math.max(score, 1), label: "Weak",   barClass: "bg-red-400",   textClass: "text-red-400"   }
  if (score === 2) return { score,                     label: "Fair",   barClass: "bg-amber-400", textClass: "text-amber-400" }
  if (score === 3) return { score,                     label: "Good",   barClass: "bg-primary",   textClass: "text-primary"   }
  return                  { score,                     label: "Strong", barClass: "bg-green-400", textClass: "text-green-400" }
}

function PasswordStrengthBar({ password }: { password: string }) {
  if (!password) return null
  const { score, label, barClass, textClass } = getStrength(password)

  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col gap-1.5 px-0.5"
    >
      <div className="flex gap-1" aria-label={`Password strength: ${label}`} role="meter" aria-valuenow={score} aria-valuemin={0} aria-valuemax={4}>
        {Array.from({ length: 4 }, (_, i) => (
          <div
            key={i}
            className="h-1 flex-1 rounded-full overflow-hidden"
            style={{ background: "oklch(0.3 0.02 255 / 0.3)" }}
          >
            {i < score && (
              <motion.div
                className={cn("h-full w-full", barClass)}
                initial={{ scaleX: 0, originX: "left" }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.25, delay: i * 0.05 }}
                style={{ transformOrigin: "left" }}
              />
            )}
          </div>
        ))}
      </div>
      <p className={cn("text-xs", textClass)}>
        Password strength: <span className="font-medium">{label}</span>
      </p>
    </motion.div>
  )
}

/* ── Validation ────────────────────────────────────────────── */
type Fields = "fullName" | "email" | "password" | "confirmPassword" | "terms" | "form"
type Errors = Partial<Record<Fields, string>>

function validate(
  fullName: string, email: string, password: string,
  confirmPassword: string, agreeTerms: boolean,
): Errors {
  const e: Errors = {}
  if (!fullName.trim())           e.fullName = "Full name is required"
  else if (fullName.trim().length < 2) e.fullName = "Name must be at least 2 characters"
  if (!email.trim())              e.email = "Email is required"
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Enter a valid email address"
  if (!password)                  e.password = "Password is required"
  else if (password.length < 8)  e.password = "Password must be at least 8 characters"
  if (!confirmPassword)           e.confirmPassword = "Please confirm your password"
  else if (confirmPassword !== password) e.confirmPassword = "Passwords do not match"
  if (!agreeTerms)                e.terms = "You must accept the terms to continue"
  return e
}

/* ══════════════════════════════════════════════════════════════
   SignupForm
   ══════════════════════════════════════════════════════════════ */
export function SignupForm() {
  const router                                = useRouter()
  const [fullName,        setFullName]        = useState("")
  const [email,           setEmail]           = useState("")
  const [password,        setPassword]        = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [agreeTerms,      setAgreeTerms]      = useState(false)
  const [errors,          setErrors]          = useState<Errors>({})
  const [isLoading,       setIsLoading]       = useState(false)
  const [success,         setSuccess]         = useState(false)

  function clearError(field: Fields) {
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }))
  }

  async function handleSubmit(evt: React.FormEvent) {
    evt.preventDefault()
    const errs = validate(fullName, email, password, confirmPassword, agreeTerms)
    setErrors(errs)
    if (Object.keys(errs).length) return
    setIsLoading(true)

    const supabase = createClient()
    const { data, error } = await supabase.auth.signUp({
      email:    email.trim(),
      password,
      options: {
        data:            { full_name: fullName.trim() },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setIsLoading(false)
      setErrors({ form: error.message })
      return
    }

    setSuccess(true)

    if (data.session) {
      // GOTRUE_MAILER_AUTOCONFIRM=true — user is confirmed immediately
      router.push("/dashboard")
    }
    // If no session, the success screen shows "check your email"
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
          <p className="text-base font-semibold text-foreground">Account created!</p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Redirecting you to your dashboard…
          </p>
        </div>
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
      {/* Trial badge */}
      <div
        className="mb-5 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold"
        style={{
          borderColor: "oklch(0.78 0.15 83 / 0.30)",
          background:  "oklch(0.78 0.15 83 / 0.07)",
          color:       "var(--premium-gold)",
        }}
      >
        <Gift className="size-3" aria-hidden="true" />
        30-Day Free Trial · No Credit Card Required
      </div>

      {/* Heading */}
      <div className="mb-6 flex flex-col gap-1.5">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Create your account</h1>
        <p className="text-sm text-muted-foreground">
          Join 15,000+ creators discovering their perfect podcast opportunities.
        </p>
      </div>

      {/* Social login */}
      <SocialLoginButtons disabled={isLoading} />
      <div className="my-5">
        <AuthDivider label="or sign up with email" />
      </div>

      {/* Form-level error */}
      {errors.form && (
        <p role="alert" className="mb-1 rounded-[var(--radius-md)] border border-red-500/20 bg-red-500/08 px-3 py-2 text-[12px] text-red-400">
          {errors.form}
        </p>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <AuthInput
          id="fullName"
          label="Full name"
          type="text"
          placeholder="Your full name"
          value={fullName}
          onChange={v => { setFullName(v); clearError("fullName") }}
          error={errors.fullName}
          autoComplete="name"
          required
          disabled={isLoading}
        />

        <AuthInput
          id="email"
          label="Email address"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={v => { setEmail(v); clearError("email") }}
          error={errors.email}
          autoComplete="email"
          required
          disabled={isLoading}
        />

        {/* Password + strength */}
        <div className="flex flex-col gap-2">
          <AuthInput
            id="password"
            label="Password"
            type="password"
            placeholder="Min. 8 characters"
            value={password}
            onChange={v => { setPassword(v); clearError("password") }}
            error={errors.password}
            autoComplete="new-password"
            required
            disabled={isLoading}
          />
          <AnimatePresence>
            {password && <PasswordStrengthBar password={password} />}
          </AnimatePresence>
        </div>

        <AuthInput
          id="confirmPassword"
          label="Confirm password"
          type="password"
          placeholder="Repeat your password"
          value={confirmPassword}
          onChange={v => { setConfirmPassword(v); clearError("confirmPassword") }}
          error={errors.confirmPassword}
          autoComplete="new-password"
          required
          disabled={isLoading}
        />

        {/* Terms checkbox */}
        <div className="flex flex-col gap-1.5">
          <label className="flex items-start gap-2.5 cursor-pointer group">
            <input
              type="checkbox"
              id="terms"
              checked={agreeTerms}
              onChange={e => { setAgreeTerms(e.target.checked); clearError("terms") }}
              disabled={isLoading}
              className="mt-0.5 h-4 w-4 flex-shrink-0 rounded border-border/50 bg-muted/20 accent-primary
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-describedby={errors.terms ? "terms-error" : undefined}
            />
            <span className="text-xs text-muted-foreground leading-relaxed">
              I agree to the{" "}
              <Link href="/terms"   className="text-primary hover:underline">Terms of Service</Link>
              {" "}and{" "}
              <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
            </span>
          </label>
          <AnimatePresence mode="wait">
            {errors.terms && (
              <motion.p
                id="terms-error"
                role="alert"
                key="terms-error"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="text-xs text-red-400 pl-6.5"
              >
                {errors.terms}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

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
              Creating account…
            </>
          ) : (
            <>
              Start 30-Day Free Trial
              <ArrowRight className="size-4" aria-hidden="true" />
            </>
          )}
        </ShimmerButton>
      </form>

      {/* Switch to login */}
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-primary transition-colors hover:text-primary/80"
        >
          Sign in
        </Link>
      </p>
    </motion.div>
  )
}
