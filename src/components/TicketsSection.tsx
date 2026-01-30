"use client"

import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react"
import { useEffect, useRef, useState, type CSSProperties } from "react"

interface Ticket {
  id: number
  title: string
  image: string
}

const tickets: Ticket[] = [
  {
    id: 1,
    title: "MEN'S FOOTBALL",
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=300&fit=crop",
  },
  {
    id: 2,
    title: "BARÇA MUSEUM",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
  },
  {
    id: 3,
    title: "BARÇA BUSINESS",
    image: "https://images.unsplash.com/photo-1566577134770-3d85bb3a9cc4?w=400&h=300&fit=crop",
  },
  {
    id: 4,
    title: "BARÇA TOURS",
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=300&fit=crop",
  },
  {
    id: 5,
    title: "BASKETBALL",
    image: "https://images.unsplash.com/photo-1519869325932-5ae42e1f8eaf?w=400&h=300&fit=crop",
  },
  {
    id: 6,
    title: "WOMEN'S FOOTBALL",
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=300&fit=crop",
  },
  {
    id: 7,
    title: "FUTSAL",
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=300&fit=crop",
  },
]

export function TicketsSection() {
  const [scrollPosition, setScrollPosition] = useState(0)
  const cardWidth = 180
  const gap = 20
  const scrollAmount = cardWidth + gap
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const getMaxScroll = () => {
    if (!scrollContainerRef.current) return 0
    const { scrollWidth, clientWidth } = scrollContainerRef.current
    return Math.max(0, scrollWidth - clientWidth)
  }

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const newPosition = Math.max(0, scrollPosition - scrollAmount)
      setScrollPosition(newPosition)
      scrollContainerRef.current.scrollTo({
        left: newPosition,
        behavior: "smooth",
      })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const maxScroll = getMaxScroll()
      const newPosition = Math.min(maxScroll, scrollPosition + scrollAmount)
      setScrollPosition(newPosition)
      scrollContainerRef.current.scrollTo({
        left: newPosition,
        behavior: "smooth",
      })
    }
  }

  useEffect(() => {
    const checkScroll = () => {
      if (scrollContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
        setCanScrollLeft(scrollLeft > 0)
        setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
      }
    }

    checkScroll()
    const interval = setInterval(checkScroll, 100)

    return () => clearInterval(interval)
  }, [scrollPosition])

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        <div className="flex items-center mb-8">
          <h3 className="flex-1 text-center text-4xl font-bold uppercase tracking-tight text-gray-900">
            Barça Tickets
          </h3>
          <div className="flex items-center gap-4">
            <button
              onClick={scrollLeft}
              disabled={!canScrollLeft}
              className="w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center border border-gray-300 hover:border-barca-gold"
            >
              <ChevronLeft className="w-6 h-6 text-gray-900" />
            </button>
            <button
              onClick={scrollRight}
              disabled={!canScrollRight}
              className="w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center border border-gray-300 hover:border-barca-gold"
            >
              <ChevronRight className="w-6 h-6 text-gray-900" />
            </button>
          </div>
        </div>

        <div className="relative overflow-hidden">
          {/* Left Blur Gradient */}
          <div
            className={`absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none transition-opacity duration-300 ${
              canScrollLeft ? "opacity-100" : "opacity-0"
            }`}
            style={{
              background:
                "linear-gradient(to right, rgba(255,255,255,1), rgba(255,255,255,0))",
            }}
          />

          {/* Right Blur Gradient */}
          <div
            className={`absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none transition-opacity duration-300 ${
              canScrollRight ? "opacity-100" : "opacity-0"
            }`}
            style={{
              background:
                "linear-gradient(to left, rgba(255,255,255,1), rgba(255,255,255,0))",
            }}
          />

          <div
            ref={scrollContainerRef}
            className="flex gap-5 overflow-x-auto overflow-y-hidden scrollbar-hide scroll-smooth relative z-0"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              touchAction: "pan-x",
            } as CSSProperties}
            onScroll={(e) => {
              const target = e.target as HTMLDivElement
              setScrollPosition(target.scrollLeft)
            }}
          >
            {tickets.map((ticket, index) => (
              <motion.div
                key={ticket.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex-shrink-0"
              >
                <a
                  href="#"
                  className="group block w-[180px] h-[260px] rounded-2xl overflow-hidden relative cursor-pointer transition-transform duration-300 group-hover:scale-105"
                >
                  {/* Background Image */}
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                    style={{
                      backgroundImage: `url(${ticket.image})`,
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  </div>

                  {/* Text Overlay at Bottom */}
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <div className="flex items-center justify-between">
                      <span className="text-white font-semibold text-lg uppercase tracking-wide">
                        {ticket.title}
                      </span>
                      <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

