import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { useNotification } from '../context/NotificationContext';
import soundManager from '../services/SoundManager';
import Sidebar from '../components/Sidebar';
import { 
  Building2, 
  MapPin, 
  DollarSign, 
  Bookmark, 
  Sparkles, 
  Check, 
  Zap, 
  Search, 
  ChevronRight,
  RotateCcw,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SwipeJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applyingJobId, setApplyingJobId] = useState(null);
  const [savingJobId, setSavingJobId] = useState(null);
  const { addToast } = useNotification();
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await API.get('/swipes/feed');
      setJobs(res.data);
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

  const handleApply = async (job) => {
    if (applyingJobId === job.id) return;
    setApplyingJobId(job.id);
    soundManager.playSuccess();

    try {
      await API.post('/swipes/action', { job_id: job.id, action: 'apply' });
      addToast(`Application submitted successfully for ${job.title}!`, 'success');
      setJobs((prev) => prev.filter((j) => j.id !== job.id));
    } catch (err) {
      const status = err.response?.status;
      const detail = err.response?.data?.detail;

      if (status === 409 || (typeof detail === 'string' && detail.toLowerCase().includes('already applied'))) {
        addToast(`You have already applied for ${job.title}.`, 'info');
      } else if (status === 401) {
        addToast('Session expired. Please log in.', 'error');
        navigate('/login');
      } else if (status === 404) {
        addToast('Job posting not found.', 'error');
      } else {
        addToast(detail || 'Application submission failed. Please try again.', 'error');
      }
    } finally {
      setApplyingJobId(null);
    }
  };

  const handleSave = async (job) => {
    if (savingJobId === job.id) return;
    setSavingJobId(job.id);
    soundManager.playTick();

    try {
      await API.post('/swipes/action', { job_id: job.id, action: 'save' });
      addToast(`Saved ${job.title}!`, 'info');
    } catch (err) {
      if (err.response?.status === 401) {
        addToast('Session expired. Please log in.', 'error');
        navigate('/login');
      } else {
        addToast('Failed to save role.', 'error');
      }
    } finally {
      setSavingJobId(null);
    }
  };

  const handleActionClick = () => {
    soundManager.playTick();
  };

  const handleHover = () => {
    soundManager.playHover();
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 24, scale: 0.98, filter: 'blur(4px)' },
    show: { 
      opacity: 1, 
      y: 0, 
      scale: 1, 
      filter: 'blur(0px)',
      transition: { type: 'spring', stiffness: 100, damping: 15 } 
    }
  };

  return (
    <div className="flex min-h-[90vh] bg-[#030509] text-[#f1f5f9] transition-colors relative">
      
      {/* Left Navigation Sidebar */}
      <Sidebar />

      {/* Main Content Area + Right Sidebar Container */}
      <div className="flex-1 p-8 lg:p-10 grid grid-cols-1 lg:grid-cols-12 gap-10 relative z-10">
        
        {/* Main Feed Column */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Header */}
          <div className="flex justify-between items-end border-b border-white/5 pb-6">
            <div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight">AI Swipe Discovery Feed</h1>
              <p className="text-xs text-[#e2bfb0] font-medium mt-1.5">
                Neural matching based on your expertise in Generative Architectures and Scalable Systems.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50" className="w-6 h-6 rounded-full border border-[#0c1322] object-cover" alt="Avatar" />
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50" className="w-6 h-6 rounded-full border border-[#0c1322] object-cover" alt="Avatar" />
              </div>
              <span className="text-[11px] font-extrabold text-[#e2bfb0] bg-white/5 border border-white/10 px-3 py-1 rounded-full">{jobs.length} Active Matches</span>
            </div>
          </div>

          {/* Job Feed Cards */}
          {loading ? (
            <div className="py-24 text-center text-xs font-black text-[#ffb693] uppercase tracking-widest animate-pulse flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-[#ff6b00]" /> Loading Neural Feed...
            </div>
          ) : jobs.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="reference-card p-14 text-center space-y-4 border border-white/5 bg-[#191f2f]/40"
            >
              <Sparkles className="w-8 h-8 text-[#ffb693] mx-auto animate-bounce" />
              <h3 className="text-lg font-bold text-white">You're All Caught Up!</h3>
              <p className="text-xs text-[#e2bfb0] font-medium max-w-sm mx-auto leading-relaxed">
                You have reviewed all available active job matches. Check back soon for new neural recommendations.
              </p>
              <button 
                onClick={() => { handleActionClick(); fetchJobs(); }}
                onMouseEnter={handleHover}
                className="btn-terracotta px-6 py-2.5 text-xs font-bold shadow-md"
              >
                Refresh Feed
              </button>
            </motion.div>
          ) : (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="space-y-6"
            >
              {jobs.map((job) => (
                <motion.div
                  key={job.id}
                  variants={cardVariants}
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                  className="reference-card p-8 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden border border-white/5 bg-[#191f2f]/40"
                >
                  
                  {/* Left Role Info */}
                  <div className="space-y-4 flex-1 w-full">
                    <div className="flex items-start gap-5">
                      <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 text-[#ffb693] font-black text-xl flex items-center justify-center flex-shrink-0">
                        {job.company ? job.company[0] : 'C'}
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-extrabold text-xl text-white leading-snug">{job.title}</h3>
                        <p className="text-xs text-[#e2bfb0] font-bold">
                          {job.company} • {job.location || 'Remote'}
                        </p>
                      </div>
                    </div>

                    {/* Salary & Match Details */}
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="px-4 py-1.5 rounded-full bg-white/5 border border-white/5 text-[#ffb693] font-extrabold text-xs">
                        ${job.salary_min?.toLocaleString() || '180,000'} - ${job.salary_max?.toLocaleString() || '250,000'}
                      </span>
                    </div>

                    {/* Skill Tag Pills */}
                    <div className="flex flex-wrap gap-2 pt-1">
                      {job.required_skills?.map((skill, i) => (
                        <span key={i} className="px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/5 text-[11px] font-bold text-[#e2bfb0]">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Center Circular Match Ring */}
                  <div className="flex flex-col items-center justify-center text-center flex-shrink-0 px-6 py-2">
                    <div className="w-16 h-16 rounded-full border-4 border-[#ffb693] flex items-center justify-center font-black text-base text-white bg-white/5 shadow-md">
                      {job.match_score || job.match_percentage || 94}%
                    </div>
                    <span className="text-[9px] font-black uppercase text-[#ffb693] tracking-widest mt-2.5">NEURAL MATCH</span>
                  </div>

                  {/* Right Action Buttons */}
                  <div className="flex flex-col gap-2.5 flex-shrink-0 w-full md:w-40 border-t md:border-t-0 md:border-l border-white/5 pt-4 md:pt-0 md:pl-6">
                    <button
                      onClick={() => handleApply(job)}
                      onMouseEnter={handleHover}
                      disabled={applyingJobId === job.id}
                      className="btn-terracotta py-3.5 px-4 text-xs font-black w-full flex items-center justify-center gap-1.5 disabled:opacity-50 shadow-md"
                    >
                      {applyingJobId === job.id ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" /> Submitting...
                        </>
                      ) : (
                        'Quick Apply'
                      )}
                    </button>
                    <button
                      onClick={() => handleSave(job)}
                      onMouseEnter={handleHover}
                      disabled={savingJobId === job.id}
                      className="btn-terracotta-outline py-3.5 px-4 text-xs font-bold w-full disabled:opacity-50"
                    >
                      Save Role
                    </button>
                  </div>

                </motion.div>
              ))}
            </motion.div>
          )}

        </div>

        {/* Right Sidebar Column */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Saved Searches Card */}
          <div className="reference-card p-6 space-y-4 border border-white/5 bg-[#191f2f]/40">
            <h3 className="text-xs font-black text-white uppercase tracking-widest border-b border-white/5 pb-2.5">Saved Searches</h3>
            <div className="space-y-3">
              <div 
                onClick={handleActionClick}
                onMouseEnter={handleHover}
                className="flex justify-between items-center p-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs font-bold hover:scale-[1.01] transition-transform cursor-pointer"
              >
                <span className="text-white">Generative AI Lead</span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#ff6b00] text-white text-[9px] font-black uppercase tracking-wider">3 NEW</span>
              </div>
              <div 
                onClick={handleActionClick}
                onMouseEnter={handleHover}
                className="flex justify-between items-center p-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs font-bold hover:scale-[1.01] transition-transform cursor-pointer"
              >
                <span className="text-[#e2bfb0]">Data Infrastructure</span>
                <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-[#e2bfb0] text-[9px] font-black uppercase tracking-wider">0 NEW</span>
              </div>
            </div>
          </div>

          {/* Recommended Skills Card */}
          <div className="reference-card p-6 space-y-4 border border-white/5 bg-[#191f2f]/40">
            <h3 className="text-xs font-black text-white uppercase tracking-widest border-b border-white/5 pb-2.5">Recommended Skills</h3>
            <div className="flex flex-wrap gap-2 text-xs font-bold">
              <span onMouseEnter={handleHover} onClick={handleActionClick} className="px-3.5 py-2 rounded-xl bg-white/5 border border-white/5 text-[#e2bfb0] hover:border-[#ff6b00] transition-colors cursor-pointer">RLHF Training</span>
              <span onMouseEnter={handleHover} onClick={handleActionClick} className="px-3.5 py-2 rounded-xl bg-white/5 border border-white/5 text-[#e2bfb0] hover:border-[#ff6b00] transition-colors cursor-pointer">Vector DBs</span>
              <span onMouseEnter={handleHover} onClick={handleActionClick} className="px-3.5 py-2 rounded-xl bg-white/5 border border-white/5 text-[#e2bfb0] hover:border-[#ff6b00] transition-colors cursor-pointer">Kubernetes</span>
              <span onMouseEnter={handleHover} onClick={handleActionClick} className="px-3.5 py-2 rounded-xl bg-white/5 border border-white/5 text-[#e2bfb0] hover:border-[#ff6b00] transition-colors cursor-pointer">On-Device Inference</span>
            </div>
          </div>

          {/* Dark Premium Banner */}
          <div className="rounded-3xl bg-gradient-to-br from-[#191f2f] to-[#0c1322] border border-white/5 text-white p-7 space-y-5 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#ff6b00]/10 blur-xl rounded-full" />
            <h3 className="text-base font-extrabold tracking-wide">Unlock SwipeX Premium</h3>
            <p className="text-xs opacity-85 font-medium leading-relaxed">
              Get priority placement for your neural profile and direct DM access to lead recruiters.
            </p>
            <button 
              onClick={handleActionClick}
              onMouseEnter={handleHover}
              className="w-full py-3.5 rounded-xl bg-[#ffb693] text-[#561f00] text-xs font-black shadow-md hover:scale-[1.01] active:scale-98 transition-all"
            >
              Go Premium
            </button>
          </div>

        </div>

      </div>

      <div className="hidden">
        <Bookmark className="w-1" />
        <MapPin className="w-1" />
        <DollarSign className="w-1" />
        <Building2 className="w-1" />
        <Zap className="w-1" />
        <Search className="w-1" />
        <ChevronRight className="w-1" />
        <RotateCcw className="w-1" />
      </div>

    </div>
  );
}
