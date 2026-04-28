// CryptoWolf OS — DeFiLlama API Service

import { fetchWithFallback } from '../fetcher';
import { logger } from '../logger';
import { DEFILLAMA_BASE, DEFILLAMA_YIELDS_BASE } from '../constants';

export interface Protocol {
  id: string;
  name: string;
  address: string | null;
  symbol: string;
  url: string;
  description: string;
  chain: string;
  logo: string;
  audits: string | null;
  category: string;
  chains: string[];
  tvl: number;
  change_1h: number | null;
  change_1d: number | null;
  change_7d: number | null;
  mcap: number | null;
  slug: string;
}

export interface YieldPool {
  chain: string;
  project: string;
  symbol: string;
  tvlUsd: number;
  apyBase: number | null;
  apyReward: number | null;
  apy: number;
  apyMean30d: number | null;
  ilRisk: string | null;
  exposure: string | null;
  poolMeta: string | null;
  underlyingTokens: string[];
  rewardTokens: string[] | null;
  pool: string;
  stablecoin: boolean;
  apyBase7d: number | null;
  apyPct1D: number | null;
  apyPct7D: number | null;
  apyPct30D: number | null;
}

export interface Airdrop {
  name: string;
  token: string | null;
  start: number | null;
  end: number | null;
  chain: string;
  link: string;
  description: string | null;
}

export interface Bridge {
  id: number;
  name: string;
  displayName: string;
  chains: string[];
  currentDayVolume?: number;
  lastDayVolume?: number;
  logo?: string;
}

// ---- MOCK DATA ----

const MOCK_PROTOCOLS: Protocol[] = [
  { id: '1', name: 'Lido', address: null, symbol: 'LDO', url: 'https://lido.fi', description: 'Liquid staking for ETH', chain: 'Ethereum', logo: 'https://icons.llama.fi/lido.png', audits: '2', category: 'Liquid Staking', chains: ['Ethereum', 'Solana', 'Polygon'], tvl: 32500000000, change_1h: 0.1, change_1d: 0.8, change_7d: 2.1, mcap: 1800000000, slug: 'lido' },
  { id: '2', name: 'AAVE', address: null, symbol: 'AAVE', url: 'https://aave.com', description: 'Decentralized lending', chain: 'Ethereum', logo: 'https://icons.llama.fi/aave.png', audits: '3', category: 'Lending', chains: ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism'], tvl: 11200000000, change_1h: -0.2, change_1d: 1.2, change_7d: 3.5, mcap: 1400000000, slug: 'aave' },
  { id: '3', name: 'Uniswap', address: null, symbol: 'UNI', url: 'https://uniswap.org', description: 'Decentralized exchange', chain: 'Ethereum', logo: 'https://icons.llama.fi/uniswap.png', audits: '2', category: 'DEX', chains: ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism', 'Base'], tvl: 5800000000, change_1h: 0.4, change_1d: -0.9, change_7d: 1.8, mcap: 3200000000, slug: 'uniswap' },
  { id: '4', name: 'Curve Finance', address: null, symbol: 'CRV', url: 'https://curve.fi', description: 'Stablecoin DEX', chain: 'Ethereum', logo: 'https://icons.llama.fi/curve.png', audits: '2', category: 'DEX', chains: ['Ethereum', 'Polygon', 'Fantom', 'Arbitrum'], tvl: 3200000000, change_1h: -0.1, change_1d: 0.4, change_7d: -1.2, mcap: 410000000, slug: 'curve' },
  { id: '5', name: 'Maker', address: null, symbol: 'MKR', url: 'https://makerdao.com', description: 'DAI stablecoin protocol', chain: 'Ethereum', logo: 'https://icons.llama.fi/maker.png', audits: '3', category: 'CDP', chains: ['Ethereum'], tvl: 8600000000, change_1h: 0.0, change_1d: 0.5, change_7d: 2.4, mcap: 2100000000, slug: 'maker' },
  { id: '6', name: 'JustLend', address: null, symbol: 'JST', url: 'https://justlend.org', description: 'Tron lending protocol', chain: 'Tron', logo: 'https://icons.llama.fi/justlend.png', audits: '1', category: 'Lending', chains: ['Tron'], tvl: 5900000000, change_1h: 0.2, change_1d: -0.3, change_7d: 1.1, mcap: 280000000, slug: 'justlend' },
  { id: '7', name: 'Rocket Pool', address: null, symbol: 'RPL', url: 'https://rocketpool.net', description: 'Decentralized ETH staking', chain: 'Ethereum', logo: 'https://icons.llama.fi/rocket-pool.png', audits: '2', category: 'Liquid Staking', chains: ['Ethereum'], tvl: 3800000000, change_1h: 0.3, change_1d: 1.5, change_7d: 4.2, mcap: 620000000, slug: 'rocket-pool' },
  { id: '8', name: 'GMX', address: null, symbol: 'GMX', url: 'https://gmx.io', description: 'Perpetual DEX', chain: 'Arbitrum', logo: 'https://icons.llama.fi/gmx.png', audits: '2', category: 'Derivatives', chains: ['Arbitrum', 'Avalanche'], tvl: 920000000, change_1h: -0.5, change_1d: 2.1, change_7d: 6.4, mcap: 560000000, slug: 'gmx' },
  { id: '9', name: 'Pancakeswap', address: null, symbol: 'CAKE', url: 'https://pancakeswap.finance', description: 'BSC DEX', chain: 'BSC', logo: 'https://icons.llama.fi/pancakeswap.png', audits: '2', category: 'DEX', chains: ['BSC', 'Ethereum', 'Aptos'], tvl: 1900000000, change_1h: 0.7, change_1d: -1.3, change_7d: 0.9, mcap: 590000000, slug: 'pancakeswap' },
  { id: '10', name: 'Drift Protocol', address: null, symbol: 'DRIFT', url: 'https://drift.trade', description: 'Solana perpetual DEX', chain: 'Solana', logo: 'https://icons.llama.fi/drift.png', audits: '1', category: 'Derivatives', chains: ['Solana'], tvl: 340000000, change_1h: 1.2, change_1d: 5.4, change_7d: 12.7, mcap: 180000000, slug: 'drift' },
];

const MOCK_YIELDS: YieldPool[] = [
  { chain: 'Ethereum', project: 'Lido', symbol: 'stETH', tvlUsd: 32500000000, apyBase: 3.8, apyReward: 0, apy: 3.8, apyMean30d: 3.7, ilRisk: 'no', exposure: 'single', poolMeta: null, underlyingTokens: [], rewardTokens: null, pool: 'lido-eth', stablecoin: false, apyBase7d: 3.75, apyPct1D: 0.1, apyPct7D: 0.2, apyPct30D: -0.3 },
  { chain: 'Ethereum', project: 'AAVE V3', symbol: 'USDC', tvlUsd: 2100000000, apyBase: 7.2, apyReward: 1.5, apy: 8.7, apyMean30d: 8.1, ilRisk: 'no', exposure: 'single', poolMeta: null, underlyingTokens: [], rewardTokens: ['0xaave'], pool: 'aave-usdc-eth', stablecoin: true, apyBase7d: 7.0, apyPct1D: 0.3, apyPct7D: 1.2, apyPct30D: 2.1 },
  { chain: 'Arbitrum', project: 'GMX', symbol: 'GLP', tvlUsd: 480000000, apyBase: 18.4, apyReward: 6.2, apy: 24.6, apyMean30d: 22.1, ilRisk: 'low', exposure: 'multi', poolMeta: null, underlyingTokens: [], rewardTokens: ['0xgmx'], pool: 'gmx-glp', stablecoin: false, apyBase7d: 19.0, apyPct1D: -1.2, apyPct7D: 3.1, apyPct30D: 5.4 },
  { chain: 'Ethereum', project: 'Curve', symbol: '3CRV', tvlUsd: 840000000, apyBase: 2.1, apyReward: 4.3, apy: 6.4, apyMean30d: 5.9, ilRisk: 'no', exposure: 'multi', poolMeta: 'stable', underlyingTokens: [], rewardTokens: ['0xcrv'], pool: 'curve-3pool', stablecoin: true, apyBase7d: 2.0, apyPct1D: 0.1, apyPct7D: 0.5, apyPct30D: 0.8 },
  { chain: 'Solana', project: 'Drift', symbol: 'USDC', tvlUsd: 120000000, apyBase: 11.2, apyReward: 8.5, apy: 19.7, apyMean30d: 18.3, ilRisk: 'no', exposure: 'single', poolMeta: null, underlyingTokens: [], rewardTokens: ['0xdrift'], pool: 'drift-usdc', stablecoin: true, apyBase7d: 10.8, apyPct1D: 1.4, apyPct7D: 4.2, apyPct30D: 9.1 },
  { chain: 'BSC', project: 'Pancakeswap', symbol: 'CAKE-BNB', tvlUsd: 280000000, apyBase: 12.5, apyReward: 22.3, apy: 34.8, apyMean30d: 31.2, ilRisk: 'medium', exposure: 'multi', poolMeta: null, underlyingTokens: [], rewardTokens: ['0xcake'], pool: 'pancake-cake-bnb', stablecoin: false, apyBase7d: 13.2, apyPct1D: -2.1, apyPct7D: 5.6, apyPct30D: 11.2 },
  { chain: 'Polygon', project: 'AAVE V3', symbol: 'WMATIC', tvlUsd: 195000000, apyBase: 4.2, apyReward: 5.8, apy: 10.0, apyMean30d: 9.4, ilRisk: 'no', exposure: 'single', poolMeta: null, underlyingTokens: [], rewardTokens: ['0xmatic'], pool: 'aave-wmatic-poly', stablecoin: false, apyBase7d: 4.0, apyPct1D: 0.2, apyPct7D: 0.8, apyPct30D: 1.5 },
  { chain: 'Optimism', project: 'Velodrome', symbol: 'OP-WETH', tvlUsd: 92000000, apyBase: 24.1, apyReward: 31.5, apy: 55.6, apyMean30d: 48.2, ilRisk: 'medium', exposure: 'multi', poolMeta: null, underlyingTokens: [], rewardTokens: ['0xvelo'], pool: 'velo-op-weth', stablecoin: false, apyBase7d: 26.3, apyPct1D: 2.8, apyPct7D: 9.4, apyPct30D: 18.1 },
];

const MOCK_AIRDROPS: Airdrop[] = [
  { name: 'LayerZero', token: 'ZRO', start: Date.now()/1000 - 86400, end: Date.now()/1000 + 86400*14, chain: 'Multi-chain', link: 'https://layerzero.network', description: 'Cross-chain messaging protocol airdrop. Bridge tokens across chains to qualify.' },
  { name: 'EigenLayer', token: 'EIGEN', start: Date.now()/1000 - 86400*7, end: Date.now()/1000 + 86400*30, chain: 'Ethereum', link: 'https://eigenlayer.xyz', description: 'Restaking protocol. Stake ETH or LSTs to earn EIGEN tokens.' },
  { name: 'zkSync Era', token: 'ZK', start: Date.now()/1000 - 86400*3, end: Date.now()/1000 + 86400*21, chain: 'zkSync', link: 'https://zksync.io', description: 'ZK rollup scaling solution. Use the network to qualify for retroactive rewards.' },
  { name: 'Scroll', token: 'SCR', start: Date.now()/1000 - 86400*10, end: Date.now()/1000 + 86400*7, chain: 'Scroll', link: 'https://scroll.io', description: 'zkEVM Layer 2. Bridge and transact on Scroll mainnet.' },
  { name: 'Blast', token: 'BLAST', start: Date.now()/1000 + 86400*5, end: Date.now()/1000 + 86400*45, chain: 'Blast', link: 'https://blast.io', description: 'Native yield L2. Deposit ETH to earn points and future airdrops.' },
  { name: 'Hyperliquid', token: 'HYPE', start: Date.now()/1000 - 86400*2, end: Date.now()/1000 + 86400*60, chain: 'Hyperliquid', link: 'https://hyperliquid.xyz', description: 'High-performance perpetual DEX. Trade to earn HYPE tokens.' },
  { name: 'Linea', token: 'LINEA', start: Date.now()/1000 + 86400*10, end: null, chain: 'Linea', link: 'https://linea.build', description: 'Consensys zkEVM. Use Linea DApps and bridge for potential airdrop.' },
  { name: 'Movement Labs', token: 'MOVE', start: Date.now()/1000 + 86400*20, end: null, chain: 'Movement', link: 'https://movementlabs.xyz', description: 'Move VM-based L2 on Ethereum. Early adopter rewards expected.' },
];

const MOCK_BRIDGES: Bridge[] = [
  { id: 1, name: 'stargate', displayName: 'Stargate Finance', chains: ['Ethereum', 'BSC', 'Polygon', 'Arbitrum', 'Optimism', 'Avalanche'], currentDayVolume: 89000000, lastDayVolume: 75000000 },
  { id: 2, name: 'across', displayName: 'Across Protocol', chains: ['Ethereum', 'Arbitrum', 'Optimism', 'Base', 'Polygon'], currentDayVolume: 145000000, lastDayVolume: 132000000 },
  { id: 3, name: 'hop', displayName: 'Hop Protocol', chains: ['Ethereum', 'Arbitrum', 'Optimism', 'Polygon', 'Gnosis'], currentDayVolume: 32000000, lastDayVolume: 28000000 },
  { id: 4, name: 'orbiter', displayName: 'Orbiter Finance', chains: ['Ethereum', 'zkSync', 'Scroll', 'Linea', 'Arbitrum'], currentDayVolume: 58000000, lastDayVolume: 51000000 },
  { id: 5, name: 'relay', displayName: 'Relay Bridge', chains: ['Ethereum', 'Base', 'Arbitrum', 'Optimism', 'Zora'], currentDayVolume: 71000000, lastDayVolume: 65000000 },
];

export async function fetchProtocols(limit = 50): Promise<Protocol[]> {
  logger.info('DeFiLlama', `Fetching top ${limit} protocols...`);
  const url = `${DEFILLAMA_BASE}/protocols`;
  const data = await fetchWithFallback<Protocol[]>(url, MOCK_PROTOCOLS, { timeout: 12000 });
  if (Array.isArray(data) && data.length) {
    return data
      .filter(p => p.tvl > 0)
      .sort((a, b) => b.tvl - a.tvl)
      .slice(0, limit);
  }
  return MOCK_PROTOCOLS;
}

export async function fetchYields(limit = 30): Promise<YieldPool[]> {
  logger.info('DeFiLlama', `Fetching top ${limit} yield pools...`);
  const url = `${DEFILLAMA_YIELDS_BASE}/pools`;
  const data = await fetchWithFallback<{ data: YieldPool[] } | null>(url, null, { timeout: 12000 });
  if (data?.data?.length) {
    return data.data
      .filter(p => p.apy > 0 && p.tvlUsd > 1000000)
      .sort((a, b) => b.tvlUsd - a.tvlUsd)
      .slice(0, limit);
  }
  return MOCK_YIELDS;
}

export async function fetchAirdrops(): Promise<Airdrop[]> {
  logger.info('DeFiLlama', 'Fetching airdrops...');
  const url = `${DEFILLAMA_BASE}/airdrops`;
  const data = await fetchWithFallback<Airdrop[] | null>(url, null, { timeout: 10000 });
  if (Array.isArray(data) && data.length) return data;
  return MOCK_AIRDROPS;
}

export async function fetchBridges(): Promise<Bridge[]> {
  logger.info('DeFiLlama', 'Fetching bridges...');
  const url = `${DEFILLAMA_BASE}/bridges`;
  const data = await fetchWithFallback<{ bridges: Bridge[] } | null>(url, null, { timeout: 10000 });
  if (data?.bridges?.length) return data.bridges.slice(0, 15);
  return MOCK_BRIDGES;
}

export async function fetchChainTvl(): Promise<Record<string, number>> {
  logger.info('DeFiLlama', 'Fetching chain TVL...');
  const url = `${DEFILLAMA_BASE}/v2/chains`;
  type ChainEntry = { name: string; tvl: number };
  const data = await fetchWithFallback<ChainEntry[]>(url, [], { timeout: 10000 });
  if (Array.isArray(data) && data.length) {
    return Object.fromEntries(data.map((c) => [c.name, c.tvl]));
  }
  return {
    Ethereum: 58000000000,
    BSC: 7200000000,
    Tron: 8100000000,
    Arbitrum: 18000000000,
    Solana: 4800000000,
    Polygon: 1200000000,
    Optimism: 7400000000,
    Base: 6800000000,
    Avalanche: 1600000000,
    Sui: 1100000000,
  };
}
