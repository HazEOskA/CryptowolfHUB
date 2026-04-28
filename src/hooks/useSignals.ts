// CryptoWolf OS — Signals hook

import { useState, useCallback } from 'react';
import { usePolling } from './usePolling';
import { generateSignals, fetchTrendingPools, Signal, TrendingPool } from '../lib/api/signals';
import { REFRESH_INTERVALS } from '../lib/constants';
import { logger } from '../lib/logger';

interface SignalState {
  signals: Signal[];
  trendingPools: TrendingPool[];
  loading: boolean;
  error: string | null;
  lastUpdated: number | null;
}

export function useSignals() {
  const [state, setState] = useState<SignalState>({
    signals: [],
    trendingPools: [],
    loading: true,
    error: null,
    lastUpdated: null,
  });

  const fetch = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const [signals, trendingPools] = await Promise.all([
        generateSignals(),
        fetchTrendingPools(),
      ]);
      setState({ signals, trendingPools, loading: false, error: null, lastUpdated: Date.now() });
      logger.success('useSignals', `Loaded ${signals.length} signals, ${trendingPools.length} pools`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      logger.error('useSignals', 'Failed to fetch signals', msg);
      setState(prev => ({ ...prev, loading: false, error: msg }));
    }
  }, []);

  usePolling(fetch, {
    interval: REFRESH_INTERVALS.SIGNALS,
    module: 'Signals',
    immediate: true,
  });

  return state;
}
