from typing import List, Dict, Any

# Curated learning roadmap templates with 2-3 recommended projects, learning topics, certifications, and skill outcomes
SKILL_ROADMAP_TEMPLATES = {
    "Data Structures & Algorithms": {
        "title": "Master Core Data Structures & Algorithm Foundations",
        "duration": "4-6 weeks",
        "learning_topics": [
            "1. Time & Space Complexity Analysis (Big-O, Big-Theta, Big-Omega)",
            "2. Linear Structures: Arrays, Strings, Two-Pointer & Sliding Window",
            "3. Linked Lists: Singly, Doubly, Fast & Slow Pointer patterns",
            "4. Stacks, Queues, Deques & Monotonic Stack Applications",
            "5. Hash Tables, Collision Resolution & Frequency Counters",
            "6. Non-Linear Structures: Binary Trees, BSTs, Heaps & Priority Queues",
            "7. Graph Algorithms: BFS, DFS, Dijkstra, Topological Sort & Disjoint Set",
            "8. Dynamic Programming: 1D Memoization, 2D Grid DP & Knapsack Patterns"
        ],
        "certifications": [
            "LeetCode Problem Solving Assessment Certification",
            "HackerRank Certified Problem Solving (Advanced)",
            "Coursera / Princeton University Algorithms Specialization Certificate"
        ],
        "skill_outcomes": [
            "Ability to analyze time and memory trade-offs for production algorithms",
            "Fluency in solving complex technical interview and coding round problems",
            "Proficiency in selecting optimal data structures for high-performance systems"
        ],
        "practice": "Solve 30-40 targeted problems on LeetCode / HackerRank categorized by data structure topic.",
        "recommended_projects": [
            {
                "title": "Interactive Algorithm & Pathfinding Visualizer",
                "description": "Build a responsive web application that visualizes pathfinding algorithms (Dijkstra, A*, BFS) and sorting algorithms (QuickSort, MergeSort) step-by-step with speed controls.",
                "difficulty": "Intermediate",
                "technologies": ["React", "JavaScript (ES6+)", "HTML5 Canvas / CSS Grid"]
            },
            {
                "title": "In-Memory Key-Value Store with LRU Cache",
                "description": "Implement a high-performance in-memory key-value cache engine utilizing doubly linked lists and hash maps with TTL expiration and concurrency safety.",
                "difficulty": "Advanced",
                "technologies": ["Python / C++", "Data Structures", "Thread Safety"]
            },
            {
                "title": "Autocomplete & Search Trie Engine",
                "description": "Develop a high-speed prefix search library with Trie and Priority Queue algorithms for instant query suggestions and ranked autocomplete.",
                "difficulty": "Beginner",
                "technologies": ["JavaScript / Python", "Trie", "Priority Queue"]
            }
        ],
        "project_title": "Interactive Algorithm & Pathfinding Visualizer",
        "project_description": "Build a responsive web application that visualizes pathfinding algorithms (Dijkstra, A*, BFS) and sorting algorithms (QuickSort, MergeSort) step-by-step.",
        "completion_criteria": "Solve at least 25 Easy and 15 Medium LeetCode problems and build at least one algorithmic application."
    },
    "Object-Oriented Programming (OOP)": {
        "title": "Object-Oriented Programming & Clean Architecture",
        "duration": "2-3 weeks",
        "learning_topics": [
            "1. Core OOP Pillars: Encapsulation, Abstraction, Inheritance, Polymorphism",
            "2. Constructors, Destructors, Method Overloading & Method Overriding",
            "3. Abstract Classes, Interfaces & Protocol-Oriented Design",
            "4. SOLID Design Principles in Real-World Software",
            "5. Gang of Four (GoF) Design Patterns (Singleton, Factory, Strategy, Observer)",
            "6. Clean Code, Unit Testing & Refactoring Legacy Code"
        ],
        "certifications": [
            "Oracle Certified Associate / Professional (Java SE)",
            "Coursera Object-Oriented Design & Clean Code Certificate",
            "Python Institute Certified Associate in Python Programming (PCAP)"
        ],
        "skill_outcomes": [
            "Mastery of architecting decoupled, maintainable class hierarchies",
            "Ability to apply SOLID principles and GoF design patterns in industry backends",
            "Writing reusable enterprise software components with high unit test coverage"
        ],
        "practice": "Model real-world systems in Python, Java, or TypeScript (e.g. Parking Lot, Movie Booking, Chess Game).",
        "recommended_projects": [
            {
                "title": "Multi-Role Enterprise Management System",
                "description": "Implement a modular management platform featuring distinct User, Manager, and Admin roles inheriting from extensible abstract base classes with polymorphic access control.",
                "difficulty": "Intermediate",
                "technologies": ["Python / Java", "OOP Principles", "Unit Tests"]
            },
            {
                "title": "Pluggable Payment Processing Engine",
                "description": "Design an extensible payment processing architecture using the Strategy and Factory design patterns supporting Stripe, PayPal, and Crypto gateways.",
                "difficulty": "Advanced",
                "technologies": ["TypeScript / Python", "Design Patterns", "SOLID"]
            },
            {
                "title": "Smart Parking Lot Simulation",
                "description": "Create an object-oriented simulation modeling multi-floor parking spaces, vehicle types, automated ticketing, and dynamic fee calculation.",
                "difficulty": "Beginner",
                "technologies": ["Python / Java", "Class Hierarchies"]
            }
        ],
        "project_title": "Multi-Role Enterprise Management System",
        "project_description": "Implement a modular management platform featuring distinct User, Manager, and Admin roles inheriting from extensible abstract base classes.",
        "completion_criteria": "Design a complete UML class diagram and implement clean modular OOP code adhering to SOLID principles."
    },
    "Relational DBMS & SQL": {
        "title": "Relational Database Design & Complex SQL Queries",
        "duration": "2-3 weeks",
        "learning_topics": [
            "1. Relational Schema Modeling & Database Normalization (1NF to BCNF)",
            "2. DDL & Constraints: Primary Keys, Foreign Keys, Unique & Check constraints",
            "3. Advanced DML: Multi-table Joins (INNER, LEFT, RIGHT, FULL OUTER)",
            "4. Grouping & Aggregations: GROUP BY, HAVING, Conditional Aggregates",
            "5. Subqueries, Correlated Subqueries & CTEs (Common Table Expressions)",
            "6. SQL Window Functions: ROW_NUMBER(), RANK(), DENSE_RANK(), NTILE(), LEAD/LAG",
            "7. Indexing Strategies (B-Tree, Hash, Composite Indexes) & Query Optimization (EXPLAIN)",
            "8. Transactions, ACID properties, Isolation Levels & Database Locks"
        ],
        "certifications": [
            "Oracle Database SQL Certified Associate",
            "PostgreSQL Certified Developer / DBA (PostgreSQL Professional)",
            "Coursera Database Design & Basic SQL Certificate"
        ],
        "skill_outcomes": [
            "Ability to construct normalized relational schemas for high-traffic applications",
            "Expertise in writing complex analytical SQL queries with CTEs and window functions",
            "Proficiency in diagnosing query bottlenecks and tuning database execution plans"
        ],
        "practice": "Solve 25+ intermediate and advanced SQL query challenges on LeetCode SQL 50 and HackerRank.",
        "recommended_projects": [
            {
                "title": "Enterprise Recruitment & Career Analytics DB",
                "description": "Design a 3NF PostgreSQL database schema for job postings, candidate applications, interview stages, and offers, with analytical queries and reports.",
                "difficulty": "Intermediate",
                "technologies": ["PostgreSQL", "Complex Joins & CTEs", "Window Functions"]
            },
            {
                "title": "E-Commerce Transaction Engine with ACID Guarantees",
                "description": "Develop database procedures and triggers handling concurrent inventory checkout, ledger entries, and atomic payments with rollback protection.",
                "difficulty": "Advanced",
                "technologies": ["PostgreSQL / MySQL", "Transactions", "Stored Procedures"]
            },
            {
                "title": "Library & Book Rental Database",
                "description": "Build a normalized database schema with relational tables, foreign key constraints, and basic CRUD SQL queries for book reservations.",
                "difficulty": "Beginner",
                "technologies": ["SQLite / PostgreSQL", "Relational Modeling"]
            }
        ],
        "project_title": "Enterprise Recruitment & Career Analytics DB",
        "project_description": "Design a 3NF PostgreSQL database schema for job postings, candidate applications, interview stages, and offers.",
        "completion_criteria": "Write multi-table JOIN queries with analytical window calculations and indexing."
    },
    "REST API Development": {
        "title": "Production-Ready RESTful API Engineering",
        "duration": "2-3 weeks",
        "learning_topics": [
            "1. HTTP Protocol: Methods (GET, POST, PUT, PATCH, DELETE), Headers & Status Codes",
            "2. RESTful Architecture Principles, Resource Naming & API Versioning",
            "3. Request/Response Validation with Schemas (Pydantic / Zod / Joi)",
            "4. ORM Database Integration (SQLAlchemy / Prisma / TypeORM)",
            "5. User Authentication (JWT Tokens, Refresh Tokens, Password Hashing)",
            "6. Role-Based Access Control (RBAC) & Middleware Guards",
            "7. Error Handling, Structured Logging & Swagger/OpenAPI Documentation",
            "8. API Rate Limiting, CORS Configuration & Pagination (Cursor/Offset)"
        ],
        "certifications": [
            "Postman API Fundamentals Student / Pro Certification",
            "AWS Certified Developer - Associate (API Gateway & Lambdas)",
            "Meta Back-End Developer Professional Certificate"
        ],
        "skill_outcomes": [
            "Designing clean, standardized, versioned RESTful APIs",
            "Implementing bulletproof JWT authentication and middleware authorization",
            "Connecting backend endpoints with ORMs, connection pooling, and Swagger docs"
        ],
        "practice": "Build, document, and test CRUD endpoints using Postman or Swagger UI.",
        "recommended_projects": [
            {
                "title": "Production-Grade Career & Job Board API",
                "description": "Develop modular FastAPI REST endpoints with PostgreSQL ORM integration, JWT authentication, role guards, filtering, and OpenAPI documentation.",
                "difficulty": "Intermediate",
                "technologies": ["FastAPI / Express", "PostgreSQL", "JWT & Pydantic"]
            },
            {
                "title": "Real-Time Notification & Webhook Dispatcher",
                "description": "Build a microservice API that accepts events and dispatches authenticated asynchronous webhooks with retry backoff and signature verification.",
                "difficulty": "Advanced",
                "technologies": ["FastAPI / Node.js", "Redis / Background Tasks", "HMAC Signatures"]
            },
            {
                "title": "Task & Note Management REST API",
                "description": "Construct a clean CRUD backend API with schema validation, sorting, filtering, and persistent database storage.",
                "difficulty": "Beginner",
                "technologies": ["FastAPI / Express", "SQLite / PostgreSQL"]
            }
        ],
        "project_title": "Production-Grade Career & Job Board API",
        "project_description": "Develop modular FastAPI REST endpoints with PostgreSQL ORM integration, JWT authentication, and OpenAPI documentation.",
        "completion_criteria": "Deploy an API with authenticated endpoints, automated docs, and comprehensive unit tests."
    },
    "Git & Version Control": {
        "title": "Git Workflow & Team Collaboration",
        "duration": "1 week",
        "learning_topics": [
            "1. Git Internal Architecture: Working Directory, Staging Index, Commit Tree",
            "2. Essential Commands: `init`, `add`, `commit`, `status`, `diff`, `log`",
            "3. Branching Strategies: GitFlow, Trunk-Based Development, Feature Branches",
            "4. Merging vs Rebasing: Fast-forward merges, interactive rebase, squashing",
            "5. Conflict Resolution: Resolving 3-way merge conflicts cleanly",
            "6. Remote Collaboration: Remotes, SSH Keys, Push, Fetch, Pull, Upstream",
            "7. Pull Requests, Code Reviews, Git Hooks & GitHub Actions CI/CD Basics"
        ],
        "certifications": [
            "GitHub Foundations Certification",
            "GitLab Certified Associate",
            "Coursera Version Control with Git (Meta)"
        ],
        "skill_outcomes": [
            "Seamless collaboration in multi-developer Git repositories",
            "Confidence in resolving complex merge conflicts and rebasing branches",
            "Setting up automated CI/CD checks on GitHub pull requests"
        ],
        "practice": "Create multi-branch repositories locally, simulate merge conflicts, and resolve with interactive rebase.",
        "recommended_projects": [
            {
                "title": "Open-Source Team Repository with CI/CD Workflow",
                "description": "Setup a collaborative GitHub repository featuring branch protection rules, issue templates, PR checklists, and GitHub Actions for automated linting/tests.",
                "difficulty": "Intermediate",
                "technologies": ["GitHub", "Git Workflows", "GitHub Actions CI"]
            },
            {
                "title": "Custom Git Pre-Commit Hook Suite",
                "description": "Write shell/Python git hooks that automatically inspect staged files for security tokens, format code, and validate commit message conventions.",
                "difficulty": "Advanced",
                "technologies": ["Bash / Python", "Git Hooks", "Conventional Commits"]
            },
            {
                "title": "Personal Portfolio Project with Semantic Release",
                "description": "Publish a well-structured project repository with clean commit history, README documentation, and semantic versioning tags.",
                "difficulty": "Beginner",
                "technologies": ["Git", "GitHub", "Markdown"]
            }
        ],
        "project_title": "Open-Source Team Repository with CI/CD Workflow",
        "project_description": "Setup a collaborative GitHub repository featuring branch protection rules, issue templates, and GitHub Actions.",
        "completion_criteria": "Publish a multi-branch repository on GitHub with clean commits and automated workflow passes."
    },
    "System Design Basics": {
        "title": "Scalable System Design Fundamentals",
        "duration": "2-3 weeks",
        "learning_topics": [
            "1. Core Principles: High Availability, Scalability, Reliability, Maintainability",
            "2. Load Balancing (Layer 4 vs Layer 7, Round Robin, Least Connections)",
            "3. Caching Architectures: Cache-Aside, Write-Through, Redis, CDN",
            "4. Database Scaling: Read Replicas, Sharding, Partitioning, CAP Theorem",
            "5. Asynchronous Processing: Message Queues, Pub/Sub (RabbitMQ, Kafka)",
            "6. Microservices vs Monoliths, API Gateways, Rate Limiting",
            "7. System Design Interview Patterns: TinyURL, Rate Limiter, News Feed"
        ],
        "certifications": [
            "AWS Certified Solutions Architect - Associate",
            "Google Cloud Associate Cloud Engineer",
            "Grokking System Design Assessment"
        ],
        "skill_outcomes": [
            "Ability to draft scalable architectures for millions of concurrent users",
            "Mastery of caching, database replication, and load-balancing strategies",
            "Confidence in leading system design and technical architecture interviews"
        ],
        "practice": "Diagram high-level architecture designs for URL Shortener (TinyURL) or Rate Limiter.",
        "recommended_projects": [
            {
                "title": "High-Throughput Distributed URL Shortener",
                "description": "Design and build a scalable URL shortener with FastAPI, PostgreSQL storage, Redis caching layer, and Base62 hashing algorithm.",
                "difficulty": "Intermediate",
                "technologies": ["FastAPI", "Redis Cache", "PostgreSQL", "Docker"]
            },
            {
                "title": "Distributed Rate Limiter Microservice",
                "description": "Implement a distributed token bucket / sliding window rate limiting service backed by Redis for protecting backend APIs from traffic spikes.",
                "difficulty": "Advanced",
                "technologies": ["Redis", "FastAPI / Go", "Concurrency"]
            },
            {
                "title": "File Storage Metadata Service Architecture",
                "description": "Design a simplified Google Drive/Dropbox clone with dedicated metadata endpoints and presigned object storage uploads.",
                "difficulty": "Beginner",
                "technologies": ["System Architecture", "REST", "S3 / Object Storage"]
            }
        ],
        "project_title": "High-Throughput Distributed URL Shortener",
        "project_description": "Design and build a scalable URL shortener with FastAPI, PostgreSQL storage, Redis caching layer, and Base62 hashing.",
        "completion_criteria": "Create an architectural diagram and implement a working prototype with Redis caching."
    },
    "JavaScript (ES6+)": {
        "title": "Modern JavaScript (ES6+) Deep Dive",
        "duration": "2-3 weeks",
        "learning_topics": [
            "1. JS Engine, Execution Context, Call Stack & Lexical Scope",
            "2. ES6+ Features: Destructuring, Spread/Rest, Template Literals, Arrow Functions",
            "3. Asynchronous JS: Event Loop, Microtasks, Promises, `async`/`await`",
            "4. Closures, Prototypal Inheritance & Function Currying",
            "5. DOM Manipulation, Event Bubbling, Delegation & Custom Events",
            "6. Functional Programming: `map`, `filter`, `reduce`, Immutability",
            "7. Modern Tooling: ES Modules, NPM, Vite, Webpack & Babel"
        ],
        "certifications": [
            "OpenJS Node.js Application Developer (JAD)",
            "Coursera Programming with JavaScript (Meta)",
            "freeCodeCamp JavaScript Algorithms and Data Structures"
        ],
        "skill_outcomes": [
            "Deep understanding of async execution loop and memory lifecycle",
            "Writing clean, modern ES6+ code without relying on legacy patterns",
            "Building high-performance interactive client-side browser experiences"
        ],
        "practice": "Build vanilla JS utility functions (debouncing, throttling, deep clone, promise.all polyfill).",
        "recommended_projects": [
            {
                "title": "Async Real-Time Crypto & Stock Dashboard",
                "description": "Build an asynchronous client-side dashboard consuming live WebSocket and REST financial APIs with interactive filtering and charts.",
                "difficulty": "Intermediate",
                "technologies": ["Vanilla JavaScript", "WebSockets", "Chart.js / Canvas"]
            },
            {
                "title": "Custom Lightweight JavaScript Framework / Router",
                "description": "Implement a mini component-based reactive rendering engine with virtual DOM diffing and hash/history routing from scratch.",
                "difficulty": "Advanced",
                "technologies": ["ES6+", "Virtual DOM", "Browser History API"]
            },
            {
                "title": "Interactive Kanban Task Board",
                "description": "Create a drag-and-drop task organizer using HTML5 Drag and Drop API, localStorage persistence, and modular ES6 code.",
                "difficulty": "Beginner",
                "technologies": ["JavaScript (ES6)", "DOM API", "LocalStorage"]
            }
        ],
        "project_title": "Async Real-Time Crypto & Stock Dashboard",
        "project_description": "Build an asynchronous client-side dashboard consuming live financial APIs with interactive filtering.",
        "completion_criteria": "Demonstrate mastery over async/await, closures, debouncing, and modular JS code."
    },
    "React.js Framework": {
        "title": "Component-Driven React Application Engineering",
        "duration": "3-4 weeks",
        "learning_topics": [
            "1. React Core: JSX, Virtual DOM, Components, Props & Unidirectional Data Flow",
            "2. State Management: `useState`, `useReducer`, Form handling & Controlled Inputs",
            "3. Lifecycle & Side Effects: `useEffect`, cleanup functions & dependency arrays",
            "4. Single Page Navigation: React Router v6+, Loaders, Nested & Protected Routes",
            "5. Global State & Sharing: Context API, Custom Hooks creation",
            "6. Performance Tuning: `useMemo`, `useCallback`, `React.memo`, Code Splitting (`lazy`/`Suspense`)",
            "7. Styling & UI: Tailwind CSS, Modular CSS, Headless UI, Icon libraries"
        ],
        "certifications": [
            "Meta Front-End Developer Professional Certificate (React)",
            "Coursera Advanced React Certificate",
            "Scrimba Advanced React Certification"
        ],
        "skill_outcomes": [
            "Architecting modular, scalable single-page applications with React Router",
            "Designing custom hooks for clean separation of business logic and presentation",
            "Optimizing render cycles, component re-renders, and bundle sizes"
        ],
        "practice": "Build multi-page responsive web apps with route guards and custom hooks.",
        "recommended_projects": [
            {
                "title": "Career Readiness & Interactive Learning Portal",
                "description": "Create a rich multi-view web application featuring authentication guards, interactive roadmap cards, filters, and dynamic progress trackers.",
                "difficulty": "Intermediate",
                "technologies": ["React", "React Router", "Tailwind CSS", "Context API"]
            },
            {
                "title": "Collaborative Real-Time Workspace / Document Editor",
                "description": "Build a multi-user collaborative workspace with rich-text editing, live cursor presence, and optimistic UI updates.",
                "difficulty": "Advanced",
                "technologies": ["React", "WebSockets / Yjs", "Custom Hooks"]
            },
            {
                "title": "Personal Portfolio & Interactive Resume Showcase",
                "description": "Develop a responsive portfolio website showcasing projects, skill tags, theme toggles, and contact forms.",
                "difficulty": "Beginner",
                "technologies": ["React", "Tailwind CSS", "Vite"]
            }
        ],
        "project_title": "Career Readiness & Interactive Learning Portal",
        "project_description": "Create a rich multi-view web application featuring authentication guards, interactive roadmap cards, and dynamic progress trackers.",
        "completion_criteria": "Build a modular React application featuring reusable cards, forms, and custom hooks."
    },
    "Docker & Containerization": {
        "title": "Docker Packaging & Multi-Container Environments",
        "duration": "2 weeks",
        "learning_topics": [
            "1. Virtualization vs Containerization, Docker Engine & Architecture",
            "2. Dockerfile Directives: FROM, WORKDIR, COPY, RUN, CMD, ENTRYPOINT, EXPOSE",
            "3. Optimizing Docker Images: Multi-stage builds, `.dockerignore`, minimal base images (Alpine)",
            "4. Container Management: Lifecycle, Port mapping, Environment variables, Logs",
            "5. Docker Volumes & Bind Mounts for Persistent Storage",
            "6. Multi-Container Orchestration with Docker Compose (`docker-compose.yml`)",
            "7. Container Networking, Service Discovery & Docker Hub Registry publishing"
        ],
        "certifications": [
            "Docker Certified Associate (DCA)",
            "Certified Kubernetes Administrator (CKA) / Application Developer (CKAD)",
            "Linux Foundation Docker & Container Fundamentals"
        ],
        "skill_outcomes": [
            "Containerizing full-stack applications with minimal, secure Docker images",
            "Orchestrating multi-tier applications (Frontend, Backend, DB, Cache) via Docker Compose",
            "Eliminating environment inconsistencies across local development and production"
        ],
        "practice": "Containerize a full-stack web application with database and run multi-container stacks.",
        "recommended_projects": [
            {
                "title": "Full-Stack Multi-Container Application Stack",
                "description": "Create a production-ready docker-compose configuration orchestrating a React frontend, FastAPI backend, PostgreSQL database, and Redis cache with volume persistence.",
                "difficulty": "Intermediate",
                "technologies": ["Docker", "Docker Compose", "PostgreSQL", "FastAPI"]
            },
            {
                "title": "Automated Multi-Stage CI/CD Container Pipeline",
                "description": "Build a continuous integration pipeline that builds multi-stage Docker images, runs vulnerability scans with Trivy, and pushes versioned images to a container registry.",
                "difficulty": "Advanced",
                "technologies": ["Docker", "GitHub Actions", "Trivy Security Scanner"]
            },
            {
                "title": "Containerized Static Web Server with Nginx",
                "description": "Write a clean Dockerfile packaging an Nginx alpine web server serving production assets with custom headers and caching configuration.",
                "difficulty": "Beginner",
                "technologies": ["Docker", "Nginx", "Alpine Linux"]
            }
        ],
        "project_title": "Full-Stack Multi-Container Application Stack",
        "project_description": "Create a production-ready docker-compose configuration orchestrating React frontend, FastAPI backend, PostgreSQL, and Redis.",
        "completion_criteria": "Launch entire multi-tier stack with a single `docker compose up` command."
    },
    "Machine Learning & Scikit-Learn": {
        "title": "Supervised & Unsupervised Machine Learning",
        "duration": "3-4 weeks",
        "learning_topics": [
            "1. ML Fundamentals: Supervised vs Unsupervised vs Reinforcement Learning",
            "2. Exploratory Data Analysis (EDA): Handling Missing Data, Outliers, Feature Scaling",
            "3. Supervised Regression: Linear Regression, Ridge, Lasso, Evaluation Metrics (RMSE, R²)",
            "4. Supervised Classification: Logistic Regression, Decision Trees, Random Forests, XGBoost",
            "5. Classification Metrics: Confusion Matrix, Precision, Recall, F1-Score, ROC-AUC Curves",
            "6. Unsupervised Learning: K-Means Clustering, Hierarchical Clustering, PCA Dimensionality Reduction",
            "7. Cross-Validation, Hyperparameter Tuning (GridSearchCV, Optuna) & Model Serialization (Pickle/Joblib)"
        ],
        "certifications": [
            "Google Professional Machine Learning Engineer",
            "AWS Certified Machine Learning - Specialty",
            "Coursera Machine Learning Specialization (Andrew Ng / DeepLearning.AI)"
        ],
        "skill_outcomes": [
            "Building end-to-end predictive pipelines from raw data preprocessing to evaluation",
            "Selecting and tuning the highest-performing ML model for tabular datasets",
            "Deploying trained machine learning models via REST APIs for real-time inference"
        ],
        "practice": "Train and evaluate predictive models on Kaggle benchmark datasets.",
        "recommended_projects": [
            {
                "title": "Job Placement Probability & Salary Predictor",
                "description": "Train and validate machine learning classification and regression models to predict candidate placement probability and estimated compensation based on profile features.",
                "difficulty": "Intermediate",
                "technologies": ["Python", "Scikit-Learn", "Pandas", "FastAPI Inference"]
            },
            {
                "title": "Customer Churn & Anomaly Detection Pipeline",
                "description": "Build an end-to-end ML pipeline with automated feature engineering, ensemble modeling (Random Forest + XGBoost), and SHAP explainability analysis.",
                "difficulty": "Advanced",
                "technologies": ["Scikit-Learn", "XGBoost", "SHAP", "Optuna"]
            },
            {
                "title": "House Price Estimation Model",
                "description": "Implement linear regression and decision tree regressors with data scaling, cross-validation, and metric visualization.",
                "difficulty": "Beginner",
                "technologies": ["Python", "Scikit-Learn", "Matplotlib / Seaborn"]
            }
        ],
        "project_title": "Job Placement Probability & Salary Predictor",
        "project_description": "Train machine learning models to predict candidate placement probability and estimated compensation.",
        "completion_criteria": "Achieve strong F1 score on validation set and export the trained model pipeline for inference."
    }
}

def generate_roadmap_for_gaps(skill_gaps: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Generates a personalized, step-by-step roadmap for all missing/partial skills.
    Supports both standard knowledge base items and dynamic custom skills,
    providing 2-3 recommended projects, learning topics, certifications, and skill outcomes.
    """
    steps = []
    step_counter = 1
    
    # Prioritize: HIGH -> MEDIUM -> LOW
    sorted_gaps = sorted(
        skill_gaps,
        key=lambda g: 0 if g["priority"] == "HIGH" else (1 if g["priority"] == "MEDIUM" else 2)
    )

    for gap in sorted_gaps:
        skill_name = gap["skill_name"]
        
        # Look for exact or partial template match
        template = None
        for key, val in SKILL_ROADMAP_TEMPLATES.items():
            if key.lower() in skill_name.lower() or skill_name.lower() in key.lower():
                template = val
                break

        if not template:
            clean_name = skill_name.strip()
            template = {
                "title": f"Master {clean_name} Fundamentals & Application",
                "duration": "2-3 weeks",
                "learning_topics": [
                    f"1. Core concepts, architectural principles & syntax of {clean_name}",
                    f"2. Setting up dev environment & industry tooling for {clean_name}",
                    f"3. Practical problem solving, hands-on modules & design patterns in {clean_name}",
                    f"4. Real-world implementation, performance tuning & portfolio integration"
                ],
                "certifications": [
                    f"Industry Accredited Certification in {clean_name}",
                    f"Professional Domain Specialization Certificate for {clean_name}"
                ],
                "skill_outcomes": [
                    f"Practical working competency in {clean_name} for industry projects",
                    f"Ability to solve real-world problems and build production modules using {clean_name}"
                ],
                "practice": f"Complete hands-on tutorials, official documentation labs, and practical drills for {clean_name}.",
                "recommended_projects": [
                    {
                        "title": f"{clean_name} Industry Application Project",
                        "description": f"Design and implement a functional, modular project applying {clean_name} to solve a real-world problem.",
                        "difficulty": "Intermediate",
                        "technologies": [clean_name, "Industry Best Practices"]
                    },
                    {
                        "title": f"Production-Grade Scalable Service using {clean_name}",
                        "description": f"Architect a robust, end-to-end service or system leveraging advanced capabilities of {clean_name}.",
                        "difficulty": "Advanced",
                        "technologies": [clean_name, "Architecture", "Testing"]
                    },
                    {
                        "title": f"{clean_name} Starter Tool & Utility",
                        "description": f"Build a fundamental script, CLI utility, or prototype exploring core capabilities of {clean_name}.",
                        "difficulty": "Beginner",
                        "technologies": [clean_name]
                    }
                ],
                "project_title": f"{clean_name} Industry Application Project",
                "project_description": f"Design and implement a functional project applying {clean_name} to solve a real-world problem.",
                "completion_criteria": f"Build a tested, documented repository showcasing your practical implementation of {clean_name}."
            }

        # Initial status
        init_status = "COMPLETED" if gap["match_status"] == "STRONG_MATCH" else "NOT_STARTED"

        learning_topics = template.get("learning_topics", template.get("steps", []))
        rec_projects = template.get("recommended_projects", [
            {
                "title": template.get("project_title", f"{skill_name} Project"),
                "description": template.get("project_description", f"Build a project applying {skill_name}."),
                "difficulty": "Intermediate",
                "technologies": [skill_name]
            }
        ])

        steps.append({
            "step_number": step_counter,
            "title": template["title"],
            "skill_name": skill_name,
            "duration": template["duration"],
            "status": init_status,
            "learning_sequence": learning_topics,
            "learning_topics": learning_topics,
            "certifications": template.get("certifications", []),
            "skill_outcomes": template.get("skill_outcomes", []),
            "recommended_projects": rec_projects,
            "practice_guide": template["practice"],
            "project_title": template["project_title"],
            "project_description": template["project_description"],
            "completion_criteria": template["completion_criteria"]
        })
        step_counter += 1

    return steps
