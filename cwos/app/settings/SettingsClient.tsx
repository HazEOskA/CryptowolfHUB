'use client';

import { useState } from 'react';
import { SectionHeader } from '@/components/ui';
import { clsx } from 'clsx';
import { logger } from '@/lib/logger';

// ── Primitives ────────────────────────────────────────────────────────────────

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={clsx(
        'relative h-6 w-10 rounded-full transition-colors duration-200',
        checked ? 'bg-accent2' : 'bg-border'
      )}
    >
      <span
        className={clsx(
          'absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-transform duration-200',
          checked ? 'translate-x-5' : 'translate-x-1'
        )}
      />
    </button>
  );
}

function Select({
  value,
  options,
  onChange,
}: {
  value: string;
  options: { label: string; value: string }[];
  onChange: (v: string) => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-md border border-border bg-bg2 px-3 py-1.5 text-[12px] text-wolf-text outline-none focus:border-accent2/60"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

function SettingRow({
  label,
  description,
  children,
}: {
  label: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-white/[0.04] px-5 py-4 last:border-0">
      <div>
        <p className="text-[13px] font-semibold text-wolf-text">{label}</p>
        {description && (
          <p className="mt-0.5 text-[11px] text-wolf-muted">{description}</p>
        )}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function SettingGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <div className="border-b border-border bg-card2 px-5 py-3">
        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-wolf-muted">
          {title}
        </p>
      </div>
      {children}
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function SettingsClient() {
  const [autoRefresh, setAutoRefresh]       = useState(true);
  const [interval, setInterval_]            = useState('20000');
  const [fallbackMock, setFallbackMock]     = useState(true);
  const [airdropAlerts, setAirdropAlerts]   = useState(true);
  const [whaleAlerts, setWhaleAlerts]       = useState(true);
  const [apyAlerts, setApyAlerts]           = useState(false);
  const [scanLine, setScanLine]             = useState(true);
  const [soundAlerts, setSoundAlerts]       = useState(false);
  const [debugLogging, setDebugLogging]     = useState(false);
  const [sentry, setSentry]                 = useState(false);
  const [saved, setSaved]                   = useState(false);

  function handleSave() {
    // In production: persist to localStorage / server
    const config = {
      autoRefresh,
      intervalMs: parseInt(interval, 10),
      fallbackMock,
      airdropAlerts,
      whaleAlerts,
      apyAlerts,
      scanLine,
      soundAlerts,
      debugLogging,
      sentry,
    };
    logger.info('Settings saved', config, 'settings');
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="p-6 animate-fade-in">
      <SectionHeader
        title="System"
        accent="Settings"
        sub="Configure CryptoWolf OS behaviour and data sources"
        action={
          <button
            onClick={handleSave}
            className={clsx(
              'rounded-lg border px-4 py-1.5 text-[12px] font-bold uppercase tracking-wide transition-all',
              saved
                ? 'border-accent/40 bg-accent/10 text-accent'
                : 'border-accent2/40 bg-accent2/10 text-accent2 hover:bg-accent2/20'
            )}
          >
            {saved ? '✓ Saved' : 'Save Settings'}
          </button>
        }
      />

      <div className="flex max-w-2xl flex-col gap-4">

        {/* Data & Refresh */}
        <SettingGroup title="Data & Refresh">
          <SettingRow label="Auto-Refresh" description="Continuously fetch new data in the background">
            <Toggle checked={autoRefresh} onChange={setAutoRefresh} />
          </SettingRow>
          <SettingRow label="Refresh Interval" description="How often to pull fresh data from APIs">
            <Select
              value={interval}
              onChange={setInterval_}
              options={[
                { label: '10 seconds', value: '10000' },
                { label: '20 seconds', value: '20000' },
                { label: '30 seconds', value: '30000' },
                { label: '1 minute',   value: '60000' },
                { label: '5 minutes',  value: '300000' },
              ]}
            />
          </SettingRow>
          <SettingRow
            label="Fallback Mock Data"
            description="Show estimated data when live APIs are unavailable (recommended)"
          >
            <Toggle checked={fallbackMock} onChange={setFallbackMock} />
          </SettingRow>
        </SettingGroup>

        {/* Notifications */}
        <SettingGroup title="Alerts & Notifications">
          <SettingRow label="Airdrop Alerts" description="Notify when new airdrop opportunities are detected">
            <Toggle checked={airdropAlerts} onChange={setAirdropAlerts} />
          </SettingRow>
          <SettingRow label="Whale Alerts" description="Alert on large on-chain movements">
            <Toggle checked={whaleAlerts} onChange={setWhaleAlerts} />
          </SettingRow>
          <SettingRow label="APY Threshold Alert" description="Notify when a pool exceeds your target APY">
            <Toggle checked={apyAlerts} onChange={setApyAlerts} />
          </SettingRow>
          <SettingRow label="Sound Alerts" description="Play audio on critical signals">
            <Toggle checked={soundAlerts} onChange={setSoundAlerts} />
          </SettingRow>
        </SettingGroup>

        {/* Display */}
        <SettingGroup title="Display">
          <SettingRow label="Scan Line Effect" description="Subtle CRT scan line overlay">
            <Toggle checked={scanLine} onChange={setScanLine} />
          </SettingRow>
        </SettingGroup>

        {/* Developer */}
        <SettingGroup title="Developer">
          <SettingRow
            label="Debug Logging"
            description="Output verbose logs to browser console (add ?debug=1 to URL)"
          >
            <Toggle checked={debugLogging} onChange={setDebugLogging} />
          </SettingRow>
          <SettingRow
            label="Sentry Error Reporting"
            description="Send runtime errors to Sentry (requires NEXT_PUBLIC_SENTRY_DSN in .env)"
          >
            <Toggle checked={sentry} onChange={setSentry} />
          </SettingRow>
          <SettingRow label="API Health" description="Check connection to all data sources">
            <a
              href="/api/health"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md border border-border px-3 py-1 text-[11px] font-bold text-wolf-muted transition-colors hover:border-accent hover:text-accent"
            >
              Check ↗
            </a>
          </SettingRow>
        </SettingGroup>

        {/* App info */}
        <div className="rounded-lg border border-border bg-card px-5 py-4">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.15em] text-wolf-muted">App Info</p>
          <div className="flex flex-col gap-1.5 font-mono text-[11px] text-wolf-muted">
            <div className="flex justify-between">
              <span>Version</span>
              <span className="text-wolf-text">{process.env.NEXT_PUBLIC_APP_VERSION ?? '1.0.0'}</span>
            </div>
            <div className="flex justify-between">
              <span>Data Sources</span>
              <span className="text-wolf-text">DeFiLlama · CoinGecko · GitHub</span>
            </div>
            <div className="flex justify-between">
              <span>Framework</span>
              <span className="text-wolf-text">Next.js 14 · App Router</span>
            </div>
            <div className="flex justify-between">
              <span>Environment</span>
              <span className="text-accent">{process.env.NODE_ENV}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
