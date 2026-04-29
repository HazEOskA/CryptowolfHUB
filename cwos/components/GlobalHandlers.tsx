'use client';

import { useEffect } from 'react';
import { installGlobalHandlers } from '@/lib/logger';

// Renders nothing — just installs global error handlers once on mount.
export default function GlobalHandlers() {
  useEffect(() => {
    installGlobalHandlers();
  }, []);
  return null;
}
