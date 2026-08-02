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
    <div className="min-h-[82vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#fff8f6] dark:bg-[#0c1322] text-[#261812] dark:text-[#dce2f7] transition-colors">
      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md space-y-8 reference-card p-8 bg-white dark:bg-[#191f2f]/85 relative overflow-hidden"
      >
        
        <div className="text-center space-y-2">
          <motion.div 
            whileHover={{ scale: 1.05, rotate: 10 }}
            className="w-12 h-12 mx-auto rounded-2xl bg-[#ff6b00] dark:bg-[#ffb693] flex items-center justify-center shadow-lg"
          >
            <Sparkles className="w-6 h-6 text-white dark:text-[#561f00] animate-pulse" />
          </motion.div>
          <h2 className="text-3xl font-extrabold text-[#261812] dark:text-white">Join SwipeX</h2>
          <p className="text-xs text-[#5a4136] dark:text-[#e2bfb0] font-medium">Create your account to unlock AI job matching</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#5a4136] dark:text-[#e2bfb0] mb-1.5">Account Role</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole('user')}
                className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  role === 'user'
                    ? 'bg-[#ff6b00]/10 border-[#ff6b00] text-[#a04100] dark:text-[#ffb693] shadow-sm'
                    : 'bg-white/40 dark:bg-white/5 border-[#e2bfb0]/40 dark:border-white/10 text-[#5a4136] dark:text-[#e2bfb0] hover:text-[#261812] dark:hover:text-white'
                }`}
              >
                <UserCheck className="w-4 h-4" /> Candidate
              </button>
              <button
                type="button"
                onClick={() => setRole('recruiter')}
                className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  role === 'recruiter'
                    ? 'bg-[#ffb693]/10 border-[#ffb693] text-[#a04100] dark:text-[#ffb693] shadow-sm'
                    : 'bg-white/40 dark:bg-white/5 border-[#e2bfb0]/40 dark:border-white/10 text-[#5a4136] dark:text-[#e2bfb0] hover:text-[#261812] dark:hover:text-white'
                }`}
              >
                <Briefcase className="w-4 h-4" /> Recruiter
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#5a4136] dark:text-[#e2bfb0] mb-1.5">Full Name</label>
            <div className="relative">
              <User className="w-4.5 h-4.5 absolute left-3.5 top-3.5 text-[#5a4136] dark:text-[#e2bfb0]/70" />
              <input
                type="text"
                required
                minLength={2}
                maxLength={255}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl glass-input text-xs font-semibold bg-white/50 dark:bg-white/5 border border-[#e2bfb0] dark:border-white/10 text-[#261812] dark:text-white"
                placeholder="Alex Mercer"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#5a4136] dark:text-[#e2bfb0] mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="w-4.5 h-4.5 absolute left-3.5 top-3.5 text-[#5a4136] dark:text-[#e2bfb0]/70" />
              <input
                type="email"
                required
                maxLength={255}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl glass-input text-xs font-semibold bg-white/50 dark:bg-white/5 border border-[#e2bfb0] dark:border-white/10 text-[#261812] dark:text-white"
                placeholder="name@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#5a4136] dark:text-[#e2bfb0] mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-4.5 h-4.5 absolute left-3.5 top-3.5 text-[#5a4136] dark:text-[#e2bfb0]/70" />
              <input
                type="password"
                required
                minLength={10}
                maxLength={128}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setPasswordError(''); }}
                className={`w-full pl-11 pr-4 py-3 rounded-xl glass-input text-xs font-semibold bg-white/50 dark:bg-white/5 border border-[#e2bfb0] dark:border-white/10 text-[#261812] dark:text-white ${passwordError ? 'border-rose-500' : ''}`}
                placeholder="Minimum 10 characters"
              />
            </div>
            {passwordError && (
              <p className="text-xs text-rose-500 mt-1 font-semibold" role="alert">{passwordError}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-terracotta w-full py-3.5 text-xs font-black shadow-md flex items-center justify-center gap-2"
          >
            {loading ? 'Creating Account...' : 'Create Free Account'}
          </button>
        </form>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#e2bfb0]/30 dark:border-white/5"></div></div>
          <div className="relative flex justify-center text-[10px] uppercase font-black tracking-widest"><span className="bg-white dark:bg-[#191f2f] px-3.5 py-0.5 text-slate-400 dark:text-neutral-500 rounded-full border border-[#e2bfb0]/30 dark:border-white/5">Or</span></div>
        </div>

        <div id="googleSignUpButton" className="w-full flex justify-center mt-1"></div>

        <p className="text-center text-xs text-[#5a4136] dark:text-[#e2bfb0] font-semibold">
          Already registered?{' '}
          <Link to="/login" className="text-[#ff6b00] dark:text-[#ffb693] font-bold hover:underline">
            Log In
          </Link>
        </p>

      </motion.div>
    </div>
  );
}
