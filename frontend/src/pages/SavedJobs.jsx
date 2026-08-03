import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useNotification } from '../context/NotificationContext';
import Sidebar from '../components/Sidebar';
import CompanyLogo from '../components/CompanyLogo';
import { Bookmark, Building2, Globe, Heart, Trash2, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SavedJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const { addToast } = useNotification();

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const fetchSavedJobs = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await API.get('/applications/saved');
      setJobs(res.data);
    } catch (err) {
      setError(true);
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
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
  };

  return (
    <div className="flex min-h-[90vh] bg-[#F8F8F5] text-[#111111] transition-colors">
      
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
        <div className="flex justify-between items-end border-b border-[#E6E6E2] pb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-[#111111] tracking-tight flex items-center gap-3">
              <Bookmark className="w-8 h-8 text-[#7ED321]" />
              Saved & Bookmarked Jobs
            </h1>
            <p className="text-xs text-[#666666] font-medium mt-1">
              Review jobs you bookmarked during your swipe feed discovery.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="py-24 text-center text-xs font-bold text-[#59C414] uppercase tracking-widest animate-pulse flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-[#7ED321]" /> Loading saved jobs...
          </div>
        ) : error ? (
          <div className="depth-3d-card p-14 text-center space-y-4">
            <p className="font-bold text-[#111111] text-base">Failed to Load Saved Jobs</p>
            <p className="text-xs text-[#666666] font-semibold leading-relaxed">
              We encountered an issue communicating with SwipeX cloud services. Please check your connection.
            </p>
            <button 
              onClick={fetchSavedJobs} 
              className="depth-3d-button px-6 py-2.5 text-xs font-bold text-white"
            >
              Retry Connection
            </button>
          </div>
        ) : jobs.length === 0 ? (
          <div className="depth-3d-card p-14 text-center space-y-4">
            <p className="font-bold text-[#111111] text-base">No saved jobs found.</p>
            <p className="text-xs text-[#666666] font-medium">Bookmark job cards in your Swipe Feed to save them for later!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="depth-3d-card p-6 flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <CompanyLogo src={job.company_logo} company={job.company} />
                    <div>
                      <h3 className="font-bold text-base text-[#111111] line-clamp-1">{job.title}</h3>
                      <p className="text-xs text-[#59C414] font-bold">{job.company}</p>
                    </div>
                  </div>
                  <p className="text-xs text-[#666666] line-clamp-3 mb-3 leading-relaxed font-semibold">{job.description}</p>
                  <div className="text-xs text-[#666666] font-bold">{job.location}</div>
                </div>

                <div className="pt-3 border-t border-[#E6E6E2] flex justify-between items-center">
                  <span className="text-xs text-[#7ED321] font-bold">
                    ${(job.salary_min / 1000).toFixed(0)}k - ${(job.salary_max / 1000).toFixed(0)}k
                  </span>
                  <button
                    onClick={() => handleApplyNow(job)}
                    className="depth-3d-button px-4.5 py-2 text-xs font-bold text-white flex items-center gap-1.5"
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
