import { notFound } from "next/navigation"
import { sanityFetch } from "@/sanity/lib/live"
import { MATCH_QUERY } from "@/sanity/lib/queries"
import { MatchDetailPage } from "@/components/MatchDetailPage"

interface Props {
  params: Promise<{ id: string }>
}

export default async function MatchPage({ params }: Props) {
  const { id } = await params
  
  const matchResult = await sanityFetch({ 
    query: MATCH_QUERY, 
    params: { id } 
  }).catch(() => ({ data: null }))

  if (!matchResult.data) {
    notFound()
  }

  return <MatchDetailPage match={matchResult.data as any} />
}

