"use client"

import { createContext, useContext, useState, useCallback } from "react"

interface SidebarContextValue {
  collapsed:       boolean
  mobileOpen:      boolean
  toggleCollapsed: () => void
  openMobile:      () => void
  closeMobile:     () => void
}

const SidebarContext = createContext<SidebarContextValue | null>(null)

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [collapsed,  setCollapsed]  = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const toggleCollapsed = useCallback(() => setCollapsed(p => !p), [])
  const openMobile      = useCallback(() => setMobileOpen(true),   [])
  const closeMobile     = useCallback(() => setMobileOpen(false),  [])

  return (
    <SidebarContext.Provider
      value={{ collapsed, mobileOpen, toggleCollapsed, openMobile, closeMobile }}
    >
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebar(): SidebarContextValue {
  const ctx = useContext(SidebarContext)
  if (!ctx) throw new Error("useSidebar must be used within <SidebarProvider>")
  return ctx
}
