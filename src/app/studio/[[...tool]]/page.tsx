'use client'

import { useLayoutEffect, useState } from 'react'
import { NextStudio } from 'next-sanity/studio'
import config from '../../../../sanity.config'
import { stripLegacyMatchFieldPaths } from './stripLegacyStudioPath'

export default function StudioPage() {
  const [ready, setReady] = useState(false)

  useLayoutEffect(() => {
    const raw = window.location.pathname
    const cleaned = stripLegacyMatchFieldPaths(raw)
    if (cleaned !== raw) {
      // Use history.replaceState to avoid Next.js router re-encoding special characters
      window.history.replaceState(null, '', `${cleaned}${window.location.search}${window.location.hash}`)
      window.location.reload()
      return
    }
    setReady(true)
  }, [])

  if (!ready) return null

  return <NextStudio config={config} />
}
