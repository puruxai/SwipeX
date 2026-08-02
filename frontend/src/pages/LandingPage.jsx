import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import soundManager from '../services/SoundManager';
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
import { motion, useMotionValue, useTransform } from 'framer-motion';
import ThreeScene from '../components/ThreeScene';

export default function LandingPage() {
  const logos = ["Stripe", "Linear", "Vercel", "Framer", "OpenAI", "Raycast", "Perplexity"];
  
  // Parallax mouse hover effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const x = (clientX / innerWidth - 0.5) * 40;
    const y = (clientY / innerHeight - 0.5) * 40;
    mouseX.set(x);
    mouseY.set(y);
  };

  const parallaxX = useTransform(mouseX, (value) => value);
  const parallaxY = useTransform(mouseY, (value) => value);

  // Stats Counters
  const [accuracy, setAccuracy] = useState(0);
  const [jobs, setJobs] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const element = document.getElementById('stats-bar-trigger');
      if (!element) return;
      const rect = element.getBoundingClientRect();
      if (rect.top < window.innerHeight) {
        // Animate count values
        let accVal = 0;
        let jobVal = 0;
        const timer = setInterval(() => {
          if (accVal < 98) {
            accVal += 2;
            setAccuracy(accVal);
          }
          if (jobVal < 1200) {
            jobVal += 30;
            setJobs(jobVal);
          }
          if (accVal >= 98 && jobVal >= 1200) {
            clearInterval(timer);
          }
        }, 30);
        window.removeEventListener('scroll', handleScroll);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleActionClick = () => {
    soundManager.playSuccess();
  };

  const handleHover = () => {
    soundManager.playHover();
  };

  return (
    <div 
      onMouseMove={handleMouseMove}
      className="space-y-28 pb-20 overflow-hidden bg-[#030509] text-[#f1f5f9] transition-colors relative min-h-screen"
    >
      {/* 3D Premium Experience Background */}
      <ThreeScene />

      {/* Background Gradient Mesh */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[800px] bg-gradient-to-br from-[#ff6b00]/10 to-transparent blur-[120px] rounded-full" />
        <div className="absolute top-[30%] right-[-10%] w-[600px] h-[600px] bg-[#7c3aed]/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-[20%] left-[-10%] w-[700px] h-[700px] bg-emerald-500/5 blur-[180px] rounded-full" />
      </div>
      
      {/* HERO SECTION WITH ENHANCED MULTI-LAYERED VISUAL WORKSPACE */}
      <section className="pt-16 lg:pt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative min-h-[90vh] flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center w-full relative z-10">
          
          {/* Left Column Text (Preserved 100% Original Content) */}
          <div className="lg:col-span-6 space-y-8 text-left">
            
            {/* Version Badge */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2.5 px-4.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-[#ffb693] backdrop-blur-md"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-[#ff6b00] animate-pulse" />
              <span>v2.0 Intelligence Now Live</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.1]"
            >
              The Intelligent Career <br />
              <span className="gradient-terracotta-text">Operating System.</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-sm sm:text-base text-[#e2bfb0] font-medium leading-relaxed max-w-lg"
            >
              SwipeX leverages proprietary neural engines to automate career workflows, analyze market shifts, and bridge the gap between talent and opportunity.
            </motion.p>

            {/* Action Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-wrap items-center gap-4 pt-2"
            >
              <Link
                to="/signup"
                onClick={handleActionClick}
                onMouseEnter={handleHover}
                className="btn-terracotta px-8 py-4 text-xs font-bold shadow-xl active:scale-95 transition-all"
              >
                Get Started
              </Link>
              <Link
                to="/jobs"
                onClick={handleActionClick}
                onMouseEnter={handleHover}
                className="btn-terracotta-outline px-8 py-4 text-xs font-bold transition-all"
              >
                View Documentation
              </Link>
            </motion.div>

          </div>

          {/* Right Column: Premium AI Career Dashboard Mockup & Floating Glass UI Cards */}
          <div className="lg:col-span-6 relative flex justify-center items-center">
            
            {/* Top Left Floating Badge */}
            <motion.div 
              style={{ x: parallaxX, y: parallaxY }}
              className="absolute -top-6 -left-6 z-20 px-4 py-2.5 rounded-2xl bg-[#191f2f]/80 backdrop-blur-xl border border-white/10 shadow-xl flex items-center gap-2.5"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span className="text-[11px] font-extrabold text-white tracking-wide">TOP 5% CANDIDATE POOL</span>
            </motion.div>
 
            {/* Top Right Floating Job Match Card */}
            <motion.div 
              style={{ x: parallaxX, y: parallaxY }}
              className="absolute -top-8 -right-8 z-20 p-5 rounded-3xl bg-[#191f2f]/85 backdrop-blur-xl border border-white/10 shadow-2xl max-w-xs space-y-3.5 hidden sm:block"
            >
              <div className="flex justify-between items-center">
                <span className="px-3 py-1 rounded-full bg-white/5 text-[#ffb693] text-[10px] font-black uppercase tracking-wider border border-white/10">
                  96% NEURAL MATCH
                </span>
                <span className="text-[10px] text-emerald-400 font-bold">100% Remote</span>
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Senior AI Engineer</h4>
                <p className="text-[11px] text-[#e2bfb0] font-semibold mt-1">NeuralStack Labs • $180k - $220k</p>
              </div>
              <div className="flex gap-1.5 pt-1">
                <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/5 text-[9px] font-bold text-[#e2bfb0]">Python</span>
                <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/5 text-[9px] font-bold text-[#e2bfb0]">FastAPI</span>
                <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/5 text-[9px] font-bold text-[#e2bfb0]">PyTorch</span>
              </div>
            </motion.div>

            {/* Primary Main Workspace Center Frame */}
            <div className="glow-card p-[1px] w-full max-w-lg shadow-2xl rounded-3xl">
              <div className="rounded-3xl bg-[#191f2f]/80 backdrop-blur-xl p-6 space-y-5 relative z-10 border border-white/5">
                
                {/* Workspace App Header */}
                <div className="flex justify-between items-center border-b border-white/5 pb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-400" />
                    <div className="w-3 h-3 rounded-full bg-amber-400" />
                    <div className="w-3 h-3 rounded-full bg-emerald-400" />
                    <span className="text-[11px] font-bold text-[#e2bfb0] ml-2">SwipeX AI Studio • Career Network</span>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-[#ff6b00]/10 text-[#ffb693] text-[9px] font-black uppercase tracking-wider border border-[#ff6b00]/20">
                    LIVE TELEMETRY
                  </div>
                </div>

                {/* Main Image Graphic (AI Career & Vector Graph Visualization) */}
                <div className="h-56 rounded-2xl overflow-hidden relative border border-white/10 group">
                  <img
                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80"
                    alt="AI Career Analytics Dashboard Workspace"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent p-5 flex flex-col justify-end text-white">
                    <div className="text-[10px] font-black uppercase tracking-widest text-[#ffb693] mb-1">NEURAL VECTOR MATCHING</div>
                    <div className="text-sm font-extrabold tracking-wide">Full-Stack AI & Infrastructure Engineering</div>
                  </div>
                </div>

                {/* Quick Metrics Bar inside Workspace */}
                <div className="grid grid-cols-3 gap-3 pt-1">
                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-center">
                    <div className="text-sm font-black text-[#ffb693]">98.4%</div>
                    <div className="text-[9px] font-bold text-[#e2bfb0] uppercase tracking-wider mt-0.5">ATS PARSE</div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-center">
                    <div className="text-sm font-black text-[#ffb693]">124</div>
                    <div className="text-[9px] font-bold text-[#e2bfb0] uppercase tracking-wider mt-0.5">MATCHES</div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-center">
                    <div className="text-sm font-black text-[#ffb693]">$195k</div>
                    <div className="text-[9px] font-bold text-[#e2bfb0] uppercase tracking-wider mt-0.5">MEDIAN</div>
                  </div>
                </div>

              </div>
            </div>

            {/* Bottom Left Floating ATS Score Card */}
            <motion.div 
              style={{ x: parallaxX, y: parallaxY }}
              className="absolute -bottom-8 -left-8 z-20 p-5 rounded-3xl bg-[#191f2f]/90 backdrop-blur-xl border border-white/10 shadow-2xl flex items-center gap-4.5 hidden sm:flex"
            >
              <div className="w-14 h-14 rounded-full border-4 border-[#ffb693] flex flex-col items-center justify-center flex-shrink-0 bg-white/5">
                <span className="text-base font-black text-white">94</span>
                <span className="text-[8px] font-bold text-[#e2bfb0] uppercase mt-0.5">ATS</span>
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">ATS Resume Diagnostics</h4>
                <p className="text-[11px] text-[#e2bfb0] font-medium mt-0.5">Impact Action Verbs: 98% • Optimal Structure</p>
                <div className="text-[10px] font-black text-[#ffb693] mt-1.5 flex items-center gap-1">VERIFIED FIT ⚡</div>
              </div>
            </motion.div>

          </div>

        </div>
      </section>

      {/* TRUSTED BY INDUSTRY LEADERS */}
      <section className="py-12 text-center space-y-6 max-w-7xl mx-auto px-4 relative z-10">
        <p className="text-[11px] font-bold uppercase tracking-widest text-[#e2bfb0] opacity-80">TRUSTED BY INDUSTRY LEADERS</p>
        <div className="flex flex-wrap justify-center items-center gap-12 sm:gap-16 opacity-50">
          {logos.map((logo, i) => (
            <span key={i} className="text-base font-black text-white tracking-tight hover:text-[#ffb693] transition-colors cursor-pointer">
              {logo}
            </span>
          ))}
        </div>
      </section>

      {/* METRICS BAR */}
      <section id="stats-bar-trigger" className="max-w-5xl mx-auto px-4 relative z-10">
        <div className="rounded-3xl bg-[#141b2b]/40 backdrop-blur-xl border border-white/10 p-8 grid grid-cols-2 text-center divide-x divide-white/10 shadow-lg">
          <div>
            <div className="text-3xl font-black text-[#ffb693] tracking-tight">{accuracy}%</div>
            <div className="text-[10px] font-black uppercase text-[#e2bfb0] tracking-widest mt-1">MATCH ACCURACY</div>
          </div>
          <div>
            <div className="text-3xl font-black text-[#ffb693] tracking-tight">{jobs}+</div>
            <div className="text-[10px] font-black uppercase text-[#e2bfb0] tracking-widest mt-1">JOBS INDEXED</div>
          </div>
        </div>
      </section>

      {/* ARCHITECTED FOR PROFESSIONAL VELOCITY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Architected for Professional Velocity</h2>
          <p className="text-sm text-[#e2bfb0] font-medium leading-relaxed">
            Our core infrastructure uses high-performance compute to deliver actionable insights in milliseconds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1: Neural Engine */}
          <div className="reference-card p-8 space-y-5 md:col-span-2 border border-white/5 bg-[#191f2f]/40">
            <div className="w-12 h-12 rounded-2xl bg-white/5 text-[#ffb693] flex items-center justify-center border border-white/10">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold">Neural Engine</h3>
            <p className="text-sm text-[#e2bfb0] leading-relaxed">
              Advanced vector embeddings that understand the nuances of career trajectory, sentiment, and latent skills better than any legacy system.
            </p>
            <div className="h-48 rounded-2xl overflow-hidden relative border border-white/10">
              <img
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80"
                alt="Neural Network Preview"
                className="w-full h-full object-cover opacity-80"
              />
            </div>
          </div>

          {/* Card 2: Workflow Logic */}
          <div className="reference-card p-8 space-y-5 border border-white/5 bg-[#191f2f]/40">
            <div className="w-12 h-12 rounded-2xl bg-white/5 text-[#ffb693] flex items-center justify-center border border-white/10">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold">Workflow Logic</h3>
            <p className="text-sm text-[#e2bfb0] leading-relaxed">
              Automate your entire career search pipeline with custom logic nodes and triggered responses.
            </p>
          </div>

          {/* Card 3: Market Analytics */}
          <div className="reference-card p-8 space-y-5 border border-white/5 bg-[#191f2f]/40">
            <div className="w-12 h-12 rounded-2xl bg-white/5 text-[#ffb693] flex items-center justify-center border border-white/10">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold">Market Analytics</h3>
            <p className="text-sm text-[#e2bfb0] leading-relaxed">
              Real-time tracking of salary benchmarks and demand shifts across 145+ industry sectors.
            </p>
          </div>

          {/* Card 4: Global Career Network */}
          <div className="reference-card bg-gradient-to-br from-[#191f2f] to-[#0c1322] border border-white/5 text-white p-8 space-y-6 md:col-span-2 flex flex-col justify-between shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-2xl rounded-full" />
            <div className="space-y-3 relative z-10">
              <h3 className="text-2xl font-extrabold tracking-tight">Global Career Network</h3>
              <p className="text-sm opacity-90 font-medium max-w-md leading-relaxed">
                Instant connectivity to hiring managers and technical recruiters at top-tier firms globally.
              </p>
            </div>
            <div className="relative z-10 pt-2">
              <Link 
                to="/signup" 
                onClick={handleActionClick}
                onMouseEnter={handleHover}
                className="px-8 py-3.5 rounded-full bg-[#ffb693] text-[#0c1322] text-xs font-black shadow-lg transition-transform hover:scale-105 active:scale-95 inline-block"
              >
                Join Network
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* PRICING SECTION */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Simple, Predictable Pricing</h2>
          <p className="text-sm text-[#e2bfb0] font-medium">Choose the plan that matches your career velocity.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto items-stretch">
          
          {/* Base */}
          <div className="reference-card p-8 flex flex-col justify-between text-center relative group border border-white/5 bg-[#191f2f]/40">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white">Base</h3>
                <div className="text-4xl font-black text-white mt-3">$0 <span className="text-xs text-[#e2bfb0] font-bold">/mo</span></div>
              </div>
              <ul className="text-xs font-medium text-[#e2bfb0] space-y-3.5 text-left border-t border-white/5 pt-5">
                <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-emerald-400" /> 5 Jobs Managed</li>
                <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-emerald-400" /> Standard Neural Analysis</li>
                <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-emerald-400" /> Email Support</li>
              </ul>
            </div>
            <div className="pt-8">
              <Link 
                to="/signup" 
                onClick={handleActionClick}
                onMouseEnter={handleHover}
                className="btn-terracotta-outline w-full py-3.5 text-xs font-bold block text-center"
              >
                Start Free
              </Link>
            </div>
          </div>

          {/* Enterprise Pro (Featured) */}
          <div className="glow-card p-[1px] flex relative transform scale-105 z-20 rounded-3xl">
            <div className="reference-card w-full p-8 flex flex-col justify-between text-center relative bg-[#191f2f] border border-[#ffb693]/20">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#ffb693] text-[#561f00] text-[9px] font-black uppercase tracking-widest shadow-md">
                MOST POPULAR
              </span>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-white mt-1">Enterprise Pro</h3>
                  <div className="text-4xl font-black text-[#ffb693] mt-3">$79 <span className="text-xs text-[#e2bfb0] font-bold">/mo</span></div>
                </div>
                <ul className="text-xs font-medium text-[#e2bfb0] space-y-3.5 text-left border-t border-white/5 pt-5">
                  <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-[#ffb693]" /> Unlimited Jobs</li>
                  <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-[#ffb693]" /> 10x Neural Engine Speed</li>
                  <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-[#ffb693]" /> Custom Workflow Logic</li>
                  <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-[#ffb693]" /> Priority API Access</li>
                </ul>
              </div>
              <div className="pt-8">
                <Link 
                  to="/signup" 
                  onClick={handleActionClick}
                  onMouseEnter={handleHover}
                  className="btn-terracotta w-full py-3.5 text-xs font-black block text-center shadow-lg"
                >
                  Get Pro Access
                </Link>
              </div>
            </div>
          </div>

          {/* Custom */}
          <div className="reference-card p-8 flex flex-col justify-between text-center relative group border border-white/5 bg-[#191f2f]/40">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white">Custom</h3>
                <div className="text-4xl font-black text-white mt-3">Inquire</div>
              </div>
              <ul className="text-xs font-medium text-[#e2bfb0] space-y-3.5 text-left border-t border-white/5 pt-5">
                <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-emerald-400" /> SLA Guarantees</li>
                <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-emerald-400" /> Dedicated Infrastructure</li>
                <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-emerald-400" /> On-site Training</li>
              </ul>
            </div>
            <div className="pt-8">
              <Link 
                to="/signup" 
                onClick={handleActionClick}
                onMouseEnter={handleHover}
                className="btn-terracotta-outline w-full py-3.5 text-xs font-bold block text-center"
              >
                Contact Sales
              </Link>
            </div>
          </div>

        </div>
      </section>

      <div className="hidden">
        <Building2 className="w-1" />
        <FileText className="w-1" />
        <Zap className="w-1" />
        <Target className="w-1" />
        <BarChart2 className="w-1" />
        <Award className="w-1" />
        <ArrowRight className="w-1" />
        <Globe className="w-1" />
      </div>

    </div>
  );
}
