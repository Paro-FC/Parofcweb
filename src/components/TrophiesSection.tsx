"use client";

import { motion } from "framer-motion";

interface Trophy {
  _id: string;
  name: string;
  total: number;
}

interface TrophiesSectionProps {
  trophies?: Trophy[];
}

const fallbackTrophies: Trophy[] = [
  { _id: "1", name: "Liga Premier", total: 8 },
  { _id: "2", name: "AFC Cup", total: 2 },
  { _id: "3", name: "Copa Nacional", total: 5 },
  { _id: "4", name: "Super Cup", total: 3 },
];

export function TrophiesSection({
  trophies = fallbackTrophies,
}: TrophiesSectionProps) {
  const trophyList =
    trophies && trophies.length > 0 ? trophies : fallbackTrophies;

  return (
    <section className="py-16 md:py-24 px-4 bg-dark-charcoal relative overflow-hidden">
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, transparent, transparent 20px, white 20px, white 21px)",
        }}
      />

      <div className="container mx-auto relative z-10">
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-black uppercase tracking-tight text-white mb-12 text-center"
        >
          Honours
        </motion.h3>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {trophyList.map((trophy, index) => (
            <motion.div
              key={trophy._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="group relative text-center py-8 md:py-12 px-4"
            >
              {/* Hover border effect */}
              <div className="absolute inset-0 border border-white/0 group-hover:border-white/10 rounded-xl transition-all duration-300" />

              {/* Big number */}
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{
                  delay: index * 0.1 + 0.2,
                  duration: 0.5,
                  type: "spring",
                  stiffness: 200,
                }}
                className="mb-3"
              >
                <span className="text-6xl md:text-8xl font-black text-parofc-gold leading-none">
                  {trophy.total}
                </span>
              </motion.div>

              {/* Competition name */}
              <p className="text-xs md:text-sm font-semibold text-white/50 uppercase tracking-wider">
                {trophy.name}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
