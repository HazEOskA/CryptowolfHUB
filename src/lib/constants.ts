// CryptoWolf OS — Global Constants

export const APP_NAME = 'CryptoWolf OS';
export const APP_VERSION = '2.0.0';

// API Base URLs
export const COINGECKO_BASE = 'https://api.coingecko.com/api/v3';
export const DEFILLAMA_BASE = 'https://api.llama.fi';
export const DEFILLAMA_YIELDS_BASE = 'https://yields.llama.fi';
export const GECKO_TERMINAL_BASE = 'https://api.geckoterminal.com/api/v2';
export const GITHUB_API_BASE = 'https://api.github.com';

// Refresh intervals (ms)
export const REFRESH_INTERVALS = {
  PRICES: 30_000,        // 30s
  TRENDING: 60_000,      // 1m
  PROTOCOLS: 120_000,    // 2m
  AIRDROPS: 300_000,     // 5m
  FARMING: 180_000,      // 3m
  SIGNALS: 45_000,       // 45s
  GLOBAL: 60_000,        // 1m
};

// Colors
export const WOLF_COLORS = {
  primary: '#7C3AED',
  accent: '#06B6D4',
  green: '#10B981',
  red: '#EF4444',
  yellow: '#F59E0B',
  orange: '#F97316',
  pink: '#EC4899',
  bg: '#0A0B0F',
  surface: '#111318',
  border: '#1E2130',
  muted: '#6B7280',
};

// Nav items
export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard', path: '/' },
  { id: 'airdrops', label: 'Airdrops', icon: 'Gift', path: '/airdrops' },
  { id: 'protocols', label: 'Protocols', icon: 'Network', path: '/protocols' },
  { id: 'farming', label: 'Farming', icon: 'Sprout', path: '/farming' },
  { id: 'wallet', label: 'Wallet', icon: 'Wallet', path: '/wallet' },
  { id: 'signals', label: 'Signals', icon: 'Zap', path: '/signals' },
  { id: 'settings', label: 'Settings', icon: 'Settings', path: '/settings' },
];

// Chain logos/colors map
export const CHAIN_META: Record<string, { color: string; shortName: string }> = {
  ethereum: { color: '#627EEA', shortName: 'ETH' },
  bsc: { color: '#F3BA2F', shortName: 'BSC' },
  polygon: { color: '#8247E5', shortName: 'MATIC' },
  arbitrum: { color: '#28A0F0', shortName: 'ARB' },
  optimism: { color: '#FF0420', shortName: 'OP' },
  avalanche: { color: '#E84142', shortName: 'AVAX' },
  solana: { color: '#9945FF', shortName: 'SOL' },
  base: { color: '#0052FF', shortName: 'BASE' },
  sui: { color: '#4DA2FF', shortName: 'SUI' },
  aptos: { color: '#00C2CB', shortName: 'APT' },
  zksync: { color: '#8C8DFC', shortName: 'ZKS' },
  linea: { color: '#61DFFF', shortName: 'LINEA' },
  scroll: { color: '#FFDBB3', shortName: 'SCR' },
  tron: { color: '#FF0013', shortName: 'TRX' },
  fantom: { color: '#1969FF', shortName: 'FTM' },
};
