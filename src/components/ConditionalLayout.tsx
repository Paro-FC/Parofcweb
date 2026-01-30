"use client"

import { usePathname } from 'next/navigation'
import { LayoutWrapper } from './LayoutWrapper'

interface ConditionalLayoutProps {
  children: React.ReactNode
  partners?: any[]
}

export function ConditionalLayout({ children, partners = [] }: ConditionalLayoutProps) {
  const pathname = usePathname()
  const isStudio = pathname?.startsWith('/studio')

  if (isStudio) {
    return <>{children}</>
  }

  return <LayoutWrapper partners={partners}>{children}</LayoutWrapper>
}

