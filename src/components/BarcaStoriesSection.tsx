"use client";

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { urlFor } from "@/sanity/lib/image";
import dynamic from "next/dynamic";

const StoriesViewer = dynamic(
  () =>
    import("./StoriesViewer").then((mod) => ({ default: mod.StoriesViewer })),
  {
    loading: () => (
      <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading story...</p>
        </div>
      </div>
    ),
  },
);

interface MediaItem {
  _key: string;
  _type: "storyImage" | "storyVideo";
  caption?: string;
  duration?: number;
  image?: string;
  video?: string;
  poster?: string;
}

interface Story {
  _id: string;
  title: string;
  coverImage: unknown;
  isNew: boolean;
  media?: MediaItem[];
}

const fallbackStories: Story[] = [
  {
    _id: "1",
    title: "Paro FC News",
    coverImage: null,
    isNew: true,
    media: [
      { _key: "1", _type: "storyImage", caption: "Latest news", duration: 5 },
    ],
  },
  {
    _id: "2",
    title: "Best goals of the season",
    coverImage: null,
    isNew: true,
    media: [
      {
        _key: "1",
        _type: "storyImage",
        caption: "Goal compilation",
        duration: 5,
      },
    ],
  },
  {
    _id: "3",
    title: "Paro FC vs Thimphu: Did you know?",
    coverImage: null,
    isNew: true,
    media: [
      { _key: "1", _type: "storyImage", caption: "Match facts", duration: 5 },
    ],
  },
  {
    _id: "4",
    title: "Goals compilation",
    coverImage: null,
    isNew: true,
    media: [{ _key: "1", _type: "storyImage", caption: "Goals", duration: 5 }],
  },
  {
    _id: "5",
    title: "All league goals",
    coverImage: null,
    isNew: true,
    media: [
      { _key: "1", _type: "storyImage", caption: "League goals", duration: 5 },
    ],
  },
  {
    _id: "6",
    title: "HIGHLIGHTS | Paro FC - Druk United",
    coverImage: null,
    isNew: true,
    media: [
      { _key: "1", _type: "storyImage", caption: "Highlights", duration: 5 },
    ],
  },
  {
    _id: "7",
    title: "Perfect storm vs Thimphu City",
    coverImage: null,
    isNew: false,
    media: [
      { _key: "1", _type: "storyImage", caption: "Match report", duration: 5 },
    ],
  },
  {
    _id: "8",
    title: "Match Day Photos",
    coverImage: null,
    isNew: false,
    media: [{ _key: "1", _type: "storyImage", caption: "Photos", duration: 5 }],
  },
];

export function BarcaStoriesSection({ stories }: { stories?: Story[] }) {
  const storyList = stories && stories.length > 0 ? stories : fallbackStories;
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState<number | null>(
    null,
  );
  const cardWidth = 140;
  const gap = 20;
  const scrollAmount = cardWidth + gap;

  const scrollLeftFn = () => {
    if (scrollContainerRef.current) {
      const newPosition = Math.max(0, scrollPosition - scrollAmount);
      setScrollPosition(newPosition);
      scrollContainerRef.current.scrollTo({
        left: newPosition,
        behavior: "smooth",
      });
    }
  };

  const scrollRightFn = () => {
    if (scrollContainerRef.current) {
      const maxScroll =
        scrollContainerRef.current.scrollWidth -
        scrollContainerRef.current.clientWidth;
      const newPosition = Math.min(maxScroll, scrollPosition + scrollAmount);
      setScrollPosition(newPosition);
      scrollContainerRef.current.scrollTo({
        left: newPosition,
        behavior: "smooth",
      });
    }
  };

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    const checkScroll = () => {
      if (scrollContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } =
          scrollContainerRef.current;
        setCanScrollLeft(scrollLeft > 0);
        setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
      }
    };

    checkScroll();
    const interval = setInterval(checkScroll, 100);
    return () => clearInterval(interval);
  }, [scrollPosition]);

  const openStory = (index: number) => {
    setSelectedStoryIndex(index);
    document.body.style.overflow = "hidden";
  };

  const closeStory = () => {
    setSelectedStoryIndex(null);
    document.body.style.overflow = "";
  };

  return (
    <>
      <section className="py-12 md:py-20 px-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl md:text-3xl font-bold uppercase tracking-tight text-dark-charcoal">
              Stories
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={scrollLeftFn}
                disabled={!canScrollLeft}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 border cursor-pointer ${
                  canScrollLeft
                    ? "border-dark-charcoal/20 hover:border-barca-gold hover:bg-barca-gold/5 opacity-100"
                    : "border-gray-200 opacity-0 pointer-events-none"
                }`}
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-5 h-5 text-dark-charcoal" />
              </button>
              <button
                onClick={scrollRightFn}
                disabled={!canScrollRight}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 border cursor-pointer ${
                  canScrollRight
                    ? "border-dark-charcoal/20 hover:border-barca-gold hover:bg-barca-gold/5 opacity-100"
                    : "border-gray-200 opacity-40 pointer-events-none"
                }`}
                aria-label="Scroll right"
              >
                <ChevronRight className="w-5 h-5 text-dark-charcoal" />
              </button>
            </div>
          </div>

          <div className="relative">
            {/* Edge fades */}
            <div
              className={`absolute left-0 top-0 bottom-0 w-12 z-[5] pointer-events-none transition-opacity duration-300 ${
                canScrollLeft ? "opacity-100" : "opacity-0"
              }`}
              style={{
                background:
                  "linear-gradient(to right, rgba(255,255,255,1), rgba(255,255,255,0))",
              }}
            />
            <div
              className={`absolute right-0 top-0 bottom-0 w-12 z-[5] pointer-events-none transition-opacity duration-300 ${
                canScrollRight ? "opacity-100" : "opacity-0"
              }`}
              style={{
                background:
                  "linear-gradient(to left, rgba(255,255,255,1), rgba(255,255,255,0))",
              }}
            />

            <div
              ref={scrollContainerRef}
              className="flex gap-5 overflow-x-auto overflow-y-hidden scrollbar-hide scroll-smooth"
              style={
                {
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                  touchAction: "pan-x",
                } as React.CSSProperties
              }
              onScroll={(e) => {
                const target = e.target as HTMLDivElement;
                setScrollPosition(target.scrollLeft);
              }}
            >
              {storyList.map((story, index) => (
                <motion.div
                  key={story._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.04, duration: 0.3 }}
                  className="flex-shrink-0 flex flex-col items-center gap-2"
                >
                  {/* Story ring */}
                  <button
                    onClick={() => openStory(index)}
                    className="group relative cursor-pointer border-0 p-0 bg-transparent"
                    style={{ touchAction: "none" }}
                    draggable={false}
                  >
                    {/* Gradient ring for new stories */}
                    <div
                      className={`w-[140px] h-[140px] md:w-[160px] md:h-[160px] rounded-full p-[3px] ${
                        story.isNew
                          ? "bg-gradient-to-br from-barca-gold via-barca-red to-barca-gold"
                          : "bg-gray-300"
                      }`}
                    >
                      <div className="w-full h-full rounded-full p-[3px] bg-white">
                        <div
                          className="w-full h-full rounded-full bg-cover bg-center overflow-hidden transition-transform duration-300 group-hover:scale-105"
                          style={{
                            backgroundImage: story.coverImage
                              ? `url(${urlFor(story.coverImage).width(300).height(300).url()})`
                              : `linear-gradient(135deg, #1A1A1A 0%, #b91a1b 100%)`,
                          }}
                        />
                      </div>
                    </div>

                    {/* NEW indicator dot */}
                    {story.isNew && (
                      <div className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-barca-gold rounded-full border-2 border-white" />
                    )}
                  </button>

                  {/* Title below */}
                  <span className="text-xs font-medium text-dark-charcoal/70 text-center w-[140px] md:w-[160px] truncate">
                    {story.title}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

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
  );
}
