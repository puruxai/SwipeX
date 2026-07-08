import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Sparkles, 
  Layers, 
  FileText, 
  Search, 
  BarChart3, 
  Bookmark, 
  Briefcase, 
  ShieldCheck, 
  User, 
  LogOut, 
  Bell,
  ChevronDown
} from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-40 glass-panel border-b border-white/10 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-extrabold text-xl tracking-tight">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-cyan-400 flex items-center justify-center shadow-neon-indigo">
              <Sparkles className="w-5 h-5 text-white animate-pulse" />
            </div>
            <span className="gradient-text text-2xl font-black">SwipeX</span>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">AI Platform</span>
          </Link>

          {/* Navigation Links */}
          {user && (
            <div className="hidden md:flex items-center gap-1">
              <Link
                to="/swipe"
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                  isActive('/swipe')
                    ? 'bg-indigo-600/30 text-indigo-400 border border-indigo-500/40'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Layers className="w-4 h-4 text-indigo-400" />
                Swipe Feed
              </Link>

              <Link
                to="/resume-analyzer"
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                  isActive('/resume-analyzer')
                    ? 'bg-indigo-600/30 text-indigo-400 border border-indigo-500/40'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <FileText className="w-4 h-4 text-cyan-400" />
                ATS Analyzer
              </Link>

              <Link
                to="/jobs"
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                  isActive('/jobs')
                    ? 'bg-indigo-600/30 text-indigo-400 border border-indigo-500/40'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Search className="w-4 h-4 text-emerald-400" />
                Smart Search
              </Link>

              <Link
                to="/dashboard"
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                  isActive('/dashboard')
                    ? 'bg-indigo-600/30 text-indigo-400 border border-indigo-500/40'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <BarChart3 className="w-4 h-4 text-pink-400" />
                Analytics
              </Link>

              <Link
                to="/saved"
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                  isActive('/saved')
                    ? 'bg-indigo-600/30 text-indigo-400 border border-indigo-500/40'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Bookmark className="w-4 h-4 text-amber-400" />
                Saved
              </Link>

              {user.role === 'recruiter' && (
                <Link
                  to="/recruiter"
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                    isActive('/recruiter')
                      ? 'bg-violet-600/30 text-violet-300 border border-violet-500/40'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Briefcase className="w-4 h-4 text-violet-400" />
                  Recruiter HQ
                </Link>
              )}

              {user.role === 'admin' && (
                <Link
                  to="/admin"
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                    isActive('/admin')
                      ? 'bg-rose-600/30 text-rose-300 border border-rose-500/40'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-rose-400" />
                  Admin
                </Link>
              )}
            </div>
          )}

          {/* Right Menu (Auth / Profile Dropdown) */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-3 px-3 py-1.5 rounded-xl glass-panel hover:border-indigo-500/40 transition-all"
                >
                  <img
                    src={user.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"}
                    alt="Profile Avatar"
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/40"
                  />
                  <div className="hidden sm:block text-left">
                    <div className="text-sm font-semibold text-white leading-tight">{user.full_name}</div>
                    <div className="text-[11px] text-indigo-300 capitalize">{user.role}</div>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 glass-panel rounded-2xl p-2 shadow-2xl border border-white/10 z-50">
                    <div className="px-3 py-2 border-b border-white/10 mb-1">
                      <p className="text-xs text-slate-400">Signed in as</p>
                      <p className="text-sm font-bold text-white truncate">{user.email}</p>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-all"
                    >
                      <User className="w-4 h-4 text-indigo-400" />
                      My Profile
                    </Link>

                    {user.role === 'recruiter' && (
                      <Link
                        to="/recruiter"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-all"
                      >
                        <Briefcase className="w-4 h-4 text-violet-400" />
                        Recruiter Dashboard
                      </Link>
                    )}

                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        logout();
                        navigate('/');
                      }}
                      className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-pink-400 hover:bg-pink-500/10 rounded-xl transition-all mt-1"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="px-5 py-2 text-sm font-bold text-white bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-500 rounded-xl shadow-neon-indigo hover:opacity-95 transition-all hover:scale-105"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}
