import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useNotification } from '../context/NotificationContext';
import soundManager from '../services/SoundManager';
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
      soundManager.playSuccess();
    } catch (err) {
      addToast('Failed to update applicant status.', 'error');
    }
  };

  const handlePostJob = async (e) => {
    e.preventDefault();
    setPosting(true);
    soundManager.playTick();
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

  const handleActionClick = () => {
    soundManager.playTick();
  };

  const handleHover = () => {
    soundManager.playHover();
  };

  return (
    <div className="flex min-h-[90vh] bg-[#030509] text-[#f1f5f9] transition-colors relative">
      
      {/* Sidebar Shell */}
      <Sidebar />

      {/* Main Recruiter Workstation */}
      <div className="flex-1 p-8 lg:p-10 space-y-8 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
              <Briefcase className="w-8 h-8 text-[#ff6b00]" />
              Recruiter HQ & AI Candidate Ranking
            </h1>
            <p className="text-xs text-[#e2bfb0] mt-1.5 font-medium">
              Review candidate applications automatically sorted by TF-IDF AI Match % and ATS Resume Score.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => { handleActionClick(); setActiveTab('rankings'); }}
              onMouseEnter={handleHover}
              className={`px-5 py-3 rounded-2xl text-xs font-bold transition-all ${
                activeTab === 'rankings'
                  ? 'bg-[#ff6b00] text-white shadow-md'
                  : 'bg-white/5 text-[#e2bfb0] hover:bg-white/10'
              }`}
            >
              ATS Candidate Board
            </button>
            <button
              onClick={() => { handleActionClick(); setActiveTab('post_job'); }}
              onMouseEnter={handleHover}
              className={`px-5 py-3 rounded-2xl text-xs font-bold transition-all ${
                activeTab === 'post_job'
                  ? 'bg-[#ff6b00] text-white shadow-md'
                  : 'bg-white/5 text-[#e2bfb0] hover:bg-white/10'
              }`}
            >
              Post Job Wizard
            </button>
          </div>
        </div>

        {activeTab === 'rankings' && (
          <div className="space-y-6">
            <div className="reference-card p-6 bg-[#191f2f]/80 flex flex-col sm:flex-row justify-between items-center gap-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-[#ffb693]" /> Candidate Applications Board
              </h2>
              <div className="text-xs font-bold text-[#e2bfb0]/70">
                Total Applicants: {applicants.length} Candidates
              </div>
            </div>

            {loading ? (
              <div className="py-24 text-center text-xs font-black text-[#ffb693] uppercase tracking-widest animate-pulse flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-[#ff6b00]" /> Loading Candidate Board...
              </div>
            ) : applicants.length === 0 ? (
              <div className="reference-card p-14 text-center space-y-3 bg-[#191f2f]/80">
                <h3 className="text-xl font-bold text-white">No Applicants Yet</h3>
                <p className="text-xs text-[#e2bfb0] font-medium">Post a role using the wizard to receive AI-ranked candidate profiles.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {applicants.map((app) => (
                  <div key={app.id} className="reference-card p-6 bg-[#191f2f]/85 flex flex-col md:flex-row items-center justify-between gap-6">
                    
                    <div className="flex items-center gap-4">
                      <img
                        src={app.candidate_avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"}
                        alt="Avatar"
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-[#ff6b00]/30"
                      />
                      <div>
                        <h3 className="font-extrabold text-base text-white">{app.candidate_name || "Alex Johnson"}</h3>
                        <p className="text-xs text-[#e2bfb0]/80 font-bold">Applied for: {app.job_title}</p>
                        <div className="flex gap-2 mt-2.5">
                          <span className="px-3 py-1 rounded-full bg-[#ff6b00]/10 border border-[#ff6b00]/20 text-[#ffb693] font-black text-[10px]">
                            Match: {app.match_score || 94}%
                          </span>
                          <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-black text-[10px]">
                            ATS Score: {app.ats_score || 88}/100
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Status Modifier Selector */}
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-[#e2bfb0]">Status:</span>
                      <select
                        value={app.status}
                        onChange={(e) => handleStatusChange(app.id, e.target.value)}
                        className="glass-input px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-white/5 border border-white/10 text-white"
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
          <form onSubmit={handlePostJob} className="reference-card p-8 bg-[#191f2f]/80 space-y-6 max-w-3xl mx-auto">
            <h2 className="text-xl font-bold text-white flex items-center gap-2 border-b border-white/5 pb-4">
              <Plus className="w-5 h-5 text-[#ffb693]" /> Post New AI Job Opening
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#e2bfb0]">Job Title</label>
                <input
                  type="text"
                  required
                  value={jobForm.title}
                  onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                  className="w-full glass-input px-4 py-2.5 rounded-xl text-xs font-semibold bg-white/5 border border-white/10 text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-[#e2bfb0]">Company Name</label>
                <input
                  type="text"
                  required
                  value={jobForm.company}
                  onChange={(e) => setJobForm({ ...jobForm, company: e.target.value })}
                  className="w-full glass-input px-4 py-2.5 rounded-xl text-xs font-semibold bg-white/5 border border-white/10 text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-[#e2bfb0]">Location</label>
                <input
                  type="text"
                  required
                  value={jobForm.location}
                  onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                  className="w-full glass-input px-4 py-2.5 rounded-xl text-xs font-semibold bg-white/5 border border-white/10 text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-[#e2bfb0]">Company Stage</label>
                <select
                  value={jobForm.company_type}
                  onChange={(e) => setJobForm({ ...jobForm, company_type: e.target.value })}
                  className="w-full glass-input px-4 py-2.5 rounded-xl text-xs font-semibold bg-white/5 border border-white/10 text-white"
                >
                  <option value="MNC">MNC / Enterprise</option>
                  <option value="Startup">Growth Startup</option>
                  <option value="Newly Founded Startup">Early Startup</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-[#e2bfb0]">Required Skills (Comma-separated)</label>
              <input
                type="text"
                required
                value={jobForm.required_skills}
                onChange={(e) => setJobForm({ ...jobForm, required_skills: e.target.value })}
                className="w-full glass-input px-4 py-2.5 rounded-xl text-xs font-semibold bg-white/5 border border-white/10 text-white"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-[#e2bfb0]">Job Description & Qualifications</label>
              <textarea
                rows={4}
                required
                value={jobForm.description}
                onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                className="w-full glass-input p-3.5 rounded-xl text-xs font-semibold bg-white/5 border border-white/10 text-white"
              />
            </div>

            <button 
              type="submit" 
              disabled={posting} 
              onMouseEnter={handleHover}
              className="btn-terracotta w-full py-4 text-xs font-black"
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
