from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from app.database.database import get_db
from app.models.roadmap import SkillGap, RoadmapStep
from app.models.resume import Resume
from app.models.career import CareerTarget
from app.schemas.roadmap import SkillGapResponse, RoadmapStepResponse, StepStatusUpdate
from app.services.skill_gap_service import analyze_skill_gaps
from app.services.roadmap_service import generate_roadmap_for_gaps

router = APIRouter(prefix="/roadmap", tags=["roadmap"])

@router.get("/gaps", response_model=List[SkillGapResponse])
def get_skill_gaps(db: Session = Depends(get_db)):
    # 1. Fetch latest resume
    resume = db.query(Resume).filter(Resume.user_id == 1).order_by(Resume.uploaded_at.desc()).first()
    current_skills = resume.parsed_data.get("skills", []) if resume and resume.parsed_data else []

    # 2. Fetch active career target
    target = db.query(CareerTarget).filter(CareerTarget.user_id == 1, CareerTarget.is_active == True).first()
    target_role = target.role_title if target else "Software Developer"
    job_desc = target.job_description if target else None

    # 3. Analyze gaps
    gaps_data = analyze_skill_gaps(current_skills, target_role, job_desc)

    # 4. Sync with DB
    db.query(SkillGap).filter(SkillGap.user_id == 1).delete()
    db_gaps = []
    for g in gaps_data:
        gap_obj = SkillGap(
            user_id=1,
            career_target_id=target.id if target else None,
            skill_name=g["skill_name"],
            match_status=g["match_status"],
            priority=g["priority"],
            why_it_matters=g["why_it_matters"],
            prerequisites=g["prerequisites"]
        )
        db.add(gap_obj)
        db_gaps.append(gap_obj)

    db.commit()
    for g in db_gaps:
        db.refresh(g)

    return db_gaps

@router.get("/steps", response_model=List[RoadmapStepResponse])
def get_roadmap_steps(db: Session = Depends(get_db)):
    # Check if steps already generated in DB with recommended_projects
    existing_steps = db.query(RoadmapStep).filter(RoadmapStep.user_id == 1).order_by(RoadmapStep.step_number).all()
    if existing_steps and existing_steps[0].recommended_projects:
        return existing_steps

    # Otherwise clear old format steps and generate fresh steps
    db.query(RoadmapStep).filter(RoadmapStep.user_id == 1).delete()

    resume = db.query(Resume).filter(Resume.user_id == 1).order_by(Resume.uploaded_at.desc()).first()
    current_skills = resume.parsed_data.get("skills", []) if resume and resume.parsed_data else []
    target = db.query(CareerTarget).filter(CareerTarget.user_id == 1, CareerTarget.is_active == True).first()
    target_role = target.role_title if target else "Software Developer"
    job_desc = target.job_description if target else None

    gaps = analyze_skill_gaps(current_skills, target_role, job_desc)
    steps_data = generate_roadmap_for_gaps(gaps)

    db_steps = []
    for s in steps_data:
        step_obj = RoadmapStep(
            user_id=1,
            step_number=s["step_number"],
            title=s["title"],
            skill_name=s["skill_name"],
            duration=s["duration"],
            status=s["status"],
            learning_sequence=s.get("learning_sequence", []),
            learning_topics=s.get("learning_topics", []),
            certifications=s.get("certifications", []),
            skill_outcomes=s.get("skill_outcomes", []),
            recommended_projects=s.get("recommended_projects", []),
            practice_guide=s.get("practice_guide"),
            project_title=s.get("project_title"),
            project_description=s.get("project_description"),
            completion_criteria=s.get("completion_criteria")
        )
        db.add(step_obj)
        db_steps.append(step_obj)

    db.commit()
    for s in db_steps:
        db.refresh(s)

    return db_steps

@router.patch("/step/{step_id}/status", response_model=RoadmapStepResponse)
def update_step_status(
    step_id: int,
    payload: StepStatusUpdate,
    db: Session = Depends(get_db)
):
    step = db.query(RoadmapStep).filter(RoadmapStep.id == step_id, RoadmapStep.user_id == 1).first()
    if not step:
        raise HTTPException(status_code=404, detail="Roadmap step not found")

    step.status = payload.status
    if payload.status == "COMPLETED":
        step.completed_at = datetime.utcnow()
    else:
        step.completed_at = None

    db.commit()
    db.refresh(step)
    return step

@router.get("/skill/{skill_name}", response_model=Optional[RoadmapStepResponse])
def get_skill_detail(skill_name: str, db: Session = Depends(get_db)):
    step = db.query(RoadmapStep).filter(
        RoadmapStep.user_id == 1,
        RoadmapStep.skill_name.ilike(f"%{skill_name}%")
    ).first()
    if not step:
        # Fallback to generating template details
        target = db.query(CareerTarget).filter(CareerTarget.user_id == 1, CareerTarget.is_active == True).first()
        target_role = target.role_title if target else "Software Developer"
        job_desc = target.job_description if target else None
        
        gaps = analyze_skill_gaps([], target_role, job_desc)
        fresh_steps = generate_roadmap_for_gaps(gaps)
        for s in fresh_steps:
            if skill_name.lower() in s["skill_name"].lower():
                return RoadmapStep(
                    id=999,
                    user_id=1,
                    step_number=s["step_number"],
                    title=s["title"],
                    skill_name=s["skill_name"],
                    duration=s["duration"],
                    status=s["status"],
                    learning_sequence=s.get("learning_sequence", []),
                    learning_topics=s.get("learning_topics", []),
                    certifications=s.get("certifications", []),
                    skill_outcomes=s.get("skill_outcomes", []),
                    recommended_projects=s.get("recommended_projects", []),
                    practice_guide=s.get("practice_guide"),
                    project_title=s.get("project_title"),
                    project_description=s.get("project_description"),
                    completion_criteria=s.get("completion_criteria")
                )
    return step
