'use client';

// components/ErrorBoundary.tsx
// Catches render errors in the subtree, logs them, and shows a fallback.
// Wrap sections (not the whole app) so one failure doesn't kill the page.

import React from 'react';
import { logger } from '@/lib/logger';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  context?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    logger.error(
      `React render error${this.props.context ? ` in [${this.props.context}]` : ''}`,
      { error, componentStack: info.componentStack },
      'error-boundary'
    );
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-accent3/30 bg-accent3/5 p-8 text-center">
          <span className="text-2xl">⚠️</span>
          <p className="text-sm font-semibold text-wolf-text">Something went wrong</p>
          <p className="text-xs text-wolf-muted">{this.state.error?.message}</p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="mt-2 rounded-md border border-border px-4 py-1.5 text-xs text-wolf-muted transition-colors hover:border-accent hover:text-accent"
          >
            Retry
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Convenience wrapper for section-level boundaries
export function SectionBoundary({
  children,
  context,
}: {
  children: React.ReactNode;
  context: string;
}) {
  return (
    <ErrorBoundary context={context}>
      {children}
    </ErrorBoundary>
  );
}
