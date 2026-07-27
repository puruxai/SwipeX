import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { User, Mail, Phone, MapPin, Briefcase, DollarSign, Sparkles, Save, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Profile() {
  const { user } = useAuth();
  const { addToast } = useNotification();

  const [headline, setHeadline] = useState('');
  const [bio, setBio] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [expectedSalary, setExpectedSalary] = useState(120000);
  const [skills, setSkills] = useState('');
  const [experienceYears, setExperienceYears] = useState(3);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await API.get('/users/profile');
      const p = res.data;
      if (p) {
        setHeadline(p.headline || '');
        setBio(p.bio || '');
        setPhone(p.phone || '');
        setLocation(p.location || '');
        setTargetRole(p.target_role || '');
        setExpectedSalary(p.expected_salary || 120000);
        setSkills(p.skills ? p.skills.join(', ') : '');
        setExperienceYears(p.experience_years || 0);
      }
    } catch (err) {
      addToast('Unable to load your profile. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const skillsArr = skills.split(',').map(s => s.trim()).filter(Boolean);
      await API.put('/users/profile', {
        headline,
        bio,
        phone,
        location,
        target_role: targetRole,
        expected_salary: parseInt(expectedSalary),
        skills: skillsArr,
        experience_years: parseFloat(experienceYears)
      });
      addToast('Profile updated successfully!', 'success');
    } catch (err) {
      addToast('Profile update failed', 'error');
    }
  };

  return (
    <div className="py-8 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      <div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <User className="w-8 h-8 text-[#FF6B00]" />
          Candidate Profile & AI Preferences
        </h1>
        <p className="text-xs text-slate-500 dark:text-neutral-400 mt-1 font-medium">
          Keep your skills and target role updated for accurate vector AI job matching.
        </p>
      </div>

      <motion.form 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        onSubmit={handleSubmit} 
        className="glass-panel p-8 rounded-3xl border border-slate-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 space-y-6 shadow-sm"
      >
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300 mb-1.5">Professional Headline</label>
            <input
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              className="w-full p-3 rounded-xl glass-input text-xs font-medium focus:outline-none"
              placeholder="e.g. Full Stack AI Developer | React, FastAPI, Python"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300 mb-1.5">Target Role</label>
            <input
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="w-full p-3 rounded-xl glass-input text-xs font-medium focus:outline-none"
              placeholder="e.g. Senior Software Engineer"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300 mb-1.5">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full p-3 rounded-xl glass-input text-xs font-medium focus:outline-none"
              placeholder="San Francisco, CA"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300 mb-1.5">Expected Salary ($ / yr)</label>
            <input
              type="number"
              value={expectedSalary}
              onChange={(e) => setExpectedSalary(e.target.value)}
              className="w-full p-3 rounded-xl glass-input text-xs font-medium focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300 mb-1.5">Experience (Years)</label>
            <input
              type="number"
              step="0.5"
              value={experienceYears}
              onChange={(e) => setExperienceYears(e.target.value)}
              className="w-full p-3 rounded-xl glass-input text-xs font-medium focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300 mb-1.5">Technical Skills (Comma separated)</label>
          <input
            type="text"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            className="w-full p-3 rounded-xl glass-input text-xs font-medium focus:outline-none"
            placeholder="Python, React, FastAPI, TypeScript, Docker, PostgreSQL, AWS"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-neutral-300 mb-1.5">Professional Summary</label>
          <textarea
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full p-3 rounded-xl glass-input text-xs font-medium focus:outline-none"
            placeholder="Write a brief overview of your technical achievements and career goals..."
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="px-8 py-3.5 bg-gradient-to-r from-[#FF6B00] to-[#FF9D42] font-black text-xs text-white rounded-xl shadow-[0_4px_20px_rgba(255,107,0,0.35)] transition-all flex items-center gap-2"
        >
          <Save className="w-4 h-4" /> Save Profile Changes
        </motion.button>

      </motion.form>

    </div>
  );
}
