import React from 'react';
import { Sparkles, Heart, ShieldCheck, Cpu } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="glass-panel border-t border-[#262626] mt-20 bg-[#0B0B0B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#FF6B00]/10 border border-[#FF6B00]/25 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#FF8A3D]" />
            </div>
            <div>
              <span className="gradient-text font-extrabold text-lg">SwipeX</span>
              <p className="text-xs text-[#A8A8A8]">AI Swipe-Based Intelligent Job Discovery & Career Assistance Platform</p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs text-[#A8A8A8]">
            <span className="flex items-center gap-1.5"><Cpu className="w-4 h-4 text-[#FF6B00]" /> AI Engine v1.0 Active</span>
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-[#22C55E]" /> 256-bit JWT Secured</span>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-[#262626]/40 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-[#A8A8A8]">
          <p>© 2026 SwipeX Platform Inc. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-[#EF4444] fill-[#EF4444]" /> using React, FastAPI, & Scikit-Learn.
          </p>
        </div>
      </div>
    </footer>
  );
}
