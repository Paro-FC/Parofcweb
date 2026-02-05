"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { urlFor } from "@/sanity/lib/image"
import { CalendarSyncModal } from "./CalendarSyncModal"
import { useState } from "react"
import { Calendar, RefreshCw, X, ArrowRight } from "lucide-react"
import { Button } from "./ui/button"

interface Match {
  _id: string
  homeTeam: string
  awayTeam: string
  homeCrest?: unknown
  awayCrest?: unknown
  competition: string
  competitionLogo?: unknown
  date: string
  event: string
  venue: string
  hasTickets: boolean
}

interface CalendarPageProps {
  matches: Match[]
}

function formatMatchDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function groupMatchesByMonth(matches: Match[]) {
  const grouped: { [key: string]: Match[] } = {}
  
  matches.forEach((match) => {
    const date = new Date(match.date)
    const monthKey = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
    
    if (!grouped[monthKey]) {
      grouped[monthKey] = []
    }
    grouped[monthKey].push(match)
  })
  
  return grouped
}

export function CalendarPage({ matches }: CalendarPageProps) {
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false)
  const groupedMatches = groupMatchesByMonth(matches)

  return (
    <div className="min-h-screen bg-white">
      <section className="py-16 px-4">
        <div className="container mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12 gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 uppercase tracking-tight mb-2">
                Match Calendar
              </h1>
              <p className="text-gray-600">
                All upcoming matches and fixtures
              </p>
            </div>

            <Button
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-barca-gold hover:text-barca-gold"
              onClick={() => setIsSyncModalOpen(true)}
            >
              <Calendar className="w-4 h-4 mr-2" />
              Sync Calendar
              <RefreshCw className="w-4 h-4 ml-2" />
            </Button>
          </div>

          {/* Matches by Month */}
          {matches.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">No matches scheduled</p>
            </div>
          ) : (
            <div className="space-y-12">
              {Object.entries(groupedMatches).map(([month, monthMatches], monthIndex) => (
                <motion.div
                  key={month}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: monthIndex * 0.1 }}
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">{month}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {monthMatches.map((match, index) => (
                      <motion.div
                        key={match._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: (monthIndex * 0.1) + (index * 0.05) }}
                        className="bg-gradient-barca rounded-2xl p-6 text-white flex flex-col h-full"
                      >
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex flex-col items-center gap-2 flex-1">
                            {match.homeCrest ? (
                              <div className="relative w-16 h-16">
                                <Image
                                  src={urlFor(match.homeCrest).width(128).height(128).url()}
                                  alt={match.homeTeam}
                                  fill
                                  className="object-contain"
                                />
                              </div>
                            ) : (
                              <div className="text-4xl">🏔️</div>
                            )}
                            <span className="text-sm font-semibold text-center">{match.homeTeam}</span>
                          </div>
                          
                          <div className="flex flex-col items-center gap-2 px-4">
                            {match.competitionLogo ? (
                              <div className="relative w-12 h-12">
                                <Image
                                  src={urlFor(match.competitionLogo).width(96).height(96).url()}
                                  alt={match.competition}
                                  fill
                                  className="object-contain"
                                />
                              </div>
                            ) : (
                              <div className="text-2xl font-bold">🏆</div>
                            )}
                            <span className="text-xs text-center text-white/80 uppercase">
                              {match.competition}
                            </span>
                          </div>
                          
                          <div className="flex flex-col items-center gap-2 flex-1">
                            {match.awayCrest ? (
                              <div className="relative w-16 h-16">
                                <Image
                                  src={urlFor(match.awayCrest).width(128).height(128).url()}
                                  alt={match.awayTeam}
                                  fill
                                  className="object-contain"
                                />
                              </div>
                            ) : (
                              <div className="text-4xl">⚽</div>
                            )}
                            <span className="text-sm font-semibold text-center">{match.awayTeam}</span>
                          </div>
                        </div>

                        <div className="space-y-2 mb-6 flex-1">
                          <p className="font-bold text-sm">{formatMatchDate(match.date)}</p>
                          <p className="text-xs text-white/80">{match.event}</p>
                          <p className="text-xs text-white/80">{match.venue}</p>
                        </div>

                        <div className="mt-auto pt-4">
                          <Link href={`/matches/${match._id}`}>
                            <Button
                              variant="outline"
                              className="w-full border-white/30 bg-white/10 hover:bg-white/20 text-white hover:text-barca-gold hover:border-barca-gold transition-all"
                            >
                              <span className="mr-2">⚽</span>
                              Match Centre
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                          </Link>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Calendar Sync Modal */}
      <CalendarSyncModal 
        isOpen={isSyncModalOpen} 
        onClose={() => setIsSyncModalOpen(false)}
        matches={matches}
      />

      {/* Floating Close Button */}
      <Link
        href="/"
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-14 h-14 bg-gray-900 hover:bg-gray-800 text-white rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110"
      >
        <X size={24} />
      </Link>
    </div>
  )
}

