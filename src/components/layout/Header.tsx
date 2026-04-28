// CryptoWolf OS — Top Header Bar

import { Bell, RefreshCw, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';

interface HeaderProps {
  title: string;
  subtitle?: string;
  onRefresh?: () => void;
  lastUpdated?: number | null;
}

export function Header({ title, subtitle, onRefresh, lastUpdated }: HeaderProps) {
  const [time, setTime] = useState(new Date());
  const [spinning, setSpinning] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const handleRefresh = () => {
    if (onRefresh) {
      setSpinning(true);
      onRefresh();
      setTimeout(() => setSpinning(false), 1000);
    }
  };

  const timeStr = time.toLocaleTimeString('en-US', { hour12: false });
  const dateStr = time.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <header className="sticky top-0 z-30 bg-[#0A0B0F]/90 backdrop-blur-xl border-b border-[#1A1D2B] px-6 py-3">
      <div className="flex items-center justify-between">
        {/* Left */}
        <div>
          <h1 className="text-white font-bold text-xl leading-none">{title}</h1>
          {subtitle && <p className="text-gray-500 text-xs mt-0.5">{subtitle}</p>}
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          {/* Clock */}
          <div className="hidden sm:flex items-center gap-2 bg-[#111318] border border-[#1E2130] rounded-lg px-3 py-1.5">
            <Clock size={12} className="text-violet-400" />
            <span className="text-xs font-mono text-gray-300">{timeStr}</span>
            <span className="text-gray-700">·</span>
            <span className="text-xs text-gray-500">{dateStr}</span>
          </div>

          {/* Last updated */}
          {lastUpdated && (
            <div className="hidden md:flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              <span className="text-xs text-gray-500 font-mono">
                Updated {Math.floor((Date.now() - lastUpdated) / 1000)}s ago
              </span>
            </div>
          )}

          {/* Refresh */}
          {onRefresh && (
            <button
              onClick={handleRefresh}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#111318] hover:bg-[#1A1D2B] border border-[#1E2130] rounded-lg text-gray-500 hover:text-gray-300 transition-colors text-xs"
            >
              <RefreshCw size={12} className={spinning ? 'animate-spin' : ''} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          )}

          {/* Notifications */}
          <button className="relative w-8 h-8 flex items-center justify-center bg-[#111318] hover:bg-[#1A1D2B] border border-[#1E2130] rounded-lg text-gray-500 hover:text-gray-300 transition-colors">
            <Bell size={14} />
            <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-violet-500 rounded-full" />
          </button>
        </div>
      </div>
    </header>
  );
}
