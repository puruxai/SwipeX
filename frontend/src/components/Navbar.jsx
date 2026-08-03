import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  Sparkles, 
  Search, 
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
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#E6E6E2] transition-all h-[72px]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 h-full">
        <div className="flex items-center justify-between h-full gap-6">
          
          {/* Brand Logo & Global Nav Links */}
          <div className="flex items-center gap-8">
            <Link 
              to="/" 
              className="flex items-center gap-2.5 font-display text-base font-extrabold tracking-tight text-[#111111] hover:opacity-90"
            >
              <Sparkles className="w-5 h-5 text-[#7ED321]" />
              <span>SwipeX AI</span>
            </Link>

            {/* Original SwipeX Navigation Links */}
            {user && (
              <nav className="hidden xl:flex items-center gap-5 text-xs font-semibold text-[#666666]">
                <Link
                  to="/swipe"
                  className={`hover:text-[#111111] transition-colors flex items-center gap-1.5 ${
                    isActive('/swipe') ? 'text-[#111111] font-bold' : ''
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" /> Swipe Feed
                </Link>

                <Link
                  to="/resume-analyzer"
                  className={`hover:text-[#111111] transition-colors flex items-center gap-1.5 ${
                    isActive('/resume-analyzer') ? 'text-[#111111] font-bold' : ''
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" /> ATS Analyzer
                </Link>

                <Link
                  to="/ai-hub"
                  className={`hover:text-[#111111] transition-colors flex items-center gap-1.5 ${
                    isActive('/ai-hub') ? 'text-[#111111] font-bold' : ''
                  }`}
                >
                  <Bot className="w-3.5 h-3.5" /> AI Studio
                </Link>

                <Link
                  to="/jobs"
                  className={`hover:text-[#111111] transition-colors flex items-center gap-1.5 ${
                    isActive('/jobs') ? 'text-[#111111] font-bold' : ''
                  }`}
                >
                  <Search className="w-3.5 h-3.5" /> Smart Search
                </Link>

                <Link
                  to="/dashboard"
                  className={`hover:text-[#111111] transition-colors flex items-center gap-1.5 ${
                    isActive('/dashboard') ? 'text-[#111111] font-bold' : ''
                  }`}
                >
                  <BarChart3 className="w-3.5 h-3.5" /> Analytics
                </Link>

                <Link
                  to="/saved"
                  className={`hover:text-[#111111] transition-colors flex items-center gap-1.5 ${
                    isActive('/saved') ? 'text-[#111111] font-bold' : ''
                  }`}
                >
                  <Bookmark className="w-3.5 h-3.5" /> Saved
                </Link>

                {['recruiter', 'recruiter_unverified'].includes(user.role) && (
                  <Link
                    to="/recruiter"
                    className={`hover:text-[#111111] transition-colors flex items-center gap-1.5 ${
                      isActive('/recruiter') ? 'text-[#111111] font-bold' : ''
                    }`}
                  >
                    <Briefcase className="w-3.5 h-3.5" /> Recruiter HQ
                  </Link>
                )}

                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    className={`hover:text-rose-600 transition-colors flex items-center gap-1.5 ${
                      isActive('/admin') ? 'text-rose-600 font-bold' : ''
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-rose-500" /> Admin
                  </Link>
                )}
              </nav>
            )}
          </div>

          {/* Elegant Search Bar */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-xs items-center relative group">
            <Search className="w-4 h-4 absolute left-3.5 text-[#666666]/70 group-focus-within:text-[#7ED321]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search neural insights..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#F8F8F5] border border-[#E6E6E2] text-xs font-medium text-[#111111] focus:outline-none focus:border-[#7ED321] transition-all placeholder-[#666666]/60"
            />
          </form>

          {/* Right Action Icons Block */}
          <div className="flex items-center gap-4">
            
            {/* Upgrade CTA */}
            <Link
              to="/swipe"
              className="px-5 py-2 rounded-full bg-[#7ED321] hover:bg-[#59C414] text-white text-xs font-bold transition-all shadow-sm"
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
                    className="w-10 h-10 md:w-11 md:h-11 lg:w-12 lg:h-12 rounded-full object-cover border border-[#E6E6E2] cursor-pointer hover:opacity-95 flex-shrink-0"
                  />
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      className="absolute right-0 mt-2.5 w-52 rounded-xl p-2 bg-white border border-[#E6E6E2] shadow-lg z-50 space-y-1"
                    >
                      <div className="px-3 py-2 border-b border-neutral-100">
                        <p className="text-[9px] text-[#666666] uppercase font-bold tracking-wider">Signed in as</p>
                        <p className="text-xs font-bold text-[#111111] truncate mt-0.5">{user.email}</p>
                      </div>

                      <Link
                        to="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-[#111111] hover:bg-[#F8F8F5] rounded-lg transition-colors"
                      >
                        <User className="w-4 h-4 text-[#7ED321]" /> My Profile
                      </Link>

                      <Link
                        to="/dashboard"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-[#111111] hover:bg-[#F8F8F5] rounded-lg transition-colors"
                      >
                        <BarChart3 className="w-4 h-4 text-[#7ED321]" /> Analytics
                      </Link>

                      {['recruiter', 'recruiter_unverified'].includes(user.role) && (
                        <Link
                          to="/recruiter"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-[#111111] hover:bg-[#F8F8F5] rounded-lg transition-colors"
                        >
                          <Briefcase className="w-4 h-4 text-[#7ED321]" /> Recruiter HQ
                        </Link>
                      )}

                      {user.role === 'admin' && (
                        <Link
                          to="/admin"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 rounded-lg"
                        >
                          <ShieldCheck className="w-4 h-4 text-rose-500" /> Admin Console
                        </Link>
                      )}

                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          logout();
                          navigate('/');
                        }}
                        className="w-full text-left flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg mt-1"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link 
                  to="/login" 
                  className="px-3 py-1.5 text-xs font-semibold text-[#666666] hover:text-[#111111]"
                >
                  Log In
                </Link>
                <Link 
                  to="/signup" 
                  className="px-4 py-2 rounded-full bg-[#7ED321] hover:bg-[#59C414] text-white text-xs font-bold shadow-sm"
                >
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
