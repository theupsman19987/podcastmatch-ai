"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "motion/react"
import { ArrowRight, Loader2, CheckCircle2 } from "lucide-react"
import { AuthInput } from "@/components/auth/auth-input"
import { SocialLoginButtons } from "@/components/auth/social-login-buttons"
import { AuthDivider } from "@/components/auth/auth-divider"
import { ShimmerButton } from "@/components/ui/shimmer-button"
import { signInAction } from "@/lib/actions/auth"

type Errors = Partial<Record<"email" | "password" | "form", string>>

function validate(email: string, password: string): Errors {
  const e: Errors = {}
  if (!email.trim()) e.email = "Email is required"
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Enter a valid email address"
  if (!password) e.password = "Password is required"
  return e
}

export function LoginForm() {
  const [email,     setEmail]     = useState("")
  const [password,  setPassword]  = useState("")
  const [errors,    setErrors]    = useState<Errors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [success,   setSuccess]   = useState(false)

  function clearError(field: keyof Errors) {
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }))
  }

  async function handleSubmit(evt: React.FormEvent) {
    evt.preventDefault()
    const errs = validate(email, password)
    setErrors(errs)
    if (Object.keys(errs).length) return
    setIsLoading(true)
    setSuccess(true)  // Optimistic — show success state while server redirects
    const result = await signInAction(email.trim(), password)
    if (result?.error) {
      setIsLoading(false)
      setSuccess(false)
      setErrors({ form: result.error })
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
          <p className="text-base font-semibold text-foreground">Signed in successfully</p>
          <p className="text-sm text-muted-foreground">Redirecting you to your dashboard…</p>
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
      {/* Heading */}
      <div className="mb-6 flex flex-col gap-1.5">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Welcome back</h1>
        <p className="text-sm text-muted-foreground">
          Sign in to your PodcastMatch AI account
        </p>
      </div>

      {/* Social login */}
      <SocialLoginButtons disabled={isLoading} />
      <div className="my-5">
        <AuthDivider />
      </div>

      {/* Form-level error */}
      {errors.form && (
        <p role="alert" className="mb-3 rounded-[var(--radius-md)] border border-red-500/20 bg-red-500/08 px-3 py-2 text-[12px] text-red-400">
          {errors.form}
        </p>
      )}

      {/* Email + password form */}
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
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

        <div className="flex flex-col gap-2">
          <AuthInput
            id="password"
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={v => { setPassword(v); clearError("password") }}
            error={errors.password}
            autoComplete="current-password"
            required
            disabled={isLoading}
          />
          <div className="flex justify-end -mt-0.5">
            <Link
              href="/forgot-password"
              className="text-xs text-primary/60 transition-colors hover:text-primary"
            >
              Forgot password?
            </Link>
          </div>
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
              Signing in…
            </>
          ) : (
            <>
              Sign In
              <ArrowRight className="size-4" aria-hidden="true" />
            </>
          )}
        </ShimmerButton>
      </form>

      {/* Switch to signup */}
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="font-medium text-primary transition-colors hover:text-primary/80"
        >
          Sign up free
        </Link>
      </p>
    </motion.div>
  )
}
