import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useNotification } from '../context/NotificationContext';
import Sidebar from '../components/Sidebar';
import { Briefcase, CheckCircle2, Clock, Zap, Building2, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AppliedJobs() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useNotification();

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await API.get('/applications/');
      setApplications(res.data);
    } catch (err) {
      addToast('Unable to load your applications. Please try again.', 'error');
    } finally {
      setLoading(false);
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
              <Briefcase className="w-8 h-8 text-[#ff6b00]" />
              My Submitted Applications
            </h1>
            <p className="text-xs text-[#5a4136] dark:text-[#e2bfb0] font-medium mt-1">
              Track real-time candidate application status across all jobs swiped right.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="py-24 text-center text-xs font-black text-[#a04100] dark:text-[#ffb693] uppercase tracking-widest animate-pulse flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-[#ff6b00]" /> Loading applications...
          </div>
        ) : applications.length === 0 ? (
          <div className="reference-card p-14 text-center text-[#5a4136] dark:text-[#e2bfb0] bg-white/80 dark:bg-[#191f2f]/80 font-medium">
            No applications submitted yet. Swipe Right on jobs in the Swipe Feed to apply instantly!
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <div
                key={app.id}
                className="reference-card p-6 bg-white/80 dark:bg-[#191f2f]/80 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm"
              >
                <div className="space-y-1">
                  <h3 className="font-extrabold text-lg text-[#261812] dark:text-white">{app.job?.title || 'Job Application'}</h3>
                  <div className="flex items-center gap-2 text-xs text-[#ff6b00] font-bold">
                    <Building2 className="w-3.5 h-3.5" />
                    {app.job?.company} • {app.job?.location}
                  </div>
                  <div className="text-[11px] text-[#5a4136] dark:text-[#e2bfb0]/70 font-semibold pt-1">
                    Applied on: {new Date(app.applied_at).toLocaleDateString()}
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="text-sm font-black text-[#ff6b00] dark:text-[#ffb693]">{app.match_score}% Match</div>
                    <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">ATS Score: {app.ats_score}/100</div>
                  </div>

                  <span className={`px-4.5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider ${
                    app.status === 'Interviewing' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 animate-pulse' :
                    app.status === 'Shortlisted' ? 'bg-[#ff6b00]/10 text-[#a04100] dark:text-[#ffb693] border border-[#ff6b00]/30' :
                    app.status === 'Offered' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20' :
                    app.status === 'Rejected' ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20' :
                    'bg-white/40 dark:bg-white/5 text-[#5a4136] dark:text-[#e2bfb0] border border-[#e2bfb0]/20 dark:border-white/5'
                  }`}>
                    {app.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

      </motion.div>

      <div className="hidden">
        <CheckCircle2 className="w-1" />
        <Clock className="w-1" />
        <Zap className="w-1" />
      </div>

    </div>
  );
}
