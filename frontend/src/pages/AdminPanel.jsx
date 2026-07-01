import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { Link } from 'react-router-dom';
import {
  ShieldAlert, Trash2, AlertTriangle, Users, Gavel,
  RefreshCw, Search, CheckCircle, XCircle
} from 'lucide-react';

const RiskTag = ({ level }) => {
  const cfg = { Low: 'text-emerald-500 bg-emerald-500/10', Medium: 'text-amber-500 bg-amber-500/10', High: 'text-rose-500 bg-rose-500/10 animate-pulse' };
  return <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${cfg[level]}`}>{level}</span>;
};

const AdminPanel = () => {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const [confirming, setConfirming] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/auctions?status=active');
      setAuctions(data);
    } catch (_) {}
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    setConfirming(true);
    try {
      await API.delete(`/auctions/${id}`);
      setAuctions(prev => prev.filter(a => a._id !== id));
    } catch (_) {}
    setConfirming(false);
    setDeleteId(null);
  };

  const filtered = auctions.filter(a =>
    a.title.toLowerCase().includes(search.toLowerCase()) ||
    a.seller?.username?.toLowerCase().includes(search.toLowerCase())
  );

  const highRisk = auctions.filter(a => a.aiFraudRisk?.riskLevel === 'High').length;
  const medRisk = auctions.filter(a => a.aiFraudRisk?.riskLevel === 'Medium').length;

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-widest text-amber-500 mb-1">System Control</p>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
          <ShieldAlert className="w-8 h-8 text-amber-500" /> Admin Panel
        </h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Listings', value: auctions.length, color: 'from-primary-500 to-violet-600', icon: <Gavel className="w-5 h-5" /> },
          { label: 'High Risk', value: highRisk, color: 'from-rose-500 to-red-600', icon: <AlertTriangle className="w-5 h-5" /> },
          { label: 'Medium Risk', value: medRisk, color: 'from-amber-500 to-orange-600', icon: <AlertTriangle className="w-5 h-5" /> },
          { label: 'Safe Listings', value: auctions.length - highRisk - medRisk, color: 'from-emerald-500 to-teal-600', icon: <CheckCircle className="w-5 h-5" /> },
        ].map((s, i) => (
          <div key={i} className="glass-card rounded-2xl p-5 border border-slate-200/50 dark:border-slate-800/30 flex items-center gap-3">
            <div className={`p-2.5 rounded-xl bg-gradient-to-br ${s.color} text-white shadow-md`}>{s.icon}</div>
            <div>
              <p className="text-2xl font-black text-slate-900 dark:text-white">{s.value}</p>
              <p className="text-xs text-slate-400 font-semibold">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search + Refresh */}
      <div className="flex gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input type="text" placeholder="Search listings or sellers…"
            value={search} onChange={e => setSearch(e.target.value)}
            className="glass-input w-full pl-10 text-sm" />
        </div>
        <button onClick={load} className="btn-secondary border border-slate-200 dark:border-slate-800 text-sm">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Table */}
      <div className="glass-card rounded-3xl border border-slate-200/50 dark:border-slate-800/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800">
                <th className="text-left px-5 py-4 text-xs font-extrabold text-slate-400 uppercase tracking-wide">Item</th>
                <th className="text-left px-4 py-4 text-xs font-extrabold text-slate-400 uppercase tracking-wide">Seller</th>
                <th className="text-left px-4 py-4 text-xs font-extrabold text-slate-400 uppercase tracking-wide">Category</th>
                <th className="text-left px-4 py-4 text-xs font-extrabold text-slate-400 uppercase tracking-wide">Bid</th>
                <th className="text-left px-4 py-4 text-xs font-extrabold text-slate-400 uppercase tracking-wide">AI Risk</th>
                <th className="text-left px-4 py-4 text-xs font-extrabold text-slate-400 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {loading ? (
                <tr><td colSpan={6} className="text-center py-16 text-slate-400">Loading listings…</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-16 text-slate-400">No listings found</td></tr>
              ) : filtered.map(a => (
                <tr key={a._id} className={`hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors ${a.aiFraudRisk?.riskLevel === 'High' ? 'bg-rose-500/5' : ''}`}>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <img src={a.images?.[0]} alt="" className="w-10 h-10 rounded-xl object-cover" />
                      <div>
                        <Link to={`/auctions/${a._id}`}
                          className="font-bold text-slate-800 dark:text-slate-200 hover:text-primary-500 transition-colors text-xs line-clamp-1">
                          {a.title}
                        </Link>
                        <p className="text-[10px] text-slate-400">{new Date(a.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <p className="font-semibold text-xs text-slate-700 dark:text-slate-300">{a.seller?.username}</p>
                    <p className="text-[10px] text-slate-400 truncate max-w-[100px]">{a.collegeName}</p>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-xs font-bold bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">{a.category}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="font-extrabold text-primary-600 dark:text-primary-400">₹{a.currentBid?.toLocaleString()}</span>
                  </td>
                  <td className="px-4 py-4">
                    <RiskTag level={a.aiFraudRisk?.riskLevel || 'Low'} />
                  </td>
                  <td className="px-4 py-4">
                    {deleteId === a._id ? (
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleDelete(a._id)} disabled={confirming}
                          className="text-[10px] font-black text-white bg-rose-500 hover:bg-rose-600 px-2 py-1 rounded-lg transition-colors flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" /> Yes
                        </button>
                        <button onClick={() => setDeleteId(null)}
                          className="text-[10px] font-black text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg transition-colors flex items-center gap-1">
                          <XCircle className="w-3 h-3" /> No
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => setDeleteId(a._id)}
                        className="p-2 rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
