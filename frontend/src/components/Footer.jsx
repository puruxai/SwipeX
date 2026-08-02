import React from 'react';
import soundManager from '../services/SoundManager';
import { ArrowRight, Share2, Sparkles } from 'lucide-react';

export default function Footer() {
  const handleActionClick = () => {
    soundManager.playTick();
  };

  const handleHover = () => {
    soundManager.playHover();
  };

  return (
    <footer className="bg-[#030509]/60 border-t border-white/5 mt-20 text-[#e2bfb0]/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <h3 className="font-black text-xl text-[#ffb693]">SwipeX AI</h3>
            <p className="text-xs text-[#e2bfb0]/80 leading-relaxed font-medium">
              Empowering the next generation of workforce with intelligent insights and predictive career mapping.
            </p>
            <div className="text-[11px] font-bold text-[#e2bfb0]/60 pt-2">
              © 2026 SwipeX AI Career Platform. Built for the future of work.
            </div>
          </div>

          {/* Platform Column */}
          <div className="space-y-2 text-xs font-bold">
            <h4 className="text-xs font-black text-white uppercase tracking-wider mb-2">Platform</h4>
            <div><a href="#" onMouseEnter={handleHover} onClick={handleActionClick} className="hover:text-[#ffb693]">Privacy</a></div>
            <div><a href="#" onMouseEnter={handleHover} onClick={handleActionClick} className="hover:text-[#ffb693]">Terms</a></div>
            <div><a href="#" onMouseEnter={handleHover} onClick={handleActionClick} className="hover:text-[#ffb693]">AI Ethics</a></div>
          </div>

          {/* Developers Column */}
          <div className="space-y-2 text-xs font-bold">
            <h4 className="text-xs font-black text-white uppercase tracking-wider mb-2">Support</h4>
            <div><a href="#" onMouseEnter={handleHover} onClick={handleActionClick} className="hover:text-[#ffb693]">API Docs</a></div>
            <div><a href="#" onMouseEnter={handleHover} onClick={handleActionClick} className="hover:text-[#ffb693]">Open Source</a></div>
            <div><a href="#" onMouseEnter={handleHover} onClick={handleActionClick} className="hover:text-[#ffb693]">Status</a></div>
          </div>

          {/* Newsletter Column */}
          <div className="space-y-3 text-xs font-bold">
            <h4 className="text-xs font-black text-white uppercase tracking-wider">Newsletter</h4>
            <p className="text-[11px] text-[#e2bfb0]/80 font-medium">Get the latest insights on AI careers.</p>
            <form onSubmit={(e) => e.preventDefault()} className="flex items-center gap-1.5">
              <input
                type="email"
                placeholder="Email address"
                className="w-full px-3.5 py-2.5 rounded-full bg-white/5 border border-white/10 text-xs focus:outline-none focus:border-[#ff6b00] text-white"
              />
              <button 
                type="submit" 
                onClick={handleActionClick}
                onMouseEnter={handleHover}
                className="w-8 h-8 rounded-full bg-[#ff6b00] text-white flex items-center justify-center flex-shrink-0 shadow-sm hover:scale-105 transition-all"
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
