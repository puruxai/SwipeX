import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useNotification } from '../context/NotificationContext';
import { 
  Search, 
  Filter, 
  MapPin, 
  DollarSign, 
  Building2, 
  Check, 
  Bookmark, 
  Zap, 
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function JobSearch() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompanyType, setSelectedCompanyType] = useState('ALL');
  const [selectedFlexibility, setSelectedFlexibility] = useState('ALL');
  const [minSalary, setMinSalary] = useState(0);
  const [fresherOnly, setFresherOnly] = useState(false);

  const { addToast } = useNotification();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await API.get('/jobs/');
      setJobs(res.data);
    } catch (err) {
      addToast('Unable to load job postings.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter((job) => {
    // Search query match
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const titleMatch = job.title?.toLowerCase().includes(query);
      const companyMatch = job.company?.toLowerCase().includes(query);
      const skillMatch = job.required_skills?.some((s) => s.toLowerCase().includes(query));
      if (!titleMatch && !companyMatch && !skillMatch) return false;
    }

    // Company type match
    if (selectedCompanyType !== 'ALL' && job.company_type !== selectedCompanyType) {
      return false;
    }

    // Flexibility match
    if (selectedFlexibility === 'REMOTE' && !job.is_remote) return false;

    // Minimum salary match
    if (minSalary > 0 && (job.salary_max || 0) < minSalary) return false;

    // Fresher friendly match
    if (fresherOnly && !job.fresher_friendly) return false;

    return true;
  });

  const handleApply = async (job) => {
    try {
      await API.post('/swipes/', { job_id: job.id, action: 'apply' });
      addToast(`Successfully applied to ${job.title} at ${job.company}!`, 'success');
    } catch (err) {
      addToast('Failed to submit application.', 'error');
    }
  };

  const handleBookmark = async (job) => {
    try {
      await API.post('/swipes/', { job_id: job.id, action: 'bookmark' });
      addToast(`Bookmarked ${job.title}!`, 'info');
    } catch (err) {
      addToast('Failed to bookmark job.', 'error');
    }
  };

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
          <Search className="w-8 h-8 text-[#FF6B00]" />
          Smart Multi-Criteria Job Discovery
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
          Search and filter target roles by company type, annual compensation, remote flexibility, and competition index.
        </p>
      </div>

      {/* SEARCH BAR & FILTER CONTROLS */}
      <div className="luxury-card p-6 border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 space-y-6 shadow-sm">
        
        {/* Search Input Bar */}
        <div className="relative">
          <Search className="w-5 h-5 absolute left-4 top-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by job title, company, or technical skill (e.g. Python, React, NeuralStack)..."
            className="w-full pl-12 pr-4 py-3 rounded-2xl glass-input text-xs font-semibold focus:outline-none"
          />
        </div>

        {/* Filter Badges & Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Company Type Filter */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Company Type</label>
            <select
              value={selectedCompanyType}
              onChange={(e) => setSelectedCompanyType(e.target.value)}
              className="w-full glass-input px-3.5 py-2.5 rounded-xl text-xs font-bold"
            >
              <option value="ALL">All Company Types</option>
              <option value="MNC">MNC / Enterprise</option>
              <option value="Startup">Growth Startup</option>
              <option value="Newly Founded Startup">Early Stage Startup</option>
            </select>
          </div>

          {/* Remote Flexibility Filter */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Location Flexibility</label>
            <select
              value={selectedFlexibility}
              onChange={(e) => setSelectedFlexibility(e.target.value)}
              className="w-full glass-input px-3.5 py-2.5 rounded-xl text-xs font-bold"
            >
              <option value="ALL">All Locations</option>
              <option value="REMOTE">100% Remote Only</option>
            </select>
          </div>

          {/* Minimum Salary Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
              <span>Min Salary:</span>
              <span className="text-[#FF6B00]">${minSalary.toLocaleString()} USD</span>
            </div>
            <input
              type="range"
              min="0"
              max="200000"
              step="10000"
              value={minSalary}
              onChange={(e) => setMinSalary(parseInt(e.target.value))}
              className="w-full accent-[#FF6B00] cursor-pointer"
            />
          </div>

          {/* Fresher Toggle */}
          <div className="flex items-center gap-2 pt-6">
            <input
              type="checkbox"
              id="fresherCheck"
              checked={fresherOnly}
              onChange={(e) => setFresherOnly(e.target.checked)}
              className="w-4 h-4 rounded text-[#FF6B00] focus:ring-[#FF6B00] accent-[#FF6B00]"
            />
            <label htmlFor="fresherCheck" className="text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
              Fresher Friendly Roles Only
            </label>
          </div>

        </div>

      </div>

      {/* JOBS GRID */}
      {loading ? (
        <div className="py-20 text-center text-xs font-black text-slate-400 uppercase tracking-widest animate-pulse">Loading Job Postings...</div>
      ) : filteredJobs.length === 0 ? (
        <div className="py-20 text-center space-y-3">
          <h3 className="text-xl font-black text-slate-900 dark:text-white">No Matching Roles Found</h3>
          <p className="text-xs text-slate-500 font-medium">Try adjusting your search criteria or salary slider.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <motion.div
              key={job.id}
              whileHover={{ y: -4 }}
              className="luxury-card p-6 border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 space-y-4 flex flex-col justify-between shadow-sm"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-slate-900 text-white font-black text-base flex items-center justify-center shadow-sm">
                      {job.company ? job.company[0] : 'C'}
                    </div>
                    <div>
                      <h3 className="font-black text-base text-slate-900 dark:text-white leading-tight">{job.title}</h3>
                      <p className="text-xs text-slate-500 font-bold">{job.company}</p>
                    </div>
                  </div>

                  <button onClick={() => handleBookmark(job)} className="p-2 rounded-xl text-slate-400 hover:text-[#FF6B00] hover:bg-slate-100 dark:hover:bg-slate-800">
                    <Bookmark className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300">
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800">${job.salary_min?.toLocaleString()} - ${job.salary_max?.toLocaleString()}</span>
                  {job.is_remote && <span className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600">Remote</span>}
                  {job.fresher_friendly && <span className="px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-600">Fresher Friendly</span>}
                </div>

                <div className="flex flex-wrap gap-1">
                  {job.required_skills?.map((skill, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-bold text-slate-700 dark:text-slate-300">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <span className="text-xs font-black text-[#FF6B00]">{job.match_score || 94}% AI Match</span>
                <button onClick={() => handleApply(job)} className="btn-primary px-5 py-2 text-xs font-black">
                  Apply Now
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

    </div>
  );
}
