from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database.database import engine, Base
from app.models.user import User
from app.models.resume import Resume
from app.models.career import CareerTarget
from app.models.roadmap import SkillGap, RoadmapStep
from app.api import auth, resume, career, roadmap, dashboard, career_options

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="CareerBridge AI API",
    description="AI-powered career readiness, job preparation, and skill gap analysis platform",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router)
app.include_router(resume.router)
app.include_router(career.router)
app.include_router(roadmap.router)
app.include_router(dashboard.router)
app.include_router(career_options.router)


@app.get("/")
def root():
    return {"message": "CareerBridge AI backend is running"}


@app.get("/health")
def health_check():
    return {"status": "ok", "service": "careerbridge-backend"}
    