"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Camera01Icon,
} from "@hugeicons/core-free-icons";
import { sanityFetch } from "@/sanity/lib/live";
import { PHOTOS_QUERY } from "@/sanity/lib/queries";
import Loader from "@/components/Loader";

interface Photo {
  _id: string;
  coverImage: string;
  title: string;
  date: string;
  slug: string;
  galleryUrl: string;
}

function getTimeAgo(dateString: string) {
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

export default function PhotosPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPhotos = async () => {
      setLoading(true);
      try {
        const photosResult = await sanityFetch({
          query: PHOTOS_QUERY,
        }).catch(() => ({ data: [] }));

        if (
          photosResult.data &&
          Array.isArray(photosResult.data) &&
          photosResult.data.length > 0
        ) {
          const photosData = photosResult.data.map((photo: any) => ({
            _id: photo._id,
            coverImage: photo.coverImage,
            title: photo.title,
            date: photo.date,
            slug: photo.slug,
            galleryUrl: photo.galleryUrl,
          }));
          setPhotos(photosData);
        } else {
          setPhotos([]);
        }
      } catch (error) {
        console.error("Error fetching photos:", error);
        setPhotos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
  }, []);

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
              Gallery
            </p>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white uppercase tracking-tight leading-none">
              Match Day <span className="text-parofc-gold">Photos</span>
            </h1>
          </motion.div>
        </div>

        <div className="h-1 bg-gradient-to-r from-parofc-red via-parofc-gold to-bronze" />
      </div>

      {/* Gallery Grid */}
      <div className="container mx-auto px-4 py-8 md:py-12">
        {loading ? (
          <Loader />
        ) : photos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24">
            <HugeiconsIcon
              icon={Camera01Icon}
              size={32}
              className="text-gray-200 mb-3"
            />
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
                className="group"
              >
                <a
                  href={photo.galleryUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="block cursor-pointer"
                >
                  {/* Image */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-gray-50">
                    <img
                      src={photo.coverImage}
                      alt={photo.title}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-dark-charcoal/0 group-hover:bg-dark-charcoal/35 transition-colors duration-300" />

                    {/* Link badge */}
                    <div className="absolute top-3 right-3 z-10 flex items-center gap-1 bg-dark-charcoal/70 backdrop-blur-sm px-2 py-1">
                      <HugeiconsIcon
                        icon={Camera01Icon}
                        size={12}
                        className="text-white"
                      />
                      <span className="text-white text-2xs font-bold uppercase tracking-wider">
                        Open
                      </span>
                    </div>

                    {/* View indicator on hover */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-xs font-bold text-white uppercase tracking-widest">
                        Open Gallery
                      </span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="mt-3 mb-1">
                    <h3 className="text-sm font-bold text-dark-charcoal leading-snug line-clamp-2 group-hover:text-parofc-red transition-colors duration-200">
                      {photo.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xs text-gray-400 font-medium">
                      {getTimeAgo(photo.date)}
                    </span>
                  </div>
                </a>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
