import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/common/Card';
import { PriorityBadge } from '../components/common/Badge';
import api from '../services/api';
import { GitCompare, ArrowRight, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

export const SkillGapPage = () => {
  const [gaps, setGaps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGaps();
  }, []);

  const fetchGaps = async () => {
    try {
      const res = await api.get('/roadmap/gaps');
      setGaps(res.data);
    } catch (err) {
      console.error('Failed to load skill gaps', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-sm text-slate-500 font-medium">Analyzing current resume skills vs target profile...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Skill Gap Analysis</h1>
          <p className="text-sm text-slate-500 mt-1">
            Comparing your <strong className="text-slate-700">Resume Profile</strong> against target placement expectations.
          </p>
        </div>
        <Link
          to="/roadmap"
          className="inline-flex items-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition"
        >
          <Sparkles className="w-4 h-4" />
          <span>View Learning Roadmap</span>
        </Link>
      </div>

      <div className="space-y-4">
        {gaps.length > 0 ? (
          gaps.map((gap) => (
            <Card key={gap.id} className="p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-base font-bold text-slate-900">{gap.skill_name}</h3>
                    <PriorityBadge priority={gap.priority} />
                    <span className={`text-xs px-2 py-0.5 rounded font-semibold ${
                      gap.match_status === 'STRONG_MATCH' 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : gap.match_status === 'PARTIAL_MATCH' 
                        ? 'bg-amber-100 text-amber-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {gap.match_status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">{gap.why_it_matters}</p>
                  {gap.prerequisites && (
                    <p className="text-xs text-slate-400 pt-1">
                      Prerequisites: <span className="text-slate-600 font-medium">{gap.prerequisites}</span>
                    </p>
                  )}
                </div>

                <Link
                  to={`/skills/${encodeURIComponent(gap.skill_name)}`}
                  className="inline-flex items-center space-x-1.5 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-lg transition shrink-0 self-start sm:self-center"
                >
                  <span>Skill Breakdown</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </Card>
          ))
        ) : (
          <p className="text-center py-12 text-sm text-slate-500">
            Please upload a resume first to generate a personalized skill gap breakdown.
          </p>
        )}
      </div>
    </div>
  );
};
