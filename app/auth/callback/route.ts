/* ═══════════════════════════════════════════════════════════
   GET /auth/callback — handles Supabase email confirmation,
   OAuth redirects, and password-reset deep-links.

   Supabase sends the user here after:
   - Email confirmation on sign-up
   - Password reset link click
   - OAuth provider redirect
   ═══════════════════════════════════════════════════════════ */

import { NextResponse }       from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies }            from "next/headers"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const next = searchParams.get("next") ?? "/dashboard"

  if (code) {
    const cookieStore = await cookies()
    const supabase    = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          },
        },
      }
    )

    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      /* Ensure next is an internal path */
      const destination = next.startsWith("/") ? next : "/dashboard"
      return NextResponse.redirect(`${origin}${destination}`)
    }
  }

  /* Something went wrong — send to login with an error hint */
  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`)
}
