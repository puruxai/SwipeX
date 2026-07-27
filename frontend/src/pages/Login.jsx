import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { Sparkles, Mail, Lock, LogIn, UserCheck, Briefcase, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, googleLogin } = useAuth();
  const { addToast } = useNotification();
  const navigate = useNavigate();

  useEffect(() => {
    /* global google */
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) {
      return;
    }
    if (typeof google !== 'undefined') {
      try {
        google.accounts.id.initialize({
          client_id: clientId,
          callback: handleGoogleCredentialResponse,
          cancel_on_tap_outside: false
        });
        
        google.accounts.id.renderButton(
          document.getElementById("googleSignInButton"),
          { theme: "outline", size: "large", width: "100%", text: "signin_with", shape: "rectangular" }
        );
      } catch (err) {
        console.error("Failed to initialize Google login button:", err);
      }
    }
  }, []);

  const handleGoogleCredentialResponse = async (response) => {
    setLoading(true);
    try {
      await googleLogin(response.credential);
      addToast('Google Login successful!', 'success');
      navigate('/swipe');
    } catch (err) {
      addToast(err.response?.data?.detail || 'Google authentication failed', 'error');
    } finally {
      setLoading(false);
    }
  };

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
    <div className="min-h-[82vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md space-y-8 glass-panel p-8 rounded-3xl border border-slate-200 dark:border-neutral-800 bg-white/90 dark:bg-neutral-900/90 shadow-2xl relative overflow-hidden"
      >
        
        <div className="text-center space-y-2">
          <motion.div 
            whileHover={{ scale: 1.05, rotate: 10 }}
            className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-[#FF6B00] to-[#FF9D42] flex items-center justify-center shadow-[0_4px_20px_rgba(255,107,0,0.35)]"
          >
            <Sparkles className="w-6 h-6 text-white animate-pulse" />
          </motion.div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white">Welcome Back</h2>
          <p className="text-xs text-slate-500 dark:text-neutral-400 font-medium">Sign in to continue your AI job discovery</p>
        </div>

        {/* Quick Demo Credentials Autofill */}
        <div className="p-3.5 rounded-2xl bg-[#FF6B00]/10 border border-[#FF6B00]/25 text-xs space-y-2">
          <div className="font-bold text-[#FF6B00] dark:text-[#FF9D42] flex items-center gap-1.5">
            <UserCheck className="w-4 h-4" /> Quick Demo Login Presets:
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleDemoFill('user')}
              className="py-2 px-2 bg-white dark:bg-neutral-800 hover:bg-[#FF6B00]/10 text-slate-800 dark:text-neutral-200 border border-slate-200 dark:border-neutral-700 hover:border-[#FF6B00]/30 rounded-xl font-bold text-center transition-all text-xs shadow-sm"
            >
              Candidate
            </button>
            <button
              type="button"
              onClick={() => handleDemoFill('recruiter')}
              className="py-2 px-2 bg-white dark:bg-neutral-800 hover:bg-[#FF6B00]/10 text-slate-800 dark:text-neutral-200 border border-slate-200 dark:border-neutral-700 hover:border-[#FF6B00]/30 rounded-xl font-bold text-center transition-all text-xs shadow-sm flex items-center justify-center gap-1"
            >
              <Briefcase className="w-3.5 h-3.5 text-[#FF6B00]" /> Recruiter
            </button>
            <button
              type="button"
              onClick={() => handleDemoFill('admin')}
              className="py-2 px-2 bg-white dark:bg-neutral-800 hover:bg-rose-500/10 text-slate-800 dark:text-neutral-200 border border-slate-200 dark:border-neutral-700 hover:border-rose-500/30 rounded-xl font-bold text-center transition-all text-xs shadow-sm flex items-center justify-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-rose-500" /> Admin
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="w-4.5 h-4.5 absolute left-3.5 top-3 text-slate-400 dark:text-neutral-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 rounded-xl glass-input text-xs font-medium focus:outline-none"
                placeholder="name@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-4.5 h-4.5 absolute left-3.5 top-3 text-slate-400 dark:text-neutral-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 rounded-xl glass-input text-xs font-medium focus:outline-none"
                placeholder="••••••••"
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 font-black text-xs text-white bg-gradient-to-r from-[#FF6B00] to-[#FF9D42] rounded-xl shadow-[0_4px_20px_rgba(255,107,0,0.35)] hover:shadow-[0_4px_25px_rgba(255,107,0,0.55)] transition-all flex items-center justify-center gap-2"
          >
            {loading ? 'Authenticating...' : (
              <>
                <LogIn className="w-4 h-4" /> Sign In
              </>
            )}
          </motion.button>
        </form>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200 dark:border-neutral-800"></div></div>
          <div className="relative flex justify-center text-[10px] uppercase font-bold"><span className="bg-white dark:bg-neutral-900 px-3 text-slate-400 dark:text-neutral-500 rounded-full border border-slate-200 dark:border-neutral-800">Or</span></div>
        </div>

        <div id="googleSignInButton" className="w-full flex justify-center mt-1"></div>

        <p className="text-center text-xs text-slate-500 dark:text-neutral-400 font-medium">
          Don't have an account?{' '}
          <Link to="/signup" className="text-[#FF6B00] font-bold hover:underline">
            Create an Account
          </Link>
        </p>

      </motion.div>
    </div>
  );
}
