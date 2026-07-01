import React from 'react';
import { Link } from 'react-router-dom';
import { Gavel, Sparkles, Twitter, Linkedin, Github, Mail, ArrowRight } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-[#060a11] border-t border-zinc-200/60 dark:border-white/[0.05] transition-colors duration-300">
      {/* Main Footer Grid */}
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand Column */}
        <div className="md:col-span-1">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="p-1.5 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg text-zinc-950">
              <Gavel className="w-5 h-5" />
            </div>
            <span className="font-display font-black text-xl text-zinc-950 dark:text-white flex items-center gap-1">
              BidZy <Sparkles className="w-3.5 h-3.5 text-primary-500 fill-primary-500/20" />
            </span>
          </div>
          <p className="text-sm text-zinc-500 dark:text-slate-400 leading-relaxed mb-6">
            The AI-powered campus auction marketplace — trade textbooks, laptops, gadgets &amp; essentials safely across campuses.
          </p>
          {/* Social Icons */}
          <div className="flex items-center gap-3">
            {[
              { icon: <Twitter className="w-4 h-4" />, label: 'Twitter' },
              { icon: <Linkedin className="w-4 h-4" />, label: 'LinkedIn' },
              { icon: <Github className="w-4 h-4" />, label: 'GitHub' },
              { icon: <Mail className="w-4 h-4" />, label: 'Email' },
            ].map(s => (
              <button key={s.label} aria-label={s.label}
                className="p-2 rounded-lg bg-zinc-100 dark:bg-white/[0.05] text-zinc-500 dark:text-slate-400 hover:bg-primary-500/15 hover:text-primary-500 dark:hover:text-primary-400 border border-zinc-200 dark:border-white/[0.07] transition-all hover:scale-110">
                {s.icon}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h5 className="font-bold text-sm text-zinc-950 dark:text-white mb-5 uppercase tracking-wider">Platform</h5>
          <ul className="space-y-3">
            {[
              { label: 'Browse Auctions', href: '/browse' },
              { label: 'List an Item', href: '/create-auction' },
              { label: 'Student Dashboard', href: '/dashboard' },
              { label: 'My Profile', href: '/profile' },
            ].map(item => (
              <li key={item.label}>
                <Link to={item.href}
                  className="text-sm text-zinc-500 dark:text-slate-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors font-medium flex items-center gap-1.5 group">
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -ml-1 transition-all" />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Company */}
        <div>
          <h5 className="font-bold text-sm text-zinc-950 dark:text-white mb-5 uppercase tracking-wider">Company</h5>
          <ul className="space-y-3">
            {['About BidZy', 'Blog', 'Careers', 'Press Kit', 'Contact Us'].map(item => (
              <li key={item}>
                <a href="#"
                  className="text-sm text-zinc-500 dark:text-slate-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors font-medium flex items-center gap-1.5 group">
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -ml-1 transition-all" />
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h5 className="font-bold text-sm text-zinc-950 dark:text-white mb-5 uppercase tracking-wider">Stay Updated</h5>
          <p className="text-sm text-zinc-500 dark:text-slate-400 mb-4 leading-relaxed">
            Get alerts for new listings, hot bids, and platform news.
          </p>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="your@college.edu"
              className="flex-1 min-w-0 glass-input text-sm py-2 px-3 rounded-xl"
            />
            <button className="btn-primary px-3 py-2 text-sm font-bold shrink-0 rounded-xl">
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[11px] text-zinc-400 dark:text-slate-500 mt-2 font-medium">No spam. Unsubscribe anytime.</p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-zinc-200/60 dark:border-white/[0.05] py-5 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-zinc-400 dark:text-slate-500 font-medium">
            © {new Date().getFullYear()} BidZy Technologies Pvt. Ltd. · All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(item => (
              <a key={item} href="#"
                className="text-xs text-zinc-400 dark:text-slate-500 hover:text-primary-500 dark:hover:text-primary-400 transition-colors font-medium">
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
