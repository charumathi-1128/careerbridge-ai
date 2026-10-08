from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from datetime import datetime

class ResumeBase(BaseModel):
    file_name: str
    file_type: str

class ParsedProfile(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    skills: List[str] = []
    education: List[Dict[str, Any]] = []
    projects: List[Dict[str, Any]] = []
    experience: List[Dict[str, Any]] = []
    certifications: List[str] = []

class ResumeResponse(BaseModel):
    id: int
    user_id: int
    file_name: str
    file_type: str
    raw_text: str
    parsed_data: Optional[Dict[str, Any]] = None
    uploaded_at: datetime

    class Config:
        from_attributes = True
