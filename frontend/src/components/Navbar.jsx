import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
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
  ChevronDown,
  Sun,
  Moon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-40 glass-panel border-b border-[#262626] backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-extrabold text-xl tracking-tight">
            <motion.div 
              whileHover={{ rotate: 15 }}
              className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#FF6B00] to-[#FF8A3D] flex items-center justify-center shadow-[0_0_15px_rgba(255,107,0,0.3)]"
            >
              <Sparkles className="w-5 h-5 text-white animate-pulse" />
            </motion.div>
            <span className="gradient-text text-2xl font-black">SwipeX</span>
            <span className="text-[10px] uppercase font-black tracking-widest px-2.5 py-0.5 rounded-full bg-[#FF6B00]/10 text-[#FF8A3D] border border-[#FF6B00]/25">
              AI Job Hub
            </span>
          </Link>
 
          {/* Navigation Links */}
          {user && (
            <div className="hidden md:flex items-center gap-1.5">
              <Link
                to="/swipe"
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border ${
                  isActive('/swipe')
                    ? 'bg-[#FF6B00]/10 text-[#FF8A3D] border-[#FF6B00]/30'
                    : 'text-[#A8A8A8] border-transparent hover:text-white hover:bg-white/5'
                }`}
              >
                <Layers className="w-4 h-4 text-[#FF6B00]" />
                Swipe Feed
              </Link>

              <Link
                to="/resume-analyzer"
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border ${
                  isActive('/resume-analyzer')
                    ? 'bg-[#FF6B00]/10 text-[#FF8A3D] border-[#FF6B00]/30'
                    : 'text-[#A8A8A8] border-transparent hover:text-white hover:bg-white/5'
                }`}
              >
                <FileText className="w-4 h-4 text-[#FF6B00]" />
                ATS Analyzer
              </Link>

              <Link
                to="/jobs"
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border ${
                  isActive('/jobs')
                    ? 'bg-[#FF6B00]/10 text-[#FF8A3D] border-[#FF6B00]/30'
                    : 'text-[#A8A8A8] border-transparent hover:text-white hover:bg-white/5'
                }`}
              >
                <Search className="w-4 h-4 text-[#FF6B00]" />
                Smart Search
              </Link>

              <Link
                to="/dashboard"
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border ${
                  isActive('/dashboard')
                    ? 'bg-[#FF6B00]/10 text-[#FF8A3D] border-[#FF6B00]/30'
                    : 'text-[#A8A8A8] border-transparent hover:text-white hover:bg-white/5'
                }`}
              >
                <BarChart3 className="w-4 h-4 text-[#FF6B00]" />
                Analytics
              </Link>

              <Link
                to="/saved"
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border ${
                  isActive('/saved')
                    ? 'bg-[#FF6B00]/10 text-[#FF8A3D] border-[#FF6B00]/30'
                    : 'text-[#A8A8A8] border-transparent hover:text-white hover:bg-white/5'
                }`}
              >
                <Bookmark className="w-4 h-4 text-[#FF6B00]" />
                Saved
              </Link>

              {['recruiter', 'recruiter_unverified'].includes(user.role) && (
                <Link
                  to="/recruiter"
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border ${
                    isActive('/recruiter')
                      ? 'bg-[#FF6B00]/10 text-[#FF8A3D] border-[#FF6B00]/30'
                      : 'text-[#A8A8A8] border-transparent hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Briefcase className="w-4 h-4 text-[#FF6B00]" />
                  Recruiter HQ
                </Link>
              )}

              {user.role === 'admin' && (
                <Link
                  to="/admin"
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border ${
                    isActive('/admin')
                      ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                      : 'text-[#A8A8A8] border-transparent hover:text-white hover:bg-white/5'
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
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-[#262626] bg-[#181818]/45 hover:border-[#FF6B00]/40 text-[#A8A8A8] hover:text-white transition-all focus:outline-none"
              aria-label="Toggle theme mode"
            >
              {theme === 'dark' ? (
                <Sun className="w-4.5 h-4.5 text-[#FF8A3D]" />
              ) : (
                <Moon className="w-4.5 h-4.5 text-[#FF6B00]" />
              )}
            </button>
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-3 px-3 py-1.5 rounded-xl glass-panel border border-[#262626] hover:border-[#FF6B00]/40 transition-all focus:outline-none"
                >
                  <img
                    src={user.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"}
                    alt="Profile Avatar"
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-[#FF6B00]/30"
                  />
                  <div className="hidden sm:block text-left">
                    <div className="text-sm font-semibold text-white leading-tight">{user.full_name}</div>
                    <div className="text-[10px] text-[#A8A8A8] capitalize font-medium">{user.role.replace('_', ' ')}</div>
                  </div>
                  <ChevronDown className="w-4 h-4 text-[#A8A8A8]" />
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-56 glass-panel rounded-2xl p-2 shadow-2xl border border-[#262626] z-50 bg-[#121212]"
                    >
                      <div className="px-3 py-2 border-b border-[#262626] mb-1">
                        <p className="text-[10px] text-[#A8A8A8] uppercase font-bold tracking-wider">Signed in as</p>
                        <p className="text-xs font-black text-white truncate">{user.email}</p>
                      </div>

                      <Link
                        to="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-[#A8A8A8] hover:text-white hover:bg-white/5 rounded-xl transition-all"
                      >
                        <User className="w-4 h-4 text-[#FF6B00]" />
                        My Profile
                      </Link>

                      {['recruiter', 'recruiter_unverified'].includes(user.role) && (
                        <Link
                          to="/recruiter"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-[#A8A8A8] hover:text-white hover:bg-white/5 rounded-xl transition-all"
                        >
                          <Briefcase className="w-4 h-4 text-[#FF6B00]" />
                          Recruiter Dashboard
                        </Link>
                      )}

                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          logout();
                          navigate('/');
                        }}
                        className="w-full text-left flex items-center gap-2 px-3 py-2 text-xs font-bold text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all mt-1"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-xs font-bold text-[#A8A8A8] hover:text-white transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="px-5 py-2 text-xs font-black text-white bg-gradient-to-r from-[#FF6B00] to-[#FF8A3D] rounded-xl shadow-[0_4px_15px_rgba(255,107,0,0.35)] hover:shadow-[0_4px_25px_rgba(255,107,0,0.55)] transition-all hover:scale-105"
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
