"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Share01Icon,
  Bookmark01Icon,
  Clock01Icon,
  Calendar03Icon,
  ArrowRight01Icon,
  Cancel01Icon,
} from "@hugeicons/core-free-icons";
import { urlFor } from "@/sanity/lib/image";
import { isShareUserCanceled } from "@/lib/share";
import { PortableText, PortableTextComponents } from "@portabletext/react";
import { useState, useEffect } from "react";

interface NewsArticleProps {
  article: {
    _id: string;
    title: string;
    slug: string;
    image: unknown;
    badge: string;
    publishedAt: string;
    description: string;
    body?: unknown[];
    author?: string;
    readTime?: number;
  };
  relatedNews: {
    _id: string;
    title: string;
    slug: string;
    image: unknown;
    badge: string;
    publishedAt: string;
    description?: string;
  }[];
}

const portableTextComponents: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null;
      return (
        <figure className="my-8">
          <div className="relative w-full aspect-video rounded-lg overflow-hidden">
            <Image
              src={urlFor(value).width(1200).height(675).url()}
              alt={value.alt || "Article image"}
              fill
              className="object-cover"
            />
          </div>
          {value.caption && (
            <figcaption className="mt-2 text-center text-sm text-gray-500 italic">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
  },
  block: {
    h2: ({ children }) => (
      <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-xl font-semibold text-gray-900 mt-8 mb-3">
        {children}
      </h4>
    ),
    normal: ({ children }) => (
      <p className="text-lg text-gray-700 leading-relaxed mb-5">{children}</p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-bronze pl-6 my-10 italic text-xl text-gray-600">
        {children}
      </blockquote>
    ),
  },
  marks: {
    link: ({ children, value }) => (
      <a
        href={value?.href}
        className="text-parofc-gold hover:text-bronze underline transition-colors"
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    ),
    strong: ({ children }) => <strong className="font-bold">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
  },
};

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatTime(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatRelativeDate(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffHours < 1) return "Just now";
  if (diffHours < 24) return `${diffHours} hr${diffHours > 1 ? "s" : ""} ago`;

  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "2-digit",
  });
}

export function NewsArticle({ article, relatedNews }: NewsArticleProps) {
  const articleId = article._id;
  const bookmarkedKey = `article_bookmarked_${articleId}`;

  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage after hydration (client-side only)
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const storedBookmarked = localStorage.getItem(bookmarkedKey);
        if (storedBookmarked === "true") {
          setIsBookmarked(true);
        }
      } catch (e) {
        if (e instanceof DOMException) {
          console.warn("localStorage not available:", e.message);
        } else {
          console.error("Error loading article state:", e);
        }
      } finally {
        setIsHydrated(true);
      }
    }
  }, [bookmarkedKey]);

  // Sync bookmarked state to localStorage (only after hydration)
  useEffect(() => {
    if (isHydrated && typeof window !== "undefined") {
      try {
        localStorage.setItem(bookmarkedKey, isBookmarked.toString());
      } catch (e) {
        if (e instanceof DOMException && e.name === "QuotaExceededError") {
          console.error("localStorage quota exceeded for bookmarked state");
        } else if (e instanceof DOMException) {
          console.warn("localStorage not available:", e.message);
        } else {
          console.error("Error saving bookmarked state:", e);
        }
      }
    }
  }, [isBookmarked, bookmarkedKey, isHydrated]);

  const handleShare = async () => {
    const url = `${window.location.origin}/news/${article.slug}`;
    const shareData = {
      title: article.title,
      text: article.description || article.title,
      url: url,
    };

    try {
      // Use Web Share API if available (mobile devices)
      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        // Fallback: Copy link to clipboard
        await navigator.clipboard.writeText(url);
        alert("Link copied to clipboard!");
      }
    } catch (err) {
      if (!isShareUserCanceled(err)) {
        // Fallback: Copy link to clipboard
        try {
          await navigator.clipboard.writeText(url);
          alert("Link copied to clipboard!");
        } catch (clipboardErr) {
          console.error("Failed to copy link:", clipboardErr);
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative w-full h-[50vh] md:h-[60vh] lg:h-[70vh]"
      >
        {article.image ? (
          <Image
            src={urlFor(article.image).width(1920).height(1080).url()}
            alt={article.title}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-parofc-blue to-parofc-red" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {/* Badge */}
        {article.badge && (
          <div className="absolute top-4 right-4 z-10">
            <span className="bg-parofc-red text-white text-sm font-bold px-4 py-2 rounded-full uppercase tracking-wide">
              {article.badge}
            </span>
          </div>
        )}
      </motion.div>

      {/* Article Content */}
      <motion.article
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="relative mx-auto max-w-4xl px-4 md:px-8 lg:px-12 pt-10 pb-8"
      >
        <div>
          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-parofc-red leading-tight mb-4">
            {article.title}
          </h1>

          {/* Meta info */}
          <div className="flex flex-wrap items-center gap-4 md:gap-6 text-gray-500 text-sm mb-10 pb-6 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <HugeiconsIcon icon={Calendar03Icon} size={16} />
              <span>{formatDate(article.publishedAt)}</span>
            </div>
            <div className="flex items-center gap-2">
              <HugeiconsIcon icon={Clock01Icon} size={16} />
              <span>{formatTime(article.publishedAt)}</span>
            </div>
            {article.readTime && (
              <div className="flex items-center gap-2">
                <span className="w-1 h-1 bg-gray-400 rounded-full" />
                <span>{article.readTime} min read</span>
              </div>
            )}
            {article.author && (
              <div className="flex items-center gap-2">
                <span className="w-1 h-1 bg-gray-400 rounded-full" />
                <span>By {article.author}</span>
              </div>
            )}
          </div>

          {/* Article Body */}
          {article.body && (
            <div className="prose prose-lg max-w-none mt-8">
              <PortableText
                value={article.body as any}
                components={portableTextComponents}
              />
            </div>
          )}

          {/* If no body, show description as content */}
          {!article.body && article.description && (
            <div className="prose prose-lg max-w-none mt-8">
              <p className="text-lg text-gray-700 leading-relaxed">
                {article.description}
              </p>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center justify-between mt-10 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={`p-2 rounded-full transition-all ${
                  isBookmarked
                    ? "bg-parofc-gold text-dark-charcoal"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <HugeiconsIcon
                  icon={Bookmark01Icon}
                  size={20}
                  className={
                    isBookmarked ? "text-parofc-gold" : "text-gray-400"
                  }
                />
              </button>
            </div>
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-gray-700 hover:bg-gray-200 transition-colors"
            >
              <HugeiconsIcon icon={Share01Icon} size={20} />
              <span className="font-medium">Share</span>
            </button>
          </div>
        </div>

      </motion.article>

      {/* Related News */}
      {relatedNews.length > 0 && (
        <section className="py-12 md:py-16 px-4 bg-white">
          <div className="container mx-auto">
            <div className="flex items-center justify-between mb-6 md:mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Related News</h2>
              <Link
                href="/"
                className="flex items-center gap-1 text-parofc-gold hover:text-bronze transition-colors font-medium"
              >
                View all
                <HugeiconsIcon icon={ArrowRight01Icon} size={20} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-8">
              {relatedNews.map((news, index) => (
                <motion.div
                  key={news._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.04, duration: 0.3 }}
                >
                  <Link
                    href={`/news/${news.slug}`}
                    className="group block cursor-pointer"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-gray-50 mb-3">
                      {news.image ? (
                        <Image
                          src={urlFor(news.image).width(500).height(313).url()}
                          alt={news.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300" />
                      )}
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                      {news.badge && (
                        <span className="text-[10px] font-bold text-parofc-red uppercase tracking-widest">
                          {news.badge}
                        </span>
                      )}
                      {news.badge && <span className="text-gray-300">·</span>}
                      <span className="text-[10px] text-gray-400 font-medium">
                        {formatRelativeDate(news.publishedAt)}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-dark-charcoal leading-snug line-clamp-2 group-hover:text-parofc-red transition-colors duration-200">
                      {news.title}
                    </h3>

                    {news.description && (
                      <p className="text-xs text-gray-400 leading-relaxed line-clamp-2 mt-1.5">
                        {news.description}
                      </p>
                    )}
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Floating Close Button */}
      <Link
        href="/"
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-14 h-14 bg-gray-900 hover:bg-gray-800 text-white rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110"
      >
        <HugeiconsIcon icon={Cancel01Icon} size={24} />
      </Link>
    </div>
  );
}
