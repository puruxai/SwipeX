import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useNotification } from '../context/NotificationContext';
import { 
  Briefcase, 
  Plus, 
  Users, 
  Award, 
  CheckCircle2, 
  Sparkles, 
  Search, 
  Building2, 
  DollarSign, 
  MapPin,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function RecruiterDashboard() {
  const [activeTab, setActiveTab] = useState('rankings'); // 'rankings' | 'post_job'
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useNotification();

  // Post Job Form State
  const [jobForm, setJobForm] = useState({
    title: 'Senior Full Stack AI Engineer',
    company: 'NeuralStack Labs',
    location: 'San Francisco, CA',
    description: 'We are seeking a Full Stack AI Engineer to scale our real-time inference and FastAPI microservices.',
    salary_min: 150000,
    salary_max: 200000,
    is_remote: true,
    company_type: 'Startup',
    required_skills: 'Python, FastAPI, React, PyTorch, Docker',
    fresher_friendly: false
  });
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    fetchApplicants();
  }, []);

  const fetchApplicants = async () => {
    try {
      const res = await API.get('/recruiter/applicants');
      setApplicants(res.data);
    } catch (err) {
      addToast('Unable to load candidate rankings.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (appId, newStatus) => {
    try {
      await API.put(`/recruiter/applications/${appId}/status`, { status: newStatus });
      setApplicants((prev) =>
        prev.map((app) => (app.id === appId ? { ...app, status: newStatus } : app))
      );
      addToast(`Candidate status updated to ${newStatus}!`, 'success');
    } catch (err) {
      addToast('Failed to update applicant status.', 'error');
    }
  };

  const handlePostJob = async (e) => {
    e.preventDefault();
    setPosting(true);
    try {
      const skillsArray = jobForm.required_skills.split(',').map((s) => s.trim()).filter(Boolean);
      await API.post('/jobs/', {
        ...jobForm,
        required_skills: skillsArray
      });
      addToast('Job posting created successfully!', 'success');
      setActiveTab('rankings');
    } catch (err) {
      addToast('Failed to create job posting.', 'error');
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
            <Briefcase className="w-8 h-8 text-[#FF6B00]" />
            Recruiter HQ & AI Candidate Ranking
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Review candidate applications automatically sorted by TF-IDF AI Match % and ATS Resume Score.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('rankings')}
            className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'rankings'
                ? 'bg-[#FF6B00] text-white shadow-md shadow-orange-500/25'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            ATS Candidate Board
          </button>
          <button
            onClick={() => setActiveTab('post_job')}
            className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'post_job'
                ? 'bg-[#FF6B00] text-white shadow-md shadow-orange-500/25'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            Post Job Wizard
          </button>
        </div>
      </div>

      {activeTab === 'rankings' && (
        <div className="space-y-6">
          <div className="luxury-card p-6 border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
            <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-[#FF6B00]" /> Candidate Applications Board
            </h2>
            <div className="text-xs font-bold text-slate-500">
              Total Applicants: {applicants.length} Candidates
            </div>
          </div>

          {loading ? (
            <div className="py-20 text-center text-xs font-black text-slate-400 uppercase tracking-widest animate-pulse">Loading Candidate Board...</div>
          ) : applicants.length === 0 ? (
            <div className="py-20 text-center space-y-3">
              <h3 className="text-xl font-black text-slate-900 dark:text-white">No Applicants Yet</h3>
              <p className="text-xs text-slate-500 font-medium">Post a role using the wizard to receive AI-ranked candidate profiles.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {applicants.map((app) => (
                <div key={app.id} className="luxury-card p-6 border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
                  
                  <div className="flex items-center gap-4">
                    <img
                      src={app.candidate_avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"}
                      alt="Avatar"
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-[#FF6B00]/30"
                    />
                    <div>
                      <h3 className="font-black text-base text-slate-900 dark:text-white">{app.candidate_name || "Alex Johnson"}</h3>
                      <p className="text-xs text-slate-500 font-bold">Applied for: {app.job_title}</p>
                      <div className="flex gap-2 mt-1">
                        <span className="px-2.5 py-0.5 rounded-full bg-[#FF6B00]/10 text-[#FF6B00] font-black text-[11px]">
                          Match: {app.match_score || 94}%
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-black text-[11px]">
                          ATS Score: {app.ats_score || 88}/100
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Status Modifier Selector */}
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-400">Status:</span>
                    <select
                      value={app.status}
                      onChange={(e) => handleStatusChange(app.id, e.target.value)}
                      className="glass-input px-3.5 py-2 rounded-xl text-xs font-bold"
                    >
                      <option value="Applied">Applied</option>
                      <option value="Shortlisted">Shortlisted</option>
                      <option value="Interviewing">Interviewing</option>
                      <option value="Offered">Offered</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* POST JOB WIZARD */}
      {activeTab === 'post_job' && (
        <form onSubmit={handlePostJob} className="luxury-card p-8 border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 space-y-6 shadow-sm max-w-3xl mx-auto">
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
            <Plus className="w-5 h-5 text-[#FF6B00]" /> Post New AI Job Opening
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Job Title</label>
              <input
                type="text"
                required
                value={jobForm.title}
                onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                className="w-full glass-input px-4 py-2.5 rounded-xl text-xs font-medium"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Company Name</label>
              <input
                type="text"
                required
                value={jobForm.company}
                onChange={(e) => setJobForm({ ...jobForm, company: e.target.value })}
                className="w-full glass-input px-4 py-2.5 rounded-xl text-xs font-medium"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Location</label>
              <input
                type="text"
                required
                value={jobForm.location}
                onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                className="w-full glass-input px-4 py-2.5 rounded-xl text-xs font-medium"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Company Stage</label>
              <select
                value={jobForm.company_type}
                onChange={(e) => setJobForm({ ...jobForm, company_type: e.target.value })}
                className="w-full glass-input px-4 py-2.5 rounded-xl text-xs font-bold"
              >
                <option value="MNC">MNC / Enterprise</option>
                <option value="Startup">Growth Startup</option>
                <option value="Newly Founded Startup">Early Startup</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Required Skills (Comma-separated)</label>
            <input
              type="text"
              required
              value={jobForm.required_skills}
              onChange={(e) => setJobForm({ ...jobForm, required_skills: e.target.value })}
              className="w-full glass-input px-4 py-2.5 rounded-xl text-xs font-medium"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Job Description & Qualifications</label>
            <textarea
              rows={4}
              required
              value={jobForm.description}
              onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
              className="w-full glass-input p-3 rounded-xl text-xs font-medium"
            />
          </div>

          <button type="submit" disabled={posting} className="btn-primary w-full py-4 text-xs font-black">
            {posting ? 'Publishing Job Opening...' : 'Publish Job Post'}
          </button>
        </form>
      )}

    </div>
  );
}
