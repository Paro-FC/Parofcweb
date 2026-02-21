"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, RefreshCw, ExternalLink, ArrowRight } from "lucide-react";
import { Countdown } from "./ui/countdown";
import { Button } from "./ui/button";
import Image from "next/image";
import Link from "next/link";
import { CalendarSyncModal } from "./CalendarSyncModal";

interface Match {
  _id: string;
  homeTeam: string;
  awayTeam: string;
  homeCrest?: string | null;
  awayCrest?: string | null;
  competition: string;
  competitionLogo?: string | null;
  date: string;
  event: string;
  venue: string;
  hasTickets: boolean;
}

// Fallback data for when Sanity content is not available
const fallbackMatches: Match[] = [
  {
    _id: "1",
    homeTeam: "Paro FC",
    awayTeam: "Thimphu City FC",
    homeCrest: "🏔️",
    awayCrest: "🏙️",
    competition: "Liga Premier",
    competitionLogo: "🏆",
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    event: "Liga Premier, Matchday 8",
    venue: "Changlimithang Stadium",
    hasTickets: true,
  },
  {
    _id: "2",
    homeTeam: "Druk United",
    awayTeam: "Paro FC",
    homeCrest: "🐉",
    awayCrest: "🏔️",
    competition: "Liga Premier",
    competitionLogo: "🏆",
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    event: "Liga Premier, Matchday 9",
    venue: "Changlimithang Stadium",
    hasTickets: false,
  },
  {
    _id: "3",
    homeTeam: "Paro FC",
    awayTeam: "Gelephu FC",
    homeCrest: "🏔️",
    awayCrest: "⚽",
    competition: "Copa Nacional",
    competitionLogo: "🏆",
    date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    event: "Copa Nacional, Quarter Final",
    venue: "Paro Stadium",
    hasTickets: false,
  },
];

function formatMatchDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function CalendarSection({ matches }: { matches?: Match[] }) {
  const matchList = matches && matches.length > 0 ? matches : fallbackMatches;
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);

  // Get the first match date for countdown
  const targetDate = matchList[0] ? new Date(matchList[0].date) : new Date();

  // Calculate how many "coming soon" cards to add
  // Always show 3 items total: if 1 match, add 2 coming soon; if 2 matches, add 1 coming soon
  const matchCount = matchList.length;
  const comingSoonCount = matchCount < 3 ? 3 - matchCount : 0;

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-6">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <h3 className="text-4xl md:text-5xl font-bold text-gray-900 uppercase tracking-tight">
                Calendar
              </h3>

              <p className="text-sm text-gray-600 uppercase font-semibold italic">
                Next Match
              </p>

              <div className="flex items-center gap-2">
                <Countdown targetDate={targetDate} />
              </div>
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

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
              {matchList.map((match, index) => (
                <motion.div
                  key={match._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-barca-red rounded-2xl p-6 text-white flex flex-col h-full"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex flex-col items-center gap-2">
                      {match.homeCrest && match.homeCrest.startsWith("http") ? (
                        <div className="relative w-16 h-16">
                          <Image
                            src={match.homeCrest}
                            alt={match.homeTeam}
                            fill
                            className="object-contain"
                          />
                        </div>
                      ) : (
                        <div className="text-4xl">
                          {match.homeCrest || "🏔️"}
                        </div>
                      )}
                      <span className="text-sm font-semibold text-center">
                        {match.homeTeam}
                      </span>
                    </div>

                    <div className="flex flex-col items-center gap-2 px-4">
                      {match.competitionLogo &&
                      match.competitionLogo.startsWith("http") ? (
                        <div className="relative w-12 h-12">
                          <Image
                            src={match.competitionLogo}
                            alt={match.competition}
                            fill
                            className="object-contain"
                          />
                        </div>
                      ) : (
                        <div className="text-2xl font-bold">
                          {match.competitionLogo || "🏆"}
                        </div>
                      )}
                      <span className="text-xs text-center text-white/80 uppercase">
                        {match.competition}
                      </span>
                    </div>

                    <div className="flex flex-col items-center gap-2">
                      {match.awayCrest && match.awayCrest.startsWith("http") ? (
                        <div className="relative w-16 h-16">
                          <Image
                            src={match.awayCrest}
                            alt={match.awayTeam}
                            fill
                            className="object-contain"
                          />
                        </div>
                      ) : (
                        <div className="text-4xl">
                          {match.awayCrest || "⚽"}
                        </div>
                      )}
                      <span className="text-sm font-semibold text-center">
                        {match.awayTeam}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 mb-6 flex-1">
                    <p className="font-bold text-sm">
                      {formatMatchDate(match.date)}
                    </p>
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
                        TICKETS
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              ))}

              {/* Coming Soon Cards */}
              {Array.from({ length: comingSoonCount }).map((_, index) => (
                <motion.div
                  key={`coming-soon-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (matchCount + index) * 0.1 }}
                  className="bg-gradient-barca rounded-2xl p-6 text-white flex flex-col h-full opacity-60"
                >
                  <div className="flex items-center justify-center mb-6">
                    <div className="flex flex-col items-center gap-2">
                      <div className="text-6xl">⏳</div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-6 flex-1 flex flex-col items-center justify-center">
                    <p className="font-bold text-lg text-center">Coming Soon</p>
                    <p className="text-xs text-white/80 text-center">
                      Match details will be announced soon
                    </p>
                  </div>

                  <div className="mt-auto pt-4">
                    <Button
                      variant="outline"
                      className="w-full border-white/30 bg-white/10 text-white/50 cursor-not-allowed"
                      disabled
                    >
                      <span className="mr-2">⏳</span>
                      COMING SOON
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:w-80 flex-shrink-0"
            >
              <div className="relative rounded-2xl overflow-hidden h-full min-h-[400px]">
                <Image
                  src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=300&fit=crop"
                  alt="Next Games"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="relative z-10 h-full flex flex-col">
                  <h4 className="text-3xl font-bold text-white uppercase p-6 pb-4">
                    Next Games
                  </h4>
                  <div className="flex-1 flex items-end p-4">
                    <Link
                      href="/calendar"
                      className="flex items-center gap-2 text-white hover:text-barca-gold transition-colors text-sm font-semibold"
                    >
                      See The Calendar
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Calendar Sync Modal */}
      <CalendarSyncModal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
        matches={matchList}
      />
    </section>
  );
}
