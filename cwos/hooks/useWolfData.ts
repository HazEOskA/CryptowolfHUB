'use client';

// hooks/useWolfData.ts
// All domain-level data hooks. Each wraps usePolling with the correct endpoint + type.

import { usePolling } from '@/hooks/usePolling';
import type {
  Airdrop,
  Protocol,
  FarmingPool,
  Signal,
  TickerItem,
  DashboardStats,
} from '@/lib/types';

// ── Airdrops ──────────────────────────────────────────────────────────────────

export function useAirdrops(statusFilter?: string) {
  const endpoint = statusFilter
    ? `/api/airdrops?status=${statusFilter}`
    : '/api/airdrops';

  return usePolling<Airdrop[]>(endpoint, {
    intervalMs: 60_000, // airdrops change slowly
    context: 'airdrops',
  });
}

// ── Protocols ─────────────────────────────────────────────────────────────────

export function useProtocols() {
  return usePolling<Protocol[]>('/api/protocols', {
    intervalMs: 120_000, // TVL data every 2 minutes
    context: 'protocols',
  });
}

// ── Farming ───────────────────────────────────────────────────────────────────

export function useFarming(chain?: string, limit = 20) {
  const params = new URLSearchParams({ limit: String(limit) });
  if (chain) params.set('chain', chain);

  return usePolling<FarmingPool[]>(`/api/farming?${params}`, {
    intervalMs: 300_000, // yields update every 5 minutes
    context: 'farming',
  });
}

// ── Signals ───────────────────────────────────────────────────────────────────

export function useSignals() {
  return usePolling<Signal[]>('/api/signals', {
    intervalMs: 60_000,
    context: 'signals',
  });
}

// ── Ticker ────────────────────────────────────────────────────────────────────

export function useTicker() {
  return usePolling<TickerItem[]>('/api/ticker', {
    intervalMs: 30_000, // prices every 30 seconds
    context: 'ticker',
  });
}

// ── Dashboard stats derived from other endpoints ──────────────────────────────

export function useDashboardStats() {
  const { data: airdrops, source: aSource } = useAirdrops();
  const { data: protocols, source: pSource } = useProtocols();
  const { data: farming } = useFarming(undefined, 50);

  const activeAirdrops = (airdrops ?? []).filter(
    (a) => a.status === 'active' || a.status === 'hot'
  ).length;

  const totalTvl = (protocols ?? []).reduce((s, p) => s + (p.tvl ?? 0), 0);

  const avgApy =
    (farming ?? []).length > 0
      ? (farming ?? []).reduce((s, f) => s + f.apy, 0) / (farming ?? []).length
      : 0;

  const farmingScore = Math.min(100, Math.round(avgApy));

  const opportunities = (protocols ?? []).filter(
    (p) => (p.tvlChange1d ?? 0) > 2
  ).length;

  const source = aSource === 'live' || pSource === 'live' ? 'live' : 'mock';

  const stats: DashboardStats | undefined =
    airdrops && protocols
      ? {
          opportunities,
          activeAirdrops,
          farmingScore,
          totalTvl,
          systemStatus: 'operational',
          dataSource: source,
          lastUpdated: new Date().toISOString(),
        }
      : undefined;

  return { data: stats, isLoading: !airdrops && !protocols };
}
