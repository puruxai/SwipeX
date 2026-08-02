import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import soundManager from '../services/SoundManager';
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
      soundManager.playTick();
      navigate('/jobs');
    }
  };

  const handleLinkClick = () => {
    soundManager.playTick();
  };

  const handleLinkHover = () => {
    soundManager.playHover();
  };

  return (
    <header className="sticky top-0 z-50 bg-[#030509]/60 backdrop-blur-xl border-b border-white/5 transition-all">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="flex items-center justify-between h-20 gap-6">
          
          {/* Brand Logo & Global Nav Links */}
          <div className="flex items-center gap-12">
            <Link 
              to="/" 
              onClick={handleLinkClick}
              onMouseEnter={handleLinkHover}
              className="flex items-center gap-2.5 font-display text-lg font-extrabold tracking-tight text-[#ffb693]"
            >
              <Sparkles className="w-5 h-5 text-[#ff6b00]" />
              <span>SwipeX AI</span>
            </Link>

            {/* Original SwipeX Navigation Links */}
            {user && (
              <nav className="hidden xl:flex items-center gap-6 text-xs font-bold text-[#e2bfb0]/80">
                <Link
                  to="/swipe"
                  onClick={handleLinkClick}
                  onMouseEnter={handleLinkHover}
                  className={`hover:text-[#ffb693] transition-colors flex items-center gap-1.5 ${
                    isActive('/swipe') ? 'text-[#ffb693] font-black' : ''
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" /> Swipe Feed
                </Link>

                <Link
                  to="/resume-analyzer"
                  onClick={handleLinkClick}
                  onMouseEnter={handleLinkHover}
                  className={`hover:text-[#ffb693] transition-colors flex items-center gap-1.5 ${
                    isActive('/resume-analyzer') ? 'text-[#ffb693] font-black' : ''
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" /> ATS Analyzer
                </Link>

                <Link
                  to="/ai-hub"
                  onClick={handleLinkClick}
                  onMouseEnter={handleLinkHover}
                  className={`hover:text-[#ffb693] transition-colors flex items-center gap-1.5 ${
                    isActive('/ai-hub') ? 'text-[#ffb693] font-black' : ''
                  }`}
                >
                  <Bot className="w-3.5 h-3.5" /> AI Studio
                </Link>

                <Link
                  to="/jobs"
                  onClick={handleLinkClick}
                  onMouseEnter={handleLinkHover}
                  className={`hover:text-[#ffb693] transition-colors flex items-center gap-1.5 ${
                    isActive('/jobs') ? 'text-[#ffb693] font-black' : ''
                  }`}
                >
                  <Search className="w-3.5 h-3.5" /> Smart Search
                </Link>

                <Link
                  to="/dashboard"
                  onClick={handleLinkClick}
                  onMouseEnter={handleLinkHover}
                  className={`hover:text-[#ffb693] transition-colors flex items-center gap-1.5 ${
                    isActive('/dashboard') ? 'text-[#ffb693] font-black' : ''
                  }`}
                >
                  <BarChart3 className="w-3.5 h-3.5" /> Analytics
                </Link>

                <Link
                  to="/saved"
                  onClick={handleLinkClick}
                  onMouseEnter={handleLinkHover}
                  className={`hover:text-[#ffb693] transition-colors flex items-center gap-1.5 ${
                    isActive('/saved') ? 'text-[#ffb693] font-black' : ''
                  }`}
                >
                  <Bookmark className="w-3.5 h-3.5" /> Saved
                </Link>

                {['recruiter', 'recruiter_unverified'].includes(user.role) && (
                  <Link
                    to="/recruiter"
                    onClick={handleLinkClick}
                    onMouseEnter={handleLinkHover}
                    className={`hover:text-[#ffb693] transition-colors flex items-center gap-1.5 ${
                      isActive('/recruiter') ? 'text-[#ffb693] font-black' : ''
                    }`}
                  >
                    <Briefcase className="w-3.5 h-3.5" /> Recruiter HQ
                  </Link>
                )}

                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    onClick={handleLinkClick}
                    onMouseEnter={handleLinkHover}
                    className={`hover:text-rose-500 transition-colors flex items-center gap-1.5 ${
                      isActive('/admin') ? 'text-rose-500 font-black' : ''
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
            <Search className="w-4 h-4 absolute left-4 text-[#e2bfb0]/70 group-focus-within:text-[#ff6b00]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search neural insights..."
              className="w-full pl-11 pr-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-white focus:outline-none focus:border-[#ff6b00] focus:ring-1 focus:ring-[#ff6b00]/30 transition-all placeholder-[#e2bfb0]/40"
            />
          </form>

          {/* Right Action Icons Block */}
          <div className="flex items-center gap-4">
            
            {/* Theme Toggle Button */}
            <button
              onClick={() => {
                soundManager.playTick();
                toggleTheme();
              }}
              onMouseEnter={handleLinkHover}
              className="p-2.5 rounded-full hover:bg-white/5 text-[#e2bfb0] transition-colors border border-transparent hover:border-white/5"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-[#ffb693]" /> : <Moon className="w-4 h-4 text-[#e2bfb0]" />}
            </button>

            {/* Upgrade CTA */}
            <Link
              to="/swipe"
              onClick={handleLinkClick}
              onMouseEnter={handleLinkHover}
              className="px-6 py-2.5 rounded-full bg-[#ff6b00] dark:bg-[#ffb693] text-white dark:text-[#561f00] text-xs font-black shadow-lg hover:scale-105 active:scale-95 transition-all"
            >
              Upgrade
            </Link>

            {/* User Profile Avatar Drawer */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => {
                    soundManager.playTick();
                    setDropdownOpen(!dropdownOpen);
                  }}
                  className="flex items-center gap-2 focus:outline-none"
                >
                  <img
                    src={user.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"}
                    alt="User Avatar"
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-[#ffb693]/25 cursor-pointer hover:scale-102 transition-transform"
                  />
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      className="absolute right-0 mt-3 w-56 rounded-2xl p-2.5 bg-[#0a0f1d] border border-white/10 shadow-2xl z-50 space-y-1"
                    >
                      <div className="px-3.5 py-2.5 border-b border-white/5">
                        <p className="text-[9px] text-white/60 uppercase font-black tracking-wider">Signed in as</p>
                        <p className="text-xs font-black text-white truncate mt-0.5">{user.email}</p>
                      </div>

                      <Link
                        to="/profile"
                        onClick={() => {
                          setDropdownOpen(false);
                          handleLinkClick();
                        }}
                        onMouseEnter={handleLinkHover}
                        className="flex items-center gap-2.5 px-3 py-2.5 text-xs font-bold text-white/80 hover:bg-white/5 rounded-xl transition-colors"
                      >
                        <User className="w-4 h-4 text-[#ffb693]" /> My Profile
                      </Link>

                      <Link
                        to="/dashboard"
                        onClick={() => {
                          setDropdownOpen(false);
                          handleLinkClick();
                        }}
                        onMouseEnter={handleLinkHover}
                        className="flex items-center gap-2.5 px-3 py-2.5 text-xs font-bold text-white/80 hover:bg-white/5 rounded-xl transition-colors"
                      >
                        <BarChart3 className="w-4 h-4 text-[#ffb693]" /> Analytics
                      </Link>

                      {['recruiter', 'recruiter_unverified'].includes(user.role) && (
                        <Link
                          to="/recruiter"
                          onClick={() => {
                            setDropdownOpen(false);
                            handleLinkClick();
                          }}
                          onMouseEnter={handleLinkHover}
                          className="flex items-center gap-2.5 px-3 py-2.5 text-xs font-bold text-white/80 hover:bg-white/5 rounded-xl transition-colors"
                        >
                          <Briefcase className="w-4 h-4 text-[#ffb693]" /> Recruiter HQ
                        </Link>
                      )}

                      {user.role === 'admin' && (
                        <Link
                          to="/admin"
                          onClick={() => {
                            setDropdownOpen(false);
                            handleLinkClick();
                          }}
                          onMouseEnter={handleLinkHover}
                          className="flex items-center gap-2.5 px-3 py-2.5 text-xs font-bold text-rose-500 rounded-xl"
                        >
                          <ShieldCheck className="w-4 h-4 text-rose-500" /> Admin Console
                        </Link>
                      )}

                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          handleLinkClick();
                          logout();
                          navigate('/');
                        }}
                        className="w-full text-left flex items-center gap-2.5 px-3 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-950/20 rounded-xl mt-1.5"
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
                  onClick={handleLinkClick}
                  onMouseEnter={handleLinkHover}
                  className="px-4 py-2 text-xs font-bold text-white/80 hover:text-[#ff6b00]"
                >
                  Log In
                </Link>
                <Link 
                  to="/signup" 
                  onClick={handleLinkClick}
                  onMouseEnter={handleLinkHover}
                  className="px-5 py-2.5 rounded-full bg-[#ff6b00] text-white text-xs font-black shadow-md"
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
