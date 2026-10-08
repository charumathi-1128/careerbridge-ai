from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

class CareerTargetCreate(BaseModel):
    role_title: str
    target_company: str
    job_description: Optional[str] = None

class CareerTargetResponse(BaseModel):
    id: int
    user_id: int
    role_title: str
    target_company: Optional[str] = None
    job_description: Optional[str] = None
    required_skills: Optional[List[str]] = []
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

class ATSAnalysisResponse(BaseModel):
    overall_score: int
    section_score: int
    formatting_score: int
    skill_score: int
    job_alignment_score: int
    strengths: List[str]
    improvements: List[str]
    sections_detected: Dict[str, bool]
