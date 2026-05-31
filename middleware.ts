import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  /* IMPORTANT: do not add logic between createServerClient and getUser().
     A simple mistake can make it very hard to debug issues with users
     being randomly logged out. */
  const { data: { user } } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  /* Redirect unauthenticated users away from the dashboard */
  if (!user && pathname.startsWith("/dashboard")) {
    const url = request.nextUrl.clone()
    url.pathname = "/login"
    url.searchParams.set("next", pathname)
    return NextResponse.redirect(url)
  }

  /* Redirect authenticated users away from auth pages */
  if (
    user &&
    (pathname === "/login" ||
      pathname === "/signup" ||
      pathname === "/forgot-password")
  ) {
    const next = request.nextUrl.searchParams.get("next") ?? "/dashboard"
    const url  = request.nextUrl.clone()
    url.pathname = next.startsWith("/dashboard") ? next : "/dashboard"
    url.searchParams.delete("next")
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/login",
    "/signup",
    "/forgot-password",
  ],
}
