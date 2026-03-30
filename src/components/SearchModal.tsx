"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Search, TrendingUp, User, Newspaper, Camera, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { sanityFetch } from "@/sanity/lib/live"
import { SEARCH_NEWS_QUERY, SEARCH_PLAYERS_QUERY, SEARCH_PHOTOS_QUERY } from "@/sanity/lib/queries"
import { urlFor } from "@/sanity/lib/image"

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

interface NewsResult {
  _id: string
  title: string
  slug: string
  image: unknown
  badge?: string
  publishedAt: string
  description?: string
}

interface PlayerResult {
  _id: string
  firstName: string
  lastName: string
  number: number
  position: string
  image: unknown
  slug?: string
}

interface PhotoResult {
  _id: string
  title: string
  coverImage: string
  category: string
  date: string
  slug: string
}

const trendingSearches = ["BOB Premier League", "Goals", "Transfer news", "Highlights"]

const quickLinks = [
  { href: "/news", label: "News", icon: Newspaper },
  { href: "/players", label: "Players", icon: User },
  { href: "/photos", label: "Photos", icon: Camera },
  { href: "/standings", label: "Standings", icon: TrendingUp },
]

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [newsResults, setNewsResults] = useState<NewsResult[]>([])
  const [playerResults, setPlayerResults] = useState<PlayerResult[]>([])
  const [photoResults, setPhotoResults] = useState<PhotoResult[]>([])
  const [hasSearched, setHasSearched] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
    if (!isOpen) {
      setQuery("")
      setNewsResults([])
      setPlayerResults([])
      setPhotoResults([])
      setHasSearched(false)
    }
  }, [isOpen])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown)
      document.body.style.overflow = "hidden"
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = ""
    }
  }, [isOpen, onClose])

  const performSearch = useCallback(async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setNewsResults([])
      setPlayerResults([])
      setPhotoResults([])
      setHasSearched(false)
      return
    }

    setIsSearching(true)
    setHasSearched(true)

    try {
      const searchPattern = `*${searchTerm}*`
      const [newsResult, playersResult, photosResult] = await Promise.all([
        sanityFetch({ query: SEARCH_NEWS_QUERY, params: { searchTerm: searchPattern } }).catch(() => ({ data: [] })),
        sanityFetch({ query: SEARCH_PLAYERS_QUERY, params: { searchTerm: searchPattern } }).catch(() => ({ data: [] })),
        sanityFetch({ query: SEARCH_PHOTOS_QUERY, params: { searchTerm: searchPattern } }).catch(() => ({ data: [] })),
      ])

      setNewsResults((newsResult.data as NewsResult[]) || [])
      setPlayerResults((playersResult.data as PlayerResult[]) || [])
      setPhotoResults((photosResult.data as PhotoResult[]) || [])
    } catch (error) {
      console.error("Search error:", error)
    } finally {
      setIsSearching(false)
    }
  }, [])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => performSearch(query), 300)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [query, performSearch])

  const handleQuickSearch = (term: string) => {
    setQuery(term)
    performSearch(term)
  }

  const totalResults = newsResults.length + playerResults.length + photoResults.length

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        className="fixed inset-0 z-[100] bg-black/50"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-2xl mx-auto mt-12 md:mt-20 bg-white shadow-2xl overflow-hidden mx-4 sm:mx-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Search Input */}
          <form
            onSubmit={(e) => { e.preventDefault(); performSearch(query) }}
            className="border-b border-gray-100"
          >
            <div className="flex items-center h-14 px-5">
              <Search className="w-4 h-4 text-gray-300 mr-3 flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search news, players, photos..."
                className="flex-1 text-sm text-dark-charcoal placeholder-gray-300 outline-none bg-transparent"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery("")
                    setNewsResults([])
                    setPlayerResults([])
                    setPhotoResults([])
                    setHasSearched(false)
                    inputRef.current?.focus()
                  }}
                  className="w-6 h-6 flex items-center justify-center text-gray-300 hover:text-dark-charcoal transition-colors cursor-pointer mr-2"
                >
                  <X size={14} />
                </button>
              )}
              <kbd className="hidden sm:inline-flex text-[9px] font-bold text-gray-300 border border-gray-200 px-1.5 py-0.5 uppercase tracking-wider">
                Esc
              </kbd>
            </div>
          </form>

          {/* Content */}
          <div className="max-h-[65vh] overflow-y-auto">
            {/* Loading */}
            {isSearching && (
              <div className="flex items-center justify-center py-16">
                <div className="w-6 h-6 border-2 border-barca-gold border-t-transparent rounded-full animate-spin" />
              </div>
            )}

            {/* No Query — Suggestions */}
            {!query && !isSearching && (
              <div className="p-5">
                {/* Trending */}
                <div className="mb-6">
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                    Trending
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {trendingSearches.map((term) => (
                      <button
                        key={term}
                        onClick={() => handleQuickSearch(term)}
                        className="px-3 py-1.5 bg-gray-50 hover:bg-dark-charcoal hover:text-white text-xs font-medium text-gray-500 transition-colors duration-150 cursor-pointer"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quick Links */}
                <div>
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                    Quick Links
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                    {quickLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={onClose}
                        className="flex items-center gap-2 px-3 py-2.5 bg-gray-50 hover:bg-dark-charcoal hover:text-white text-xs font-bold text-gray-500 transition-colors duration-150 cursor-pointer"
                      >
                        <link.icon size={14} />
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Results */}
            {query && !isSearching && hasSearched && (
              <div>
                {totalResults === 0 ? (
                  <div className="text-center py-16 px-5">
                    <Search className="w-6 h-6 text-gray-200 mx-auto mb-3" />
                    <p className="text-sm font-bold text-dark-charcoal mb-1">
                      No results for &ldquo;{query}&rdquo;
                    </p>
                    <p className="text-xs text-gray-400">
                      Try different keywords
                    </p>
                  </div>
                ) : (
                  <div>
                    {/* News */}
                    {newsResults.length > 0 && (
                      <div className="px-5 py-4">
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                            News
                          </p>
                          <Link
                            href="/news"
                            onClick={onClose}
                            className="text-[9px] font-bold text-gray-400 hover:text-dark-charcoal uppercase tracking-widest transition-colors cursor-pointer"
                          >
                            View all
                          </Link>
                        </div>
                        <div className="space-y-1">
                          {newsResults.map((news) => (
                            <Link
                              key={news._id}
                              href={`/news/${news.slug}`}
                              onClick={onClose}
                              className="flex items-center gap-3 py-2.5 group cursor-pointer"
                            >
                              <div className="w-10 h-10 bg-gray-50 flex-shrink-0 overflow-hidden">
                                {news.image ? (
                                  <Image
                                    src={urlFor(news.image).width(80).height(80).url()}
                                    alt={news.title}
                                    width={40}
                                    height={40}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <Newspaper size={14} className="text-gray-300" />
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                {news.badge && (
                                  <span className="text-[9px] font-bold text-barca-red uppercase tracking-widest mr-2">
                                    {news.badge}
                                  </span>
                                )}
                                <h4 className="text-xs font-bold text-dark-charcoal line-clamp-1 group-hover:text-barca-red transition-colors">
                                  {news.title}
                                </h4>
                              </div>
                              <ArrowRight size={12} className="text-gray-200 group-hover:text-dark-charcoal transition-colors flex-shrink-0" />
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Players */}
                    {playerResults.length > 0 && (
                      <div className="px-5 py-4 border-t border-gray-50">
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                            Players
                          </p>
                          <Link
                            href="/players"
                            onClick={onClose}
                            className="text-[9px] font-bold text-gray-400 hover:text-dark-charcoal uppercase tracking-widest transition-colors cursor-pointer"
                          >
                            View all
                          </Link>
                        </div>
                        <div className="space-y-1">
                          {playerResults.map((player) => (
                            <Link
                              key={player._id}
                              href={`/players/${player.slug || player._id}`}
                              onClick={onClose}
                              className="flex items-center gap-3 py-2.5 group cursor-pointer"
                            >
                              <div className="w-10 h-10 bg-gradient-to-br from-dark-charcoal to-barca-red flex-shrink-0 overflow-hidden">
                                {player.image ? (
                                  <Image
                                    src={urlFor(player.image).width(80).height(80).url()}
                                    alt={`${player.firstName} ${player.lastName}`}
                                    width={40}
                                    height={40}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <span className="text-[10px] font-black text-white/30">
                                      {player.number}
                                    </span>
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-xs font-bold text-dark-charcoal line-clamp-1 group-hover:text-barca-red transition-colors">
                                  {player.firstName}{" "}
                                  <span className="uppercase">
                                    {player.lastName}
                                  </span>
                                </h4>
                                <p className="text-[10px] text-gray-400">
                                  #{player.number} · {player.position}
                                </p>
                              </div>
                              <ArrowRight size={12} className="text-gray-200 group-hover:text-dark-charcoal transition-colors flex-shrink-0" />
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Photos */}
                    {photoResults.length > 0 && (
                      <div className="px-5 py-4 border-t border-gray-50">
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                            Photos
                          </p>
                          <Link
                            href="/photos"
                            onClick={onClose}
                            className="text-[9px] font-bold text-gray-400 hover:text-dark-charcoal uppercase tracking-widest transition-colors cursor-pointer"
                          >
                            View all
                          </Link>
                        </div>
                        <div className="grid grid-cols-3 gap-1.5">
                          {photoResults.map((photo) => (
                            <Link
                              key={photo._id}
                              href="/photos"
                              onClick={onClose}
                              className="group relative aspect-[16/10] overflow-hidden bg-gray-50 cursor-pointer"
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
                                  <Camera size={14} className="text-gray-300" />
                                </div>
                              )}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                              <div className="absolute bottom-1.5 left-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                <p className="text-white text-[9px] font-bold line-clamp-1">
                                  {photo.title}
                                </p>
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
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
