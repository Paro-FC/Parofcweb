"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { sanityFetch } from "@/sanity/lib/live";
import { ACADEMY_PLAYERS_QUERY } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import Loader from "@/components/Loader";

type AcademyTab = "youth" | "grassroot";

type AcademyDoc = {
  _id: string;
  title?: string;
  youth?: any[];
  grassroot?: any[];
};

export default function AcademyPage() {
  const [loading, setLoading] = useState(true);
  const [academy, setAcademy] = useState<AcademyDoc | null>(null);
  const [tab, setTab] = useState<AcademyTab>("youth");

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      try {
        const result = await sanityFetch({ query: ACADEMY_PLAYERS_QUERY });
        setAcademy((result.data as AcademyDoc) || null);
      } catch (e) {
        console.error("Error fetching academy:", e);
        setAcademy(null);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  const components: PortableTextComponents = useMemo(
    () => ({
      types: {
        image: ({ value }) => {
          if (!value?.asset) return null;
          return (
            <figure className="my-8">
              <div className="relative w-full aspect-[16/9] overflow-hidden rounded-2xl bg-gray-50 ring-1 ring-black/5">
                <Image
                  src={urlFor(value).width(1600).height(900).url()}
                  alt={value.alt || "Academy image"}
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
          <h2 className="text-3xl md:text-4xl font-black text-dark-charcoal mt-12 mb-5 uppercase tracking-tight">
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-xl md:text-2xl font-bold text-dark-charcoal mt-10 mb-4">
            {children}
          </h3>
        ),
        normal: ({ children }) => (
          <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-5">
            {children}
          </p>
        ),
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-parofc-gold pl-6 my-10 italic text-xl text-gray-600">
            {children}
          </blockquote>
        ),
      },
      marks: {
        link: ({ children, value }) => (
          <a
            href={value?.href}
            className="text-parofc-red hover:text-dark-charcoal underline transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            {children}
          </a>
        ),
        strong: ({ children }) => <strong className="font-bold">{children}</strong>,
        em: ({ children }) => <em className="italic">{children}</em>,
      },
    }),
    [],
  );

  const content = (tab === "youth" ? academy?.youth : academy?.grassroot) || [];

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
              Academy
            </p>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white uppercase tracking-tight leading-none">
              Youth &{" "}
              <span className="text-parofc-gold">
                Grassroot
              </span>
            </h1>
          </motion.div>
        </div>

        <div className="h-1 bg-gradient-to-r from-parofc-red via-parofc-gold to-bronze" />
      </div>

      {/* Tabs */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-0 overflow-x-auto -mb-px scrollbar-hide">
            {([
              { id: "youth", label: "Youth" },
              { id: "grassroot", label: "Grassroot" },
            ] as const).map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`relative px-4 md:px-5 py-3 text-xs font-bold whitespace-nowrap transition-colors duration-200 uppercase tracking-widest cursor-pointer ${
                  tab === t.id
                    ? "text-dark-charcoal"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {t.label}
                {tab === t.id && (
                  <motion.div
                    layoutId="activeAcademyPageTab"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-dark-charcoal"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 md:py-12">
        {loading ? (
          <Loader />
        ) : !academy ? (
          <div className="max-w-3xl mx-auto">
            <div className="rounded-2xl border border-gray-100 bg-white p-8 md:p-10">
              <p className="text-xs font-bold text-parofc-gold uppercase tracking-[0.2em] mb-3">
                Academy
              </p>
              <h2 className="text-2xl md:text-3xl font-black text-dark-charcoal uppercase tracking-tight mb-3">
                No academy content yet
              </h2>
              <p className="text-gray-600">
                In Studio, create an{" "}
                <span className="font-semibold">Academy (Players)</span> document and add
                content for Youth / Grassroot (you can upload images inside the editor).
              </p>
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto">
            <div className="mb-8">
              <p className="text-xs font-bold text-parofc-gold uppercase tracking-[0.2em] mb-3">
                {academy.title || "Academy"}
              </p>
              <h2 className="text-3xl md:text-4xl font-black text-dark-charcoal uppercase tracking-tight">
                {tab === "youth" ? "Youth" : "Grassroot"}
              </h2>
            </div>

            <div className="prose prose-lg max-w-none">
              <PortableText value={content as any} components={components} />
            </div>
          </div>
        )}
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
          .scrollbar-hide::-webkit-scrollbar { display: none; }
          .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        `,
        }}
      />
    </div>
  );
}

