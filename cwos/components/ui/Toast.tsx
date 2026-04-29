'use client';

import { createContext, useContext, useCallback, useState, type ReactNode } from 'react';
import { clsx } from 'clsx';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface Toast {
  id: string;
  message: string;
  type: 'info' | 'warn' | 'error' | 'success';
}

interface ToastContextValue {
  push: (message: string, type?: Toast['type']) => void;
}

// ── Context ───────────────────────────────────────────────────────────────────

const ToastContext = createContext<ToastContextValue>({ push: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

// ── Provider ──────────────────────────────────────────────────────────────────

let counter = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const push = useCallback((message: string, type: Toast['type'] = 'info') => {
    const id = String(++counter);
    setToasts((prev) => [...prev.slice(-4), { id, message, type }]); // max 5 visible
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  }, []);

  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      <div className="fixed bottom-5 right-5 z-[999] flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

// ── Toast Item ────────────────────────────────────────────────────────────────

const TOAST_STYLES: Record<Toast['type'], string> = {
  info: 'border-accent2/40 border-l-accent2',
  warn: 'border-accent4/40 border-l-accent4',
  error: 'border-accent3/40 border-l-accent3',
  success: 'border-accent/40 border-l-accent',
};

function ToastItem({ toast }: { toast: Toast }) {
  return (
    <div
      className={clsx(
        'animate-slide-in rounded-lg border border-l-2 bg-card2 px-4 py-2.5',
        'text-sm text-wolf-text shadow-lg backdrop-blur-sm pointer-events-auto',
        'max-w-[280px]',
        TOAST_STYLES[toast.type]
      )}
    >
      {toast.message}
    </div>
  );
}
