import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { useNotification } from '../context/NotificationContext';
import Sidebar from '../components/Sidebar';
import { 
  Search, 
  MapPin, 
  DollarSign, 
  Building2, 
  Bookmark, 
  Check, 
  Zap, 
  SlidersHorizontal,
  Loader2 
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function JobSearch() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applyingJobId, setApplyingJobId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompanyType, setSelectedCompanyType] = useState('ALL');
  const [selectedFlexibility, setSelectedFlexibility] = useState('ALL');
  const [minSalary, setMinSalary] = useState(0);

  const { addToast } = useNotification();
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await API.get('/jobs/');
      setJobs(res.data);
    } catch (err) {
      if (err.response?.status === 401) {
        addToast('Session expired. Please log in.', 'error');
        navigate('/login');
      } else {
        addToast('Unable to load job postings.', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter((job) => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const titleMatch = job.title?.toLowerCase().includes(query);
      const companyMatch = job.company?.toLowerCase().includes(query);
      const skillMatch = job.required_skills?.some((s) => s.toLowerCase().includes(query));
      if (!titleMatch && !companyMatch && !skillMatch) return false;
    }
    if (selectedCompanyType !== 'ALL' && job.company_type !== selectedCompanyType) return false;
    if (selectedFlexibility === 'REMOTE' && !job.is_remote) return false;
    if (minSalary > 0 && (job.salary_max || 0) < minSalary) return false;
    return true;
  });

  const handleApply = async (job) => {
    if (applyingJobId === job.id) return;
    setApplyingJobId(job.id);

    try {
      await API.post('/swipes/action', { job_id: job.id, action: 'apply' });
      addToast(`Application submitted successfully for ${job.title}!`, 'success');
    } catch (err) {
      const status = err.response?.status;
      const detail = err.response?.data?.detail;

      if (status === 409 || (typeof detail === 'string' && detail.toLowerCase().includes('already applied'))) {
        addToast(`You have already applied for ${job.title}.`, 'info');
      } else if (status === 401) {
        addToast('Session expired. Please log in.', 'error');
        navigate('/login');
      } else if (status === 404) {
        addToast('Job posting not found.', 'error');
      } else {
        addToast(detail || 'Application submission failed. Please try again.', 'error');
      }
    } finally {
      setApplyingJobId(null);
    }
  };

  const pageVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
  };

  return (
    <div className="flex min-h-[90vh] bg-[#F8F8F5] text-[#111111] transition-colors">
      <Sidebar />

      <motion.div 
        initial="hidden"
        animate="show"
        variants={pageVariants}
        className="flex-1 p-8 lg:p-10 space-y-8"
      >
        
        {/* Page Header */}
        <div className="flex justify-between items-end border-b border-[#E6E6E2] pb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-[#111111] tracking-tight">Smart Multi-Criteria Job Search</h1>
            <p className="text-xs text-[#666666] font-medium mt-1">Explore positions matching your skill matrix across global tech hubs.</p>
          </div>
        </div>

        {/* Filter Drawer */}
        <div className="reference-card p-6 bg-white border border-[#E6E6E2] space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-4 top-4 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, company, or technical skill (e.g. Python, PyTorch)..."
              className="w-full pl-11 pr-4 py-3 rounded-xl glass-input text-xs font-semibold bg-white border border-[#D1D1CB] text-[#111111]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-bold text-[#666666]">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-wider">Company Type</label>
              <select
                value={selectedCompanyType}
                onChange={(e) => setSelectedCompanyType(e.target.value)}
                className="w-full glass-input px-3 py-2.5 rounded-xl text-xs font-semibold bg-white border border-[#D1D1CB] text-[#111111]"
              >
                <option value="ALL">All Companies</option>
                <option value="MNC">MNC / Enterprise</option>
                <option value="Startup">Growth Startup</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-wider">Flexibility</label>
              <select
                value={selectedFlexibility}
                onChange={(e) => setSelectedFlexibility(e.target.value)}
                className="w-full glass-input px-3 py-2.5 rounded-xl text-xs font-semibold bg-white border border-[#D1D1CB] text-[#111111]"
              >
                <option value="ALL">All Locations</option>
                <option value="REMOTE">100% Remote</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider">Min Salary: ${minSalary.toLocaleString()}</label>
              <input
                type="range"
                min="0"
                max="200000"
                step="10000"
                value={minSalary}
                onChange={(e) => setMinSalary(parseInt(e.target.value))}
                className="w-full accent-[#7ED321]"
              />
            </div>
          </div>
        </div>

        {/* Jobs Grid */}
        {loading ? (
          <div className="py-24 text-center text-xs font-bold text-[#7ED321] uppercase tracking-widest animate-pulse flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-[#7ED321]" /> Loading Positions...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredJobs.map((job) => (
              <div key={job.id} className="reference-card p-6 bg-white border border-[#E6E6E2] space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    {job.company_logo ? (
                      <img
                        src={job.company_logo}
                        alt={`${job.company} logo`}
                        className="w-10 h-10 rounded-xl object-contain border border-[#E6E6E2] bg-white p-1 flex-shrink-0"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-[#F8F8F5] border border-[#E6E6E2] text-[#7ED321] font-black flex items-center justify-center flex-shrink-0">
                        {job.company ? job.company[0] : 'C'}
                      </div>
                    )}
                    <div>
                      <h3 className="font-bold text-base text-[#111111]">{job.title}</h3>
                      <p className="text-xs text-[#59C414] font-bold">{job.company} • {job.location || 'Remote'}</p>
                    </div>
                  </div>

                  <span className="px-3.5 py-1.5 rounded-full bg-[#F8F8F5] border border-[#E6E6E2] text-[#7ED321] font-bold text-xs inline-block">
                    ${job.salary_min?.toLocaleString()} - ${job.salary_max?.toLocaleString()}
                  </span>

                  <div className="flex flex-wrap gap-1.5">
                    {job.required_skills?.map((skill, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-lg bg-[#F8F8F5] border border-[#E6E6E2] text-[#666666] text-[10px] font-semibold">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={() => handleApply(job)}
                  disabled={applyingJobId === job.id}
                  className="btn-terracotta w-full py-3.5 text-xs font-bold flex items-center justify-center gap-1.5 disabled:opacity-50 shadow-sm text-white"
                >
                  {applyingJobId === job.id ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Submitting...
                    </>
                  ) : (
                    'Quick Apply'
                  )}
                </button>
              </div>
            ))}
          </div>
        )}

      </motion.div>
      
      <div className="hidden">
        <MapPin className="w-1" />
        <DollarSign className="w-1" />
        <Building2 className="w-1" />
        <Bookmark className="w-1" />
        <Check className="w-1" />
        <Zap className="w-1" />
        <SlidersHorizontal className="w-1" />
      </div>

    </div>
  );
}
