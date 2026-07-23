import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { ThemeProvider } from './context/ThemeContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AppErrorBoundary from './components/AppErrorBoundary';

// Lazy load page components
const LandingPage = lazy(() => import('./pages/LandingPage'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const SwipeJobs = lazy(() => import('./pages/SwipeJobs'));
const ResumeAnalyzer = lazy(() => import('./pages/ResumeAnalyzer'));
const JobSearch = lazy(() => import('./pages/JobSearch'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const SavedJobs = lazy(() => import('./pages/SavedJobs'));
const AppliedJobs = lazy(() => import('./pages/AppliedJobs'));
const RecruiterDashboard = lazy(() => import('./pages/RecruiterDashboard'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const Profile = lazy(() => import('./pages/Profile'));
const NotFoundPage = lazy(() => import('./pages/ErrorPage').then(module => ({ default: module.NotFoundPage })));

// Loading skeleton fallback
const PageSkeleton = () => (
  <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 animate-pulse">
    <div className="h-8 w-1/3 bg-slate-300/30 dark:bg-slate-800/50 rounded-xl"></div>
    <div className="h-4 w-1/2 bg-slate-300/20 dark:bg-slate-800/40 rounded-xl"></div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10">
      <div className="h-48 bg-slate-300/25 dark:bg-slate-800/30 rounded-3xl"></div>
      <div className="h-48 bg-slate-300/25 dark:bg-slate-800/30 rounded-3xl"></div>
      <div className="h-48 bg-slate-300/25 dark:bg-slate-800/30 rounded-3xl"></div>
    </div>
  </div>
);

// Protected Route Wrapper
const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="py-20 text-center text-slate-400">Loading SwipeX session...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/swipe" replace />;
  return children;
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <Router>
            <AppErrorBoundary>
              <div className="min-h-screen flex flex-col justify-between">
                <Navbar />
                <main className="flex-1">
                  <Suspense fallback={<PageSkeleton />}>
                    <Routes>
                      <Route path="/" element={<LandingPage />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/signup" element={<Signup />} />

                      <Route path="/swipe" element={<ProtectedRoute><SwipeJobs /></ProtectedRoute>} />
                      <Route path="/resume-analyzer" element={<ProtectedRoute><ResumeAnalyzer /></ProtectedRoute>} />
                      <Route path="/jobs" element={<ProtectedRoute><JobSearch /></ProtectedRoute>} />
                      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                      <Route path="/saved" element={<ProtectedRoute><SavedJobs /></ProtectedRoute>} />
                      <Route path="/applied" element={<ProtectedRoute><AppliedJobs /></ProtectedRoute>} />
                      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

                      <Route
                        path="/recruiter"
                        element={<ProtectedRoute roles={['recruiter', 'recruiter_unverified', 'admin']}><RecruiterDashboard /></ProtectedRoute>}
                      />
                      <Route
                        path="/admin"
                        element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>}
                      />

                      <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                  </Suspense>
                </main>
                <Footer />
              </div>
            </AppErrorBoundary>
          </Router>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
