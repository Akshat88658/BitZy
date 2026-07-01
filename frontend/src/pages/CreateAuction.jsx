import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import DescriptionGenerator from '../components/AI/DescriptionGenerator';
import PriceEstimator from '../components/AI/PriceEstimator';
import FraudRiskBadge from '../components/AI/FraudRiskBadge';
import {
  Upload, X, Gavel, AlertCircle, Sparkles, TrendingUp,
  ShieldCheck, ChevronDown, Image as ImageIcon, Loader2
} from 'lucide-react';

const CATEGORIES = ['Books', 'Laptops', 'Gadgets', 'Cycles', 'Calculators', 'Hostel Items', 'Study Materials', 'Others'];
const CONDITIONS = ['New', 'Like New', 'Good', 'Fair', 'Poor'];

const CreateAuction = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '', description: '', category: '', condition: '',
    startingBid: '', duration: '', location: user?.location || '',
    collegeName: user?.collegeName || ''
  });
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [aiEstimation, setAiEstimation] = useState(null);
  const [aiFraud, setAiFraud] = useState(null);
  const [aiLoading, setAiLoading] = useState({ price: false, fraud: false });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImages = (e) => {
    const files = Array.from(e.target.files).slice(0, 5 - images.length);
    setImages(prev => [...prev, ...files]);
    const urls = files.map(f => URL.createObjectURL(f));
    setPreviews(prev => [...prev, ...urls]);
  };

  const removeImage = (i) => {
    setImages(prev => prev.filter((_, idx) => idx !== i));
    setPreviews(prev => {
      URL.revokeObjectURL(prev[i]);
      return prev.filter((_, idx) => idx !== i);
    });
  };

  const handleGetEstimate = async () => {
    if (!form.title || !form.category || !form.condition || !form.description) {
      setError('Fill title, category, condition & description first'); return;
    }
    setAiLoading(p => ({ ...p, price: true }));
    try {
      const { data } = await API.post('/ai/estimate-price', form);
      setAiEstimation(data);
      if (data.recommendedStartingBid) setForm(f => ({ ...f, startingBid: data.recommendedStartingBid }));
      if (data.suggestedDurationHours) setForm(f => ({ ...f, duration: data.suggestedDurationHours }));
    } catch (_) {}
    setAiLoading(p => ({ ...p, price: false }));
  };

  const handleFraudCheck = async () => {
    if (!form.title || !form.category || !form.condition || !form.description || !form.startingBid) {
      setError('Fill all main fields first'); return;
    }
    setAiLoading(p => ({ ...p, fraud: true }));
    try {
      const { data } = await API.post('/ai/check-fraud', form);
      setAiFraud(data);
    } catch (_) {}
    setAiLoading(p => ({ ...p, fraud: false }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setError('');
    if (images.length === 0) { setError('Upload at least one product image'); return; }
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    images.forEach(img => fd.append('images', img));
    setSubmitting(true);
    try {
      const { data } = await API.post('/auctions', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      navigate(`/auctions/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create listing. Try again.');
    }
    setSubmitting(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-widest text-primary-500 mb-1">Sell on Bidzy</p>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
          <Gavel className="w-8 h-8 text-primary-500" /> Create Auction
        </h1>
        <p className="text-sm text-slate-400 mt-1">Fill in the details below. Use Gemini AI to auto-fill fields.</p>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-600 dark:text-rose-400 text-sm font-semibold mb-6">
          <AlertCircle className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ── SECTION 1: Basic Info ── */}
        <div className="glass-card rounded-3xl p-6 border border-slate-200/50 dark:border-slate-800/30 space-y-5">
          <h2 className="font-extrabold text-sm text-slate-500 uppercase tracking-wider flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-primary-500 text-white text-xs flex items-center justify-center font-black">1</span>
            Item Details
          </h2>

          <div>
            <label className="label-style">Item Title</label>
            <input name="title" type="text" placeholder="e.g. JEE Advanced 2023 Complete Set"
              value={form.title} onChange={handleChange}
              className="glass-input w-full mt-1.5" required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-style">Category</label>
              <div className="relative mt-1.5">
                <select name="category" value={form.category} onChange={handleChange}
                  className="glass-input w-full appearance-none pr-9" required>
                  <option value="">Select category</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="label-style">Condition</label>
              <div className="relative mt-1.5">
                <select name="condition" value={form.condition} onChange={handleChange}
                  className="glass-input w-full appearance-none pr-9" required>
                  <option value="">Select condition</option>
                  {CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="label-style">Description</label>
              <DescriptionGenerator
                title={form.title}
                condition={form.condition}
                onGenerate={desc => setForm(f => ({ ...f, description: desc }))}
              />
            </div>
            <textarea name="description" rows={4} placeholder="Describe the item condition, includes, usage…"
              value={form.description} onChange={handleChange}
              className="glass-input w-full resize-none" required />
          </div>
        </div>

        {/* ── SECTION 2: Pricing ── */}
        <div className="glass-card rounded-3xl p-6 border border-slate-200/50 dark:border-slate-800/30 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="font-extrabold text-sm text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary-500 text-white text-xs flex items-center justify-center font-black">2</span>
              Pricing & Duration
            </h2>
            <button type="button" onClick={handleGetEstimate} disabled={aiLoading.price}
              className="btn-secondary text-xs py-2 border border-primary-500/20 bg-primary-500/5 hover:bg-primary-500/10 text-primary-600 dark:text-primary-400 flex items-center gap-1.5">
              {aiLoading.price ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <TrendingUp className="w-3.5 h-3.5" />}
              AI Price Estimate
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-style">Starting Bid (₹)</label>
              <div className="relative mt-1.5">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 font-bold text-sm">₹</span>
                <input name="startingBid" type="number" min="0" placeholder="500"
                  value={form.startingBid} onChange={handleChange}
                  className="glass-input w-full pl-8" required />
              </div>
            </div>
            <div>
              <label className="label-style">Duration (hours)</label>
              <input name="duration" type="number" min="1" max="720" placeholder="48"
                value={form.duration} onChange={handleChange}
                className="glass-input w-full mt-1.5" required />
            </div>
          </div>

          {aiEstimation && <PriceEstimator estimation={aiEstimation} />}
        </div>

        {/* ── SECTION 3: Images ── */}
        <div className="glass-card rounded-3xl p-6 border border-slate-200/50 dark:border-slate-800/30 space-y-4">
          <h2 className="font-extrabold text-sm text-slate-500 uppercase tracking-wider flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-primary-500 text-white text-xs flex items-center justify-center font-black">3</span>
            Product Images
            <span className="ml-auto text-[10px] font-bold text-slate-400 normal-case">{images.length}/5 uploaded</span>
          </h2>

          <div className="grid grid-cols-5 gap-3">
            {previews.map((url, i) => (
              <div key={i} className="relative aspect-square rounded-2xl overflow-hidden border-2 border-primary-500/30 group">
                <img src={url} alt="" className="w-full h-full object-cover" />
                <button type="button" onClick={() => removeImage(i)}
                  className="absolute top-1 right-1 p-1 rounded-lg bg-rose-500/90 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            {images.length < 5 && (
              <label className="aspect-square rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-primary-400 dark:hover:border-primary-700 hover:bg-primary-500/5 flex flex-col items-center justify-center cursor-pointer transition-all col-span-1">
                <ImageIcon className="w-6 h-6 text-slate-300 dark:text-slate-700 mb-1" />
                <span className="text-[10px] font-bold text-slate-400">Add Photo</span>
                <input type="file" accept="image/*" multiple onChange={handleImages} className="hidden" />
              </label>
            )}
          </div>
        </div>

        {/* ── SECTION 4: Location ── */}
        <div className="glass-card rounded-3xl p-6 border border-slate-200/50 dark:border-slate-800/30 space-y-4">
          <h2 className="font-extrabold text-sm text-slate-500 uppercase tracking-wider flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-primary-500 text-white text-xs flex items-center justify-center font-black">4</span>
            Pickup Location
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-style">College</label>
              <input name="collegeName" type="text" placeholder="e.g. IIT Delhi"
                value={form.collegeName} onChange={handleChange}
                className="glass-input w-full mt-1.5" required />
            </div>
            <div>
              <label className="label-style">Location / Hostel</label>
              <input name="location" type="text" placeholder="e.g. Block C, Gate 2"
                value={form.location} onChange={handleChange}
                className="glass-input w-full mt-1.5" required />
            </div>
          </div>
        </div>

        {/* ── AI Fraud Check ── */}
        <div className="glass-card rounded-3xl p-6 border border-slate-200/50 dark:border-slate-800/30 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-extrabold text-sm text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary-500 text-white text-xs flex items-center justify-center font-black">5</span>
              AI Safety Check (Optional)
            </h2>
            <button type="button" onClick={handleFraudCheck} disabled={aiLoading.fraud}
              className="btn-secondary text-xs py-2 border border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              {aiLoading.fraud ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5" />}
              Scan My Listing
            </button>
          </div>
          <p className="text-xs text-slate-400">Let Gemini AI scan your listing for unusual patterns before publishing.</p>
          {aiFraud && <FraudRiskBadge fraudRisk={aiFraud} />}
        </div>

        {/* Submit */}
        <button type="submit" disabled={submitting}
          className="btn-primary w-full py-4 text-base font-bold shadow-xl shadow-primary-500/25 disabled:opacity-60">
          {submitting ? (
            <><Loader2 className="w-5 h-5 animate-spin" /> Publishing Auction…</>
          ) : (
            <><Sparkles className="w-5 h-5" /> Publish Auction</>
          )}
        </button>
      </form>
    </div>
  );
};

export default CreateAuction;
