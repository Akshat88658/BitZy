import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, ChevronDown, ChevronUp } from 'lucide-react';

const FraudRiskBadge = ({ fraudRisk }) => {
  const [expanded, setExpanded] = useState(false);

  if (!fraudRisk || !fraudRisk.riskLevel) return null;

  const { riskLevel, reasons } = fraudRisk;

  // Colors mapping
  const riskThemes = {
    Low: {
      card: 'bg-emerald-500/5 border-emerald-500/20 text-emerald-800 dark:text-emerald-300',
      badge: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20',
      icon: <ShieldCheck className="w-5 h-5 text-emerald-500" />
    },
    Medium: {
      card: 'bg-amber-500/5 border-amber-500/20 text-amber-800 dark:text-amber-300',
      badge: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20',
      icon: <ShieldAlert className="w-5 h-5 text-amber-500" />
    },
    High: {
      card: 'bg-rose-500/5 border-rose-500/20 text-rose-800 dark:text-rose-300 animate-pulse',
      badge: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20',
      icon: <ShieldAlert className="w-5 h-5 text-rose-500" />
    }
  };

  const theme = riskThemes[riskLevel] || riskThemes.Low;

  return (
    <div className={`glass-card rounded-2xl p-4 border transition-all ${theme.card}`}>
      <div className="flex items-center justify-between">
        {/* Risk Badge Header */}
        <div className="flex items-center gap-2">
          {theme.icon}
          <div>
            <h5 className="font-extrabold text-xs text-zinc-800 dark:text-slate-100">AI Safety Verification</h5>
            <p className="text-[10px] text-zinc-400 dark:text-slate-400 font-semibold uppercase tracking-wider mt-0.5">Scam Risk Assessment</p>
          </div>
        </div>
        
        {/* Risk Level Badge */}
        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${theme.badge}`}>
          {riskLevel} Risk
        </span>
      </div>

      {/* Flag reasons list */}
      {reasons && reasons.length > 0 && (
        <div className="mt-3 border-t border-zinc-100 dark:border-white/[0.06] pt-3">
          <button 
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 text-[11px] font-bold text-zinc-500 dark:text-slate-400 hover:text-zinc-700 dark:hover:text-slate-200 outline-none transition-colors"
          >
            {expanded ? (
              <>Hide AI Safety Details <ChevronUp className="w-3.5 h-3.5" /></>
            ) : (
              <>Show AI Safety Details <ChevronDown className="w-3.5 h-3.5" /></>
            )}
          </button>

          {expanded && (
            <ul className="mt-2.5 space-y-1.5 text-xs list-disc list-inside text-zinc-600 dark:text-slate-300 leading-relaxed font-medium">
              {reasons.map((reason, i) => (
                <li key={i}>{reason}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default FraudRiskBadge;
