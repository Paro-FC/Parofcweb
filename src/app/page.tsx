import Image from "next/image";
import { Hero } from "@/components/Hero";
import { CalendarSection } from "@/components/CalendarSection";
import { NewsSection } from "@/components/NewsSection";
import { PlayersSection } from "@/components/PlayersSection";
import { TrophiesSection } from "@/components/TrophiesSection";
import { PartnersSection } from "@/components/PartnersSection";
import { sanityFetch } from "@/sanity/lib/live";
import {
  NEWS_QUERY,
  PLAYERS_QUERY,
  MATCHES_QUERY,
  STORIES_QUERY,
  MAIN_PARTNERS_QUERY,
  TROPHIES_QUERY,
} from "@/sanity/lib/queries";
import dynamic from "next/dynamic";

const BarcaStoriesSection = dynamic(
  () =>
    import("@/components/BarcaStoriesSection").then((mod) => ({
      default: mod.BarcaStoriesSection,
    })),
  {
    loading: () => (
      <div className="py-16 text-center text-gray-500">Loading stories...</div>
    ),
  },
);

export default async function Home() {
  const [
    newsResult,
    playersResult,
    matchesResult,
    storiesResult,
    mainPartnersResult,
    trophiesResult,
  ] = await Promise.all([
    sanityFetch({ query: NEWS_QUERY }).catch(() => ({ data: [] })),
    sanityFetch({ query: PLAYERS_QUERY }).catch(() => ({ data: [] })),
    sanityFetch({ query: MATCHES_QUERY }).catch(() => ({ data: [] })),
    sanityFetch({ query: STORIES_QUERY }).catch(() => ({ data: [] })),
    sanityFetch({ query: MAIN_PARTNERS_QUERY }).catch(() => ({ data: [] })),
    sanityFetch({ query: TROPHIES_QUERY }).catch(() => ({ data: [] })),
  ]);

  return (
    <div className="min-h-screen bg-white">
      <Hero news={newsResult.data as any} />

      {/* Content sections with clean white background */}
      <div className="bg-white">
        <BarcaStoriesSection stories={storiesResult.data as any} />

        {/* Subtle divider */}
        <div className="container mx-auto px-4">
          <div className="h-px bg-gray-100" />
        </div>

        <CalendarSection matches={matchesResult.data as any} />

        <div className="container mx-auto px-4">
          <div className="h-px bg-gray-100" />
        </div>

        <NewsSection news={newsResult.data as any} />
      </div>

      {/* Sponsor Banner */}
      <div className="bg-white py-6">
        <div className="container mx-auto px-4">
          <a href="https://www.tashinamgay.com" target="_blank" rel="noopener noreferrer">
            <Image
              src="/assets/newBanner-ads_TNR.jpg"
              alt="Tashi Namgay Resort — Poolside Café, Swimming Pool & Bumpy Castle"
              width={1200}
              height={120}
              className="w-full h-auto rounded-lg"
              priority={false}
            />
          </a>
        </div>
      </div>

      {/* Dark sections */}
      <PlayersSection players={playersResult.data as any} />
      <TrophiesSection trophies={trophiesResult.data as any} />
      <PartnersSection
        partners={mainPartnersResult.data as any}
        title="Main Partners"
      />
    </div>
  );
}
