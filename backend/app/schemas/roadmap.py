from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

class SkillGapResponse(BaseModel):
    id: int
    skill_name: str
    match_status: str
    priority: str
    why_it_matters: str
    prerequisites: Optional[str] = None

    class Config:
        from_attributes = True

class RoadmapStepResponse(BaseModel):
    id: int
    step_number: int
    title: str
    skill_name: str
    duration: str
    status: str
    learning_sequence: Optional[List[str]] = []
    learning_topics: Optional[List[str]] = []
    certifications: Optional[List[str]] = []
    skill_outcomes: Optional[List[str]] = []
    recommended_projects: Optional[List[Dict[str, Any]]] = []
    practice_guide: Optional[str] = None
    project_title: Optional[str] = None
    project_description: Optional[str] = None
    completion_criteria: Optional[str] = None
    completed_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class StepStatusUpdate(BaseModel):
    status: str  # NOT_STARTED | IN_PROGRESS | COMPLETED

class DashboardSummary(BaseModel):
    target_role: str
    ats_score: int
    readiness_percentage: int
    missing_skills_count: int
    high_priority_count: int
    completed_steps_count: int
    total_steps_count: int
    next_best_action: Dict[str, Any]
    high_priority_gaps: List[SkillGapResponse]
    recent_roadmap_steps: List[RoadmapStepResponse]
