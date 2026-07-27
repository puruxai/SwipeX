import React from 'react';
import { Sparkles, Heart, ShieldCheck, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <footer className="glass-panel border-t border-slate-200 dark:border-neutral-800 mt-20 bg-slate-50/70 dark:bg-neutral-900/60 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <motion.div 
              whileHover={{ rotate: 12 }}
              className="w-9 h-9 rounded-xl bg-[#FF6B00]/10 border border-[#FF6B00]/25 flex items-center justify-center shadow-sm"
            >
              <Sparkles className="w-4.5 h-4.5 text-[#FF6B00]" />
            </motion.div>
            <div>
              <span className="gradient-text font-black text-xl tracking-tight">SwipeX</span>
              <p className="text-xs text-slate-500 dark:text-neutral-400 font-medium">Next-Generation AI Career & Job Discovery Platform</p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs font-semibold text-slate-600 dark:text-neutral-400">
            <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700">
              <Cpu className="w-4 h-4 text-[#FF6B00]" /> AI Recommendation Engine v1.0
            </span>
            <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40">
              <ShieldCheck className="w-4 h-4 text-[#22C55E]" /> Enterprise 256-bit Security
            </span>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-neutral-800/60 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-medium text-slate-500 dark:text-neutral-500">
          <p>© 2026 SwipeX Platform Inc. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> using React, FastAPI, & Scikit-Learn.
          </p>
        </div>
      </div>
    </footer>
  );
}
