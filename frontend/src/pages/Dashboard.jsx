import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import AuctionCard from '../components/Auction/AuctionCard';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import CountdownTimer from '../components/Auction/CountdownTimer';
import {
  LayoutDashboard, ListOrdered, Gavel, Trophy, HeartCrack,
  BadgeCheck, Clock, TrendingUp, ChevronRight, PlusCircle
} from 'lucide-react';

const TABS = [
  { id: 'listings', label: 'My Listings', icon: <ListOrdered className="w-4 h-4" /> },
  { id: 'bids', label: 'My Bids', icon: <Gavel className="w-4 h-4" /> },
  { id: 'wins', label: 'Won', icon: <Trophy className="w-4 h-4" /> },
  { id: 'losses', label: 'Lost', icon: <HeartCrack className="w-4 h-4" /> },
];

const StatusBadge = ({ status }) => {
  const cfg = {
    active: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    ended: 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700',
    cancelled: 'bg-rose-500/10 text-rose-600 border-rose-500/20'
  };
  return (
    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md border ${cfg[status] || cfg.ended}`}>
      {status}
    </span>
  );
};

const AuctionRow = ({ auction, showBid = false }) => (
  <Link to={`/auctions/${auction._id}`}
    className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-white/[0.03] border border-zinc-150 dark:border-white/[0.06] hover:border-primary-500/30 dark:hover:border-primary-500/25 transition-all hover:shadow-lg group">
    <img src={auction.images?.[0]} alt={auction.title}
      className="w-16 h-16 rounded-xl object-cover shrink-0 group-hover:scale-105 transition-transform" />
    <div className="flex-1 min-w-0">
      <p className="font-bold text-sm text-zinc-800 dark:text-slate-200 truncate">{auction.title}</p>
      <div className="flex items-center gap-2 mt-1 flex-wrap">
        <StatusBadge status={auction.status} />
        <span className="text-xs text-zinc-400 dark:text-slate-500 font-semibold">{auction.category}</span>
      </div>
      {showBid && auction.highestBidder && (
        <p className="text-xs text-zinc-400 dark:text-slate-500 mt-1">
          Highest Bidder: <span className="font-bold text-primary-500">{auction.highestBidder.username}</span>
        </p>
      )}
    </div>
    <div className="text-right shrink-0">
      <p className="font-extrabold text-primary-500 text-base">₹{auction.currentBid?.toLocaleString()}</p>
      {auction.status === 'active' ? (
        <CountdownTimer endDate={auction.endDate} />
      ) : (
        <span className="text-[10px] text-zinc-400 dark:text-slate-500">
          {new Date(auction.endDate).toLocaleDateString()}
        </span>
      )}
    </div>
    <ChevronRight className="w-4 h-4 text-zinc-300 dark:text-slate-600 group-hover:text-primary-500 transition-colors shrink-0" />
  </Link>
);

const Dashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('listings');
  const [data, setData] = useState({ listings: [], bids: [], wins: [], losses: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      try {
        const [l, b, w, lo] = await Promise.all([
          API.get('/auctions/my/listings'),
          API.get('/auctions/my/bids'),
          API.get('/auctions/my/wins'),
          API.get('/auctions/my/losses'),
        ]);
        setData({ listings: l.data, bids: b.data, wins: w.data, losses: lo.data });
      } catch (_) {}
      setLoading(false);
    };
    loadAll();
  }, []);

  const counts = {
    listings: data.listings.length,
    bids: data.bids.length,
    wins: data.wins.length,
    losses: data.losses.length,
  };

  const current = data[activeTab] || [];

  const STAT_CARDS = [
    { icon: <ListOrdered className="w-5 h-5" />, label: 'Listed', value: counts.listings, color: 'from-violet-500 to-primary-600' },
    { icon: <Gavel className="w-5 h-5" />, label: 'Bids Placed', value: counts.bids, color: 'from-blue-500 to-cyan-600' },
    { icon: <Trophy className="w-5 h-5" />, label: 'Auctions Won', value: counts.wins, color: 'from-amber-500 to-orange-600' },
    { icon: <HeartCrack className="w-5 h-5" />, label: 'Auctions Lost', value: counts.losses, color: 'from-rose-500 to-pink-600' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-10 min-h-screen bg-slate-50 dark:bg-[#080c14] transition-colors duration-300">
      {/* Page Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="section-label">Student Hub</p>
          <h1 className="text-3xl font-display font-black text-zinc-950 dark:text-white flex items-center gap-3">
            <LayoutDashboard className="w-8 h-8 text-primary-500" />
            Dashboard
          </h1>
          <p className="text-sm text-zinc-400 dark:text-slate-400 mt-1">
            Welcome back, <span className="font-bold text-zinc-700 dark:text-slate-200">{user?.username}</span> 👋
          </p>
        </div>
        <Link to="/create-auction" className="btn-primary text-sm shadow-lg shadow-primary-500/15 font-bold">
          <PlusCircle className="w-4 h-4" /> New Listing
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {STAT_CARDS.map((s, i) => (
          <div key={i} className="glass-card rounded-2xl p-5 border border-zinc-200/50 dark:border-white/[0.06] flex items-center gap-3 hover:-translate-y-0.5 transition-transform">
            <div className={`p-2.5 rounded-xl bg-gradient-to-br ${s.color} text-white shadow-md shrink-0`}>
              {s.icon}
            </div>
            <div>
              <p className="text-2xl font-black text-zinc-950 dark:text-white">{s.value}</p>
              <p className="text-xs text-zinc-400 dark:text-slate-400 font-bold uppercase tracking-wide">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1 no-scrollbar">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap border ${
              activeTab === t.id
                ? 'bg-primary-500 text-zinc-950 border-primary-500 shadow-md shadow-primary-500/20'
                : 'bg-white dark:bg-white/[0.04] text-zinc-500 dark:text-slate-400 border-zinc-200 dark:border-white/[0.08] hover:border-primary-500/20 dark:hover:border-primary-500/20 hover:text-primary-500 dark:hover:text-primary-400'
            }`}>
            {t.icon} {t.label}
            <span className={`ml-1 text-[10px] font-black px-1.5 py-0.5 rounded-md ${
              activeTab === t.id
                ? 'bg-zinc-950/20 text-zinc-950'
                : 'bg-zinc-100 dark:bg-white/[0.08] text-zinc-400 dark:text-slate-400'
            }`}>
              {counts[t.id]}
            </span>
          </button>
        ))}
      </div>

      {/* Listings Content */}
      {loading ? (
        <LoadingSpinner />
      ) : current.length === 0 ? (
        <div className="text-center py-20 glass-card rounded-3xl border border-dashed border-zinc-200 dark:border-white/[0.07]">
          <Gavel className="w-12 h-12 mx-auto mb-3 text-zinc-300 dark:text-slate-600" />
          <p className="font-bold text-zinc-600 dark:text-slate-300">
            {activeTab === 'listings' ? "You haven't listed any items yet." : `No ${TABS.find(t=>t.id===activeTab)?.label.toLowerCase()} yet.`}
          </p>
          {activeTab === 'listings' && (
            <Link to="/create-auction" className="btn-primary mt-6 inline-flex text-sm font-bold">
              <PlusCircle className="w-4 h-4" /> Create First Listing
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {current.map(a => (
            <AuctionRow key={a._id} auction={a} showBid={activeTab === 'listings'} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
