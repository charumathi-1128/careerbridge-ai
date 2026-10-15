from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Optional, Dict, Any, List
from app.database.database import get_db
from app.models.career import CareerTarget
from app.models.resume import Resume
from app.models.roadmap import SkillGap, RoadmapStep
from app.models.user import User
from app.api.dependencies import get_current_user
from app.schemas.career import CareerTargetCreate, CareerTargetResponse, ATSAnalysisResponse
from app.services.ats_service import calculate_ats_compatibility
from app.services.skill_gap_service import get_role_skills_list

router = APIRouter(prefix="/career", tags=["career"])

@router.post("/target", response_model=CareerTargetResponse)
def set_career_target(
    target_data: CareerTargetCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Dynamically extract and assign required skills for any custom or standard role
    skills = get_role_skills_list(
        role_title=target_data.role_title,
        job_description=target_data.job_description
    )

    # Deactivate previous targets
    db.query(CareerTarget).filter(CareerTarget.user_id == current_user.id).update({"is_active": False})

    # Clear outdated roadmap steps & skill gaps so fresh ones generate for this target
    db.query(RoadmapStep).filter(RoadmapStep.user_id == current_user.id).delete()
    db.query(SkillGap).filter(SkillGap.user_id == current_user.id).delete()

    if not target_data.role_title or not target_data.role_title.strip():
        raise HTTPException(status_code=400, detail="Target role is mandatory.")

    if not target_data.target_company or not target_data.target_company.strip():
        raise HTTPException(status_code=400, detail="Target company is mandatory.")

    new_target = CareerTarget(
        user_id=current_user.id,
        role_title=target_data.role_title.strip(),
        target_company=target_data.target_company.strip(),
        job_description=target_data.job_description.strip() if target_data.job_description else None,
        required_skills=skills,
        is_active=True
    )
    db.add(new_target)
    db.commit()
    db.refresh(new_target)
    return new_target

@router.get("/target", response_model=Optional[CareerTargetResponse])
def get_career_target(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    active_target = (
        db.query(CareerTarget)
        .filter(CareerTarget.user_id == current_user.id, CareerTarget.is_active == True)
        .order_by(CareerTarget.created_at.desc())
        .first()
    )
    return active_target

@router.get("/ats-analysis", response_model=ATSAnalysisResponse)
def get_ats_analysis(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Fetch latest resume
    resume = db.query(Resume).filter(Resume.user_id == current_user.id).order_by(Resume.uploaded_at.desc()).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Please upload a resume first before viewing ATS analysis.")

    # Fetch active career target (if any)
    target = db.query(CareerTarget).filter(CareerTarget.user_id == current_user.id, CareerTarget.is_active == True).first()
    target_role = target.role_title if target else "Software Developer"
    job_desc = target.job_description if target and target.job_description else ""

    parsed_skills = resume.parsed_data.get("skills", []) if resume.parsed_data else []

    analysis = calculate_ats_compatibility(
        resume_text=resume.raw_text,
        parsed_skills=parsed_skills,
        target_role=target_role,
        job_description=job_desc
    )
    return analysis
