
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import Index from '@/pages/Index';
import HomePage from '@/pages/HomePage';
import ChallengePage from '@/pages/ChallengePage';
import RewardsPage from '@/pages/RewardsPage';
import SurveyPage from '@/pages/SurveyPage';
import AdminPage from '@/pages/AdminPage';
import NotFound from '@/pages/NotFound';
import { AuthProvider } from '@/lib/auth/AuthProvider';
import ResetPasswordPage from '@/pages/ResetPasswordPage';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/challenge" element={<ChallengePage />} />
          <Route path="/rewards" element={<RewardsPage />} />
          <Route path="/survey" element={<SurveyPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      <Toaster />
    </AuthProvider>
  );
}

export default App;
