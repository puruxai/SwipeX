import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { Sparkles, Mail, Lock, User, UserCheck, Briefcase } from 'lucide-react';

export default function Signup() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [role, setRole] = useState('user');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const { addToast } = useNotification();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 10) {
      setPasswordError('Password must be at least 10 characters');
      return;
    }
    setPasswordError('');
    setLoading(true);
    try {
      await register(email, password, fullName, role);
      addToast('Account created successfully!', 'success');
      navigate('/swipe');
    } catch (err) {
      addToast(err.response?.data?.detail || 'Registration failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 glass-panel p-8 rounded-3xl border border-white/10 shadow-2xl">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-400 flex items-center justify-center shadow-neon-indigo">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-3xl font-extrabold text-white">Join SwipeX</h2>
          <p className="text-sm text-slate-400">Create your account to unlock AI job matching</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Account Role</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole('user')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  role === 'user'
                    ? 'bg-indigo-600/30 border-indigo-500 text-white shadow-neon-indigo'
                    : 'glass-panel border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                <UserCheck className="w-4 h-4" /> Job Seeker
              </button>
              <button
                type="button"
                onClick={() => setRole('recruiter')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  role === 'recruiter'
                    ? 'bg-violet-600/30 border-violet-500 text-white shadow-neon-indigo'
                    : 'glass-panel border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                <Briefcase className="w-4 h-4" /> Recruiter
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Full Name</label>
            <div className="relative">
              <User className="w-5 h-5 absolute left-3 top-3 text-slate-500" />
              <input
                type="text"
                required
                minLength={2}
                maxLength={255}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm"
                placeholder="Alex Mercer"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="w-5 h-5 absolute left-3 top-3 text-slate-500" />
              <input
                type="email"
                required
                maxLength={255}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm"
                placeholder="name@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-5 h-5 absolute left-3 top-3 text-slate-500" />
              <input
                type="password"
                required
                minLength={10}
                maxLength={128}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setPasswordError(''); }}
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm ${passwordError ? 'border-red-500/60' : ''}`}
                placeholder="Minimum 10 characters"
              />
            </div>
            {passwordError && (
              <p className="text-xs text-red-400 mt-1" role="alert">{passwordError}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 font-bold text-white bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-500 rounded-xl shadow-neon-indigo hover:opacity-95 transition-all flex items-center justify-center gap-2"
          >
            {loading ? 'Creating Account...' : 'Create Free Account'}
          </button>
        </form>

        <p className="text-center text-xs text-slate-400">
          Already registered?{' '}
          <Link to="/login" className="text-indigo-400 font-bold hover:underline">
            Log In
          </Link>
        </p>

      </div>
    </div>
  );
}
