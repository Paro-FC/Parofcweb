"use client"

import { TopNav } from "./TopNav"
import { MainNav } from "./MainNav"
import { Footer } from "./Footer"
import { SideMenu } from "./SideMenu"
import { SideMenuProvider, useSideMenu } from "@/contexts/SideMenuContext"

interface LayoutWrapperProps {
  children: React.ReactNode
  partners?: any[]
}

function LayoutContent({ children, partners = [] }: LayoutWrapperProps) {
  const { isOpen, closeMenu } = useSideMenu()

  return (
    <>
      <TopNav />
      <MainNav />
      {children}
      <Footer partners={partners} />
      <SideMenu isOpen={isOpen} onClose={closeMenu} />
    </>
  )
}

export function LayoutWrapper({ children, partners = [] }: LayoutWrapperProps) {
  return (
    <SideMenuProvider>
      <LayoutContent partners={partners}>{children}</LayoutContent>
    </SideMenuProvider>
  )
}

