"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import Link         from "next/link"
import { motion }   from "motion/react"
import { ArrowRight, ArrowLeft, Loader2, AlertCircle } from "lucide-react"
import { createClient }  from "@/lib/supabase/client"
import { AuthInput }     from "@/components/auth/auth-input"
import { ShimmerButton } from "@/components/ui/shimmer-button"

// console.warn survives Next.js removeConsole (which strips log/debug/info only).
// Filter DevTools Console by "[AUTH-TRACE]" to isolate these entries.
const T = (label: string, data?: Record<string, unknown>) =>
  console.warn(`[AUTH-TRACE] ${new Date().toISOString()} | ${label}`, data ?? "")

// Read every localStorage key whose name contains the given substring
function lsSnapshot(match: string): Record<string, string> {
  try {
    const out: Record<string, string> = {}
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i) ?? ""
      if (k.includes(match)) {
        const raw = localStorage.getItem(k) ?? ""
        // Truncate long values but keep the /recovery suffix visible
        const parts = raw.split("/")
        out[k] = raw.length > 30
          ? raw.slice(0, 20) + "…/" + parts[parts.length - 1]
          : raw
      }
    }
    return out
  } catch {
    return { error: "localStorage inaccessible" }
  }
}

export function ResetPasswordClient() {
  const router = useRouter()

  const [stage,      setStage]      = useState<"exchanging" | "form" | "error">("exchanging")
  const [stageError, setStageError] = useState<string | null>(null)
  const [password,   setPassword]   = useState("")
  const [confirm,    setConfirm]    = useState("")
  const [formError,  setFormError]  = useState<string | null>(null)
  const [isLoading,  setIsLoading]  = useState(false)

  // Stable refs — do not trigger re-renders
  const listenerAt  = useRef<number>(0)
  const hadCode     = useRef<boolean>(false)   // ?code= present at page load
  const eventsSeen  = useRef<string[]>([])     // ordered list of every event name

  useEffect(() => {
    const t0 = performance.now()

    // ── STEP 1 — URL snapshot (before createClient touches anything) ─────────
    const searchBefore = window.location.search
    const hashBefore   = window.location.hash
    const codeBefore   = new URLSearchParams(searchBefore).get("code")
    const errorBefore  = new URLSearchParams(searchBefore).get("error")

    hadCode.current = !!codeBefore

    T("STEP 1 | useEffect fired — URL snapshot", {
      t_ms:         0,
      url:          window.location.href,
      search:       searchBefore || "(empty)",
      hash:         hashBefore   || "(empty)",
      code_in_url:  !!codeBefore,
      code_prefix:  codeBefore ? codeBefore.slice(0, 12) + "…" : null,
      error_in_url: errorBefore  || null,
      readyState:   document.readyState,
    })

    // ── SDK versions (locked by package-lock, not semver ranges) ────────────
    T("SDK VERSIONS", {
      supabase_ssr:   "0.10.3",
      supabase_js:    "2.106.2",
      auth_js:        "2.106.2",
      next:           "16.2.6",
      react:          "19.2.4",
      pkce_note:      "PASSWORD_RECOVERY fires only when localStorage code-verifier has /recovery suffix",
    })

    // ── Hash-error path (expired / already-used link) ────────────────────────
    if (hashBefore.includes("error=")) {
      const p    = new URLSearchParams(hashBefore.slice(1))
      const desc = p.get("error_description") ?? "Reset link is invalid or has expired."
      T("STEP 2 | hash error → showing error state", { error: desc })
      setStageError(desc)
      setStage("error")
      return
    }

    // ── STEP 2B — localStorage snapshot before createClient() ───────────────
    // The code-verifier is stored here by the forgot-password page.
    // Its value is "{verifier}/recovery" for reset flows; missing = different browser.
    const verifierBefore = lsSnapshot("code-verifier")
    const authTokenBefore = lsSnapshot("auth-token")
    T("STEP 2B | localStorage BEFORE createClient()", {
      t_ms:                  +(performance.now() - t0).toFixed(2),
      code_verifier_keys:    Object.keys(verifierBefore),
      code_verifier_values:  verifierBefore,
      has_recovery_suffix:   Object.values(verifierBefore).some(v => v.endsWith("recovery")),
      auth_token_keys:       Object.keys(authTokenBefore),
      existing_session:      Object.keys(authTokenBefore).length > 0,
      note:                  "If code_verifier_keys is empty, browser never stored the verifier (different browser / incognito / cleared storage)",
    })

    // ── STEP 3 — create Supabase browser client ──────────────────────────────
    // This triggers GoTrueClient constructor → initialize() starts ASYNC (fire-and-forget).
    // The PKCE exchange happens inside initialize(), NOT synchronously here.
    T("STEP 3 | calling createClient() — initialize() starts async", {
      t_ms: +(performance.now() - t0).toFixed(2),
    })
    const supabase = createClient()

    const searchAfter = window.location.search
    const codeAfter   = new URLSearchParams(searchAfter).get("code")
    T("STEP 4 | createClient() returned — initialize() is still running", {
      t_ms:              +(performance.now() - t0).toFixed(2),
      code_still_in_url: !!codeAfter,
      url_changed:       searchAfter !== searchBefore,
      url_now:           window.location.href,
      note:              "Code cleaned synchronously here would mean exchange completed before useEffect — almost impossible",
    })

    // Expose for manual DevTools inspection: __sbAuth.getSession()
    if (typeof window !== "undefined") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(window as any).__sbAuth = supabase.auth
    }

    // ── STEP 5 — register onAuthStateChange listener ─────────────────────────
    const lAt = performance.now()
    listenerAt.current = lAt
    T("STEP 5 | registering onAuthStateChange", {
      t_ms: +(lAt - t0).toFixed(2),
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      const eAt = performance.now()
      eventsSeen.current.push(event)

      // Full detail log for EVERY event — no filtering
      T(`STEP 6 | EVENT → ${event}`, {
        t_ms:                  +(eAt - t0).toFixed(2),
        ms_after_listener:     +(eAt - listenerAt.current).toFixed(2),
        event,
        session_null:          session === null,
        access_token_present:  !!session?.access_token,
        refresh_token_present: !!session?.refresh_token,
        user_email:            session?.user?.email ?? null,
        user_id:               session?.user?.id   ?? null,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        amr:                   (session?.user as any)?.amr ?? null,
        code_in_url_now:       !!new URLSearchParams(window.location.search).get("code"),
        url_now:               window.location.href,
        had_code_at_load:      hadCode.current,
        all_events_so_far:     [...eventsSeen.current],
      })

      // ── Event handlers ───────────────────────────────────────────────────
      if (event === "PASSWORD_RECOVERY") {
        T("  → PASSWORD_RECOVERY ✅ — code-verifier had /recovery suffix, exchange succeeded")
        setStage("form")

      } else if (event === "SIGNED_IN") {
        // SIGNED_IN on this page means EITHER:
        //   (a) The code-verifier was missing/wrong suffix → exchange used SIGNED_IN instead of PASSWORD_RECOVERY
        //   (b) A pre-existing regular login session was detected (no code in URL)
        T("  → SIGNED_IN (not PASSWORD_RECOVERY)", {
          had_code:       hadCode.current,
          session_present: !!session,
          diagnosis:      hadCode.current && !!session
            ? "Case B likely: exchange succeeded but PASSWORD_RECOVERY not fired — check /recovery suffix in verifier"
            : !hadCode.current
            ? "Pre-existing login session detected on this page — no code was in the URL"
            : "No session despite code — unlikely",
        })
        // Do NOT show form on SIGNED_IN alone — not safe (see security note below).
        // If this is Case B, the fix is to handle SIGNED_IN when hadCode is true.
        // We log it here to prove the case; the fix comes after the trace.

      } else if (event === "INITIAL_SESSION") {
        T("  → INITIAL_SESSION", {
          session_present:  !!session,
          had_code:         hadCode.current,
          verifier_now:     lsSnapshot("code-verifier"),
          diagnosis:        session && hadCode.current
            ? "Exchange already completed before listener registered — password recovery, INITIAL_SESSION carries the session"
            : session && !hadCode.current
            ? "Pre-existing login session — user was already logged in, visited /reset-password directly"
            : !session && hadCode.current
            ? "Exchange not yet complete OR failed — waiting for PASSWORD_RECOVERY or SIGNED_IN"
            : "No session, no code — normal unauthenticated page visit",
        })

        // Start the 3-second safety timer.
        // If PASSWORD_RECOVERY or the correct SIGNED_IN fires before this, stage won't be "exchanging".
        setTimeout(() => {
          setStage(prev => {
            if (prev === "exchanging") {
              T("  → 3 s elapsed, still exchanging — error ❌", {
                all_events_seen:   [...eventsSeen.current],
                had_code:          hadCode.current,
                verifier_now:      lsSnapshot("code-verifier"),
                classification:
                  eventsSeen.current.includes("PASSWORD_RECOVERY")
                    ? "BUG: PASSWORD_RECOVERY was seen but setStage('form') didn't run — React state bug"
                    : eventsSeen.current.includes("SIGNED_IN") && hadCode.current
                    ? "Case B confirmed: SIGNED_IN fired instead of PASSWORD_RECOVERY — verifier missing /recovery"
                    : !hadCode.current
                    ? "No code was ever in URL — user hit this page without a reset link"
                    : "Case C: PKCE exchange failed — no session event with a valid session",
              })
              setStageError("No reset code found. Please request a new password reset link.")
              return "error"
            }
            T(`  → 3 s elapsed, stage already "${prev}" — no-op`)
            return prev
          })
        }, 3000)

      } else if (event === "TOKEN_REFRESHED") {
        T("  → TOKEN_REFRESHED (background token rotation)")

      } else if (event === "SIGNED_OUT") {
        T("  → SIGNED_OUT")

      } else if (event === "USER_UPDATED") {
        T("  → USER_UPDATED (server confirmed password change)")

      } else if (event === "MFA_CHALLENGE_VERIFIED") {
        T("  → MFA_CHALLENGE_VERIFIED")

      } else {
        T(`  → UNKNOWN EVENT: ${event} — log for analysis`)
      }
    })

    T("STEP 7 | listener registered", {
      t_ms: +(performance.now() - t0).toFixed(2),
    })

    // ── STEP 8 — 100 ms post-registration localStorage snapshot ─────────────
    // By this point, if the exchange ran before the listener, the verifier should be consumed.
    setTimeout(() => {
      T("STEP 8 | localStorage 100 ms after listener registered", {
        t_ms:                    +(performance.now() - t0).toFixed(2),
        code_verifier_remaining: lsSnapshot("code-verifier"),
        verifier_consumed:       Object.keys(lsSnapshot("code-verifier")).length === 0,
        events_fired_so_far:     [...eventsSeen.current],
        note:                    "verifier_consumed=true means exchange already ran (verifier deleted after use)",
      })
    }, 100)

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
