"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { ChevronDown, Info } from "lucide-react";
import { sanityFetch } from "@/sanity/lib/live";
import { STANDINGS_QUERY, STANDINGS_SEASONS_QUERY } from "@/sanity/lib/queries";

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
  { id: "bpl", name: "BOB Premier League" },
  { id: "cup", name: "National Cup" },
  { id: "afc", name: "AFC Qualifiers" },
];

export default function StandingsPage() {
  const [selectedCompetition, setSelectedCompetition] = useState("bpl");
  const [selectedSeason, setSelectedSeason] = useState("2025");
  const [showSeasonDropdown, setShowSeasonDropdown] = useState(false);
  const [teams, setTeams] = useState<Team[]>([]);
  const [seasons, setSeasons] = useState<string[]>(["2025", "2024", "2023"]);
  const [loading, setLoading] = useState(true);

  // Fetch standings data from Sanity
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

        // Update seasons list
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

        // Update teams data
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

  const getPositionClass = (position: number) => {
    if (position === 1) return "bg-[#00ff87]"; // Champion - Green
    if (position <= 2) return "bg-[#04f5ff]"; // AFC Qualification - Cyan
    if (position >= 9) return "bg-[#ff0046]"; // Relegation - Red
    return "";
  };

  const getFormColor = (result: "W" | "D" | "L") => {
    switch (result) {
      case "W":
        return "bg-green-500";
      case "D":
        return "bg-gray-400";
      case "L":
        return "bg-red-500";
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-dark-charcoal to-bronze py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-light-gold">
            Tables
          </h1>
        </div>
      </div>

      {/* Competition Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-1 overflow-x-auto">
            {competitions.map((comp) => (
              <button
                key={comp.id}
                onClick={() => setSelectedCompetition(comp.id)}
                className={`px-6 py-4 text-sm font-semibold whitespace-nowrap transition-colors border-b-4 ${
                  selectedCompetition === comp.id
                    ? "text-barca-gold border-barca-gold"
                    : "text-gray-600 border-transparent hover:text-barca-gold"
                }`}
              >
                {comp.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Season Filter */}
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <label className="text-sm font-semibold text-gray-700">
              Filter by Season:
            </label>
            <div className="relative">
              <button
                onClick={() => setShowSeasonDropdown(!showSeasonDropdown)}
                className="flex items-center gap-3 px-5 py-2.5 bg-white border-2 border-gray-300 rounded-lg text-sm font-semibold text-gray-900 hover:border-barca-gold hover:bg-gray-50 transition-all min-w-[120px] shadow-sm"
              >
                <span>{selectedSeason}</span>
                <ChevronDown
                  size={18}
                  className={`text-gray-500 transition-transform duration-200 ${showSeasonDropdown ? "rotate-180" : ""}`}
                />
              </button>
              {showSeasonDropdown && (
                <>
                  {/* Backdrop */}
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowSeasonDropdown(false)}
                  />
                  {/* Dropdown Menu */}
                  <div className="absolute top-full left-0 mt-2 w-full bg-white border-2 border-gray-200 rounded-lg shadow-xl z-20 overflow-hidden min-w-[120px]">
                    {seasons.map((season) => (
                      <button
                        key={season}
                        onClick={() => {
                          setSelectedSeason(season);
                          setShowSeasonDropdown(false);
                        }}
                        className={`w-full px-5 py-3 text-sm text-left hover:bg-barca-gold hover:text-dark-charcoal transition-colors ${
                          selectedSeason === season
                            ? "bg-barca-gold text-dark-charcoal font-semibold"
                            : "text-gray-700 font-medium"
                        }`}
                      >
                        {season}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Table Header */}
          <div className="bg-dark-charcoal text-light-gold px-6 py-4">
            <h2 className="text-xl font-bold">
              BOB Bhutan Premier League {selectedSeason}
            </h2>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider w-16">
                    Position
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Club
                  </th>
                  <th className="text-center py-3 px-2 text-xs font-semibold text-gray-600 uppercase tracking-wider w-12">
                    Pl
                  </th>
                  <th className="text-center py-3 px-2 text-xs font-semibold text-gray-600 uppercase tracking-wider w-12">
                    W
                  </th>
                  <th className="text-center py-3 px-2 text-xs font-semibold text-gray-600 uppercase tracking-wider w-12">
                    D
                  </th>
                  <th className="text-center py-3 px-2 text-xs font-semibold text-gray-600 uppercase tracking-wider w-12">
                    L
                  </th>
                  <th className="text-center py-3 px-2 text-xs font-semibold text-gray-600 uppercase tracking-wider w-12">
                    GF
                  </th>
                  <th className="text-center py-3 px-2 text-xs font-semibold text-gray-600 uppercase tracking-wider w-12">
                    GA
                  </th>
                  <th className="text-center py-3 px-2 text-xs font-semibold text-gray-600 uppercase tracking-wider w-12">
                    GD
                  </th>
                  <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider w-16">
                    Pts
                  </th>
                  <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider hidden md:table-cell">
                    Form
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={11} className="py-8 text-center text-gray-500">
                      Loading standings...
                    </td>
                  </tr>
                ) : teams.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="py-8 text-center text-gray-500">
                      No standings data available
                    </td>
                  </tr>
                ) : (
                  teams.map((team, index) => (
                    <tr
                      key={team.id}
                      className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                      }`}
                    >
                      {/* Position with Color Indicator */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-1 h-8 rounded-sm ${getPositionClass(team.position)}`}
                          />
                          <span className="font-bold text-gray-900">
                            {team.position}
                          </span>
                        </div>
                      </td>

                      {/* Club */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-8 h-8 flex-shrink-0">
                            {team.logo ? (
                              <Image
                                src={team.logo}
                                alt={team.name}
                                fill
                                className="object-contain"
                              />
                            ) : (
                              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold text-gray-500">
                                {team.name.charAt(0)}
                              </div>
                            )}
                          </div>
                          <span className="font-semibold text-gray-900 truncate">
                            {team.name}
                          </span>
                        </div>
                      </td>

                      {/* Stats */}
                      <td className="py-4 px-2 text-center text-gray-700">
                        {team.played}
                      </td>
                      <td className="py-4 px-2 text-center text-gray-700">
                        {team.won}
                      </td>
                      <td className="py-4 px-2 text-center text-gray-700">
                        {team.drawn}
                      </td>
                      <td className="py-4 px-2 text-center text-gray-700">
                        {team.lost}
                      </td>
                      <td className="py-4 px-2 text-center text-gray-700">
                        {team.goalsFor}
                      </td>
                      <td className="py-4 px-2 text-center text-gray-700">
                        {team.goalsAgainst}
                      </td>
                      <td className="py-4 px-2 text-center font-semibold text-gray-900">
                        {team.goalDifference > 0
                          ? `+${team.goalDifference}`
                          : team.goalDifference}
                      </td>
                      <td className="py-4 px-4 text-center font-bold text-gray-900 text-lg">
                        {team.points}
                      </td>

                      {/* Form */}
                      <td className="py-4 px-4 hidden md:table-cell">
                        <div className="flex items-center justify-center gap-1">
                          {team.form?.map((result, i) => (
                            <div
                              key={i}
                              className={`w-6 h-6 rounded-full ${getFormColor(result)} flex items-center justify-center text-white text-xs font-bold`}
                            >
                              {result}
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Legend */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex flex-wrap items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Info size={16} className="text-gray-400" />
                <span className="font-semibold text-gray-600">
                  Qualification/Relegation
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-[#00ff87]" />
                <span className="text-gray-600">Champion</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-[#04f5ff]" />
                <span className="text-gray-600">AFC Cup Qualification</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-[#ff0046]" />
                <span className="text-gray-600">Relegation</span>
              </div>
            </div>
          </div>
        </div>

        {/* Table Key - Additional Info */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-4 text-sm text-gray-600">
          <div>
            <span className="font-semibold">Pl</span> = Played
          </div>
          <div>
            <span className="font-semibold">W</span> = Won
          </div>
          <div>
            <span className="font-semibold">D</span> = Drawn
          </div>
          <div>
            <span className="font-semibold">L</span> = Lost
          </div>
          <div>
            <span className="font-semibold">GF</span> = Goals For
          </div>
          <div>
            <span className="font-semibold">GA</span> = Goals Against
          </div>
          <div>
            <span className="font-semibold">GD</span> = Goal Difference
          </div>
          <div>
            <span className="font-semibold">Pts</span> = Points
          </div>
        </div>
      </div>
    </div>
  );
}
