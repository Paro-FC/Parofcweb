"use client"

import { usePathname } from 'next/navigation'
import { LayoutWrapper } from './LayoutWrapper'

interface ConditionalLayoutProps {
  children: React.ReactNode
  partners?: any[]
  latestMatch?: any
}

export function ConditionalLayout({ children, partners = [], latestMatch = null }: ConditionalLayoutProps) {
  const pathname = usePathname()
  const isStudio = pathname?.startsWith('/studio')

  if (isStudio) {
    return <>{children}</>
  }

  return <LayoutWrapper partners={partners} latestMatch={latestMatch}>{children}</LayoutWrapper>
}

