from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import Dict, Any
from app.database.database import get_db
from app.models.roadmap import SkillGap, RoadmapStep
from app.models.resume import Resume
from app.models.career import CareerTarget
from app.schemas.roadmap import DashboardSummary
from app.services.ats_service import calculate_ats_compatibility
from app.services.skill_gap_service import analyze_skill_gaps
from app.services.roadmap_service import generate_roadmap_for_gaps
from app.services.readiness_service import calculate_career_readiness, get_next_best_action

router = APIRouter(prefix="/dashboard", tags=["dashboard"])

@router.get("/summary", response_model=DashboardSummary)
def get_dashboard_summary(db: Session = Depends(get_db)):
    # 1. Fetch resume
    resume = db.query(Resume).filter(Resume.user_id == 1).order_by(Resume.uploaded_at.desc()).first()
    current_skills = resume.parsed_data.get("skills", []) if resume and resume.parsed_data else []
    raw_text = resume.raw_text if resume else ""

    # 2. Fetch career target
    target = db.query(CareerTarget).filter(CareerTarget.user_id == 1, CareerTarget.is_active == True).first()
    target_role = target.role_title if target else "Software Developer"
    job_desc = target.job_description if target and target.job_description else ""

    # 3. Calculate ATS
    ats_data = calculate_ats_compatibility(
        resume_text=raw_text,
        parsed_skills=current_skills,
        target_role=target_role,
        job_description=job_desc
    ) if raw_text else {"overall_score": 60}

    # 4. Fetch or calculate gaps
    gaps = db.query(SkillGap).filter(SkillGap.user_id == 1).all()
    if not gaps:
        analyzed_gaps = analyze_skill_gaps(current_skills, target_role)
    else:
        analyzed_gaps = gaps

    # 5. Fetch steps
    steps = db.query(RoadmapStep).filter(RoadmapStep.user_id == 1).order_by(RoadmapStep.step_number).all()

    total_steps_count = len(steps) if steps else 6
    completed_steps_count = sum(1 for s in steps if s.status == "COMPLETED") if steps else 0

    # 6. Calculate Readiness & Next Action
    readiness = calculate_career_readiness(
        ats_score=ats_data["overall_score"],
        total_steps=total_steps_count,
        completed_steps=completed_steps_count,
        skill_gaps=analyzed_gaps,
        has_projects=bool(resume and resume.parsed_data.get("projects"))
    )

    next_action = get_next_best_action(steps, analyzed_gaps)

    # Missing & High priority counts
    missing_count = sum(1 for g in analyzed_gaps if getattr(g, "match_status", g.get("match_status", "")) != "STRONG_MATCH")
    high_priority_count = sum(1 for g in analyzed_gaps if getattr(g, "priority", g.get("priority", "")) == "HIGH")

    # High priority gaps list
    high_priority_gaps = [
        g for g in analyzed_gaps if getattr(g, "priority", g.get("priority", "")) == "HIGH"
    ][:3]

    return {
        "target_role": target_role,
        "ats_score": ats_data["overall_score"],
        "readiness_percentage": readiness["overall_percentage"],
        "missing_skills_count": missing_count,
        "high_priority_count": high_priority_count,
        "completed_steps_count": completed_steps_count,
        "total_steps_count": total_steps_count,
        "next_best_action": next_action,
        "high_priority_gaps": high_priority_gaps,
        "recent_roadmap_steps": steps[:4] if steps else []
    }

@router.get("/readiness")
def get_readiness_breakdown(db: Session = Depends(get_db)):
    resume = db.query(Resume).filter(Resume.user_id == 1).order_by(Resume.uploaded_at.desc()).first()
    current_skills = resume.parsed_data.get("skills", []) if resume and resume.parsed_data else []
    raw_text = resume.raw_text if resume else ""

    target = db.query(CareerTarget).filter(CareerTarget.user_id == 1, CareerTarget.is_active == True).first()
    target_role = target.role_title if target else "Software Developer"
    job_desc = target.job_description if target and target.job_description else ""

    ats_data = calculate_ats_compatibility(
        resume_text=raw_text,
        parsed_skills=current_skills,
        target_role=target_role,
        job_description=job_desc
    ) if raw_text else {"overall_score": 60}

    gaps = db.query(SkillGap).filter(SkillGap.user_id == 1).all()
    steps = db.query(RoadmapStep).filter(RoadmapStep.user_id == 1).all()

    total_steps_count = len(steps) if steps else 6
    completed_steps_count = sum(1 for s in steps if s.status == "COMPLETED") if steps else 0

    readiness = calculate_career_readiness(
        ats_score=ats_data["overall_score"],
        total_steps=total_steps_count,
        completed_steps=completed_steps_count,
        skill_gaps=gaps,
        has_projects=bool(resume and resume.parsed_data.get("projects"))
    )

    return readiness
