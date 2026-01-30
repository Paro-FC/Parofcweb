import { client } from './client'
import type { QueryParams } from '@sanity/client'

export async function sanityFetch<T>({ 
  query, 
  params = {} 
}: { 
  query: string
  params?: QueryParams 
}): Promise<{ data: T }> {
  const data = await client.fetch<T>(query, params)
  return { data }
}

// Placeholder component for layout compatibility
export function SanityLive() {
  return null
}
