'use client';

import { type ReactNode } from 'react';
import dynamic from 'next/dynamic';
import { SectionBoundary } from '@/components/ErrorBoundary';
import { ToastProvider } from '@/components/ui/Toast';

// Lazy load topbar + sidebar so they don't block initial paint
const Topbar = dynamic(() => import('@/components/layout/Topbar'), { ssr: false });
const Sidebar = dynamic(() => import('@/components/layout/Sidebar'), { ssr: false });

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      {/* Scan line effect */}
      <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
        <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/15 to-transparent animate-scan" />
      </div>

      <div
        className="grid h-screen overflow-hidden"
        style={{
          gridTemplateRows: '58px 1fr',
          gridTemplateColumns: '220px 1fr',
        }}
      >
        {/* Topbar spans both columns */}
        <div className="col-span-2">
          <SectionBoundary context="topbar">
            <Topbar />
          </SectionBoundary>
        </div>

        {/* Sidebar */}
        <div className="overflow-y-auto">
          <SectionBoundary context="sidebar">
            <Sidebar />
          </SectionBoundary>
        </div>

        {/* Main content area */}
        <main className="overflow-y-auto overflow-x-hidden bg-bg relative">
          {/* Ambient glow */}
          <div className="pointer-events-none fixed right-0 top-[58px] h-72 w-1/2 bg-gradient-radial from-accent2/5 to-transparent" />

          <div className="relative z-10">
            {children}
          </div>
        </main>
      </div>
    </ToastProvider>
  );
}
