from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import Dict, Any
import re
from app.database.database import get_db
from app.models.roadmap import SkillGap, RoadmapStep
from app.models.resume import Resume
from app.models.career import CareerTarget
from app.models.user import User
from app.api.dependencies import get_current_user
from app.schemas.roadmap import DashboardSummary
from app.services.ats_service import calculate_ats_compatibility
from app.services.skill_gap_service import analyze_skill_gaps
from app.services.readiness_service import calculate_resume_category_readiness, get_next_best_action

router = APIRouter(prefix="/dashboard", tags=["dashboard"])

def _has_certification_evidence(resume: Resume) -> bool:
    parsed_certifications = (resume.parsed_data or {}).get("certifications", [])
    if parsed_certifications:
        return True
    return bool(re.search(
        r"(?im)^(?!\s*(?:certifications?|certificates?|licenses?)\s*$).*\b(?:certified|certification|certificate|licensed)\b.*$",
        resume.raw_text or ""
    ))

@router.get("/summary", response_model=DashboardSummary)
def get_dashboard_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # 1. Fetch latest resume
    resume = db.query(Resume).filter(Resume.user_id == current_user.id).order_by(Resume.uploaded_at.desc()).first()
    has_resume = bool(resume and resume.raw_text and resume.raw_text.strip())
    current_skills = resume.parsed_data.get("skills", []) if resume and resume.parsed_data else []
    raw_text = resume.raw_text if resume else ""

    # 2. Fetch career target
    target = db.query(CareerTarget).filter(CareerTarget.user_id == current_user.id, CareerTarget.is_active == True).first()
    target_role = target.role_title if target else "Software Developer"
    job_desc = target.job_description if target and target.job_description else ""

    # 3. Calculate ATS
    if has_resume:
        ats_data = calculate_ats_compatibility(
            resume_text=raw_text,
            parsed_skills=current_skills,
            target_role=target_role,
            job_description=job_desc
        )
    else:
        ats_data = {"overall_score": 0}

    # 4. Synchronize fresh skill gaps matching /roadmap/gaps
    analyzed_gaps_data = analyze_skill_gaps(current_skills, target_role, job_desc)
    db.query(SkillGap).filter(SkillGap.user_id == current_user.id).delete()
    db_gaps = []
    for g in analyzed_gaps_data:
        gap_obj = SkillGap(
            user_id=current_user.id,
            career_target_id=target.id if target else None,
            skill_name=g["skill_name"],
            match_status=g["match_status"],
            priority=g["priority"],
            why_it_matters=g["why_it_matters"],
            prerequisites=g.get("prerequisites"),
            learning_topics=g.get("learning_topics", []),
            certifications=g.get("certifications", []),
            practice_platforms=g.get("practice_platforms", []),
            practice_guide=g.get("practice_guide"),
            skill_outcomes=g.get("skill_outcomes", []),
            recommended_projects=g.get("recommended_projects", [])
        )
        db.add(gap_obj)
        db_gaps.append(gap_obj)

    db.commit()
    for g in db_gaps:
        db.refresh(g)

    # 5. Fetch steps
    steps = db.query(RoadmapStep).filter(RoadmapStep.user_id == current_user.id).order_by(RoadmapStep.step_number).all()

    total_steps_count = len(steps) if steps else 6
    completed_steps_count = sum(1 for s in steps if s.status == "COMPLETED") if steps else 0

    # 6. Calculate Readiness & Next Action
    if has_resume:
        readiness = calculate_resume_category_readiness(
            ats_data=ats_data,
            skill_gaps=db_gaps,
            has_certifications=_has_certification_evidence(resume),
        )
    else:
        readiness = {"overall_percentage": 0}

    next_action = get_next_best_action(steps, db_gaps)

    # Missing gaps & counts
    missing_gaps = [g for g in db_gaps if g.match_status != "STRONG_MATCH"]
    missing_count = len(missing_gaps) if has_resume else 0
    high_priority_missing = [g for g in missing_gaps if g.priority == "HIGH"]
    high_priority_count = len(high_priority_missing) if has_resume else 0

    return {
        "target_role": target_role,
        "ats_score": ats_data["overall_score"] if has_resume else 0,
        "readiness_percentage": readiness["overall_percentage"] if has_resume else 0,
        "missing_skills_count": missing_count,
        "high_priority_count": high_priority_count,
        "completed_steps_count": completed_steps_count,
        "total_steps_count": total_steps_count,
        "next_best_action": next_action,
        "high_priority_gaps": missing_gaps if has_resume else [],
        "recent_roadmap_steps": steps[:4] if steps else [],
        "has_resume": has_resume
    }

@router.get("/readiness")
def get_readiness_breakdown(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    resume = db.query(Resume).filter(Resume.user_id == current_user.id).order_by(Resume.uploaded_at.desc()).first()
    has_resume = bool(resume and resume.raw_text and resume.raw_text.strip())
    current_skills = resume.parsed_data.get("skills", []) if resume and resume.parsed_data else []
    raw_text = resume.raw_text if resume else ""

    target = db.query(CareerTarget).filter(CareerTarget.user_id == current_user.id, CareerTarget.is_active == True).first()
    target_role = target.role_title if target else "Software Developer"
    job_desc = target.job_description if target and target.job_description else ""

    if not has_resume:
        return {
            "overall_percentage": 0,
            "ats_score": 0,
            "breakdown": {},
            "status": "NO_RESUME"
        }

    ats_data = calculate_ats_compatibility(
        resume_text=raw_text,
        parsed_skills=current_skills,
        target_role=target_role,
        job_description=job_desc
    )

    gaps = db.query(SkillGap).filter(SkillGap.user_id == current_user.id).all()
    if not gaps:
        gaps = analyze_skill_gaps(current_skills, target_role, job_desc)

    readiness = calculate_resume_category_readiness(
        ats_data=ats_data,
        skill_gaps=gaps,
        has_certifications=_has_certification_evidence(resume),
    )

    return {**readiness, "ats_score": ats_data["overall_score"], "strengths": ats_data["strengths"]}

