// app/api/protocols/route.ts
// Fetches DeFi protocol TVL data from DeFiLlama (no API key required).
// Falls back to curated mock data if DeFiLlama is unreachable.

import { NextResponse } from 'next/server';
import { fetchWithFallback } from '@/lib/fetcher';
import { MOCK_PROTOCOLS } from '@/lib/mock/protocols';
import type { Protocol, ApiResponse } from '@/lib/types';

// DeFiLlama: free, no key, ~400 protocols
const DEFILLAMA_URL = 'https://api.llama.fi/protocols';

interface LlamaProtocol {
  slug: string;
  name: string;
  chain: string;
  chains: string[];
  category: string;
  tvl: number;
  change_1d: number;
  change_7d: number;
  url?: string;
  logo?: string;
}

function transformLlama(raw: unknown): Protocol[] {
  const list = raw as LlamaProtocol[];

  return list
    .filter(
      (p) =>
        p.tvl > 10_000_000 && // only protocols with $10M+ TVL
        p.category !== 'CEX' &&
        p.name
    )
    .slice(0, 50) // top 50
    .map((p): Protocol => ({
      id: p.slug,
      name: p.name,
      chain: p.chains?.length > 1 ? 'Multi' : (p.chain ?? 'Unknown'),
      category: p.category ?? 'DeFi',
      tvl: p.tvl ?? 0,
      tvlChange1d: p.change_1d ?? 0,
      tvlChange7d: p.change_7d ?? 0,
      risk: p.tvl > 1_000_000_000 ? 'low' : p.tvl > 100_000_000 ? 'medium' : 'high',
      url: p.url,
      logo: p.logo,
      updatedAt: new Date().toISOString(),
      source: 'live',
    }));
}

export async function GET(): Promise<NextResponse> {
  const result = await fetchWithFallback<Protocol[]>(
    DEFILLAMA_URL,
    MOCK_PROTOCOLS,
    {
      transform: transformLlama,
      context: 'api/protocols',
      next: { revalidate: 120 }, // ISR: revalidate every 2 minutes
    } as Parameters<typeof fetchWithFallback>[2]
  );

  const response: ApiResponse<Protocol[]> = result;

  return NextResponse.json(response, {
    headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120' },
  });
}
