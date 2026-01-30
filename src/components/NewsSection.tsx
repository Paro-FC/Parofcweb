"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { urlFor } from "@/sanity/lib/image"

interface NewsItem {
  _id: string
  image: unknown
  title: string
  badge: string
  publishedAt: string
  description?: string
  slug: string
}

// Fallback data for when Sanity content is not available
const fallbackNews: NewsItem[] = [
  {
    _id: "1",
    image: null,
    title: "Mobility requirements and plan for Paro FC v Thimphu City",
    badge: "",
    publishedAt: new Date().toISOString(),
    slug: "mobility-requirements",
  },
  {
    _id: "2",
    image: null,
    title: "Agreement for the transfer of player to partner club",
    badge: "TRANSFERS",
    publishedAt: new Date().toISOString(),
    description: "The Club retains a percentage of any future sale...",
    slug: "transfer-agreement",
  },
]

function formatDate(dateString: string) {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  
  if (diffHours < 1) return 'Just now'
  if (diffHours < 24) return `${diffHours} hr${diffHours > 1 ? 's' : ''} ago`
  
  return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: '2-digit' })
}

export function NewsSection({ news }: { news?: NewsItem[] }) {
  const newsItems = news && news.length > 0 ? news : fallbackNews
  
  return (
    <section className="py-16 px-4 bg-white">
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold uppercase tracking-tight text-gray-900 mb-12 text-center">
          PARO FC NEWS
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newsItems.map((item, index) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="bg-white overflow-hidden border border-gray-200 cursor-pointer group"
            >
              <a href={`/news/${item.slug}`} className="block">
                <div className="relative w-full h-36 overflow-hidden bg-gray-200">
                  {item.image ? (
                  <Image
                      src={urlFor(item.image).width(400).height(300).url()}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                      <span className="text-4xl">📰</span>
                    </div>
                  )}
                </div>

                <div className="p-4 bg-white transition-transform duration-300 ease-in-out group-hover:-translate-y-4">
                  {item.badge && (
                    <span className="inline-block bg-barca-red text-white text-xs font-semibold px-2 py-1 mb-2 uppercase">
                      {item.badge}
                    </span>
                  )}

                  <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2 leading-tight">
                    {item.title}
                  </h3>

                  {item.description && (
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {item.description}
                    </p>
                  )}

                  <p className="text-xs text-gray-500 mt-2">{formatDate(item.publishedAt)}</p>
                </div>
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
