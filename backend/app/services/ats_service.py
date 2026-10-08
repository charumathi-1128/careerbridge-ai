import re
from typing import Dict, Any, List

def calculate_ats_compatibility(
    resume_text: str,
    parsed_skills: List[str],
    target_role: str = "Software Developer",
    job_description: str = ""
) -> Dict[str, Any]:
    """
    Computes a transparent, explainable ATS compatibility breakdown:
    - Keyword relevance
    - Section completeness
    - Formatting readability
    - Skill density
    - Job description alignment
    """
    text_lower = resume_text.lower()

    # 1. Section Completeness Check
    essential_sections = {
        "education": bool(re.search(r'\b(education|academics|degree|university|college)\b', text_lower)),
        "skills": bool(re.search(r'\b(skills|technical skills|proficiencies|technologies)\b', text_lower)),
        "projects": bool(re.search(r'\b(projects|academic projects|personal projects)\b', text_lower)),
        "experience": bool(re.search(r'\b(experience|internship|work experience|employment)\b', text_lower)),
    }
    present_sections_count = sum(1 for present in essential_sections.values() if present)
    section_score = int((present_sections_count / len(essential_sections)) * 100)

    # 2. Formatting Compatibility
    # Checks for clean line structures, email presence, reasonable word count
    word_count = len(resume_text.split())
    formatting_score = 90
    if word_count < 150:
        formatting_score -= 25
    elif word_count > 1200:
        formatting_score -= 15
    if not re.search(r'[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+', text_lower):
        formatting_score -= 20

    # 3. Skill & Keyword Relevance
    skill_count = len(parsed_skills)
    skill_score = min(100, int((skill_count / 8) * 100)) if skill_count > 0 else 30

    # 4. Job Alignment Score
    if job_description.strip():
        # Match keywords from job description
        jd_words = set(re.findall(r'\b[a-zA-Z]{3,}\b', job_description.lower()))
        matched_words = [w for w in jd_words if w in text_lower]
        job_alignment_score = min(100, int((len(matched_words) / max(len(jd_words), 1)) * 140))
    else:
        # Generic role alignment
        job_alignment_score = 75

    # Overall Weighted Estimated ATS Score
    overall_score = int(
        (section_score * 0.25) +
        (formatting_score * 0.20) +
        (skill_score * 0.30) +
        (job_alignment_score * 0.25)
    )

    # Strengths Identification
    strengths = []
    if section_score >= 75:
        strengths.append("Contains well-structured standard resume sections (Education, Skills, Projects).")
    if skill_count >= 5:
        strengths.append(f"Strong initial technical keyword density ({skill_count} relevant technologies detected).")
    if formatting_score >= 80:
        strengths.append("Clean text formatting suitable for standard recruiter ATS parsing systems.")

    # Actionable Improvements (Never hallucinating numbers)
    improvements = []
    if not essential_sections["experience"]:
        improvements.append("Consider adding an Internships or Practical Experience section to boost profile strength.")
    if skill_count < 6:
        improvements.append("Add more specific technical tools, libraries, or programming languages relevant to your target role.")
    if not job_description.strip():
        improvements.append("Upload or paste a target Job Description to receive exact keyword gap alignment.")
    else:
        improvements.append("Incorporate specific action verbs and technical keywords from the provided job description into your project bullet points.")

    return {
        "overall_score": overall_score,
        "section_score": section_score,
        "formatting_score": formatting_score,
        "skill_score": skill_score,
        "job_alignment_score": job_alignment_score,
        "strengths": strengths,
        "improvements": improvements,
        "sections_detected": essential_sections
    }
