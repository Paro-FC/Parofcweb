"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Cancel01Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Share01Icon,
  ChampionIcon,
} from "@hugeicons/core-free-icons";
import { urlFor } from "@/sanity/lib/image";
import { PortableText, PortableTextComponents } from "@portabletext/react";
import { useState } from "react";

interface PlayerStats {
  appearances?: { value: number; season: string };
  cleanSheets?: { value: number; season: string };
  saves?: { value: number; season: string };
  goals?: { value: number; season: string };
  assists?: { value: number; season: string };
}

interface Honour {
  title: string;
  competition?: string;
  season?: string;
  country?: string;
}

interface PlayerPageProps {
  player: {
    _id: string;
    firstName: string;
    lastName: string;
    number: number;
    position: string;
    image: unknown;
    stats?: PlayerStats;
    slug: string;
    bio?: unknown[];
    placeOfBirth?: string;
    dateOfBirth?: string;
    height?: number;
    weight?: number;
    honours?: Honour[];
  };
  relatedPlayers: {
    _id: string;
    firstName: string;
    lastName: string;
    number: number;
    position: string;
    image: unknown;
    slug: string;
  }[];
}

const statLabels: Record<string, string> = {
  appearances: "Appearances",
  cleanSheets: "Clean Sheets",
  saves: "Saves",
  goals: "Goals",
  assists: "Assists",
};

const portableTextComponents: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null;
      return (
        <figure className="my-8">
          <div className="relative w-full aspect-video overflow-hidden">
            <Image
              src={urlFor(value).width(1200).height(675).url()}
              alt={value.alt || "Player image"}
              fill
              className="object-cover"
            />
          </div>
          {value.caption && (
            <figcaption className="mt-2 text-sm text-gray-400 italic">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
  },
  block: {
    h2: ({ children }) => (
      <h2 className="text-2xl font-black text-dark-charcoal mt-10 mb-4 uppercase tracking-tight">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl font-bold text-dark-charcoal mt-8 mb-3">
        {children}
      </h3>
    ),
    normal: ({ children }) => (
      <p className="text-base text-gray-600 leading-relaxed mb-4">{children}</p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-[3px] border-parofc-gold pl-5 my-8 text-lg text-gray-500 italic">
        {children}
      </blockquote>
    ),
  },
  marks: {
    link: ({ children, value }) => (
      <a
        href={value?.href}
        className="text-parofc-red hover:text-dark-charcoal underline transition-colors"
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    ),
    strong: ({ children }) => <strong className="font-bold">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
  },
};

export function PlayerPage({ player, relatedPlayers }: PlayerPageProps) {
  const [currentHonourPage, setCurrentHonourPage] = useState(0);
  const [showFullBio, setShowFullBio] = useState(false);
  const honoursPerPage = 4;

  const getBioPreview = () => {
    if (!player.bio || !Array.isArray(player.bio)) return [];
    const blocks = player.bio.filter((block: any) => block._type === "block");
    return blocks.slice(0, 1);
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/players/${player.slug}`;
    const shareData = {
      title: `${player.firstName} ${player.lastName} - Paro FC`,
      text: `Check out ${player.firstName} ${player.lastName} from Paro FC!`,
      url,
    };

    try {
      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(url);
        alert("Link copied to clipboard!");
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        try {
          await navigator.clipboard.writeText(url);
          alert("Link copied to clipboard!");
        } catch {
          // silently fail
        }
      }
    }
  };

  const totalHonourPages = player.honours
    ? Math.ceil(player.honours.length / honoursPerPage)
    : 0;

  const hasBioData =
    player.placeOfBirth || player.dateOfBirth || player.height || player.weight;

  return (
    <div className="min-h-screen bg-white">
      {/* Floating Close Button */}
      <Link
        href="/players"
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-14 h-14 bg-dark-charcoal hover:bg-parofc-red text-white rounded-full shadow-2xl flex items-center justify-center transition-all duration-200 hover:scale-110 cursor-pointer"
      >
        <HugeiconsIcon icon={Cancel01Icon} size={24} />
      </Link>

      {/* Hero — full-width image with player info overlay */}
      <section className="relative bg-dark-charcoal overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[60vh] md:min-h-[70vh]">
            {/* Left: Player info */}
            <div className="flex flex-col justify-center py-12 md:py-16 lg:py-24 relative z-10 order-2 lg:order-1">
              {/* Number */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <span className="text-[120px] md:text-[180px] lg:text-[220px] font-black text-white/[0.04] leading-none absolute -left-4 -top-8 lg:top-0 select-none pointer-events-none">
                  {player.number}
                </span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="relative"
              >
                <p className="text-[10px] font-bold text-parofc-gold uppercase tracking-[0.3em] mb-2">
                  #{player.number} / {player.position}
                </p>

                <h1 className="mb-6">
                  <span className="block text-lg md:text-xl text-white/60 font-normal">
                    {player.firstName}
                  </span>
                  <span className="block text-5xl md:text-6xl lg:text-7xl font-black text-white uppercase tracking-tight leading-[0.9]">
                    {player.lastName || player.firstName}
                  </span>
                </h1>

                {/* Bio data strip */}
                {hasBioData && (
                  <div className="flex flex-wrap gap-x-6 gap-y-2 mb-6">
                    {player.dateOfBirth && (
                      <div>
                        <span className="text-[9px] font-bold text-white/25 uppercase tracking-widest block">
                          DOB
                        </span>
                        <span className="text-sm text-white/70 font-medium">
                          {new Date(player.dateOfBirth).toLocaleDateString(
                            "en-GB",
                            {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            },
                          )}
                        </span>
                      </div>
                    )}
                    {player.placeOfBirth && (
                      <div>
                        <span className="text-[9px] font-bold text-white/25 uppercase tracking-widest block">
                          From
                        </span>
                        <span className="text-sm text-white/70 font-medium">
                          {player.placeOfBirth}
                        </span>
                      </div>
                    )}
                    {player.height && (
                      <div>
                        <span className="text-[9px] font-bold text-white/25 uppercase tracking-widest block">
                          Height
                        </span>
                        <span className="text-sm text-white/70 font-medium">
                          {player.height}cm
                        </span>
                      </div>
                    )}
                    {player.weight && (
                      <div>
                        <span className="text-[9px] font-bold text-white/25 uppercase tracking-widest block">
                          Weight
                        </span>
                        <span className="text-sm text-white/70 font-medium">
                          {player.weight}kg
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Actions */}
                <button
                  onClick={handleShare}
                  className="inline-flex items-center gap-2 text-xs font-bold text-white/30 hover:text-white/60 transition-colors cursor-pointer uppercase tracking-wider"
                >
                  <HugeiconsIcon icon={Share01Icon} size={14} />
                  Share
                </button>
              </motion.div>
            </div>

            {/* Right: Player image */}
            <div className="relative order-1 lg:order-2 flex items-end justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="relative w-full h-[400px] md:h-[500px] lg:h-full"
              >
                {player.image ? (
                  <Image
                    src={urlFor(player.image).width(900).height(1200).url()}
                    alt={`${player.firstName} ${player.lastName}`}
                    fill
                    className="object-contain object-bottom"
                    priority
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[200px] font-black text-white/5">
                      {player.number}
                    </span>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </div>

        {/* Diagonal pattern */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, transparent, transparent 20px, white 20px, white 21px)",
          }}
        />

        {/* Bottom accent */}
        <div className="h-1 bg-gradient-to-r from-parofc-red via-parofc-gold to-bronze" />
      </section>

      {/* Stats Section */}
      {player.stats && (
        <section className="border-b border-gray-100">
          <div className="container mx-auto px-4 py-10 md:py-14">
            <div className="flex flex-wrap justify-center gap-8 md:gap-16">
              {Object.entries(player.stats).map(([key, stat], index) => {
                if (!stat) return null;
                return (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.08, duration: 0.4 }}
                    className="text-center"
                  >
                    <div className="text-5xl md:text-6xl font-black text-dark-charcoal leading-none tabular-nums">
                      {stat.value}
                    </div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">
                      {statLabels[key] || key}
                    </div>
                    <div className="text-[10px] text-gray-300 mt-0.5">
                      {stat.season}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Bio Section */}
      {player.bio && player.bio.length > 0 && (
        <section className="border-b border-gray-100">
          <div className="container mx-auto px-4 py-10 md:py-14 max-w-3xl">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">
              Biography
            </h2>

            <div className="prose prose-lg max-w-none">
              {showFullBio ? (
                <PortableText
                  value={player.bio as any}
                  components={portableTextComponents}
                />
              ) : (
                <PortableText
                  value={getBioPreview() as any}
                  components={portableTextComponents}
                />
              )}
            </div>

            {player.bio.length > 1 && (
              <button
                onClick={() => setShowFullBio(!showFullBio)}
                className="mt-4 text-xs font-bold text-dark-charcoal hover:text-parofc-red transition-colors cursor-pointer uppercase tracking-widest inline-flex items-center gap-1"
              >
                {showFullBio ? "Show less" : "Read full bio"}
                <HugeiconsIcon
                  icon={ArrowRight01Icon}
                  size={12}
                  className={`transition-transform duration-200 ${showFullBio ? "rotate-90" : ""}`}
                />
              </button>
            )}
          </div>
        </section>
      )}

      {/* Honours */}
      {player.honours && player.honours.length > 0 && (
        <section className="bg-dark-charcoal">
          <div className="container mx-auto px-4 py-10 md:py-14">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xs font-bold text-white/30 uppercase tracking-widest">
                Honours
              </h2>
              {totalHonourPages > 1 && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      setCurrentHonourPage(Math.max(0, currentHonourPage - 1))
                    }
                    disabled={currentHonourPage === 0}
                    className="w-8 h-8 flex items-center justify-center border border-white/10 hover:border-white/30 disabled:opacity-20 disabled:cursor-not-allowed transition-colors cursor-pointer"
                    aria-label="Previous page"
                  >
                    <HugeiconsIcon
                      icon={ArrowLeft01Icon}
                      size={14}
                      className="text-white"
                    />
                  </button>
                  <span className="text-xs text-white/30 tabular-nums">
                    {currentHonourPage + 1}/{totalHonourPages}
                  </span>
                  <button
                    onClick={() =>
                      setCurrentHonourPage(
                        Math.min(totalHonourPages - 1, currentHonourPage + 1),
                      )
                    }
                    disabled={currentHonourPage === totalHonourPages - 1}
                    className="w-8 h-8 flex items-center justify-center border border-white/10 hover:border-white/30 disabled:opacity-20 disabled:cursor-not-allowed transition-colors cursor-pointer"
                    aria-label="Next page"
                  >
                    <HugeiconsIcon
                      icon={ArrowRight01Icon}
                      size={14}
                      className="text-white"
                    />
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {player.honours
                .slice(
                  currentHonourPage * honoursPerPage,
                  (currentHonourPage + 1) * honoursPerPage,
                )
                .map((honour, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className="border border-white/10 p-5 group hover:border-parofc-gold/30 transition-colors duration-200"
                  >
                    <HugeiconsIcon
                      icon={ChampionIcon}
                      size={16}
                      className="text-parofc-gold mb-3"
                    />
                    <p className="text-sm font-bold text-white leading-snug mb-2">
                      {honour.title}
                    </p>
                    {honour.competition && (
                      <p className="text-[10px] text-white/40 font-medium">
                        {honour.competition}
                      </p>
                    )}
                    {honour.season && (
                      <p className="text-[10px] text-white/40 font-medium">
                        {honour.season}
                      </p>
                    )}
                    {honour.country && (
                      <p className="text-[10px] text-white/40 font-medium">
                        {honour.country}
                      </p>
                    )}
                  </motion.div>
                ))}
            </div>
          </div>
        </section>
      )}

      {/* Related Players */}
      {relatedPlayers.length > 0 && (
        <section className="border-t border-gray-100">
          <div className="container mx-auto px-4 py-10 md:py-14">
            <div className="flex items-end justify-between mb-8">
              <h2 className="text-2xl md:text-3xl font-black text-dark-charcoal uppercase tracking-tight">
                More {player.position}s
              </h2>
              <Link
                href="/players"
                className="inline-flex items-center gap-1 text-xs font-bold text-gray-400 hover:text-dark-charcoal transition-colors cursor-pointer uppercase tracking-wider"
              >
                All Players
                <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
              {relatedPlayers.map((rp, index) => (
                <motion.div
                  key={rp._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.04, duration: 0.3 }}
                >
                  <Link
                    href={`/players/${rp.slug}`}
                    className="block group cursor-pointer"
                  >
                    <div className="relative aspect-[3/4] overflow-hidden bg-gray-50">
                      {rp.image ? (
                        <Image
                          src={urlFor(rp.image).width(400).height(533).url()}
                          alt={`${rp.firstName} ${rp.lastName}`}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-dark-charcoal to-parofc-red flex items-center justify-center">
                          <span className="text-5xl font-black text-white/10">
                            {rp.number}
                          </span>
                        </div>
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                      <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4">
                        <p className="text-[9px] font-bold text-parofc-gold uppercase tracking-widest mb-0.5">
                          #{rp.number}
                        </p>
                        <p className="text-white leading-tight">
                          <span className="text-xs font-normal">
                            {rp.firstName}{" "}
                          </span>
                          <span className="text-sm md:text-base font-black uppercase">
                            {rp.lastName || rp.firstName}
                          </span>
                        </p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
