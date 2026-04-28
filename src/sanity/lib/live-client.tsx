"use client";

import { createClient } from "@sanity/client";
import type { QueryParams } from "@sanity/client";
import { SANITY_FALLBACKS } from "@/lib/constants";
import { useEffect, useMemo, useRef, useState } from "react";

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
  const paramsKey = useMemo(() => JSON.stringify(params ?? {}), [params]);
  const mountedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;

    liveClient
      .fetch<T>(query, params)
      .then((res) => {
        if (mountedRef.current) setData(res);
      })
      .catch(() => {
        // keep initialData on failure
      });

    const sub = liveClient
      .listen(query, params, { includeResult: false, visibility: "query" })
      .subscribe({
        next: async () => {
          try {
            const res = await liveClient.fetch<T>(query, params);
            if (mountedRef.current) setData(res);
          } catch {
            // ignore transient errors
          }
        },
        error: () => {
          // ignore stream errors
        },
      });

    return () => {
      mountedRef.current = false;
      sub.unsubscribe();
    };
  }, [query, paramsKey]); // eslint-disable-line react-hooks/exhaustive-deps

  return data;
}

// Optional layout helper (kept for compatibility)
export function SanityLive() {
  return null;
}

