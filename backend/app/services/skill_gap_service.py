import re
from typing import List, Dict, Any, Optional

# Comprehensive curated domain knowledge bases
ROLE_SKILL_REQUIREMENTS = {
    "software developer": [
        {
            "name": "Data Structures & Algorithms",
            "priority": "HIGH",
            "why": "Essential foundation for technical problem-solving and coding assessment rounds.",
            "prereqs": "Basic programming syntax in Python, Java, or C++"
        },
        {
            "name": "Object-Oriented Programming (OOP)",
            "priority": "HIGH",
            "why": "Core paradigm required to design scalable, maintainable modular software applications.",
            "prereqs": "Variables, loops, and functions"
        },
        {
            "name": "Relational DBMS & SQL",
            "priority": "HIGH",
            "why": "Critical for persistent data modeling, transactional queries, and backend storage.",
            "prereqs": "Basic table concept and entity understanding"
        },
        {
            "name": "REST API Development",
            "priority": "MEDIUM",
            "why": "Standard protocol for connecting client-side interfaces to backend business logic.",
            "prereqs": "HTTP methods, JSON, and web fundamentals"
        },
        {
            "name": "Git & Version Control",
            "priority": "MEDIUM",
            "why": "Crucial for team collaboration, branching workflows, and source code management.",
            "prereqs": "Basic command line / terminal usage"
        },
        {
            "name": "System Design Basics",
            "priority": "LOW",
            "why": "Beneficial for understanding microservices, caching, and scalable architecture rounds.",
            "prereqs": "OOP, DBMS, and basic networking"
        }
    ],
    "frontend developer": [
        {
            "name": "JavaScript (ES6+)",
            "priority": "HIGH",
            "why": "The primary language of web browsers for asynchronous logic, DOM manipulation, and UI state.",
            "prereqs": "HTML and basic programming syntax"
        },
        {
            "name": "React.js Framework",
            "priority": "HIGH",
            "why": "Industry standard component-driven library for modern responsive single-page web applications.",
            "prereqs": "JavaScript ES6, JSX, and CSS"
        },
        {
            "name": "Tailwind CSS / Responsive Design",
            "priority": "MEDIUM",
            "why": "Ensures modern, mobile-friendly interfaces across desktop, tablet, and smartphone screens.",
            "prereqs": "HTML5 and CSS3 basics"
        },
        {
            "name": "REST API Integration",
            "priority": "HIGH",
            "why": "Required for consuming asynchronous backend endpoints and updating UI dynamically.",
            "prereqs": "Promises, async/await, and Fetch/Axios"
        },
        {
            "name": "TypeScript",
            "priority": "MEDIUM",
            "why": "Provides type safety, reducing runtime bugs in enterprise frontend codebases.",
            "prereqs": "JavaScript fundamentals"
        },
        {
            "name": "Web Performance & SEO",
            "priority": "LOW",
            "why": "Important for fast Core Web Vitals, accessibility, and search ranking.",
            "prereqs": "Browser rendering and network inspection"
        }
    ],
    "backend developer": [
        {
            "name": "Python / Node.js Backend Frameworks",
            "priority": "HIGH",
            "why": "Core runtime server engines for business logic, routing, and asynchronous request handling.",
            "prereqs": "Core programming fundamentals"
        },
        {
            "name": "Relational DBMS & SQL (PostgreSQL/MySQL)",
            "priority": "HIGH",
            "why": "Essential for schema modeling, index optimization, migrations, and ACID transactions.",
            "prereqs": "Data modeling and query fundamentals"
        },
        {
            "name": "RESTful & GraphQL API Architecture",
            "priority": "HIGH",
            "why": "Standard protocols for powering web, mobile, and third-party client integrations.",
            "prereqs": "HTTP protocol, status codes, and JSON serialization"
        },
        {
            "name": "Authentication & JWT Security",
            "priority": "HIGH",
            "why": "Crucial for user authorization, password hashing, token validation, and OAuth2.",
            "prereqs": "Basic cryptography and sessions"
        },
        {
            "name": "Docker & Containerization",
            "priority": "MEDIUM",
            "why": "Ensures reproducible deployment environments across local dev and production servers.",
            "prereqs": "Linux command line basics"
        },
        {
            "name": "Caching & Message Queues (Redis/RabbitMQ)",
            "priority": "MEDIUM",
            "why": "Accelerates read-heavy endpoints and handles asynchronous background tasks.",
            "prereqs": "In-memory key-value data models"
        }
    ],
    "full stack developer": [
        {
            "name": "React.js & Frontend Architecture",
            "priority": "HIGH",
            "why": "Creates interactive client-side interfaces and manages state across components.",
            "prereqs": "HTML, CSS, and modern JavaScript"
        },
        {
            "name": "Node.js / Python REST API Backend",
            "priority": "HIGH",
            "why": "Handles backend business logic, validation, authentication, and database orchestration.",
            "prereqs": "JavaScript/Python programming"
        },
        {
            "name": "SQL & NoSQL Database Engineering",
            "priority": "HIGH",
            "why": "Manages persistent structured and semi-structured application data.",
            "prereqs": "Database schemas and relations"
        },
        {
            "name": "Git & Version Control Workflows",
            "priority": "HIGH",
            "why": "Crucial for source code versioning, team branches, and pull requests.",
            "prereqs": "Command line interface"
        },
        {
            "name": "API Integration & Async Operations",
            "priority": "MEDIUM",
            "why": "Seamless data flow between frontend forms and backend services.",
            "prereqs": "Promises, HTTP verbs, and JSON"
        },
        {
            "name": "Docker & Cloud Deployment",
            "priority": "MEDIUM",
            "why": "Enables end-to-end containerized application hosting and CI/CD delivery.",
            "prereqs": "Basic server configuration"
        }
    ],
    "data analyst": [
        {
            "name": "SQL & Advanced Queries",
            "priority": "HIGH",
            "why": "The cornerstone for querying enterprise databases, aggregating metrics, and building reports.",
            "prereqs": "Basic database concepts"
        },
        {
            "name": "Python for Data Analysis (Pandas & NumPy)",
            "priority": "HIGH",
            "why": "Essential for cleaning raw datasets, filtering dataframes, and calculating key metrics.",
            "prereqs": "Python syntax basics"
        },
        {
            "name": "Power BI / Tableau (BI Dashboards)",
            "priority": "HIGH",
            "why": "Required to convert data queries into visual charts and executive dashboards.",
            "prereqs": "Basic chart types and aggregation concepts"
        },
        {
            "name": "Applied Statistics & Probability",
            "priority": "MEDIUM",
            "why": "Enables accurate trend analysis, hypothesis testing, and anomaly detection.",
            "prereqs": "High-school mathematics"
        },
        {
            "name": "Excel Advanced Functions",
            "priority": "MEDIUM",
            "why": "Everyday business analysis tool for pivot tables, VLOOKUP/XLOOKUP, and quick modeling.",
            "prereqs": "Basic spreadsheet navigation"
        }
    ],
    "data scientist": [
        {
            "name": "Machine Learning & Scikit-Learn",
            "priority": "HIGH",
            "why": "Core algorithms for classification, regression, clustering, and predictive modeling.",
            "prereqs": "Linear algebra, calculus, and Python"
        },
        {
            "name": "Python Data Stack (Pandas, NumPy, Matplotlib)",
            "priority": "HIGH",
            "why": "Indispensable libraries for exploratory data analysis and feature engineering.",
            "prereqs": "Python programming syntax"
        },
        {
            "name": "Deep Learning & Neural Networks (PyTorch/TensorFlow)",
            "priority": "HIGH",
            "why": "Powers computer vision, NLP, and modern generative AI architectures.",
            "prereqs": "Matrix multiplication and gradient descent"
        },
        {
            "name": "Advanced SQL & Feature Stores",
            "priority": "MEDIUM",
            "why": "Extracts high-dimensional training datasets from data warehouses.",
            "prereqs": "SQL queries and joins"
        },
        {
            "name": "Model Evaluation & Experiment Tracking",
            "priority": "MEDIUM",
            "why": "Ensures model generalization, metrics tracking (F1, AUC-ROC), and bias mitigation.",
            "prereqs": "Statistical validation techniques"
        }
    ],
    "cloud engineer": [
        {
            "name": "Linux Administration",
            "priority": "HIGH",
            "why": "Underpins virtually all cloud servers, container runtimes, and deployment environments.",
            "prereqs": "Basic command line navigation"
        },
        {
            "name": "Docker & Containerization",
            "priority": "HIGH",
            "why": "Standard method to package applications with their dependencies for consistent cloud deployments.",
            "prereqs": "Linux basics and command line"
        },
        {
            "name": "Cloud Providers (AWS / GCP / Azure)",
            "priority": "HIGH",
            "why": "Hands-on experience with VPC, Compute instances, Object Storage, and IAM permissions.",
            "prereqs": "Basic networking and server fundamentals"
        },
        {
            "name": "CI/CD Pipelines & GitHub Actions",
            "priority": "MEDIUM",
            "why": "Automates testing, building, and zero-downtime deployment workflows.",
            "prereqs": "Git and shell scripting"
        },
        {
            "name": "Kubernetes Orchestration",
            "priority": "MEDIUM",
            "why": "Crucial for scaling and managing containerized workloads in enterprise clusters.",
            "prereqs": "Docker and container concepts"
        },
        {
            "name": "Infrastructure as Code (Terraform)",
            "priority": "LOW",
            "why": "Enables declarative, reproducible cloud provisioning across environments.",
            "prereqs": "Cloud resource architecture"
        }
    ],
    "devops engineer": [
        {
            "name": "CI/CD Automated Pipelines",
            "priority": "HIGH",
            "why": "Automates continuous build, test, and release cycles without manual intervention.",
            "prereqs": "Git workflows and shell scripting"
        },
        {
            "name": "Docker & Kubernetes Containerization",
            "priority": "HIGH",
            "why": "Ensures microservice packaging, auto-scaling, and cluster management.",
            "prereqs": "Linux and networking"
        },
        {
            "name": "Infrastructure as Code (Terraform / Ansible)",
            "priority": "HIGH",
            "why": "Standardizes server provisioning and automated environment orchestration.",
            "prereqs": "Cloud infrastructure fundamentals"
        },
        {
            "name": "Linux & Bash Scripting",
            "priority": "HIGH",
            "why": "Essential for server maintenance, cron automation, and log auditing.",
            "prereqs": "Operating system concepts"
        },
        {
            "name": "Monitoring & Observability (Prometheus/Grafana)",
            "priority": "MEDIUM",
            "why": "Tracks service uptime, latency, error budgets, and alerting rules.",
            "prereqs": "HTTP metrics and server logs"
        }
    ],
    "cybersecurity analyst": [
        {
            "name": "Network Security & Protocols (TCP/IP, DNS, SSL/TLS)",
            "priority": "HIGH",
            "why": "Understanding packet flow and network boundaries is fundamental to defensive and offensive security.",
            "prereqs": "Computer networking fundamentals"
        },
        {
            "name": "Vulnerability Assessment & Penetration Testing",
            "priority": "HIGH",
            "why": "Identifies flaws, CVEs, and exploits in web applications and network perimeters.",
            "prereqs": "OWASP Top 10 and web fundamentals"
        },
        {
            "name": "Security Information & Event Management (SIEM / SOC)",
            "priority": "HIGH",
            "why": "Monitors enterprise event logs to detect intrusions and incident response alerts.",
            "prereqs": "Linux/Windows log structures"
        },
        {
            "name": "Cryptography & Identity Access Management (IAM)",
            "priority": "MEDIUM",
            "why": "Protects data at rest and in transit using public key encryption and granular policies.",
            "prereqs": "Basic hashing and authentication models"
        },
        {
            "name": "Python / Bash for Security Scripting",
            "priority": "MEDIUM",
            "why": "Automates log parsing, port scanning, and threat intelligence feeds.",
            "prereqs": "Basic programming and scripting"
        }
    ],
    "mobile app developer": [
        {
            "name": "Mobile Frameworks (React Native / Flutter / Kotlin / Swift)",
            "priority": "HIGH",
            "why": "Builds high-performance native and cross-platform mobile apps for Android and iOS.",
            "prereqs": "Core object-oriented programming"
        },
        {
            "name": "Mobile UI/UX & Responsive Layouts",
            "priority": "HIGH",
            "why": "Provides smooth gesture handling, touch navigation, and adaptive screen scaling.",
            "prereqs": "Mobile design principles"
        },
        {
            "name": "REST API Integration & Offline Storage",
            "priority": "HIGH",
            "why": "Syncs mobile client data with backend servers while caching data locally (SQLite/AsyncStorage).",
            "prereqs": "Async programming and JSON parsing"
        },
        {
            "name": "App Lifecycle & State Management",
            "priority": "MEDIUM",
            "why": "Handles background states, push notifications, and global state persistence.",
            "prereqs": "Mobile architecture concepts"
        },
        {
            "name": "App Store & Play Store Deployment",
            "priority": "LOW",
            "why": "Prepares code signing, release builds, and publishing guidelines.",
            "prereqs": "Build configuration tools"
        }
    ],
    "ai / ml engineer": [
        {
            "name": "Deep Learning & Neural Architectures (PyTorch/TensorFlow)",
            "priority": "HIGH",
            "why": "Designs and fine-tunes transformers, CNNs, RNNs, and generative AI models.",
            "prereqs": "Linear algebra, calculus, and Python"
        },
        {
            "name": "Large Language Models & Prompt Engineering (LLMs/RAG)",
            "priority": "HIGH",
            "why": "Constructs modern AI applications with vector embeddings, semantic search, and prompt chains.",
            "prereqs": "API integration and NLP concepts"
        },
        {
            "name": "Python & Data Science Tooling (NumPy, Pandas)",
            "priority": "HIGH",
            "why": "High-efficiency data processing pipelines for model training datasets.",
            "prereqs": "Python fundamentals"
        },
        {
            "name": "MLOps & Model Deployment (FastAPI, Docker)",
            "priority": "MEDIUM",
            "why": "Wraps trained models in low-latency REST endpoints for real-time inference.",
            "prereqs": "Containerization and REST APIs"
        },
        {
            "name": "Vector Databases & Embeddings (Chroma/FAISS/Pinecone)",
            "priority": "MEDIUM",
            "why": "Enables retrieval-augmented generation (RAG) and semantic information retrieval.",
            "prereqs": "Data modeling and similarity search"
        }
    ],
    "qa / test automation engineer": [
        {
            "name": "Automated Testing Frameworks (Selenium / Playwright / Cypress)",
            "priority": "HIGH",
            "why": "Writes reliable end-to-end regression scripts for web and mobile interfaces.",
            "prereqs": "JavaScript or Python programming"
        },
        {
            "name": "API Testing (Postman / REST Assured)",
            "priority": "HIGH",
            "why": "Validates status codes, payloads, schema contracts, and authentication boundaries.",
            "prereqs": "HTTP methods and JSON"
        },
        {
            "name": "Test Strategy & Defect Lifecycle",
            "priority": "HIGH",
            "why": "Constructs test cases, boundary value analysis, and Jira defect tracking.",
            "prereqs": "Software development lifecycle (SDLC)"
        },
        {
            "name": "CI/CD Pipeline Test Integration",
            "priority": "MEDIUM",
            "why": "Triggers automated test suites on pull requests to prevent regressions.",
            "prereqs": "Git and GitHub Actions basics"
        }
    ],
    "data engineer": [
        {
            "name": "Big Data Processing (Apache Spark / PySpark)",
            "priority": "HIGH",
            "why": "Processes massive distributed datasets with high throughput and fault tolerance.",
            "prereqs": "Python and distributed computing fundamentals"
        },
        {
            "name": "Data Warehousing & SQL (Snowflake / BigQuery)",
            "priority": "HIGH",
            "why": "Designs star schemas, dimensional models, and columnar storage tables.",
            "prereqs": "Advanced relational SQL"
        },
        {
            "name": "ETL/ELT Pipeline Orchestration (Airflow / Prefect)",
            "priority": "HIGH",
            "why": "Schedules, monitors, and recovers complex multi-stage data ingestion workflows.",
            "prereqs": "Python scripting and DAG architecture"
        },
        {
            "name": "Data Streaming & Event Hubs (Apache Kafka)",
            "priority": "MEDIUM",
            "why": "Handles real-time streaming event ingestion from distributed microservices.",
            "prereqs": "Publish-subscribe architecture"
        },
        {
            "name": "Data Quality & Schema Validation",
            "priority": "MEDIUM",
            "why": "Enforces data contracts, deduplication, and automated data quality tests.",
            "prereqs": "Data validation concepts"
        }
    ]
}

# Recognized tech keywords for dynamic JD extraction
KNOWN_TECH_KEYWORDS = [
    "Python", "Java", "C++", "C#", "JavaScript", "TypeScript", "Go", "Rust", "PHP", "Ruby", "Swift", "Kotlin",
    "React", "Angular", "Vue", "Next.js", "Node.js", "Express", "Django", "FastAPI", "Flask", "Spring Boot",
    "SQL", "PostgreSQL", "MySQL", "MongoDB", "Redis", "Elasticsearch", "Cassandra", "DynamoDB",
    "Docker", "Kubernetes", "AWS", "GCP", "Azure", "Linux", "Git", "GitHub Actions", "CI/CD", "Terraform", "Ansible",
    "Data Structures", "Algorithms", "OOP", "System Design", "REST API", "GraphQL", "Microservices",
    "Machine Learning", "Deep Learning", "PyTorch", "TensorFlow", "Pandas", "NumPy", "Scikit-Learn", "Power BI", "Tableau",
    "Selenium", "Playwright", "Cypress", "Kafka", "Spark", "Airflow", "Snowflake", "BigQuery", "LLMs", "RAG", "Prompt Engineering"
]

def find_best_role_match(role_title: str) -> Optional[str]:
    """Matches any free-form role input against curated domain knowledge bases."""
    t = role_title.lower().strip()
    
    if any(w in t for w in ["front", "react", "ui dev", "web dev", "client"]):
        return "frontend developer"
    if any(w in t for w in ["full stack", "fullstack", "mern", "mean"]):
        return "full stack developer"
    if any(w in t for w in ["back", "fastapi", "django", "node", "server", "api"]):
        return "backend developer"
    if any(w in t for w in ["analyst", "analytics", "bi ", "business intelligence", "power bi"]):
        return "data analyst"
    if any(w in t for w in ["data sci", "statistician"]):
        return "data scientist"
    if any(w in t for w in ["data eng", "etl", "spark", "warehouse"]):
        return "data engineer"
    if any(w in t for w in ["devops", "sre", "site reliability", "ci/cd"]):
        return "devops engineer"
    if any(w in t for w in ["cloud", "aws", "gcp", "azure", "infrastructure"]):
        return "cloud engineer"
    if any(w in t for w in ["security", "cyber", "penetration", "soc", "infosec", "hacker"]):
        return "cybersecurity analyst"
    if any(w in t for w in ["mobile", "android", "ios", "flutter", "react native", "app dev"]):
        return "mobile app developer"
    if any(w in t for w in ["ai", "machine learning", "ml", "deep learning", "nlp", "prompt", "llm"]):
        return "ai / ml engineer"
    if any(w in t for w in ["qa", "test", "quality assurance", "automation", "sdet"]):
        return "qa / test automation engineer"
    if any(w in t for w in ["software", "programmer", "coder", "sde", "engineer"]):
        return "software developer"
    
    return None

def extract_skills_from_job_description(job_description: str) -> List[str]:
    """Dynamically parses and extracts relevant technical keywords from any custom JD."""
    if not job_description or not job_description.strip():
        return []
    
    jd_lower = job_description.lower()
    extracted = []
    for kw in KNOWN_TECH_KEYWORDS:
        # Match word boundary
        pattern = r'\b' + re.escape(kw.lower()) + r'\b'
        if re.search(pattern, jd_lower):
            extracted.append(kw)
    return extracted

def generate_custom_role_requirements(role_title: str, job_description: Optional[str] = None) -> List[Dict[str, Any]]:
    """
    Generates an intelligent, tailored skill curriculum for ANY arbitrary custom user role,
    incorporating any skills detected in the custom job description.
    """
    jd_skills = extract_skills_from_job_description(job_description or "")
    
    custom_reqs = []
    
    # 1. Add skills dynamically extracted from the user's custom JD
    for s in jd_skills[:4]:
        custom_reqs.append({
            "name": s,
            "priority": "HIGH",
            "why": f"Explicitly required technical competency detected in the target job description for {role_title}.",
            "prereqs": "Core computer science and programming fundamentals"
        })
    
    # 2. Add domain-tailored core pillars for the custom role
    clean_title = role_title.strip().title()
    custom_reqs.extend([
        {
            "name": f"{clean_title} Core Principles & Architecture",
            "priority": "HIGH",
            "why": f"Foundational methodologies, domain patterns, and best practices standard to {clean_title} positions.",
            "prereqs": "High-level understanding of domain workflow"
        },
        {
            "name": "Domain Problem Solving & Technical Logic",
            "priority": "HIGH",
            "why": "Crucial for passing technical assessments, system debugging, and practical assignment rounds.",
            "prereqs": "Logical thinking and structured problem breakdown"
        },
        {
            "name": "Production Tools & Development Environment",
            "priority": "MEDIUM",
            "why": f"Standard industry tooling, IDEs, debugging utilities, and CLI tools for {clean_title} workflows.",
            "prereqs": "Basic command line navigation"
        },
        {
            "name": "Git & Version Control Workflows",
            "priority": "MEDIUM",
            "why": "Essential for team collaboration, code reviews, version control, and continuous integration.",
            "prereqs": "Basic terminal commands"
        },
        {
            "name": f"{clean_title} Capstone Project & Portfolio",
            "priority": "LOW",
            "why": "Demonstrates end-to-end practical competency and hands-on readiness to hiring managers.",
            "prereqs": "Domain fundamentals and tool proficiency"
        }
    ])
    
    return custom_reqs

def get_role_requirements(role_title: str, job_description: Optional[str] = None) -> List[Dict[str, Any]]:
    """Retrieves standard requirements or dynamically creates tailored requirements for custom roles."""
    matched_key = find_best_role_match(role_title)
    
    if matched_key and matched_key in ROLE_SKILL_REQUIREMENTS:
        reqs = [dict(r) for r in ROLE_SKILL_REQUIREMENTS[matched_key]]
        # If user also provided a JD with specific extra keywords, blend them in!
        if job_description:
            jd_skills = extract_skills_from_job_description(job_description)
            existing_names = [r["name"].lower() for r in reqs]
            for s in jd_skills:
                if not any(s.lower() in en for en in existing_names):
                    reqs.insert(0, {
                        "name": s,
                        "priority": "HIGH",
                        "why": f"Specific technical skill extracted directly from your target Job Description.",
                        "prereqs": "General programming fundamentals"
                    })
        return reqs
    
    # Custom open-ended role
    return generate_custom_role_requirements(role_title, job_description)

def get_role_skills_list(role_title: str, job_description: Optional[str] = None) -> List[str]:
    """Returns a clean list of skill names required for a given role title and JD."""
    reqs = get_role_requirements(role_title, job_description)
    return [r["name"] for r in reqs]

def analyze_skill_gaps(
    current_skills: List[str],
    target_role: str = "Software Developer",
    job_description: Optional[str] = None
) -> List[Dict[str, Any]]:
    """
    Compares current resume skills against target role curriculum (standard or open custom role).
    Classifies into STRONG_MATCH, PARTIAL_MATCH, or MISSING with explainable priority.
    """
    requirements = get_role_requirements(target_role, job_description)
    current_skills_normalized = [s.lower() for s in current_skills]
    
    gaps = []
    for req in requirements:
        req_name = req["name"]
        req_lower = req_name.lower()
        
        # Check matching level
        is_strong = any(k in current_skills_normalized for k in [req_lower, req_name.split()[0].lower()])
        is_partial = False
        
        if not is_strong:
            # Check for partial keywords (e.g. user has Python but needs Python Data Stack)
            for token in req_lower.split():
                if len(token) > 2 and token in current_skills_normalized:
                    is_partial = True
                    break

        if is_strong:
            match_status = "STRONG_MATCH"
        elif is_partial:
            match_status = "PARTIAL_MATCH"
        else:
            match_status = "MISSING"

        gaps.append({
            "skill_name": req_name,
            "match_status": match_status,
            "priority": req["priority"],
            "why_it_matters": req["why"],
            "prerequisites": req["prereqs"]
        })

    return gaps
