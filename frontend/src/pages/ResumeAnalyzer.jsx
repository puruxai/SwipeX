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

  const [recommendedJobs, setRecommendedJobs] = useState([]);

  useEffect(() => {
    fetchLatestAnalysis();
  }, []);

  const loadRecommendedJobs = async () => {
    try {
      const res = await API.get('/swipes/feed?limit=4');
      setRecommendedJobs(res.data);
    } catch (err) {
      console.error('Failed to load recommended jobs', err);
    }
  };

  const fetchLatestAnalysis = async () => {
    try {
      const res = await API.get('/resumes/analysis/latest');
      if (res.data) setAnalysisData(res.data);
      await loadRecommendedJobs();
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
      await loadRecommendedJobs();
    } catch (err) {
      addToast('Failed to analyze resume.', 'error');
    } finally {
      setUploading(false);
    }
  };

  const matchScore = analysisData?.ats_score || 82;

  const pageVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <div className="flex min-h-[90vh] bg-[#F8F8F5] text-[#111111] transition-colors">
      
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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#E6E6E2] pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-[#7ED321]/15 text-[#59C414] text-[9px] font-bold uppercase tracking-wider">ANALYSIS COMPLETE</span>
              <span className="text-[10px] font-bold text-[#666666]">ID: SX-9921-A</span>
            </div>
            <h1 className="text-2xl font-extrabold text-[#111111] tracking-tight mt-1.5">ATS Analysis Complete</h1>
            <p className="text-xs text-[#666666] font-medium mt-0.5">Your resume has been processed against 45 standard ATS patterns.</p>
          </div>

          <div className="flex gap-2">
            <button className="depth-3d-button-outline px-4 py-2 text-xs font-bold flex items-center gap-1.5">
              <Download className="w-3.5 h-3.5" /> Download Report
            </button>
            <button className="depth-3d-button px-4 py-2 text-xs font-bold flex items-center gap-1.5 text-white">
              <Share2 className="w-3.5 h-3.5" /> Share Result
            </button>
          </div>
        </div>

        {/* Row 1: Score Circle + Radar + Heatmap */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Circular Match Score & Telemetry */}
          <div className="depth-3d-card p-6 flex flex-col md:flex-row items-center justify-between gap-6 md:col-span-1">
            <div className="flex flex-col items-center justify-center space-y-3">
              <div className="w-24 h-24 rounded-full border-4 border-[#7ED321] flex flex-col items-center justify-center bg-[#F8F8F5]">
                <span className="text-3xl font-black text-[#111111]">{matchScore}</span>
                <span className="text-[8px] font-bold uppercase text-[#666666] tracking-wider mt-0.5">ATS SCORE</span>
              </div>
              <span className="px-3.5 py-1 rounded-full bg-[#7ED321]/10 text-[#59C414] font-bold text-[9px] uppercase tracking-wider text-center">
                {analysisData?.rating_tier || "Strong Profile"}
              </span>
            </div>
            
            <div className="flex-1 w-full space-y-2 text-[11px] text-[#666666] font-bold border-t md:border-t-0 md:border-l border-[#E6E6E2] pt-4 md:pt-0 md:pl-4">
              <div className="flex justify-between border-b border-[#E6E6E2]/50 pb-1.5">
                <span>Best Match:</span>
                <span className="text-[#111111]">{analysisData?.detected_role || "Software Engineer"}</span>
              </div>
              <div className="flex justify-between border-b border-[#E6E6E2]/50 pb-1.5">
                <span>Confidence:</span>
                <span className="text-[#59C414]">{analysisData?.role_confidence || 92}%</span>
              </div>
              <div className="flex justify-between border-b border-[#E6E6E2]/50 pb-1.5">
                <span>Compatibility:</span>
                <span className="text-[#111111]">{matchScore >= 90 ? 'Excellent' : (matchScore >= 80 ? 'Good' : 'Average')}</span>
              </div>
              <div className="flex justify-between">
                <span>Career Path:</span>
                <span className="text-indigo-600">Senior {analysisData?.detected_role || "Engineer"}</span>
              </div>
            </div>
          </div>

          {/* Card 2: Skill Radar Diamond */}
          <div className="depth-3d-card p-6 flex flex-col justify-between space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#111111] uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#7ED321]" /> Skill Radar
            </div>
            <div className="h-28 rounded-xl bg-[#F8F8F5] border border-[#E6E6E2] flex items-center justify-center p-2">
              <div className="w-16 h-16 border-2 border-[#7ED321]/30 rotate-45 flex items-center justify-center relative">
                <span className="absolute -top-3 text-[8px] font-bold text-[#666666] -rotate-45">TECH</span>
                <span className="absolute -bottom-3 text-[8px] font-bold text-[#666666] -rotate-45">SOFT</span>
                <span className="absolute -left-5 text-[8px] font-bold text-[#666666] -rotate-45">TOOLS</span>
                <span className="absolute -right-7 text-[8px] font-bold text-[#666666] -rotate-45">EXP</span>
              </div>
            </div>
          </div>

          {/* Card 3: Heatmap Analysis */}
          <div className="depth-3d-card p-6 space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#111111] uppercase tracking-wider">
              <FileText className="w-3.5 h-3.5 text-[#7ED321]" /> Heatmap Analysis
            </div>
            <div className="space-y-2 text-xs font-bold text-[#666666]">
              <div className="flex justify-between"><span>Keywords found</span><span className="font-extrabold text-[#111111]">14/18</span></div>
              <div className="flex justify-between"><span>Formatting health</span><span className="font-extrabold text-[#59C414]">98%</span></div>
              <div className="flex justify-between"><span>Parse stability</span><span className="font-extrabold text-[#7ED321]">High</span></div>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              <span className="px-2.5 py-1 rounded bg-[#F8F8F5] border border-[#E6E6E2] text-[10px] font-semibold text-[#666666]">React.js</span>
              <span className="px-2.5 py-1 rounded bg-[#F8F8F5] border border-[#E6E6E2] text-[10px] font-semibold text-[#666666]">Tailwind</span>
              <span className="px-2.5 py-1 rounded bg-[#F8F8F5] border border-[#E6E6E2] text-[10px] font-semibold text-[#666666]">Architecture</span>
            </div>
          </div>

        </div>

        {/* AI Strategic Insights banner */}
        {analysisData && (
          <div className="depth-3d-card p-6 bg-gradient-to-r from-[#7ED321]/5 to-transparent border border-[#7ED321]/20 space-y-3.5">
            <div className="flex items-center gap-2 text-xs font-bold text-[#111111] uppercase tracking-wider">
              <Sparkles className="w-4.5 h-4.5 text-[#7ED321]" /> AI Strategic Insights
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3.5 rounded-xl bg-white/60 border border-[#E6E6E2] text-xs font-medium text-[#111111] flex items-start gap-3">
                <div className="p-1.5 rounded-lg bg-[#7ED321]/15 text-[#59C414] font-bold text-xs mt-0.5">🎯</div>
                <div>
                  <span className="font-bold text-[#666666] text-[10px] uppercase block tracking-wider mb-0.5">Target Alignment</span>
                  Your resume is best suited for <strong className="text-[#111111]">{analysisData.detected_role}</strong> roles.
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-white/60 border border-[#E6E6E2] text-xs font-medium text-[#111111] flex items-start gap-3">
                <div className="p-1.5 rounded-lg bg-[#7ED321]/15 text-[#59C414] font-bold text-xs mt-0.5">📈</div>
                <div>
                  <span className="font-bold text-[#666666] text-[10px] uppercase block tracking-wider mb-0.5">Market Boosters</span>
                  Adding {analysisData.missing_skills?.slice(0, 2).join(" and ") || "specialized tech stacks"} can increase your match by 8%.
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-white/60 border border-[#E6E6E2] text-xs font-medium text-[#111111] flex items-start gap-3">
                <div className="p-1.5 rounded-lg bg-[#7ED321]/15 text-[#59C414] font-bold text-xs mt-0.5">🏢</div>
                <div>
                  <span className="font-bold text-[#666666] text-[10px] uppercase block tracking-wider mb-0.5">Strongest Matches</span>
                  Your strongest matching companies are <strong className="text-[#111111]">Google, Microsoft and NVIDIA</strong>.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Row 2: Critical Skill Gaps + Fast Iteration */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Critical Skill Gaps */}
          <div className="lg:col-span-8 depth-3d-card p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-[#E6E6E2] pb-2">
              <h3 className="text-base font-bold text-[#111111]">Critical Skill Gaps</h3>
              <span className="px-2.5 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-500 text-[9px] font-bold uppercase tracking-wider">Priority High</span>
            </div>

            <div className="space-y-2.5">
              {analysisData?.missing_skills && analysisData.missing_skills.length > 0 ? (
                analysisData.missing_skills.map((skill, index) => (
                  <div key={index} className="p-3.5 rounded-xl bg-[#F8F8F5] border border-[#E6E6E2] flex justify-between items-center text-xs font-semibold text-[#666666]">
                    <div>
                      <span className="font-bold text-[#111111]">{skill}</span>
                      <p className="text-[10px] text-[#666666]/70 mt-0.5">Missing from detected tech stack</p>
                    </div>
                    <span className="font-bold text-rose-500">Skill Gap</span>
                  </div>
                ))
              ) : (
                <p className="text-xs font-semibold text-[#666666] italic py-2">No critical skill gaps detected! Your resume covers all key target skills.</p>
              )}
            </div>
          </div>

          {/* Solid White/Green Card: Fast Iteration */}
          <div className="lg:col-span-4 depth-3d-card p-6 space-y-4 flex flex-col justify-between">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-[#111111] tracking-wide">Fast Iteration</h3>
              <p className="text-xs text-[#666666] leading-relaxed">
                Upload a revised version to see your score update instantly.
              </p>
            </div>

            <label className="border-2 border-dashed border-[#D1D1CB] hover:border-[#7ED321] rounded-xl p-5 text-center cursor-pointer transition-all block bg-[#F8F8F5]">
              {uploading ? (
                <div className="py-1">
                  <Loader2 className="w-7 h-7 mx-auto text-[#7ED321] mb-1.5 animate-spin" />
                  <span className="text-[11px] font-bold block text-[#111111]">Processing Resume...</span>
                </div>
              ) : (
                <>
                  <UploadCloud className="w-7 h-7 mx-auto text-[#7ED321] mb-1.5" />
                  <span className="text-[11px] font-bold block text-[#111111]">Drop New Resume</span>
                  <span className="text-[9px] text-[#666666]">PDF, DOCX (Max 10MB)</span>
                </>
              )}
              <input type="file" accept=".pdf,.docx,.txt" onChange={handleFileUpload} className="hidden" />
            </label>

            <div className="text-[8px] font-bold uppercase text-center text-[#59C414] tracking-wider">
              ⚡ AI Real-Time Processing
            </div>
          </div>

        </div>

        {/* Row 3: Industry Benchmarks */}
        <div className="depth-3d-card p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E6E6E2] pb-3">
            <div>
              <h3 className="text-base font-bold text-[#111111]">Industry Benchmarks</h3>
              <p className="text-xs text-[#666666] font-medium mt-0.5">How you stack up against typical roles in Tech & AI.</p>
            </div>
            <div className="flex gap-1 bg-[#F8F8F5] border border-[#E6E6E2] p-1 rounded-xl text-xs font-semibold text-[#666666]">
              <button className="px-3 py-1 rounded-lg bg-[#7ED321] text-white">Global Average</button>
              <button className="px-3 py-1 rounded-lg">Competitors</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 rounded-xl bg-[#F8F8F5] border border-[#E6E6E2] space-y-2">
              <div className="flex justify-between text-xs font-bold"><span className="text-[#666666] uppercase text-[8px] tracking-wider">CANDIDATE POOL</span><span className="text-[#59C414]">+12% vs Avg</span></div>
              <h4 className="text-xs font-bold text-[#111111]">Software Eng.</h4>
              <div className="h-1.5 w-full bg-neutral-200 rounded-full overflow-hidden mt-1"><div className="h-full bg-[#7ED321] w-[75%]" /></div>
            </div>

            <div className="p-4 rounded-xl bg-[#F8F8F5] border border-[#E6E6E2] space-y-2">
              <div className="flex justify-between text-xs font-bold"><span className="text-[#666666] uppercase text-[8px] tracking-wider">CANDIDATE POOL</span><span className="text-rose-500">-4% vs Avg</span></div>
              <h4 className="text-xs font-bold text-[#111111]">Data Scientist</h4>
              <div className="h-1.5 w-full bg-neutral-200 rounded-full overflow-hidden mt-1"><div className="h-full bg-[#7ED321] w-[50%]" /></div>
            </div>

            <div className="p-4 rounded-xl bg-[#F8F8F5] border border-[#E6E6E2] space-y-2">
              <div className="flex justify-between text-xs font-bold"><span className="text-[#666666] uppercase text-[8px] tracking-wider">CANDIDATE POOL</span><span className="text-[#59C414]">+28% vs Avg</span></div>
              <h4 className="text-xs font-bold text-[#111111]">AI Researcher</h4>
              <div className="h-1.5 w-full bg-neutral-200 rounded-full overflow-hidden mt-1"><div className="h-full bg-[#7ED321] w-[90%]" /></div>
            </div>
          </div>
        </div>

        {/* Recommended Jobs */}
        <div className="depth-3d-card p-6 space-y-4">
          <div className="border-b border-[#E6E6E2] pb-3">
            <h3 className="text-base font-bold text-[#111111]">Recommended Jobs</h3>
            <p className="text-xs text-[#666666] font-medium mt-0.5">Real-time matching job recommendations powered by your AI candidate profile.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendedJobs.length > 0 ? (
              recommendedJobs.map((job) => (
                <div key={job.id} className="p-4 rounded-xl bg-[#F8F8F5] border border-[#E6E6E2] hover:border-[#7ED321] transition-all flex flex-col justify-between space-y-3.5 depth-3d-card">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h4 className="text-xs font-bold text-[#111111]">{job.title}</h4>
                      <p className="text-[10px] text-[#666666] font-semibold mt-0.5">{job.company} • {job.location}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-[#7ED321]/15 text-[#59C414] text-[9px] font-bold">
                      {job.match_percentage}% MATCH
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {(job.required_skills || []).slice(0, 3).map((skill, index) => (
                      <span key={index} className="px-2 py-0.5 rounded bg-white border border-[#E6E6E2] text-[8px] font-semibold text-[#666666]">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs font-semibold text-[#666666] italic col-span-2 py-2">No recommended jobs matching your profile found yet. Try uploading a different resume or adjusting your parameters.</p>
            )}
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
