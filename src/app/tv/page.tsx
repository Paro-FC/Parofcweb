"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  PlayIcon,
  YoutubeIcon,
  Share01Icon,
  Cancel01Icon,
} from "@hugeicons/core-free-icons";
import { sanityFetch } from "@/sanity/lib/live";
import { YOUTUBE_VIDEOS_QUERY } from "@/sanity/lib/queries";
import {
  getYoutubeIdFromUrl,
  getYoutubeNocookieEmbedUrl,
  getYoutubeThumbnailUrl,
  getYoutubeWatchUrl,
} from "@/lib/youtube";
import { isShareUserCanceled } from "@/lib/share";
import Loader from "@/components/Loader";

interface VideoItem {
  _id: string;
  title: string;
  youtubeUrl: string;
  publishedAt?: string;
  videoId: string;
}

function formatDate(dateString?: string) {
  if (!dateString) return "Video";
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffHours < 1) return "Just now";
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "1d ago";
  if (diffDays < 30) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
  });
}

function VideoThumbnail({
  videoId,
  title,
  priority = false,
}: {
  videoId: string;
  title: string;
  priority?: boolean;
}) {
  const [src, setSrc] = useState(getYoutubeThumbnailUrl(videoId, "maxres"));
  return (
    <Image
      src={src}
      alt={title}
      fill
      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
      className="object-cover transition-transform duration-500 group-hover:scale-105"
      priority={priority}
      unoptimized
      onError={() => setSrc(getYoutubeThumbnailUrl(videoId, "hq"))}
    />
  );
}

export default function TvPage() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      try {
        const result = await sanityFetch({
          query: YOUTUBE_VIDEOS_QUERY,
        }).catch(() => ({ data: [] }));

        if (result.data && Array.isArray(result.data) && result.data.length > 0) {
          const mapped = result.data
            .map((v: any) => {
              const videoId = getYoutubeIdFromUrl(v.youtubeUrl);
              if (!videoId) return null;
              return {
                _id: v._id,
                title: v.title,
                youtubeUrl: v.youtubeUrl,
                publishedAt: v.publishedAt,
                videoId,
              } as VideoItem;
            })
            .filter((v: VideoItem | null): v is VideoItem => Boolean(v));
          setVideos(mapped);
        } else {
          setVideos([]);
        }
      } catch (error) {
        console.error("Error fetching videos:", error);
        setVideos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const featured = videos[0];
  const rest = useMemo(() => videos.slice(1), [videos]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveId(null);
    };
    if (activeId) {
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", onKey);
    }
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [activeId]);

  const shareVideo = (e: React.MouseEvent, videoId: string, title: string) => {
    e.stopPropagation();
    e.preventDefault();
    const url = getYoutubeWatchUrl(videoId);
    if (navigator.share) {
      void navigator.share({ title, url }).catch((err) => {
        if (isShareUserCanceled(err)) return;
        void navigator.clipboard.writeText(url);
      });
    } else {
      void navigator.clipboard.writeText(url);
    }
  };

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
            <p className="text-xs font-bold text-parofc-gold uppercase tracking-[0.2em] mb-3">
              Watch &amp; Stream
            </p>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white uppercase tracking-tight leading-none">
              Paro FC <span className="text-parofc-gold">TV</span>
            </h1>
            <p className="mt-4 max-w-xl text-sm md:text-base text-white/60 leading-relaxed">
              Match highlights, behind-the-scenes, interviews and every moment
              from the Pride of Paro.
            </p>
          </motion.div>
        </div>

        <div className="h-1 bg-gradient-to-r from-parofc-red via-parofc-gold to-bronze" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 md:py-12">
        {loading ? (
          <Loader />
        ) : videos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24">
            <HugeiconsIcon
              icon={YoutubeIcon}
              size={32}
              className="text-gray-200 mb-3"
            />
            <span className="text-sm text-gray-400 font-medium">
              No videos available yet
            </span>
          </div>
        ) : (
          <div className="space-y-10">
            {/* Featured video */}
            {featured && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <button
                  type="button"
                  onClick={() => setActiveId(featured.videoId)}
                  className="group grid grid-cols-1 lg:grid-cols-5 gap-5 cursor-pointer w-full text-left"
                  aria-label={`Play ${featured.title}`}
                >
                  {/* Thumbnail — 3 cols */}
                  <div className="lg:col-span-3 relative aspect-video overflow-hidden bg-gray-50">
                    <VideoThumbnail
                      videoId={featured.videoId}
                      title={featured.title}
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent" />

                    {/* Play button */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-parofc-red text-white shadow-xl transition-transform duration-300 group-hover:scale-110">
                        <HugeiconsIcon
                          icon={PlayIcon}
                          size={32}
                          className="ml-1"
                        />
                      </span>
                    </div>

                    {/* Featured badge */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-parofc-red px-2.5 py-1">
                      <HugeiconsIcon
                        icon={YoutubeIcon}
                        size={12}
                        className="text-white"
                      />
                      <span className="text-white text-2xs font-bold uppercase tracking-widest">
                        Featured
                      </span>
                    </div>

                    {/* Share */}
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={(e) =>
                        shareVideo(e, featured.videoId, featured.title)
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          shareVideo(
                            e as unknown as React.MouseEvent,
                            featured.videoId,
                            featured.title,
                          );
                        }
                      }}
                      className="absolute bottom-3 right-3 z-[3] p-2 text-white/80 hover:text-white transition-colors hover:bg-white/10 cursor-pointer"
                      aria-label="Share video"
                    >
                      <HugeiconsIcon icon={Share01Icon} size={18} />
                    </span>
                  </div>

                  {/* Info — 2 cols */}
                  <div className="lg:col-span-2 flex flex-col justify-center py-2">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-2xs font-bold text-parofc-red uppercase tracking-widest">
                        Latest
                      </span>
                      <span className="text-gray-300">·</span>
                      <span className="text-2xs text-gray-400 font-medium">
                        {formatDate(featured.publishedAt)}
                      </span>
                    </div>

                    <h2 className="text-2xl md:text-3xl font-black text-dark-charcoal leading-tight group-hover:text-parofc-red transition-colors duration-200 mb-3">
                      {featured.title}
                    </h2>

                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-dark-charcoal group-hover:text-parofc-red transition-colors duration-200 uppercase tracking-wider mt-2">
                      <HugeiconsIcon icon={PlayIcon} size={14} />
                      Watch Now
                    </span>
                  </div>
                </button>
              </motion.div>
            )}

            {/* Divider */}
            {rest.length > 0 && <div className="h-px bg-gray-100" />}

            {/* Rest — 3-column grid */}
            {rest.length > 0 && (
              <div>
                <div className="flex items-end justify-between mb-6">
                  <h3 className="text-2xl md:text-3xl font-black text-dark-charcoal uppercase tracking-tight leading-none">
                    All Videos
                  </h3>
                  <span className="text-2xs text-gray-400 font-medium uppercase tracking-widest">
                    {rest.length} {rest.length === 1 ? "video" : "videos"}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-8">
                  {rest.map((item, index) => (
                    <motion.div
                      key={item._id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.04, duration: 0.3 }}
                    >
                      <button
                        type="button"
                        onClick={() => setActiveId(item.videoId)}
                        className="group block cursor-pointer w-full text-left"
                        aria-label={`Play ${item.title}`}
                      >
                        {/* Thumbnail */}
                        <div className="relative aspect-video overflow-hidden bg-gray-50 mb-3">
                          <VideoThumbnail
                            videoId={item.videoId}
                            title={item.title}
                          />
                          <div className="absolute inset-0 bg-dark-charcoal/0 group-hover:bg-dark-charcoal/30 transition-colors duration-300" />

                          {/* Play button */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="flex items-center justify-center w-12 h-12 bg-parofc-red text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                              <HugeiconsIcon
                                icon={PlayIcon}
                                size={20}
                                className="ml-0.5"
                              />
                            </span>
                          </div>

                          {/* YouTube badge */}
                          <div className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1 bg-dark-charcoal/70 backdrop-blur-sm px-2 py-1">
                            <HugeiconsIcon
                              icon={YoutubeIcon}
                              size={12}
                              className="text-white"
                            />
                            <span className="text-white text-2xs font-bold uppercase tracking-wider">
                              Watch
                            </span>
                          </div>
                        </div>

                        {/* Meta */}
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xs text-gray-400 font-medium">
                            {formatDate(item.publishedAt)}
                          </span>
                        </div>

                        {/* Title */}
                        <h4 className="text-base font-bold text-dark-charcoal leading-snug line-clamp-2 group-hover:text-parofc-red transition-colors duration-200">
                          {item.title}
                        </h4>
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Player Modal */}
      {activeId && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setActiveId(null)}
        >
          <button
            type="button"
            onClick={() => setActiveId(null)}
            className="absolute top-4 right-4 z-[110] w-11 h-11 flex items-center justify-center rounded-full bg-white/10 hover:bg-parofc-red text-white border border-white/20 hover:border-parofc-red backdrop-blur-md transition-all duration-200 cursor-pointer"
            aria-label="Close video"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={20} />
          </button>
          <div
            className="relative w-full max-w-5xl aspect-video"
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              src={getYoutubeNocookieEmbedUrl(activeId)}
              title="Paro FC TV"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>
        </div>
      )}
    </div>
  );
}
