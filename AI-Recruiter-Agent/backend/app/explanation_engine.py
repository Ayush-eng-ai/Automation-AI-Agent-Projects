def generate_candidate_explanation(candidate, score_result):
    profile = candidate.get("profile", {})

    explanations = []

    if score_result.get("jd_role_matches"):
        explanations.append(
            f"Role matched with JD: {', '.join(score_result['jd_role_matches'])}"
        )

    if score_result.get("jd_skill_matches"):
        explanations.append(
            f"JD skills matched: {', '.join(score_result['jd_skill_matches'][:5])}"
        )

    if score_result.get("jd_experience_score", 0) > 0:
        explanations.append(
            f"Experience aligns with JD requirement: {profile.get('years_of_experience')} years"
        )

    if score_result.get("career_matches"):
        explanations.append(
            f"Career evidence found: {', '.join(score_result['career_matches'][:4])}"
        )

    if score_result.get("ai_matches"):
        explanations.append(
            f"AI/ML skills found: {', '.join(score_result['ai_matches'][:4])}"
        )

    if score_result.get("negative_matches"):
        explanations.append(
            f"Penalty applied for possible mismatch: {', '.join(score_result['negative_matches'][:3])}"
        )

    if not explanations:
        explanations.append("Limited direct evidence found for this JD.")

    confidence = min(
        round(score_result.get("dynamic_score", score_result.get("score", 0)) / 2, 2),
        100
    )

    return {
        "summary": (
            f"{profile.get('current_title')} with "
            f"{profile.get('years_of_experience')} years experience at "
            f"{profile.get('current_company')}."
        ),
        "why_selected": explanations,
        "confidence": confidence
    }
