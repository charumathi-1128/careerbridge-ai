from typing import List, Dict, Any

CATEGORY_WEIGHTS = {
    "skills": 35,
    "projects": 25,
    "resume": 20,
    "certifications": 10,
    "practice": 10
}

ROLE_SALARY_BENCHMARKS = {
    "software developer": {"salary_range": "$85,000 - $130,000", "demand_level": "High (94%)", "hiring_season": "Year-round / Campus Q3-Q4"},
    "data analyst": {"salary_range": "$75,000 - $115,000", "demand_level": "Very High (92%)", "hiring_season": "Year-round"},
    "frontend developer": {"salary_range": "$80,000 - $125,000", "demand_level": "High (90%)", "hiring_season": "Q1 & Q3"},
    "backend developer": {"salary_range": "$90,000 - $140,000", "demand_level": "Very High (95%)", "hiring_season": "Year-round"},
    "full stack developer": {"salary_range": "$95,000 - $145,000", "demand_level": "Extremely High (98%)", "hiring_season": "Year-round"},
    "machine learning engineer": {"salary_range": "$110,000 - $165,000", "demand_level": "Explosive (97%)", "hiring_season": "Year-round"},
    "devops engineer": {"salary_range": "$95,000 - $150,000", "demand_level": "Very High (93%)", "hiring_season": "Year-round"}
}

def calculate_career_readiness(
    ats_score: int,
    total_steps: int,
    completed_steps: int,
    skill_gaps: List[Any],
    has_projects: bool = True,
    target_role: str = "Software Developer"
) -> Dict[str, Any]:
    """
    Transparent, formulaic Career Readiness calculation with strengths, blockers,
    and market benchmark metrics.
    """
    # 1. Technical Skills Match (35% weight)
    matched_skills_count = sum(1 for g in skill_gaps if getattr(g, "match_status", g.get("match_status", "")) == "STRONG_MATCH")
    partial_skills_count = sum(1 for g in skill_gaps if getattr(g, "match_status", g.get("match_status", "")) == "PARTIAL_MATCH")
    total_skills = max(len(skill_gaps), 1)

    skill_credits = matched_skills_count + (partial_skills_count * 0.5) + (completed_steps * 0.4)
    skills_ratio = min(1.0, skill_credits / total_skills)
    skills_score = int(skills_ratio * CATEGORY_WEIGHTS["skills"])

    # 2. Project & Portfolio Depth (25% weight)
    proj_completion_ratio = (completed_steps / max(total_steps, 1))
    projects_score = int(proj_completion_ratio * 12) + (13 if has_projects else 6)
    projects_score = min(CATEGORY_WEIGHTS["projects"], max(5, projects_score))

    # 3. Resume & ATS Quality (20% weight)
    resume_score = int((ats_score / 100) * CATEGORY_WEIGHTS["resume"])

    # 4. Certifications & Credentials (10% weight)
    certs_score = min(CATEGORY_WEIGHTS["certifications"], 6 + int(completed_steps * 1.5))

    # 5. Problem Solving & DSA Practice (10% weight)
    practice_score = min(CATEGORY_WEIGHTS["practice"], 4 + int(completed_steps * 2))

    # Overall Total
    overall = min(100, skills_score + projects_score + resume_score + certs_score + practice_score)

    if overall >= 80:
        readiness_status = "Placement Ready"
        readiness_badge_color = "emerald"
    elif overall >= 60:
        readiness_status = "Intermediate Readiness"
        readiness_badge_color = "blue"
    elif overall >= 40:
        readiness_status = "Developing Competency"
        readiness_badge_color = "amber"
    else:
        readiness_status = "Foundational Stage"
        readiness_badge_color = "red"

    breakdown = [
        {
            "category": "Technical Skills Match",
            "weight": "35%",
            "score": skills_score,
            "max": 35,
            "percentage": int((skills_score / 35) * 100),
            "color": "bg-indigo-600",
            "description": f"{matched_skills_count} verified strong match skills, {partial_skills_count} partial competencies."
        },
        {
            "category": "Experience & Project Depth",
            "weight": "25%",
            "score": projects_score,
            "max": 25,
            "percentage": int((projects_score / 25) * 100),
            "color": "bg-violet-600",
            "description": "Portfolio projects and hands-on repository implementations."
        },
        {
            "category": "ATS Resume Quality & Impact",
            "weight": "20%",
            "score": resume_score,
            "max": 20,
            "percentage": int((resume_score / 20) * 100),
            "color": "bg-sky-500",
            "description": f"Keyword density, structure, and readability ({ats_score}% ATS match)."
        },
        {
            "category": "Certifications & Credentials",
            "weight": "10%",
            "score": certs_score,
            "max": 10,
            "percentage": int((certs_score / 10) * 100),
            "color": "bg-emerald-500",
            "description": "Recognized industry certifications & verified test assessments."
        },
        {
            "category": "Coding & Problem Solving (DSA)",
            "weight": "10%",
            "score": practice_score,
            "max": 10,
            "percentage": int((practice_score / 10) * 100),
            "color": "bg-amber-500",
            "description": "Algorithmic drills, coding challenges & technical interview preparedness."
        },
    ]

    # Strengths list
    strengths = []
    for g in skill_gaps:
        status = getattr(g, "match_status", g.get("match_status", ""))
        name = getattr(g, "skill_name", g.get("skill_name", ""))
        if status == "STRONG_MATCH":
            strengths.append(f"Strong verified background in {name}")
    if ats_score >= 70:
        strengths.append(f"High ATS Resume Score ({ats_score}%) with good section formatting")
    if has_projects:
        strengths.append("Demonstrated hands-on experience through project portfolio")
    if not strengths:
        strengths = [
            "Good baseline resume foundation",
            "Clear career target alignment",
            "Ready for targeted technical upskilling"
        ]

    # Priority blocker gaps
    blockers = []
    for g in skill_gaps:
        status = getattr(g, "match_status", g.get("match_status", ""))
        prio = getattr(g, "priority", g.get("priority", ""))
        name = getattr(g, "skill_name", g.get("skill_name", ""))
        why = getattr(g, "why_it_matters", g.get("why_it_matters", ""))
        if status == "MISSING" and prio == "HIGH":
            blockers.append({"skill_name": name, "priority": "High", "impact": why})
        elif status == "PARTIAL_MATCH" and prio == "HIGH":
            blockers.append({"skill_name": name, "priority": "Medium", "impact": f"Deepen {name} to full mastery for senior interview rounds."})

    # Actionable 100% roadmap steps
    actionable_steps = []
    step_num = 1

    # First blocker
    if blockers:
        actionable_steps.append({
            "order": step_num,
            "title": f"Complete Core Skill: {blockers[0]['skill_name']}",
            "impact": "+15% Readiness",
            "description": f"Master the learning modules and practice drills for {blockers[0]['skill_name']}.",
            "category": "Skill Acquisition"
        })
        step_num += 1

    actionable_steps.append({
        "order": step_num,
        "title": "Build & Deploy 1 Recommended Portfolio Project",
        "impact": "+12% Readiness",
        "description": "Add a production-ready application with GitHub code, live deployment demo, and clean README.",
        "category": "Portfolio"
    })
    step_num += 1

    if len(blockers) > 1:
        actionable_steps.append({
            "order": step_num,
            "title": f"Address Secondary Gap: {blockers[1]['skill_name']}",
            "impact": "+10% Readiness",
            "description": blockers[1]["impact"],
            "category": "Skill Acquisition"
        })
        step_num += 1

    actionable_steps.append({
        "order": step_num,
        "title": "Acquire 1 Industry Recognized Certification",
        "impact": "+8% Readiness",
        "description": "Complete a certified assessment (e.g. AWS / HackerRank / Coursera) to validate competency on your resume.",
        "category": "Certification"
    })

    # Benchmark metrics
    role_key = target_role.lower().strip()
    benchmark_meta = ROLE_SALARY_BENCHMARKS.get(
        role_key,
        {"salary_range": "$80,000 - $135,000", "demand_level": "High (90%)", "hiring_season": "Year-round"}
    )

    return {
        "overall_percentage": overall,
        "readiness_status": readiness_status,
        "readiness_badge_color": readiness_badge_color,
        "target_role": target_role,
        "salary_range": benchmark_meta["salary_range"],
        "demand_level": benchmark_meta["demand_level"],
        "hiring_season": benchmark_meta["hiring_season"],
        "breakdown": breakdown,
        "strengths": strengths,
        "priority_blockers": blockers,
        "actionable_steps": actionable_steps
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
