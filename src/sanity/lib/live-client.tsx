"use client";

import { createClient } from "@sanity/client";
import type { QueryParams } from "@sanity/client";
import { SANITY_FALLBACKS } from "@/lib/constants";
import { useEffect, useRef, useState } from "react";

function getLiveSanityConfig() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || SANITY_FALLBACKS.PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || SANITY_FALLBACKS.DATASET;
  return {
    projectId,
    dataset,
    apiVersion: "2024-01-01",
    useCdn: false,
  } as const;
}

const liveClient = createClient(getLiveSanityConfig());

export function useSanityLiveQuery<T>(query: string, params: QueryParams, initialData: T) {
  const [data, setData] = useState<T>(initialData);

  // Always-current refs so the effect never captures stale values
  const paramsRef = useRef(params);
  paramsRef.current = params;

  const paramsKey = JSON.stringify(params ?? {});

  useEffect(() => {
    let active = true;

    // Initial fetch with current params
    liveClient
      .fetch<T>(query, paramsRef.current)
      .then((res) => { if (active) setData(res); })
      .catch(() => {});

    // Live subscription — re-fetches on any matching document change
    const sub = liveClient
      .listen(query, paramsRef.current, { includeResult: false, visibility: "query" })
      .subscribe({
        next: async () => {
          try {
            const res = await liveClient.fetch<T>(query, paramsRef.current);
            if (active) setData(res);
          } catch {}
        },
        error: () => {},
      });

    return () => {
      active = false;
      sub.unsubscribe();
    };
  // paramsKey is the stable string representation of params — re-run when it changes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, paramsKey]);

  return data;
}

// Optional layout helper (kept for compatibility)
export function SanityLive() {
  return null;
}
