import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { 
  User, 
  Mail, 
  MapPin, 
  Briefcase, 
  Award, 
  Save, 
  Sparkles, 
  Building2, 
  DollarSign, 
  CheckCircle2, 
  Plus, 
  Trash2 
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function Profile() {
  const { user, setUser } = useAuth();
  const { addToast } = useNotification();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [profileData, setProfileData] = useState({
    headline: 'Senior Full Stack AI Engineer',
    target_role: 'Senior AI Architect',
    location: 'San Francisco, CA',
    min_expected_salary: 160000,
    preferred_company_types: ['MNC', 'Startup'],
    skills: ['Python', 'FastAPI', 'React', 'TypeScript', 'Tailwind', 'Docker'],
    bio: 'Passionate AI software engineer with 4+ years of experience building high-concurrency cloud systems.'
  });

  const [newSkill, setNewSkill] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await API.get('/users/profile');
      if (res.data) {
        setProfileData((prev) => ({
          ...prev,
          ...res.data
        }));
      }
    } catch (err) {
      // default mock initial state retained
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await API.put('/users/profile', profileData);
      setProfileData(res.data);
      addToast('Profile updated successfully!', 'success');
    } catch (err) {
      addToast('Failed to save profile changes.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleAddSkill = () => {
    if (!newSkill.trim()) return;
    if (profileData.skills.includes(newSkill.trim())) return;
    setProfileData((prev) => ({
      ...prev,
      skills: [...prev.skills, newSkill.trim()]
    }));
    setNewSkill('');
  };

  const handleRemoveSkill = (skillToRemove) => {
    setProfileData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToRemove)
    }));
  };

  if (loading) {
    return <div className="py-20 text-center text-xs font-black text-slate-400 uppercase tracking-widest animate-pulse">Loading Candidate Profile...</div>;
  }

  return (
    <div className="py-8 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Profile Header Banner */}
      <div className="luxury-card p-8 border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 flex flex-col sm:flex-row items-center gap-6 shadow-sm">
        <img
          src={user?.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"}
          alt="User Avatar"
          className="w-24 h-24 rounded-full object-cover ring-4 ring-[#FF6B00]/30 shadow-lg"
        />

        <div className="space-y-1.5 text-center sm:text-left flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">{user?.full_name}</h1>
            <span className="px-3 py-1 rounded-full bg-[#FF6B00]/10 text-[#FF6B00] text-xs font-extrabold capitalize">
              Role: {user?.role?.replace('_', ' ')}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-bold flex items-center justify-center sm:justify-start gap-1">
            <Mail className="w-3.5 h-3.5 text-slate-400" /> {user?.email}
          </p>
          <p className="text-xs font-semibold text-[#FF6B00]">{profileData.headline}</p>
        </div>
      </div>

      {/* Main Profile Form & Preferences */}
      <form onSubmit={handleSaveProfile} className="space-y-8">
        
        {/* Basic Details */}
        <div className="luxury-card p-8 border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 space-y-6 shadow-sm">
          <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            <User className="w-5 h-5 text-[#FF6B00]" /> Career Details & Target Preferences
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Professional Headline</label>
              <input
                type="text"
                value={profileData.headline || ''}
                onChange={(e) => setProfileData({ ...profileData, headline: e.target.value })}
                className="w-full glass-input px-4 py-2.5 rounded-xl text-xs font-medium"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Target Role Title</label>
              <input
                type="text"
                value={profileData.target_role || ''}
                onChange={(e) => setProfileData({ ...profileData, target_role: e.target.value })}
                className="w-full glass-input px-4 py-2.5 rounded-xl text-xs font-medium"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Location / Remote Region</label>
              <input
                type="text"
                value={profileData.location || ''}
                onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                className="w-full glass-input px-4 py-2.5 rounded-xl text-xs font-medium"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Min Annual Salary Expectation ($)</label>
              <input
                type="number"
                value={profileData.min_expected_salary || 0}
                onChange={(e) => setProfileData({ ...profileData, min_expected_salary: parseInt(e.target.value) })}
                className="w-full glass-input px-4 py-2.5 rounded-xl text-xs font-medium"
              />
            </div>

          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Bio Summary</label>
            <textarea
              rows={3}
              value={profileData.bio || ''}
              onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
              className="w-full glass-input p-3 rounded-xl text-xs font-medium"
            />
          </div>

        </div>

        {/* Technical Skills Editor */}
        <div className="luxury-card p-8 border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 space-y-6 shadow-sm">
          <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-[#FF6B00]" /> Technical Skill Taxonomy
          </h2>

          <div className="flex gap-2 max-w-md">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Add skill (e.g. PyTorch, GraphQL)"
              className="flex-1 glass-input px-4 py-2 rounded-xl text-xs"
            />
            <button type="button" onClick={handleAddSkill} className="px-4 py-2 bg-slate-900 dark:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1">
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {profileData.skills?.map((skill, i) => (
              <span key={i} className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold flex items-center gap-2 border border-slate-200/80 dark:border-slate-700">
                {skill}
                <button type="button" onClick={() => handleRemoveSkill(skill)} className="text-slate-400 hover:text-rose-500">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>
        </div>

        <button type="submit" disabled={saving} className="btn-primary w-full py-4 text-xs font-black flex items-center justify-center gap-2 shadow-lg">
          <Save className="w-4 h-4" /> {saving ? 'Saving Profile...' : 'Save Profile Changes'}
        </button>

      </form>

    </div>
  );
}
