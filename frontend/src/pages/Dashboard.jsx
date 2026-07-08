import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { 
  BarChart3, 
  TrendingUp, 
  Briefcase, 
  FileCheck, 
  Award, 
  AlertCircle, 
  CheckCircle, 
  Clock,
  Zap,
  Bookmark
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  BarChart, 
  Bar 
} from 'recharts';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await API.get('/analytics/dashboard');
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !data) {
    return <div className="py-12 text-center text-slate-400">Loading candidate analytics dashboard...</div>;
  }

  const { summary, monthly_trends, skill_gap_report } = data;

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
          <BarChart3 className="w-8 h-8 text-pink-400" />
          Candidate Discovery Dashboard
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Real-time analytics on applications, ATS score trends, and skill gap recommendations.
        </p>
      </div>

      {/* Metrics Widgets */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-2">
          <div className="flex justify-between items-center text-slate-400 text-xs font-semibold">
            <span>Total Applications</span>
            <Briefcase className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-3xl font-black text-white">{summary.total_applied}</div>
          <div className="text-[11px] text-emerald-400 font-medium">Applied via Swipe Right</div>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-2">
          <div className="flex justify-between items-center text-slate-400 text-xs font-semibold">
            <span>Interview Rate</span>
            <TrendingUp className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-black text-white">{summary.success_rate}%</div>
          <div className="text-[11px] text-indigo-300 font-medium">{summary.interviewing} Active Interviews</div>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-2">
          <div className="flex justify-between items-center text-slate-400 text-xs font-semibold">
            <span>Average Match Score</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-black text-white">{summary.average_match_score}%</div>
          <div className="text-[11px] text-amber-300 font-medium">TF-IDF Vector Score</div>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-2">
          <div className="flex justify-between items-center text-slate-400 text-xs font-semibold">
            <span>ATS Resume Score</span>
            <Award className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-white">{summary.latest_ats_score}/100</div>
          <div className="text-[11px] text-emerald-300 font-medium">Active Resume Gauge</div>
        </div>

      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Monthly Applications Chart */}
        <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
          <h3 className="text-base font-extrabold text-white">Monthly Application Trends</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthly_trends}>
                <defs>
                  <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} />
                <YAxis stroke="#94A3B8" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#111827', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                />
                <Area type="monotone" dataKey="applications" stroke="#6366F1" fillOpacity={1} fill="url(#colorApps)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Application Status Breakdown */}
        <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
          <h3 className="text-base font-extrabold text-white">Application Status Funnel</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { status: 'Applied', count: summary.total_applied },
                { status: 'Shortlisted', count: summary.shortlisted },
                { status: 'Interviewing', count: summary.interviewing },
                { status: 'Offered', count: summary.offered }
              ]}>
                <XAxis dataKey="status" stroke="#94A3B8" fontSize={12} />
                <YAxis stroke="#94A3B8" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#111827', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                />
                <Bar dataKey="count" fill="#8B5CF6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Skill Gap Analysis Widget */}
      <div className="glass-panel p-8 rounded-3xl border border-white/10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
              <Zap className="w-6 h-6 text-amber-400" />
              AI Skill Gap & Career Readiness Report
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Identifies missing skills demanded across target job postings.
            </p>
          </div>
          <div className="px-4 py-2 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 font-extrabold text-sm">
            Readiness Index: {skill_gap_report.candidate_readiness_score}%
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Top High-Demand Missing Skills */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">High-Demand Missing Skills</h4>
            <div className="space-y-2">
              {skill_gap_report.top_missing_skills?.map((item, i) => (
                <div key={i} className="flex justify-between items-center p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs">
                  <span className="font-bold text-amber-200">! {item.skill}</span>
                  <span className="text-slate-400">Required in {item.count} jobs</span>
                </div>
              ))}
            </div>
          </div>

          {/* Actionable Learning Recommendations */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">Recommended Learning Action</h4>
            <div className="space-y-2">
              {skill_gap_report.learning_recommendations?.map((rec, i) => (
                <div key={i} className="p-3 rounded-2xl bg-white/5 border border-white/5 text-xs space-y-1">
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    Master {rec.skill}
                  </div>
                  <p className="text-slate-400 leading-normal">{rec.suggestion}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
