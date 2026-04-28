// CryptoWolf OS — Market data hook

import { useState, useCallback } from 'react';
import { usePolling } from './usePolling';
import { fetchTopMarkets, fetchTrending, fetchGlobalData, CoinMarket, TrendingCoin, GlobalData } from '../lib/api/coingecko';
import { REFRESH_INTERVALS } from '../lib/constants';
import { logger } from '../lib/logger';

interface MarketState {
  markets: CoinMarket[];
  trending: TrendingCoin[];
  global: GlobalData | null;
  loading: boolean;
  error: string | null;
  lastUpdated: number | null;
}

export function useMarketData() {
  const [state, setState] = useState<MarketState>({
    markets: [],
    trending: [],
    global: null,
    loading: true,
    error: null,
    lastUpdated: null,
  });

  const fetch = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const [markets, trending, global] = await Promise.all([
        fetchTopMarkets(20),
        fetchTrending(),
        fetchGlobalData(),
      ]);
      setState({ markets, trending, global, loading: false, error: null, lastUpdated: Date.now() });
      logger.success('useMarketData', `Loaded ${markets.length} markets, ${trending.length} trending`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      logger.error('useMarketData', 'Failed to fetch market data', msg);
      setState(prev => ({ ...prev, loading: false, error: msg }));
    }
  }, []);

  usePolling(fetch, {
    interval: REFRESH_INTERVALS.PRICES,
    module: 'MarketData',
    immediate: true,
  });

  return state;
}
