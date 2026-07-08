import React from 'react';
import { Sparkles, Heart, ShieldCheck, Cpu } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="glass-panel border-t border-white/10 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-indigo-400" />
            </div>
            <div>
              <span className="gradient-text font-extrabold text-lg">SwipeX</span>
              <p className="text-xs text-slate-400">AI Swipe-Based Intelligent Job Discovery & Career Assistance Platform</p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs text-slate-400">
            <span className="flex items-center gap-1.5"><Cpu className="w-4 h-4 text-cyan-400" /> AI Engine v1.0 Active</span>
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-400" /> 256-bit JWT Secured</span>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>© 2026 SwipeX Platform Inc. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500" /> using React, FastAPI, & Scikit-Learn.
          </p>
        </div>
      </div>
    </footer>
  );
}
