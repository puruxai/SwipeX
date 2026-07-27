import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useNotification } from '../context/NotificationContext';
import { 
  Sparkles, 
  Building2, 
  MapPin, 
  DollarSign, 
  Briefcase, 
  CheckCircle2, 
  AlertCircle, 
  Zap, 
  RotateCcw, 
  Bookmark, 
  Check, 
  Info,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SwipeJobs() {
  const [jobs, setJobs] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [matchedJob, setMatchedJob] = useState(null);
  const [showDetailDrawer, setShowDetailDrawer] = useState(false);

  const { addToast } = useNotification();

  useEffect(() => {
    fetchSwipeFeed();
  }, []);

  const fetchSwipeFeed = async () => {
    try {
      const res = await API.get('/swipes/feed');
      setJobs(res.data);
    } catch (err) {
      addToast('Unable to load swipe job feed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const currentJob = jobs[currentIndex];

  const handleSwipe = async (action) => {
    if (!currentJob) return;

    const jobToSwipe = currentJob;
    setCurrentIndex((prev) => prev + 1);

    try {
      const res = await API.post('/swipes/', {
        job_id: jobToSwipe.id,
        action: action
      });

      if (action === 'apply') {
        addToast(`Applied to ${jobToSwipe.title} at ${jobToSwipe.company}!`, 'success');
        setMatchedJob(jobToSwipe);
        setShowMatchModal(true);
      } else if (action === 'bookmark') {
        addToast(`Bookmarked ${jobToSwipe.title}!`, 'info');
      } else if (action === 'pass') {
        addToast(`Passed on ${jobToSwipe.title}.`, 'info');
      }
    } catch (err) {
      addToast('Failed to record swipe action.', 'error');
    }
  };

  const handleUndo = async () => {
    if (currentIndex === 0) return;
    try {
      await API.post('/swipes/undo');
      setCurrentIndex((prev) => prev - 1);
      addToast('Previous swipe reverted.', 'success');
    } catch (err) {
      addToast('Unable to undo swipe.', 'error');
    }
  };

  if (loading) {
    return (
      <div className="py-20 max-w-md mx-auto px-4 text-center space-y-4">
        <div className="w-16 h-16 mx-auto rounded-3xl bg-[#FF6B00]/10 border border-[#FF6B00]/25 flex items-center justify-center animate-spin">
          <Sparkles className="w-8 h-8 text-[#FF6B00]" />
        </div>
        <p className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
          Calculating TF-IDF Match Vectors...
        </p>
      </div>
    );
  }

  if (!currentJob || currentIndex >= jobs.length) {
    return (
      <div className="py-20 max-w-lg mx-auto px-4 text-center space-y-6">
        <div className="w-20 h-20 mx-auto rounded-full bg-[#FF6B00]/10 border border-[#FF6B00]/25 flex items-center justify-center">
          <CheckCircle2 className="w-10 h-10 text-[#FF6B00]" />
        </div>
        <h2 className="text-3xl font-black text-slate-900 dark:text-white">You're All Caught Up!</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          You've reviewed all target job recommendations in your feed. Check back soon or refresh your skills matrix.
        </p>
        <button
          onClick={() => {
            setCurrentIndex(0);
            fetchSwipeFeed();
          }}
          className="btn-primary px-8 py-3.5 text-xs font-black"
        >
          Reload Job Feed
        </button>
      </div>
    );
  }

  return (
    <div className="py-8 max-w-xl mx-auto px-4 space-y-6">
      
      {/* Feed Top Controls */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Zap className="w-6 h-6 text-[#FF6B00]" /> AI Swipe Discovery
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Role {currentIndex + 1} of {jobs.length} • Adaptive AI Feed
          </p>
        </div>

        <button
          onClick={handleUndo}
          disabled={currentIndex === 0}
          className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-300 hover:border-[#FF6B00]/40 disabled:opacity-40 transition-all flex items-center gap-1.5 shadow-sm"
        >
          <RotateCcw className="w-3.5 h-3.5 text-[#FF6B00]" /> Undo
        </button>
      </div>

      {/* SWIPE CARD STACK */}
      <div className="relative h-[560px] w-full">
        <AnimatePresence>
          <motion.div
            key={currentJob.id}
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, x: 200 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 luxury-card p-8 border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 shadow-2xl flex flex-col justify-between overflow-hidden"
          >
            {/* Ambient Top Glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#FF6B00]/5 blur-3xl rounded-full pointer-events-none" />

            <div className="space-y-6">
              
              {/* Company & Role Header */}
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white font-black text-xl flex items-center justify-center shadow-md">
                    {currentJob.company ? currentJob.company[0] : 'C'}
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white leading-tight">{currentJob.title}</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-bold flex items-center gap-1 mt-0.5">
                      <Building2 className="w-3.5 h-3.5 text-[#FF6B00]" /> {currentJob.company}
                    </p>
                  </div>
                </div>

                <div className="px-3.5 py-1.5 rounded-full bg-[#FF6B00]/10 border border-[#FF6B00]/25 text-[#FF6B00] font-black text-xs">
                  {currentJob.match_score || 94}% Match
                </div>
              </div>

              {/* Meta Pills */}
              <div className="flex flex-wrap gap-2 text-xs font-bold">
                <span className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" /> {currentJob.location || 'Remote'}
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-500" /> ${currentJob.salary_min?.toLocaleString()} - ${currentJob.salary_max?.toLocaleString()}
                </span>
                {currentJob.is_remote && (
                  <span className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 border border-emerald-200 dark:border-emerald-800">
                    100% Remote
                  </span>
                )}
              </div>

              {/* Required Skills Matrix */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Required Skills Fit</div>
                <div className="flex flex-wrap gap-1.5">
                  {currentJob.required_skills?.map((skill, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center gap-1">
                      <Check className="w-3 h-3 text-emerald-500" /> {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* AI Match Rationale */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 text-xs space-y-1">
                <span className="font-extrabold text-[#FF6B00] flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> AI Recommendation Reason:
                </span>
                <p className="text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                  {currentJob.match_rationale || "Strong alignment in Python FastAPI & React system architecture background."}
                </p>
              </div>

            </div>

            {/* Bottom Swipe Gesture Actions */}
            <div className="flex items-center justify-around pt-4 border-t border-slate-100 dark:border-slate-800">
              
              <button
                onClick={() => handleSwipe('pass')}
                className="w-14 h-14 rounded-full border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/40 text-rose-500 hover:bg-rose-500 hover:text-white flex items-center justify-center font-black text-xl shadow-sm transition-all hover:scale-105"
                title="Pass"
              >
                ✕
              </button>

              <button
                onClick={() => handleSwipe('bookmark')}
                className="w-12 h-12 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-[#FF6B00] flex items-center justify-center shadow-sm transition-all hover:scale-105"
                title="Bookmark"
              >
                <Bookmark className="w-5 h-5" />
              </button>

              <button
                onClick={() => handleSwipe('apply')}
                className="w-16 h-16 rounded-full bg-gradient-to-r from-[#FF6B00] to-[#FF9D42] text-white flex items-center justify-center font-black text-2xl shadow-[0_8px_25px_rgba(255,107,0,0.45)] hover:scale-110 transition-all"
                title="Swipe Right to Apply"
              >
                ➔
              </button>

            </div>

          </motion.div>
        </AnimatePresence>
      </div>

      {/* MATCH CELEBRATION MODAL */}
      <AnimatePresence>
        {showMatchModal && matchedJob && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="luxury-card p-8 bg-white dark:bg-slate-900 max-w-sm w-full text-center space-y-6 border border-slate-200 dark:border-slate-800 shadow-2xl"
            >
              <div className="w-20 h-20 mx-auto rounded-full bg-[#FF6B00]/10 border border-[#FF6B00]/25 flex items-center justify-center">
                <Sparkles className="w-10 h-10 text-[#FF6B00] animate-bounce" />
              </div>

              <div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">Application Sent!</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                  Your resume vector was submitted to <strong>{matchedJob.company}</strong> for <strong>{matchedJob.title}</strong>.
                </p>
              </div>

              <button
                onClick={() => setShowMatchModal(false)}
                className="w-full btn-primary py-3.5 text-xs font-black"
              >
                Continue Swiping
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
