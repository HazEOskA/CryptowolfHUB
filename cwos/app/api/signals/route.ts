// app/api/signals/route.ts
// Aggregates signals from:
//   1. CoinGecko trending coins (free, no key)
//   2. CoinGecko market data (volume/price changes)
//   3. GitHub trending crypto repos (public API, 60 req/hr unauthed)
// Falls back to mock signals if all sources fail.

import { NextResponse } from 'next/server';
import { fetchWithFallback, coinGeckoHeaders, githubHeaders } from '@/lib/fetcher';
import { MOCK_SIGNALS } from '@/lib/mock/signals';
import { logger } from '@/lib/logger';
import type { Signal, SignalEvent, ApiResponse } from '@/lib/types';

const COINGECKO_TRENDING = 'https://api.coingecko.com/api/v3/search/trending';
const COINGECKO_MARKETS =
  'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=volume_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h';
const GITHUB_CRYPTO =
  'https://api.github.com/search/repositories?q=solana+defi+airdrop&sort=stars&order=desc&per_page=5';

interface CoinGeckoTrendingItem {
  item: {
    id: string;
    name: string;
    symbol: string;
    market_cap_rank: number;
    score: number;
  };
}

interface CoinGeckoMarket {
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  total_volume: number;
}

interface GitHubRepo {
  full_name: string;
  stargazers_count: number;
  description: string | null;
}

async function buildWhaleSignal(): Promise<Signal> {
  // Whale data isn't freely available without paid APIs.
  // We build a signal from CoinGecko volume data as a proxy.
  const result = await fetchWithFallback<CoinGeckoMarket[]>(
    COINGECKO_MARKETS,
    [],
    { headers: coinGeckoHeaders(), context: 'api/signals/whale' }
  );

  const markets = result.data;
  const events: SignalEvent[] = markets.slice(0, 4).map((m) => ({
    label: `${m.symbol.toUpperCase()} 24h volume`,
    value: `$${(m.total_volume / 1_000_000).toFixed(0)}M`,
  }));

  const avgChange = markets.reduce((s, m) => s + (m.price_change_percentage_24h ?? 0), 0) / Math.max(markets.length, 1);
  const strength = Math.min(100, Math.max(20, 50 + avgChange * 2));

  return {
    id: 'whale-live',
    type: 'whale',
    title: 'Whale Activity',
    subtitle: result.source === 'live' ? 'Live on-chain volume proxy' : 'Estimated (offline)',
    strength: Math.round(strength),
    direction: avgChange >= 0 ? 'bullish' : 'bearish',
    events: events.length ? events : MOCK_SIGNALS[0].events,
    updatedAt: new Date().toISOString(),
    source: result.source,
  };
}

async function buildMomentumSignal(): Promise<Signal> {
  const result = await fetchWithFallback<{ coins: CoinGeckoTrendingItem[] }>(
    COINGECKO_TRENDING,
    { coins: [] },
    { headers: coinGeckoHeaders(), context: 'api/signals/momentum' }
  );

  const trending = result.data.coins ?? [];
  const events: SignalEvent[] = trending.slice(0, 4).map((t, i) => ({
    label: `#${i + 1} Trending`,
    value: `${t.item.name} (${t.item.symbol?.toUpperCase()})`,
  }));

  return {
    id: 'momentum-live',
    type: 'momentum',
    title: 'Market Momentum',
    subtitle: result.source === 'live' ? 'CoinGecko trending search' : 'Estimated (offline)',
    strength: trending.length >= 5 ? 72 : 45,
    direction: 'bullish',
    events: events.length ? events : MOCK_SIGNALS[1].events,
    updatedAt: new Date().toISOString(),
    source: result.source,
  };
}

async function buildGrowthSignal(): Promise<Signal> {
  const result = await fetchWithFallback<{ items: GitHubRepo[] }>(
    GITHUB_CRYPTO,
    { items: [] },
    { headers: githubHeaders(), context: 'api/signals/growth' }
  );

  const repos = result.data.items ?? [];
  const events: SignalEvent[] = repos.slice(0, 4).map((r) => ({
    label: r.full_name,
    value: `⭐ ${r.stargazers_count.toLocaleString()}`,
  }));

  return {
    id: 'growth-live',
    type: 'growth',
    title: 'Protocol Growth',
    subtitle: result.source === 'live' ? 'GitHub trending crypto repos' : 'Estimated (offline)',
    strength: repos.length >= 3 ? 85 : 55,
    direction: 'bullish',
    events: events.length ? events : MOCK_SIGNALS[2].events,
    updatedAt: new Date().toISOString(),
    source: result.source,
  };
}

export async function GET(): Promise<NextResponse> {
  try {
    const [whale, momentum, growth] = await Promise.allSettled([
      buildWhaleSignal(),
      buildMomentumSignal(),
      buildGrowthSignal(),
    ]);

    const signals: Signal[] = [
      whale.status === 'fulfilled' ? whale.value : MOCK_SIGNALS[0],
      momentum.status === 'fulfilled' ? momentum.value : MOCK_SIGNALS[1],
      growth.status === 'fulfilled' ? growth.value : MOCK_SIGNALS[2],
      // Social + risk alert always from mock (no free social API)
      MOCK_SIGNALS[3],
      MOCK_SIGNALS[4],
    ];

    const liveCount = signals.filter((s) => s.source === 'live').length;
    const overallSource = liveCount >= 2 ? 'live' : liveCount > 0 ? 'cached' : 'mock';

    const response: ApiResponse<Signal[]> = {
      data: signals,
      source: overallSource,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response, {
      headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120' },
    });
  } catch (err) {
    logger.error('Signals aggregation failed', err, 'api/signals');
    const response: ApiResponse<Signal[]> = {
      data: MOCK_SIGNALS,
      source: 'mock',
      timestamp: new Date().toISOString(),
      error: String(err),
    };
    return NextResponse.json(response, { status: 200 }); // always 200 — UI degrades gracefully
  }
}
