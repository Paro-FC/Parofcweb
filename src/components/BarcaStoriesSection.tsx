"use client"

import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { urlFor } from "@/sanity/lib/image"
import dynamic from "next/dynamic"

// Dynamically import StoriesViewer to reduce initial bundle size
const StoriesViewer = dynamic(() => import("./StoriesViewer").then(mod => ({ default: mod.StoriesViewer })), {
  loading: () => (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
      <div className="text-center text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <p>Loading story...</p>
      </div>
    </div>
  )
})

interface MediaItem {
  _key: string
  _type: "storyImage" | "storyVideo"
  caption?: string
  duration?: number
  image?: string
  video?: string
  poster?: string
}

interface Story {
  _id: string
  title: string
  coverImage: unknown
  isNew: boolean
  media?: MediaItem[]
}

// Fallback data for when Sanity content is not available
const fallbackStories: Story[] = [
  { _id: "1", title: "Paro FC News", coverImage: null, isNew: true, media: [{ _key: "1", _type: "storyImage", caption: "Latest news", duration: 5 }] },
  { _id: "2", title: "Best goals of the season 🤯⚽", coverImage: null, isNew: true, media: [{ _key: "1", _type: "storyImage", caption: "Goal compilation", duration: 5 }] },
  { _id: "3", title: "Paro FC vs Thimphu: Did you know?", coverImage: null, isNew: true, media: [{ _key: "1", _type: "storyImage", caption: "Match facts", duration: 5 }] },
  { _id: "4", title: "Goals compilation 🇧🇹", coverImage: null, isNew: true, media: [{ _key: "1", _type: "storyImage", caption: "Goals", duration: 5 }] },
  { _id: "5", title: "All league goals ✨", coverImage: null, isNew: true, media: [{ _key: "1", _type: "storyImage", caption: "League goals", duration: 5 }] },
  { _id: "6", title: "HIGHLIGHTS | Paro FC - Druk United 🥅", coverImage: null, isNew: true, media: [{ _key: "1", _type: "storyImage", caption: "Highlights", duration: 5 }] },
  { _id: "7", title: "Perfect storm vs Thimphu City", coverImage: null, isNew: false, media: [{ _key: "1", _type: "storyImage", caption: "Match report", duration: 5 }] },
  { _id: "8", title: "📷 Match Day Photos", coverImage: null, isNew: false, media: [{ _key: "1", _type: "storyImage", caption: "Photos", duration: 5 }] },
]

export function BarcaStoriesSection({ stories }: { stories?: Story[] }) {
  const storyList = stories && stories.length > 0 ? stories : fallbackStories
  const [scrollPosition, setScrollPosition] = useState(0)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [selectedStoryIndex, setSelectedStoryIndex] = useState<number | null>(null)
  const cardWidth = 180
  const gap = 16
  const scrollAmount = cardWidth + gap

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const newPosition = Math.max(0, scrollPosition - scrollAmount)
      setScrollPosition(newPosition)
      scrollContainerRef.current.scrollTo({
        left: newPosition,
        behavior: 'smooth'
      })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const maxScroll = scrollContainerRef.current.scrollWidth - scrollContainerRef.current.clientWidth
      const newPosition = Math.min(maxScroll, scrollPosition + scrollAmount)
      setScrollPosition(newPosition)
      scrollContainerRef.current.scrollTo({
        left: newPosition,
        behavior: 'smooth'
      })
    }
  }

  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

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

  const openStory = (index: number) => {
    setSelectedStoryIndex(index)
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden'
  }

  const closeStory = () => {
    setSelectedStoryIndex(null)
    document.body.style.overflow = ''
  }

  return (
    <>
    <section className="py-16 px-4">
      <div className="container mx-auto">
        <h3 
          className="text-4xl font-bold uppercase tracking-tight mb-8 text-center"
          style={{
            color: '#111827', // gray-900
          }}
        >
            Paro FC Stories
        </h3>

        <div className="relative">
          <div 
            className={`absolute left-0 top-0 bottom-0 w-16 z-[5] pointer-events-none transition-opacity duration-300 ${
              canScrollLeft ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              background: 'linear-gradient(to right, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0))',
            }}
          />

          <div 
            className={`absolute right-0 top-0 bottom-0 w-16 z-[5] pointer-events-none transition-opacity duration-300 ${
              canScrollRight ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              background: 'linear-gradient(to left, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0))',
            }}
          />

          <button
            onClick={scrollLeft}
            disabled={!canScrollLeft}
            className={`absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center transition-all ${
              canScrollLeft 
                ? 'opacity-100 hover:bg-gray-50 cursor-pointer' 
                : 'opacity-0 pointer-events-none'
            }`}
            style={{
              border: `1px solid ${canScrollLeft ? '#E6BB29' : '#E5E7EB'}`, // barca-gold on hover, gray-200 default
            }}
            onMouseEnter={(e) => {
              if (canScrollLeft) {
                e.currentTarget.style.borderColor = '#E6BB29'; // barca-gold
              }
            }}
            onMouseLeave={(e) => {
              if (canScrollLeft) {
                e.currentTarget.style.borderColor = '#E5E7EB'; // gray-200
              }
            }}
          >
            <ChevronLeft className="w-6 h-6" style={{ color: '#111827' }} /> {/* gray-900 */}
          </button>

          <button
            onClick={scrollRight}
            disabled={!canScrollRight}
            className={`absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center transition-all ${
              canScrollRight 
                ? 'opacity-100 hover:bg-gray-50 cursor-pointer' 
                : 'opacity-50 cursor-not-allowed'
            }`}
            style={{
              border: `1px solid ${canScrollRight ? '#E6BB29' : '#E5E7EB'}`, // barca-gold on hover, gray-200 default
            }}
            onMouseEnter={(e) => {
              if (canScrollRight) {
                e.currentTarget.style.borderColor = '#E6BB29'; // barca-gold
              }
            }}
            onMouseLeave={(e) => {
              if (canScrollRight) {
                e.currentTarget.style.borderColor = '#E5E7EB'; // gray-200
              }
            }}
          >
            <ChevronRight className="w-6 h-6" style={{ color: '#111827' }} /> {/* gray-900 */}
          </button>

          <div
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto overflow-y-hidden scrollbar-hide scroll-smooth relative z-0"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              touchAction: 'pan-x',
            } as React.CSSProperties}
            onScroll={(e) => {
              const target = e.target as HTMLDivElement
              setScrollPosition(target.scrollLeft)
            }}
          >
              {storyList.map((story, index) => (
              <motion.div
                  key={story._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="flex-shrink-0 relative z-0"
                style={{ touchAction: 'none' }}
                drag={false}
              >
                  <button
                    onClick={() => openStory(index)}
                    className="group block w-[180px] h-[260px] rounded-2xl overflow-hidden relative cursor-pointer border-0 p-0"
                  style={{ touchAction: 'none' }}
                  draggable={false}
                >
                  {/* Background Image */}
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                    style={{
                        backgroundImage: story.coverImage 
                          ? `url(${urlFor(story.coverImage).width(300).height(400).url()})`
                          : `linear-gradient(135deg, #1A1A1A 0%, #8B0000 100%)`, // dark-charcoal to barca-red
                    }}
                  >
                    <div 
                      className="absolute inset-0"
                      style={{
                        background: 'linear-gradient(to top, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.5), transparent)',
                      }}
                    />
                  </div>


                  {/* NEW Badge */}
                  {story.isNew && (
                    <div className="absolute top-3 left-3 z-10">
                      <span 
                        className="text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide"
                        style={{
                          backgroundColor: '#E6BB29', // barca-gold
                          color: '#1A1A1A', // dark-bg
                        }}
                      >
                        New
                      </span>
                    </div>
                  )}

                    {/* Media count indicator */}
                    {story.media && story.media.length > 1 && (
                      <div className="absolute top-3 right-3 z-10">
                        <span 
                          className="text-white text-xs font-bold px-2 py-1 rounded-full"
                          style={{
                            backgroundColor: 'rgba(0, 0, 0, 0.5)', // black/50
                          }}
                        >
                          {story.media.length}
                        </span>
                      </div>
                    )}

                  {/* Text Overlay at Bottom */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <span 
                      className="font-semibold text-sm leading-tight block"
                      style={{
                        color: '#FFFFFF', // white
                      }}
                    >
                      {story.title}
                    </span>
                  </div>
                  </button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      </section>

      {/* Stories Viewer Modal */}
      {selectedStoryIndex !== null && (
        <StoriesViewer
          stories={storyList}
          initialStoryIndex={selectedStoryIndex}
          onClose={closeStory}
          urlFor={urlFor}
        />
      )}

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `,
        }}
      />
    </>
  )
}
