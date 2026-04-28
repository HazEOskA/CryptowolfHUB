// CryptoWolf OS — Airdrops data hook

import { useState, useCallback } from 'react';
import { usePolling } from './usePolling';
import { fetchAirdrops, Airdrop } from '../lib/api/defillama';
import { REFRESH_INTERVALS } from '../lib/constants';
import { logger } from '../lib/logger';

interface AirdropState {
  airdrops: Airdrop[];
  loading: boolean;
  error: string | null;
  lastUpdated: number | null;
}

export function useAirdrops() {
  const [state, setState] = useState<AirdropState>({
    airdrops: [],
    loading: true,
    error: null,
    lastUpdated: null,
  });

  const fetch = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const airdrops = await fetchAirdrops();
      setState({ airdrops, loading: false, error: null, lastUpdated: Date.now() });
      logger.success('useAirdrops', `Loaded ${airdrops.length} airdrops`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      logger.error('useAirdrops', 'Failed to fetch airdrops', msg);
      setState(prev => ({ ...prev, loading: false, error: msg }));
    }
  }, []);

  usePolling(fetch, {
    interval: REFRESH_INTERVALS.AIRDROPS,
    module: 'Airdrops',
    immediate: true,
  });

  return state;
}
