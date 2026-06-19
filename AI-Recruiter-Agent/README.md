# 🚀 AI Recruiter Agent

An AI-powered recruitment platform that helps recruiters discover, rank, evaluate, and shortlist the best candidates from large candidate datasets.

The platform combines Candidate Ranking, Explainable AI, Resume Matching, Interview Question Generation, and Hiring Recommendations into a single recruiter-friendly web application.

---

# 🌐 Live Demo

### Frontend
https://ai-recruiter-agent-frontend.onrender.com

### Backend API
https://ai-recruiter-backend-7vet.onrender.com

### API Documentation
https://ai-recruiter-backend-7vet.onrender.com/docs

---

# 📌 Problem Statement

Recruiters often spend hours manually screening hundreds or thousands of candidate profiles.

The goal of this project is to:

- Analyze Job Descriptions
- Rank candidates intelligently
- Explain ranking decisions
- Match resumes with job requirements
- Generate interview questions
- Assist recruiters in hiring decisions

---

# ✨ Key Features

## 1. Candidate Dataset Upload

Upload candidate datasets in:

- JSON
- JSONL
- CSV

Supports large candidate datasets.

---

## 2. AI Candidate Ranking

Candidates are ranked using:

- Skill Match
- Role Match
- Experience Match
- AI/ML Skills
- Career Evidence
- Behavioral Signals

---

## 3. Explainable AI Ranking

Instead of showing only a score, the system explains:

- Why the candidate was selected
- Skills matched
- Experience matched
- Career evidence found
- Confidence score

---

## 4. Resume Match Analyzer

Upload a resume and compare it with a Job Description.

Outputs:

- Match Score
- Matched Skills
- Missing Skills
- Recommendation

---

## 5. Resume Improvement Suggestions

Provides:

- Why the score is low
- Missing skills
- Resume improvement guidance
- Recommended projects

---

## 6. AI Interview Question Generator

Role-specific interview questions for:

- Search Engineer
- ML Engineer
- Data Scientist
- Backend Engineer
- Recommendation Systems Engineer

---

## 7. AI Hiring Recommendation Engine

Provides:

- Strongly Recommended
- Recommended
- Consider
- Not Recommended

Along with:

- Strengths
- Risks
- Confidence Score
- Hiring Decision Summary

---

## 8. Recruiter Analytics Dashboard

Displays:

- Total Records Processed
- Candidates Returned
- Top Score
- Average Score
- Confidence Metrics

---

# 🛠 Tech Stack

## Frontend

- React.js
- JavaScript
- CSS
- Vite

## Backend

- FastAPI
- Python

## Data Processing

- Pandas
- NumPy

## Resume Parsing

- pdfplumber
- python-docx

## Deployment

- Render
- GitHub

---

# 💻 Programming Languages

- Python
- JavaScript
- HTML
- CSS

---

# 📂 Project Structure

```text
AI-Recruiter-Agent
│
├── backend
│   ├── app
│   │   ├── dataset_parser.py
│   │   ├── jd_parser.py
│   │   ├── ranking_agent.py
│   │   ├── scoring_engine.py
│   │   ├── explanation_engine.py
│   │   ├── interview_generator.py
│   │   ├── hiring_recommendation.py
│   │   ├── resume_parser.py
│   │   ├── resume_matcher.py
│   │   └── main.py
│   │
│   ├── uploads
│   ├── outputs
│   └── requirements.txt
│
├── frontend
│   ├── public
│   ├── src
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
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

# 📡 API Endpoints

## Dataset Upload

```http
POST /api/dataset/upload
```

## Candidate Ranking

```http
POST /api/rank/uploaded-dataset
```

## Resume Upload

```http
POST /api/resume/upload
```

## Resume Match

```http
POST /api/resume/match
```

## Interview Questions

```http
GET /api/interview/questions
```

---

# 📈 Future Improvements

- PDF Hiring Reports
- Candidate Search & Filters
- Authentication System
- Recruiter Accounts
- LLM-Based Candidate Evaluation
- AI Resume Rewriting
- Advanced Analytics

---

# 👨‍💻 Author

### Ayush Rajput

- IIT Madras BS in Data Science
- Data Analytics & AI Projects
- GitHub: Ayush-eng-ai

---

# 📜 License

This project was developed for educational, portfolio, and hackathon purposes.