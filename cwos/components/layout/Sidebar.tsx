'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';
import { NAV_ITEMS, NAV_GROUP_LABELS, type NavGroup, type NavItem } from '@/lib/nav';
import { useAirdrops } from '@/hooks/useWolfData';

// ── Badge ─────────────────────────────────────────────────────────────────────

function NavBadge({ value, pulse }: { value: string | number; pulse?: boolean }) {
  return (
    <span
      className={clsx(
        'ml-auto min-w-[18px] rounded-full bg-accent2 px-1.5 py-0.5',
        'text-center font-mono text-[9px] font-extrabold text-white',
        pulse && 'animate-badge-pulse'
      )}
    >
      {value}
    </span>
  );
}

// ── Nav Link ──────────────────────────────────────────────────────────────────

function NavLink({ item, liveCount }: { item: NavItem; liveCount?: number }) {
  const pathname = usePathname();

  const isActive =
    pathname === item.href ||
    (item.href === '/dashboard' && pathname === '/');

  // Show live count for airdrops if available
  const badgeValue =
    item.href === '/airdrops' && liveCount !== undefined
      ? liveCount
      : item.badge;

  return (
    <Link
      href={item.href}
      className={clsx(
        'group flex items-center gap-2.5 border-l-2 px-[18px] py-2.5',
        'text-[13px] font-semibold transition-all duration-150 select-none',
        isActive
          ? 'border-accent bg-accent/[0.06] text-accent'
          : 'border-transparent text-wolf-muted hover:bg-white/[0.04] hover:text-wolf-text'
      )}
    >
      <span className="flex h-[18px] w-[18px] shrink-0 items-center justify-center text-[15px]">
        {item.icon}
      </span>
      <span>{item.label}</span>
      {badgeValue !== undefined && badgeValue !== 0 && (
        <NavBadge value={badgeValue} pulse={item.badgePulse} />
      )}
    </Link>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function Sidebar() {
  const { data: airdrops } = useAirdrops();
  const activeAirdropCount = (airdrops ?? []).filter(
    (a) => a.status === 'active' || a.status === 'hot'
  ).length;

  const groups = Object.entries(NAV_GROUP_LABELS) as [NavGroup, string][];

  return (
    <aside className="flex h-full w-[220px] shrink-0 flex-col border-r border-border bg-bg2 relative">
      {/* Subtle gradient edge */}
      <div className="pointer-events-none absolute right-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-accent2/30 to-transparent" />

      <nav className="flex flex-col py-4">
        {groups.map(([groupKey, groupLabel]) => {
          const items = NAV_ITEMS.filter((i) => i.group === groupKey);
          if (!items.length) return null;

          return (
            <div key={groupKey}>
              <p className="mt-2 px-[18px] pb-1.5 pt-2.5 text-[9px] font-bold uppercase tracking-[0.15em] text-wolf-muted2">
                {groupLabel}
              </p>
              {items.map((item) => (
                <NavLink
                  key={item.href}
                  item={item}
                  liveCount={item.href === '/airdrops' ? activeAirdropCount : undefined}
                />
              ))}
            </div>
          );
        })}
      </nav>

      {/* Wallet mini */}
      <div className="mt-auto border-t border-border p-3.5">
        <Link
          href="/wallet"
          className="flex items-center gap-2.5 rounded-lg border border-border bg-card p-2.5 transition-colors hover:border-accent2/60"
        >
          <div className="h-7 w-7 shrink-0 rounded-full bg-gradient-wolf" />
          <div className="min-w-0 flex-1">
            <p className="truncate font-mono text-[10px] text-wolf-muted">0x7f3a…c42d</p>
            <p className="text-xs font-bold text-accent">4.28 SOL</p>
          </div>
        </Link>
      </div>
    </aside>
  );
}
