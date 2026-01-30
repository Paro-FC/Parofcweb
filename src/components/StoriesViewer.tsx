"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence, PanInfo } from "framer-motion"
import { X, ChevronLeft, ChevronRight, Pause, Play, Send, Volume2, VolumeX } from "lucide-react"
import Image from "next/image"

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

interface StoriesViewerProps {
  stories: Story[]
  initialStoryIndex: number
  onClose: () => void
  urlFor: (source: unknown) => { width: (w: number) => { height: (h: number) => { url: () => string } } }
}

export function StoriesViewer({ stories, initialStoryIndex, onClose, urlFor }: StoriesViewerProps) {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(initialStoryIndex)
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [showControls, setShowControls] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)
  const progressInterval = useRef<NodeJS.Timeout | null>(null)
  const controlsTimeout = useRef<NodeJS.Timeout | null>(null)

  const currentStory = stories[currentStoryIndex]
  const mediaItems = currentStory?.media || []
  const currentMedia = mediaItems[currentMediaIndex]
  const duration = (currentMedia?.duration || 5) * 1000 // Convert to milliseconds

  const hasNextMedia = currentMediaIndex < mediaItems.length - 1 || currentStoryIndex < stories.length - 1
  const hasPrevMedia = currentMediaIndex > 0 || currentStoryIndex > 0

  // Show/hide controls on interaction
  const handleInteraction = () => {
    setShowControls(true)
    if (controlsTimeout.current) {
      clearTimeout(controlsTimeout.current)
    }
    controlsTimeout.current = setTimeout(() => {
      setShowControls(false)
    }, 3000)
  }

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current)
      }
      if (controlsTimeout.current) {
        clearTimeout(controlsTimeout.current)
      }
    }
  }, [])

  // Progress timer
  useEffect(() => {
    if (isPaused || !currentMedia) return

    const startTime = Date.now() - (progress / 100) * duration
    
    progressInterval.current = setInterval(() => {
      const elapsed = Date.now() - startTime
      const newProgress = Math.min((elapsed / duration) * 100, 100)
      setProgress(newProgress)

      if (newProgress >= 100) {
        goToNextMedia()
      }
    }, 50)

    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current)
      }
    }
  }, [currentStoryIndex, currentMediaIndex, isPaused, duration])

  const goToNextMedia = useCallback(() => {
    setProgress(0)
    if (currentMediaIndex < mediaItems.length - 1) {
      setCurrentMediaIndex(currentMediaIndex + 1)
    } else if (currentStoryIndex < stories.length - 1) {
      setCurrentStoryIndex(currentStoryIndex + 1)
      setCurrentMediaIndex(0)
    } else {
      onClose()
    }
  }, [currentMediaIndex, mediaItems.length, currentStoryIndex, stories.length, onClose])

  const goToPrevMedia = useCallback(() => {
    setProgress(0)
    if (currentMediaIndex > 0) {
      setCurrentMediaIndex(currentMediaIndex - 1)
    } else if (currentStoryIndex > 0) {
      setCurrentStoryIndex(currentStoryIndex - 1)
      const prevStory = stories[currentStoryIndex - 1]
      setCurrentMediaIndex((prevStory?.media?.length || 1) - 1)
    }
  }, [currentMediaIndex, currentStoryIndex, stories])

  const goToStory = (index: number) => {
    setCurrentStoryIndex(index)
    setCurrentMediaIndex(0)
    setProgress(0)
  }

  // Handle swipe gestures
  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 50
    if (info.offset.x > threshold) {
      goToPrevMedia()
    } else if (info.offset.x < -threshold) {
      goToNextMedia()
    }
  }

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowRight":
          goToNextMedia()
          break
        case "ArrowLeft":
          goToPrevMedia()
          break
        case "Escape":
          onClose()
          break
        case " ":
          e.preventDefault()
          setIsPaused(!isPaused)
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [goToNextMedia, goToPrevMedia, onClose, isPaused])

  // Handle video playback
  useEffect(() => {
    if (videoRef.current) {
      if (isPaused) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
    }
  }, [isPaused, currentMedia])

  if (!currentStory || mediaItems.length === 0) {
    return (
      <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
        <p className="text-white">No media in this story</p>
        <button onClick={onClose} className="absolute top-4 right-4 text-white">
          <X size={32} />
        </button>
      </div>
    )
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
        onMouseMove={handleInteraction}
        onTouchStart={handleInteraction}
      >
        {/* Background blur from cover image */}
        <div 
          className="absolute inset-0 opacity-30 blur-3xl"
          style={{
            backgroundImage: currentMedia?.image 
              ? `url(${currentMedia.image})`
              : currentStory.coverImage 
                ? `url(${urlFor(currentStory.coverImage).width(100).height(100).url()})`
                : 'linear-gradient(135deg, #004D98 0%, #A50044 100%)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />

        {/* Story navigation - Previous stories (outer) */}
        <button
          onClick={() => currentStoryIndex > 0 && goToStory(currentStoryIndex - 1)}
          className={`absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center transition-all ${
            currentStoryIndex > 0 ? 'opacity-100 hover:bg-white/20 cursor-pointer' : 'opacity-0 pointer-events-none'
          }`}
          disabled={currentStoryIndex === 0}
        >
          <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-white" />
        </button>

        {/* Main story container */}
        <motion.div
          key={`${currentStoryIndex}-${currentMediaIndex}`}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.2 }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={handleDragEnd}
          className="relative w-full max-w-[420px] h-[90vh] max-h-[800px] bg-black rounded-2xl overflow-hidden shadow-2xl cursor-grab active:cursor-grabbing"
        >
          {/* Progress bars */}
          <div className="absolute top-0 left-0 right-0 z-30 p-3 flex gap-1">
            {mediaItems.map((_, index) => (
              <div key={index} className="flex-1 h-0.5 bg-white/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-all duration-100"
                  style={{
                    width: index < currentMediaIndex 
                      ? '100%' 
                      : index === currentMediaIndex 
                        ? `${progress}%` 
                        : '0%'
                  }}
                />
              </div>
            ))}
          </div>

          {/* Header */}
          <div className="absolute top-6 left-0 right-0 z-30 px-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-barca-blue to-barca-red flex items-center justify-center overflow-hidden">
                {currentStory.coverImage ? (
                  <Image
                    src={urlFor(currentStory.coverImage).width(40).height(40).url()}
                    alt={currentStory.title}
                    width={40}
                    height={40}
                    className="object-cover"
                  />
                ) : (
                  <span className="text-white text-xs font-bold">PFC</span>
                )}
              </div>
              <div>
                <p className="text-white font-semibold text-sm">{currentStory.title}</p>
                {currentStory.isNew && (
                  <span className="text-xs text-barca-gold">New</span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPaused(!isPaused)}
                className="w-8 h-8 flex items-center justify-center text-white hover:bg-white/10 rounded-full transition-colors"
              >
                {isPaused ? <Play size={20} /> : <Pause size={20} />}
              </button>
              {currentMedia?._type === 'storyVideo' && (
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="w-8 h-8 flex items-center justify-center text-white hover:bg-white/10 rounded-full transition-colors"
                >
                  {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>
              )}
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center text-white hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          {/* Media content with click zones */}
          <div className="absolute inset-0 flex items-center justify-center">
            {currentMedia?._type === 'storyImage' && currentMedia.image && (
              <Image
                src={currentMedia.image}
                alt={currentMedia.caption || currentStory.title}
                fill
                className="object-contain pointer-events-none"
                priority
              />
            )}

            {currentMedia?._type === 'storyVideo' && currentMedia.video && (
              <video
                ref={videoRef}
                src={currentMedia.video}
                poster={currentMedia.poster}
                muted={isMuted}
                playsInline
                autoPlay
                className="w-full h-full object-contain pointer-events-none"
                onEnded={goToNextMedia}
              />
            )}

            {/* Click zones for navigation */}
            <div className="absolute inset-0 flex">
              {/* Left zone - Previous */}
              <button
                onClick={goToPrevMedia}
                className="w-1/3 h-full cursor-pointer"
                aria-label="Previous"
              />
              {/* Center zone - Pause/Play */}
              <button
                onClick={() => setIsPaused(!isPaused)}
                className="w-1/3 h-full cursor-pointer"
                aria-label="Pause/Play"
              />
              {/* Right zone - Next */}
              <button
                onClick={goToNextMedia}
                className="w-1/3 h-full cursor-pointer"
                aria-label="Next"
              />
            </div>
          </div>

          {/* Inner navigation arrows */}
          <div 
            className={`absolute inset-y-0 left-0 right-0 z-20 flex items-center justify-between px-2 pointer-events-none transition-opacity duration-300 ${
              showControls ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* Previous media arrow */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                goToPrevMedia()
              }}
              className={`w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center transition-all pointer-events-auto ${
                hasPrevMedia ? 'opacity-100 hover:bg-black/60 cursor-pointer' : 'opacity-0 pointer-events-none'
              }`}
              disabled={!hasPrevMedia}
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>

            {/* Next media arrow */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                goToNextMedia()
              }}
              className={`w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center transition-all pointer-events-auto ${
                hasNextMedia ? 'opacity-100 hover:bg-black/60 cursor-pointer' : 'opacity-0 pointer-events-none'
              }`}
              disabled={!hasNextMedia}
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>
          </div>

          {/* Media counter indicator */}
          {mediaItems.length > 1 && (
            <div className="absolute top-16 right-4 z-30 bg-black/40 backdrop-blur-sm rounded-full px-2 py-1">
              <span className="text-white text-xs font-medium">
                {currentMediaIndex + 1} / {mediaItems.length}
              </span>
            </div>
          )}

          {/* Caption */}
          {currentMedia?.caption && (
            <div className="absolute bottom-20 left-0 right-0 z-30 px-4">
              <p className="text-white text-center text-lg font-medium drop-shadow-lg">
                {currentMedia.caption}
              </p>
            </div>
          )}

          {/* Bottom actions */}
          <div className="absolute bottom-4 left-0 right-0 z-30 px-4 flex items-center gap-3">
            <div className="flex-1 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
              <input
                type="text"
                placeholder="Send message"
                className="w-full bg-transparent text-white placeholder-white/60 outline-none text-sm"
                onFocus={() => setIsPaused(true)}
                onBlur={() => setIsPaused(false)}
              />
            </div>
            <button className="w-10 h-10 flex items-center justify-center text-white hover:bg-white/10 rounded-full transition-colors">
              <Send size={20} />
            </button>
          </div>

          {/* Swipe hint */}
          <div className={`absolute bottom-24 left-1/2 -translate-x-1/2 z-30 transition-opacity duration-500 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
            <p className="text-white/50 text-xs">Swipe or tap to navigate</p>
          </div>
        </motion.div>

        {/* Story navigation - Next stories (outer) */}
        <button
          onClick={() => currentStoryIndex < stories.length - 1 && goToStory(currentStoryIndex + 1)}
          className={`absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center transition-all ${
            currentStoryIndex < stories.length - 1 ? 'opacity-100 hover:bg-white/20 cursor-pointer' : 'opacity-0 pointer-events-none'
          }`}
          disabled={currentStoryIndex === stories.length - 1}
        >
          <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-white" />
        </button>

        {/* Story thumbnails at bottom */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2 overflow-x-auto max-w-[90vw] px-4 py-2 scrollbar-hide">
          {stories.map((story, index) => (
            <button
              key={story._id}
              onClick={() => goToStory(index)}
              className={`flex-shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-lg overflow-hidden border-2 transition-all ${
                index === currentStoryIndex 
                  ? 'border-white scale-110' 
                  : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              {story.coverImage ? (
                <Image
                  src={urlFor(story.coverImage).width(64).height(64).url()}
                  alt={story.title}
                  width={64}
                  height={64}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-barca-blue to-barca-red" />
              )}
            </button>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
