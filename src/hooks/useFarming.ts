// CryptoWolf OS — Farming/Yields hook

import { useState, useCallback } from 'react';
import { usePolling } from './usePolling';
import { fetchYields, YieldPool } from '../lib/api/defillama';
import { REFRESH_INTERVALS } from '../lib/constants';
import { logger } from '../lib/logger';

interface FarmingState {
  pools: YieldPool[];
  loading: boolean;
  error: string | null;
  lastUpdated: number | null;
}

export function useFarming() {
  const [state, setState] = useState<FarmingState>({
    pools: [],
    loading: true,
    error: null,
    lastUpdated: null,
  });

  const fetch = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const pools = await fetchYields(30);
      setState({ pools, loading: false, error: null, lastUpdated: Date.now() });
      logger.success('useFarming', `Loaded ${pools.length} yield pools`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      logger.error('useFarming', 'Failed to fetch farming data', msg);
      setState(prev => ({ ...prev, loading: false, error: msg }));
    }
  }, []);

  usePolling(fetch, {
    interval: REFRESH_INTERVALS.FARMING,
    module: 'Farming',
    immediate: true,
  });

  return state;
}
