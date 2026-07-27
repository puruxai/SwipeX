import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useNotification } from '../context/NotificationContext';
import { 
  BarChart3, 
  TrendingUp, 
  Briefcase, 
  Award, 
  CheckCircle2, 
  Zap, 
  ArrowUpRight
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
import { motion } from 'framer-motion';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToast } = useNotification();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await API.get('/analytics/dashboard');
      setData(res.data);
    } catch (err) {
      addToast('Unable to load dashboard analytics.', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading || !data) {
    return (
      <div className="py-20 text-center text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest animate-pulse">
        Loading Candidate Analytics Dashboard...
      </div>
    );
  }

  const { summary, monthly_trends, skill_gap_report } = data;

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
          <BarChart3 className="w-8 h-8 text-[#FF6B00]" />
          Candidate Discovery Analytics
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
          Real-time metrics on application velocity, ATS score trends, and AI skill gap readiness.
        </p>
      </div>

      {/* KPI METRIC WIDGETS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        
        <motion.div whileHover={{ y: -4 }} className="luxury-card p-6 border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 space-y-2 shadow-sm">
          <div className="flex justify-between items-center text-slate-500 dark:text-slate-400 text-xs font-bold">
            <span>Total Applications</span>
            <Briefcase className="w-4 h-4 text-[#FF6B00]" />
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white">{summary.total_applied}</div>
          <div className="text-[11px] text-emerald-500 font-bold flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> Applied via Swipe Right
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -4 }} className="luxury-card p-6 border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 space-y-2 shadow-sm">
          <div className="flex justify-between items-center text-slate-500 dark:text-slate-400 text-xs font-bold">
            <span>Interview Rate</span>
            <TrendingUp className="w-4 h-4 text-[#FF6B00]" />
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white">{summary.success_rate}%</div>
          <div className="text-[11px] text-[#FF6B00] font-bold">{summary.interviewing} Active Interviews</div>
        </motion.div>

        <motion.div whileHover={{ y: -4 }} className="luxury-card p-6 border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 space-y-2 shadow-sm">
          <div className="flex justify-between items-center text-slate-500 dark:text-slate-400 text-xs font-bold">
            <span>Average Match Score</span>
            <Zap className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white">{summary.average_match_score}%</div>
          <div className="text-[11px] text-amber-500 font-bold">TF-IDF Vector Similarity</div>
        </motion.div>

        <motion.div whileHover={{ y: -4 }} className="luxury-card p-6 border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 space-y-2 shadow-sm">
          <div className="flex justify-between items-center text-slate-500 dark:text-slate-400 text-xs font-bold">
            <span>ATS Resume Score</span>
            <Award className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white">{summary.latest_ats_score}/100</div>
          <div className="text-[11px] text-emerald-500 font-bold">Active Resume Score</div>
        </motion.div>

      </div>

      {/* CHARTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Monthly Trends Area Chart */}
        <div className="luxury-card p-6 border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 space-y-4 shadow-sm">
          <h3 className="text-base font-black text-slate-900 dark:text-white">Monthly Application Trends</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthly_trends}>
                <defs>
                  <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF6B00" stopOpacity={0.7}/>
                    <stop offset="95%" stopColor="#FF6B00" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} />
                <YAxis stroke="#94A3B8" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#1E293B', borderRadius: '16px', color: '#FFF', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="applications" stroke="#FF6B00" strokeWidth={3} fillOpacity={1} fill="url(#colorApps)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Application Status Funnel Bar Chart */}
        <div className="luxury-card p-6 border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 space-y-4 shadow-sm">
          <h3 className="text-base font-black text-slate-900 dark:text-white">Application Status Funnel</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { status: 'Applied', count: summary.total_applied },
                { status: 'Shortlisted', count: summary.shortlisted },
                { status: 'Interviewing', count: summary.interviewing },
                { status: 'Offered', count: summary.offered }
              ]}>
                <XAxis dataKey="status" stroke="#94A3B8" fontSize={11} />
                <YAxis stroke="#94A3B8" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#1E293B', borderRadius: '16px', color: '#FFF', fontSize: '12px' }}
                />
                <Bar dataKey="count" fill="#FF6B00" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* SKILL GAP READINESS REPORT */}
      <div className="luxury-card p-8 border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Zap className="w-6 h-6 text-[#FF6B00]" />
              AI Skill Gap & Career Readiness Report
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
              Identifies top missing skills demanded across target job postings.
            </p>
          </div>
          <div className="px-4 py-2 rounded-2xl bg-[#FF6B00]/10 border border-[#FF6B00]/25 text-[#FF6B00] font-black text-sm">
            Readiness Index: {skill_gap_report.candidate_readiness_score}%
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#FF6B00]">High-Demand Missing Skills</h4>
            <div className="space-y-2">
              {skill_gap_report.top_missing_skills?.map((item, i) => (
                <div key={i} className="flex justify-between items-center p-3 rounded-2xl bg-[#FF6B00]/5 border border-[#FF6B00]/15 text-xs font-medium">
                  <span className="font-bold text-[#FF6B00]">! {item.skill}</span>
                  <span className="text-slate-500 dark:text-slate-400">Required in {item.count} jobs</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-emerald-500">Recommended Learning Action</h4>
            <div className="space-y-2">
              {skill_gap_report.learning_recommendations?.map((rec, i) => (
                <div key={i} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-xs space-y-1">
                  <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    Master {rec.skill}
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 leading-normal font-normal">{rec.suggestion}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
