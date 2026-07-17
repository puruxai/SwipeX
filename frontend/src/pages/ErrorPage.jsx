import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, ArrowLeft, SearchX } from 'lucide-react';

export function NotFoundPage() {
  return (
    <section className="min-h-[65vh] px-4 flex items-center justify-center text-center">
      <div className="max-w-md glass-panel rounded-3xl p-8 border border-[#262626] space-y-5 bg-[#181818]/80">
        <SearchX className="w-12 h-12 mx-auto text-[#FF8A3D]" aria-hidden="true" />
        <p className="text-sm font-bold text-[#FF6B00] uppercase tracking-widest">404</p>
        <h1 className="text-3xl font-extrabold text-white">Page not found</h1>
        <p className="text-sm leading-relaxed text-[#A8A8A8]">The page may have moved, or the link is no longer valid.</p>
        <Link to="/" className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#FF6B00] to-[#FF8A3D] text-white font-bold text-sm hover:scale-105 transition-all shadow-[0_4px_15px_rgba(255,107,0,0.3)]">
          <ArrowLeft className="w-4 h-4" /> Return home
        </Link>
      </div>
    </section>
  );
}

export function ApplicationErrorPage({ onRetry }) {
  return (
    <section className="min-h-[65vh] px-4 flex items-center justify-center text-center">
      <div className="max-w-md glass-panel rounded-3xl p-8 border border-rose-500/40 space-y-5 bg-[#181818]/80">
        <AlertTriangle className="w-12 h-12 mx-auto text-rose-400" aria-hidden="true" />
        <h1 className="text-3xl font-extrabold text-white">Something went wrong</h1>
        <p className="text-sm leading-relaxed text-[#A8A8A8]">Please try again. If the problem persists, return to the home page and start a new session.</p>
        <div className="flex justify-center gap-3">
          <button type="button" onClick={onRetry} className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#FF6B00] to-[#FF8A3D] text-white font-bold text-sm hover:scale-105 transition-all shadow-[0_4px_15px_rgba(255,107,0,0.3)]">Try again</button>
          <Link to="/" className="px-5 py-3 rounded-xl glass-panel border border-[#262626] text-white font-bold text-sm hover:bg-white/5 transition-all">Home</Link>
        </div>
      </div>
    </section>
  );
}
