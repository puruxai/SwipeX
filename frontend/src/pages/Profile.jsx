import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import Sidebar from '../components/Sidebar';
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
  Trash2,
  Loader2 
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

  const pageVariants = {
    hidden: { opacity: 0, y: 15, filter: 'blur(6px)' },
    show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { type: 'spring', stiffness: 100 } }
  };

  if (loading) {
    return (
      <div className="flex min-h-[90vh] bg-[#fff8f6] dark:bg-[#0c1322]">
        <Sidebar />
        <div className="flex-1 p-8 flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-8 h-8 rounded-full border-4 border-[#ff6b00] dark:border-[#ffb693] border-t-transparent animate-spin" />
          <div className="text-xs font-black text-[#a04100] dark:text-[#ffb693] uppercase tracking-widest animate-pulse">
            Loading Candidate Profile...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[90vh] bg-[#fff8f6] dark:bg-[#0c1322] text-[#261812] dark:text-[#dce2f7] transition-colors">
      
      {/* Left Sidebar Shell */}
      <Sidebar />

      {/* Main Content Area Container */}
      <motion.div 
        initial="hidden"
        animate="show"
        variants={pageVariants}
        className="flex-1 p-8 lg:p-10 space-y-8"
      >
        
        {/* Profile Header Banner inside Content Canvas */}
        <div className="reference-card p-8 bg-white/95 dark:bg-[#191f2f]/95 flex flex-col sm:flex-row items-center gap-6 shadow-sm">
          <img
            src={user?.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"}
            alt="User Avatar"
            className="w-24 h-24 rounded-full object-cover ring-4 ring-[#ff6b00]/30 shadow-lg"
          />

          <div className="space-y-1.5 text-center sm:text-left flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h1 className="text-2xl font-extrabold text-[#261812] dark:text-white">{user?.full_name}</h1>
              <span className="px-3 py-1 rounded-full bg-[#ff6b00]/10 border border-[#ff6b00]/20 text-[#a04100] dark:text-[#ffb693] text-xs font-bold capitalize">
                Role: {user?.role?.replace('_', ' ')}
              </span>
            </div>
            <p className="text-xs text-[#5a4136] dark:text-[#e2bfb0]/70 font-bold flex items-center justify-center sm:justify-start gap-1">
              <Mail className="w-3.5 h-3.5 text-slate-400" /> {user?.email}
            </p>
            <p className="text-xs font-semibold text-[#ff6b00]">{profileData.headline}</p>
          </div>
        </div>

        {/* Main Profile Form & Preferences */}
        <form onSubmit={handleSaveProfile} className="space-y-8">
          
          {/* Basic Details */}
          <div className="reference-card p-8 bg-white/90 dark:bg-[#191f2f]/90 space-y-6 shadow-sm">
            <h2 className="text-lg font-bold text-[#261812] dark:text-white flex items-center gap-2">
              <User className="w-5 h-5 text-[#ff6b00]" /> Career Details & Target Preferences
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#5a4136] dark:text-[#e2bfb0]">Professional Headline</label>
                <input
                  type="text"
                  value={profileData.headline || ''}
                  onChange={(e) => setProfileData({ ...profileData, headline: e.target.value })}
                  className="w-full glass-input px-4 py-2.5 rounded-xl text-xs font-semibold bg-white/50 dark:bg-white/5 border border-[#e2bfb0] dark:border-white/10 text-[#261812] dark:text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-[#5a4136] dark:text-[#e2bfb0]">Target Role Title</label>
                <input
                  type="text"
                  value={profileData.target_role || ''}
                  onChange={(e) => setProfileData({ ...profileData, target_role: e.target.value })}
                  className="w-full glass-input px-4 py-2.5 rounded-xl text-xs font-semibold bg-white/50 dark:bg-white/5 border border-[#e2bfb0] dark:border-white/10 text-[#261812] dark:text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-[#5a4136] dark:text-[#e2bfb0]">Location / Remote Region</label>
                <input
                  type="text"
                  value={profileData.location || ''}
                  onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                  className="w-full glass-input px-4 py-2.5 rounded-xl text-xs font-semibold bg-white/50 dark:bg-white/5 border border-[#e2bfb0] dark:border-white/10 text-[#261812] dark:text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-[#5a4136] dark:text-[#e2bfb0]">Min Annual Salary Expectation ($)</label>
                <input
                  type="number"
                  value={profileData.min_expected_salary || 0}
                  onChange={(e) => setProfileData({ ...profileData, min_expected_salary: parseInt(e.target.value) })}
                  className="w-full glass-input px-4 py-2.5 rounded-xl text-xs font-semibold bg-white/50 dark:bg-white/5 border border-[#e2bfb0] dark:border-white/10 text-[#261812] dark:text-white"
                />
              </div>

            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-[#5a4136] dark:text-[#e2bfb0]">Bio Summary</label>
              <textarea
                rows={3}
                value={profileData.bio || ''}
                onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                className="w-full glass-input p-3.5 rounded-xl text-xs font-semibold bg-white/50 dark:bg-white/5 border border-[#e2bfb0] dark:border-white/10 text-[#261812] dark:text-white"
              />
            </div>

          </div>

          {/* Technical Skills Editor */}
          <div className="reference-card p-8 bg-white/90 dark:bg-[#191f2f]/90 space-y-6 shadow-sm">
            <h2 className="text-lg font-bold text-[#261812] dark:text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-[#ff6b00]" /> Technical Skill Taxonomy
            </h2>

            <div className="flex gap-2 max-w-md">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Add skill (e.g. PyTorch, GraphQL)"
                className="flex-1 glass-input px-4 py-2.5 rounded-xl text-xs bg-white/50 dark:bg-white/5 border border-[#e2bfb0] dark:border-white/10 text-[#261812] dark:text-white"
              />
              <button type="button" onClick={handleAddSkill} className="btn-terracotta px-5 py-2.5 text-xs font-bold flex items-center gap-1.5 shadow-md">
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {profileData.skills?.map((skill, i) => (
                <span key={i} className="px-3.5 py-2 rounded-xl bg-white/40 dark:bg-white/5 border border-[#e2bfb0]/30 dark:border-white/5 text-[#5a4136] dark:text-[#e2bfb0] text-xs font-bold flex items-center gap-2">
                  {skill}
                  <button type="button" onClick={() => handleRemoveSkill(skill)} className="text-slate-400 hover:text-rose-500">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <button type="submit" disabled={saving} className="btn-terracotta w-full py-4 text-xs font-black flex items-center justify-center gap-2 shadow-lg">
            <Save className="w-4 h-4" /> {saving ? 'Saving Profile...' : 'Save Profile Changes'}
          </button>

        </form>

      </motion.div>

      <div className="hidden">
        <MapPin className="w-1" />
        <Briefcase className="w-1" />
        <Building2 className="w-1" />
        <DollarSign className="w-1" />
        <CheckCircle2 className="w-1" />
        <Sparkles className="w-1" />
      </div>

    </div>
  );
}
