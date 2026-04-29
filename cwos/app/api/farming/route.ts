// app/api/farming/route.ts
// Fetches yield farming pools from DeFiLlama Yields API.
// Free, no key required. 6000+ pools across all chains.

import { NextResponse } from 'next/server';
import { fetchWithFallback } from '@/lib/fetcher';
import { MOCK_FARMING } from '@/lib/mock/farming';
import type { FarmingPool, ApiResponse } from '@/lib/types';

const YIELDS_URL = 'https://yields.llama.fi/pools';

interface LlamaPool {
  pool: string;
  project: string;
  chain: string;
  symbol: string;
  apy: number;
  apyBase: number;
  apyReward: number;
  tvlUsd: number;
  ilRisk: 'yes' | 'no' | 'none';
  category?: string;
  rewardTokens?: string[];
}

interface LlamaYieldsResponse {
  status: string;
  data: LlamaPool[];
}

function riskFromPool(pool: LlamaPool): FarmingPool['risk'] {
  if (pool.ilRisk === 'yes' || (pool.apy ?? 0) > 80) return 'high';
  if ((pool.apy ?? 0) > 30 || (pool.tvlUsd ?? 0) < 1_000_000) return 'medium';
  return 'low';
}

function riskScore(pool: LlamaPool): number {
  let score = 0;
  if (pool.ilRisk === 'yes') score += 40;
  if ((pool.apy ?? 0) > 50) score += 30;
  else if ((pool.apy ?? 0) > 20) score += 15;
  if ((pool.tvlUsd ?? 0) < 500_000) score += 20;
  return Math.min(score, 100);
}

function transformYields(raw: unknown): FarmingPool[] {
  const response = raw as LlamaYieldsResponse;
  const pools = response?.data ?? [];

  return pools
    .filter(
      (p) =>
        p.tvlUsd > 500_000 &&
        (p.apy ?? 0) > 0 &&
        (p.apy ?? 0) < 500 && // filter out obviously broken pools
        p.project &&
        p.symbol
    )
    .sort((a, b) => (b.tvlUsd ?? 0) - (a.tvlUsd ?? 0)) // sort by TVL
    .slice(0, 60)
    .map((p): FarmingPool => ({
      id: p.pool,
      protocol: p.project,
      chain: p.chain,
      pair: p.symbol,
      apy: Math.round((p.apy ?? 0) * 10) / 10,
      apyBase: Math.round((p.apyBase ?? 0) * 10) / 10,
      apyReward: Math.round((p.apyReward ?? 0) * 10) / 10,
      tvlUsd: p.tvlUsd,
      risk: riskFromPool(p),
      riskScore: riskScore(p),
      category: p.category ?? 'DeFi',
      rewardTokens: p.rewardTokens ?? [],
      updatedAt: new Date().toISOString(),
      source: 'live',
    }));
}

export async function GET(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const chain = searchParams.get('chain'); // optional filter
  const limit = parseInt(searchParams.get('limit') ?? '20', 10);

  const result = await fetchWithFallback<FarmingPool[]>(
    YIELDS_URL,
    MOCK_FARMING,
    { transform: transformYields, context: 'api/farming' }
  );

  // Apply chain filter if requested
  let data = result.data;
  if (chain) {
    data = data.filter((p) => p.chain.toLowerCase() === chain.toLowerCase());
  }
  data = data.slice(0, limit);

  const response: ApiResponse<FarmingPool[]> = { ...result, data };

  return NextResponse.json(response, {
    headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' },
  });
}
