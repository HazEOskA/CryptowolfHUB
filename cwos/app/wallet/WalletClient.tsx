'use client';

import { useState, useEffect } from 'react';
import { useTicker } from '@/hooks/useWolfData';
import { SectionBoundary } from '@/components/ErrorBoundary';
import { SectionHeader, Card } from '@/components/ui';
import { clsx } from 'clsx';
import type { WalletTransaction } from '@/lib/types';

const MOCK_ADDRESS = 'HN7cABqLq46Es1jh92dQQisAq662SmxELLLsHHe4YWrH';

const MOCK_TXS: WalletTransaction[] = [
  { id: '1', type: 'swap',    description: 'USDC → SOL via Jupiter', amount: '+2.40 SOL',   positive: true,  timestamp: '2m ago' },
  { id: '2', type: 'receive', description: 'Received from Binance',  amount: '+100 USDC',  positive: true,  timestamp: '18m ago' },
  { id: '3', type: 'send',    description: 'Sent to cold wallet',    amount: '-1.00 SOL',   positive: false, timestamp: '1h ago' },
  { id: '4', type: 'stake',   description: 'Staked via Marinade',    amount: '-3.00 SOL',   positive: false, timestamp: '3h ago' },
  { id: '5', type: 'receive', description: 'Staking rewards',        amount: '+0.04 SOL',   positive: true,  timestamp: '6h ago' },
  { id: '6', type: 'swap',    description: 'JUP → USDC via Jupiter', amount: '+340 USDC',  positive: true,  timestamp: '1d ago' },
  { id: '7', type: 'unstake', description: 'Unstaked from Marinade', amount: '+2.00 mSOL',  positive: true,  timestamp: '2d ago' },
];

const TX_ICON: Record<WalletTransaction['type'], string> = {
  swap:    '🔄',
  receive: '📥',
  send:    '📤',
  stake:   '🔒',
  unstake: '🔓',
};

const TX_BG: Record<WalletTransaction['type'], string> = {
  swap:    'bg-accent2/15',
  receive: 'bg-accent/12',
  send:    'bg-accent3/12',
  stake:   'bg-accent4/12',
  unstake: 'bg-accent/12',
};

function ReadinessGauge({ score }: { score: number }) {
  const color = score >= 80 ? '#00ffa3' : score >= 60 ? '#ffa500' : '#ff6b6b';
  const label = score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : 'Needs work';
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-widest text-wolf-muted">
          Airdrop Readiness
        </span>
        <span className="font-mono text-[16px] font-extrabold" style={{ color }}>
          {score}%
        </span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-border">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${score}%`,
            background: `linear-gradient(90deg, #6c5cff, ${color})`,
          }}
        />
      </div>
      <p className="mt-1 text-[11px] text-wolf-muted">{label} — {score >= 80 ? 'eligible for most airdrops' : score >= 60 ? 'eligible for some airdrops' : 'increase on-chain activity'}</p>
    </div>
  );
}

export default function WalletClient() {
  const { data: tickers } = useTicker();
  const [copied, setCopied] = useState(false);

  const sol = tickers?.find((t) => t.symbol === 'SOL');
  const solPrice = sol?.price ?? 168;
  const solBalance = 4.28;
  const usdcBalance = 1240;
  const msolBalance = 2.04;
  const totalUsd = solBalance * solPrice + usdcBalance + msolBalance * solPrice * 1.02;
  const readiness = 78;

  function copyAddress() {
    navigator.clipboard.writeText(MOCK_ADDRESS).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="p-6 animate-fade-in">
      <SectionHeader
        title="Wallet"
        accent="Intelligence"
        sub="Portfolio overview & airdrop readiness score"
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        {/* Left: Portfolio */}
        <div className="flex flex-col gap-4">

          {/* Hero card */}
          <SectionBoundary context="wallet-hero">
            <div className="relative overflow-hidden rounded-xl border border-border bg-card p-5">
              {/* Ambient glow */}
              <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-accent2/10 blur-3xl" />

              {/* Address */}
              <div className="mb-5 flex items-center gap-3">
                <div className="h-10 w-10 shrink-0 rounded-full bg-gradient-wolf" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-mono text-[11px] text-wolf-muted">
                    {MOCK_ADDRESS}
                  </p>
                  <p className="text-[10px] text-wolf-muted2">Solana Mainnet</p>
                </div>
                <button
                  onClick={copyAddress}
                  className={clsx(
                    'shrink-0 rounded-md border px-3 py-1 font-mono text-[10px] font-bold uppercase transition-all',
                    copied
                      ? 'border-accent/40 text-accent'
                      : 'border-border text-wolf-muted hover:border-accent hover:text-accent'
                  )}
                >
                  {copied ? '✓ Copied' : 'Copy'}
                </button>
              </div>

              {/* Balances */}
              <div className="mb-5 grid grid-cols-3 gap-3">
                {[
                  { label: 'SOL', value: solBalance.toFixed(2), sub: `≈ $${(solBalance * solPrice).toFixed(0)}`, color: 'text-accent' },
                  { label: 'USDC', value: usdcBalance.toLocaleString(), sub: 'Stablecoin', color: 'text-blue-400' },
                  { label: 'mSOL', value: msolBalance.toFixed(2), sub: 'Marinade LST', color: 'text-accent2' },
                ].map(({ label, value, sub, color }) => (
                  <div key={label}>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-wolf-muted">{label}</p>
                    <p className={clsx('font-mono text-[22px] font-extrabold leading-tight', color)}>{value}</p>
                    <p className="text-[11px] text-wolf-muted">{sub}</p>
                  </div>
                ))}
              </div>

              {/* Total + PnL */}
              <div className="mb-5 flex items-end justify-between border-t border-border pt-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-wolf-muted">Total Portfolio</p>
                  <p className="font-mono text-[28px] font-extrabold text-wolf-text">
                    ${totalUsd.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-wolf-muted">30d PnL</p>
                  <p className="font-mono text-[20px] font-extrabold text-accent">+12.4%</p>
                </div>
              </div>

              {/* Readiness */}
              <ReadinessGauge score={readiness} />
            </div>
          </SectionBoundary>

          {/* Readiness breakdown */}
          <SectionBoundary context="wallet-readiness">
            <Card className="p-4">
              <p className="mb-3 text-[11px] font-bold uppercase tracking-widest text-wolf-muted">
                Readiness Breakdown
              </p>
              <div className="flex flex-col gap-2">
                {[
                  { label: 'On-chain tx volume', score: 88, note: 'High activity' },
                  { label: 'Protocol diversity', score: 72, note: '6 protocols used' },
                  { label: 'Token holdings', score: 65, note: 'Hold more native tokens' },
                  { label: 'NFT presence', score: 40, note: 'No NFTs detected' },
                  { label: 'Bridge activity', score: 80, note: 'Multi-chain active' },
                ].map(({ label, score, note }) => (
                  <div key={label} className="flex items-center gap-3">
                    <div className="w-36 shrink-0">
                      <p className="text-[11px] text-wolf-muted">{label}</p>
                    </div>
                    <div className="flex-1">
                      <div className="h-1.5 overflow-hidden rounded-full bg-border">
                        <div
                          className={clsx(
                            'h-full rounded-full',
                            score >= 70 ? 'bg-accent' : score >= 50 ? 'bg-accent4' : 'bg-accent3'
                          )}
                          style={{ width: `${score}%` }}
                        />
                      </div>
                    </div>
                    <span className="w-8 text-right font-mono text-[11px] font-bold text-wolf-text">
                      {score}%
                    </span>
                    <span className="w-36 text-[10px] text-wolf-muted2">{note}</span>
                  </div>
                ))}
              </div>
            </Card>
          </SectionBoundary>
        </div>

        {/* Right: Transaction history */}
        <SectionBoundary context="wallet-activity">
          <div className="overflow-hidden rounded-lg border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border bg-card2 px-4 py-3">
              <span className="text-[12px] font-bold uppercase tracking-widest text-wolf-muted">
                Recent Activity
              </span>
              <span className="font-mono text-[10px] text-wolf-muted2">last 7 days</span>
            </div>

            <div className="divide-y divide-white/[0.04]">
              {MOCK_TXS.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-white/[0.025]"
                >
                  <div
                    className={clsx(
                      'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm',
                      TX_BG[tx.type]
                    )}
                  >
                    {TX_ICON[tx.type]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-wolf-text capitalize">{tx.type}</p>
                    <p className="truncate text-[11px] text-wolf-muted">{tx.description}</p>
                  </div>
                  <div className="text-right">
                    <p className={clsx('font-mono text-[13px] font-bold', tx.positive ? 'text-accent' : 'text-accent3')}>
                      {tx.amount}
                    </p>
                    <p className="font-mono text-[10px] text-wolf-muted2">{tx.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </SectionBoundary>
      </div>
    </div>
  );
}
