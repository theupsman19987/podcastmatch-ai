"use client"

import { usePathname } from "next/navigation"

const AUTH_ROUTES = ["/login", "/signup", "/dashboard", "/onboarding"]

export function ConditionalShell({
  children,
  navbar,
  footer,
}: {
  children: React.ReactNode
  navbar:   React.ReactNode
  footer:   React.ReactNode
}) {
  const pathname = usePathname()
  const isAuth = AUTH_ROUTES.some(r => pathname === r || pathname.startsWith(r + "/"))

  return (
    <>
      {!isAuth && navbar}
      {children}
      {!isAuth && footer}
    </>
  )
}
