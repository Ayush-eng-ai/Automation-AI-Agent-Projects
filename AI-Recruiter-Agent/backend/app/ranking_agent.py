import json
from pathlib import Path

from app.scoring_engine import calculate_score, calculate_dynamic_score

FULL_DATA_PATH = Path(
    r"D:\OFF Campuse Learning\Data Analysis project\Data_Analysis_projects\Hackathon_Projects\Redrob-Hackathon\data\candidates.jsonl"
)

SAMPLE_DATA_PATH = Path(
    r"D:\OFF Campuse Learning\Data Analysis project\Data_Analysis_projects\Hackathon_Projects\Redrob-Hackathon\data\sample_candidates.json"
)
from app.explanation_engine import generate_candidate_explanation


def load_sample_candidates():
    with open(SAMPLE_DATA_PATH, "r", encoding="utf-8") as file:
        return json.load(file)


def iter_full_candidates():
    with open(FULL_DATA_PATH, "r", encoding="utf-8") as file:
        for line in file:
            if line.strip():
                yield json.loads(line)


def get_candidate_count():
    count = 0
    for _ in iter_full_candidates():
        count += 1
    return count


def get_first_candidate():
    candidate = next(iter_full_candidates(), None)

    if not candidate:
        return None

    profile = candidate.get("profile", {})

    return {
        "candidate_id": candidate.get("candidate_id"),
        "title": profile.get("current_title"),
        "experience": profile.get("years_of_experience"),
        "company": profile.get("current_company"),
    }


def build_reason(candidate, score_result):
    profile = candidate.get("profile", {})
    evidence = score_result["career_matches"][:3] + score_result["ai_matches"][:2]
    evidence_text = ", ".join(evidence) if evidence else "limited direct evidence"

    return (
        f"{profile.get('current_title')} with {profile.get('years_of_experience')} years experience. "
        f"Matched evidence: {evidence_text}. "
        f"Score combines title, experience, AI skills, career evidence, behavior signals and penalties."
    )


def format_candidate_result(candidate, score_result):
    profile = candidate.get("profile", {})

    return {
        "candidate_id": candidate.get("candidate_id"),
        "title": profile.get("current_title"),
        "experience": profile.get("years_of_experience"),
        "company": profile.get("current_company"),
        "location": profile.get("location"),
        "score": score_result["score"],
        "title_score": score_result["title_score"],
        "experience_score": score_result["experience_score"],
        "ai_score": score_result["ai_score"],
        "career_score": score_result["career_score"],
        "behavior_score": score_result["behavior_score"],
        "penalty_score": score_result["penalty_score"],
        "ai_matches": score_result["ai_matches"][:5],
        "career_matches": score_result["career_matches"][:5],
        "negative_matches": score_result["negative_matches"][:5],
        "reason": build_reason(candidate, score_result),
    }


def rank_top_candidates(top_n=10, use_full_data=False):
    results = []
    candidate_source = iter_full_candidates() if use_full_data else load_sample_candidates()

    for candidate in candidate_source:
        score_result = calculate_score(candidate)
        results.append(format_candidate_result(candidate, score_result))

    results.sort(key=lambda x: x["score"], reverse=True)
    return results[:top_n]


def build_dynamic_reason(candidate, score_result):
    profile = candidate.get("profile", {})

    jd_evidence = (
        score_result.get("jd_role_matches", [])[:2]
        + score_result.get("jd_skill_matches", [])[:3]
    )

    jd_text = ", ".join(jd_evidence) if jd_evidence else "limited direct JD match"

    return (
        f"{profile.get('current_title')} with {profile.get('years_of_experience')} years experience. "
        f"JD match evidence: {jd_text}. "
        f"Rank combines JD fit, base candidate quality, AI skills, career evidence and behavior signals."
    )


def rank_candidates_for_jd(jd_requirements, top_n=10, use_full_data=False):
    results = []
    candidate_source = iter_full_candidates() if use_full_data else load_sample_candidates()

    for candidate in candidate_source:
        score_result = calculate_dynamic_score(candidate, jd_requirements)
        profile = candidate.get("profile", {})

        results.append({
            "candidate_id": candidate.get("candidate_id"),
            "title": profile.get("current_title"),
            "experience": profile.get("years_of_experience"),
            "company": profile.get("current_company"),
            "location": profile.get("location"),
            "dynamic_score": score_result["dynamic_score"],
            "base_score": score_result["score"],
            "jd_skill_score": score_result["jd_skill_score"],
            "jd_role_score": score_result["jd_role_score"],
            "jd_experience_score": score_result["jd_experience_score"],
            "jd_skill_matches": score_result["jd_skill_matches"],
            "jd_role_matches": score_result["jd_role_matches"],
            "ai_matches": score_result["ai_matches"][:5],
            "career_matches": score_result["career_matches"][:5],
            "negative_matches": score_result["negative_matches"][:5],
            "reason": build_dynamic_reason(candidate, score_result),
            "explainability": generate_candidate_explanation(candidate, score_result),
        })

    results.sort(key=lambda x: x["dynamic_score"], reverse=True)
    return results[:top_n]