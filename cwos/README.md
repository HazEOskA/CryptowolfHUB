# CryptoWolf OS

Personal crypto intelligence OS — real-time airdrops, DeFi protocols, farming signals.

## Stack

- **Next.js 14** — App Router, TypeScript
- **Tailwind CSS** — dark design system
- **SWR** — polling + caching
- **DeFiLlama** — protocols TVL, yield pools (free, no key)
- **CoinGecko** — price ticker (free tier, 30 req/min)
- **GitHub API** — trending crypto repos (60 req/hr unauthenticated)

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.local.example .env.local
# Fill in optional keys (see .env.local.example)

# 3. Run dev server
npm run dev
# → http://localhost:3000
```

## Optional API keys

All keys are **optional** — the system falls back to curated mock data automatically.

| Key | Purpose | Free tier |
|-----|---------|-----------|
| `COINGECKO_API_KEY` | Higher rate limits for price data | 30 req/min without key |
| `GITHUB_TOKEN` | 5000 req/hr for trending repo signals | 60 req/hr without key |
| `NEXT_PUBLIC_SENTRY_DSN` | Error tracking | Free plan |

## Architecture

```
app/
  dashboard/        ← Overview + live feed
  airdrops/         ← Airdrop scanner (GitHub-enriched)
  protocols/        ← DeFiLlama TVL monitor (sortable/filterable)
  farming/          ← DeFiLlama yields (6000+ pools)
  signals/          ← On-chain intelligence (CoinGecko + GitHub)
  wallet/           ← Portfolio + readiness score
  settings/         ← App configuration
  api/
    airdrops/       ← GET /api/airdrops
    protocols/      ← GET /api/protocols (DeFiLlama)
    farming/        ← GET /api/farming   (DeFiLlama Yields)
    signals/        ← GET /api/signals   (CoinGecko + GitHub)
    ticker/         ← GET /api/ticker    (CoinGecko prices)
    health/         ← GET /api/health

components/
  layout/           ← AppShell, Sidebar, Topbar
  dashboard/        ← StatCard, LiveFeed
  ui/               ← All primitives (Badge, Card, Spinner…)

lib/
  types.ts          ← All TypeScript types
  logger.ts         ← Structured logging + Sentry stub
  fetcher.ts        ← Resilient fetch with timeout + fallback
  nav.ts            ← Route definitions (single source of truth)
  mock/             ← Fallback data for each domain

hooks/
  usePolling.ts     ← Generic SWR polling hook
  useWolfData.ts    ← Domain hooks (useAirdrops, useProtocols…)
```

## Logging

All API failures, navigation errors, and runtime crashes are logged via `lib/logger.ts`.

```
[WolfOS 2024-01-01T12:00:00.000Z] [api] ⚠️  API call failed — using fallback: https://…
[WolfOS 2024-01-01T12:00:00.000Z] [nav] ⚠️  Navigation miss — no page found for route: /unknown
[WolfOS 2024-01-01T12:00:00.000Z] [global] ❌ Uncaught exception: …
```

Enable verbose debug logs by adding `?debug=1` to the URL.

## Adding a new route

1. Add entry to `lib/nav.ts`
2. Create `app/your-route/page.tsx`
3. Done — sidebar updates automatically.
