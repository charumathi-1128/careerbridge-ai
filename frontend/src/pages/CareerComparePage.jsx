import React, { useState, useEffect } from 'react';
import { Card } from '../components/common/Card';
import api from '../services/api';

export const CareerComparePage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComparison();
  }, []);

  const fetchComparison = async () => {
    try {
      const res = await api.get('/career/compare');
      setData(res.data);
    } catch (err) {
      console.error('Failed to load career comparison', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-sm text-slate-500 font-medium">Building comparison matrix...</p>
      </div>
    );
  }

  const { columns = [], matrix = [] } = data || {};

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Career Comparison Matrix</h1>
        <p className="text-sm text-slate-500 mt-1">
          Compare skill requirements across popular technical domains to make an informed career decision.
        </p>
      </div>

      <Card className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-600 uppercase">
              {columns.map((col) => (
                <th key={col} className="py-3.5 px-4 font-bold">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {matrix.map((row) => (
              <tr key={row.skill} className="hover:bg-slate-50/60 transition">
                <td className="py-3.5 px-4 font-semibold text-slate-900">{row.skill}</td>
                <td className="py-3.5 px-4 text-slate-700">{row.swDev}</td>
                <td className="py-3.5 px-4 text-slate-700">{row.dataAnalyst}</td>
                <td className="py-3.5 px-4 text-slate-700">{row.cloudDevOps}</td>
                <td className="py-3.5 px-4 text-slate-700">{row.fullStack}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};
