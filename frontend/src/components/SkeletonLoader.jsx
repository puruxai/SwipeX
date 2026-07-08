import React from 'react';

export function CardSkeleton() {
  return (
    <div className="w-full max-w-md mx-auto h-[550px] rounded-3xl glass-panel p-6 animate-pulse flex flex-col justify-between border border-white/10">
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div className="w-14 h-14 bg-slate-800 rounded-2xl"></div>
          <div className="w-20 h-6 bg-slate-800 rounded-full"></div>
        </div>
        <div className="h-6 bg-slate-800 rounded w-3/4"></div>
        <div className="h-4 bg-slate-800/80 rounded w-1/2"></div>
        <div className="flex gap-2 pt-2">
          <div className="w-20 h-5 bg-slate-800 rounded-full"></div>
          <div className="w-24 h-5 bg-slate-800 rounded-full"></div>
        </div>
        <div className="h-24 bg-slate-800/50 rounded-2xl mt-4"></div>
      </div>
      <div className="flex justify-around pt-6">
        <div className="w-14 h-14 bg-slate-800 rounded-full"></div>
        <div className="w-14 h-14 bg-slate-800 rounded-full"></div>
        <div className="w-14 h-14 bg-slate-800 rounded-full"></div>
      </div>
    </div>
  );
}

export function TableSkeleton() {
  return (
    <div className="space-y-3 animate-pulse">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="h-16 bg-slate-800/50 rounded-xl w-full"></div>
      ))}
    </div>
  );
}
