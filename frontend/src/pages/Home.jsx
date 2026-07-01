import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Gavel, TrendingUp, ShieldCheck, Sparkles, ArrowRight,
  BookOpen, Laptop, Bike, Calculator, Home as HomeIcon, Cpu,
  Package, ChevronRight, Zap, Clock, Users, Star, Award,
  BarChart3, Globe2, Lock, Play, CheckCircle
} from 'lucide-react';
import API from '../services/api';
import AuctionCard from '../components/Auction/AuctionCard';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import { useAuth } from '../context/AuthContext';

/* ─── Static Mock Bids shown when no live data ─── */
const MOCK_AUCTIONS = [
  {
    _id: 'mock1',
    title: 'Apple MacBook Pro 14" M3 — Near Mint',
    category: 'Laptops',
    condition: 'Like New',
    currentBid: 87500,
    images: ['/auction_laptop.png'],
    endDate: new Date(Date.now() + 1000 * 60 * 47).toISOString(),
    collegeName: 'IIT Bombay',
    location: 'Powai, Mumbai',
    status: 'active',
    aiFraudRisk: { riskLevel: 'Low' },
    aiPriceEstimation: { marketValue: 110000 },
  },
  {
    _id: 'mock2',
    title: 'Engineering Reference Library (35 Books)',
    category: 'Books',
    condition: 'Good',
    currentBid: 4200,
    images: ['/auction_books.png'],
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 8).toISOString(),
    collegeName: 'NIT Trichy',
    location: 'Tiruchirappalli, TN',
    status: 'active',
    aiFraudRisk: { riskLevel: 'Low' },
    aiPriceEstimation: { marketValue: 6500 },
  },
  {
    _id: 'mock3',
    title: 'Sony WH-1000XM5 Noise Cancelling Headphones',
    category: 'Gadgets',
    condition: 'Like New',
    currentBid: 18900,
    images: ['/auction_gadget.png'],
    endDate: new Date(Date.now() + 1000 * 60 * 23).toISOString(),
    collegeName: 'BITS Pilani',
    location: 'Pilani, Rajasthan',
    status: 'active',
    aiFraudRisk: { riskLevel: 'Medium' },
    aiPriceEstimation: { marketValue: 29990 },
  },
  {
    _id: 'mock4',
    title: 'Trek Mountain Bike 820 — Carbon Frame',
    category: 'Cycles',
    condition: 'Good',
    currentBid: 9750,
    images: ['/auction_cycle.png'],
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 3).toISOString(),
    collegeName: 'VIT Vellore',
    location: 'Vellore, TN',
    status: 'active',
    aiFraudRisk: { riskLevel: 'Low' },
    aiPriceEstimation: { marketValue: 14000 },
  },
  {
    _id: 'mock5',
    title: 'Texas Instruments TI-84 Plus CE Graphing Calculator',
    category: 'Calculators',
    condition: 'New',
    currentBid: 3100,
    images: ['/auction_calculator.png'],
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 11).toISOString(),
    collegeName: 'Delhi Technological University',
    location: 'Rohini, Delhi',
    status: 'active',
    aiFraudRisk: { riskLevel: 'Low' },
    aiPriceEstimation: { marketValue: 4500 },
  },
  {
    _id: 'mock6',
    title: 'iPad Pro 12.9" (M2) + Apple Pencil + Keyboard',
    category: 'Gadgets',
    condition: 'Like New',
    currentBid: 56000,
    images: ['/auction_gadget.png'],
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 5).toISOString(),
    collegeName: 'SRCC Delhi',
    location: 'North Campus, Delhi',
    status: 'active',
    aiFraudRisk: { riskLevel: 'Low' },
    aiPriceEstimation: { marketValue: 85000 },
  },
];

/* ─── Live ticker items ─── */
const TICKER_ITEMS = [
  '🔥 MacBook Pro sold for ₹91,200 · 2 mins ago',
  '🎯 New bid on Sony Headphones: ₹19,500',
  '⚡ IIT Bombay laptop auction ends in 47 mins',
  '🏆 Trek Bike — 14 bids and counting!',
  '🌟 ₹1.2L+ in trades today across 500+ colleges',
  '🤖 AI verified 48 new listings this hour',
  '🔔 NIT Trichy textbook bundle just listed',
  '💰 TI-84 Plus CE bid war — join now!',
];

const CATEGORIES = [
  { name: 'Books', icon: <BookOpen className="w-5 h-5" />, color: 'from-blue-500 to-indigo-600', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
  { name: 'Laptops', icon: <Laptop className="w-5 h-5" />, color: 'from-violet-500 to-purple-700', bg: 'bg-violet-500/10', border: 'border-violet-500/20' },
  { name: 'Gadgets', icon: <Cpu className="w-5 h-5" />, color: 'from-pink-500 to-rose-600', bg: 'bg-pink-500/10', border: 'border-pink-500/20' },
  { name: 'Cycles', icon: <Bike className="w-5 h-5" />, color: 'from-emerald-500 to-teal-600', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  { name: 'Calculators', icon: <Calculator className="w-5 h-5" />, color: 'from-amber-500 to-orange-600', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
  { name: 'Hostel Items', icon: <HomeIcon className="w-5 h-5" />, color: 'from-cyan-500 to-sky-600', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' },
  { name: 'Study Materials', icon: <BookOpen className="w-5 h-5" />, color: 'from-fuchsia-500 to-pink-600', bg: 'bg-fuchsia-500/10', border: 'border-fuchsia-500/20' },
  { name: 'Others', icon: <Package className="w-5 h-5" />, color: 'from-slate-500 to-slate-700', bg: 'bg-slate-500/10', border: 'border-slate-500/20' },
];

const STATS = [
  { value: '50,000+', label: 'Active Students', icon: <Users className="w-5 h-5" />, color: 'text-violet-400' },
  { value: '₹5Cr+', label: 'Trades Completed', icon: <TrendingUp className="w-5 h-5" />, color: 'text-emerald-400' },
  { value: '1,200+', label: 'Colleges Onboard', icon: <Globe2 className="w-5 h-5" />, color: 'text-sky-400' },
  { value: '4.9★', label: 'Platform Rating', icon: <Star className="w-5 h-5" />, color: 'text-amber-400' },
];

const HOW_IT_WORKS = [
  { step: '01', title: 'List Your Item', desc: 'AI auto-generates description, pricing, and fraud checks in seconds.', icon: <Zap className="w-6 h-6" /> },
  { step: '02', title: 'Watch Bids Roll In', desc: 'Real-time bidding with instant push notifications as bids arrive.', icon: <BarChart3 className="w-6 h-6" /> },
  { step: '03', title: 'Trade Safely', desc: 'Campus-verified buyers, AI-scanned listings, zero middlemen.', icon: <Lock className="w-6 h-6" /> },
];

const TESTIMONIALS = [
  { name: 'Priya S.', college: 'IIT Bombay', avatar: 'PS', text: 'Sold my old laptop for ₹12k more than I expected. The AI price suggestion was spot on!', rating: 5 },
  { name: 'Rahul M.', college: 'NIT Trichy', avatar: 'RM', text: 'Bidzy completely replaced the hostel WhatsApp groups. So much safer and easier!', rating: 5 },
  { name: 'Ananya K.', college: 'BITS Pilani', avatar: 'AK', text: 'The fraud scanner saved me from a scammy listing. Absolute game-changer.', rating: 5 },
];

const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.09, duration: 0.55, ease: 'easeOut' } })
};

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await API.get('/auctions?status=active&sort=ending_soon');
        setFeatured(data.slice(0, 6));
      } catch (_) {}
      setLoading(false);
    };
    load();
  }, []);

  const displayAuctions = featured.length > 0 ? featured : MOCK_AUCTIONS;

  return (
    <div className="overflow-x-hidden bg-slate-50 dark:bg-[#080c14] transition-colors duration-300">

      {/* ═══════════════ LIVE TICKER STRIP ═══════════════ */}
      <div className="bg-primary-500/10 dark:bg-primary-500/[0.08] border-b border-primary-500/20 dark:border-primary-500/15 py-2 overflow-hidden">
        <div className="flex whitespace-nowrap ticker-anim">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span key={i} className="inline-flex items-center gap-2 px-8 text-xs font-semibold text-zinc-600 dark:text-slate-300">
              {item}
              <span className="text-primary-500/40 mx-2">•</span>
            </span>
          ))}
        </div>
      </div>

      {/* ═══════════════ HERO SECTION ═══════════════ */}
      <section className="relative min-h-[92vh] flex items-center justify-center mesh-bg overflow-hidden">
        {/* Background Hero Image */}
        <div
          className="absolute inset-0 opacity-[0.08] dark:opacity-[0.18] pointer-events-none"
          style={{ backgroundImage: 'url(/hero_banner.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}
        />

        {/* Hero Grid */}
        <div className="absolute inset-0 hero-grid opacity-0 dark:opacity-100 pointer-events-none" />

        {/* Glowing Orbs */}
        <div className="absolute -top-40 -left-40 w-[700px] h-[700px] glow-orb-gold rounded-full pointer-events-none opacity-60 dark:opacity-100" />
        <div className="absolute -bottom-20 right-0 w-[500px] h-[500px] glow-orb-blue rounded-full pointer-events-none opacity-0 dark:opacity-100" />
        <div className="absolute top-1/2 -right-32 w-[400px] h-[400px] glow-orb-gold rounded-full pointer-events-none opacity-30 dark:opacity-50" />

        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center py-16">
          {/* AI Badge */}
          <motion.div initial="hidden" animate="show" custom={0} variants={fadeUp}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold bg-gradient-to-r from-primary-500/15 to-amber-500/10 border border-primary-500/30 text-primary-600 dark:text-primary-400 mb-8 uppercase tracking-widest shadow-sm">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" /> Powered by Google Gemini AI · Trusted by 50,000+ Students
          </motion.div>

          {/* Headline */}
          <motion.h1 initial="hidden" animate="show" custom={1} variants={fadeUp}
            className="text-5xl md:text-7xl lg:text-8xl font-display font-black tracking-tight text-zinc-950 dark:text-white leading-[1.05] mb-6">
            The Smartest Way
            <span className="block gradient-text mt-2">Students Trade Stuff</span>
          </motion.h1>

          <motion.p initial="hidden" animate="show" custom={2} variants={fadeUp}
            className="text-lg md:text-xl text-zinc-500 dark:text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
            Bid on textbooks, laptops, gadgets &amp; hostel essentials — straight from your campus.
            AI‑verified listings, real‑time bidding, zero middlemen.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div initial="hidden" animate="show" custom={3} variants={fadeUp}
            className="flex flex-wrap items-center justify-center gap-4 mb-16">
            <Link to="/browse"
              className="btn-primary px-10 py-4 text-base font-bold shadow-2xl shadow-primary-500/20 hover:scale-105 transition-transform">
              Browse Live Auctions <ArrowRight className="w-5 h-5" />
            </Link>
            {!user ? (
              <Link to="/register"
                className="btn-secondary px-10 py-4 text-base font-bold hover:scale-105 transition-transform">
                <Play className="w-4 h-4 text-primary-500" /> Start Selling Free
              </Link>
            ) : (
              <Link to="/create-auction"
                className="btn-secondary px-10 py-4 text-base font-bold hover:scale-105 transition-transform">
                <Gavel className="w-4 h-4 text-primary-500" /> List an Item
              </Link>
            )}
          </motion.div>

          {/* Stats Row */}
          <motion.div initial="hidden" animate="show" custom={4} variants={fadeUp}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {STATS.map((s, i) => (
              <div key={i}
                className="glass-card rounded-2xl px-5 py-4 flex flex-col items-center gap-2 border border-zinc-200/50 dark:border-white/[0.06]">
                <span className={s.color}>{s.icon}</span>
                <p className="font-black text-xl text-zinc-950 dark:text-white">{s.value}</p>
                <p className="text-[11px] text-zinc-500 dark:text-slate-400 font-bold uppercase tracking-wider text-center">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Bottom Fade */}
        <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-slate-50 dark:from-[#080c14] to-transparent pointer-events-none" />
      </section>

      {/* ═══════════════ CATEGORIES ═══════════════ */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="section-label">Shop by Category</p>
            <h2 className="section-title">What are you looking for?</h2>
          </div>
          <Link to="/browse" className="hidden md:flex items-center gap-1 text-sm font-bold text-primary-500 hover:text-primary-400 transition-colors">
            View All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {CATEGORIES.map((cat, i) => (
            <motion.div key={cat.name} initial="hidden" whileInView="show" custom={i * 0.4} variants={fadeUp} viewport={{ once: true }}>
              <Link to={`/browse?category=${cat.name}`}
                className={`flex flex-col items-center gap-3 p-4 rounded-2xl ${cat.bg} border ${cat.border} hover:scale-105 hover:shadow-lg transition-all duration-300 group cursor-pointer`}>
                <div className={`p-3 rounded-xl bg-gradient-to-br ${cat.color} text-white group-hover:scale-110 transition-transform shadow-md`}>
                  {cat.icon}
                </div>
                <span className="text-[11px] font-bold text-zinc-700 dark:text-slate-200 text-center leading-tight">{cat.name}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══════════════ AI FEATURE STRIP ═══════════════ */}
      <section className="relative py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-[#0a0f1e] to-[#080c14]" />
        <div className="absolute inset-0 hero-grid opacity-40" />
        <div className="absolute top-0 left-1/4 w-[400px] h-[400px] glow-orb-gold rounded-full pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] glow-orb-blue rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="section-label text-primary-400">AI-Powered</p>
            <h2 className="text-3xl md:text-4xl font-display font-black text-white leading-tight">
              Intelligence Built Into Every Trade
            </h2>
            <p className="text-slate-400 mt-3 max-w-lg mx-auto">Gemini AI works in the background so every listing is verified, priced, and protected.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: <Sparkles className="w-8 h-8 text-primary-400" />,
                title: 'AI Description Writer',
                desc: 'Generate compelling product descriptions instantly. Just upload a photo — Gemini AI writes the rest.',
                badge: 'Gemini Flash',
                gradient: 'from-primary-500/10 to-amber-500/5',
              },
              {
                icon: <TrendingUp className="w-8 h-8 text-emerald-400" />,
                title: 'Smart Price Estimator',
                desc: 'Get real market-accurate valuations and optimal starting bid suggestions based on current demand.',
                badge: 'Real-Time Data',
                gradient: 'from-emerald-500/10 to-teal-500/5',
              },
              {
                icon: <ShieldCheck className="w-8 h-8 text-sky-400" />,
                title: 'Fraud Risk Scanner',
                desc: 'Every listing auto-scanned for 50+ scam indicators. Campus safety, guaranteed.',
                badge: 'Zero Tolerance',
                gradient: 'from-sky-500/10 to-indigo-500/5',
              },
            ].map((f, i) => (
              <motion.div key={i} initial="hidden" whileInView="show" custom={i * 0.2} variants={fadeUp} viewport={{ once: true }}
                className={`glass-card-dark rounded-2xl p-7 bg-gradient-to-br ${f.gradient} border border-white/[0.07] hover:border-primary-500/30 hover:-translate-y-1 transition-all duration-300`}>
                <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.06] inline-block mb-5">
                  {f.icon}
                </div>
                <span className="inline-block text-[10px] font-black uppercase tracking-widest text-primary-400 bg-primary-500/10 border border-primary-500/20 px-2.5 py-1 rounded-full mb-3">
                  {f.badge}
                </span>
                <h3 className="font-display font-bold text-lg text-white mb-2">{f.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ FEATURED AUCTIONS ═══════════════ */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex items-end justify-between mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <p className="section-label">Live Right Now</p>
              <span className="live-badge">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse inline-block" />
                LIVE
              </span>
            </div>
            <h2 className="section-title">Ending Soon 🔥</h2>
            <p className="text-sm text-zinc-500 dark:text-slate-400 mt-1">
              {loading ? 'Loading live bids…' : `${displayAuctions.length} active listings — updated in real-time`}
            </p>
          </div>
          <Link to="/browse" className="hidden md:flex items-center gap-1 text-sm font-bold text-primary-500 hover:text-primary-400 transition-colors">
            All Auctions <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayAuctions.map((auction, i) => (
              <motion.div key={auction._id} initial="hidden" whileInView="show" custom={i * 0.12} variants={fadeUp} viewport={{ once: true }}>
                <AuctionCard auction={auction} />
              </motion.div>
            ))}
          </div>
        )}

        <div className="text-center mt-14">
          <Link to="/browse" className="btn-secondary inline-flex px-10 py-3.5 font-bold border border-zinc-200 dark:border-white/10 hover:scale-105 transition-transform">
            View All Auctions <ArrowRight className="w-4 h-4 text-primary-500" />
          </Link>
        </div>
      </section>

      {/* ═══════════════ HOW IT WORKS ═══════════════ */}
      <section className="bg-gradient-to-br from-zinc-100 to-zinc-50 dark:from-[#0d1220] dark:to-[#080c14] border-y border-zinc-200 dark:border-white/[0.04] py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="section-label">Simple Process</p>
            <h2 className="section-title">How BidZy Works</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-10 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-primary-500/40 to-transparent" />

            {HOW_IT_WORKS.map((step, i) => (
              <motion.div key={i} initial="hidden" whileInView="show" custom={i * 0.2} variants={fadeUp} viewport={{ once: true }}
                className="flex flex-col items-center text-center gap-4 relative">
                <div className="relative">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500/20 to-primary-600/10 border border-primary-500/30 flex items-center justify-center text-primary-500 shadow-lg shadow-primary-500/10">
                    {step.icon}
                  </div>
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary-500 text-zinc-950 text-[10px] font-black flex items-center justify-center">
                    {i + 1}
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-zinc-950 dark:text-white mb-2">{step.title}</h3>
                  <p className="text-sm text-zinc-500 dark:text-slate-400 leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ TESTIMONIALS ═══════════════ */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <p className="section-label">Student Reviews</p>
          <h2 className="section-title">Loved by Campus Communities</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <motion.div key={i} initial="hidden" whileInView="show" custom={i * 0.15} variants={fadeUp} viewport={{ once: true }}
              className="glass-card rounded-2xl p-7 border border-zinc-200/50 dark:border-white/[0.06] hover:-translate-y-1 transition-all duration-300">
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 text-primary-500 fill-primary-500" />
                ))}
              </div>
              <p className="text-sm text-zinc-600 dark:text-slate-300 leading-relaxed mb-6 italic">"{t.text}"</p>
              <div className="flex items-center gap-3 pt-4 border-t border-zinc-100 dark:border-white/[0.05]">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-xs font-black text-zinc-950">
                  {t.avatar}
                </div>
                <div>
                  <p className="font-bold text-sm text-zinc-900 dark:text-white">{t.name}</p>
                  <p className="text-[11px] text-zinc-500 dark:text-slate-400 font-medium">{t.college}</p>
                </div>
                <CheckCircle className="w-4 h-4 text-emerald-500 ml-auto shrink-0" />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══════════════ CTA BANNER ═══════════════ */}
      {!user && (
        <section className="max-w-7xl mx-auto px-6 pb-24">
          <motion.div initial="hidden" whileInView="show" variants={fadeUp} viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden">
            {/* Gradient BG */}
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-[#0d1220] to-[#080c14]" />
            <div className="absolute inset-0 hero-grid opacity-30" />
            <div className="absolute top-0 left-0 w-[400px] h-[400px] glow-orb-gold rounded-full pointer-events-none opacity-60" />
            <div className="absolute bottom-0 right-0 w-[300px] h-[300px] glow-orb-blue rounded-full pointer-events-none" />

            <div className="relative z-10 p-14 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-500/15 border border-primary-500/30 text-primary-400 text-xs font-bold uppercase tracking-widest mb-6">
                <Award className="w-3.5 h-3.5" /> Join the #1 Campus Marketplace
              </div>
              <h2 className="text-4xl md:text-5xl font-display font-black text-white mb-4 leading-tight">
                Ready to Start Trading?
              </h2>
              <p className="text-slate-400 mb-10 max-w-md mx-auto font-medium text-lg">
                Join 50,000+ students buying and selling across 1,200+ campuses. It's completely free.
              </p>
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <Link to="/register"
                  className="btn-primary px-10 py-4 font-bold text-base shadow-2xl shadow-primary-500/20 hover:scale-105 transition-transform">
                  Create Free Account <ArrowRight className="w-5 h-5" />
                </Link>
                <Link to="/browse"
                  className="px-10 py-4 rounded-xl border border-white/20 text-slate-200 hover:bg-white/10 font-bold text-base transition-all hover:scale-105 flex items-center gap-2">
                  Browse First
                </Link>
              </div>
              <p className="text-slate-500 text-xs mt-6 font-medium">No credit card required · Free forever · AI-powered security</p>
            </div>
          </motion.div>
        </section>
      )}
    </div>
  );
};

export default Home;
