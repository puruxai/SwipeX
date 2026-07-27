import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useNotification } from '../context/NotificationContext';
import { 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Award, 
  TrendingUp, 
  Target, 
  Zap,
  Check
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function ResumeAnalyzer() {
  const [resumes, setResumes] = useState([]);
  const [activeResume, setActiveResume] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const { addToast } = useNotification();

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const res = await API.get('/resumes/');
      setResumes(res.data);
      if (res.data.length > 0) {
        const primary = res.data.find(r => r.is_primary) || res.data[0];
        setActiveResume(primary);
      }
    } catch (err) {
      addToast('Unable to load your resumes. Please try again.', 'error');
    }
  };

  const handleFileUpload = async (file) => {
    if (!file) return;
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
    ];
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!allowedTypes.includes(file.type) && !['pdf', 'docx', 'txt'].includes(extension)) {
      addToast('Upload a PDF, DOCX, or TXT resume.', 'error');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      addToast('Resume files must be 10 MB or smaller.', 'error');
      return;
    }
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await API.post('/resumes/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      addToast(`Analyzed ${file.name}! ATS Score: ${res.data.ats_score}/100`, 'success');
      setActiveResume(res.data);
      fetchResumes();
    } catch (err) {
      addToast(err.response?.data?.detail || 'Resume upload failed', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const atsBreakdown = activeResume?.ats_breakdown_json || {};
  const atsScore = activeResume?.ats_score || 0;

  return (
    <div className="py-8 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-[#FF6B00]" />
            AI Resume & ATS Analyzer
          </h1>
          <p className="text-xs text-slate-500 dark:text-neutral-400 mt-1 font-medium">
            Upload your resume to calculate ATS score, extract skills, and optimize keywords.
          </p>
        </div>

        {resumes.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 dark:text-neutral-400 font-bold">Select Resume:</span>
            <select
              value={activeResume?.id || ''}
              onChange={(e) => setActiveResume(resumes.find(r => r.id === parseInt(e.target.value)))}
              className="px-3 py-1.5 rounded-xl glass-input text-xs font-bold"
            >
              {resumes.map((r) => (
                <option key={r.id} value={r.id} className="bg-white dark:bg-neutral-900 text-slate-900 dark:text-white">
                  {r.filename} ({r.ats_score} ATS) {r.is_primary ? '★ Primary' : ''}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Drag & Drop File Upload Zone */}
      <motion.div
        whileHover={{ scale: 1.005 }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`glass-panel p-8 rounded-3xl border-2 border-dashed transition-all text-center space-y-4 shadow-sm ${
          dragActive
            ? 'border-[#FF6B00] bg-[#FF6B00]/10 scale-[1.01]'
            : 'border-slate-200 dark:border-neutral-800 hover:border-[#FF6B00]/40'
        }`}
      >
        <div className="w-16 h-16 mx-auto rounded-2xl bg-[#FF6B00]/10 border border-[#FF6B00]/25 flex items-center justify-center">
          <UploadCloud className="w-8 h-8 text-[#FF6B00]" />
        </div>
        <div>
          <h3 className="text-lg font-black text-slate-900 dark:text-white">Drag & Drop Resume PDF or DOCX</h3>
          <p className="text-xs text-slate-500 dark:text-neutral-400 mt-1 font-medium">Supports PDF, DOCX, and TXT (Max 10MB)</p>
        </div>
        <label className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#FF6B00] to-[#FF9D42] font-black text-xs text-white shadow-[0_4px_15px_rgba(255,107,0,0.35)] cursor-pointer hover:scale-105 transition-all">
          {uploading ? 'Analyzing with AI...' : 'Choose Resume File'}
          <input
            type="file"
            accept=".pdf,.docx,.txt"
            onChange={(e) => e.target.files[0] && handleFileUpload(e.target.files[0])}
            className="hidden"
            disabled={uploading}
          />
        </label>
      </motion.div>

      {/* Main Analysis Display */}
      {activeResume ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* ATS Gauge Card */}
          <div className="glass-panel p-8 rounded-3xl border border-slate-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 flex flex-col items-center justify-center text-center space-y-4 shadow-sm">
            <div className="relative w-40 h-40 flex items-center justify-center">
              {/* Radial Score Gauge Circle */}
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="rgba(0,0,0,0.06)"
                  strokeWidth="12"
                  fill="transparent"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="url(#atsGradient)"
                  strokeWidth="12"
                  strokeDasharray={440}
                  strokeDashoffset={440 - (440 * atsScore) / 100}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000 ease-out"
                />
                <defs>
                  <linearGradient id="atsGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FF6B00" />
                    <stop offset="100%" stopColor="#FF9D42" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-black text-slate-900 dark:text-white">{atsScore}</span>
                <span className="text-[10px] font-black text-[#FF6B00] uppercase tracking-widest">ATS Score</span>
              </div>
            </div>

            <div>
              <h3 className="font-black text-lg text-slate-900 dark:text-white">
                {atsScore >= 80 ? 'ATS Compatible Resume!' : 'Optimization Needed'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-neutral-400 mt-1 font-medium">
                {atsScore >= 80
                  ? 'Your resume passes corporate ATS scanners with high match probability.'
                  : 'Follow the suggestions below to increase your interview callback rate.'}
              </p>
            </div>

            <div className="w-full pt-4 border-t border-slate-100 dark:border-neutral-800 text-left text-xs space-y-2 font-medium">
              <div className="flex justify-between">
                <span className="text-slate-400 dark:text-neutral-500">Filename:</span>
                <span className="font-bold text-slate-900 dark:text-white truncate max-w-[180px]">{activeResume.filename}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 dark:text-neutral-500">Skills Extracted:</span>
                <span className="font-bold text-[#22C55E]">{activeResume.extracted_skills?.length || 0} Skills</span>
              </div>
            </div>
          </div>

          {/* Section Breakdown & Analysis */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Section Scores Grid */}
            <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 space-y-4 shadow-sm">
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Target className="w-5 h-5 text-[#FF6B00]" />
                ATS Scanner Section Scores
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.entries(atsBreakdown.breakdown || {})
                  .filter(([, val]) => val && typeof val === 'object' && 'score' in val && 'max' in val)
                  .map(([key, val]) => (
                  <div key={key} className="p-4 rounded-2xl bg-slate-50 dark:bg-neutral-800/80 border border-slate-200 dark:border-neutral-700/80 space-y-2">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="capitalize text-slate-600 dark:text-neutral-300">{key.replace('_', ' ')}</span>
                      <span className="text-[#FF6B00] dark:text-[#FF9D42]">{val.score} / {val.max} pts</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-neutral-700 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-[#FF6B00] to-[#FF9D42] h-full rounded-full transition-all duration-500"
                        style={{ width: `${(val.score / val.max) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Extracted Skills List */}
            <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 space-y-3 shadow-sm">
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-[#22C55E]" />
                Extracted Skills Taxonomy
              </h3>
              <div className="flex flex-wrap gap-2">
                {activeResume.extracted_skills?.map((skill, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40 text-xs font-bold"
                  >
                    ✓ {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* AI Improvement Suggestions */}
            {atsBreakdown.suggestions?.length > 0 && (
              <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 space-y-3 shadow-sm">
                <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                  Actionable Improvement Suggestions
                </h3>
                <ul className="space-y-2">
                  {atsBreakdown.suggestions.map((sug, i) => (
                    <li key={i} className="text-xs text-slate-700 dark:text-neutral-300 flex items-start gap-2 bg-amber-50 dark:bg-amber-950/30 p-3 rounded-xl border border-amber-200 dark:border-amber-800/40 font-medium">
                      <span className="text-amber-500 font-black">•</span>
                      <span>{sug}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

          </div>

        </div>
      ) : (
        <div className="glass-panel p-12 rounded-3xl text-center text-slate-500 dark:text-neutral-400 border border-slate-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 font-medium">
          Upload a resume above to calculate your ATS Score and unlock AI career insights.
        </div>
      )}

    </div>
  );
}
