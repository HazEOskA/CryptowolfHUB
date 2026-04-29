'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { logger } from '@/lib/logger';

export default function NotFound() {
  const pathname = usePathname();

  useEffect(() => {
    logger.nav.miss(pathname ?? 'unknown');
  }, [pathname]);

  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 p-10 text-center">
      <div className="font-mono text-[72px] font-extrabold leading-none text-border">
        404
      </div>
      <div>
        <h1 className="text-xl font-extrabold text-wolf-text">Page not found</h1>
        <p className="mt-1 text-sm text-wolf-muted">
          <code className="rounded bg-card px-2 py-0.5 font-mono text-accent3">
            {pathname}
          </code>{' '}
          does not exist.
        </p>
      </div>
      <Link
        href="/dashboard"
        className="rounded-lg border border-border bg-card px-5 py-2.5 text-sm font-semibold text-wolf-muted transition-colors hover:border-accent hover:text-accent"
      >
        ← Back to Dashboard
      </Link>
    </div>
  );
}
