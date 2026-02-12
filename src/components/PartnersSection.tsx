"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"

interface Partner {
  _id: string
  name: string
  logo: string
  url: string
  category?: string
}

interface PartnersSectionProps {
  partners?: Partner[]
  category?: string
  title?: string
}

export function PartnersSection({ 
  partners = [], 
  category,
  title = "Main Partners" 
}: PartnersSectionProps) {
  // Filter by category if provided
  const filteredPartners = category 
    ? partners.filter(p => p.category === category)
    : partners

  if (filteredPartners.length === 0) {
    return null
  }

  return (
    <section className="py-12 px-4 bg-dark-charcoal">
      <div className="container mx-auto">
        <h3 className="text-2xl font-bold text-center text-white mb-8">{title}</h3>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
          {filteredPartners.map((partner, index) => (
            <motion.div
              key={partner._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex-shrink-0"
            >
              <Link
                href={partner.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <div className="relative w-32 h-32 md:w-40 md:h-40 flex items-center justify-center">
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    fill
                    className="object-contain"
                  />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

