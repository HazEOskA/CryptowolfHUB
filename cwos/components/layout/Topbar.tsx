'use client';

import { clsx } from 'clsx';
import { useTicker } from '@/hooks/useWolfData';
import { StatusPill } from '@/components/ui';

export default function Topbar() {
  const { data: tickers, source, isLoading } = useTicker();

  return (
    <header className="col-span-2 flex h-[58px] items-center justify-between border-b border-border bg-bg2 pr-5">
      {/* Brand */}
      <div className="flex h-full w-[220px] shrink-0 items-center gap-0 border-r border-border px-5">
        <svg className="mr-2.5 h-8 w-8 shrink-0" viewBox="0 0 30 30" fill="none">
          <circle cx="15" cy="15" r="14" stroke="#6c5cff" strokeWidth="1.5" fill="rgba(108,92,255,0.1)" />
          <path d="M8 20 L15 8 L22 20 L15 16 Z" fill="#00ffa3" opacity="0.9" />
          <path d="M11 20 L15 14 L19 20" fill="#6c5cff" opacity="0.7" />
        </svg>
        <span className="text-[15px] font-extrabold tracking-[0.04em] text-wolf-text whitespace-nowrap">
          Crypto<span className="text-accent">Wolf</span> OS
        </span>
      </div>

      {/* Ticker */}
      <div className="flex flex-1 items-center gap-5 overflow-hidden px-5">
        {isLoading && !tickers && (
          <span className="font-mono text-[11px] text-wolf-muted2">Loading prices…</span>
        )}
        {(tickers ?? []).map((t) => (
          <TickerItem key={t.symbol} ticker={t} />
        ))}
      </div>

      {/* Right side */}
      <div className="flex shrink-0 items-center gap-3">
        <StatusPill status={source === 'live' ? 'live' : source === 'mock' ? 'mock' : 'reconnecting'} />
      </div>
    </header>
  );
}

function TickerItem({ ticker }: { ticker: { symbol: string; price: number; change24h: number } }) {
  const up = ticker.change24h >= 0;
  const fmt =
    ticker.price < 1
      ? ticker.price.toFixed(4)
      : ticker.price < 100
      ? ticker.price.toFixed(2)
      : ticker.price.toFixed(0);

  return (
    <span className="flex items-center gap-1.5 whitespace-nowrap font-mono text-[11px] text-wolf-muted">
      <span className="font-bold text-wolf-text">{ticker.symbol}</span>
      <span className={clsx(up ? 'text-accent' : 'text-accent3')}>
        ${fmt}{' '}
        <span className="text-[10px]">
          {up ? '+' : ''}{ticker.change24h.toFixed(2)}%
        </span>
      </span>
    </span>
  );
}
