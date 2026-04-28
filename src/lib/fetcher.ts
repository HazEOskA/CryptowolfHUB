// CryptoWolf OS — Smart API Fetcher with fallback support

import { logger } from './logger';

interface FetchOptions {
  timeout?: number;
  retries?: number;
  headers?: Record<string, string>;
}

async function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error(`Request timed out after ${ms}ms`)), ms)
  );
  return Promise.race([promise, timeout]);
}

export async function fetchWithFallback<T>(
  url: string,
  fallback: T,
  options: FetchOptions = {}
): Promise<T> {
  const { timeout = 8000, retries = 1, headers = {} } = options;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await withTimeout(
        fetch(url, {
          headers: {
            Accept: 'application/json',
            ...headers,
          },
        }),
        timeout
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = (await response.json()) as T;
      logger.success('Fetcher', `✓ ${url.split('?')[0].slice(-60)}`);
      return data;
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err);
      if (attempt < retries) {
        logger.warn('Fetcher', `Retry ${attempt + 1}/${retries} for ${url.slice(-60)}`, errMsg);
        await new Promise(r => setTimeout(r, 1000 * (attempt + 1)));
      } else {
        logger.error('Fetcher', `Failed after ${retries + 1} attempts: ${url.slice(-60)}`, errMsg);
        return fallback;
      }
    }
  }

  return fallback;
}

export async function fetchJson<T>(url: string, options: FetchOptions = {}): Promise<T | null> {
  return fetchWithFallback<T | null>(url, null, options);
}
