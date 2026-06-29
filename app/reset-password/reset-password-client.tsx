"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import Link         from "next/link"
import { motion }   from "motion/react"
import { ArrowRight, ArrowLeft, Loader2, AlertCircle } from "lucide-react"
import { createClient }  from "@/lib/supabase/client"
import { AuthInput }     from "@/components/auth/auth-input"
import { ShimmerButton } from "@/components/ui/shimmer-button"

// console.warn is kept in production (removeConsole excludes "warn" and "error").
// Filter DevTools console by "[AUTH-TRACE]" to see only these entries.
const T = (label: string, data?: Record<string, unknown>) =>
  console.warn(`[AUTH-TRACE] ${new Date().toISOString()} | ${label}`, data ?? "")

export function ResetPasswordClient() {
  const router = useRouter()

  const [stage,     setStage]     = useState<"exchanging" | "form" | "error">("exchanging")
  const [stageError, setStageError] = useState<string | null>(null)
  const [password,  setPassword]  = useState("")
  const [confirm,   setConfirm]   = useState("")
  const [formError, setFormError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Tracks when the listener was registered so we can measure offset at each event
  const listenerAt = useRef<number>(0)

  useEffect(() => {
    const t0 = performance.now()

    // ── STEP 1: snapshot URL state BEFORE createBrowserClient touches anything ──
    const searchBefore = window.location.search
    const hashBefore   = window.location.hash
    const codeBefore   = new URLSearchParams(searchBefore).get("code")

    T("STEP 1 | useEffect fired", {
      t_ms:         0,
      url:          window.location.href,
      code_in_url:  !!codeBefore,
      code_prefix:  codeBefore ? codeBefore.slice(0, 10) + "…" : null,
      hash:         hashBefore || "(empty)",
      readyState:   document.readyState,
    })

    // ── Hash-error path (expired / already-used link) ────────────────────────
    if (hashBefore.includes("error=")) {
      const p    = new URLSearchParams(hashBefore.slice(1))
      const desc = p.get("error_description") ?? "Reset link is invalid or has expired."
      T("STEP 2 | hash error detected → showing error state", { error: desc })
      setStageError(desc)
      setStage("error")
      return
    }

    // ── STEP 3: create the Supabase browser client ───────────────────────────
    T("STEP 3 | calling createClient()…", { t_ms: +(performance.now() - t0).toFixed(2) })
    const supabase = createClient()

    const searchAfter = window.location.search
    const codeAfter   = new URLSearchParams(searchAfter).get("code")
    T("STEP 4 | createClient() returned", {
      t_ms:             +(performance.now() - t0).toFixed(2),
      code_still_in_url: !!codeAfter,
      url_changed:      searchAfter !== searchBefore,
      url_now:          window.location.href,
    })

    // Expose auth instance for e2e test hooks
    if (typeof window !== "undefined") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(window as any).__sbAuth = supabase.auth
    }

    // ── STEP 5: register the auth-state listener ─────────────────────────────
    const lAt = performance.now()
    listenerAt.current = lAt
    T("STEP 5 | registering onAuthStateChange", { t_ms: +(lAt - t0).toFixed(2) })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      const eAt = performance.now()
      T(`STEP 6 | EVENT → ${event}`, {
        t_ms:              +(eAt - t0).toFixed(2),
        ms_after_listener: +(eAt - listenerAt.current).toFixed(2),
        session_null:      session === null,
        user_email:        session?.user?.email ?? null,
        code_in_url_now:   !!new URLSearchParams(window.location.search).get("code"),
        url_now:           window.location.href,
      })

      if (event === "PASSWORD_RECOVERY") {
        T("  → PASSWORD_RECOVERY received — transitioning to form ✅")
        setStage("form")

      } else if (event === "INITIAL_SESSION") {
        T("  → INITIAL_SESSION received — starting 3 s timer", {
          session_present: !!session,
          user_email:      session?.user?.email ?? null,
        })
        setTimeout(() => {
          setStage(prev => {
            if (prev === "exchanging") {
              T("  → 3 s elapsed, still exchanging — transitioning to error ❌")
              setStageError("No reset code found. Please request a new password reset link.")
              return "error"
            }
            T(`  → 3 s elapsed, stage already = "${prev}" — no-op`)
            return prev
          })
        }, 3000)

      } else {
        T(`  → ${event} — no handler (ignored)`)
      }
    })

    T("STEP 7 | listener registered", { t_ms: +(performance.now() - t0).toFixed(2) })

    return () => subscription.unsubscribe()
  }, [])

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
        <ArrowLeft className="size-3.5" />
        Back to sign in
      </Link>
    </motion.div>
  )
}
