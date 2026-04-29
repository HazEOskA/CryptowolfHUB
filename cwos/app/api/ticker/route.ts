// app/api/ticker/route.ts
// Live price ticker for top Solana ecosystem tokens.
// Uses CoinGecko free API (no key required, 30 req/min limit).

import { NextResponse } from 'next/server';
import { fetchWithFallback, coinGeckoHeaders } from '@/lib/fetcher';
import type { TickerItem, ApiResponse } from '@/lib/types';

const COIN_IDS = 'solana,ethereum,bitcoin,jito-governance-token,jupiter-exchange-solana,raydium,pyth-network';
const COINGECKO_URL = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${COIN_IDS}&order=market_cap_desc&sparkline=false&price_change_percentage=24h`;

const MOCK_TICKER: TickerItem[] = [
  { symbol: 'SOL', price: 168.42, change24h: 3.2 },
  { symbol: 'ETH', price: 3241.8, change24h: 1.8 },
  { symbol: 'BTC', price: 67820, change24h: 0.9 },
  { symbol: 'JTO', price: 3.48, change24h: 6.4 },
  { symbol: 'JUP', price: 0.84, change24h: 4.1 },
  { symbol: 'RAY', price: 1.98, change24h: 8.2 },
  { symbol: 'PYTH', price: 0.39, change24h: 2.7 },
];

interface CoinGeckoMarket {
  symbol: string;
  current_price: number;
  price_change_percentage_24h: number;
  total_volume: number;
}

function transform(raw: unknown): TickerItem[] {
  const markets = raw as CoinGeckoMarket[];
  return markets.map((m) => ({
    symbol: m.symbol.toUpperCase(),
    price: m.current_price,
    change24h: m.price_change_percentage_24h ?? 0,
    volume24h: m.total_volume,
  }));
}

export async function GET(): Promise<NextResponse> {
  const result = await fetchWithFallback<TickerItem[]>(COINGECKO_URL, MOCK_TICKER, {
    headers: coinGeckoHeaders(),
    transform,
    context: 'api/ticker',
  });

  const response: ApiResponse<TickerItem[]> = result;

  return NextResponse.json(response, {
    headers: { 'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60' },
  });
}
