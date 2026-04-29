// lib/logger.ts
// Structured logging for CryptoWolf OS.
// All logs are prefixed with [WolfOS] + ISO timestamp.
// Sentry integration is opt-in via NEXT_PUBLIC_ENABLE_SENTRY env flag.

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  level: LogLevel;
  message: string;
  context?: string;
  data?: unknown;
  timestamp: string;
}

const IS_DEBUG = process.env.NEXT_PUBLIC_DEBUG_LOGGING === 'true';
const IS_SERVER = typeof window === 'undefined';

function formatPrefix(level: LogLevel, context?: string): string {
  const ts = new Date().toISOString();
  const icon = { info: 'ℹ️', warn: '⚠️', error: '❌', debug: '🐛' }[level];
  const ctx = context ? ` [${context}]` : '';
  return `[WolfOS ${ts}]${ctx} ${icon}`;
}

function captureToSentry(entry: LogEntry): void {
  if (typeof window === 'undefined') return;
  if (process.env.NEXT_PUBLIC_ENABLE_SENTRY !== 'true') return;

  // @ts-expect-error – Sentry loaded via CDN or installed separately
  if (typeof Sentry === 'undefined') return;

  try {
    if (entry.level === 'error') {
      const err =
        entry.data instanceof Error
          ? entry.data
          : new Error(`${entry.message}${entry.data ? ` | ${JSON.stringify(entry.data)}` : ''}`);

      // @ts-expect-error
      Sentry.withScope((scope: unknown) => {
        // @ts-expect-error
        scope.setTag('context', entry.context ?? 'unknown');
        // @ts-expect-error
        scope.setLevel('error');
        // @ts-expect-error
        Sentry.captureException(err);
      });
    } else if (entry.level === 'warn') {
      // @ts-expect-error
      Sentry.captureMessage(entry.message, 'warning');
    }
  } catch {
    // never throw from logger
  }
}

export const logger = {
  info(message: string, data?: unknown, context?: string): void {
    const entry: LogEntry = { level: 'info', message, data, context, timestamp: new Date().toISOString() };
    console.info(formatPrefix('info', context), message, ...(data !== undefined ? [data] : []));
    captureToSentry(entry);
  },

  warn(message: string, data?: unknown, context?: string): void {
    const entry: LogEntry = { level: 'warn', message, data, context, timestamp: new Date().toISOString() };
    console.warn(formatPrefix('warn', context), message, ...(data !== undefined ? [data] : []));
    captureToSentry(entry);
  },

  error(message: string, data?: unknown, context?: string): void {
    const entry: LogEntry = { level: 'error', message, data, context, timestamp: new Date().toISOString() };
    console.error(formatPrefix('error', context), message, ...(data !== undefined ? [data] : []));
    captureToSentry(entry);
  },

  debug(message: string, data?: unknown, context?: string): void {
    if (!IS_DEBUG) return;
    console.debug(formatPrefix('debug', context), message, ...(data !== undefined ? [data] : []));
  },

  // Route-specific helpers
  nav: {
    miss(route: string): void {
      logger.warn(`Navigation miss — no page found for route: ${route}`, undefined, 'nav');
    },
    error(route: string, err: unknown): void {
      logger.error(`Navigation error on route: ${route}`, err, 'nav');
    },
  },

  api: {
    fail(endpoint: string, err: unknown, fallback: boolean): void {
      logger.warn(
        `API call failed${fallback ? ' — using fallback' : ''}: ${endpoint}`,
        err,
        'api'
      );
    },
    success(endpoint: string, latencyMs: number, source: string): void {
      logger.debug(`API ok [${source}] ${endpoint} in ${latencyMs}ms`, undefined, 'api');
    },
    empty(endpoint: string): void {
      logger.warn(`API returned empty data: ${endpoint}`, undefined, 'api');
    },
  },
};

// ── Global browser error handlers (call once in layout) ──────────────────────

export function installGlobalHandlers(): void {
  if (IS_SERVER) return;

  window.onerror = (message, source, lineno, colno, error) => {
    logger.error(
      `Uncaught exception: ${String(message)}`,
      error ?? { source, lineno, colno },
      'global'
    );
    return false;
  };

  window.addEventListener('unhandledrejection', (event) => {
    logger.error(
      `Unhandled promise rejection: ${String(event.reason)}`,
      event.reason instanceof Error ? event.reason : new Error(String(event.reason)),
      'global'
    );
  });

  if (IS_DEBUG) {
    logger.debug('Global error handlers installed', undefined, 'global');
  }
}
