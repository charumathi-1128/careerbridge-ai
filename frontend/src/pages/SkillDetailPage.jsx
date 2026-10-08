import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card } from '../components/common/Card';
import { PriorityBadge } from '../components/common/Badge';
import api from '../services/api';
import { 
  ArrowLeft, 
  BookOpen, 
  FolderGit2, 
  Award, 
  Target, 
  CheckCircle2, 
  Check, 
  Clock 
} from 'lucide-react';

export const SkillDetailPage = () => {
  const { skillId } = useParams();
  const [skillData, setSkillData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSkillDetail();
  }, [skillId]);

  const fetchSkillDetail = async () => {
    try {
      const res = await api.get(`/roadmap/skill/${encodeURIComponent(skillId)}`);
      setSkillData(res.data);
    } catch (err) {
      console.error('Failed to load skill detail', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-sm text-slate-500 font-medium">Loading skill curriculum...</p>
      </div>
    );
  }

  const skill = skillData || {
    skill_name: skillId,
    title: `Master ${skillId} Fundamentals & Application`,
    duration: '2-3 weeks',
    learning_topics: [`1. Core principles of ${skillId}`, `2. Hands-on modules in ${skillId}`, `3. Real-world implementation`],
    certifications: [`Accredited Certification in ${skillId}`],
    skill_outcomes: [`Practical working competency in ${skillId}`],
    recommended_projects: [
      {
        title: `${skillId} Applied Project`,
        description: `Build a project applying ${skillId} principles.`,
        difficulty: 'Intermediate',
        technologies: [skillId]
      }
    ],
    practice_guide: 'Practice standard exercises and interview questions.',
    completion_criteria: 'Complete foundational modules and build the recommended project.'
  };

  const projects = skill.recommended_projects && skill.recommended_projects.length > 0
    ? skill.recommended_projects
    : [
        {
          title: skill.project_title || `${skill.skill_name} Project`,
          description: skill.project_description || `Build a project applying ${skill.skill_name}.`,
          difficulty: 'Intermediate',
          technologies: [skill.skill_name]
        }
      ];

  const topics = skill.learning_topics && skill.learning_topics.length > 0
    ? skill.learning_topics
    : skill.learning_sequence || [];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <Link to="/skills/gaps" className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Skill Gaps</span>
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{skill.skill_name}</h1>
          <p className="text-sm text-slate-500 mt-1">{skill.title}</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-500 font-medium">Est. Duration: <strong>{skill.duration}</strong></span>
          <PriorityBadge priority="HIGH" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Learning Topics */}
        <Card title="Learning Topics & Curriculum" subtitle="Recommended sequence of study">
          <ul className="space-y-2.5 text-sm text-slate-700">
            {topics.map((step, idx) => (
              <li key={idx} className="flex items-start space-x-2.5">
                <span className="w-5 h-5 rounded-full bg-indigo-50 text-indigo-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="text-xs leading-relaxed text-slate-700">{step.replace(/^\d+\.\s*/, '')}</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* Certifications & Outcomes */}
        <div className="space-y-6">
          <Card title="Target Certifications" subtitle="Industry recognized credentials">
            <ul className="space-y-2 text-xs">
              {skill.certifications?.map((c, idx) => (
                <li key={idx} className="flex items-start space-x-2 text-slate-700">
                  <Award className="w-4 h-4 text-violet-600 shrink-0 mt-0.5" />
                  <span className="font-medium">{c}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card title="Skill Competencies to Achieve" subtitle="Unlocked practical capabilities">
            <ul className="space-y-2 text-xs">
              {skill.skill_outcomes?.map((o, idx) => (
                <li key={idx} className="flex items-start space-x-2 text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{o}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {/* Recommended 2-3 Projects */}
        <Card title="Recommended Portfolio Projects" subtitle="Choose 1 or more projects to build" className="md:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {projects.map((proj, pIdx) => {
              const diff = proj.difficulty || 'Intermediate';
              const diffColor = diff === 'Beginner' 
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : diff === 'Advanced'
                ? 'bg-purple-50 text-purple-700 border-purple-200'
                : 'bg-blue-50 text-blue-700 border-blue-200';

              return (
                <div key={pIdx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Project #{pIdx + 1}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${diffColor}`}>
                        {diff}
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm">{proj.title}</h4>
                    <p className="text-slate-600 text-xs leading-relaxed">{proj.description}</p>
                  </div>
                  {proj.technologies && proj.technologies.length > 0 && (
                    <div className="mt-3 pt-2 border-t border-slate-200/60 flex flex-wrap gap-1">
                      {proj.technologies.map((t, tIdx) => (
                        <span key={tIdx} className="px-2 py-0.5 bg-white text-slate-700 text-[10px] font-medium rounded border border-slate-200">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
};
