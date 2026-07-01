import React from 'react';
import { User, Calendar } from 'lucide-react';

const BidHistory = ({ bids }) => {
  if (!bids || bids.length === 0) {
    return (
      <div className="text-center py-8 border border-dashed dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-900/10">
        <p className="text-sm text-slate-400">No bids have been placed yet. Be the first to start bidding!</p>
      </div>
    );
  }

  // Format date helper
  const formatDate = (dateString) => {
    const d = new Date(dateString);
    return d.toLocaleString([], {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="glass-card rounded-2xl p-5 border border-slate-200/50 dark:border-slate-800/30">
      <h3 className="font-extrabold text-base mb-4 text-slate-900 dark:text-white flex items-center gap-2">
        Bidding Activity ({bids.length})
      </h3>
      
      <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-1">
        {bids.map((bid, index) => (
          <div 
            key={bid._id || index}
            className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
              index === 0 
                ? 'bg-primary-500/10 border-primary-500/20 dark:bg-primary-500/5 shadow-sm' 
                : 'bg-white/40 dark:bg-slate-900/25 border-slate-200/60 dark:border-slate-800/40'
            }`}
          >
            {/* Bidder name */}
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${index === 0 ? 'bg-primary-500 text-white' : 'bg-slate-100 dark:bg-slate-800'}`}>
                <User className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {bid.bidder?.username || 'Student Bidder'}
                </p>
                <div className="flex items-center gap-1 mt-0.5 text-[10px] text-slate-400">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(bid.createdAt)}</span>
                </div>
              </div>
            </div>

            {/* Bid value */}
            <div className="text-right">
              <span className={`text-base font-extrabold ${index === 0 ? 'text-primary-600 dark:text-primary-400' : 'text-slate-700 dark:text-slate-300'}`}>
                ₹{bid.amount.toLocaleString()}
              </span>
              {index === 0 && (
                <span className="block text-[9px] font-black uppercase text-primary-500 tracking-wide mt-0.5">Highest Bid</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BidHistory;
