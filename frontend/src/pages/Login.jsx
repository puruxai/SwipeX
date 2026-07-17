import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { Sparkles, Mail, Lock, LogIn, UserCheck, Briefcase, ShieldCheck } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const { addToast } = useNotification();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      addToast('Successfully signed in!', 'success');
      navigate('/swipe');
    } catch (err) {
      addToast(err.response?.data?.detail || 'Invalid credentials', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = (roleType) => {
    if (roleType === 'user') {
      setEmail('alex@swipex.io');
      setPassword('Password123!');
    } else if (roleType === 'recruiter') {
      setEmail('recruiter@techcorp.com');
      setPassword('Password123!');
    } else if (roleType === 'admin') {
      setEmail('admin@swipex.io');
      setPassword('Password123!');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 glass-panel p-8 rounded-3xl border border-[#262626] bg-[#181818]/80 shadow-2xl relative overflow-hidden">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-[#FF6B00] to-[#FF8A3D] flex items-center justify-center shadow-[0_4px_15px_rgba(255,107,0,0.35)]">
            <Sparkles className="w-6 h-6 text-white animate-pulse" />
          </div>
          <h2 className="text-3xl font-extrabold text-white">Welcome Back</h2>
          <p className="text-sm text-[#A8A8A8]">Sign in to continue your swipe job discovery</p>
        </div>

        {/* Quick Demo Credentials Autofill */}
        <div className="p-3 rounded-2xl bg-[#FF6B00]/10 border border-[#FF6B00]/25 text-xs space-y-2">
          <div className="font-bold text-[#FF8A3D] flex items-center gap-1.5">
            <UserCheck className="w-4 h-4" /> Quick Demo Login Preset:
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={() => handleDemoFill('user')}
              className="py-1.5 px-2 bg-[#FF6B00]/10 hover:bg-[#FF6B00]/25 text-[#FF8A3D] rounded-lg font-bold text-center transition-colors"
            >
              Candidate
            </button>
            <button
              type="button"
              onClick={() => handleDemoFill('recruiter')}
              className="py-1.5 px-2 bg-[#FF8A3D]/10 hover:bg-[#FF8A3D]/25 text-[#FF8A3D] rounded-lg font-bold text-center transition-colors flex items-center justify-center gap-1"
            >
              <Briefcase className="w-3 h-3" /> Recruiter
            </button>
            <button
              type="button"
              onClick={() => handleDemoFill('admin')}
              className="py-1.5 px-2 bg-rose-500/10 hover:bg-rose-500/25 text-rose-400 rounded-lg font-bold text-center transition-colors flex items-center justify-center gap-1"
            >
              <ShieldCheck className="w-3 h-3" /> Admin
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#A8A8A8] mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="w-5 h-5 absolute left-3 top-3 text-[#A8A8A8]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm focus:outline-none"
                placeholder="name@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#A8A8A8] mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-5 h-5 absolute left-3 top-3 text-[#A8A8A8]" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm focus:outline-none"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 font-bold text-white bg-gradient-to-r from-[#FF6B00] to-[#FF8A3D] rounded-xl shadow-[0_4px_15px_rgba(255,107,0,0.35)] hover:shadow-[0_4px_25px_rgba(255,107,0,0.55)] transition-all flex items-center justify-center gap-2 hover:scale-[1.02]"
          >
            {loading ? 'Authenticating...' : (
              <>
                <LogIn className="w-4 h-4" /> Sign In
              </>
            )}
          </button>
        </form>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#262626]"></div></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="bg-[#121212] px-3 text-[#A8A8A8] rounded-full border border-[#262626]">Or</span></div>
        </div>

        <button
          type="button"
          disabled
          title="Google sign-in will be available when the identity provider is configured."
          className="w-full py-2.5 px-4 glass-panel text-sm font-semibold text-slate-500 rounded-xl flex items-center justify-center gap-2 border border-[#262626] cursor-not-allowed"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          Google sign-in — coming soon
        </button>

        <p className="text-center text-xs text-[#A8A8A8]">
          Don't have an account?{' '}
          <Link to="/signup" className="text-[#FF6B00] font-bold hover:underline">
            Create an Account
          </Link>
        </p>

      </div>
    </div>
  );
}
