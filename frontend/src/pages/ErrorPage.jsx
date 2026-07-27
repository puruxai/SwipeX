import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, ArrowLeft, SearchX } from 'lucide-react';
import { motion } from 'framer-motion';

export function NotFoundPage() {
  return (
    <section className="min-h-[65vh] px-4 flex items-center justify-center text-center">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md glass-panel rounded-3xl p-8 border border-slate-200 dark:border-neutral-800 space-y-5 bg-white/90 dark:bg-neutral-900/90 shadow-2xl"
      >
        <SearchX className="w-12 h-12 mx-auto text-[#FF6B00]" aria-hidden="true" />
        <p className="text-xs font-black text-[#FF6B00] uppercase tracking-widest">404 Error</p>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">Page not found</h1>
        <p className="text-xs leading-relaxed text-slate-500 dark:text-neutral-400 font-medium">The page may have moved, or the link is no longer valid.</p>
        <Link to="/" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#FF6B00] to-[#FF9D42] text-white font-black text-xs hover:scale-105 transition-all shadow-[0_4px_15px_rgba(255,107,0,0.35)]">
          <ArrowLeft className="w-4 h-4" /> Return Home
        </Link>
      </motion.div>
    </section>
  );
}

export function ApplicationErrorPage({ onRetry }) {
  return (
    <section className="min-h-[65vh] px-4 flex items-center justify-center text-center">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md glass-panel rounded-3xl p-8 border border-rose-500/40 space-y-5 bg-white/90 dark:bg-neutral-900/90 shadow-2xl"
      >
        <AlertTriangle className="w-12 h-12 mx-auto text-rose-500" aria-hidden="true" />
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">Something went wrong</h1>
        <p className="text-xs leading-relaxed text-slate-500 dark:text-neutral-400 font-medium">Please try again. If the problem persists, return to the home page and start a new session.</p>
        <div className="flex justify-center gap-3">
          <button type="button" onClick={onRetry} className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#FF6B00] to-[#FF9D42] text-white font-black text-xs hover:scale-105 transition-all shadow-[0_4px_15px_rgba(255,107,0,0.35)]">Try again</button>
          <Link to="/" className="px-5 py-3 rounded-xl glass-panel border border-slate-200 dark:border-neutral-800 text-slate-700 dark:text-neutral-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-neutral-800 transition-all">Home</Link>
        </div>
      </motion.div>
    </section>
  );
}
