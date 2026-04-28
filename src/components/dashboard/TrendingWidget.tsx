// CryptoWolf OS — Trending Coins Widget

import { Flame, TrendingUp, TrendingDown } from 'lucide-react';
import { TrendingCoin } from '../../lib/api/coingecko';
import { formatPercent } from '../../lib/formatters';
import { cn } from '../../utils/cn';

interface TrendingWidgetProps {
  coins: TrendingCoin[];
  loading: boolean;
}

export function TrendingWidget({ coins, loading }: TrendingWidgetProps) {
  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] animate-pulse">
            <div className="w-7 h-7 rounded-full bg-white/5" />
            <div className="flex-1 h-3 bg-white/5 rounded" />
            <div className="h-3 bg-white/5 rounded w-12" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {coins.slice(0, 8).map((c, idx) => {
        const coin = c.item;
        const change = coin.data?.price_change_percentage_24h?.usd ?? 0;
        const positive = change >= 0;
        const price = typeof coin.data?.price === 'number'
          ? coin.data.price < 0.01
            ? `$${coin.data.price.toExponential(2)}`
            : `$${coin.data.price.toFixed(coin.data.price < 1 ? 4 : 2)}`
          : String(coin.data?.price ?? 'N/A');

        return (
          <div
            key={coin.id}
            className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/[0.03] transition-colors group cursor-pointer"
          >
            <div className="flex items-center gap-2 flex-shrink-0 w-6">
              {idx < 3 ? (
                <Flame size={12} className={cn(
                  idx === 0 ? 'text-orange-400' : idx === 1 ? 'text-orange-300' : 'text-yellow-400'
                )} />
              ) : (
                <span className="text-xs text-gray-700 font-mono">{idx + 1}</span>
              )}
            </div>

            {coin.thumb && (
              <div className="w-6 h-6 rounded-full overflow-hidden bg-[#1A1D2B] flex-shrink-0">
                <img src={coin.thumb} alt={coin.name} className="w-full h-full object-cover" />
              </div>
            )}

            <div className="flex-1 min-w-0">
              <span className="text-sm font-medium text-white truncate block">{coin.name}</span>
              <span className="text-[10px] text-gray-600 uppercase">{coin.symbol}</span>
            </div>

            <div className="text-right">
              <p className="text-xs font-mono text-gray-300">{price}</p>
              {change !== 0 && (
                <div className={cn('flex items-center justify-end gap-0.5 text-[10px] font-semibold', positive ? 'text-green-400' : 'text-red-400')}>
                  {positive ? <TrendingUp size={9} /> : <TrendingDown size={9} />}
                  {formatPercent(change)}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
