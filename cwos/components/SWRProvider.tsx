'use client';

import { SWRConfig } from 'swr';
import type { ReactNode } from 'react';

const swrConfig = {
  revalidateOnFocus: false,
  shouldRetryOnError: true,
  errorRetryCount: 3,
  errorRetryInterval: 5000,
};

export default function SWRProvider({ children }: { children: ReactNode }) {
  return <SWRConfig value={swrConfig}>{children}</SWRConfig>;
}
