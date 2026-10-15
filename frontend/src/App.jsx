import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { MainLayout } from './layouts/MainLayout';
import { AuthLayout } from './layouts/AuthLayout';

// Pages
import { LandingPage } from './pages/LandingPage';
import { RegisterPage } from './pages/RegisterPage';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { ResumeUploadPage } from './pages/ResumeUploadPage';
import { ResumeAnalysisPage } from './pages/ResumeAnalysisPage';
import { CareerTargetPage } from './pages/CareerTargetPage';
import { SkillGapPage } from './pages/SkillGapPage';
import { SkillDetailPage } from './pages/SkillDetailPage';
import { CareerReadinessPage } from './pages/CareerReadinessPage';
import { CareerOptionsPage } from './pages/CareerOptionsPage';
import { CareerComparePage } from './pages/CareerComparePage';
import { ResumeImprovementPage } from './pages/ResumeImprovementPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Landing */}
          <Route path="/" element={<LandingPage />} />

          {/* Auth Flow */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          {/* Student Dashboard & Workflows */}
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/resume/upload" element={<ResumeUploadPage />} />
            <Route path="/resume/analysis" element={<ResumeAnalysisPage />} />
            <Route path="/career/target" element={<CareerTargetPage />} />
            <Route path="/skills/gaps" element={<SkillGapPage />} />
            <Route path="/skills/:skillId" element={<SkillDetailPage />} />

            <Route path="/career-readiness" element={<CareerReadinessPage />} />
            <Route path="/career/options" element={<CareerOptionsPage />} />
            <Route path="/career/compare" element={<CareerComparePage />} />
            <Route path="/resume/suggestions" element={<ResumeImprovementPage />} />
          </Route>

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
