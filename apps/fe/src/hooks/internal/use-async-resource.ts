"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ApiError } from "@/types";
import { POLLING_INTERVAL_MS } from "@/lib/constants";

export interface AsyncResource<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
  refetch: () => void;
}

/**
 * Shared fetch/loading/error/polling boilerplate for the gateway data hooks.
 * `fetcher` returning `null` skips the request entirely (e.g. missing required params).
 */
export function useAsyncResource<T>(
  fetcher: () => Promise<T> | null,
  deps: unknown[],
  poll: boolean
): AsyncResource<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const load = useCallback(() => {
    const promise = fetcherRef.current();
    if (!promise) {
      setLoading(false);
      return;
    }
    setLoading(true);
    promise
      .then((result) => {
        setData(result);
        setError(null);
      })
      .catch((err: ApiError) => setError(err))
      .finally(() => setLoading(false));
    // `deps` is caller-controlled and intentionally drives this callback's identity.
  }, deps);

  useEffect(() => {
    load();
    if (!poll) return;
    const interval = setInterval(load, POLLING_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [load, poll]);

  return { data, loading, error, refetch: load };
}
