import React, { useState, useEffect } from 'react';
import { Card } from '../components/common/Card';
import api from '../services/api';
import { FileCheck2, AlertCircle, Lightbulb, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ResumeImprovementPage = () => {
  const [atsData, setAtsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const fetchSuggestions = async () => {
    try {
      const res = await api.get('/career/ats-analysis');
      setAtsData(res.data);
    } catch (err) {
      console.error('Failed to load resume suggestions', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-sm text-slate-500 font-medium">Analyzing resume bullet points and missing keywords...</p>
      </div>
    );
  }

  const improvements = atsData?.improvements || [
    "Include measurable impact metrics and statistics in your project descriptions (e.g. 'reduced latency by 20%').",
    "Add more industry-standard technical keywords matching your target role.",
    "Ensure consistent formatting and clear section headings for ATS scanners."
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Actionable Resume Improvement Suggestions</h1>
        <p className="text-sm text-slate-500 mt-1">
          Recommendations generated directly from your resume parsing and ATS target alignment.
        </p>
      </div>

      <div className="space-y-4">
        {improvements.map((suggestion, idx) => (
          <Card key={idx} className="p-5 border-l-4 border-l-amber-500">
            <div className="flex items-start space-x-3">
              <Lightbulb className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h3 className="font-bold text-slate-900 text-sm">Improvement Tip #{idx + 1}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{suggestion}</p>
              </div>
            </div>
          </Card>
        ))}

        <Card className="p-5 border-l-4 border-l-indigo-500">
          <div className="flex items-start space-x-3">
            <FileCheck2 className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Action Verb Best Practices</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Begin each bullet point with strong engineering action verbs: <strong>Architected, Implemented, Engineered, Optimized, Containerized, Streamlined</strong>.
              </p>
            </div>
          </div>
        </Card>
      </div>

      <div className="flex justify-end pt-2">
        <Link
          to="/resume/upload"
          className="inline-flex items-center space-x-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition"
        >
          <span>Upload Updated Resume</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
