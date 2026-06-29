# AI Recruiter Agent

AI Recruiter Agent is a full-stack AI-powered recruitment platform that helps recruiters analyze a job description, rank thousands of candidates, explain why candidates are selected, match individual resumes, and generate interview questions.

This project started as a hackathon candidate-ranking solution and has been converted into a recruiter-friendly SaaS-style web application.

---

## Live Links

- Frontend: https://ai-recruiter-agent-frontend.onrender.com/
- Backend API Docs: https://ai-recruiter-backend-7vet.onrender.com/docs
- GitHub Repository: https://github.com/Ayush-eng-ai/Automation-AI-Agent-Projects
- Portfolio: https://data-analysis-portfolio-six.vercel.app/
- Medium Article: https://medium.com/@ayushrajput8404/how-i-built-an-ai-recruiter-agent-from-hackathon-problem-to-full-stack-ai-product-e8feb9281cf2

---

## Problem Statement

Recruiters often receive hundreds or thousands of resumes for a single role. Manually screening candidates is slow, inconsistent, and difficult to explain.

AI Recruiter Agent solves this by converting a backend ranking pipeline into a complete web application where recruiters can upload a job description and candidate dataset, then instantly view ranked candidates with explainable AI recommendations.

---

## Key Features

### Candidate Ranking

- Upload a candidate dataset in CSV, JSON, or JSONL format
- Parse job description requirements
- Rank candidates using dynamic scoring
- Return top candidates based on JD fit
- Show candidate score, experience, company, location, and reason for selection

### Explainable AI Recommendation

- Shows why a candidate was selected
- Displays matched JD skills
- Displays role match evidence
- Displays confidence score
- Highlights strengths and risks
- Generates hiring recommendation such as Strongly Recommended, Recommended, Consider, or Not Recommended

### Resume Analysis

- Upload individual PDF or DOCX resume
- Extract resume text
- Match resume against job description
- Show matched skills and missing skills
- Provide resume improvement suggestions
- Suggest portfolio projects based on skill gaps

### Interview Question Generator

- Generates role-specific interview questions
- Supports roles such as Data Scientist, ML Engineer, Search Engineer, Recommendation Systems Engineer, Data Engineer, Backend Engineer, and Software Engineer

### Recruiter Dashboard

- Interactive candidate dashboard
- KPI cards
- Candidate cards
- Candidate slicer/dropdown
- Candidate detail view
- Score chart
- Skill match chart
- Explainability panel
- Hiring recommendation panel
- Interview questions panel

---

## Tech Stack

### Backend

- Python
- FastAPI
- Pandas
- PDFPlumber
- python-docx
- JSON / JSONL / CSV processing
- REST API

### Frontend

- React.js
- JavaScript
- CSS
- Recharts
- Vite

### Deployment

- Render
- GitHub

---

## Project Architecture

```text
AI-Recruiter-Agent/
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── schemas.py
│   │   ├── jd_parser.py
│   │   ├── dataset_parser.py
│   │   ├── ranking_agent.py
│   │   ├── scoring_engine.py
│   │   ├── explanation_engine.py
│   │   ├── hiring_recommendation.py
│   │   ├── resume_parser.py
│   │   ├── resume_matcher.py
│   │   └── interview_generator.py
│   │
│   ├── uploads/
│   ├── outputs/
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   └── App.css
│   │
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---
# 🏗 System Architecture

```text
                    Job Description
                           │
                           ▼
                    JD Parser Engine
                           │
                           ▼
                  Candidate Ranking Engine
                           │
          ┌────────────────┼────────────────┐
          ▼                ▼                ▼
   Skill Matching   Experience Match   Role Match
          │                │                │
          └────────────────┼────────────────┘
                           ▼
                   Dynamic Scoring
                           │
                           ▼
                 Explainable AI Layer
                           │
                           ▼
              Hiring Recommendation Engine
                           │
                           ▼
                 Interview Question Generator



                    Resume Upload
                           │
                           ▼
                    Resume Parser
                           │
                           ▼
                 Resume Match Engine
                           │
                           ▼
               Skill Gap Identification
                           │
                           ▼
              Resume Improvement Feedback
```

---

## Backend API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/` | Health check |
| POST | `/api/analyze` | Test job description input |
| POST | `/api/jd/parse` | Extract skills, roles, and experience from JD |
| GET | `/api/candidates/count` | Count candidates from configured dataset |
| GET | `/api/candidates/first` | Preview first candidate |
| GET | `/api/candidates/top` | Rank default/sample candidates |
| POST | `/api/rank` | Rank candidates using JD |
| POST | `/api/rank/download` | Download ranked results as CSV |
| POST | `/api/dataset/upload` | Upload candidate dataset |
| POST | `/api/rank/uploaded-dataset` | Rank uploaded dataset |
| POST | `/api/resume/upload` | Upload and parse resume |
| POST | `/api/resume/match` | Match resume with JD |
| GET | `/api/interview/questions` | Generate interview questions by title |

---

## How the Ranking Works

1. The recruiter enters a job description.
2. The backend extracts important JD skills, roles, and experience requirements.
3. The recruiter uploads a candidate dataset.
4. Each candidate profile is converted into searchable text using title, summary, career history, and skills.
5. The scoring engine calculates:
   - Base candidate score
   - Title score
   - Experience score
   - AI skill score
   - Career evidence score
   - Behavior signal score
   - Penalty score
   - JD skill score
   - JD role score
   - JD experience score
6. Candidates are sorted by dynamic score.
7. The frontend displays an interactive recruiter dashboard.

---

## Local Setup

### Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Backend runs at:

```text
http://127.0.0.1:8000
```

API documentation:

```text
http://127.0.0.1:8000/docs
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at:

```text
http://localhost:5173
```

---

## Required Frontend Dependency

The dashboard uses Recharts. Install it if missing:

```bash
npm install recharts
```

---

## Supported File Formats

### Candidate Dataset

- `.csv`
- `.json`
- `.jsonl`

### Resume Upload

- `.pdf`
- `.docx`

---

## Example Workflow

1. Paste a job description for a Data Scientist, ML Engineer, Search Engineer, or Backend Engineer role.
2. Upload candidate dataset in CSV, JSON, or JSONL format.
3. Click **Rank Uploaded Dataset**.
4. View top candidate KPIs.
5. Select any candidate from the candidate list or slicer.
6. Review score, matched skills, explainability, confidence, strengths, risks, and hiring recommendation.
7. Generate interview questions for the selected candidate.
8. Optionally upload a resume and match it against the same job description.

---

## Unique Value

Unlike a simple resume parser, AI Recruiter Agent combines:

- Candidate ranking
- JD-based dynamic scoring
- Explainable recommendation
- Resume matching
- Skill gap analysis
- Interview question generation
- Recruiter dashboard UI

This makes it a complete AI recruitment assistant instead of only a backend script.

---

## Future Improvements

- Authentication for recruiters
- Candidate shortlisting
- Candidate comparison
- PDF candidate report export
- Email report sharing
- Vector search using FAISS or Qdrant
- LLM-powered resume summarization
- Chat with resume
- Chat with job description
- AI recruiter copilot
- Admin dashboard
- Role-based access control

---

## Author

**Ayush Rajput**  
Aspiring Data Scientist and Full Stack AI Developer

Portfolio: https://data-analysis-portfolio-six.vercel.app/
GitHub: https://github.com/Ayush-eng-ai
Medium: https://medium.com/@ayushrajput8404/how-i-built-an-ai-recruiter-agent-from-hackathon-problem-to-full-stack-ai-product-e8feb9281cf2?sharedUserId=ayushrajput8404
