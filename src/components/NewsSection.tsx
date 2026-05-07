"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/lib/image";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";

interface NewsItem {
  _id: string;
  image: unknown;
  title: string;
  badge: string;
  publishedAt: string;
  description?: string;
  slug: string;
}

const fallbackNews: NewsItem[] = [
  {
    _id: "1",
    image: null,
    title: "Mobility requirements and plan for Paro FC v Thimphu City",
    badge: "",
    publishedAt: new Date().toISOString(),
    slug: "mobility-requirements",
  },
  {
    _id: "2",
    image: null,
    title: "Agreement for the transfer of a Paro FC player to a partner club",
    badge: "TRANSFERS",
    publishedAt: new Date().toISOString(),
    description: "Paro FC retains a percentage of any future sale...",
    slug: "transfer-agreement",
  },
];

function formatDate(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffHours < 1) return "Just now";
  if (diffHours < 24) return `${diffHours}h ago`;

  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
  });
}

export function NewsSection({ news }: { news?: NewsItem[] }) {
  const newsItems = news && news.length > 0 ? news : fallbackNews;
  const featured = newsItems[0];
  const rest = newsItems.slice(1, 5);

  return (
    <section className="py-12 md:py-20 px-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-dark-charcoal leading-none">
            News
          </h2>
          <Link
            href="/news"
            className="inline-flex items-center gap-2 text-sm font-bold text-dark-charcoal hover:text-parofc-red transition-colors duration-200 uppercase tracking-wider cursor-pointer"
          >
            All News
            <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
          </Link>
        </div>

        {/* Editorial grid: featured + sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          {/* Featured article - takes 3 columns */}
          {featured && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-3"
            >
              <Link
                href={`/news/${featured.slug}`}
                className="group block relative overflow-hidden rounded-2xl cursor-pointer"
              >
                <div className="relative w-full bg-gray-100">
                  {featured.image ? (
                    <Image
                      src={urlFor(featured.image).width(800).url()}
                      alt={featured.title}
                      width={0}
                      height={0}
                      sizes="(max-width: 1024px) 100vw, 60vw"
                      style={{ width: "100%", height: "auto" }}
                      className="transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="aspect-[16/10] bg-gradient-to-br from-dark-charcoal to-parofc-red" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                    {featured.badge && (
                      <span className="inline-block bg-parofc-gold text-dark-charcoal text-2xs font-bold px-3 py-1 mb-3 uppercase tracking-widest">
                        {featured.badge}
                      </span>
                    )}
                    <h3 className="text-xl md:text-3xl font-bold text-white leading-tight mb-2">
                      {featured.title}
                    </h3>
                    <span className="text-xs text-white/50 font-medium">
                      {formatDate(featured.publishedAt)}
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          )}

          {/* Side articles - takes 2 columns */}
          <div className="lg:col-span-2 grid grid-cols-1 gap-5">
            {rest.map((item, index) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (index + 1) * 0.05 }}
              >
                <Link
                  href={`/news/${item.slug}`}
                  className="group flex gap-4 items-start cursor-pointer"
                >
                  <div className="relative w-24 h-24 md:w-28 md:h-28 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100">
                    {item.image ? (
                      <Image
                        src={urlFor(item.image).width(200).height(200).url()}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300" />
                    )}
                  </div>

                  <div className="flex-1 py-1">
                    {item.badge && (
                      <span className="inline-block text-parofc-red text-2xs font-bold mb-1 uppercase tracking-widest">
                        {item.badge}
                      </span>
                    )}
                    <h3 className="text-sm md:text-base font-bold text-dark-charcoal leading-snug line-clamp-2 group-hover:text-parofc-red transition-colors duration-200">
                      {item.title}
                    </h3>
                    <span className="text-xs text-gray-400 mt-1 block">
                      {formatDate(item.publishedAt)}
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
