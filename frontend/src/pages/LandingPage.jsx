import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle, 
  FileText, 
  Target, 
  Milestone, 
  Compass, 
  TrendingUp 
} from 'lucide-react';

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="py-16 md:py-24 px-4 max-w-6xl mx-auto text-center">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-6">
          <Sparkles className="w-4 h-4" />
          <span>AI-Powered Career Readiness & Job Preparation Platform</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Bridge the Gap Between <br className="hidden md:inline" />
          <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
            Your Current Resume
          </span>{' '}
          and Target Dream Job
        </h1>

        <p className="mt-6 text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
          Whether you're a job seeker targeting top companies, a professional switching domains, or a student preparing for placements —
          CareerBridge AI gives you a clear, personalized skill gap analysis, ATS score, and actionable learning roadmap.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/register"
            className="w-full sm:w-auto px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md shadow-indigo-200 transition flex items-center justify-center space-x-2"
          >
            <span>Start Your Career Journey</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            to="/login"
            className="w-full sm:w-auto px-8 py-3.5 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-xl border border-slate-200 shadow-xs transition"
          >
            Sign In
          </Link>
        </div>
      </section>

      {/* Feature Pillars */}
      <section className="py-12 bg-white border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-slate-900 mb-12">
            How CareerBridge AI Prepares You
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">1. Resume & Profile Analysis</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Upload your resume (PDF/DOCX) to instantly extract your skills, experience, qualifications, and benchmark ATS formatting metrics.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mb-4">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">2. Role & JD Skill Gap Engine</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Compare your profile against your target role, company, or custom job description to pinpoint missing skills prioritized by industry demand.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                <Milestone className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">3. Actionable Roadmaps & Projects</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Receive prioritized learning steps, real-world portfolio projects, and curated learning references tailored to your career goal.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 text-center text-xs text-slate-500">
        CareerBridge AI — Intelligent Career Readiness, Job Preparation & Skill Roadmaps
      </footer>
    </div>
  );
};
