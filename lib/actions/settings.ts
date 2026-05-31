"use server"

import { createClient } from "@/lib/supabase/server"
import type { Json }     from "@/lib/supabase/database.types"

type SettingsColumn =
  | "profile_settings"
  | "notification_settings"
  | "creator_preferences"
  | "account_settings"

/* ── Load all settings for the current user ──────────────── */
export async function getSettings(): Promise<{
  data?: {
    profile_settings:      Record<string, unknown>
    notification_settings: Record<string, unknown>
    creator_preferences:   Record<string, unknown>
    account_settings:      Record<string, unknown>
  }
  error?: string
}> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return {}

  const { data, error } = await supabase
    .from("user_settings")
    .select(
      "profile_settings, notification_settings, creator_preferences, account_settings"
    )
    .eq("user_id", user.id)
    .maybeSingle()

  if (error) return { error: error.message }
  if (!data)  return {
    data: {
      profile_settings:      {},
      notification_settings: {},
      creator_preferences:   {},
      account_settings:      {},
    },
  }

  return {
    data: {
      profile_settings:      (data.profile_settings      ?? {}) as Record<string, unknown>,
      notification_settings: (data.notification_settings ?? {}) as Record<string, unknown>,
      creator_preferences:   (data.creator_preferences   ?? {}) as Record<string, unknown>,
      account_settings:      (data.account_settings      ?? {}) as Record<string, unknown>,
    },
  }
}

/* ── Update a single settings section ───────────────────── */
export async function updateSettings(
  section: SettingsColumn,
  value:   Record<string, unknown>
): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Not authenticated" }

  const jsonValue: Json = JSON.parse(JSON.stringify(value))

  const insertMap: Record<SettingsColumn, {
    user_id:               string
    profile_settings?:      Json
    notification_settings?: Json
    creator_preferences?:   Json
    account_settings?:      Json
    updated_at:             string
  }> = {
    profile_settings:      { user_id: user.id, profile_settings:      jsonValue, updated_at: new Date().toISOString() },
    notification_settings: { user_id: user.id, notification_settings: jsonValue, updated_at: new Date().toISOString() },
    creator_preferences:   { user_id: user.id, creator_preferences:   jsonValue, updated_at: new Date().toISOString() },
    account_settings:      { user_id: user.id, account_settings:      jsonValue, updated_at: new Date().toISOString() },
  }

  const { error } = await supabase
    .from("user_settings")
    .upsert(insertMap[section], { onConflict: "user_id" })

  if (error) return { error: error.message }
  return {}
}

/* ── Update display name / email on auth.users + profile ─── */
export async function updateProfileSettings(profile: {
  fullName?:  string
  email?:     string
  bio?:       string
  website?:   string
  location?:  string
  title?:     string
}): Promise<{ error?: string }> {
  const supabase = await createClient()

  /* Update auth user metadata if name or email changed */
  if (profile.fullName || profile.email) {
    const updates: { data?: { full_name: string }; email?: string } = {}
    if (profile.fullName) updates.data  = { full_name: profile.fullName }
    if (profile.email)    updates.email = profile.email

    const { error } = await supabase.auth.updateUser(updates)
    if (error) return { error: error.message }
  }

  /* Persist all fields to profile_settings section */
  return updateSettings("profile_settings", profile as Record<string, unknown>)
}
