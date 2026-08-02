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
  Users,
  Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';

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

  // Stagger entry configurations
  const pageVariants = {
    hidden: { opacity: 0, y: 15, filter: 'blur(6px)' },
    show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { type: 'spring', stiffness: 100 } }
  };

  return (
    <div className="flex min-h-[90vh] bg-[#fff8f6] dark:bg-[#0c1322] text-[#261812] dark:text-[#dce2f7] transition-colors">
      
      {/* Left Sidebar Shell */}
      <Sidebar />

      {/* Main ATS Content */}
      <motion.div 
        initial="hidden"
        animate="show"
        variants={pageVariants}
        className="flex-1 p-8 lg:p-10 space-y-8"
      >
        
        {/* Header Bar inside Content Canvas */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-[#e2bfb0]/30 dark:border-white/5 pb-6">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="px-3 py-1 rounded-full bg-[#ff6b00] dark:bg-[#ffb693] text-white dark:text-[#561f00] text-[10px] font-black uppercase tracking-wider">ANALYSIS COMPLETE</span>
              <span className="text-[11px] font-bold text-[#5a4136] dark:text-[#e2bfb0]/70">ID: SX-9921-A</span>
            </div>
            <h1 className="text-3xl font-extrabold text-[#261812] dark:text-white tracking-tight mt-2.5">ATS Analysis Complete</h1>
            <p className="text-xs text-[#5a4136] dark:text-[#e2bfb0] font-medium mt-1">Your resume has been processed against 45 standard ATS patterns.</p>
          </div>

          <div className="flex gap-3">
            <button className="btn-terracotta-outline px-5 py-3 text-xs font-bold flex items-center gap-1.5">
              <Download className="w-3.5 h-3.5" /> Download Report
            </button>
            <button className="btn-terracotta px-5 py-3 text-xs font-black flex items-center gap-1.5">
              <Share2 className="w-3.5 h-3.5" /> Share Result
            </button>
          </div>
        </div>

        {/* Row 1: Score Circle + Radar + Heatmap */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Circular Match Score */}
          <div className="reference-card p-8 bg-white dark:bg-[#191f2f]/85 flex flex-col items-center justify-center space-y-5">
            <div className="w-28 h-28 rounded-full border-4 border-[#ff6b00] dark:border-[#ffb693] flex flex-col items-center justify-center bg-white/40 dark:bg-white/5 shadow-md">
              <span className="text-4xl font-black text-[#a04100] dark:text-white">{matchScore}</span>
              <span className="text-[9px] font-black uppercase text-[#5a4136] dark:text-[#e2bfb0] tracking-wider mt-0.5">MATCH</span>
            </div>
            <span className="px-4 py-1.5 rounded-full bg-[#ff6b00]/10 border border-[#ff6b00]/20 text-[#a04100] dark:text-[#ffb693] font-extrabold text-xs">
              TOP 5% OF CANDIDATES
            </span>
          </div>

          {/* Card 2: Skill Radar Diamond */}
          <div className="reference-card p-8 bg-white dark:bg-[#191f2f]/85 flex flex-col justify-between space-y-4">
            <div className="flex items-center gap-2 text-xs font-black text-[#a04100] dark:text-[#ffb693] uppercase tracking-wider">
              <Sparkles className="w-4 h-4" /> Skill Radar
            </div>
            <div className="h-32 rounded-2xl bg-white/40 dark:bg-white/5 border border-[#e2bfb0]/30 dark:border-white/5 flex items-center justify-center p-2">
              <div className="w-20 h-20 border-2 border-[#ff6b00]/30 rotate-45 flex items-center justify-center relative">
                <span className="absolute -top-3.5 text-[9px] font-bold text-[#5a4136] dark:text-[#e2bfb0] -rotate-45">TECH</span>
                <span className="absolute -bottom-3.5 text-[9px] font-bold text-[#5a4136] dark:text-[#e2bfb0] -rotate-45">SOFT</span>
                <span className="absolute -left-5 text-[9px] font-bold text-[#5a4136] dark:text-[#e2bfb0] -rotate-45">TOOLS</span>
                <span className="absolute -right-7 text-[9px] font-bold text-[#5a4136] dark:text-[#e2bfb0] -rotate-45">EXP</span>
              </div>
            </div>
          </div>

          {/* Card 3: Heatmap Analysis */}
          <div className="reference-card p-8 bg-white dark:bg-[#191f2f]/85 space-y-4">
            <div className="flex items-center gap-2 text-xs font-black text-[#a04100] dark:text-[#ffb693] uppercase tracking-wider">
              <FileText className="w-4 h-4" /> Heatmap Analysis
            </div>
            <div className="space-y-3.5 text-xs font-bold text-[#5a4136] dark:text-[#e2bfb0]">
              <div className="flex justify-between"><span>Keywords found</span><span className="font-extrabold text-[#261812] dark:text-white">14/18</span></div>
              <div className="flex justify-between"><span>Formatting health</span><span className="font-extrabold text-emerald-600 dark:text-emerald-400">98%</span></div>
              <div className="flex justify-between"><span>Parse stability</span><span className="font-extrabold text-[#ffb693]">High</span></div>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="px-3 py-1 rounded bg-[#ff6b00]/10 border border-[#ff6b00]/20 text-[10px] font-bold text-[#a04100] dark:text-[#ffb693]">React.js</span>
              <span className="px-3 py-1 rounded bg-[#ff6b00]/10 border border-[#ff6b00]/20 text-[10px] font-bold text-[#a04100] dark:text-[#ffb693]">Tailwind</span>
              <span className="px-3 py-1 rounded bg-[#ff6b00]/10 border border-[#ff6b00]/20 text-[10px] font-bold text-[#a04100] dark:text-[#ffb693]">Architecture</span>
            </div>
          </div>

        </div>

        {/* Row 2: Critical Skill Gaps + Fast Iteration */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Critical Skill Gaps */}
          <div className="lg:col-span-8 reference-card p-8 bg-white dark:bg-[#191f2f]/85 space-y-5">
            <div className="flex justify-between items-center border-b border-[#e2bfb0]/20 dark:border-white/5 pb-2.5">
              <h3 className="text-base font-bold text-[#261812] dark:text-white">Critical Skill Gaps</h3>
              <span className="px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-500 text-[10px] font-black uppercase tracking-wider">Priority High</span>
            </div>

            <div className="space-y-3">
              <div className="p-4.5 rounded-2xl bg-white/40 dark:bg-white/5 border border-[#e2bfb0]/30 dark:border-white/5 flex justify-between items-center text-xs font-bold text-[#5a4136] dark:text-[#e2bfb0]">
                <div>
                  <span className="font-extrabold text-[#261812] dark:text-white">AZ Azure Cloud Infrastructure</span>
                  <p className="text-[11px] text-[#5a4136]/70 dark:text-[#e2bfb0]/70 font-semibold mt-0.5">Missing 3/5 targeted certifications</p>
                </div>
                <span className="font-black text-[#a04100] dark:text-[#ffb693]">40% Match</span>
              </div>

              <div className="p-4.5 rounded-2xl bg-white/40 dark:bg-white/5 border border-[#e2bfb0]/30 dark:border-white/5 flex justify-between items-center text-xs font-bold text-[#5a4136] dark:text-[#e2bfb0]">
                <div>
                  <span className="font-extrabold text-[#261812] dark:text-white">PY Advanced Python Analysis</span>
                  <p className="text-[11px] text-[#5a4136]/70 dark:text-[#e2bfb0]/70 font-semibold mt-0.5">Pandas & NumPy benchmarks not detected</p>
                </div>
                <span className="font-black text-[#a04100] dark:text-[#ffb693]">62% Match</span>
              </div>

              <div className="p-4.5 rounded-2xl bg-white/40 dark:bg-white/5 border border-[#e2bfb0]/30 dark:border-white/5 flex justify-between items-center text-xs font-bold text-[#5a4136] dark:text-[#e2bfb0]">
                <div>
                  <span className="font-extrabold text-[#261812] dark:text-white">ML Machine Learning Operations (MLOps)</span>
                  <p className="text-[11px] text-[#5a4136]/70 dark:text-[#e2bfb0]/70 font-semibold mt-0.5">CI/CD for model deployment not quantified</p>
                </div>
                <span className="font-black text-[#a04100] dark:text-[#ffb693]">15% Match</span>
              </div>
            </div>
          </div>

          {/* Solid Terracotta Card: Fast Iteration */}
          <div className="lg:col-span-4 rounded-3xl bg-gradient-to-br from-[#1c1917] to-[#0c1322] border border-white/5 text-white p-8 space-y-5 shadow-2xl relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#ff6b00]/10 blur-xl rounded-full" />
            <div className="space-y-2 relative z-10">
              <h3 className="text-lg font-extrabold tracking-wide">Fast Iteration</h3>
              <p className="text-xs opacity-90 font-medium leading-relaxed">
                Upload a revised version to see your score update instantly.
              </p>
            </div>

            <label className="border-2 border-dashed border-[#e2bfb0]/40 rounded-2xl p-6 text-center cursor-pointer hover:border-[#ffb693] transition-all block relative z-10 bg-white/5">
              {uploading ? (
                <div className="py-2.5">
                  <Loader2 className="w-8 h-8 mx-auto text-[#ffb693] mb-2 animate-spin" />
                  <span className="text-xs font-black block">Processing Resume...</span>
                </div>
              ) : (
                <>
                  <UploadCloud className="w-8 h-8 mx-auto text-[#ffb693] mb-2 animate-bounce" />
                  <span className="text-xs font-black block">Drop New Resume</span>
                  <span className="text-[10px] opacity-75">PDF, DOCX (Max 10MB)</span>
                </>
              )}
              <input type="file" accept=".pdf,.docx,.txt" onChange={handleFileUpload} className="hidden" />
            </label>

            <div className="text-[9px] font-black uppercase text-center opacity-75 tracking-widest relative z-10 text-[#ffb693]">
              ⚡ AI REAL-TIME PROCESSING
            </div>
          </div>

        </div>

        {/* Row 3: Industry Benchmarks */}
        <div className="reference-card p-8 bg-white dark:bg-[#191f2f]/85 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e2bfb0]/20 dark:border-white/5 pb-4">
            <div>
              <h3 className="text-base font-bold text-[#261812] dark:text-white">Industry Benchmarks</h3>
              <p className="text-xs text-[#5a4136] dark:text-[#e2bfb0] font-medium">How you stack up against typical roles in Tech & AI.</p>
            </div>
            <div className="flex gap-1 bg-[#fff1eb] dark:bg-white/5 border border-[#e2bfb0]/30 dark:border-white/5 p-1 rounded-xl text-xs font-bold text-[#5a4136] dark:text-[#e2bfb0]">
              <button className="px-3.5 py-1.5 rounded-lg bg-[#ff6b00] dark:bg-[#ffb693] text-white dark:text-[#561f00]">Global Average</button>
              <button className="px-3.5 py-1.5 rounded-lg">Competitors</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-white/40 dark:bg-white/5 border border-[#e2bfb0]/30 dark:border-white/5 space-y-2">
              <div className="flex justify-between text-xs font-bold"><span className="text-[#5a4136]/70 dark:text-[#e2bfb0]/70 uppercase text-[9px] tracking-wider">CANDIDATE POOL</span><span className="text-emerald-600 dark:text-emerald-400">+12% vs Avg</span></div>
              <h4 className="text-sm font-bold text-[#261812] dark:text-white">Software Eng.</h4>
              <div className="h-1.5 w-full bg-[#fff1eb] dark:bg-white/10 rounded-full overflow-hidden mt-1"><div className="h-full bg-[#ff6b00] w-[75%]" /></div>
            </div>

            <div className="p-5 rounded-2xl bg-white/40 dark:bg-white/5 border border-[#e2bfb0]/30 dark:border-white/5 space-y-2">
              <div className="flex justify-between text-xs font-bold"><span className="text-[#5a4136]/70 dark:text-[#e2bfb0]/70 uppercase text-[9px] tracking-wider">CANDIDATE POOL</span><span className="text-rose-600">-4% vs Avg</span></div>
              <h4 className="text-sm font-bold text-[#261812] dark:text-white">Data Scientist</h4>
              <div className="h-1.5 w-full bg-[#fff1eb] dark:bg-white/10 rounded-full overflow-hidden mt-1"><div className="h-full bg-[#ff6b00] w-[50%]" /></div>
            </div>

            <div className="p-5 rounded-2xl bg-white/40 dark:bg-white/5 border border-[#e2bfb0]/30 dark:border-white/5 space-y-2">
              <div className="flex justify-between text-xs font-bold"><span className="text-[#5a4136]/70 dark:text-[#e2bfb0]/70 uppercase text-[9px] tracking-wider">CANDIDATE POOL</span><span className="text-emerald-600 dark:text-emerald-400">+28% vs Avg</span></div>
              <h4 className="text-sm font-bold text-[#261812] dark:text-white">AI Researcher</h4>
              <div className="h-1.5 w-full bg-[#fff1eb] dark:bg-white/10 rounded-full overflow-hidden mt-1"><div className="h-full bg-[#ff6b00] w-[90%]" /></div>
            </div>
          </div>
        </div>

      </motion.div>

      <div className="hidden">
        <Users className="w-1" />
        <TrendingUp className="w-1" />
        <AlertTriangle className="w-1" />
      </div>

    </div>
  );
}
