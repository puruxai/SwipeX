import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  Sparkles, 
  Search, 
  Moon, 
  Sun, 
  ChevronDown, 
  User, 
  LogOut, 
  Briefcase, 
  ShieldCheck,
  Layers,
  FileText,
  BarChart3,
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
    <header className="sticky top-0 z-50 bg-[#FFF9F5]/90 dark:bg-[#0F0D0C]/90 backdrop-blur-md border-b border-[#F3E8E2] dark:border-[#3D3835] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Platform Nav */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 font-black text-xl tracking-tight text-[#963200] dark:text-[#FF8A3D]">
              SwipeX
            </Link>

            <nav className="hidden md:flex items-center gap-6 text-xs font-bold text-[#57534E] dark:text-[#A8A29E]">
              <Link to="/swipe" className={`hover:text-[#963200] transition-colors ${isActive('/swipe') ? 'text-[#963200] font-black' : ''}`}>
                Models
              </Link>
              <Link to="/jobs" className={`hover:text-[#963200] transition-colors ${isActive('/jobs') ? 'text-[#963200] font-black' : ''}`}>
                Datasets
              </Link>
              <Link to="/resume-analyzer" className={`hover:text-[#963200] transition-colors ${isActive('/resume-analyzer') ? 'text-[#963200] font-black' : ''}`}>
                Compute
              </Link>
              <Link to="/ai-hub" className={`hover:text-[#963200] transition-colors ${isActive('/ai-hub') ? 'text-[#963200] font-black' : ''}`}>
                API
              </Link>
            </nav>
          </div>

          {/* Search Bar (Matching Reference Screenshot 2, 3, 4) */}
          <form onSubmit={handleSearchSubmit} className="hidden sm:flex flex-1 max-w-xs items-center relative">
            <Search className="w-3.5 h-3.5 absolute left-3.5 text-[#A8A29E]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search positions..."
              className="w-full pl-9 pr-4 py-1.5 rounded-full bg-[#FFF5F0] dark:bg-[#1C1917] border border-[#F3E8E2] dark:border-[#3D3835] text-xs font-medium text-[#1C1917] dark:text-white focus:outline-none focus:border-[#963200]"
            />
          </form>

          {/* Right Header Actions */}
          <div className="flex items-center gap-3">
            
            {/* Theme Toggle Icon */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-[#FFF0E6] dark:hover:bg-[#262322] text-[#57534E] dark:text-[#A8A29E] transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-[#FF8A3D]" /> : <Moon className="w-4 h-4 text-[#57534E]" />}
            </button>

            {/* Upgrade Button (Matching Reference Screenshot Pill) */}
            <Link
              to="/swipe"
              className="px-4 py-1.5 rounded-full bg-[#963200] hover:bg-[#802B00] text-white text-xs font-bold shadow-sm transition-all hover:scale-105"
            >
              Upgrade
            </Link>

            {/* User Profile Avatar / Auth */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 focus:outline-none"
                >
                  <img
                    src={user.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"}
                    alt="User Avatar"
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-[#963200]/40"
                  />
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-56 rounded-2xl p-2 bg-white dark:bg-[#1C1917] border border-[#F3E8E2] dark:border-[#3D3835] shadow-xl z-50 space-y-1"
                    >
                      <div className="px-3 py-2 border-b border-[#F3E8E2] dark:border-[#3D3835]">
                        <p className="text-[10px] text-[#A8A29E] uppercase font-bold">Signed in as</p>
                        <p className="text-xs font-black text-[#1C1917] dark:text-white truncate">{user.email}</p>
                      </div>

                      <Link
                        to="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-[#57534E] dark:text-[#A8A29E] hover:bg-[#FFF0E6] dark:hover:bg-[#262322] rounded-xl"
                      >
                        <User className="w-4 h-4 text-[#963200]" /> My Profile
                      </Link>

                      <Link
                        to="/dashboard"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-[#57534E] dark:text-[#A8A29E] hover:bg-[#FFF0E6] dark:hover:bg-[#262322] rounded-xl"
                      >
                        <BarChart3 className="w-4 h-4 text-[#963200]" /> Analytics
                      </Link>

                      {['recruiter', 'recruiter_unverified'].includes(user.role) && (
                        <Link
                          to="/recruiter"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-[#57534E] dark:text-[#A8A29E] hover:bg-[#FFF0E6] dark:hover:bg-[#262322] rounded-xl"
                        >
                          <Briefcase className="w-4 h-4 text-[#963200]" /> Recruiter HQ
                        </Link>
                      )}

                      {user.role === 'admin' && (
                        <Link
                          to="/admin"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-rose-600 rounded-xl"
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
                        className="w-full text-left flex items-center gap-2 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl mt-1"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="px-3.5 py-1.5 text-xs font-bold text-[#57534E] hover:text-[#963200]">
                  Log In
                </Link>
                <Link to="/signup" className="px-4 py-1.5 rounded-full bg-[#963200] text-white text-xs font-bold shadow-sm">
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
