import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, ArrowLeft, SearchX } from 'lucide-react';
import { motion } from 'framer-motion';

export function NotFoundPage() {
  return (
    <section className="min-h-[65vh] px-4 flex items-center justify-center text-center bg-[#F8F8F5]">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md reference-card rounded-3xl p-8 border border-[#E6E6E2] space-y-5 bg-white shadow-lg relative z-10"
      >
        <SearchX className="w-12 h-12 mx-auto text-[#7ED321]" aria-hidden="true" />
        <p className="text-xs font-bold text-[#59C414] uppercase tracking-widest">404 Error</p>
        <h1 className="text-3xl font-extrabold text-[#111111]">Page not found</h1>
        <p className="text-xs leading-relaxed text-[#666666] font-medium">The page may have moved, or the link is no longer valid.</p>
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#7ED321] hover:bg-[#59C414] text-white font-bold text-xs shadow-sm transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Return Home
        </Link>
      </motion.div>
    </section>
  );
}

export function ApplicationErrorPage({ onRetry }) {
  return (
    <section className="min-h-[65vh] px-4 flex items-center justify-center text-center bg-[#F8F8F5]">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md reference-card rounded-3xl p-8 border border-rose-200 space-y-5 bg-white shadow-lg relative z-10"
      >
        <AlertTriangle className="w-12 h-12 mx-auto text-rose-500" aria-hidden="true" />
        <h1 className="text-3xl font-extrabold text-[#111111]">Something went wrong</h1>
        <p className="text-xs leading-relaxed text-[#666666] font-medium">Please try again. If the problem persists, return to the home page and start a new session.</p>
        <div className="flex justify-center gap-3">
          <button 
            type="button" 
            onClick={onRetry}
            className="px-5 py-3 rounded-full bg-[#7ED321] hover:bg-[#59C414] text-white font-bold text-xs shadow-sm transition-all"
          >
            Try again
          </button>
          <Link 
            to="/" 
            className="px-5 py-3 rounded-full border border-[#E6E6E2] hover:bg-neutral-100 text-[#111111] font-bold text-xs transition-all"
          >
            Home
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
