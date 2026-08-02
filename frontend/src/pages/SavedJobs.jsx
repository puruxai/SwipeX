import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useNotification } from '../context/NotificationContext';
import Sidebar from '../components/Sidebar';
import { Bookmark, Building2, Globe, Heart, Trash2, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SavedJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const { addToast } = useNotification();

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const fetchSavedJobs = async () => {
    try {
      const res = await API.get('/applications/saved');
      setJobs(res.data);
    } catch (err) {
      addToast('Unable to load saved jobs. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyNow = async (job) => {
    try {
      await API.post('/swipes/action', {
        job_id: job.id,
        action: 'like'
      });
      addToast(`Applied for ${job.title} at ${job.company}!`, 'success');
      fetchSavedJobs();
    } catch (err) {
      addToast('Application failed', 'error');
    }
  };

  const pageVariants = {
    hidden: { opacity: 0, y: 15, filter: 'blur(6px)' },
    show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { type: 'spring', stiffness: 100 } }
  };

  return (
    <div className="flex min-h-[90vh] bg-[#fff8f6] dark:bg-[#0c1322] text-[#261812] dark:text-[#dce2f7] transition-colors">
      
      {/* Left Sidebar Shell */}
      <Sidebar />

      {/* Main Content Area Container */}
      <motion.div 
        initial="hidden"
        animate="show"
        variants={pageVariants}
        className="flex-1 p-8 lg:p-10 space-y-8"
      >
        
        {/* Page Header */}
        <div className="flex justify-between items-end border-b border-[#e2bfb0]/30 dark:border-white/5 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-[#261812] dark:text-white tracking-tight flex items-center gap-3">
              <Bookmark className="w-8 h-8 text-[#ff6b00]" />
              Saved & Bookmarked Jobs
            </h1>
            <p className="text-xs text-[#5a4136] dark:text-[#e2bfb0] font-medium mt-1">
              Review jobs you bookmarked during your swipe feed discovery.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="py-24 text-center text-xs font-black text-[#a04100] dark:text-[#ffb693] uppercase tracking-widest animate-pulse flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-[#ff6b00]" /> Loading saved jobs...
          </div>
        ) : jobs.length === 0 ? (
          <div className="reference-card p-14 text-center space-y-4 bg-white dark:bg-[#191f2f]/80">
            <p className="font-extrabold text-[#261812] dark:text-white text-base">No saved jobs found.</p>
            <p className="text-xs text-[#5a4136] dark:text-[#e2bfb0] font-medium">Bookmark job cards in your Swipe Feed to save them for later!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="reference-card p-6 bg-white dark:bg-[#191f2f]/80 hover:border-[#ff6b00]/40 transition-all flex flex-col justify-between space-y-4 shadow-sm"
              >
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={job.company_logo || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80"}
                      alt={job.company}
                      className="w-12 h-12 rounded-xl object-cover ring-1 ring-[#ff6b00]/20 shadow-sm"
                    />
                    <div>
                      <h3 className="font-extrabold text-base text-[#261812] dark:text-white line-clamp-1">{job.title}</h3>
                      <p className="text-xs text-[#ff6b00] font-bold">{job.company}</p>
                    </div>
                  </div>
                  <p className="text-xs text-[#5a4136] dark:text-[#e2bfb0]/80 line-clamp-3 mb-3 leading-relaxed font-semibold">{job.description}</p>
                  <div className="text-xs text-[#5a4136] dark:text-[#e2bfb0]/70 font-bold">{job.location}</div>
                </div>

                <div className="pt-3 border-t border-[#e2bfb0]/20 dark:border-white/5 flex justify-between items-center">
                  <span className="text-xs text-[#22C55E] dark:text-emerald-400 font-extrabold">
                    ${(job.salary_min / 1000).toFixed(0)}k - ${(job.salary_max / 1000).toFixed(0)}k
                  </span>
                  <button
                    onClick={() => handleApplyNow(job)}
                    className="btn-terracotta px-4.5 py-2 text-xs font-black shadow-md flex items-center gap-1.5"
                  >
                    <Heart className="w-3.5 h-3.5 fill-white" /> Instant Apply
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </motion.div>

      <div className="hidden">
        <Building2 className="w-1" />
        <Globe className="w-1" />
        <Trash2 className="w-1" />
      </div>

    </div>
  );
}
