// CryptoWolf OS — Stat Card

import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '../../utils/cn';

interface StatCardProps {
  label: string;
  value: string;
  subValue?: string;
  change?: number;
  icon?: LucideIcon;
  iconColor?: string;
  accent?: 'violet' | 'cyan' | 'green' | 'red' | 'yellow';
  loading?: boolean;
}

const ACCENTS = {
  violet: { bg: 'bg-violet-500/10', border: 'border-violet-500/20', icon: 'text-violet-400', glow: 'shadow-violet-500/10' },
  cyan: { bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', icon: 'text-cyan-400', glow: 'shadow-cyan-500/10' },
  green: { bg: 'bg-green-500/10', border: 'border-green-500/20', icon: 'text-green-400', glow: 'shadow-green-500/10' },
  red: { bg: 'bg-red-500/10', border: 'border-red-500/20', icon: 'text-red-400', glow: 'shadow-red-500/10' },
  yellow: { bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', icon: 'text-yellow-400', glow: 'shadow-yellow-500/10' },
};

export function StatCard({ label, value, subValue, change, icon: Icon, accent = 'violet', loading }: StatCardProps) {
  const a = ACCENTS[accent];
  const isPos = change !== undefined && change >= 0;

  if (loading) {
    return (
      <div className={cn('rounded-xl border p-4 bg-[#0D0E14]', a.border)}>
        <div className="animate-pulse space-y-3">
          <div className="h-3 bg-white/5 rounded w-24" />
          <div className="h-7 bg-white/5 rounded w-32" />
          <div className="h-3 bg-white/5 rounded w-16" />
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      'rounded-xl border p-4 bg-[#0D0E14] transition-all duration-200 hover:border-opacity-60 shadow-lg',
      a.border, a.glow
    )}>
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">{label}</span>
        {Icon && (
          <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', a.bg)}>
            <Icon size={16} className={a.icon} />
          </div>
        )}
      </div>

      <div className="space-y-1">
        <p className="text-2xl font-bold text-white tabular-nums leading-none">{value}</p>
        {(subValue || change !== undefined) && (
          <div className="flex items-center gap-2">
            {change !== undefined && (
              <span className={cn(
                'flex items-center gap-0.5 text-xs font-semibold',
                isPos ? 'text-green-400' : 'text-red-400'
              )}>
                {isPos ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                {isPos ? '+' : ''}{change.toFixed(2)}%
              </span>
            )}
            {subValue && <span className="text-xs text-gray-600">{subValue}</span>}
          </div>
        )}
      </div>
    </div>
  );
}
