// CryptoWolf OS — Badge component

import { cn } from '../../utils/cn';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'violet' | 'outline';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  dot?: boolean;
  className?: string;
}

const VARIANTS: Record<BadgeVariant, string> = {
  default: 'bg-gray-800 text-gray-300 border border-gray-700',
  success: 'bg-green-500/15 text-green-400 border border-green-500/25',
  warning: 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/25',
  danger: 'bg-red-500/15 text-red-400 border border-red-500/25',
  info: 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/25',
  violet: 'bg-violet-500/15 text-violet-400 border border-violet-500/25',
  outline: 'bg-transparent text-gray-400 border border-gray-700',
};

const SIZES = {
  sm: 'text-[10px] px-1.5 py-0.5',
  md: 'text-xs px-2 py-0.5',
};

const DOT_COLORS: Record<BadgeVariant, string> = {
  default: 'bg-gray-400',
  success: 'bg-green-400',
  warning: 'bg-yellow-400',
  danger: 'bg-red-400',
  info: 'bg-cyan-400',
  violet: 'bg-violet-400',
  outline: 'bg-gray-400',
};

export function Badge({ children, variant = 'default', size = 'md', dot, className }: BadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center gap-1 rounded-full font-medium',
      VARIANTS[variant],
      SIZES[size],
      className
    )}>
      {dot && <span className={cn('w-1.5 h-1.5 rounded-full', DOT_COLORS[variant])} />}
      {children}
    </span>
  );
}
