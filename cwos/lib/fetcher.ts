// lib/fetcher.ts
// Resilient fetch wrapper for external APIs.
// - Enforces timeout (default 8s)
// - Logs all failures with context
// - Returns typed ApiResponse<T> so callers always know data source

import { logger } from '@/lib/logger';
import type { ApiResponse, DataSource } from '@/lib/types';

const DEFAULT_TIMEOUT_MS = 8000;

interface FetchOptions extends RequestInit {
  timeoutMs?: number;
  context?: string;
}

/**
 * Fetch with automatic timeout + structured logging.
 * Throws on network error or non-OK status.
 */
export async function timedFetch(url: string, opts: FetchOptions = {}): Promise<Response> {
  const { timeoutMs = DEFAULT_TIMEOUT_MS, context, ...fetchOpts } = opts;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  const t0 = Date.now();
  try {
    const res = await fetch(url, { ...fetchOpts, signal: controller.signal });
    clearTimeout(timer);

    const latency = Date.now() - t0;
    if (!res.ok) {
      throw new Error(`HTTP ${res.status} ${res.statusText}`);
    }

    logger.api.success(url, latency, 'live');
    return res;
  } catch (err) {
    clearTimeout(timer);
    const isTimeout = (err as Error).name === 'AbortError';
    throw new Error(isTimeout ? `Timeout after ${timeoutMs}ms: ${url}` : String(err));
  }
}

/**
 * Fetch JSON from an external URL with fallback.
 * Always returns ApiResponse<T> — never throws.
 */
export async function fetchWithFallback<T>(
  url: string,
  fallback: T,
  opts: FetchOptions & {
    transform?: (raw: unknown) => T;
    context?: string;
  } = {}
): Promise<ApiResponse<T>> {
  const { transform, context = url, ...fetchOpts } = opts;
  const t0 = Date.now();

  try {
    const res = await timedFetch(url, { ...fetchOpts, context });
    const raw = await res.json();
    const data = transform ? transform(raw) : (raw as T);

    if (!data || (Array.isArray(data) && data.length === 0)) {
      logger.api.empty(url);
    }

    return {
      data,
      source: 'live',
      timestamp: new Date().toISOString(),
      latencyMs: Date.now() - t0,
    };
  } catch (err) {
    logger.api.fail(url, err, true);
    return {
      data: fallback,
      source: 'mock',
      timestamp: new Date().toISOString(),
      latencyMs: Date.now() - t0,
      error: String(err),
    };
  }
}

/**
 * SWR-compatible client-side fetcher.
 * Usage: useSWR('/api/airdrops', swrFetcher)
 */
export async function swrFetcher<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    const error = new Error(`API error ${res.status} from ${url}`);
    logger.error(error.message, error, 'swr');
    throw error;
  }
  return res.json();
}

/**
 * Build GitHub API headers (with optional auth token).
 */
export function githubHeaders(): HeadersInit {
  const token = process.env.GITHUB_TOKEN;
  return {
    Accept: 'application/vnd.github.v3+json',
    ...(token ? { Authorization: `token ${token}` } : {}),
  };
}

/**
 * Build CoinGecko API headers (with optional Pro key).
 */
export function coinGeckoHeaders(): HeadersInit {
  const key = process.env.COINGECKO_API_KEY;
  return {
    Accept: 'application/json',
    ...(key ? { 'x-cg-pro-api-key': key } : {}),
  };
}
