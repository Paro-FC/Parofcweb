"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowDown01Icon,
  Award01Icon,
  Shield01Icon,
} from "@hugeicons/core-free-icons";
import { motion, AnimatePresence } from "framer-motion";
import { sanityFetch } from "@/sanity/lib/live";
import { STANDINGS_QUERY, STANDINGS_SEASONS_QUERY } from "@/sanity/lib/queries";
import Loader from "@/components/Loader";

interface Team {
  id: number;
  position: number;
  name: string;
  logo?: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  form?: ("W" | "D" | "L")[];
}

const competitions = [
  { id: "bpl", name: "BOB Premier League", short: "BPL" },
  { id: "cup", name: "National Cup", short: "Cup" },
  { id: "afc", name: "AFC Qualifiers", short: "AFC" },
];

export default function StandingsPage() {
  const [selectedCompetition, setSelectedCompetition] = useState("bpl");
  const [selectedSeason, setSelectedSeason] = useState("2025");
  const [showSeasonDropdown, setShowSeasonDropdown] = useState(false);
  const [teams, setTeams] = useState<Team[]>([]);
  const [seasons, setSeasons] = useState<string[]>(["2025", "2024", "2023"]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStandings = async () => {
      setLoading(true);
      try {
        const [standingsResult, seasonsResult] = await Promise.all([
          sanityFetch({
            query: STANDINGS_QUERY,
            params: {
              competition: selectedCompetition,
              season: selectedSeason,
            },
          }).catch(() => ({ data: null })),
          sanityFetch({
            query: STANDINGS_SEASONS_QUERY,
            params: { competition: selectedCompetition },
          }).catch(() => ({ data: [] })),
        ]);

        if (seasonsResult.data && Array.isArray(seasonsResult.data)) {
          const uniqueSeasons = Array.from(
            new Set(
              seasonsResult.data.map((s: any) => s.season).filter(Boolean),
            ),
          ).sort((a, b) => b.localeCompare(a)) as string[];
          if (uniqueSeasons.length > 0) {
            setSeasons(uniqueSeasons);
            if (!uniqueSeasons.includes(selectedSeason)) {
              setSelectedSeason(uniqueSeasons[0]);
            }
          }
        }

        const standingsData = standingsResult.data as any;
        if (standingsData?.teams) {
          const teamsData = standingsData.teams.map(
            (team: any, index: number) => ({
              id: index + 1,
              position: team.position,
              name: team.teamName,
              logo: team.teamLogo,
              played: team.played,
              won: team.won,
              drawn: team.drawn,
              lost: team.lost,
              goalsFor: team.goalsFor,
              goalsAgainst: team.goalsAgainst,
              goalDifference: team.goalsFor - team.goalsAgainst,
              points: team.points,
              form: (team.form || []) as ("W" | "D" | "L")[],
            }),
          );
          setTeams(teamsData);
        } else {
          setTeams([]);
        }
      } catch (error) {
        console.error("Error fetching standings:", error);
        setTeams([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStandings();
  }, [selectedCompetition, selectedSeason]);

  const getPositionIndicator = (position: number) => {
    if (position === 1) return { color: "bg-emerald-400", label: "Champion" };
    if (position <= 2)
      return { color: "bg-cyan-400", label: "AFC Qualification" };
    if (position >= 9) return { color: "bg-rose-500", label: "Relegation" };
    return { color: "bg-transparent", label: "" };
  };

  const getFormColor = (result: "W" | "D" | "L") => {
    switch (result) {
      case "W":
        return "bg-emerald-500 text-white";
      case "D":
        return "bg-gray-300 text-gray-600";
      case "L":
        return "bg-rose-500 text-white";
    }
  };

  const selectedCompName =
    competitions.find((c) => c.id === selectedCompetition)?.name ||
    "BOB Premier League";

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Header */}
      <div className="relative bg-dark-charcoal overflow-hidden">
        {/* Diagonal pattern */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, transparent, transparent 20px, white 20px, white 21px)",
          }}
        />

        <div className="container mx-auto px-4 py-12 md:py-16 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-xs font-bold text-parofc-gold uppercase tracking-[0.2em] mb-3">
              Standings
            </p>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white uppercase tracking-tight leading-none">
              League
              <br />
              <span className="text-parofc-gold">Tables</span>
            </h1>
          </motion.div>
        </div>

        {/* Bottom accent */}
        <div className="h-1 bg-gradient-to-r from-parofc-red via-parofc-gold to-bronze" />
      </div>

      {/* Competition Tabs + Season Filter */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Tabs */}
            <div className="flex items-center gap-0 overflow-x-auto -mb-px">
              {competitions.map((comp) => (
                <button
                  key={comp.id}
                  onClick={() => setSelectedCompetition(comp.id)}
                  className={`relative px-5 md:px-6 py-4 text-sm font-bold whitespace-nowrap transition-colors duration-200 uppercase tracking-wider cursor-pointer ${
                    selectedCompetition === comp.id
                      ? "text-dark-charcoal"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  <span className="hidden md:inline">{comp.name}</span>
                  <span className="md:hidden">{comp.short}</span>
                  {selectedCompetition === comp.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-[3px] bg-parofc-gold"
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Season Selector */}
            <div className="relative">
              <button
                onClick={() => setShowSeasonDropdown(!showSeasonDropdown)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-dark-charcoal hover:text-parofc-red transition-colors duration-200 cursor-pointer"
              >
                <span>{selectedSeason}</span>
                <HugeiconsIcon
                  icon={ArrowDown01Icon}
                  size={14}
                  className={`transition-transform duration-200 ${showSeasonDropdown ? "rotate-180" : ""}`}
                />
              </button>

              <AnimatePresence>
                {showSeasonDropdown && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowSeasonDropdown(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-20 overflow-hidden min-w-[100px]"
                    >
                      {seasons.map((season) => (
                        <button
                          key={season}
                          onClick={() => {
                            setSelectedSeason(season);
                            setShowSeasonDropdown(false);
                          }}
                          className={`w-full px-4 py-2.5 text-sm text-left transition-colors duration-150 cursor-pointer ${
                            selectedSeason === season
                              ? "bg-dark-charcoal text-white font-bold"
                              : "text-gray-600 font-medium hover:bg-gray-50"
                          }`}
                        >
                          {season}
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Table Title */}
        <div className="flex items-center gap-3 mb-6">
          <HugeiconsIcon
            icon={Shield01Icon}
            size={20}
            className="text-parofc-gold"
          />
          <h2 className="text-lg font-bold text-dark-charcoal">
            {selectedCompName}{" "}
            <span className="text-gray-400 font-medium">{selectedSeason}</span>
          </h2>
        </div>

        {/* Table */}
        <div className="rounded-xl overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-dark-charcoal">
                  <th className="text-left py-3 px-3 md:px-4 text-[10px] font-bold text-white/40 uppercase tracking-widest w-14">
                    #
                  </th>
                  <th className="text-left py-3 px-3 md:px-4 text-[10px] font-bold text-white/40 uppercase tracking-widest">
                    Club
                  </th>
                  <th className="text-center py-3 px-1.5 md:px-2 text-[10px] font-bold text-white/40 uppercase tracking-widest w-10">
                    Pl
                  </th>
                  <th className="text-center py-3 px-1.5 md:px-2 text-[10px] font-bold text-white/40 uppercase tracking-widest w-10">
                    W
                  </th>
                  <th className="text-center py-3 px-1.5 md:px-2 text-[10px] font-bold text-white/40 uppercase tracking-widest w-10">
                    D
                  </th>
                  <th className="text-center py-3 px-1.5 md:px-2 text-[10px] font-bold text-white/40 uppercase tracking-widest w-10">
                    L
                  </th>
                  <th className="text-center py-3 px-1.5 md:px-2 text-[10px] font-bold text-white/40 uppercase tracking-widest w-10 hidden sm:table-cell">
                    GF
                  </th>
                  <th className="text-center py-3 px-1.5 md:px-2 text-[10px] font-bold text-white/40 uppercase tracking-widest w-10 hidden sm:table-cell">
                    GA
                  </th>
                  <th className="text-center py-3 px-1.5 md:px-2 text-[10px] font-bold text-white/40 uppercase tracking-widest w-10">
                    GD
                  </th>
                  <th className="text-center py-3 px-3 md:px-4 text-[10px] font-bold text-parofc-gold uppercase tracking-widest w-14">
                    Pts
                  </th>
                  <th className="text-center py-3 px-3 md:px-4 text-[10px] font-bold text-white/40 uppercase tracking-widest hidden md:table-cell">
                    Form
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={11}>
                      <Loader />
                    </td>
                  </tr>
                ) : teams.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="py-16 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <HugeiconsIcon
                          icon={Award01Icon}
                          size={32}
                          className="text-gray-200"
                        />
                        <span className="text-sm text-gray-400 font-medium">
                          No standings data available
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  teams.map((team, index) => {
                    const posIndicator = getPositionIndicator(team.position);
                    const isParoFC = team.name.toLowerCase().includes("paro");

                    return (
                      <motion.tr
                        key={team.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          delay: index * 0.03,
                          duration: 0.3,
                        }}
                        className={`border-b border-gray-50 transition-colors duration-150 ${
                          isParoFC
                            ? "bg-parofc-gold/5 hover:bg-parofc-gold/10"
                            : "hover:bg-gray-50/80"
                        }`}
                      >
                        {/* Position */}
                        <td className="py-3.5 px-3 md:px-4">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-[3px] h-5 rounded-full ${posIndicator.color}`}
                            />
                            <span
                              className={`text-sm font-bold ${
                                team.position <= 3
                                  ? "text-dark-charcoal"
                                  : "text-gray-400"
                              }`}
                            >
                              {team.position}
                            </span>
                          </div>
                        </td>

                        {/* Club */}
                        <td className="py-3.5 px-3 md:px-4">
                          <div className="flex items-center gap-3">
                            <div className="relative w-7 h-7 flex-shrink-0">
                              {team.logo ? (
                                <Image
                                  src={team.logo}
                                  alt={team.name}
                                  fill
                                  className="object-contain"
                                />
                              ) : (
                                <div className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center">
                                  <span className="text-[10px] font-black text-gray-400">
                                    {team.name.charAt(0)}
                                  </span>
                                </div>
                              )}
                            </div>
                            <span
                              className={`text-sm truncate ${
                                isParoFC
                                  ? "font-black text-dark-charcoal"
                                  : "font-semibold text-gray-800"
                              }`}
                            >
                              {team.name}
                            </span>
                          </div>
                        </td>

                        {/* Stats */}
                        <td className="py-3.5 px-1.5 md:px-2 text-center text-sm text-gray-500 tabular-nums">
                          {team.played}
                        </td>
                        <td className="py-3.5 px-1.5 md:px-2 text-center text-sm text-gray-500 tabular-nums">
                          {team.won}
                        </td>
                        <td className="py-3.5 px-1.5 md:px-2 text-center text-sm text-gray-500 tabular-nums">
                          {team.drawn}
                        </td>
                        <td className="py-3.5 px-1.5 md:px-2 text-center text-sm text-gray-500 tabular-nums">
                          {team.lost}
                        </td>
                        <td className="py-3.5 px-1.5 md:px-2 text-center text-sm text-gray-500 tabular-nums hidden sm:table-cell">
                          {team.goalsFor}
                        </td>
                        <td className="py-3.5 px-1.5 md:px-2 text-center text-sm text-gray-500 tabular-nums hidden sm:table-cell">
                          {team.goalsAgainst}
                        </td>
                        <td className="py-3.5 px-1.5 md:px-2 text-center text-sm font-semibold tabular-nums text-gray-700">
                          {team.goalDifference > 0
                            ? `+${team.goalDifference}`
                            : team.goalDifference}
                        </td>
                        <td
                          className={`py-3.5 px-3 md:px-4 text-center text-base tabular-nums ${
                            isParoFC
                              ? "font-black text-parofc-red"
                              : "font-black text-dark-charcoal"
                          }`}
                        >
                          {team.points}
                        </td>

                        {/* Form */}
                        <td className="py-3.5 px-3 md:px-4 hidden md:table-cell">
                          <div className="flex items-center justify-center gap-1">
                            {team.form?.map((result, i) => (
                              <div
                                key={i}
                                className={`w-5 h-5 rounded-sm ${getFormColor(result)} flex items-center justify-center text-[9px] font-bold`}
                              >
                                {result}
                              </div>
                            ))}
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 flex flex-wrap items-center gap-5 text-xs text-gray-400">
          <span className="font-bold text-gray-500 uppercase tracking-wider">
            Key
          </span>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm bg-emerald-400" />
            <span>Champion</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm bg-cyan-400" />
            <span>AFC Cup Qualification</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm bg-rose-500" />
            <span>Relegation</span>
          </div>
          <div className="w-px h-3 bg-gray-200 hidden sm:block" />
          <div className="hidden sm:flex items-center gap-1.5">
            <div className="w-4 h-4 rounded-sm bg-emerald-500 flex items-center justify-center text-[8px] font-bold text-white">
              W
            </div>
            <span>Win</span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5">
            <div className="w-4 h-4 rounded-sm bg-gray-300 flex items-center justify-center text-[8px] font-bold text-gray-600">
              D
            </div>
            <span>Draw</span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5">
            <div className="w-4 h-4 rounded-sm bg-rose-500 flex items-center justify-center text-[8px] font-bold text-white">
              L
            </div>
            <span>Loss</span>
          </div>
        </div>
      </div>
    </div>
  );
}
