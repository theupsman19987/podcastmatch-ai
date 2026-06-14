"use server"

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

/* ── Sign Out ────────────────────────────────────────────── */
export async function signOutAction(): Promise<void> {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/login")
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
