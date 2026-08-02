import React, { useState } from 'react';
import API from '../services/api';
import { useNotification } from '../context/NotificationContext';
import Sidebar from '../components/Sidebar';
import { 
  Bot, 
  Sparkles, 
  Compass, 
  DollarSign, 
  Send, 
  CheckCircle2, 
  HelpCircle, 
  Layers,
  ArrowRight,
  TrendingUp,
  BrainCircuit,
  MessageSquare,
  Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function AICareerHub() {
  const { addToast } = useNotification();
  const [activeTab, setActiveTab] = useState('coach'); // 'coach' | 'interview' | 'salary' | 'roadmap'

  // Career Coach Chat State
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'ai',
      text: "Hello! I'm your SwipeX AI Career Coach. Ask me anything about resume optimization, interview tactics, or career growth strategies."
    }
  ]);
  const [chatLoading, setChatLoading] = useState(false);

  // Interview Practice State
  const [interviewRole, setInterviewRole] = useState('Full Stack AI Engineer');
  const [interviewQuestion, setInterviewQuestion] = useState('Tell me about a time you solved a complex technical bottleneck under a tight deadline.');
  const [userAnswer, setUserAnswer] = useState('');
  const [interviewEval, setInterviewEval] = useState(null);
  const [interviewLoading, setInterviewLoading] = useState(false);

  // Salary Predictor State
  const [salaryForm, setSalaryForm] = useState({
    title: 'Senior Frontend Engineer',
    skills: 'React, TypeScript, Tailwind, Framer Motion',
    experience_years: 4,
    location: 'Remote / US',
    company_type: 'Startup'
  });
  const [salaryResult, setSalaryResult] = useState(null);
  const [salaryLoading, setSalaryLoading] = useState(false);

  // Career Roadmap State
  const [roadmapForm, setRoadmapForm] = useState({
    current_role: 'Frontend Developer',
    target_role: 'Lead AI Engineer'
  });
  const [roadmapResult, setRoadmapResult] = useState(null);
  const [roadmapLoading, setRoadmapLoading] = useState(false);

  // Handler for Coach Chat
  const handleSendChatMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput;
    setChatMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setChatInput('');
    setChatLoading(true);

    try {
      const res = await API.post('/ai/coaching/chat', { message: userText });
      setChatMessages((prev) => [...prev, { sender: 'ai', text: res.data.response }]);
    } catch (err) {
      addToast('Failed to reach AI Coach. Please try again.', 'error');
    } finally {
      setChatLoading(false);
    }
  };

  // Handler for Interview Evaluation
  const handleEvaluateAnswer = async (e) => {
    e.preventDefault();
    if (!userAnswer.trim()) return;

    setInterviewLoading(true);
    try {
      const res = await API.post('/ai/coaching/interview/answer', {
        question: interviewQuestion,
        answer: userAnswer
      });
      setInterviewEval(res.data);
      addToast('STAR Method analysis completed!', 'success');
    } catch (err) {
      addToast('Failed to evaluate answer.', 'error');
    } finally {
      setInterviewLoading(false);
    }
  };

  // Handler for Salary Prediction
  const handlePredictSalary = async (e) => {
    e.preventDefault();
    setSalaryLoading(true);
    try {
      const skillsArray = salaryForm.skills.split(',').map((s) => s.trim()).filter(Boolean);
      const res = await API.post('/ai/salary-predict', {
        title: salaryForm.title,
        skills: skillsArray,
        experience_years: parseFloat(salaryForm.experience_years),
        location: salaryForm.location,
        company_type: salaryForm.company_type
      });
      setSalaryResult(res.data);
    } catch (err) {
      addToast('Salary prediction failed.', 'error');
    } finally {
      setSalaryLoading(false);
    }
  };

  // Handler for Career Roadmap
  const handleGenerateRoadmap = async (e) => {
    e.preventDefault();
    setRoadmapLoading(true);
    try {
      const res = await API.post('/ai/career-roadmap', {
        current_role: roadmapForm.current_role,
        target_role: roadmapForm.target_role
      });
      setRoadmapResult(res.data);
    } catch (err) {
      addToast('Roadmap generation failed.', 'error');
    } finally {
      setRoadmapLoading(false);
    }
  };

  // Stagger entry configurations
  const pageVariants = {
    hidden: { opacity: 0, y: 15, filter: 'blur(6px)' },
    show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { type: 'spring', stiffness: 100 } }
  };

  return (
    <div className="flex min-h-[90vh] bg-[#fff8f6] dark:bg-[#0c1322] text-[#261812] dark:text-[#dce2f7] transition-colors">
      
      {/* Left Sidebar Menu */}
      <Sidebar />

      {/* Main Content Area Container */}
      <motion.div 
        initial="hidden"
        animate="show"
        variants={pageVariants}
        className="flex-1 p-8 lg:p-10 space-y-8"
      >
        
        {/* Page Header inside Content Canvas */}
        <div className="flex justify-between items-end border-b border-[#e2bfb0]/30 dark:border-white/5 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ff6b00]/10 border border-[#ff6b00]/20 text-[#a04100] dark:text-[#ffb693] text-[10px] font-black uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" /> Generative AI Intelligence
            </div>
            <h1 className="text-3xl font-extrabold text-[#261812] dark:text-white tracking-tight flex items-center gap-3">
              <BrainCircuit className="w-8 h-8 text-[#ff6b00] dark:text-[#ffb693]" />
              SwipeX AI Career Studio
            </h1>
            <p className="text-xs text-[#5a4136] dark:text-[#e2bfb0] mt-1.5 font-medium max-w-2xl">
              Real-time AI Career Coach, STAR-method interview practice simulator, salary prediction engine, and skill milestone roadmaps.
            </p>
          </div>
        </div>

        {/* Studio Tabs Navigation */}
        <div className="flex flex-wrap gap-2.5 border-b border-[#e2bfb0]/20 dark:border-white/5 pb-3">
          <button
            onClick={() => setActiveTab('coach')}
            className={`flex items-center gap-2 px-4.5 py-3 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'coach'
                ? 'bg-[#ff6b00] dark:bg-[#ffb693] text-white dark:text-[#561f00] shadow-md shadow-[#ff6b00]/10'
                : 'bg-white/40 dark:bg-white/5 text-[#5a4136] dark:text-[#e2bfb0] border border-[#e2bfb0]/40 dark:border-white/10 hover:bg-[#fff1eb] dark:hover:bg-white/10'
            }`}
          >
            <Bot className="w-4 h-4" /> AI Career Coach
          </button>

          <button
            onClick={() => setActiveTab('interview')}
            className={`flex items-center gap-2 px-4.5 py-3 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'interview'
                ? 'bg-[#ff6b00] dark:bg-[#ffb693] text-white dark:text-[#561f00] shadow-md shadow-[#ff6b00]/10'
                : 'bg-white/40 dark:bg-white/5 text-[#5a4136] dark:text-[#e2bfb0] border border-[#e2bfb0]/40 dark:border-white/10 hover:bg-[#fff1eb] dark:hover:bg-white/10'
            }`}
          >
            <HelpCircle className="w-4 h-4" /> Interview Coach
          </button>

          <button
            onClick={() => setActiveTab('salary')}
            className={`flex items-center gap-2 px-4.5 py-3 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'salary'
                ? 'bg-[#ff6b00] dark:bg-[#ffb693] text-white dark:text-[#561f00] shadow-md shadow-[#ff6b00]/10'
                : 'bg-white/40 dark:bg-white/5 text-[#5a4136] dark:text-[#e2bfb0] border border-[#e2bfb0]/40 dark:border-white/10 hover:bg-[#fff1eb] dark:hover:bg-white/10'
            }`}
          >
            <DollarSign className="w-4 h-4" /> Salary Predictor
          </button>

          <button
            onClick={() => setActiveTab('roadmap')}
            className={`flex items-center gap-2 px-4.5 py-3 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'roadmap'
                ? 'bg-[#ff6b00] dark:bg-[#ffb693] text-white dark:text-[#561f00] shadow-md shadow-[#ff6b00]/10'
                : 'bg-white/40 dark:bg-white/5 text-[#5a4136] dark:text-[#e2bfb0] border border-[#e2bfb0]/40 dark:border-white/10 hover:bg-[#fff1eb] dark:hover:bg-white/10'
            }`}
          >
            <Compass className="w-4 h-4" /> Skill Roadmap
          </button>
        </div>

        {/* Tab content renders */}
        <div className="min-h-[50vh]">
          {activeTab === 'coach' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="reference-card p-8 space-y-6 bg-white dark:bg-[#191f2f]/85">
              <div className="flex items-center gap-3 border-b border-[#e2bfb0]/30 dark:border-white/5 pb-5">
                <div className="w-10 h-10 rounded-2xl bg-[#ff6b00]/10 border border-[#ff6b00]/20 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-[#ff6b00]" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-[#261812] dark:text-white">AI Career Strategy Coach</h2>
                  <p className="text-xs text-[#5a4136] dark:text-[#e2bfb0] font-semibold mt-0.5">Get personalized feedback on resume alignment, job targets, and negotiation strategies.</p>
                </div>
              </div>

              <div className="h-96 overflow-y-auto space-y-4 pr-2">
                {chatMessages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xl p-4.5 rounded-3xl text-xs font-bold leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-[#ff6b00] dark:bg-[#ffb693] text-white dark:text-[#561f00] rounded-br-none shadow-md'
                        : 'bg-white/40 dark:bg-white/5 text-[#261812] dark:text-[#dce2f7] rounded-bl-none border border-[#e2bfb0]/40 dark:border-white/5'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {chatLoading && (
                  <div className="flex justify-start">
                    <div className="bg-[#ff6b00]/5 border border-[#ff6b00]/10 p-4.5 rounded-3xl rounded-bl-none text-xs font-bold text-[#ff6b00]/70 animate-pulse flex items-center gap-2">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> AI Coach is formulating career strategy...
                    </div>
                  </div>
                )}
              </div>

              <form onSubmit={handleSendChatMessage} className="flex gap-3 pt-3 border-t border-[#e2bfb0]/20 dark:border-white/5">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask AI Coach for advice e.g. How do I highlight system architecture skills?"
                  className="flex-1 glass-input px-5 py-4 rounded-2xl text-xs font-semibold bg-white/50 dark:bg-white/5 border border-[#e2bfb0] dark:border-white/10 text-[#261812] dark:text-white"
                />
                <button type="submit" disabled={chatLoading} className="btn-terracotta px-8 py-4 flex items-center gap-2">
                  <Send className="w-4 h-4" /> Send Advice Request
                </button>
              </form>
            </motion.div>
          )}

          {activeTab === 'interview' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="reference-card p-8 space-y-5 bg-white dark:bg-[#191f2f]/85">
                <h2 className="text-base font-extrabold text-[#261812] dark:text-white flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-[#ff6b00]" /> STAR Method Interview Simulator
                </h2>
                <p className="text-xs text-[#5a4136] dark:text-[#e2bfb0] font-semibold">Practice your response and receive instant automated scoring based on Situation, Task, Action, and Result.</p>

                <div className="space-y-2">
                  <label className="block text-[10px] font-black uppercase text-[#5a4136] dark:text-[#e2bfb0] tracking-wider">Target Role Title</label>
                  <input
                    type="text"
                    value={interviewRole}
                    onChange={(e) => setInterviewRole(e.target.value)}
                    className="w-full glass-input px-4 py-3 rounded-xl text-xs bg-white/40 dark:bg-white/5 border border-[#e2bfb0] dark:border-white/10 text-[#261812] dark:text-white"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-black uppercase text-[#5a4136] dark:text-[#e2bfb0] tracking-wider">Interview Question Prompt</label>
                  <textarea
                    value={interviewQuestion}
                    onChange={(e) => setInterviewQuestion(e.target.value)}
                    rows={2}
                    className="w-full glass-input p-4 rounded-xl text-xs font-semibold bg-white/40 dark:bg-white/5 border border-[#e2bfb0] dark:border-white/10 text-[#261812] dark:text-white"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-black uppercase text-[#5a4136] dark:text-[#e2bfb0] tracking-wider">Your Response (STAR Format)</label>
                  <textarea
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="In my previous project at Tech Corp, I was tasked with reducing API latency (Situation/Task). I implemented Redis caching and optimized SQL queries (Action), reducing response times by 45% (Result)."
                    rows={5}
                    className="w-full glass-input p-4 rounded-xl text-xs font-semibold bg-white/40 dark:bg-white/5 border border-[#e2bfb0] dark:border-white/10 text-[#261812] dark:text-white"
                  />
                </div>

                <button onClick={handleEvaluateAnswer} disabled={interviewLoading} className="w-full btn-terracotta py-4 text-xs font-black shadow-md flex items-center justify-center gap-2">
                  {interviewLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Evaluating Answer...
                    </>
                  ) : (
                    'Evaluate Answer with STAR Framework'
                  )}
                </button>
              </div>

              {/* Feedback Display */}
              <div className="reference-card p-8 space-y-5 bg-white dark:bg-[#191f2f]/85 flex flex-col justify-between">
                <h3 className="text-base font-extrabold text-[#261812] dark:text-white flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" /> STAR Evaluation Feedback
                </h3>

                {interviewEval ? (
                  <div className="space-y-5 flex-1 flex flex-col justify-between">
                    <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                      <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest block">STAR SCORE</span>
                      <span className="text-5xl font-black text-emerald-600 dark:text-emerald-400 mt-1 block">{interviewEval.score} / 100</span>
                    </div>
                    <div className="p-5 rounded-2xl bg-white/50 dark:bg-white/5 border border-[#e2bfb0]/30 dark:border-white/5 text-xs font-bold leading-relaxed text-[#261812] dark:text-[#dce2f7]">
                      {interviewEval.evaluation}
                    </div>
                  </div>
                ) : (
                  <div className="py-24 text-center text-xs font-bold text-[#5a4136] dark:text-[#e2bfb0]/60 flex-1 flex items-center justify-center">
                    Submit your STAR formatted response on the left to activate neural feedback evaluations.
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'salary' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <form onSubmit={handlePredictSalary} className="reference-card p-8 space-y-5 bg-white dark:bg-[#191f2f]/85">
                <h2 className="text-base font-extrabold text-[#261812] dark:text-white flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-[#ff6b00]" /> AI Compensation Predictor
                </h2>
                <p className="text-xs text-[#5a4136] dark:text-[#e2bfb0] font-semibold">Calculates estimated compensation based on target title, skill density, experience level, and company stage.</p>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-[#5a4136] dark:text-[#e2bfb0] tracking-wider">Job Title</label>
                  <input
                    type="text"
                    value={salaryForm.title}
                    onChange={(e) => setSalaryForm({ ...salaryForm, title: e.target.value })}
                    className="w-full glass-input px-4 py-3 rounded-xl text-xs bg-white/40 dark:bg-white/5 border border-[#e2bfb0] dark:border-white/10 text-[#261812] dark:text-white"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-[#5a4136] dark:text-[#e2bfb0] tracking-wider">Key Skills (Comma-separated)</label>
                  <input
                    type="text"
                    value={salaryForm.skills}
                    onChange={(e) => setSalaryForm({ ...salaryForm, skills: e.target.value })}
                    className="w-full glass-input px-4 py-3 rounded-xl text-xs bg-white/40 dark:bg-white/5 border border-[#e2bfb0] dark:border-white/10 text-[#261812] dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-[#5a4136] dark:text-[#e2bfb0] tracking-wider">Years of Exp</label>
                    <input
                      type="number"
                      step="0.5"
                      value={salaryForm.experience_years}
                      onChange={(e) => setSalaryForm({ ...salaryForm, experience_years: e.target.value })}
                      className="w-full glass-input px-4 py-3 rounded-xl text-xs bg-white/40 dark:bg-white/5 border border-[#e2bfb0] dark:border-white/10 text-[#261812] dark:text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-[#5a4136] dark:text-[#e2bfb0] tracking-wider">Company Type</label>
                    <select
                      value={salaryForm.company_type}
                      onChange={(e) => setSalaryForm({ ...salaryForm, company_type: e.target.value })}
                      className="w-full glass-input px-4 py-3 rounded-xl text-xs bg-white/40 dark:bg-white/5 border border-[#e2bfb0] dark:border-white/10 text-[#261812] dark:text-white"
                    >
                      <option value="MNC">MNC / Enterprise</option>
                      <option value="Startup">Growth Startup</option>
                      <option value="Newly Founded Startup">Early Startup</option>
                    </select>
                  </div>
                </div>

                <button type="submit" disabled={salaryLoading} className="w-full btn-terracotta py-4 text-xs font-black shadow-md flex items-center justify-center gap-2">
                  {salaryLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Calculating Market Rate...
                    </>
                  ) : (
                    'Estimate Salary Range'
                  )}
                </button>
              </form>

              {/* Salary Output */}
              <div className="reference-card p-8 space-y-6 bg-white dark:bg-[#191f2f]/85 flex flex-col justify-center text-center">
                {salaryResult ? (
                  <div className="space-y-6">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-black">
                      <TrendingUp className="w-4 h-4" /> Market Estimation Ready
                    </div>
                    <div>
                      <span className="text-[10px] text-[#5a4136] dark:text-[#e2bfb0] uppercase font-black tracking-widest block mb-1">Estimated Annual Salary</span>
                      <span className="text-4xl font-black text-[#261812] dark:text-white">
                        ${salaryResult.estimated_min?.toLocaleString()} - ${salaryResult.estimated_max?.toLocaleString()}
                      </span>
                      <span className="text-[11px] font-bold text-[#5a4136] dark:text-[#e2bfb0] block mt-1.5">Median: ${salaryResult.median_salary?.toLocaleString()} USD / year</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/40 dark:bg-white/5 border border-[#e2bfb0]/20 dark:border-white/10 text-xs text-[#5a4136] dark:text-[#e2bfb0] text-left space-y-1">
                      <span className="font-bold text-[#ff6b00] block">AI Market Rationale:</span>
                      <p>{salaryResult.rationale}</p>
                    </div>
                  </div>
                ) : (
                  <div className="py-24 text-center text-xs font-bold text-[#5a4136] dark:text-[#e2bfb0]/60">
                    Enter your title and skills to generate an AI market salary report.
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'roadmap' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="reference-card p-8 space-y-6 bg-white dark:bg-[#191f2f]/85">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e2bfb0]/30 dark:border-white/5 pb-5">
                <div>
                  <h2 className="text-base font-extrabold text-[#261812] dark:text-white flex items-center gap-2">
                    <Compass className="w-5 h-5 text-[#ff6b00]" /> Skill Milestone Roadmap Generator
                  </h2>
                  <p className="text-xs text-[#5a4136] dark:text-[#e2bfb0] font-semibold mt-0.5">Maps step-by-step skill progression from your current baseline to target senior roles.</p>
                </div>
              </div>

              <form onSubmit={handleGenerateRoadmap} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <input
                  type="text"
                  value={roadmapForm.current_role}
                  onChange={(e) => setRoadmapForm({ ...roadmapForm, current_role: e.target.value })}
                  placeholder="Current Role (e.g. Software Developer)"
                  className="glass-input px-4 py-3.5 rounded-xl text-xs font-semibold bg-white/40 dark:bg-white/5 border border-[#e2bfb0] dark:border-white/10 text-[#261812] dark:text-white"
                />
                <input
                  type="text"
                  value={roadmapForm.target_role}
                  onChange={(e) => setRoadmapForm({ ...roadmapForm, target_role: e.target.value })}
                  placeholder="Target Role (e.g. AI Architect)"
                  className="glass-input px-4 py-3.5 rounded-xl text-xs font-semibold bg-white/40 dark:bg-white/5 border border-[#e2bfb0] dark:border-white/10 text-[#261812] dark:text-white"
                />
                <button type="submit" disabled={roadmapLoading} className="btn-terracotta py-3.5 text-xs font-black shadow-md flex items-center justify-center">
                  {roadmapLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" /> Generating Milestones...
                    </>
                  ) : (
                    'Generate Roadmap'
                  )}
                </button>
              </form>

              {roadmapResult && (
                <div className="space-y-4 pt-5 border-t border-[#e2bfb0]/20 dark:border-white/5">
                  <h3 className="text-xs font-black text-[#ff6b00] uppercase tracking-widest">Milestone Progression Plan</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {roadmapResult.milestones?.map((m, idx) => (
                      <div key={idx} className="p-5 rounded-2xl bg-white/40 dark:bg-white/5 border border-[#e2bfb0]/30 dark:border-white/5 space-y-2">
                        <div className="w-8 h-8 rounded-xl bg-[#ff6b00]/10 text-[#ff6b00] font-black text-xs flex items-center justify-center border border-[#ff6b00]/20">
                          0{idx + 1}
                        </div>
                        <h4 className="text-xs font-bold text-[#261812] dark:text-white">{m.phase || m.title}</h4>
                        <p className="text-[11px] text-[#5a4136] dark:text-[#e2bfb0] leading-relaxed font-semibold">{m.description || m.action_plan}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>

      </motion.div>

    </div>
  );
}
