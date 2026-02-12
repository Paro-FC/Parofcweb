"use client"

import { motion } from "framer-motion"

interface Trophy {
  _id: string
  name: string
  total: number
}

interface TrophiesSectionProps {
  trophies?: Trophy[]
}

// Fallback trophies data
const fallbackTrophies: Trophy[] = [
  {
    _id: "1",
    name: "La Liga",
    total: 28,
  },
  {
    _id: "2",
    name: "UEFA Champions League",
    total: 5,
  },
  {
    _id: "3",
    name: "FIFA Club World Cup",
    total: 3,
  },
  {
    _id: "4",
    name: "Copa Del Rey",
    total: 32,
  },
]

export function TrophiesSection({ trophies = fallbackTrophies }: TrophiesSectionProps) {
  const trophyList = trophies && trophies.length > 0 ? trophies : fallbackTrophies

  return (
    <section className="py-16 px-4 bg-dark-charcoal">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {trophyList.map((trophy, index) => (
            <motion.div
              key={trophy._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative bg-dark-charcoal border border-medium-grey/30 rounded-xl p-6 overflow-hidden"
            >
              {/* Gradient Pattern at Top */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-barca-red via-barca-gold to-bronze opacity-80" />
              
              {/* Competition Name */}
              <div className="text-white text-sm font-normal mb-8">
                {trophy.name}
              </div>
              
              {/* Trophy Icon, Number, and Label */}
              <div className="flex items-center gap-4">
                {/* Trophy Icon */}
                <div className="flex-shrink-0 text-5xl">
                  🏆
                </div>
                
                {/* Number and Label */}
                <div className="flex-1 flex items-baseline gap-3">
                  <span className="text-7xl font-bold text-barca-gold leading-none">
                    {trophy.total}
                  </span>
                  <span className="text-white text-sm font-medium">
                    TROPHIES
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

