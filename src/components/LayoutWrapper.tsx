import { TopNav } from "./TopNav"
import { MainNav } from "./MainNav"
import { Footer } from "./Footer"

interface LayoutWrapperProps {
  children: React.ReactNode
  partners?: any[]
}

export function LayoutWrapper({ children, partners = [] }: LayoutWrapperProps) {
  return (
    <>
      <TopNav />
      <MainNav />
      {children}
      <Footer partners={partners} />
    </>
  )
}

