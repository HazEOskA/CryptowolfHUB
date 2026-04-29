'use client';

import { useState, useMemo } from 'react';
import { useFarming } from '@/hooks/useWolfData';
import { SectionBoundary } from '@/components/ErrorBoundary';
import { SectionHeader, ChainBadge, RiskBadge, Spinner, EmptyState } from '@/components/ui';
import { clsx } from 'clsx';
import type { FarmingPool } from '@/lib/types';

const CHAIN_FILTERS = ['All', 'Solana', 'Ethereum', 'Arbitrum', 'Base'];
const RISK_FILTERS = ['All', 'low', 'medium', 'high'] as const;

function formatUsd(n: number): string {
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(0)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(0)}K`;
  return `$${n.toFixed(0)}`;
}

function RiskBar({ score }: { score: number }) {
  const color =
    score < 30 ? 'bg-accent' : score < 60 ? 'bg-accent4' : 'bg-accent3';
  return (
    <div className="h-1.5 w-full rounded-full bg-border">
      <div
        className={clsx('h-full rounded-full transition-all duration-500', color)}
        style={{ width: `${score}%` }}
      />
    </div>
  );
}

function FarmCard({ pool }: { pool: FarmingPool }) {
  const apyColor =
    pool.apy >= 30
      ? 'text-accent3'
      : pool.apy >= 15
      ? 'text-accent'
      : 'text-wolf-text';

  return (
    <div className="flex flex-col rounded-lg border border-border bg-card p-4 transition-all duration-200 hover:-translate-y-px hover:border-accent2/50">
      {/* Header */}
      <div className="mb-3 flex items-start justify-between">
        <div>
          <p className="text-[14px] font-bold text-wolf-text">{pool.protocol}</p>
          <p className="text-[11px] text-wolf-muted">{pool.pair}</p>
        </div>
        <div className="text-right">
          <p className="text-[9px] font-bold uppercase tracking-widest text-wolf-muted">APY</p>
          <p className={clsx('font-mono text-[22px] font-extrabold leading-tight', apyColor)}>
            {pool.apy.toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Stats grid */}
      <div className="mb-3 grid grid-cols-2 gap-2">
        {[
          { label: 'TVL', value: formatUsd(pool.tvlUsd) },
          { label: 'Base APY', value: `${pool.apyBase.toFixed(1)}%` },
          { label: 'Reward APY', value: pool.apyReward > 0 ? `${pool.apyReward.toFixed(1)}%` : '—' },
          { label: 'Category', value: pool.category },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-md bg-bg2 px-2.5 py-2">
            <p className="text-[9px] font-bold uppercase tracking-widest text-wolf-muted2">{label}</p>
            <p className="mt-0.5 text-[12px] font-bold text-wolf-text">{value}</p>
          </div>
        ))}
      </div>

      {/* Reward tokens */}
      {pool.rewardTokens.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-1">
          {pool.rewardTokens.map((t) => (
            <span
              key={t}
              className="rounded-full bg-accent2/10 px-2 py-0.5 font-mono text-[9px] font-bold text-accent2"
            >
              {t}
            </span>
          ))}
        </div>
      )}

      {/* Risk bar */}
      <div className="mt-auto">
        <RiskBar score={pool.riskScore} />
        <div className="mt-1.5 flex items-center justify-between">
          <RiskBadge risk={pool.risk} />
          <span className="font-mono text-[10px] text-wolf-muted2">
            <ChainBadge chain={pool.chain} />
          </span>
        </div>
      </div>
    </div>
  );
}

export default function FarmingClient() {
  const [chainFilter, setChainFilter] = useState('All');
  const [riskFilter, setRiskFilter] = useState<typeof RISK_FILTERS[number]>('All');
  const [sortBy, setSortBy] = useState<'apy' | 'tvl'>('apy');
  const [minApy, setMinApy] = useState(0);

  const chain = chainFilter === 'All' ? undefined : chainFilter;
  const { data: pools, isLoading, source, mutate } = useFarming(chain, 60);

  const filtered = useMemo(() => {
    let list = [...(pools ?? [])];
    if (riskFilter !== 'All') list = list.filter((p) => p.risk === riskFilter);
    if (minApy > 0) list = list.filter((p) => p.apy >= minApy);
    list.sort((a, b) =>
      sortBy === 'apy' ? b.apy - a.apy : b.tvlUsd - a.tvlUsd
    );
    return list;
  }, [pools, riskFilter, minApy, sortBy]);

  const avgApy =
    filtered.length > 0
      ? filtered.reduce((s, p) => s + p.apy, 0) / filtered.length
      : 0;

  return (
    <div className="p-6 animate-fade-in">
      <SectionHeader
        title="Yield"
        accent="Farming"
        sub={`${filtered.length} pools · Avg APY ${avgApy.toFixed(1)}% · DeFiLlama data`}
        source={source}
        action={
          <button
            onClick={() => mutate()}
            className="flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs text-wolf-muted transition-colors hover:border-accent hover:text-accent"
          >
            ⟳ Refresh
          </button>
        }
      />

      {/* Controls */}
      <div className="mb-5 flex flex-wrap items-center gap-3">
        {/* Chain */}
        <div className="flex gap-1.5">
          {CHAIN_FILTERS.map((c) => (
            <button
              key={c}
              onClick={() => setChainFilter(c)}
              className={clsx(
                'rounded-md border px-2.5 py-1 text-[11px] font-semibold transition-all',
                chainFilter === c
                  ? 'border-accent/40 bg-accent/8 text-accent'
                  : 'border-border bg-card text-wolf-muted hover:text-wolf-text'
              )}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Risk */}
        <div className="flex gap-1.5">
          {RISK_FILTERS.map((r) => (
            <button
              key={r}
              onClick={() => setRiskFilter(r)}
              className={clsx(
                'rounded-md border px-2.5 py-1 text-[11px] font-semibold capitalize transition-all',
                riskFilter === r
                  ? 'border-accent2/40 bg-accent2/10 text-accent2'
                  : 'border-border bg-card text-wolf-muted hover:text-wolf-text'
              )}
            >
              {r === 'All' ? 'All Risk' : r}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="ml-auto flex gap-1.5">
          {(['apy', 'tvl'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSortBy(s)}
              className={clsx(
                'rounded-md border px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide transition-all',
                sortBy === s
                  ? 'border-accent2/40 bg-accent2/10 text-accent2'
                  : 'border-border bg-card text-wolf-muted hover:text-wolf-text'
              )}
            >
              Sort: {s.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Min APY */}
        <div className="flex items-center gap-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-wolf-muted">
            Min APY
          </label>
          <input
            type="number"
            min={0}
            max={200}
            value={minApy}
            onChange={(e) => setMinApy(Number(e.target.value))}
            className="w-16 rounded-md border border-border bg-card px-2 py-1 text-center font-mono text-[12px] text-wolf-text outline-none focus:border-accent2/60"
          />
          <span className="text-[11px] text-wolf-muted">%</span>
        </div>
      </div>

      <SectionBoundary context="farming-grid">
        {isLoading && !pools ? (
          <div className="flex h-64 items-center justify-center">
            <Spinner size="lg" />
          </div>
        ) : !filtered.length ? (
          <EmptyState
            icon="🌾"
            title="No pools match your filters"
            description="Try adjusting chain, risk level, or minimum APY"
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {filtered.map((pool) => (
              <FarmCard key={pool.id} pool={pool} />
            ))}
          </div>
        )}
      </SectionBoundary>
    </div>
  );
}
