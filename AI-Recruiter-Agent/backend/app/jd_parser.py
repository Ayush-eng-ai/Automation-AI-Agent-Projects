JD_SKILLS = [
    "python", "machine learning", "ml", "nlp", "llm",
    "embeddings", "vector", "faiss", "pinecone", "qdrant",
    "milvus", "opensearch", "elasticsearch", "recommendation",
    "ranking", "retrieval", "search", "xgboost", "lightgbm",
    "mlflow", "sentence transformers", "rag", "langchain"
]

JD_ROLES = [
    "search engineer",
    "recommendation systems engineer",
    "ml engineer",
    "applied ml engineer",
    "ai research engineer",
    "data scientist",
    "data engineer",
    "backend engineer",
    "software engineer"
]


def extract_jd_requirements(job_description: str):
    text = job_description.lower()

    matched_skills = [
        skill for skill in JD_SKILLS
        if skill in text
    ]

    matched_roles = [
        role for role in JD_ROLES
        if role in text
    ]

    experience_range = extract_experience_range(text)

    return {
        "matched_skills": matched_skills,
        "matched_roles": matched_roles,
        "experience_range": experience_range,
        "raw_text": job_description
    }


def extract_experience_range(text: str):
    # simple v1 logic
    if "5" in text and "8" in text:
        return {"min": 5, "max": 8}

    if "5" in text and "9" in text:
        return {"min": 5, "max": 9}

    if "3" in text and "5" in text:
        return {"min": 3, "max": 5}

    return {"min": None, "max": None}