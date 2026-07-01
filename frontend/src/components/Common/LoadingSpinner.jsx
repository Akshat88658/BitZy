import React from 'react';
import { Gavel } from 'lucide-react';

const LoadingSpinner = ({ fullScreen = false }) => {
  const content = (
    <div className="flex flex-col items-center justify-center gap-4 py-16">
      {/* Animated Gavel */}
      <div className="relative">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/25 animate-pulse">
          <Gavel className="w-8 h-8 text-zinc-950" />
        </div>
        {/* Orbit Ring */}
        <div className="absolute inset-0 rounded-2xl border-2 border-primary-500/30 animate-ping" />
      </div>
      <div className="text-center">
        <p className="text-sm font-bold text-zinc-700 dark:text-slate-300 animate-pulse">Loading auctions…</p>
        <p className="text-xs text-zinc-400 dark:text-slate-500 mt-0.5">Fetching live bids</p>
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-slate-50 dark:bg-[#080c14] flex items-center justify-center z-50 transition-colors">
        {content}
      </div>
    );
  }

  return content;
};

export default LoadingSpinner;
