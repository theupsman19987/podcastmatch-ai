/**
 * End-to-end proof: forgot-password flow
 *
 * Email delivery is bypassed (SMTP key invalid) using the GoTrue admin
 * generate_link API to get a recovery OTP, then calling verifyOtp() on
 * the page's own Supabase auth singleton (window.__sbAuth) so PASSWORD_RECOVERY
 * fires on the same onAuthStateChange listener the page is watching.
 *
 * Steps proven:
 *  1. SKIPPED  — email not sent (invalid Resend key; needs rotation)
 *  2. PROVEN   — /reset-password loads correctly
 *  3. PROVEN   — PASSWORD_RECOVERY fires: "Set new password" form appears
 *  4. PROVEN   — form submit calls updateUser and saves new password
 *  5. PROVEN   — user_updated_password audit event in GoTrue log
 *  6. PROVEN   — new password signs in via GoTrue API
 */

import { test, expect } from "@playwright/test"

// ── Config ────────────────────────────────────────────────────────────────────

const LIVE_BASE   = "https://www.podcastmatchai.com"
const KONG_URL    = "http://supabasekong-nzt6wv9k32n45xzst6vd5mmk.72.62.168.96.sslip.io"
const ANON_KEY    = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTc4MDM2NTAwMCwiZXhwIjo0OTM2MDM4NjAwLCJyb2xlIjoiYW5vbiJ9.1JWsCMgr1yP7SwU9TC4kY1f46mfHSB2FbujaShgXd5w"
const SERVICE_KEY = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTc4MDM2NTAwMCwiZXhwIjo0OTM2MDM4NjAwLCJyb2xlIjoic2VydmljZV9yb2xlIn0.tXXGR8XzZ0rbzi4gqcw7-gk37uHUmd0NIOFUu2YkWzE"

const TEST_EMAIL   = "authtest002@mailinator.com"
const NEW_PASSWORD = "ResetProof2026!"

// ── Helpers ───────────────────────────────────────────────────────────────────

async function getRecoveryOtp(): Promise<string> {
  const resp = await fetch(`${KONG_URL}/auth/v1/admin/generate_link`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${SERVICE_KEY}`,
      "apikey": SERVICE_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ type: "recovery", email: TEST_EMAIL }),
  })
  if (!resp.ok) throw new Error(`generate_link: ${await resp.text()}`)
  const data = await resp.json()
  return data.email_otp as string
}

async function getLatestAuditAction(action: string): Promise<string | undefined> {
  const resp = await fetch(`${KONG_URL}/auth/v1/admin/audit?page=1&rows=20`, {
    headers: { "Authorization": `Bearer ${SERVICE_KEY}`, "apikey": SERVICE_KEY },
  })
  const events: Array<{ created_at: string; payload: { action: string; actor_username: string } }> = await resp.json()
  return events.find(e => e.payload.action === action && e.payload.actor_username === TEST_EMAIL)?.created_at
}

async function signInWithPassword(email: string, password: string): Promise<boolean> {
  const resp = await fetch(`${KONG_URL}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: { "apikey": ANON_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })
  return resp.ok
}

// ── Tests ─────────────────────────────────────────────────────────────────────

test.describe("Forgot-password flow", () => {
  let otp: string

  test.beforeAll(async () => {
    otp = await getRecoveryOtp()
    console.log(`  [admin] Recovery OTP obtained for ${TEST_EMAIL}: ${otp}`)
  })

  // ── 2+3: page loads + PASSWORD_RECOVERY fires ─────────────────────────────

  test("2+3 — /reset-password loads and PASSWORD_RECOVERY fires (form appears)", async ({ page }) => {
    await page.goto(`${LIVE_BASE}/reset-password`, { waitUntil: "domcontentloaded" })

    // Step 2: correct page loaded
    await expect(page).toHaveURL(/reset-password/, { timeout: 5000 })
    console.log("  [browser] Landed on /reset-password ✅")

    // Wait for the reset-password-client.tsx useEffect to run (it sets window.__sbAuth)
    await page.waitForFunction(() => !!(window as any).__sbAuth, { timeout: 5000 })

    // Step 3: call verifyOtp on the PAGE's own Supabase auth singleton.
    // This fires PASSWORD_RECOVERY on the same onAuthStateChange listener
    // that the page's useEffect registered.
    const otpResult = await page.evaluate(
      async ({ email, token }) => {
        const auth = (window as any).__sbAuth
        const { data, error } = await auth.verifyOtp({ email, token, type: "recovery" })
        return { ok: !error, error: error?.message, user: data?.user?.email }
      },
      { email: TEST_EMAIL, token: otp }
    )
    console.log("  [browser] verifyOtp result:", JSON.stringify(otpResult))
    expect(otpResult.ok).toBe(true)

    // PASSWORD_RECOVERY fires → stage becomes "form"
    await expect(page.getByRole("heading", { name: "Set new password" })).toBeVisible({ timeout: 5000 })
    console.log("  [browser] PASSWORD_RECOVERY fired — 'Set new password' heading visible ✅")
  })

  // ── 4+5: updateUser + audit event ────────────────────────────────────────

  test("4+5 — form submit calls updateUser; audit log records user_updated_password", async ({ page }) => {
    const freshOtp = await getRecoveryOtp()
    console.log(`  [admin] Fresh OTP: ${freshOtp}`)

    await page.goto(`${LIVE_BASE}/reset-password`, { waitUntil: "domcontentloaded" })
    await page.waitForFunction(() => !!(window as any).__sbAuth, { timeout: 5000 })

    await page.evaluate(
      async ({ email, token }) => {
        const auth = (window as any).__sbAuth
        await auth.verifyOtp({ email, token, type: "recovery" })
      },
      { email: TEST_EMAIL, token: freshOtp }
    )

    await expect(page.getByRole("heading", { name: "Set new password" })).toBeVisible({ timeout: 5000 })

    // Fill in and submit — calls supabase.auth.updateUser({ password })
    // Use exact input IDs to avoid ambiguity with the page's aria-label
    await page.locator("input#password").fill(NEW_PASSWORD)
    await page.locator("input#confirm").fill(NEW_PASSWORD)
    await page.getByRole("button", { name: "Update Password" }).click()
    console.log("  [browser] Submitted new password ✅")

    // Should redirect to /login?message=password_updated
    await page.waitForURL("**/login**", { timeout: 12000 })
    expect(page.url()).toContain("password_updated")
    console.log("  [browser] Redirected to /login?message=password_updated ✅")

    // Verify audit event
    await page.waitForTimeout(1500)
    const ts = await getLatestAuditAction("user_updated_password")
    expect(ts).toBeDefined()
    console.log("  [audit]   user_updated_password at:", ts, "✅")
  })

  // ── 5b: banner on login page ──────────────────────────────────────────────

  test("5b — Login page shows password-updated success banner", async ({ page }) => {
    await page.goto(`${LIVE_BASE}/login?message=password_updated`)
    await expect(page.getByText("Password updated — sign in with your new password below.")).toBeVisible({ timeout: 8000 })
    console.log("  [browser] Password-updated banner visible ✅")
  })

  // ── 6: new password signs in ──────────────────────────────────────────────

  test("6 — New password logs in via GoTrue API", async () => {
    const ok = await signInWithPassword(TEST_EMAIL, NEW_PASSWORD)
    expect(ok).toBe(true)
    console.log("  [api]     Sign-in with new password: OK ✅")
  })
})
