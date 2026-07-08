import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { Briefcase, CheckCircle2, Clock, Zap, Building2 } from 'lucide-react';

export default function AppliedJobs() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await API.get('/applications/');
      setApplications(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-8 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      <div>
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
          <Briefcase className="w-8 h-8 text-indigo-400" />
          My Submitted Applications
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Track real-time candidate application status across all jobs swiped right.
        </p>
      </div>

      {loading ? (
        <div className="py-12 text-center text-slate-400">Loading applications...</div>
      ) : applications.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl text-center text-slate-400">
          No applications submitted yet. Swipe Right on jobs in the Swipe Feed to apply instantly!
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div
              key={app.id}
              className="glass-panel p-6 rounded-3xl border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <h3 className="font-extrabold text-lg text-white">{app.job?.title || 'Job Application'}</h3>
                <div className="flex items-center gap-2 text-xs text-indigo-300">
                  <Building2 className="w-3.5 h-3.5" />
                  {app.job?.company} • {app.job?.location}
                </div>
                <div className="text-[11px] text-slate-400 pt-1">
                  Applied on: {new Date(app.applied_at).toLocaleDateString()}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-sm font-black text-cyan-400">{app.match_score}% Match</div>
                  <div className="text-[11px] text-emerald-400 font-bold">ATS Score: {app.ats_score}/100</div>
                </div>

                <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                  app.status === 'Interviewing' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 animate-pulse' :
                  app.status === 'Shortlisted' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40' :
                  app.status === 'Offered' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                  app.status === 'Rejected' ? 'bg-pink-500/20 text-pink-300 border border-pink-500/40' :
                  'bg-white/10 text-slate-300 border border-white/10'
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
