import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/common/Card';
import api from '../services/api';
import { 
  ArrowRight, 
  BookOpen, 
  Award, 
  ChevronDown, 
  ChevronUp, 
  Filter, 
  Play, 
  FastForward, 
  Target, 
  Clock,
  ExternalLink,
  FolderGit2
} from 'lucide-react';

// Predefined simple student learning resources & structured topics database
const PREDEFINED_SKILL_RESOURCES = {
  // Python
  python: {
    startHere: "Python fundamentals",
    nextStep: "Functions and data structures",
    whereToLearn: ["YouTube", "freeCodeCamp", "W3Schools"],
    certification: "Basic Python certification/course",
    duration: "3–4 weeks",
    projects: [
      {
        name: "Student Performance Predictor",
        difficulty: "Beginner",
        skills: "Python, Pandas, Machine Learning",
        description: "Predict student marks using study-related data."
      },
      {
        name: "Expense Tracker",
        difficulty: "Beginner",
        skills: "Python, File Handling",
        description: "Create a simple application to record and calculate expenses."
      }
    ],
    foundation: [
      "Variables and data types",
      "Operators",
      "Conditional statements",
      "Loops",
      "Functions"
    ],
    core: [
      "Lists",
      "Tuples",
      "Sets",
      "Dictionaries",
      "File handling"
    ],
    intermediate: [
      "Exception handling",
      "Modules and packages",
      "Object-oriented programming"
    ],
    advanced: [
      "APIs",
      "Advanced libraries"
    ]
  },
  // SQL / Database
  sql: {
    startHere: "Database fundamentals & SELECT",
    nextStep: "WHERE, ORDER BY & JOINs",
    whereToLearn: ["YouTube", "W3Schools", "GeeksforGeeks"],
    certification: "Basic SQL certification/course",
    duration: "2–3 weeks",
    projects: [
      {
        name: "Library Management Database",
        difficulty: "Beginner",
        skills: "SQL, Joins, Table Normalization",
        description: "Design relational tables and write queries to track book checkouts, returns, and member records."
      },
      {
        name: "Retail Sales Analysis",
        difficulty: "Intermediate",
        skills: "SQL, Aggregate Functions, Group By, Subqueries",
        description: "Analyze store revenue, customer purchase history, and top-selling products using analytical SQL queries."
      }
    ],
    foundation: [
      "Database fundamentals",
      "SELECT",
      "WHERE",
      "ORDER BY"
    ],
    core: [
      "GROUP BY",
      "Aggregate functions",
      "JOINs",
      "Subqueries"
    ],
    intermediate: [
      "Common Table Expressions (CTEs)",
      "Window functions",
      "Table normalization & Constraints"
    ],
    advanced: [
      "Query optimization & Indexing",
      "Transactions & ACID properties"
    ]
  },
  // Cloud / AWS / GCP / Azure
  cloud: {
    startHere: "Cloud fundamentals & Service Models",
    nextStep: "Virtual machines & Cloud Storage",
    whereToLearn: ["YouTube", "freeCodeCamp", "Coursera"],
    certification: "Basic Cloud / AWS certification/course",
    duration: "3–4 weeks",
    projects: [
      {
        name: "Static Website Hosting on Cloud",
        difficulty: "Beginner",
        skills: "Cloud Storage, S3/Blob, DNS, IAM",
        description: "Host and deploy a responsive portfolio website with secure cloud object storage and CDN distribution."
      },
      {
        name: "Serverless Thumbnail Generator",
        difficulty: "Intermediate",
        skills: "Cloud Functions, Lambda, Cloud Storage, IAM",
        description: "Automatically resize and compress uploaded images triggered by cloud storage events."
      }
    ],
    foundation: [
      "Cloud fundamentals",
      "IaaS, PaaS, SaaS",
      "Virtual machines"
    ],
    core: [
      "Networking",
      "Storage",
      "IAM",
      "Security"
    ],
    intermediate: [
      "AWS/Azure/GCP basics",
      "Load balancing & Auto-scaling",
      "Containers (ECS / Cloud Run)"
    ],
    advanced: [
      "Serverless architecture",
      "Infrastructure as Code & CI/CD"
    ]
  },
  // Git & GitHub
  git: {
    startHere: "Repository & Commit workflow",
    nextStep: "Branch, Push, Pull & Merge",
    whereToLearn: ["YouTube", "freeCodeCamp", "W3Schools"],
    certification: "Basic Git & GitHub certification/course",
    duration: "1–2 weeks",
    projects: [
      {
        name: "Team Collaboration Simulation",
        difficulty: "Beginner",
        skills: "Git, Branching, Pull Requests, Merge Conflicts",
        description: "Practice branching, resolving merge conflicts, and code reviews across multiple feature branches."
      },
      {
        name: "Open Source Portfolio Showcase",
        difficulty: "Beginner",
        skills: "Git, Markdown, GitHub Actions, Releases",
        description: "Structure a clean repository with documentation, issue templates, and basic automated workflows."
      }
    ],
    foundation: [
      "Repository",
      "Commit",
      "Staging area & Git status"
    ],
    core: [
      "Branch",
      "Push",
      "Pull",
      "Merge"
    ],
    intermediate: [
      "Pull requests",
      "Merge conflicts",
      "Git stash & log"
    ],
    advanced: [
      "Git rebase & history",
      "Git hooks & CI/CD"
    ]
  },
  // JavaScript
  javascript: {
    startHere: "JavaScript fundamentals & DOM selection",
    nextStep: "Arrays, Objects & Async JS",
    whereToLearn: ["YouTube", "freeCodeCamp", "W3Schools"],
    certification: "Basic JavaScript certification/course",
    duration: "3–4 weeks",
    projects: [
      {
        name: "Interactive Task Manager",
        difficulty: "Beginner",
        skills: "JavaScript, DOM Manipulation, LocalStorage",
        description: "Build an interactive task organizer with filtering, search, and browser data persistence."
      },
      {
        name: "Currency Exchange Calculator",
        difficulty: "Beginner",
        skills: "JavaScript, Fetch API, Async/Await",
        description: "Fetch live exchange rates from a public API and convert currencies in real-time."
      }
    ],
    foundation: [
      "Variables (let, const) & Data types",
      "Operators & Expressions",
      "Conditionals & Control flow",
      "Loops & Iterators",
      "Functions & Arrow syntax"
    ],
    core: [
      "Arrays & Array methods (map, filter)",
      "Objects & Destructuring",
      "DOM manipulation",
      "Events & Event listeners",
      "Fetch API & JSON"
    ],
    intermediate: [
      "Promises & Async/Await",
      "ES6 Modules & Scope",
      "Object-oriented JS & Classes"
    ],
    advanced: [
      "Web APIs & Local Storage",
      "Performance optimization"
    ]
  },
  // React.js
  react: {
    startHere: "React fundamentals (JSX & Props)",
    nextStep: "useState & useEffect hooks",
    whereToLearn: ["YouTube", "freeCodeCamp", "React.dev"],
    certification: "Basic React certification/course",
    duration: "3–4 weeks",
    projects: [
      {
        name: "Job Search & Bookmark Portal",
        difficulty: "Beginner",
        skills: "React, Hooks (useState, useEffect), Component State",
        description: "Build a frontend application to search, filter, and save job listings with responsive UI cards."
      },
      {
        name: "Student Grade Dashboard",
        difficulty: "Intermediate",
        skills: "React, Props, Custom Hooks, Chart Integration",
        description: "Create an interactive dashboard showing student scores, visual charts, and semester progress."
      }
    ],
    foundation: [
      "JSX syntax & Element rendering",
      "Components & Props",
      "Conditional rendering",
      "Lists & Keys",
      "Event handling"
    ],
    core: [
      "useState hook",
      "useEffect hook",
      "Controlled forms & Inputs",
      "Component composition",
      "React Router"
    ],
    intermediate: [
      "Custom hooks",
      "useContext & Global state",
      "API integration with Fetch/Axios"
    ],
    advanced: [
      "Performance optimization (useMemo)",
      "Server-side rendering concepts"
    ]
  },
  // Data Structures & Algorithms
  dsa: {
    startHere: "Time/Space Complexity & Linear Arrays",
    nextStep: "Linked Lists, Stacks & Queues",
    whereToLearn: ["YouTube", "LeetCode", "GeeksforGeeks"],
    certification: "Basic DSA / Problem Solving certification/course",
    duration: "4–6 weeks",
    projects: [
      {
        name: "Contact Search & Auto-Complete",
        difficulty: "Beginner",
        skills: "Arrays, Hash Maps, Prefix Matching",
        description: "Implement fast contact lookups and auto-complete suggestions using hash maps and dictionary sets."
      },
      {
        name: "Task Scheduler with Priority Queue",
        difficulty: "Intermediate",
        skills: "Stacks, Queues, Binary Heaps",
        description: "Build a prioritized task execution system that processes urgent background tasks first."
      }
    ],
    foundation: [
      "Time & Space Complexity (Big-O)",
      "Arrays & Strings",
      "Two-pointer techniques",
      "Sliding window methods",
      "Linear & Binary search"
    ],
    core: [
      "Linked Lists",
      "Stacks & Queues",
      "Hash Tables & Sets",
      "Recursion",
      "Basic Sorting algorithms"
    ],
    intermediate: [
      "Binary Trees & BSTs",
      "Heaps & Priority Queues",
      "Graph traversals (BFS, DFS)"
    ],
    advanced: [
      "Dynamic Programming",
      "Advanced Graph algorithms (Dijkstra)"
    ]
  },
  // Docker
  docker: {
    startHere: "Containers vs VMs & Docker CLI",
    nextStep: "Dockerfiles, Images & Volumes",
    whereToLearn: ["YouTube", "freeCodeCamp", "Docker Docs"],
    certification: "Basic Docker certification/course",
    duration: "2–3 weeks",
    projects: [
      {
        name: "Containerized Web Application",
        difficulty: "Beginner",
        skills: "Dockerfile, Docker CLI, Port Forwarding",
        description: "Package a frontend and backend app into lightweight container images for reproducible deployment."
      },
      {
        name: "Multi-Service App with Docker Compose",
        difficulty: "Intermediate",
        skills: "Docker Compose, Volumes, Networking",
        description: "Run a web server, backend API, and database simultaneously in linked isolated networks."
      }
    ],
    foundation: [
      "Containers vs Virtual Machines",
      "Docker Engine & CLI",
      "Docker Hub & Base images",
      "Container lifecycle (run, stop, ps)",
      "Container logs & Shell access"
    ],
    core: [
      "Writing a Dockerfile",
      "Building images (docker build)",
      "Port forwarding (-p)",
      "Volumes & Data persistence",
      "Environment variables"
    ],
    intermediate: [
      "Docker Compose multi-container setup",
      "Container networking",
      "Multi-stage Docker builds"
    ],
    advanced: [
      "Container security & Health checks",
      "CI/CD container deployment"
    ]
  },
  // Machine Learning
  ml: {
    startHere: "Data preprocessing & Supervised Learning",
    nextStep: "Regression, Classification & Evaluation",
    whereToLearn: ["YouTube", "Coursera", "Kaggle"],
    certification: "Basic Machine Learning certification/course",
    duration: "4–6 weeks",
    projects: [
      {
        name: "Student Performance Predictor",
        difficulty: "Beginner",
        skills: "Python, Scikit-Learn, Regression, Preprocessing",
        description: "Predict student marks using study-related data."
      },
      {
        name: "Customer Churn Classifier",
        difficulty: "Intermediate",
        skills: "Machine Learning, Decision Trees, Classification",
        description: "Classify whether subscription customers are likely to cancel based on usage patterns."
      }
    ],
    foundation: [
      "Supervised vs Unsupervised learning",
      "Train/Test split & Feature matrices",
      "Data cleaning & Imputation",
      "Feature scaling (StandardScaler)",
      "Evaluation metrics (Accuracy, F1)"
    ],
    core: [
      "Linear Regression",
      "Logistic Regression",
      "Decision Trees & Random Forests",
      "Categorical encoding (One-Hot)",
      "Cross-validation"
    ],
    intermediate: [
      "Hyperparameter tuning (GridSearch)",
      "Support Vector Machines & KNN",
      "Scikit-Learn Pipelines"
    ],
    advanced: [
      "Gradient Boosting (XGBoost)",
      "Model deployment via REST APIs"
    ]
  },
  // Power BI
  powerbi: {
    startHere: "Data import & Basic chart visuals",
    nextStep: "Data modeling & DAX measures",
    whereToLearn: ["YouTube", "Microsoft Learn", "Coursera"],
    certification: "Basic Power BI / Data Analyst certification/course",
    duration: "2–3 weeks",
    projects: [
      {
        name: "E-Commerce Sales Dashboard",
        difficulty: "Beginner",
        skills: "Power BI, Power Query, Data Modeling",
        description: "Create visual dashboards showing monthly revenue trends, top customer segments, and product sales."
      },
      {
        name: "Employee Attendance & HR Report",
        difficulty: "Beginner",
        skills: "Power BI, DAX Measures, KPI Cards",
        description: "Build interactive HR metrics tracking department attendance, leave distribution, and performance ratings."
      }
    ],
    foundation: [
      "BI fundamentals & Tool interface",
      "Connecting to data sources",
      "Power Query data cleaning",
      "Bar, Line & Pie charts",
      "KPI cards & Summary tables"
    ],
    core: [
      "Data modeling & Star schema",
      "Calculated columns & DAX measures",
      "Slicers & Interactive filters",
      "Date dimensions & Time-intelligence",
      "Drill-down hierarchies"
    ],
    intermediate: [
      "Advanced DAX (CALCULATE, FILTER)",
      "Custom tooltips & Formatting",
      "Row-Level Security (RLS)"
    ],
    advanced: [
      "Scheduled refresh & Gateways",
      "Power BI Service dashboard publishing"
    ]
  },
  // OOP
  oop: {
    startHere: "Classes, Objects & Constructors",
    nextStep: "Encapsulation, Inheritance & Polymorphism",
    whereToLearn: ["YouTube", "GeeksforGeeks", "W3Schools"],
    certification: "Basic OOP certification/course",
    duration: "2–3 weeks",
    projects: [
      {
        name: "Bank Account Management System",
        difficulty: "Beginner",
        skills: "Classes, Encapsulation, Methods, Validation",
        description: "Build a banking simulation handling deposits, withdrawals, and interest calculation with access controls."
      },
      {
        name: "Vehicle Rental System",
        difficulty: "Intermediate",
        skills: "Inheritance, Polymorphism, Abstract Classes",
        description: "Model rental rates, vehicle types (Car, Bike, Truck), and customer bookings using inheritance hierarchies."
      }
    ],
    foundation: [
      "Classes and Objects concepts",
      "Constructors & Instance variables",
      "Methods & Parameter passing",
      "Access modifiers (Public, Private)",
      "Memory references & Instantiation"
    ],
    core: [
      "Encapsulation (Getters & Setters)",
      "Inheritance (Single & Multilevel)",
      "Polymorphism (Method Overriding)",
      "Abstraction & Interfaces",
      "Composition vs Inheritance"
    ],
    intermediate: [
      "Static methods & Class variables",
      "Dunder / Magic methods",
      "Exception handling in OOP"
    ],
    advanced: [
      "SOLID design principles",
      "Design patterns (Singleton, Factory)"
    ]
  },
  // System Design
  system_design: {
    startHere: "Client-Server architecture & Scaling",
    nextStep: "Load balancing, Caching & Replication",
    whereToLearn: ["YouTube", "ByteByteGo", "GeeksforGeeks"],
    certification: "Basic System Design certification/course",
    duration: "3–4 weeks",
    projects: [
      {
        name: "URL Shortener Architecture",
        difficulty: "Intermediate",
        skills: "Client-Server, Hashing, Database Sharding, Caching",
        description: "Design a scalable short-link service with Redis caching and unique base62 hash generation."
      },
      {
        name: "Real-time Notification System",
        difficulty: "Intermediate",
        skills: "Message Queues, WebSockets, Load Balancing",
        description: "Architect a push notification pipeline handling high-throughput user notifications with queue buffering."
      }
    ],
    foundation: [
      "Client-Server architecture",
      "Horizontal vs Vertical scaling",
      "Load balancing algorithms",
      "Monolith vs Microservices",
      "Stateless service design"
    ],
    core: [
      "Caching (Redis / Memcached)",
      "Database replication",
      "Database sharding & Indexing",
      "Message queues (Kafka / RabbitMQ)",
      "CAP theorem"
    ],
    intermediate: [
      "Rate limiting algorithms",
      "Consistent hashing",
      "CDNs & Static caching"
    ],
    advanced: [
      "High availability & Disaster recovery",
      "Scalable architecture case studies"
    ]
  }
};

export const SkillGapPage = () => {
  const [gaps, setGaps] = useState([]);
  const [targetInfo, setTargetInfo] = useState({ role_title: 'Software Developer', target_company: '' });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [expandedIds, setExpandedIds] = useState(new Set());

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [gapsRes, targetRes] = await Promise.all([
        api.get('/roadmap/gaps'),
        api.get('/career/target').catch(() => ({ data: null }))
      ]);

      setGaps(gapsRes.data || []);
      if (targetRes && targetRes.data) {
        setTargetInfo(targetRes.data);
      }

      // Default expand all gaps for direct overview
      if (gapsRes.data && gapsRes.data.length > 0) {
        setExpandedIds(new Set(gapsRes.data.map((g) => g.id)));
      }
    } catch (err) {
      console.error('Failed to load skill gaps data', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (id) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const expandAll = () => {
    setExpandedIds(new Set(gaps.map((g) => g.id)));
  };

  const collapseAll = () => {
    setExpandedIds(new Set());
  };

  // Predefined matching based on missing skill name
  const resolveCurriculumForSkill = (skillName, backendTopics) => {
    const n = (skillName || '').toLowerCase();

    let matchedKey = null;
    if (n.includes('python')) matchedKey = 'python';
    else if (n.includes('sql') || n.includes('dbms') || n.includes('database') || n.includes('postgres') || n.includes('mysql')) matchedKey = 'sql';
    else if (n.includes('cloud') || n.includes('aws') || n.includes('azure') || n.includes('gcp')) matchedKey = 'cloud';
    else if (n.includes('git') || n.includes('version control') || n.includes('github')) matchedKey = 'git';
    else if (n.includes('javascript') || (n.includes('js') && !n.includes('react')) || n.includes('es6')) matchedKey = 'javascript';
    else if (n.includes('react')) matchedKey = 'react';
    else if (n.includes('data structure') || n.includes('algorithm') || n.includes('dsa') || n.includes('problem solving')) matchedKey = 'dsa';
    else if (n.includes('docker') || n.includes('container')) matchedKey = 'docker';
    else if (n.includes('machine learning') || n.includes('scikit') || n.includes('ml')) matchedKey = 'ml';
    else if (n.includes('power bi') || n.includes('tableau') || n.includes('data analysis')) matchedKey = 'powerbi';
    else if (n.includes('oop') || n.includes('object-oriented') || n.includes('object oriented')) matchedKey = 'oop';
    else if (n.includes('system design') || n.includes('architecture')) matchedKey = 'system_design';

    if (matchedKey && PREDEFINED_SKILL_RESOURCES[matchedKey]) {
      return PREDEFINED_SKILL_RESOURCES[matchedKey];
    }

    // If backend provided topics for this specific skill gap, partition cleanly
    if (backendTopics && backendTopics.length > 0) {
      const cleanList = backendTopics.map((t) =>
        typeof t === 'string' ? t.replace(/^\d+[\.\)]\s*/, '').trim() : String(t)
      );

      const f = cleanList.slice(0, Math.max(1, Math.ceil(cleanList.length * 0.3)));
      const c = cleanList.slice(f.length, f.length + Math.max(1, Math.ceil(cleanList.length * 0.3)));
      const i = cleanList.slice(f.length + c.length, f.length + c.length + Math.max(1, Math.ceil(cleanList.length * 0.2)));
      const a = cleanList.slice(f.length + c.length + i.length);

      return {
        startHere: `${cleanList[0] || skillName + ' fundamentals'}`,
        nextStep: `${cleanList[1] || 'Core operations & practical implementation'}`,
        whereToLearn: ["YouTube", "freeCodeCamp", "W3Schools"],
        certification: `Basic ${skillName} certification/course`,
        duration: "2–3 weeks",
        projects: [
          {
            name: `${skillName} Starter Application`,
            difficulty: "Beginner",
            skills: `${skillName}, Core Fundamentals`,
            description: `Build a focused mini-application implementing the fundamental concepts of ${skillName}.`
          },
          {
            name: `${skillName} Practical Management Tool`,
            difficulty: "Intermediate",
            skills: `${skillName}, Data Handling, Workflows`,
            description: `Develop a functional application applying ${skillName} to solve a realistic domain challenge.`
          }
        ],
        foundation: f.length > 0 ? f : [`${skillName} fundamentals & basic syntax`],
        core: c.length > 0 ? c : [`Essential ${skillName} operations & primary modules`],
        intermediate: i.length > 0 ? i : [`Integration, problem solving & workflows with ${skillName}`],
        advanced: a.length > 0 ? a : [`High-performance optimization & production patterns`]
      };
    }

    // Default predefined fallback
    return {
      startHere: `${skillName} fundamentals`,
      nextStep: `Core operations, data structures & practical application`,
      whereToLearn: ["YouTube", "freeCodeCamp", "W3Schools"],
      certification: `Basic ${skillName} certification/course`,
      duration: "2–3 weeks",
      projects: [
        {
          name: `${skillName} Starter Application`,
          difficulty: "Beginner",
          skills: `${skillName}, Core Fundamentals`,
          description: `Build a focused mini-application implementing the fundamental concepts of ${skillName}.`
        },
        {
          name: `${skillName} Practical Management Tool`,
          difficulty: "Intermediate",
          skills: `${skillName}, Data Handling, Workflows`,
          description: `Develop a functional application applying ${skillName} to solve a realistic domain challenge.`
        }
      ],
      foundation: [
        `${skillName} fundamentals & key concepts`,
        "Basic syntax, data types & operators",
        "Control structures & conditional logic",
        "Loops & iterative execution"
      ],
      core: [
        "Core structures & primary data collections",
        "Essential methods & standard library functions",
        "File operations & data handling",
        "Object & component modeling"
      ],
      intermediate: [
        "Error handling & exception management",
        "Modular architecture & dependency imports",
        `Practical problem-solving with ${skillName}`
      ],
      advanced: [
        "APIs, networking & service integration",
        "Production deployment, security & optimization"
      ]
    };
  };

  const getPriorityBadge = (priority) => {
    const p = (priority || 'LOW').toUpperCase();
    if (p === 'HIGH') {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-red-100 text-red-700">
          PRIORITY: HIGH
        </span>
      );
    }
    if (p === 'MEDIUM') {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-800">
          PRIORITY: MEDIUM
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800">
        PRIORITY: LOW
      </span>
    );
  };

  const filteredGaps = gaps.filter((gap) => {
    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'MISSING' && gap.match_status === 'MISSING') ||
      (statusFilter === 'PARTIAL_MATCH' && gap.match_status === 'PARTIAL_MATCH') ||
      (statusFilter === 'STRONG_MATCH' && gap.match_status === 'STRONG_MATCH');

    const matchesPriority =
      priorityFilter === 'ALL' || gap.priority === priorityFilter;

    return matchesStatus && matchesPriority;
  });

  const totalCount = gaps.length;
  const missingCount = gaps.filter((g) => g.match_status === 'MISSING').length;
  const partialCount = gaps.filter((g) => g.match_status === 'PARTIAL_MATCH').length;
  const strongCount = gaps.filter((g) => g.match_status === 'STRONG_MATCH').length;

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-sm text-slate-500 font-medium">
          Loading skill gaps for {targetInfo.role_title || 'target role'}...
        </p>
      </div>
    );
  }

  // Only show skills that are strictly MISSING from the resume
  const missingSkills = gaps.filter((g) => g.match_status === 'MISSING');

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-1">
            <Target className="w-3.5 h-3.5" />
            <span>Target Career: {targetInfo.role_title} {targetInfo.target_company ? `(${targetInfo.target_company})` : ''}</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Missing Skills to Acquire</h1>
          <p className="text-sm text-slate-500 mt-1">
            Skills required for your target role that were not found or sufficiently demonstrated in your resume.
          </p>
        </div>
      </div>

      {/* Missing Skills List */}
      <Card className="shadow-xs border border-slate-200">
        <div className="p-5 sm:p-6">
          {missingSkills.length === 0 ? (
            <div className="text-center py-10">
              {gaps.length === 0 ? (
                <p className="text-sm text-slate-500">
                  No skill gap data available. Please upload your resume and select a target role first.
                </p>
              ) : (
                <p className="text-sm text-slate-500">
                  Great news — no missing skills were identified for your target role based on your resume.
                </p>
              )}
            </div>
          ) : (
            <ul className="flex flex-wrap gap-3">
              {missingSkills.map((gap) => (
                <li
                  key={gap.id}
                  className="inline-flex items-center px-4 py-2 rounded-lg bg-red-50 border border-red-200 text-red-800 text-sm font-semibold"
                >
                  {gap.skill_name}
                </li>
              ))}
            </ul>
          )}
        </div>
      </Card>
    </div>
  );
};
