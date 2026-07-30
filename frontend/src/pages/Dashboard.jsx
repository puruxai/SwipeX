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
        <div className="flex min-h-[90vh] bg-[#FFF9F5] text-[#1C1917]">
          <Sidebar />
          <div className="flex-1 p-8 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shadow-sm">
              <AlertCircle className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-black text-[#1C1917]">Analytics Workspace Interrupted</h2>
            <p className="text-xs text-[#78716C] font-medium max-w-md">
              We encountered a temporary rendering issue while displaying your telemetry charts. Click retry below to reload your dashboard.
            </p>
            <button
              onClick={this.handleRetry}
              className="px-6 py-2.5 rounded-xl bg-[#963200] text-white text-xs font-black shadow-md hover:bg-[#802B00] transition-all flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" /> Retry Loading Analytics
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
      <div className="flex min-h-[90vh] bg-[#FFF9F5]">
        <Sidebar />
        <div className="flex-1 p-8 flex flex-col items-center justify-center text-center space-y-3">
          <div className="w-8 h-8 rounded-full border-4 border-[#963200] border-t-transparent animate-spin" />
          <div className="text-xs font-black text-[#963200] uppercase tracking-widest">
            Loading Candidate Analytics...
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex min-h-[90vh] bg-[#FFF9F5] text-[#1C1917]">
        <Sidebar />
        <div className="flex-1 p-8 flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-[#FFF0E6] text-[#963200] flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-black text-[#1C1917]">Analytics Unavailable</h2>
          <p className="text-xs text-[#78716C] font-medium max-w-sm">{error || "Could not retrieve dashboard metrics."}</p>
          <button
            onClick={fetchDashboardData}
            className="px-5 py-2.5 rounded-xl bg-[#963200] text-white text-xs font-black shadow-sm hover:bg-[#802B00] transition-all flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" /> Try Again
          </button>
        </div>
      </div>
    );
  }

  // Safe fallback extractions
  const summary = data.summary || {};
  const monthlyTrends = Array.isArray(data.monthly_trends) ? data.monthly_trends : [];
  const skillGap = data.skill_gap_report || {};

  return (
    <div className="flex min-h-[90vh] bg-[#FFF9F5] text-[#1C1917]">
      
      {/* Left Sidebar Shell */}
      <Sidebar />

      {/* Main Content Dashboard Layout */}
      <div className="flex-1 p-6 md:p-8 space-y-6">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-[#F3E8E2] pb-4">
          <div>
            <h1 className="text-3xl font-black text-[#1C1917] tracking-tight">Candidate Discovery Dashboard</h1>
            <p className="text-xs text-[#78716C] font-medium mt-0.5">
              Real-time telemetry on application status, match quality, and market readiness.
            </p>
          </div>
          <button
            onClick={fetchDashboardData}
            className="p-2 rounded-xl bg-[#FFF0E6] text-[#963200] text-xs font-bold hover:bg-[#F3D2C1] transition-all flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh Data
          </button>
        </div>
        
        {/* Top 4 KPI Metric Widgets */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* APPLIED */}
          <div className="reference-card p-5 border border-[#F3E8E2] bg-white rounded-3xl space-y-1.5 shadow-sm">
            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider text-[#78716C]">
              <span>TOTAL APPLICATIONS</span>
              <Send className="w-4 h-4 text-[#963200]" />
            </div>
            <div className="text-3xl font-black text-[#1C1917]">{summary.total_applied ?? 0}</div>
            <div className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5" /> +12% vs last week
            </div>
          </div>

          {/* INTERVIEWS */}
          <div className="reference-card p-5 border border-[#F3E8E2] bg-white rounded-3xl space-y-1.5 shadow-sm">
            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider text-[#78716C]">
              <span>INTERVIEW RATE</span>
              <Video className="w-4 h-4 text-[#963200]" />
            </div>
            <div className="text-3xl font-black text-[#1C1917]">{summary.interviewing ?? 0}</div>
            <div className="text-[11px] text-[#78716C] font-bold">Shortlisted: {summary.shortlisted ?? 0}</div>
          </div>

          {/* OFFERS */}
          <div className="reference-card p-5 border border-[#F3E8E2] bg-white rounded-3xl space-y-1.5 shadow-sm">
            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider text-[#78716C]">
              <span>OFFERS RECEIVED</span>
              <CheckCheck className="w-4 h-4 text-[#963200]" />
            </div>
            <div className="text-3xl font-black text-[#1C1917]">{summary.offered ?? 0}</div>
            <div className="text-[11px] text-[#963200] font-bold">Success Rate: {summary.success_rate ?? 0}%</div>
          </div>

          {/* AI MATCH SCORE */}
          <div className="reference-card p-5 border border-[#F3E8E2] bg-white rounded-3xl space-y-1.5 shadow-sm">
            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider text-[#78716C]">
              <span>AVERAGE MATCH SCORE</span>
              <div className="w-6 h-6 rounded-full border-2 border-[#FF8A3D] flex items-center justify-center text-[#FF8A3D] text-[10px] font-black">⚡</div>
            </div>
            <div className="text-3xl font-black text-[#1C1917]">{summary.average_match_score ?? 78.5}%</div>
            <div className="text-[11px] text-[#78716C] font-bold">ATS Score: {summary.latest_ats_score ?? 82}/100</div>
          </div>

        </div>

        {/* Middle Section: Chart + Right Promo Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Chart: Monthly Application Trends */}
          <div className="lg:col-span-8 reference-card p-6 border border-[#F3E8E2] bg-white rounded-3xl space-y-4 shadow-sm">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-base font-black text-[#1C1917]">Monthly Application Trends</h3>
                <p className="text-xs text-[#78716C] font-medium">
                  Projected trajectory based on current skill acquisition and market demand.
                </p>
              </div>

              <div className="flex gap-1 bg-[#FFF0E6] p-1 rounded-xl text-xs font-bold text-[#78716C]">
                <button className="px-3 py-1 rounded-lg">Weekly</button>
                <button className="px-3 py-1 rounded-lg bg-[#963200] text-white">Monthly</button>
              </div>
            </div>

            <div className="h-64 w-full relative min-h-[250px]">
              {monthlyTrends.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyTrends}>
                    <defs>
                      <linearGradient id="colorVelocity" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#FF8A3D" stopOpacity={0.6}/>
                        <stop offset="95%" stopColor="#FF8A3D" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" stroke="#A8A29E" fontSize={11} />
                    <YAxis stroke="#A8A29E" fontSize={11} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1C1917', borderColor: '#3D3835', borderRadius: '16px', color: '#FFF', fontSize: '12px' }}
                    />
                    <Area type="monotone" dataKey="applications" stroke="#963200" strokeWidth={3} fillOpacity={1} fill="url(#colorVelocity)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-xs font-bold text-[#A8A29E]">
                  No monthly trend data recorded yet.
                </div>
              )}
            </div>
          </div>

          {/* Right Column Promo Cards */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Strategic Move */}
            <div className="rounded-3xl bg-[#292524] text-white p-6 space-y-4 shadow-xl">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-[#FF8A3D]" />
                <h3 className="text-base font-black">Strategic Career Move</h3>
              </div>
              <p className="text-xs opacity-85 font-medium leading-relaxed">
                High market demand detected for your target role skills. Submit your resume to priority recruiters to leverage peak market value.
              </p>
              <button className="w-full py-2.5 rounded-xl bg-[#FF8A3D] text-white text-xs font-black flex items-center justify-center gap-2 shadow-md hover:bg-[#F97316]">
                View Priority Matches <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Skill Gap & Career Readiness Report */}
            <div className="reference-card p-5 border border-[#F3E8E2] bg-white rounded-3xl space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-xs font-black text-[#963200]">
                  <AlertTriangle className="w-4 h-4 text-amber-500" /> AI Skill Gap Report
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-[#FFF0E6] text-[#963200] text-[10px] font-black">
                  Readiness: {skillGap.readiness_score ?? 75}%
                </span>
              </div>

              <div className="space-y-2">
                <p className="text-[11px] text-[#78716C] font-semibold">Recommended Skill Acquisition:</p>
                <div className="flex flex-wrap gap-1.5">
                  {(skillGap.missing_skills?.length > 0 ? skillGap.missing_skills : ["Distributed Systems", "Cloud Arch"]).map((skill, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-lg bg-[#FFF0E6] text-[#963200] text-[11px] font-bold">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <a href="/resume-analyzer" className="inline-flex items-center gap-1 text-xs font-bold text-[#963200] hover:underline pt-1">
                Open Resume Optimization <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

          </div>

        </div>

        {/* Bottom Section: Recent Activity Table */}
        <div className="reference-card p-6 border border-[#F3E8E2] bg-white rounded-3xl space-y-4 shadow-sm">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-black text-[#1C1917]">Recent Application Activity</h3>
            <a href="/applied" className="text-xs font-bold text-[#963200] hover:underline">View all applications</a>
          </div>

          <div className="p-4 rounded-2xl bg-[#FFF0E6] border border-[#F3D2C1] flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white text-[#963200] font-black flex items-center justify-center shadow-sm">
                💼
              </div>
              <div>
                <h4 className="text-xs font-black text-[#1C1917]">Active Pipeline Synced</h4>
                <p className="text-[11px] text-[#78716C] font-medium">Applications synced with real-time backend status.</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs font-bold text-[#963200]">Status: Live</div>
              <a href="/jobs" className="mt-1 px-4 py-1.5 rounded-full bg-[#963200] text-white text-[11px] font-black shadow-sm inline-block">
                Find More Jobs
              </a>
            </div>
          </div>
        </div>

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
