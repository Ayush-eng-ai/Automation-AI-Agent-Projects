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


---

# 🧠 AI Ranking Methodology

Unlike traditional Applicant Tracking Systems (ATS), AI Recruiter Agent does not rank candidates based solely on keyword frequency. Instead, it evaluates each profile across multiple dimensions to identify candidates who genuinely match the intent of a job description.

The ranking engine combines structured profile analysis, recruiter behavioral signals, experience relevance, and explainable AI to generate a composite score for every candidate.

## Candidate Scoring Pipeline

Each candidate is evaluated using the following stages:

1. Job Description Parsing
2. Candidate Profile Parsing
3. Feature Extraction
4. Skill Matching
5. Experience Analysis
6. Role Similarity Analysis
7. Behavioral Signal Analysis
8. Explainable AI Reasoning
9. Final Composite Score
10. Candidate Ranking

---

# 📊 Candidate Scoring Formula

The overall candidate score is calculated using a weighted scoring approach.

```text
Final Score =

Role Match
+ Skill Match
+ Experience Match
+ AI / ML Domain Relevance
+ Retrieval & Ranking Experience
+ Production Engineering Experience
+ Behavioral Signals
+ Recruiter Availability
+ Location Preference

− Negative Role Penalty
− Service-Only Background Penalty
− Inconsistent Profile Penalty
− Potential Honeypot Risk
```

This multi-factor approach helps prioritize candidates who demonstrate practical experience relevant to the role rather than relying only on keyword overlap.

---

# 🎯 Core Ranking Signals

The ranking engine evaluates several categories of evidence, including:

### Technical Skills

* Python
* Machine Learning
* Deep Learning
* Large Language Models (LLMs)
* Retrieval-Augmented Generation (RAG)
* Embeddings
* Vector Databases
* Semantic Search
* Recommendation Systems
* Hybrid Search
* Ranking Systems

### Professional Experience

* Relevant years of experience
* Product engineering background
* Production deployment experience
* AI system ownership
* Search and recommendation projects
* End-to-end ML delivery

### Behavioral Signals

Recruiter-oriented behavioral indicators are incorporated to improve practical hiring outcomes, including:

* Recruiter response rate
* Open-to-work status
* Notice period
* Recent platform activity
* Recruiter engagement indicators
* Hiring availability

These signals help surface candidates who are not only technically relevant but are also more likely to be available and responsive during recruitment.

---

# 🔍 Explainable AI

Every ranking decision is accompanied by a human-readable explanation.

For each candidate, the platform generates:

* Why the candidate ranked highly
* Matching technical strengths
* Relevant experience highlights
* Potential concerns or risks
* Hiring recommendation
* Confidence score

This enables recruiters to understand the reasoning behind every recommendation instead of relying on opaque scoring.

---

# ⚠️ Robust Ranking Strategy

The ranking engine is designed to reduce common recruitment pitfalls by:

* Avoiding simple keyword-count ranking
* Penalizing unrelated job profiles
* Reducing the impact of keyword stuffing
* Considering behavioral hiring signals
* Using role-aware matching
* Producing transparent explanations for every score

This aligns with the objective of building a practical AI-assisted recruitment workflow rather than a traditional keyword-based ATS.

---

# 📈 Explainable Recruitment Workflow

```text
Job Description
        │
        ▼
Requirement Extraction
        │
        ▼
Candidate Profile Parsing
        │
        ▼
Feature Engineering
        │
        ▼
Composite Candidate Scoring
        │
        ▼
Explainable AI Analysis
        │
        ▼
Hiring Recommendation
        │
        ▼
Recruiter Dashboard
```

---

# 🎯 Design Principles

The platform has been designed around four key principles:

* **Accuracy** — Rank candidates based on meaningful evidence rather than isolated keywords.
* **Transparency** — Provide clear explanations for every recommendation.
* **Scalability** — Process large candidate datasets efficiently.
* **Recruiter Experience** — Deliver insights in an intuitive dashboard suitable for real-world hiring workflows.
