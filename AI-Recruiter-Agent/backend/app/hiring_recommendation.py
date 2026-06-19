def generate_hiring_recommendation(candidate):
    score = candidate.get("dynamic_score", 0)
    matched_skills = candidate.get("jd_skill_matches", [])
    experience = candidate.get("experience", 0) or 0

    strengths = []
    risks = []

    if len(matched_skills) >= 5:
        strengths.append(f"Strong JD skill match: {len(matched_skills)} skills matched")

    if experience >= 5:
        strengths.append(f"Relevant experience: {experience} years")

    if score >= 190:
        recommendation = "Strongly Recommended"
    elif score >= 160:
        recommendation = "Recommended"
    elif score >= 130:
        recommendation = "Consider"
    else:
        recommendation = "Not Recommended"

    if len(matched_skills) < 3:
        risks.append("Limited JD skill overlap")

    if experience < 3:
        risks.append("Experience may be below senior role expectation")

    confidence = round(min(score / 2, 99), 2)

    return {
        "recommendation": recommendation,
        "confidence": confidence,
        "strengths": strengths,
        "risks": risks,
        "decision": f"Candidate is {recommendation.lower()} for the next hiring stage."
    }