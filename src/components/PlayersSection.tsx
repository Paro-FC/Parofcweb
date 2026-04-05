"use client";

import { motion } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { useState, useRef, useEffect } from "react";
import { PlayerCard, type PlayerCardPlayer } from "./PlayerCard";
import Link from "next/link";

const fallbackPlayers: PlayerCardPlayer[] = [
  {
    _id: "1",
    number: 13,
    firstName: "Tshering",
    lastName: "Dorji",
    position: "Goalkeeper",
    image: null,
    stats: {
      appearances: { value: 22, season: "2025/2026 Season" },
      cleanSheets: { value: 10, season: "2025/2026 Season" },
      saves: { value: 64, season: "2025/2026 Season" },
    },
  },
  {
    _id: "2",
    number: 16,
    firstName: "Karma",
    lastName: "Wangchuk",
    position: "Midfielder",
    image: null,
    stats: {
      appearances: { value: 18, season: "2025/2026 Season" },
      goals: { value: 5, season: "2025/2026 Season" },
      assists: { value: 3, season: "2025/2026 Season" },
    },
  },
  {
    _id: "3",
    number: 9,
    firstName: "Chencho",
    lastName: "Gyeltshen",
    position: "Forward",
    image: null,
    stats: {
      appearances: { value: 25, season: "2025/2026 Season" },
      goals: { value: 15, season: "2025/2026 Season" },
      assists: { value: 8, season: "2025/2026 Season" },
    },
  },
];

export function PlayersSection({ players }: { players?: PlayerCardPlayer[] }) {
  const playerList = players && players.length > 0 ? players : fallbackPlayers;
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [cardWidth, setCardWidth] = useState(0);
  const gap = 20;

  useEffect(() => {
    const updateCardWidth = () => {
      if (containerRef.current && scrollContainerRef.current) {
        const containerWidth = scrollContainerRef.current.clientWidth;
        const isMobile = window.innerWidth < 768;
        const cardsPerView = isMobile ? 1 : 4;
        const calculatedWidth =
          (containerWidth - gap * (cardsPerView - 1)) / cardsPerView;
        setCardWidth(calculatedWidth);
      }
    };

    updateCardWidth();
    window.addEventListener("resize", updateCardWidth);
    return () => window.removeEventListener("resize", updateCardWidth);
  }, []);

  const scrollAmount = cardWidth + gap;

  const scrollLeft = () => {
    if (scrollContainerRef.current && cardWidth > 0) {
      const isMobile = window.innerWidth < 768;
      const cardsToScroll = isMobile ? 1 : 4;
      const scrollBy = scrollAmount * cardsToScroll;
      const newPosition = Math.max(0, scrollPosition - scrollBy);
      setScrollPosition(newPosition);
      scrollContainerRef.current.scrollTo({
        left: newPosition,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current && cardWidth > 0) {
      const isMobile = window.innerWidth < 768;
      const cardsToScroll = isMobile ? 1 : 4;
      const scrollBy = scrollAmount * cardsToScroll;
      const maxScroll =
        scrollContainerRef.current.scrollWidth -
        scrollContainerRef.current.clientWidth;
      const newPosition = Math.min(maxScroll, scrollPosition + scrollBy);
      setScrollPosition(newPosition);
      scrollContainerRef.current.scrollTo({
        left: newPosition,
        behavior: "smooth",
      });
    }
  };

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    const checkScroll = () => {
      if (scrollContainerRef.current) {
        const {
          scrollLeft: sl,
          scrollWidth,
          clientWidth,
        } = scrollContainerRef.current;
        setCanScrollLeft(sl > 0);
        setCanScrollRight(sl < scrollWidth - clientWidth - 10);
      }
    };

    checkScroll();
    const interval = setInterval(checkScroll, 100);
    return () => clearInterval(interval);
  }, [scrollPosition]);

  return (
    <section className="py-16 md:py-24 px-4 bg-gradient-parofc relative overflow-hidden">
      {/* Subtle diagonal pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(-45deg, transparent, transparent 40px, white 40px, white 41px)",
        }}
      />

      <div className="container mx-auto relative z-10" ref={containerRef}>
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black uppercase tracking-tight text-white leading-none"
          >
            Players
          </motion.h3>

          <div className="flex items-center gap-3">
            <Link
              href="/players"
              className="hidden md:inline-flex items-center gap-2 text-sm font-bold text-white/60 hover:text-parofc-gold transition-colors duration-200 uppercase tracking-wider cursor-pointer mr-4"
            >
              All Players
              <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
            </Link>

            <button
              onClick={scrollLeft}
              disabled={!canScrollLeft}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 border cursor-pointer ${
                canScrollLeft
                  ? "border-white/20 hover:border-parofc-gold hover:bg-white/5 opacity-100"
                  : "border-white/10 opacity-30 pointer-events-none"
              }`}
              aria-label="Scroll left"
            >
              <HugeiconsIcon
                icon={ArrowLeft01Icon}
                size={20}
                className="text-white"
              />
            </button>
            <button
              onClick={scrollRight}
              disabled={!canScrollRight}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 border cursor-pointer ${
                canScrollRight
                  ? "border-white/20 hover:border-parofc-gold hover:bg-white/5 opacity-100"
                  : "border-white/10 opacity-30 pointer-events-none"
              }`}
              aria-label="Scroll right"
            >
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                size={20}
                className="text-white"
              />
            </button>
          </div>
        </div>

        <div
          ref={scrollContainerRef}
          className="flex gap-5 overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory"
          style={
            {
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              gap: `${gap}px`,
            } as React.CSSProperties
          }
          onScroll={(e) => {
            const target = e.target as HTMLDivElement;
            setScrollPosition(target.scrollLeft);
          }}
        >
          {playerList.map((player, index) => (
            <div
              key={player._id || player.id || index}
              className="flex-shrink-0 snap-start"
              style={{
                width: cardWidth || "100%",
                minWidth: cardWidth || "100%",
                maxWidth: cardWidth || "100%",
              }}
            >
              <PlayerCard player={player} index={index} />
            </div>
          ))}
        </div>

        {/* Scroll indicator dots */}
        <div className="flex justify-center gap-1.5 mt-8">
          {playerList.length > 4 &&
            Array.from({
              length: Math.ceil(playerList.length / 4),
            }).map((_, index) => (
              <div
                key={index}
                className={`h-1 rounded-full transition-all duration-300 ${
                  index === 0 ? "bg-parofc-gold w-6" : "bg-white/20 w-3"
                }`}
              />
            ))}
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `,
        }}
      />
    </section>
  );
}
