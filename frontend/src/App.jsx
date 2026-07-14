import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import SwipeJobs from './pages/SwipeJobs';
import ResumeAnalyzer from './pages/ResumeAnalyzer';
import JobSearch from './pages/JobSearch';
import Dashboard from './pages/Dashboard';
import SavedJobs from './pages/SavedJobs';
import AppliedJobs from './pages/AppliedJobs';
import RecruiterDashboard from './pages/RecruiterDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile';
import { NotFoundPage } from './pages/ErrorPage';
import AppErrorBoundary from './components/AppErrorBoundary';

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
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <AppErrorBoundary>
            <div className="min-h-screen flex flex-col justify-between">
              <Navbar />
              <main className="flex-1">
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
              </main>
              <Footer />
            </div>
          </AppErrorBoundary>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}
