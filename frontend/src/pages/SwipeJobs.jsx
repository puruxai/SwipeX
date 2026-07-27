import React, { useState, useEffect } from 'react';
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
  RotateCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SwipeJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useNotification();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await API.get('/swipes/feed');
      setJobs(res.data);
    } catch (err) {
      addToast('Unable to load curated job feed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (job) => {
    try {
      await API.post('/swipes/', { job_id: job.id, action: 'apply' });
      addToast(`Applied to ${job.title} at ${job.company}!`, 'success');
    } catch (err) {
      addToast('Failed to submit application.', 'error');
    }
  };

  const handleSave = async (job) => {
    try {
      await API.post('/swipes/', { job_id: job.id, action: 'bookmark' });
      addToast(`Saved ${job.title}!`, 'info');
    } catch (err) {
      addToast('Failed to save role.', 'error');
    }
  };

  return (
    <div className="flex min-h-[90vh] bg-[#FFF9F5] text-[#1C1917]">
      
      {/* Left Navigation Sidebar Shell */}
      <Sidebar />

      {/* Main Content Area + Right Sidebar Container */}
      <div className="flex-1 p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Feed Column (Matching Reference Screenshot 2) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Header */}
          <div className="flex justify-between items-end border-b border-[#F3E8E2] pb-4">
            <div>
              <h1 className="text-3xl font-black text-[#1C1917] tracking-tight">Curated for You</h1>
              <p className="text-xs text-[#78716C] font-medium mt-1">
                Neural matching based on your expertise in Generative Architectures and Scalable Systems.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50" className="w-6 h-6 rounded-full border border-white" alt="Avatar" />
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50" className="w-6 h-6 rounded-full border border-white" alt="Avatar" />
              </div>
              <span className="text-[11px] font-bold text-[#78716C]">42 Active Matches</span>
            </div>
          </div>

          {/* Job Feed Cards */}
          {loading ? (
            <div className="py-20 text-center text-xs font-black text-[#A8A29E] uppercase tracking-widest animate-pulse">
              Loading Neural Feed...
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="reference-card p-6 border border-[#F3E8E2] bg-white rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm"
                >
                  
                  {/* Left Role Info */}
                  <div className="space-y-3 flex-1">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-[#FFF0E6] text-[#963200] font-black text-lg flex items-center justify-center flex-shrink-0">
                        {job.company ? job.company[0] : 'C'}
                      </div>
                      <div>
                        <h3 className="font-black text-lg text-[#1C1917] leading-tight">{job.title}</h3>
                        <p className="text-xs text-[#78716C] font-semibold mt-0.5">
                          {job.company} • {job.location || 'Remote'}
                        </p>
                      </div>
                    </div>

                    {/* Salary Pill */}
                    <div>
                      <span className="px-3.5 py-1 rounded-full bg-[#FFF0E6] text-[#963200] font-black text-xs">
                        ${job.salary_min?.toLocaleString() || '180,000'} - ${job.salary_max?.toLocaleString() || '250,000'}
                      </span>
                    </div>

                    {/* Skill Tag Pills */}
                    <div className="flex flex-wrap gap-1.5">
                      {job.required_skills?.map((skill, i) => (
                        <span key={i} className="px-3 py-1 rounded-full bg-[#FFF0E6] text-[#57534E] text-xs font-bold">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Center Circular Match Ring */}
                  <div className="flex flex-col items-center justify-center text-center flex-shrink-0 px-4">
                    <div className="w-16 h-16 rounded-full border-4 border-[#963200] flex items-center justify-center font-black text-base text-[#963200]">
                      {job.match_score || 94}%
                    </div>
                    <span className="text-[10px] font-black uppercase text-[#963200] tracking-wider mt-1">NEURAL MATCH</span>
                  </div>

                  {/* Right Action Buttons */}
                  <div className="flex flex-col gap-2 flex-shrink-0 w-full md:w-36">
                    <button
                      onClick={() => handleApply(job)}
                      className="btn-terracotta py-2.5 px-4 text-xs font-black w-full"
                    >
                      Quick Apply
                    </button>
                    <button
                      onClick={() => handleSave(job)}
                      className="btn-terracotta-outline py-2.5 px-4 text-xs font-bold w-full"
                    >
                      Save Role
                    </button>
                  </div>

                </div>
              ))}
            </div>
          )}

        </div>

        {/* Right Sidebar Column (Matching Reference Screenshot 2) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Saved Searches Card */}
          <div className="reference-card p-5 border border-[#F3E8E2] bg-white rounded-3xl space-y-3">
            <h3 className="text-sm font-black text-[#1C1917]">Saved Searches</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-3 rounded-2xl bg-[#FFF0E6] text-xs font-bold">
                <span>Generative AI Lead</span>
                <span className="px-2 py-0.5 rounded-full bg-[#963200] text-white text-[10px]">3 NEW</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-2xl bg-slate-50 text-xs font-bold">
                <span>Data Infrastructure</span>
                <span className="px-2 py-0.5 rounded-full bg-slate-200 text-[#78716C] text-[10px]">0 NEW</span>
              </div>
            </div>
          </div>

          {/* Recommended Skills Card */}
          <div className="reference-card p-5 border border-[#F3E8E2] bg-white rounded-3xl space-y-3">
            <h3 className="text-sm font-black text-[#1C1917]">Recommended Skills</h3>
            <div className="flex flex-wrap gap-2 text-xs font-bold">
              <span className="px-3 py-1.5 rounded-full bg-[#FFF0E6] text-[#57534E]">RLHF Training</span>
              <span className="px-3 py-1.5 rounded-full bg-[#FFF0E6] text-[#57534E]">Vector DBs</span>
              <span className="px-3 py-1.5 rounded-full bg-[#FFF0E6] text-[#57534E]">Kubernetes</span>
              <span className="px-3 py-1.5 rounded-full bg-[#FFF0E6] text-[#57534E]">On-Device Inference</span>
            </div>
          </div>

          {/* Dark Charcoal Premium Banner */}
          <div className="rounded-3xl bg-[#292524] text-white p-6 space-y-4 shadow-xl">
            <h3 className="text-base font-black">Unlock SwipeX Premium</h3>
            <p className="text-xs opacity-80 font-medium">
              Get priority placement for your neural profile and direct DM access to lead recruiters.
            </p>
            <button className="w-full py-3 rounded-xl bg-[#FF8A3D] text-white text-xs font-black shadow-md hover:bg-[#F97316]">
              Go Premium
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
