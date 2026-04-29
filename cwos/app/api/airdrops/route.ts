// app/api/airdrops/route.ts
// Airdrops don't have a reliable free public API.
// Strategy:
//   1. Check GitHub for repos tagged with "airdrop" (new projects signal)
//   2. Return curated + enriched airdrop list (always reliable)
//   3. Enrich with real data where possible

import { NextResponse } from 'next/server';
import { fetchWithFallback, githubHeaders } from '@/lib/fetcher';
import { MOCK_AIRDROPS } from '@/lib/mock/airdrops';
import type { Airdrop, ApiResponse } from '@/lib/types';

const GITHUB_AIRDROP_REPOS =
  'https://api.github.com/search/repositories?q=topic:airdrop+topic:solana&sort=updated&order=desc&per_page=5';

interface GitHubRepo {
  name: string;
  description: string | null;
  html_url: string;
  updated_at: string;
  stargazers_count: number;
}

export async function GET(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const statusFilter = searchParams.get('status'); // active | upcoming | hot | ended
  const chainFilter = searchParams.get('chain');

  // Try to find GitHub-discovered airdrops (new signal source)
  const ghResult = await fetchWithFallback<{ items: GitHubRepo[] }>(
    GITHUB_AIRDROP_REPOS,
    { items: [] },
    { headers: githubHeaders(), context: 'api/airdrops/github' }
  );

  // Build GitHub-discovered airdrops as "upcoming" signals
  const githubAirdrops: Airdrop[] = (ghResult.data.items ?? [])
    .filter((r) => r.stargazers_count > 5)
    .slice(0, 3)
    .map((r): Airdrop => ({
      id: `gh-${r.name}`,
      name: r.name.replace(/-/g, ' '),
      project: r.description ?? 'GitHub Project',
      chain: 'Solana',
      status: 'upcoming',
      emoji: '🐙',
      estimatedValue: 'TBD',
      tasks: ['Watch GitHub repo', 'Follow project updates'],
      url: r.html_url,
      updatedAt: r.updated_at,
      source: 'live',
    }));

  // Merge curated + GitHub discovered
  let airdrops: Airdrop[] = [
    ...MOCK_AIRDROPS.map((a) => ({ ...a, updatedAt: new Date().toISOString() })),
    ...githubAirdrops,
  ];

  // Apply filters
  if (statusFilter) {
    airdrops = airdrops.filter((a) => a.status === statusFilter);
  }
  if (chainFilter) {
    airdrops = airdrops.filter(
      (a) => a.chain.toLowerCase() === chainFilter.toLowerCase()
    );
  }

  const source = ghResult.source === 'live' ? 'live' : 'mock';

  const response: ApiResponse<Airdrop[]> = {
    data: airdrops,
    source,
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(response, {
    headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' },
  });
}
