import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useNotification } from '../context/NotificationContext';
import { 
  Briefcase, 
  Plus, 
  Users, 
  Award, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Search,
  Building2,
  Trash2,
  Edit,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function RecruiterDashboard() {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Job Modal State
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('TechCorp Inc.');
  const [companyType, setCompanyType] = useState('Startup');
  const [location, setLocation] = useState('San Francisco, CA (Remote)');
  const [isRemote, setIsRemote] = useState(true);
  const [salaryMin, setSalaryMin] = useState(120000);
  const [salaryMax, setSalaryMax] = useState(160000);
  const [description, setDescription] = useState('');
  const [requiredSkills, setRequiredSkills] = useState('Python, React, FastAPI, Docker');

  const { addToast } = useNotification();

  useEffect(() => {
    fetchRecruiterJobs();
  }, []);

  const fetchRecruiterJobs = async () => {
    setLoading(true);
    try {
      const res = await API.get('/recruiter/jobs');
      setJobs(res.data);
      if (res.data.length > 0) {
        handleSelectJob(res.data[0]);
      }
    } catch (err) {
      addToast('Unable to load recruiter jobs. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectJob = async (job) => {
    setSelectedJob(job);
    try {
      const res = await API.get(`/recruiter/jobs/${job.id}/applicants`);
      setApplicants(res.data);
    } catch (err) {
      addToast('Unable to load applicants for this job. Please try again.', 'error');
    }
  };

  const handleCreateJob = async (e) => {
    e.preventDefault();
    try {
      const skillsArray = requiredSkills.split(',').map(s => s.trim()).filter(Boolean);
      await API.post('/jobs/', {
        title,
        company,
        company_type: companyType,
        location,
        is_remote: isRemote,
        salary_min: parseInt(salaryMin),
        salary_max: parseInt(salaryMax),
        description,
        required_skills: skillsArray
      });
      addToast('Job posted successfully!', 'success');
      setShowModal(false);
      fetchRecruiterJobs();
    } catch (err) {
      addToast('Failed to post job', 'error');
    }
  };

  const handleStatusChange = async (appId, newStatus) => {
    try {
      await API.put(`/applications/${appId}/status`, { status: newStatus });
      addToast(`Updated status to '${newStatus}'`, 'success');
      if (selectedJob) handleSelectJob(selectedJob);
    } catch (err) {
      addToast('Status update failed', 'error');
    }
  };

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Briefcase className="w-8 h-8 text-[#FF6B00]" />
            Recruiter HQ & AI Candidate Ranking
          </h1>
          <p className="text-xs text-slate-500 dark:text-neutral-400 mt-1 font-medium">
            Post job listings and evaluate candidate rankings powered by AI ATS matching.
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowModal(true)}
          className="px-6 py-3.5 bg-gradient-to-r from-[#FF6B00] to-[#FF9D42] font-black text-xs text-white rounded-2xl shadow-[0_4px_20px_rgba(255,107,0,0.35)] transition-all flex items-center justify-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" /> Post New Job
        </motion.button>
      </div>

      {/* Recruiter Active Jobs + Applicants Ranking */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Posted Jobs List */}
        <div className="space-y-4">
          <h3 className="text-base font-black text-slate-900 dark:text-white">Your Job Postings ({jobs.length})</h3>
          
          {loading ? (
            <div className="text-slate-400 font-medium text-xs">Loading jobs...</div>
          ) : (
            <div className="space-y-3">
              {jobs.map((j) => (
                <div
                  key={j.id}
                  onClick={() => handleSelectJob(j)}
                  className={`p-5 rounded-3xl glass-panel border cursor-pointer transition-all space-y-2 shadow-sm ${
                    selectedJob?.id === j.id
                      ? 'border-[#FF6B00] bg-[#FF6B00]/10'
                      : 'border-slate-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 hover:border-[#FF6B00]/30'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <h4 className="font-black text-slate-900 dark:text-white text-sm line-clamp-1">{j.title}</h4>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#FF6B00]/10 text-[#FF6B00] dark:text-[#FF9D42] border border-[#FF6B00]/20 text-[10px] font-bold">
                      {j.applicants_count} Applicants
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 dark:text-neutral-400 font-medium">{j.company} • {j.location}</div>
                  <div className="text-[11px] text-[#22C55E] font-extrabold">
                    ${(j.salary_min / 1000).toFixed(0)}k - ${(j.salary_max / 1000).toFixed(0)}k USD
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Candidate Applicants AI Ranking Board */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-[#FF6B00]" />
              AI Candidate Ranking - {selectedJob?.title || 'Select a Job'}
            </h3>
            <span className="text-xs text-slate-500 dark:text-neutral-400 font-medium">Sorted by AI Match %</span>
          </div>

          {!selectedJob ? (
            <div className="glass-panel p-12 rounded-3xl text-center text-slate-500 dark:text-neutral-400 border border-slate-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 font-medium shadow-sm">
              Select a job posting on the left to review candidate ATS rankings.
            </div>
          ) : applicants.length === 0 ? (
            <div className="glass-panel p-12 rounded-3xl text-center text-slate-500 dark:text-neutral-400 border border-slate-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 font-medium shadow-sm">
              No applicants yet for this job posting.
            </div>
          ) : (
            <div className="space-y-4">
              {applicants.map((app, index) => (
                <div
                  key={app.id}
                  className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 space-y-4 hover:border-[#FF6B00]/30 transition-all shadow-sm"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-[#FF6B00]/10 border border-[#FF6B00]/25 flex items-center justify-center font-black text-[#FF6B00] text-xs">
                        #{index + 1}
                      </div>
                      <div>
                        <h4 className="font-black text-slate-900 dark:text-white text-base">{app.user?.full_name || 'Candidate Applicant'}</h4>
                        <p className="text-xs text-[#FF6B00] font-bold">{app.user?.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-lg font-black text-[#FF6B00] dark:text-[#FF9D42]">{app.match_score}% Match</div>
                        <div className="text-[11px] text-[#22C55E] font-bold">ATS Score: {app.ats_score}/100</div>
                      </div>

                      <select
                        value={app.status}
                        onChange={(e) => handleStatusChange(app.id, e.target.value)}
                        className="px-3 py-1.5 rounded-xl glass-input text-xs font-bold bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-700 text-slate-900 dark:text-white focus:outline-none"
                      >
                        <option value="Applied">Applied</option>
                        <option value="Shortlisted">Shortlisted</option>
                        <option value="Interviewing">Interviewing</option>
                        <option value="Offered">Offered</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </div>

                  </div>

                  {app.user?.profile?.skills && (
                    <div className="flex flex-wrap gap-1.5 text-xs pt-2 border-t border-slate-100 dark:border-neutral-800">
                      {app.user.profile.skills.slice(0, 6).map((sk, i) => (
                        <span key={i} className="px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-neutral-800 text-slate-700 dark:text-neutral-300 border border-slate-200 dark:border-neutral-700 font-medium text-[11px]">
                          {sk}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

        </div>

      </div>

      {/* Post Job Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg glass-panel p-8 rounded-3xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-6 relative max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>

              <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-[#FF6B00]" /> Post New Job Listing
              </h3>

              <form onSubmit={handleCreateJob} className="space-y-4 text-xs font-medium">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-neutral-300 mb-1">Job Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-3 rounded-xl glass-input focus:outline-none"
                    placeholder="e.g. Senior Full Stack AI Engineer"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-neutral-300 mb-1">Company</label>
                    <input
                      type="text"
                      required
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="w-full p-3 rounded-xl glass-input focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-neutral-300 mb-1">Company Type</label>
                    <select
                      value={companyType}
                      onChange={(e) => setCompanyType(e.target.value)}
                      className="w-full p-3 rounded-xl glass-input bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-700 text-slate-900 dark:text-white focus:outline-none font-bold"
                    >
                      <option value="Startup">Startup</option>
                      <option value="MNC">MNC</option>
                      <option value="Newly Founded Startup">Newly Founded Startup</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-neutral-300 mb-1">Required Skills (Comma separated)</label>
                  <input
                    type="text"
                    required
                    value={requiredSkills}
                    onChange={(e) => setRequiredSkills(e.target.value)}
                    className="w-full p-3 rounded-xl glass-input focus:outline-none"
                    placeholder="Python, React, FastAPI, Docker"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-neutral-300 mb-1">Job Description</label>
                  <textarea
                    required
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-3 rounded-xl glass-input focus:outline-none"
                    placeholder="Describe role responsibilities, team environment, and benefits..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 font-black text-xs text-white bg-gradient-to-r from-[#FF6B00] to-[#FF9D42] rounded-xl shadow-[0_4px_20px_rgba(255,107,0,0.35)] hover:opacity-95 transition-all hover:scale-[1.01]"
                >
                  Publish Job Listing
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
