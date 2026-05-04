"use client";

import { motion } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowUpRight01Icon, Cancel01Icon } from "@hugeicons/core-free-icons";
import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/lib/image";
import { Countdown } from "./ui/countdown";

interface Match {
  _id: string;
  homeTeam: string;
  awayTeam: string;
  homeCrest?: unknown;
  awayCrest?: unknown;
  competition: string;
  date: string;
  event: string;
  venue: string;
  matchUrl?: string;
  showMatchLink?: boolean;
  status?: "upcoming" | "live" | "ht" | "ft" | "postponed" | string;
  minute?: string;
  homeScore?: number;
  awayScore?: number;
}

interface MatchDetailPageProps {
  match: Match;
}

function formatMatchDate(dateString: string) {
  const date = new Date(dateString);
  const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const months = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ];

  return {
    day: days[date.getDay()],
    date: date.getDate(),
    month: months[date.getMonth()],
    time: date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }),
  };
}

export function MatchDetailPage({ match }: MatchDetailPageProps) {
  const formatted = formatMatchDate(match.date);

  const scoreHome = match.homeScore ?? 0;
  const scoreAway = match.awayScore ?? 0;
  const statusNorm = (match.status ?? "upcoming").toString().toLowerCase();
  const isUpcoming = statusNorm === "upcoming";
  const isPostponed = statusNorm === "postponed";
  const showScore = !isUpcoming && !isPostponed;
  const matchMeta =
    statusNorm === "live"
      ? match.minute
        ? `Live • ${match.minute}'`
        : "Live"
      : statusNorm === "ht"
        ? "Half Time"
        : statusNorm === "ft"
          ? "Full Time"
          : statusNorm === "upcoming"
            ? "Upcoming"
            : statusNorm === "postponed"
              ? "Postponed"
              : match.status
                ? match.status.toString()
                : null;

  const matchDate = new Date(match.date);
  const dateLong = matchDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const time24 = matchDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  function crestUrl(crest: unknown) {
    if (!crest) return null;
    try {
      return urlFor(crest).width(160).height(160).url();
    } catch {
      return null;
    }
  }

  const homeCrestUrl = crestUrl(match.homeCrest);
  const awayCrestUrl = crestUrl(match.awayCrest);

  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      {/* Background with blurred crowd image */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1920&h=1080&fit=crop"
          alt="Crowd background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
        <div
          className="absolute inset-0 opacity-[0.08] mix-blend-overlay"
          style={{
            backgroundImage:
              "repeating-linear-gradient(135deg, rgba(255,255,255,0.35), rgba(255,255,255,0.35) 1px, transparent 1px, transparent 10px)",
          }}
        />
        <div className="absolute inset-x-0 bottom-0 h-[45%] bg-gradient-to-t from-black via-black/60 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen">
        <div className="mx-auto w-full max-w-7xl px-4 py-10 md:px-6 md:py-14">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="mb-8 flex flex-col gap-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-parofc-red shadow-[0_0_0_3px_rgba(206,5,5,0.25)]" />
                <p className="truncate text-xs font-black uppercase tracking-[0.26em] text-white/60">
                  Match Center
                </p>
              </div>

              {matchMeta ? (
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-2xs font-black uppercase tracking-wider text-parofc-gold">
                  <span className="h-1.5 w-1.5 rounded-full bg-parofc-gold" />
                  {matchMeta}
                </span>
              ) : null}
            </div>

            <div className="flex flex-col items-start gap-1">
              <h1 className="text-2xl font-black uppercase tracking-tight text-white sm:text-3xl">
                {match.competition || "Match"}
              </h1>
              <p className="text-xs font-bold uppercase tracking-widest text-white/45">
                {match.venue || "Venue TBA"} · {dateLong} · {time24} CET
              </p>
            </div>
          </motion.div>

          {/* Scoreboard */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.05 }}
            className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/35 backdrop-blur-xl"
          >
            <div className="absolute inset-0 opacity-[0.12]">
              <div className="absolute -left-24 -top-24 h-64 w-64 rounded-full bg-parofc-red/40 blur-3xl" />
              <div className="absolute -right-24 -bottom-24 h-64 w-64 rounded-full bg-parofc-gold/25 blur-3xl" />
            </div>

            <div className="relative p-6 md:p-8">
              <div className="grid items-center gap-6 md:grid-cols-[1fr_auto_1fr] md:gap-8">
                {/* Home */}
                <div className="flex items-center gap-4 md:gap-5">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-white/5 ring-1 ring-white/10 md:h-16 md:w-16">
                    {homeCrestUrl ? (
                      <Image
                        src={homeCrestUrl}
                        alt={match.homeTeam}
                        fill
                        className="object-contain p-2"
                      />
                    ) : (
                      <div className="grid h-full w-full place-items-center text-xs font-black text-white/30">
                        {match.homeTeam?.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-2xs font-black uppercase tracking-[0.22em] text-white/40">
                      Home
                    </p>
                    <p className="truncate text-lg font-black uppercase tracking-tight text-white md:text-xl">
                      {match.homeTeam}
                    </p>
                  </div>
                </div>

                {/* Middle */}
                <div className="flex flex-col items-center justify-center">
                  {showScore ? (
                    <div className="flex items-baseline gap-3 tabular-nums">
                      <span className="text-5xl font-black text-white md:text-6xl">
                        {scoreHome}
                      </span>
                      <span className="text-lg font-black text-white/20 md:text-xl">
                        —
                      </span>
                      <span className="text-5xl font-black text-white md:text-6xl">
                        {scoreAway}
                      </span>
                    </div>
                  ) : (
                    <div className="text-center">
                      <p className="text-4xl font-black text-white md:text-5xl tabular-nums">
                        {formatted.time}
                      </p>
                      <p className="mt-1 text-2xs font-bold uppercase tracking-[0.26em] text-white/40">
                        Kickoff (CET)
                      </p>
                    </div>
                  )}

                  <div className="mt-4 flex items-center gap-2">
                    <span className="h-px w-10 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                    <span className="text-2xs font-black uppercase tracking-[0.26em] text-white/45">
                      {match.event || "Fixture"}
                    </span>
                    <span className="h-px w-10 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  </div>
                </div>

                {/* Away */}
                <div className="flex items-center gap-4 md:gap-5 md:justify-end">
                  <div className="min-w-0 text-right">
                    <p className="text-2xs font-black uppercase tracking-[0.22em] text-white/40">
                      Away
                    </p>
                    <p className="truncate text-lg font-black uppercase tracking-tight text-white md:text-xl">
                      {match.awayTeam}
                    </p>
                  </div>
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-white/5 ring-1 ring-white/10 md:h-16 md:w-16">
                    {awayCrestUrl ? (
                      <Image
                        src={awayCrestUrl}
                        alt={match.awayTeam}
                        fill
                        className="object-contain p-2"
                      />
                    ) : (
                      <div className="grid h-full w-full place-items-center text-xs font-black text-white/30">
                        {match.awayTeam?.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Upcoming countdown */}
              {isUpcoming ? (
                <div className="mt-7 flex flex-col items-center gap-2">
                  <p className="text-2xs font-black uppercase tracking-[0.26em] text-white/45">
                    Countdown to kickoff
                  </p>
                  <div className="rounded-full border border-white/10 bg-white/5 px-5 py-2">
                    <Countdown targetDate={matchDate} />
                  </div>
                </div>
              ) : null}

              {match.matchUrl && match.showMatchLink !== false ? (
                <div className="mt-8 flex justify-center">
                  <a
                    href={match.matchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-parofc-gold/40 bg-parofc-gold/10 px-8 py-3 text-xs font-black uppercase tracking-[0.2em] text-parofc-gold transition hover:bg-parofc-gold hover:text-dark-charcoal"
                  >
                    Buy Tickets
                    <HugeiconsIcon icon={ArrowUpRight01Icon} size={16} />
                  </a>
                </div>
              ) : null}
            </div>

            <div className="h-px bg-gradient-to-r from-parofc-red via-parofc-gold to-bronze" />
          </motion.div>
        </div>
      </div>

      {/* Floating Close Button */}
      <Link
        href="/calendar"
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-14 h-14 bg-gray-900 hover:bg-gray-800 text-white rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110"
      >
        <HugeiconsIcon icon={Cancel01Icon} size={24} />
      </Link>
    </div>
  );
}
