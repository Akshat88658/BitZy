import React from 'react';
import { Link } from 'react-router-dom';
import CountdownTimer from './CountdownTimer';
import { MapPin, School, AlertTriangle, TrendingDown, Gavel, Eye } from 'lucide-react';

const AuctionCard = ({ auction }) => {
  const {
    _id,
    title,
    category,
    condition,
    currentBid,
    images,
    endDate,
    collegeName,
    location,
    status,
    aiFraudRisk,
    aiPriceEstimation
  } = auction;

  const firstImage = images && images.length > 0
    ? images[0]
    : 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&q=80';

  const riskConfig = {
    Low: 'bg-emerald-500/15 text-emerald-500 dark:text-emerald-400 border border-emerald-500/25',
    Medium: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/25',
    High: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/25 animate-pulse'
  };

  const conditionColor = {
    'New':      'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    'Like New': 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20',
    'Good':     'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    'Fair':     'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    'Poor':     'bg-slate-500/10 text-slate-500 dark:text-slate-400 border-slate-500/20',
  };

  const isMock = _id?.toString().startsWith('mock');

  return (
    <div className="group glass-card rounded-2xl overflow-hidden flex flex-col h-full border border-zinc-200/50 dark:border-white/[0.06] hover:border-primary-500/40 dark:hover:border-primary-500/30 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary-500/10 transition-all duration-300">

      {/* ── Cover Image ── */}
      <div className="relative aspect-video w-full overflow-hidden bg-zinc-100 dark:bg-[#0f1829]">
        <img
          src={firstImage}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          loading="lazy"
        />

        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Countdown Timer */}
        <div className="absolute top-3 left-3">
          <CountdownTimer endDate={endDate} />
        </div>

        {/* AI Fraud Badge */}
        {aiFraudRisk?.riskLevel && (
          <div className="absolute top-3 right-3">
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wide uppercase shadow-sm backdrop-blur-sm ${riskConfig[aiFraudRisk.riskLevel] || riskConfig.Low}`}>
              {aiFraudRisk.riskLevel === 'High' && <AlertTriangle className="w-3 h-3" />}
              AI: {aiFraudRisk.riskLevel}
            </span>
          </div>
        )}

        {/* Hover CTA overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-bold shadow-xl">
            <Eye className="w-4 h-4" /> View Details
          </span>
        </div>
      </div>

      {/* ── Card Body ── */}
      <div className="p-5 flex flex-col flex-grow">

        {/* Tags Row */}
        <div className="flex gap-2 mb-3 flex-wrap">
          <span className="text-[10px] font-extrabold uppercase bg-zinc-100 dark:bg-white/[0.06] text-zinc-600 dark:text-slate-300 px-2.5 py-1 rounded-md border border-zinc-200 dark:border-white/[0.08]">
            {category}
          </span>
          <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md border ${conditionColor[condition] || conditionColor['Fair']}`}>
            {condition}
          </span>
        </div>

        {/* Title */}
        <h4 className="font-bold text-base text-zinc-950 dark:text-slate-100 line-clamp-2 mb-3 group-hover:text-primary-500 transition-colors leading-snug">
          {title}
        </h4>

        {/* Price Row */}
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-xs text-zinc-500 dark:text-slate-400 font-semibold">Current Bid:</span>
          <span className="text-xl font-black text-primary-500">
            ₹{currentBid?.toLocaleString()}
          </span>
          {aiPriceEstimation?.marketValue && currentBid < aiPriceEstimation.marketValue && (
            <span className="ml-auto text-[10px] text-emerald-500 dark:text-emerald-400 font-bold flex items-center gap-0.5 border border-emerald-500/20 bg-emerald-500/8 px-1.5 py-0.5 rounded-md">
              <TrendingDown className="w-3 h-3" /> Below Market
            </span>
          )}
        </div>

        {/* Spacer */}
        <div className="flex-grow" />

        {/* College + Location */}
        <div className="border-t border-zinc-100 dark:border-white/[0.05] pt-3.5 mt-3 space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-slate-400">
            <School className="w-3.5 h-3.5 text-zinc-400 dark:text-slate-500 shrink-0" />
            <span className="truncate font-semibold">{collegeName}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-slate-400">
            <MapPin className="w-3.5 h-3.5 text-zinc-400 dark:text-slate-500 shrink-0" />
            <span className="truncate font-semibold">{location}</span>
          </div>
        </div>

        {/* CTA Button */}
        {isMock ? (
          <Link to="/browse"
            className="btn-primary w-full text-center py-2.5 text-sm mt-4 font-bold">
            <Gavel className="w-4 h-4" /> Browse Live Bids
          </Link>
        ) : (
          <Link to={`/auctions/${_id}`}
            className="btn-primary w-full text-center py-2.5 text-sm mt-4 font-bold">
            <Gavel className="w-4 h-4" /> Place Bid
          </Link>
        )}
      </div>
    </div>
  );
};

export default AuctionCard;
