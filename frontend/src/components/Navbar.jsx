import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  Sparkles, 
  Search, 
  Moon, 
  Sun, 
  User, 
  LogOut, 
  Briefcase, 
  ShieldCheck,
  Layers,
  FileText,
  BarChart3,
  Bookmark,
  Bot
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const isActive = (path) => location.pathname === path;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate('/jobs');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#fff8f6]/85 dark:bg-[#0c1322]/85 backdrop-blur-xl border-b border-[#e2bfb0]/30 dark:border-white/5 transition-all">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="flex items-center justify-between h-20 gap-6">
          
          {/* Brand Logo & Global Nav Links */}
          <div className="flex items-center gap-12">
            <Link to="/" className="flex items-center gap-2.5 font-display text-lg font-extrabold tracking-tight text-[#a04100] dark:text-[#ffb693]">
              <Sparkles className="w-5 h-5 text-[#ff6b00] dark:text-[#ffb693]" />
              <span>SwipeX AI</span>
            </Link>

            {/* Original SwipeX Navigation Links (Header-Level for Candidate Actions) */}
            {user && (
              <nav className="hidden xl:flex items-center gap-6 text-xs font-bold text-[#5a4136] dark:text-[#e2bfb0]/80">
                <Link
                  to="/swipe"
                  className={`hover:text-[#a04100] dark:hover:text-[#ffb693] transition-colors flex items-center gap-1.5 ${
                    isActive('/swipe') ? 'text-[#a04100] dark:text-[#ffb693] font-black' : ''
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" /> Swipe Feed
                </Link>

                <Link
                  to="/resume-analyzer"
                  className={`hover:text-[#a04100] dark:hover:text-[#ffb693] transition-colors flex items-center gap-1.5 ${
                    isActive('/resume-analyzer') ? 'text-[#a04100] dark:text-[#ffb693] font-black' : ''
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" /> ATS Analyzer
                </Link>

                <Link
                  to="/ai-hub"
                  className={`hover:text-[#a04100] dark:hover:text-[#ffb693] transition-colors flex items-center gap-1.5 ${
                    isActive('/ai-hub') ? 'text-[#a04100] dark:text-[#ffb693] font-black' : ''
                  }`}
                >
                  <Bot className="w-3.5 h-3.5" /> AI Studio
                </Link>

                <Link
                  to="/jobs"
                  className={`hover:text-[#a04100] dark:hover:text-[#ffb693] transition-colors flex items-center gap-1.5 ${
                    isActive('/jobs') ? 'text-[#a04100] dark:text-[#ffb693] font-black' : ''
                  }`}
                >
                  <Search className="w-3.5 h-3.5" /> Smart Search
                </Link>

                <Link
                  to="/dashboard"
                  className={`hover:text-[#a04100] dark:hover:text-[#ffb693] transition-colors flex items-center gap-1.5 ${
                    isActive('/dashboard') ? 'text-[#a04100] dark:text-[#ffb693] font-black' : ''
                  }`}
                >
                  <BarChart3 className="w-3.5 h-3.5" /> Analytics
                </Link>

                <Link
                  to="/saved"
                  className={`hover:text-[#a04100] dark:hover:text-[#ffb693] transition-colors flex items-center gap-1.5 ${
                    isActive('/saved') ? 'text-[#a04100] dark:text-[#ffb693] font-black' : ''
                  }`}
                >
                  <Bookmark className="w-3.5 h-3.5" /> Saved
                </Link>

                {['recruiter', 'recruiter_unverified'].includes(user.role) && (
                  <Link
                    to="/recruiter"
                    className={`hover:text-[#a04100] dark:hover:text-[#ffb693] transition-colors flex items-center gap-1.5 ${
                      isActive('/recruiter') ? 'text-[#a04100] dark:text-[#ffb693] font-black' : ''
                    }`}
                  >
                    <Briefcase className="w-3.5 h-3.5" /> Recruiter HQ
                  </Link>
                )}

                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    className={`hover:text-rose-600 transition-colors flex items-center gap-1.5 ${
                      isActive('/admin') ? 'text-rose-600 font-black' : ''
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-rose-500" /> Admin
                  </Link>
                )}
              </nav>
            )}
          </div>

          {/* Elegant Search Bar */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-sm items-center relative group">
            <Search className="w-4 h-4 absolute left-4 text-[#5a4136] dark:text-[#e2bfb0]/70 group-focus-within:text-[#ff6b00]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search neural insights..."
              className="w-full pl-11 pr-5 py-2.5 rounded-full bg-white/40 dark:bg-white/5 border border-[#e2bfb0] dark:border-white/10 text-xs font-semibold text-[#261812] dark:text-white focus:outline-none focus:border-[#ff6b00] focus:ring-1 focus:ring-[#ff6b00]/30 transition-all placeholder-[#5a4136]/50 dark:placeholder-[#e2bfb0]/40"
            />
          </form>

          {/* Right Action Icons Block */}
          <div className="flex items-center gap-4">
            
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-full hover:bg-white/50 dark:hover:bg-white/5 text-[#5a4136] dark:text-[#e2bfb0] transition-colors border border-transparent hover:border-[#e2bfb0]/30 dark:hover:border-white/5"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-[#ffb693]" /> : <Moon className="w-4 h-4 text-[#5a4136]" />}
            </button>

            {/* Upgrade CTA */}
            <Link
              to="/swipe"
              className="px-6 py-2.5 rounded-full bg-[#ff6b00] dark:bg-[#ffb693] text-white dark:text-[#561f00] text-xs font-black shadow-lg shadow-[#ff6b00]/15 dark:shadow-[#ffb693]/10 hover:scale-105 active:scale-95 transition-all"
            >
              Upgrade
            </Link>

            {/* User Profile Avatar Drawer */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 focus:outline-none"
                >
                  <img
                    src={user.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"}
                    alt="User Avatar"
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-[#ff6b00]/25 dark:ring-[#ffb693]/25 cursor-pointer hover:scale-102 transition-transform"
                  />
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      className="absolute right-0 mt-3 w-56 rounded-2xl p-2.5 bg-white dark:bg-[#141b2b] border border-[#e2bfb0]/40 dark:border-white/10 shadow-2xl z-50 space-y-1"
                    >
                      <div className="px-3.5 py-2.5 border-b border-[#e2bfb0]/20 dark:border-white/5">
                        <p className="text-[9px] text-[#5a4136] dark:text-[#e2bfb0]/60 uppercase font-black tracking-wider">Signed in as</p>
                        <p className="text-xs font-black text-[#261812] dark:text-white truncate mt-0.5">{user.email}</p>
                      </div>

                      <Link
                        to="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2.5 text-xs font-bold text-[#5a4136] dark:text-[#e2bfb0] hover:bg-[#fff1eb] dark:hover:bg-white/5 rounded-xl transition-colors"
                      >
                        <User className="w-4 h-4 text-[#ff6b00] dark:text-[#ffb693]" /> My Profile
                      </Link>

                      <Link
                        to="/dashboard"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2.5 text-xs font-bold text-[#5a4136] dark:text-[#e2bfb0] hover:bg-[#fff1eb] dark:hover:bg-white/5 rounded-xl transition-colors"
                      >
                        <BarChart3 className="w-4 h-4 text-[#ff6b00] dark:text-[#ffb693]" /> Analytics
                      </Link>

                      {['recruiter', 'recruiter_unverified'].includes(user.role) && (
                        <Link
                          to="/recruiter"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2.5 text-xs font-bold text-[#5a4136] dark:text-[#e2bfb0] hover:bg-[#fff1eb] dark:hover:bg-white/5 rounded-xl transition-colors"
                        >
                          <Briefcase className="w-4 h-4 text-[#ff6b00] dark:text-[#ffb693]" /> Recruiter HQ
                        </Link>
                      )}

                      {user.role === 'admin' && (
                        <Link
                          to="/admin"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2.5 text-xs font-bold text-rose-600 rounded-xl"
                        >
                          <ShieldCheck className="w-4 h-4" /> Admin Console
                        </Link>
                      )}

                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          logout();
                          navigate('/');
                        }}
                        className="w-full text-left flex items-center gap-2.5 px-3 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl mt-1.5"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="px-4 py-2 text-xs font-bold text-[#5a4136] dark:text-[#e2bfb0] hover:text-[#ff6b00]">
                  Log In
                </Link>
                <Link to="/signup" className="px-5 py-2.5 rounded-full bg-[#ff6b00] dark:bg-[#ffb693] text-white dark:text-[#561f00] text-xs font-black shadow-md">
                  Sign Up
                </Link>
              </div>
            )}

          </div>

        </div>
      </div>
    </header>
  );
}
