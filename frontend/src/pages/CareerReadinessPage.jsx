import React, { useState, useEffect } from 'react';
import { Card } from '../components/common/Card';
import api from '../services/api';
import { CheckCircle2, TrendingUp, Info } from 'lucide-react';

export const CareerReadinessPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReadiness();
  }, []);

  const fetchReadiness = async () => {
    try {
      const res = await api.get('/dashboard/readiness');
      setData(res.data);
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
        <p className="text-sm text-slate-500 font-medium">Calculating dynamic career readiness metrics...</p>
      </div>
    );
  }

  const { overall_percentage = 60, breakdown = [] } = data || {};

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Career Readiness Score</h1>
        <p className="text-sm text-slate-500 mt-1">
          A transparent, weighted estimation of your overall preparation for your target role.
        </p>
      </div>

      <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 flex items-start space-x-2.5">
        <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <span>
          <strong>Estimated Career Readiness:</strong> This score represents an estimated progress metric based on your uploaded resume, completed roadmap milestones, and projects. It is a guide for your preparation and does not guarantee placement.
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 md:col-span-1 text-center bg-indigo-50/40 border-indigo-100 flex flex-col justify-center items-center">
          <span className="text-xs font-semibold text-slate-500 uppercase">Estimated Total Readiness</span>
          <div className="my-4 text-5xl font-black text-indigo-700">{overall_percentage}%</div>
          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mb-3">
            <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${overall_percentage}%` }}></div>
          </div>
          <p className="text-xs text-slate-600">
            {overall_percentage >= 75
              ? 'Excellent progress! Your profile is well-rounded for placement drives.'
              : 'Keep advancing through your prioritized roadmap steps to boost your readiness.'}
          </p>
        </Card>

        <Card title="Weighted Category Breakdown" subtitle="Formula-driven progress weights" className="md:col-span-2">
          <div className="space-y-4">
            {breakdown.map((item) => (
              <div key={item.category} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span>{item.category} ({item.weight} weight)</span>
                  <span>{item.score} / {item.max} pts</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className={`${item.color} h-full rounded-full`}
                    style={{ width: `${(item.score / item.max) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
