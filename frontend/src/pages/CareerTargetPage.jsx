import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card } from '../components/common/Card';
import api from '../services/api';
import { Target, Building, FileText, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

export const CareerTargetPage = () => {
  const [role, setRole] = useState('');
  const [company, setCompany] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    loadActiveTarget();
  }, []);

  useEffect(() => {
    if (location.state?.selectedRole) {
      setRole(location.state.selectedRole);
    }
  }, [location.state]);

  const loadActiveTarget = async () => {
    try {
      const res = await api.get('/career/target');
      if (res.data) {
        if (!location.state?.selectedRole) {
          setRole(res.data.role_title || '');
        }
        setCompany(res.data.target_company || '');
        setJobDescription(res.data.job_description || '');
      }
    } catch (err) {
      console.error('No existing target found', err);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!role.trim()) {
      setError('Please enter your target role.');
      return;
    }
    if (!company.trim()) {
      setError('Please enter your target company. Target company is mandatory.');
      return;
    }

    setSaving(true);
    setError('');

    try {
      await api.post('/career/target', {
        role_title: role.trim(),
        target_company: company.trim(),
        job_description: jobDescription.trim() || undefined,
      });
      setSuccess(true);
      setTimeout(() => {
        navigate('/skills/gaps');
      }, 800);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to save target career preferences.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Define Your Career Goal</h1>
        <p className="text-sm text-slate-500 mt-1">
          Specify your desired target role and target company to generate your personalized skill gap analysis.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Career target saved! Generating personalized skill gaps...</span>
        </div>
      )}

      <Card>
        <form className="space-y-6" onSubmit={handleSave}>
          {/* Target Role Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1.5">
              Target Role *
            </label>

            <div className="relative">
              <Target className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Enter your target role (e.g. Software Engineer, Machine Learning Engineer, Cloud Architect...)"
                className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none font-medium text-slate-900"
                required
              />
            </div>
          </div>

          {/* Target Company (Mandatory) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1.5">
              Target Company *
            </label>
            <div className="relative">
              <Building className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Enter your target company (e.g. Google, Amazon, Microsoft, TCS, Infosys, Startup...)"
                className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none font-medium text-slate-900"
                required
              />
            </div>
          </div>

          {/* Job Description */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-700 uppercase">
                Job Description (Optional — Paste from LinkedIn, Indeed, or Careers page)
              </label>
              <span className="text-[11px] text-slate-400">
                Skills in JD will be automatically extracted
              </span>
            </div>
            <textarea
              rows={4}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste exact job posting requirements here (e.g. required technologies, qualifications, duties) to tailor your skill gaps..."
              className="w-full p-3 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={saving || !role.trim() || !company.trim()}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg text-sm shadow-sm transition flex items-center space-x-2 disabled:opacity-50 cursor-pointer"
            >
              <span>{saving ? 'Analyzing & Saving Target...' : 'Save & Analyze Skill Gaps'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};
