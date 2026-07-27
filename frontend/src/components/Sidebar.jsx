import React from 'react';
import { Link, useLocation } from 'react-router-dom';
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
  Settings, 
  HelpCircle, 
  BookOpen, 
  Plus,
  Cpu,
  Zap
} from 'lucide-react';

export default function Sidebar() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <aside className="w-64 flex-shrink-0 bg-[#FFF9F5] dark:bg-[#0F0D0C] border-r border-[#F3E8E2] dark:border-[#3D3835] flex flex-col justify-between p-4 min-h-[90vh]">
      
      <div className="space-y-6">
        
        {/* Sidebar Brand Header */}
        <div className="flex items-center gap-2.5 px-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#FF8A3D] to-[#963200] flex items-center justify-center text-white font-black shadow-md">
            <Sparkles className="w-4.5 h-4.5" />
          </div>
          <div>
            <div className="font-extrabold text-base text-[#1C1917] dark:text-white tracking-tight">SwipeX AI</div>
            <div className="text-[10px] font-bold text-[#78716C] uppercase tracking-wider">Career Platform</div>
          </div>
        </div>

        {/* Action Button */}
        <Link
          to="/swipe"
          className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#FF8A3D] to-[#F97316] text-white font-black text-xs shadow-[0_6px_20px_rgba(255,138,61,0.35)] flex items-center justify-center gap-2 hover:scale-[1.02] transition-all"
        >
          <Plus className="w-4 h-4" /> New Experiment
        </Link>

        {/* Primary Navigation Menu */}
        <nav className="space-y-1">
          <Link
            to="/swipe"
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              isActive('/swipe')
                ? 'bg-[#FF8A3D] text-white shadow-md'
                : 'text-[#57534E] dark:text-[#A8A29E] hover:bg-[#FFF0E6] dark:hover:bg-[#262322] hover:text-[#963200]'
            }`}
          >
            <Zap className="w-4 h-4" /> Intelligence
          </Link>

          <Link
            to="/jobs"
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              isActive('/jobs')
                ? 'bg-[#FF8A3D] text-white shadow-md'
                : 'text-[#57534E] dark:text-[#A8A29E] hover:bg-[#FFF0E6] dark:hover:bg-[#262322] hover:text-[#963200]'
            }`}
          >
            <Layers className="w-4 h-4" /> Workflows
          </Link>

          <Link
            to="/resume-analyzer"
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              isActive('/resume-analyzer')
                ? 'bg-[#FF8A3D] text-white shadow-md'
                : 'text-[#57534E] dark:text-[#A8A29E] hover:bg-[#FFF0E6] dark:hover:bg-[#262322] hover:text-[#963200]'
            }`}
          >
            <Cpu className="w-4 h-4" /> Neural Engine
          </Link>

          <Link
            to="/dashboard"
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              isActive('/dashboard')
                ? 'bg-[#FF8A3D] text-white shadow-md'
                : 'text-[#57534E] dark:text-[#A8A29E] hover:bg-[#FFF0E6] dark:hover:bg-[#262322] hover:text-[#963200]'
            }`}
          >
            <BarChart3 className="w-4 h-4" /> Analytics
          </Link>

          <Link
            to="/profile"
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              isActive('/profile')
                ? 'bg-[#FF8A3D] text-white shadow-md'
                : 'text-[#57534E] dark:text-[#A8A29E] hover:bg-[#FFF0E6] dark:hover:bg-[#262322] hover:text-[#963200]'
            }`}
          >
            <Settings className="w-4 h-4" /> Settings
          </Link>
        </nav>

      </div>

      {/* Sidebar Footer Cards & Help Links */}
      <div className="space-y-4 pt-4 border-t border-[#F3E8E2] dark:border-[#3D3835]">
        
        {/* Active Experiment Promo Box */}
        <div className="p-3.5 rounded-2xl bg-[#FFF0E6] dark:bg-[#262322] border border-[#F3D2C1] dark:border-[#3D3835] space-y-2">
          <div className="text-[10px] font-black uppercase tracking-wider text-[#963200] dark:text-[#FF8A3D]">ACTIVE EXPERIMENT</div>
          <div className="text-xs font-extrabold text-[#1C1917] dark:text-white">LMM-9 Optimization</div>
          <button className="w-full py-1.5 px-3 rounded-lg bg-[#FF8A3D] text-white text-[11px] font-black shadow-sm">
            New Experiment
          </button>
        </div>

        <div className="space-y-1">
          <a href="#" className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-[#78716C] hover:text-[#963200]">
            <HelpCircle className="w-4 h-4" /> Help Center
          </a>
          <a href="#" className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-[#78716C] hover:text-[#963200]">
            <BookOpen className="w-4 h-4" /> Documentation
          </a>
        </div>

      </div>

    </aside>
  );
}
