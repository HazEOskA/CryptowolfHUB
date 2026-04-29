'use client';

import { useState } from 'react';
import { useAirdrops } from '@/hooks/useWolfData';
import { SectionBoundary } from '@/components/ErrorBoundary';
import {
  SectionHeader,
  ChainBadge,
  AirdropStatusBadge,
  Spinner,
  EmptyState,
  Card,
} from '@/components/ui';
import type { AirdropStatus } from '@/lib/types';

const FILTERS: { label: string; value: AirdropStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: '🔥 Hot', value: 'hot' },
  { label: '✅ Active', value: 'active' },
  { label: '🕐 Upcoming', value: 'upcoming' },
  { label: '✖ Ended', value: 'ended' },
];

export default function AirdropsClient() {
  const [filter, setFilter] = useState<AirdropStatus | 'all'>('all');
  const { data: airdrops, isLoading, source, mutate } = useAirdrops(
    filter === 'all' ? undefined : filter
  );

  return (
    <div className="p-6 animate-fade-in">
      <SectionHeader
        title="Airdrop"
        accent="Scanner"
        sub="Active & upcoming token distribution events — enriched with GitHub signals"
        source={source}
        action={
          <button
            onClick={() => mutate()}
            className="flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs text-wolf-muted transition-colors hover:border-accent hover:text-accent"
          >
            ⟳ Scan
          </button>
        }
      />

      {/* Filter tabs */}
      <div className="mb-4 flex gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`rounded-md border px-3 py-1 text-[12px] font-semibold transition-all ${
              filter === f.value
                ? 'border-accent/40 bg-accent/8 text-accent'
                : 'border-border bg-card text-wolf-muted hover:border-accent2/40 hover:text-wolf-text'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <SectionBoundary context="airdrop-table">
        {isLoading && !airdrops ? (
          <div className="flex h-48 items-center justify-center">
            <Spinner size="lg" />
          </div>
        ) : !airdrops?.length ? (
          <EmptyState
            icon="🪂"
            title="No airdrops found"
            description="Try a different filter or check back soon"
          />
        ) : (
          <div className="overflow-hidden rounded-lg border border-border bg-card">
            {/* Table header */}
            <div className="grid grid-cols-[1fr_90px_100px_90px_130px] border-b border-border bg-card2 px-4 py-2.5">
              {['Project', 'Chain', 'Status', 'Est. Value', 'Updated'].map((h) => (
                <span key={h} className="text-[10px] font-bold uppercase tracking-widest text-wolf-muted">
                  {h}
                </span>
              ))}
            </div>

            {/* Rows */}
            {airdrops.map((a) => (
              <div
                key={a.id}
                className="grid grid-cols-[1fr_90px_100px_90px_130px] items-center border-b border-white/[0.04] px-4 py-3 last:border-0 transition-colors hover:bg-white/[0.025]"
              >
                {/* Name */}
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent2/10 text-base">
                    {a.emoji}
                  </span>
                  <div>
                    <p className="text-[13px] font-semibold text-wolf-text">{a.name}</p>
                    <p className="text-[11px] text-wolf-muted">{a.project}</p>
                  </div>
                </div>

                <ChainBadge chain={a.chain} />
                <AirdropStatusBadge status={a.status} />

                <span className="font-mono text-[12px] font-bold text-accent">
                  {a.estimatedValue ?? 'TBD'}
                </span>

                <div>
                  <p className="font-mono text-[10px] text-wolf-muted2">
                    {new Date(a.updatedAt).toLocaleTimeString()}
                  </p>
                  {a.source === 'live' && (
                    <p className="mt-0.5 text-[9px] font-bold uppercase tracking-wide text-accent">
                      ● live
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionBoundary>

      {/* Task hints for active airdrops */}
      {airdrops && airdrops.some((a) => a.tasks.length > 0) && (
        <div className="mt-6">
          <h2 className="mb-3 text-[12px] font-bold uppercase tracking-widest text-wolf-muted">
            Required Tasks
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {airdrops
              .filter((a) => a.tasks.length > 0 && a.status !== 'ended')
              .slice(0, 6)
              .map((a) => (
                <Card key={a.id} className="p-3">
                  <div className="mb-2 flex items-center gap-2">
                    <span>{a.emoji}</span>
                    <span className="text-[13px] font-bold">{a.name}</span>
                    <AirdropStatusBadge status={a.status} />
                  </div>
                  <ul className="space-y-1">
                    {a.tasks.map((task, i) => (
                      <li key={i} className="flex items-start gap-2 text-[11px] text-wolf-muted">
                        <span className="mt-0.5 text-accent">✓</span>
                        {task}
                      </li>
                    ))}
                  </ul>
                  {a.url && (
                    <a
                      href={a.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 block text-[10px] font-semibold text-accent2 hover:underline"
                    >
                      Open project ↗
                    </a>
                  )}
                </Card>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
