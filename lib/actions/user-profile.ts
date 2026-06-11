"use server"

import { createClient } from "@/lib/supabase/server"

export async function saveAvatarUrl(avatarUrl: string): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Not authenticated" }

  const { error } = await supabase
    .from("profiles")
    .update({ avatar_url: avatarUrl, updated_at: new Date().toISOString() })
    .eq("id", user.id)

  if (error) return { error: error.message }
  return {}
}

export async function getUserProfile(): Promise<{
  data?: { fullName: string | null; avatarUrl: string | null }
  error?: string
}> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return {}

  const { data, error } = await supabase
    .from("profiles")
    .select("full_name, avatar_url")
    .eq("id", user.id)
    .single()

  if (error) return { error: error.message }
  return { data: { fullName: data.full_name, avatarUrl: data.avatar_url } }
}
