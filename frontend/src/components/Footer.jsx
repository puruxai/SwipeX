import React from 'react';
import { ArrowRight, Share2, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#FFEBE0] dark:bg-[#1A1614] border-t border-[#F3D2C1] dark:border-[#3D3835] mt-20 text-[#57534E] dark:text-[#A8A29E] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <h3 className="font-black text-xl text-[#963200] dark:text-[#FF8A3D]">SwipeX AI</h3>
            <p className="text-xs text-[#78716C] leading-relaxed font-medium">
              Empowering the next generation of workforce with intelligent insights and predictive career mapping.
            </p>
            <div className="text-[11px] font-bold text-[#A8A29E] pt-2">
              © 2026 SwipeX AI Career Platform. Built for the future of work.
            </div>
          </div>

          {/* Platform Column */}
          <div className="space-y-2 text-xs font-bold">
            <h4 className="text-xs font-black text-[#1C1917] dark:text-white uppercase tracking-wider mb-2">Platform</h4>
            <div><a href="#" className="hover:text-[#963200]">Privacy</a></div>
            <div><a href="#" className="hover:text-[#963200]">Terms</a></div>
            <div><a href="#" className="hover:text-[#963200]">AI Ethics</a></div>
          </div>

          {/* Developers Column */}
          <div className="space-y-2 text-xs font-bold">
            <h4 className="text-xs font-black text-[#1C1917] dark:text-white uppercase tracking-wider mb-2">Support</h4>
            <div><a href="#" className="hover:text-[#963200]">API Docs</a></div>
            <div><a href="#" className="hover:text-[#963200]">Open Source</a></div>
            <div><a href="#" className="hover:text-[#963200]">Status</a></div>
          </div>

          {/* Newsletter Column */}
          <div className="space-y-3 text-xs font-bold">
            <h4 className="text-xs font-black text-[#1C1917] dark:text-white uppercase tracking-wider">Newsletter</h4>
            <p className="text-[11px] text-[#78716C] font-medium">Get the latest insights on AI careers.</p>
            <form onSubmit={(e) => e.preventDefault()} className="flex items-center gap-1.5">
              <input
                type="email"
                placeholder="Email address"
                className="w-full px-3.5 py-2 rounded-full bg-white dark:bg-[#262322] border border-[#F3E8E2] dark:border-[#3D3835] text-xs focus:outline-none focus:border-[#963200]"
              />
              <button type="submit" className="w-8 h-8 rounded-full bg-[#963200] text-white flex items-center justify-center flex-shrink-0 shadow-sm hover:scale-105 transition-all">
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>
      </div>
    </footer>
  );
}
