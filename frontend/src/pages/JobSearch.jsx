import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useNotification } from '../context/NotificationContext';
import { 
  Search, 
  Filter, 
  Building2, 
  Globe, 
  DollarSign, 
  Briefcase, 
  CheckCircle2, 
  Sparkles,
  ArrowRight,
  SlidersHorizontal
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function JobSearch() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [companyType, setCompanyType] = useState('');
  const [isRemote, setIsRemote] = useState(false);
  const [isFresherFriendly, setIsFresherFriendly] = useState(false);
  const [lowCompetition, setLowCompetition] = useState(false);
  const [experienceLevel, setExperienceLevel] = useState('');
  const [minSalary, setMinSalary] = useState(0);

  const { addToast } = useNotification();

  useEffect(() => {
    fetchJobs();
  }, [companyType, isRemote, isFresherFriendly, lowCompetition, experienceLevel, minSalary]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (companyType) params.company_type = companyType;
      if (isRemote) params.is_remote = true;
      if (isFresherFriendly) params.is_fresher_friendly = true;
      if (lowCompetition) params.low_competition = true;
      if (experienceLevel) params.experience_level = experienceLevel;
      if (minSalary > 0) params.min_salary = minSalary;

      const res = await API.get('/jobs/', { params });
      setJobs(res.data);
    } catch (err) {
      addToast('Unable to load jobs. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  const handleQuickApply = async (job) => {
    try {
      await API.post('/swipes/action', {
        job_id: job.id,
        action: 'like'
      });
      addToast(`Applied for ${job.title} at ${job.company}!`, 'success');
    } catch (err) {
      addToast('Application failed', 'error');
    }
  };

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Header & Search Bar */}
      <div className="space-y-4">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <Search className="w-8 h-8 text-[#FF6B00]" />
          Smart Job Search & AI Filters
        </h1>
        <p className="text-xs text-slate-500 dark:text-neutral-400 font-medium">
          Filter jobs by MNC vs Startup, Remote roles, Salary range, and Fresher friendly badges.
        </p>

        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4.5 h-4.5 absolute left-4 top-3.5 text-slate-400 dark:text-neutral-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by job title, company, or skills (e.g. React, Python, FastAPI)..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl glass-input text-xs font-medium focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-gradient-to-r from-[#FF6B00] to-[#FF9D42] font-black text-xs text-white rounded-2xl shadow-[0_4px_15px_rgba(255,107,0,0.35)] hover:scale-105 transition-all shrink-0"
          >
            Search Jobs
          </button>
        </form>
      </div>

      {/* Main Grid: Filters Sidebar + Results */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Filters Sidebar */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 space-y-6 h-fit shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-neutral-800">
            <span className="font-black text-slate-900 dark:text-white flex items-center gap-2 text-xs">
              <SlidersHorizontal className="w-4 h-4 text-[#FF6B00]" /> Filters
            </span>
            <button
              onClick={() => {
                setCompanyType('');
                setIsRemote(false);
                setIsFresherFriendly(false);
                setLowCompetition(false);
                setExperienceLevel('');
                setMinSalary(0);
                setSearchTerm('');
              }}
              className="text-xs text-[#FF6B00] font-bold hover:underline"
            >
              Reset All
            </button>
          </div>

          {/* Company Type */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 dark:text-neutral-500 uppercase tracking-wider">Company Type</label>
            <select
              value={companyType}
              onChange={(e) => setCompanyType(e.target.value)}
              className="w-full p-2.5 rounded-xl glass-input text-xs font-bold bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-700 text-slate-900 dark:text-white focus:outline-none"
            >
              <option value="" className="bg-white dark:bg-neutral-900">All Company Types</option>
              <option value="MNC" className="bg-white dark:bg-neutral-900">MNC (Multi-National)</option>
              <option value="Startup" className="bg-white dark:bg-neutral-900">Startup</option>
              <option value="Newly Founded Startup" className="bg-white dark:bg-neutral-900">Newly Founded Startup</option>
            </select>
          </div>

          {/* Experience Level */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 dark:text-neutral-500 uppercase tracking-wider">Experience Level</label>
            <select
              value={experienceLevel}
              onChange={(e) => setExperienceLevel(e.target.value)}
              className="w-full p-2.5 rounded-xl glass-input text-xs font-bold bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-700 text-slate-900 dark:text-white focus:outline-none"
            >
              <option value="" className="bg-white dark:bg-neutral-900">All Levels</option>
              <option value="Entry Level" className="bg-white dark:bg-neutral-900">Entry Level</option>
              <option value="Mid Level" className="bg-white dark:bg-neutral-900">Mid Level</option>
              <option value="Senior" className="bg-white dark:bg-neutral-900">Senior</option>
            </select>
          </div>

          {/* Quick Checkbox Filters */}
          <div className="space-y-3 pt-2">
            <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-neutral-300 font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={isRemote}
                onChange={(e) => setIsRemote(e.target.checked)}
                className="rounded border-slate-300 dark:border-neutral-700 bg-slate-100 dark:bg-neutral-800 text-[#FF6B00] focus:ring-[#FF6B00] w-4 h-4"
              />
              100% Remote Roles Only
            </label>

            <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-neutral-300 font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={isFresherFriendly}
                onChange={(e) => setIsFresherFriendly(e.target.checked)}
                className="rounded border-slate-300 dark:border-neutral-700 bg-slate-100 dark:bg-neutral-800 text-[#FF6B00] focus:ring-[#FF6B00] w-4 h-4"
              />
              Fresher Friendly
            </label>

            <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-neutral-300 font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={lowCompetition}
                onChange={(e) => setLowCompetition(e.target.checked)}
                className="rounded border-slate-300 dark:border-neutral-700 bg-slate-100 dark:bg-neutral-800 text-[#FF6B00] focus:ring-[#FF6B00] w-4 h-4"
              />
              Low Competition Badge
            </label>
          </div>

          {/* Min Salary Slider */}
          <div className="space-y-2 pt-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-slate-500 dark:text-neutral-400">Minimum Salary</span>
              <span className="text-[#FF6B00]">${minSalary.toLocaleString()} / yr</span>
            </div>
            <input
              type="range"
              min="0"
              max="200000"
              step="10000"
              value={minSalary}
              onChange={(e) => setMinSalary(parseInt(e.target.value))}
              className="w-full accent-[#FF6B00] bg-slate-200 dark:bg-neutral-700"
            />
          </div>

        </div>

        {/* Job Cards Grid */}
        <div className="lg:col-span-3 space-y-4">
          <div className="text-xs text-slate-500 dark:text-neutral-400 font-bold">
            Showing {jobs.length} jobs
          </div>

          {loading ? (
            <div className="text-center py-12 text-slate-400 font-medium">Loading jobs...</div>
          ) : jobs.length === 0 ? (
            <div className="glass-panel p-12 rounded-3xl text-center text-slate-500 dark:text-neutral-400 border border-slate-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 font-medium">
              No jobs match your search filters. Try adjusting your preferences.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {jobs.map((job) => (
                <motion.div
                  whileHover={{ y: -3 }}
                  key={job.id}
                  className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 hover:border-[#FF6B00]/40 transition-all flex flex-col justify-between space-y-4 shadow-sm"
                >
                  <div>
                    <div className="flex justify-between items-start gap-2 mb-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={job.company_logo || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80"}
                          alt={job.company}
                          className="w-12 h-12 rounded-xl object-cover ring-1 ring-[#FF6B00]/20 shadow-sm"
                        />
                        <div>
                          <h3 className="font-black text-base text-slate-900 dark:text-white line-clamp-1">{job.title}</h3>
                          <p className="text-xs text-[#FF6B00] font-bold">{job.company}</p>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-neutral-300 line-clamp-3 mb-3 leading-relaxed font-normal">{job.description}</p>

                    <div className="flex flex-wrap gap-1.5 text-xs">
                      <span className="px-2.5 py-0.5 rounded-lg bg-[#FF6B00]/10 text-[#FF6B00] dark:text-[#FF9D42] border border-[#FF6B00]/20 font-bold">
                        {job.company_type}
                      </span>
                      {job.is_remote && (
                        <span className="px-2.5 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40 font-bold">
                          Remote
                        </span>
                      )}
                      {job.salary_max > 0 && (
                        <span className="px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-neutral-800 text-slate-700 dark:text-neutral-300 border border-slate-200 dark:border-neutral-700 font-bold">
                          ${(job.salary_min / 1000).toFixed(0)}k - ${(job.salary_max / 1000).toFixed(0)}k
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-neutral-800 flex justify-between items-center">
                    <span className="text-[11px] text-slate-500 dark:text-neutral-400 font-medium">{job.location}</span>
                    <button
                      onClick={() => handleQuickApply(job)}
                      className="px-4 py-1.5 bg-gradient-to-r from-[#FF6B00] to-[#FF9D42] text-white font-black rounded-xl text-xs shadow-[0_4px_15px_rgba(255,107,0,0.3)] transition-all hover:scale-105"
                    >
                      Instant Apply
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
