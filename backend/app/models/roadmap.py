from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, JSON, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database.database import Base

class SkillGap(Base):
    __tablename__ = "skill_gaps"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    career_target_id = Column(Integer, ForeignKey("career_targets.id", ondelete="CASCADE"), nullable=True)
    skill_name = Column(String(100), nullable=False)
    match_status = Column(String(50), nullable=False)  # STRONG_MATCH | PARTIAL_MATCH | MISSING
    priority = Column(String(50), nullable=False)      # HIGH | MEDIUM | LOW
    why_it_matters = Column(Text, nullable=False)
    prerequisites = Column(String(255), nullable=True)
    learning_topics = Column(JSON, nullable=True)
    certifications = Column(JSON, nullable=True)
    practice_platforms = Column(JSON, nullable=True)
    practice_guide = Column(Text, nullable=True)
    skill_outcomes = Column(JSON, nullable=True)
    recommended_projects = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class RoadmapStep(Base):
    __tablename__ = "roadmap_steps"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    step_number = Column(Integer, nullable=False)
    title = Column(String(255), nullable=False)
    skill_name = Column(String(100), nullable=False)
    duration = Column(String(50), nullable=False)
    status = Column(String(50), default="NOT_STARTED")  # NOT_STARTED | IN_PROGRESS | COMPLETED
    phase_goal = Column(Text, nullable=True)
    prerequisites = Column(String(255), nullable=True)
    learning_sequence = Column(JSON, nullable=True)
    learning_topics = Column(JSON, nullable=True)
    certifications = Column(JSON, nullable=True)
    practice_platforms = Column(JSON, nullable=True)
    skill_outcomes = Column(JSON, nullable=True)
    recommended_projects = Column(JSON, nullable=True)
    practice_guide = Column(Text, nullable=True)
    project_title = Column(String(255), nullable=True)
    project_description = Column(Text, nullable=True)
    completion_criteria = Column(Text, nullable=True)
    completed_at = Column(DateTime, nullable=True)

