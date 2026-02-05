import { Hero } from "@/components/Hero"
import { TicketsSection } from "@/components/TicketsSection"
import { CalendarSection } from "@/components/CalendarSection"
import { BarcaStoriesSection } from "@/components/BarcaStoriesSection"
import { NewsSection } from "@/components/NewsSection"
import { PlayersSection } from "@/components/PlayersSection"
// import { StoreSection } from "@/components/StoreSection"
import { TrophiesSection } from "@/components/TrophiesSection"
import { PartnersSection } from "@/components/PartnersSection"
import { Card } from "@/components/ui/card"
import { sanityFetch } from "@/sanity/lib/live"
import { NEWS_QUERY, PLAYERS_QUERY, MATCHES_QUERY, STORIES_QUERY, MAIN_PARTNERS_QUERY, TROPHIES_QUERY } from "@/sanity/lib/queries"

export default async function Home() {
  // Fetch all content from Sanity in parallel
  const [newsResult, playersResult, matchesResult, storiesResult, mainPartnersResult, trophiesResult] = await Promise.all([
    sanityFetch({ query: NEWS_QUERY }).catch(() => ({ data: [] })),
    sanityFetch({ query: PLAYERS_QUERY }).catch(() => ({ data: [] })),
    sanityFetch({ query: MATCHES_QUERY }).catch(() => ({ data: [] })),
    sanityFetch({ query: STORIES_QUERY }).catch(() => ({ data: [] })),
    sanityFetch({ query: MAIN_PARTNERS_QUERY }).catch(() => ({ data: [] })),
    sanityFetch({ query: TROPHIES_QUERY }).catch(() => ({ data: [] })),
  ])

  return (
    <div className="min-h-screen bg-gradient-barca">
      <Hero news={newsResult.data as any} />
      <Card className="bg-white rounded-t-3xl border-0 shadow-none mx-2 md:mx-4">
        <TicketsSection />
        <hr className="border-gray-200" />
        <CalendarSection matches={matchesResult.data as any} />
        <hr className="border-gray-200" />
        <BarcaStoriesSection stories={storiesResult.data as any} />
        {/* <hr className="border-gray-200" />
        <StoreSection /> */}
        <hr className="border-gray-200" />
        <NewsSection news={newsResult.data as any} />
      </Card>
      <PlayersSection players={playersResult.data as any} />
      
      <TrophiesSection trophies={trophiesResult.data as any} />
      
      {/* Main Partners Section - Homepage Only */}
      <PartnersSection partners={mainPartnersResult.data as any} title="Main Partners" />
    </div>
  )
}
