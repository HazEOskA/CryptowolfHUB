import { clsx } from 'clsx';
import type { ReactNode } from 'react';
import { Skeleton } from '@/components/ui';

interface StatCardProps {
  label: string;
  value: string | number | undefined;
  delta?: string;
  deltaPositive?: boolean;
  icon: string;
  accent?: 'green' | 'purple' | 'default';
  isLoading?: boolean;
  children?: ReactNode;
}

export default function StatCard({
  label,
  value,
  delta,
  deltaPositive = true,
  icon,
  accent = 'default',
  isLoading,
  children,
}: StatCardProps) {
  const valueColor = {
    green: 'text-accent',
    purple: 'text-accent2',
    default: 'text-wolf-text',
  }[accent];

  return (
    <div className="relative overflow-hidden rounded-lg border border-border bg-card p-4 transition-all duration-200 hover:-translate-y-px hover:border-accent2/50 group">
      {/* Top accent line on hover */}
      <div className="absolute left-0 right-0 top-0 h-[2px] bg-gradient-to-r from-accent2 to-accent opacity-0 transition-opacity group-hover:opacity-100" />

      <p className="mb-2.5 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-wolf-muted">
        <span>{icon}</span>
        {label}
      </p>

      {isLoading ? (
        <>
          <Skeleton className="mb-2 h-8 w-24" />
          <Skeleton className="h-3 w-32" />
        </>
      ) : (
        <>
          <p className={clsx('mb-2 font-mono text-[28px] font-extrabold leading-none', valueColor)}>
            {value ?? '—'}
          </p>
          {delta && (
            <p className={clsx(
              'flex items-center gap-1 text-[11px] font-bold',
              deltaPositive ? 'text-accent' : 'text-accent3'
            )}>
              {deltaPositive ? '↑' : '↓'} {delta}
            </p>
          )}
        </>
      )}

      {children}

      {/* Background icon */}
      <span className="pointer-events-none absolute bottom-3 right-3 text-3xl opacity-[0.07] select-none">
        {icon}
      </span>
    </div>
  );
}
