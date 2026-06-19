from app.jd_parser import extract_jd_requirements


def build_improvement_feedback(match_score, matched_skills, missing_skills, resume_text):
    resume_lower = resume_text.lower()

    why_score_low = []
    improvement_suggestions = []
    project_suggestions = []

    if missing_skills:
        why_score_low.append(
            "Resume me JD ke important skills missing hain: "
            + ", ".join(missing_skills[:8])
        )

    if len(matched_skills) < 3:
        why_score_low.append(
            "Resume me job description se direct skill match kam mila."
        )

    if "project" not in resume_lower and "projects" not in resume_lower:
        why_score_low.append(
            "Resume me relevant project evidence clearly visible nahi hai."
        )
        improvement_suggestions.append(
            "Resume me 2-3 relevant projects add karo jo JD ke skills se match karte hon."
        )

    if "impact" not in resume_lower and "%" not in resume_lower:
        improvement_suggestions.append(
            "Project descriptions me measurable impact add karo, jaise accuracy, time saved, users, ranking improvement, ya automation benefit."
        )

    if missing_skills:
        improvement_suggestions.append(
            "Missing skills ko honestly learn karke Skills section aur Projects section me add karo."
        )

    improvement_suggestions.append(
        "Resume summary ko target JD ke according rewrite karo."
    )

    improvement_suggestions.append(
        "JD ke keywords ko fake nahi, real project evidence ke saath include karo."
    )

    if any(skill in missing_skills for skill in ["faiss", "qdrant", "pinecone", "milvus", "elasticsearch", "opensearch"]):
        project_suggestions.append(
            "Build a Vector Search or Resume Search project using FAISS/Qdrant/Elasticsearch."
        )

    if any(skill in missing_skills for skill in ["ranking", "retrieval", "search", "recommendation"]):
        project_suggestions.append(
            "Build a Candidate Ranking or Recommendation System project with explainable scoring."
        )

    if any(skill in missing_skills for skill in ["llm", "rag", "langchain", "embeddings"]):
        project_suggestions.append(
            "Build a RAG chatbot project using embeddings, vector database, and LLM-based answering."
        )

    if not project_suggestions:
        project_suggestions.append(
            "Build one job-specific portfolio project and mention tools, workflow, result, and impact."
        )

    if match_score >= 75:
        why_score_low = [
            "Resume has strong alignment with the JD. Only small improvements may be needed."
        ]
        improvement_suggestions = [
            "Add stronger measurable impact and highlight most relevant projects at the top."
        ]

    return {
        "why_score_low": why_score_low,
        "improvement_suggestions": improvement_suggestions,
        "project_suggestions": project_suggestions,
    }


def analyze_resume_match(job_description, resume_text):
    jd_requirements = extract_jd_requirements(job_description)

    jd_skills = jd_requirements.get("matched_skills", [])
    resume_text_lower = resume_text.lower()

    matched_skills = [
        skill for skill in jd_skills
        if skill.lower() in resume_text_lower
    ]

    missing_skills = [
        skill for skill in jd_skills
        if skill.lower() not in resume_text_lower
    ]

    if len(jd_skills) == 0:
        match_score = 0
    else:
        match_score = round((len(matched_skills) / len(jd_skills)) * 100, 2)

    if match_score >= 75:
        recommendation = "Strong Match"
    elif match_score >= 50:
        recommendation = "Moderate Match"
    else:
        recommendation = "Weak Match"

    feedback = build_improvement_feedback(
        match_score=match_score,
        matched_skills=matched_skills,
        missing_skills=missing_skills,
        resume_text=resume_text,
    )

    return {
        "match_score": match_score,
        "matched_skills": matched_skills,
        "missing_skills": missing_skills,
        "recommendation": recommendation,
        "why_score_low": feedback["why_score_low"],
        "improvement_suggestions": feedback["improvement_suggestions"],
        "project_suggestions": feedback["project_suggestions"],
        "jd_requirements": jd_requirements,
    }