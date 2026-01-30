"use client"

import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { urlFor } from "@/sanity/lib/image"

interface PlayerStats {
  appearances?: { value: number; season: string }
  cleanSheets?: { value: number; season: string }
  saves?: { value: number; season: string }
  goals?: { value: number; season: string }
  assists?: { value: number; season: string }
}

interface Player {
  _id: string
  number: number
  firstName: string
  lastName: string
  position: string
  image: unknown
  stats?: PlayerStats
}

// Fallback data for when Sanity content is not available
const fallbackPlayers: Player[] = [
  {
    _id: "1",
    number: 13,
    firstName: "Tshering",
    lastName: "DORJI",
    position: "Goalkeeper",
    image: null,
    stats: {
      appearances: { value: 22, season: "2025/2026 Season" },
      cleanSheets: { value: 10, season: "2025/2026 Season" },
      saves: { value: 64, season: "2025/2026 Season" },
    },
  },
  {
    _id: "2",
    number: 16,
    firstName: "Karma",
    lastName: "WANGCHUK",
    position: "Midfielder",
    image: null,
    stats: {
      appearances: { value: 18, season: "2025/2026 Season" },
      goals: { value: 5, season: "2025/2026 Season" },
      assists: { value: 3, season: "2025/2026 Season" },
    },
  },
  {
    _id: "3",
    number: 9,
    firstName: "Chencho",
    lastName: "GYELTSHEN",
    position: "Forward",
    image: null,
    stats: {
      appearances: { value: 25, season: "2025/2026 Season" },
      goals: { value: 15, season: "2025/2026 Season" },
      assists: { value: 8, season: "2025/2026 Season" },
    },
  },
]

export function PlayersSection({ players }: { players?: Player[] }) {
  const playerList = players && players.length > 0 ? players : fallbackPlayers
  const [scrollPosition, setScrollPosition] = useState(0)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [cardWidth, setCardWidth] = useState(0)
  const gap = 20

  useEffect(() => {
    const updateCardWidth = () => {
      if (containerRef.current && scrollContainerRef.current) {
        const containerWidth = scrollContainerRef.current.clientWidth
        // Show 1 card on mobile (below 768px), 3 cards on desktop
        const isMobile = window.innerWidth < 768
        const cardsPerView = isMobile ? 1 : 3
        const calculatedWidth = (containerWidth - (gap * (cardsPerView - 1))) / cardsPerView
        setCardWidth(calculatedWidth)
      }
    }

    updateCardWidth()
    window.addEventListener('resize', updateCardWidth)
    return () => window.removeEventListener('resize', updateCardWidth)
  }, [])

  const scrollAmount = cardWidth + gap

  const scrollLeft = () => {
    if (scrollContainerRef.current && cardWidth > 0) {
      const isMobile = window.innerWidth < 768
      const cardsToScroll = isMobile ? 1 : 3
      const scrollBy = scrollAmount * cardsToScroll
      const newPosition = Math.max(0, scrollPosition - scrollBy)
      setScrollPosition(newPosition)
      scrollContainerRef.current.scrollTo({
        left: newPosition,
        behavior: 'smooth'
      })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current && cardWidth > 0) {
      const isMobile = window.innerWidth < 768
      const cardsToScroll = isMobile ? 1 : 3
      const scrollBy = scrollAmount * cardsToScroll
      const maxScroll = scrollContainerRef.current.scrollWidth - scrollContainerRef.current.clientWidth
      const newPosition = Math.min(maxScroll, scrollPosition + scrollBy)
      setScrollPosition(newPosition)
      scrollContainerRef.current.scrollTo({
        left: newPosition,
        behavior: 'smooth'
      })
    }
  }

  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  useEffect(() => {
    const checkScroll = () => {
      if (scrollContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
        setCanScrollLeft(scrollLeft > 0)
        setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
      }
    }
    
    checkScroll()
    const interval = setInterval(checkScroll, 100)
    
    return () => clearInterval(interval)
  }, [scrollPosition])

  return (
    <section className="py-16 px-4 bg-gradient-barca">
      <div className="container mx-auto" ref={containerRef}>
        <div className="mb-8">
          <div className="flex items-center justify-center mb-4">
            <h3 className="text-4xl font-bold uppercase tracking-tight text-white">Players</h3>
          </div>
          <div className="flex items-center justify-end gap-4">
            <button
              onClick={scrollLeft}
              disabled={!canScrollLeft}
              className={`w-12 h-12 rounded-full bg-white/10 hover:bg-barca-red disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center border border-white/20 hover:border-barca-gold ${
                canScrollLeft ? 'opacity-100' : 'opacity-50'
              }`}
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            <button
              onClick={scrollRight}
              disabled={!canScrollRight}
              className={`w-12 h-12 rounded-full bg-white/10 hover:bg-barca-red disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center border border-white/20 hover:border-barca-gold ${
                canScrollRight ? 'opacity-100' : 'opacity-50'
              }`}
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        <div
          ref={scrollContainerRef}
          className="flex gap-5 overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            gap: `${gap}px`,
          } as React.CSSProperties}
          onScroll={(e) => {
            const target = e.target as HTMLDivElement
            setScrollPosition(target.scrollLeft)
          }}
        >
          {playerList.map((player, index) => {
            const playerSlug = (player as any).slug || player._id
            return (
            <Link
              key={player._id}
              href={`/players/${playerSlug}`}
              className="flex-shrink-0 relative snap-start block"
              style={{ 
                width: cardWidth || '100%', 
                minWidth: cardWidth || '100%',
                maxWidth: cardWidth || '100%'
              }}
            >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
                className="relative w-full h-[600px] overflow-hidden bg-gradient-to-br from-barca-blue to-barca-red cursor-pointer"
            >
                {player.image ? (
                <Image
                    src={urlFor(player.image).width(600).height(900).url()}
                  alt={`${player.firstName} ${player.lastName}`}
                  fill
                    className="object-contain object-bottom"
                    priority={index < 3}
                />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-barca-blue to-barca-red flex items-center justify-center">
                    <span className="text-9xl text-white/20">{player.number}</span>
                  </div>
                )}
                <div className="absolute inset-0 opacity-60">
                  {index % 2 === 0 ? (
                    <div className="absolute inset-0 bg-gradient-to-br from-barca-blue via-transparent to-barca-red" />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-bl from-barca-red via-transparent to-barca-blue" />
                  )}
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-8 z-10">
                  <div className="mb-4 text-center">
                    <div className="mb-4">
                      <span className="text-8xl font-light text-white/30">
                        {player.number}
                      </span>
                    </div>
                    <div className="text-white">
                      <span className="text-lg font-normal">{player.firstName} </span>
                      <span className="text-3xl font-bold uppercase">{player.lastName}</span>
                    </div>
                    <p className="text-white/90 text-sm mt-2">{player.position}</p>
                  </div>

                  {player.stats && (
                    <motion.div
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ 
                        type: "spring", 
                        stiffness: 300, 
                        damping: 30,
                        duration: 0.4 
                      }}
                      className="bg-black/60 backdrop-blur-sm rounded-lg p-6 mt-4"
                    >
                      <div className="grid grid-cols-3 gap-4">
                        {Object.entries(player.stats).map(([key, stat]) => {
                          if (!stat) return null
                          return (
                          <div key={key} className="text-center">
                            <div className="text-xs text-white/80 uppercase font-semibold mb-2">
                              {key === 'appearances' && 'APPEARANCES'}
                              {key === 'cleanSheets' && 'CLEAN SHEETS'}
                              {key === 'saves' && 'SAVES'}
                              {key === 'goals' && 'GOALS'}
                              {key === 'assists' && 'ASSISTS'}
                            </div>
                            <div className="text-3xl font-bold text-white mb-1">
                              {stat.value}
                            </div>
                            <div className="text-xs text-white/60 mb-1">
                              {stat.season}
                            </div>
                            <div className="text-sm font-bold text-barca-gold">
                              {stat.value}
                            </div>
                          </div>
                          )
                        })}
                      </div>
                    </motion.div>
                  )}
              </div>
            </motion.div>
            </Link>
            )
          })}
        </div>

        <div className="flex justify-center gap-2 mt-8">
          {playerList.map((_, index) => (
            <div
              key={index}
              className={`h-1 w-8 rounded-full transition-colors ${
                index === 0 ? 'bg-barca-gold' : 'bg-white/30'
              }`}
            />
          ))}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `
      }} />
    </section>
  )
}
