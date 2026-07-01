import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useNotifications } from '../../hooks/useNotifications';
import {
  Gavel, Bell, Sun, Moon, Menu, X, User, LogOut,
  PlusCircle, Sparkles, LayoutDashboard, ShieldAlert, ChevronDown
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notiOpen, setNotiOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNotificationClick = async (noti) => {
    setNotiOpen(false);
    await markAsRead(noti._id);
    navigate(`/auctions/${noti.auction._id}`);
  };

  return (
    <nav className="sticky top-0 z-40 backdrop-blur-xl border-b bg-white/85 dark:bg-[#080c14]/90 border-zinc-200/60 dark:border-white/[0.06] py-3.5 px-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex justify-between items-center">

        {/* ── Brand Logo ── */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="p-2 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl text-zinc-950 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary-500/30 transition-all duration-300">
            <Gavel className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-display font-black text-2xl tracking-wide text-zinc-950 dark:text-white flex items-center gap-1.5 leading-none">
              BidZy
              <Sparkles className="w-4 h-4 text-primary-500 animate-pulse fill-primary-500/20" />
            </span>
            <span className="text-[9px] text-zinc-400 dark:text-slate-500 font-bold tracking-widest uppercase mt-0.5">
              AI Campus Auctions
            </span>
          </div>
        </Link>

        {/* ── Desktop Nav Links ── */}
        <div className="hidden md:flex items-center gap-1">
          <Link to="/browse"
            className="px-4 py-2 rounded-xl text-sm font-semibold text-zinc-600 hover:text-primary-500 dark:text-slate-300 dark:hover:text-primary-400 hover:bg-primary-500/8 dark:hover:bg-primary-500/10 transition-all">
            Browse Auctions
          </Link>

          {user && (
            <>
              <Link to="/create-auction"
                className="px-4 py-2 rounded-xl text-sm font-semibold text-zinc-600 hover:text-primary-500 dark:text-slate-300 dark:hover:text-primary-400 hover:bg-primary-500/8 dark:hover:bg-primary-500/10 flex items-center gap-1.5 transition-all">
                <PlusCircle className="w-4 h-4" /> List Item
              </Link>
              <Link to="/dashboard"
                className="px-4 py-2 rounded-xl text-sm font-semibold text-zinc-600 hover:text-primary-500 dark:text-slate-300 dark:hover:text-primary-400 hover:bg-primary-500/8 dark:hover:bg-primary-500/10 flex items-center gap-1.5 transition-all">
                <LayoutDashboard className="w-4 h-4" /> Dashboard
              </Link>
              {user.role === 'admin' && (
                <Link to="/admin"
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 hover:bg-primary-500/8 flex items-center gap-1.5 transition-all">
                  <ShieldAlert className="w-4 h-4" /> Admin
                </Link>
              )}
            </>
          )}
        </div>

        {/* ── Desktop Utility Controls ── */}
        <div className="hidden md:flex items-center gap-2">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-white/[0.06] dark:hover:bg-white/[0.1] text-zinc-600 dark:text-slate-300 transition-all hover:scale-110 focus:outline-none"
            aria-label="Toggle theme"
          >
            {darkMode
              ? <Sun className="w-4.5 h-4.5 text-primary-400" />
              : <Moon className="w-4.5 h-4.5" />
            }
          </button>

          {user ? (
            <>
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => { setNotiOpen(!notiOpen); setProfileOpen(false); }}
                  className="p-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-white/[0.06] dark:hover:bg-white/[0.1] text-zinc-600 dark:text-slate-300 transition-all hover:scale-110 focus:outline-none relative"
                >
                  <Bell className="w-4.5 h-4.5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-rose-500 text-white font-black text-[9px] w-4.5 h-4.5 flex items-center justify-center rounded-full animate-bounce shadow-md shadow-rose-500/40">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {notiOpen && (
                  <div className="absolute right-0 mt-3 w-80 glass-card rounded-2xl p-4 shadow-2xl shadow-black/20 z-50 border border-zinc-200 dark:border-white/[0.08] max-h-[400px] overflow-y-auto">
                    <div className="flex justify-between items-center mb-3 pb-2 border-b border-zinc-100 dark:border-white/[0.05]">
                      <h4 className="font-bold text-sm text-zinc-900 dark:text-white">Notifications</h4>
                      {unreadCount > 0 && (
                        <button onClick={markAllAsRead} className="text-xs text-primary-500 hover:text-primary-400 font-semibold hover:underline">
                          Mark all read
                        </button>
                      )}
                    </div>
                    {notifications.length === 0 ? (
                      <p className="text-xs text-center text-zinc-400 dark:text-slate-500 py-6">No notifications yet</p>
                    ) : (
                      <div className="space-y-2">
                        {notifications.map((noti) => (
                          <div
                            key={noti._id}
                            onClick={() => handleNotificationClick(noti)}
                            className={`p-2.5 rounded-xl text-left cursor-pointer hover:bg-zinc-100 dark:hover:bg-white/[0.05] transition-colors ${!noti.isRead ? 'bg-primary-500/8 border border-primary-500/20' : ''}`}
                          >
                            <p className="text-xs font-semibold leading-relaxed text-zinc-800 dark:text-slate-200">{noti.message}</p>
                            <span className="text-[10px] text-zinc-400 dark:text-slate-500 block mt-1">
                              {new Date(noti.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => { setProfileOpen(!profileOpen); setNotiOpen(false); }}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-white/[0.06] dark:hover:bg-white/[0.1] transition-all focus:outline-none"
                >
                  <img
                    src={user.profileImage}
                    alt={user.username}
                    className="w-7 h-7 rounded-lg object-cover border border-primary-500/30"
                  />
                  <span className="text-xs font-bold text-zinc-800 dark:text-slate-200">{user.username}</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-zinc-400 dark:text-slate-400 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-3 w-52 glass-card rounded-2xl p-2 shadow-2xl shadow-black/20 z-50 border border-zinc-200 dark:border-white/[0.08]">
                    <div className="px-3 py-2 mb-1 border-b border-zinc-100 dark:border-white/[0.05]">
                      <p className="text-xs font-bold text-zinc-900 dark:text-white">{user.username}</p>
                      <p className="text-[11px] text-zinc-400 dark:text-slate-500">{user.email}</p>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2 w-full p-2.5 rounded-xl text-left text-xs font-semibold text-zinc-700 dark:text-slate-300 hover:bg-zinc-100 dark:hover:bg-white/[0.06] transition-colors"
                    >
                      <User className="w-4 h-4" /> My Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full p-2.5 rounded-xl text-left text-xs font-semibold text-rose-500 hover:bg-rose-50/50 dark:hover:bg-rose-950/20 transition-colors"
                    >
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login"
                className="px-4 py-2 text-sm font-bold text-zinc-600 dark:text-slate-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors rounded-xl hover:bg-primary-500/8">
                Login
              </Link>
              <Link to="/register" className="btn-primary py-2 px-5 text-sm font-bold shadow-md shadow-primary-500/20">
                Sign Up Free
              </Link>
            </div>
          )}
        </div>

        {/* ── Mobile Controls ── */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-zinc-100 dark:bg-white/[0.06] text-zinc-600 dark:text-slate-300"
          >
            {darkMode ? <Sun className="w-4.5 h-4.5 text-primary-400" /> : <Moon className="w-4.5 h-4.5" />}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-zinc-100 dark:bg-white/[0.06] text-zinc-600 dark:text-slate-300"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* ── Mobile Drawer ── */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-4 pt-4 border-t border-zinc-200 dark:border-white/[0.06] flex flex-col gap-1 animate-fade-in px-2">
          <Link to="/browse" onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-4 py-3 rounded-xl font-semibold text-zinc-700 dark:text-slate-200 hover:text-primary-500 dark:hover:text-primary-400 hover:bg-zinc-100 dark:hover:bg-white/[0.05] text-sm transition-all">
            Browse Auctions
          </Link>

          {user ? (
            <>
              <Link to="/create-auction" onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-4 py-3 rounded-xl font-semibold text-zinc-700 dark:text-slate-200 hover:text-primary-500 dark:hover:text-primary-400 hover:bg-zinc-100 dark:hover:bg-white/[0.05] text-sm transition-all">
                <PlusCircle className="w-4 h-4 text-primary-500" /> List Item
              </Link>
              <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-4 py-3 rounded-xl font-semibold text-zinc-700 dark:text-slate-200 hover:text-primary-500 dark:hover:text-primary-400 hover:bg-zinc-100 dark:hover:bg-white/[0.05] text-sm transition-all">
                <LayoutDashboard className="w-4 h-4 text-primary-500" /> Dashboard
              </Link>
              <Link to="/profile" onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-4 py-3 rounded-xl font-semibold text-zinc-700 dark:text-slate-200 hover:text-primary-500 dark:hover:text-primary-400 hover:bg-zinc-100 dark:hover:bg-white/[0.05] text-sm transition-all">
                <User className="w-4 h-4 text-primary-500" /> My Profile
              </Link>
              {user.role === 'admin' && (
                <Link to="/admin" onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl font-semibold text-primary-600 dark:text-primary-400 hover:bg-primary-500/8 text-sm transition-all">
                  <ShieldAlert className="w-4 h-4" /> Admin Panel
                </Link>
              )}
              <button onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
                className="flex items-center gap-2 px-4 py-3 rounded-xl font-semibold text-rose-500 hover:bg-rose-500/8 text-sm text-left w-full mt-1 transition-all">
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-2 mt-2 pt-2 border-t border-zinc-200 dark:border-white/[0.05]">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-3 rounded-xl border border-zinc-200 dark:border-white/[0.1] text-sm font-bold bg-zinc-100 dark:bg-white/[0.05] text-zinc-800 dark:text-slate-200 hover:bg-zinc-200 dark:hover:bg-white/[0.09] transition-all">
                Login
              </Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)}
                className="btn-primary w-full text-center font-bold text-sm">
                Sign Up Free
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
