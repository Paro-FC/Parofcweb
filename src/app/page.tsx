import { sanityFetch } from "@/sanity/lib/live";
import {
  NEWS_QUERY,
  MATCHES_QUERY,
  MAIN_PARTNERS_QUERY,
  TROPHIES_QUERY,
  YOUTUBE_VIDEOS_QUERY,
  STANDINGS_HOME_LATEST_QUERY,
} from "@/sanity/lib/queries";
import { HomeClient } from "@/components/HomeClient";

export default async function Home() {
  const [
    newsResult,
    matchesResult,
    mainPartnersResult,
    trophiesResult,
    youtubeVideosResult,
    standingsResult,
  ] = await Promise.all([
    sanityFetch({ query: NEWS_QUERY }).catch(() => ({ data: [] })),
    sanityFetch({ query: MATCHES_QUERY }).catch(() => ({ data: [] })),
    sanityFetch({ query: MAIN_PARTNERS_QUERY }).catch(() => ({ data: [] })),
    sanityFetch({ query: TROPHIES_QUERY }).catch(() => ({ data: [] })),
    sanityFetch({ query: YOUTUBE_VIDEOS_QUERY }).catch(() => ({ data: [] })),
    sanityFetch({ query: STANDINGS_HOME_LATEST_QUERY }).catch(() => ({
      data: null,
    })),
  ]);

  return (
    <HomeClient
      news={(newsResult.data as any) ?? []}
      matches={(matchesResult.data as any) ?? []}
      mainPartners={(mainPartnersResult.data as any) ?? []}
      trophies={(trophiesResult.data as any) ?? []}
      youtubeVideos={(youtubeVideosResult.data as any) ?? []}
      standings={(standingsResult.data as any) ?? null}
    />
  );
}
