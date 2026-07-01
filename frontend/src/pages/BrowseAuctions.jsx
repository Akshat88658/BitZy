import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../services/api';
import AuctionCard from '../components/Auction/AuctionCard';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import { Search, SlidersHorizontal, X, LayoutGrid, LayoutList, ChevronDown, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const CATEGORIES = ['All', 'Books', 'Laptops', 'Gadgets', 'Cycles', 'Calculators', 'Hostel Items', 'Study Materials', 'Others'];
const CONDITIONS = ['All', 'New', 'Like New', 'Good', 'Fair', 'Poor'];
const SORTS = [
  { value: '', label: 'Newest First' },
  { value: 'ending_soon', label: 'Ending Soon' },
  { value: 'price_asc', label: 'Price: Low → High' },
  { value: 'price_desc', label: 'Price: High → Low' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.4, ease: 'easeOut' } })
};

const BrowseAuctions = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [gridView, setGridView] = useState(true);

  const [filters, setFilters] = useState({
    keyword: searchParams.get('keyword') || '',
    category: searchParams.get('category') || 'All',
    condition: 'All',
    sort: searchParams.get('sort') || '',
  });

  const fetchAuctions = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.keyword) params.set('keyword', filters.keyword);
      if (filters.category !== 'All') params.set('category', filters.category);
      if (filters.condition !== 'All') params.set('condition', filters.condition);
      if (filters.sort) params.set('sort', filters.sort);
      const { data } = await API.get(`/auctions?${params}`);
      setAuctions(data);
    } catch (_) { setAuctions([]); }
    setLoading(false);
  }, [filters]);

  useEffect(() => { fetchAuctions(); }, [fetchAuctions]);

  const resetFilters = () => setFilters({ keyword: '', category: 'All', condition: 'All', sort: '' });

  const activeFilterCount = [
    filters.keyword,
    filters.category !== 'All' ? filters.category : null,
    filters.condition !== 'All' ? filters.condition : null,
    filters.sort,
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#080c14] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-10">

        {/* ── Page Header ── */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <p className="section-label">Marketplace</p>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-primary-500/10 border border-primary-500/20 text-primary-600 dark:text-primary-400 uppercase tracking-wide">
              <Sparkles className="w-2.5 h-2.5" /> AI Verified
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-black text-zinc-950 dark:text-white leading-tight">
            Browse Auctions
          </h1>
          <p className="text-sm text-zinc-500 dark:text-slate-400 mt-1 font-medium">
            {loading ? 'Searching live listings…' : `${auctions.length} active listing${auctions.length !== 1 ? 's' : ''} found`}
          </p>
        </div>

        {/* ── Top Controls ── */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          {/* Search */}
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 dark:text-slate-500 pointer-events-none" />
            <input
              type="text"
              placeholder="Search textbooks, laptops, cycles…"
              value={filters.keyword}
              onChange={e => setFilters({ ...filters, keyword: e.target.value })}
              className="glass-input w-full pl-10 pr-4 text-sm"
            />
          </div>

          {/* Sort */}
          <div className="relative">
            <select
              value={filters.sort}
              onChange={e => setFilters({ ...filters, sort: e.target.value })}
              className="glass-input pr-9 text-sm appearance-none cursor-pointer min-w-[160px]"
            >
              {SORTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 dark:text-slate-500 pointer-events-none" />
          </div>

          {/* Filter Toggle */}
          <button onClick={() => setSidebarOpen(!sidebarOpen)}
            className="btn-secondary text-sm py-2.5 relative">
            <SlidersHorizontal className="w-4 h-4" /> Filters
            {activeFilterCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-primary-500 text-zinc-950 text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-md shadow-primary-500/30">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Grid / List Toggle */}
          <div className="flex rounded-xl overflow-hidden border border-zinc-200 dark:border-white/[0.1]">
            <button onClick={() => setGridView(true)}
              className={`p-2.5 transition-colors ${gridView
                ? 'bg-primary-500 text-zinc-950'
                : 'bg-white dark:bg-white/[0.04] text-zinc-400 dark:text-slate-500 hover:bg-zinc-50 dark:hover:bg-white/[0.07]'}`}>
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button onClick={() => setGridView(false)}
              className={`p-2.5 transition-colors ${!gridView
                ? 'bg-primary-500 text-zinc-950'
                : 'bg-white dark:bg-white/[0.04] text-zinc-400 dark:text-slate-500 hover:bg-zinc-50 dark:hover:bg-white/[0.07]'}`}>
              <LayoutList className="w-4 h-4" />
            </button>
          </div>

          {activeFilterCount > 0 && (
            <button onClick={resetFilters} className="flex items-center gap-1.5 text-xs font-bold text-rose-500 hover:text-rose-400 transition-colors">
              <X className="w-3.5 h-3.5" /> Clear All
            </button>
          )}
        </div>

        <div className="flex gap-6">
          {/* ── SIDEBAR ── */}
          <aside className={`${sidebarOpen ? 'block' : 'hidden'} md:block w-full md:w-56 shrink-0 space-y-4`}>
            {/* Category */}
            <div className="glass-card rounded-2xl p-4 border border-zinc-200/50 dark:border-white/[0.06]">
              <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 dark:text-slate-500 mb-3">Category</h3>
              <div className="space-y-0.5">
                {CATEGORIES.map(cat => (
                  <button key={cat} onClick={() => setFilters({ ...filters, category: cat })}
                    className={`w-full text-left px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
                      filters.category === cat
                        ? 'bg-primary-500 text-zinc-950 shadow-sm shadow-primary-500/20'
                        : 'text-zinc-600 dark:text-slate-300 hover:bg-zinc-100 dark:hover:bg-white/[0.06]'
                    }`}>
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Condition */}
            <div className="glass-card rounded-2xl p-4 border border-zinc-200/50 dark:border-white/[0.06]">
              <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 dark:text-slate-500 mb-3">Condition</h3>
              <div className="space-y-0.5">
                {CONDITIONS.map(cond => (
                  <button key={cond} onClick={() => setFilters({ ...filters, condition: cond })}
                    className={`w-full text-left px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
                      filters.condition === cond
                        ? 'bg-primary-500 text-zinc-950 shadow-sm shadow-primary-500/20'
                        : 'text-zinc-600 dark:text-slate-300 hover:bg-zinc-100 dark:hover:bg-white/[0.06]'
                    }`}>
                    {cond}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* ── LISTING GRID ── */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <LoadingSpinner />
            ) : auctions.length === 0 ? (
              <div className="text-center py-24 glass-card rounded-3xl border border-dashed border-zinc-200 dark:border-white/[0.08]">
                <Search className="w-12 h-12 mx-auto mb-4 text-zinc-300 dark:text-slate-600" />
                <p className="font-bold text-zinc-700 dark:text-slate-300">No auctions match your filters</p>
                <p className="text-sm text-zinc-400 dark:text-slate-500 mt-1">Try adjusting the category or search keyword</p>
                <button onClick={resetFilters} className="btn-primary mt-6 text-sm font-bold">
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className={gridView
                ? 'grid sm:grid-cols-2 xl:grid-cols-3 gap-5'
                : 'flex flex-col gap-4'
              }>
                {auctions.map((a, i) => (
                  <motion.div key={a._id} initial="hidden" whileInView="show" custom={i * 0.06} variants={fadeUp} viewport={{ once: true }}>
                    <AuctionCard auction={a} />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrowseAuctions;
