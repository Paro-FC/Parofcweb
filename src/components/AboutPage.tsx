"use client";

import { urlFor } from "@/sanity/lib/image";
import { sanityFetch } from "@/sanity/lib/live";
import { ABOUT_PAGE_QUERY } from "@/sanity/lib/queries";
import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

interface TableBlockValue {
  _type: "tableBlock";
  caption?: string;
  headerRow?: boolean;
  rows?: { _key: string; cells?: string[] }[];
}

interface AboutDoc {
  _id: string;
  title?: string;
  subtitle?: string;
  heroImage?: unknown;
  body?: unknown[];
}

function TableBlock({ value }: { value: TableBlockValue }) {
  const rows = value.rows ?? [];
  if (rows.length === 0) return null;

  const headerRow = value.headerRow !== false;

  return (
    <figure className="my-8 overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <tbody>
          {rows.map((row, rowIdx) => {
            const isHeader = headerRow && rowIdx === 0;
            return (
              <tr
                key={row._key ?? rowIdx}
                className={
                  isHeader
                    ? "bg-dark-charcoal text-white"
                    : rowIdx % 2 === 0
                      ? "bg-white"
                      : "bg-gray-50"
                }
              >
                {(row.cells ?? []).map((cell, colIdx) => {
                  if (isHeader) {
                    return (
                      <th
                        key={colIdx}
                        className="px-4 py-3 text-left text-xs font-black uppercase tracking-wider border border-gray-200"
                      >
                        {cell}
                      </th>
                    );
                  }
                  return (
                    <td
                      key={colIdx}
                      className="px-4 py-3 text-gray-700 border border-gray-200"
                    >
                      {cell}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      {value.caption && (
        <figcaption className="mt-2 text-center text-xs text-gray-400 italic">
          {value.caption}
        </figcaption>
      )}
    </figure>
  );
}

export function AboutPage() {
  const router = useRouter();
  const [about, setAbout] = useState<AboutDoc | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      try {
        const result = await sanityFetch({ query: ABOUT_PAGE_QUERY });
        setAbout((result.data as AboutDoc) ?? null);
      } catch (e) {
        console.error("Error fetching about page:", e);
        setAbout(null);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  const heroImageUrl = useMemo(() => {
    if (!about?.heroImage) return null;
    try {
      return urlFor(about.heroImage).width(1400).height(500).url();
    } catch {
      return null;
    }
  }, [about?.heroImage]);

  const components: PortableTextComponents = useMemo(
    () => ({
      types: {
        image: ({ value }) => {
          if (!value?.asset) return null;
          return (
            <figure className="my-8">
              <div className="w-full overflow-hidden rounded-lg">
                <Image
                  src={urlFor(value).width(1200).url()}
                  alt={value.alt || ""}
                  width={0}
                  height={0}
                  sizes="(max-width: 768px) 100vw, 800px"
                  style={{ width: "100%", height: "auto" }}
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
        tableBlock: ({ value }) => <TableBlock value={value as TableBlockValue} />,
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
        h4: ({ children }) => (
          <h4 className="text-lg font-bold text-dark-charcoal mt-8 mb-3">
            {children}
          </h4>
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
      list: {
        bullet: ({ children }) => (
          <ul className="list-disc list-outside pl-6 mb-5 space-y-2 text-base md:text-lg text-gray-700">
            {children}
          </ul>
        ),
        number: ({ children }) => (
          <ol className="list-decimal list-outside pl-6 mb-5 space-y-2 text-base md:text-lg text-gray-700">
            {children}
          </ol>
        ),
      },
      listItem: {
        bullet: ({ children }) => <li className="leading-relaxed">{children}</li>,
        number: ({ children }) => <li className="leading-relaxed">{children}</li>,
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
        underline: ({ children }) => <u className="underline">{children}</u>,
      },
    }),
    [],
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="relative bg-dark-charcoal overflow-hidden">
        {heroImageUrl && (
          <div className="absolute inset-0">
            <Image
              src={heroImageUrl}
              alt={about?.title ?? "About Paro FC"}
              fill
              className="object-cover opacity-20"
              priority
            />
          </div>
        )}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, transparent, transparent 20px, white 20px, white 21px)",
          }}
        />
        <div className="container mx-auto px-4 py-12 md:py-20 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-xs font-bold text-parofc-gold uppercase tracking-[0.2em] mb-3">
              Paro FC
            </p>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white uppercase tracking-tight leading-none">
              {loading
                ? "About"
                : about?.title
                  ? (() => {
                      const words = about.title.trim().split(" ");
                      const last = words.pop();
                      return (
                        <>
                          {words.join(" ")}{" "}
                          <span className="text-parofc-gold">{last}</span>
                        </>
                      );
                    })()
                  : <>About <span className="text-parofc-gold">Paro FC</span></>}
            </h1>
            {about?.subtitle && (
              <p className="mt-4 text-sm md:text-base text-white/60 max-w-xl">
                {about.subtitle}
              </p>
            )}
          </motion.div>
        </div>
        <div className="h-1 bg-gradient-to-r from-parofc-red via-parofc-gold to-bronze" />
      </div>

      {/* Body */}
      <div className="container mx-auto px-4 py-10 md:py-16">
        {loading ? (
          <div className="flex justify-center py-24">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-parofc-red" />
          </div>
        ) : !about?.body?.length ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400">
            <p className="text-sm font-medium">No content yet. Add it from the Studio.</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="w-full"
          >
            <PortableText value={about.body as any} components={components} />
          </motion.div>
        )}
      </div>

      <button
        onClick={() => router.push("/")}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-14 h-14 bg-gray-900 hover:bg-gray-800 text-white rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110"
      >
        <HugeiconsIcon icon={Cancel01Icon} size={24} />
      </button>
    </div>
  );
}
