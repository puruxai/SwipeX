import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, ArrowLeft, SearchX } from 'lucide-react';

export function NotFoundPage() {
  return (
    <section className="min-h-[65vh] px-4 flex items-center justify-center text-center">
      <div className="max-w-md glass-panel rounded-3xl p-8 border border-white/10 space-y-5">
        <SearchX className="w-12 h-12 mx-auto text-cyan-400" aria-hidden="true" />
        <p className="text-sm font-bold text-indigo-300 uppercase tracking-widest">404</p>
        <h1 className="text-3xl font-extrabold text-white">Page not found</h1>
        <p className="text-sm leading-relaxed text-slate-400">The page may have moved, or the link is no longer valid.</p>
        <Link to="/" className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-500 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Return home
        </Link>
      </div>
    </section>
  );
}

export function ApplicationErrorPage({ onRetry }) {
  return (
    <section className="min-h-[65vh] px-4 flex items-center justify-center text-center">
      <div className="max-w-md glass-panel rounded-3xl p-8 border border-rose-500/30 space-y-5">
        <AlertTriangle className="w-12 h-12 mx-auto text-rose-400" aria-hidden="true" />
        <h1 className="text-3xl font-extrabold text-white">Something went wrong</h1>
        <p className="text-sm leading-relaxed text-slate-400">Please try again. If the problem persists, return to the home page and start a new session.</p>
        <div className="flex justify-center gap-3">
          <button type="button" onClick={onRetry} className="px-5 py-3 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-500 transition-colors">Try again</button>
          <Link to="/" className="px-5 py-3 rounded-xl glass-panel border border-white/10 text-white font-bold text-sm">Home</Link>
        </div>
      </div>
    </section>
  );
}
