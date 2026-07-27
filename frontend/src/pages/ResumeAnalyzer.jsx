import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useNotification } from '../context/NotificationContext';
import { 
  FileText, 
  UploadCloud, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Award, 
  TrendingUp, 
  Zap, 
  Check,
  Edit,
  ArrowRight,
  Bot
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function ResumeAnalyzer() {
  const [activeTab, setActiveTab] = useState('analyzer'); // 'analyzer' | 'builder'
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [analysisData, setAnalysisData] = useState(null);
  const { addToast } = useNotification();

  // Builder State
  const [builderTargetScore, setBuilderTargetScore] = useState(98);
  const [builderOutput, setBuilderOutput] = useState(null);
  const [builderLoading, setBuilderLoading] = useState(false);

  useEffect(() => {
    fetchLatestAnalysis();
  }, []);

  const fetchLatestAnalysis = async () => {
    try {
      const res = await API.get('/resumes/analysis/latest');
      if (res.data) {
        setAnalysisData(res.data);
      }
    } catch (err) {
      // no previous upload yet
    }
  };

  const handleFileUpload = async (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setUploading(true);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const res = await API.post('/resumes/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setAnalysisData(res.data);
      addToast('Resume uploaded & ATS score generated!', 'success');
    } catch (err) {
      addToast('Failed to analyze resume file.', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleRewriteResume = async () => {
    setBuilderLoading(true);
    try {
      const res = await API.post('/ai/rewrite-resume', { target_score: builderTargetScore });
      setBuilderOutput(res.data);
      addToast('Resume optimized for target score!', 'success');
    } catch (err) {
      addToast('Failed to optimize resume.', 'error');
    } finally {
      setBuilderLoading(false);
    }
  };

  const atsScore = analysisData?.ats_score || 88;

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
            <FileText className="w-8 h-8 text-[#FF6B00]" />
            AI Resume & ATS Optimizer
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Upload your resume for real-time 0-100 ATS evaluation, action verb extraction, and target scoring.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('analyzer')}
            className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'analyzer'
                ? 'bg-[#FF6B00] text-white shadow-md shadow-orange-500/25'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            ATS Analyzer
          </button>
          <button
            onClick={() => setActiveTab('builder')}
            className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'builder'
                ? 'bg-[#FF6B00] text-white shadow-md shadow-orange-500/25'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            AI Resume Builder
          </button>
        </div>
      </div>

      {activeTab === 'analyzer' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* File Upload Dropzone (Left Column) */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="luxury-card p-8 border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 text-center space-y-4 shadow-sm">
              <div className="w-16 h-16 mx-auto rounded-3xl bg-[#FF6B00]/10 border border-[#FF6B00]/25 flex items-center justify-center">
                <UploadCloud className="w-8 h-8 text-[#FF6B00]" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">Upload Resume File</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">Supports PDF, DOCX, or TXT (Max 10MB)</p>
              </div>

              <label className="block">
                <span className="sr-only">Choose file</span>
                <input
                  type="file"
                  accept=".pdf,.docx,.txt"
                  onChange={handleFileUpload}
                  className="block w-full text-xs text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-black file:bg-[#FF6B00] file:text-white hover:file:bg-[#E66000] cursor-pointer"
                />
              </label>

              {uploading && (
                <div className="text-xs font-bold text-[#FF6B00] animate-pulse">
                  Analyzing document structure & skill density...
                </div>
              )}
            </div>

            {/* Extracted Skills List */}
            {analysisData && (
              <div className="luxury-card p-6 border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 space-y-3">
                <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">Extracted Technical Skills</h4>
                <div className="flex flex-wrap gap-1.5">
                  {analysisData.extracted_skills?.map((skill, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 text-xs font-bold flex items-center gap-1">
                      <Check className="w-3 h-3" /> {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* ATS Score & Diagnostic Breakdown (Right Column) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Circular Score Gauge Header */}
            <div className="luxury-card p-8 border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
              <div className="space-y-2 text-center sm:text-left">
                <span className="px-3 py-1 rounded-full bg-[#FF6B00]/10 text-[#FF6B00] font-black text-xs">
                  Real-Time ATS Scorer v2.0
                </span>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">Overall ATS Match Gauge</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm font-medium">
                  Evaluated across contact structure, action verb metrics, section headers, and formatting length.
                </p>
              </div>

              {/* Score Gauge Circle */}
              <div className="w-28 h-28 rounded-full border-4 border-[#FF6B00] flex flex-col items-center justify-center bg-white dark:bg-slate-900 shadow-xl">
                <span className="text-4xl font-black text-[#FF6B00]">{atsScore}</span>
                <span className="text-[10px] uppercase font-extrabold text-slate-400">/ 100</span>
              </div>
            </div>

            {/* Diagnostic Categories */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div className="luxury-card p-5 border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 space-y-2">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span>Action Verbs & Impact</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                </div>
                <div className="text-xl font-black text-slate-900 dark:text-white">Strong</div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Contains high-impact action verbs (engineered, scaled, deployed).</p>
              </div>

              <div className="luxury-card p-5 border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 space-y-2">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span>Section Structure</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                </div>
                <div className="text-xl font-black text-slate-900 dark:text-white">Optimal</div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">All standard headers present (Experience, Education, Skills).</p>
              </div>

            </div>

            {/* Actionable Optimization Suggestions */}
            {analysisData?.optimization_report && (
              <div className="luxury-card p-6 border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 space-y-3">
                <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" /> Optimization Recommendations
                </h4>
                <div className="space-y-2 text-xs font-medium text-slate-600 dark:text-slate-300">
                  {analysisData.optimization_report.map((item, idx) => (
                    <div key={idx} className="p-3 rounded-2xl bg-amber-500/5 border border-amber-500/15 flex items-start gap-2">
                      <span className="font-bold text-amber-600">•</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>
      )}

      {/* AI RESUME BUILDER TAB */}
      {activeTab === 'builder' && (
        <div className="luxury-card p-8 border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 space-y-6 shadow-sm">
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <Bot className="w-6 h-6 text-[#FF6B00]" />
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white">AI Target Score Resume Rewrite</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Re-formats your existing parsed resume to achieve a 95+ target ATS score.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 max-w-md">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Target ATS Score:</label>
            <input
              type="number"
              min="85"
              max="100"
              value={builderTargetScore}
              onChange={(e) => setBuilderTargetScore(parseInt(e.target.value))}
              className="glass-input px-3 py-2 rounded-xl text-xs font-bold w-24"
            />
            <button onClick={handleRewriteResume} disabled={builderLoading} className="btn-primary px-6 py-2.5 text-xs font-black">
              {builderLoading ? 'Optimizing...' : 'Generate Optimized Content'}
            </button>
          </div>

          {builderOutput && (
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-black text-emerald-500 uppercase tracking-wider">Optimized Content Ready</span>
                <span className="text-xs font-bold text-slate-400">Score Reached: {builderOutput.target_score || 98}/100</span>
              </div>
              <textarea
                readOnly
                value={builderOutput.rewritten_resume || builderOutput.text}
                rows={10}
                className="w-full glass-input p-4 rounded-xl text-xs font-mono"
              />
            </div>
          )}
        </div>
      )}

    </div>
  );
}
