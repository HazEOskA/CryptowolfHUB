// CryptoWolf OS — CoinGecko API Service

import { fetchWithFallback } from '../fetcher';
import { logger } from '../logger';
import { COINGECKO_BASE } from '../constants';

export interface CoinMarket {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number | null;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number | null;
  max_supply: number | null;
  ath: number;
  ath_change_percentage: number;
  atl: number;
  atl_change_percentage: number;
  last_updated: string;
  sparkline_in_7d?: { price: number[] };
}

export interface TrendingCoin {
  item: {
    id: string;
    coin_id: number;
    name: string;
    symbol: string;
    market_cap_rank: number;
    thumb: string;
    small: string;
    large: string;
    slug: string;
    price_btc: number;
    score: number;
    data: {
      price: number | string;
      price_change_percentage_24h: { usd: number };
      market_cap: string;
      total_volume: string;
    };
  };
}

export interface GlobalData {
  data: {
    active_cryptocurrencies: number;
    upcoming_icos: number;
    ongoing_icos: number;
    ended_icos: number;
    markets: number;
    total_market_cap: Record<string, number>;
    total_volume: Record<string, number>;
    market_cap_percentage: Record<string, number>;
    market_cap_change_percentage_24h_usd: number;
    updated_at: number;
  };
}

// MOCK FALLBACKS
const MOCK_MARKETS: CoinMarket[] = [
  {
    id: 'bitcoin', symbol: 'btc', name: 'Bitcoin', image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
    current_price: 67450, market_cap: 1328000000000, market_cap_rank: 1,
    fully_diluted_valuation: 1416000000000, total_volume: 28500000000,
    high_24h: 68200, low_24h: 66100, price_change_24h: 850, price_change_percentage_24h: 1.27,
    market_cap_change_24h: 16500000000, market_cap_change_percentage_24h: 1.25,
    circulating_supply: 19700000, total_supply: 19700000, max_supply: 21000000,
    ath: 73738, ath_change_percentage: -8.5, atl: 67.81, atl_change_percentage: 99456,
    last_updated: new Date().toISOString(),
    sparkline_in_7d: { price: Array.from({length:168}, (_,i)=>65000+Math.sin(i/10)*2000+Math.random()*1000) }
  },
  {
    id: 'ethereum', symbol: 'eth', name: 'Ethereum', image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
    current_price: 3580, market_cap: 430000000000, market_cap_rank: 2,
    fully_diluted_valuation: 430000000000, total_volume: 15200000000,
    high_24h: 3650, low_24h: 3490, price_change_24h: 72, price_change_percentage_24h: 2.05,
    market_cap_change_24h: 8700000000, market_cap_change_percentage_24h: 2.06,
    circulating_supply: 120280000, total_supply: 120280000, max_supply: null,
    ath: 4878, ath_change_percentage: -26.5, atl: 0.432, atl_change_percentage: 829000,
    last_updated: new Date().toISOString(),
    sparkline_in_7d: { price: Array.from({length:168}, (_,i)=>3400+Math.sin(i/8)*150+Math.random()*100) }
  },
  {
    id: 'solana', symbol: 'sol', name: 'Solana', image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png',
    current_price: 178, market_cap: 83000000000, market_cap_rank: 5,
    fully_diluted_valuation: 105000000000, total_volume: 3800000000,
    high_24h: 182, low_24h: 172, price_change_24h: -4.2, price_change_percentage_24h: -2.31,
    market_cap_change_24h: -1900000000, market_cap_change_percentage_24h: -2.29,
    circulating_supply: 467000000, total_supply: 581000000, max_supply: null,
    ath: 259.96, ath_change_percentage: -31.5, atl: 0.5, atl_change_percentage: 35500,
    last_updated: new Date().toISOString(),
    sparkline_in_7d: { price: Array.from({length:168}, (_,i)=>170+Math.sin(i/6)*15+Math.random()*8) }
  },
  {
    id: 'arbitrum', symbol: 'arb', name: 'Arbitrum', image: 'https://assets.coingecko.com/coins/images/16547/large/photo_2023-03-29_21.47.00.jpeg',
    current_price: 1.24, market_cap: 3900000000, market_cap_rank: 36,
    fully_diluted_valuation: 12400000000, total_volume: 280000000,
    high_24h: 1.31, low_24h: 1.19, price_change_24h: 0.05, price_change_percentage_24h: 4.3,
    market_cap_change_24h: 168000000, market_cap_change_percentage_24h: 4.5,
    circulating_supply: 3150000000, total_supply: 10000000000, max_supply: 10000000000,
    ath: 2.39, ath_change_percentage: -48, atl: 0.89, atl_change_percentage: 39,
    last_updated: new Date().toISOString(),
    sparkline_in_7d: { price: Array.from({length:168}, (_,i)=>1.1+Math.sin(i/7)*0.15+Math.random()*0.05) }
  },
  {
    id: 'sui', symbol: 'sui', name: 'Sui', image: 'https://assets.coingecko.com/coins/images/26375/large/sui_asset.jpeg',
    current_price: 2.15, market_cap: 6200000000, market_cap_rank: 22,
    fully_diluted_valuation: 21500000000, total_volume: 420000000,
    high_24h: 2.28, low_24h: 2.08, price_change_24h: 0.09, price_change_percentage_24h: 4.37,
    market_cap_change_24h: 270000000, market_cap_change_percentage_24h: 4.55,
    circulating_supply: 2880000000, total_supply: 10000000000, max_supply: 10000000000,
    ath: 5.35, ath_change_percentage: -59.8, atl: 0.36, atl_change_percentage: 497,
    last_updated: new Date().toISOString(),
    sparkline_in_7d: { price: Array.from({length:168}, (_,i)=>1.9+Math.sin(i/5)*0.25+Math.random()*0.1) }
  },
  {
    id: 'base', symbol: 'base', name: 'Base', image: 'https://assets.coingecko.com/coins/images/31845/large/base-logo.png',
    current_price: 0.89, market_cap: 890000000, market_cap_rank: 85,
    fully_diluted_valuation: 8900000000, total_volume: 95000000,
    high_24h: 0.94, low_24h: 0.85, price_change_24h: 0.04, price_change_percentage_24h: 4.71,
    market_cap_change_24h: 40000000, market_cap_change_percentage_24h: 4.7,
    circulating_supply: 1000000000, total_supply: 10000000000, max_supply: 10000000000,
    ath: 1.48, ath_change_percentage: -39.9, atl: 0.12, atl_change_percentage: 641,
    last_updated: new Date().toISOString(),
    sparkline_in_7d: { price: Array.from({length:168}, (_,i)=>0.8+Math.sin(i/9)*0.08+Math.random()*0.04) }
  },
];

const MOCK_GLOBAL: GlobalData = {
  data: {
    active_cryptocurrencies: 14325,
    upcoming_icos: 0,
    ongoing_icos: 49,
    ended_icos: 3376,
    markets: 1091,
    total_market_cap: { usd: 2420000000000 },
    total_volume: { usd: 98000000000 },
    market_cap_percentage: { btc: 54.8, eth: 17.7 },
    market_cap_change_percentage_24h_usd: 1.37,
    updated_at: Math.floor(Date.now() / 1000),
  }
};

export async function fetchTopMarkets(limit = 20): Promise<CoinMarket[]> {
  logger.info('CoinGecko', `Fetching top ${limit} markets...`);
  const url = `${COINGECKO_BASE}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1&sparkline=true&price_change_percentage=24h`;
  const data = await fetchWithFallback<CoinMarket[]>(url, MOCK_MARKETS, { timeout: 10000 });
  return data.length ? data : MOCK_MARKETS;
}

export async function fetchTrending(): Promise<TrendingCoin[]> {
  logger.info('CoinGecko', 'Fetching trending coins...');
  const url = `${COINGECKO_BASE}/search/trending`;
  const data = await fetchWithFallback<{ coins: TrendingCoin[] } | null>(url, null, { timeout: 8000 });
  if (data?.coins?.length) return data.coins.slice(0, 10);

  // Fallback trending list
  return [
    { item: { id: 'pepe', coin_id: 29850, name: 'Pepe', symbol: 'PEPE', market_cap_rank: 50, thumb: '', small: '', large: '', slug: 'pepe', price_btc: 0.0000002, score: 0, data: { price: 0.0000132, price_change_percentage_24h: { usd: 8.4 }, market_cap: '$5.5B', total_volume: '$480M' } } },
    { item: { id: 'dogwifhat', coin_id: 34466, name: 'dogwifhat', symbol: 'WIF', market_cap_rank: 55, thumb: '', small: '', large: '', slug: 'dogwifhat', price_btc: 0.00003, score: 1, data: { price: 2.82, price_change_percentage_24h: { usd: 12.1 }, market_cap: '$2.8B', total_volume: '$320M' } } },
    { item: { id: 'mog-coin', coin_id: 36650, name: 'Mog Coin', symbol: 'MOG', market_cap_rank: 92, thumb: '', small: '', large: '', slug: 'mog-coin', price_btc: 0.0000001, score: 2, data: { price: 0.0000081, price_change_percentage_24h: { usd: 15.7 }, market_cap: '$474M', total_volume: '$95M' } } },
    { item: { id: 'jupiter', coin_id: 35647, name: 'Jupiter', symbol: 'JUP', market_cap_rank: 45, thumb: '', small: '', large: '', slug: 'jupiter', price_btc: 0.000015, score: 3, data: { price: 1.05, price_change_percentage_24h: { usd: 6.3 }, market_cap: '$1.4B', total_volume: '$145M' } } },
    { item: { id: 'boden', coin_id: 38001, name: 'Boden', symbol: 'BODEN', market_cap_rank: 220, thumb: '', small: '', large: '', slug: 'boden', price_btc: 0.000002, score: 4, data: { price: 0.14, price_change_percentage_24h: { usd: -4.2 }, market_cap: '$140M', total_volume: '$22M' } } },
  ];
}

export async function fetchGlobalData(): Promise<GlobalData> {
  logger.info('CoinGecko', 'Fetching global market data...');
  const url = `${COINGECKO_BASE}/global`;
  const data = await fetchWithFallback<GlobalData | null>(url, null, { timeout: 8000 });
  return data ?? MOCK_GLOBAL;
}

export async function fetchGainers(): Promise<CoinMarket[]> {
  const markets = await fetchTopMarkets(100);
  return [...markets]
    .sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h)
    .slice(0, 10);
}

export async function fetchLosers(): Promise<CoinMarket[]> {
  const markets = await fetchTopMarkets(100);
  return [...markets]
    .sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h)
    .slice(0, 10);
}
