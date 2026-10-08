from typing import List, Dict, Any

# Configurable category weights for transparent score calculation
CATEGORY_WEIGHTS = {
    "skills": 30,
    "resume": 15,
    "projects": 15,
    "practice": 15,
    "interview": 15,
    "certifications": 10
}

def calculate_career_readiness(
    ats_score: int,
    total_steps: int,
    completed_steps: int,
    skill_gaps: List[Any],
    has_projects: bool = True
) -> Dict[str, Any]:
    """
    Transparent, formulaic Career Readiness calculation.
    """
    # 1. Skills progress component (30% weight)
    matched_skills = sum(1 for g in skill_gaps if getattr(g, "match_status", "") == "STRONG_MATCH")
    total_skills = max(len(skill_gaps), 1)
    skills_ratio = min(1.0, (matched_skills + (completed_steps * 0.5)) / total_skills)
    skills_score = int(skills_ratio * CATEGORY_WEIGHTS["skills"])

    # 2. Resume & ATS component (15% weight)
    resume_score = int((ats_score / 100) * CATEGORY_WEIGHTS["resume"])

    # 3. Project component (15% weight)
    projects_score = int((completed_steps / max(total_steps, 1)) * 7) + (8 if has_projects else 4)
    projects_score = min(CATEGORY_WEIGHTS["projects"], projects_score)

    # 4. Practice & DSA component (15% weight)
    practice_score = int((completed_steps / max(total_steps, 1)) * CATEGORY_WEIGHTS["practice"])

    # 5. Interview preparation (15% weight)
    interview_score = int(skills_ratio * CATEGORY_WEIGHTS["interview"] * 0.8)

    # 6. Certifications (10% weight)
    certs_score = 6  # Baseline detected college curriculum credits

    # Overall Total
    overall = min(100, skills_score + resume_score + projects_score + practice_score + interview_score + certs_score)

    breakdown = [
        {"category": "Technical Skills Coverage", "weight": "30%", "score": skills_score, "max": 30, "color": "bg-indigo-600"},
        {"category": "Resume Quality & ATS Score", "weight": "15%", "score": resume_score, "max": 15, "color": "bg-blue-600"},
        {"category": "Project Portfolio & Practice", "weight": "15%", "score": projects_score, "max": 15, "color": "bg-violet-600"},
        {"category": "Coding & Problem Solving", "weight": "15%", "score": practice_score, "max": 15, "color": "bg-amber-500"},
        {"category": "Technical Interview Readiness", "weight": "15%", "score": interview_score, "max": 15, "color": "bg-emerald-500"},
        {"category": "Certifications & Coursework", "weight": "10%", "score": certs_score, "max": 10, "color": "bg-pink-500"},
    ]

    return {
        "overall_percentage": overall,
        "breakdown": breakdown
    }

def get_next_best_action(steps: List[Any], gaps: List[Any]) -> Dict[str, Any]:
    """
    Identifies the single highest-leverage next task for the student.
    """
    # 1. Look for an in-progress step first
    for step in steps:
        if getattr(step, "status", "") == "IN_PROGRESS":
            return {
                "title": f"Continue: {getattr(step, 'title', 'Next Module')}",
                "reason": f"You are currently working on {getattr(step, 'skill_name', 'this skill')}. Complete its steps to level up your roadmap.",
                "estimated_effort": getattr(step, "duration", "2-3 hours"),
                "skill_name": getattr(step, "skill_name", ""),
                "step_id": getattr(step, "id", None)
            }

    # 2. Look for the first unstarted High Priority step
    for step in steps:
        if getattr(step, "status", "") == "NOT_STARTED":
            return {
                "title": f"Start: {getattr(step, 'title', 'Next Topic')}",
                "reason": f"This is the highest priority missing milestone in your learning sequence for placement preparation.",
                "estimated_effort": getattr(step, "duration", "3-4 hours"),
                "skill_name": getattr(step, "skill_name", ""),
                "step_id": getattr(step, "id", None)
            }

    return {
        "title": "All Initial Milestones Completed!",
        "reason": "Great job! You have marked all current roadmap items as complete. Practice interview problems and build your capstone project.",
        "estimated_effort": "Ongoing",
        "skill_name": "Placement Mastery",
        "step_id": None
    }
