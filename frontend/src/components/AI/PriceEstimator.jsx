import React from 'react';
import { Sparkles, TrendingUp, DollarSign, Calendar } from 'lucide-react';

const PriceEstimator = ({ estimation }) => {
  if (!estimation) return null;

  const { marketValue, recommendedStartingBid, suggestedDurationHours, reasoning } = estimation;

  return (
    <div className="glass-card rounded-2xl p-5 border border-primary-500/20 bg-primary-500/5 dark:bg-primary-950/10">
      <div className="flex items-center gap-1.5 mb-4 border-b border-primary-500/10 pb-3">
        <Sparkles className="w-5 h-5 text-primary-500 fill-primary-500/10" />
        <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Gemini AI Valuation Insight</h4>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        {/* Market Value */}
        <div className="p-3 bg-white dark:bg-slate-900/60 border dark:border-slate-800 rounded-xl text-center">
          <div className="flex justify-center mb-1 text-slate-400">
            <TrendingUp className="w-4 h-4" />
          </div>
          <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">Est. Value</span>
          <span className="text-sm font-black text-slate-900 dark:text-white">
            ₹{marketValue?.toLocaleString() || 'N/A'}
          </span>
        </div>

        {/* Recommended Bid */}
        <div className="p-3 bg-white dark:bg-slate-900/60 border dark:border-slate-800 rounded-xl text-center">
          <div className="flex justify-center mb-1 text-slate-400">
            <DollarSign className="w-4 h-4" />
          </div>
          <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">Rec. Start</span>
          <span className="text-sm font-black text-primary-600 dark:text-primary-400">
            ₹{recommendedStartingBid?.toLocaleString() || 'N/A'}
          </span>
        </div>

        {/* Suggested Duration */}
        <div className="p-3 bg-white dark:bg-slate-900/60 border dark:border-slate-800 rounded-xl text-center">
          <div className="flex justify-center mb-1 text-slate-400">
            <Calendar className="w-4 h-4" />
          </div>
          <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">Rec. Duration</span>
          <span className="text-sm font-black text-slate-900 dark:text-white">
            {suggestedDurationHours ? `${suggestedDurationHours}h` : 'N/A'}
          </span>
        </div>
      </div>

      {/* Valuation Reasoning */}
      {reasoning && (
        <div className="bg-white/40 dark:bg-slate-950/30 p-3 rounded-xl border dark:border-slate-900">
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
            <span className="font-extrabold text-slate-800 dark:text-slate-200">AI Reasoning: </span>
            {reasoning}
          </p>
        </div>
      )}
    </div>
  );
};

export default PriceEstimator;
