# CareerBridge AI — Complete Project Explanation

---

## 🎯 What Is This Project?

**CareerBridge AI** is a **career readiness platform for students and job seekers**. It helps you:
- Upload your resume and get it analyzed
- Find skill gaps compared to your dream job
- Get an ATS compatibility score
- See a personalized learning roadmap
- Measure how "placement-ready" you are

Think of it as a **personal career coach** that lives inside a website.

---

## 🏗️ Overall Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     USER (Browser)                       │
└────────────────────────┬────────────────────────────────┘
                         │ HTTP Requests (via Axios)
                         ▼
┌─────────────────────────────────────────────────────────┐
│              FRONTEND  (React + Vite + TailwindCSS)      │
│              Runs at: http://localhost:5173               │
└────────────────────────┬────────────────────────────────┘
                         │ REST API Calls (JSON)
                         ▼
┌─────────────────────────────────────────────────────────┐
│              BACKEND  (Python FastAPI)                    │
│              Runs at: http://localhost:8000               │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌───────────┐  │
│  │ Auth API │ │Resume API│ │Career API│ │Dashboard  │  │
│  └──────────┘ └──────────┘ └──────────┘ └───────────┘  │
│        ▼            ▼           ▼              ▼         │
│  ┌─────────────────────────────────────────────────┐    │
│  │         SERVICES (Business Logic)               │    │
│  │  resume_parser | ats_service | skill_gap        │    │
│  │  roadmap_service | readiness_service            │    │
│  └─────────────────────────────────────────────────┘    │
└────────────────────────┬────────────────────────────────┘
                         │ SQLAlchemy ORM
                         ▼
┌─────────────────────────────────────────────────────────┐
│              DATABASE  (PostgreSQL)                      │
│   Tables: users | resumes | career_targets              │
│           skill_gaps | roadmap_steps                    │
└─────────────────────────────────────────────────────────┘
```

---

## 🖥️ FRONTEND — All Webpages Explained

The frontend is a **Single Page Application (SPA)** — meaning the page never fully reloads; only pieces of the page change as you navigate.

### 📄 Page-by-Page Breakdown

| Page | URL Route | What It Does |
|------|-----------|-------------|
| **LandingPage** | `/` | Public homepage. Introduction to the platform. No login needed. |
| **LoginPage** | `/login` | Email + password login form. Sends credentials to backend, gets a JWT token back. |
| **RegisterPage** | `/register` | New user sign-up form. Creates account in the database. |
| **DashboardPage** | `/dashboard` | Central hub. Shows ATS score, readiness %, skill gaps, and recent roadmap steps at a glance. |
| **ResumeUploadPage** | `/resume/upload` | Drag-and-drop file uploader. Sends your PDF/DOCX resume to the backend. |
| **ResumeAnalysisPage** | `/resume/analysis` | Displays extracted skills, email, phone, sections found in the resume. |
| **CareerTargetPage** | `/career/target` | You choose or type your dream job role (e.g., "Frontend Developer"). Saved to database. |
| **SkillGapPage** | `/skills/gaps` | Shows which skills you have vs. which skills your target role needs. Color-coded gaps. |
| **SkillDetailPage** | `/skills/:skillId` | Deep-dive into one skill — why it matters, how to learn it, prerequisites. |
| **LearningRoadmapPage** | `/roadmap` | Step-by-step learning path with checkboxes. Mark steps as complete. |
| **CareerReadinessPage** | `/career-readiness` | Visual breakdown of how ready you are: Skills (35%), Projects (25%), Resume (20%), Certs (10%), Practice (10%). |
| **CareerOptionsPage** | `/career/options` | Browse all available career paths you can target. |
| **CareerComparePage** | `/career/compare` | Compare two career paths side-by-side. |
| **ResumeImprovementPage** | `/resume/suggestions` | Shows specific suggestions on how to improve your resume. |

---

## ⚙️ BACKEND — All APIs Explained

The backend has **6 API groups**, each handling a different feature:

| API File | URL Prefix | What It Does |
|----------|-----------|-------------|
| `auth.py` | `/auth` | Register users, login and return JWT tokens |
| `resume.py` | `/resume` | Upload resume file, parse it, store results |
| `career.py` | `/career` | Save/get career target role |
| `career_options.py` | `/career/options` | List all career paths and their details |
| `roadmap.py` | `/roadmap` | Generate and manage learning roadmap steps |
| `dashboard.py` | `/dashboard` | Aggregates all data to power the dashboard |

---

## 🗄️ DATABASE — Tables & What They Store

**Database used:** PostgreSQL (a professional, industry-standard relational database)

| Table | What It Stores |
|-------|---------------|
| `users` | id, name, email, hashed password, created_at |
| `resumes` | id, user_id, file_name, file_type, raw_text (full resume text), parsed_data (JSON: skills, email, phone) |
| `career_targets` | id, user_id, role_title, job_description, is_active |
| `skill_gaps` | id, user_id, skill_name, match_status, priority |
| `roadmap_steps` | id, user_id, step_number, title, status (PENDING/IN_PROGRESS/COMPLETED) |

---

## 🔗 How Frontend, Backend & Database Are Connected

### Step-by-step connection flow:

```
1. User opens browser → React app loads (http://localhost:5173)

2. React uses AXIOS to make HTTP calls to FastAPI (http://localhost:8000)
   - Every request automatically attaches the JWT token in the header
   - Code: api.js → axios.create({ baseURL: 'http://localhost:8000' })

3. FastAPI receives the request → routes it to the right API handler
   - CORS is enabled so the frontend (port 5173) can talk to backend (port 8000)

4. The API handler calls the relevant SERVICE (business logic)
   - e.g., resume upload → resume_parser service

5. SERVICE processes the data (parsing, scoring, analysis)

6. SQLAlchemy ORM converts Python objects → SQL queries → PostgreSQL stores/retrieves data

7. FastAPI sends back a JSON response → Axios receives it → React displays it on screen
```

---

## 📄 RESUME ANALYSIS — How It Works (Step by Step)

### Step 1: File Upload
- User picks a `.pdf` or `.docx` file from their computer
- React sends it to `POST /resume/upload` using a **multipart form** (not plain JSON, because it's a file)
- Maximum file size: **5MB**

### Step 2: Text Extraction
The backend uses two libraries to pull text out of the file:
- **PyMuPDF** (also called `fitz`) — extracts text from PDF files page by page
- **python-docx** — extracts text from Word documents paragraph by paragraph

```
PDF File → PyMuPDF → Raw Text String
DOCX File → python-docx → Raw Text String
```

### Step 3: Resume Parsing (Deterministic Algorithm — NO AI/ML)
The `resume_parser.py` service then scans the raw text using **Python Regex (Regular Expressions)**:

| What's Extracted | How It's Done |
|-----------------|---------------|
| **Email** | Regex: looks for `something@something.com` pattern |
| **Phone** | Regex: looks for 10-digit number patterns |
| **Skills** | Dictionary matching — compares resume text against a **predefined list of 40+ known tech skills** |
| **Education** | Regex: looks for keywords like "B.Tech", "Bachelor", "BCA", "MCA" |

> **Important:** This is a **rule-based / keyword-matching** system, NOT a machine learning model. It uses a hardcoded dictionary of known skills and regex patterns.

#### The Predefined Skills Dictionary:
```
Python, Java, C++, JavaScript, React, Node.js, FastAPI, Django,
SQL, PostgreSQL, MongoDB, Docker, Git, AWS, Machine Learning...
(40+ skills total)
```

Every skill in the dictionary is checked against the resume text using **whole-word matching** (so "Java" won't accidentally match "JavaScript").

### Step 4: Storing in Database
The parsed result is saved to the `resumes` table:
- `raw_text` = full resume text
- `parsed_data` = JSON object with skills, email, phone, education

---

## 🎯 SKILL GAP ANALYSIS — How It Works

### What is a Skill Gap?
A skill gap is the **difference between what skills YOU have** (from your resume) **and what skills your TARGET JOB requires** (from a curated database).

### How it's calculated (Rule-Based, NOT AI):

**Step 1:** You choose a career target (e.g., "Frontend Developer")

**Step 2:** The backend looks up a **hardcoded knowledge base** of required skills for that role. For example, "Frontend Developer" requires:
- JavaScript (ES6+) — HIGH priority
- React.js Framework — HIGH priority
- Tailwind CSS — MEDIUM priority
- REST API Integration — HIGH priority
- TypeScript — MEDIUM priority
- Web Performance & SEO — LOW priority

**Step 3:** Your resume skills are compared against this list:

| Status | Meaning |
|--------|---------|
| `STRONG_MATCH` | You have this skill in your resume |
| `PARTIAL_MATCH` | Related skill found, but not exact |
| `GAP` | You completely lack this skill |

**Step 4:** Gaps are displayed color-coded by priority (HIGH = Red, MEDIUM = Yellow, LOW = Green)

### Roles supported in the knowledge base:
- Software Developer
- Frontend Developer
- Backend Developer
- Full Stack Developer
- Data Analyst
- Machine Learning Engineer
- DevOps Engineer
- (and more...)

---

## 📊 ATS SCORE — What Is It and How Is It Calculated?

### What is ATS?
**ATS = Applicant Tracking System**

When you apply to a company, your resume first passes through automated software (ATS) that scans it for keywords and structure before any human reads it. Many resumes are rejected at this stage.

CareerBridge AI **simulates** what an ATS would score your resume by checking 4 factors:

### The 4 ATS Sub-Scores:

| Component | Weight | How It's Calculated |
|-----------|--------|---------------------|
| **Section Score** | 25% | Checks if resume has: Education, Skills, Projects, Experience sections |
| **Formatting Score** | 20% | Checks word count (150–1200 ideal), email presence |
| **Skill/Keyword Score** | 30% | `(number of detected skills / 8) × 100` — 8+ skills = full marks |
| **Job Alignment Score** | 25% | If you pasted a job description, how many JD words appear in your resume |

### Final Formula:
```
Overall ATS = (Section × 0.25) + (Formatting × 0.20) + (Skill × 0.30) + (Job Alignment × 0.25)
```

### Example:
- Section Score = 75 (3 of 4 sections present)
- Formatting Score = 90 (good word count + email present)
- Skill Score = 75 (6 skills found)
- Job Alignment = 75 (no JD provided, default used)

```
ATS = (75×0.25) + (90×0.20) + (75×0.30) + (75×0.25)
    = 18.75 + 18 + 22.5 + 18.75 = 78
```

> **This is NOT an AI model.** It's a transparent, explainable formula using keyword detection and regex — so the score is predictable and improvable.

---

## 📈 CAREER READINESS SCORE — How It's Calculated

The Career Readiness % measures how prepared you are for your target job overall:

| Category | Weight | How It's Scored |
|----------|--------|-----------------|
| Technical Skills Match | **35%** | Based on strong/partial matches from skill gap analysis |
| Project & Portfolio Depth | **25%** | Based on roadmap completion % and whether projects are listed |
| Resume & ATS Quality | **20%** | Directly from your ATS Score / 100 × 20 |
| Certifications & Credentials | **10%** | Based on roadmap step completion |
| Problem Solving & DSA Practice | **10%** | Based on roadmap step completion |

### Readiness Badges:
| Score Range | Badge | Color |
|------------|-------|-------|
| 80–100% | Placement Ready | Green |
| 60–79% | Intermediate Readiness | Blue |
| 40–59% | Developing Competency | Amber |
| 0–39% | Foundational Stage | Red |

---

## 🗺️ LEARNING ROADMAP — How It Works

The roadmap is a **personalized step-by-step learning plan** generated based on your skill gaps:
- Each gap becomes a roadmap step
- Steps have: title, description, resources, priority, estimated time
- You can mark steps as: `PENDING → IN_PROGRESS → COMPLETED`
- Dashboard shows your progress %

---

## 🔐 AUTHENTICATION — How Login Works

```
1. User types email + password → React sends POST /auth/login

2. Backend checks: Does this email exist in database?
   - If yes: Does the hashed password match?

3. Password Hashing: 
   - Passwords are NEVER stored as plain text
   - bcrypt algorithm converts "mypassword" → "$2b$12$abc...xyz" (unreadable hash)
   - Even if database is stolen, passwords can't be decoded

4. On success: Backend creates a JWT Token
   - JWT = JSON Web Token = a digitally signed string like:
     "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIn0.xyz"
   - This token proves "I am User #1" for the next hour

5. Frontend stores JWT in localStorage
   - Every future API request includes: Authorization: Bearer <token>
   - Backend verifies the token before serving any protected data
```

---

## 🧰 TECHNOLOGIES USED — Complete Explanation

### FRONTEND Technologies

#### 1. React (v19)
- **What it is:** A JavaScript library made by Meta (Facebook) for building user interfaces
- **Why it's used:** Instead of reloading the whole page, React only updates the parts that changed (like a chat app updating just the message list)
- **Key concept:** Components — each piece of UI (navbar, card, button) is a reusable component
- **Example in this project:** `DashboardPage.jsx`, `SkillGapPage.jsx`

#### 2. Vite
- **What it is:** A super-fast build tool and development server
- **Why it's used:** When you type `npm run dev`, Vite starts a local server and instantly updates the browser when you change code (called "Hot Module Replacement")
- **Analogy:** Think of Vite as the "engine" that runs the React app during development

#### 3. React Router DOM (v7)
- **What it is:** A routing library for React
- **Why it's used:** Handles navigation between pages WITHOUT reloading the browser
- **Example:** Clicking "Dashboard" changes the URL from `/login` to `/dashboard` without a full page load
- **Key concept:** `<Route path="/dashboard" element={<DashboardPage />} />`

#### 4. Tailwind CSS (v4)
- **What it is:** A utility-first CSS framework — instead of writing CSS files, you add tiny class names directly to HTML elements
- **Why it's used:** Faster styling, consistent design system
- **Example:** `className="bg-blue-500 text-white rounded-lg p-4"` = blue button with white text

#### 5. Axios
- **What it is:** A JavaScript library for making HTTP requests to the backend
- **Why it's used:** Easier than the built-in `fetch` API — automatically converts JSON, handles errors, supports interceptors
- **In this project:** `api.js` creates one Axios instance with the base URL and JWT auto-attachment

#### 6. Recharts
- **What it is:** A charting library for React
- **Why it's used:** Creates beautiful interactive charts (progress bars, pie charts) for the readiness and skill gap visualizations

#### 7. Lucide React
- **What it is:** A library of clean SVG icons for React
- **Why it's used:** Used throughout the UI for icons (upload icon, skill icons, navigation icons)

---

### BACKEND Technologies

#### 1. Python
- **What it is:** A high-level, easy-to-read programming language
- **Why it's used:** Excellent for text processing, regex, and rapid backend development
- **Role in this project:** Powers all business logic (parsing, scoring, gap analysis)

#### 2. FastAPI
- **What it is:** A modern Python web framework for building REST APIs
- **Why it's used:** Very fast (built on async Python), auto-generates API documentation at `/docs`
- **Key features used:**
  - `@router.post("/upload")` — creates an API endpoint
  - `Depends(get_db)` — dependency injection for database sessions
  - Automatic request/response validation using Pydantic schemas

#### 3. SQLAlchemy
- **What it is:** An ORM (Object-Relational Mapper) for Python
- **Why it's used:** Instead of writing raw SQL queries, you use Python classes/objects
- **Example:**
  ```python
  # Without ORM: "SELECT * FROM resumes WHERE user_id = 1"
  # With SQLAlchemy:
  db.query(Resume).filter(Resume.user_id == 1).first()
  ```
- **Role:** Translates Python code into PostgreSQL SQL queries automatically

#### 4. Pydantic
- **What it is:** A Python data validation library
- **Why it's used:** Defines the exact shape of request/response data (Schemas)
- **Example:** `UserCreate` schema ensures every registration has `name`, `email`, `password`
- **Role:** Acts as a contract between frontend and backend — if frontend sends wrong data, Pydantic rejects it with a clear error

#### 5. PyMuPDF (fitz)
- **What it is:** A Python library to read PDF files
- **Why it's used:** Extracts all text from every page of a PDF resume
- **How:** Opens the PDF bytes, loops through each page, calls `.get_text()`

#### 6. python-docx
- **What it is:** A Python library to read Microsoft Word (.docx) files
- **Why it's used:** Extracts text from Word document paragraphs
- **How:** Opens the DOCX bytes, loops through paragraphs

#### 7. bcrypt (via passlib)
- **What it is:** A password hashing algorithm
- **Why it's used:** Converts plain passwords into irreversible hashes for secure storage
- **Key property:** Same password can produce different hashes (salted), but verification always works

#### 8. JWT (via python-jose)
- **What it is:** JSON Web Token — a signed string containing user identity
- **Why it's used:** After login, the user carries this token to prove who they are
- **Structure:** `header.payload.signature` — the signature is verified using the `JWT_SECRET` from `.env`

#### 9. Python `re` (Regex)
- **What it is:** Python's built-in Regular Expressions module
- **Why it's used:** Pattern matching to find emails, phone numbers, skill keywords in resume text
- **Example:** `re.findall(r'[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+', text)` finds all email addresses

---

### DATABASE

#### PostgreSQL
- **What it is:** An open-source, enterprise-grade relational database
- **Why it's used:** Stores structured data (users, resumes, career targets, skill gaps) with relationships
- **Connection string:** `postgresql://postgres:password@localhost:5432/careerbridge`
- **Key features used:**
  - `JSON` column type in resumes table (for storing parsed skills as flexible JSON)
  - Foreign keys (resume.user_id → users.id)
  - Cascading deletes (delete user → all their resumes deleted automatically)

---

## 🔄 Complete Workflow — End to End

```
USER JOURNEY:

1. REGISTER/LOGIN
   └── Create account or login → Get JWT token

2. UPLOAD RESUME
   └── Pick PDF/DOCX → Backend extracts text → Regex finds skills/email/phone → Saved to DB

3. SET CAREER TARGET
   └── Choose "Frontend Developer" → Saved to career_targets table

4. VIEW SKILL GAPS
   └── Backend compares resume skills vs. role requirements (curated dictionary)
   └── Shows: STRONG_MATCH | PARTIAL_MATCH | GAP for each skill

5. VIEW ATS SCORE
   └── Formula: Section(25%) + Formatting(20%) + Skills(30%) + Job Alignment(25%)
   └── Shows strengths and improvements

6. FOLLOW LEARNING ROADMAP
   └── Backend generates steps for each skill gap
   └── User marks steps: PENDING → IN_PROGRESS → COMPLETED

7. CHECK CAREER READINESS
   └── Formula: Skills(35%) + Projects(25%) + Resume(20%) + Certs(10%) + Practice(10%)
   └── Shows badge: Placement Ready | Intermediate | Developing | Foundational

8. DASHBOARD
   └── Central view of all metrics: ATS %, Readiness %, Missing Skills count, Next Action
```

---

## 🤖 Is There Any AI/ML Used?

**Current state: NO external AI model or ML model is used.**

Everything is built using:
- **Regex** (pattern matching for email, phone, degree detection)
- **Dictionary/keyword matching** (skills from a hardcoded list of 40+ known tech skills)
- **Mathematical formulas** (ATS score, readiness score calculated with weighted averages)
- **Curated knowledge bases** (role requirements are manually defined Python dictionaries)

The `.env` file has a placeholder `AI_API_KEY=your-ai-provider-key-here`, which suggests **the project is designed to integrate an AI API** (like Google Gemini or OpenAI) in the future, but it is **not currently connected**.

### Why This Approach Works:
- Fully **transparent and explainable** — you can see exactly why you got a certain score
- No API costs
- Predictable and fast
- Easily improvable by adding more skills to the dictionary

---

## 📁 Project File Structure Summary

```
careerbridge-ai/
├── backend/
│   ├── .env                        ← Database URL, JWT Secret, AI Key
│   ├── requirements.txt            ← All Python libraries needed
│   └── app/
│       ├── main.py                 ← FastAPI app setup, CORS, router registration
│       ├── config.py               ← Reads .env variables
│       ├── database/
│       │   └── database.py         ← PostgreSQL connection + SQLAlchemy engine
│       ├── models/                 ← Database table definitions (SQLAlchemy)
│       │   ├── user.py             ← users table
│       │   ├── resume.py           ← resumes table
│       │   ├── career.py           ← career_targets table
│       │   └── roadmap.py          ← skill_gaps + roadmap_steps tables
│       ├── schemas/                ← Pydantic request/response validators
│       ├── api/                    ← Route handlers (endpoints)
│       │   ├── auth.py             ← /auth/register, /auth/login
│       │   ├── resume.py           ← /resume/upload, /resume/current
│       │   ├── career.py           ← /career/target
│       │   ├── career_options.py   ← /career/options
│       │   ├── roadmap.py          ← /roadmap/generate, /roadmap/steps
│       │   └── dashboard.py        ← /dashboard/summary, /dashboard/readiness
│       ├── services/               ← Core business logic
│       │   ├── resume_parser.py    ← PDF/DOCX text extraction + regex parsing
│       │   ├── ats_service.py      ← ATS score calculation formula
│       │   ├── skill_gap_service.py← Role requirements + gap comparison
│       │   ├── roadmap_service.py  ← Generates learning steps per gap
│       │   └── readiness_service.py← Career readiness % formula
│       └── utils/
│           └── security.py         ← bcrypt hashing, JWT creation/verification
│
└── frontend/
    ├── package.json                ← JavaScript dependencies (React, Axios, etc.)
    ├── vite.config.js              ← Vite build configuration
    ├── tailwind.config.js          ← Tailwind CSS configuration
    └── src/
        ├── main.jsx                ← Entry point — renders React into index.html
        ├── App.jsx                 ← All routes defined here
        ├── context/
        │   └── AuthContext.jsx     ← Global login state (who is logged in)
        ├── layouts/
        │   ├── MainLayout.jsx      ← Wrapper with sidebar/navbar for logged-in users
        │   └── AuthLayout.jsx      ← Wrapper for login/register pages
        ├── services/
        │   └── api.js              ← Axios instance with JWT auto-attachment
        └── pages/                  ← 14 React page components
```
