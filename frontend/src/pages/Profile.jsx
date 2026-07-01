import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, School, MapPin, Lock, Save, CheckCircle, AlertCircle, Shield } from 'lucide-react';

const ROLE_STYLES = {
  admin: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  seller: 'bg-primary-500/10 text-primary-600 border-primary-500/20',
  buyer: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
};

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({
    username: user?.username || '',
    email: user?.email || '',
    collegeName: user?.collegeName || '',
    location: user?.location || '',
    password: '',
    confirmPassword: '',
  });
  const [status, setStatus] = useState({ type: '', msg: '' });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: '', msg: '' });
    if (form.password && form.password !== form.confirmPassword) {
      setStatus({ type: 'error', msg: 'Passwords do not match' }); return;
    }
    setSaving(true);
    const payload = { ...form };
    if (!payload.password) { delete payload.password; delete payload.confirmPassword; }
    const res = await updateProfile(payload);
    setSaving(false);
    if (res.success) setStatus({ type: 'success', msg: 'Profile updated successfully!' });
    else setStatus({ type: 'error', msg: res.message });
  };

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 md:px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-widest text-primary-500 mb-1">Account</p>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">My Profile</h1>
      </div>

      {/* Avatar Card */}
      <div className="glass-card rounded-3xl p-6 border border-slate-200/50 dark:border-slate-800/30 mb-6 flex items-center gap-5">
        <div className="relative">
          <img src={user.profileImage} alt={user.username}
            className="w-20 h-20 rounded-2xl object-cover border-2 border-primary-500/20" />
          <div className="absolute -bottom-2 -right-2 w-7 h-7 rounded-xl bg-primary-600 flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
        </div>
        <div>
          <h2 className="font-extrabold text-xl text-slate-900 dark:text-white">{user.username}</h2>
          <p className="text-sm text-slate-500">{user.email}</p>
          <span className={`inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-lg text-xs font-bold border ${ROLE_STYLES[user.role]}`}>
            <Shield className="w-3 h-3" /> {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
          </span>
        </div>
      </div>

      {/* Status Alert */}
      {status.msg && (
        <div className={`flex items-center gap-2 p-4 rounded-2xl border text-sm font-semibold mb-6 ${
          status.type === 'success'
            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
            : 'bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400'}`}>
          {status.type === 'success' ? <CheckCircle className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
          {status.msg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Profile Info */}
        <div className="glass-card rounded-3xl p-6 border border-slate-200/50 dark:border-slate-800/30 space-y-4">
          <h3 className="font-extrabold text-xs text-slate-400 uppercase tracking-widest">Personal Information</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { name: 'username', label: 'Username', icon: <User className="w-4 h-4" />, placeholder: 'username' },
              { name: 'email', label: 'Email', icon: <Mail className="w-4 h-4" />, placeholder: 'email@college.edu' },
              { name: 'collegeName', label: 'College Name', icon: <School className="w-4 h-4" />, placeholder: 'IIT Delhi' },
              { name: 'location', label: 'Location', icon: <MapPin className="w-4 h-4" />, placeholder: 'Block C, Gate 2' },
            ].map(f => (
              <div key={f.name}>
                <label className="label-style">{f.label}</label>
                <div className="relative mt-1.5">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">{f.icon}</span>
                  <input type="text" name={f.name} placeholder={f.placeholder}
                    value={form[f.name]} onChange={handleChange}
                    className="glass-input w-full pl-9 text-sm" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Password */}
        <div className="glass-card rounded-3xl p-6 border border-slate-200/50 dark:border-slate-800/30 space-y-4">
          <h3 className="font-extrabold text-xs text-slate-400 uppercase tracking-widest">Change Password</h3>
          <p className="text-xs text-slate-400">Leave blank to keep your current password.</p>
          <div className="grid grid-cols-2 gap-4">
            {[
              { name: 'password', label: 'New Password', placeholder: 'Min 6 chars' },
              { name: 'confirmPassword', label: 'Confirm Password', placeholder: 'Repeat new password' },
            ].map(f => (
              <div key={f.name}>
                <label className="label-style">{f.label}</label>
                <div className="relative mt-1.5">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400"><Lock className="w-4 h-4" /></span>
                  <input type="password" name={f.name} placeholder={f.placeholder}
                    value={form[f.name]} onChange={handleChange}
                    className="glass-input w-full pl-9 text-sm" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <button type="submit" disabled={saving}
          className="btn-primary w-full py-3 font-bold shadow-lg shadow-primary-500/25">
          <Save className="w-4 h-4" />
          {saving ? 'Saving Changes…' : 'Save Profile'}
        </button>
      </form>
    </div>
  );
};

export default Profile;
