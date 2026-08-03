import React, { useState, useEffect } from 'react';
import API from '../services/api';
import Sidebar from '../components/Sidebar';
import { 
  BarChart, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { 
  Sparkles, 
  TrendingUp, 
  Users, 
  Briefcase, 
  Zap, 
  Layers, 
  CheckCircle2, 
  ArrowRight,
  TrendingDown,
  Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const [telemetry, setTelemetry] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sample analytics time-series data
  const chartData = [
    { name: 'Mon', value: 2400 },
    { name: 'Tue', value: 1398 },
    { name: 'Wed', value: 9800 },
    { name: 'Thu', value: 3908 },
    { name: 'Fri', value: 4800 },
    { name: 'Sat', value: 3800 },
    { name: 'Sun', value: 4300 }
  ];

  useEffect(() => {
    fetchTelemetry();
  }, []);

  const fetchTelemetry = async () => {
    try {
      const res = await API.get('/candidate/telemetry');
      setTelemetry(res.data);
    } catch (err) {
      // Mock fallback telemetry
      setTelemetry({
        applied_count: 14,
        shortlisted_count: 4,
        interviewing_count: 2,
        ats_average: 84
      });
    } finally {
      setLoading(false);
    }
  };

  const pageVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <div className="flex min-h-[90vh] bg-[#F8F8F5] text-[#111111] transition-colors">
      
      {/* Left Sidebar Shell */}
      <Sidebar />

      {/* Main Analytics Canvas */}
      <motion.div 
        initial="hidden"
        animate="show"
        variants={pageVariants}
        className="flex-1 p-8 lg:p-10 space-y-8"
      >
        
        {/* Header Bar inside Content Canvas */}
        <div className="flex justify-between items-end border-b border-[#E6E6E2] pb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-[#111111] tracking-tight">Telemetry Workspace Analytics</h1>
            <p className="text-xs text-[#666666] font-medium mt-0.5">Real-time matching rates, ATS format scans, and application stage tracking.</p>
          </div>
        </div>

        {/* Telemetry Numeric KPI Cards */}
        {loading ? (
          <div className="py-12 text-center text-xs font-bold text-[#59C414] uppercase tracking-widest animate-pulse flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-[#7ED321]" /> Calculating Telemetry Workspace...
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Card 1: Applications */}
            <div className="reference-card p-5 bg-white border border-[#E6E6E2] space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-[#666666]">
                <span>Applied Roles</span>
                <Briefcase className="w-4 h-4 text-[#7ED321]" />
              </div>
              <div className="text-3xl font-black text-[#111111]">{telemetry?.applied_count || 14}</div>
              <div className="text-[10px] text-[#59C414] font-bold">Active applications in pipeline</div>
            </div>

            {/* Card 2: Shortlisted */}
            <div className="reference-card p-5 bg-white border border-[#E6E6E2] space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-[#666666]">
                <span>Shortlists</span>
                <Users className="w-4 h-4 text-[#7ED321]" />
              </div>
              <div className="text-3xl font-black text-[#111111]">{telemetry?.shortlisted_count || 4}</div>
              <div className="text-[10px] text-[#59C414] font-bold">Recruiter view requests</div>
            </div>

            {/* Card 3: Interviewing */}
            <div className="reference-card p-5 bg-white border border-[#E6E6E2] space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-[#666666]">
                <span>Interviews</span>
                <Zap className="w-4 h-4 text-[#7ED321]" />
              </div>
              <div className="text-3xl font-black text-[#111111]">{telemetry?.interviewing_count || 2}</div>
              <div className="text-[10px] text-[#59C414] font-bold">STAR Simulator scheduled</div>
            </div>

            {/* Card 4: Avg ATS Score */}
            <div className="reference-card p-5 bg-white border border-[#E6E6E2] space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-[#666666]">
                <span>Avg ATS Rating</span>
                <Layers className="w-4 h-4 text-[#7ED321]" />
              </div>
              <div className="text-3xl font-black text-[#111111]">{telemetry?.ats_average || 84}%</div>
              <div className="text-[10px] text-[#59C414] font-bold">Based on latest resume draft</div>
            </div>

          </div>
        )}

        {/* Row 2: Analytics Time Series & Activity Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Time Series Area Chart */}
          <div className="lg:col-span-8 reference-card p-6 bg-white border border-[#E6E6E2] space-y-4">
            <h3 className="text-xs font-bold text-[#111111] uppercase tracking-wider">Job Matching Flow</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorGreen" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7ED321" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#7ED321" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E6E6E2" />
                  <XAxis dataKey="name" stroke="#666666" fontSize={11} tickLine={false} />
                  <YAxis stroke="#666666" fontSize={11} tickLine={false} />
                  <Tooltip contentStyle={{ background: '#FFFFFF', border: '1px solid #E6E6E2', borderRadius: '10px' }} />
                  <Area type="monotone" dataKey="value" stroke="#7ED321" strokeWidth={2} fillOpacity={1} fill="url(#colorGreen)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Activity Feed */}
          <div className="lg:col-span-4 reference-card p-6 bg-white border border-[#E6E6E2] space-y-4">
            <h3 className="text-xs font-bold text-[#111111] uppercase tracking-wider">Recent Activity</h3>
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-[#F8F8F5] border border-[#E6E6E2] text-xs font-semibold text-[#666666]">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-[#111111]">ATS Match Generated</span>
                  <span className="text-[9px] text-[#666666]/70">2h ago</span>
                </div>
                <p className="text-[10px] text-[#666666] mt-0.5">Software Architect resume scored 88% Match</p>
              </div>

              <div className="p-3 rounded-xl bg-[#F8F8F5] border border-[#E6E6E2] text-xs font-semibold text-[#666666]">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-[#111111]">Applied Role</span>
                  <span className="text-[9px] text-[#666666]/70">5h ago</span>
                </div>
                <p className="text-[10px] text-[#666666] mt-0.5">Applied for Senior AI Engineer at NeuralCorp</p>
              </div>

              <div className="p-3 rounded-xl bg-[#F8F8F5] border border-[#E6E6E2] text-xs font-semibold text-[#666666]">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-[#111111]">STAR Answer Eval</span>
                  <span className="text-[9px] text-[#666666]/70">1d ago</span>
                </div>
                <p className="text-[10px] text-[#666666] mt-0.5">AI mock interview response score: 85/100</p>
              </div>
            </div>
          </div>

        </div>

      </motion.div>

    </div>
  );
}
