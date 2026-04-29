'use client';

import { useSignals } from '@/hooks/useWolfData';
import { SectionBoundary } from '@/components/ErrorBoundary';
import { SectionHeader, Spinner, EmptyState } from '@/components/ui';
import { clsx } from 'clsx';
import type { Signal, SignalType } from '@/lib/types';
import LiveFeed from '@/components/dashboard/LiveFeed';

const TYPE_META: Record<SignalType, { icon: string; color: string; bg: string }> = {
  whale:    { icon: '🐋', color: '#ff6b6b', bg: 'rgba(255,107,107,0.10)' },
  momentum: { icon: '📈', color: '#6c5cff', bg: 'rgba(108,92,255,0.10)' },
  growth:   { icon: '🚀', color: '#00ffa3', bg: 'rgba(0,255,163,0.10)' },
  social:   { icon: '📣', color: '#ffa500', bg: 'rgba(255,165,0,0.10)' },
  alert:    { icon: '⚠️', color: '#ff6b6b', bg: 'rgba(255,107,107,0.06)' },
};

const DIR_COLOR = {
  bullish: 'text-accent',
  bearish: 'text-accent3',
  neutral: 'text-wolf-muted',
};

function MeterBar({
  value,
  color,
}: {
  value: number;
  color: string;
}) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-border">
      <div
        className="h-full rounded-full transition-all duration-700"
        style={{ width: `${value}%`, background: color }}
      />
    </div>
  );
}

function SignalCard({ signal }: { signal: Signal }) {
  const meta = TYPE_META[signal.type] ?? TYPE_META.growth;

  return (
    <div
      className="flex flex-col rounded-lg border border-border bg-card p-4 transition-all duration-200 hover:-translate-y-px hover:border-accent2/50"
    >
      {/* Header */}
      <div className="mb-4 flex items-start gap-3">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-xl"
          style={{ background: meta.bg }}
        >
          {meta.icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-bold text-wolf-text">{signal.title}</p>
          <p className="text-[11px] text-wolf-muted">{signal.subtitle}</p>
        </div>
        <div className="text-right">
          <span
            className={clsx('text-[11px] font-bold uppercase tracking-wide', DIR_COLOR[signal.direction])}
          >
            {signal.direction}
          </span>
          {signal.source === 'live' && (
            <p className="mt-0.5 text-[9px] font-bold text-accent">● LIVE</p>
          )}
        </div>
      </div>

      {/* Strength meter */}
      <div className="mb-4">
        <div className="mb-1.5 flex justify-between text-[11px]">
          <span className="text-wolf-muted">Signal Strength</span>
          <span className="font-mono font-bold" style={{ color: meta.color }}>
            {signal.strength}%
          </span>
        </div>
        <MeterBar value={signal.strength} color={meta.color} />
      </div>

      {/* Events */}
      <div className="flex flex-col gap-1.5">
        {signal.events.map((ev, i) => (
          <div
            key={i}
            className="flex items-center gap-2 rounded-md bg-bg2 px-2.5 py-2 text-[11px]"
          >
            <span
              className="h-1.5 w-1.5 shrink-0 rounded-full"
              style={{ background: meta.color }}
            />
            <span className="flex-1 text-wolf-muted">{ev.label}</span>
            <span className="font-mono font-bold text-wolf-text">{ev.value}</span>
          </div>
        ))}
      </div>

      <p className="mt-3 font-mono text-[9px] text-wolf-muted2">
        Updated {new Date(signal.updatedAt).toLocaleTimeString()}
      </p>
    </div>
  );
}

export default function SignalsClient() {
  const { data: signals, isLoading, source, mutate } = useSignals();

  const bullishCount = (signals ?? []).filter((s) => s.direction === 'bullish').length;
  const avgStrength =
    (signals ?? []).length > 0
      ? Math.round((signals ?? []).reduce((s, sig) => s + sig.strength, 0) / (signals ?? []).length)
      : 0;

  return (
    <div className="p-6 animate-fade-in">
      <SectionHeader
        title="Alpha"
        accent="Signals"
        sub={`${bullishCount}/${(signals ?? []).length} bullish · Avg strength ${avgStrength}%`}
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

      {/* Summary bar */}
      {signals && signals.length > 0 && (
        <div className="mb-5 flex gap-3">
          <div className="flex-1 rounded-lg border border-border bg-card px-4 py-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-wolf-muted">Market Bias</p>
            <p className={clsx('mt-1 text-[18px] font-extrabold', bullishCount > signals.length / 2 ? 'text-accent' : 'text-accent3')}>
              {bullishCount > signals.length / 2 ? '↑ BULLISH' : '↓ BEARISH'}
            </p>
          </div>
          <div className="flex-1 rounded-lg border border-border bg-card px-4 py-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-wolf-muted">Avg Strength</p>
            <p className="mt-1 font-mono text-[18px] font-extrabold text-wolf-text">{avgStrength}%</p>
          </div>
          <div className="flex-1 rounded-lg border border-border bg-card px-4 py-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-wolf-muted">Active Signals</p>
            <p className="mt-1 font-mono text-[18px] font-extrabold text-accent2">{signals.length}</p>
          </div>
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
        {/* Signal cards */}
        <SectionBoundary context="signals-grid">
          {isLoading && !signals ? (
            <div className="flex h-64 items-center justify-center">
              <Spinner size="lg" />
            </div>
          ) : !signals?.length ? (
            <EmptyState icon="📡" title="No signals available" description="Data sources are loading…" />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {signals.map((s) => (
                <SignalCard key={s.id} signal={s} />
              ))}
            </div>
          )}
        </SectionBoundary>

        {/* Live feed sidebar */}
        <SectionBoundary context="signals-feed">
          <LiveFeed title="Signal Events" maxHeight="calc(100vh - 280px)" initialCount={12} />
        </SectionBoundary>
      </div>
    </div>
  );
}
