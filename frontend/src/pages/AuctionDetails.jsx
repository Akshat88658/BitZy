import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import CountdownTimer from '../components/Auction/CountdownTimer';
import BidHistory from '../components/Auction/BidHistory';
import FraudRiskBadge from '../components/AI/FraudRiskBadge';
import PriceEstimator from '../components/AI/PriceEstimator';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import {
  MapPin, School, User, Trophy, Gavel, AlertCircle,
  ChevronLeft, ChevronRight, Tag, Info, TrendingUp, ImageOff
} from 'lucide-react';

const AuctionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { socket, connected } = useSocket();

  const [auction, setAuction] = useState(null);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bidAmount, setBidAmount] = useState('');
  const [bidError, setBidError] = useState('');
  const [bidSuccess, setBidSuccess] = useState('');
  const [bidLoading, setBidLoading] = useState(false);
  const [imgIdx, setImgIdx] = useState(0);
  const [auctionEnded, setAuctionEnded] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [aRes, bRes] = await Promise.all([
          API.get(`/auctions/${id}`),
          API.get(`/bids/auction/${id}`)
        ]);
        setAuction(aRes.data);
        setBids(bRes.data);
        if (aRes.data.status !== 'active') setAuctionEnded(true);
      } catch { navigate('/browse'); }
      setLoading(false);
    };
    load();
  }, [id]);

  // Join auction room on socket
  useEffect(() => {
    if (socket && connected && id) {
      socket.emit('join_auction', id);
      const handleBidUpdate = (updated) => {
        setAuction(updated);
        setBids(prev => {
          const dummy = { _id: Date.now(), bidder: updated.highestBidder, amount: updated.currentBid, createdAt: new Date() };
          return [dummy, ...prev];
        });
      };
      const handleClosed = () => setAuctionEnded(true);
      socket.on('bid_updated', handleBidUpdate);
      socket.on('auction_closed', handleClosed);
      return () => {
        socket.emit('leave_auction', id);
        socket.off('bid_updated', handleBidUpdate);
        socket.off('auction_closed', handleClosed);
      };
    }
  }, [socket, connected, id]);

  const handleBid = async () => {
    setBidError(''); setBidSuccess('');
    const amt = parseFloat(bidAmount);
    if (!bidAmount || isNaN(amt)) { setBidError('Enter a valid bid amount'); return; }
    const minBid = auction.highestBidder ? auction.currentBid + 1 : auction.startingBid;
    if (amt < minBid) { setBidError(`Minimum bid is ₹${minBid}`); return; }
    setBidLoading(true);
    try {
      await API.post('/bids', { auctionId: id, amount: amt });
      setBidSuccess('🎉 Bid placed! You are the highest bidder.');
      setBidAmount('');
    } catch (err) {
      setBidError(err.response?.data?.message || 'Bid failed. Try again.');
    }
    setBidLoading(false);
  };

  if (loading) return <LoadingSpinner fullScreen />;
  if (!auction) return null;

  const images = auction.images || [];
  const minBid = auction.highestBidder ? auction.currentBid + 1 : auction.startingBid;
  const isSeller = user && auction.seller?._id === user._id;
  const isWinner = auction.highestBidder && auction.highestBidder._id === user?._id;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 bg-slate-50 dark:bg-[#080c14] min-h-screen transition-colors duration-300">
      {/* Breadcrumb */}
      <Link to="/browse" className="inline-flex items-center gap-1.5 text-sm text-zinc-400 dark:text-slate-400 hover:text-primary-500 dark:hover:text-primary-400 mb-6 transition-colors font-medium">
        <ChevronLeft className="w-4 h-4" /> Back to Browse
      </Link>

      <div className="grid lg:grid-cols-5 gap-8">
        {/* ── LEFT: IMAGES + DETAILS ── */}
        <div className="lg:col-span-3 space-y-5">
          {/* Image Gallery */}
          <div className="glass-card rounded-3xl overflow-hidden border border-zinc-200/50 dark:border-white/[0.06]">
            <div className="relative aspect-[4/3] bg-zinc-100 dark:bg-[#0f1829]">
              {images.length > 0 ? (
                <img src={images[imgIdx]} alt={auction.title}
                  className="w-full h-full object-contain" />
              ) : (
                <div className="flex items-center justify-center h-full text-zinc-300 dark:text-slate-600">
                  <ImageOff className="w-16 h-16" />
                </div>
              )}
              {/* Nav Arrows */}
              {images.length > 1 && (
                <>
                  <button onClick={() => setImgIdx(p => (p - 1 + images.length) % images.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-black/30 hover:bg-black/50 text-white backdrop-blur-sm transition-all">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button onClick={() => setImgIdx(p => (p + 1) % images.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-black/30 hover:bg-black/50 text-white backdrop-blur-sm transition-all">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
              {/* Status Overlay */}
              {auctionEnded && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                  <span className="text-2xl font-black text-white bg-zinc-900/90 px-6 py-3 rounded-2xl border border-white/20">
                    Auction Closed
                  </span>
                </div>
              )}
            </div>
            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 p-3 overflow-x-auto">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setImgIdx(i)}
                    className={`shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${i === imgIdx ? 'border-primary-500' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="glass-card rounded-3xl p-6 border border-zinc-200/50 dark:border-white/[0.06]">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="text-xs font-extrabold uppercase bg-primary-500/10 border border-primary-500/20 text-primary-600 dark:text-primary-400 px-2.5 py-1 rounded-lg flex items-center gap-1">
                <Tag className="w-3 h-3" /> {auction.category}
              </span>
              <span className="text-xs font-extrabold uppercase bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded-lg">
                {auction.condition}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-zinc-900 dark:text-white mb-4">{auction.title}</h1>
            <p className="text-sm text-zinc-500 dark:text-slate-300 leading-relaxed mb-6">{auction.description}</p>

            {/* Seller + Location */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2 p-3 rounded-xl bg-zinc-50 dark:bg-white/[0.04] border border-zinc-100 dark:border-white/[0.04]">
                <User className="w-4 h-4 text-zinc-400 dark:text-slate-500 shrink-0" />
                <div>
                  <p className="text-[10px] text-zinc-400 dark:text-slate-500 font-bold uppercase tracking-wide">Seller</p>
                  <p className="font-bold text-zinc-800 dark:text-slate-200">{auction.seller?.username}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-xl bg-zinc-50 dark:bg-white/[0.04] border border-zinc-100 dark:border-white/[0.04]">
                <School className="w-4 h-4 text-zinc-400 dark:text-slate-500 shrink-0" />
                <div>
                  <p className="text-[10px] text-zinc-400 dark:text-slate-500 font-bold uppercase tracking-wide">College</p>
                  <p className="font-bold text-zinc-800 dark:text-slate-200 text-xs leading-tight">{auction.collegeName}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-xl bg-zinc-50 dark:bg-white/[0.04] border border-zinc-100 dark:border-white/[0.04] col-span-2">
                <MapPin className="w-4 h-4 text-zinc-400 dark:text-slate-500 shrink-0" />
                <div>
                  <p className="text-[10px] text-zinc-400 dark:text-slate-500 font-bold uppercase tracking-wide">Pickup Location</p>
                  <p className="font-bold text-zinc-800 dark:text-slate-200">{auction.location}</p>
                </div>
              </div>
            </div>
          </div>

          {/* AI Panels */}
          <PriceEstimator estimation={auction.aiPriceEstimation} />
          <FraudRiskBadge fraudRisk={auction.aiFraudRisk} />
        </div>

        {/* ── RIGHT: BIDDING PANEL ── */}
        <div className="lg:col-span-2 space-y-5">
          {/* Price + Timer */}
          <div className="glass-card rounded-3xl p-6 border border-zinc-200/50 dark:border-white/[0.06] space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 dark:text-slate-400 mb-1">
                  {bids.length > 0 ? 'Current Bid' : 'Starting Bid'}
                </p>
                <p className="text-4xl font-black text-primary-500 dark:text-primary-400">
                  ₹{auction.currentBid.toLocaleString()}
                </p>
                {auction.aiPriceEstimation?.marketValue && (
                  <p className="text-xs text-zinc-400 dark:text-slate-400 mt-1 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    Est. value: ₹{auction.aiPriceEstimation.marketValue.toLocaleString()}
                  </p>
                )}
              </div>
              <CountdownTimer endDate={auction.endDate} onExpire={() => setAuctionEnded(true)} />
            </div>

            {/* Highest Bidder */}
            {auction.highestBidder && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-primary-500/10 border border-primary-500/20">
                <Trophy className="w-4 h-4 text-amber-500 shrink-0" />
                <p className="text-xs font-bold text-zinc-700 dark:text-slate-200">
                  Highest: <span className="text-primary-600 dark:text-primary-400 font-extrabold">{auction.highestBidder.username}</span>
                  {isWinner && <span className="ml-2 text-emerald-500">← That's you! 🎉</span>}
                </p>
              </div>
            )}

            {/* Auction Ended Banner */}
            {auctionEnded ? (
              <div className="p-4 rounded-2xl bg-zinc-100 dark:bg-white/[0.04] border border-zinc-200 dark:border-white/[0.07] text-center">
                <p className="font-extrabold text-zinc-600 dark:text-slate-300 text-sm">Auction has ended</p>
                {isWinner && <p className="text-emerald-500 font-bold mt-1 text-xs">🏆 You won this auction!</p>}
              </div>
            ) : isSeller ? (
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 text-xs font-semibold text-amber-700 dark:text-amber-400 flex items-start gap-2">
                <Info className="w-4 h-4 shrink-0 mt-0.5" /> You cannot bid on your own listing.
              </div>
            ) : !user ? (
              <Link to="/login" className="btn-primary w-full py-3 text-sm font-bold text-center shadow-lg shadow-primary-500/25">
                Login to Place a Bid
              </Link>
            ) : (
              <div className="space-y-3">
                {bidError && (
                  <div className="flex items-start gap-2 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-600 dark:text-rose-400 text-xs font-semibold">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" /> {bidError}
                  </div>
                )}
                {bidSuccess && (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                    {bidSuccess}
                  </div>
                )}
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-400 dark:text-slate-400 font-bold text-sm">₹</span>
                  <input
                    type="number"
                    min={minBid}
                    value={bidAmount}
                    onChange={e => setBidAmount(e.target.value)}
                    placeholder={`Enter ₹${minBid} or more`}
                    className="glass-input w-full pl-8 text-sm"
                  />
                </div>
                <button onClick={handleBid} disabled={bidLoading}
                  className="btn-primary w-full py-3.5 text-sm font-bold shadow-xl shadow-primary-500/25 disabled:opacity-60">
                  <Gavel className="w-4 h-4" />
                  {bidLoading ? 'Placing Bid…' : 'Place Bid'}
                </button>
                <p className="text-[10px] text-zinc-400 dark:text-slate-500 text-center font-medium">
                  Minimum bid: ₹{minBid.toLocaleString()}
                </p>
              </div>
            )}
          </div>

          {/* Bid History */}
          <BidHistory bids={bids} />
        </div>
      </div>
    </div>
  );
};

export default AuctionDetails;
