import os
import shutil
import uuid

import pandas as pd
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.schemas import AnalyzeRequest, RankRequest
from app.jd_parser import extract_jd_requirements
from app.ranking_agent import (
    get_candidate_count,
    get_first_candidate,
    rank_top_candidates,
    rank_candidates_for_jd,
)
from app.resume_parser import extract_resume_text
from fastapi import Form
from app.resume_matcher import analyze_resume_match
from app.interview_generator import generate_questions
from fastapi.responses import FileResponse
from app.dataset_parser import load_dataset
from app.scoring_engine import calculate_dynamic_score
from app.explanation_engine import generate_candidate_explanation
from app.hiring_recommendation import generate_hiring_recommendation


app = FastAPI(
    title="AI Recruiter Agent",
    description="AI-powered candidate ranking system",
    version="1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

os.makedirs("outputs", exist_ok=True)
os.makedirs("uploads", exist_ok=True)


@app.get("/")
def home():
    return {
        "message": "AI Recruiter Agent is running successfully"
    }


@app.post("/api/analyze")
def analyze(data: AnalyzeRequest):
    return {
        "message": "AI Recruiter API Working",
        "job_description": data.job_description,
    }


@app.get("/api/candidates/count")
def candidate_count():
    return {
        "total_candidates": get_candidate_count()
    }


@app.get("/api/candidates/first")
def first_candidate():
    return get_first_candidate()


@app.get("/api/candidates/top")
def top_candidates(top_n: int = 10, use_full_data: bool = False):
    return {
        "top_n": top_n,
        "use_full_data": use_full_data,
        "candidates": rank_top_candidates(top_n, use_full_data),
    }


@app.post("/api/jd/parse")
def parse_jd(data: AnalyzeRequest):
    return {
        "job_description": data.job_description,
        "extracted_requirements": extract_jd_requirements(data.job_description),
    }


@app.post("/api/rank")
def rank_for_job(data: RankRequest):
    jd_requirements = extract_jd_requirements(data.job_description)

    top_candidates = rank_candidates_for_jd(
        jd_requirements=jd_requirements,
        top_n=data.top_n,
        use_full_data=data.use_full_data,
    )

    return {
        "job_requirements": jd_requirements,
        "top_n": data.top_n,
        "use_full_data": data.use_full_data,
        "candidates": top_candidates,
    }


@app.post("/api/rank/download")
def download_ranked_candidates(data: RankRequest):
    jd_requirements = extract_jd_requirements(data.job_description)

    ranked_candidates = rank_candidates_for_jd(
        jd_requirements=jd_requirements,
        top_n=data.top_n,
        use_full_data=data.use_full_data,
    )

    filename = f"ranked_candidates_{uuid.uuid4().hex[:8]}.csv"
    filepath = os.path.join("outputs", filename)

    df = pd.DataFrame(ranked_candidates)
    df.to_csv(filepath, index=False)

    return FileResponse(
        path=filepath,
        filename=filename,
        media_type="text/csv"
    )


@app.post("/api/resume/upload")
async def upload_resume(file: UploadFile = File(...)):
    file_path = os.path.join("uploads", file.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    extracted_text = extract_resume_text(file_path)

    return {
        "message": "Resume uploaded and parsed successfully",
        "filename": file.filename,
        "text_length": len(extracted_text),
        "preview": extracted_text[:1000],
    }


@app.post("/api/resume/match")
async def match_resume_with_jd(
    job_description: str = Form(...),
    file: UploadFile = File(...)
):
    file_path = os.path.join("uploads", file.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    resume_text = extract_resume_text(file_path)

    match_result = analyze_resume_match(
        job_description=job_description,
        resume_text=resume_text
    )

    return {
        "message": "Resume matched successfully",
        "filename": file.filename,
        "resume_text_length": len(resume_text),
        "result": match_result
    }

@app.get("/api/interview/questions")
def interview_questions(title: str):

    return {
        "title": title,
        "questions": generate_questions(title)
    }


@app.post("/api/dataset/upload")
async def upload_dataset(file: UploadFile = File(...)):
    file_path = os.path.join("uploads", file.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    dataset = load_dataset(file_path)

    return {
        "message": "Dataset uploaded successfully",
        "filename": file.filename,
        "records_detected": dataset["total_records"],
        "columns": dataset["columns"][:20],
    }


@app.post("/api/rank/uploaded-dataset")
async def rank_uploaded_dataset(
    job_description: str = Form(...),
    top_n: int = Form(10),
    file: UploadFile = File(...)
):
    try:
        file_path = os.path.join("uploads", file.filename)

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        dataset = load_dataset(file_path)
        candidates = dataset["data"]

        jd_requirements = extract_jd_requirements(job_description)

        ranked_results = []

        for candidate in candidates:
            score_result = calculate_dynamic_score(candidate, jd_requirements)

            profile = candidate.get("profile", {})

            candidate_result = {
                "candidate_id": candidate.get("candidate_id") or candidate.get("id"),
                "title": profile.get("current_title") or candidate.get("title"),
                "experience": profile.get("years_of_experience") or candidate.get("experience"),
                "company": profile.get("current_company") or candidate.get("company"),
                "location": profile.get("location") or candidate.get("location"),
                "dynamic_score": score_result["dynamic_score"],
                "jd_skill_matches": score_result["jd_skill_matches"],
                "reason": (
                    f"{profile.get('current_title') or candidate.get('title')} with "
                    f"{profile.get('years_of_experience') or candidate.get('experience')} years experience. "
                    f"Matched JD skills: {', '.join(score_result['jd_skill_matches'][:5])}"
                ),
                "explainability": generate_candidate_explanation(candidate, score_result),
            }

            candidate_result["hiring_recommendation"] = generate_hiring_recommendation(candidate_result)

            ranked_results.append(candidate_result)

        ranked_results.sort(
            key=lambda x: x["dynamic_score"],
            reverse=True
        )

        return {
            "message": "Uploaded dataset ranked successfully",
            "filename": file.filename,
            "total_records": dataset["total_records"],
            "top_n": top_n,
            "candidates": ranked_results[:top_n],
        }

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=str(error)
        )