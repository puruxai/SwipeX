import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { useNotification } from '../context/NotificationContext';
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

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: { type: 'spring', stiffness: 120, damping: 18 } 
    }
  };

  return (
    <div className="flex min-h-[90vh] bg-[#F8F8F5] text-[#111111] transition-colors">
      
      {/* Left Navigation Sidebar */}
      <Sidebar />

      {/* Main Content Area + Right Sidebar Container */}
      <div className="flex-1 p-8 lg:p-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Main Feed Column */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Header */}
          <div className="flex justify-between items-end border-b border-[#E6E6E2] pb-6">
            <div>
              <h1 className="text-2xl font-extrabold text-[#111111] tracking-tight">AI Swipe Discovery Feed</h1>
              <p className="text-xs text-[#666666] font-medium mt-1">
                Neural matching based on your expertise in Generative Architectures and Scalable Systems.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold text-[#666666] bg-white border border-[#E6E6E2] px-3 py-1.5 rounded-full">{jobs.length} Active Matches</span>
            </div>
          </div>

          {/* Job Feed Cards */}
          {loading ? (
            <div className="py-24 text-center text-xs font-bold text-[#59C414] uppercase tracking-widest animate-pulse flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-[#7ED321]" /> Loading Neural Feed...
            </div>
          ) : jobs.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="reference-card p-14 text-center space-y-4 bg-white border border-[#E6E6E2]"
            >
              <Sparkles className="w-7 h-7 text-[#7ED321] mx-auto animate-bounce" />
              <h3 className="text-base font-bold text-[#111111]">You're All Caught Up!</h3>
              <p className="text-xs text-[#666666] font-medium max-w-sm mx-auto leading-relaxed">
                You have reviewed all available active job matches. Check back soon for new neural recommendations.
              </p>
              <button onClick={fetchJobs} className="btn-terracotta px-5 py-2.5 text-xs font-bold shadow-sm">
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
                  className="reference-card p-6 flex flex-col md:flex-row items-center justify-between gap-6 bg-white border border-[#E6E6E2]"
                >
                  
                  {/* Left Role Info */}
                  <div className="space-y-3.5 flex-1 w-full">
                    <div className="flex items-start gap-4">
                      {job.company_logo ? (
                        <img
                          src={job.company_logo}
                          alt={`${job.company} logo`}
                          className="w-12 h-12 rounded-xl object-contain border border-[#E6E6E2] bg-white p-1 flex-shrink-0"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-[#F8F8F5] border border-[#E6E6E2] text-[#59C414] font-black text-lg flex items-center justify-center flex-shrink-0">
                          {job.company ? job.company[0] : 'C'}
                        </div>
                      )}
                      <div className="space-y-0.5">
                        <h3 className="font-extrabold text-lg text-[#111111] leading-snug">{job.title}</h3>
                        <p className="text-xs text-[#666666] font-bold">
                          {job.company} • {job.location || 'Remote'}
                        </p>
                      </div>
                    </div>

                    {/* Salary & Match Details */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-[#F8F8F5] border border-[#E6E6E2] text-[#59C414] font-bold text-xs">
                        ${job.salary_min?.toLocaleString() || '180,000'} - ${job.salary_max?.toLocaleString() || '250,000'}
                      </span>
                    </div>

                    {/* Skill Tag Pills */}
                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      {job.required_skills?.map((skill, i) => (
                        <span key={i} className="px-2.5 py-1 rounded-lg bg-[#F8F8F5] border border-[#E6E6E2] text-[10px] font-semibold text-[#666666]">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Center Circular Match Ring */}
                  <div className="flex flex-col items-center justify-center text-center flex-shrink-0 px-4">
                    <div className="w-14 h-14 rounded-full border-4 border-[#7ED321] flex items-center justify-center font-bold text-sm text-[#111111] bg-[#F8F8F5] shadow-sm">
                      {job.match_score || job.match_percentage || 94}%
                    </div>
                    <span className="text-[8px] font-bold uppercase text-[#59C414] tracking-wider mt-2">Neural Match</span>
                  </div>

                  {/* Right Action Buttons */}
                  <div className="flex flex-col gap-2 flex-shrink-0 w-full md:w-36 border-t md:border-t-0 md:border-l border-neutral-100 pt-3 md:pt-0 md:pl-4">
                    <button
                      onClick={() => handleApply(job)}
                      disabled={applyingJobId === job.id}
                      className="btn-terracotta py-2 px-3 text-xs font-bold w-full flex items-center justify-center gap-1.5 disabled:opacity-50 shadow-sm"
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
                      disabled={savingJobId === job.id}
                      className="btn-terracotta-outline py-2 px-3 text-xs font-bold w-full disabled:opacity-50 bg-white border border-[#E6E6E2] text-[#111111]"
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
          <div className="reference-card p-5 space-y-4 bg-white border border-[#E6E6E2]">
            <h3 className="text-xs font-bold text-[#111111] uppercase tracking-wider border-b border-neutral-100 pb-2">Saved Searches</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-3 rounded-xl bg-[#F8F8F5] border border-[#E6E6E2] text-xs font-semibold">
                <span className="text-[#111111]">Generative AI Lead</span>
                <span className="px-2 py-0.5 rounded-full bg-[#7ED321] text-white text-[9px] font-bold uppercase tracking-wider">3 NEW</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-[#F8F8F5] border border-[#E6E6E2] text-xs font-semibold">
                <span className="text-[#666666]">Data Infrastructure</span>
                <span className="px-2 py-0.5 rounded-full bg-neutral-200 text-[#666666] text-[9px] font-bold uppercase tracking-wider">0 NEW</span>
              </div>
            </div>
          </div>

          {/* Recommended Skills Card */}
          <div className="reference-card p-5 space-y-4 bg-white border border-[#E6E6E2]">
            <h3 className="text-xs font-bold text-[#111111] uppercase tracking-wider border-b border-neutral-100 pb-2">Recommended Skills</h3>
            <div className="flex flex-wrap gap-1.5 text-xs font-bold">
              <span className="px-3 py-1.5 rounded-xl bg-[#F8F8F5] border border-[#E6E6E2] text-[#666666] hover:border-[#7ED321] transition-colors cursor-pointer text-xs font-semibold">RLHF Training</span>
              <span className="px-3 py-1.5 rounded-xl bg-[#F8F8F5] border border-[#E6E6E2] text-[#666666] hover:border-[#7ED321] transition-colors cursor-pointer text-xs font-semibold">Vector DBs</span>
              <span className="px-3 py-1.5 rounded-xl bg-[#F8F8F5] border border-[#E6E6E2] text-[#666666] hover:border-[#7ED321] transition-colors cursor-pointer text-xs font-semibold">Kubernetes</span>
            </div>
          </div>

          {/* SaaS Premium Promo Banner */}
          <div className="rounded-2xl bg-white border border-[#E6E6E2] p-6 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-[#111111]">Unlock SwipeX Premium</h3>
            <p className="text-xs text-[#666666] font-medium leading-relaxed">
              Get priority placement for your neural profile and direct DM access to lead recruiters.
            </p>
            <button className="w-full py-2.5 rounded-xl bg-[#7ED321] hover:bg-[#59C414] text-white text-xs font-bold shadow-sm transition-all">
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
