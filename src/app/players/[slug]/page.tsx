import { notFound } from "next/navigation"
import { sanityFetch } from "@/sanity/lib/live"
import { PLAYER_QUERY, RELATED_PLAYERS_QUERY } from "@/sanity/lib/queries"
import { PlayerPage } from "@/components/PlayerPage"

interface Props {
  params: Promise<{ slug: string }>
}

export default async function IndividualPlayerPage({ params }: Props) {
  const { slug } = await params
  
  const playerResult = await sanityFetch({ query: PLAYER_QUERY, params: { slug } }).catch(() => ({ data: null }))

  if (!playerResult.data) {
    notFound()
  }

  // Fetch related players with the same position
  const relatedPlayersResult = await sanityFetch({ 
    query: RELATED_PLAYERS_QUERY, 
    params: { slug, position: (playerResult.data as any).position } 
  }).catch(() => ({ data: [] }))

  return (
    <PlayerPage 
      player={playerResult.data as any} 
      relatedPlayers={(relatedPlayersResult.data as any) || []} 
    />
  )
}

