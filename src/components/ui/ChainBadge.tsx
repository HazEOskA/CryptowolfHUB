// CryptoWolf OS — Chain Badge

import { CHAIN_META } from '../../lib/constants';
import { cn } from '../../utils/cn';

interface ChainBadgeProps {
  chain: string;
  size?: 'sm' | 'md';
}

export function ChainBadge({ chain, size = 'sm' }: ChainBadgeProps) {
  const key = chain?.toLowerCase().replace(/\s+/g, '');
  const meta = CHAIN_META[key];
  const color = meta?.color ?? '#6B7280';
  const short = meta?.shortName ?? chain?.slice(0, 4).toUpperCase() ?? 'N/A';

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-mono font-semibold border',
        size === 'sm' ? 'text-[10px] px-1.5 py-0.5' : 'text-xs px-2 py-0.5'
      )}
      style={{
        color,
        borderColor: `${color}40`,
        backgroundColor: `${color}15`,
      }}
    >
      {short}
    </span>
  );
}
