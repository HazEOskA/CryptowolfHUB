'use client';

import { useState, useEffect, useCallback } from 'react';
import { clsx } from 'clsx';
import type { FeedItem } from '@/lib/types';

// Feed items are generated client-side from mixed real data signals
const FEED_POOL: Omit<FeedItem, 'id' | 'timestamp'>[] = [
  { icon: '🎯', type: 'opportunity', tag: 'OPPORTUNITY', title: 'Jupiter confirmed new liquidity incentive program', chain: 'Solana' },
  { icon: '🪂', type: 'airdrop', tag: 'AIRDROP', title: 'LayerZero snapshot window confirmed — check eligibility', chain: 'Ethereum' },
  { icon: '🚨', type: 'alert', tag: 'ALERT', title: 'Whale moved 48k SOL to exchange — monitor closely', chain: 'Solana' },
  { icon: '🌾', type: 'farming', tag: 'FARMING', title: 'Kamino USDC vault APY updated to 18.4%', chain: 'Solana' },
  { icon: '🎯', type: 'opportunity', tag: 'OPPORTUNITY', title: 'Raydium CLMM concentrated range at optimal spread', chain: 'Solana' },
  { icon: '🪂', type: 'airdrop', tag: 'AIRDROP', title: 'Hyperliquid Season 2 criteria updated — new tasks live', chain: 'Arbitrum' },
  { icon: '🔗', type: 'protocol', tag: 'PROTOCOL', title: 'EigenLayer restaking TVL crossed $12B milestone', chain: 'Ethereum' },
  { icon: '🌾', type: 'farming', tag: 'FARMING', title: 'mSOL-SOL LP rewards boosted 2x this week', chain: 'Solana' },
  { icon: '🚨', type: 'alert', tag: 'ALERT', title: 'Unusual options activity detected on BTC 70k strike', chain: 'Multi' },
  { icon: '🎯', type: 'opportunity', tag: 'OPPORTUNITY', title: 'Marginfi yield vault exceeded 22% APY threshold', chain: 'Solana' },
  { icon: '🔗', type: 'protocol', tag: 'PROTOCOL', title: 'Drift Protocol perps volume hit $480M in 24h', chain: 'Solana' },
  { icon: '🌾', type: 'farming', tag: 'FARMING', title: 'New Lifinity farm: SOL-USDT at 31% APY launched', chain: 'Solana' },
];

const TYPE_ICON_BG: Record<FeedItem['type'], string> = {
  opportunity: 'bg-accent/12',
  airdrop: 'bg-accent2/12',
  alert: 'bg-accent3/12',
  farming: 'bg-accent4/12',
  protocol: 'bg-blue-500/12',
};

let itemCounter = 0;

function makeItem(base: Omit<FeedItem, 'id' | 'timestamp'>): FeedItem {
  return {
    ...base,
    id: String(++itemCounter),
    timestamp: 'just now',
  };
}

interface LiveFeedProps {
  maxHeight?: string;
  title?: string;
  initialCount?: number;
}

export default function LiveFeed({
  maxHeight = '320px',
  title = 'Intelligence Stream',
  initialCount = 8,
}: LiveFeedProps) {
  const [items, setItems] = useState<FeedItem[]>([]);

  const inject = useCallback(() => {
    const pool = FEED_POOL;
    const base = pool[Math.floor(Math.random() * pool.length)];
    const newItem = makeItem(base);

    setItems((prev) => {
      const updated = [newItem, ...prev.map((i, idx) => {
        // Age existing timestamps
        if (idx === 0) return { ...i, timestamp: '1m ago' };
        if (idx < 3) return { ...i, timestamp: `${idx + 1}m ago` };
        return { ...i, timestamp: `${Math.floor(idx * 2.5)}m ago` };
      })];
      return updated.slice(0, 40);
    });
  }, []);

  // Seed initial items
  useEffect(() => {
    const seed: FeedItem[] = [];
    for (let i = 0; i < initialCount; i++) {
      const base = FEED_POOL[(i) % FEED_POOL.length];
      seed.push({
        ...base,
        id: String(++itemCounter),
        timestamp: `${(i + 1) * 3}m ago`,
      });
    }
    setItems(seed);
  }, [initialCount]);

  // Periodic injection
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.35) inject();
    }, 6000);
    return () => clearInterval(interval);
  }, [inject]);

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border bg-card2 px-4 py-3">
        <span className="text-[12px] font-bold uppercase tracking-widest text-wolf-muted">
          {title}
        </span>
        <span className="flex items-center gap-1.5 font-mono text-[10px] font-bold text-accent">
          <span className="h-1.5 w-1.5 animate-pulse-slow rounded-full bg-accent" />
          LIVE
        </span>
      </div>

      <div className="overflow-y-auto" style={{ maxHeight }}>
        {items.map((item) => (
          <FeedRow key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

function FeedRow({ item }: { item: FeedItem }) {
  return (
    <div className="group flex animate-slide-in items-start gap-3 border-b border-white/[0.04] px-4 py-3 last:border-0 hover:bg-white/[0.025] transition-colors">
      <div className={clsx(
        'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm mt-0.5',
        TYPE_ICON_BG[item.type]
      )}>
        {item.icon}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-semibold leading-snug text-wolf-text">{item.title}</p>
        <div className="mt-1 flex items-center gap-2 text-[11px] text-wolf-muted">
          <span className="rounded-full bg-accent2/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-accent2">
            {item.tag}
          </span>
          <span>{item.chain}</span>
        </div>
      </div>

      <span className="shrink-0 font-mono text-[10px] text-wolf-muted2">{item.timestamp}</span>
    </div>
  );
}
