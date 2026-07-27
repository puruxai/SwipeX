import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useNotification } from '../context/NotificationContext';
import { ShieldCheck, Users, Briefcase, Layers, Cpu, Activity, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

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
    return <div className="py-20 text-center text-xs font-bold text-slate-400 dark:text-neutral-500">Loading admin control panel...</div>;
  }

  const { metrics, security_logs } = stats;

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-8 h-8 text-[#FF6B00]" />
          Platform Admin & Security Control
        </h1>
        <p className="text-xs text-slate-500 dark:text-neutral-400 mt-1 font-medium">
          Monitor platform metrics, user management, recruiter approvals, and security audit logs.
        </p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        
        <motion.div whileHover={{ y: -3 }} className="glass-panel p-5 rounded-3xl border border-slate-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 space-y-1 shadow-sm">
          <div className="text-xs font-bold text-slate-500 dark:text-neutral-400">Job Seekers</div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">{metrics.total_candidates}</div>
        </motion.div>

        <motion.div whileHover={{ y: -3 }} className="glass-panel p-5 rounded-3xl border border-slate-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 space-y-1 shadow-sm">
          <div className="text-xs font-bold text-slate-500 dark:text-neutral-400">Recruiters</div>
          <div className="text-2xl font-black text-[#FF6B00] dark:text-[#FF9D42]">{metrics.total_recruiters}</div>
        </motion.div>

        <motion.div whileHover={{ y: -3 }} className="glass-panel p-5 rounded-3xl border border-slate-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 space-y-1 shadow-sm">
          <div className="text-xs font-bold text-slate-500 dark:text-neutral-400">Total Jobs</div>
          <div className="text-2xl font-black text-[#FF6B00] dark:text-[#FF9D42]">{metrics.total_jobs_posted}</div>
        </motion.div>

        <motion.div whileHover={{ y: -3 }} className="glass-panel p-5 rounded-3xl border border-slate-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 space-y-1 shadow-sm">
          <div className="text-xs font-bold text-slate-500 dark:text-neutral-400">Total Swipes</div>
          <div className="text-2xl font-black text-[#FF6B00]">{metrics.total_swipes}</div>
        </motion.div>

        <motion.div whileHover={{ y: -3 }} className="glass-panel p-5 rounded-3xl border border-slate-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 space-y-1 shadow-sm">
          <div className="text-xs font-bold text-slate-500 dark:text-neutral-400">Applications</div>
          <div className="text-2xl font-black text-[#22C55E]">{metrics.total_applications}</div>
        </motion.div>

      </div>

      {/* User Management Table & Logs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* User Management */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-3xl border border-slate-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 space-y-4 shadow-sm">
          <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-[#FF6B00]" /> User & Recruiter Accounts ({users.length})
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-medium">
              <thead>
                <tr className="border-b border-slate-100 dark:border-neutral-800 text-slate-400 dark:text-neutral-500 uppercase font-black">
                  <th className="py-2.5 px-3">User</th>
                  <th className="py-2.5 px-3">Role</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-neutral-800">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-neutral-800/40 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900 dark:text-white">{u.full_name}</div>
                      <div className="text-[11px] text-slate-500 dark:text-neutral-400 font-normal">{u.email}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase ${
                        u.role === 'admin' ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800' :
                        u.role === 'recruiter' ? 'bg-[#FF6B00]/10 text-[#FF6B00] dark:text-[#FF9D42] border border-[#FF6B00]/20' : 'bg-slate-100 dark:bg-neutral-800 text-slate-700 dark:text-neutral-300 border border-slate-200 dark:border-neutral-700'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`font-bold ${u.is_active ? 'text-[#22C55E]' : 'text-rose-500'}`}>
                        {u.is_active ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => handleToggleUserStatus(u.id, u.is_active)}
                        className="px-3 py-1 bg-slate-100 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 hover:bg-slate-200 dark:hover:bg-neutral-700 text-xs font-bold rounded-xl text-slate-700 dark:text-neutral-300 transition-colors"
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
        <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 space-y-4 shadow-sm">
          <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Lock className="w-5 h-5 text-rose-500" /> System Audit Logs
          </h3>

          <div className="space-y-3">
            {security_logs?.map((log, i) => (
              <div key={i} className="p-3 rounded-2xl bg-slate-50 dark:bg-neutral-800/80 border border-slate-200 dark:border-neutral-700/80 text-xs space-y-1">
                <div className="flex justify-between items-center text-slate-500 dark:text-neutral-400">
                  <span className="font-bold text-slate-900 dark:text-white">{log.event}</span>
                  <span className="text-[10px] font-medium">{log.timestamp}</span>
                </div>
                <p className="text-slate-600 dark:text-neutral-400 text-[11px] font-normal">{log.detail}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
