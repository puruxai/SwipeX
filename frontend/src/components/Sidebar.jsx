import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import soundManager from '../services/SoundManager';
import { 
  Sparkles, 
  Layers, 
  FileText, 
  Search, 
  BarChart3, 
  Bookmark, 
  User, 
  HelpCircle, 
  BookOpen, 
  Plus,
  Bot,
  ChevronRight,
  LogOut,
  FolderOpen
} from 'lucide-react';

export default function Sidebar() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const isActive = (path) => location.pathname === path;

  const handleLinkClick = () => {
    soundManager.playTick();
  };

  const handleLinkHover = () => {
    soundManager.playHover();
  };

  return (
    <aside className="w-64 flex-shrink-0 bg-[#030509]/30 border-r border-white/5 flex flex-col justify-between p-5 min-h-[90vh] transition-colors relative z-10">
      
      <div className="space-y-6">
        
        {/* Workspace Indicator Header */}
        <div className="flex items-center gap-3 px-2 py-1">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#ff6b00] to-[#7c3aed] flex items-center justify-center text-white shadow-lg">
            <Sparkles className="w-4.5 h-4.5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-extrabold text-xs text-white truncate">SwipeX Sandbox</div>
            <div className="text-[9px] font-bold text-[#e2bfb0]/70 uppercase tracking-widest mt-0.5 flex items-center gap-1">
              <span>Personal</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            </div>
          </div>
        </div>

        {/* Action Button - Swipe Navigation */}
        <Link
          to="/swipe"
          onClick={handleLinkClick}
          onMouseEnter={handleLinkHover}
          className="w-full py-3 px-4.5 rounded-2xl bg-[#ff6b00] text-white font-bold text-xs shadow-lg flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" /> Start Swiping
        </Link>

        {/* Primary Navigation Menu */}
        <nav className="space-y-1.5">
          <Link
            to="/swipe"
            onClick={handleLinkClick}
            onMouseEnter={handleLinkHover}
            className={`flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all group ${
              isActive('/swipe')
                ? 'bg-white/5 text-white border-l-2 border-[#ffb693]'
                : 'text-[#e2bfb0] hover:bg-white/5 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <Layers className="w-4 h-4" /> 
              <span>Swipe Feed</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>

          <Link
            to="/resume-analyzer"
            onClick={handleLinkClick}
            onMouseEnter={handleLinkHover}
            className={`flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all group ${
              isActive('/resume-analyzer')
                ? 'bg-white/5 text-white border-l-2 border-[#ffb693]'
                : 'text-[#e2bfb0] hover:bg-white/5 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <FileText className="w-4 h-4" /> 
              <span>ATS Analyzer</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>

          <Link
            to="/ai-hub"
            onClick={handleLinkClick}
            onMouseEnter={handleLinkHover}
            className={`flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all group ${
              isActive('/ai-hub')
                ? 'bg-white/5 text-white border-l-2 border-[#ffb693]'
                : 'text-[#e2bfb0] hover:bg-white/5 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <Bot className="w-4 h-4" /> 
              <span>AI Studio</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>

          <Link
            to="/jobs"
            onClick={handleLinkClick}
            onMouseEnter={handleLinkHover}
            className={`flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all group ${
              isActive('/jobs')
                ? 'bg-white/5 text-white border-l-2 border-[#ffb693]'
                : 'text-[#e2bfb0] hover:bg-white/5 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <Search className="w-4 h-4" /> 
              <span>Smart Search</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>

          <Link
            to="/dashboard"
            onClick={handleLinkClick}
            onMouseEnter={handleLinkHover}
            className={`flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all group ${
              isActive('/dashboard')
                ? 'bg-white/5 text-white border-l-2 border-[#ffb693]'
                : 'text-[#e2bfb0] hover:bg-white/5 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <BarChart3 className="w-4 h-4" /> 
              <span>Analytics</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>

          <Link
            to="/saved"
            onClick={handleLinkClick}
            onMouseEnter={handleLinkHover}
            className={`flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all group ${
              isActive('/saved')
                ? 'bg-white/5 text-white border-l-2 border-[#ffb693]'
                : 'text-[#e2bfb0] hover:bg-white/5 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <Bookmark className="w-4 h-4" /> 
              <span>Saved Jobs</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
        </nav>

      </div>

      {/* Sidebar Footer */}
      <div className="space-y-5 pt-5 border-t border-white/5">
        
        {/* Elegant Upgrade Card */}
        <div className="p-4 rounded-2xl bg-[#0a0f1d]/40 border border-white/10 space-y-3">
          <div className="text-[9px] font-black uppercase tracking-widest text-[#ffb693]">PRO ENGINE</div>
          <div className="text-xs font-extrabold text-white leading-normal">Upgrade to Pro matching rules</div>
          <Link 
            to="/swipe" 
            onClick={handleLinkClick}
            onMouseEnter={handleLinkHover}
            className="block text-center py-2 px-3 rounded-xl bg-[#ff6b00] text-white text-[10px] font-bold shadow-sm hover:scale-[1.01] transition-transform"
          >
            Explore Upgrades
          </Link>
        </div>

        {/* User Profile Block */}
        {user && (
          <div className="flex items-center justify-between gap-3 p-2.5 rounded-2xl bg-white/5 border border-white/5">
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src={user.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"}
                alt="Avatar"
                className="w-9 h-9 rounded-xl object-cover border border-white/10"
              />
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-extrabold text-white truncate">My Account</div>
                <div className="text-[9px] font-semibold text-[#e2bfb0]/70 truncate">{user.email}</div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Hidden legacy details to preserve original routing/elements */}
      <div className="hidden">
        <HelpCircle className="w-1" />
        <BookOpen className="w-1" />
      </div>

    </aside>
  );
}
