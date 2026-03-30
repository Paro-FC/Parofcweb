"use client"

import { motion } from "framer-motion"
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

export interface PlayerCardPlayer {
  _id?: string
  id?: number
  number: number
  firstName: string
  lastName: string
  position: string
  image?: unknown | string | null
  slug?: string
  stats?: PlayerStats
}

const statLabels: Record<string, string> = {
  appearances: "APP",
  cleanSheets: "CS",
  saves: "SAVES",
  goals: "GOALS",
  assists: "AST",
}

function getImageSrc(player: PlayerCardPlayer): string | null {
  if (!player.image) return null
  if (typeof player.image === "string") {
    if (player.image.startsWith("http") || player.image.startsWith("/")) {
      return player.image
    }
  }
  return urlFor(player.image).width(600).height(900).url()
}

export function PlayerCard({
  player,
  index = 0,
}: {
  player: PlayerCardPlayer
  index?: number
}) {
  const playerSlug =
    player.slug || player._id || player.id?.toString() || "unknown"
  const playerId = player._id || player.id?.toString() || "unknown"
  const imageSrc = getImageSrc(player)

  return (
    <Link href={`/players/${playerSlug}`} className="block cursor-pointer group">
      <motion.div
        key={playerId}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.04, duration: 0.3 }}
        className="relative w-full"
      >
        <div className="relative w-full aspect-[3/4] overflow-hidden bg-gray-50">
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={`${player.firstName} ${player.lastName || player.firstName}`}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              priority={index < 4}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-dark-charcoal to-barca-red flex items-center justify-center">
              <span className="text-8xl font-black text-white/10">
                {player.number}
              </span>
            </div>
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Number - top left */}
          <div className="absolute top-3 left-3 z-10">
            <span className="text-xs font-bold text-white/40 tabular-nums">
              {player.number}
            </span>
          </div>

          {/* Player info - bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
            <div className="mb-2">
              <p className="text-[10px] font-bold text-barca-gold uppercase tracking-widest mb-0.5">
                {player.position}
              </p>
              <p className="text-white leading-tight">
                <span className="text-sm font-normal">{player.firstName} </span>
                <span className="text-lg md:text-xl font-black uppercase">
                  {player.lastName || player.firstName}
                </span>
              </p>
            </div>

            {player.stats && (
              <div className="flex items-center gap-3 pt-2 border-t border-white/10">
                {Object.entries(player.stats).map(([key, stat]) => {
                  if (!stat) return null
                  return (
                    <div key={key} className="text-center">
                      <div className="text-lg font-black text-white leading-none tabular-nums">
                        {stat.value}
                      </div>
                      <div className="text-[9px] font-bold text-white/40 uppercase tracking-wider mt-0.5">
                        {statLabels[key] || key}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  )
}
