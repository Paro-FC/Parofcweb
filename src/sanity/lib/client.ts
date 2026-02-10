import { createClient } from '@sanity/client'
import { SANITY_FALLBACKS } from '@/lib/constants'

// Get Sanity configuration with proper fallbacks
const getSanityConfig = () => {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET

  // Warn if using fallback values in production
  if (process.env.NODE_ENV === 'production') {
    if (!projectId) {
      console.warn('NEXT_PUBLIC_SANITY_PROJECT_ID not set, using fallback')
    }
    if (!dataset) {
      console.warn('NEXT_PUBLIC_SANITY_DATASET not set, using fallback')
    }
  }

  return {
    projectId: projectId || SANITY_FALLBACKS.PROJECT_ID,
    dataset: dataset || SANITY_FALLBACKS.DATASET,
    apiVersion: '2024-01-01',
    useCdn: true,
  }
}

export const client = createClient(getSanityConfig())

