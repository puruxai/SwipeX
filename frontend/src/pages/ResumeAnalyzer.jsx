import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useNotification } from '../context/NotificationContext';
import { 
  UploadCloud, 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  Sparkles, 
  Award, 
  TrendingUp, 
  Target, 
  Layers, 
  Zap,
  ArrowUpRight
} from 'lucide-react';

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
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-cyan-400" />
            AI Resume & ATS Analyzer
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Upload your resume to calculate ATS score, extract skills, and optimize keywords.
          </p>
        </div>

        {resumes.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Select Resume:</span>
            <select
              value={activeResume?.id || ''}
              onChange={(e) => setActiveResume(resumes.find(r => r.id === parseInt(e.target.value)))}
              className="px-3 py-1.5 rounded-xl glass-input text-xs font-bold"
            >
              {resumes.map((r) => (
                <option key={r.id} value={r.id} className="bg-slate-900 text-white">
                  {r.filename} ({r.ats_score} ATS) {r.is_primary ? '★ Primary' : ''}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Drag & Drop File Upload Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`glass-panel p-8 rounded-3xl border-2 border-dashed transition-all text-center space-y-4 ${
          dragActive
            ? 'border-indigo-500 bg-indigo-500/10 scale-[1.01]'
            : 'border-white/15 hover:border-indigo-500/40'
        }`}
      >
        <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
          <UploadCloud className="w-8 h-8 text-cyan-400" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">Drag & Drop Resume PDF or DOCX</h3>
          <p className="text-xs text-slate-400 mt-1">Supports PDF, DOCX, and TXT (Max 10MB)</p>
        </div>
        <label className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 font-bold text-xs text-white shadow-neon-indigo cursor-pointer hover:scale-105 transition-all">
          {uploading ? 'Analyzing with AI...' : 'Choose Resume File'}
          <input
            type="file"
            accept=".pdf,.docx,.txt"
            onChange={(e) => e.target.files[0] && handleFileUpload(e.target.files[0])}
            className="hidden"
            disabled={uploading}
          />
        </label>
      </div>

      {/* Main Analysis Display */}
      {activeResume ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* ATS Gauge Card */}
          <div className="glass-panel p-8 rounded-3xl border border-white/10 flex flex-col items-center justify-center text-center space-y-4">
            <div className="relative w-40 h-40 flex items-center justify-center">
              {/* Radial Score Gauge Circle */}
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="rgba(255,255,255,0.1)"
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
                    <stop offset="0%" stopColor="#6366F1" />
                    <stop offset="50%" stopColor="#8B5CF6" />
                    <stop offset="100%" stopColor="#06B6D4" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-black text-white">{atsScore}</span>
                <span className="text-[11px] font-bold text-indigo-300 uppercase tracking-widest">ATS Score</span>
              </div>
            </div>

            <div>
              <h3 className="font-extrabold text-lg text-white">
                {atsScore >= 80 ? 'ATS Compatible Resume!' : 'Optimization Needed'}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {atsScore >= 80
                  ? 'Your resume passes most corporate ATS scanners with high match probability.'
                  : 'Follow the suggestions below to increase your interview callback rate.'}
              </p>
            </div>

            <div className="w-full pt-4 border-t border-white/10 text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Filename:</span>
                <span className="font-semibold text-white truncate max-w-[180px]">{activeResume.filename}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Skills Extracted:</span>
                <span className="font-semibold text-emerald-400">{activeResume.extracted_skills?.length || 0} Skills</span>
              </div>
            </div>
          </div>

          {/* Section Breakdown & Analysis */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Section Scores Grid */}
            <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <Target className="w-5 h-5 text-indigo-400" />
                ATS Scanner Section Scores
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.entries(atsBreakdown.breakdown || {})
                  .filter(([, val]) => val && typeof val === 'object' && 'score' in val && 'max' in val)
                  .map(([key, val]) => (
                  <div key={key} className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="capitalize text-slate-300">{key.replace('_', ' ')}</span>
                      <span className="text-cyan-400">{val.score} / {val.max} pts</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full rounded-full transition-all duration-500"
                        style={{ width: `${(val.score / val.max) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Extracted Skills List */}
            <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-3">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-emerald-400" />
                Extracted Skills Taxonomy
              </h3>
              <div className="flex flex-wrap gap-2">
                {activeResume.extracted_skills?.map((skill, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold"
                  >
                    ✓ {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* AI Improvement Suggestions */}
            {atsBreakdown.suggestions?.length > 0 && (
              <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-3">
                <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                  Actionable Improvement Suggestions
                </h3>
                <ul className="space-y-2">
                  {atsBreakdown.suggestions.map((sug, i) => (
                    <li key={i} className="text-xs text-slate-300 flex items-start gap-2 bg-amber-500/10 p-3 rounded-xl border border-amber-500/20">
                      <span className="text-amber-400 font-bold">•</span>
                      <span>{sug}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

          </div>

        </div>
      ) : (
        <div className="glass-panel p-12 rounded-3xl text-center text-slate-400">
          Upload a resume above to calculate your ATS Score and unlock AI career insights.
        </div>
      )}

    </div>
  );
}
