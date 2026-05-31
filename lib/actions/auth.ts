"use server"

import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

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
): Promise<{ error?: string; needsConfirmation?: boolean }> {
  const supabase      = await createClient()
  const headersList   = await headers()
  const origin        = headersList.get("origin") ?? ""

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data:            { full_name: fullName },
      emailRedirectTo: `${origin}/auth/callback`,
    },
  })

  if (error) return { error: error.message }
  return { needsConfirmation: true }
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
    redirectTo: `${origin}/auth/callback?next=/update-password`,
  })

  if (error) return { error: error.message }
  return { success: true }
}

/* ── Update Password (after reset link) ─────────────────── */
export async function updatePasswordAction(
  password: string
): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { error } = await supabase.auth.updateUser({ password })
  if (error) return { error: error.message }
  redirect("/dashboard")
}

/* ── Get current user (safe — returns null if unauthenticated) */
export async function getCurrentUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}
