import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useNotification } from '../context/NotificationContext';
import Sidebar from '../components/Sidebar';
import { 
  FileText, 
  UploadCloud, 
  Share2, 
  Download, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  TrendingUp, 
  Users 
} from 'lucide-react';

export default function ResumeAnalyzer() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [analysisData, setAnalysisData] = useState(null);
  const { addToast } = useNotification();

  useEffect(() => {
    fetchLatestAnalysis();
  }, []);

  const fetchLatestAnalysis = async () => {
    try {
      const res = await API.get('/resumes/analysis/latest');
      if (res.data) setAnalysisData(res.data);
    } catch (err) {
      // fallback mock
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
      addToast('Resume analyzed successfully!', 'success');
    } catch (err) {
      addToast('Failed to analyze resume.', 'error');
    } finally {
      setUploading(false);
    }
  };

  const matchScore = analysisData?.ats_score || 82;

  return (
    <div className="flex min-h-[90vh] bg-[#FFF9F5] text-[#1C1917]">
      
      {/* Left Sidebar Shell */}
      <Sidebar />

      {/* Main ATS Content (Matching Reference Screenshot 4) */}
      <div className="flex-1 p-6 md:p-8 space-y-6">
        
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#F3E8E2] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#FF8A3D] text-white text-[10px] font-black uppercase">ANALYSIS COMPLETE</span>
              <span className="text-[11px] font-bold text-[#78716C]">ID: SX-9921-A</span>
            </div>
            <h1 className="text-3xl font-black text-[#1C1917] tracking-tight mt-1">ATS Analysis Complete</h1>
            <p className="text-xs text-[#78716C] font-medium">Your resume has been processed against 45 standard ATS patterns.</p>
          </div>

          <div className="flex gap-2">
            <button className="btn-terracotta-outline px-4 py-2 text-xs font-bold flex items-center gap-1.5">
              <Download className="w-3.5 h-3.5" /> Download Report
            </button>
            <button className="btn-terracotta px-4 py-2 text-xs font-black flex items-center gap-1.5">
              <Share2 className="w-3.5 h-3.5" /> Share Result
            </button>
          </div>
        </div>

        {/* Row 1: Score Circle + Radar + Heatmap (Matching Reference Screenshot 4) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Circular Match Score */}
          <div className="reference-card p-6 border border-[#F3E8E2] bg-white rounded-3xl text-center space-y-4 shadow-sm flex flex-col items-center justify-center">
            <div className="w-28 h-28 rounded-full border-4 border-[#963200] flex flex-col items-center justify-center bg-white shadow-md">
              <span className="text-4xl font-black text-[#963200]">{matchScore}</span>
              <span className="text-[10px] font-bold text-[#78716C] uppercase">Match Score</span>
            </div>
            <span className="px-3.5 py-1 rounded-full bg-[#FFF0E6] text-[#963200] font-black text-xs">
              TOP 5% OF CANDIDATES
            </span>
          </div>

          {/* Card 2: Skill Radar Diamond */}
          <div className="reference-card p-6 border border-[#F3E8E2] bg-white rounded-3xl space-y-3 shadow-sm flex flex-col justify-between">
            <div className="flex items-center gap-2 text-xs font-black text-[#963200]">
              <Sparkles className="w-4 h-4" /> Skill Radar
            </div>
            <div className="h-32 rounded-2xl bg-[#FFF9F5] border border-[#F3E8E2] flex items-center justify-center p-2">
              {/* Radar Graphic Representation */}
              <div className="w-24 h-24 border-2 border-[#963200]/40 rotate-45 flex items-center justify-center relative">
                <span className="absolute -top-3 text-[9px] font-bold text-[#78716C]">TECH</span>
                <span className="absolute -bottom-3 text-[9px] font-bold text-[#78716C]">SOFT</span>
                <span className="absolute -left-5 text-[9px] font-bold text-[#78716C]">TOOLS</span>
                <span className="absolute -right-7 text-[9px] font-bold text-[#78716C]">EXPERIENCE</span>
              </div>
            </div>
          </div>

          {/* Card 3: Heatmap Analysis */}
          <div className="reference-card p-6 border border-[#F3E8E2] bg-white rounded-3xl space-y-3 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-black text-[#963200]">
              <FileText className="w-4 h-4" /> Heatmap Analysis
            </div>
            <div className="space-y-2 text-xs font-medium">
              <div className="flex justify-between"><span>Keywords found</span><span className="font-black text-[#1C1917]">14/18</span></div>
              <div className="flex justify-between"><span>Formatting health</span><span className="font-black text-emerald-600">98%</span></div>
              <div className="flex justify-between"><span>Parse stability</span><span className="font-black text-[#963200]">High</span></div>
            </div>
            <div className="flex flex-wrap gap-1 pt-1">
              <span className="px-2 py-0.5 rounded bg-[#FFF0E6] text-[10px] font-bold text-[#57534E]">React.js</span>
              <span className="px-2 py-0.5 rounded bg-[#FFF0E6] text-[10px] font-bold text-[#57534E]">Tailwind</span>
              <span className="px-2 py-0.5 rounded bg-[#FFF0E6] text-[10px] font-bold text-[#57534E]">Architecture</span>
            </div>
          </div>

        </div>

        {/* Row 2: Critical Skill Gaps + Fast Iteration Terracotta Card (Matching Reference Screenshot 4) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Critical Skill Gaps (Left) */}
          <div className="lg:col-span-8 reference-card p-6 border border-[#F3E8E2] bg-white rounded-3xl space-y-4 shadow-sm">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-black text-[#1C1917]">Critical Skill Gaps</h3>
              <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-600 font-black text-[10px]">Priority High</span>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex justify-between items-center text-xs">
                <div>
                  <span className="font-black text-[#1C1917]">AZ Azure Cloud Infrastructure</span>
                  <p className="text-[11px] text-[#78716C]">Missing 3/5 targeted certifications</p>
                </div>
                <span className="font-black text-[#963200]">40% Match</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex justify-between items-center text-xs">
                <div>
                  <span className="font-black text-[#1C1917]">PY Advanced Python Analysis</span>
                  <p className="text-[11px] text-[#78716C]">Pandas & NumPy benchmarks not detected</p>
                </div>
                <span className="font-black text-[#963200]">62% Match</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex justify-between items-center text-xs">
                <div>
                  <span className="font-black text-[#1C1917]">ML Machine Learning Operations (MLOps)</span>
                  <p className="text-[11px] text-[#78716C]">CI/CD for model deployment not quantified</p>
                </div>
                <span className="font-black text-[#963200]">15% Match</span>
              </div>
            </div>
          </div>

          {/* Solid Terracotta Card: Fast Iteration (Right) */}
          <div className="lg:col-span-4 rounded-3xl bg-[#963200] text-white p-6 space-y-4 shadow-xl flex flex-col justify-between">
            <div className="space-y-2">
              <h3 className="text-lg font-black">Fast Iteration</h3>
              <p className="text-xs opacity-90 font-medium leading-relaxed">
                Upload a revised version to see your score update instantly.
              </p>
            </div>

            <label className="border-2 border-dashed border-white/40 rounded-2xl p-6 text-center cursor-pointer hover:border-white transition-all block">
              <UploadCloud className="w-8 h-8 mx-auto text-white mb-2 animate-bounce" />
              <span className="text-xs font-black block">Drop New Resume</span>
              <span className="text-[10px] opacity-75">PDF, DOCX (Max 10MB)</span>
              <input type="file" accept=".pdf,.docx,.txt" onChange={handleFileUpload} className="hidden" />
            </label>

            <div className="text-[10px] font-black uppercase text-center opacity-75 tracking-wider">
              ⚡ AI REAL-TIME PROCESSING
            </div>
          </div>

        </div>

        {/* Row 3: Industry Benchmarks */}
        <div className="reference-card p-6 border border-[#F3E8E2] bg-white rounded-3xl space-y-4 shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-base font-black text-[#1C1917]">Industry Benchmarks</h3>
              <p className="text-xs text-[#78716C] font-medium">How you stack up against typical roles in Tech & AI.</p>
            </div>
            <div className="flex gap-1 bg-[#FFF0E6] p-1 rounded-xl text-xs font-bold text-[#78716C]">
              <button className="px-3 py-1 rounded-lg bg-[#963200] text-white">Global Average</button>
              <button className="px-3 py-1 rounded-lg">Competitors</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-[#FFF0E6] space-y-2">
              <div className="flex justify-between text-xs font-bold"><span className="text-[#A8A29E] uppercase text-[10px]">CANDIDATE POOL</span><span className="text-emerald-600">+12% vs Avg</span></div>
              <h4 className="text-sm font-black text-[#1C1917]">Software Eng.</h4>
              <div className="h-1.5 w-full bg-[#F3D2C1] rounded-full overflow-hidden"><div className="h-full bg-[#963200] w-[75%]" /></div>
            </div>

            <div className="p-4 rounded-2xl bg-[#FFF0E6] space-y-2">
              <div className="flex justify-between text-xs font-bold"><span className="text-[#A8A29E] uppercase text-[10px]">CANDIDATE POOL</span><span className="text-rose-600">-4% vs Avg</span></div>
              <h4 className="text-sm font-black text-[#1C1917]">Data Scientist</h4>
              <div className="h-1.5 w-full bg-[#F3D2C1] rounded-full overflow-hidden"><div className="h-full bg-[#963200] w-[50%]" /></div>
            </div>

            <div className="p-4 rounded-2xl bg-[#FFF0E6] space-y-2">
              <div className="flex justify-between text-xs font-bold"><span className="text-[#A8A29E] uppercase text-[10px]">CANDIDATE POOL</span><span className="text-emerald-600">+28% vs Avg</span></div>
              <h4 className="text-sm font-black text-[#1C1917]">AI Researcher</h4>
              <div className="h-1.5 w-full bg-[#F3D2C1] rounded-full overflow-hidden"><div className="h-full bg-[#963200] w-[90%]" /></div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
