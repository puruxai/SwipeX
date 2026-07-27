import React, { useState, useEffect } from 'react';
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
  ExternalLink
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip 
} from 'recharts';

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
      <div className="flex min-h-[90vh] bg-[#FFF9F5]">
        <Sidebar />
        <div className="flex-1 py-20 text-center text-xs font-black text-[#A8A29E] uppercase tracking-widest animate-pulse">
          Loading Candidate Analytics...
        </div>
      </div>
    );
  }

  const { summary, monthly_trends, skill_gap_report } = data;

  return (
    <div className="flex min-h-[90vh] bg-[#FFF9F5] text-[#1C1917]">
      
      {/* Left Sidebar Shell */}
      <Sidebar />

      {/* Main Content Dashboard Layout (Matching Reference Screenshot 3) */}
      <div className="flex-1 p-6 md:p-8 space-y-6">
        
        {/* Top 4 KPI Metric Widgets (Matching Reference Screenshot 3) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* APPLIED */}
          <div className="reference-card p-5 border border-[#F3E8E2] bg-white rounded-3xl space-y-1.5 shadow-sm">
            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider text-[#78716C]">
              <span>APPLIED</span>
              <Send className="w-4 h-4 text-[#963200]" />
            </div>
            <div className="text-3xl font-black text-[#1C1917]">{summary.total_applied || 124}</div>
            <div className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5" /> +12% vs last week
            </div>
          </div>

          {/* INTERVIEWS */}
          <div className="reference-card p-5 border border-[#F3E8E2] bg-white rounded-3xl space-y-1.5 shadow-sm">
            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider text-[#78716C]">
              <span>INTERVIEWS</span>
              <Video className="w-4 h-4 text-[#963200]" />
            </div>
            <div className="text-3xl font-black text-[#1C1917]">{summary.interviewing || 18}</div>
            <div className="text-[11px] text-[#78716C] font-bold">3 pending confirmation</div>
          </div>

          {/* OFFERS */}
          <div className="reference-card p-5 border border-[#F3E8E2] bg-white rounded-3xl space-y-1.5 shadow-sm">
            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider text-[#78716C]">
              <span>OFFERS</span>
              <CheckCheck className="w-4 h-4 text-[#963200]" />
            </div>
            <div className="text-3xl font-black text-[#1C1917]">{summary.offered || 3}</div>
            <div className="text-[11px] text-[#963200] font-bold">Average $165k base</div>
          </div>

          {/* AI MATCH SCORE */}
          <div className="reference-card p-5 border border-[#F3E8E2] bg-white rounded-3xl space-y-1.5 shadow-sm">
            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider text-[#78716C]">
              <span>AI MATCH SCORE</span>
              <div className="w-6 h-6 rounded-full border-2 border-[#FF8A3D] flex items-center justify-center text-[#FF8A3D] text-[10px] font-black">⚡</div>
            </div>
            <div className="text-3xl font-black text-[#1C1917]">{summary.average_match_score || 94}%</div>
          </div>

        </div>

        {/* Middle Section: Chart + Right Promo Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Chart: Career Growth Velocity */}
          <div className="lg:col-span-8 reference-card p-6 border border-[#F3E8E2] bg-white rounded-3xl space-y-4 shadow-sm">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-base font-black text-[#1C1917]">Career Growth Velocity</h3>
                <p className="text-xs text-[#78716C] font-medium">
                  Projected trajectory based on current skill acquisition and market demand.
                </p>
              </div>

              <div className="flex gap-1 bg-[#FFF0E6] p-1 rounded-xl text-xs font-bold text-[#78716C]">
                <button className="px-3 py-1 rounded-lg">Weekly</button>
                <button className="px-3 py-1 rounded-lg bg-[#963200] text-white">Monthly</button>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthly_trends}>
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
            </div>
          </div>

          {/* Right Column Promo Cards (Matching Reference Screenshot 3) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Dark Charcoal Card: Strategic Move */}
            <div className="rounded-3xl bg-[#292524] text-white p-6 space-y-4 shadow-xl">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#FF8A3D]" />
                <h3 className="text-base font-black">Strategic Move</h3>
              </div>
              <p className="text-xs opacity-85 font-medium leading-relaxed">
                Companies like NVIDIA and OpenAI are increasing demand for your specific LLM Fine-tuning skill set by 40%. Apply now to leverage peak market value.
              </p>
              <button className="w-full py-2.5 rounded-xl bg-[#FF8A3D] text-white text-xs font-black flex items-center justify-center gap-2 shadow-md">
                View Matches <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Skill Gap Detected Card */}
            <div className="reference-card p-5 border border-[#F3E8E2] bg-white rounded-3xl space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-xs font-black text-rose-600">
                  <AlertTriangle className="w-4 h-4" /> Skill Gap Detected
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-600 text-[10px] font-black">
                  High Priority
                </span>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span>Distributed Systems</span>
                  <span className="text-[#963200]">35% Match</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-rose-500 w-[35%]" />
                </div>
                <p className="text-[11px] text-[#78716C] pt-1">Required for 80% of your target roles.</p>
              </div>

              <a href="#" className="inline-flex items-center gap-1 text-xs font-bold text-[#963200] hover:underline">
                Start Learning Path <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

          </div>

        </div>

        {/* Bottom Section: Recent Activity Table (Matching Reference Screenshot 3) */}
        <div className="reference-card p-6 border border-[#F3E8E2] bg-white rounded-3xl space-y-4 shadow-sm">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-black text-[#1C1917]">Recent Activity</h3>
            <a href="#" className="text-xs font-bold text-[#963200] hover:underline">View all logs</a>
          </div>

          <div className="p-4 rounded-2xl bg-[#FFF0E6] border border-[#F3D2C1] flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white text-[#963200] font-black flex items-center justify-center shadow-sm">
                📅
              </div>
              <div>
                <h4 className="text-xs font-black text-[#1C1917]">Interview Scheduled with Anthropic</h4>
                <p className="text-[11px] text-[#78716C] font-medium">Senior ML Engineer Role • AI Strategy Team</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs font-bold text-[#963200]">Tomorrow, 10:00 AM</div>
              <button className="mt-1 px-4 py-1.5 rounded-full bg-[#963200] text-white text-[11px] font-black shadow-sm">
                Join Zoom
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
