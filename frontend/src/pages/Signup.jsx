import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { Sparkles, Mail, Lock, User, UserCheck, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Signup() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [role, setRole] = useState('user');
  const [loading, setLoading] = useState(false);

  const { register, googleLogin } = useAuth();
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
          document.getElementById("googleSignUpButton"),
          { theme: "outline", size: "large", width: "100%", text: "signup_with", shape: "rectangular" }
        );
      } catch (err) {
        console.error("Failed to initialize Google signup button:", err);
      }
    }
  }, [role]);

  const handleGoogleCredentialResponse = async (response) => {
    setLoading(true);
    try {
      await googleLogin(response.credential, role);
      addToast('Google Sign Up successful!', 'success');
      navigate('/swipe');
    } catch (err) {
      addToast(err.response?.data?.detail || 'Google authentication failed', 'error');
    } finally {
      setLoading(false);
    }
  };

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
    <div className="min-h-[82vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md space-y-8 glass-panel p-8 rounded-3xl border border-slate-200 dark:border-neutral-800 bg-white/90 dark:bg-neutral-900/90 shadow-2xl"
      >
        
        <div className="text-center space-y-2">
          <motion.div 
            whileHover={{ scale: 1.05, rotate: 10 }}
            className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-[#FF6B00] to-[#FF9D42] flex items-center justify-center shadow-[0_4px_20px_rgba(255,107,0,0.35)]"
          >
            <Sparkles className="w-6 h-6 text-white animate-pulse" />
          </motion.div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white">Join SwipeX</h2>
          <p className="text-xs text-slate-500 dark:text-neutral-400 font-medium">Create your account to unlock AI job matching</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300 mb-1.5">Account Role</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole('user')}
                className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  role === 'user'
                    ? 'bg-[#FF6B00]/10 border-[#FF6B00] text-[#FF6B00] dark:text-[#FF9D42] shadow-sm'
                    : 'bg-slate-50 dark:bg-neutral-800 border-slate-200 dark:border-neutral-700 text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <UserCheck className="w-4 h-4" /> Candidate
              </button>
              <button
                type="button"
                onClick={() => setRole('recruiter')}
                className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  role === 'recruiter'
                    ? 'bg-[#FF9D42]/10 border-[#FF9D42] text-[#FF6B00] dark:text-[#FF9D42] shadow-sm'
                    : 'bg-slate-50 dark:bg-neutral-800 border-slate-200 dark:border-neutral-700 text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Briefcase className="w-4 h-4" /> Recruiter
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300 mb-1.5">Full Name</label>
            <div className="relative">
              <User className="w-4.5 h-4.5 absolute left-3.5 top-3 text-slate-400 dark:text-neutral-500" />
              <input
                type="text"
                required
                minLength={2}
                maxLength={255}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 rounded-xl glass-input text-xs font-medium focus:outline-none"
                placeholder="Alex Mercer"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="w-4.5 h-4.5 absolute left-3.5 top-3 text-slate-400 dark:text-neutral-500" />
              <input
                type="email"
                required
                maxLength={255}
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
                minLength={10}
                maxLength={128}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setPasswordError(''); }}
                className={`w-full pl-11 pr-4 py-2.5 rounded-xl glass-input text-xs font-medium focus:outline-none ${passwordError ? 'border-rose-500' : ''}`}
                placeholder="Minimum 10 characters"
              />
            </div>
            {passwordError && (
              <p className="text-xs text-rose-500 mt-1 font-semibold" role="alert">{passwordError}</p>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 font-black text-xs text-white bg-gradient-to-r from-[#FF6B00] to-[#FF9D42] rounded-xl shadow-[0_4px_20px_rgba(255,107,0,0.35)] hover:shadow-[0_4px_25px_rgba(255,107,0,0.55)] transition-all flex items-center justify-center gap-2"
          >
            {loading ? 'Creating Account...' : 'Create Free Account'}
          </motion.button>
        </form>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200 dark:border-neutral-800"></div></div>
          <div className="relative flex justify-center text-[10px] uppercase font-bold"><span className="bg-white dark:bg-neutral-900 px-3 text-slate-400 dark:text-neutral-500 rounded-full border border-slate-200 dark:border-neutral-800">Or</span></div>
        </div>

        <div id="googleSignUpButton" className="w-full flex justify-center mt-1"></div>

        <p className="text-center text-xs text-slate-500 dark:text-neutral-400 font-medium">
          Already registered?{' '}
          <Link to="/login" className="text-[#FF6B00] font-bold hover:underline">
            Log In
          </Link>
        </p>

      </motion.div>
    </div>
  );
}
