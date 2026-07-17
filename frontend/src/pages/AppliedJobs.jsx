import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useNotification } from '../context/NotificationContext';
import { Briefcase, CheckCircle2, Clock, Zap, Building2 } from 'lucide-react';

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
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
          <Briefcase className="w-8 h-8 text-[#FF6B00]" />
          My Submitted Applications
        </h1>
        <p className="text-sm text-[#A8A8A8] mt-1">
          Track real-time candidate application status across all jobs swiped right.
        </p>
      </div>

      {loading ? (
        <div className="py-12 text-center text-[#A8A8A8]">Loading applications...</div>
      ) : applications.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl text-center text-[#A8A8A8] border border-[#262626] bg-[#181818]/60">
          No applications submitted yet. Swipe Right on jobs in the Swipe Feed to apply instantly!
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div
              key={app.id}
              className="glass-panel p-6 rounded-3xl border border-[#262626] bg-[#181818]/60 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <h3 className="font-extrabold text-lg text-white">{app.job?.title || 'Job Application'}</h3>
                <div className="flex items-center gap-2 text-xs text-[#FF8A3D]">
                  <Building2 className="w-3.5 h-3.5" />
                  {app.job?.company} • {app.job?.location}
                </div>
                <div className="text-[11px] text-[#A8A8A8] pt-1">
                  Applied on: {new Date(app.applied_at).toLocaleDateString()}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-sm font-black text-[#FF8A3D]">{app.match_score}% Match</div>
                  <div className="text-[11px] text-[#22C55E] font-bold">ATS Score: {app.ats_score}/100</div>
                </div>

                <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                  app.status === 'Interviewing' ? 'bg-[#22C55E]/10 text-emerald-300 border border-[#22C55E]/30 animate-pulse' :
                  app.status === 'Shortlisted' ? 'bg-[#FF8A3D]/10 text-[#FF8A3D] border border-[#FF8A3D]/30' :
                  app.status === 'Offered' ? 'bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/30' :
                  app.status === 'Rejected' ? 'bg-rose-500/10 text-rose-300 border border-rose-500/30' :
                  'bg-[#121212] text-[#A8A8A8] border border-[#262626]'
                }`}>
                  {app.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
