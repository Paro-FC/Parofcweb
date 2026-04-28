import { sanityFetch } from "@/sanity/lib/live";
import { EBOOKS_QUERY } from "@/sanity/lib/queries";
import EbooksClient from "./EbooksClient";

export type EbookItem = {
  _id: string;
  title: string;
  url: string;
  description?: string;
};

export default async function EbooksPage() {
  const result = await sanityFetch({ query: EBOOKS_QUERY });
  const items = (result.data as EbookItem[]) || [];

  return <EbooksClient items={items} />;
}
