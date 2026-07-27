import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  Play, 
  Layers, 
  FileText, 
  Zap, 
  ShieldCheck, 
  Bot, 
  CheckCircle2, 
  TrendingUp, 
  ChevronDown, 
  ChevronUp, 
  Building2, 
  Star, 
  Users, 
  Briefcase, 
  Award,
  Globe,
  Heart,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LandingPage() {
  const [activeDemoTab, setActiveDemoTab] = useState('ats'); // 'ats' | 'coach' | 'match'
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const logos = [
    "Stripe", "Linear", "Vercel", "Framer", "OpenAI", "Raycast", "Perplexity"
  ];

  const features = [
    {
      icon: <Layers className="w-6 h-6 text-[#FF6B00]" />,
      title: "Swipe Right Job Discovery",
      description: "Tinder-style gesture card feed. Swipe right to apply instantly, swipe left to skip, swipe up to save roles for later."
    },
    {
      icon: <FileText className="w-6 h-6 text-[#FF6B00]" />,
      title: "Real-Time 0-100 ATS Gauge",
      description: "Instantly parse PDF/DOCX resumes with NLP algorithms evaluating contact info, section structure, and action verbs."
    },
    {
      icon: <Zap className="w-6 h-6 text-[#FF6B00]" />,
      title: "TF-IDF Vector Job Matching",
      description: "Calculate semantic cosine similarity between candidate experience vectors and job requirement matrices."
    },
    {
      icon: <Bot className="w-6 h-6 text-[#FF6B00]" />,
      title: "AI Career & Interview Coach",
      description: "Practice behavioral and STAR method interview questions with instant automated evaluation and scoring."
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-[#FF6B00]" />,
      title: "Skill Gap & Salary Predictor",
      description: "Identify missing high-demand technical skills across postings and estimate market compensation ranges."
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-[#FF6B00]" />,
      title: "Enterprise Security & Isolation",
      description: "Role-based access controls (RBAC), OAuth2 JWT authentication, and zero hardcoded secret data isolation."
    }
  ];

  const faqs = [
    {
      question: "How does the SwipeX AI matching algorithm work?",
      answer: "SwipeX parses your resume to extract technical skill vectors and calculates TF-IDF cosine similarity against target job descriptions. The feed adapts dynamically based on your previous swipe right interactions."
    },
    {
      question: "Can I upload multiple resume formats?",
      answer: "Yes, SwipeX supports PDF, DOCX, and TXT files. Our parser extracts section headers, action verbs, and skill matrices automatically."
    },
    {
      question: "Is SwipeX free for job seekers?",
      answer: "SwipeX is 100% free for candidates! You get unlimited swipes, ATS resume scoring, AI Career Coach interactions, and salary predictions."
    },
    {
      question: "How do recruiters review applications?",
      answer: "Recruiters access Recruiter HQ, where candidate applications are ranked automatically by AI Match % and ATS Score for instant shortlisting."
    }
  ];

  return (
    <div className="space-y-24 pb-16 overflow-hidden">
      
      {/* HERO SECTION */}
      <section className="relative pt-12 lg:pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        
        {/* Background Ambient Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#FF6B00]/10 blur-[130px] rounded-full pointer-events-none -z-10" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column Text */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-6 text-left"
          >
            {/* Announcement Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-xs font-bold text-slate-800 dark:text-slate-200">
              <span className="w-2 h-2 rounded-full bg-[#FF6B00] animate-ping" />
              <Sparkles className="w-3.5 h-3.5 text-[#FF6B00]" />
              <span>Next-Gen AI Job Discovery Platform</span>
            </div>

            {/* Display Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.08]">
              Swipe Right on Your <br />
              <span className="gradient-text">Next Dream Career</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-medium leading-relaxed max-w-xl">
              SwipeX combines Tinder-style gesture discovery with Python TF-IDF AI matching, real-time 0-100 ATS resume scoring, and STAR interview coaching.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <Link
                to="/signup"
                className="btn-primary px-8 py-4 text-sm font-black flex items-center justify-center gap-2.5 group shadow-[0_10px_30px_rgba(255,107,0,0.35)]"
              >
                Start Swiping Free
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/login"
                className="px-8 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-extrabold text-slate-900 dark:text-white flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <Play className="w-4 h-4 text-[#FF6B00] fill-[#FF6B00]" />
                Explore Demo Presets
              </Link>
            </div>

            {/* Metrics Bar */}
            <div className="pt-8 border-t border-slate-200/80 dark:border-slate-800 grid grid-cols-3 gap-6">
              <div>
                <div className="text-2xl font-black text-slate-900 dark:text-white">98.4%</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold">ATS Accuracy</div>
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900 dark:text-white">10k+</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Matched Roles</div>
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900 dark:text-white">&lt;2 sec</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Parse Speed</div>
              </div>
            </div>

          </motion.div>

          {/* Right Column Floating Card Preview */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-5 relative"
          >
            {/* Animated Card Container */}
            <div className="luxury-card p-6 border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 shadow-2xl space-y-6 relative z-10">
              
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-lg shadow-md">
                    N
                  </div>
                  <div>
                    <h3 className="font-black text-base text-slate-900 dark:text-white">Senior AI Engineer</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">NeuralStack Labs • San Francisco, CA</p>
                  </div>
                </div>
                <div className="px-3 py-1.5 rounded-full bg-[#FF6B00]/10 border border-[#FF6B00]/25 text-[#FF6B00] font-black text-xs">
                  96% Match
                </div>
              </div>

              {/* Card Meta Badges */}
              <div className="flex flex-wrap gap-2 text-xs font-bold text-slate-600 dark:text-slate-300">
                <span className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800">$180k - $220k</span>
                <span className="px-3 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 border border-emerald-200 dark:border-emerald-800">100% Remote</span>
                <span className="px-3 py-1 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 border border-purple-200 dark:border-purple-800">Growth Startup</span>
              </div>

              {/* Skills Fit Matrix */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Matching Skill Matrix</div>
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 text-xs font-bold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Python FastAPI
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 text-xs font-bold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> PyTorch
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 text-xs font-bold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> React 18
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-600 text-xs font-bold">
                    ! Docker K8s
                  </span>
                </div>
              </div>

              {/* Floating Action Buttons */}
              <div className="flex items-center justify-center gap-4 pt-2">
                <div className="w-12 h-12 rounded-full border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/40 text-rose-500 flex items-center justify-center font-black shadow-sm">
                  ✕
                </div>
                <div className="w-14 h-14 rounded-full bg-gradient-to-r from-[#FF6B00] to-[#FF9D42] text-white flex items-center justify-center font-black text-xl shadow-[0_8px_25px_rgba(255,107,0,0.45)]">
                  ➔
                </div>
              </div>

            </div>
          </motion.div>

        </div>
      </section>

      {/* TRUSTED COMPANY LOGOS */}
      <section className="border-y border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 py-10">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-4">
          <p className="text-xs uppercase font-extrabold tracking-widest text-slate-400">Trusted by Candidates & Recruiters at Leading Tech Organizations</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-70">
            {logos.map((logo, i) => (
              <span key={i} className="text-lg font-black tracking-tight text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
                {logo}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* INTERACTIVE AI DEMO PREVIEW SWITCHER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            See the AI Engine in Action
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
            Explore live interactive previews of our ATS Scorer, AI Career Strategy Coach, and TF-IDF Job Matching Matrix.
          </p>
        </div>

        {/* Demo Tabs */}
        <div className="flex justify-center gap-2 max-w-md mx-auto">
          <button
            onClick={() => setActiveDemoTab('ats')}
            className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
              activeDemoTab === 'ats'
                ? 'bg-[#FF6B00] text-white shadow-md shadow-orange-500/25'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            ATS Scorer
          </button>
          <button
            onClick={() => setActiveDemoTab('coach')}
            className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
              activeDemoTab === 'coach'
                ? 'bg-[#FF6B00] text-white shadow-md shadow-orange-500/25'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            AI Career Coach
          </button>
          <button
            onClick={() => setActiveDemoTab('match')}
            className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
              activeDemoTab === 'match'
                ? 'bg-[#FF6B00] text-white shadow-md shadow-orange-500/25'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            Match Matrix
          </button>
        </div>

        {/* Demo Content Box */}
        <div className="luxury-card p-8 border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 shadow-xl max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            {activeDemoTab === 'ats' && (
              <motion.div key="ats" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-bold">ATS Score: 94 / 100</span>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white">Instant Section & Action Verb Evaluation</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                    Evaluates resume contact details, summary clarity, technical skill density, impact metrics, and section structure.
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold"><span>Impact Action Verbs</span><span className="text-emerald-500">Strong (18 verbs)</span></div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-emerald-500 w-[94%]" /></div>
                  </div>
                </div>
                <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-center space-y-3">
                  <div className="w-24 h-24 mx-auto rounded-full border-4 border-[#FF6B00] flex items-center justify-center text-3xl font-black text-[#FF6B00]">
                    94
                  </div>
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Resume Optimized for Enterprise ATS Software</p>
                </div>
              </motion.div>
            )}

            {activeDemoTab === 'coach' && (
              <motion.div key="coach" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
                <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                  <Bot className="w-6 h-6 text-[#FF6B00]" />
                  <div>
                    <h3 className="font-black text-slate-900 dark:text-white text-base">STAR Method Interview Practice Simulator</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Practice answers and receive instant scoring based on Situation, Task, Action, Result.</p>
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 text-xs font-medium space-y-2">
                  <p className="font-bold text-[#FF6B00]">Prompt: "Tell me about a technical bottleneck you resolved under pressure."</p>
                  <p className="text-slate-600 dark:text-slate-300">AI Evaluation Result: STAR Score 90/100. Strong action and measurable metric result included (+45% query speed optimization).</p>
                </div>
              </motion.div>
            )}

            {activeDemoTab === 'match' && (
              <motion.div key="match" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
                <h3 className="text-xl font-black text-slate-900 dark:text-white">TF-IDF Vector Cosine Similarity</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                  Converts candidate experience text into mathematical skill vectors and compares against job post matrices for accurate ranking.
                </p>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80"><div className="text-2xl font-black text-[#FF6B00]">0.88</div><div className="text-xs text-slate-400 font-bold">Cosine Score</div></div>
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80"><div className="text-2xl font-black text-emerald-500">12/14</div><div className="text-xs text-slate-400 font-bold">Skills Matched</div></div>
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80"><div className="text-2xl font-black text-purple-500">96%</div><div className="text-xs text-slate-400 font-bold">Rank Score</div></div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* FEATURE MATRIX GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#FF6B00]">Engineered For Success</span>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Comprehensive Career Intelligence
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feat, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -4 }}
              className="luxury-card p-8 border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 space-y-4 shadow-sm"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#FF6B00]/10 border border-[#FF6B00]/20 flex items-center justify-center">
                {feat.icon}
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">{feat.title}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                {feat.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white">Frequently Asked Questions</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Everything you need to know about SwipeX.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="luxury-card p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 cursor-pointer" onClick={() => toggleFaq(i)}>
              <div className="flex justify-between items-center text-sm font-bold text-slate-900 dark:text-white">
                <span>{faq.question}</span>
                {openFaq === i ? <ChevronUp className="w-4 h-4 text-[#FF6B00]" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </div>
              {openFaq === i && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 leading-relaxed font-medium">
                  {faq.answer}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CALL TO ACTION CARD */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="luxury-card p-12 bg-gradient-to-r from-[#FF6B00] to-[#FF9D42] text-white text-center space-y-6 shadow-2xl relative overflow-hidden">
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight">Ready to Accelerate Your Career?</h2>
          <p className="text-xs sm:text-sm font-semibold max-w-xl mx-auto opacity-90">
            Join candidates and recruiters using SwipeX for effortless job discovery and intelligent ATS matching.
          </p>
          <div className="flex justify-center gap-4 pt-2">
            <Link to="/signup" className="px-8 py-4 bg-white text-slate-900 font-black rounded-2xl text-xs hover:bg-slate-100 transition-all shadow-lg">
              Get Started Free Now
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
