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

  const pageVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <div className="flex min-h-[90vh] bg-[#F8F8F5] text-[#111111] transition-colors">
      
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
        <div className="flex justify-between items-end border-b border-[#E6E6E2] pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#7ED321]/15 text-[#59C414] text-[9px] font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" /> Generative AI Intelligence
            </div>
            <h1 className="text-2xl font-extrabold text-[#111111] tracking-tight flex items-center gap-2.5">
              <BrainCircuit className="w-7 h-7 text-[#7ED321]" />
              SwipeX AI Career Studio
            </h1>
            <p className="text-xs text-[#666666] mt-0.5 font-medium max-w-2xl">
              Real-time AI Career Coach, STAR-method interview practice simulator, salary prediction engine, and skill milestone roadmaps.
            </p>
          </div>
        </div>

        {/* Studio Tabs Navigation */}
        <div className="flex flex-wrap gap-2 border-b border-neutral-100 pb-3">
          <button
            onClick={() => setActiveTab('coach')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'coach'
                ? 'bg-[#7ED321] text-white shadow-sm'
                : 'bg-white text-[#666666] border border-[#E6E6E2] hover:bg-[#F0F0EB]'
            }`}
          >
            <Bot className="w-3.5 h-3.5" /> AI Career Coach
          </button>

          <button
            onClick={() => setActiveTab('interview')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'interview'
                ? 'bg-[#7ED321] text-white shadow-sm'
                : 'bg-white text-[#666666] border border-[#E6E6E2] hover:bg-[#F0F0EB]'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" /> Interview Coach
          </button>

          <button
            onClick={() => setActiveTab('salary')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'salary'
                ? 'bg-[#7ED321] text-white shadow-sm'
                : 'bg-white text-[#666666] border border-[#E6E6E2] hover:bg-[#F0F0EB]'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" /> Salary Predictor
          </button>

          <button
            onClick={() => setActiveTab('roadmap')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'roadmap'
                ? 'bg-[#7ED321] text-white shadow-sm'
                : 'bg-white text-[#666666] border border-[#E6E6E2] hover:bg-[#F0F0EB]'
            }`}
          >
            <Compass className="w-3.5 h-3.5" /> Skill Roadmap
          </button>
        </div>

        {/* Tab content renders */}
        <div className="min-h-[50vh]">
          {activeTab === 'coach' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="depth-3d-card p-6 space-y-4">
              <div className="flex items-center gap-3 border-b border-neutral-100 pb-4">
                <div className="w-9 h-9 rounded-xl bg-[#7ED321]/15 flex items-center justify-center">
                  <Bot className="w-4.5 h-4.5 text-[#59C414]" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-[#111111]">AI Career Strategy Coach</h2>
                  <p className="text-[11px] text-[#666666] font-medium mt-0.5">Get personalized feedback on resume alignment, job targets, and negotiation strategies.</p>
                </div>
              </div>

              <div className="h-80 overflow-y-auto space-y-3.5 pr-2">
                {chatMessages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xl p-3.5 rounded-xl text-xs font-semibold leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-[#7ED321] text-white rounded-br-none shadow-sm'
                        : 'bg-[#F8F8F5] text-[#111111] rounded-bl-none border border-[#E6E6E2]'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {chatLoading && (
                  <div className="flex justify-start">
                    <div className="bg-[#7ED321]/5 border border-[#7ED321]/10 p-3.5 rounded-xl rounded-bl-none text-xs font-bold text-[#59C414]/70 animate-pulse flex items-center gap-2">
                      <Loader2 className="w-3 h-3 animate-spin" /> AI Coach is formulating career strategy...
                    </div>
                  </div>
                )}
              </div>

              <form onSubmit={handleSendChatMessage} className="flex gap-2.5 pt-3 border-t border-neutral-100">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask AI Coach for advice e.g. How do I highlight system architecture skills?"
                  className="flex-1 depth-3d-input px-4 py-2.5 text-xs font-semibold text-[#111111]"
                />
                <button type="submit" disabled={chatLoading} className="depth-3d-button px-6 py-2.5 text-xs font-bold flex items-center gap-1.5 text-white">
                  <Send className="w-3.5 h-3.5" /> Send Advice Request
                </button>
              </form>
            </motion.div>
          )}

          {activeTab === 'interview' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="depth-3d-card p-6 space-y-4">
                <h2 className="text-sm font-bold text-[#111111] flex items-center gap-2">
                  <HelpCircle className="w-4.5 h-4.5 text-[#7ED321]" /> STAR Method Interview Simulator
                </h2>
                <p className="text-xs text-[#666666] font-medium">Practice your response and receive instant automated scoring based on Situation, Task, Action, and Result.</p>

                <div className="space-y-1">
                  <label className="block text-[9px] font-bold uppercase text-[#666666] tracking-wider">Target Role Title</label>
                  <input
                    type="text"
                    value={interviewRole}
                    onChange={(e) => setInterviewRole(e.target.value)}
                    className="w-full glass-input px-3.5 py-2 text-xs bg-white border border-[#D1D1CB] text-[#111111]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[9px] font-bold uppercase text-[#666666] tracking-wider">Interview Question Prompt</label>
                  <textarea
                    value={interviewQuestion}
                    onChange={(e) => setInterviewQuestion(e.target.value)}
                    rows={2}
                    className="w-full glass-input p-3 rounded-xl text-xs font-semibold bg-white border border-[#D1D1CB] text-[#111111]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[9px] font-bold uppercase text-[#666666] tracking-wider">Your Response (STAR Format)</label>
                  <textarea
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="In my previous project at Tech Corp, I was tasked with reducing API latency (Situation/Task). I implemented Redis caching and optimized SQL queries (Action), reducing response times by 45% (Result)."
                    rows={4}
                    className="w-full glass-input p-3 rounded-xl text-xs font-semibold bg-white border border-[#D1D1CB] text-[#111111]"
                  />
                </div>

                <button onClick={handleEvaluateAnswer} disabled={interviewLoading} className="w-full btn-terracotta py-2.5 text-xs font-bold shadow-sm flex items-center justify-center gap-1.5 text-white">
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
              <div className="depth-3d-card p-6 flex flex-col justify-between space-y-4">
                <h3 className="text-sm font-bold text-[#111111] flex items-center gap-2">
                  <CheckCircle2 className="w-4.5 h-4.5 text-[#7ED321]" /> STAR Evaluation Feedback
                </h3>

                {interviewEval ? (
                  <div className="space-y-4 flex-1 flex flex-col justify-between">
                    <div className="p-5 rounded-xl bg-[#7ED321]/10 border border-[#7ED321]/20 text-center">
                      <span className="text-[9px] font-bold text-[#59C414] uppercase tracking-wider block">STAR SCORE</span>
                      <span className="text-4xl font-extrabold text-[#111111] mt-1 block">{interviewEval.score} / 100</span>
                    </div>
                    <div className="p-4 rounded-xl bg-[#F8F8F5] border border-[#E6E6E2] text-xs font-medium leading-relaxed text-[#111111]">
                      {interviewEval.evaluation}
                    </div>
                  </div>
                ) : (
                  <div className="py-20 text-center text-xs font-semibold text-[#666666] flex-1 flex items-center justify-center">
                    Submit your STAR formatted response on the left to activate neural feedback evaluations.
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'salary' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <form onSubmit={handlePredictSalary} className="depth-3d-card p-6 space-y-4">
                <h2 className="text-sm font-bold text-[#111111] flex items-center gap-2">
                  <DollarSign className="w-4.5 h-4.5 text-[#7ED321]" /> AI Compensation Predictor
                </h2>
                <p className="text-xs text-[#666666] font-medium">Calculates estimated compensation based on target title, skill density, experience level, and company stage.</p>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold uppercase text-[#666666] tracking-wider">Job Title</label>
                  <input
                    type="text"
                    value={salaryForm.title}
                    onChange={(e) => setSalaryForm({ ...salaryForm, title: e.target.value })}
                    className="w-full depth-3d-input px-3.5 py-2 text-xs text-[#111111]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold uppercase text-[#666666] tracking-wider">Key Skills (Comma-separated)</label>
                  <input
                    type="text"
                    value={salaryForm.skills}
                    onChange={(e) => setSalaryForm({ ...salaryForm, skills: e.target.value })}
                    className="w-full depth-3d-input px-3.5 py-2 text-xs text-[#111111]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase text-[#666666] tracking-wider">Years of Exp</label>
                    <input
                      type="number"
                      step="0.5"
                      value={salaryForm.experience_years}
                      onChange={(e) => setSalaryForm({ ...salaryForm, experience_years: e.target.value })}
                      className="w-full depth-3d-input px-3.5 py-2 text-xs text-[#111111]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase text-[#666666] tracking-wider">Company Type</label>
                    <select
                      value={salaryForm.company_type}
                      onChange={(e) => setSalaryForm({ ...salaryForm, company_type: e.target.value })}
                      className="w-full depth-3d-input px-3.5 py-2 text-xs text-[#111111] font-semibold"
                    >
                      <option value="MNC">MNC / Enterprise</option>
                      <option value="Startup">Growth Startup</option>
                      <option value="Newly Founded Startup">Early Startup</option>
                    </select>
                  </div>
                </div>

                <button type="submit" disabled={salaryLoading} className="w-full depth-3d-button py-2.5 text-xs font-bold flex items-center justify-center gap-1.5 text-white">
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
              <div className="depth-3d-card p-6 flex flex-col justify-center text-center space-y-4">
                {salaryResult ? (
                  <div className="space-y-4">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-bold">
                      <TrendingUp className="w-3.5 h-3.5" /> Market Estimation Ready
                    </div>
                    <div>
                      <span className="text-[9px] text-[#666666] uppercase font-bold tracking-wider block mb-1">Estimated Annual Salary</span>
                      <span className="text-3xl font-black text-[#111111]">
                        ${salaryResult.estimated_min?.toLocaleString()} - ${salaryResult.estimated_max?.toLocaleString()}
                      </span>
                      <span className="text-[10px] font-bold text-[#666666] block mt-1">Median: ${salaryResult.median_salary?.toLocaleString()} USD / year</span>
                    </div>
                    <div className="p-3.5 rounded-xl bg-[#F8F8F5] border border-[#E6E6E2] text-xs text-[#666666] text-left space-y-1 font-semibold">
                      <span className="font-bold text-[#59C414] block">AI Market Rationale:</span>
                      <p>{salaryResult.rationale}</p>
                    </div>
                  </div>
                ) : (
                  <div className="py-20 text-center text-xs font-semibold text-[#666666]">
                    Enter your title and skills to generate an AI market salary report.
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'roadmap' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="depth-3d-card p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 pb-4">
                <div>
                  <h2 className="text-sm font-bold text-[#111111] flex items-center gap-2">
                    <Compass className="w-4.5 h-4.5 text-[#7ED321]" /> Skill Milestone Roadmap Generator
                  </h2>
                  <p className="text-[11px] text-[#666666] font-medium mt-0.5">Maps step-by-step skill progression from your current baseline to target senior roles.</p>
                </div>
              </div>

              <form onSubmit={handleGenerateRoadmap} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  value={roadmapForm.current_role}
                  onChange={(e) => setRoadmapForm({ ...roadmapForm, current_role: e.target.value })}
                  placeholder="Current Role (e.g. Software Developer)"
                  className="glass-input px-3.5 py-2 text-xs bg-white border border-[#D1D1CB] text-[#111111] font-semibold"
                />
                <input
                  type="text"
                  value={roadmapForm.target_role}
                  onChange={(e) => setRoadmapForm({ ...roadmapForm, target_role: e.target.value })}
                  placeholder="Target Role (e.g. AI Architect)"
                  className="glass-input px-3.5 py-2 text-xs bg-white border border-[#D1D1CB] text-[#111111] font-semibold"
                />
                <button type="submit" disabled={roadmapLoading} className="btn-terracotta py-2 text-xs font-bold shadow-sm flex items-center justify-center text-white">
                  {roadmapLoading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> Generating Milestones...
                    </>
                  ) : (
                    'Generate Roadmap'
                  )}
                </button>
              </form>

              {roadmapResult && (
                <div className="space-y-3 pt-4 border-t border-neutral-100">
                  <h3 className="text-[10px] font-bold text-[#59C414] uppercase tracking-wider">Milestone Progression Plan</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {roadmapResult.milestones?.map((m, idx) => (
                      <div key={idx} className="p-4 rounded-xl bg-[#F8F8F5] border border-[#E6E6E2] space-y-2">
                        <div className="w-7 h-7 rounded-lg bg-[#7ED321]/15 text-[#59C414] font-black text-xs flex items-center justify-center">
                          0{idx + 1}
                        </div>
                        <h4 className="text-xs font-bold text-[#111111]">{m.phase || m.title}</h4>
                        <p className="text-[10px] text-[#666666] leading-relaxed font-semibold">{m.description || m.action_plan}</p>
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
