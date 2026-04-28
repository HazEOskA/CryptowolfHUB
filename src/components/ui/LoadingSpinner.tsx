// CryptoWolf OS — Loading Spinner

import { cn } from '../../utils/cn';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  fullPage?: boolean;
}

export function LoadingSpinner({ size = 'md', text, fullPage }: LoadingSpinnerProps) {
  const sizes = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' };

  const spinner = (
    <div className="flex flex-col items-center gap-3">
      <div className={cn(
        'rounded-full border-2 border-violet-600/30 border-t-violet-500 animate-spin',
        sizes[size]
      )} />
      {text && <p className="text-gray-500 text-sm font-mono">{text}</p>}
    </div>
  );

  if (fullPage) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0A0B0F]">
        <div className="text-center">
          <div className="text-5xl mb-6">🐺</div>
          <div className="flex justify-center mb-4">{spinner}</div>
          <p className="text-violet-400 font-mono text-sm">CryptoWolf OS Loading...</p>
        </div>
      </div>
    );
  }

  return spinner;
}
