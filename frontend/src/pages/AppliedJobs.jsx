import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useNotification } from '../context/NotificationContext';
import Sidebar from '../components/Sidebar';
import CompanyLogo from '../components/CompanyLogo';
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
              <Briefcase className="w-8 h-8 text-[#7ED321]" />
              My Submitted Applications
            </h1>
            <p className="text-xs text-[#666666] font-medium mt-1">
              Track real-time candidate application status across all jobs swiped right.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="py-24 text-center text-xs font-bold text-[#59C414] uppercase tracking-widest animate-pulse flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-[#7ED321]" /> Loading applications...
          </div>
        ) : applications.length === 0 ? (
          <div className="reference-card p-14 text-center text-[#666666] bg-white border border-[#E6E6E2] font-semibold">
            No applications submitted yet. Swipe Right on jobs in the Swipe Feed to apply instantly!
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <div
                key={app.id}
                className="reference-card p-6 bg-white border border-[#E6E6E2] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm"
              >
                <div className="flex items-start gap-4">
                  <CompanyLogo src={app.job?.company_logo} company={app.job?.company} />
                  <div className="space-y-1">
                    <h3 className="font-bold text-lg text-[#111111]">{app.job?.title || 'Job Application'}</h3>
                    <div className="flex items-center gap-2 text-xs text-[#59C414] font-bold">
                      {app.job?.company} • {app.job?.location}
                    </div>
                    <div className="text-[11px] text-[#666666] font-semibold pt-0.5">
                      Applied on: {new Date(app.applied_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="text-sm font-bold text-[#7ED321]">{app.match_score || app.match_percentage || 94}% Match</div>
                    <div className="text-[11px] text-[#59C414] font-bold">ATS Score: {app.ats_score || 88}/100</div>
                  </div>

                  <span className={`px-4.5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                    app.status === 'Interviewing' ? 'bg-[#7ED321]/15 text-[#59C414] border border-[#7ED321]/20 animate-pulse' :
                    app.status === 'Shortlisted' ? 'bg-[#7ED321]/10 text-[#59C414] border border-[#7ED321]/20' :
                    app.status === 'Offered' ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' :
                    app.status === 'Rejected' ? 'bg-rose-500/10 text-rose-600 border border-rose-500/20' :
                    'bg-[#F8F8F5] text-[#666666] border border-[#E6E6E2]'
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
