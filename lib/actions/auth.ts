"use server"

import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"

/* ── Sign In ─────────────────────────────────────────────── */
export async function signInAction(
  email: string,
  password: string
): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return { error: error.message }
  redirect("/dashboard")
}

/* ── Sign Up ─────────────────────────────────────────────── */
export async function signUpAction(
  email: string,
  password: string,
  fullName: string
): Promise<{ error?: string }> {
  const supabase      = await createClient()
  const headersList   = await headers()
  const origin        = headersList.get("origin") ?? ""

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data:            { full_name: fullName },
      emailRedirectTo: `${origin}/auth/callback`,
    },
  })

  if (error) return { error: error.message }

  // If Supabase returned no session the account is unconfirmed.
  // Force-confirm via admin then sign in so the user lands on the dashboard.
  if (!data.session) {
    if (data.user) {
      const admin = createAdminClient()
      await admin.auth.admin.updateUserById(data.user.id, { email_confirm: true })
    }
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
    if (signInError) return { error: signInError.message }
  }

  redirect("/dashboard")
}

/* ── Sign Out ────────────────────────────────────────────── */
export async function signOutAction(): Promise<void> {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/login")
}

/* ── Password Reset ──────────────────────────────────────── */
export async function resetPasswordAction(
  email: string
): Promise<{ error?: string; success?: boolean }> {
  const supabase    = await createClient()
  const headersList = await headers()
  const origin      = headersList.get("origin") ?? ""

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/reset-password`,
  })

  if (error) return { error: error.message }
  return { success: true }
}

/* ── Update Password (after reset link) ─────────────────── */
export async function updatePasswordAction(
  password: string
): Promise<{ error?: string }> {
  const supabase = await createClient()

  // Verify a recovery session exists before attempting the update
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Your password reset link has expired. Please request a new one." }

  const { error } = await supabase.auth.updateUser({ password })
  if (error) return { error: error.message }

  // Sign out to cleanly invalidate the recovery session, then send to login
  await supabase.auth.signOut()
  redirect("/login?message=password_updated")
}

/* ── Get current user (safe — returns null if unauthenticated) */
export async function getCurrentUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}
