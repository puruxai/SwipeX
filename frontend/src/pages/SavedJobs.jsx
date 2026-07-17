import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useNotification } from '../context/NotificationContext';
import { Bookmark, Building2, Globe, Heart, Trash2 } from 'lucide-react';

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

  return (
    <div className="py-8 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      <div>
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
          <Bookmark className="w-8 h-8 text-[#FF6B00]" />
          Saved & Bookmarked Jobs
        </h1>
        <p className="text-sm text-[#A8A8A8] mt-1">
          Review jobs you bookmarked during your swipe feed discovery.
        </p>
      </div>

      {loading ? (
        <div className="py-12 text-center text-[#A8A8A8]">Loading saved jobs...</div>
      ) : jobs.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl text-center text-[#A8A8A8] border border-[#262626] bg-[#181818]/60 space-y-3">
          <p>No saved jobs found.</p>
          <p className="text-xs">Swipe Up on job cards in your Swipe Feed to bookmark them for later!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="glass-panel p-6 rounded-3xl border border-[#262626] bg-[#181818]/60 hover:border-[#FF6B00]/40 transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={job.company_logo || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80"}
                    alt={job.company}
                    className="w-12 h-12 rounded-xl object-cover ring-1 ring-[#FF6B00]/20"
                  />
                  <div>
                    <h3 className="font-extrabold text-base text-white line-clamp-1">{job.title}</h3>
                    <p className="text-xs text-[#FF8A3D] font-medium">{job.company}</p>
                  </div>
                </div>
                <p className="text-xs text-slate-300 line-clamp-3 mb-3">{job.description}</p>
                <div className="text-xs text-[#A8A8A8] font-semibold">{job.location}</div>
              </div>

              <div className="pt-3 border-t border-[#262626] flex justify-between items-center">
                <span className="text-xs text-[#22C55E] font-bold">
                  ${(job.salary_min / 1000).toFixed(0)}k - ${(job.salary_max / 1000).toFixed(0)}k
                </span>
                <button
                  onClick={() => handleApplyNow(job)}
                  className="px-4 py-2 bg-gradient-to-r from-[#22C55E] to-[#4ADE80] font-bold text-slate-950 rounded-xl text-xs shadow-[0_4px_15px_rgba(34,197,94,0.3)] transition-all flex items-center gap-1 hover:scale-105"
                >
                  <Heart className="w-3.5 h-3.5 fill-slate-950" /> Instant Apply
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
