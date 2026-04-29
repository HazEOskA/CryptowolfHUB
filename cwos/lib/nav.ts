// lib/nav.ts
// All sidebar routes defined here. Add a route → page auto-appears in nav.
// Remove it here → link disappears. Never hardcode routes elsewhere.

export type NavGroup = 'core' | 'hunt' | 'account';

export interface NavItem {
  label: string;
  href: string;
  icon: string;
  badge?: string | number;
  badgePulse?: boolean;
  group: NavGroup;
  description: string; // used in page metadata
}

export const NAV_ITEMS: NavItem[] = [
  // ── Core ──────────────────────────────────────
  {
    group: 'core',
    label: 'Dashboard',
    href: '/dashboard',
    icon: '⬡',
    description: 'Overview of your Web3 intelligence feed',
  },
  {
    group: 'core',
    label: 'Signals',
    href: '/signals',
    icon: '📡',
    badge: 'NEW',
    badgePulse: true,
    description: 'On-chain signals, whale activity, market momentum',
  },

  // ── Hunt ──────────────────────────────────────
  {
    group: 'hunt',
    label: 'Airdrops',
    href: '/airdrops',
    icon: '🪂',
    badge: 0, // populated at runtime
    description: 'Active and upcoming token airdrop opportunities',
  },
  {
    group: 'hunt',
    label: 'Protocols',
    href: '/protocols',
    icon: '🔗',
    description: 'DeFi protocols ranked by TVL with risk analysis',
  },
  {
    group: 'hunt',
    label: 'Farming',
    href: '/farming',
    icon: '🌾',
    description: 'Yield farming pools with live APY data',
  },

  // ── Account ───────────────────────────────────
  {
    group: 'account',
    label: 'Wallet',
    href: '/wallet',
    icon: '◈',
    description: 'Portfolio intelligence and readiness score',
  },
  {
    group: 'account',
    label: 'Settings',
    href: '/settings',
    icon: '⚙',
    description: 'Configure CryptoWolf OS behaviour',
  },
];

export const NAV_GROUP_LABELS: Record<NavGroup, string> = {
  core: 'Core',
  hunt: 'Hunt',
  account: 'Account',
};

/** Returns the NavItem for a given href, or undefined if not found */
export function getNavItem(href: string): NavItem | undefined {
  return NAV_ITEMS.find((item) => item.href === href);
}

/** All valid hrefs — used for route validation */
export const VALID_ROUTES = new Set(NAV_ITEMS.map((i) => i.href));
