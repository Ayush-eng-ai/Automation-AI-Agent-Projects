TITLE_BOOST = {
    "search engineer": 25,
    "recommendation systems engineer": 25,
    "ml engineer": 20,
    "applied ml engineer": 20,
    "ai research engineer": 20,
    "data scientist": 16,
    "backend engineer": 12,
    "data engineer": 12,
    "senior software engineer": 10,
    "software engineer": 8,
}

AI_KEYWORDS = [
    "python", "machine learning", "nlp", "llm", "embeddings", "vector",
    "faiss", "pinecone", "qdrant", "milvus", "opensearch",
    "elasticsearch", "recommendation", "ranking", "retrieval", "search",
    "xgboost", "lightgbm", "mlflow", "sentence transformers"
]

CAREER_EVIDENCE_KEYWORDS = [
    "recommendation system", "recommendation systems", "ranking model",
    "ranking models", "ranking layer", "learning-to-rank",
    "retrieval system", "search system", "embedding-based retrieval",
    "information retrieval", "a/b testing", "offline-online",
    "production", "feature pipeline", "relevance labeling"
]

NEGATIVE_KEYWORDS = [
    "hr manager", "accountant", "customer support", "marketing manager",
    "sales executive", "graphic designer", "mechanical engineer",
    "civil engineer", "operations manager", "content writer", "seo"
]


def keyword_score(text, keywords, points_per_match=3, max_score=30):
    score = 0
    matches = []
    text = text.lower()

    for keyword in keywords:
        if keyword.lower() in text:
            score += points_per_match
            matches.append(keyword)

    return min(score, max_score), matches


def extract_candidate_text(candidate):
    profile = candidate.get("profile", {})
    career_history = candidate.get("career_history", [])
    skills = candidate.get("skills", [])

    profile_text = " ".join([
        str(profile.get("headline", "")),
        str(profile.get("summary", "")),
        str(profile.get("current_title", "")),
        str(profile.get("current_industry", "")),
    ])

    career_text = " ".join([
        f"{job.get('title', '')} {job.get('industry', '')} {job.get('description', '')}"
        for job in career_history
    ])

    skills_text = " ".join([
        str(skill.get("name", ""))
        for skill in skills
    ])

    return f"{profile_text} {career_text} {skills_text}".lower()


def title_score(title):
    title = str(title).lower()
    for key, value in TITLE_BOOST.items():
        if key in title:
            return value
    return 0


def experience_score(years):
    if 6 <= years <= 8:
        return 20
    if 5 <= years < 6 or 8 < years <= 9:
        return 16
    if 4 <= years < 5 or 9 < years <= 11:
        return 8
    return 0


def behavior_score(signals):
    score = 0

    if signals.get("open_to_work_flag"):
        score += 5

    score += min(signals.get("recruiter_response_rate", 0) * 5, 5)
    score += min(signals.get("interview_completion_rate", 0) * 5, 5)

    github = signals.get("github_activity_score", -1)
    if github > 0:
        score += min(github / 20, 5)

    notice = signals.get("notice_period_days", 180)
    if notice <= 30:
        score += 5
    elif notice <= 60:
        score += 3
    elif notice <= 90:
        score += 1

    return score


def calculate_score(candidate):
    profile = candidate.get("profile", {})
    signals = candidate.get("redrob_signals", {})
    title = profile.get("current_title", "")
    years = profile.get("years_of_experience", 0)

    text = extract_candidate_text(candidate)

    t_score = title_score(title)
    exp_score = experience_score(years)

    ai_score, ai_matches = keyword_score(text, AI_KEYWORDS, 3, 30)
    career_score, career_matches = keyword_score(text, CAREER_EVIDENCE_KEYWORDS, 8, 45)
    penalty_score, negative_matches = keyword_score(text, NEGATIVE_KEYWORDS, 10, 50)
    beh_score = behavior_score(signals)

    final_score = exp_score + t_score + ai_score + career_score + beh_score - penalty_score
    final_score = max(0, round(final_score, 2))

    return {
        "score": final_score,
        "title_score": t_score,
        "experience_score": exp_score,
        "ai_score": ai_score,
        "career_score": career_score,
        "behavior_score": round(beh_score, 2),
        "penalty_score": penalty_score,
        "ai_matches": ai_matches,
        "career_matches": career_matches,
        "negative_matches": negative_matches,
    }


def calculate_dynamic_score(candidate, jd_requirements):
    base_result = calculate_score(candidate)
    candidate_text = extract_candidate_text(candidate)

    jd_skills = jd_requirements.get("matched_skills", [])
    jd_roles = jd_requirements.get("matched_roles", [])
    exp_range = jd_requirements.get("experience_range", {})

    jd_skill_matches = [
        skill for skill in jd_skills
        if skill.lower() in candidate_text
    ]

    profile = candidate.get("profile", {})
    title = str(profile.get("current_title", "")).lower()
    years = profile.get("years_of_experience", 0)

    jd_role_matches = [
        role for role in jd_roles
        if role.lower() in title
    ]

    jd_skill_score = min(len(jd_skill_matches) * 5, 30)
    jd_role_score = 20 if jd_role_matches else 0

    jd_exp_score = 0
    min_exp = exp_range.get("min")
    max_exp = exp_range.get("max")

    if min_exp is not None and max_exp is not None:
        if min_exp <= years <= max_exp:
            jd_exp_score = 15
        elif min_exp - 1 <= years <= max_exp + 1:
            jd_exp_score = 8

    dynamic_score = round(
        base_result["score"] + jd_skill_score + jd_role_score + jd_exp_score,
        2
    )

    return {
        **base_result,
        "dynamic_score": dynamic_score,
        "jd_skill_score": jd_skill_score,
        "jd_role_score": jd_role_score,
        "jd_experience_score": jd_exp_score,
        "jd_skill_matches": jd_skill_matches,
        "jd_role_matches": jd_role_matches,
    }