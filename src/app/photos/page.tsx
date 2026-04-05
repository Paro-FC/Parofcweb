"use client"

import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { useState, useEffect, useCallback } from "react"
import { X, Camera, ChevronLeft, ChevronRight } from "lucide-react"
import { sanityFetch } from "@/sanity/lib/live"
import { PHOTOS_QUERY } from "@/sanity/lib/queries"
import Loader from "@/components/Loader"

interface PhotoImage {
  url: string
  alt?: string
  caption?: string
}

interface Photo {
  _id: string
  coverImage: string
  title: string
  category: string
  date: string
  photoCount: number
  slug: string
  images?: PhotoImage[]
}

const fallbackPhotos: Photo[] = [
  {
    _id: "1",
    coverImage:
      "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=600&fit=crop",
    title: "Last session before Paro FC v Thimphu City",
    category: "FIRST TEAM",
    date: new Date().toISOString(),
    photoCount: 27,
    slug: "last-session",
  },
]

function getTimeAgo(dateString: string) {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffHours / 24)

  if (diffHours < 1) return "Just now"
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays === 1) return "1d ago"
  if (diffDays < 30) return `${diffDays}d ago`
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
  })
}

export default function PhotosPage() {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [photos, setPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPhotos = async () => {
      setLoading(true)
      try {
        const photosResult = await sanityFetch({
          query: PHOTOS_QUERY,
        }).catch(() => ({ data: [] }))

        if (
          photosResult.data &&
          Array.isArray(photosResult.data) &&
          photosResult.data.length > 0
        ) {
          const photosData = photosResult.data.map((photo: any) => ({
            _id: photo._id,
            coverImage: photo.coverImage,
            title: photo.title,
            category: photo.category,
            date: photo.date,
            photoCount: photo.photoCount || 0,
            slug: photo.slug,
            images: photo.images || [],
          }))
          setPhotos(photosData)
        } else {
          setPhotos(fallbackPhotos)
        }
      } catch (error) {
        console.error("Error fetching photos:", error)
        setPhotos(fallbackPhotos)
      } finally {
        setLoading(false)
      }
    }

    fetchPhotos()
  }, [])

  // Lightbox helpers
  const getAllImages = useCallback(
    (photo: Photo) => {
      return photo.images && photo.images.length > 0
        ? [photo.coverImage, ...photo.images.map((img) => img.url)]
        : [photo.coverImage]
    },
    [],
  )

  const openLightbox = (photo: Photo) => {
    setSelectedPhoto(photo)
    setCurrentImageIndex(0)
    document.body.style.overflow = "hidden"
  }

  const closeLightbox = () => {
    setSelectedPhoto(null)
    setCurrentImageIndex(0)
    document.body.style.overflow = ""
  }

  // Keyboard navigation
  useEffect(() => {
    if (!selectedPhoto) return

    const allImages = getAllImages(selectedPhoto)

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" && currentImageIndex > 0) {
        setCurrentImageIndex(currentImageIndex - 1)
      } else if (
        e.key === "ArrowRight" &&
        currentImageIndex < allImages.length - 1
      ) {
        setCurrentImageIndex(currentImageIndex + 1)
      } else if (e.key === "Escape") {
        closeLightbox()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [selectedPhoto, currentImageIndex, getAllImages])

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Header */}
      <div className="relative bg-dark-charcoal overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, transparent, transparent 20px, white 20px, white 21px)",
          }}
        />

        <div className="container mx-auto px-4 py-12 md:py-16 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-xs font-bold text-barca-gold uppercase tracking-[0.2em] mb-3">
              Gallery
            </p>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white uppercase tracking-tight leading-none">
              Match Day
              <br />
              <span className="text-barca-gold">Photos</span>
            </h1>
          </motion.div>
        </div>

        <div className="h-1 bg-gradient-to-r from-barca-red via-barca-gold to-bronze" />
      </div>

      {/* Gallery Grid */}
      <div className="container mx-auto px-4 py-8 md:py-12">
        {loading ? (
          <Loader />
        ) : photos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Camera className="w-8 h-8 text-gray-200 mb-3" />
            <span className="text-sm text-gray-400 font-medium">
              No photos available yet
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {photos.map((photo, index) => (
              <motion.div
                key={photo._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.04, duration: 0.3 }}
                className="group cursor-pointer"
                onClick={() => openLightbox(photo)}
              >
                {/* Image */}
                <div className="relative aspect-[16/10] overflow-hidden bg-gray-50">
                  <Image
                    src={photo.coverImage}
                    alt={photo.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-dark-charcoal/0 group-hover:bg-dark-charcoal/30 transition-colors duration-300" />

                  {/* Photo count badge */}
                  <div className="absolute top-3 right-3 z-10 flex items-center gap-1 bg-dark-charcoal/70 backdrop-blur-sm px-2 py-1">
                    <Camera size={12} className="text-white" />
                    <span className="text-white text-[11px] font-bold tabular-nums">
                      {photo.photoCount}
                    </span>
                  </div>

                  {/* View indicator on hover */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-xs font-bold text-white uppercase tracking-widest">
                      View Gallery
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="mt-3 mb-1">
                  <h3 className="text-sm font-bold text-dark-charcoal leading-snug line-clamp-2 group-hover:text-barca-red transition-colors duration-200">
                    {photo.title}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-barca-red uppercase tracking-widest">
                    {photo.category}
                  </span>
                  <span className="text-gray-300">·</span>
                  <span className="text-[10px] text-gray-400 font-medium">
                    {getTimeAgo(photo.date)}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedPhoto &&
          (() => {
            const allImages = getAllImages(selectedPhoto)
            const currentImage = allImages[currentImageIndex]
            const hasPrevious = currentImageIndex > 0
            const hasNext = currentImageIndex < allImages.length - 1
            const currentCaption =
              currentImageIndex === 0
                ? selectedPhoto.title
                : selectedPhoto.images?.[currentImageIndex - 1]?.caption ||
                  selectedPhoto.title

            return (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-50 bg-black flex flex-col"
                onClick={closeLightbox}
              >
                {/* Top bar */}
                <div
                  className="flex items-center justify-between px-4 py-3 flex-shrink-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-white/40 uppercase tracking-wider">
                      {selectedPhoto.title}
                    </span>
                    {allImages.length > 1 && (
                      <span className="text-xs text-white/20 tabular-nums">
                        {currentImageIndex + 1} / {allImages.length}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={closeLightbox}
                    className="w-10 h-10 flex items-center justify-center text-white/40 hover:text-white transition-colors cursor-pointer"
                    aria-label="Close lightbox"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Image area */}
                <div
                  className="flex-1 relative flex items-center justify-center px-4 min-h-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Previous */}
                  {hasPrevious && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setCurrentImageIndex(currentImageIndex - 1)
                      }}
                      className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center text-white/30 hover:text-white transition-colors cursor-pointer"
                      aria-label="Previous image"
                    >
                      <ChevronLeft size={24} />
                    </button>
                  )}

                  {/* Next */}
                  {hasNext && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setCurrentImageIndex(currentImageIndex + 1)
                      }}
                      className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center text-white/30 hover:text-white transition-colors cursor-pointer"
                      aria-label="Next image"
                    >
                      <ChevronRight size={24} />
                    </button>
                  )}

                  {/* Current Image */}
                  <div className="relative w-full h-full max-h-[80vh]">
                    <Image
                      key={currentImageIndex}
                      src={currentImage}
                      alt={currentCaption}
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>

                {/* Bottom bar — caption + thumbnail dots */}
                <div
                  className="px-4 py-3 flex-shrink-0 flex items-center justify-between"
                  onClick={(e) => e.stopPropagation()}
                >
                  <p className="text-xs text-white/30 font-medium truncate max-w-[60%]">
                    {currentCaption}
                  </p>

                  {/* Dot indicators */}
                  {allImages.length > 1 && (
                    <div className="flex items-center gap-1">
                      {allImages.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentImageIndex(idx)}
                          className={`rounded-full transition-all duration-200 cursor-pointer ${
                            currentImageIndex === idx
                              ? "w-4 h-1.5 bg-white"
                              : "w-1.5 h-1.5 bg-white/20 hover:bg-white/40"
                          }`}
                          aria-label={`Go to image ${idx + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )
          })()}
      </AnimatePresence>
    </div>
  )
}
