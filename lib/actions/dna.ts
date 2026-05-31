"use server"

import { createClient } from "@/lib/supabase/server"
import type { DNAFormData } from "@/components/onboarding/dna-context"
import type { Json } from "@/lib/supabase/database.types"

/* ── Save in-progress answers (auto-save) ────────────────── */
export async function saveDnaAnswers(
  answers: Partial<DNAFormData>
): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return {}   // Not logged in — silent fail, keep localStorage fallback

  const { error } = await supabase
    .from("dna_assessments")
    .upsert(
      {
        user_id:    user.id,
        answers:    JSON.parse(JSON.stringify(answers)) as Json,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    )

  if (error) return { error: error.message }
  return {}
}

/* ── Mark assessment complete ────────────────────────────── */
export async function completeDnaAssessment(
  answers: DNAFormData
): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return {}

  const now = new Date().toISOString()
  const { error } = await supabase
    .from("dna_assessments")
    .upsert(
      {
        user_id:      user.id,
        answers:      JSON.parse(JSON.stringify(answers)) as Json,
        completed:    true,
        completed_at: now,
        updated_at:   now,
      },
      { onConflict: "user_id" }
    )

  if (error) return { error: error.message }
  return {}
}

/* ── Load saved answers ──────────────────────────────────── */
export async function getDnaAssessment(): Promise<{
  data?: { answers: DNAFormData; completed: boolean; completedAt: string | null }
  error?: string
}> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return {}

  const { data, error } = await supabase
    .from("dna_assessments")
    .select("answers, completed, completed_at")
    .eq("user_id", user.id)
    .maybeSingle()

  if (error) return { error: error.message }
  if (!data)  return {}

  return {
    data: {
      answers:     data.answers as unknown as DNAFormData,
      completed:   data.completed,
      completedAt: data.completed_at,
    },
  }
}
