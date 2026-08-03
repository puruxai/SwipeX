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
    <aside className="w-60 flex-shrink-0 bg-white border-r border-[#E6E6E2] flex flex-col justify-between p-5 min-h-[90vh] transition-colors relative z-10">
      
      <div className="space-y-6">

        {/* Action Button - Swipe Navigation */}
        <Link
          to="/swipe"
          className="w-full py-2.5 px-4 rounded-xl bg-[#7ED321] hover:bg-[#59C414] text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 hover:scale-[1.01] transition-all"
        >
          <Plus className="w-3.5 h-3.5" /> Start Swiping
        </Link>

        {/* Primary Navigation Menu */}
        <nav className="space-y-1">
          <Link
            to="/swipe"
            className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all group ${
              isActive('/swipe')
                ? 'bg-[#7ED321]/8 text-[#111111] border-l-2 border-[#7ED321]'
                : 'text-[#666666] hover:bg-[#F8F8F5] hover:text-[#111111]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Layers className="w-4 h-4" /> 
              <span>Swipe Feed</span>
            </div>
            <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>

          <Link
            to="/resume-analyzer"
            className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all group ${
              isActive('/resume-analyzer')
                ? 'bg-[#7ED321]/8 text-[#111111] border-l-2 border-[#7ED321]'
                : 'text-[#666666] hover:bg-[#F8F8F5] hover:text-[#111111]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <FileText className="w-4 h-4" /> 
              <span>ATS Analyzer</span>
            </div>
            <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>

          <Link
            to="/ai-hub"
            className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all group ${
              isActive('/ai-hub')
                ? 'bg-[#7ED321]/8 text-[#111111] border-l-2 border-[#7ED321]'
                : 'text-[#666666] hover:bg-[#F8F8F5] hover:text-[#111111]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Bot className="w-4 h-4" /> 
              <span>AI Studio</span>
            </div>
            <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>

          <Link
            to="/jobs"
            className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all group ${
              isActive('/jobs')
                ? 'bg-[#7ED321]/8 text-[#111111] border-l-2 border-[#7ED321]'
                : 'text-[#666666] hover:bg-[#F8F8F5] hover:text-[#111111]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Search className="w-4 h-4" /> 
              <span>Smart Search</span>
            </div>
            <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>

          <Link
            to="/dashboard"
            className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all group ${
              isActive('/dashboard')
                ? 'bg-[#7ED321]/8 text-[#111111] border-l-2 border-[#7ED321]'
                : 'text-[#666666] hover:bg-[#F8F8F5] hover:text-[#111111]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <BarChart3 className="w-4 h-4" /> 
              <span>Analytics</span>
            </div>
            <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>

          <Link
            to="/saved"
            className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all group ${
              isActive('/saved')
                ? 'bg-[#7ED321]/8 text-[#111111] border-l-2 border-[#7ED321]'
                : 'text-[#666666] hover:bg-[#F8F8F5] hover:text-[#111111]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Bookmark className="w-4 h-4" /> 
              <span>Saved Jobs</span>
            </div>
            <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
        </nav>

      </div>

      {/* Sidebar Footer */}
      <div className="space-y-4 pt-4 border-t border-neutral-100">
        
        {/* Elegant Upgrade Card */}
        <div className="p-3.5 rounded-xl bg-[#F8F8F5] border border-[#E6E6E2] space-y-2.5">
          <div className="text-[8px] font-black uppercase tracking-wider text-[#59C414]">PRO ENGINE</div>
          <div className="text-[11px] font-bold text-[#111111] leading-tight">Upgrade to Pro matching rules</div>
          <Link 
            to="/swipe" 
            className="block text-center py-1.5 rounded-lg bg-[#7ED321] hover:bg-[#59C414] text-white text-[10px] font-bold transition-all"
          >
            Explore Upgrades
          </Link>
        </div>

        {/* User Profile Block */}
        {user && (
          <div className="flex items-center justify-between gap-2 p-2 rounded-xl border border-neutral-100 bg-[#F8F8F5]">
            <div className="flex items-center gap-2 min-w-0">
              <img
                src={user.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"}
                alt="Avatar"
                className="w-8 h-8 rounded-lg object-cover border border-[#E6E6E2]"
              />
              <div className="flex-1 min-w-0">
                <div className="text-[10px] font-bold text-[#111111] truncate">My Account</div>
                <div className="text-[8px] font-medium text-[#666666] truncate">{user.email}</div>
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
