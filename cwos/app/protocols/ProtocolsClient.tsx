'use client';

import { useState, useMemo } from 'react';
import { useProtocols } from '@/hooks/useWolfData';
import { SectionBoundary } from '@/components/ErrorBoundary';
import {
  SectionHeader,
  ChainBadge,
  RiskBadge,
  Spinner,
  EmptyState,
} from '@/components/ui';
import { clsx } from 'clsx';
import type { Protocol } from '@/lib/types';

type SortKey = 'tvl' | 'tvlChange1d' | 'tvlChange7d' | 'apy' | 'name';
type SortDir = 'asc' | 'desc';

function formatTvl(n: number): string {
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(0)}M`;
  return `$${n.toLocaleString()}`;
}

function Delta({ value }: { value: number }) {
  const pos = value >= 0;
  return (
    <span className={clsx('font-mono text-[12px] font-bold', pos ? 'text-accent' : 'text-accent3')}>
      {pos ? '+' : ''}{value.toFixed(2)}%
    </span>
  );
}

function SortButton({
  label,
  sortKey,
  current,
  dir,
  onClick,
}: {
  label: string;
  sortKey: SortKey;
  current: SortKey;
  dir: SortDir;
  onClick: (k: SortKey) => void;
}) {
  const active = current === sortKey;
  return (
    <button
      onClick={() => onClick(sortKey)}
      className={clsx(
        'flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest transition-colors',
        active ? 'text-accent' : 'text-wolf-muted hover:text-wolf-text'
      )}
    >
      {label}
      {active && <span className="text-[8px]">{dir === 'desc' ? '▼' : '▲'}</span>}
    </button>
  );
}

export default function ProtocolsClient() {
  const { data: protocols, isLoading, source, mutate } = useProtocols();
  const [sortKey, setSortKey] = useState<SortKey>('tvl');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [search, setSearch] = useState('');
  const [chainFilter, setChainFilter] = useState<string>('all');

  const chains = useMemo(() => {
    const set = new Set<string>(['all']);
    (protocols ?? []).forEach((p) => set.add(p.chain));
    return Array.from(set).slice(0, 8);
  }, [protocols]);

  const sorted = useMemo(() => {
    let list = [...(protocols ?? [])];

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.chain.toLowerCase().includes(q)
      );
    }

    if (chainFilter !== 'all') {
      list = list.filter((p) => p.chain === chainFilter);
    }

    list.sort((a, b) => {
      let av: number | string = 0;
      let bv: number | string = 0;

      if (sortKey === 'name') {
        av = a.name.toLowerCase();
        bv = b.name.toLowerCase();
        return sortDir === 'asc'
          ? (av as string).localeCompare(bv as string)
          : (bv as string).localeCompare(av as string);
      }

      if (sortKey === 'tvl') { av = a.tvl; bv = b.tvl; }
      if (sortKey === 'tvlChange1d') { av = a.tvlChange1d; bv = b.tvlChange1d; }
      if (sortKey === 'tvlChange7d') { av = a.tvlChange7d; bv = b.tvlChange7d; }
      if (sortKey === 'apy') { av = a.apy ?? 0; bv = b.apy ?? 0; }

      return sortDir === 'desc'
        ? (bv as number) - (av as number)
        : (av as number) - (bv as number);
    });

    return list;
  }, [protocols, sortKey, sortDir, search, chainFilter]);

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === 'desc' ? 'asc' : 'desc'));
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  }

  const totalTvl = (protocols ?? []).reduce((s, p) => s + p.tvl, 0);

  return (
    <div className="p-6 animate-fade-in">
      <SectionHeader
        title="Protocol"
        accent="Monitor"
        sub={`${sorted.length} protocols tracked · Total TVL ${formatTvl(totalTvl)}`}
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
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <input
          type="text"
          placeholder="Search protocols…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-md border border-border bg-card px-3 py-1.5 text-[13px] text-wolf-text placeholder:text-wolf-muted2 outline-none focus:border-accent2/60 w-52"
        />
        <div className="flex gap-2 flex-wrap">
          {chains.map((c) => (
            <button
              key={c}
              onClick={() => setChainFilter(c)}
              className={clsx(
                'rounded-md border px-2.5 py-1 text-[11px] font-semibold capitalize transition-all',
                chainFilter === c
                  ? 'border-accent2/40 bg-accent2/10 text-accent2'
                  : 'border-border bg-card text-wolf-muted hover:text-wolf-text'
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <SectionBoundary context="protocols-table">
        {isLoading && !protocols ? (
          <div className="flex h-64 items-center justify-center">
            <Spinner size="lg" />
          </div>
        ) : !sorted.length ? (
          <EmptyState icon="🔗" title="No protocols found" description="Try a different search or filter" />
        ) : (
          <div className="overflow-hidden rounded-lg border border-border bg-card">
            {/* Header */}
            <div className="grid grid-cols-[1fr_90px_110px_100px_110px_80px_80px] items-center gap-2 border-b border-border bg-card2 px-4 py-2.5">
              <SortButton label="Protocol" sortKey="name" current={sortKey} dir={sortDir} onClick={handleSort} />
              <span className="text-[10px] font-bold uppercase tracking-widest text-wolf-muted">Chain</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-wolf-muted">Category</span>
              <SortButton label="TVL" sortKey="tvl" current={sortKey} dir={sortDir} onClick={handleSort} />
              <SortButton label="1d change" sortKey="tvlChange1d" current={sortKey} dir={sortDir} onClick={handleSort} />
              <SortButton label="APY" sortKey="apy" current={sortKey} dir={sortDir} onClick={handleSort} />
              <span className="text-[10px] font-bold uppercase tracking-widest text-wolf-muted">Risk</span>
            </div>

            {/* Rows */}
            <div className="divide-y divide-white/[0.04]">
              {sorted.map((p) => (
                <ProtocolRow key={p.id} protocol={p} />
              ))}
            </div>
          </div>
        )}
      </SectionBoundary>
    </div>
  );
}

function ProtocolRow({ protocol: p }: { protocol: Protocol }) {
  return (
    <div className="grid grid-cols-[1fr_90px_110px_100px_110px_80px_80px] items-center gap-2 px-4 py-3 transition-colors hover:bg-white/[0.025]">
      {/* Name */}
      <div className="flex items-center gap-3 min-w-0">
        {p.logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={p.logo}
            alt={p.name}
            className="h-7 w-7 shrink-0 rounded-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        ) : (
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent2/15 text-xs font-bold text-accent2">
            {p.name.slice(0, 2).toUpperCase()}
          </div>
        )}
        <div className="min-w-0">
          <p className="truncate text-[13px] font-semibold text-wolf-text">{p.name}</p>
          {p.url && (
            <a
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] text-wolf-muted2 hover:text-accent2 truncate block"
            >
              {p.url.replace(/^https?:\/\//, '')}
            </a>
          )}
        </div>
      </div>

      <ChainBadge chain={p.chain} />

      <span className="text-[11px] text-wolf-muted">{p.category}</span>

      <span className="font-mono text-[13px] font-bold text-wolf-text">
        {formatTvl(p.tvl)}
      </span>

      <Delta value={p.tvlChange1d} />

      <span className="font-mono text-[13px] font-bold text-accent">
        {p.apy != null ? `${p.apy.toFixed(1)}%` : '—'}
      </span>

      <RiskBadge risk={p.risk} />
    </div>
  );
}
