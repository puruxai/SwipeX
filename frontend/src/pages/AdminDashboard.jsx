import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useNotification } from '../context/NotificationContext';
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
  AlertTriangle
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
    try {
      await API.put(`/admin/users/${userId}/status`, { is_active: !currentActive });
      setUsersList((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, is_active: !currentActive } : u))
      );
      addToast(`User account status updated.`, 'success');
    } catch (err) {
      addToast('Failed to update user status.', 'error');
    }
  };

  const filteredUsers = usersList.filter(
    (u) =>
      u.email.toLowerCase().includes(searchUser.toLowerCase()) ||
      u.full_name.toLowerCase().includes(searchUser.toLowerCase())
  );

  if (loading) {
    return <div className="py-20 text-center text-xs font-black text-slate-400 uppercase tracking-widest animate-pulse">Loading Admin Platform Controls...</div>;
  }

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
          <ShieldCheck className="w-8 h-8 text-rose-500" />
          Platform Admin Security Console
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
          System telemetry metrics, user account permissions, and security audit event logs.
        </p>
      </div>

      {/* TELEMETRY CARDS */}
      {telemetry && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="luxury-card p-6 border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 space-y-2 shadow-sm">
            <div className="flex justify-between items-center text-xs font-bold text-slate-500">
              <span>Total Users</span>
              <Users className="w-4 h-4 text-[#FF6B00]" />
            </div>
            <div className="text-3xl font-black text-slate-900 dark:text-white">{telemetry.total_users}</div>
            <div className="text-[11px] text-slate-400 font-semibold">{telemetry.candidates_count} Candidates / {telemetry.recruiters_count} Recruiters</div>
          </div>

          <div className="luxury-card p-6 border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 space-y-2 shadow-sm">
            <div className="flex justify-between items-center text-xs font-bold text-slate-500">
              <span>Job Postings</span>
              <Briefcase className="w-4 h-4 text-[#FF6B00]" />
            </div>
            <div className="text-3xl font-black text-slate-900 dark:text-white">{telemetry.total_jobs}</div>
            <div className="text-[11px] text-emerald-500 font-bold">Active Roles</div>
          </div>

          <div className="luxury-card p-6 border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 space-y-2 shadow-sm">
            <div className="flex justify-between items-center text-xs font-bold text-slate-500">
              <span>Swipe Volume</span>
              <Layers className="w-4 h-4 text-[#FF6B00]" />
            </div>
            <div className="text-3xl font-black text-slate-900 dark:text-white">{telemetry.total_swipes}</div>
            <div className="text-[11px] text-[#FF6B00] font-bold">Total Interactions</div>
          </div>

          <div className="luxury-card p-6 border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 space-y-2 shadow-sm">
            <div className="flex justify-between items-center text-xs font-bold text-slate-500">
              <span>Conversion Rate</span>
              <Activity className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-3xl font-black text-slate-900 dark:text-white">{telemetry.swipe_apply_conversion_rate}%</div>
            <div className="text-[11px] text-emerald-500 font-bold">Swipe Right Ratio</div>
          </div>

        </div>
      )}

      {/* USER MANAGEMENT TABLE */}
      <div className="luxury-card p-6 border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 space-y-4 shadow-sm">
        
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-[#FF6B00]" /> User Accounts & Role Permissions
          </h2>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={searchUser}
              onChange={(e) => setSearchUser(e.target.value)}
              placeholder="Search user..."
              className="w-full pl-9 pr-3 py-2 rounded-xl glass-input text-xs"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-medium">
            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-500 font-bold border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="p-3">User</th>
                <th className="p-3">Email</th>
                <th className="p-3">Role</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="p-3 font-bold text-slate-900 dark:text-white">{u.full_name}</td>
                  <td className="p-3 text-slate-500">{u.email}</td>
                  <td className="p-3 font-bold capitalize text-[#FF6B00]">{u.role.replace('_', ' ')}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                      u.is_active ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'
                    }`}>
                      {u.is_active ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => handleToggleUserActive(u.id, u.is_active)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold ${
                        u.is_active
                          ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 border border-rose-200'
                          : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 border border-emerald-200'
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
  );
}
