'use client';

// hooks/usePolling.ts
// Generic polling hook built on SWR.
// All data-fetching hooks in this app delegate to this.

import useSWR, { type SWRConfiguration } from 'swr';
import { swrFetcher } from '@/lib/fetcher';
import { logger } from '@/lib/logger';
import type { ApiResponse } from '@/lib/types';

const DEFAULT_POLL_INTERVAL =
  parseInt(process.env.NEXT_PUBLIC_POLL_INTERVAL_MS ?? '20000', 10);

export interface UsePollingResult<T> {
  data: T | undefined;
  source: ApiResponse<T>['source'] | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | undefined;
  lastUpdated: string | undefined;
  mutate: () => void;
}

export function usePolling<T>(
  endpoint: string | null,
  options: SWRConfiguration & {
    intervalMs?: number;
    context?: string;
  } = {}
): UsePollingResult<T> {
  const { intervalMs = DEFAULT_POLL_INTERVAL, context = endpoint ?? 'unknown', ...swrOpts } = options;

  const { data: raw, error, isLoading, mutate } = useSWR<ApiResponse<T>>(
    endpoint,
    swrFetcher,
    {
      refreshInterval: intervalMs,
      revalidateOnFocus: false,
      shouldRetryOnError: true,
      errorRetryCount: 3,
      errorRetryInterval: 5000,
      onError(err) {
        logger.warn(`Polling error [${context}]: ${err.message}`, err, 'polling');
      },
      onSuccess(res) {
        if (res.source === 'mock') {
          logger.warn(`[${context}] returned mock/fallback data`, undefined, 'polling');
        }
      },
      ...swrOpts,
    }
  );

  return {
    data: raw?.data,
    source: raw?.source,
    isLoading,
    isError: !!error,
    error: error as Error | undefined,
    lastUpdated: raw?.timestamp,
    mutate,
  };
}
