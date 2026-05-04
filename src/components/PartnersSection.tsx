"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

interface Partner {
  _id: string;
  name: string;
  logo: string;
  url: string;
  category?: string;
}

interface PartnersSectionProps {
  partners?: Partner[];
  category?: string;
  title?: string;
}

export function PartnersSection({
  partners = [],
  category,
  title = "Main Partners",
}: PartnersSectionProps) {
  const filteredPartners = category
    ? partners.filter((p) => p.category === category)
    : partners;

  if (filteredPartners.length === 0) {
    return null;
  }

  return (
    <section className="py-5 md:py-6 px-4">
      <div className="container mx-auto">
        {/* <p className="text-2xs font-semibold text-center text-gray-300 uppercase tracking-[0.25em] mb-4">
          {title}
        </p> */}
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-14">
          {filteredPartners.map((partner, index) => (
            <motion.div
              key={partner._id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="flex-shrink-0"
            >
              <Link
                href={partner.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block opacity-40 hover:opacity-100 transition-opacity duration-300 cursor-pointer"
              >
                <div className="relative w-16 h-16 md:w-20 md:h-20 p-2 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300">
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    fill
                    className="object-contain p-1"
                    sizes="(max-width: 768px) 64px, 80px"
                  />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
