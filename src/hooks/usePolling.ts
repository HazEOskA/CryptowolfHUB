// CryptoWolf OS — Auto-polling hook

import { useEffect, useRef, useCallback } from 'react';
import { logger } from '../lib/logger';

interface PollingOptions {
  interval: number;
  enabled?: boolean;
  immediate?: boolean;
  module?: string;
}

export function usePolling(
  callback: () => void | Promise<void>,
  options: PollingOptions
) {
  const { interval, enabled = true, immediate = true, module = 'Poller' } = options;
  const callbackRef = useRef(callback);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const start = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    logger.debug(module, `Polling started — interval: ${interval}ms`);
    timerRef.current = setInterval(async () => {
      try {
        await callbackRef.current();
      } catch (err) {
        logger.error(module, 'Polling callback failed', err);
      }
    }, interval);
  }, [interval, module]);

  const stop = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
      logger.debug(module, 'Polling stopped');
    }
  }, [module]);

  useEffect(() => {
    if (!enabled) return;

    if (immediate) {
      try {
        const result = callbackRef.current();
        if (result instanceof Promise) result.catch(err => logger.error(module, 'Initial fetch failed', err));
      } catch (err) {
        logger.error(module, 'Initial sync call failed', err);
      }
    }

    start();
    return () => stop();
  }, [enabled, immediate, start, stop, module]);

  return { stop, restart: start };
}
