import React, { useEffect, useState } from 'react';
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

  return (
    <div className="space-y-20 pb-20 overflow-hidden bg-[#F8F8F5] text-[#111111] transition-colors relative min-h-screen">
      
      {/* Background Soft Gradients */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-[#7ED321]/5 to-transparent blur-[100px]" />
        <div className="absolute top-[25%] right-[-10%] w-[500px] h-[500px] bg-neutral-100/40 blur-[130px] rounded-full" />
      </div>
      
      {/* HERO SECTION - Minimal Premium Light SaaS Visual */}
      <section className="pt-20 lg:pt-32 max-w-7xl mx-auto px-6 sm:px-8 relative min-h-[85vh] flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center w-full relative z-10">
          
          {/* Left Column Text */}
          <div className="lg:col-span-7 space-y-8 text-left">
            
            {/* Version Badge */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#E6E6E2] text-xs font-semibold text-[#59C414] shadow-sm"
            >
              <span className="w-2 h-2 rounded-full bg-[#7ED321] animate-pulse" />
              <span>v2.0 Career OS Now Live</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-6xl font-extrabold tracking-tight text-[#111111] leading-[1.08] font-display"
            >
              The Intelligent Career <br />
              <span className="gradient-terracotta-text">Operating System.</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-sm sm:text-base text-[#666666] font-medium leading-relaxed max-w-xl"
            >
              SwipeX leverages proprietary neural engines to automate career workflows, optimize resumes against ATS screeners, and match candidates directly with modern tech employers.
            </motion.p>

            {/* Action Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap items-center gap-4 pt-1"
            >
              <Link
                to="/signup"
                className="btn-terracotta px-8 py-3.5 text-xs font-bold shadow-sm transition-all text-white"
              >
                Get Started
              </Link>
              <Link
                to="/jobs"
                className="btn-terracotta-outline px-8 py-3.5 text-xs font-bold transition-all bg-white border border-[#E6E6E2] hover:bg-[#F0F0EB] text-[#111111]"
              >
                View Documentation
              </Link>
            </motion.div>

          </div>

          {/* Right Column: Clean Light SaaS Mockup Panels */}
          <div className="lg:col-span-5 relative flex justify-center items-center">
            
            {/* Top Left Floating Badge */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="absolute -top-4 -left-4 z-20 px-4 py-2 rounded-xl bg-white border border-[#E6E6E2] shadow-md flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-[#7ED321]" />
              <span className="text-[10px] font-bold text-[#111111] tracking-wide uppercase">Top Match Verified</span>
            </motion.div>
 
            {/* Top Right Floating Job Match Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="absolute -top-6 -right-6 z-20 p-5 rounded-2xl bg-white border border-[#E6E6E2] shadow-lg max-w-xs space-y-3.5 hidden sm:block"
            >
              <div className="flex justify-between items-center gap-4">
                <span className="px-2.5 py-1 rounded-full bg-[#7ED321]/10 text-[#59C414] text-[9px] font-bold uppercase tracking-wider">
                  96% Neural Score
                </span>
                <span className="text-[9px] text-[#666666] font-bold">Remote / USA</span>
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#111111]">Senior AI Engineer</h4>
                <p className="text-[10px] text-[#666666] font-semibold mt-0.5">NeuralLabs Corp • $180k - $220k</p>
              </div>
            </motion.div>

            {/* Primary Main Workspace Center Frame */}
            <div className="w-full max-w-md p-1 bg-white border border-[#E6E6E2] rounded-3xl shadow-lg relative">
              <div className="rounded-2xl p-5 space-y-4 bg-white relative z-10">
                
                {/* Workspace App Header */}
                <div className="flex justify-between items-center border-b border-neutral-100 pb-3">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-neutral-200" />
                    <div className="w-2.5 h-2.5 rounded-full bg-neutral-200" />
                    <div className="w-2.5 h-2.5 rounded-full bg-neutral-200" />
                    <span className="text-[10px] font-bold text-[#666666] ml-2">SwipeX Workspace</span>
                  </div>
                  <div className="px-2.5 py-0.5 rounded-full bg-[#7ED321]/10 text-[#59C414] text-[8px] font-bold uppercase tracking-wider border border-[#7ED321]/20">
                    Active Telemetry
                  </div>
                </div>

                {/* Dashboard Chart Mockup */}
                <div className="h-44 rounded-xl overflow-hidden relative border border-[#E6E6E2] group">
                  <img
                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80"
                    alt="AI Career Analytics Dashboard Workspace"
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white/95 via-white/50 to-transparent p-4 flex flex-col justify-end text-[#111111]">
                    <div className="text-[8px] font-extrabold uppercase tracking-widest text-[#59C414] mb-0.5">Neural Vector Matching</div>
                    <div className="text-xs font-bold tracking-tight">Software Engineering & AI Architect roles</div>
                  </div>
                </div>

                {/* Quick Metrics Bar inside Workspace */}
                <div className="grid grid-cols-3 gap-2.5 pt-0.5">
                  <div className="p-3 rounded-xl bg-[#F8F8F5] border border-[#E6E6E2] text-center">
                    <div className="text-xs font-bold text-[#111111]">98.4%</div>
                    <div className="text-[8px] font-bold text-[#666666] uppercase mt-0.5">ATS Parse</div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#F8F8F5] border border-[#E6E6E2] text-center">
                    <div className="text-xs font-bold text-[#111111]">124</div>
                    <div className="text-[8px] font-bold text-[#666666] uppercase mt-0.5">Matches</div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#F8F8F5] border border-[#E6E6E2] text-center">
                    <div className="text-xs font-bold text-[#111111]">$195k</div>
                    <div className="text-[8px] font-bold text-[#666666] uppercase mt-0.5">Median</div>
                  </div>
                </div>

              </div>
            </div>

            {/* Bottom Left Floating ATS Score Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="absolute -bottom-6 -left-6 z-20 p-4 rounded-2xl bg-white border border-[#E6E6E2] shadow-md flex items-center gap-3 hidden sm:flex"
            >
              <div className="w-11 h-11 rounded-full border-4 border-[#7ED321] flex flex-col items-center justify-center flex-shrink-0 bg-[#F8F8F5]">
                <span className="text-xs font-bold text-[#111111]">94</span>
              </div>
              <div>
                <h4 className="text-[11px] font-bold text-[#111111]">ATS Resume Score</h4>
                <p className="text-[9px] text-[#666666] font-medium">Optimal formatting, impact structures</p>
              </div>
            </motion.div>

          </div>

        </div>
      </section>

      {/* TRUSTED BY INDUSTRY LEADERS */}
      <section className="py-8 text-center space-y-4 max-w-7xl mx-auto px-6 relative z-10">
        <p className="text-[10px] font-bold uppercase tracking-wider text-[#666666]">POWERING TALENT DISCOVERY GLOBALLY</p>
        <div className="flex flex-wrap justify-center items-center gap-10 sm:gap-14 opacity-60">
          {logos.map((logo, i) => (
            <span key={i} className="text-sm font-bold text-[#111111] hover:text-[#7ED321] transition-colors cursor-pointer">
              {logo}
            </span>
          ))}
        </div>
      </section>

      {/* METRICS BAR */}
      <section id="stats-bar-trigger" className="max-w-5xl mx-auto px-6 relative z-10">
        <div className="rounded-2xl bg-white border border-[#E6E6E2] p-6 grid grid-cols-2 text-center divide-x divide-[#E6E6E2] shadow-sm">
          <div>
            <div className="text-2xl font-black text-[#59C414]">{accuracy}%</div>
            <div className="text-[9px] font-bold uppercase text-[#666666] tracking-wider mt-0.5">MATCH ACCURACY</div>
          </div>
          <div>
            <div className="text-2xl font-black text-[#59C414]">{jobs}+</div>
            <div className="text-[9px] font-bold uppercase text-[#666666] tracking-wider mt-0.5">JOBS INDEXED</div>
          </div>
        </div>
      </section>

      {/* ARCHITECTED FOR PROFESSIONAL VELOCITY */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 space-y-12 relative z-10">
        <div className="text-center space-y-2.5 max-w-xl mx-auto">
          <h2 className="text-2xl font-extrabold text-[#111111]">Architected for Professional Velocity</h2>
          <p className="text-xs text-[#666666] font-medium leading-relaxed">
            Our core infrastructure uses high-performance compute to deliver actionable insights, ATS scoring, and career coach recommendations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1: Neural Engine */}
          <div className="reference-card p-7 space-y-4 md:col-span-2 bg-white">
            <div className="w-10 h-10 rounded-xl bg-[#F8F8F5] text-[#59C414] flex items-center justify-center border border-[#E6E6E2]">
              <Cpu className="w-4.5 h-4.5" />
            </div>
            <h3 className="text-base font-bold text-[#111111]">Neural Matching Engine</h3>
            <p className="text-xs text-[#666666] leading-relaxed">
              Advanced vector embeddings that understand the nuances of career trajectory, sentiment, and latent skills better than any legacy system.
            </p>
          </div>

          {/* Card 2: Workflow Logic */}
          <div className="reference-card p-7 space-y-4 bg-white">
            <div className="w-10 h-10 rounded-xl bg-[#F8F8F5] text-[#59C414] flex items-center justify-center border border-[#E6E6E2]">
              <Layers className="w-4.5 h-4.5" />
            </div>
            <h3 className="text-base font-bold text-[#111111]">ATS Parser & Resume Builder</h3>
            <p className="text-xs text-[#666666] leading-relaxed">
              Parse your current resume instantly and edit keywords inline using recommended ATS optimization guidelines.
            </p>
          </div>

          {/* Card 3: Market Analytics */}
          <div className="reference-card p-7 space-y-4 bg-white">
            <div className="w-10 h-10 rounded-xl bg-[#F8F8F5] text-[#59C414] flex items-center justify-center border border-[#E6E6E2]">
              <TrendingUp className="w-4.5 h-4.5" />
            </div>
            <h3 className="text-base font-bold text-[#111111]">AI Career Coach</h3>
            <p className="text-xs text-[#666666] leading-relaxed">
              Interact with a specialized AI Coach, prepare for interviews, and predict salaries based on target roles.
            </p>
          </div>

          {/* Card 4: Global Career Network */}
          <div className="reference-card bg-white border border-[#E6E6E2] p-7 space-y-5 md:col-span-2 flex flex-col justify-between shadow-sm">
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-[#111111]">Global Career Network</h3>
              <p className="text-xs text-[#666666] max-w-md leading-relaxed">
                Instant connectivity to hiring managers and recruiters looking for talent verified by SwipeX profiles.
              </p>
            </div>
            <div className="pt-2">
              <Link 
                to="/signup" 
                className="px-6 py-2.5 rounded-full bg-[#7ED321] hover:bg-[#59C414] text-white text-xs font-bold inline-block"
              >
                Join Network
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* PRICING SECTION */}
      <section className="max-w-6xl mx-auto px-6 sm:px-8 space-y-12 relative z-10">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-extrabold text-[#111111]">Simple, Predictable Pricing</h2>
          <p className="text-xs text-[#666666] font-medium">Choose the plan that matches your career velocity.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto items-stretch">
          
          {/* Base */}
          <div className="reference-card p-6 flex flex-col justify-between text-center bg-white">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-[#111111]">Base Plan</h3>
                <div className="text-3xl font-black text-[#111111] mt-2">$0 <span className="text-xs text-[#666666] font-medium">/mo</span></div>
              </div>
              <ul className="text-xs text-[#666666] space-y-3 text-left border-t border-neutral-100 pt-4 font-medium">
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#59C414]" /> 5 Jobs Managed</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#59C414]" /> Standard Neural Analysis</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#59C414]" /> Email Support</li>
              </ul>
            </div>
            <div className="pt-6">
              <Link to="/signup" className="btn-terracotta-outline w-full py-2 text-xs font-bold block text-center bg-white border border-[#E6E6E2] text-[#111111]">Start Free</Link>
            </div>
          </div>

          {/* Enterprise Pro */}
          <div className="reference-card p-6 flex flex-col justify-between text-center bg-white border-2 border-[#7ED321] relative transform scale-102">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#7ED321] text-white text-[8px] font-bold uppercase tracking-wider">
              Most Popular
            </span>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-[#111111] mt-1">Enterprise Pro</h3>
                <div className="text-3xl font-black text-[#7ED321] mt-2">$79 <span className="text-xs text-[#666666] font-medium">/mo</span></div>
              </div>
              <ul className="text-xs text-[#666666] space-y-3 text-left border-t border-neutral-100 pt-4 font-medium">
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#7ED321]" /> Unlimited Jobs</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#7ED321]" /> 10x Neural Engine Speed</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#7ED321]" /> Custom Workflow Logic</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#7ED321]" /> Priority API Access</li>
              </ul>
            </div>
            <div className="pt-6">
              <Link to="/signup" className="btn-terracotta w-full py-2 text-xs font-bold block text-center text-white">Get Pro Access</Link>
            </div>
          </div>

          {/* Custom */}
          <div className="reference-card p-6 flex flex-col justify-between text-center bg-white">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-[#111111]">Custom</h3>
                <div className="text-3xl font-black text-[#111111] mt-2">Inquire</div>
              </div>
              <ul className="text-xs text-[#666666] space-y-3 text-left border-t border-neutral-100 pt-4 font-medium">
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#59C414]" /> SLA Guarantees</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#59C414]" /> Dedicated Infrastructure</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#59C414]" /> On-site Training</li>
              </ul>
            </div>
            <div className="pt-6">
              <Link to="/signup" className="btn-terracotta-outline w-full py-2 text-xs font-bold block text-center bg-white border border-[#E6E6E2] text-[#111111]">Contact Sales</Link>
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
