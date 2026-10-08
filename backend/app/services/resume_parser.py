import io
import re
from typing import Dict, Any, List
import pymupdf
import docx

# Common standard tech skills dictionary for deterministic baseline extraction
COMMON_TECH_SKILLS = [
    "Python", "Java", "C++", "C", "C#", "JavaScript", "TypeScript", "HTML", "CSS",
    "SQL", "PostgreSQL", "MySQL", "MongoDB", "SQLite", "Redis",
    "React", "Node.js", "Express", "FastAPI", "Django", "Flask", "Spring Boot",
    "Git", "GitHub", "Docker", "Kubernetes", "AWS", "Azure", "GCP", "Linux",
    "Data Structures", "Algorithms", "OOP", "DBMS", "Operating Systems", "Computer Networks",
    "Machine Learning", "Deep Learning", "Pandas", "NumPy", "Scikit-Learn", "TensorFlow", "PyTorch",
    "REST API", "GraphQL", "Tailwind CSS", "Bootstrap", "Next.js", "Vue.js"
]

def extract_text_from_pdf(file_bytes: bytes) -> str:
    """Extracts raw text content from PDF file bytes using PyMuPDF."""
    text_content = []
    with pymupdf.open(stream=file_bytes, filetype="pdf") as doc:
        for page in doc:
            text_content.append(page.get_text())
    return "\n".join(text_content).strip()

def extract_text_from_docx(file_bytes: bytes) -> str:
    """Extracts raw text content from DOCX file bytes using python-docx."""
    doc = docx.Document(io.BytesIO(file_bytes))
    text_content = [p.text for p in doc.paragraphs if p.text.strip()]
    return "\n".join(text_content).strip()

def parse_resume_text(raw_text: str) -> Dict[str, Any]:
    """
    Parses resume text to extract skills, contact info, and structural highlights.
    """
    # 1. Extract Emails
    emails = re.findall(r'[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+', raw_text)
    email = emails[0] if emails else None

    # 2. Extract Phone Numbers
    phones = re.findall(r'(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}', raw_text)
    phone = phones[0] if phones else None

    # 3. Extract Skills matching known standard dictionary
    identified_skills = []
    raw_text_lower = raw_text.lower()
    for skill in COMMON_TECH_SKILLS:
        # Match as whole word/phrase
        pattern = r'\b' + re.escape(skill.lower()) + r'\b'
        if re.search(pattern, raw_text_lower):
            identified_skills.append(skill)

    # 4. Extract basic sections (Education, Projects, Experience, Certifications)
    sections = {
        "education": [],
        "projects": [],
        "experience": [],
        "certifications": []
    }

    # Keyword detection for degrees
    if re.search(r'\b(b\.?tech|b\.?e\.?|bca|mca|b\.?sc|m\.?tech|bachelor|master)\b', raw_text_lower):
        sections["education"].append({"degree": "Bachelor of Technology / Engineering (Detected)"})

    return {
        "email": email,
        "phone": phone,
        "skills": sorted(list(set(identified_skills))),
        "education": sections["education"],
        "projects": sections["projects"],
        "experience": sections["experience"],
        "certifications": sections["certifications"]
    }
