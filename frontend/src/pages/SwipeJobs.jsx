import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValue, useTransform, useAnimation } from 'framer-motion';
import API from '../services/api';
import { useNotification } from '../context/NotificationContext';
import Sidebar from '../components/Sidebar';
import CompanyLogo from '../components/CompanyLogo';
import { 
  Building2, 
  MapPin, 
  DollarSign, 
  Bookmark, 
  Sparkles, 
  Check, 
  Zap, 
  RotateCcw,
  Loader2,
  X,
  Heart,
  Info,
  Briefcase,
  ChevronDown,
  ArrowRight,
  TrendingUp,
  Award,
  Search,
  CheckCircle2,
  Clock
} from 'lucide-react';

// Reusable animated Match Score circular progress component
const MatchScoreRing = ({ score, size = "w-16 h-16", strokeWidth = 4, textSize = "text-base" }) => {
  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  
  const getColor = (s) => {
    if (s >= 90) return '#7ED321'; // Bright primary green
    if (s >= 75) return '#59C414'; // Accent deep green
    return '#E2B13C'; // Warm golden yellow
  };

  return (
    <div className={`relative ${size} flex items-center justify-center flex-shrink-0`}>
      <svg className="w-full h-full transform -rotate-90">
        <circle 
          cx="32" 
          cy="32" 
          r={radius} 
          stroke="#E6E6E2" 
          strokeWidth={strokeWidth} 
          fill="transparent" 
        />
        <circle 
          cx="32" 
          cy="32" 
          r={radius} 
          stroke={getColor(score)} 
          strokeWidth={strokeWidth} 
          fill="transparent"
          strokeDasharray={circumference} 
          strokeDashoffset={strokeDashoffset} 
          strokeLinecap="round"
          className="transition-all duration-700 ease-out" 
        />
      </svg>
      <span className={`absolute font-extrabold ${textSize} text-[#111111]`}>{score}%</span>
    </div>
  );
};

export default function SwipeJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipedHistory, setSwipedHistory] = useState([]);
  const [detailJob, setDetailJob] = useState(null);
  
  const [applyingJobId, setApplyingJobId] = useState(null);
  const [savingJobId, setSavingJobId] = useState(null);

  const { addToast } = useNotification();
  const navigate = useNavigate();
  const controls = useAnimation();

  // Framer Motion values for the active top card drag coordinates
  const dragX = useMotionValue(0);
  const dragY = useMotionValue(0);

  // Dynamic transforms based on drag state
  const rotate = useTransform(dragX, [-150, 150], [-12, 12]);
  const activeOpacity = useTransform(dragX, [-220, -150, 0, 150, 220], [0.6, 1, 1, 1, 0.6]);

  // Gestures badge opacity mappings
  const skippedBadgeOpacity = useTransform(dragX, [-80, -20], [1, 0]);
  const matchBadgeOpacity = useTransform(dragX, [20, 80], [0, 1]);
  const savedBadgeOpacity = useTransform(dragY, [-80, -20], [1, 0]);
  const detailsBadgeOpacity = useTransform(dragY, [20, 80], [0, 1]);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await API.get('/swipes/feed');
      setJobs(res.data);
      setCurrentIndex(0);
      setSwipedHistory([]);
    } catch (err) {
      if (err.response?.status === 401) {
        addToast('Session expired. Please log in.', 'error');
        navigate('/login');
      } else {
        addToast('Unable to load curated job feed.', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSwipeAction = async (job, actionType) => {
    try {
      await API.post('/swipes/action', { job_id: job.id, action: actionType });
      if (actionType === 'like') {
        addToast(`Applied successfully to ${job.company}!`, 'success');
      } else if (actionType === 'save') {
        addToast(`Saved ${job.title} to bookmarks.`, 'info');
      }
    } catch (err) {
      if (err.response?.status === 401) {
        addToast('Session expired. Please log in.', 'error');
        navigate('/login');
      } else {
        addToast(`Failed to record action: ${actionType}`, 'error');
      }
    }
  };

  const swipeCard = async (direction) => {
    if (currentIndex >= jobs.length) return;
    const currentJob = jobs[currentIndex];

    if (direction === 'right') {
      await controls.start({ x: 450, opacity: 0, transition: { duration: 0.25 } });
      handleSwipeAction(currentJob, 'like');
    } else if (direction === 'left') {
      await controls.start({ x: -450, opacity: 0, transition: { duration: 0.25 } });
      handleSwipeAction(currentJob, 'skip');
    } else if (direction === 'up') {
      await controls.start({ y: -450, opacity: 0, transition: { duration: 0.25 } });
      handleSwipeAction(currentJob, 'save');
    } else if (direction === 'down') {
      await controls.start({ y: 150, transition: { duration: 0.15 } });
      setDetailJob(currentJob);
      controls.set({ x: 0, y: 0 });
      return;
    }

    // Record swipe history for Undo support
    setSwipedHistory((prev) => [...prev, { job: currentJob, direction }]);
    setCurrentIndex((prev) => prev + 1);
    
    // Reset layout attributes for the incoming top card
    dragX.set(0);
    dragY.set(0);
    controls.set({ x: 0, y: 0, opacity: 1 });
  };

  const handleUndo = async () => {
    if (swipedHistory.length === 0) {
      addToast("No swiped actions to undo!", "info");
      return;
    }

    const lastSwipe = swipedHistory[swipedHistory.length - 1];
    setSwipedHistory((prev) => prev.slice(0, -1));
    setCurrentIndex((prev) => prev - 1);

    // Position card offscreen in the direction it was swiped, then slide back in
    const offscreenPos = 
      lastSwipe.direction === 'right' ? { x: 450, y: 0, opacity: 0 } :
      lastSwipe.direction === 'left' ? { x: -450, y: 0, opacity: 0 } :
      { x: 0, y: -450, opacity: 0 };

    controls.set(offscreenPos);
    controls.start({ x: 0, y: 0, opacity: 1, transition: { type: 'spring', stiffness: 220, damping: 20 } });
    addToast(`Restored role at ${lastSwipe.job.company}`, 'info');
  };

  const handleDragEnd = (event, info) => {
    const thresholdX = 100;
    const thresholdY = 100;
    const { offset } = info;

    if (offset.x > thresholdX) {
      swipeCard('right');
    } else if (offset.x < -thresholdX) {
      swipeCard('left');
    } else if (offset.y < -thresholdY) {
      swipeCard('up');
    } else if (offset.y > thresholdY) {
      swipeCard('down');
    } else {
      // Reset position if threshold wasn't cleared
      controls.start({ x: 0, y: 0, transition: { type: 'spring', stiffness: 300, damping: 20 } });
    }
  };

  // Build slice of visible cards
  const visibleCards = jobs.slice(currentIndex, currentIndex + 3);

  return (
    <div className="flex min-h-[90vh] bg-[#F8F8F5] text-[#111111] transition-colors relative overflow-x-hidden">
      
      {/* Global Navigation Sidebar */}
      <Sidebar />

      {/* Main Workspace Frame */}
      <div className="flex-1 p-6 lg:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-[1600px] mx-auto w-full">
        
        {/* Left/Center Swipe Feed Column */}
        <div className="lg:col-span-8 flex flex-col justify-between space-y-6">
          
          {/* Header */}
          <div className="flex justify-between items-end border-b border-[#E6E6E2] pb-5">
            <div>
              <h1 className="text-2xl font-extrabold text-[#111111] tracking-tight flex items-center gap-2.5">
                <Zap className="w-6 h-6 text-[#7ED321] fill-[#7ED321]" />
                Swipe Discovery
              </h1>
              <p className="text-xs text-[#666666] font-medium mt-1">
                Drag cards or use actions. Right to Apply, Left to Skip, Up to Save, Down to View.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold text-[#666666] bg-white border border-[#E6E6E2] px-3.5 py-1.5 rounded-full shadow-sm">
                {jobs.length - currentIndex > 0 ? `${jobs.length - currentIndex} jobs left` : '0 jobs'}
              </span>
            </div>
          </div>

          {/* Swipe Deck Container */}
          <div className="flex-1 flex items-center justify-center py-6 min-h-[500px]">
            {loading ? (
              <div className="py-24 text-center text-xs font-bold text-[#59C414] uppercase tracking-widest animate-pulse flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin text-[#7ED321]" /> Analyzing resume & tailoring deck...
              </div>
            ) : currentIndex >= jobs.length ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="reference-card p-12 text-center space-y-5 bg-white border border-[#E6E6E2] max-w-md shadow-md rounded-[28px]"
              >
                <Sparkles className="w-8 h-8 text-[#7ED321] mx-auto animate-bounce" />
                <h3 className="text-lg font-extrabold text-[#111111]">Feed Fully Swiped!</h3>
                <p className="text-xs text-[#666666] font-semibold leading-relaxed">
                  You have reviewed all neural matches suited for your experience profiles. Refresh to pull new listings.
                </p>
                <button onClick={fetchJobs} className="btn-terracotta px-6 py-2.5 text-xs font-bold shadow-sm">
                  Refresh Swipe Deck
                </button>
              </motion.div>
            ) : (
              <div className="relative w-full max-w-[420px] h-[520px] flex items-center justify-center">
                {visibleCards.map((job, idx) => {
                  const relativeIndex = idx;
                  const isTop = relativeIndex === 0;

                  return (
                    <motion.div
                      key={job.id}
                      style={isTop ? { x: dragX, y: dragY, rotate, opacity: activeOpacity, zIndex: 30 } : { zIndex: 30 - relativeIndex }}
                      animate={!isTop ? {
                        scale: 1 - relativeIndex * 0.05,
                        y: relativeIndex * 15,
                        opacity: 1 - relativeIndex * 0.2,
                      } : undefined}
                      drag={isTop}
                      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                      dragElastic={0.9}
                      onDragEnd={isTop ? handleDragEnd : undefined}
                      className={`absolute w-full h-full bg-white border border-[#E6E6E2] rounded-[28px] p-6 shadow-xl flex flex-col justify-between cursor-grab active:cursor-grabbing select-none transition-shadow duration-300 ${
                        isTop ? 'hover:shadow-2xl' : ''
                      }`}
                    >
                      {/* Swipe Visual Feedback Badges (Top Card Only) */}
                      {isTop && (
                        <>
                          <motion.div 
                            style={{ opacity: matchBadgeOpacity }}
                            className="absolute top-8 left-8 border-4 border-[#7ED321] text-[#7ED321] font-black text-xs uppercase px-4 py-1.5 rounded-xl rotate-[-12deg] z-40 bg-white"
                          >
                            Great Match
                          </motion.div>
                          <motion.div 
                            style={{ opacity: skippedBadgeOpacity }}
                            className="absolute top-8 right-8 border-4 border-[#FFAA00] text-[#FFAA00] font-black text-xs uppercase px-4 py-1.5 rounded-xl rotate-[12deg] z-40 bg-white"
                          >
                            Skipped
                          </motion.div>
                          <motion.div 
                            style={{ opacity: savedBadgeOpacity }}
                            className="absolute bottom-20 left-1/2 -translate-x-1/2 border-4 border-blue-500 text-blue-500 font-black text-xs uppercase px-5 py-1.5 rounded-xl z-40 bg-white shadow-md"
                          >
                            Saved
                          </motion.div>
                          <motion.div 
                            style={{ opacity: detailsBadgeOpacity }}
                            className="absolute top-20 left-1/2 -translate-x-1/2 border-4 border-indigo-500 text-indigo-500 font-black text-xs uppercase px-5 py-1.5 rounded-xl z-40 bg-white shadow-md animate-pulse"
                          >
                            Opening Details
                          </motion.div>
                        </>
                      )}

                      {/* Top Card Info Row */}
                      <div className="space-y-4">
                        <div className="flex justify-between items-start">
                          <CompanyLogo src={job.company_logo} company={job.company} size="w-14 h-14" />
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-1 rounded-full bg-[#7ED321]/10 text-[#59C414] text-[10px] font-bold border border-[#7ED321]/20">
                              Neural Match
                            </span>
                            <MatchScoreRing score={job.match_score || 94} size="w-14 h-14" strokeWidth={3.5} textSize="text-xs" />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <h2 className="text-xl font-black text-[#111111] leading-tight tracking-tight">{job.title}</h2>
                          <p className="text-xs text-[#59C414] font-bold flex items-center gap-1.5">
                            <Building2 className="w-3.5 h-3.5" />
                            {job.company}
                          </p>
                        </div>

                        {/* Salary and Metadata Row */}
                        <div className="flex flex-wrap gap-2 pt-1">
                          <span className="px-3 py-1 rounded-full bg-[#F8F8F5] border border-[#E6E6E2] text-xs font-bold text-[#666666] flex items-center gap-1">
                            <DollarSign className="w-3.5 h-3.5 text-[#7ED321]" />
                            ${(job.salary_min / 1000).toFixed(0)}k - ${(job.salary_max / 1000).toFixed(0)}k
                          </span>
                          <span className="px-3 py-1 rounded-full bg-[#F8F8F5] border border-[#E6E6E2] text-xs font-bold text-[#666666] flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-red-400" />
                            {job.location || 'Remote'}
                          </span>
                        </div>

                        {/* Badges/Tags Info Grid */}
                        <div className="grid grid-cols-2 gap-2 pt-1.5 text-[10px] font-bold text-[#666666]">
                          <div className="px-3 py-1.5 rounded-xl bg-[#F8F8F5] border border-[#E6E6E2] flex items-center gap-1.5">
                            <Briefcase className="w-3 h-3 text-[#7ED321]" />
                            {job.job_type || 'Full Time'}
                          </div>
                          <div className="px-3 py-1.5 rounded-xl bg-[#F8F8F5] border border-[#E6E6E2] flex items-center gap-1.5">
                            <Award className="w-3 h-3 text-[#59C414]" />
                            {job.experience_level || 'Mid Level'}
                          </div>
                        </div>

                        {/* Required Tech stack tags */}
                        <div className="space-y-1.5 pt-2">
                          <span className="text-[9px] uppercase font-black tracking-wider text-[#666666]">Key Core Skills</span>
                          <div className="flex flex-wrap gap-1.5">
                            {job.required_skills?.slice(0, 4).map((skill, index) => (
                              <span 
                                key={index} 
                                className="px-2.5 py-1 rounded-lg bg-[#F8F8F5] border border-[#E6E6E2] text-[10px] font-bold text-[#666666]"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Inline Brief Desc */}
                      <div className="border-t border-[#E6E6E2] pt-4 mt-auto">
                        <p className="text-xs text-[#666666] font-medium line-clamp-3 leading-relaxed">
                          {job.description}
                        </p>
                        <button 
                          onClick={() => setDetailJob(job)} 
                          className="mt-2.5 text-[11px] font-extrabold text-[#7ED321] hover:text-[#59C414] flex items-center gap-1 transition-colors"
                        >
                          Show Full JD & Match Insights
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Actions Footer Toolbar */}
          {!loading && currentIndex < jobs.length && (
            <div className="flex items-center justify-center gap-4 py-4">
              <button 
                onClick={handleUndo} 
                className="w-12 h-12 rounded-full bg-white border border-[#E6E6E2] hover:border-[#7ED321]/30 text-[#666666] hover:text-[#7ED321] flex items-center justify-center shadow-md transition-all active:scale-95"
                title="Undo last swipe"
              >
                <RotateCcw className="w-5 h-5" />
              </button>

              <button 
                onClick={() => swipeCard('left')} 
                className="w-14 h-14 rounded-full bg-white border border-[#E6E6E2] hover:border-red-500/30 text-red-500 hover:text-red-600 flex items-center justify-center shadow-md transition-all active:scale-90"
                title="Skip role (Swipe Left)"
              >
                <X className="w-6 h-6" />
              </button>

              <button 
                onClick={() => swipeCard('up')} 
                className="w-12 h-12 rounded-full bg-white border border-[#E6E6E2] hover:border-blue-500/30 text-blue-500 hover:text-blue-600 flex items-center justify-center shadow-md transition-all active:scale-95"
                title="Bookmark role (Swipe Up)"
              >
                <Bookmark className="w-5 h-5" />
              </button>

              <button 
                onClick={() => swipeCard('right')} 
                className="w-14 h-14 rounded-full bg-white border border-[#E6E6E2] hover:border-[#7ED321]/30 text-[#7ED321] hover:text-[#59C414] flex items-center justify-center shadow-md transition-all active:scale-90"
                title="Apply to role (Swipe Right)"
              >
                <Heart className="w-6 h-6 fill-[#7ED321]/10 hover:fill-[#7ED321]/30" />
              </button>

              <button 
                onClick={() => swipeCard('down')} 
                className="w-12 h-12 rounded-full bg-white border border-[#E6E6E2] hover:border-indigo-500/30 text-indigo-500 hover:text-indigo-600 flex items-center justify-center shadow-md transition-all active:scale-95"
                title="View Full Details (Swipe Down)"
              >
                <Info className="w-5 h-5" />
              </button>
            </div>
          )}

        </div>

        {/* Right Glassmorphism Sidebar Column */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Saved Searches */}
          <div className="bg-white/80 backdrop-blur-md border border-[#E6E6E2] rounded-3xl p-5 space-y-4 shadow-sm">
            <h3 className="text-xs font-bold text-[#111111] uppercase tracking-wider border-b border-neutral-100 pb-2 flex items-center justify-between">
              <span>Saved Searches</span>
              <span className="w-2 h-2 rounded-full bg-[#7ED321] animate-pulse" />
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-3 rounded-xl bg-white/50 border border-[#E6E6E2]/60 text-xs font-semibold hover:border-[#7ED321]/30 transition-colors cursor-pointer">
                <span className="text-[#111111] flex items-center gap-1.5">
                  <Search className="w-3.5 h-3.5 text-[#7ED321]" />
                  Generative AI Lead
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#7ED321] text-white text-[9px] font-bold uppercase tracking-wider">3 NEW</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-white/50 border border-[#E6E6E2]/60 text-xs font-semibold hover:border-[#7ED321]/30 transition-colors cursor-pointer">
                <span className="text-[#666666] flex items-center gap-1.5">
                  <Search className="w-3.5 h-3.5 text-neutral-400" />
                  Data Infrastructure
                </span>
                <span className="px-2 py-0.5 rounded-full bg-neutral-200 text-[#666666] text-[9px] font-bold uppercase tracking-wider">0 NEW</span>
              </div>
            </div>
          </div>

          {/* AI Suggestions Card */}
          <div className="bg-white/80 backdrop-blur-md border border-[#E6E6E2] rounded-3xl p-5 space-y-4 shadow-sm">
            <h3 className="text-xs font-bold text-[#111111] uppercase tracking-wider border-b border-neutral-100 pb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#7ED321]" />
              AI Profile Suggestions
            </h3>
            <div className="space-y-3 text-xs font-semibold text-[#666666]">
              <div className="p-3 rounded-xl bg-[#7ED321]/5 border border-[#7ED321]/15 space-y-1">
                <span className="text-[#111111] font-bold block text-[11px]">Add "PyTorch" to Resume</span>
                <span className="text-[10px] text-[#666666] font-medium leading-relaxed block">
                  3 matching AI engineer roles require PyTorch. Add to boost ATS compatibility score by 12%.
                </span>
              </div>
              <div className="p-3 rounded-xl bg-white/50 border border-[#E6E6E2]/60 space-y-1">
                <span className="text-[#111111] font-bold block text-[11px]">Format Work Summary</span>
                <span className="text-[10px] text-[#666666] font-medium leading-relaxed block">
                  Your experience lists LLM scaling. Focus on parameter efficiency to match OpenAI benchmarks.
                </span>
              </div>
            </div>
          </div>

          {/* Trending Skills */}
          <div className="bg-white/80 backdrop-blur-md border border-[#E6E6E2] rounded-3xl p-5 space-y-4 shadow-sm">
            <h3 className="text-xs font-bold text-[#111111] uppercase tracking-wider border-b border-neutral-100 pb-2 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-[#59C414]" />
              Trending in AI Engineering
            </h3>
            <div className="flex flex-wrap gap-1.5 text-xs font-bold">
              <span className="px-3 py-1.5 rounded-xl bg-white/60 border border-[#E6E6E2]/60 text-[#666666] hover:border-[#7ED321] hover:text-[#111111] transition-all cursor-pointer text-xs font-semibold">RLHF Training</span>
              <span className="px-3 py-1.5 rounded-xl bg-white/60 border border-[#E6E6E2]/60 text-[#666666] hover:border-[#7ED321] hover:text-[#111111] transition-all cursor-pointer text-xs font-semibold">Vector DBs</span>
              <span className="px-3 py-1.5 rounded-xl bg-white/60 border border-[#E6E6E2]/60 text-[#666666] hover:border-[#7ED321] hover:text-[#111111] transition-all cursor-pointer text-xs font-semibold">Kubernetes</span>
              <span className="px-3 py-1.5 rounded-xl bg-white/60 border border-[#E6E6E2]/60 text-[#666666] hover:border-[#7ED321] hover:text-[#111111] transition-all cursor-pointer text-xs font-semibold">Triton Lang</span>
            </div>
          </div>

          {/* Premium Upgrade card */}
          <div className="bg-gradient-to-br from-[#7ED321]/15 to-[#59C414]/5 border border-[#7ED321]/30 rounded-3xl p-6 space-y-4 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-[#7ED321]/10 rounded-full blur-xl" />
            <h3 className="text-sm font-extrabold text-[#111111] flex items-center gap-2">
              <Award className="w-4 h-4 text-[#7ED321]" />
              SwipeX Premium
            </h3>
            <p className="text-xs text-[#666666] font-semibold leading-relaxed">
              Unlock unlimited swipes, priority ATS parsing metrics, and direct messenger links with headhunting partners.
            </p>
            <button className="w-full py-2.5 rounded-xl bg-[#7ED321] hover:bg-[#59C414] text-white text-xs font-bold shadow-sm transition-all">
              Go Premium ($9.99/mo)
            </button>
          </div>

          {/* Recent Activity */}
          <div className="bg-white/80 backdrop-blur-md border border-[#E6E6E2] rounded-3xl p-5 space-y-4 shadow-sm">
            <h3 className="text-xs font-bold text-[#111111] uppercase tracking-wider border-b border-neutral-100 pb-2">
              Recent Activity Feed
            </h3>
            <div className="space-y-3 text-[11px] font-semibold text-[#666666]">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#7ED321] flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-[#111111]">Applied:</span> Frontend role at Stripe.
                  <span className="text-[9px] text-[#999999] block mt-0.5">Applied 10m ago</span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="w-3.5 h-3.5 text-[#59C414] flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-[#111111]">Profile Visited:</span> Sarah Jenkins viewed resume.
                  <span className="text-[9px] text-[#999999] block mt-0.5">Seen 1h ago</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Shared Layout Detail View Modal overlay */}
      <AnimatePresence>
        {detailJob && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#111111]/30 backdrop-blur-sm flex items-center justify-end p-0 md:p-4"
          >
            {/* Modal Backdrop close */}
            <div className="absolute inset-0" onClick={() => setDetailJob(null)} />

            {/* Slider Sheet Panel */}
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative w-full max-w-lg h-full bg-[#F8F8F5] shadow-2xl border-l border-[#E6E6E2] p-6 flex flex-col justify-between overflow-y-auto z-10"
            >
              <div>
                {/* Header Close button */}
                <div className="flex justify-between items-center mb-6">
                  <button 
                    onClick={() => setDetailJob(null)} 
                    className="p-2 rounded-full hover:bg-neutral-200/50 text-[#666666] transition-colors"
                  >
                    <ChevronDown className="w-6 h-6 transform rotate-90" />
                  </button>
                  <span className="text-[10px] font-black text-[#59C414] uppercase tracking-wider bg-[#7ED321]/10 px-3 py-1 rounded-full border border-[#7ED321]/20">
                    Neural Profile Insight
                  </span>
                </div>

                {/* Job Title / Company details header */}
                <div className="space-y-4 border-b border-[#E6E6E2] pb-6">
                  <div className="flex items-start gap-4">
                    <CompanyLogo src={detailJob.company_logo} company={detailJob.company} size="w-16 h-16" />
                    <div>
                      <h2 className="text-xl font-black text-[#111111] leading-tight tracking-tight">{detailJob.title}</h2>
                      <p className="text-sm text-[#59C414] font-bold">{detailJob.company}</p>
                      <p className="text-xs text-[#666666] font-semibold">{detailJob.location || 'Remote'} • {detailJob.job_type || 'Full Time'}</p>
                    </div>
                  </div>

                  {/* Core Metrics tags */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    <span className="px-3 py-1 rounded-full bg-white border border-[#E6E6E2] text-xs font-bold text-[#666666]">
                      Salary: ${(detailJob.salary_min / 1000).toFixed(0)}k - ${(detailJob.salary_max / 1000).toFixed(0)}k
                    </span>
                    <span className="px-3 py-1 rounded-full bg-white border border-[#E6E6E2] text-xs font-bold text-[#666666]">
                      Exp: {detailJob.experience_level || 'Mid-Senior'}
                    </span>
                  </div>
                </div>

                {/* AI Score / ATS Match Panel */}
                <div className="py-6 border-b border-[#E6E6E2] space-y-4">
                  <h3 className="text-xs font-black uppercase text-[#666666] tracking-wider">AI Matching Evaluation</h3>
                  <div className="p-4 rounded-2xl bg-white border border-[#E6E6E2] flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <span className="text-xs text-[#111111] font-bold block">Excellent Match Score</span>
                      <span className="text-[10px] text-[#666666] font-medium leading-relaxed block max-w-[280px]">
                        Your parsed resume skills match this job's tech requirements with 94% compatibility.
                      </span>
                    </div>
                    <MatchScoreRing score={detailJob.match_score || 94} size="w-16 h-16" strokeWidth={4} textSize="text-base" />
                  </div>
                </div>

                {/* Full Description text */}
                <div className="py-6 border-b border-[#E6E6E2] space-y-3">
                  <h3 className="text-xs font-black uppercase text-[#666666] tracking-wider">Job Description</h3>
                  <p className="text-xs text-[#666666] font-semibold leading-relaxed whitespace-pre-line">
                    {detailJob.description}
                  </p>
                </div>

                {/* Requirements details */}
                <div className="py-6 space-y-4">
                  <h3 className="text-xs font-black uppercase text-[#666666] tracking-wider">Requirements & Tech Stack</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-[10px] font-black text-[#666666] uppercase block mb-1">Required Skills</span>
                      <div className="flex flex-wrap gap-1.5">
                        {detailJob.required_skills?.map((skill, index) => (
                          <span 
                            key={index} 
                            className="px-2.5 py-1 rounded-lg bg-white border border-[#E6E6E2] text-[10px] font-bold text-[#666666]"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    {detailJob.nice_to_have_skills?.length > 0 && (
                      <div>
                        <span className="text-[10px] font-black text-[#666666] uppercase block mb-1">Nice to Have</span>
                        <div className="flex flex-wrap gap-1.5">
                          {detailJob.nice_to_have_skills.map((skill, index) => (
                            <span 
                              key={index} 
                              className="px-2.5 py-1 rounded-lg bg-white border border-[#E6E6E2]/80 text-[10px] font-semibold text-neutral-500"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action buttons footer inside drawer */}
              <div className="pt-4 border-t border-[#E6E6E2] flex items-center gap-3 bg-[#F8F8F5]">
                <button 
                  onClick={async () => {
                    if (savingJobId === detailJob.id) return;
                    setSavingJobId(detailJob.id);
                    try {
                      await API.post('/swipes/action', { job_id: detailJob.id, action: 'save' });
                      addToast(`Saved role for later!`, 'info');
                    } catch (err) {
                      addToast('Failed to save role.', 'error');
                    } finally {
                      setSavingJobId(null);
                    }
                  }}
                  disabled={savingJobId === detailJob.id}
                  className="px-4 py-2.5 rounded-xl border border-[#E6E6E2] hover:border-[#7ED321]/30 bg-white text-xs font-bold text-[#111111] flex items-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  <Bookmark className="w-4 h-4 text-[#666666]" />
                  Save
                </button>
                <button 
                  onClick={async () => {
                    if (applyingJobId === detailJob.id) return;
                    setApplyingJobId(detailJob.id);
                    try {
                      await API.post('/swipes/action', { job_id: detailJob.id, action: 'apply' });
                      addToast(`Application submitted successfully!`, 'success');
                      setJobs((prev) => prev.filter((j) => j.id !== detailJob.id));
                      setDetailJob(null);
                    } catch (err) {
                      addToast('Application submission failed.', 'error');
                    } finally {
                      setApplyingJobId(null);
                    }
                  }}
                  disabled={applyingJobId === detailJob.id}
                  className="flex-1 py-2.5 rounded-xl bg-[#7ED321] hover:bg-[#59C414] text-white text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {applyingJobId === detailJob.id ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Heart className="w-4 h-4 fill-white/20" />
                      Instant Apply
                    </>
                  )}
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
