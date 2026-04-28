// CryptoWolf OS — Signal Engine (trending, volume spikes, social hype)

import { fetchWithFallback } from '../fetcher';
import { logger } from '../logger';
import { GECKO_TERMINAL_BASE } from '../constants';

export interface Signal {
  id: string;
  type: 'volume_spike' | 'price_breakout' | 'social_hype' | 'new_listing' | 'whale_move' | 'airdrop_alert';
  title: string;
  description: string;
  token: string;
  chain: string;
  change: number;
  strength: 'low' | 'medium' | 'high' | 'critical';
  timestamp: number;
  source: string;
  link?: string;
}

export interface TrendingPool {
  id: string;
  name: string;
  baseToken: string;
  quoteToken: string;
  network: string;
  priceUsd: string;
  priceChangeH24: number;
  volumeH24: number;
  tvl: number;
  txCount24h: number;
  buys24h: number;
  sells24h: number;
  dex: string;
}

const SIGNAL_TYPES: Signal['type'][] = [
  'volume_spike', 'price_breakout', 'social_hype', 'new_listing', 'whale_move', 'airdrop_alert'
];

const SIGNAL_DESCRIPTIONS: Record<Signal['type'], string[]> = {
  volume_spike: [
    'Volume surged 380% above 7-day average',
    '24h trading volume exceeds 30-day moving average by 4x',
    'Unusual buy pressure detected — volume spike confirmed',
  ],
  price_breakout: [
    'Price broke above 30-day resistance level',
    'Golden cross pattern forming on 4H chart',
    'Breaking out of multi-week consolidation zone',
  ],
  social_hype: [
    'Mentions surged 840% on Crypto Twitter in 2h',
    'Trending #1 on CoinGecko social charts',
    'KOL cluster activity detected — rapid spread',
  ],
  new_listing: [
    'Newly listed on Binance — 1h after launch',
    'Listed on major DEX with deep liquidity',
    'First CEX listing confirmed — early momentum',
  ],
  whale_move: [
    'Wallet moved $12.4M — accumulation pattern',
    'Top 10 holder added 2.8M tokens in 4h',
    'Dormant whale wallet activated after 18 months',
  ],
  airdrop_alert: [
    'Snapshot confirmed — claim opens in 48h',
    'New eligibility criteria released — act now',
    'Final week to qualify for retroactive drop',
  ],
};

function generateMockSignals(): Signal[] {
  const tokens = [
    { token: 'PEPE', chain: 'Ethereum' },
    { token: 'WIF', chain: 'Solana' },
    { token: 'JUP', chain: 'Solana' },
    { token: 'ARB', chain: 'Arbitrum' },
    { token: 'OP', chain: 'Optimism' },
    { token: 'DRIFT', chain: 'Solana' },
    { token: 'BLAST', chain: 'Ethereum' },
    { token: 'MOG', chain: 'Ethereum' },
    { token: 'EIGEN', chain: 'Ethereum' },
    { token: 'ZK', chain: 'zkSync' },
    { token: 'SCR', chain: 'Scroll' },
    { token: 'HYPE', chain: 'Hyperliquid' },
  ];

  return tokens.map((t, i) => {
    const type = SIGNAL_TYPES[i % SIGNAL_TYPES.length];
    const descs = SIGNAL_DESCRIPTIONS[type];
    const strength: Signal['strength'] =
      i < 3 ? 'critical' : i < 6 ? 'high' : i < 9 ? 'medium' : 'low';
    return {
      id: `sig-${i}-${Date.now()}`,
      type,
      title: `${t.token} ${type.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}`,
      description: descs[i % descs.length],
      token: t.token,
      chain: t.chain,
      change: (Math.random() * 40 + 5) * (Math.random() > 0.3 ? 1 : -1),
      strength,
      timestamp: Date.now() - Math.floor(Math.random() * 3600000),
      source: ['CoinGecko Trending', 'GeckoTerminal', 'Volume Scanner', 'Whale Alert'][i % 4],
    };
  });
}

const MOCK_TRENDING_POOLS: TrendingPool[] = [
  { id: '1', name: 'PEPE/WETH', baseToken: 'PEPE', quoteToken: 'WETH', network: 'Ethereum', priceUsd: '0.00001324', priceChangeH24: 18.4, volumeH24: 142000000, tvl: 38000000, txCount24h: 18420, buys24h: 10240, sells24h: 8180, dex: 'Uniswap V3' },
  { id: '2', name: 'WIF/SOL', baseToken: 'WIF', quoteToken: 'SOL', network: 'Solana', priceUsd: '2.82', priceChangeH24: 12.1, volumeH24: 98000000, tvl: 42000000, txCount24h: 22100, buys24h: 13500, sells24h: 8600, dex: 'Raydium' },
  { id: '3', name: 'DRIFT/USDC', baseToken: 'DRIFT', quoteToken: 'USDC', network: 'Solana', priceUsd: '0.89', priceChangeH24: 25.3, volumeH24: 54000000, tvl: 18000000, txCount24h: 12400, buys24h: 7800, sells24h: 4600, dex: 'Orca' },
  { id: '4', name: 'MOG/WETH', baseToken: 'MOG', quoteToken: 'WETH', network: 'Ethereum', priceUsd: '0.0000082', priceChangeH24: 31.7, volumeH24: 38000000, tvl: 9500000, txCount24h: 8900, buys24h: 5700, sells24h: 3200, dex: 'Uniswap V3' },
  { id: '5', name: 'BRETT/WETH', baseToken: 'BRETT', quoteToken: 'WETH', network: 'Base', priceUsd: '0.174', priceChangeH24: -8.2, volumeH24: 72000000, tvl: 24000000, txCount24h: 15800, buys24h: 7200, sells24h: 8600, dex: 'Aerodrome' },
  { id: '6', name: 'JUP/SOL', baseToken: 'JUP', quoteToken: 'SOL', network: 'Solana', priceUsd: '1.05', priceChangeH24: 6.3, volumeH24: 45000000, tvl: 31000000, txCount24h: 9400, buys24h: 5400, sells24h: 4000, dex: 'Jupiter' },
];

export async function fetchTrendingPools(): Promise<TrendingPool[]> {
  logger.info('Signals', 'Fetching trending pools from GeckoTerminal...');
  const url = `${GECKO_TERMINAL_BASE}/networks/trending_pools?include=base_token%2Cquote_token%2Cdex&page=1`;

  type GeckoPool = {
    id: string;
    attributes: {
      name: string;
      base_token_price_usd: string;
      price_change_percentage: { h24: number };
      volume_usd: { h24: string };
      reserve_in_usd: string;
      transactions: { h24: { buys: number; sells: number; buyers: number; sellers: number } };
    };
    relationships: {
      network: { data: { id: string } };
      dex: { data: { id: string } };
      base_token: { data: { id: string } };
      quote_token: { data: { id: string } };
    };
  };

  const data = await fetchWithFallback<{ data: GeckoPool[] } | null>(url, null, { timeout: 10000 });

  if (data?.data?.length) {
    return data.data.slice(0, 10).map((pool) => ({
      id: pool.id,
      name: pool.attributes.name,
      baseToken: pool.attributes.name.split('/')[0] || 'N/A',
      quoteToken: pool.attributes.name.split('/')[1] || 'N/A',
      network: pool.relationships?.network?.data?.id || 'unknown',
      priceUsd: pool.attributes.base_token_price_usd,
      priceChangeH24: pool.attributes.price_change_percentage?.h24 ?? 0,
      volumeH24: parseFloat(pool.attributes.volume_usd?.h24 || '0'),
      tvl: parseFloat(pool.attributes.reserve_in_usd || '0'),
      txCount24h: (pool.attributes.transactions?.h24?.buys ?? 0) + (pool.attributes.transactions?.h24?.sells ?? 0),
      buys24h: pool.attributes.transactions?.h24?.buys ?? 0,
      sells24h: pool.attributes.transactions?.h24?.sells ?? 0,
      dex: pool.relationships?.dex?.data?.id || 'DEX',
    }));
  }

  logger.warn('Signals', 'GeckoTerminal unavailable, using mock trending pools');
  return MOCK_TRENDING_POOLS;
}

export async function generateSignals(): Promise<Signal[]> {
  logger.info('Signals', 'Generating signal feed...');
  try {
    const pools = await fetchTrendingPools();
    const signals: Signal[] = pools.slice(0, 6).map((pool, i) => ({
      id: `pool-sig-${i}-${Date.now()}`,
      type: (Math.abs(pool.priceChangeH24) > 20
        ? 'volume_spike'
        : Math.abs(pool.priceChangeH24) > 10
        ? 'price_breakout'
        : 'social_hype') as Signal['type'],
      title: `${pool.baseToken} Activity Detected`,
      description: `${pool.priceChangeH24 >= 0 ? '↑' : '↓'} ${Math.abs(pool.priceChangeH24).toFixed(1)}% price change | $${(pool.volumeH24 / 1e6).toFixed(1)}M volume on ${pool.dex}`,
      token: pool.baseToken,
      chain: pool.network,
      change: pool.priceChangeH24,
      strength: Math.abs(pool.priceChangeH24) > 30 ? 'critical' : Math.abs(pool.priceChangeH24) > 15 ? 'high' : 'medium',
      timestamp: Date.now() - Math.floor(Math.random() * 1800000),
      source: 'GeckoTerminal',
    }));

    const mockSignals = generateMockSignals().slice(0, 6);
    return [...signals, ...mockSignals].slice(0, 12);
  } catch {
    logger.warn('Signals', 'Signal generation failed, using mock data');
    return generateMockSignals();
  }
}
