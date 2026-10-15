import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/common/Card';
import { PriorityBadge } from '../components/common/Badge';
import api from '../services/api';
import { 
  Sparkles, 
  FileText, 
  Target, 
  TrendingUp, 
  AlertCircle
} from 'lucide-react';

export const DashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      setError(null);
      try {
        const [resumeResult, atsResult, targetResult, gapsResult] = await Promise.allSettled([
          api.get('/resume/current'),
          api.get('/career/ats-analysis'),
          api.get('/career/target'),
          api.get('/roadmap/gaps')
        ]);

        if (resumeResult.status === 'rejected') throw resumeResult.reason;

        const resume = resumeResult.value.data;
        if (!resume) {
          setData({
            has_resume: false,
            target_role: targetResult.status === 'fulfilled'
              ? targetResult.value.data?.role_title || 'Software Developer'
              : 'Software Developer'
          });
          return;
        }

        const failedResult = [atsResult, targetResult, gapsResult]
          .find((result) => result.status === 'rejected');
        if (failedResult) throw failedResult.reason;

        const readinessResult = await api.get('/dashboard/readiness');
        const missingGaps = (gapsResult.value.data || []).filter(
          (gap) => gap.match_status === 'MISSING' || gap.match_status === 'PARTIAL_MATCH'
        );
        const highPriorityGaps = missingGaps.filter((gap) => gap.priority === 'HIGH');

        setData({
          has_resume: true,
          target_role: targetResult.value.data?.role_title || 'Software Developer',
          ats_score: atsResult.value.data?.overall_score ?? null,
          readiness_percentage: readinessResult.data?.overall_percentage ?? null,
          missing_skills_count: missingGaps.length,
          high_priority_count: highPriorityGaps.length,
          high_priority_gaps: missingGaps
        });
      } catch (err) {
        console.error('Failed to load dashboard summary', err);
        setError('Unable to load dashboard analysis. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-sm text-slate-500 font-medium">Loading Placement Preparation Hub...</p>
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-20 text-sm text-red-600">{error}</div>;
  }

  const {
    target_role = 'Software Developer',
    has_resume = false,
    ats_score,
    readiness_percentage,
    missing_skills_count,
    high_priority_count,
    high_priority_gaps = []
  } = data || {};

  return (
    <div className="space-y-6">
      {/* Top Welcome Banner */}
      <div className="bg-[#40594C] text-[#F5F4EF] rounded-2xl p-6 md:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#A5B392]/30 text-[#F5F4EF] text-xs font-semibold mb-3 border border-[#A5B392]/40">
              <Sparkles className="w-3.5 h-3.5 text-[#A5B392]" />
              <span>Placement Preparation Hub</span>
            </span>
            <h1 className="text-2xl md:text-3xl font-bold text-[#F5F4EF]">Welcome to CareerBridge AI</h1>
            <p className="text-[#D9D8CC] text-sm mt-1 max-w-xl">
              Current Target Role: <strong className="text-white">{target_role}</strong>
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Link
              to="/resume/upload"
              className="px-4 py-2.5 bg-[#F5F4EF] text-[#40594C] font-semibold rounded-lg text-sm hover:bg-white transition shadow-xs flex items-center space-x-2"
            >
              <FileText className="w-4 h-4" />
              <span>Update Resume</span>
            </Link>
            <Link
              to="/career/target"
              className="px-4 py-2.5 bg-[#A5B392] text-[#40594C] font-semibold rounded-lg text-sm hover:bg-[#94A480] transition flex items-center space-x-2"
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
            <span className="text-3xl font-extrabold text-slate-900">{has_resume && readiness_percentage != null ? `${readiness_percentage}%` : '--'}</span>
            <span className="text-xs text-slate-500">Progress Score</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${has_resume ? readiness_percentage || 0 : 0}%` }}></div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">ATS Compatibility</span>
            <FileText className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className={has_resume ? 'text-3xl font-extrabold text-slate-900' : 'text-sm font-semibold text-slate-500'}>
              {has_resume && ats_score != null ? `${ats_score}%` : 'Upload your resume to see your score'}
            </span>
            {has_resume && <span className="text-xs text-slate-500">Keyword Alignment</span>}
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${has_resume ? ats_score || 0 : 0}%` }}></div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Missing Skills</span>
            <AlertCircle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-slate-900">{has_resume ? missing_skills_count : '--'}</span>
            <span className="text-xs text-slate-500">{has_resume ? `${high_priority_count} High Priority` : 'High Priority'}</span>
          </div>
          <p className="text-xs text-slate-400 mt-3 truncate">
            {has_resume
              ? high_priority_gaps.map(g => g.skill_name).join(', ') || 'Ready for evaluation'
              : 'Upload your resume to see your score'}
          </p>
        </Card>

      </div>



      {/* High Priority Skill Gaps */}
      <Card title="High Priority Skill Gaps" subtitle="Skills immediately required for target role">
        <div className="space-y-3">
          {has_resume && high_priority_gaps.length > 0 ? (
            high_priority_gaps.map((skill) => (
              <div key={skill.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
                <div>
                  <h4 className="text-sm font-semibold text-slate-800">{skill.skill_name}</h4>
                  <p className="text-xs text-slate-500 line-clamp-1">{skill.why_it_matters}</p>
                </div>
                <PriorityBadge priority={skill.priority} />
              </div>
            ))
          ) : has_resume ? (
            <p className="text-xs text-slate-400">All core priority skills matched or completed!</p>
          ) : (
            <p className="text-xs text-slate-400">Upload your resume to see your score</p>
          )}
        </div>
      </Card>
    </div>
  );
};

