// app/layout.tsx
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import SWRProvider from '@/components/SWRProvider';
import AppShell from '@/components/layout/AppShell';
import GlobalHandlers from '@/components/GlobalHandlers';
import './globals.css';

export const metadata: Metadata = {
  title: { default: 'CryptoWolf OS', template: '%s — CryptoWolf OS' },
  description: 'Personal crypto intelligence OS. Real-time airdrops, DeFi protocols, farming signals.',
  themeColor: '#0a0a0f',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="h-screen overflow-hidden bg-bg text-wolf-text">
        {/* Installs window.onerror + unhandledrejection — client-only */}
        <GlobalHandlers />

        <SWRProvider>
          <AppShell>{children}</AppShell>
        </SWRProvider>
      </body>
    </html>
  );
}
