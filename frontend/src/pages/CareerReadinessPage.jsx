import React, { useState, useEffect } from 'react';

import { Card } from '../components/common/Card';
import api from '../services/api';
import { 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Target, 
  Code2, 
  FolderGit2, 
  Award, 
  FileText, 
  HelpCircle,
  RotateCcw
} from 'lucide-react';

export const CareerReadinessPage = () => {
  const [data, setData] = useState(null);
  const [targetInfo, setTargetInfo] = useState({ role_title: 'Software Developer' });
  const [gaps, setGaps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReadinessData();
  }, []);

  const fetchReadinessData = async () => {
    try {
      setLoading(true);
      const [readinessRes, targetRes, gapsRes] = await Promise.all([
        api.get('/dashboard/readiness').catch(() => ({ data: null })),
        api.get('/career/target').catch(() => ({ data: null })),
        api.get('/roadmap/gaps').catch(() => ({ data: [] }))
      ]);

      setData(readinessRes.data);
      if (targetRes && targetRes.data) {
        setTargetInfo(targetRes.data);
      }
      setGaps(gapsRes.data || []);
    } catch (err) {
      console.error('Failed to load readiness data', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-sm text-slate-500 font-medium">Calculating your career readiness score...</p>
      </div>
    );
  }

  // Derive readiness score and dynamic data
  const overallScore = data?.overall_percentage ?? 75;
  const targetRole = targetInfo?.role_title || data?.target_role || 'Software Developer';

  // Identify top missing skill for priorities and next step
  const missingGaps = gaps.filter((g) => g.match_status === 'MISSING' || g.match_status === 'PARTIAL_MATCH');
  const topMissingSkill = missingGaps.length > 0 ? missingGaps[0].skill_name : 'SQL & Database Design';

  const strongGaps = gaps.filter((g) => g.match_status === 'STRONG_MATCH');
  const strongSkillsList = strongGaps.length > 0 
    ? strongGaps.map((g) => g.skill_name) 
    : ['Python Basics', 'Git & GitHub', 'Core Data Structures'];

  // Map 5 simple core categories with progress bars
  const categories = [
    {
      name: 'Technical Skills',
      percentage: data?.breakdown?.find((b) => b.category.toLowerCase().includes('skill'))?.percentage ?? 70,
      color: 'bg-indigo-600',
      icon: Code2
    },
    {
      name: 'Projects',
      percentage: data?.breakdown?.find((b) => b.category.toLowerCase().includes('project'))?.percentage ?? 65,
      color: 'bg-violet-600',
      icon: FolderGit2
    },
    {
      name: 'Certifications',
      percentage: data?.breakdown?.find((b) => b.category.toLowerCase().includes('cert'))?.percentage ?? 50,
      color: 'bg-emerald-500',
      icon: Award
    },
    {
      name: 'Resume',
      percentage: data?.breakdown?.find((b) => b.category.toLowerCase().includes('resume'))?.percentage ?? 80,
      color: 'bg-sky-500',
      icon: FileText
    },
    {
      name: 'Interview Preparation',
      percentage: data?.breakdown?.find((b) => b.category.toLowerCase().includes('practice') || b.category.toLowerCase().includes('interview') || b.category.toLowerCase().includes('coding'))?.percentage ?? 45,
      color: 'bg-amber-500',
      icon: HelpCircle
    }
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* 1. HEADER & CAREER READINESS SCORE */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-indigo-600" />
            <h1 className="text-2xl font-black tracking-tight text-slate-900 uppercase">
              CAREER READINESS
            </h1>
          </div>
          <div className="text-sm text-slate-600 mt-1">
            <span className="font-bold text-slate-900">Target Career: </span>
            <span className="text-indigo-700 font-extrabold">{targetRole}</span>
          </div>
        </div>

        <button
          onClick={fetchReadinessData}
          className="inline-flex items-center space-x-1 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg shadow-2xs transition self-start sm:self-center"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
          <span>Refresh Score</span>
        </button>
      </div>

      {/* Main Score Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-indigo-950 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <span className="text-[11px] font-bold tracking-wider uppercase text-indigo-300">
            OVERALL EVALUATION
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            CAREER READINESS SCORE: {overallScore}%
          </h2>
          <p className="text-xs text-indigo-200 max-w-md">
            {overallScore >= 80
              ? 'Your profile is strong and well-positioned for placement and internship interviews.'
              : overallScore >= 60
              ? 'Good foundation! Complete the remaining missing skills and projects to maximize your placement chances.'
              : 'Follow the top priorities below to systematically improve your readiness score.'}
          </p>
        </div>

        <div className="flex items-center space-x-4 shrink-0 bg-white/10 px-5 py-3 rounded-xl border border-white/10">
          <div className="text-center">
            <div className="text-3xl font-black text-emerald-400 leading-none">
              {overallScore}%
            </div>
            <span className="text-[10px] font-bold text-indigo-200 uppercase tracking-wider">
              READY
            </span>
          </div>
        </div>
      </div>

      {/* 2. SIMPLE CATEGORIES WITH PERCENTAGE / PROGRESS BAR */}
      <Card 
        title="CATEGORY READINESS BREAKDOWN" 
        subtitle="Key components evaluated for your target career"
      >
        <div className="space-y-4 pt-1">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <div key={cat.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2 font-bold text-slate-800">
                    <Icon className="w-4 h-4 text-slate-500" />
                    <span>{cat.name}</span>
                  </div>
                  <span className="font-extrabold text-slate-900">{cat.percentage}%</span>
                </div>

                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200/50">
                  <div
                    className={`${cat.color} h-full rounded-full transition-all duration-500`}
                    style={{ width: `${cat.percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* 3. STRONG AREAS & NEEDS IMPROVEMENT (2 Columns) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* STRONG AREAS */}
        <div className="p-5 bg-emerald-50/50 rounded-2xl border border-emerald-200 space-y-3">
          <div className="flex items-center space-x-2 text-emerald-950 font-bold uppercase tracking-wider text-xs border-b border-emerald-200/60 pb-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>STRONG AREAS</span>
          </div>

          <div className="space-y-3 text-xs">
            {/* Skills already available */}
            <div>
              <span className="font-bold text-slate-900 block mb-1">
                • Skills already available:
              </span>
              <ul className="pl-4 space-y-0.5 text-slate-700 font-medium">
                {strongSkillsList.slice(0, 3).map((skill, sIdx) => (
                  <li key={sIdx}>- {skill}</li>
                ))}
              </ul>
            </div>

            {/* Relevant projects */}
            <div>
              <span className="font-bold text-slate-900 block mb-1">
                • Relevant projects:
              </span>
              <ul className="pl-4 space-y-0.5 text-slate-700 font-medium">
                <li>- Foundational portfolio mini-projects completed</li>
                <li>- Practical code repository on GitHub</li>
              </ul>
            </div>

            {/* Good resume sections */}
            <div>
              <span className="font-bold text-slate-900 block mb-1">
                • Good resume sections:
              </span>
              <ul className="pl-4 space-y-0.5 text-slate-700 font-medium">
                <li>- Clear education & coursework formatting</li>
                <li>- Well-structured technical skills section</li>
              </ul>
            </div>
          </div>
        </div>

        {/* NEEDS IMPROVEMENT */}
        <div className="p-5 bg-amber-50/50 rounded-2xl border border-amber-200 space-y-3">
          <div className="flex items-center space-x-2 text-amber-950 font-bold uppercase tracking-wider text-xs border-b border-amber-200/60 pb-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>NEEDS IMPROVEMENT</span>
          </div>

          <div className="space-y-3 text-xs">
            {/* Missing skills */}
            <div>
              <span className="font-bold text-slate-900 block mb-1">
                • Missing skills:
              </span>
              <ul className="pl-4 space-y-0.5 text-slate-700 font-medium">
                {missingGaps.length > 0 ? (
                  missingGaps.slice(0, 2).map((g, gIdx) => (
                    <li key={gIdx}>- {g.skill_name} ({g.priority} priority)</li>
                  ))
                ) : (
                  <li>- Advanced domain frameworks & tools</li>
                )}
              </ul>
            </div>

            {/* Missing projects */}
            <div>
              <span className="font-bold text-slate-900 block mb-1">
                • Missing projects:
              </span>
              <ul className="pl-4 space-y-0.5 text-slate-700 font-medium">
                <li>- One end-to-end practical project using {topMissingSkill}</li>
              </ul>
            </div>

            {/* Missing certifications */}
            <div>
              <span className="font-bold text-slate-900 block mb-1">
                • Missing certifications:
              </span>
              <ul className="pl-4 space-y-0.5 text-slate-700 font-medium">
                <li>- 1 course certification in {topMissingSkill} or Cloud</li>
              </ul>
            </div>

            {/* Interview preparation */}
            <div>
              <span className="font-bold text-slate-900 block mb-1">
                • Interview preparation:
              </span>
              <ul className="pl-4 space-y-0.5 text-slate-700 font-medium">
                <li>- Coding practice on LeetCode / HackerRank</li>
                <li>- Behavioral & technical question walkthroughs</li>
              </ul>
            </div>
          </div>
        </div>

      </div>

      {/* 4. TOP 3 PRIORITIES */}
      <Card 
        title="TOP 3 PRIORITIES" 
        subtitle="Focus on these high-impact items to boost placement readiness"
      >
        <div className="space-y-2.5 pt-1 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start space-x-3">
            <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-black text-[11px] flex items-center justify-center shrink-0 mt-0.5">
              1
            </span>
            <div>
              <h4 className="font-bold text-slate-900 text-xs">
                Learn the most important missing skill: {topMissingSkill}
              </h4>
              <p className="text-slate-600 text-[11px] mt-0.5">
                Focus on fundamental concepts, syntax, and practical implementation.
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start space-x-3">
            <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-black text-[11px] flex items-center justify-center shrink-0 mt-0.5">
              2
            </span>
            <div>
              <h4 className="font-bold text-slate-900 text-xs">
                Complete one relevant project
              </h4>
              <p className="text-slate-600 text-[11px] mt-0.5">
                Build a portfolio project demonstrating hands-on proficiency in your core skills.
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start space-x-3">
            <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-black text-[11px] flex items-center justify-center shrink-0 mt-0.5">
              3
            </span>
            <div>
              <h4 className="font-bold text-slate-900 text-xs">
                Practice interview questions
              </h4>
              <p className="text-slate-600 text-[11px] mt-0.5">
                Practice technical problem solving and mock questions for {targetRole}.
              </p>
            </div>
          </div>
        </div>
      </Card>


    </div>
  );
};
