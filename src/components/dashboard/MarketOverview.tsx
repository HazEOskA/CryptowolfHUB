// CryptoWolf OS — Market Overview Widget

import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { CoinMarket } from '../../lib/api/coingecko';
import { formatUSD, formatPercent, formatNumber } from '../../lib/formatters';
import { cn } from '../../utils/cn';

interface MarketOverviewProps {
  markets: CoinMarket[];
  loading: boolean;
}

function SparkLine({ prices, positive }: { prices: number[]; positive: boolean }) {
  const data = prices.slice(-30).map((p, i) => ({ v: p, i }));
  return (
    <ResponsiveContainer width={80} height={32}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id={`g${positive ? 'p' : 'n'}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={positive ? '#10B981' : '#EF4444'} stopOpacity={0.3} />
            <stop offset="95%" stopColor={positive ? '#10B981' : '#EF4444'} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="v"
          stroke={positive ? '#10B981' : '#EF4444'}
          strokeWidth={1.5}
          fill={`url(#g${positive ? 'p' : 'n'})`}
          dot={false}
        />
        <Tooltip content={() => null} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function MarketOverview({ markets, loading }: MarketOverviewProps) {
  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-[#0D0E14] border border-[#1A1D2B] animate-pulse">
            <div className="w-8 h-8 rounded-full bg-white/5" />
            <div className="flex-1 space-y-1.5">
              <div className="h-3 bg-white/5 rounded w-20" />
              <div className="h-3 bg-white/5 rounded w-12" />
            </div>
            <div className="h-4 bg-white/5 rounded w-24" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {markets.slice(0, 10).map((coin, idx) => {
        const positive = coin.price_change_percentage_24h >= 0;
        const sparkPrices = coin.sparkline_in_7d?.price ?? [];

        return (
          <div
            key={coin.id}
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.03] transition-colors border border-transparent hover:border-[#1A1D2B] cursor-pointer group"
          >
            {/* Rank */}
            <span className="text-xs text-gray-700 w-4 text-right font-mono flex-shrink-0">{idx + 1}</span>

            {/* Logo */}
            <div className="w-7 h-7 rounded-full overflow-hidden bg-[#1A1D2B] flex-shrink-0">
              <img src={coin.image} alt={coin.name} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            </div>

            {/* Name */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{coin.name}</p>
              <p className="text-xs text-gray-600 uppercase">{coin.symbol}</p>
            </div>

            {/* Sparkline */}
            {sparkPrices.length > 0 && (
              <div className="hidden lg:block flex-shrink-0">
                <SparkLine prices={sparkPrices} positive={positive} />
              </div>
            )}

            {/* Volume */}
            <div className="hidden md:block text-right flex-shrink-0 w-20">
              <p className="text-xs text-gray-500">{formatNumber(coin.total_volume, true)}</p>
            </div>

            {/* Price */}
            <div className="text-right flex-shrink-0 w-24">
              <p className="text-sm font-semibold text-white tabular-nums">{formatUSD(coin.current_price)}</p>
              <div className={cn('flex items-center justify-end gap-0.5 text-xs font-medium', positive ? 'text-green-400' : 'text-red-400')}>
                {positive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                {formatPercent(coin.price_change_percentage_24h)}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
