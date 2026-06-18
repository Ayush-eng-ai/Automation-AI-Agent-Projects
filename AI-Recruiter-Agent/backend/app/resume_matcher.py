from app.jd_parser import extract_jd_requirements


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

    return {
        "match_score": match_score,
        "matched_skills": matched_skills,
        "missing_skills": missing_skills,
        "recommendation": recommendation,
        "jd_requirements": jd_requirements
    }