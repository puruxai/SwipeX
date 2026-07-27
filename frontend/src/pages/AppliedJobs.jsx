import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useNotification } from '../context/NotificationContext';
import { Briefcase, CheckCircle2, Clock, Zap, Building2 } from 'lucide-react';
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

  return (
    <div className="py-8 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      <div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <Briefcase className="w-8 h-8 text-[#FF6B00]" />
          My Submitted Applications
        </h1>
        <p className="text-xs text-slate-500 dark:text-neutral-400 mt-1 font-medium">
          Track real-time candidate application status across all jobs swiped right.
        </p>
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs font-bold text-slate-400 dark:text-neutral-500">Loading applications...</div>
      ) : applications.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl text-center text-slate-500 dark:text-neutral-400 border border-slate-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 font-medium shadow-sm">
          No applications submitted yet. Swipe Right on jobs in the Swipe Feed to apply instantly!
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <motion.div
              whileHover={{ y: -2 }}
              key={app.id}
              className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm"
            >
              <div className="space-y-1">
                <h3 className="font-black text-lg text-slate-900 dark:text-white">{app.job?.title || 'Job Application'}</h3>
                <div className="flex items-center gap-2 text-xs text-[#FF6B00] font-bold">
                  <Building2 className="w-3.5 h-3.5" />
                  {app.job?.company} • {app.job?.location}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-neutral-400 font-medium pt-1">
                  Applied on: {new Date(app.applied_at).toLocaleDateString()}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-sm font-black text-[#FF6B00] dark:text-[#FF9D42]">{app.match_score}% Match</div>
                  <div className="text-[11px] text-[#22C55E] font-bold">ATS Score: {app.ats_score}/100</div>
                </div>

                <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${
                  app.status === 'Interviewing' ? 'bg-emerald-50 dark:bg-emerald-950/50 text-[#22C55E] border border-emerald-300 dark:border-emerald-800 animate-pulse' :
                  app.status === 'Shortlisted' ? 'bg-[#FF6B00]/10 text-[#FF6B00] dark:text-[#FF9D42] border border-[#FF6B00]/30' :
                  app.status === 'Offered' ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-300 dark:border-amber-800' :
                  app.status === 'Rejected' ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800' :
                  'bg-slate-100 dark:bg-neutral-800 text-slate-600 dark:text-neutral-400 border border-slate-200 dark:border-neutral-700'
                }`}>
                  {app.status}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

    </div>
  );
}
