// CryptoWolf OS — DeFi protocols hook

import { useState, useCallback } from 'react';
import { usePolling } from './usePolling';
import { fetchProtocols, fetchChainTvl, Protocol } from '../lib/api/defillama';
import { REFRESH_INTERVALS } from '../lib/constants';
import { logger } from '../lib/logger';

interface ProtocolState {
  protocols: Protocol[];
  chainTvl: Record<string, number>;
  loading: boolean;
  error: string | null;
  lastUpdated: number | null;
}

export function useProtocols() {
  const [state, setState] = useState<ProtocolState>({
    protocols: [],
    chainTvl: {},
    loading: true,
    error: null,
    lastUpdated: null,
  });

  const fetch = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const [protocols, chainTvl] = await Promise.all([
        fetchProtocols(50),
        fetchChainTvl(),
      ]);
      setState({ protocols, chainTvl, loading: false, error: null, lastUpdated: Date.now() });
      logger.success('useProtocols', `Loaded ${protocols.length} protocols`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      logger.error('useProtocols', 'Failed to fetch protocols', msg);
      setState(prev => ({ ...prev, loading: false, error: msg }));
    }
  }, []);

  usePolling(fetch, {
    interval: REFRESH_INTERVALS.PROTOCOLS,
    module: 'Protocols',
    immediate: true,
  });

  return state;
}
