import React from 'react';
import { Link } from 'react-router-dom';
import soundManager from '../services/SoundManager';
import { AlertTriangle, ArrowLeft, SearchX } from 'lucide-react';
import { motion } from 'framer-motion';

export function NotFoundPage() {
  const handleActionClick = () => {
    soundManager.playTick();
  };

  const handleHover = () => {
    soundManager.playHover();
  };

  return (
    <section className="min-h-[65vh] px-4 flex items-center justify-center text-center bg-[#030509]">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md reference-card rounded-3xl p-8 border border-white/5 space-y-5 bg-[#191f2f]/80 shadow-2xl relative z-10"
      >
        <SearchX className="w-12 h-12 mx-auto text-[#ffb693]" aria-hidden="true" />
        <p className="text-xs font-black text-[#ffb693] uppercase tracking-widest">404 Error</p>
        <h1 className="text-3xl font-extrabold text-white">Page not found</h1>
        <p className="text-xs leading-relaxed text-[#e2bfb0] font-medium">The page may have moved, or the link is no longer valid.</p>
        <Link 
          to="/" 
          onClick={handleActionClick}
          onMouseEnter={handleHover}
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl btn-terracotta text-xs font-black shadow-md"
        >
          <ArrowLeft className="w-4 h-4" /> Return Home
        </Link>
      </motion.div>
    </section>
  );
}

export function ApplicationErrorPage({ onRetry }) {
  const handleActionClick = () => {
    soundManager.playTick();
  };

  const handleHover = () => {
    soundManager.playHover();
  };

  return (
    <section className="min-h-[65vh] px-4 flex items-center justify-center text-center bg-[#030509]">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md reference-card rounded-3xl p-8 border border-rose-500/30 space-y-5 bg-[#191f2f]/80 shadow-2xl relative z-10"
      >
        <AlertTriangle className="w-12 h-12 mx-auto text-rose-400" aria-hidden="true" />
        <h1 className="text-3xl font-extrabold text-white">Something went wrong</h1>
        <p className="text-xs leading-relaxed text-[#e2bfb0] font-medium">Please try again. If the problem persists, return to the home page and start a new session.</p>
        <div className="flex justify-center gap-3">
          <button 
            type="button" 
            onClick={() => { handleActionClick(); onRetry(); }}
            onMouseEnter={handleHover}
            className="px-5 py-3 rounded-xl btn-terracotta text-xs font-black shadow-md"
          >
            Try again
          </button>
          <Link 
            to="/" 
            onClick={handleActionClick}
            onMouseEnter={handleHover}
            className="px-5 py-3 rounded-xl btn-terracotta-outline text-xs font-bold"
          >
            Home
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
