import Link from "next/link"

interface LatestMatch {
  _id: string
  homeTeam: string
  awayTeam: string
  competition?: string
  date: string
  venue?: string
  event?: string
}

interface TopNavProps {
  latestMatch?: LatestMatch | null
}

function formatMatchTitle(match: LatestMatch | null): string {
  if (!match) {
    return "New matches at Spotify Camp Nou!"
  }
  
  const venue = match.venue || "Spotify Camp Nou"
  return `${match.homeTeam} vs ${match.awayTeam} at ${venue}!`
}

export function TopNav({ latestMatch = null }: TopNavProps) {
  const matchTitle = formatMatchTitle(latestMatch)
  const matchLink = latestMatch ? `/matches/${latestMatch._id}` : "#"

  return (
    <>
      {/* Top Banner - Mobile Style */}
      <nav className="bg-dark-charcoal rounded-lg mx-4 mt-2 mb-2 py-3 px-4 md:hidden">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-barca-gold"></div>
            <div className="w-3 h-3 rounded-full bg-barca-red"></div>
          </div>
          <Link href={matchLink} className="flex-1 text-sm text-light-gold font-semibold hover:text-barca-gold transition-colors">
            {matchTitle}{" "}
            <span className="text-barca-gold font-bold text-base">BUY TICKETS</span>
          </Link>
        </div>
      </nav>

      {/* Desktop Top Nav */}
      <nav className="hidden md:block bg-light-gold border-b border-medium-grey py-2">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href={matchLink} className="text-sm text-dark-charcoal hover:text-barca-gold transition-colors">
          🔵🔴 {matchTitle}{" "}
          <span className="text-barca-gold font-bold">BUY TICKETS</span>
        </Link>
        <div className="flex items-center gap-4">
          {/* <Button variant="ghost" size="sm">Login</Button> */}
          {/* <Button variant="default" size="sm">View Plans</Button> */}
          {/* <span className="text-sm text-dark-charcoal cursor-pointer hover:text-barca-gold transition-colors">EN</span> */}
          {/* <Button 
            variant="ghost" 
            size="icon"
            onClick={openMenu}
            aria-label="Menu"
          >
            <Menu className="h-5 w-5" />
          </Button> */}
        </div>
      </div>
    </nav>
    </>
  )
}

