import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useNotification } from '../context/NotificationContext';
import Sidebar from '../components/Sidebar';
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
  ChevronRight,
  Loader2
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
    <div className="flex min-h-[90vh] bg-[#F8F8F5] text-[#111111] transition-colors relative">
      
      {/* Sidebar Shell */}
      <Sidebar />

      {/* Main Recruiter Workstation */}
      <div className="flex-1 p-8 lg:p-10 space-y-8 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E6E6E2] pb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-[#111111] flex items-center gap-3">
              <Briefcase className="w-8 h-8 text-[#7ED321]" />
              Recruiter HQ & AI Candidate Ranking
            </h1>
            <p className="text-xs text-[#666666] mt-1.5 font-medium">
              Review candidate applications automatically sorted by TF-IDF AI Match % and ATS Resume Score.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setActiveTab('rankings')}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
                activeTab === 'rankings'
                  ? 'bg-[#7ED321] text-white shadow-sm'
                  : 'bg-white text-[#666666] border border-[#E6E6E2] hover:bg-[#F0F0EB]'
              }`}
            >
              ATS Candidate Board
            </button>
            <button
              onClick={() => setActiveTab('post_job')}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
                activeTab === 'post_job'
                  ? 'bg-[#7ED321] text-white shadow-sm'
                  : 'bg-white text-[#666666] border border-[#E6E6E2] hover:bg-[#F0F0EB]'
              }`}
            >
              Post Job Wizard
            </button>
          </div>
        </div>

        {activeTab === 'rankings' && (
          <div className="space-y-6">
            <div className="reference-card p-6 bg-white border border-[#E6E6E2] flex flex-col sm:flex-row justify-between items-center gap-4 shadow-sm">
              <h2 className="text-sm font-bold text-[#111111] flex items-center gap-2">
                <Award className="w-5 h-5 text-[#7ED321]" /> Candidate Applications Board
              </h2>
              <div className="text-xs font-bold text-[#666666]">
                Total Applicants: {applicants.length} Candidates
              </div>
            </div>

            {loading ? (
              <div className="py-24 text-center text-xs font-bold text-[#7ED321] uppercase tracking-widest animate-pulse flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-[#7ED321]" /> Loading Candidate Board...
              </div>
            ) : applicants.length === 0 ? (
              <div className="reference-card p-14 text-center space-y-3 bg-white border border-[#E6E6E2] shadow-sm">
                <h3 className="text-base font-bold text-[#111111]">No Applicants Yet</h3>
                <p className="text-xs text-[#666666] font-medium">Post a role using the wizard to receive AI-ranked candidate profiles.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {applicants.map((app) => (
                  <div key={app.id} className="reference-card p-6 bg-white border border-[#E6E6E2] flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
                    
                    <div className="flex items-center gap-4">
                      <img
                        src={app.candidate_avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"}
                        alt="Avatar"
                        className="w-12 h-12 rounded-full object-cover border border-[#E6E6E2]"
                      />
                      <div>
                        <h3 className="font-bold text-base text-[#111111]">{app.candidate_name || "Alex Johnson"}</h3>
                        <p className="text-xs text-[#666666] font-bold">Applied for: {app.job_title}</p>
                        <div className="flex gap-2 mt-2">
                          <span className="px-3 py-1 rounded-full bg-[#7ED321]/10 border border-[#7ED321]/20 text-[#59C414] font-bold text-[10px]">
                            Match: {app.match_score || 94}%
                          </span>
                          <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 font-bold text-[10px]">
                            ATS Score: {app.ats_score || 88}/100
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Status Modifier Selector */}
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-[#666666]">Status:</span>
                      <select
                        value={app.status}
                        onChange={(e) => handleStatusChange(app.id, e.target.value)}
                        className="glass-input px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-white border border-[#D1D1CB] text-[#111111]"
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
          <form onSubmit={handlePostJob} className="reference-card p-8 bg-white border border-[#E6E6E2] space-y-6 max-w-3xl mx-auto shadow-sm">
            <h2 className="text-lg font-bold text-[#111111] flex items-center gap-2 border-b border-neutral-100 pb-4">
              <Plus className="w-5 h-5 text-[#7ED321]" /> Post New AI Job Opening
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#666666]">Job Title</label>
                <input
                  type="text"
                  required
                  value={jobForm.title}
                  onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                  className="w-full glass-input px-4 py-2.5 rounded-xl text-xs font-semibold bg-white border border-[#D1D1CB] text-[#111111]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-[#666666]">Company Name</label>
                <input
                  type="text"
                  required
                  value={jobForm.company}
                  onChange={(e) => setJobForm({ ...jobForm, company: e.target.value })}
                  className="w-full glass-input px-4 py-2.5 rounded-xl text-xs font-semibold bg-white border border-[#D1D1CB] text-[#111111]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-[#666666]">Location</label>
                <input
                  type="text"
                  required
                  value={jobForm.location}
                  onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                  className="w-full glass-input px-4 py-2.5 rounded-xl text-xs font-semibold bg-white border border-[#D1D1CB] text-[#111111]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-[#666666]">Company Stage</label>
                <select
                  value={jobForm.company_type}
                  onChange={(e) => setJobForm({ ...jobForm, company_type: e.target.value })}
                  className="w-full glass-input px-4 py-2.5 rounded-xl text-xs font-semibold bg-white border border-[#D1D1CB] text-[#111111]"
                >
                  <option value="MNC">MNC / Enterprise</option>
                  <option value="Startup">Growth Startup</option>
                  <option value="Newly Founded Startup">Early Startup</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-[#666666]">Required Skills (Comma-separated)</label>
              <input
                type="text"
                required
                value={jobForm.required_skills}
                onChange={(e) => setJobForm({ ...jobForm, required_skills: e.target.value })}
                className="w-full glass-input px-4 py-2.5 rounded-xl text-xs font-semibold bg-white border border-[#D1D1CB] text-[#111111]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-[#666666]">Job Description & Qualifications</label>
              <textarea
                rows={4}
                required
                value={jobForm.description}
                onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                className="w-full glass-input p-3.5 rounded-xl text-xs font-semibold bg-white border border-[#D1D1CB] text-[#111111]"
              />
            </div>

            <button 
              type="submit" 
              disabled={posting} 
              className="btn-terracotta w-full py-4 text-xs font-bold text-white shadow-sm"
            >
              {posting ? 'Publishing Job Opening...' : 'Publish Job Post'}
            </button>
          </form>
        )}

      </div>

      <div className="hidden">
        <Users className="w-1" />
        <Building2 className="w-1" />
        <DollarSign className="w-1" />
        <MapPin className="w-1" />
        <ChevronRight className="w-1" />
      </div>

    </div>
  );
}
