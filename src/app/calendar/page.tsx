import { sanityFetch } from "@/sanity/lib/live"
import { ALL_MATCHES_QUERY } from "@/sanity/lib/queries"
import { CalendarPage } from "@/components/CalendarPage"

export default async function Calendar() {
  const matchesResult = await sanityFetch({ query: ALL_MATCHES_QUERY }).catch(() => ({ data: [] }))
  const matches = (matchesResult.data as any) || []

  return <CalendarPage matches={matches} />
}

