import { useEffect, useRef, useState } from "react";

type CacheEntry<T> = {
  data?: T;
  error?: Error;
  promise?: Promise<void> | null;
  timestamp: number;
};

const cache = new Map<string, CacheEntry<unknown>>();

export interface SwrOptions {
  refreshInterval?: number;
  revalidateOnFocus?: boolean;
}

export interface SwrResponse<T> {
  data?: T;
  error?: Error;
  isLoading: boolean;
  mutate: (updater: T | ((current?: T) => T)) => void;
  reload: () => Promise<void>;
}

export function useSwrLite<T>(
  key: string | null,
  fetcher: () => Promise<T>,
  options: SwrOptions = {},
): SwrResponse<T> {
  const { refreshInterval, revalidateOnFocus = true } = options;
  const [data, setData] = useState<T | undefined>(() => {
    if (!key) {
      return undefined;
    }
    const entry = cache.get(key) as CacheEntry<T> | undefined;
    return entry?.data;
  });
  const [error, setError] = useState<Error | undefined>(() => {
    if (!key) {
      return undefined;
    }
    const entry = cache.get(key) as CacheEntry<T> | undefined;
    return entry?.error;
  });
  const [isLoading, setIsLoading] = useState<boolean>(() => {
    if (!key) {
      return false;
    }
    const entry = cache.get(key) as CacheEntry<T> | undefined;
    return !entry?.data && !entry?.error;
  });

  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const refreshRef = useRef<Promise<void> | null>(null);

  async function load() {
    if (!key) {
      return;
    }
    const existing = cache.get(key) as CacheEntry<T> | undefined;
    if (existing?.promise) {
      await existing.promise;
      return;
    }

    const entry: CacheEntry<T> = existing ?? { timestamp: Date.now(), promise: null };
    setIsLoading(true);
    const promise = fetcherRef.current()
      .then((result) => {
        entry.data = result;
        entry.error = undefined;
        entry.timestamp = Date.now();
        setData(result);
        setError(undefined);
      })
      .catch((err: Error) => {
        entry.error = err;
        setError(err);
      })
      .finally(() => {
        entry.promise = null;
        setIsLoading(false);
      });

    entry.promise = promise;
    cache.set(key, entry);
    await promise;
  }

  useEffect(() => {
    if (!key) {
      return;
    }
    const entry = cache.get(key) as CacheEntry<T> | undefined;
    if (!entry?.data && !entry?.promise) {
      void load();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => {
    if (!key || !refreshInterval) {
      return;
    }
    const id = setInterval(() => {
      refreshRef.current = load();
    }, refreshInterval);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, refreshInterval]);

  useEffect(() => {
    if (!key || !revalidateOnFocus) {
      return;
    }
    const handler = () => {
      refreshRef.current = load();
    };
    if (typeof window !== "undefined") {
      window.addEventListener("focus", handler);
      return () => window.removeEventListener("focus", handler);
    }
    return undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, revalidateOnFocus]);

  const mutate = (updater: T | ((current?: T) => T)) => {
    if (!key) {
      return;
    }
    const entry = cache.get(key) as CacheEntry<T> | undefined;
    const nextValue =
      typeof updater === "function" ? (updater as (current?: T) => T)(entry?.data) : updater;
    const updated: CacheEntry<T> = entry ?? { timestamp: Date.now(), promise: null };
    updated.data = nextValue;
    updated.error = undefined;
    updated.timestamp = Date.now();
    cache.set(key, updated);
    setData(nextValue);
    setError(undefined);
  };

  const reload = async () => {
    if (!key) {
      return;
    }
    await load();
  };

  return {
    data,
    error,
    isLoading,
    mutate,
    reload,
  };
}

export function clearSwrCache(prefix?: string) {
  if (!prefix) {
    cache.clear();
    return;
  }
  for (const key of Array.from(cache.keys())) {
    if (key.startsWith(prefix)) {
      cache.delete(key);
    }
  }
}
