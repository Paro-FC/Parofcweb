"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { useState, useEffect } from "react"
import { X, Camera, Clock, ImagePlus, ChevronLeft, ChevronRight } from "lucide-react"
import { sanityFetch } from "@/sanity/lib/live"
import { PHOTOS_QUERY } from "@/sanity/lib/queries"

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

// Fallback photos data
const fallbackPhotos: Photo[] = [
  {
    _id: "1",
    coverImage: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=600&fit=crop",
    title: "Last session before Barça v Copenhagen",
    category: "FIRST TEAM",
    date: new Date().toISOString(),
    photoCount: 27,
    slug: "last-session",
  },
]

const categories = ["All", "Match", "Training", "Press", "Team", "FIRST TEAM"]

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' })
}

function getTimeAgo(dateString: string) {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffHours / 24)
  
  if (diffHours < 1) return 'Just now'
  if (diffHours < 24) return `${diffHours} hr${diffHours > 1 ? 's' : ''} ago`
  if (diffDays === 1) return '1 day ago'
  return `${diffDays} days ago`
}

export default function PhotosPage() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [photos, setPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch photos from Sanity
  useEffect(() => {
    const fetchPhotos = async () => {
      setLoading(true)
      try {
        const photosResult = await sanityFetch({ query: PHOTOS_QUERY }).catch(() => ({ data: [] }))
        
        if (photosResult.data && Array.isArray(photosResult.data) && photosResult.data.length > 0) {
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
        console.error('Error fetching photos:', error)
        setPhotos(fallbackPhotos)
      } finally {
        setLoading(false)
      }
    }

    fetchPhotos()
  }, [])

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!selectedPhoto) return

    // Get all images for current photo
    const allImages = selectedPhoto.images && selectedPhoto.images.length > 0
      ? [selectedPhoto.coverImage, ...selectedPhoto.images.map(img => img.url)]
      : [selectedPhoto.coverImage]

    const hasPrevious = currentImageIndex > 0
    const hasNext = currentImageIndex < allImages.length - 1

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && hasPrevious) {
        setCurrentImageIndex(currentImageIndex - 1)
      } else if (e.key === 'ArrowRight' && hasNext) {
        setCurrentImageIndex(currentImageIndex + 1)
      } else if (e.key === 'Escape') {
        setSelectedPhoto(null)
        setCurrentImageIndex(0)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedPhoto, currentImageIndex])

  const filteredPhotos = selectedCategory === "All"
    ? photos
    : photos.filter(photo => photo.category === selectedCategory)

  return (
    <div className="min-h-screen bg-white">

      {/* Main Content */}
      <section className="bg-white py-16 px-4">
        <div className="container mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
            <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-tight text-gray-900 mb-4 md:mb-0">
              Photos
            </h2>
          </div>

          {/* Photo Gallery Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {loading ? (
              <div className="col-span-full text-center py-12 text-gray-500">
                Loading photos...
              </div>
            ) : filteredPhotos.length === 0 ? (
              <div className="col-span-full text-center py-12 text-gray-500">
                No photos found
              </div>
            ) : (
              filteredPhotos.map((photo, index) => (
              <motion.div
                key={photo._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="relative group cursor-pointer border border-gray-200 p-2"
                onClick={() => {
                  setSelectedPhoto(photo)
                  setCurrentImageIndex(0)
                }}
              >
                <div className="relative aspect-[16/9] overflow-hidden bg-gray-100">
                  <Image
                      src={photo.coverImage}
                    alt={photo.title}
                    fill
                    className="object-cover"
                  />
                  
                  {/* Camera Icon with Count - Top Right */}
                  <div className="absolute top-3 right-3 bg-barca-gold/90 backdrop-blur-sm rounded-lg px-3 py-1.5 flex items-center gap-1.5 z-10">
                    <span className="text-white text-sm font-semibold">{photo.photoCount}</span>
                    <Camera className="w-4 h-4 text-white" />
                  </div>
                </div>
                
                {/* Two Thick Light Gray Lines Below Image */}
                <div className="flex flex-col">
                  <div className="h-2 bg-gray-300 w-[95%] mx-auto"></div>
                  <div className="h-2 bg-gray-200 w-11/12 mx-auto"></div>
                </div>
                
                {/* Title - Below Image */}
                <h3 className="text-gray-900 font-semibold text-sm mt-3 mb-3 text-center">
                  {photo.title}
                </h3>
                
                {/* Footer - Category and Time */}
                <div className="flex items-center justify-between">
                  {/* Category Badge - Bottom Left */}
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-sm">
                     <ImagePlus className="w-4 h-4 text-barca-red" />
                    </div>
                    <span className="text-barca-red font-bold text-sm uppercase">
                      {photo.category}
                    </span>
                  </div>
                  
                  {/* Timestamp - Bottom Right */}
                  <div className="flex items-center gap-1.5 text-gray-600 text-sm">
                    <Clock className="w-4 h-4" />
                      <span>{getTimeAgo(photo.date)}</span>
                  </div>
                </div>
              </motion.div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedPhoto && (() => {
        // Get all images: cover image + gallery images
        const allImages = selectedPhoto.images && selectedPhoto.images.length > 0
          ? [selectedPhoto.coverImage, ...selectedPhoto.images.map(img => img.url)]
          : [selectedPhoto.coverImage]
        
        const currentImage = allImages[currentImageIndex]
        const hasPrevious = currentImageIndex > 0
        const hasNext = currentImageIndex < allImages.length - 1

        const handlePrevious = (e: React.MouseEvent) => {
          e.stopPropagation()
          if (hasPrevious) {
            setCurrentImageIndex(currentImageIndex - 1)
          }
        }

        const handleNext = (e: React.MouseEvent) => {
          e.stopPropagation()
          if (hasNext) {
            setCurrentImageIndex(currentImageIndex + 1)
          }
        }

        return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => {
              setSelectedPhoto(null)
              setCurrentImageIndex(0)
            }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative max-w-6xl max-h-[90vh] w-full"
            onClick={(e) => e.stopPropagation()}
          >
              {/* Close Button */}
            <button
                onClick={() => {
                  setSelectedPhoto(null)
                  setCurrentImageIndex(0)
                }}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

              {/* Previous Button */}
              {hasPrevious && (
                <button
                  onClick={handlePrevious}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              )}

              {/* Next Button */}
              {hasNext && (
                <button
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              )}

              {/* Current Image */}
            <div className="relative w-full h-[80vh]">
              <Image
                  key={currentImageIndex}
                  src={currentImage}
                alt={selectedPhoto.title}
                fill
                className="object-contain"
              />
            </div>

              {/* Carousel Thumbnails */}
              {allImages.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
                  <style dangerouslySetInnerHTML={{
                    __html: `
                      .thumbnail-scroll::-webkit-scrollbar {
                        display: none;
                      }
                    `
                  }} />
              </div>
              )}
            </motion.div>
          </motion.div>
        )
      })()}

    </div>
  )
}

