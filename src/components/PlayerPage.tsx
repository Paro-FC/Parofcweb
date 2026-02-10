"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Calendar, MapPin, Ruler, Weight, Trophy, ChevronRight, X, Share2 } from "lucide-react"
import { urlFor } from "@/sanity/lib/image"
import { PortableText, PortableTextComponents } from "@portabletext/react"
import { useState } from "react"

interface PlayerStats {
  appearances?: { value: number; season: string }
  cleanSheets?: { value: number; season: string }
  saves?: { value: number; season: string }
  goals?: { value: number; season: string }
  assists?: { value: number; season: string }
}

interface Honour {
  title: string
  competition?: string
  season?: string
  country?: string
}

interface PlayerPageProps {
  player: {
    _id: string
    firstName: string
    lastName: string
    number: number
    position: string
    image: unknown
    stats?: PlayerStats
    slug: string
    bio?: unknown[]
    placeOfBirth?: string
    dateOfBirth?: string
    height?: number
    weight?: number
    honours?: Honour[]
  }
  relatedPlayers: {
    _id: string
    firstName: string
    lastName: string
    number: number
    position: string
    image: unknown
    slug: string
  }[]
}

const portableTextComponents: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null
      return (
        <figure className="my-8">
          <div className="relative w-full aspect-video rounded-lg overflow-hidden">
            <Image
              src={urlFor(value).width(1200).height(675).url()}
              alt={value.alt || "Player image"}
              fill
              className="object-cover"
            />
          </div>
          {value.caption && (
            <figcaption className="mt-2 text-center text-sm text-gray-500 italic">
              {value.caption}
            </figcaption>
          )}
        </figure>
      )
    },
  },
  block: {
    h2: ({ children }) => (
      <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-2xl font-bold text-gray-900 mt-10 mb-4">{children}</h3>
    ),
    normal: ({ children }) => (
      <p className="text-lg text-gray-700 leading-relaxed mb-5">{children}</p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-barca-red pl-6 my-10 italic text-xl text-gray-600">
        {children}
      </blockquote>
    ),
  },
  marks: {
    link: ({ children, value }) => (
      <a
        href={value?.href}
        className="text-barca-gold hover:text-bronze underline transition-colors"
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    ),
    strong: ({ children }) => <strong className="font-bold">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
  },
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function PlayerPage({ player, relatedPlayers }: PlayerPageProps) {
  const [currentHonourPage, setCurrentHonourPage] = useState(0)
  const [showFullBio, setShowFullBio] = useState(false)
  const honoursPerPage = 4

  // Get bio preview (first paragraph)
  const getBioPreview = () => {
    if (!player.bio || !Array.isArray(player.bio)) return []
    // Get first few blocks (first paragraph)
    const blocks = player.bio.filter((block: any) => block._type === 'block')
    return blocks.slice(0, 1) // Return first block only
  }

  const handleShare = async () => {
    const url = `${window.location.origin}/players/${player.slug}`
    const shareData = {
      title: `${player.firstName} ${player.lastName} - Paro FC`,
      text: `Check out ${player.firstName} ${player.lastName} from Paro FC!`,
      url: url,
    }

    try {
      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData)
      } else {
        await navigator.clipboard.writeText(url)
        alert("Link copied to clipboard!")
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        try {
          await navigator.clipboard.writeText(url)
          alert("Link copied to clipboard!")
        } catch (clipboardErr) {
          console.error("Failed to copy link:", clipboardErr)
        }
      }
    }
  }

  const totalHonourPages = player.honours
    ? Math.ceil(player.honours.length / honoursPerPage)
    : 0

  return (
    <div className="min-h-screen bg-white">

      {/* Main Hero Section - Two Column Layout */}
      <section className="bg-white">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Player Image (2/3 width) */}
            <div className="lg:col-span-2 relative">
              <div className="relative w-full h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden">
                {/* Colored Borders */}
                <div className="absolute inset-0 border-8 border-barca-blue border-r-0 border-t-0 z-10 pointer-events-none" />
                <div className="absolute inset-0 border-8 border-barca-red border-l-0 border-b-0 z-10 pointer-events-none" />
                
                {/* Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-r from-barca-blue to-barca-red" />
                
                {/* Player Image */}
                {player.image ? (
                  <div className="relative w-full h-full">
                    <Image
                      src={urlFor(player.image).width(1200).height(1600).url()}
                      alt={`${player.firstName} ${player.lastName}`}
                      fill
                      className="object-contain object-center"
                      priority
                    />
                  </div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-9xl text-white/20">{player.number}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Bio Preview (1/3 width) */}
            <div className="lg:col-span-1 flex flex-col justify-center">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                {player.position.toUpperCase()} FROM PARO FC
              </h1>
              
              {/* Bio Preview */}
              {player.bio && player.bio.length > 0 && (
                <div className="mb-6">
                  <div className="prose prose-lg max-w-none">
                    {showFullBio ? (
                      <PortableText value={player.bio as any} components={portableTextComponents} />
                    ) : (
                      <PortableText 
                        value={getBioPreview() as any} 
                        components={portableTextComponents} 
                      />
                    )}
                  </div>
                </div>
              )}
              
              {/* Read Full Bio Button */}
              {player.bio && player.bio.length > 0 && (
                <button
                  onClick={() => setShowFullBio(!showFullBio)}
                  className="text-lg font-bold text-gray-900 hover:text-barca-red transition-colors flex items-center gap-2 self-start"
                >
                  {showFullBio ? 'READ LESS' : 'READ FULL BIO'}
                  <span className="text-2xl">+</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Biographical Data Strip */}
      {(player.placeOfBirth || player.dateOfBirth || player.height || player.weight) && (
        <section className="bg-white border-t border-b border-gray-200 py-6">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {player.placeOfBirth && (
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold mb-2">Place of birth</p>
                  <p className="text-lg font-semibold text-gray-900">{player.placeOfBirth}</p>
                </div>
              )}
              {player.dateOfBirth && (
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold mb-2">Date of birth</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {new Date(player.dateOfBirth).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                  </p>
                </div>
              )}
              {player.weight && (
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold mb-2">Weight</p>
                  <p className="text-lg font-semibold text-gray-900">{player.weight}kg</p>
                </div>
              )}
              {player.height && (
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold mb-2">Height</p>
                  <p className="text-lg font-semibold text-gray-900">{player.height}cm</p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Player Content */}
      <motion.article
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="relative mx-auto max-w-4xl px-4 md:px-8 lg:px-12 pt-10 pb-8"
      >
        <div>

          {/* Statistics */}
          {player.stats && (
            <div className="mb-10 pb-6 border-b border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Statistics</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {Object.entries(player.stats).map(([key, stat]) => {
                  if (!stat) return null
                  return (
                    <div key={key} className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-xs text-gray-500 uppercase font-semibold mb-2">
                        {key === 'appearances' && 'APPEARANCES'}
                        {key === 'cleanSheets' && 'CLEAN SHEETS'}
                        {key === 'saves' && 'SAVES'}
                        {key === 'goals' && 'GOALS'}
                        {key === 'assists' && 'ASSISTS'}
                      </div>
                      <div className="text-4xl font-bold text-barca-red mb-1">
                        {stat.value}
                      </div>
                      <div className="text-sm text-gray-600">
                        {stat.season}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Full Biography (shown when expanded) */}
          {showFullBio && player.bio && player.bio.length > 0 && (
            <div className="mb-10">
              <div className="prose prose-lg max-w-none">
                <PortableText value={player.bio as any} components={portableTextComponents} />
              </div>
            </div>
          )}

          {/* Honours */}
          {player.honours && player.honours.length > 0 && (
            <div className="mb-10 pb-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Trophy className="text-barca-gold" size={28} />
                  Honours
                </h3>
                {totalHonourPages > 1 && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentHonourPage(Math.max(0, currentHonourPage - 1))}
                      disabled={currentHonourPage === 0}
                      className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight className="w-5 h-5 rotate-180" />
                    </button>
                    <span className="text-sm text-gray-600">
                      {currentHonourPage + 1} / {totalHonourPages}
                    </span>
                    <button
                      onClick={() => setCurrentHonourPage(Math.min(totalHonourPages - 1, currentHonourPage + 1))}
                      disabled={currentHonourPage === totalHonourPages - 1}
                      className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {player.honours
                  .slice(currentHonourPage * honoursPerPage, (currentHonourPage + 1) * honoursPerPage)
                  .map((honour, index) => (
                    <div
                      key={index}
                      className="p-4 bg-gradient-to-br from-barca-blue to-barca-red rounded-lg text-white"
                    >
                      <div className="text-sm font-semibold uppercase mb-2">{honour.title}</div>
                      {honour.competition && (
                        <div className="text-xs text-white/80 mb-1">{honour.competition}</div>
                      )}
                      {honour.season && (
                        <div className="text-xs text-white/80 mb-1">{honour.season}</div>
                      )}
                      {honour.country && (
                        <div className="text-xs text-white/80">{honour.country}</div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Share Button */}
          <div className="flex justify-end mb-10">
            <button 
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-gray-700 hover:bg-gray-200 transition-colors"
            >
              <Share2 size={20} />
              <span className="font-medium">Share</span>
            </button>
          </div>
        </div>
      </motion.article>

      {/* Related Players */}
      {relatedPlayers.length > 0 && (
        <section className="max-w-4xl mx-auto px-4 md:px-8 lg:px-12 py-12 md:py-16">
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Squad</h2>
            <Link
              href="/players"
              className="flex items-center gap-1 text-barca-gold hover:text-bronze transition-colors font-medium"
            >
              View all
              <ChevronRight size={20} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedPlayers.map((relatedPlayer, index) => (
              <motion.article
                key={relatedPlayer._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white overflow-hidden border border-gray-200 cursor-pointer group"
              >
                <Link href={`/players/${relatedPlayer.slug}`} className="block">
                  <div className="relative w-full h-48 overflow-hidden bg-gray-200">
                    {relatedPlayer.image ? (
                      <Image
                        src={urlFor(relatedPlayer.image).width(400).height(300).url()}
                        alt={`${relatedPlayer.firstName} ${relatedPlayer.lastName}`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                        <span className="text-4xl">{relatedPlayer.number}</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="text-sm text-gray-500 mb-1">#{relatedPlayer.number}</div>
                    <h3 className="font-bold text-gray-900 group-hover:text-barca-red transition-colors line-clamp-2">
                      {relatedPlayer.firstName} {relatedPlayer.lastName}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">{relatedPlayer.position}</p>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        </section>
      )}

      {/* Floating Close Button */}
      <Link
        href="/players"
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-14 h-14 bg-gray-900 hover:bg-gray-800 text-white rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110"
      >
        <X size={24} />
      </Link>
    </div>
  )
}

