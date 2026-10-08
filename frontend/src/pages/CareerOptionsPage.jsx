import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card } from '../components/common/Card';
import api from '../services/api';
import { Compass, ArrowRight, GitCompare, Sparkles } from 'lucide-react';

export const CareerOptionsPage = () => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOptions();
  }, []);

  const fetchOptions = async () => {
    try {
      const res = await api.get('/career/options');
      setOptions(res.data);
    } catch (err) {
      console.error('Failed to load career options', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCareer = (title) => {
    navigate('/career/target', { state: { selectedRole: title } });
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-sm text-slate-500 font-medium">Matching your skills against industry career paths...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Explore Multiple Career Options</h1>
          <p className="text-sm text-slate-500 mt-1">
            Based on your current resume skills, discover your readiness across different tech domains.
          </p>
        </div>
        <Link
          to="/career/compare"
          className="inline-flex items-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition"
        >
          <GitCompare className="w-4 h-4" />
          <span>Compare Side-by-Side</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {options.map((c) => (
          <Card key={c.title} className="p-5 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-base">{c.title}</h3>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                  c.match_percentage >= 70
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : c.match_percentage >= 40
                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}>
                  {c.match_percentage}% Match
                </span>
              </div>
              <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{c.description}</p>
              <div className="text-xs text-slate-400">
                Est. Preparation: <strong className="text-slate-700">{c.effort}</strong>
              </div>

              <div className="space-y-2 text-xs pt-2 border-t border-slate-100">
                <div>
                  <span className="text-slate-400 font-semibold uppercase tracking-wider block mb-1">
                    Matching Skills ({c.matching_skills?.length || 0}):
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {c.matching_skills?.length > 0 ? (
                      c.matching_skills.map((s) => (
                        <span key={s} className="px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded font-medium text-[11px]">
                          {s}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-400 text-[11px]">None yet</span>
                    )}
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 font-semibold uppercase tracking-wider block mb-1">
                    Missing Skills ({c.missing_count}):
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {c.missing_skills?.map((s) => (
                      <span key={s} className="px-2 py-0.5 bg-red-50 text-red-700 rounded font-medium text-[11px]">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => handleSelectCareer(c.title)}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1 cursor-pointer"
              >
                <span>Set as Target Goal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
