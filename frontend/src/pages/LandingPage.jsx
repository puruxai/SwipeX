import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  Layers, 
  FileCheck, 
  Target, 
  ArrowRight, 
  Zap, 
  CheckCircle2, 
  Award, 
  Users, 
  Shield, 
  ChevronDown,
  Star,
  Check,
  Search,
  Building2,
  TrendingUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LandingPage() {
  const [activeFaq, setActiveFaq] = useState(null);

  const faqs = [
    {
      q: "How does the AI Resume matching engine work?",
      a: "Our backend utilizes TF-IDF text similarity algorithms combined with machine learning classification. By mapping the keyword clusters of your parsed resume against active job posting requirements, we compute an immediate ATS match score and list the specific key skills missing from your profile."
    },
    {
      q: "Can I use SwipeX as a recruiter?",
      a: "Yes! SwipeX features a dedicated Recruiter Dashboard where you can publish job openings, view ranked lists of applicants, check their ATS scores, and instantly find candidates who have swiped right on your positions."
    },
    {
      q: "What file formats does the ATS parser support?",
      a: "Our high-precision parser natively supports both standard PDF and DOCX files. It extracts structured info like education history, contact details, experiences, and specialized skills in less than 2 seconds."
    },
    {
      q: "How do I upgrade to the Pro plan?",
      a: "You can sign up for a free account and choose to upgrade to our Pro tier directly from your profile settings. The Pro plan enables unlimited daily swipes, advanced ATS feedback, and early access to featured tech listings."
    }
  ];

  return (
    <div className="space-y-32 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      
      {/* 1. Hero Section */}
      <div className="text-center space-y-8 relative pt-4">
        {/* Organic mesh glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-[#FF6B00]/10 rounded-full blur-[140px] pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border border-[#FF6B00]/30 text-[#FF6B00] dark:text-[#FF9D42] text-xs font-bold uppercase tracking-wider shadow-sm"
        >
          <Sparkles className="w-4 h-4 text-[#FF6B00] animate-pulse" />
          Next-Generation AI Career Engine
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight max-w-5xl mx-auto leading-[1.05] text-slate-900 dark:text-white"
        >
          Find Your Dream Job in <span className="gradient-text">One Swipe</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="text-base sm:text-xl text-slate-600 dark:text-neutral-400 max-w-3xl mx-auto font-normal leading-relaxed"
        >
          SwipeX eliminates long application portals. By combining parsed ATS resume scores, semantic similarity analysis, and a Tinder-style swipe interface, we connect you to top tech jobs instantly.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
        >
          <Link
            to="/signup"
            className="w-full sm:w-auto px-8 py-4 text-sm font-black text-white bg-gradient-to-r from-[#FF6B00] to-[#FF9D42] rounded-2xl shadow-[0_4px_25px_rgba(255,107,0,0.4)] hover:shadow-[0_6px_35px_rgba(255,107,0,0.6)] transition-all flex items-center justify-center gap-2 hover:scale-105"
          >
            Start Swiping Now
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            to="/resume-analyzer"
            className="w-full sm:w-auto px-8 py-4 text-sm font-bold text-slate-700 dark:text-slate-200 glass-panel border border-slate-200 dark:border-neutral-800 hover:border-[#FF6B00]/40 rounded-2xl transition-all flex items-center justify-center gap-2 hover:bg-slate-100 dark:hover:bg-neutral-800/60"
          >
            <FileCheck className="w-5 h-5 text-[#FF6B00]" />
            Scan ATS Resume Score
          </Link>
        </motion.div>

        {/* Floating Badges Showcase */}
        <div className="pt-10 flex flex-wrap justify-center gap-4 text-xs font-bold text-slate-500 dark:text-neutral-400">
          <span className="flex items-center gap-2 px-4 py-2 rounded-full glass-panel border border-slate-200 dark:border-neutral-800 shadow-sm">
            <CheckCircle2 className="w-4 h-4 text-[#22C55E]" /> No 10-page application forms
          </span>
          <span className="flex items-center gap-2 px-4 py-2 rounded-full glass-panel border border-slate-200 dark:border-neutral-800 shadow-sm">
            <Zap className="w-4 h-4 text-[#FF6B00]" /> Instant 2-second resume parsing
          </span>
          <span className="flex items-center gap-2 px-4 py-2 rounded-full glass-panel border border-slate-200 dark:border-neutral-800 shadow-sm">
            <TrendingUp className="w-4 h-4 text-sky-500" /> Vector match ranking
          </span>
        </div>

        {/* 2. Interactive Mockup Showcase */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="pt-12 max-w-4xl mx-auto relative group"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-[#FF6B00] to-[#FF9D42] rounded-[32px] blur opacity-25 group-hover:opacity-40 transition duration-1000" />
          <div className="relative glass-panel rounded-[32px] p-2 border border-slate-200 dark:border-neutral-800 overflow-hidden shadow-2xl">
            {/* Top Toolbar */}
            <div className="flex items-center justify-between px-6 py-3.5 bg-slate-100 dark:bg-neutral-900 rounded-t-2xl border-b border-slate-200 dark:border-neutral-800">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500" />
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
              </div>
              <div className="text-[11px] font-black text-slate-500 dark:text-neutral-400 tracking-widest uppercase">SwipeX Active AI Feed</div>
              <div className="w-6 h-6" />
            </div>
            
            {/* Display Dashboard mockup */}
            <div className="grid grid-cols-1 md:grid-cols-12 bg-slate-50 dark:bg-neutral-950 p-6 gap-6 rounded-b-2xl">
              <div className="md:col-span-4 space-y-4">
                <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 p-4 rounded-2xl space-y-2 text-left shadow-sm">
                  <div className="text-xs font-semibold text-slate-500 dark:text-neutral-400">ATS Resume Confidence</div>
                  <div className="text-3xl font-extrabold text-[#FF6B00]">94%</div>
                  <div className="h-2 w-full bg-slate-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#FF6B00] to-[#FF9D42] w-[94%]" />
                  </div>
                </div>
                <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 p-4 rounded-2xl space-y-2 text-left shadow-sm">
                  <div className="text-xs font-semibold text-slate-500 dark:text-neutral-400">Swipes (Today)</div>
                  <div className="text-3xl font-extrabold text-slate-900 dark:text-white">48 / 50</div>
                  <div className="text-[11px] font-bold text-[#22C55E]">2 responses from tech leads</div>
                </div>
              </div>

              <div className="md:col-span-8">
                <div className="w-full h-72 bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl p-6 flex flex-col justify-between text-left relative overflow-hidden shadow-sm">
                  <div className="absolute top-0 right-0 px-4 py-1.5 bg-[#22C55E] text-xs font-black text-white rounded-bl-2xl">
                    96% Match
                  </div>
                  <div>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#FF6B00] to-[#FF9D42] flex items-center justify-center text-xl font-black text-white shadow-md">
                        SX
                      </div>
                      <div>
                        <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">Lead Machine Learning Engineer</h3>
                        <p className="text-xs font-semibold text-[#FF6B00]">SwipeX Labs • San Francisco, CA (Hybrid)</p>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-neutral-400 line-clamp-3 mb-4 leading-relaxed">
                      Spearhead development of our vector-similarity search engines and ATS parser logic using Python, PyTorch, and FastAPI. $160,000 - $210,000.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 text-xs text-slate-700 dark:text-neutral-300 font-bold">FastAPI</span>
                      <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 text-xs text-slate-700 dark:text-neutral-300 font-bold">Python</span>
                      <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 text-xs text-slate-700 dark:text-neutral-300 font-bold">PyTorch</span>
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-[#22C55E] text-xs font-bold border border-emerald-200 dark:border-emerald-800/40">Remote Allowed</span>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-slate-100 dark:border-neutral-800 flex justify-between items-center text-xs text-slate-500 dark:text-neutral-400">
                    <span className="font-medium">Swipe Right = Apply instantly</span>
                    <span className="text-[#22C55E] font-bold">ATS Scored: 94/100</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </motion.div>
      </div>

      {/* 3. Feature Grid */}
      <div className="space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white">Engineered for Modern Tech Careers</h2>
          <p className="text-slate-600 dark:text-neutral-400 max-w-2xl mx-auto font-medium">No resumes to email. No copy-pasting answers. Swipe and get hired.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div 
            whileHover={{ y: -8 }}
            className="glass-panel p-8 rounded-3xl border border-slate-200 dark:border-neutral-800 hover:border-[#FF6B00]/40 transition-all space-y-4 text-left group shadow-sm"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#FF6B00]/10 border border-[#FF6B00]/30 flex items-center justify-center">
              <Layers className="w-6 h-6 text-[#FF6B00]" />
            </div>
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white group-hover:text-[#FF6B00] transition-colors">Swipe-Based Discovery</h3>
            <p className="text-sm text-slate-600 dark:text-neutral-400 leading-relaxed">
              Ditch tedious application portals. Swipe right to apply instantly, swipe left to pass. Simple, gamified, and highly efficient.
            </p>
          </motion.div>

          <motion.div 
            whileHover={{ y: -8 }}
            className="glass-panel p-8 rounded-3xl border border-slate-200 dark:border-neutral-800 hover:border-[#FF6B00]/40 transition-all space-y-4 text-left group shadow-sm"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#FF6B00]/10 border border-[#FF6B00]/30 flex items-center justify-center">
              <FileCheck className="w-6 h-6 text-[#FF6B00]" />
            </div>
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white group-hover:text-[#FF6B00] transition-colors">AI ATS Engine</h3>
            <p className="text-sm text-slate-600 dark:text-neutral-400 leading-relaxed">
              Upload your PDF/DOCX resume and receive an immediate ATS completeness evaluation, highlighting keyword densities and layout optimizations.
            </p>
          </motion.div>

          <motion.div 
            whileHover={{ y: -8 }}
            className="glass-panel p-8 rounded-3xl border border-slate-200 dark:border-neutral-800 hover:border-[#FF6B00]/40 transition-all space-y-4 text-left group shadow-sm"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#FF6B00]/10 border border-[#FF6B00]/30 flex items-center justify-center">
              <Target className="w-6 h-6 text-[#FF6B00]" />
            </div>
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white group-hover:text-[#FF6B00] transition-colors">Semantic Vector Matching</h3>
            <p className="text-sm text-slate-600 dark:text-neutral-400 leading-relaxed">
              We translate candidate profiles and job specifications into high-dimensional vector spaces using machine learning to find the best fit.
            </p>
          </motion.div>
        </div>
      </div>

      {/* 4. Statistics Banner */}
      <div className="glass-panel rounded-[32px] p-10 border border-slate-200 dark:border-neutral-800 grid grid-cols-2 md:grid-cols-4 gap-8 text-center relative overflow-hidden shadow-sm">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-[#FF6B00]/5 to-transparent pointer-events-none" />
        <div>
          <div className="text-4xl sm:text-5xl font-black gradient-text">98%</div>
          <div className="text-xs text-slate-500 dark:text-neutral-400 mt-2 uppercase font-bold tracking-widest">ATS Accuracy</div>
        </div>
        <div>
          <div className="text-4xl sm:text-5xl font-black gradient-text">10k+</div>
          <div className="text-xs text-slate-500 dark:text-neutral-400 mt-2 uppercase font-bold tracking-widest">Applications Filed</div>
        </div>
        <div>
          <div className="text-4xl sm:text-5xl font-black gradient-text">4.5x</div>
          <div className="text-xs text-slate-500 dark:text-neutral-400 mt-2 uppercase font-bold tracking-widest">Applying Speed</div>
        </div>
        <div>
          <div className="text-4xl sm:text-5xl font-black gradient-text">100%</div>
          <div className="text-xs text-slate-500 dark:text-neutral-400 mt-2 uppercase font-bold tracking-widest">Data Privacy</div>
        </div>
      </div>

      {/* 5. Pricing Section */}
      <div className="space-y-16">
        <div className="text-center space-y-4">
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white">Transparent Pricing</h2>
          <p className="text-slate-600 dark:text-neutral-400 max-w-2xl mx-auto font-medium">Get hired faster with advanced matching features and insights.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Tier 1 */}
          <div className="glass-panel p-8 rounded-3xl border border-slate-200 dark:border-neutral-800 text-left flex flex-col justify-between space-y-8 shadow-sm">
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Free Plan</h3>
              <p className="text-xs text-slate-500 dark:text-neutral-400">Perfect for starting your search.</p>
              <div className="text-4xl font-black text-slate-900 dark:text-white">$0 <span className="text-xs text-slate-500 dark:text-neutral-400 font-normal">/ forever</span></div>
              <ul className="space-y-3 pt-4 border-t border-slate-100 dark:border-neutral-800">
                <li className="flex items-center gap-2 text-xs text-slate-600 dark:text-neutral-400 font-medium">
                  <Check className="w-4 h-4 text-[#FF6B00]" /> 10 swipes per day
                </li>
                <li className="flex items-center gap-2 text-xs text-slate-600 dark:text-neutral-400 font-medium">
                  <Check className="w-4 h-4 text-[#FF6B00]" /> Basic ATS resume scan
                </li>
                <li className="flex items-center gap-2 text-xs text-slate-600 dark:text-neutral-400 font-medium">
                  <Check className="w-4 h-4 text-[#FF6B00]" /> Standard job notifications
                </li>
              </ul>
            </div>
            <Link to="/signup" className="w-full py-3 bg-slate-100 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 rounded-xl text-center text-xs font-bold text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-neutral-700 transition-all">
              Sign Up Free
            </Link>
          </div>

          {/* Tier 2 (Pro) */}
          <div className="glass-panel p-8 rounded-3xl border border-[#FF6B00] text-left flex flex-col justify-between space-y-8 relative overflow-hidden shadow-lg">
            <div className="absolute top-0 right-0 bg-[#FF6B00] text-[10px] uppercase font-black text-white px-3 py-1 rounded-bl-xl tracking-wider">
              Popular
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Pro Swipe</h3>
              <p className="text-xs text-slate-500 dark:text-neutral-400">Accelerate your tech job discovery.</p>
              <div className="text-4xl font-black text-slate-900 dark:text-white">$9 <span className="text-xs text-slate-500 dark:text-neutral-400 font-normal">/ month</span></div>
              <ul className="space-y-3 pt-4 border-t border-slate-100 dark:border-neutral-800">
                <li className="flex items-center gap-2 text-xs text-slate-600 dark:text-neutral-400 font-medium">
                  <Check className="w-4 h-4 text-[#FF6B00]" /> Unlimited daily swipes
                </li>
                <li className="flex items-center gap-2 text-xs text-slate-600 dark:text-neutral-400 font-medium">
                  <Check className="w-4 h-4 text-[#FF6B00]" /> Detailed ATS improvement plans
                </li>
                <li className="flex items-center gap-2 text-xs text-slate-600 dark:text-neutral-400 font-medium">
                  <Check className="w-4 h-4 text-[#FF6B00]" /> Priority match recommendations
                </li>
                <li className="flex items-center gap-2 text-xs text-slate-600 dark:text-neutral-400 font-medium">
                  <Check className="w-4 h-4 text-[#FF6B00]" /> Real-time status notifications
                </li>
              </ul>
            </div>
            <Link to="/signup" className="w-full py-3 bg-gradient-to-r from-[#FF6B00] to-[#FF9D42] rounded-xl text-center text-xs font-bold text-white hover:opacity-95 transition-all hover:scale-[1.02] shadow-md">
              Upgrade to Pro
            </Link>
          </div>

          {/* Tier 3 */}
          <div className="glass-panel p-8 rounded-3xl border border-slate-200 dark:border-neutral-800 text-left flex flex-col justify-between space-y-8 shadow-sm">
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Recruiter HQ</h3>
              <p className="text-xs text-slate-500 dark:text-neutral-400">Source the best talent automatically.</p>
              <div className="text-4xl font-black text-slate-900 dark:text-white">$49 <span className="text-xs text-slate-500 dark:text-neutral-400 font-normal">/ month</span></div>
              <ul className="space-y-3 pt-4 border-t border-slate-100 dark:border-neutral-800">
                <li className="flex items-center gap-2 text-xs text-slate-600 dark:text-neutral-400 font-medium">
                  <Check className="w-4 h-4 text-[#FF6B00]" /> Active job listings (unlimited)
                </li>
                <li className="flex items-center gap-2 text-xs text-slate-600 dark:text-neutral-400 font-medium">
                  <Check className="w-4 h-4 text-[#FF6B00]" /> Custom applicant ranking vectors
                </li>
                <li className="flex items-center gap-2 text-xs text-slate-600 dark:text-neutral-400 font-medium">
                  <Check className="w-4 h-4 text-[#FF6B00]" /> Direct profile verification
                </li>
              </ul>
            </div>
            <Link to="/signup" className="w-full py-3 bg-slate-100 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 rounded-xl text-center text-xs font-bold text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-neutral-700 transition-all">
              Start Sourcing
            </Link>
          </div>

        </div>
      </div>

      {/* 6. Testimonials Section */}
      <div className="space-y-16">
        <div className="text-center space-y-4">
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white">Loved by Engineers</h2>
          <p className="text-slate-600 dark:text-neutral-400 max-w-2xl mx-auto font-medium">See how tech developers are landing roles without repetitive application forms.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-neutral-800 text-left space-y-4 relative shadow-sm">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-[#FF6B00] text-[#FF6B00]" />)}
            </div>
            <p className="text-xs text-slate-600 dark:text-neutral-300 italic leading-relaxed">
              "Being able to upload my resume, scan its ATS score, and instantly start swiping right on matching roles felt like magic. I got 3 developer interviews in my first week!"
            </p>
            <div className="flex items-center gap-3">
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80" alt="User" className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-neutral-700" />
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">David K.</h4>
                <p className="text-[10px] text-slate-500 dark:text-neutral-400 font-medium">Frontend Dev @ Vercel</p>
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-neutral-800 text-left space-y-4 relative shadow-sm">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-[#FF6B00] text-[#FF6B00]" />)}
            </div>
            <p className="text-xs text-slate-600 dark:text-neutral-300 italic leading-relaxed">
              "The ATS analyzer pinpointed exact skill keywords that were missing from my experience section. Once I updated it, my match scores on SwipeX went through the roof."
            </p>
            <div className="flex items-center gap-3">
              <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&auto=format&fit=crop&q=80" alt="User" className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-neutral-700" />
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Sarah M.</h4>
                <p className="text-[10px] text-slate-500 dark:text-neutral-400 font-medium">Backend Engineer @ Stripe</p>
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-neutral-800 text-left space-y-4 relative shadow-sm">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-[#FF6B00] text-[#FF6B00]" />)}
            </div>
            <p className="text-xs text-slate-600 dark:text-neutral-300 italic leading-relaxed">
              "I hate filling out workday application forms. With SwipeX, I swiped right on 10 roles, heard back from 2 recruiters, and accepted an offer in less than 15 days."
            </p>
            <div className="flex items-center gap-3">
              <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&auto=format&fit=crop&q=80" alt="User" className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-neutral-700" />
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Alex T.</h4>
                <p className="text-[10px] text-slate-500 dark:text-neutral-400 font-medium">ML Architect @ NeuralStack</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 7. FAQ Section */}
      <div className="space-y-16 max-w-4xl mx-auto">
        <div className="text-center space-y-4">
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white">Frequently Asked Questions</h2>
          <p className="text-slate-600 dark:text-neutral-400 font-medium">Everything you need to know about the SwipeX matching lifecycle.</p>
        </div>
        <div className="space-y-4 text-left">
          {faqs.map((faq, index) => (
            <div key={index} className="glass-panel rounded-2xl border border-slate-200 dark:border-neutral-800 overflow-hidden shadow-sm">
              <button
                onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                className="w-full flex items-center justify-between px-6 py-5 text-left font-bold text-slate-900 dark:text-white hover:bg-slate-100/50 dark:hover:bg-neutral-800/40 transition-all"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${activeFaq === index ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence initial={false}>
                {activeFaq === index && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="border-t border-slate-100 dark:border-neutral-800 bg-slate-50/50 dark:bg-neutral-900/50"
                  >
                    <div className="px-6 py-4 text-xs text-slate-600 dark:text-neutral-300 leading-relaxed font-normal">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>

      {/* 8. Call To Action */}
      <div className="glass-panel rounded-[32px] p-12 border border-slate-200 dark:border-neutral-800 text-center space-y-8 relative overflow-hidden shadow-lg">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#FF6B00]/10 rounded-full blur-[90px]" />
        <h2 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight text-slate-900 dark:text-white">Ready to Find Your Next Challenge?</h2>
        <p className="text-slate-600 dark:text-neutral-400 max-w-xl mx-auto text-sm leading-relaxed font-medium">
          Create your account, scan your ATS score, upload your resume, and start matching with top tech jobs today.
        </p>
        <div>
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 px-8 py-4 text-sm font-black text-white bg-gradient-to-r from-[#FF6B00] to-[#FF9D42] rounded-2xl shadow-[0_4px_25px_rgba(255,107,0,0.45)] hover:scale-105 transition-all"
          >
            Create Your Account
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>

    </div>
  );
}
