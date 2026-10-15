from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from typing import Optional
from app.database.database import get_db
from app.models.resume import Resume
from app.models.user import User
from app.api.dependencies import get_current_user
from app.schemas.resume import ResumeResponse
from app.services.resume_parser import (
    extract_text_from_pdf,
    extract_text_from_docx,
    parse_resume_text
)

router = APIRouter(prefix="/resume", tags=["resume"])

@router.post("/upload", response_model=ResumeResponse)
async def upload_resume(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Validate extension
    file_ext = file.filename.split(".")[-1].lower()
    if file_ext not in ["pdf", "docx"]:
        raise HTTPException(
            status_code=400,
            detail="Invalid file format. Please upload a PDF (.pdf) or Word document (.docx)."
        )

    # Read bytes
    content = await file.read()
    if len(content) > 5 * 1024 * 1024:  # 5MB limit
        raise HTTPException(
            status_code=400,
            detail="File size exceeds maximum limit of 5MB."
        )

    # Extract text based on file format
    try:
        if file_ext == "pdf":
            raw_text = extract_text_from_pdf(content)
        else:
            raw_text = extract_text_from_docx(content)
    except Exception as e:
        raise HTTPException(
            status_code=422,
            detail=f"Unable to read text from resume file: {str(e)}"
        )

    if not raw_text.strip():
        raise HTTPException(
            status_code=422,
            detail="The uploaded file appears to be empty or contains scanned images without selectable text."
        )

    # Parse profile and skills
    parsed_info = parse_resume_text(raw_text)

    # Store in database
    new_resume = Resume(
        user_id=current_user.id,
        file_name=file.filename,
        file_type=file_ext,
        raw_text=raw_text,
        parsed_data=parsed_info
    )
    db.add(new_resume)
    db.commit()
    db.refresh(new_resume)

    return new_resume

@router.get("/current", response_model=Optional[ResumeResponse])
def get_current_resume(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    latest_resume = (
        db.query(Resume)
        .filter(Resume.user_id == current_user.id)
        .order_by(Resume.uploaded_at.desc())
        .first()
    )
    return latest_resume
