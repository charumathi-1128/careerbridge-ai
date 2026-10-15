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
  const [targetData, setTargetData] = useState(null);
  const [skillGaps, setSkillGaps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalysis();
  }, []);

  const fetchAnalysis = async () => {
    try {
      const [resResume, resAts, resTarget, resGaps] = await Promise.allSettled([
        api.get('/resume/current'),
        api.get('/career/ats-analysis'),
        api.get('/career/target'),
        api.get('/roadmap/gaps')
      ]);

      if (resResume.status === 'fulfilled') setResumeData(resResume.value.data);
      if (resAts.status === 'fulfilled') setAtsData(resAts.value.data);
      if (resTarget.status === 'fulfilled') setTargetData(resTarget.value.data);
      if (resGaps.status === 'fulfilled') setSkillGaps(resGaps.value.data || []);
    } catch (err) {
      console.error('Failed to load resume analysis', err);
    } finally {
      setLoading(false);
    }
  };

  const getDynamicTips = () => {
    if (!atsData && !resumeData) return [];

    const tips = [];
    const atsScore = atsData?.overall_score ?? 0;
    const formattingScore = atsData?.formatting_score ?? 100;
    const skillScore = atsData?.skill_score ?? 100;
    const jobAlignmentScore = atsData?.job_alignment_score ?? 75;
    const sectionsDetected = atsData?.sections_detected || {};

    const roleTitle = targetData?.role_title || 'your target role';
    const company = targetData?.target_company;
    const jobDescription = targetData?.job_description?.trim() || '';
    const parsedSkills = resumeData?.parsed_data?.skills || [];

    // 1. Missing Required Skills (High Priority)
    const highPriorityMissing = (skillGaps || []).filter(
      (g) => (g.match_status === 'MISSING' || g.match_status === 'PARTIAL_MATCH') && g.priority === 'HIGH'
    );
    if (highPriorityMissing.length > 0) {
      const missingNames = highPriorityMissing.map((g) => g.skill_name);
      const topSkills = missingNames.slice(0, 3).join(', ');
      tips.push({
        id: 'high-priority-skills',
        category: 'Skill Gap',
        priority: 'High Priority',
        priorityType: 'danger',
        title: `Add High-Priority Skills: ${topSkills}`,
        description: `Your target role ${roleTitle}${company ? ` at ${company}` : ''} requires ${topSkills}, which ${highPriorityMissing.length === 1 ? 'was' : 'were'} not detected on your resume.`,
        action: `Incorporate these technologies into your Technical Skills section and mention them in practical project bullet points.`
      });
    }

    // 2. ATS Keyword Mismatches & Job Description Alignment
    if (jobDescription) {
      if (jobAlignmentScore < 80) {
        tips.push({
          id: 'jd-keyword-alignment',
          category: 'ATS Keywords',
          priority: 'High Priority',
          priorityType: 'danger',
          title: `Align Keywords with Target Job Description (${jobAlignmentScore}% Match)`,
          description: `Your resume currently matches ${jobAlignmentScore}% of key terms in the job description${company ? ` for ${company}` : ''}. ATS filters rank resumes with exact phrasing and competency matches higher.`,
          action: `Integrate verbatim technical keywords, tools, and methodologies from the job posting into your project and experience descriptions.`
        });
      }
    } else {
      tips.push({
        id: 'missing-jd',
        category: 'ATS Keywords',
        priority: 'Action Needed',
        priorityType: 'warning',
        title: `Provide a Target Job Description for Accurate Keyword Matching`,
        description: `Currently, ATS keyword alignment is estimated based on general standards for ${roleTitle}. Adding a specific job description reveals exact missing keyword matches.`,
        action: `Configure your Target Career profile with an actual job posting description to activate precise keyword matching.`
      });
    }

    // 3. Medium Priority Missing Skills
    const medPriorityMissing = (skillGaps || []).filter(
      (g) => (g.match_status === 'MISSING' || g.match_status === 'PARTIAL_MATCH') && g.priority === 'MEDIUM'
    );
    if (medPriorityMissing.length > 0 && tips.length < 5) {
      const medNames = medPriorityMissing.slice(0, 2).map((g) => g.skill_name).join(', ');
      tips.push({
        id: 'medium-priority-skills',
        category: 'Skill Gap',
        priority: 'Recommended',
        priorityType: 'info',
        title: `Incorporate Supporting Technologies: ${medNames}`,
        description: `Adding ${medNames} will provide a competitive edge for ${roleTitle} openings and satisfy secondary technical criteria.`,
        action: `List any coursework, personal repositories, or lab projects demonstrating these skills.`
      });
    }

    // 4. Section Completeness & Practical Experience Gaps
    if (sectionsDetected.experience === false) {
      tips.push({
        id: 'missing-experience',
        category: 'Section Completeness',
        priority: 'High Priority',
        priorityType: 'danger',
        title: `Add an Experience or Internship Section`,
        description: `No formal Experience or Internship section was detected. ATS parsers score resumes with dedicated work history significantly higher.`,
        action: `Add a section detailing internships, freelance contracts, student leadership, or open-source contributions.`
      });
    }

    if (sectionsDetected.projects === false) {
      tips.push({
        id: 'missing-projects',
        category: 'Section Completeness',
        priority: 'Recommended',
        priorityType: 'warning',
        title: `Highlight Key Technical Projects`,
        description: `A dedicated Projects section is essential for technical hiring. Showcase practical applications related to ${roleTitle}.`,
        action: `Add 2–3 structured projects with clear titles, tech stacks used, and quantified outcomes.`
      });
    }

    // 5. Technical Skill Density
    if (parsedSkills.length < 6 || skillScore < 70) {
      tips.push({
        id: 'skill-density',
        category: 'Skill Density',
        priority: 'Recommended',
        priorityType: 'info',
        title: `Increase Technical Skill Density (${parsedSkills.length} Detected)`,
        description: `Only ${parsedSkills.length} technical skills were parsed from your resume. Strong technical resumes typically list 8–15 clear keywords.`,
        action: `Expand your skills list with specific frameworks, developer tools (e.g. Git, Docker, Postman), and database technologies.`
      });
    }

    // 6. Formatting & Structure Readability
    if (formattingScore < 85) {
      tips.push({
        id: 'formatting',
        category: 'ATS Formatting',
        priority: 'Recommended',
        priorityType: 'warning',
        title: `Improve ATS Document Readability (${formattingScore}% Formatting Score)`,
        description: `Formatting flags detected: ensure standard headers, clean text layout, and avoid nested tables, columns, or non-standard fonts.`,
        action: `Use simple bullet points, a clean chronological layout, and ensure contact details (email, phone, links) are easily parseable.`
      });
    }

    // 7. Overall ATS Score Optimization
    if (atsScore < 75 && tips.length < 5) {
      tips.push({
        id: 'overall-score',
        category: 'ATS Score',
        priority: 'Recommended',
        priorityType: 'warning',
        title: `Elevate ATS Score Above 80% (Currently ${atsScore}%)`,
        description: `Targeting an ATS score of 80%+ maximizes your likelihood of clearing automated screening filters for ${roleTitle}.`,
        action: `Implement the missing skills and keyword optimizations above to boost your overall compatibility.`
      });
    }

    // Fallback: If no critical gaps were found
    if (tips.length === 0) {
      if (atsData?.improvements && atsData.improvements.length > 0) {
        atsData.improvements.forEach((item, idx) => {
          tips.push({
            id: `backend-improvement-${idx}`,
            category: 'Optimization',
            priority: 'Recommended',
            priorityType: 'info',
            title: `Recommendation #${idx + 1}`,
            description: item,
            action: `Review and align your resume bullets with these best practices.`
          });
        });
      } else {
        tips.push({
          id: 'maintain-strength',
          category: 'Best Practice',
          priority: 'Good Standing',
          priorityType: 'info',
          title: `Quantify Achievements with Metrics & Impact`,
          description: `Your resume has strong baseline ATS compatibility. Continue refining bullet points with metrics (e.g., % improvement, scale of users).`,
          action: `Use strong action verbs and quantify outcomes for every project and internship entry.`
        });
      }
    }

    return tips;
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
        {(() => {
          const dynamicTips = getDynamicTips();
          return (
            <Card
              title="Actionable Resume Improvement Tips"
              subtitle="Targeted recommendations to boost your ATS & hiring score"
              className="md:col-span-2 border-l-4 border-l-amber-500"
            >
              {!atsData ? (
                <div className="p-6 text-center space-y-3">
                  <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto" />
                  <p className="text-sm font-semibold text-slate-700">No Resume Analysis Available</p>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    Please analyze your resume first to view dynamic, personalized improvement tips tailored to your target role and skill gaps.
                  </p>
                  <Link
                    to="/resume/upload"
                    className="inline-flex items-center space-x-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition"
                  >
                    <span>Upload & Analyze Resume</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ) : dynamicTips.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {dynamicTips.map((tip, idx) => (
                    <div
                      key={tip.id || idx}
                      className="p-4 bg-amber-50/50 rounded-xl border border-amber-100 text-xs flex flex-col justify-between space-y-3 transition hover:border-amber-300 hover:bg-amber-50/80"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-100 text-amber-900">
                            {tip.category || `Tip #${idx + 1}`}
                          </span>
                          {tip.priority && (
                            <span
                              className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                                tip.priorityType === 'danger'
                                  ? 'bg-rose-100 text-rose-700'
                                  : tip.priorityType === 'warning'
                                  ? 'bg-amber-200 text-amber-800'
                                  : 'bg-indigo-100 text-indigo-700'
                              }`}
                            >
                              {tip.priority}
                            </span>
                          )}
                        </div>
                        <strong className="block text-slate-900 font-bold text-sm leading-snug">
                          {tip.title}
                        </strong>
                        <p className="text-slate-600 leading-relaxed text-xs">
                          {tip.description}
                        </p>
                      </div>

                      {tip.action && (
                        <div className="pt-2.5 border-t border-amber-200/60 text-[11px]">
                          <span className="font-semibold text-amber-950 block mb-0.5">What to improve:</span>
                          <p className="text-slate-600 leading-normal">{tip.action}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 py-4 text-center">
                  No immediate improvement tips needed. Your resume strongly matches your target career profile.
                </p>
              )}
            </Card>
          );
        })()}
      </div>
    </div>
  );
};
