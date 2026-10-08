from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from app.database.database import get_db
from app.models.resume import Resume

router = APIRouter(prefix="/career", tags=["career"])

CAREER_ARCHETYPES = [
    {
        "title": "Software Developer",
        "description": "Designs, writes, and tests core software systems, backend services, and algorithms.",
        "required_skills": ["Python", "JavaScript", "SQL", "Data Structures", "Algorithms", "OOP", "Git"],
        "effort": "4–6 weeks"
    },
    {
        "title": "Data Analyst",
        "description": "Inspects, cleans, transforms, and models data to discover actionable insights and reports.",
        "required_skills": ["Python", "SQL", "Pandas", "NumPy", "Power BI", "Statistics", "Excel"],
        "effort": "3–4 weeks"
    },
    {
        "title": "Cloud / DevOps Engineer",
        "description": "Manages server deployments, cloud infrastructure, container clusters, and automated CI/CD.",
        "required_skills": ["Linux", "Docker", "Kubernetes", "AWS", "Git", "CI/CD"],
        "effort": "6–8 weeks"
    },
    {
        "title": "Full Stack Web Developer",
        "description": "Builds complete responsive client-side interfaces and scalable backend REST APIs.",
        "required_skills": ["HTML", "CSS", "JavaScript", "React", "Node.js", "SQL", "REST API", "Git"],
        "effort": "4–6 weeks"
    },
    {
        "title": "Data Scientist / ML Engineer",
        "description": "Applies statistical modeling, machine learning algorithms, and deep neural networks.",
        "required_skills": ["Python", "Machine Learning", "Deep Learning", "Pandas", "NumPy", "Scikit-Learn", "SQL"],
        "effort": "8–10 weeks"
    }
]

@router.get("/options")
def get_career_options(db: Session = Depends(get_db)):
    resume = db.query(Resume).filter(Resume.user_id == 1).order_by(Resume.uploaded_at.desc()).first()
    student_skills = resume.parsed_data.get("skills", []) if resume and resume.parsed_data else []
    student_skills_lower = [s.lower() for s in student_skills]

    results = []
    for arch in CAREER_ARCHETYPES:
        matching = []
        missing = []
        for req in arch["required_skills"]:
            if req.lower() in student_skills_lower or any(s in req.lower() for s in student_skills_lower if len(s) > 2):
                matching.append(req)
            else:
                missing.append(req)

        match_pct = int((len(matching) / max(len(arch["required_skills"]), 1)) * 100)

        results.append({
            "title": arch["title"],
            "description": arch["description"],
            "match_percentage": match_pct,
            "matching_skills": matching,
            "missing_skills": missing,
            "missing_count": len(missing),
            "effort": arch["effort"]
        })

    return results

@router.get("/compare")
def get_career_comparison():
    return {
        "columns": ["Skill / Requirement", "Software Developer", "Data Analyst", "Cloud / DevOps", "Full Stack Dev"],
        "matrix": [
            {"skill": "Python Programming", "swDev": "Required", "dataAnalyst": "Required", "cloudDevOps": "Useful", "fullStack": "Useful"},
            {"skill": "SQL & Relational Databases", "swDev": "Required", "dataAnalyst": "Critical (High)", "cloudDevOps": "Useful", "fullStack": "Required"},
            {"skill": "Data Structures & Algorithms", "swDev": "High Priority", "dataAnalyst": "Low Priority", "cloudDevOps": "Medium", "fullStack": "Medium"},
            {"skill": "React / Frontend Frameworks", "swDev": "Useful", "dataAnalyst": "Low", "cloudDevOps": "Low", "fullStack": "Critical (High)"},
            {"skill": "Docker & Linux Servers", "swDev": "Medium", "dataAnalyst": "Low", "cloudDevOps": "Critical (High)", "fullStack": "Medium"},
            {"skill": "Pandas, NumPy & Statistics", "swDev": "Low", "dataAnalyst": "Critical (High)", "cloudDevOps": "Low", "fullStack": "Low"},
            {"skill": "REST API Architecture", "swDev": "Required", "dataAnalyst": "Low", "cloudDevOps": "Useful", "fullStack": "Critical (High)"}
        ]
    }
