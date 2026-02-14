"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { urlFor } from "@/sanity/lib/image"
import { useMemo } from "react"

interface NewsItem {
  _id: string
  image: unknown
  title: string
  badge?: string
  publishedAt: string
  slug: string
}

interface HeroProps {
  news?: NewsItem[]
}

// Fallback data
const fallbackNews: NewsItem = {
  _id: "1",
  image: null,
  title: "WHEN AND WHERE TO WATCH BARÇA V FC COPENHAGEN",
  badge: "FIRST TEAM",
  publishedAt: new Date().toISOString(),
  slug: "",
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: '2-digit' })
}

export function Hero({ news }: HeroProps) {
  // Get the first/latest news item
  const newsItem = news && news.length > 0 ? news[0] : fallbackNews
  
  // Memoize date formatting
  const formattedDate = useMemo(() => {
    return formatDate(newsItem.publishedAt)
  }, [newsItem.publishedAt])

  return (
    <section 
      className="relative py-20 px-4 overflow-hidden"
    >
      {newsItem.image ? (
        <Image
          src={urlFor(newsItem.image).width(1920).height(1080).url()}
          alt={newsItem.title}
          fill
          className="object-cover"
          priority
        />
      ) : (
      <Image
        src="/assets/Timezones K Benhavn.webp"
        alt="Hero Background"
        fill
        className="object-cover"
        priority
      />
      )}
      <div className="absolute inset-0 bg-black/60" />
      
      <div className="container mx-auto relative z-10 pt-16 md:pt-32 lg:pt-40">
        {newsItem.slug ? (
          <Link href={`/news/${newsItem.slug}`} className="block">
            {/* Main Headline */}
            <motion.h1
              className="text-3xl md:text-5xl lg:text-6xl font-bold uppercase tracking-wider mb-6 text-center text-white mt-12 md:mt-16 underline"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              {newsItem.title}
            </motion.h1>

            {/* Metadata */}
            <motion.div
              className="flex justify-center items-center gap-3 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="w-3 h-3 bg-orange-500"></div>
              {newsItem.badge && (
                <span className="text-white text-sm font-semibold uppercase">{newsItem.badge}</span>
              )}
              <span className="text-white text-sm">{formattedDate}</span>
            </motion.div>
          </Link>
        ) : (
          <>
        {/* Main Headline */}
        <motion.h1
          className="text-3xl md:text-5xl lg:text-6xl font-bold uppercase tracking-wider mb-6 text-center text-white mt-12 md:mt-16 underline"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
              {newsItem.title}
        </motion.h1>

        {/* Metadata */}
        <motion.div
          className="flex justify-center items-center gap-3 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="w-3 h-3 bg-orange-500"></div>
              {newsItem.badge && (
                <span className="text-white text-sm font-semibold uppercase">{newsItem.badge}</span>
              )}
              <span className="text-white text-sm">{formattedDate}</span>
        </motion.div>
          </>
        )}
      </div>
    </section>
  )
}

