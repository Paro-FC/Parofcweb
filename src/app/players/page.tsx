"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { useState } from "react"

interface PlayerStats {
  appearances?: { value: number; season: string }
  cleanSheets?: { value: number; season: string }
  saves?: { value: number; season: string }
  goals?: { value: number; season: string }
  assists?: { value: number; season: string }
}

interface Player {
  id: number
  number: number
  firstName: string
  lastName: string
  position: string
  image: string
  stats?: PlayerStats
}

interface CoachingStaff {
  id: number
  name: string
  role: string
  image: string
}

const goalkeepers: Player[] = [
  { 
    id: 1, 
    number: 13, 
    firstName: "Joan", 
    lastName: "GARCIA", 
    position: "Goalkeeper", 
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=600&fit=crop",
    stats: {
      appearances: { value: 22, season: "2025/2026 Season" },
      cleanSheets: { value: 10, season: "2025/2026 Season" },
      saves: { value: 64, season: "2025/2026 Season" },
    },
  },
  { 
    id: 2, 
    number: 25, 
    firstName: "Wojciech", 
    lastName: "SZCZESNY", 
    position: "Goalkeeper", 
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=600&fit=crop",
    stats: {
      appearances: { value: 18, season: "2025/2026 Season" },
      cleanSheets: { value: 8, season: "2025/2026 Season" },
      saves: { value: 52, season: "2025/2026 Season" },
    },
  },
]

const defenders: Player[] = [
  { 
    id: 3, 
    number: 2, 
    firstName: "João", 
    lastName: "CANCELO", 
    position: "Defender", 
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=600&fit=crop",
    stats: {
      appearances: { value: 24, season: "2025/2026 Season" },
      goals: { value: 2, season: "2025/2026 Season" },
      assists: { value: 5, season: "2025/2026 Season" },
    },
  },
  { 
    id: 4, 
    number: 3, 
    firstName: "Alejandro", 
    lastName: "BALDE", 
    position: "Defender", 
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=600&fit=crop",
    stats: {
      appearances: { value: 20, season: "2025/2026 Season" },
      goals: { value: 1, season: "2025/2026 Season" },
      assists: { value: 4, season: "2025/2026 Season" },
    },
  },
  { 
    id: 5, 
    number: 4, 
    firstName: "Ronald", 
    lastName: "ARAUJO", 
    position: "Defender", 
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=600&fit=crop",
    stats: {
      appearances: { value: 26, season: "2025/2026 Season" },
      goals: { value: 3, season: "2025/2026 Season" },
      assists: { value: 1, season: "2025/2026 Season" },
    },
  },
  { 
    id: 6, 
    number: 5, 
    firstName: "Pau", 
    lastName: "CUBARSÍ", 
    position: "Defender", 
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=600&fit=crop",
    stats: {
      appearances: { value: 19, season: "2025/2026 Season" },
      goals: { value: 1, season: "2025/2026 Season" },
      assists: { value: 2, season: "2025/2026 Season" },
    },
  },
  { 
    id: 7, 
    number: 15, 
    firstName: "Andreas", 
    lastName: "CHRISTENSEN", 
    position: "Defender", 
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=600&fit=crop",
    stats: {
      appearances: { value: 23, season: "2025/2026 Season" },
      goals: { value: 2, season: "2025/2026 Season" },
      assists: { value: 1, season: "2025/2026 Season" },
    },
  },
  { 
    id: 8, 
    number: 18, 
    firstName: "Gerard", 
    lastName: "MARTÍN", 
    position: "Defender", 
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=600&fit=crop",
    stats: {
      appearances: { value: 12, season: "2025/2026 Season" },
      goals: { value: 0, season: "2025/2026 Season" },
      assists: { value: 1, season: "2025/2026 Season" },
    },
  },
  { 
    id: 9, 
    number: 23, 
    firstName: "Jules", 
    lastName: "KOUNDE", 
    position: "Defender", 
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=600&fit=crop",
    stats: {
      appearances: { value: 25, season: "2025/2026 Season" },
      goals: { value: 1, season: "2025/2026 Season" },
      assists: { value: 3, season: "2025/2026 Season" },
    },
  },
  { 
    id: 10, 
    number: 24, 
    firstName: "Eric", 
    lastName: "GARCIA", 
    position: "Defender", 
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=600&fit=crop",
    stats: {
      appearances: { value: 15, season: "2025/2026 Season" },
      goals: { value: 0, season: "2025/2026 Season" },
      assists: { value: 1, season: "2025/2026 Season" },
    },
  },
]

const midfielders: Player[] = [
  { id: 11, number: 6, firstName: "Gavi", lastName: "", position: "Midfielder", image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=500&fit=crop" },
  { id: 12, number: 8, firstName: "Pedri", lastName: "", position: "Midfielder", image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=500&fit=crop" },
  { id: 13, number: 16, firstName: "Fermín", lastName: "LÓPEZ", position: "Midfielder", image: "/assets/Fermin.webp" },
  { id: 14, number: 17, firstName: "Marc", lastName: "CASADÓ", position: "Midfielder", image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=500&fit=crop" },
  { id: 15, number: 20, firstName: "Dani", lastName: "OLMO", position: "Midfielder", image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=500&fit=crop" },
  { id: 16, number: 21, firstName: "Frenkie", lastName: "DE JONG", position: "Midfielder", image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=500&fit=crop" },
  { id: 17, number: 22, firstName: "Marc", lastName: "BERNAL", position: "Midfielder", image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=500&fit=crop" },
]

const forwards: Player[] = [
  { id: 18, number: 7, firstName: "Ferran", lastName: "TORRES", position: "Forward", image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=500&fit=crop" },
  { id: 19, number: 9, firstName: "Robert", lastName: "LEWANDOWSKI", position: "Forward", image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=500&fit=crop" },
  { id: 20, number: 10, firstName: "Lamine", lastName: "YAMAL", position: "Forward", image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=500&fit=crop" },
  { id: 21, number: 11, firstName: "Raphinha", lastName: "", position: "Forward", image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=500&fit=crop" },
  { id: 22, number: 14, firstName: "Marcus", lastName: "RASHFORD", position: "Forward", image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=500&fit=crop" },
  { id: 23, number: 19, firstName: "Roony", lastName: "BARDGHJI", position: "Forward", image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=500&fit=crop" },
]

const coachingStaff: CoachingStaff[] = [
  { id: 1, name: "Hansi Flick", role: "Coach", image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=500&fit=crop" },
]

const staffMembers = [
  "Assistant coach Marcus Sorg",
  "Assistant coach Toni Tapalovic",
  "Assistant coach Heiko Westermann",
  "Goalkeeping coach José Ramon De La Fuente",
  "Head of fitness training Julio Tous",
  "Field fitness coach Pepe Conde",
  "Field fitness coach Rafa Maldonado",
  "Gym and strength fitness coach Germán Fernández",
]

type PositionCategory = "goalkeepers" | "defenders" | "midfielders" | "forwards" | "coaching"

export default function PlayersPage() {
  const [activeCategory, setActiveCategory] = useState<PositionCategory>("goalkeepers")

  const PlayerCard = ({ player, index }: { player: Player; index: number }) => (
    <motion.div
      key={player.id}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="relative w-full"
    >
      <div className="relative w-full h-[600px] overflow-hidden">
        {/* Background Image - Full Card Coverage */}
        <Image
          src={player.image}
          alt={`${player.firstName} ${player.lastName}`}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 opacity-60">
          {index % 2 === 0 ? (
            <div className="absolute inset-0 bg-gradient-to-br from-barca-blue via-transparent to-barca-red" />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-bl from-barca-red via-transparent to-barca-blue" />
          )}
        </div>

        {/* Player Info at Bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-8 z-10">
          <div className="mb-4 text-center">
            {/* Player Number - Lighter Font */}
            <div className="mb-4">
              <span className="text-8xl font-light text-white/30">
                {player.number}
              </span>
            </div>
            <div className="text-white">
              <span className="text-lg font-normal">{player.firstName} </span>
              <span className="text-3xl font-bold uppercase">{player.lastName || player.firstName}</span>
            </div>
            <p className="text-white/90 text-sm mt-2">{player.position}</p>
          </div>

          {/* Statistics Overlay - Always Visible */}
          {player.stats && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 30,
                duration: 0.4 
              }}
              className="bg-black/60 backdrop-blur-sm rounded-lg p-6 mt-4"
            >
              <div className="grid grid-cols-3 gap-4">
                {Object.entries(player.stats).map(([key, stat]) => (
                  <div key={key} className="text-center">
                    <div className="text-xs text-white/80 uppercase font-semibold mb-2">
                      {key === 'appearances' && 'APPEARANCES'}
                      {key === 'cleanSheets' && 'CLEAN SHEETS'}
                      {key === 'saves' && 'SAVES'}
                      {key === 'goals' && 'GOALS'}
                      {key === 'assists' && 'ASSISTS'}
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">
                      {stat.value}
                    </div>
                    <div className="text-xs text-white/60 mb-1">
                      {stat.season}
                    </div>
                    <div className="text-sm font-bold text-barca-gold">
                      {stat.value}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  )

  const StaffCard = ({ staff }: { staff: CoachingStaff }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative w-full max-w-[300px] mx-auto"
    >
      <a href="#" className="block group">
        <div className="relative aspect-[3/4] overflow-hidden">
          {/* Background split - red left, blue right */}
          <div className="absolute inset-0 flex">
            <div className="w-1/2 bg-barca-red"></div>
            <div className="w-1/2 bg-barca-blue"></div>
          </div>
          
          {/* Staff Image */}
          <div className="relative z-10 h-full flex items-center justify-center">
            <Image
              src={staff.image}
              alt={staff.name}
              width={300}
              height={400}
              className="object-contain h-full w-auto"
            />
          </div>
        </div>
        
        {/* Staff Info */}
        <div className="mt-4 text-center">
          <p className="text-2xl font-bold uppercase text-gray-900">
            {staff.name}
          </p>
          <p className="text-sm text-gray-600 mt-2">{staff.role}</p>
        </div>
      </a>
    </motion.div>
  )

  return (
    <div className="min-h-screen bg-gradient-barca">

      {/* Main Content */}
      <section className="bg-white py-16 px-4">
        <div className="container mx-auto">

          {/* Category Navigation */}
          <nav className="mb-12">
            <div className="flex flex-wrap gap-4 border-b border-gray-200">
              {[
                { id: "goalkeepers", label: "GOALKEEPERS" },
                { id: "defenders", label: "DEFENDERS" },
                { id: "midfielders", label: "MIDFIELDERS" },
                { id: "forwards", label: "FORWARDS" },
                { id: "coaching", label: "COACHING STAFF" },
              ].map((category) => (
                <a
                  key={category.id}
                  href={`#${category.id}`}
                  onClick={(e) => {
                    e.preventDefault()
                    setActiveCategory(category.id as PositionCategory)
                  }}
                  className={`px-6 py-3 text-sm font-semibold uppercase transition-colors border-b-2 ${
                    activeCategory === category.id
                      ? "text-gray-900 border-gray-900"
                      : "text-gray-500 border-transparent hover:text-gray-700"
                  }`}
                >
                  {category.label}
                </a>
              ))}
            </div>
          </nav>

          {/* Players Grid */}
          <div>
            {activeCategory === "goalkeepers" && (
              <div id="goalkeepers">
                <h3 className="text-3xl font-bold uppercase text-gray-900 mb-8">Goalkeepers</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {goalkeepers.map((player, index) => (
                    <PlayerCard key={player.id} player={player} index={index} />
                  ))}
                </div>
              </div>
            )}

            {activeCategory === "defenders" && (
              <div id="defenders">
                <h3 className="text-3xl font-bold uppercase text-gray-900 mb-8">Defenders</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {defenders.map((player, index) => (
                    <PlayerCard key={player.id} player={player} index={index} />
                  ))}
                </div>
              </div>
            )}

            {activeCategory === "midfielders" && (
              <div id="midfielders">
                <h3 className="text-3xl font-bold uppercase text-gray-900 mb-8">Midfielders</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {midfielders.map((player, index) => (
                    <PlayerCard key={player.id} player={player} index={index} />
                  ))}
                </div>
              </div>
            )}

            {activeCategory === "forwards" && (
              <div id="forwards">
                <h3 className="text-3xl font-bold uppercase text-gray-900 mb-8">Forwards</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {forwards.map((player, index) => (
                    <PlayerCard key={player.id} player={player} index={index} />
                  ))}
                </div>
              </div>
            )}

            {activeCategory === "coaching" && (
              <div id="coaching">
                <h3 className="text-3xl font-bold uppercase text-gray-900 mb-8">Coaching Staff</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-12">
                  {coachingStaff.map((staff) => (
                    <StaffCard key={staff.id} staff={staff} />
                  ))}
                </div>
                <div className="mt-8">
                  <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {staffMembers.map((member, index) => (
                      <li key={index} className="text-gray-700">{member}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

    </div>
  )
}

