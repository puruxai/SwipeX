import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Layers, FileCheck, Target, ArrowRight, Zap, CheckCircle2, Award, Users } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LandingPage() {
  return (
    <div className="space-y-24 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Hero Section */}
      <div className="text-center space-y-8 relative">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border border-indigo-500/30 text-indigo-300 text-xs font-bold uppercase tracking-wider"
        >
          <Sparkles className="w-4 h-4 text-cyan-400" />
          Powered by Scikit-Learn & Machine Learning AI
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight"
        >
          Discover Jobs by <span className="gradient-text">Swiping</span>. Powered by AI Resume Intelligence.
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto font-normal"
        >
          Swipe Right to Apply, Swipe Left to Pass. SwipeX parses your resume, calculates ATS scores, extracts key skills, and continuously learns your career interests.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
        >
          <Link
            to="/signup"
            className="w-full sm:w-auto px-8 py-4 text-base font-bold text-white bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-500 rounded-2xl shadow-neon-indigo hover:scale-105 transition-all flex items-center justify-center gap-2 group"
          >
            Start Swiping Jobs Now
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            to="/resume-analyzer"
            className="w-full sm:w-auto px-8 py-4 text-base font-bold text-slate-200 glass-panel border border-white/10 hover:border-indigo-500/40 rounded-2xl transition-all flex items-center justify-center gap-2"
          >
            <FileCheck className="w-5 h-5 text-cyan-400" />
            Scan Resume ATS Score
          </Link>
        </motion.div>

        {/* Demo Interactive Cards Showcase */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="pt-12 max-w-md mx-auto relative"
        >
          <div className="w-full h-80 glass-panel rounded-3xl p-6 border border-indigo-500/30 shadow-neon-indigo flex flex-col justify-between text-left relative overflow-hidden">
            <div className="absolute top-0 right-0 px-4 py-1 bg-gradient-to-l from-emerald-500 to-cyan-500 text-xs font-bold text-slate-950 rounded-bl-2xl">
              96% AI Match
            </div>
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-lg font-black text-indigo-300">
                  NS
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-white">Senior Full Stack AI Developer</h3>
                  <p className="text-xs text-indigo-300">NeuralStack Labs • San Francisco (Remote)</p>
                </div>
              </div>
              <p className="text-xs text-slate-300 line-clamp-3 mb-4">
                Build autonomous web platforms using React, FastAPI, and LLM orchestration. $140k - $180k USD.
              </p>
              <div className="flex flex-wrap gap-1.5">
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[11px] font-semibold">Python</span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[11px] font-semibold">React</span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[11px] font-semibold">FastAPI</span>
                <span className="px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 text-[11px] font-semibold">Remote</span>
              </div>
            </div>
            <div className="pt-4 border-t border-white/10 flex justify-between items-center text-xs text-slate-400">
              <span>Swipe Right = Instant Apply</span>
              <span className="text-emerald-400 font-bold">ATS Score: 88/100</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="glass-panel p-8 rounded-3xl border border-white/10 hover:border-indigo-500/40 transition-all space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
            <Layers className="w-6 h-6 text-indigo-400" />
          </div>
          <h3 className="text-xl font-bold text-white">Swipe-Based Discovery</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Eliminate tedious job application forms. Swipe right to apply instantly, swipe left to skip. Machine learning adapts to your preferences.
          </p>
        </div>

        <div className="glass-panel p-8 rounded-3xl border border-white/10 hover:border-cyan-500/40 transition-all space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-600/20 border border-cyan-500/30 flex items-center justify-center">
            <FileCheck className="w-6 h-6 text-cyan-400" />
          </div>
          <h3 className="text-xl font-bold text-white">AI ATS Resume Engine</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Instant PDF & DOCX parser evaluates formatting, keyword density, and section completeness, delivering an actionable 0-100 ATS optimization report.
          </p>
        </div>

        <div className="glass-panel p-8 rounded-3xl border border-white/10 hover:border-emerald-500/40 transition-all space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center">
            <Target className="w-6 h-6 text-emerald-400" />
          </div>
          <h3 className="text-xl font-bold text-white">Smart Match Analytics</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Semantic TF-IDF similarity vectors measure your exact fit against every job posting, highlighting missing skills and interview probabilities.
          </p>
        </div>
      </div>

      {/* Platform Statistics Banner */}
      <div className="glass-panel rounded-3xl p-8 border border-white/10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        <div>
          <div className="text-3xl sm:text-4xl font-extrabold gradient-text">98%</div>
          <div className="text-xs text-slate-400 mt-1 uppercase font-semibold">ATS Accuracy</div>
        </div>
        <div>
          <div className="text-3xl sm:text-4xl font-extrabold gradient-text">10k+</div>
          <div className="text-xs text-slate-400 mt-1 uppercase font-semibold">Swipes Recorded</div>
        </div>
        <div>
          <div className="text-3xl sm:text-4xl font-extrabold gradient-text">4.5x</div>
          <div className="text-xs text-slate-400 mt-1 uppercase font-semibold">Faster Application Speed</div>
        </div>
        <div>
          <div className="text-3xl sm:text-4xl font-extrabold gradient-text">100%</div>
          <div className="text-xs text-slate-400 mt-1 uppercase font-semibold">Automated Match Rationale</div>
        </div>
      </div>

    </div>
  );
}
