# AI Recruiter Agent

An AI-powered recruitment platform that helps recruiters discover, rank, evaluate, and shortlist the best candidates from large candidate datasets.

The system combines Candidate Ranking, Explainable AI, Resume Matching, Interview Question Generation, and Hiring Recommendations into a single recruiter-friendly web application.

---

## Live Demo

### Frontend

Add your frontend URL here

### Backend API

Add your backend URL here

### API Documentation

Add your backend `/docs` URL here

---

## Problem Statement

Recruiters often need to manually screen hundreds or thousands of candidate profiles to find suitable candidates for a job role.

This project automates the process by:

* Understanding Job Descriptions
* Ranking candidates using AI-based scoring
* Explaining why candidates were selected
* Matching resumes against job requirements
* Generating interview questions
* Providing hiring recommendations

---

## Features

### Candidate Dataset Upload

Upload candidate datasets in:

* CSV
* JSON
* JSONL

Supports large candidate datasets for recruiter workflows.

---

### AI Candidate Ranking

Ranks candidates based on:

* Skills Match
* Role Match
* Experience Match
* AI/ML Skills
* Career Evidence
* Candidate Quality Signals

Returns the most relevant candidates for a given job description.

---

### Explainable AI Ranking

Instead of showing only a score, the system explains:

* Why the candidate was selected
* Skills matched
* Role matched
* Experience matched
* Confidence score

---

### Resume Match Analyzer

Upload a candidate resume and compare it against a Job Description.

Outputs:

* Match Score
* Matched Skills
* Missing Skills
* Recommendation

---

### Resume Improvement Feedback

Provides actionable feedback:

* Why the score is low
* Missing skills
* Resume improvement suggestions
* Recommended projects

---

### AI Interview Question Generator

Generates role-specific interview questions for:

* Search Engineers
* ML Engineers
* Data Scientists
* Backend Engineers
* Recommendation Systems Engineers

---

### AI Hiring Recommendation Engine

Provides recruiter-friendly recommendations:

* Strongly Recommended
* Recommended
* Consider
* Not Recommended

Includes:

* Strengths
* Risks
* Confidence Score
* Hiring Decision Summary

---

### Recruiter Analytics Dashboard

Shows:

* Total Records Processed
* Candidates Returned
* Average Score
* Top Score
* Confidence Metrics

---

## Tech Stack

### Frontend

* React.js
* JavaScript
* CSS

### Backend

* FastAPI
* Python

### Data Processing

* Pandas
* NumPy

### Resume Parsing

* pdfplumber
* python-docx

### Deployment

* Render
* GitHub

---

## Project Architecture

Job Description
↓
JD Parser
↓
Candidate Ranking Engine
↓
Explainable AI
↓
Hiring Recommendation Engine
↓
Interview Question Generator

Resume Upload
↓
Resume Parser
↓
Resume Match Analyzer
↓
Improvement Suggestions

---

## API Endpoints

### Candidate Ranking

POST /api/rank/uploaded-dataset

### Resume Upload

POST /api/resume/upload

### Resume Match

POST /api/resume/match

### Interview Questions

GET /api/interview/questions

### Dataset Upload

POST /api/dataset/upload

---

## Screenshots

Add screenshots here:

* Home Page
* Candidate Ranking
* Explainability
* Resume Match
* Hiring Recommendation
* Analytics Dashboard

---

## Future Improvements

* PDF Hiring Reports
* Advanced Candidate Search
* Authentication & User Accounts
* LLM-Based Candidate Evaluation
* AI Resume Rewriting Suggestions
* Recruiter Team Collaboration

---

## Author

Ayush Rajput

* IIT Madras BS in Data Science
* Data Analytics & AI Projects
* GitHub: Ayush-eng-ai

---

## License

This project is created for educational, portfolio, and hackathon purposes.
