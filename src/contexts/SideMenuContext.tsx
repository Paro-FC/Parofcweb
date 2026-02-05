"use client"

import { createContext, useContext, useState, ReactNode } from "react"

interface SideMenuContextType {
  isOpen: boolean
  openMenu: () => void
  closeMenu: () => void
  toggleMenu: () => void
}

const SideMenuContext = createContext<SideMenuContextType | undefined>(undefined)

export function SideMenuProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  const openMenu = () => setIsOpen(true)
  const closeMenu = () => setIsOpen(false)
  const toggleMenu = () => setIsOpen((prev) => !prev)

  return (
    <SideMenuContext.Provider value={{ isOpen, openMenu, closeMenu, toggleMenu }}>
      {children}
    </SideMenuContext.Provider>
  )
}

export function useSideMenu() {
  const context = useContext(SideMenuContext)
  if (context === undefined) {
    throw new Error("useSideMenu must be used within a SideMenuProvider")
  }
  return context
}

