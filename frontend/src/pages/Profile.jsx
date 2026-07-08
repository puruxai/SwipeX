import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { User, Mail, Phone, MapPin, Briefcase, DollarSign, Sparkles, Save } from 'lucide-react';

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
      console.error(err);
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
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
          <User className="w-8 h-8 text-indigo-400" />
          Candidate Profile & Skill Preferences
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Keep your skills and target role updated for accurate AI job matching.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="glass-panel p-8 rounded-3xl border border-white/10 space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">Professional Headline</label>
            <input
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              className="w-full p-3 rounded-xl glass-input text-xs font-semibold"
              placeholder="e.g. Full Stack AI Developer | React, FastAPI, Python"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">Target Role</label>
            <input
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="w-full p-3 rounded-xl glass-input text-xs font-semibold"
              placeholder="e.g. Senior Software Engineer"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full p-3 rounded-xl glass-input text-xs font-semibold"
              placeholder="San Francisco, CA"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">Expected Salary ($ / yr)</label>
            <input
              type="number"
              value={expectedSalary}
              onChange={(e) => setExpectedSalary(e.target.value)}
              className="w-full p-3 rounded-xl glass-input text-xs font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">Experience (Years)</label>
            <input
              type="number"
              step="0.5"
              value={experienceYears}
              onChange={(e) => setExperienceYears(e.target.value)}
              className="w-full p-3 rounded-xl glass-input text-xs font-semibold"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1.5">Technical & Professional Skills (Comma separated)</label>
          <input
            type="text"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            className="w-full p-3 rounded-xl glass-input text-xs font-semibold"
            placeholder="Python, React, FastAPI, TypeScript, Docker, PostgreSQL, AWS"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1.5">Professional Bio</label>
          <textarea
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full p-3 rounded-xl glass-input text-xs"
            placeholder="Write a brief overview of your technical achievements and career goals..."
          />
        </div>

        <button
          type="submit"
          className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-cyan-500 font-bold text-white rounded-xl shadow-neon-indigo hover:scale-105 transition-all text-xs flex items-center gap-2"
        >
          <Save className="w-4 h-4" /> Save Profile Changes
        </button>

      </form>

    </div>
  );
}
