'use client';

// components/ui/index.tsx
// All atomic UI primitives. Keep them small and focused.

import { type ReactNode } from 'react';
import { clsx } from 'clsx';

// ── Card ─────────────────────────────────────────────────────────────────────

export function Card({
  children,
  className,
  hover = true,
}: {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}) {
  return (
    <div
      className={clsx(
        'rounded-lg border border-border bg-card p-4',
        hover && 'transition-all duration-200 hover:-translate-y-px hover:border-accent2/50',
        className
      )}
    >
      {children}
    </div>
  );
}

// ── Badge ─────────────────────────────────────────────────────────────────────

type BadgeVariant = 'purple' | 'green' | 'red' | 'orange' | 'gray' | 'blue';

const BADGE_CLASSES: Record<BadgeVariant, string> = {
  purple: 'bg-accent2/15 text-accent2',
  green: 'bg-accent/12 text-accent',
  red: 'bg-accent3/15 text-accent3',
  orange: 'bg-accent4/15 text-accent4',
  gray: 'bg-wolf-muted/10 text-wolf-muted',
  blue: 'bg-blue-500/15 text-blue-400',
};

export function Badge({
  children,
  variant = 'purple',
  pulse,
  className,
}: {
  children: ReactNode;
  variant?: BadgeVariant;
  pulse?: boolean;
  className?: string;
}) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide',
        BADGE_CLASSES[variant],
        pulse && 'animate-badge-pulse',
        className
      )}
    >
      {children}
    </span>
  );
}

// ── Status Pill ───────────────────────────────────────────────────────────────

export function StatusPill({
  status,
}: {
  status: 'live' | 'reconnecting' | 'mock';
}) {
  const map = {
    live: { label: 'LIVE', cls: 'border-accent/30 bg-accent/8 text-accent' },
    reconnecting: { label: 'RECONNECTING', cls: 'border-accent4/30 bg-accent4/8 text-accent4' },
    mock: { label: 'MOCK DATA', cls: 'border-wolf-muted/30 bg-wolf-muted/8 text-wolf-muted' },
  };
  const { label, cls } = map[status];

  return (
    <div
      className={clsx(
        'flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-wider',
        cls
      )}
    >
      <span
        className={clsx(
          'h-1.5 w-1.5 rounded-full bg-current',
          status === 'live' && 'animate-pulse-slow',
          status === 'reconnecting' && 'animate-ping'
        )}
      />
      {label}
    </div>
  );
}

// ── Spinner ───────────────────────────────────────────────────────────────────

export function Spinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const s = { sm: 'h-4 w-4 border', md: 'h-6 w-6 border-2', lg: 'h-10 w-10 border-2' }[size];
  return (
    <div
      className={clsx(
        'animate-spin rounded-full border-wolf-muted/30 border-t-accent',
        s
      )}
    />
  );
}

// ── Empty State ───────────────────────────────────────────────────────────────

export function EmptyState({
  icon = '📭',
  title = 'No data available',
  description,
  action,
}: {
  icon?: string;
  title?: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <span className="text-4xl opacity-40">{icon}</span>
      <p className="font-semibold text-wolf-text">{title}</p>
      {description && <p className="text-sm text-wolf-muted">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

// ── Loading Skeleton ──────────────────────────────────────────────────────────

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={clsx(
        'animate-pulse rounded bg-wolf-muted/10',
        className
      )}
    />
  );
}

// ── Section Header ────────────────────────────────────────────────────────────

export function SectionHeader({
  title,
  accent,
  sub,
  action,
  source,
}: {
  title: string;
  accent?: string;
  sub?: string;
  action?: ReactNode;
  source?: 'live' | 'mock' | 'cached';
}) {
  return (
    <div className="mb-5 flex items-start justify-between">
      <div>
        <h1 className="text-[18px] font-extrabold text-wolf-text">
          {title}{' '}
          {accent && <span className="text-accent">{accent}</span>}
        </h1>
        {sub && <p className="mt-0.5 text-xs text-wolf-muted">{sub}</p>}
      </div>
      <div className="flex items-center gap-3">
        {source && (
          <span className={clsx(
            'font-mono text-[9px] font-bold uppercase tracking-widest',
            source === 'live' ? 'text-accent' : 'text-wolf-muted2'
          )}>
            {source === 'live' ? '● LIVE DATA' : source === 'cached' ? '◌ CACHED' : '◌ MOCK DATA'}
          </span>
        )}
        {action}
      </div>
    </div>
  );
}

// ── Chain Badge ───────────────────────────────────────────────────────────────

const CHAIN_STYLES: Record<string, string> = {
  solana: 'bg-purple-500/15 text-purple-400',
  ethereum: 'bg-blue-500/15 text-blue-400',
  arbitrum: 'bg-blue-400/15 text-blue-300',
  base: 'bg-blue-600/15 text-blue-400',
  optimism: 'bg-red-500/15 text-red-400',
  bsc: 'bg-yellow-500/15 text-yellow-400',
  multi: 'bg-accent2/15 text-accent2',
  polygon: 'bg-purple-400/15 text-purple-300',
  avalanche: 'bg-red-600/15 text-red-400',
};

export function ChainBadge({ chain }: { chain: string }) {
  const key = chain.toLowerCase().replace(/ /g, '');
  const cls = CHAIN_STYLES[key] ?? 'bg-wolf-muted/10 text-wolf-muted';
  return (
    <span className={clsx('rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide', cls)}>
      {chain}
    </span>
  );
}

// ── Risk Badge ────────────────────────────────────────────────────────────────

export function RiskBadge({ risk }: { risk: 'low' | 'medium' | 'high' }) {
  const map = {
    low: 'bg-accent/12 text-accent',
    medium: 'bg-accent4/15 text-accent4',
    high: 'bg-accent3/15 text-accent3',
  };
  return (
    <span className={clsx('rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide', map[risk])}>
      {risk}
    </span>
  );
}

// ── Airdrop Status Badge ──────────────────────────────────────────────────────

export function AirdropStatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    active: 'bg-accent/12 text-accent',
    hot: 'bg-accent3/15 text-accent3',
    upcoming: 'bg-accent2/15 text-accent2',
    ended: 'bg-wolf-muted/10 text-wolf-muted',
  };
  const dot: Record<string, string> = { active: '●', hot: '🔥', upcoming: '◌', ended: '○' };
  return (
    <span className={clsx('inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide', map[status] ?? map.ended)}>
      {dot[status] ?? '○'} {status}
    </span>
  );
}
