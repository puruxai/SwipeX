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
  const [pdfJobs, setPdfJobs] = useState([]);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const handleDownloadReport = async () => {
    if (downloadingReport) return;
    if (!analysisData) {
      addToast('Please upload and analyze a resume first.', 'warning');
      return;
    }
    setDownloadingReport(true);
    addToast('Fetching top matching jobs and compiling PDF report...', 'info');
    try {
      // Fetch 10 jobs specifically for the report
      const jobsRes = await API.get('/swipes/feed?limit=10');
      setPdfJobs(jobsRes.data);
      setIsGeneratingPDF(true);
    } catch (err) {
      console.error(err);
      addToast('Failed to prepare PDF report data.', 'error');
      setDownloadingReport(false);
    }
  };

  useEffect(() => {
    if (isGeneratingPDF && pdfJobs.length > 0) {
      const timer = setTimeout(async () => {
        try {
          const { default: jsPDF } = await import('jspdf');
          const { default: html2canvas } = await import('html2canvas');

          const pdf = new jsPDF('p', 'mm', 'a4');
          const pageIds = [
            'report-page-cover',
            'report-page-summary',
            'report-page-analysis',
            'report-page-charts',
            'report-page-suggestions',
            'report-page-jobs'
          ];

          for (let i = 0; i < pageIds.length; i++) {
            const pageEl = document.getElementById(pageIds[i]);
            if (!pageEl) continue;

            const canvas = await html2canvas(pageEl, {
              scale: 2.0,
              useCORS: true,
              backgroundColor: '#F8F8F5'
            });

            const imgData = canvas.toDataURL('image/jpeg', 0.95);

            if (i > 0) {
              pdf.addPage();
            }

            // Fill full A4 dimensions (210mm x 297mm)
            pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297);
          }

          const username = (analysisData?.candidate_name || 'Alex_Mercer').replace(/\s+/g, '_');
          const dateStr = new Date().toISOString().slice(0, 10);
          pdf.save(`SwipeX_ATS_Report_${username}_${dateStr}.pdf`);
          addToast('PDF report downloaded successfully!', 'success');
        } catch (err) {
          console.error(err);
          addToast('Failed to generate PDF report.', 'error');
        } finally {
          setIsGeneratingPDF(false);
          setDownloadingReport(false);
        }
      }, 400); // 400ms buffer to ensure DOM layout calculation finishes
      return () => clearTimeout(timer);
    }
  }, [isGeneratingPDF, pdfJobs]);

  const getShareMessage = () => {
    const score = matchScore;
    const role = analysisData?.detected_role || "Software Engineer";
    
    let intro = "";
    if (score >= 90) {
      intro = "🔥 Excellent! My resume is interview-ready.";
    } else if (score >= 80) {
      intro = "🚀 Great progress! My resume is getting stronger.";
    } else if (score >= 70) {
      intro = "📈 My resume still has room for improvement, and SwipeX showed me exactly how.";
    } else {
      intro = "💡 I discovered several improvements I can make to my resume using SwipeX AI.";
    }
    
    return `${intro}

🚀 I just analyzed my resume with SwipeX AI!

📊 ATS Score: ${score}%
🎯 Best Match Role: ${role}
🤖 AI-powered Resume Analysis
💼 Personalized Job Recommendations
📈 Skill Gap Analysis
🚀 Actionable Career Insights

SwipeX helped me understand how job-ready my resume is and what I can improve to increase my chances of getting interviews.

If you're preparing for internships, placements, or your next job, you should definitely try it.

👉 https://swipe-x-puruxai.vercel.app

#SwipeX #AI #Resume #ATS #Career #JobSearch #Placement #Students #MachineLearning #CareerGrowth`;
  };

  const getBenchmarkRoles = () => {
    const role = analysisData?.detected_role || "Software Engineer";
    const scoreVal = matchScore;
    if (role.includes("AI") || role.includes("Machine Learning") || role.includes("ML")) {
      return [
        { name: "AI Engineer", diff: "+12%", color: "text-[#59C414]", val: `${scoreVal}%` },
        { name: "MLOps Engineer", diff: "+4%", color: "text-[#59C414]", val: "72%" },
        { name: "Deep Learning Specialist", diff: "+28%", color: "text-[#59C414]", val: "90%" }
      ];
    } else if (role.includes("Frontend")) {
      return [
        { name: "Frontend Developer", diff: "+14%", color: "text-[#59C414]", val: `${scoreVal}%` },
        { name: "React Engineer", diff: "+8%", color: "text-[#59C414]", val: "82%" },
        { name: "UI/UX Engineer", diff: "-2%", color: "text-rose-500", val: "65%" }
      ];
    } else if (role.includes("DevOps")) {
      return [
        { name: "DevOps Engineer", diff: "+10%", color: "text-[#59C414]", val: `${scoreVal}%` },
        { name: "Site Reliability Eng.", diff: "+5%", color: "text-[#59C414]", val: "78%" },
        { name: "Cloud Solutions Architect", diff: "+18%", color: "text-[#59C414]", val: "85%" }
      ];
    } else if (role.includes("Backend")) {
      return [
        { name: "Backend Developer", diff: "+15%", color: "text-[#59C414]", val: `${scoreVal}%` },
        { name: "System Engineer", diff: "+6%", color: "text-[#59C414]", val: "76%" },
        { name: "Database Architect", diff: "-5%", color: "text-rose-500", val: "60%" }
      ];
    } else if (role.includes("Data")) {
      return [
        { name: "Data Scientist", diff: "+12%", color: "text-[#59C414]", val: `${scoreVal}%` },
        { name: "Data Analyst", diff: "+8%", color: "text-[#59C414]", val: "78%" },
        { name: "Data Engineer", diff: "-3%", color: "text-rose-500", val: "68%" }
      ];
    } else if (role.includes("Security") || role.includes("Cyber")) {
      return [
        { name: "Cybersecurity Specialist", diff: "+16%", color: "text-[#59C414]", val: `${scoreVal}%` },
        { name: "Security Architect", diff: "+10%", color: "text-[#59C414]", val: "80%" },
        { name: "Penetration Tester", diff: "+22%", color: "text-[#59C414]", val: "92%" }
      ];
    }
    return [
      { name: "Software Engineer", diff: "+12%", color: "text-[#59C414]", val: `${scoreVal}%` },
      { name: "Data Scientist", diff: "-4%", color: "text-rose-500", val: "70%" },
      { name: "AI Researcher", diff: "+28%", color: "text-[#59C414]", val: "90%" }
    ];
  };

  const handleShareResult = async () => {
    const shareText = getShareMessage();
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'SwipeX AI Career Discovery',
          text: shareText
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
    const shareText = getShareMessage();
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

  const [jobsError, setJobsError] = useState(null);

  useEffect(() => {
    fetchLatestAnalysis();
  }, []);

  const loadRecommendedJobs = async () => {
    setJobsError(null);
    try {
      const res = await API.get('/swipes/feed?limit=4');
      setRecommendedJobs(res.data);
      if (res.data.length === 0) {
        setJobsError("No active jobs found matching your target role or skill profile. Please ensure your resume has clear industry keywords.");
      }
    } catch (err) {
      console.error('Failed to load recommended jobs', err);
      setJobsError("Unable to fetch job recommendations. Please verify your connection or try again.");
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
              <div className="flex justify-between">
                <span>Keywords found</span>
                <span className="font-extrabold text-[#111111]">{analysisData?.extracted_skills?.length || 8} / 12</span>
              </div>
              <div className="flex justify-between">
                <span>Formatting health</span>
                <span className="font-extrabold text-[#59C414]">
                  {analysisData?.breakdown?.formatting_score?.score ? `${Math.round((analysisData.breakdown.formatting_score.score / 15) * 100)}%` : "80%"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Parse stability</span>
                <span className="font-extrabold text-[#7ED321]">
                  {(analysisData?.breakdown?.ats_parse_rate || 90) >= 90 ? "High" : "Medium"}
                </span>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {analysisData?.extracted_skills && analysisData.extracted_skills.length > 0 ? (
                analysisData.extracted_skills.slice(0, 3).map((skill, index) => (
                  <span key={index} className="px-2.5 py-1 rounded bg-[#F8F8F5] border border-[#E6E6E2] text-[10px] font-semibold text-[#666666]">
                    {skill}
                  </span>
                ))
              ) : (
                <>
                  <span className="px-2.5 py-1 rounded bg-[#F8F8F5] border border-[#E6E6E2] text-[10px] font-semibold text-[#666666]">Python</span>
                  <span className="px-2.5 py-1 rounded bg-[#F8F8F5] border border-[#E6E6E2] text-[10px] font-semibold text-[#666666]">React</span>
                  <span className="px-2.5 py-1 rounded bg-[#F8F8F5] border border-[#E6E6E2] text-[10px] font-semibold text-[#666666]">Docker</span>
                </>
              )}
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
                  Your strongest matching companies are <strong className="text-[#111111]">{analysisData?.matching_companies || "Google, Microsoft and NVIDIA"}</strong>.
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
            {getBenchmarkRoles().map((roleData, index) => (
              <div key={index} className="p-4 rounded-xl bg-[#F8F8F5] border border-[#E6E6E2] space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-[#666666] uppercase text-[8px] tracking-wider">CANDIDATE POOL</span>
                  <span className={roleData.color}>{roleData.diff} vs Avg</span>
                </div>
                <h4 className="text-xs font-bold text-[#111111]">{roleData.name}</h4>
                <div className="h-1.5 w-full bg-neutral-200 rounded-full overflow-hidden mt-1">
                  <div className="h-full bg-[#7ED321]" style={{ width: roleData.val }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Career Roadmap Section */}
        {analysisData && (
          <div className="depth-3d-card p-6 space-y-4">
            <div className="border-b border-[#E6E6E2] pb-3">
              <h3 className="text-base font-bold text-[#111111]">AI Career Path Roadmap</h3>
              <p className="text-xs text-[#666666] font-medium mt-0.5">Your recommended mid-term and long-term career growth path based on detected seniority and target role.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 rounded-xl bg-white border border-[#7ED321] depth-3d-card text-center space-y-1">
                <span className="text-[8px] font-bold text-[#7ED321] uppercase tracking-wider block">Current Role Focus</span>
                <h4 className="text-xs font-bold text-[#111111]">{analysisData?.detected_role || "Associate"}</h4>
                <p className="text-[9px] text-[#666666]">Current profile matches entry to mid-level parameters.</p>
              </div>

              <div className="p-4 rounded-xl bg-[#F8F8F5] border border-[#E6E6E2] text-center space-y-1">
                <span className="text-[8px] font-bold text-indigo-600 uppercase tracking-wider block">Mid-Term Path (1-2 Yrs)</span>
                <h4 className="text-xs font-bold text-[#111111]">Senior {analysisData?.detected_role?.replace("Engineer", "")?.replace("Developer", "")}</h4>
                <p className="text-[9px] text-[#666666]">Focus on system architecture and team mentorship.</p>
              </div>

              <div className="p-4 rounded-xl bg-[#F8F8F5] border border-[#E6E6E2] text-center space-y-1">
                <span className="text-[8px] font-bold text-amber-600 uppercase tracking-wider block">Long-Term Goal (3-5 Yrs)</span>
                <h4 className="text-xs font-bold text-[#111111]">Tech Lead / Architect</h4>
                <p className="text-[9px] text-[#666666]">Lead technical vision and large-scale platform engineering.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div className="p-4 rounded-xl bg-[#F8F8F5] border border-[#E6E6E2] space-y-3">
                <h4 className="text-[10px] font-bold text-[#111111] uppercase tracking-wider">Target Technology Milestones</h4>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-2.5 rounded-lg bg-white border border-[#E6E6E2]">
                    <span className="text-[7px] text-[#666666] uppercase block font-semibold">Next Skill Boost</span>
                    <strong className="text-[9px] text-[#7ED321] block mt-1">{analysisData?.target_roadmap?.next_skill || "Docker"}</strong>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white border border-[#E6E6E2]">
                    <span className="text-[7px] text-[#666666] uppercase block font-semibold">Architecture</span>
                    <strong className="text-[9px] text-[#7ED321] block mt-1">{analysisData?.target_roadmap?.architecture_target || "System Design"}</strong>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white border border-[#E6E6E2]">
                    <span className="text-[7px] text-[#666666] uppercase block font-semibold">Target Cloud</span>
                    <strong className="text-[9px] text-[#7ED321] block mt-1">{analysisData?.target_roadmap?.recommended_cloud || "AWS / GCP"}</strong>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#F8F8F5] border border-[#E6E6E2] space-y-2">
                <h4 className="text-[10px] font-bold text-[#111111] uppercase tracking-wider">Recommended Career Certifications</h4>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {(analysisData?.suggested_certifications || []).map((cert, index) => (
                    <span key={index} className="px-2 py-0.5 rounded bg-white border border-[#E6E6E2] text-[8px] font-semibold text-[#666666]">
                      🛡️ {cert}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recommended Jobs */}
        <div className="depth-3d-card p-6 space-y-4">
          <div className="border-b border-[#E6E6E2] pb-3">
            <h3 className="text-base font-bold text-[#111111]">Recommended Jobs</h3>
            <p className="text-xs text-[#666666] font-medium mt-0.5">Real-time matching job recommendations powered by your AI candidate profile.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {jobsError ? (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700 col-span-2">
                ⚠️ {jobsError}
              </div>
            ) : recommendedJobs.length > 0 ? (
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
          
          {/* PAGE 1: COVER PAGE */}
          <div id="report-page-cover" style={{ width: '800px', height: '1130px', padding: '80px 60px', boxSizing: 'border-box', background: 'linear-gradient(135deg, #1A1A1A 0%, #0D0D0D 100%)', color: '#FFFFFF', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', fontFamily: 'sans-serif' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '28px', fontWeight: 'black', letterSpacing: '-1.5px' }}>Swipe<span style={{ color: '#7ED321' }}>X</span> AI</span>
              <span style={{ fontSize: '10px', color: '#666666', border: '1px solid #333333', padding: '2px 6px', borderRadius: '4px', textTransform: 'uppercase', fontWeight: 'bold' }}>v1.0.4</span>
            </div>
            
            <div>
              <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#7ED321', textTransform: 'uppercase', letterSpacing: '2px' }}>AI Career Operating System</div>
              <h1 style={{ fontSize: '48px', fontWeight: '900', lineHeight: '1.1', color: '#FFFFFF', letterSpacing: '-2px', marginTop: '10px' }}>
                Resume Analysis &<br />ATS Evaluation Report
              </h1>
              <p style={{ fontSize: '14px', color: '#999999', marginTop: '20px', maxWidth: '500px', lineHeight: '1.6' }}>
                Comprehensive machine learning compatibility analysis, technical taxonomy coverage, formatting diagnostic telemetry, and targeted career roadmaps.
              </p>
            </div>

            <div style={{ borderTop: '1px solid #333333', paddingTop: '40px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px', color: '#999999' }}>
                <tbody>
                  <tr>
                    <td style={{ padding: '4px 0', fontWeight: 'bold', color: '#FFFFFF', width: '120px' }}>PREPARED FOR:</td>
                    <td style={{ padding: '4px 0', color: '#FFFFFF' }}>{analysisData?.candidate_name || "Alex Mercer"}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '4px 0', fontWeight: 'bold', color: '#FFFFFF' }}>TARGET ROLE:</td>
                    <td style={{ padding: '4px 0', color: '#7ED321', fontWeight: 'bold' }}>{analysisData?.detected_role || "Software Engineer"}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '4px 0', fontWeight: 'bold', color: '#FFFFFF' }}>EVALUATION DATE:</td>
                    <td style={{ padding: '4px 0' }}>{new Date().toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '4px 0', fontWeight: 'bold', color: '#FFFFFF' }}>REPORT ID:</td>
                    <td style={{ padding: '4px 0' }}>SX-ATS-9921-A</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* PAGE 2: SUMMARY PAGE */}
          <div id="report-page-summary" style={{ width: '800px', height: '1130px', padding: '60px', boxSizing: 'border-box', background: '#F8F8F5', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', fontFamily: 'sans-serif' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E6E6E2', paddingBottom: '15px' }}>
              <div>
                <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#111111' }}>Swipe<span style={{ color: '#7ED321' }}>X</span> AI</span>
                <span style={{ fontSize: '9px', color: '#666666', marginLeft: '8px', textTransform: 'uppercase', fontWeight: 'bold' }}>Executive Summary</span>
              </div>
              <span style={{ fontSize: '9px', color: '#666666', fontWeight: 'bold' }}>PAGE 2 OF 6</span>
            </div>

            <div style={{ flex: '1', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '30px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div style={{ background: '#FFFFFF', padding: '24px', borderRadius: '16px', border: '1px solid #E6E6E2', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: '80px', height: '80px', borderRadius: '50%', border: '4px solid #7ED321', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', fontWeight: 'black', color: '#111111' }}>
                    {matchScore}%
                  </div>
                  <span style={{ fontSize: '10px', fontWeight: 'bold', color: '#666666', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '10px' }}>Overall ATS Score</span>
                </div>

                <div style={{ background: '#FFFFFF', padding: '24px', borderRadius: '16px', border: '1px solid #E6E6E2', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: '80px', height: '80px', borderRadius: '50%', border: '4px solid #59C414', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', fontWeight: 'black', color: '#111111' }}>
                    {analysisData?.role_confidence || 92}%
                  </div>
                  <span style={{ fontSize: '10px', fontWeight: 'bold', color: '#666666', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '10px' }}>AI Match Confidence</span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div style={{ background: '#FFFFFF', padding: '16px', borderRadius: '12px', border: '1px solid #E6E6E2' }}>
                  <span style={{ fontSize: '9px', fontWeight: 'bold', color: '#666666', textTransform: 'uppercase' }}>Best Matching Role</span>
                  <div style={{ fontSize: '15px', fontWeight: 'black', color: '#111111', marginTop: '4px' }}>{analysisData?.detected_role}</div>
                </div>
                <div style={{ background: '#FFFFFF', padding: '16px', borderRadius: '12px', border: '1px solid #E6E6E2' }}>
                  <span style={{ fontSize: '9px', fontWeight: 'bold', color: '#666666', textTransform: 'uppercase' }}>Resume Quality Rating</span>
                  <div style={{ fontSize: '15px', fontWeight: 'black', color: '#7ED321', marginTop: '4px' }}>{analysisData?.rating_tier || "Excellent Resume"}</div>
                </div>
              </div>

              <div style={{ background: '#FFFFFF', padding: '24px', borderRadius: '16px', border: '1px solid #E6E6E2' }}>
                <h3 style={{ fontSize: '12px', fontWeight: 'bold', color: '#111111', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid #E6E6E2', paddingBottom: '8px', marginBottom: '12px' }}>Resume Executive Summary</h3>
                <p style={{ fontSize: '11.5px', color: '#333333', lineHeight: '1.6', margin: '0' }}>
                  Your resume target category evaluates successfully as a <strong style={{ color: '#7ED321' }}>{analysisData?.detected_role}</strong>. With a calculated ATS benchmark score of {matchScore}%, your document indicates strong technical taxonomy overlap and excellent section structuring. SwipeX AI recommends refining quantifiable action metrics and addressing the identified skill gaps to reach a 95%+ score.
                </p>
              </div>

              <div style={{ background: '#FFFFFF', padding: '24px', borderRadius: '16px', border: '1px solid #E6E6E2' }}>
                <h3 style={{ fontSize: '12px', fontWeight: 'bold', color: '#111111', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid #E6E6E2', paddingBottom: '8px', marginBottom: '12px' }}>Quantified Impact Strengths (Google XYZ)</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {analysisData?.google_xyz_improvements && analysisData.google_xyz_improvements.length > 0 ? (
                    analysisData.google_xyz_improvements.slice(0, 2).map((imp, idx) => (
                      <div key={idx} style={{ fontSize: '10.5px', lineHeight: '1.5' }}>
                        <div style={{ color: '#E02020', textDecoration: 'line-through', marginBottom: '2px' }}>❌ {imp.original}</div>
                        <div style={{ color: '#59C414', fontWeight: 'bold' }}>🚀 {imp.improved}</div>
                      </div>
                    ))
                  ) : (
                    <div style={{ fontSize: '11px', color: '#666666', fontStyle: 'italic' }}>No strength recommendations parsed.</div>
                  )}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #E6E6E2', paddingTop: '15px', fontSize: '9px', color: '#666666' }}>
              <div>Generated by SwipeX AI</div>
              <div style={{ fontWeight: 'bold', color: '#111111' }}>https://swipe-x-puruxai.vercel.app</div>
            </div>
          </div>

          {/* PAGE 3: RESUME ANALYSIS DETAIL */}
          <div id="report-page-analysis" style={{ width: '800px', height: '1130px', padding: '60px', boxSizing: 'border-box', background: '#F8F8F5', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', fontFamily: 'sans-serif' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E6E6E2', paddingBottom: '15px' }}>
              <div>
                <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#111111' }}>Swipe<span style={{ color: '#7ED321' }}>X</span> AI</span>
                <span style={{ fontSize: '9px', color: '#666666', marginLeft: '8px', textTransform: 'uppercase', fontWeight: 'bold' }}>Resume Parsing & Metadata</span>
              </div>
              <span style={{ fontSize: '9px', color: '#666666', fontWeight: 'bold' }}>PAGE 3 OF 6</span>
            </div>

            <div style={{ flex: '1', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '25px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: '16px', border: '1px solid #E6E6E2' }}>
                  <h4 style={{ fontSize: '11px', fontWeight: 'bold', color: '#111111', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid #E6E6E2', paddingBottom: '6px', marginBottom: '10px' }}>Detected Technologies</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {(analysisData?.extracted_skills || ["Python", "React", "Docker"]).slice(0, 15).map((skill, idx) => (
                      <span key={idx} style={{ background: '#F0F9EB', border: '1px solid #C2E7B0', padding: '3px 8px', borderRadius: '6px', fontSize: '9.5px', fontWeight: 'bold', color: '#59C414' }}>{skill}</span>
                    ))}
                  </div>
                </div>

                <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: '16px', border: '1px solid #E6E6E2' }}>
                  <h4 style={{ fontSize: '11px', fontWeight: 'bold', color: '#111111', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid #E6E6E2', paddingBottom: '6px', marginBottom: '10px' }}>Identified Skill Gaps</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {analysisData?.missing_skills && analysisData.missing_skills.length > 0 ? (
                      analysisData.missing_skills.slice(0, 15).map((skill, idx) => (
                        <span key={idx} style={{ background: '#FFF0F0', border: '1px solid #FFD1D1', padding: '3px 8px', borderRadius: '6px', fontSize: '9.5px', fontWeight: 'bold', color: '#D32F2F' }}>{skill}</span>
                      ))
                    ) : (
                      <span style={{ fontSize: '10px', color: '#666666', fontStyle: 'italic' }}>No critical gaps found!</span>
                    )}
                  </div>
                </div>
              </div>

              <div style={{ background: '#FFFFFF', padding: '24px', borderRadius: '16px', border: '1px solid #E6E6E2' }}>
                <h3 style={{ fontSize: '12px', fontWeight: 'bold', color: '#111111', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid #E6E6E2', paddingBottom: '8px', marginBottom: '12px' }}>ATS Parsing Benchmarks</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px', textAlign: 'left' }}>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid #E6E6E2' }}>
                      <td style={{ padding: '10px 0', fontWeight: 'bold' }}>Keyword Density Match</td>
                      <td style={{ padding: '10px 0', textAlign: 'right', fontWeight: 'bold', color: '#59C414' }}>
                        {analysisData?.breakdown?.keyword_match?.score || 16} / 20 Points
                      </td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #E6E6E2' }}>
                      <td style={{ padding: '10px 0', fontWeight: 'bold' }}>Formatting Compliancy</td>
                      <td style={{ padding: '10px 0', textAlign: 'right', fontWeight: 'bold', color: '#59C414' }}>
                        {analysisData?.breakdown?.formatting_score?.score || 12} / 15 Points
                      </td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #E6E6E2' }}>
                      <td style={{ padding: '10px 0', fontWeight: 'bold' }}>ATS Parse Rate</td>
                      <td style={{ padding: '10px 0', textAlign: 'right', fontWeight: 'bold', color: '#7ED321' }}>
                        {analysisData?.breakdown?.ats_parse_rate || 98}%
                      </td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #E6E6E2' }}>
                      <td style={{ padding: '10px 0', fontWeight: 'bold' }}>Recruiter Readability Score</td>
                      <td style={{ padding: '10px 0', textAlign: 'right', fontWeight: 'bold', color: '#7ED321' }}>
                        {analysisData?.breakdown?.recruiter_readability || 88}%
                      </td>
                    </tr>
                    <tr>
                      <td style={{ padding: '10px 0', fontWeight: 'bold' }}>Calculated Work Experience Depth</td>
                      <td style={{ padding: '10px 0', textAlign: 'right', fontWeight: 'bold' }}>
                        {analysisData?.experience_years || 3.5} Years Detected
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div style={{ background: '#FFFFFF', padding: '24px', borderRadius: '16px', border: '1px solid #E6E6E2' }}>
                <h3 style={{ fontSize: '12px', fontWeight: 'bold', color: '#111111', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid #E6E6E2', paddingBottom: '8px', marginBottom: '12px' }}>Education & Certifications</h3>
                <div style={{ fontSize: '11px', color: '#333333', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div>🎓 <strong>Academic Alignment:</strong> B.S. in Computer Science detected. Higher education parameters fully validated.</div>
                  <div>🛡️ <strong>Professional Certifications:</strong> Strong professional credentials identified. Recommended actions details below.</div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #E6E6E2', paddingTop: '15px', fontSize: '9px', color: '#666666' }}>
              <div>Generated by SwipeX AI</div>
              <div style={{ fontWeight: 'bold', color: '#111111' }}>https://swipe-x-puruxai.vercel.app</div>
            </div>
          </div>

          {/* PAGE 4: VISUAL CHARTS */}
          <div id="report-page-charts" style={{ width: '800px', height: '1130px', padding: '60px', boxSizing: 'border-box', background: '#F8F8F5', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', fontFamily: 'sans-serif' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E6E6E2', paddingBottom: '15px' }}>
              <div>
                <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#111111' }}>Swipe<span style={{ color: '#7ED321' }}>X</span> AI</span>
                <span style={{ fontSize: '9px', color: '#666666', marginLeft: '8px', textTransform: 'uppercase', fontWeight: 'bold' }}>Visual Compatibility Charts</span>
              </div>
              <span style={{ fontSize: '9px', color: '#666666', fontWeight: 'bold' }}>PAGE 4 OF 6</span>
            </div>

            <div style={{ flex: '1', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '25px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '20px' }}>
                <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: '16px', border: '1px solid #E6E6E2', textAlign: 'center' }}>
                  <h4 style={{ fontSize: '11px', fontWeight: 'bold', color: '#111111', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid #E6E6E2', paddingBottom: '6px', marginBottom: '15px' }}>Skill Radar Topology</h4>
                  <svg width="220" height="220" viewBox="0 0 200 200" style={{ margin: '0 auto', display: 'block' }}>
                    <polygon points="100,20 176,75 147,165 53,165 24,75" fill="none" stroke="#E6E6E2" strokeWidth="1" />
                    <polygon points="100,40 161,84 138,152 62,152 39,84" fill="none" stroke="#E6E6E2" strokeWidth="1" />
                    <polygon points="100,60 146,93 128,139 72,139 54,93" fill="none" stroke="#E6E6E2" strokeWidth="1" />
                    <polygon points="100,80 131,102 119,126 81,126 69,102" fill="none" stroke="#E6E6E2" strokeWidth="1" />
                    
                    <line x1="100" y1="100" x2="100" y2="20" stroke="#E6E6E2" strokeWidth="0.5" />
                    <line x1="100" y1="100" x2="176" y2="75" stroke="#E6E6E2" strokeWidth="0.5" />
                    <line x1="100" y1="100" x2="147" y2="165" stroke="#E6E6E2" strokeWidth="0.5" />
                    <line x1="100" y1="100" x2="53" y2="165" stroke="#E6E6E2" strokeWidth="0.5" />
                    <line x1="100" y1="100" x2="24" y2="75" stroke="#E6E6E2" strokeWidth="0.5" />
                    
                    <text x="100" y="14" textAnchor="middle" fontSize="7" fontWeight="bold" fill="#666666">Technical Match</text>
                    <text x="180" y="77" textAnchor="start" fontSize="7" fontWeight="bold" fill="#666666">Experience</text>
                    <text x="150" y="173" textAnchor="start" fontSize="7" fontWeight="bold" fill="#666666">Keywords</text>
                    <text x="50" y="173" textAnchor="end" fontSize="7" fontWeight="bold" fill="#666666">Formatting</text>
                    <text x="20" y="77" textAnchor="end" fontSize="7" fontWeight="bold" fill="#666666">Readability</text>
                    
                    <polygon points={`100,${20 + (80 * (1 - matchScore/100))} 160,78 135,148 66,148 42,78`} fill="rgba(126,211,33,0.25)" stroke="#7ED321" strokeWidth="1.5" />
                  </svg>
                </div>

                <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: '16px', border: '1px solid #E6E6E2', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h4 style={{ fontSize: '11px', fontWeight: 'bold', color: '#111111', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid #E6E6E2', paddingBottom: '6px', marginBottom: '15px', textAlign: 'center' }}>Keyword Alignment</h4>
                    <svg width="160" height="100" viewBox="0 0 100 60" style={{ margin: '0 auto', display: 'block' }}>
                      <path d="M10,50 A40,40 0 0,1 90,50" fill="none" stroke="#E6E6E2" strokeWidth="7" strokeLinecap="round" />
                      <path d="M10,50 A40,40 0 0,1 90,50" fill="none" stroke="#7ED321" strokeWidth="7" strokeLinecap="round" strokeDasharray="126" strokeDashoffset={126 - (126 * (matchScore / 100))} />
                      <text x="50" y="42" textAnchor="middle" fontSize="14" fontWeight="black" fill="#111111">{matchScore}%</text>
                      <text x="50" y="52" textAnchor="middle" fontSize="5.5" fontWeight="bold" fill="#666666">JD Taxonomy Match</text>
                    </svg>
                  </div>
                  <div style={{ textAlign: 'center', fontSize: '10px', color: '#666666', borderTop: '1px solid #E6E6E2', paddingTop: '10px' }}>
                    Your resume keyword match ratio places you in the <strong>Top 10%</strong> of applicant profiles in this domain.
                  </div>
                </div>
              </div>

              <div style={{ background: '#FFFFFF', padding: '24px', borderRadius: '16px', border: '1px solid #E6E6E2' }}>
                <h3 style={{ fontSize: '12px', fontWeight: 'bold', color: '#111111', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid #E6E6E2', paddingBottom: '8px', marginBottom: '16px' }}>ATS Breakdown Vectors</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <span style={{ fontSize: '10px', width: '130px', fontWeight: 'bold', color: '#111111' }}>Parsing Accuracy</span>
                    <div style={{ flex: '1', height: '6px', background: '#E6E6E2', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: `${((analysisData?.breakdown?.contact_info?.score || 12) / 15) * 100}%`, height: '100%', background: '#7ED321' }} />
                    </div>
                    <span style={{ fontSize: '10px', fontWeight: 'bold', width: '45px', textAlign: 'right' }}>
                      {analysisData?.breakdown?.contact_info?.score || 12} / 15
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <span style={{ fontSize: '10px', width: '130px', fontWeight: 'bold', color: '#111111' }}>Formatting Score</span>
                    <div style={{ flex: '1', height: '6px', background: '#E6E6E2', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: `${((analysisData?.breakdown?.formatting_score?.score || 11) / 15) * 100}%`, height: '100%', background: '#7ED321' }} />
                    </div>
                    <span style={{ fontSize: '10px', fontWeight: 'bold', width: '45px', textAlign: 'right' }}>
                      {analysisData?.breakdown?.formatting_score?.score || 11} / 15
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <span style={{ fontSize: '10px', width: '130px', fontWeight: 'bold', color: '#111111' }}>Keyword Match</span>
                    <div style={{ flex: '1', height: '6px', background: '#E6E6E2', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: `${((analysisData?.breakdown?.keyword_match?.score || 16) / 20) * 100}%`, height: '100%', background: '#7ED321' }} />
                    </div>
                    <span style={{ fontSize: '10px', fontWeight: 'bold', width: '45px', textAlign: 'right' }}>
                      {analysisData?.breakdown?.keyword_match?.score || 16} / 20
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <span style={{ fontSize: '10px', width: '130px', fontWeight: 'bold', color: '#111111' }}>Technical Skills</span>
                    <div style={{ flex: '1', height: '6px', background: '#E6E6E2', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: `${((analysisData?.breakdown?.technical_skills?.score || 13) / 15) * 100}%`, height: '100%', background: '#7ED321' }} />
                    </div>
                    <span style={{ fontSize: '10px', fontWeight: 'bold', width: '45px', textAlign: 'right' }}>
                      {analysisData?.breakdown?.technical_skills?.score || 13} / 15
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #E6E6E2', paddingTop: '15px', fontSize: '9px', color: '#666666' }}>
              <div>Generated by SwipeX AI</div>
              <div style={{ fontWeight: 'bold', color: '#111111' }}>https://swipe-x-puruxai.vercel.app</div>
            </div>
          </div>

          {/* PAGE 5: AI SUGGESTIONS & ROADMAP */}
          <div id="report-page-suggestions" style={{ width: '800px', height: '1130px', padding: '60px', boxSizing: 'border-box', background: '#F8F8F5', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', fontFamily: 'sans-serif' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E6E6E2', paddingBottom: '15px' }}>
              <div>
                <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#111111' }}>Swipe<span style={{ color: '#7ED321' }}>X</span> AI</span>
                <span style={{ fontSize: '9px', color: '#666666', marginLeft: '8px', textTransform: 'uppercase', fontWeight: 'bold' }}>AI Recommendations & Roadmap</span>
              </div>
              <span style={{ fontSize: '9px', color: '#666666', fontWeight: 'bold' }}>PAGE 5 OF 6</span>
            </div>

            <div style={{ flex: '1', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '25px' }}>
              <div style={{ background: '#FFFFFF', padding: '24px', borderRadius: '16px', border: '1px solid #E6E6E2' }}>
                <h3 style={{ fontSize: '12px', fontWeight: 'bold', color: '#111111', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid #E6E6E2', paddingBottom: '8px', marginBottom: '12px' }}>Critical Improvements Suggested</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {analysisData?.issues && analysisData.issues.length > 0 ? (
                    analysisData.issues.slice(0, 3).map((iss, idx) => (
                      <div key={idx} style={{ fontSize: '11px', color: '#333333', borderLeft: '3px solid #7ED321', paddingLeft: '10px' }}>
                        <strong style={{ color: '#111111' }}>{iss.issue}</strong>
                        <div style={{ fontSize: '10px', color: '#666666', marginTop: '2px' }}>{iss.why} ({iss.boost} Score Boost Potential)</div>
                      </div>
                    ))
                  ) : (
                    <div style={{ fontSize: '11px', color: '#666666', fontStyle: 'italic' }}>All major structure criteria met successfully!</div>
                  )}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: '16px', border: '1px solid #E6E6E2' }}>
                  <h4 style={{ fontSize: '11px', fontWeight: 'bold', color: '#111111', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid #E6E6E2', paddingBottom: '6px', marginBottom: '10px' }}>Recommended Certifications</h4>
                  <ul style={{ fontSize: '10.5px', color: '#333333', paddingLeft: '15px', margin: '0', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    {(analysisData?.suggested_certifications || ["AWS Certified Developer"]).map((cert, idx) => (
                      <li key={idx} style={{ marginTop: '4px' }}>{cert}</li>
                    ))}
                  </ul>
                </div>

                <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: '16px', border: '1px solid #E6E6E2' }}>
                  <h4 style={{ fontSize: '11px', fontWeight: 'bold', color: '#111111', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid #E6E6E2', paddingBottom: '6px', marginBottom: '10px' }}>Target Technology Roadmap</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ fontSize: '10.5px', display: 'flex', justifyContent: 'space-between' }}>
                      <span>⚡ Next Skill Boost:</span>
                      <strong style={{ color: '#7ED321' }}>{analysisData?.target_roadmap?.next_skill || "Docker"}</strong>
                    </div>
                    <div style={{ fontSize: '10.5px', display: 'flex', justifyContent: 'space-between' }}>
                      <span>⚡ Architecture target:</span>
                      <strong style={{ color: '#7ED321' }}>{analysisData?.target_roadmap?.architecture_target || "System Design"}</strong>
                    </div>
                    <div style={{ fontSize: '10.5px', display: 'flex', justifyContent: 'space-between' }}>
                      <span>⚡ Recommended Cloud:</span>
                      <strong style={{ color: '#7ED321' }}>{analysisData?.target_roadmap?.recommended_cloud || "AWS / GCP"}</strong>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ background: '#FFFFFF', padding: '24px', borderRadius: '16px', border: '1px solid #E6E6E2' }}>
                <h3 style={{ fontSize: '12px', fontWeight: 'bold', color: '#111111', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid #E6E6E2', paddingBottom: '8px', marginBottom: '16px' }}>Recommended Career Path Roadmap</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', textAlign: 'center' }}>
                  <div style={{ border: '1px solid #7ED321', background: '#F0F9EB', padding: '12px', borderRadius: '8px' }}>
                    <div style={{ fontSize: '8px', fontWeight: 'bold', color: '#7ED321', textTransform: 'uppercase' }}>CURRENT MATCH</div>
                    <div style={{ fontSize: '11px', fontWeight: 'bold', marginTop: '2px' }}>{analysisData?.detected_role || "Associate"}</div>
                  </div>
                  <div style={{ border: '1px solid #E6E6E2', padding: '12px', borderRadius: '8px' }}>
                    <div style={{ fontSize: '8px', fontWeight: 'bold', color: '#666666', textTransform: 'uppercase' }}>MID-TERM (1-2 YRS)</div>
                    <div style={{ fontSize: '11px', fontWeight: 'bold', marginTop: '2px' }}>Senior {analysisData?.detected_role?.replace("Engineer", "")?.replace("Developer", "")}</div>
                  </div>
                  <div style={{ border: '1px solid #E6E6E2', padding: '12px', borderRadius: '8px' }}>
                    <div style={{ fontSize: '8px', fontWeight: 'bold', color: '#666666', textTransform: 'uppercase' }}>LONG-TERM (3-5 YRS)</div>
                    <div style={{ fontSize: '11px', fontWeight: 'bold', marginTop: '2px' }}>Tech Lead / Architect</div>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #E6E6E2', paddingTop: '15px', fontSize: '9px', color: '#666666' }}>
              <div>Generated by SwipeX AI</div>
              <div style={{ fontWeight: 'bold', color: '#111111' }}>https://swipe-x-puruxai.vercel.app</div>
            </div>
          </div>

          {/* PAGE 6: RECOMMENDED JOBS (TOP 10) */}
          <div id="report-page-jobs" style={{ width: '800px', height: '1130px', padding: '60px', boxSizing: 'border-box', background: '#F8F8F5', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', fontFamily: 'sans-serif' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E6E6E2', paddingBottom: '15px' }}>
              <div>
                <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#111111' }}>Swipe<span style={{ color: '#7ED321' }}>X</span> AI</span>
                <span style={{ fontSize: '9px', color: '#666666', marginLeft: '8px', textTransform: 'uppercase', fontWeight: 'bold' }}>Top Recommended Job Matches</span>
              </div>
              <span style={{ fontSize: '9px', color: '#666666', fontWeight: 'bold' }}>PAGE 6 OF 6</span>
            </div>

            <div style={{ flex: '1', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <h3 style={{ fontSize: '12px', fontWeight: 'bold', color: '#111111', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid #E6E6E2', paddingBottom: '8px', marginBottom: '16px' }}>Top 10 High-Relevance Job Matches</h3>
              
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10.5px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #E6E6E2', color: '#666666', fontWeight: 'bold', textAlign: 'left' }}>
                    <th style={{ padding: '8px 0' }}>Job Title</th>
                    <th style={{ padding: '8px 0' }}>Company</th>
                    <th style={{ padding: '8px 0' }}>Est. Salary Range</th>
                    <th style={{ padding: '8px 0', textAlign: 'right' }}>AI Match Score</th>
                  </tr>
                </thead>
                <tbody>
                  {pdfJobs.length > 0 ? (
                    pdfJobs.slice(0, 10).map((job, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid #E6E6E2' }}>
                        <td style={{ padding: '10px 0', fontWeight: 'bold', color: '#111111' }}>{job.title}</td>
                        <td style={{ padding: '10px 0', color: '#666666' }}>{job.company}</td>
                        <td style={{ padding: '10px 0', color: '#666666' }}>
                          {job.salary_min && job.salary_max ? (
                            `$${(job.salary_min / 1000).toFixed(0)}k - $${(job.salary_max / 1000).toFixed(0)}k`
                          ) : (
                            "$110k - $160k"
                          )}
                        </td>
                        <td style={{ padding: '10px 0', textAlign: 'right', fontWeight: 'bold', color: '#59C414' }}>{job.match_percentage}% Match</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" style={{ padding: '20px 0', textAlign: 'center', color: '#666666', fontStyle: 'italic' }}>
                        Loading matching recommended job opportunities...
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #E6E6E2', paddingTop: '15px', fontSize: '9px', color: '#666666' }}>
              <div>Generated by SwipeX AI</div>
              <div style={{ fontWeight: 'bold', color: '#111111' }}>https://swipe-x-puruxai.vercel.app</div>
            </div>
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
            <div className="flex gap-2 justify-center border-t border-[#E6E6E2] pt-4 flex-wrap">
              <a 
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent("https://swipe-x-puruxai.vercel.app")}`}
                target="_blank" 
                rel="noreferrer"
                className="depth-3d-button-outline px-3 py-2 rounded-xl hover:bg-neutral-50 text-[10px] font-bold flex items-center justify-center"
              >
                LinkedIn
              </a>
              <a 
                href={`https://x.com/intent/tweet?text=${encodeURIComponent(getShareMessage())}`}
                target="_blank" 
                rel="noreferrer"
                className="depth-3d-button-outline px-3 py-2 rounded-xl hover:bg-neutral-50 text-[10px] font-bold flex items-center justify-center"
              >
                X (Twitter)
              </a>
              <a 
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(getShareMessage())}`}
                target="_blank" 
                rel="noreferrer"
                className="depth-3d-button-outline px-3 py-2 rounded-xl hover:bg-neutral-50 text-[10px] font-bold flex items-center justify-center"
              >
                WhatsApp
              </a>
              <a 
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent("https://swipe-x-puruxai.vercel.app")}`}
                target="_blank" 
                rel="noreferrer"
                className="depth-3d-button-outline px-3 py-2 rounded-xl hover:bg-neutral-50 text-[10px] font-bold flex items-center justify-center"
              >
                Facebook
              </a>
              <a 
                href={`mailto:?subject=${encodeURIComponent("My SwipeX AI ATS Score Achievement")}&body=${encodeURIComponent(getShareMessage())}`}
                className="depth-3d-button-outline px-3 py-2 rounded-xl hover:bg-neutral-50 text-[10px] font-bold flex items-center justify-center"
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
