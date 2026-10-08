import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/common/Card';
import { PriorityBadge, StatusBadge } from '../components/common/Badge';
import api from '../services/api';
import { 
  Sparkles, 
  ArrowRight, 
  FileText, 
  Target, 
  TrendingUp, 
  AlertCircle,
  Clock,
  Compass,
  CheckCircle2
} from 'lucide-react';

export const DashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await api.get('/dashboard/summary');
      setData(res.data);
    } catch (err) {
      console.error('Failed to load dashboard summary', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-sm text-slate-500 font-medium">Loading Placement Preparation Hub...</p>
      </div>
    );
  }

  const {
    target_role = 'Software Developer',
    ats_score = 74,
    readiness_percentage = 58,
    missing_skills_count = 3,
    high_priority_count = 2,
    completed_steps_count = 0,
    total_steps_count = 6,
    next_best_action = {},
    high_priority_gaps = [],
    recent_roadmap_steps = []
  } = data || {};

  return (
    <div className="space-y-6">
      {/* Top Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-900 to-indigo-700 text-white rounded-2xl p-6 md:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-indigo-800/80 text-indigo-200 text-xs font-semibold mb-3 border border-indigo-600/50">
              <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
              <span>Placement Preparation Hub</span>
            </span>
            <h1 className="text-2xl md:text-3xl font-bold">Welcome to CareerBridge AI</h1>
            <p className="text-indigo-200 text-sm mt-1 max-w-xl">
              Current Target Role: <strong className="text-white">{target_role}</strong>
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Link
              to="/resume/upload"
              className="px-4 py-2.5 bg-white text-indigo-900 font-semibold rounded-lg text-sm hover:bg-indigo-50 transition shadow-xs flex items-center space-x-2"
            >
              <FileText className="w-4 h-4" />
              <span>Update Resume</span>
            </Link>
            <Link
              to="/career/target"
              className="px-4 py-2.5 bg-indigo-800 text-white font-semibold rounded-lg text-sm hover:bg-indigo-700 transition border border-indigo-600 flex items-center space-x-2"
            >
              <Target className="w-4 h-4" />
              <span>Change Target</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Estimated Readiness</span>
            <TrendingUp className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-slate-900">{readiness_percentage}%</span>
            <span className="text-xs text-slate-500">Progress Score</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${readiness_percentage}%` }}></div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">ATS Compatibility</span>
            <FileText className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-slate-900">{ats_score}%</span>
            <span className="text-xs text-slate-500">Keyword Alignment</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${ats_score}%` }}></div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Missing Skills</span>
            <AlertCircle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-slate-900">{missing_skills_count}</span>
            <span className="text-xs text-slate-500">{high_priority_count} High Priority</span>
          </div>
          <p className="text-xs text-slate-400 mt-3 truncate">
            {high_priority_gaps.map(g => g.skill_name).join(', ') || 'Ready for evaluation'}
          </p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Roadmap Progress</span>
            <Clock className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-slate-900">
              {completed_steps_count} / {total_steps_count}
            </span>
            <span className="text-xs text-slate-500">Steps Done</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
            <div 
              className="bg-indigo-600 h-full rounded-full" 
              style={{ width: `${(completed_steps_count / maxVal(total_steps_count, 1)) * 100}%` }}
            ></div>
          </div>
        </Card>
      </div>

      {/* Next Best Action Widget */}
      {next_best_action && (
        <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                ⭐ Next Best Action
              </span>
              <h3 className="text-lg font-bold text-slate-900">
                {next_best_action.title || 'Start Your Priority Roadmap Step'}
              </h3>
              <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
                {next_best_action.reason}
              </p>
              <div className="flex items-center space-x-4 text-xs text-slate-500 pt-1">
                <span>Estimated effort: <strong>{next_best_action.estimated_effort}</strong></span>
                {next_best_action.skill_name && (
                  <>
                    <span>•</span>
                    <span>Skill: <strong>{next_best_action.skill_name}</strong></span>
                  </>
                )}
              </div>
            </div>
            <Link
              to="/roadmap"
              className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg text-sm transition shrink-0 flex items-center justify-center space-x-2"
            >
              <span>Continue Roadmap</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}

      {/* Two Column Grid: Priority Gaps & Next Stages */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="High Priority Skill Gaps" subtitle="Skills immediately required for target role">
          <div className="space-y-3">
            {high_priority_gaps.length > 0 ? (
              high_priority_gaps.map((skill) => (
                <div key={skill.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-800">{skill.skill_name}</h4>
                    <p className="text-xs text-slate-500 line-clamp-1">{skill.why_it_matters}</p>
                  </div>
                  <PriorityBadge priority={skill.priority} />
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400">All core priority skills matched or completed!</p>
            )}
          </div>
        </Card>

        <Card title="Active Learning Milestones" subtitle="Recent roadmap progress">
          <div className="space-y-3">
            {recent_roadmap_steps.length > 0 ? (
              recent_roadmap_steps.map((step) => (
                <div key={step.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs">
                  <div className="space-y-0.5">
                    <span className="font-semibold text-slate-800 line-clamp-1">{step.title}</span>
                    <span className="text-slate-400">{step.duration}</span>
                  </div>
                  <StatusBadge status={step.status} />
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400">Visit the Roadmap page to start your sequence.</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

function maxVal(a, b) {
  return a > b ? a : b;
}
