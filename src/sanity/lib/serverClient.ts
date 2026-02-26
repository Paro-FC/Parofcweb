import { createClient } from "@sanity/client";
import { SANITY_FALLBACKS } from "@/lib/constants";

/**
 * Sanity client for server-side use with write access.
 * Use only in API routes or server code. Do not expose to the client.
 */
export function getServerClient() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || SANITY_FALLBACKS.PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || SANITY_FALLBACKS.DATASET;
  const token = process.env.SANITY_API_TOKEN;

  return createClient({
    projectId,
    dataset,
    apiVersion: "2024-01-01",
    useCdn: false,
    token: token || undefined,
  });
}
