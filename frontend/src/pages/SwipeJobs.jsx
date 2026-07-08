import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import API from '../services/api';
import { useNotification } from '../context/NotificationContext';
import { CardSkeleton } from '../components/SkeletonLoader';
import { 
  Heart, 
  X, 
  Bookmark, 
  RotateCcw, 
  Sparkles, 
  Building2, 
  MapPin, 
  DollarSign, 
  Briefcase, 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  ChevronRight,
  Zap,
  Globe
} from 'lucide-react';

export default function SwipeJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeHistory, setSwipeHistory] = useState([]);
  const [flipped, setFlipped] = useState(false);

  const { addToast } = useNotification();

  // Motion drag values
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-18, 18]);
  const opacityLike = useTransform(x, [20, 150], [0, 1]);
  const opacitySkip = useTransform(x, [-20, -150], [0, 1]);

  useEffect(() => {
    fetchSwipeFeed();
  }, []);

  const fetchSwipeFeed = async () => {
    setLoading(true);
    try {
      const res = await API.get('/swipes/feed');
      setJobs(res.data);
      setCurrentIndex(0);
    } catch (err) {
      addToast('Failed to load swipe recommendations feed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSwipe = async (direction) => {
    if (currentIndex >= jobs.length) return;
    const currentJob = jobs[currentIndex];
    
    let action = 'skip';
    if (direction === 'right') action = 'like';
    if (direction === 'up') action = 'save';

    // Optimistically update UI
    setSwipeHistory((prev) => [...prev, { job: currentJob, action, index: currentIndex }]);
    setCurrentIndex((prev) => prev + 1);
    setFlipped(false);

    try {
      await API.post('/swipes/action', {
        job_id: currentJob.id,
        action: action
      });

      if (action === 'like') {
        addToast(`Applied for ${currentJob.title} at ${currentJob.company}!`, 'success');
      } else if (action === 'save') {
        addToast(`Saved ${currentJob.title} to bookmarks`, 'info');
      }
    } catch (err) {
      console.error("Swipe action failed", err);
    }
  };

  const handleUndo = () => {
    if (swipeHistory.length === 0) return;
    const lastItem = swipeHistory[swipeHistory.length - 1];
    setSwipeHistory((prev) => prev.slice(0, -1));
    setCurrentIndex(lastItem.index);
    addToast('Reverted last swipe', 'info');
  };

  const currentJob = jobs[currentIndex];

  if (loading) {
    return (
      <div className="py-12 max-w-md mx-auto px-4">
        <CardSkeleton />
      </div>
    );
  }

  if (!currentJob || currentIndex >= jobs.length) {
    return (
      <div className="py-20 max-w-lg mx-auto text-center px-4 space-y-6">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
          <Sparkles className="w-10 h-10 text-indigo-400 animate-bounce" />
        </div>
        <h2 className="text-3xl font-extrabold text-white">All Caught Up!</h2>
        <p className="text-sm text-slate-400">
          You've swiped through all recommended jobs in your feed. The AI has learned your preferences and is constantly indexing new roles.
        </p>
        <button
          onClick={fetchSwipeFeed}
          className="px-6 py-3 font-bold text-white bg-gradient-to-r from-indigo-600 to-cyan-500 rounded-xl shadow-neon-indigo hover:scale-105 transition-all inline-flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" /> Refresh Job Recommendations
        </button>
      </div>
    );
  }

  return (
    <div className="py-8 max-w-lg mx-auto px-4 space-y-6">
      
      {/* Top Header & Feed Info */}
      <div className="flex justify-between items-center text-xs text-slate-400">
        <span className="flex items-center gap-1.5 font-semibold text-indigo-300">
          <Zap className="w-4 h-4 text-cyan-400" />
          AI Learning Active
        </span>
        <span className="font-medium">
          Card {currentIndex + 1} of {jobs.length}
        </span>
      </div>

      {/* Swipeable Card Stack Container */}
      <div className="relative h-[560px] w-full flex items-center justify-center">
        
        {/* Next Card Background Preview */}
        {jobs[currentIndex + 1] && (
          <div className="absolute inset-0 w-full h-full rounded-3xl glass-panel p-6 opacity-40 scale-95 translate-y-3 pointer-events-none border border-white/10" />
        )}

        {/* Current Active Card */}
        <motion.div
          style={{ x, rotate }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={(e, info) => {
            if (info.offset.x > 120) {
              handleSwipe('right');
            } else if (info.offset.x < -120) {
              handleSwipe('left');
            }
          }}
          className="absolute inset-0 w-full h-full rounded-3xl glass-panel p-6 border border-white/10 shadow-glass flex flex-col justify-between cursor-grab active:cursor-grabbing overflow-hidden select-none bg-[#111827]/90 backdrop-blur-2xl"
        >
          {/* Overlay Indicators for Swipe Gesture */}
          <motion.div
            style={{ opacity: opacityLike }}
            className="absolute top-6 left-6 z-30 px-4 py-1.5 rounded-xl border-2 border-emerald-400 bg-emerald-500/20 text-emerald-300 font-extrabold text-sm uppercase tracking-wider shadow-neon-indigo flex items-center gap-1"
          >
            <Heart className="w-4 h-4 fill-emerald-400" /> APPLY NOW
          </motion.div>

          <motion.div
            style={{ opacity: opacitySkip }}
            className="absolute top-6 right-6 z-30 px-4 py-1.5 rounded-xl border-2 border-pink-400 bg-pink-500/20 text-pink-300 font-extrabold text-sm uppercase tracking-wider flex items-center gap-1"
          >
            <X className="w-4 h-4" /> SKIP
          </motion.div>

          {/* Card Content Top Header */}
          <div className="space-y-4">
            <div className="flex justify-between items-start gap-4">
              <div className="flex items-center gap-3">
                <img
                  src={currentJob.company_logo || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80"}
                  alt={currentJob.company}
                  className="w-14 h-14 rounded-2xl object-cover ring-2 ring-indigo-500/30"
                />
                <div>
                  <h3 className="font-extrabold text-xl text-white leading-tight line-clamp-1">{currentJob.title}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-indigo-300 font-medium">
                    <Building2 className="w-3.5 h-3.5" />
                    {currentJob.company}
                  </div>
                </div>
              </div>

              {/* Match Score Badge */}
              <div className="px-3 py-1 rounded-full bg-gradient-to-r from-indigo-500/20 to-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-bold shrink-0">
                {currentJob.match_percentage || 85}% Match
              </div>
            </div>

            {/* Badges Bar */}
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-semibold flex items-center gap-1">
                <Globe className="w-3 h-3 text-cyan-400" />
                {currentJob.is_remote ? 'Remote' : currentJob.location}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-violet-500/10 text-violet-300 border border-violet-500/20 font-semibold flex items-center gap-1">
                <Briefcase className="w-3 h-3" />
                {currentJob.company_type}
              </span>
              {currentJob.salary_max > 0 && (
                <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-semibold flex items-center gap-1">
                  <DollarSign className="w-3 h-3" />
                  ${(currentJob.salary_min / 1000).toFixed(0)}k - ${(currentJob.salary_max / 1000).toFixed(0)}k
                </span>
              )}
            </div>

            {/* AI Recommendation Reason */}
            {currentJob.recommendation_reason && (
              <div className="p-3 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 text-xs text-indigo-200 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>{currentJob.recommendation_reason}</span>
              </div>
            )}

            {/* Description or Expanded Toggle */}
            <div className="space-y-2">
              <p className="text-xs text-slate-300 leading-relaxed line-clamp-4">
                {currentJob.description}
              </p>
            </div>

            {/* Skills Pills */}
            <div className="space-y-1.5">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Required Skills</div>
              <div className="flex flex-wrap gap-1.5">
                {currentJob.required_skills?.map((skill, idx) => {
                  const isMatched = currentJob.matched_skills?.includes(skill);
                  return (
                    <span
                      key={idx}
                      className={`px-2.5 py-0.5 rounded-md text-xs font-medium flex items-center gap-1 ${
                        isMatched
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-slate-800 text-slate-300 border border-slate-700'
                      }`}
                    >
                      {isMatched && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                      {skill}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Missing Skills Warning if any */}
            {currentJob.missing_skills?.length > 0 && (
              <div className="text-xs text-amber-300/80 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                Missing skills: {currentJob.missing_skills.slice(0, 3).join(', ')}
              </div>
            )}
          </div>

          <div className="text-center pt-2 text-[11px] text-slate-500">
            Swipe Right to Apply • Swipe Left to Skip
          </div>
        </motion.div>
      </div>

      {/* Swipe Action Control Buttons */}
      <div className="flex items-center justify-around pt-4">
        
        {/* Undo Button */}
        <button
          onClick={handleUndo}
          disabled={swipeHistory.length === 0}
          className="w-12 h-12 rounded-full glass-panel border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-400 disabled:opacity-40 transition-all shadow-lg"
          title="Undo last swipe"
        >
          <RotateCcw className="w-5 h-5" />
        </button>

        {/* Swipe Left (Pass/Skip) */}
        <button
          onClick={() => handleSwipe('left')}
          className="w-16 h-16 rounded-full glass-panel border border-pink-500/40 text-pink-400 hover:bg-pink-500/20 hover:scale-110 flex items-center justify-center transition-all shadow-neon-pink"
          title="Skip Job"
        >
          <X className="w-8 h-8" />
        </button>

        {/* Save/Bookmark */}
        <button
          onClick={() => handleSwipe('up')}
          className="w-12 h-12 rounded-full glass-panel border border-amber-500/40 text-amber-400 hover:bg-amber-500/20 hover:scale-110 flex items-center justify-center transition-all"
          title="Bookmark Job"
        >
          <Bookmark className="w-5 h-5" />
        </button>

        {/* Swipe Right (Apply) */}
        <button
          onClick={() => handleSwipe('right')}
          className="w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-500 to-cyan-500 text-slate-950 hover:scale-110 flex items-center justify-center transition-all shadow-neon-cyan"
          title="Apply Now"
        >
          <Heart className="w-8 h-8 fill-slate-950" />
        </button>
      </div>

    </div>
  );
}
