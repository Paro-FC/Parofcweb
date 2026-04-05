"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Cancel01Icon,
  Search01Icon,
  Clock01Icon,
  AnalyticsUpIcon,
  UserCircleIcon,
  NewsIcon,
  Image01Icon,
} from "@hugeicons/core-free-icons";
import Image from "next/image";
import Link from "next/link";
import { sanityFetch } from "@/sanity/lib/live";
import {
  SEARCH_NEWS_QUERY,
  SEARCH_PLAYERS_QUERY,
  SEARCH_PHOTOS_QUERY,
} from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NewsResult {
  _id: string;
  title: string;
  slug: string;
  image: unknown;
  badge?: string;
  publishedAt: string;
  description?: string;
}

interface PlayerResult {
  _id: string;
  firstName: string;
  lastName: string;
  number: number;
  position: string;
  image: unknown;
  slug?: string;
}

interface PhotoResult {
  _id: string;
  title: string;
  coverImage: string;
  category: string;
  date: string;
  slug: string;
}

const recentSearches = ["Paro FC vs Thimphu", "Latest news", "Match schedule"];
const trendingSearches = [
  "BOB Premier League",
  "Goals",
  "Transfer news",
  "Match highlights",
];

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [newsResults, setNewsResults] = useState<NewsResult[]>([]);
  const [playerResults, setPlayerResults] = useState<PlayerResult[]>([]);
  const [photoResults, setPhotoResults] = useState<PhotoResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  const performSearch = useCallback(async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setNewsResults([]);
      setPlayerResults([]);
      setPhotoResults([]);
      setHasSearched(false);
      return;
    }

    setIsSearching(true);
    setHasSearched(true);

    try {
      const searchPattern = `*${searchTerm}*`;

      const [newsResult, playersResult, photosResult] = await Promise.all([
        sanityFetch({
          query: SEARCH_NEWS_QUERY,
          params: { searchTerm: searchPattern },
        }).catch(() => ({ data: [] })),
        sanityFetch({
          query: SEARCH_PLAYERS_QUERY,
          params: { searchTerm: searchPattern },
        }).catch(() => ({ data: [] })),
        sanityFetch({
          query: SEARCH_PHOTOS_QUERY,
          params: { searchTerm: searchPattern },
        }).catch(() => ({ data: [] })),
      ]);

      setNewsResults((newsResult.data as NewsResult[]) || []);
      setPlayerResults((playersResult.data as PlayerResult[]) || []);
      setPhotoResults((photosResult.data as PhotoResult[]) || []);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      performSearch(query);
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query, performSearch]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(query);
  };

  const handleQuickSearch = (term: string) => {
    setQuery(term);
    performSearch(term);
  };

  const totalResults =
    newsResults.length + playerResults.length + photoResults.length;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="w-full max-w-3xl mx-auto mt-20 bg-dark-charcoal rounded-2xl shadow-2xl overflow-hidden border border-white/5"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Search Header */}
          <form
            onSubmit={handleSearchSubmit}
            className="border-b border-white/5"
          >
            <div className="flex items-center px-6 py-4">
              <HugeiconsIcon
                icon={Search01Icon}
                size={20}
                className="text-white/30 mr-4"
              />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search news, players, photos..."
                className="flex-1 text-lg text-white placeholder-white/30 outline-none bg-transparent"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setNewsResults([]);
                    setPlayerResults([]);
                    setPhotoResults([]);
                    setHasSearched(false);
                  }}
                  className="p-2 hover:bg-white/5 rounded-full transition-colors"
                >
                  <HugeiconsIcon
                    icon={Cancel01Icon}
                    size={20}
                    className="text-white/40"
                  />
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="ml-2 px-2 py-1 bg-white/5 rounded text-xs text-white/30 font-medium hover:bg-white/10 transition-colors"
              >
                ESC
              </button>
            </div>
          </form>

          {/* Content Area */}
          <div className="max-h-[60vh] overflow-y-auto">
            {/* Loading State */}
            {isSearching && (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-parofc-gold"></div>
              </div>
            )}

            {/* No Query - Show Suggestions */}
            {!query && !isSearching && (
              <div className="p-6">
                {/* Recent Searches */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 text-xs font-semibold text-white/30 uppercase tracking-widest mb-3">
                    <HugeiconsIcon icon={Clock01Icon} size={14} />
                    Recent Searches
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((term) => (
                      <button
                        key={term}
                        onClick={() => handleQuickSearch(term)}
                        className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-full text-sm text-white/60 transition-colors"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Trending Searches */}
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-white/30 uppercase tracking-widest mb-3">
                    <HugeiconsIcon icon={AnalyticsUpIcon} size={14} />
                    Trending
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {trendingSearches.map((term) => (
                      <button
                        key={term}
                        onClick={() => handleQuickSearch(term)}
                        className="px-4 py-2 bg-parofc-gold/10 hover:bg-parofc-gold/20 rounded-full text-sm text-parofc-gold font-medium transition-colors"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quick Links */}
                <div className="mt-8 pt-6 border-t border-white/5">
                  <div className="text-xs font-semibold text-white/30 uppercase tracking-widest mb-4">
                    Quick Links
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <Link
                      href="/news"
                      onClick={onClose}
                      className="flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
                    >
                      <HugeiconsIcon
                        icon={NewsIcon}
                        size={20}
                        className="text-parofc-red"
                      />
                      <span className="text-sm font-medium text-white/60">
                        News
                      </span>
                    </Link>
                    <Link
                      href="/players"
                      onClick={onClose}
                      className="flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
                    >
                      <HugeiconsIcon
                        icon={UserCircleIcon}
                        size={20}
                        className="text-parofc-gold"
                      />
                      <span className="text-sm font-medium text-white/60">
                        Players
                      </span>
                    </Link>
                    <Link
                      href="/photos"
                      onClick={onClose}
                      className="flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
                    >
                      <HugeiconsIcon
                        icon={Image01Icon}
                        size={20}
                        className="text-parofc-gold"
                      />
                      <span className="text-sm font-medium text-white/60">
                        Photos
                      </span>
                    </Link>
                    <Link
                      href="/standings"
                      onClick={onClose}
                      className="flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
                    >
                      <HugeiconsIcon
                        icon={AnalyticsUpIcon}
                        size={20}
                        className="text-parofc-gold"
                      />
                      <span className="text-sm font-medium text-white/60">
                        Standings
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Search Results */}
            {query && !isSearching && hasSearched && (
              <div className="p-6">
                {totalResults === 0 ? (
                  <div className="text-center py-12">
                    <HugeiconsIcon
                      icon={Search01Icon}
                      size={48}
                      className="text-white/10 mx-auto mb-4"
                    />
                    <p className="text-white/50 text-lg">
                      No results found for &ldquo;{query}&rdquo;
                    </p>
                    <p className="text-white/30 text-sm mt-2">
                      Try different keywords or check spelling
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* News Results */}
                    {newsResults.length > 0 && (
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-xs font-semibold text-white/30 uppercase tracking-widest flex items-center gap-2">
                            <HugeiconsIcon icon={NewsIcon} size={14} />
                            News ({newsResults.length})
                          </h3>
                          <Link
                            href="/news"
                            onClick={onClose}
                            className="text-sm text-parofc-gold hover:text-parofc-gold/80 font-medium"
                          >
                            View all →
                          </Link>
                        </div>
                        <div className="space-y-2">
                          {newsResults.map((news) => (
                            <Link
                              key={news._id}
                              href={`/news/${news.slug}`}
                              onClick={onClose}
                              className="flex items-center gap-4 p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors group"
                            >
                              <div className="w-16 h-16 rounded-lg overflow-hidden bg-white/5 flex-shrink-0">
                                {news.image ? (
                                  <Image
                                    src={urlFor(news.image)
                                      .width(128)
                                      .height(128)
                                      .url()}
                                    alt={news.title}
                                    width={64}
                                    height={64}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <HugeiconsIcon
                                      icon={NewsIcon}
                                      size={24}
                                      className="text-white/20"
                                    />
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                {news.badge && (
                                  <span className="inline-block bg-parofc-red text-white text-xs font-semibold px-2 py-0.5 rounded mb-1">
                                    {news.badge}
                                  </span>
                                )}
                                <h4 className="font-semibold text-white/80 line-clamp-1 group-hover:text-parofc-gold transition-colors">
                                  {news.title}
                                </h4>
                                {news.description && (
                                  <p className="text-sm text-white/30 line-clamp-1">
                                    {news.description}
                                  </p>
                                )}
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Players Results */}
                    {playerResults.length > 0 && (
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-xs font-semibold text-white/30 uppercase tracking-widest flex items-center gap-2">
                            <HugeiconsIcon icon={UserCircleIcon} size={14} />
                            Players ({playerResults.length})
                          </h3>
                          <Link
                            href="/players"
                            onClick={onClose}
                            className="text-sm text-parofc-gold hover:text-parofc-gold/80 font-medium"
                          >
                            View all →
                          </Link>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {playerResults.map((player) => (
                            <Link
                              key={player._id}
                              href={`/players/${player.slug || player._id}`}
                              onClick={onClose}
                              className="flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors group"
                            >
                              <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-parofc-red to-parofc-gold flex-shrink-0">
                                {player.image ? (
                                  <Image
                                    src={urlFor(player.image)
                                      .width(96)
                                      .height(96)
                                      .url()}
                                    alt={`${player.firstName} ${player.lastName}`}
                                    width={48}
                                    height={48}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <HugeiconsIcon
                                      icon={UserCircleIcon}
                                      size={24}
                                      className="text-white"
                                    />
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-white/80 line-clamp-1 group-hover:text-parofc-gold transition-colors">
                                  {player.firstName} {player.lastName}
                                </h4>
                                <p className="text-sm text-white/30">
                                  #{player.number} • {player.position}
                                </p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Photos Results */}
                    {photoResults.length > 0 && (
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-xs font-semibold text-white/30 uppercase tracking-widest flex items-center gap-2">
                            <HugeiconsIcon icon={Image01Icon} size={14} />
                            Photos ({photoResults.length})
                          </h3>
                          <Link
                            href="/photos"
                            onClick={onClose}
                            className="text-sm text-parofc-gold hover:text-parofc-gold/80 font-medium"
                          >
                            View all →
                          </Link>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {photoResults.map((photo) => (
                            <Link
                              key={photo._id}
                              href="/photos"
                              onClick={onClose}
                              className="group relative aspect-video rounded-xl overflow-hidden bg-white/5"
                            >
                              {photo.coverImage ? (
                                <Image
                                  src={photo.coverImage}
                                  alt={photo.title}
                                  fill
                                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <HugeiconsIcon
                                    icon={Image01Icon}
                                    size={32}
                                    className="text-white/20"
                                  />
                                </div>
                              )}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                              <div className="absolute bottom-2 left-2 right-2">
                                <h4 className="text-white text-sm font-semibold line-clamp-1">
                                  {photo.title}
                                </h4>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Bottom accent */}
          <div className="h-px bg-gradient-to-r from-parofc-red via-parofc-gold to-bronze" />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
