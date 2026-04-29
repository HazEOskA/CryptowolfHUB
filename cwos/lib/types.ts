// lib/types.ts

export type Chain =
  | 'Solana'
  | 'Ethereum'
  | 'Arbitrum'
  | 'Base'
  | 'Optimism'
  | 'BSC'
  | 'Polygon'
  | 'Avalanche'
  | 'Multi'
  | string;

export type RiskLevel = 'low' | 'medium' | 'high';

export type AirdropStatus = 'active' | 'upcoming' | 'ended' | 'hot';

export type DataSource = 'live' | 'mock' | 'cached';

export type SystemStatus = 'operational' | 'degraded' | 'down';

// ── Airdrops ──────────────────────────────────────────────────────────────────

export interface Airdrop {
  id: string;
  name: string;
  project: string;
  chain: Chain;
  status: AirdropStatus;
  emoji: string;
  estimatedValue?: string;
  deadline?: string;
  tasks: string[];
  url?: string;
  updatedAt: string;
  source: DataSource;
}

// ── Protocols ─────────────────────────────────────────────────────────────────

export interface Protocol {
  id: string;
  name: string;
  chain: Chain;
  category: string;
  tvl: number;
  tvlChange1d: number;
  tvlChange7d: number;
  apy?: number;
  risk: RiskLevel;
  url?: string;
  logo?: string;
  updatedAt: string;
  source: DataSource;
}

// ── Farming ───────────────────────────────────────────────────────────────────

export interface FarmingPool {
  id: string;
  protocol: string;
  chain: Chain;
  pair: string;
  apy: number;
  apyBase: number;
  apyReward: number;
  tvlUsd: number;
  risk: RiskLevel;
  riskScore: number; // 0–100
  category: string;
  rewardTokens: string[];
  updatedAt: string;
  source: DataSource;
}

// ── Signals ───────────────────────────────────────────────────────────────────

export type SignalType = 'whale' | 'momentum' | 'growth' | 'alert' | 'social';
export type SignalDirection = 'bullish' | 'bearish' | 'neutral';

export interface SignalEvent {
  label: string;
  value: string;
}

export interface Signal {
  id: string;
  type: SignalType;
  title: string;
  subtitle: string;
  strength: number; // 0–100
  direction: SignalDirection;
  events: SignalEvent[];
  updatedAt: string;
  source: DataSource;
}

// ── Ticker ────────────────────────────────────────────────────────────────────

export interface TickerItem {
  symbol: string;
  price: number;
  change24h: number;
  volume24h?: number;
}

// ── Feed ──────────────────────────────────────────────────────────────────────

export type FeedItemType = 'opportunity' | 'airdrop' | 'alert' | 'farming' | 'protocol';

export interface FeedItem {
  id: string;
  icon: string;
  type: FeedItemType;
  tag: string;
  title: string;
  chain: string;
  timestamp: string;
}

// ── Dashboard ─────────────────────────────────────────────────────────────────

export interface DashboardStats {
  opportunities: number;
  activeAirdrops: number;
  farmingScore: number;
  totalTvl: number;
  systemStatus: SystemStatus;
  dataSource: DataSource;
  lastUpdated: string;
}

// ── Wallet ────────────────────────────────────────────────────────────────────

export interface WalletTransaction {
  id: string;
  type: 'swap' | 'receive' | 'send' | 'stake' | 'unstake';
  description: string;
  amount: string;
  positive: boolean;
  timestamp: string;
}

export interface WalletData {
  address: string;
  solBalance: number;
  usdcBalance: number;
  totalUsd: number;
  pnl30d: number;
  readinessScore: number;
  transactions: WalletTransaction[];
}

// ── API Response wrapper ──────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T;
  source: DataSource;
  timestamp: string;
  error?: string;
  latencyMs?: number;
}

// ── Settings ──────────────────────────────────────────────────────────────────

export interface AppSettings {
  pollIntervalMs: number;
  enableSentry: boolean;
  enableSoundAlerts: boolean;
  enableAirdropAlerts: boolean;
  enableWhaleAlerts: boolean;
  enableScanLine: boolean;
  theme: 'dark';
}
