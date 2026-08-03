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
    <div className="min-h-[82vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#F8F8F5] text-[#111111] transition-colors">
      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md space-y-8 depth-3d-card p-8 relative overflow-hidden"
      >
        
        <div className="text-center space-y-2">
          <motion.div 
            whileHover={{ scale: 1.05, rotate: 10 }}
            className="w-12 h-12 mx-auto rounded-2xl bg-[#7ED321] flex items-center justify-center shadow-sm"
          >
            <Sparkles className="w-6 h-6 text-white" />
          </motion.div>
          <h1 className="text-3xl font-extrabold text-[#111111]">Join SwipeX</h1>
          <p className="text-xs text-[#666666] font-medium">Create your account to unlock AI job matching</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#666666] mb-1.5">Account Role</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole('user')}
                className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  role === 'user'
                    ? 'bg-[#7ED321]/15 border-[#7ED321] text-[#59C414] shadow-sm'
                    : 'bg-white border-[#E6E6E2] text-[#666666] hover:text-[#111111]'
                }`}
              >
                <UserCheck className="w-4 h-4" /> Candidate
              </button>
              <button
                type="button"
                onClick={() => setRole('recruiter')}
                className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  role === 'recruiter'
                    ? 'bg-[#7ED321]/10 border-[#7ED321] text-[#59C414] shadow-sm'
                    : 'bg-white border-[#E6E6E2] text-[#666666] hover:text-[#111111]'
                }`}
              >
                <Briefcase className="w-4 h-4" /> Recruiter
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#666666] mb-1.5">Full Name</label>
            <div className="relative">
              <User className="w-4.5 h-4.5 absolute left-3.5 top-3.5 text-neutral-400" />
              <input
                type="text"
                required
                minLength={2}
                maxLength={255}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl depth-3d-input text-xs font-semibold text-[#111111]"
                placeholder="Alex Mercer"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#666666] mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="w-4.5 h-4.5 absolute left-3.5 top-3.5 text-neutral-400" />
              <input
                type="email"
                required
                maxLength={255}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl depth-3d-input text-xs font-semibold text-[#111111]"
                placeholder="name@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#666666] mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-4.5 h-4.5 absolute left-3.5 top-3.5 text-neutral-400" />
              <input
                type="password"
                required
                minLength={10}
                maxLength={128}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setPasswordError(''); }}
                className={`w-full pl-11 pr-4 py-3 rounded-xl depth-3d-input text-xs font-semibold text-[#111111] ${passwordError ? 'border-rose-500' : ''}`}
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
            className="depth-3d-button w-full py-3.5 text-xs font-bold flex items-center justify-center gap-2 text-white"
          >
            {loading ? 'Creating Account...' : 'Create Free Account'}
          </button>
        </form>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#E6E6E2]"></div></div>
          <div className="relative flex justify-center text-[10px] uppercase font-black tracking-widest"><span className="bg-white px-3.5 py-0.5 text-slate-400 rounded-full border border-[#E6E6E2]">Or</span></div>
        </div>

        <div id="googleSignUpButton" className="w-full flex justify-center mt-1"></div>

        <p className="text-center text-xs text-[#666666] font-semibold">
          Already registered?{' '}
          <Link to="/login" className="text-[#7ED321] font-bold hover:underline">
            Log In
          </Link>
        </p>

      </motion.div>
    </div>
  );
}
