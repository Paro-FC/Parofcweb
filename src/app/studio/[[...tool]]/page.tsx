'use client'

import { useLayoutEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { NextStudio } from 'next-sanity/studio'
import config from '../../../../sanity.config'
import { stripLegacyMatchFieldPaths } from './stripLegacyStudioPath'

export default function StudioPage() {
  const pathname = usePathname()
  const router = useRouter()
  const cleaned = stripLegacyMatchFieldPaths(pathname)
  const needsRedirect = cleaned !== pathname

  useLayoutEffect(() => {
    if (!needsRedirect) return
    const search = typeof window !== 'undefined' ? window.location.search : ''
    const hash = typeof window !== 'undefined' ? window.location.hash : ''
    router.replace(`${cleaned}${search}${hash}`)
  }, [needsRedirect, cleaned, router])

  if (needsRedirect) {
    return null
  }

  return <NextStudio config={config} />
}
