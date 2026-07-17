import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useNotification } from '../context/NotificationContext';
import { ShieldCheck, Users, Briefcase, Layers, Cpu, Activity, Lock } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const { addToast } = useNotification();

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const statsRes = await API.get('/admin/stats');
      const usersRes = await API.get('/admin/users');
      setStats(statsRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      addToast('Unable to load admin data. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleUserStatus = async (userId, currentStatus) => {
    try {
      await API.put(`/admin/users/${userId}/status?is_active=${!currentStatus}`);
      addToast(`Updated user active status`, 'success');
      fetchAdminData();
    } catch (err) {
      addToast('Status toggle failed', 'error');
    }
  };

  if (loading || !stats) {
    return <div className="py-12 text-center text-[#A8A8A8]">Loading admin control panel...</div>;
  }

  const { metrics, security_logs } = stats;

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
          <ShieldCheck className="w-8 h-8 text-[#FF6B00]" />
          Platform Admin & Security Control
        </h1>
        <p className="text-sm text-[#A8A8A8] mt-1">
          Monitor platform metrics, user management, recruiter approvals, and security audit logs.
        </p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        
        <div className="glass-panel p-5 rounded-3xl border border-[#262626] bg-[#181818]/60 space-y-1">
          <div className="text-xs font-semibold text-[#A8A8A8]">Job Seekers</div>
          <div className="text-2xl font-black text-white">{metrics.total_candidates}</div>
        </div>

        <div className="glass-panel p-5 rounded-3xl border border-[#262626] bg-[#181818]/60 space-y-1">
          <div className="text-xs font-semibold text-[#A8A8A8]">Recruiters</div>
          <div className="text-2xl font-black text-[#FF8A3D]">{metrics.total_recruiters}</div>
        </div>

        <div className="glass-panel p-5 rounded-3xl border border-[#262626] bg-[#181818]/60 space-y-1">
          <div className="text-xs font-semibold text-[#A8A8A8]">Total Jobs</div>
          <div className="text-2xl font-black text-[#FF8A3D]">{metrics.total_jobs_posted}</div>
        </div>

        <div className="glass-panel p-5 rounded-3xl border border-[#262626] bg-[#181818]/60 space-y-1">
          <div className="text-xs font-semibold text-[#A8A8A8]">Total Swipes</div>
          <div className="text-2xl font-black text-[#FF6B00]">{metrics.total_swipes}</div>
        </div>

        <div className="glass-panel p-5 rounded-3xl border border-[#262626] bg-[#181818]/60 space-y-1">
          <div className="text-xs font-semibold text-[#A8A8A8]">Applications</div>
          <div className="text-2xl font-black text-[#22C55E]">{metrics.total_applications}</div>
        </div>

      </div>

      {/* User Management Table & Logs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* User Management */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-3xl border border-[#262626] bg-[#181818]/60 space-y-4">
          <h3 className="text-base font-extrabold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-[#FF6B00]" /> User & Recruiter Accounts ({users.length})
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#262626] text-[#A8A8A8] uppercase font-semibold">
                  <th className="py-2.5 px-3">User</th>
                  <th className="py-2.5 px-3">Role</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#262626]/40">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-white/2 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-bold text-white">{u.full_name}</div>
                      <div className="text-[11px] text-[#A8A8A8]">{u.email}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        u.role === 'admin' ? 'bg-[#EF4444]/10 text-rose-300 border border-rose-500/20' :
                        u.role === 'recruiter' ? 'bg-[#FF8A3D]/10 text-[#FF8A3D] border border-[#FF8A3D]/20' : 'bg-[#FF6B00]/10 text-[#FF6B00] border border-[#FF6B00]/20'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`font-semibold ${u.is_active ? 'text-[#22C55E]' : 'text-pink-400'}`}>
                        {u.is_active ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => handleToggleUserStatus(u.id, u.is_active)}
                        className="px-3 py-1 bg-[#121212] border border-[#262626] hover:bg-white/5 text-xs font-semibold rounded-lg text-[#A8A8A8] hover:text-white transition-colors"
                      >
                        {u.is_active ? 'Disable' : 'Enable'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Security Audit Logs */}
        <div className="glass-panel p-6 rounded-3xl border border-[#262626] bg-[#181818]/60 space-y-4">
          <h3 className="text-base font-extrabold text-white flex items-center gap-2">
            <Lock className="w-5 h-5 text-[#EF4444]" /> System Audit Logs
          </h3>

          <div className="space-y-3">
            {security_logs?.map((log, i) => (
              <div key={i} className="p-3 rounded-2xl bg-[#121212] border border-[#262626] text-xs space-y-1">
                <div className="flex justify-between items-center text-[#A8A8A8]">
                  <span className="font-bold text-white">{log.event}</span>
                  <span className="text-[10px]">{log.timestamp}</span>
                </div>
                <p className="text-[#A8A8A8] text-[11px]">{log.detail}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
