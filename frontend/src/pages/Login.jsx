import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Gavel, Mail, Lock, LogIn, AlertCircle, Eye, EyeOff, Sparkles } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const { login, token, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // If user already logged in, redirect them
  const redirectPath = location.state?.from?.pathname || '/dashboard';
  useEffect(() => {
    if (token) {
      navigate(redirectPath, { replace: true });
    }
  }, [token, navigate, redirectPath]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg('Please fill in all fields');
      return;
    }

    const res = await login(email, password);
    if (!res.success) {
      setErrorMsg(res.message);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-primary-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-primary-500/3 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Card */}
        <div className="bg-white dark:bg-zinc-955 rounded-3xl shadow-2xl shadow-zinc-200/20 dark:shadow-black border border-zinc-200/50 dark:border-zinc-900 overflow-hidden">
          
          {/* Top gradient strip */}
          <div className="h-2 bg-gradient-to-r from-zinc-800 via-primary-500 to-zinc-950" />
          
          <div className="p-8">
            {/* Brand Banner */}
            <div className="text-center mb-8">
              <div className="inline-flex p-3 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl text-zinc-955 mb-4 shadow-xl shadow-primary-500/25">
                <Gavel className="w-7 h-7" />
              </div>
              <h1 className="font-display font-black text-3xl text-zinc-955 dark:text-white leading-tight">Welcome Back</h1>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1.5 flex items-center justify-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-primary-500" />
                AI-powered student marketplace
              </p>
            </div>

            {/* Error Alert */}
            {errorMsg && (
              <div className="flex items-center gap-2.5 p-3.5 bg-rose-500/5 border border-rose-500/20 text-rose-500 rounded-2xl text-sm font-semibold mb-6 animate-pulse">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-400 uppercase tracking-wide">
                  College Email
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-450 pointer-events-none">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    id="login-email"
                    type="email"
                    placeholder="student@college.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 text-zinc-900 dark:text-white placeholder:text-zinc-450 dark:placeholder:text-zinc-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all text-sm font-semibold"
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-400 uppercase tracking-wide">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-450 pointer-events-none">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-11 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 text-zinc-900 dark:text-white placeholder:text-zinc-450 dark:placeholder:text-zinc-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all text-sm font-semibold"
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-355 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                id="login-submit"
                type="submit"
                disabled={loading}
                className="w-full py-3.5 mt-2 btn-primary font-bold text-sm shadow-lg shadow-primary-500/10 active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin w-4 h-4 text-zinc-950" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                    </svg>
                    Authenticating...
                  </span>
                ) : (
                  <>
                    <LogIn className="w-4 h-4 text-zinc-955" />
                    Sign In to Bidzy
                  </>
                )}
              </button>
            </form>

            {/* Toggle sign up */}
            <div className="mt-7 pt-6 border-t border-zinc-150 dark:border-zinc-900 text-center">
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                New to Bidzy?{' '}
                <Link to="/register" className="text-primary-500 hover:text-primary-600 font-bold hover:underline transition-colors">
                  Create a free account
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Trust badges */}
        <div className="flex items-center justify-center gap-6 mt-6 text-xs text-zinc-400 dark:text-zinc-555 font-semibold">
          <span className="flex items-center gap-1.5">🔒 SSL Secured</span>
          <span className="flex items-center gap-1.5">🎓 Students Only</span>
          <span className="flex items-center gap-1.5">⚡ Real-Time Bids</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
