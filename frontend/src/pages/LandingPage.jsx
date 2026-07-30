import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  Cpu, 
  Layers, 
  TrendingUp, 
  Globe, 
  Check, 
  Building2,
  FileText,
  Zap,
  Target,
  BarChart2,
  CheckCircle2,
  Award
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function LandingPage() {
  const logos = ["Stripe", "Linear", "Vercel", "Framer", "OpenAI", "Raycast", "Perplexity"];

  return (
    <div className="space-y-20 pb-16 overflow-hidden bg-[#FFF9F5] text-[#1C1917]">
      
      {/* HERO SECTION WITH ENHANCED MULTI-LAYERED VISUAL WORKSPACE */}
      <section className="pt-12 lg:pt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Soft Background Gradient Blobs */}
        <div className="absolute top-10 right-10 w-96 h-96 bg-[#963200]/10 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse-slow" />
        <div className="absolute top-40 right-48 w-80 h-80 bg-[#FF8A3D]/15 rounded-full blur-2xl pointer-events-none -z-10" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column Text (Preserved 100% Original Content) */}
          <div className="lg:col-span-6 space-y-6 text-left">
            
            {/* Version Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFF0E6] border border-[#F3D2C1] text-xs font-bold text-[#963200]">
              <span className="w-2 h-2 rounded-full bg-[#963200]" />
              <span>v2.0 Intelligence Now Live</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-[#1C1917] leading-[1.1]">
              The Intelligent Career <br />
              <span className="text-[#963200]">Operating System.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-[#78716C] font-medium leading-relaxed max-w-lg">
              SwipeX leverages proprietary neural engines to automate career workflows, analyze market shifts, and bridge the gap between talent and opportunity.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/signup"
                className="px-7 py-3.5 rounded-xl bg-[#963200] hover:bg-[#802B00] text-white text-xs font-black shadow-[0_6px_20px_rgba(150,50,0,0.3)] transition-all hover:scale-105"
              >
                Get Started
              </Link>
              <Link
                to="/jobs"
                className="px-7 py-3.5 rounded-xl border border-[#F3E8E2] bg-white text-xs font-bold text-[#57534E] hover:bg-[#FFF0E6] hover:text-[#963200] transition-all"
              >
                View Documentation
              </Link>
            </div>

          </div>

          {/* Right Column: Premium AI Career Dashboard Mockup & Floating Glass UI Cards */}
          <div className="lg:col-span-6 relative">
            
            {/* Top Left Floating Badge */}
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute -top-4 -left-4 z-20 px-3.5 py-1.5 rounded-2xl bg-white border border-[#F3E8E2] shadow-lg flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span className="text-[11px] font-black text-[#1C1917]">TOP 5% CANDIDATE POOL</span>
            </motion.div>

            {/* Top Right Floating Job Match Card */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="absolute -top-6 -right-4 z-20 p-4 rounded-3xl bg-white/95 backdrop-blur-md border border-[#F3E8E2] shadow-2xl max-w-xs space-y-2.5 hidden sm:block"
            >
              <div className="flex justify-between items-center">
                <span className="px-2.5 py-0.5 rounded-full bg-[#FFF0E6] text-[#963200] text-[10px] font-black uppercase">
                  96% NEURAL MATCH
                </span>
                <span className="text-[10px] text-emerald-600 font-bold">100% Remote</span>
              </div>
              <div>
                <h4 className="text-xs font-black text-[#1C1917]">Senior AI Engineer</h4>
                <p className="text-[11px] text-[#78716C] font-semibold">NeuralStack Labs • $180k - $220k</p>
              </div>
              <div className="flex gap-1">
                <span className="px-2 py-0.5 rounded bg-[#FFF0E6] text-[10px] font-bold text-[#57534E]">Python</span>
                <span className="px-2 py-0.5 rounded bg-[#FFF0E6] text-[10px] font-bold text-[#57534E]">FastAPI</span>
                <span className="px-2 py-0.5 rounded bg-[#FFF0E6] text-[10px] font-bold text-[#57534E]">PyTorch</span>
              </div>
            </motion.div>

            {/* Primary Main Workspace Center Frame */}
            <div className="rounded-3xl border border-[#F3E8E2] bg-white p-5 shadow-2xl space-y-4 relative z-10">
              
              {/* Workspace App Header */}
              <div className="flex justify-between items-center border-b border-[#F3E8E2] pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                  <span className="text-[11px] font-bold text-[#78716C] ml-2">SwipeX AI Studio • Career Network</span>
                </div>
                <div className="px-2.5 py-0.5 rounded-full bg-[#FFF0E6] text-[#963200] text-[10px] font-black uppercase">
                  LIVE TELEMETRY
                </div>
              </div>

              {/* Main Image Graphic (AI Career & Vector Graph Visualization) */}
              <div className="h-56 rounded-2xl overflow-hidden relative border border-[#F3E8E2]">
                <img
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80"
                  alt="AI Career Analytics Dashboard Workspace"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-4 flex flex-col justify-end text-white">
                  <div className="text-xs font-black uppercase tracking-wider text-[#FF8A3D]">NEURAL VECTOR MATCHING</div>
                  <div className="text-sm font-extrabold">Full-Stack AI & Infrastructure Engineering</div>
                </div>
              </div>

              {/* Quick Metrics Bar inside Workspace */}
              <div className="grid grid-cols-3 gap-2 text-center pt-1">
                <div className="p-2 rounded-xl bg-[#FFF0E6] border border-[#F3D2C1]">
                  <div className="text-xs font-black text-[#963200]">98.4%</div>
                  <div className="text-[9px] font-bold text-[#78716C] uppercase">ATS PARSE</div>
                </div>
                <div className="p-2 rounded-xl bg-[#FFF0E6] border border-[#F3D2C1]">
                  <div className="text-xs font-black text-[#963200]">124</div>
                  <div className="text-[9px] font-bold text-[#78716C] uppercase">MATCHES</div>
                </div>
                <div className="p-2 rounded-xl bg-[#FFF0E6] border border-[#F3D2C1]">
                  <div className="text-xs font-black text-[#963200]">$195k</div>
                  <div className="text-[9px] font-bold text-[#78716C] uppercase">MEDIAN</div>
                </div>
              </div>

            </div>

            {/* Bottom Left Floating ATS Score Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="absolute -bottom-6 -left-6 z-20 p-4 rounded-3xl bg-white/95 backdrop-blur-md border border-[#F3E8E2] shadow-2xl flex items-center gap-4 hidden sm:flex"
            >
              <div className="w-14 h-14 rounded-full border-4 border-[#963200] flex flex-col items-center justify-center flex-shrink-0 bg-[#FFF0E6]">
                <span className="text-base font-black text-[#963200]">94</span>
                <span className="text-[8px] font-bold text-[#78716C] uppercase">ATS</span>
              </div>
              <div>
                <h4 className="text-xs font-black text-[#1C1917]">ATS Resume Diagnostics</h4>
                <p className="text-[11px] text-[#78716C] font-medium">Impact Action Verbs: 98% • Optimal Structure</p>
                <div className="text-[10px] font-black text-[#963200] mt-1">VERIFIED FIT ⚡</div>
              </div>
            </motion.div>

          </div>

        </div>
      </section>

      {/* TRUSTED BY INDUSTRY LEADERS */}
      <section className="py-8 text-center space-y-4 max-w-7xl mx-auto px-4">
        <p className="text-[11px] font-black uppercase tracking-widest text-[#A8A29E]">TRUSTED BY INDUSTRY LEADERS</p>
        <div className="flex flex-wrap justify-center items-center gap-12 opacity-60">
          {logos.map((logo, i) => (
            <span key={i} className="text-base font-black text-[#78716C] tracking-tight hover:text-[#963200] transition-colors">
              {logo}
            </span>
          ))}
        </div>
      </section>

      {/* METRICS BAR */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="rounded-2xl bg-[#FFF0E6] border border-[#F3D2C1] p-6 grid grid-cols-2 text-center divide-x divide-[#F3D2C1]">
          <div>
            <div className="text-2xl font-black text-[#963200]">98%</div>
            <div className="text-[11px] font-extrabold uppercase text-[#78716C]">MATCH ACCURACY</div>
          </div>
          <div>
            <div className="text-2xl font-black text-[#963200]">1,200+</div>
            <div className="text-[11px] font-extrabold uppercase text-[#78716C]">JOBS INDEXED</div>
          </div>
        </div>
      </section>

      {/* ARCHITECTED FOR PROFESSIONAL VELOCITY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h2 className="text-3xl font-black text-[#1C1917] tracking-tight">Architected for Professional Velocity</h2>
          <p className="text-xs text-[#78716C] font-medium">
            Our core infrastructure uses high-performance compute to deliver actionable insights in milliseconds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Neural Engine */}
          <div className="rounded-3xl border border-[#F3E8E2] bg-white p-6 space-y-4 shadow-sm md:col-span-2">
            <div className="w-10 h-10 rounded-xl bg-[#FFF0E6] text-[#963200] flex items-center justify-center font-bold">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-black text-[#1C1917]">Neural Engine</h3>
            <p className="text-xs text-[#78716C] font-medium">
              Advanced vector embeddings that understand the nuances of career trajectory, sentiment, and latent skills better than any legacy system.
            </p>
            <div className="h-40 rounded-2xl bg-slate-950 p-4 text-white overflow-hidden relative">
              <img
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80"
                alt="Neural Network Preview"
                className="w-full h-full object-cover rounded-xl opacity-80"
              />
            </div>
          </div>

          {/* Card 2: Workflow Logic */}
          <div className="rounded-3xl border border-[#F3E8E2] bg-white p-6 space-y-4 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-[#FFF0E6] text-[#963200] flex items-center justify-center font-bold">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-black text-[#1C1917]">Workflow Logic</h3>
            <p className="text-xs text-[#78716C] font-medium">
              Automate your entire career search pipeline with custom logic nodes and triggered responses.
            </p>
          </div>

          {/* Card 3: Market Analytics */}
          <div className="rounded-3xl border border-[#F3E8E2] bg-white p-6 space-y-4 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-[#FFF0E6] text-[#963200] flex items-center justify-center font-bold">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-black text-[#1C1917]">Market Analytics</h3>
            <p className="text-xs text-[#78716C] font-medium">
              Real-time tracking of salary benchmarks and demand shifts across 145+ industry sectors.
            </p>
          </div>

          {/* Card 4: Global Career Network (Dark Terracotta Card) */}
          <div className="rounded-3xl bg-[#963200] text-white p-6 space-y-4 shadow-xl md:col-span-2 flex flex-col justify-between">
            <div className="space-y-2">
              <h3 className="text-xl font-black">Global Career Network</h3>
              <p className="text-xs opacity-90 font-medium max-w-md">
                Instant connectivity to hiring managers and technical recruiters at top-tier firms globally.
              </p>
            </div>
            <div>
              <Link to="/signup" className="px-5 py-2.5 rounded-xl bg-white text-[#963200] text-xs font-black inline-block shadow-sm">
                Join Network
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* PRICING SECTION */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-black text-[#1C1917]">Simple, Predictable Pricing</h2>
          <p className="text-xs text-[#78716C] font-medium">Choose the plan that matches your career velocity.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Base */}
          <div className="rounded-3xl border border-[#F3E8E2] bg-white p-8 space-y-6 text-center shadow-sm">
            <div>
              <h3 className="text-lg font-black text-[#1C1917]">Base</h3>
              <div className="text-3xl font-black text-[#1C1917] mt-2">$0 <span className="text-xs text-[#78716C] font-bold">/mo</span></div>
            </div>
            <ul className="text-xs font-medium text-[#57534E] space-y-2 text-left">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> 5 Jobs Managed</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Standard Neural Analysis</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Email Support</li>
            </ul>
            <Link to="/signup" className="btn-terracotta-outline w-full py-3 text-xs font-bold block">Start Free</Link>
          </div>

          {/* Enterprise Pro (Featured) */}
          <div className="rounded-3xl border-2 border-[#963200] bg-white p-8 space-y-6 text-center shadow-xl relative">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#963200] text-white text-[10px] font-black uppercase tracking-wider">
              MOST POPULAR
            </span>
            <div>
              <h3 className="text-lg font-black text-[#1C1917]">Enterprise Pro</h3>
              <div className="text-3xl font-black text-[#963200] mt-2">$79 <span className="text-xs text-[#78716C] font-bold">/mo</span></div>
            </div>
            <ul className="text-xs font-medium text-[#57534E] space-y-2 text-left">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#963200]" /> Unlimited Jobs</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#963200]" /> 10x Neural Engine Speed</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#963200]" /> Custom Workflow Logic</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#963200]" /> Priority API Access</li>
            </ul>
            <Link to="/signup" className="btn-terracotta w-full py-3 text-xs font-black block">Get Pro Access</Link>
          </div>

          {/* Custom */}
          <div className="rounded-3xl border border-[#F3E8E2] bg-white p-8 space-y-6 text-center shadow-sm">
            <div>
              <h3 className="text-lg font-black text-[#1C1917]">Custom</h3>
              <div className="text-3xl font-black text-[#1C1917] mt-2">Inquire</div>
            </div>
            <ul className="text-xs font-medium text-[#57534E] space-y-2 text-left">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> SLA Guarantees</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Dedicated Infrastructure</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> On-site Training</li>
            </ul>
            <Link to="/signup" className="btn-terracotta-outline w-full py-3 text-xs font-bold block">Contact Sales</Link>
          </div>

        </div>
      </section>

    </div>
  );
}
