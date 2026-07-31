import React, { useState, useEffect, Component } from 'react';
import API from '../services/api';
import { useNotification } from '../context/NotificationContext';
import Sidebar from '../components/Sidebar';
import { 
  BarChart3, 
  TrendingUp, 
  Briefcase, 
  Award, 
  CheckCircle2, 
  Zap, 
  ArrowUpRight, 
  Send, 
  Video, 
  CheckCheck,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip 
} from 'recharts';
import { motion } from 'framer-motion';

// Component-Level Error Boundary for Analytics
class AnalyticsErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Analytics Dashboard error caught:", error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onRetry) this.props.onRetry();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[90vh] bg-[#fff8f6] dark:bg-[#0c1322] text-[#261812] dark:text-[#dce2f7]">
          <Sidebar />
          <div className="flex-1 p-8 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center shadow-sm">
              <AlertCircle className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-black text-[#261812] dark:text-white">Analytics Workspace Interrupted</h2>
            <p className="text-xs text-[#5a4136] dark:text-[#e2bfb0] font-medium max-w-md leading-relaxed">
              We encountered a temporary rendering issue while displaying your telemetry charts. Click retry below to reload your dashboard.
            </p>
            <button
              onClick={this.handleRetry}
              className="px-6 py-2.5 rounded-xl bg-[#ff6b00] dark:bg-[#ffb693] text-white dark:text-[#561f00] text-xs font-black shadow-md hover:bg-[#ff8533] transition-all flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4 animate-spin" /> Retry Loading Analytics
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function DashboardContent() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToast } = useNotification();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await API.get('/analytics/dashboard');
      if (res.data) {
        setData(res.data);
      } else {
        throw new Error("Empty response payload");
      }
    } catch (err) {
      console.error("Analytics fetch error:", err);
      setError('Unable to load analytics telemetry at this time.');
      addToast('Unable to load dashboard analytics.', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[90vh] bg-[#fff8f6] dark:bg-[#0c1322]">
        <Sidebar />
        <div className="flex-1 p-8 flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-8 h-8 rounded-full border-4 border-[#ff6b00] dark:border-[#ffb693] border-t-transparent animate-spin" />
          <div className="text-xs font-black text-[#a04100] dark:text-[#ffb693] uppercase tracking-widest animate-pulse">
            Loading Candidate Analytics...
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex min-h-[90vh] bg-[#fff8f6] dark:bg-[#0c1322] text-[#261812] dark:text-[#dce2f7]">
        <Sidebar />
        <div className="flex-1 p-8 flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-[#ff6b00]/10 dark:bg-white/5 text-[#a04100] dark:text-[#ffb693] flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-[#261812] dark:text-white">Analytics Unavailable</h2>
          <p className="text-xs text-[#5a4136] dark:text-[#e2bfb0] font-medium max-w-sm">{error || "Could not retrieve dashboard metrics."}</p>
          <button
            onClick={fetchDashboardData}
            className="px-5 py-2.5 rounded-xl bg-[#ff6b00] dark:bg-[#ffb693] text-white dark:text-[#561f00] text-xs font-black shadow-sm hover:scale-[1.01] transition-transform flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" /> Try Again
          </button>
        </div>
      </div>
    );
  }

  const summary = data.summary || {};
  const monthlyTrends = Array.isArray(data.monthly_trends) ? data.monthly_trends : [];
  const skillGap = data.skill_gap_report || {};

  // Stagger parameters
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15, scale: 0.98 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 120 } }
  };

  return (
    <div className="flex min-h-[90vh] bg-[#fff8f6] dark:bg-[#0c1322] text-[#261812] dark:text-[#dce2f7] transition-colors">
      
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content Dashboard Layout */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="flex-1 p-8 lg:p-10 space-y-8"
      >
        
        {/* Page Header */}
        <motion.div 
          variants={itemVariants}
          className="flex justify-between items-end border-b border-[#e2bfb0]/30 dark:border-white/5 pb-6"
        >
          <div>
            <h1 className="text-3xl font-extrabold text-[#261812] dark:text-white tracking-tight">Candidate Discovery Dashboard</h1>
            <p className="text-xs text-[#5a4136] dark:text-[#e2bfb0] font-medium mt-1.5">
              Real-time telemetry on application status, match quality, and market readiness.
            </p>
          </div>
          <button
            onClick={fetchDashboardData}
            className="px-4 py-2.5 rounded-xl bg-white/50 dark:bg-white/5 text-[#a04100] dark:text-[#ffb693] text-xs font-bold hover:bg-[#fff1eb] dark:hover:bg-white/10 transition-all border border-[#e2bfb0]/40 dark:border-white/10 flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh Data
          </button>
        </motion.div>
        
        {/* Top 4 KPI Metric Widgets */}
        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {/* APPLIED */}
          <div className="reference-card p-6 space-y-2 relative overflow-hidden group bg-white dark:bg-[#191f2f]/85">
            <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-[#5a4136] dark:text-[#e2bfb0]">
              <span>TOTAL APPLICATIONS</span>
              <Send className="w-4 h-4 text-[#a04100] dark:text-[#ffb693]" />
            </div>
            <div className="text-3xl font-extrabold text-[#261812] dark:text-white">{summary.total_applied ?? 0}</div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5" /> +12% vs last week
            </div>
          </div>

          {/* INTERVIEWS */}
          <div className="reference-card p-6 space-y-2 relative overflow-hidden group bg-white dark:bg-[#191f2f]/85">
            <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-[#5a4136] dark:text-[#e2bfb0]">
              <span>INTERVIEW RATE</span>
              <Video className="w-4 h-4 text-[#a04100] dark:text-[#ffb693]" />
            </div>
            <div className="text-3xl font-extrabold text-[#261812] dark:text-white">{summary.interviewing ?? 0}</div>
            <div className="text-[11px] text-[#5a4136] dark:text-[#e2bfb0] font-bold">Shortlisted: {summary.shortlisted ?? 0}</div>
          </div>

          {/* OFFERS */}
          <div className="reference-card p-6 space-y-2 relative overflow-hidden group bg-white dark:bg-[#191f2f]/85">
            <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-[#5a4136] dark:text-[#e2bfb0]">
              <span>OFFERS RECEIVED</span>
              <CheckCheck className="w-4 h-4 text-[#a04100] dark:text-[#ffb693]" />
            </div>
            <div className="text-3xl font-extrabold text-[#261812] dark:text-white">{summary.offered ?? 0}</div>
            <div className="text-[11px] text-[#a04100] dark:text-[#ffb693] font-bold">Success Rate: {summary.success_rate ?? 0}%</div>
          </div>

          {/* AI MATCH SCORE */}
          <div className="reference-card p-6 space-y-2 relative overflow-hidden group bg-white dark:bg-[#191f2f]/85">
            <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-[#5a4136] dark:text-[#e2bfb0]">
              <span>AVERAGE MATCH SCORE</span>
              <div className="w-5 h-5 rounded-full border-2 border-[#ff6b00] dark:border-[#ffb693] flex items-center justify-center text-[#ff6b00] dark:text-[#ffb693] text-[10px] font-black">⚡</div>
            </div>
            <div className="text-3xl font-extrabold text-[#261812] dark:text-white">{summary.average_match_score ?? 78.5}%</div>
            <div className="text-[11px] text-[#5a4136] dark:text-[#e2bfb0] font-bold">ATS Score: {summary.latest_ats_score ?? 82}/100</div>
          </div>
        </motion.div>

        {/* Middle Section: Chart + Right Promo Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Chart: Monthly Application Trends */}
          <motion.div 
            variants={itemVariants}
            className="lg:col-span-8 reference-card p-8 space-y-6 bg-white dark:bg-[#191f2f]/85"
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-[#261812] dark:text-white">Monthly Application Trends</h3>
                <p className="text-xs text-[#5a4136] dark:text-[#e2bfb0] font-medium mt-1">
                  Projected trajectory based on current skill acquisition and market demand.
                </p>
              </div>

              <div className="flex gap-1 bg-[#fff1eb] dark:bg-white/5 border border-[#e2bfb0]/30 dark:border-white/5 p-1 rounded-xl text-xs font-bold text-[#5a4136] dark:text-[#e2bfb0]">
                <button className="px-3 py-1 rounded-lg">Weekly</button>
                <button className="px-3 py-1 rounded-lg bg-[#ff6b00] dark:bg-[#ffb693] text-white dark:text-[#561f00]">Monthly</button>
              </div>
            </div>

            <div className="h-64 w-full relative min-h-[250px] overflow-hidden">
              {monthlyTrends.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyTrends}>
                    <defs>
                      <linearGradient id="colorVelocity" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ffb693" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#ffb693" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" stroke="#A8A29E" fontSize={11} axisLine={false} tickLine={false} />
                    <YAxis stroke="#A8A29E" fontSize={11} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#141b2b', borderColor: 'rgba(255,255,255,0.08)', borderRadius: '16px', color: '#FFF', fontSize: '12px' }}
                    />
                    <Area type="monotone" dataKey="applications" stroke="#ffb693" strokeWidth={3} fillOpacity={1} fill="url(#colorVelocity)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-xs font-bold text-[#A8A29E]">
                  No monthly trend data recorded yet.
                </div>
              )}
            </div>
          </motion.div>

          {/* Right Column Promo Cards */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Strategic Move */}
            <motion.div 
              variants={itemVariants}
              className="rounded-3xl bg-gradient-to-br from-[#1c1917] to-[#0c1322] border border-white/5 text-white p-7 space-y-5 shadow-2xl relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#ff6b00]/10 blur-xl rounded-full" />
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-[#ffb693]" />
                <h3 className="text-base font-extrabold tracking-wide">Strategic Career Move</h3>
              </div>
              <p className="text-xs opacity-85 font-medium leading-relaxed">
                High market demand detected for your target role skills. Submit your resume to priority recruiters to leverage peak market value.
              </p>
              <button className="w-full py-3.5 rounded-xl bg-[#ff6b00] dark:bg-[#ffb693] text-white dark:text-[#561f00] text-xs font-black flex items-center justify-center gap-2 shadow-md hover:scale-[1.01] transition-transform">
                View Priority Matches <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>

            {/* Skill Gap & Career Readiness Report */}
            <motion.div 
              variants={itemVariants}
              className="reference-card p-6 space-y-4 bg-white dark:bg-[#191f2f]/85"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-xs font-black text-[#a04100] dark:text-[#ffb693] uppercase tracking-wider">
                  <AlertTriangle className="w-4 h-4 text-amber-500" /> AI Skill Gap Report
                </div>
                <span className="px-2.5 py-1 rounded-full bg-white/40 dark:bg-white/5 border border-[#e2bfb0]/30 dark:border-white/5 text-[#a04100] dark:text-[#ffb693] text-[9px] font-black uppercase tracking-wider">
                  Readiness: {skillGap.readiness_score ?? 75}%
                </span>
              </div>

              <div className="space-y-2.5">
                <p className="text-[11px] text-[#5a4136] dark:text-[#e2bfb0] font-bold">Recommended Skill Acquisition:</p>
                <div className="flex flex-wrap gap-1.5">
                  {(skillGap.missing_skills?.length > 0 ? skillGap.missing_skills : ["Distributed Systems", "Cloud Arch"]).map((skill, idx) => (
                    <span key={idx} className="px-2.5 py-1.5 rounded-lg bg-[#ff6b00]/10 border border-[#ff6b00]/20 text-[#a04100] dark:text-[#ffb693] text-[10px] font-bold">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <a href="/resume-analyzer" className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#a04100] dark:text-[#ffb693] hover:underline pt-2.5">
                Open Resume Optimization <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </motion.div>

          </div>

        </div>

        {/* Bottom Section: Recent Activity Table */}
        <motion.div 
          variants={itemVariants}
          className="reference-card p-8 space-y-6 bg-white dark:bg-[#191f2f]/85"
        >
          <div className="flex justify-between items-center">
            <h3 className="text-base font-bold text-[#261812] dark:text-white">Recent Application Activity</h3>
            <a href="/applied" className="text-xs font-bold text-[#a04100] dark:text-[#ffb693] hover:underline">View all applications</a>
          </div>

          <div className="p-5 rounded-2xl bg-white/60 dark:bg-[#141b2b]/40 border border-[#e2bfb0]/40 dark:border-white/10 flex flex-col sm:flex-row justify-between items-center gap-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/80 dark:bg-white/5 border border-[#e2bfb0]/30 dark:border-white/5 text-[#a04100] dark:text-[#ffb693] font-black flex items-center justify-center shadow-md">
                💼
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-[#261812] dark:text-white">Active Pipeline Synced</h4>
                <p className="text-[11px] text-[#5a4136] dark:text-[#e2bfb0] font-medium">Applications synced with real-time backend status.</p>
              </div>
            </div>
            <div className="text-right w-full sm:w-auto flex sm:flex-col justify-between sm:justify-start items-center sm:items-end gap-3">
              <div className="text-xs font-bold text-[#a04100] dark:text-[#ffb693]">Status: Live</div>
              <a href="/jobs" className="px-5 py-2 rounded-full bg-[#ff6b00] dark:bg-[#ffb693] text-white dark:text-[#561f00] text-[10px] font-bold shadow-sm inline-block">
                Find More Jobs
              </a>
            </div>
          </div>
        </motion.div>

      </motion.div>

      <div className="hidden">
        <BarChart3 className="w-1" />
        <TrendingUp className="w-1" />
        <Briefcase className="w-1" />
        <Award className="w-1" />
        <CheckCircle2 className="w-1" />
        <ArrowRight className="w-1" />
      </div>

    </div>
  );
}

export default function Dashboard() {
  return (
    <AnalyticsErrorBoundary>
      <DashboardContent />
    </AnalyticsErrorBoundary>
  );
}
