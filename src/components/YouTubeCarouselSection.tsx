"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  PlayIcon,
  Share01Icon,
} from "@hugeicons/core-free-icons";
import {
  getYoutubeIdFromUrl,
  getYoutubeThumbnailUrl,
  getYoutubeWatchUrl,
} from "@/lib/youtube";

export interface YoutubeVideoEntry {
  _id: string;
  title: string;
  youtubeUrl: string;
  publishedAt?: string;
}

interface YouTubeCarouselSectionProps {
  videos: YoutubeVideoEntry[];
  sectionTitle?: string;
  moreVideosLabel?: string;
  moreVideosUrl?: string;
}

function formatVideoMeta(publishedAt?: string): string {
  if (!publishedAt) return "Video";
  const date = new Date(publishedAt);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 60) return `${Math.max(1, diffMins)}m | Video`;
  if (diffHours < 48) return `${diffHours}h | Video`;
  if (diffDays < 14) return `${diffDays}d | Video`;
  return `${date.toLocaleDateString("en-US", { day: "numeric", month: "short" })} | Video`;
}

export function YouTubeCarouselSection({
  videos,
  sectionTitle = "Paro FC videos",
}: YouTubeCarouselSectionProps) {
  const resolved = videos
    .map((v) => ({
      ...v,
      videoId: getYoutubeIdFromUrl(v.youtubeUrl),
    }))
    .filter((v): v is typeof v & { videoId: string } => Boolean(v.videoId));

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const cardWidth = 280;
  const gap = 20;
  const scrollAmount = cardWidth + gap;

  const getMaxScroll = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return 0;
    return Math.max(0, el.scrollWidth - el.clientWidth);
  }, []);

  const updateScrollState = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setScrollPosition(scrollLeft);
    setCanScrollLeft(scrollLeft > 4);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 4);
  }, []);

  useEffect(() => {
    updateScrollState();
  }, [resolved.length, updateScrollState]);

  useEffect(() => {
    const interval = setInterval(updateScrollState, 150);
    return () => clearInterval(interval);
  }, [updateScrollState]);

  const scrollLeftFn = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const next = Math.max(0, scrollPosition - scrollAmount);
    el.scrollTo({ left: next, behavior: "smooth" });
    setScrollPosition(next);
  };

  const scrollRightFn = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const maxScroll = getMaxScroll();
    const next = Math.min(maxScroll, scrollPosition + scrollAmount);
    el.scrollTo({ left: next, behavior: "smooth" });
    setScrollPosition(next);
  };

  const shareVideo = (e: React.MouseEvent, videoId: string, title: string) => {
    e.stopPropagation();
    e.preventDefault();
    const url = getYoutubeWatchUrl(videoId);
    if (navigator.share) {
      navigator.share({ title, url }).catch(() => {});
    } else {
      void navigator.clipboard.writeText(url);
    }
  };

  if (resolved.length === 0) return null;

  return (
    <>
      <section className="py-12 md:py-20 px-4 relative">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
            <h3 className="text-4xl md:text-5xl font-black text-dark-charcoal uppercase tracking-tight leading-none">
              {sectionTitle}
            </h3>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={scrollLeftFn}
                disabled={!canScrollLeft}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 border cursor-pointer ${
                  canScrollLeft
                    ? "border-dark-charcoal/20 hover:border-parofc-gold hover:bg-parofc-gold/5"
                    : "border-gray-200 opacity-30 pointer-events-none"
                }`}
                aria-label="Scroll left"
              >
                <HugeiconsIcon
                  icon={ArrowLeft01Icon}
                  size={20}
                  className="text-dark-charcoal"
                />
              </button>
              <button
                type="button"
                onClick={scrollRightFn}
                disabled={!canScrollRight}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 border cursor-pointer ${
                  canScrollRight
                    ? "border-dark-charcoal/20 hover:border-parofc-gold hover:bg-parofc-gold/5"
                    : "border-gray-200 opacity-30 pointer-events-none"
                }`}
                aria-label="Scroll right"
              >
                <HugeiconsIcon
                  icon={ArrowRight01Icon}
                  size={20}
                  className="text-dark-charcoal"
                />
              </button>
            </div>
          </div>

          <div className="relative">
            <div
              className={`absolute left-0 top-0 bottom-0 w-10 z-[5] pointer-events-none transition-opacity duration-300 ${
                canScrollLeft ? "opacity-100" : "opacity-0"
              }`}
              style={{
                background:
                  "linear-gradient(to right, rgba(255,255,255,1), rgba(255,255,255,0))",
              }}
            />
            <div
              className={`absolute right-0 top-0 bottom-0 w-16 z-[5] pointer-events-none transition-opacity duration-300 ${
                canScrollRight ? "opacity-100" : "opacity-0"
              }`}
              style={{
                background:
                  "linear-gradient(to left, rgba(255,255,255,1), rgba(255,255,255,0))",
              }}
            />

            {/* Right-edge chevron rail (reference style) */}
            <button
              type="button"
              onClick={scrollRightFn}
              disabled={!canScrollRight}
              className={`hidden md:flex absolute right-0 top-0 bottom-4 w-12 z-[6] items-center justify-center bg-dark-charcoal/85 hover:bg-dark-charcoal text-white transition-opacity rounded-l-lg cursor-pointer ${
                canScrollRight ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
              aria-label="Next videos"
            >
              <HugeiconsIcon icon={ArrowRight01Icon} size={22} />
            </button>

            <div
              ref={scrollContainerRef}
              className="flex gap-5 overflow-x-auto overflow-y-hidden scrollbar-hide scroll-smooth pb-1"
              style={
                {
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                  touchAction: "pan-x",
                } as React.CSSProperties
              }
              onScroll={updateScrollState}
            >
              {resolved.map((item, index) => (
                <motion.article
                  key={item._id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05, duration: 0.35 }}
                  className="flex-shrink-0 w-[280px] rounded-xl overflow-hidden bg-dark-charcoal shadow-lg group"
                >
                  <div className="relative aspect-[4/5] w-full overflow-hidden">
                    <YoutubePoster videoId={item.videoId} title={item.title} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />
                    <a
                      href={item.youtubeUrl || getYoutubeWatchUrl(item.videoId)}
                      className="absolute inset-0 z-[1] cursor-pointer border-0 p-0 bg-transparent text-left outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-dark-charcoal"
                      aria-label={`Watch on YouTube: ${item.title}`}
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-4 pt-16 z-[2] pointer-events-none">
                      <div className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-10 h-10 bg-primary flex items-center justify-center rounded shadow-md pointer-events-none">
                          <HugeiconsIcon
                            icon={PlayIcon}
                            size={20}
                            className="text-white ml-0.5"
                          />
                        </span>
                        <div className="min-w-0 flex-1 pr-10">
                          <h4 className="text-md font-black text-white uppercase tracking-wide leading-snug line-clamp-3">
                            {item.title}
                          </h4>
                          <p className="text-[11px] text-white/70 mt-1.5 font-medium">
                            {formatVideoMeta(item.publishedAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => shareVideo(e, item.videoId, item.title)}
                      className="absolute bottom-3 right-3 z-[3] p-2 text-white/70 hover:text-white transition-colors rounded-full hover:bg-white/10 cursor-pointer"
                      aria-label="Share video"
                    >
                      <HugeiconsIcon icon={Share01Icon} size={18} />
                    </button>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `,
        }}
      />
    </>
  );
}

function YoutubePoster({ videoId, title }: { videoId: string; title: string }) {
  const [src, setSrc] = useState(getYoutubeThumbnailUrl(videoId, "maxres"));

  return (
    <Image
      src={src}
      alt={title}
      fill
      className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
      sizes="280px"
      unoptimized
      onError={() => setSrc(getYoutubeThumbnailUrl(videoId, "hq"))}
    />
  );
}
