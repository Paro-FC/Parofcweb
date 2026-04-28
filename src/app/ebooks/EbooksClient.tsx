"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowUpRight01Icon,
  Copy01Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import type { EbookItem } from "./page";

export default function EbooksClient({ items }: { items: EbookItem[] }) {
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!copiedUrl) return;
    const t = setTimeout(() => setCopiedUrl(null), 1200);
    return () => clearTimeout(t);
  }, [copiedUrl]);

  async function copy(url: string) {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedUrl(url);
    } catch {
      // clipboard may be blocked
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
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
              Library
            </p>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white uppercase tracking-tight leading-none">
              Ebooks
            </h1>
          </motion.div>
        </div>

        <div className="h-1 bg-gradient-to-r from-parofc-red via-parofc-gold to-bronze" />
      </div>

      {/* List */}
      <div className="container mx-auto px-4 py-8 md:py-12">
        {items.length === 0 ? (
          <div className="max-w-2xl mx-auto">
            <div className="rounded-2xl border border-gray-100 bg-white p-8 md:p-10">
              <p className="text-xs font-bold text-parofc-gold uppercase tracking-[0.2em] mb-3">
                Ebooks
              </p>
              <h2 className="text-2xl md:text-3xl font-black text-dark-charcoal uppercase tracking-tight mb-3">
                No ebooks yet
              </h2>
            </div>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5"
            >
              {items.map((it, index) => (
                <motion.div
                  key={it._id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2, delay: index * 0.04 }}
                  className="group relative rounded-2xl border border-parofc-gold/40 bg-white overflow-hidden"
                >
                  <div className="p-5">
                    {/* Book icon + index */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-dark-charcoal/5 text-dark-charcoal text-xs font-black">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="text-[10px] font-bold text-parofc-gold uppercase tracking-[0.15em]">
                        Ebook
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-black text-dark-charcoal leading-snug uppercase tracking-tight line-clamp-2 mb-1">
                      {it.title}
                    </h3>

                    {/* Description */}
                    {it.description ? (
                      <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                        {it.description}
                      </p>
                    ) : (
                      <div className="mb-4" />
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                      <Link
                        href={it.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 h-10 rounded-xl bg-dark-charcoal text-white text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-black transition-colors duration-200"
                      >
                        Read
                        <HugeiconsIcon icon={ArrowUpRight01Icon} size={16} />
                      </Link>
                      <button
                        onClick={() => copy(it.url)}
                        className="w-10 h-10 rounded-xl border border-gray-200 bg-white text-gray-500 hover:text-dark-charcoal hover:border-gray-300 flex items-center justify-center transition-colors duration-200 cursor-pointer"
                        aria-label="Copy URL"
                      >
                        <HugeiconsIcon
                          icon={copiedUrl === it.url ? Tick02Icon : Copy01Icon}
                          size={18}
                        />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
