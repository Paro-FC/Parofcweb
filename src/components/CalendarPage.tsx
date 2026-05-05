'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { urlFor } from '@/sanity/lib/image';
import { useMemo, useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Calendar03Icon,
  ArrowRight01Icon,
  MapPinIcon,
  Clock01Icon,
} from '@hugeicons/core-free-icons';

type TeamFilter = 'men' | 'women';

interface Match {
  _id: string;
  homeTeam: string;
  awayTeam: string;
  homeCrest?: unknown;
  awayCrest?: unknown;
  competition: string;
  competitionTeam?: TeamFilter;
  date: string;
  event: string;
  venue: string;
  matchUrl?: string;
  showMatchLink?: boolean;
  status?: 'upcoming' | 'live' | 'ht' | 'ft' | 'postponed';
  homeScore?: number | null;
  awayScore?: number | null;
}

interface CalendarPageProps {
  matches: Match[];
}

function formatMatchDay(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
}

function formatMatchDayNum(dateString: string) {
  const date = new Date(dateString);
  return date.getDate().toString().padStart(2, '0');
}

function formatMatchTime(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Asia/Thimphu',
  });
}

function formatMatchMonth(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
}

function groupMatchesByMonth(matches: Match[]) {
  const grouped: { [key: string]: Match[] } = {};
  matches.forEach((match) => {
    const date = new Date(match.date);
    const monthKey = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
    });
    if (!grouped[monthKey]) grouped[monthKey] = [];
    grouped[monthKey].push(match);
  });
  return grouped;
}

function getImageUrl(image: unknown): string | null {
  if (!image) return null;
  if (typeof image === 'string') return image;
  try {
    return urlFor(image).width(128).height(128).url();
  } catch {
    return null;
  }
}

function MatchRows({
  groupedMatches,
  showScores = false,
}: {
  groupedMatches: { [key: string]: Match[] };
  showScores?: boolean;
}) {
  return (
    <div className="space-y-10">
      {Object.entries(groupedMatches).map(
        ([month, monthMatches], monthIndex) => (
          <motion.div
            key={month}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: monthIndex * 0.05 }}
          >
            {/* Month header */}
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
              {month}
            </h2>

            {/* Match rows */}
            <div className="space-y-2">
              {monthMatches.map((match, index) => {
                const homeUrl = getImageUrl(match.homeCrest);
                const awayUrl = getImageUrl(match.awayCrest);
                return (
                  <motion.div
                    key={match._id}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.03 }}
                  >
                    <div className="flex items-stretch border border-gray-100 hover:border-gray-200 transition-colors duration-200">
                      <Link
                        href={`/matches/${match._id}`}
                        className="group flex min-w-0 flex-1 cursor-pointer"
                      >
                        <div className="flex min-w-0 flex-1 items-stretch">
                          {/* Date block */}
                          <div className="w-16 md:w-20 flex-shrink-0 bg-dark-charcoal flex flex-col items-center justify-center py-4">
                            <span className="text-3xs font-bold text-white/40 uppercase tracking-wider">
                              {formatMatchDay(match.date)}
                            </span>
                            <span className="text-2xl md:text-3xl font-black text-white leading-none tabular-nums">
                              {formatMatchDayNum(match.date)}
                            </span>
                            <span className="text-3xs font-bold text-parofc-gold uppercase tracking-wider">
                              {formatMatchMonth(match.date)}
                            </span>
                          </div>

                          {/* Match content */}
                          <div className="flex-1 flex items-center px-4 md:px-6 py-4 gap-4 md:gap-6 min-w-0">
                            {/* Teams */}
                            <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
                              {/* Home */}
                              <div className="flex items-center gap-2 flex-1 min-w-0">
                                {homeUrl ? (
                                  <div className="relative w-7 h-7 md:w-8 md:h-8 flex-shrink-0">
                                    <Image
                                      src={homeUrl}
                                      alt={match.homeTeam}
                                      fill
                                      className="object-contain"
                                    />
                                  </div>
                                ) : (
                                  <div className="w-7 h-7 md:w-8 md:h-8 bg-gray-100 flex items-center justify-center flex-shrink-0">
                                    <span className="text-2xs font-black text-gray-400">
                                      {match.homeTeam.charAt(0)}
                                    </span>
                                  </div>
                                )}
                                <span className="text-xs md:text-sm font-bold text-dark-charcoal truncate">
                                  {match.homeTeam}
                                </span>
                              </div>

                              {/* Score / VS */}
                              {showScores ? (
                                <span className="flex items-center gap-2 md:gap-3 text-xl md:text-2xl font-black text-dark-charcoal flex-shrink-0 tabular-nums">
                                  <span>{match.homeScore ?? 0}</span>
                                  <span className="text-gray-300">-</span>
                                  <span>{match.awayScore ?? 0}</span>
                                </span>
                              ) : (
                                <span className="text-2xs font-black text-gray-300 flex-shrink-0">
                                  VS
                                </span>
                              )}

                              {/* Away */}
                              <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
                                <span className="text-xs md:text-sm font-bold text-dark-charcoal truncate text-right">
                                  {match.awayTeam}
                                </span>
                                {awayUrl ? (
                                  <div className="relative w-7 h-7 md:w-8 md:h-8 flex-shrink-0">
                                    <Image
                                      src={awayUrl}
                                      alt={match.awayTeam}
                                      fill
                                      className="object-contain"
                                    />
                                  </div>
                                ) : (
                                  <div className="w-7 h-7 md:w-8 md:h-8 bg-gray-100 flex items-center justify-center flex-shrink-0">
                                    <span className="text-2xs font-black text-gray-400">
                                      {match.awayTeam.charAt(0)}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Divider */}
                            <div className="w-px h-8 bg-gray-100 hidden md:block flex-shrink-0" />

                            {/* Meta */}
                            <div className="hidden md:flex flex-col gap-1 flex-shrink-0 w-40">
                              <div className="flex items-center gap-1.5">
                                <span className="text-2xs font-bold text-gray-400 uppercase tracking-wider truncate">
                                  {match.competition}
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <HugeiconsIcon
                                  icon={Clock01Icon}
                                  size={10}
                                  className="text-gray-300 flex-shrink-0"
                                />
                                <span className="text-2xs text-gray-400">
                                  {formatMatchTime(match.date)}
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <HugeiconsIcon
                                  icon={MapPinIcon}
                                  size={10}
                                  className="text-gray-300 flex-shrink-0"
                                />
                                <span className="text-2xs text-gray-400 truncate">
                                  {match.venue}
                                </span>
                              </div>
                            </div>

                            {/* Arrow */}
                            <HugeiconsIcon
                              icon={ArrowRight01Icon}
                              size={14}
                              className="text-gray-200 group-hover:text-dark-charcoal transition-colors flex-shrink-0"
                            />
                          </div>
                        </div>
                      </Link>
                    </div>

                    {/* Mobile meta */}
                    <Link
                      href={`/matches/${match._id}`}
                      className="block border-x border-b border-gray-100 hover:border-gray-200 -mt-px md:hidden"
                    >
                      <div className="flex items-center gap-3 px-4 pb-3 pt-2 md:hidden">
                        <span className="text-2xs font-bold text-gray-400 uppercase tracking-wider">
                          {match.competition}
                        </span>
                        <span className="text-gray-200">·</span>
                        <span className="text-2xs text-gray-400">
                          {formatMatchTime(match.date)}
                        </span>
                        <span className="text-gray-200">·</span>
                        <span className="text-2xs text-gray-400 truncate">
                          {match.venue}
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        ),
      )}
    </div>
  );
}

export function CalendarPage({ matches }: CalendarPageProps) {
  const [selectedTeam, setSelectedTeam] = useState<TeamFilter>('men');

  const filteredMatches = useMemo(
    () =>
      matches.filter((m) => (m.competitionTeam ?? 'men') === selectedTeam),
    [matches, selectedTeam],
  );

  const { upcomingByMonth, finishedByMonth } = useMemo(() => {
    const now = Date.now();
    const upcoming: Match[] = [];
    const finished: Match[] = [];
    filteredMatches.forEach((m) => {
      if (new Date(m.date).getTime() >= now) upcoming.push(m);
      else finished.push(m);
    });
    // finished list: most recent first
    finished.reverse();
    return {
      upcomingByMonth: groupMatchesByMonth(upcoming),
      finishedByMonth: groupMatchesByMonth(finished),
    };
  }, [filteredMatches]);

  const hasUpcoming = Object.keys(upcomingByMonth).length > 0;
  const hasFinished = Object.keys(finishedByMonth).length > 0;
  const tabs: { id: TeamFilter; label: string; short: string }[] = [
    { id: 'men', label: "Men's", short: "Men's" },
    { id: 'women', label: "Women's", short: "Women's" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Header */}
      <div className="relative bg-dark-charcoal overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, transparent, transparent 20px, white 20px, white 21px)',
          }}
        />

        <div className="container mx-auto px-4 py-12 md:py-16 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-xs font-bold text-parofc-gold uppercase tracking-[0.2em] mb-3">
                Paro FC
              </p>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white uppercase tracking-tight leading-none">
                Fixtures <span className="text-parofc-gold">&amp; Results</span>
              </h1>
            </motion.div>

          </div>
        </div>

        <div className="h-1 bg-gradient-to-r from-parofc-red via-parofc-gold to-bronze" />
      </div>

      {/* Team Tabs */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-0 overflow-x-auto -mb-px">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTeam(t.id)}
                className={`relative px-5 md:px-6 py-4 text-sm font-bold whitespace-nowrap transition-colors duration-200 uppercase tracking-wider cursor-pointer ${
                  selectedTeam === t.id
                    ? 'text-dark-charcoal'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <span className="hidden md:inline">{t.label}</span>
                <span className="md:hidden">{t.short}</span>
                {selectedTeam === t.id && (
                  <motion.div
                    layoutId="fixturesActiveTab"
                    className="absolute bottom-0 left-0 right-0 h-[3px] bg-parofc-red"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Matches */}
      <div className="container mx-auto px-4 py-8 md:py-12">
        {filteredMatches.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24">
            <HugeiconsIcon
              icon={Calendar03Icon}
              size={32}
              className="text-gray-200 mb-3"
            />
            <span className="text-sm text-gray-400 font-medium">
              No {selectedTeam === 'women' ? "women's" : "men's"} matches scheduled
            </span>
          </div>
        ) : (
          <div className="space-y-14">
            {hasUpcoming && (
              <section>
                <h2 className="mb-6 text-2xl font-black text-dark-charcoal uppercase tracking-tight">
                  Fixtures
                </h2>
                <MatchRows groupedMatches={upcomingByMonth} />
              </section>
            )}
            {hasFinished && (
              <section>
                <h2 className="mb-6 text-2xl font-black text-dark-charcoal uppercase tracking-tight">
                  Results
                </h2>
                <MatchRows groupedMatches={finishedByMonth} showScores />
              </section>
            )}
          </div>
        )}
      </div>

    </div>
  );
}
