'use client';

import { useDashboardStats, useTicker } from '@/hooks/useWolfData';
import StatCard from '@/components/dashboard/StatCard';
import LiveFeed from '@/components/dashboard/LiveFeed';
import { SectionBoundary } from '@/components/ErrorBoundary';
import { SectionHeader, EmptyState } from '@/components/ui';

function formatTvl(n: number): string {
  if (n >= 1e9) return `$${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(0)}M`;
  return `$${n.toLocaleString()}`;
}

export default function DashboardClient() {
  const { data: stats, isLoading } = useDashboardStats();
  const { data: tickers } = useTicker();

  const sol = tickers?.find((t) => t.symbol === 'SOL');

  return (
    <div className="p-6 animate-fade-in">
      <SectionHeader
        title="Dashboard"
        accent="Overview"
        sub={stats ? `Last updated ${new Date(stats.lastUpdated).toLocaleTimeString()}` : 'Loading…'}
        source={stats?.dataSource}
      />

      {/* Stat Cards */}
      <div className="mb-6 grid grid-cols-2 gap-4 xl:grid-cols-4">
        <SectionBoundary context="stat-opportunities">
          <StatCard
            label="Live Opportunities"
            value={stats?.opportunities}
            delta={stats ? `${stats.opportunities} protocols up >2% today` : undefined}
            deltaPositive
            icon="🎯"
            accent="green"
            isLoading={isLoading}
          />
        </SectionBoundary>

        <SectionBoundary context="stat-airdrops">
          <StatCard
            label="Active Airdrops"
            value={stats?.activeAirdrops}
            delta={stats ? 'including hot campaigns' : undefined}
            deltaPositive
            icon="🪂"
            accent="purple"
            isLoading={isLoading}
          />
        </SectionBoundary>

        <SectionBoundary context="stat-farming">
          <StatCard
            label="Avg Farming APY"
            value={stats ? `${stats.farmingScore}%` : undefined}
            delta={stats && stats.farmingScore > 15 ? 'Above average yield environment' : 'Moderate conditions'}
            deltaPositive={stats ? stats.farmingScore > 15 : true}
            icon="🌾"
            isLoading={isLoading}
          />
        </SectionBoundary>

        <SectionBoundary context="stat-tvl">
          <StatCard
            label="Tracked TVL"
            value={stats ? formatTvl(stats.totalTvl) : undefined}
            delta={sol ? `SOL $${sol.price.toFixed(2)} (${sol.change24h >= 0 ? '+' : ''}${sol.change24h.toFixed(2)}%)` : undefined}
            deltaPositive={sol ? sol.change24h >= 0 : true}
            icon="📊"
            isLoading={isLoading}
          />
        </SectionBoundary>
      </div>

      {/* Feed + Top Opportunities */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <SectionBoundary context="live-feed">
          <LiveFeed title="Intelligence Stream" maxHeight="380px" initialCount={10} />
        </SectionBoundary>

        <SectionBoundary context="quick-opportunities">
          <LiveFeed
            title="Top Opportunities"
            maxHeight="380px"
            initialCount={6}
          />
        </SectionBoundary>
      </div>

      {/* System status bar */}
      <div className="mt-4 flex items-center justify-between rounded-lg border border-border bg-card px-4 py-2.5">
        <div className="flex items-center gap-2 text-xs text-wolf-muted">
          <span className="h-1.5 w-1.5 animate-pulse-slow rounded-full bg-accent" />
          All systems operational
        </div>
        <div className="flex gap-4 font-mono text-[10px] text-wolf-muted2">
          <span>DeFiLlama ✓</span>
          <span>CoinGecko ✓</span>
          <span>GitHub ✓</span>
        </div>
        <span className="font-mono text-[10px] text-wolf-muted2">
          v{process.env.NEXT_PUBLIC_APP_VERSION ?? '1.0.0'}
        </span>
      </div>
    </div>
  );
}
