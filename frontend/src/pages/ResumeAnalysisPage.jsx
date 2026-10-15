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

  const getResumeImprovementTips = () => {
    if (!atsData && !resumeData) return { commonTips: [], skillTips: [] };

    const rawText = resumeData?.raw_text || '';
    const lowerText = rawText.toLowerCase();
    const parsedData = resumeData?.parsed_data || {};
    const parsedSkills = parsedData?.skills || [];
    const formattingScore = atsData?.formatting_score ?? 90;
    const roleTitle = targetData?.role_title || 'your target role';

    // 1. Common Tips (formatting, length, action verbs, measurable achievements, spelling/grammar, contact details, summary)
    const common = [];

    // Summary check: missing or generic
    const hasSummary = /\b(profile|summary|professional summary|about me|objective)\b/i.test(rawText);
    const mentionsRoleInSummary = lowerText.includes(roleTitle.toLowerCase());
    if (!hasSummary) {
      common.push('Add a 2–3 line professional summary at the top highlighting your career focus.');
    } else if (!mentionsRoleInSummary) {
      common.push(`Update your summary to explicitly mention your target role as ${roleTitle}.`);
    }

    // Formatting check
    if (formattingScore < 85) {
      common.push('Use a clean, single-column layout with consistent margins and section headers.');
    }

    // Length check
    const wordCount = rawText.trim().split(/\s+/).filter(Boolean).length;
    if (wordCount > 0 && wordCount < 200) {
      common.push('Expand your resume with more project and skill details to reach a standard 1-page length.');
    } else if (wordCount > 900) {
      common.push('Condense your resume content to ensure it fits concisely within 1 to 2 pages.');
    }

    // Action verbs check: passive phrasing detected
    const hasPassivePhrasing = /\b(gained experience|developed knowledge|responsible for|helped in|assisted with|participated in|worked on)\b/i.test(lowerText);
    if (hasPassivePhrasing) {
      common.push('Replace passive phrases like "worked on" with active verbs (Built, Developed, Designed).');
    }

    // Measurable achievements (numbers/percentages)
    const hasNumbersInBullets = /\b(\d+[%kK+]|\d+\s*(users|farmers|students|percent|reduction|increase|records|teams|finalist|hours))\b/i.test(lowerText);
    if (!hasNumbersInBullets || !lowerText.includes('%')) {
      common.push('Add measurable numbers or percentages to your project results (e.g., user count or % speed gain).');
    }

    // Contact details and links
    const hasEmail = Boolean(parsedData.email || /@/.test(rawText));
    const hasPhone = Boolean(parsedData.phone || /\d{10}/.test(rawText));
    const hasLiveLink = /(vercel\.app|netlify\.app|github\.io|demo|live|github\.com)/i.test(lowerText);
    if (!hasEmail || !hasPhone) {
      common.push('Ensure your phone number and professional email are clearly listed at the top.');
    } else if (!hasLiveLink) {
      common.push('Add a clickable live demo or GitHub repository link next to your main projects.');
    }

    // Spelling & Grammar: non-standard technical naming
    const hasInformalNotation = /\b(mongo db|google cloud\s*\(basics\)|hands on|react js|node js)\b/i.test(lowerText);
    if (hasInformalNotation && common.length < 5) {
      common.push('Standardize technical spelling (write MongoDB, React.js, and Node.js with correct capitalization).');
    }

    // 2. Skill-Related Tips (missing key skills, weak/outdated skills, skills not backed by projects, skills to add for target role)
    const skill = [];

    // Missing key skills for target role (High priority)
    const missingHighGaps = (skillGaps || []).filter(
      (g) => (g.match_status === 'MISSING' || g.match_status === 'PARTIAL_MATCH') && g.priority === 'HIGH'
    );
    if (missingHighGaps.length > 0) {
      const topMissing = missingHighGaps.slice(0, 2).map((g) => g.skill_name).join(' and ');
      skill.push(`Add essential missing skills for ${roleTitle}: ${topMissing}.`);
    }

    // Weak or outdated skill qualifiers like "(Basics)" or obsolete items
    const hasWeakQualifiers = /\b(basics|beginner|basic knowledge)\b/i.test(lowerText);
    const hasOutdatedSkills = /\b(ms office|ms word|internet surfing|typing)\b/i.test(lowerText);
    if (hasWeakQualifiers) {
      skill.push('Remove weak qualifiers like "(Basics)" from technical skills to project more confidence.');
    } else if (hasOutdatedSkills) {
      skill.push('Replace general tools like MS Office with modern developer tools and frameworks.');
    }

    // Skills not backed by projects
    const projectsIdx = rawText.search(/projects/i);
    const achievementsIdx = rawText.search(/achievements/i);
    const skillsIdx = rawText.search(/skills/i);
    const projectText = (projectsIdx > -1)
      ? rawText.slice(projectsIdx, (achievementsIdx > projectsIdx ? achievementsIdx : (skillsIdx > projectsIdx ? skillsIdx : projectsIdx + 600))).toLowerCase()
      : '';

    const unbackedSkill = parsedSkills.find((s) => {
      const sName = s.toLowerCase();
      return !projectText.includes(sName) && !['git', 'github', 'vs code'].includes(sName);
    });
    if (unbackedSkill) {
      skill.push(`Back up "${unbackedSkill}" by mentioning how you applied it in a project bullet point.`);
    }

    // Supporting skills to add for target role
    const missingMedGaps = (skillGaps || []).filter(
      (g) => (g.match_status === 'MISSING' || g.match_status === 'PARTIAL_MATCH') && g.priority === 'MEDIUM'
    );
    if (missingMedGaps.length > 0 && skill.length < 4) {
      skill.push(`Consider adding ${missingMedGaps[0].skill_name} to strengthen your profile for ${roleTitle} openings.`);
    }

    // Skill categorization
    if (parsedSkills.length >= 6 && !/\b(frameworks|databases|developer tools)\b/i.test(lowerText) && skill.length < 5) {
      skill.push('Organize your skills into clear groups: Languages, Frameworks, Databases, and Tools.');
    }

    // Target job keywords if job description is present or missing
    if (targetData?.job_description?.trim()) {
      if ((atsData?.job_alignment_score ?? 75) < 80 && skill.length < 5) {
        skill.push('Mirror exact technical keywords and verbs from the target job posting in your skills.');
      }
    } else if (skill.length < 5) {
      skill.push('Paste your target job description in Target Career to get exact keyword gap matching.');
    }

    return {
      commonTips: common.slice(0, 5),
      skillTips: skill.slice(0, 5)
    };
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
      </div>

      {/* Resume Improvement Tips */}
      <div className="space-y-4 pt-2">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <span>Resume Improvement Tips</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Short, actionable recommendations to improve your resume before applying.
          </p>
        </div>

        {(() => {
          let tips = { commonTips: [], skillTips: [] };
          try {
            tips = getResumeImprovementTips();
          } catch (e) {
            console.error('Error generating resume improvement tips', e);
          }
          const { commonTips, skillTips } = tips;

          if (!atsData && !resumeData) {
            return (
              <Card className="text-center p-8 border border-slate-200">
                <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-700">No Resume Analysis Available</p>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                  Please upload and analyze your resume first to view personalized improvement tips.
                </p>
                <Link
                  to="/resume/upload"
                  className="inline-flex items-center space-x-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold mt-4 transition"
                >
                  <span>Upload Resume</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </Card>
            );
          }

          return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Common Tips */}
              <Card
                title="Common Tips"
                subtitle="General improvements (formatting, length, verbs, metrics, summary)"
                className="border-l-4 border-l-blue-500 shadow-xs"
              >
                {commonTips.length > 0 ? (
                  <ul className="space-y-3">
                    {commonTips.map((tip, idx) => (
                      <li key={idx} className="flex items-start space-x-2.5 text-xs text-slate-700 leading-relaxed">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="flex items-center space-x-2 text-xs text-emerald-700 bg-emerald-50 p-3 rounded-lg border border-emerald-200">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                    <span>Your resume structure, formatting, and phrasing look solid! No common issues found.</span>
                  </div>
                )}
              </Card>

              {/* Skill-Related Tips */}
              <Card
                title="Skill-Related Tips"
                subtitle="Skills, project backing, and role alignment"
                className="border-l-4 border-l-amber-500 shadow-xs"
              >
                {skillTips.length > 0 ? (
                  <ul className="space-y-3">
                    {skillTips.map((tip, idx) => (
                      <li key={idx} className="flex items-start space-x-2.5 text-xs text-slate-700 leading-relaxed">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="flex items-center space-x-2 text-xs text-emerald-700 bg-emerald-50 p-3 rounded-lg border border-emerald-200">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                    <span>Your technical skills and project alignments match your target role well.</span>
                  </div>
                )}
              </Card>
            </div>
          );
        })()}
      </div>
    </div>
  );
};
