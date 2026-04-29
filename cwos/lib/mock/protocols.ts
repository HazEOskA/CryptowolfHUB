import type { Protocol } from '@/lib/types';

export const MOCK_PROTOCOLS: Protocol[] = [
  { id: 'lido', name: 'Lido', chain: 'Ethereum', category: 'Liquid Staking', tvl: 33_400_000_000, tvlChange1d: 0.8, tvlChange7d: 2.1, apy: 4.2, risk: 'low', url: 'https://lido.fi', updatedAt: new Date().toISOString(), source: 'mock' },
  { id: 'aave', name: 'Aave', chain: 'Multi', category: 'Lending', tvl: 13_200_000_000, tvlChange1d: -1.2, tvlChange7d: 3.4, apy: 6.8, risk: 'low', url: 'https://aave.com', updatedAt: new Date().toISOString(), source: 'mock' },
  { id: 'uniswap', name: 'Uniswap', chain: 'Multi', category: 'DEX', tvl: 6_800_000_000, tvlChange1d: 2.1, tvlChange7d: -0.8, risk: 'low', url: 'https://uniswap.org', updatedAt: new Date().toISOString(), source: 'mock' },
  { id: 'jupiter', name: 'Jupiter', chain: 'Solana', category: 'DEX Aggregator', tvl: 2_400_000_000, tvlChange1d: 4.2, tvlChange7d: 12.8, risk: 'low', url: 'https://jup.ag', updatedAt: new Date().toISOString(), source: 'mock' },
  { id: 'raydium', name: 'Raydium', chain: 'Solana', category: 'DEX / AMM', tvl: 890_000_000, tvlChange1d: 5.8, tvlChange7d: 18.4, apy: 24.8, risk: 'medium', url: 'https://raydium.io', updatedAt: new Date().toISOString(), source: 'mock' },
  { id: 'kamino', name: 'Kamino', chain: 'Solana', category: 'Yield', tvl: 620_000_000, tvlChange1d: 3.2, tvlChange7d: 8.9, apy: 18.4, risk: 'low', url: 'https://kamino.finance', updatedAt: new Date().toISOString(), source: 'mock' },
  { id: 'marginfi', name: 'Marginfi', chain: 'Solana', category: 'Lending', tvl: 480_000_000, tvlChange1d: 1.8, tvlChange7d: 5.3, apy: 11.7, risk: 'low', url: 'https://marginfi.com', updatedAt: new Date().toISOString(), source: 'mock' },
  { id: 'drift', name: 'Drift', chain: 'Solana', category: 'Perps', tvl: 310_000_000, tvlChange1d: -2.4, tvlChange7d: 14.2, risk: 'medium', url: 'https://drift.trade', updatedAt: new Date().toISOString(), source: 'mock' },
  { id: 'orca', name: 'Orca', chain: 'Solana', category: 'DEX / CLMM', tvl: 270_000_000, tvlChange1d: 2.8, tvlChange7d: 6.7, apy: 14.2, risk: 'low', url: 'https://orca.so', updatedAt: new Date().toISOString(), source: 'mock' },
  { id: 'marinade', name: 'Marinade', chain: 'Solana', category: 'Liquid Staking', tvl: 900_000_000, tvlChange1d: 0.4, tvlChange7d: 1.8, apy: 8.9, risk: 'low', url: 'https://marinade.finance', updatedAt: new Date().toISOString(), source: 'mock' },
  { id: 'lifinity', name: 'Lifinity', chain: 'Solana', category: 'DEX', tvl: 95_000_000, tvlChange1d: 6.4, tvlChange7d: 22.1, apy: 31.2, risk: 'high', url: 'https://lifinity.io', updatedAt: new Date().toISOString(), source: 'mock' },
  { id: 'eigen', name: 'EigenLayer', chain: 'Ethereum', category: 'Restaking', tvl: 11_800_000_000, tvlChange1d: 3.1, tvlChange7d: 8.6, risk: 'medium', url: 'https://eigenlayer.xyz', updatedAt: new Date().toISOString(), source: 'mock' },
];
