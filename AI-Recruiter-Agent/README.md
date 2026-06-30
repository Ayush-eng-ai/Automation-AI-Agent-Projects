# 🤖 AI Recruiter Agent

### Enterprise AI-Powered Candidate Discovery & Ranking Platform

<p align="center">
AI Recruiter Agent is an intelligent, full-stack AI platform designed to transform how recruiters discover, evaluate, and rank candidates. Built for the Redrob Hackathon, it goes beyond traditional keyword matching by combining skill analysis, experience alignment, behavioral signals, and explainable AI to deliver accurate, transparent, and high-quality hiring recommendations.
</p>

---

## 🚀 Live Demo

| Resource          | Link                                                                                                                               |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| 🌐 Frontend       | https://ai-recruiter-agent-frontend.onrender.com/                                                                                  |
| ⚙ Backend API     | https://ai-recruiter-backend-7vet.onrender.com/docs                                                                                |
| 💻 GitHub         | https://github.com/Ayush-eng-ai/Automation-AI-Agent-Projects                                                                       |
| 📄 Medium Article | https://medium.com/@ayushrajput8404/how-i-built-an-ai-recruiter-agent-from-hackathon-problem-to-full-stack-ai-product-e8feb9281cf2 |
| 🎯 Portfolio      | https://data-analysis-portfolio-six.vercel.app/                                                                                    |

---

# 📌 Project Overview

AI Recruiter Agent is a production-inspired AI recruitment platform developed for the **Redrob Intelligent Candidate Discovery & Ranking Challenge**.

Instead of relying on keyword matching alone, the platform evaluates candidates using multiple dimensions including:

* Technical skill relevance
* Role similarity
* Experience alignment
* Behavioral hiring signals
* Explainable AI reasoning
* Hiring recommendation
* Recruiter availability indicators

The system is designed to help recruiters efficiently identify high-quality candidates from very large datasets while providing transparent explanations for every ranking decision.

---

# 🎯 Problem Statement

Traditional Applicant Tracking Systems (ATS) primarily rely on keyword matching, which often leads to:

* Missing high-quality candidates with different terminology
* Ranking keyword-stuffed resumes too highly
* Ignoring recruiter engagement and availability signals
* Providing little explanation for candidate rankings

The Redrob Hackathon specifically challenged participants to move beyond keyword matching and reason about what the job description actually means.

---

# 💡 Our Solution

AI Recruiter Agent combines structured profile analysis, recruiter behavioral signals, role understanding, and explainable AI to generate intelligent candidate rankings.

The platform supports:

* Job Description Parsing
* Resume Parsing
* Candidate Dataset Processing
* Dynamic Candidate Ranking
* Explainable AI Recommendations
* Interview Question Generation
* Hiring Recommendation
* Confidence Score
* Submission CSV Generation (Hackathon Ready)

---

# ⭐ Key Features

### AI Candidate Ranking

* Intelligent candidate scoring
* Role-aware matching
* Experience-based ranking
* Skill relevance analysis

### Explainable AI

Every ranked candidate includes:

* Why Selected
* Strengths
* Risks
* Hiring Recommendation
* Confidence Score

### Resume Intelligence

* Resume Parsing
* Resume Analysis
* Skill Extraction
* Resume Match Score

### Recruiter Assistance

* Interview Question Generation
* Hiring Recommendation
* Candidate Comparison
* Top Candidate Selection

### Hackathon Submission Support

* Top-100 Candidate Generator
* CSV Export
* Validator-Compatible Output
* Reproducible Ranking Pipeline

---

# 🏗 System Architecture

```text
Recruiter
    │
    ▼
Upload Job Description
    │
    ▼
JD Parser
    │
    ▼
Upload Candidate Dataset (.jsonl)
    │
    ▼
Feature Extraction
    │
    ├── Skills
    ├── Experience
    ├── Roles
    ├── Career History
    ├── Behavioral Signals
    └── Recruiter Availability
    │
    ▼
AI Ranking Engine
    │
    ├── Role Match
    ├── Skill Match
    ├── Experience Match
    ├── Behavioral Score
    ├── Explainable AI
    └── Risk Detection
    │
    ▼
Top Ranked Candidates
    │
    ▼
React Recruiter Dashboard
```

---

# 🧠 High-Level Workflow

1. Recruiter uploads a Job Description.
2. Recruiter uploads candidate dataset.
3. The backend extracts important hiring requirements.
4. Every candidate profile is analyzed.
5. AI computes a composite ranking score.
6. Candidates are sorted by overall relevance.
7. Recruiters receive explainable hiring recommendations.
8. Top candidates can be exported as a submission-ready CSV.

---

# 🖥 Current Dashboard Features

* Upload Job Description
* Upload Resume
* Upload Candidate Dataset
* Candidate Ranking
* Resume Analysis
* Hiring Recommendation
* Interview Questions
* Explainable AI
* Confidence Score
* Strengths & Risks
* Live API Integration

---

# 📸 Screenshots

> Add screenshots here after capturing your application.

* Recruiter Dashboard
* Candidate Ranking Results
* Candidate Details
* Resume Analysis
* Hiring Recommendation
* Interview Questions

---

**Next sections in README will include:**

* AI Ranking Methodology
* Behavioral Signal Scoring
* Explainable AI Pipeline
* Project Structure
* Installation Guide
* API Documentation
* Submission Generation
* Future Roadmap
* Enterprise Architecture
