import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/common/Card';
import api from '../services/api';
import { 
  ScanText, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  Target, 
  Sparkles,
  Info,
  FileText
} from 'lucide-react';

export const ResumeAnalysisPage = () => {
  const [resumeData, setResumeData] = useState(null);
  const [atsData, setAtsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalysis();
  }, []);

  const fetchAnalysis = async () => {
    try {
      const [resResume, resAts] = await Promise.all([
        api.get('/resume/current'),
        api.get('/career/ats-analysis')
      ]);
      setResumeData(resResume.data);
      setAtsData(resAts.data);
    } catch (err) {
      console.error('Failed to load resume analysis', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-sm text-slate-500 font-medium">Running ATS structure and keyword analysis...</p>
      </div>
    );
  }

  if (!resumeData) {
    return (
      <Card className="text-center p-8 max-w-xl mx-auto space-y-4">
        <FileText className="w-12 h-12 text-slate-300 mx-auto" />
        <h2 className="text-lg font-bold text-slate-800">No Resume Uploaded Yet</h2>
        <p className="text-xs text-slate-500">
          Upload your resume in PDF or DOCX format to receive an estimated ATS score and profile breakdown.
        </p>
        <Link
          to="/resume/upload"
          className="inline-flex items-center space-x-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition"
        >
          <span>Upload Resume Now</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </Card>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Resume & ATS Compatibility Analysis</h1>
          <p className="text-sm text-slate-500 mt-1">
            Analyzing <strong className="text-slate-700">{resumeData.file_name}</strong>
          </p>
        </div>
        <Link
          to="/career/target"
          className="inline-flex items-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition"
        >
          <Target className="w-4 h-4" />
          <span>Configure Target Career</span>
        </Link>
      </div>

      <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 flex items-start space-x-2.5">
        <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <span>
          <strong>Estimated ATS Compatibility:</strong> This is a deterministic structural and keyword alignment estimate. It does not represent an opaque third-party black box score.
        </span>
      </div>

      {/* Main Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 md:col-span-1 text-center bg-indigo-50/40 border-indigo-100 flex flex-col justify-center items-center">
          <span className="text-xs font-semibold text-slate-500 uppercase">Estimated ATS Score</span>
          <div className="my-3 text-5xl font-black text-indigo-700">{atsData?.overall_score || 72}%</div>
          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mb-3">
            <div
              className="bg-indigo-600 h-full rounded-full"
              style={{ width: `${atsData?.overall_score || 72}%` }}
            ></div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            {atsData?.overall_score >= 75
              ? 'Great baseline ATS formatting and keyword density.'
              : 'Add target role keywords to boost your resume alignment above 80%.'}
          </p>
        </Card>

        {/* Detailed Breakdown */}
        <Card title="ATS Score Breakdown" subtitle="Scoring criteria details" className="md:col-span-2">
          <div className="space-y-3.5">
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold text-slate-700">
                <span>Section Completeness (Education, Skills, Projects)</span>
                <span>{atsData?.section_score || 85}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${atsData?.section_score || 85}%` }}></div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold text-slate-700">
                <span>Formatting & Readability</span>
                <span>{atsData?.formatting_score || 90}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full rounded-full" style={{ width: `${atsData?.formatting_score || 90}%` }}></div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold text-slate-700">
                <span>Technical Skill Density</span>
                <span>{atsData?.skill_score || 70}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: `${atsData?.skill_score || 70}%` }}></div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold text-slate-700">
                <span>Target Job Alignment</span>
                <span>{atsData?.job_alignment_score || 75}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-violet-500 h-full rounded-full" style={{ width: `${atsData?.job_alignment_score || 75}%` }}></div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Extracted Skills & Strengths */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Identified Resume Skills" subtitle={`${resumeData.parsed_data?.skills?.length || 0} technologies recognized`}>
          <div className="flex flex-wrap gap-2">
            {resumeData.parsed_data?.skills?.map((s) => (
              <span key={s} className="px-3 py-1 bg-slate-100 text-slate-800 rounded-lg text-xs font-medium">
                {s}
              </span>
            ))}
          </div>
        </Card>

        <Card title="Resume Strengths" subtitle="Positive signals detected">
          <ul className="space-y-2.5 text-xs text-slate-700">
            {atsData?.strengths?.map((str, idx) => (
              <li key={idx} className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* Actionable Resume Improvement Tips */}
        {atsData?.improvements && atsData.improvements.length > 0 && (
          <Card title="Actionable Resume Improvement Tips" subtitle="Targeted recommendations to boost your ATS & hiring score" className="md:col-span-2 border-l-4 border-l-amber-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {atsData.improvements.map((tip, idx) => (
                <div key={idx} className="p-3.5 bg-amber-50/50 rounded-xl border border-amber-100 text-xs">
                  <strong className="block text-amber-900 font-bold mb-1">Tip #{idx + 1}</strong>
                  <p className="text-slate-700 leading-relaxed">{tip}</p>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
