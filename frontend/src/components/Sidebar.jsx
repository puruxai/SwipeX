import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
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

  return (
    <aside className="w-64 flex-shrink-0 bg-[#fff8f6] dark:bg-[#0c1322] border-r border-[#e2bfb0] dark:border-white/5 flex flex-col justify-between p-5 min-h-[90vh] transition-colors">
      
      <div className="space-y-6">
        
        {/* Workspace Indicator Header */}
        <div className="flex items-center gap-3 px-2 py-1">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#ff6b00] to-[#7c3aed] flex items-center justify-center text-white shadow-lg">
            <Sparkles className="w-4.5 h-4.5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-extrabold text-xs text-[#261812] dark:text-white truncate">SwipeX Sandbox</div>
            <div className="text-[9px] font-bold text-[#5a4136] dark:text-[#e2bfb0]/70 uppercase tracking-widest mt-0.5 flex items-center gap-1">
              <span>Personal</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            </div>
          </div>
        </div>

        {/* Action Button - Swipe Navigation */}
        <Link
          to="/swipe"
          className="w-full py-3 px-4.5 rounded-2xl bg-gradient-to-r from-[#ff6b00] to-[#ff8533] dark:from-[#ffb693] dark:to-[#ffdbcc] text-white dark:text-[#561f00] font-bold text-xs shadow-lg shadow-[#ff6b00]/15 dark:shadow-[#ffb693]/10 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" /> Start Swiping
        </Link>

        {/* Primary Navigation Menu */}
        <nav className="space-y-1.5">
          <Link
            to="/swipe"
            className={`flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all group ${
              isActive('/swipe')
                ? 'bg-[#ff6b00]/10 dark:bg-white/5 text-[#a04100] dark:text-white border-l-2 border-[#ff6b00] dark:border-[#ffb693]'
                : 'text-[#5a4136] dark:text-[#e2bfb0] hover:bg-[#fff1eb] dark:hover:bg-white/5 hover:text-[#a04100] dark:hover:text-white'
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
            className={`flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all group ${
              isActive('/resume-analyzer')
                ? 'bg-[#ff6b00]/10 dark:bg-white/5 text-[#a04100] dark:text-white border-l-2 border-[#ff6b00] dark:border-[#ffb693]'
                : 'text-[#5a4136] dark:text-[#e2bfb0] hover:bg-[#fff1eb] dark:hover:bg-white/5 hover:text-[#a04100] dark:hover:text-white'
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
            className={`flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all group ${
              isActive('/ai-hub')
                ? 'bg-[#ff6b00]/10 dark:bg-white/5 text-[#a04100] dark:text-white border-l-2 border-[#ff6b00] dark:border-[#ffb693]'
                : 'text-[#5a4136] dark:text-[#e2bfb0] hover:bg-[#fff1eb] dark:hover:bg-white/5 hover:text-[#a04100] dark:hover:text-white'
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
            className={`flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all group ${
              isActive('/jobs')
                ? 'bg-[#ff6b00]/10 dark:bg-white/5 text-[#a04100] dark:text-white border-l-2 border-[#ff6b00] dark:border-[#ffb693]'
                : 'text-[#5a4136] dark:text-[#e2bfb0] hover:bg-[#fff1eb] dark:hover:bg-white/5 hover:text-[#a04100] dark:hover:text-white'
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
            className={`flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all group ${
              isActive('/dashboard')
                ? 'bg-[#ff6b00]/10 dark:bg-white/5 text-[#a04100] dark:text-white border-l-2 border-[#ff6b00] dark:border-[#ffb693]'
                : 'text-[#5a4136] dark:text-[#e2bfb0] hover:bg-[#fff1eb] dark:hover:bg-white/5 hover:text-[#a04100] dark:hover:text-white'
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
            className={`flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all group ${
              isActive('/saved')
                ? 'bg-[#ff6b00]/10 dark:bg-white/5 text-[#a04100] dark:text-white border-l-2 border-[#ff6b00] dark:border-[#ffb693]'
                : 'text-[#5a4136] dark:text-[#e2bfb0] hover:bg-[#fff1eb] dark:hover:bg-white/5 hover:text-[#a04100] dark:hover:text-white'
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
      <div className="space-y-5 pt-5 border-t border-[#e2bfb0]/30 dark:border-white/5">
        
        {/* Elegant Upgrade Card */}
        <div className="p-4 rounded-2xl bg-white/60 dark:bg-[#141b2b]/40 border border-[#e2bfb0]/40 dark:border-white/10 space-y-3">
          <div className="text-[9px] font-black uppercase tracking-widest text-[#a04100] dark:text-[#ffb693]">PRO ENGINE</div>
          <div className="text-xs font-extrabold text-[#261812] dark:text-white leading-normal">Upgrade to Pro matching rules</div>
          <Link to="/swipe" className="block text-center py-2 px-3 rounded-xl bg-[#ff6b00] dark:bg-[#ffb693] text-white dark:text-[#561f00] text-[10px] font-bold shadow-sm hover:scale-[1.01] transition-transform">
            Explore Upgrades
          </Link>
        </div>

        {/* User Profile Block */}
        {user && (
          <div className="flex items-center justify-between gap-3 p-2.5 rounded-2xl bg-white/40 dark:bg-white/5 border border-[#e2bfb0]/30 dark:border-white/5">
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src={user.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"}
                alt="Avatar"
                className="w-9 h-9 rounded-xl object-cover border border-[#e2bfb0]/40"
              />
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-extrabold text-[#261812] dark:text-white truncate">My Account</div>
                <div className="text-[9px] font-semibold text-[#5a4136] dark:text-[#e2bfb0]/70 truncate">{user.email}</div>
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
