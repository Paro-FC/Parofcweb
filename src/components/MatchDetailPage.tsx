"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { urlFor } from "@/sanity/lib/image"
import { Countdown } from "./ui/countdown"
import { TicketBookingForm } from "./TicketBookingForm"

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
  ticketAvailability?: number
  ticketPrice?: number
}

interface MatchDetailPageProps {
  match: Match
}

function formatMatchDate(dateString: string) {
  const date = new Date(dateString)
  const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
  
  return {
    day: days[date.getDay()],
    date: date.getDate(),
    month: months[date.getMonth()],
    time: date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    }),
  }
}

export function MatchDetailPage({ match }: MatchDetailPageProps) {
  const [timeRemaining, setTimeRemaining] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const matchDateString = match.date
  const formatted = formatMatchDate(match.date)

  useEffect(() => {
    const matchDate = new Date(matchDateString)
    
    const updateCountdown = () => {
      const now = new Date()
      const diff = matchDate.getTime() - now.getTime()

      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24))
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((diff % (1000 * 60)) / 1000)

        setTimeRemaining({ days, hours, minutes, seconds })
      } else {
        setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)

    return () => clearInterval(interval)
  }, [matchDateString])

  // Determine competition color
  const getCompetitionColor = (competition: string) => {
    if (competition?.toLowerCase().includes('liga')) {
      return 'text-[#FF006E]' // Pinkish-red for La Liga
    }
    return 'text-barca-gold'
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background with blurred crowd image */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1920&h=1080&fit=crop"
          alt="Crowd background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Top Navigation */}
        <div className="flex items-center gap-4 p-6">
          <Link
            href="/"
            className="flex items-center gap-3 text-white hover:text-barca-gold transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
            <div className="relative w-10 h-10">
              <Image
                src="/assets/logo.webp"
                alt="Paro FC Logo"
                fill
                className="object-contain"
              />
            </div>
            <span className="text-lg font-semibold">PARO FC</span>
          </Link>
        </div>

        {/* Main Content - Two Column Layout */}
        <div className="flex-1 flex items-start justify-center px-4 py-12">
          <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left Column - Match Information */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-center"
            >
              {/* League Name */}
              <h1 className={`text-4xl md:text-5xl font-bold mb-2 ${getCompetitionColor(match.competition)}`}>
                {match.competition?.toUpperCase() || 'MATCH'}
              </h1>

              {/* Date */}
              <p className="text-3xl md:text-4xl font-bold text-barca-gold mb-8">
                {formatted.day} {formatted.date} {formatted.month}
              </p>

              {/* Match Countdown */}
              <div className="mb-12">
                <p className="text-white text-lg mb-4">Match countdown</p>
                <div className="flex items-center justify-center gap-4 md:gap-8">
                  <div className="flex flex-col items-center">
                    <span className="text-5xl md:text-7xl font-bold text-white">
                      {String(timeRemaining.days).padStart(2, '0')}
                    </span>
                    <span className="text-white text-sm mt-2">DAYS</span>
                  </div>
                  <span className="text-5xl md:text-7xl font-bold text-white">:</span>
                  <div className="flex flex-col items-center">
                    <span className="text-5xl md:text-7xl font-bold text-white">
                      {String(timeRemaining.hours).padStart(2, '0')}
                    </span>
                    <span className="text-white text-sm mt-2">HOURS</span>
                  </div>
                  <span className="text-5xl md:text-7xl font-bold text-white">:</span>
                  <div className="flex flex-col items-center">
                    <span className="text-5xl md:text-7xl font-bold text-white">
                      {String(timeRemaining.minutes).padStart(2, '0')}
                    </span>
                    <span className="text-white text-sm mt-2">MINS</span>
                  </div>
                  <span className="text-5xl md:text-7xl font-bold text-white">:</span>
                  <div className="flex flex-col items-center">
                    <span className="text-5xl md:text-7xl font-bold text-white">
                      {String(timeRemaining.seconds).padStart(2, '0')}
                    </span>
                    <span className="text-white text-sm mt-2">SECS</span>
                  </div>
                </div>
              </div>

              {/* Kickoff Time */}
              {/* <div className="mb-12">
                <p className="text-white text-lg mb-2">Kickoff CET</p>
                <p className="text-6xl md:text-8xl font-bold text-white">
                  {formatted.time}
                </p>
              </div> */}

              {/* Teams */}
              <div className="flex items-center justify-center gap-8 md:gap-16 mb-12">
                {/* Home Team */}
                <div className="flex flex-col items-center">
                  <div className="relative w-24 h-24 md:w-32 md:h-32 mb-4">
                    {match.homeCrest ? (
                      <Image
                        src={urlFor(match.homeCrest).width(128).height(128).url()}
                        alt={match.homeTeam}
                        fill
                        className="object-contain"
                      />
                    ) : (
                      <div className="w-full h-full bg-white/20 rounded-full flex items-center justify-center text-4xl">
                        ⚽
                      </div>
                    )}
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white uppercase">
                    {match.homeTeam}
                  </h2>
                </div>

                {/* VS / Time */}
                <div className="flex flex-col items-center">
                  <p className="text-4xl md:text-6xl font-bold text-white mb-2">
                    {formatted.time}
                  </p>
                  <p className="text-white/80 text-sm">CET</p>
                </div>

                {/* Away Team */}
                <div className="flex flex-col items-center">
                  <div className="relative w-24 h-24 md:w-32 md:h-32 mb-4">
                    {match.awayCrest ? (
                      <Image
                        src={urlFor(match.awayCrest).width(128).height(128).url()}
                        alt={match.awayTeam}
                        fill
                        className="object-contain"
                      />
                    ) : (
                      <div className="w-full h-full bg-white/20 rounded-full flex items-center justify-center text-4xl">
                        ⚽
                      </div>
                    )}
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white uppercase">
                    {match.awayTeam}
                  </h2>
                </div>
              </div>
            </motion.div>

            {/* Right Column - Ticket Booking Form */}
            {match.hasTickets && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-start justify-center"
              >
                <div className="w-full max-w-md">
                  <TicketBookingForm
                    matchId={match._id}
                    matchTitle={`${match.homeTeam} vs ${match.awayTeam}`}
                    availability={match.ticketAvailability ?? 0}
                  />
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

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

