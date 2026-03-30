"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Users } from "lucide-react";
import { sanityFetch } from "@/sanity/lib/live";
import {
  PLAYERS_BY_TEAM_QUERY,
  COACHING_STAFF_QUERY,
} from "@/sanity/lib/queries";
import { PlayerCard, type PlayerCardPlayer } from "@/components/PlayerCard";

interface Player extends PlayerCardPlayer {
  team?: string;
}

interface CoachingStaff {
  _id: string;
  name: string;
  role: string;
  image?: string | null;
}

type PositionCategory =
  | "goalkeepers"
  | "defenders"
  | "midfielders"
  | "forwards"
  | "coaching";
type TeamType = "mens" | "womens";

const positionCategories: { id: PositionCategory; label: string }[] = [
  { id: "goalkeepers", label: "Goalkeepers" },
  { id: "defenders", label: "Defenders" },
  { id: "midfielders", label: "Midfielders" },
  { id: "forwards", label: "Forwards" },
  { id: "coaching", label: "Staff" },
];

export default function PlayersPage() {
  const [activeTeam, setActiveTeam] = useState<TeamType>("mens");
  const [activeCategory, setActiveCategory] =
    useState<PositionCategory>("goalkeepers");
  const [players, setPlayers] = useState<Player[]>([]);
  const [coachingStaff, setCoachingStaff] = useState<CoachingStaff[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlayers = async () => {
      setLoading(true);
      try {
        const result = await sanityFetch({
          query: PLAYERS_BY_TEAM_QUERY,
          params: { team: activeTeam },
        });
        setPlayers((result.data as Player[]) || []);
      } catch (error) {
        console.error("Error fetching players:", error);
        setPlayers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, [activeTeam]);

  useEffect(() => {
    const fetchCoachingStaff = async () => {
      try {
        const result = await sanityFetch({ query: COACHING_STAFF_QUERY });
        setCoachingStaff((result.data as CoachingStaff[]) || []);
      } catch (error) {
        console.error("Error fetching coaching staff:", error);
        setCoachingStaff([]);
      }
    };
    fetchCoachingStaff();
  }, []);

  const grouped: Record<string, Player[]> = {
    goalkeepers: players.filter((p) => p.position === "Goalkeeper"),
    defenders: players.filter((p) => p.position === "Defender"),
    midfielders: players.filter((p) => p.position === "Midfielder"),
    forwards: players.filter((p) => p.position === "Forward"),
  };

  const currentPlayers = grouped[activeCategory] || [];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Header */}
      <div className="relative bg-dark-charcoal overflow-hidden">
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
            <p className="text-xs font-bold text-barca-gold uppercase tracking-[0.2em] mb-3">
              First Team
            </p>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white uppercase tracking-tight leading-none">
              The
              <br />
              <span className="text-barca-gold">Squad</span>
            </h1>
          </motion.div>
        </div>

        <div className="h-1 bg-gradient-to-r from-barca-red via-barca-gold to-bronze" />
      </div>

      {/* Team Tabs + Position Filter — sticky */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="container mx-auto px-4">
          {/* Team row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-0 -mb-px">
              {(["mens", "womens"] as const).map((team) => (
                <button
                  key={team}
                  onClick={() => {
                    setActiveTeam(team);
                    setActiveCategory("goalkeepers");
                  }}
                  className={`relative px-5 md:px-6 py-3.5 text-sm font-bold whitespace-nowrap transition-colors duration-200 uppercase tracking-wider cursor-pointer ${
                    activeTeam === team
                      ? "text-dark-charcoal"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  {team === "mens" ? "Men's Team" : "Women's Team"}
                  {activeTeam === team && (
                    <motion.div
                      layoutId="activeTeamTab"
                      className="absolute bottom-0 left-0 right-0 h-[3px] bg-barca-gold"
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

            {/* Player count */}
            <span className="text-xs text-gray-400 tabular-nums hidden md:block">
              {players.length} players
            </span>
          </div>
        </div>
      </div>

      {/* Position Filter */}
      <div className="border-b border-gray-100 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-0 overflow-x-auto -mb-px scrollbar-hide">
            {positionCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`relative px-4 md:px-5 py-3 text-xs font-bold whitespace-nowrap transition-colors duration-200 uppercase tracking-widest cursor-pointer ${
                  activeCategory === cat.id
                    ? "text-dark-charcoal"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {cat.label}
                {activeCategory === cat.id && (
                  <motion.div
                    layoutId="activePositionTab"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-dark-charcoal"
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
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 md:py-12">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-8 h-8 border-2 border-barca-gold border-t-transparent rounded-full animate-spin mb-3" />
            <span className="text-sm text-gray-400 font-medium">
              Loading squad...
            </span>
          </div>
        ) : activeCategory === "coaching" ? (
          /* Coaching Staff */
          <AnimatePresence mode="wait">
            <motion.div
              key="coaching"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              {coachingStaff.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24">
                  <Users className="w-8 h-8 text-gray-200 mb-3" />
                  <span className="text-sm text-gray-400 font-medium">
                    No coaching staff listed yet
                  </span>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                  {coachingStaff.map((staff, index) => (
                    <motion.div
                      key={staff._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.04, duration: 0.3 }}
                      className="group"
                    >
                      <div className="relative aspect-[3/4] overflow-hidden bg-gray-50">
                        {staff.image ? (
                          <Image
                            src={staff.image}
                            alt={staff.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-dark-charcoal to-barca-red flex items-center justify-center">
                            <span className="text-5xl font-black text-white/20">
                              {staff.name
                                .split(/\s+/)
                                .map((n) => n[0])
                                .join("")
                                .slice(0, 2)
                                .toUpperCase()}
                            </span>
                          </div>
                        )}

                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                        {/* Info */}
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <p className="text-[10px] font-bold text-barca-gold uppercase tracking-widest mb-1">
                            {staff.role}
                          </p>
                          <p className="text-base md:text-lg font-black text-white uppercase leading-tight">
                            {staff.name}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        ) : (
          /* Player Grid */
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              {players.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24">
                  <Users className="w-8 h-8 text-gray-200 mb-3" />
                  <span className="text-sm text-gray-400 font-medium">
                    No players found for the{" "}
                    {activeTeam === "mens" ? "Men's" : "Women's"} Team
                  </span>
                </div>
              ) : currentPlayers.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24">
                  <Users className="w-8 h-8 text-gray-200 mb-3" />
                  <span className="text-sm text-gray-400 font-medium">
                    No{" "}
                    {positionCategories.find((c) => c.id === activeCategory)
                      ?.label || "players"}{" "}
                    found
                  </span>
                </div>
              ) : (
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
                  {currentPlayers.map((player, index) => (
                    <PlayerCard
                      key={player._id || player.id || index}
                      player={player}
                      index={index}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `,
        }}
      />
    </div>
  );
}
