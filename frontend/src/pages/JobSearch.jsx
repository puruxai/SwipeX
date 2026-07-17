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
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
          <Search className="w-8 h-8 text-[#FF6B00]" />
          Smart Job Search & Filters
        </h1>
        <p className="text-sm text-[#A8A8A8]">
          Filter jobs by MNC vs Startup, Remote roles, Salary range, and Fresher friendly badges.
        </p>

        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-4 top-3.5 text-[#A8A8A8]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by job title, company, or skills (e.g. React, Python, FastAPI)..."
              className="w-full pl-12 pr-4 py-3 rounded-2xl glass-input text-sm font-medium focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-gradient-to-r from-[#FF6B00] to-[#FF8A3D] font-bold text-white rounded-2xl shadow-[0_4px_15px_rgba(255,107,0,0.3)] hover:scale-105 transition-all text-sm shrink-0"
          >
            Search Jobs
          </button>
        </form>
      </div>

      {/* Main Grid: Filters Sidebar + Results */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Filters Sidebar */}
        <div className="glass-panel p-6 rounded-3xl border border-[#262626] bg-[#181818]/60 space-y-6 h-fit">
          <div className="flex items-center justify-between pb-4 border-b border-[#262626]">
            <span className="font-extrabold text-white flex items-center gap-2 text-sm">
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
              className="text-xs text-[#FF8A3D] font-bold hover:underline"
            >
              Reset All
            </button>
          </div>

          {/* Company Type */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#A8A8A8] uppercase tracking-wider">Company Type</label>
            <select
              value={companyType}
              onChange={(e) => setCompanyType(e.target.value)}
              className="w-full p-2.5 rounded-xl glass-input text-xs font-semibold bg-[#121212] border border-[#262626] text-white focus:outline-none"
            >
              <option value="" className="bg-[#121212]">All Company Types</option>
              <option value="MNC" className="bg-[#121212]">MNC (Multi-National)</option>
              <option value="Startup" className="bg-[#121212]">Startup</option>
              <option value="Newly Founded Startup" className="bg-[#121212]">Newly Founded Startup</option>
            </select>
          </div>

          {/* Experience Level */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#A8A8A8] uppercase tracking-wider">Experience Level</label>
            <select
              value={experienceLevel}
              onChange={(e) => setExperienceLevel(e.target.value)}
              className="w-full p-2.5 rounded-xl glass-input text-xs font-semibold bg-[#121212] border border-[#262626] text-white focus:outline-none"
            >
              <option value="" className="bg-[#121212]">All Levels</option>
              <option value="Entry Level" className="bg-[#121212]">Entry Level</option>
              <option value="Mid Level" className="bg-[#121212]">Mid Level</option>
              <option value="Senior" className="bg-[#121212]">Senior</option>
            </select>
          </div>

          {/* Quick Checkbox Filters */}
          <div className="space-y-3 pt-2">
            <label className="flex items-center gap-2 text-xs text-[#A8A8A8] font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={isRemote}
                onChange={(e) => setIsRemote(e.target.checked)}
                className="rounded border-[#262626] bg-[#121212] text-[#FF6B00] focus:ring-[#FF6B00] w-4 h-4"
              />
              100% Remote Roles Only
            </label>

            <label className="flex items-center gap-2 text-xs text-[#A8A8A8] font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={isFresherFriendly}
                onChange={(e) => setIsFresherFriendly(e.target.checked)}
                className="rounded border-[#262626] bg-[#121212] text-[#FF6B00] focus:ring-[#FF6B00] w-4 h-4"
              />
              Fresher Friendly
            </label>

            <label className="flex items-center gap-2 text-xs text-[#A8A8A8] font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={lowCompetition}
                onChange={(e) => setLowCompetition(e.target.checked)}
                className="rounded border-[#262626] bg-[#121212] text-[#FF6B00] focus:ring-[#FF6B00] w-4 h-4"
              />
              Low Competition Badge
            </label>
          </div>

          {/* Min Salary Slider */}
          <div className="space-y-2 pt-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-[#A8A8A8]">Minimum Salary</span>
              <span className="text-[#FF8A3D]">${minSalary.toLocaleString()} / yr</span>
            </div>
            <input
              type="range"
              min="0"
              max="200000"
              step="10000"
              value={minSalary}
              onChange={(e) => setMinSalary(parseInt(e.target.value))}
              className="w-full accent-[#FF6B00] bg-[#262626]"
            />
          </div>

        </div>

        {/* Job Cards Grid */}
        <div className="lg:col-span-3 space-y-4">
          <div className="text-xs text-[#A8A8A8] font-semibold">
            Showing {jobs.length} jobs
          </div>

          {loading ? (
            <div className="text-center py-12 text-[#A8A8A8]">Loading jobs...</div>
          ) : jobs.length === 0 ? (
            <div className="glass-panel p-12 rounded-3xl text-center text-[#A8A8A8] border border-[#262626] bg-[#181818]/60">
              No jobs match your search filters. Try adjusting your preferences.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="glass-panel p-6 rounded-3xl border border-[#262626] bg-[#181818]/60 hover:border-[#FF6B00]/40 transition-all flex flex-col justify-between space-y-4"
                >
                  <div>
                    <div className="flex justify-between items-start gap-2 mb-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={job.company_logo || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80"}
                          alt={job.company}
                          className="w-12 h-12 rounded-xl object-cover ring-1 ring-[#FF6B00]/10"
                        />
                        <div>
                          <h3 className="font-extrabold text-base text-white line-clamp-1">{job.title}</h3>
                          <p className="text-xs text-[#FF8A3D] font-medium">{job.company}</p>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 line-clamp-3 mb-3">{job.description}</p>

                    <div className="flex flex-wrap gap-1.5 text-[11px]">
                      <span className="px-2 py-0.5 rounded bg-[#FF6B00]/10 text-[#FF8A3D] border border-[#FF6B00]/10 font-semibold">
                        {job.company_type}
                      </span>
                      {job.is_remote && (
                        <span className="px-2 py-0.5 rounded bg-[#FF8A3D]/10 text-[#FF8A3D] border border-[#FF8A3D]/10 font-semibold">
                          Remote
                        </span>
                      )}
                      {job.salary_max > 0 && (
                        <span className="px-2 py-0.5 rounded bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/10 font-semibold">
                          ${(job.salary_min / 1000).toFixed(0)}k - ${(job.salary_max / 1000).toFixed(0)}k
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#262626] flex justify-between items-center">
                    <span className="text-[11px] text-[#A8A8A8]">{job.location}</span>
                    <button
                      onClick={() => handleQuickApply(job)}
                      className="px-4 py-1.5 bg-[#FF6B00] hover:bg-[#FF8A3D] text-white font-bold rounded-xl text-xs shadow-[0_4px_15px_rgba(255,107,0,0.3)] transition-all hover:scale-105"
                    >
                      Instant Apply
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
