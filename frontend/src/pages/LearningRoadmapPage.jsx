import React, { useState, useEffect } from 'react';
import { Card } from '../components/common/Card';
import { StatusBadge } from '../components/common/Badge';
import api from '../services/api';
import { 
  Milestone, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Check, 
  Award, 
  FolderGit2, 
  BookOpen, 
  Target, 
  ChevronDown, 
  ChevronUp,
  Layers
} from 'lucide-react';

export const LearningRoadmapPage = () => {
  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    fetchSteps();
  }, []);

  const fetchSteps = async () => {
    try {
      const res = await api.get('/roadmap/steps');
      setSteps(res.data);
      if (res.data.length > 0) {
        setExpandedId(res.data[0].id);
      }
    } catch (err) {
      console.error('Failed to load roadmap steps', err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (stepId, newStatus) => {
    try {
      const res = await api.patch(`/roadmap/step/${stepId}/status`, { status: newStatus });
      setSteps((prev) => prev.map((s) => (s.id === stepId ? res.data : s)));
    } catch (err) {
      console.error('Failed to update step status', err);
    }
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-sm text-slate-500 font-medium">Generating your step-by-step career learning roadmap...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Personalized Learning Roadmap</h1>
        <p className="text-sm text-slate-500 mt-1">
          A prioritized learning sequence featuring modular topics, industry certifications, practical drills, and 2–3 hands-on portfolio projects for every skill gap.
        </p>
      </div>

      <div className="space-y-5">
        {steps.map((step, index) => {
          const isExpanded = expandedId === step.id;
          const projects = step.recommended_projects && step.recommended_projects.length > 0
            ? step.recommended_projects
            : [
                {
                  title: step.project_title || `${step.skill_name} Portfolio Project`,
                  description: step.project_description || `Build a practical project demonstrating ${step.skill_name} principles.`,
                  difficulty: 'Intermediate',
                  technologies: [step.skill_name]
                }
              ];

          const topics = step.learning_topics && step.learning_topics.length > 0
            ? step.learning_topics
            : step.learning_sequence || [];

          return (
            <Card key={step.id} className={`transition border-l-4 ${
              step.status === 'COMPLETED' ? 'border-l-emerald-500' : step.status === 'IN_PROGRESS' ? 'border-l-indigo-600' : 'border-l-slate-300'
            }`}>
              <div className="p-5">
                <div 
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer" 
                  onClick={() => toggleExpand(step.id)}
                >
                  <div className="flex items-start space-x-3.5">
                    <div className={`w-9 h-9 rounded-xl font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-xs ${
                      step.status === 'COMPLETED' 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : step.status === 'IN_PROGRESS' 
                        ? 'bg-indigo-600 text-white shadow-indigo-200' 
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {step.status === 'COMPLETED' ? <Check className="w-5 h-5" /> : `0${index + 1}`}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">{step.title}</h3>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400 mt-1">
                        <span className="flex items-center space-x-1 text-slate-600 font-medium">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>Est. Duration: <strong>{step.duration}</strong></span>
                        </span>
                        <span>•</span>
                        <span>Target Skill: <strong className="text-indigo-700">{step.skill_name}</strong></span>
                        <span>•</span>
                        <span>{projects.length} Recommended Projects</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 self-end sm:self-center">
                    <StatusBadge status={step.status} />
                    <select
                      value={step.status}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => updateStatus(step.id, e.target.value)}
                      className="px-2.5 py-1 text-xs border border-slate-300 rounded-lg bg-white font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                    >
                      <option value="NOT_STARTED">Not Started</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="COMPLETED">Completed</option>
                    </select>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="mt-5 pt-5 border-t border-slate-100 space-y-6 text-xs">
                    
                    {/* 1. Learning Topics & Curriculum */}
                    <div>
                      <div className="flex items-center space-x-2 text-slate-800 font-bold uppercase tracking-wider mb-2.5">
                        <BookOpen className="w-4 h-4 text-indigo-600" />
                        <span>Core Learning Topics & Curriculum</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 bg-slate-50/70 p-3.5 rounded-xl border border-slate-100">
                        {topics.map((topic, idx) => (
                          <div key={idx} className="flex items-start space-x-2 text-slate-700 text-xs py-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0"></span>
                            <span className="leading-relaxed">{topic}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 2. Target Industry Certifications & Skill Competencies */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Certifications */}
                      <div className="p-4 rounded-xl bg-violet-50/50 border border-violet-100">
                        <div className="flex items-center space-x-2 text-violet-900 font-bold uppercase tracking-wider mb-2">
                          <Award className="w-4 h-4 text-violet-600" />
                          <span>Relevant Industry Certifications</span>
                        </div>
                        {step.certifications && step.certifications.length > 0 ? (
                          <ul className="space-y-1.5">
                            {step.certifications.map((cert, cIdx) => (
                              <li key={cIdx} className="flex items-start space-x-2 text-slate-700 text-xs">
                                <CheckCircle2 className="w-3.5 h-3.5 text-violet-600 shrink-0 mt-0.5" />
                                <span className="font-medium text-slate-800">{cert}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-slate-500 text-xs">Recommended accredited certification paths in {step.skill_name}.</p>
                        )}
                      </div>

                      {/* Skill Outcomes */}
                      <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100">
                        <div className="flex items-center space-x-2 text-emerald-900 font-bold uppercase tracking-wider mb-2">
                          <Target className="w-4 h-4 text-emerald-600" />
                          <span>Skill Competencies to Achieve</span>
                        </div>
                        {step.skill_outcomes && step.skill_outcomes.length > 0 ? (
                          <ul className="space-y-1.5">
                            {step.skill_outcomes.map((outcome, oIdx) => (
                              <li key={oIdx} className="flex items-start space-x-2 text-slate-700 text-xs">
                                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                <span className="leading-relaxed">{outcome}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-slate-500 text-xs">Core practical capabilities to unlock upon completing this step.</p>
                        )}
                      </div>
                    </div>

                    {/* 3. 2-3 Recommended Projects */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2 text-slate-800 font-bold uppercase tracking-wider">
                          <FolderGit2 className="w-4 h-4 text-indigo-600" />
                          <span>Recommended Hands-On Projects (Choose 1 or more)</span>
                        </div>
                        <span className="text-[11px] text-slate-400 font-medium">{projects.length} project options available</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                        {projects.map((proj, pIdx) => {
                          const diff = proj.difficulty || 'Intermediate';
                          const diffColor = diff === 'Beginner' 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : diff === 'Advanced'
                            ? 'bg-purple-50 text-purple-700 border-purple-200'
                            : 'bg-blue-50 text-blue-700 border-blue-200';

                          return (
                            <div key={pIdx} className="p-4 rounded-xl bg-white border border-slate-200 hover:border-indigo-200 transition shadow-xs flex flex-col justify-between">
                              <div className="space-y-2">
                                <div className="flex items-center justify-between gap-2">
                                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Project #{pIdx + 1}</span>
                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${diffColor}`}>
                                    {diff}
                                  </span>
                                </div>
                                <h5 className="font-bold text-slate-900 text-sm">{proj.title}</h5>
                                <p className="text-slate-600 text-xs leading-relaxed line-clamp-3">
                                  {proj.description}
                                </p>
                              </div>

                              {proj.technologies && proj.technologies.length > 0 && (
                                <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap gap-1">
                                  {proj.technologies.map((t, tIdx) => (
                                    <span key={tIdx} className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-medium rounded-md">
                                      {t}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* 4. Practice Guide & Verification */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
                      {step.practice_guide && (
                        <div className="p-3.5 bg-amber-50/70 rounded-xl border border-amber-200/60 text-amber-950">
                          <strong className="block text-amber-900 font-bold mb-1">Targeted Practice Drills:</strong>
                          <span className="text-amber-900/90 leading-relaxed">{step.practice_guide}</span>
                        </div>
                      )}

                      {step.completion_criteria && (
                        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-800">
                          <strong className="block text-slate-900 font-bold mb-1">Completion Criteria:</strong>
                          <span className="text-slate-600 leading-relaxed">{step.completion_criteria}</span>
                        </div>
                      )}
                    </div>

                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
