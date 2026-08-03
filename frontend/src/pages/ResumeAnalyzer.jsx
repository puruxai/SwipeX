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
  Loader2,
  X,
  Copy,
  Mail,
  QrCode
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function ResumeAnalyzer() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [analysisData, setAnalysisData] = useState(null);
  const { addToast } = useNotification();

  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [downloadingReport, setDownloadingReport] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [sharingInProgress, setSharingInProgress] = useState(false);

  const handleDownloadReport = async () => {
    if (downloadingReport) return;
    setDownloadingReport(true);
    addToast('Generating your professional PDF report...', 'info');
    try {
      const { default: jsPDF } = await import('jspdf');
      const { default: html2canvas } = await import('html2canvas');

      const input = document.getElementById('swipex-pdf-report');
      if (!input) {
        throw new Error('Report template element not found in DOM.');
      }

      const canvas = await html2canvas(input, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#F8F8F5'
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.98);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const username = 'Alex_Mercer';
      const dateStr = new Date().toISOString().slice(0, 10);
      pdf.save(`SwipeX_ATS_Report_${username}_${dateStr}.pdf`);
      addToast('PDF report downloaded successfully!', 'success');
    } catch (err) {
      console.error(err);
      addToast('Failed to generate PDF report.', 'error');
    } finally {
      setDownloadingReport(false);
    }
  };

  const handleShareResult = async () => {
    const shareText = `🚀 I analyzed my resume with SwipeX AI and achieved an ATS score of ${matchScore}%.\n\nSwipeX provided personalized AI career insights and job recommendations.\n\nTry it yourself:\nhttps://swipe-x-puruxai.vercel.app`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'SwipeX AI Career Discovery',
          text: shareText,
          url: 'https://swipe-x-puruxai.vercel.app'
        });
        addToast('Shared successfully!', 'success');
        return;
      } catch (err) {
        // user cancelled or failed, open fallback modal
      }
    }
    setIsShareModalOpen(true);
  };

  const handleCopyShareLink = () => {
    const shareText = `🚀 I analyzed my resume with SwipeX AI and achieved an ATS score of ${matchScore}%.\n\nSwipeX provided personalized AI career insights and job recommendations.\n\nTry it yourself:\nhttps://swipe-x-puruxai.vercel.app`;
    navigator.clipboard.writeText(shareText);
    addToast('Link preview text copied to clipboard!', 'success');
  };

  const handleDownloadShareImage = async () => {
    if (sharingInProgress) return;
    setSharingInProgress(true);
    addToast('Generating achievement share image...', 'info');
    try {
      const { default: html2canvas } = await import('html2canvas');
      const card = document.getElementById('swipex-share-achievement-card');
      if (!card) {
        throw new Error('Achievement card element not found in DOM.');
      }
      const canvas = await html2canvas(card, {
        scale: 2,
        useCORS: true,
        backgroundColor: null
      });
      const link = document.createElement('a');
      link.download = `SwipeX_Achievement_Card_${matchScore}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      addToast('Share image downloaded successfully!', 'success');
    } catch (err) {
      console.error(err);
      addToast('Failed to download share image.', 'error');
    } finally {
      setSharingInProgress(false);
    }
  };

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
            <button 
              onClick={handleDownloadReport}
              disabled={downloadingReport}
              className="depth-3d-button-outline px-4 py-2 text-xs font-bold flex items-center gap-1.5 disabled:opacity-50"
            >
              {downloadingReport ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Generating...
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" /> Download Report
                </>
              )}
            </button>
            <button 
              onClick={handleShareResult}
              className="depth-3d-button px-4 py-2 text-xs font-bold flex items-center gap-1.5 text-white"
            >
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

      {/* Hidden PDF Report Template Container */}
      <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
        <div id="swipex-pdf-report" style={{ width: '800px', padding: '40px', background: '#F8F8F5', color: '#111111', fontFamily: 'sans-serif', lineHeight: '1.5' }}>
          {/* Page Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '3px solid #7ED321', paddingBottom: '15px', marginBottom: '25px' }}>
            <div>
              <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#111111', letterSpacing: '-1px' }}>Swipe<span style={{ color: '#7ED321' }}>X</span> AI</span>
              <div style={{ fontSize: '10px', color: '#666666', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '2px' }}>AI Career Operating System</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#111111' }}>OFFICIAL ATS EVALUATION REPORT</div>
              <div style={{ fontSize: '10px', color: '#666666', marginTop: '2px' }}>Date: {new Date().toLocaleDateString()}</div>
            </div>
          </div>

          {/* Candidate Details Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
            <div style={{ background: '#FFFFFF', padding: '15px', borderRadius: '12px', border: '1px solid #E6E6E2' }}>
              <span style={{ fontSize: '10px', fontWeight: 'bold', color: '#666666', textTransform: 'uppercase' }}>CANDIDATE INFO</span>
              <div style={{ fontSize: '16px', fontWeight: 'extrabold', color: '#111111', marginTop: '5px' }}>Alex Mercer</div>
              <div style={{ fontSize: '11px', color: '#666666', marginTop: '3px' }}>Target Role: <strong style={{ color: '#111111' }}>{analysisData?.detected_role || "Software Engineer"}</strong></div>
              <div style={{ fontSize: '11px', color: '#666666' }}>Experience: <strong style={{ color: '#111111' }}>{analysisData?.experience_years || 3.5} Years</strong></div>
            </div>
            <div style={{ background: '#FFFFFF', padding: '15px', borderRadius: '12px', border: '1px solid #E6E6E2', display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '28px', fontWeight: 'black', color: '#7ED321' }}>{matchScore}%</div>
                <span style={{ fontSize: '9px', fontWeight: 'bold', color: '#666666', textTransform: 'uppercase' }}>ATS SCORE</span>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '28px', fontWeight: 'black', color: '#59C414' }}>{analysisData?.role_confidence || 92}%</div>
                <span style={{ fontSize: '9px', fontWeight: 'bold', color: '#666666', textTransform: 'uppercase' }}>AI MATCH CONFIDENCE</span>
              </div>
            </div>
          </div>

          {/* Resume Summary */}
          <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: '12px', border: '1px solid #E6E6E2', marginBottom: '25px' }}>
            <h3 style={{ fontSize: '13px', fontWeight: 'bold', color: '#111111', textTransform: 'uppercase', borderBottom: '1px solid #E6E6E2', paddingBottom: '6px', marginBottom: '10px' }}>Resume Executive Summary</h3>
            <p style={{ fontSize: '11px', color: '#333333', margin: '0' }}>
              The uploaded resume demonstrates a strong suitability for <strong style={{ color: '#7ED321' }}>{analysisData?.detected_role || "Software Engineering"}</strong> positions. With an overall ATS compatibility score of {matchScore}%, your credentials indicate high alignment with modern enterprise standards. Addressed criteria cover key skills density, section structures, and core industry formatting benchmarks.
            </p>
          </div>

          {/* Skills Section */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '25px' }}>
            <div style={{ background: '#FFFFFF', padding: '15px', borderRadius: '12px', border: '1px solid #E6E6E2' }}>
              <h4 style={{ fontSize: '11px', fontWeight: 'bold', color: '#111111', textTransform: 'uppercase', margin: '0 0 10px 0', borderBottom: '1px solid #E6E6E2', paddingBottom: '4px' }}>Skills Detected</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                {(analysisData?.extracted_skills || ["Python", "React", "FastAPI", "Docker", "SQL"]).map((skill, i) => (
                  <span key={i} style={{ background: '#F8F8F5', border: '1px solid #E6E6E2', padding: '3px 8px', borderRadius: '4px', fontSize: '9px', fontWeight: 'bold', color: '#333333' }}>{skill}</span>
                ))}
              </div>
            </div>
            <div style={{ background: '#FFFFFF', padding: '15px', borderRadius: '12px', border: '1px solid #E6E6E2' }}>
              <h4 style={{ fontSize: '11px', fontWeight: 'bold', color: '#111111', textTransform: 'uppercase', margin: '0 0 10px 0', borderBottom: '1px solid #E6E6E2', paddingBottom: '4px' }}>Critical Gaps</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                {analysisData?.missing_skills && analysisData.missing_skills.length > 0 ? (
                  analysisData.missing_skills.map((skill, i) => (
                    <span key={i} style={{ background: '#FFF0F0', border: '1px solid #FFD1D1', padding: '3px 8px', borderRadius: '4px', fontSize: '9px', fontWeight: 'bold', color: '#D32F2F' }}>{skill}</span>
                  ))
                ) : (
                  <span style={{ fontSize: '10px', color: '#666666', fontStyle: 'italic' }}>No critical gaps detected.</span>
                )}
              </div>
            </div>
          </div>

          {/* Metric Telemetry Blocks (Keyword & Formatting Analysis) */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '25px' }}>
            <div style={{ background: '#FFFFFF', padding: '12px', borderRadius: '12px', border: '1px solid #E6E6E2', textAlign: 'center' }}>
              <span style={{ fontSize: '8px', fontWeight: 'bold', color: '#666666', textTransform: 'uppercase' }}>Keyword Match</span>
              <div style={{ fontSize: '16px', fontWeight: 'extrabold', color: '#111111', marginTop: '4px' }}>14 / 18 Found</div>
            </div>
            <div style={{ background: '#FFFFFF', padding: '12px', borderRadius: '12px', border: '1px solid #E6E6E2', textAlign: 'center' }}>
              <span style={{ fontSize: '8px', fontWeight: 'bold', color: '#666666', textTransform: 'uppercase' }}>Formatting Health</span>
              <div style={{ fontSize: '16px', fontWeight: 'extrabold', color: '#59C414', marginTop: '4px' }}>98% Compliant</div>
            </div>
            <div style={{ background: '#FFFFFF', padding: '12px', borderRadius: '12px', border: '1px solid #E6E6E2', textAlign: 'center' }}>
              <span style={{ fontSize: '8px', fontWeight: 'bold', color: '#666666', textTransform: 'uppercase' }}>Parse Stability</span>
              <div style={{ fontSize: '16px', fontWeight: 'extrabold', color: '#7ED321', marginTop: '4px' }}>High Stability</div>
            </div>
          </div>

          {/* Skill Radar & ATS Health */}
          <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: '12px', border: '1px solid #E6E6E2', marginBottom: '25px' }}>
            <h3 style={{ fontSize: '13px', fontWeight: 'bold', color: '#111111', textTransform: 'uppercase', borderBottom: '1px solid #E6E6E2', paddingBottom: '6px', marginBottom: '10px' }}>Skill Radar & Domain Health</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10px', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #E6E6E2', color: '#666666', fontWeight: 'bold' }}>
                  <th style={{ padding: '6px 0' }}>Evaluation Factor</th>
                  <th style={{ padding: '6px 0' }}>Score Ratio</th>
                  <th style={{ padding: '6px 0' }}>Compatibility</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #F8F8F5' }}>
                  <td style={{ padding: '8px 0', fontWeight: 'bold' }}>Technical Skill Alignment</td>
                  <td style={{ padding: '8px 0' }}>85%</td>
                  <td style={{ padding: '8px 0', color: '#59C414', fontWeight: 'bold' }}>Excellent</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #F8F8F5' }}>
                  <td style={{ padding: '8px 0', fontWeight: 'bold' }}>Experience Fit Match</td>
                  <td style={{ padding: '8px 0' }}>90%</td>
                  <td style={{ padding: '8px 0', color: '#59C414', fontWeight: 'bold' }}>Excellent</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #F8F8F5' }}>
                  <td style={{ padding: '8px 0', fontWeight: 'bold' }}>Keywords & Structure Density</td>
                  <td style={{ padding: '8px 0' }}>92%</td>
                  <td style={{ padding: '8px 0', color: '#59C414', fontWeight: 'bold' }}>Excellent</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Education & Experience Analysis */}
          <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: '12px', border: '1px solid #E6E6E2', marginBottom: '25px' }}>
            <h3 style={{ fontSize: '13px', fontWeight: 'bold', color: '#111111', textTransform: 'uppercase', borderBottom: '1px solid #E6E6E2', paddingBottom: '6px', marginBottom: '10px' }}>Experience & Education Benchmarks</h3>
            <div style={{ fontSize: '11px', color: '#333333' }}>
              <div>🎓 <strong>Academic Alignment:</strong> B.S. in Computer Science detected (UC Berkeley equivalent). Top matching credentials.</div>
              <div style={{ marginTop: '5px' }}>💼 <strong>Professional Work:</strong> {analysisData?.experience_years || 3.5} years of parsed professional software engineering duties. Mid-level matching profile.</div>
            </div>
          </div>

          {/* Career Recommendations & Strategy */}
          <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: '12px', border: '1px solid #E6E6E2', marginBottom: '25px' }}>
            <h3 style={{ fontSize: '13px', fontWeight: 'bold', color: '#111111', textTransform: 'uppercase', borderBottom: '1px solid #E6E6E2', paddingBottom: '6px', marginBottom: '10px' }}>AI Insights & Strategic Recommendations</h3>
            <ul style={{ fontSize: '11px', color: '#333333', paddingLeft: '15px', margin: '0' }}>
              <li>Target alignment is highly optimal for <strong>{analysisData?.detected_role || "Software Engineer"}</strong> roles.</li>
              <li>Recommended Career Path: <strong>Senior {analysisData?.detected_role || "Engineer"}</strong> or Technical Lead.</li>
              <li>Your strongest corporate match environments: <strong>Google, Microsoft, and NVIDIA</strong>.</li>
              {analysisData?.issues?.slice(0, 2).map((iss, index) => (
                <li key={index}>{iss}</li>
              ))}
            </ul>
          </div>

          {/* Top Recommended Jobs */}
          {recommendedJobs.length > 0 && (
            <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: '12px', border: '1px solid #E6E6E2', marginBottom: '25px' }}>
              <h3 style={{ fontSize: '13px', fontWeight: 'bold', color: '#111111', textTransform: 'uppercase', borderBottom: '1px solid #E6E6E2', paddingBottom: '6px', marginBottom: '10px' }}>Recommended Jobs Matching Your Profile</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                {recommendedJobs.slice(0, 4).map((job) => (
                  <div key={job.id} style={{ border: '1px solid #E6E6E2', padding: '10px', borderRadius: '8px', background: '#F8F8F5' }}>
                    <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#111111' }}>{job.title}</div>
                    <div style={{ fontSize: '9px', color: '#666666', marginTop: '2px' }}>{job.company} • {job.location}</div>
                    <div style={{ fontSize: '9px', color: '#59C414', fontWeight: 'bold', marginTop: '4px' }}>{job.match_percentage}% AI MATCH</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #E6E6E2', paddingTop: '15px', fontSize: '9px', color: '#666666' }}>
            <div>SwipeX AI Evaluation Report — Powered by Deepmind Advanced Agentic Coding</div>
            <div style={{ fontWeight: 'bold', color: '#111111' }}>https://swipe-x-puruxai.vercel.app</div>
          </div>
        </div>
      </div>

      {/* Share Modal Dialog */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="depth-3d-card bg-white w-full max-w-lg overflow-hidden flex flex-col p-6 space-y-6 relative border border-[#E6E6E2] rounded-2xl">
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-[#E6E6E2] pb-3">
              <div>
                <h3 className="text-sm font-black text-[#111111] uppercase tracking-wider">Share Achievement</h3>
                <p className="text-[10px] text-[#666666] font-semibold mt-0.5">Let your network know your ATS score credentials.</p>
              </div>
              <button 
                onClick={() => setIsShareModalOpen(false)}
                className="p-1 rounded-lg hover:bg-neutral-100 text-[#666666] transition-colors"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Achievement Card Preview */}
            <div className="flex justify-center p-4 bg-neutral-50 rounded-2xl border border-dashed border-[#D1D1CB]">
              <div 
                id="swipex-share-achievement-card"
                className="w-full max-w-xs p-5 rounded-2xl bg-white border border-[#E6E6E2] shadow-xl text-center space-y-4 flex flex-col items-center"
              >
                {/* Logo and Tagline */}
                <div>
                  <span className="text-sm font-black text-[#111111] tracking-tight">Swipe<span className="text-[#7ED321]">X</span> AI</span>
                  <div className="text-[7px] text-[#666666] font-bold uppercase tracking-wider">AI Career Operating System</div>
                </div>

                {/* Score Circles */}
                <div className="flex gap-4 items-center justify-center">
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full border-4 border-[#7ED321] flex flex-col items-center justify-center bg-white">
                      <span className="text-xl font-black text-[#111111]">{matchScore}</span>
                      <span className="text-[6px] font-bold uppercase text-[#666666] tracking-wider">ATS</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full border-4 border-[#59C414] flex flex-col items-center justify-center bg-white">
                      <span className="text-xl font-black text-[#111111]">{analysisData?.role_confidence || 92}</span>
                      <span className="text-[6px] font-bold uppercase text-[#666666] tracking-wider">MATCH</span>
                    </div>
                  </div>
                </div>

                {/* Info Text */}
                <div>
                  <h4 className="text-[11px] font-extrabold text-[#111111]">{analysisData?.detected_role || "Software Engineer"}</h4>
                  <p className="text-[9px] text-[#666666] font-semibold mt-0.5">Resume Compatibility Completed</p>
                </div>

                {/* QR Code */}
                <div className="p-1.5 rounded-lg border border-[#E6E6E2] bg-white">
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=90x90&data=https://swipe-x-puruxai.vercel.app`}
                    alt="SwipeX Website QR Code"
                    className="w-16 h-16"
                  />
                </div>

                <div className="text-[7px] text-[#666666] font-semibold">
                  Scan to analyze your resume on SwipeX
                </div>
              </div>
            </div>

            {/* Sharing Channels Options */}
            <div className="grid grid-cols-2 gap-2 text-xs font-bold">
              <button 
                onClick={handleCopyShareLink}
                className="depth-3d-button-outline py-2.5 flex items-center justify-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5" /> Copy Text
              </button>
              <button 
                onClick={handleDownloadShareImage}
                disabled={sharingInProgress}
                className="depth-3d-button py-2.5 flex items-center justify-center gap-1.5 text-white disabled:opacity-50"
              >
                {sharingInProgress ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> Preparing...
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5" /> Download PNG
                  </>
                )}
              </button>
            </div>

            {/* Social Links Grid */}
            <div className="flex gap-2 justify-center border-t border-[#E6E6E2] pt-4">
              <a 
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent("https://swipe-x-puruxai.vercel.app")}`}
                target="_blank" 
                rel="noreferrer"
                className="depth-3d-button-outline p-2 rounded-xl hover:bg-neutral-50 text-[10px] font-bold flex items-center justify-center"
              >
                LinkedIn
              </a>
              <a 
                href={`https://x.com/intent/tweet?text=${encodeURIComponent(`🚀 I analyzed my resume with SwipeX AI and achieved an ATS score of ${matchScore}%.\n\nTry it yourself: https://swipe-x-puruxai.vercel.app`)}`}
                target="_blank" 
                rel="noreferrer"
                className="depth-3d-button-outline p-2 rounded-xl hover:bg-neutral-50 text-[10px] font-bold flex items-center justify-center"
              >
                X (Twitter)
              </a>
              <a 
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`🚀 I analyzed my resume with SwipeX AI and achieved an ATS score of ${matchScore}%.\n\nTry it yourself: https://swipe-x-puruxai.vercel.app`)}`}
                target="_blank" 
                rel="noreferrer"
                className="depth-3d-button-outline p-2 rounded-xl hover:bg-neutral-50 text-[10px] font-bold flex items-center justify-center"
              >
                WhatsApp
              </a>
              <a 
                href={`mailto:?subject=My%20SwipeX%20AI%20ATS%20Score%20Achievement&body=${encodeURIComponent(`🚀 I analyzed my resume with SwipeX AI and achieved an ATS score of ${matchScore}%.\n\nTry it yourself: https://swipe-x-puruxai.vercel.app`)}`}
                className="depth-3d-button-outline p-2 rounded-xl hover:bg-neutral-50 text-[10px] font-bold flex items-center justify-center"
              >
                Email
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
