"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, RefreshCw, ArrowRight } from "lucide-react";
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

function formatMatchDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  });
}

const COMING_SOON_CARD_COUNT = 3;

export function CalendarSection({ matches }: { matches?: Match[] }) {
  const matchList = matches ?? [];
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);

  const targetDate = matchList[0] ? new Date(matchList[0].date) : null;

  const matchCount = matchList.length;
  const comingSoonCount =
    matchCount < COMING_SOON_CARD_COUNT
      ? COMING_SOON_CARD_COUNT - matchCount
      : 0;

  return (
    <section className="py-12 md:py-20 px-4">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10 gap-4">
            <div>
              <h3 className="text-4xl md:text-5xl font-black text-dark-charcoal uppercase tracking-tight leading-none">
                Matches
              </h3>
              {targetDate && (
                <div className="flex items-center gap-3 mt-3">
                  <span className="text-xs font-bold text-barca-red uppercase tracking-widest">
                    Next match in
                  </span>
                  <Countdown targetDate={targetDate} />
                </div>
              )}
            </div>

            <Button
              variant="outline"
              className="border-dark-charcoal/20 text-dark-charcoal hover:bg-dark-charcoal hover:text-white transition-all duration-200 cursor-pointer"
              onClick={() => setIsSyncModalOpen(true)}
            >
              <Calendar className="w-4 h-4 mr-2" />
              Sync Calendar
              <RefreshCw className="w-3.5 h-3.5 ml-2" />
            </Button>
          </div>

          {/* Match Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {matchList.map((match, index) => (
              <motion.div
                key={match._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative bg-dark-charcoal rounded-2xl overflow-hidden"
              >
                {/* Top accent bar */}
                <div className="h-1 bg-gradient-to-r from-barca-red via-barca-gold to-bronze" />

                <div className="p-6">
                  {/* Competition */}
                  <div className="flex items-center gap-2 mb-6">
                    {match.competitionLogo &&
                    match.competitionLogo.startsWith("http") ? (
                      <div className="relative w-5 h-5">
                        <Image
                          src={match.competitionLogo}
                          alt={match.competition}
                          fill
                          className="object-contain"
                        />
                      </div>
                    ) : null}
                    <span className="text-[11px] text-white/50 uppercase tracking-widest font-semibold">
                      {match.competition}
                    </span>
                  </div>

                  {/* Teams */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex flex-col items-center gap-3 flex-1">
                      {match.homeCrest &&
                      match.homeCrest.startsWith("http") ? (
                        <div className="relative w-16 h-16">
                          <Image
                            src={match.homeCrest}
                            alt={match.homeTeam}
                            fill
                            className="object-contain"
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
                          <span className="text-2xl font-black text-white/40">
                            {match.homeTeam.charAt(0)}
                          </span>
                        </div>
                      )}
                      <span className="text-xs font-bold text-white text-center uppercase tracking-wide">
                        {match.homeTeam}
                      </span>
                    </div>

                    <div className="px-4">
                      <span className="text-2xl font-black text-white/20">
                        VS
                      </span>
                    </div>

                    <div className="flex flex-col items-center gap-3 flex-1">
                      {match.awayCrest &&
                      match.awayCrest.startsWith("http") ? (
                        <div className="relative w-16 h-16">
                          <Image
                            src={match.awayCrest}
                            alt={match.awayTeam}
                            fill
                            className="object-contain"
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
                          <span className="text-2xl font-black text-white/40">
                            {match.awayTeam.charAt(0)}
                          </span>
                        </div>
                      )}
                      <span className="text-xs font-bold text-white text-center uppercase tracking-wide">
                        {match.awayTeam}
                      </span>
                    </div>
                  </div>

                  {/* Match info */}
                  <div className="border-t border-white/10 pt-4 mb-4">
                    <p className="text-sm font-bold text-white">
                      {formatMatchDate(match.date)}
                    </p>
                    <p className="text-xs text-white/40 mt-1">{match.venue}</p>
                  </div>

                  {/* CTA */}
                  <Link href={`/matches/${match._id}`}>
                    <Button
                      variant="outline"
                      className="w-full border-barca-gold/30 bg-barca-gold/5 hover:bg-barca-gold hover:text-dark-charcoal text-barca-gold transition-all duration-200 cursor-pointer font-bold text-xs uppercase tracking-wider"
                    >
                      Get Tickets
                      <ArrowRight className="w-3.5 h-3.5 ml-2" />
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
                className="relative bg-dark-charcoal/50 rounded-2xl overflow-hidden border border-dashed border-white/10"
              >
                <div className="p-6 flex flex-col items-center justify-center min-h-[320px]">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                    <Calendar className="w-6 h-6 text-white/20" />
                  </div>
                  <p className="font-bold text-sm text-white/30 uppercase tracking-wider">
                    Coming Soon
                  </p>
                  <p className="text-xs text-white/15 mt-1">
                    Match details TBA
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* See full calendar link */}
          <div className="flex justify-center mt-8">
            <Link
              href="/calendar"
              className="inline-flex items-center gap-2 text-sm font-bold text-dark-charcoal hover:text-barca-red transition-colors duration-200 uppercase tracking-wider cursor-pointer"
            >
              See Full Calendar
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </div>

      <CalendarSyncModal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
        matches={matchList}
      />
    </section>
  );
}
