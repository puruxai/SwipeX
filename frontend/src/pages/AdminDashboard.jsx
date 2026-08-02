import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useNotification } from '../context/NotificationContext';
import soundManager from '../services/SoundManager';
import Sidebar from '../components/Sidebar';
import { 
  ShieldCheck, 
  Users, 
  Briefcase, 
  Layers, 
  Activity, 
  Lock, 
  Unlock, 
  CheckCircle2, 
  Search,
  AlertTriangle,
  Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminDashboard() {
  const [telemetry, setTelemetry] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchUser, setSearchUser] = useState('');

  const { addToast } = useNotification();

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const [telemetryRes, usersRes, logsRes] = await Promise.all([
        API.get('/admin/telemetry'),
        API.get('/admin/users'),
        API.get('/admin/audit-logs')
      ]);

      setTelemetry(telemetryRes.data);
      setUsersList(usersRes.data);
      setAuditLogs(logsRes.data);
    } catch (err) {
      addToast('Unable to load admin control data.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleUserActive = async (userId, currentActive) => {
    soundManager.playTick();
    try {
      await API.put(`/admin/users/${userId}/status`, { is_active: !currentActive });
      setUsersList((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, is_active: !currentActive } : u))
      );
      addToast(`User account status updated.`, 'success');
      soundManager.playSuccess();
    } catch (err) {
      addToast('Failed to update user status.', 'error');
    }
  };

  const handleActionClick = () => {
    soundManager.playTick();
  };

  const handleHover = () => {
    soundManager.playHover();
  };

  const filteredUsers = usersList.filter(
    (u) =>
      u.email.toLowerCase().includes(searchUser.toLowerCase()) ||
      u.full_name.toLowerCase().includes(searchUser.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex min-h-[90vh] bg-[#030509] text-[#f1f5f9] transition-colors relative">
        <Sidebar />
        <div className="flex-1 p-8 flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-8 h-8 rounded-full border-4 border-[#ffb693] border-t-transparent animate-spin" />
          <div className="text-xs font-black text-[#ffb693] uppercase tracking-widest animate-pulse">
            Loading Admin Platform Controls...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[90vh] bg-[#030509] text-[#f1f5f9] transition-colors relative">
      
      {/* Sidebar Shell */}
      <Sidebar />

      {/* Main Admin Telemetry Suite */}
      <div className="flex-1 p-8 lg:p-10 space-y-8 relative z-10">
        
        {/* Header */}
        <div className="flex justify-between items-end border-b border-white/5 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-rose-500" />
              Platform Admin Security Console
            </h1>
            <p className="text-xs text-[#e2bfb0] mt-1.5 font-medium">
              System telemetry metrics, user account permissions, and security audit event logs.
            </p>
          </div>
        </div>

        {/* TELEMETRY CARDS */}
        {telemetry && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="reference-card p-6 bg-[#191f2f]/45 border border-white/5 space-y-2 shadow-sm">
              <div className="flex justify-between items-center text-xs font-bold text-[#e2bfb0]">
                <span>Total Users</span>
                <Users className="w-4 h-4 text-[#ffb693]" />
              </div>
              <div className="text-3xl font-black text-white">{telemetry.total_users}</div>
              <div className="text-[11px] text-[#e2bfb0]/70 font-semibold">{telemetry.candidates_count} Candidates / {telemetry.recruiters_count} Recruiters</div>
            </div>

            <div className="reference-card p-6 bg-[#191f2f]/45 border border-white/5 space-y-2 shadow-sm">
              <div className="flex justify-between items-center text-xs font-bold text-[#e2bfb0]">
                <span>Job Postings</span>
                <Briefcase className="w-4 h-4 text-[#ffb693]" />
              </div>
              <div className="text-3xl font-black text-white">{telemetry.total_jobs}</div>
              <div className="text-[11px] text-emerald-400 font-bold">Active Roles</div>
            </div>

            <div className="reference-card p-6 bg-[#191f2f]/45 border border-white/5 space-y-2 shadow-sm">
              <div className="flex justify-between items-center text-xs font-bold text-[#e2bfb0]">
                <span>Swipe Volume</span>
                <Layers className="w-4 h-4 text-[#ffb693]" />
              </div>
              <div className="text-3xl font-black text-white">{telemetry.total_swipes}</div>
              <div className="text-[11px] text-[#ffb693] font-bold">Total Interactions</div>
            </div>

            <div className="reference-card p-6 bg-[#191f2f]/45 border border-white/5 space-y-2 shadow-sm">
              <div className="flex justify-between items-center text-xs font-bold text-[#e2bfb0]">
                <span>Conversion Rate</span>
                <Activity className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-3xl font-black text-white">{telemetry.swipe_apply_conversion_rate}%</div>
              <div className="text-[11px] text-emerald-400 font-bold">Swipe Right Ratio</div>
            </div>

          </div>
        )}

        {/* USER MANAGEMENT TABLE */}
        <div className="reference-card p-6 bg-[#191f2f]/40 border border-white/5 space-y-4 shadow-sm">
          
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-[#ffb693]" /> User Accounts & Role Permissions
            </h2>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-3.5 text-[#e2bfb0]/70" />
              <input
                type="text"
                value={searchUser}
                onChange={(e) => setSearchUser(e.target.value)}
                placeholder="Search user..."
                className="w-full pl-9 pr-3 py-2.5 rounded-xl glass-input text-xs bg-white/5 border border-white/10 text-white"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-semibold text-[#e2bfb0]">
              <thead className="bg-white/5 text-white font-bold border-b border-white/10">
                <tr>
                  <th className="p-3">User</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-white/5">
                    <td className="p-3 font-bold text-white">{u.full_name}</td>
                    <td className="p-3 text-[#e2bfb0]/80">{u.email}</td>
                    <td className="p-3 font-bold capitalize text-[#ffb693]">{u.role.replace('_', ' ')}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                        u.is_active ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}>
                        {u.is_active ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleToggleUserActive(u.id, u.is_active)}
                        onMouseEnter={handleHover}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          u.is_active
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        }`}
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

      </div>

    </div>
  );
}
