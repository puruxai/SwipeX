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
      addToast('Your swipe could not be saved. Please try again.', 'error');
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
        <div className="w-20 h-20 mx-auto rounded-3xl bg-[#FF6B00]/10 border border-[#FF6B00]/25 flex items-center justify-center">
          <Sparkles className="w-10 h-10 text-[#FF8A3D] animate-bounce" />
        </div>
        <h2 className="text-3xl font-extrabold text-white">All Caught Up!</h2>
        <p className="text-sm text-[#A8A8A8]">
          You've swiped through all recommended jobs in your feed. The AI has learned your preferences and is constantly indexing new roles.
        </p>
        <button
          onClick={fetchSwipeFeed}
          className="px-6 py-3 font-bold text-white bg-gradient-to-r from-[#FF6B00] to-[#FF8A3D] rounded-xl shadow-[0_4px_15px_rgba(255,107,0,0.35)] hover:scale-105 transition-all inline-flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" /> Refresh Job Recommendations
        </button>
      </div>
    );
  }

  return (
    <div className="py-8 max-w-lg mx-auto px-4 space-y-6">
      
      {/* Top Header & Feed Info */}
      <div className="flex justify-between items-center text-xs text-[#A8A8A8]">
        <span className="flex items-center gap-1.5 font-semibold text-[#FF8A3D]">
          <Zap className="w-4 h-4 text-[#FF6B00]" />
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
          className="absolute inset-0 w-full h-full rounded-3xl glass-panel p-6 border border-[#262626] shadow-glass flex flex-col justify-between cursor-grab active:cursor-grabbing overflow-hidden select-none bg-[#181818]/95 backdrop-blur-2xl"
        >
          {/* Overlay Indicators for Swipe Gesture */}
          <motion.div
            style={{ opacity: opacityLike }}
            className="absolute top-6 left-6 z-30 px-4 py-1.5 rounded-xl border-2 border-[#22C55E] bg-[#22C55E]/20 text-[#22C55E] font-extrabold text-sm uppercase tracking-wider shadow-md flex items-center gap-1"
          >
            <Heart className="w-4 h-4 fill-[#22C55E]" /> APPLY NOW
          </motion.div>

          <motion.div
            style={{ opacity: opacitySkip }}
            className="absolute top-6 right-6 z-30 px-4 py-1.5 rounded-xl border-2 border-rose-500 bg-rose-500/20 text-rose-300 font-extrabold text-sm uppercase tracking-wider flex items-center gap-1"
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
                  className="w-14 h-14 rounded-2xl object-cover ring-2 ring-[#FF6B00]/30"
                />
                <div>
                  <h3 className="font-extrabold text-xl text-white leading-tight line-clamp-1">{currentJob.title}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-[#FF8A3D] font-medium">
                    <Building2 className="w-3.5 h-3.5" />
                    {currentJob.company}
                  </div>
                </div>
              </div>

              {/* Match Score Badge */}
              <div className="px-3 py-1 rounded-full bg-[#FF6B00]/10 border border-[#FF6B00]/30 text-[#FF8A3D] text-xs font-bold shrink-0">
                {currentJob.match_percentage || 85}% Match
              </div>
            </div>

            {/* Badges Bar */}
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="px-2.5 py-1 rounded-lg bg-[#FF6B00]/10 text-[#FF8A3D] border border-[#FF6B00]/20 font-semibold flex items-center gap-1">
                <Globe className="w-3 h-3 text-[#FF6B00]" />
                {currentJob.is_remote ? 'Remote' : currentJob.location}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-[#121212] text-[#A8A8A8] border border-[#262626] font-semibold flex items-center gap-1">
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
              <div className="p-3 rounded-2xl bg-[#FF6B00]/5 border border-[#FF6B00]/15 text-xs text-[#A8A8A8] flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-[#FF8A3D] shrink-0 mt-0.5" />
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
                          : 'bg-[#121212] text-[#A8A8A8] border border-[#262626]'
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
              <div className="text-xs text-[#F59E0B]/80 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 text-[#F59E0B]" />
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
          className="w-12 h-12 rounded-full glass-panel border border-[#262626] flex items-center justify-center text-[#A8A8A8] hover:text-white hover:border-[#FF6B00]/40 disabled:opacity-40 transition-all shadow-lg"
          title="Undo last swipe"
        >
          <RotateCcw className="w-5 h-5" />
        </button>

        {/* Swipe Left (Pass/Skip) */}
        <button
          onClick={() => handleSwipe('left')}
          className="w-16 h-16 rounded-full glass-panel border border-rose-500/40 text-[#EF4444] hover:bg-rose-500/10 hover:scale-110 flex items-center justify-center transition-all shadow-[0_0_15px_rgba(239,68,68,0.25)]"
          title="Skip Job"
        >
          <X className="w-8 h-8" />
        </button>

        {/* Save/Bookmark */}
        <button
          onClick={() => handleSwipe('up')}
          className="w-12 h-12 rounded-full glass-panel border border-[#F59E0B]/40 text-[#F59E0B] hover:bg-[#F59E0B]/10 hover:scale-110 flex items-center justify-center transition-all"
          title="Bookmark Job"
        >
          <Bookmark className="w-5 h-5" />
        </button>

        {/* Swipe Right (Apply) */}
        <button
          onClick={() => handleSwipe('right')}
          className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#22C55E] to-[#4ADE80] text-slate-950 hover:scale-110 flex items-center justify-center transition-all shadow-[0_4px_15px_rgba(34,197,94,0.35)]"
          title="Apply Now"
        >
          <Heart className="w-8 h-8 fill-slate-950" />
        </button>
      </div>

    </div>
  );
}
