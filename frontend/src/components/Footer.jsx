import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-[#E6E6E2] mt-20 text-[#666666] transition-colors">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <h3 className="font-extrabold text-lg text-[#111111] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#7ED321]" /> SwipeX AI
            </h3>
            <p className="text-xs text-[#666666] leading-relaxed font-medium">
              Empowering the next generation of workforce with intelligent insights and predictive career mapping.
            </p>
            <div className="text-[10px] font-bold text-[#666666]/70 pt-2">
              © 2026 SwipeX AI Career Platform. Built for the future of work.
            </div>
          </div>

          {/* Platform Column */}
          <div className="space-y-2 text-xs font-bold">
            <h4 className="text-xs font-extrabold text-[#111111] uppercase tracking-wider mb-2">Platform</h4>
            <div><a href="#" className="hover:text-[#7ED321] transition-colors">Privacy</a></div>
            <div><a href="#" className="hover:text-[#7ED321] transition-colors">Terms</a></div>
            <div><a href="#" className="hover:text-[#7ED321] transition-colors">AI Ethics</a></div>
          </div>

          {/* Developers Column */}
          <div className="space-y-2 text-xs font-bold">
            <h4 className="text-xs font-extrabold text-[#111111] uppercase tracking-wider mb-2">Support</h4>
            <div><a href="#" className="hover:text-[#7ED321] transition-colors">API Docs</a></div>
            <div><a href="#" className="hover:text-[#7ED321] transition-colors">Open Source</a></div>
            <div><a href="#" className="hover:text-[#7ED321] transition-colors">Status</a></div>
          </div>

          {/* Newsletter Column */}
          <div className="space-y-3 text-xs font-bold">
            <h4 className="text-xs font-extrabold text-[#111111] uppercase tracking-wider">Newsletter</h4>
            <p className="text-[11px] text-[#666666] font-medium">Get the latest insights on AI careers.</p>
            <form onSubmit={(e) => e.preventDefault()} className="flex items-center gap-1.5">
              <input
                type="email"
                placeholder="Email address"
                className="w-full px-3.5 py-2 rounded-full bg-[#F8F8F5] border border-[#E6E6E2] text-xs focus:outline-none focus:border-[#7ED321] text-[#111111]"
              />
              <button 
                type="submit" 
                className="w-8 h-8 rounded-full bg-[#7ED321] hover:bg-[#59C414] text-white flex items-center justify-center flex-shrink-0 shadow-sm hover:scale-105 transition-all"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>
      </div>
    </footer>
  );
}
