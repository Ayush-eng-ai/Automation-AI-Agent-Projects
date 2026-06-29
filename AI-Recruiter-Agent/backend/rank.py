import argparse
import csv
import gzip
import json
import math
import re
from datetime import datetime
from pathlib import Path


OUTPUT_COLUMNS = ["candidate_id", "rank", "score", "reasoning"]


POSITIVE_TERMS = {
    "retrieval": 18,
    "ranking": 18,
    "search": 16,
    "recommendation": 16,
    "recommendation system": 22,
    "recommender": 14,
    "embeddings": 16,
    "embedding": 14,
    "vector search": 18,
    "semantic search": 18,
    "hybrid search": 20,
    "faiss": 16,
    "qdrant": 16,
    "pinecone": 14,
    "milvus": 14,
    "weaviate": 14,
    "elasticsearch": 12,
    "opensearch": 12,
    "bm25": 12,
    "llm": 10,
    "rag": 10,
    "fine-tuning": 10,
    "xgboost": 8,
    "lightgbm": 8,
    "python": 10,
    "ndcg": 14,
    "mrr": 14,
    "map": 10,
    "a/b testing": 12,
    "ab testing": 12,
    "production": 14,
    "deployed": 12,
    "scale": 10,
    "marketplace": 8,
    "hr-tech": 10,
    "recruiting": 8,
}


STRONG_ROLE_TERMS = [
    "senior ai engineer",
    "ai engineer",
    "machine learning engineer",
    "ml engineer",
    "applied ml engineer",
    "search engineer",
    "ranking engineer",
    "recommendation systems engineer",
    "data scientist",
]


NEGATIVE_TERMS = {
    "marketing manager": 35,
    "sales executive": 35,
    "hr manager": 35,
    "accountant": 30,
    "graphic designer": 30,
    "content writer": 25,
    "seo": 20,
    "customer support": 25,
    "civil engineer": 25,
    "mechanical engineer": 25,
    "computer vision": 10,
    "robotics": 10,
    "speech": 8,
}


SERVICE_COMPANIES = [
    "tcs",
    "infosys",
    "wipro",
    "accenture",
    "cognizant",
    "capgemini",
    "hcl",
    "tech mahindra",
]


TARGET_LOCATIONS = [
    "noida",
    "pune",
    "delhi",
    "delhi ncr",
    "gurgaon",
    "gurugram",
    "hyderabad",
    "mumbai",
    "bangalore",
    "bengaluru",
]


def load_candidates(path: str):
    file_path = Path(path)

    if file_path.suffix == ".gz":
        opener = gzip.open
        mode = "rt"
    else:
        opener = open
        mode = "r"

    with opener(file_path, mode, encoding="utf-8") as file:
        for line in file:
            if line.strip():
                yield json.loads(line)


def safe_text(value):
    if value is None:
        return ""
    return str(value)


def flatten_candidate_text(candidate):
    profile = candidate.get("profile", {})
    career_history = candidate.get("career_history", [])
    skills = candidate.get("skills", [])
    education = candidate.get("education", [])

    parts = [
        safe_text(profile.get("headline")),
        safe_text(profile.get("summary")),
        safe_text(profile.get("current_title")),
        safe_text(profile.get("current_company")),
        safe_text(profile.get("current_industry")),
        safe_text(profile.get("location")),
    ]

    for job in career_history:
        parts.extend([
            safe_text(job.get("title")),
            safe_text(job.get("company")),
            safe_text(job.get("industry")),
            safe_text(job.get("description")),
        ])

    for skill in skills:
        if isinstance(skill, dict):
            parts.append(safe_text(skill.get("name")))
        else:
            parts.append(safe_text(skill))

    for edu in education:
        if isinstance(edu, dict):
            parts.extend([
                safe_text(edu.get("degree")),
                safe_text(edu.get("field")),
                safe_text(edu.get("institution")),
            ])

    return " ".join(parts).lower()


def get_skill_names(candidate):
    skills = candidate.get("skills", [])
    names = []

    for skill in skills:
        if isinstance(skill, dict):
            name = skill.get("name")
        else:
            name = skill
        if name:
            names.append(str(name).lower())

    return names


def keyword_score(text):
    score = 0
    matched = []

    for term, weight in POSITIVE_TERMS.items():
        if term in text:
            score += weight
            matched.append(term)

    return score, matched


def negative_score(text):
    score = 0
    matched = []

    for term, weight in NEGATIVE_TERMS.items():
        if term in text:
            score += weight
            matched.append(term)

    return score, matched


def role_score(title):
    title = safe_text(title).lower()

    for role in STRONG_ROLE_TERMS:
        if role in title:
            return 35, role

    if "engineer" in title and ("ml" in title or "ai" in title or "machine learning" in title):
        return 28, "ai/ml engineer"

    if "data scientist" in title:
        return 22, "data scientist"

    if "software engineer" in title:
        return 12, "software engineer"

    return 0, ""


def experience_score(years):
    try:
        years = float(years or 0)
    except Exception:
        years = 0

    if 6 <= years <= 8:
        return 35
    if 5 <= years < 6 or 8 < years <= 9:
        return 28
    if 4 <= years < 5 or 9 < years <= 11:
        return 12
    if years > 12:
        return 4
    return 0


def behavioral_score(signals):
    if not isinstance(signals, dict):
        return 0, []

    score = 0
    notes = []

    if signals.get("open_to_work_flag"):
        score += 8
        notes.append("open to work")

    response_rate = signals.get("recruiter_response_rate", 0) or 0
    if response_rate >= 0.7:
        score += 12
        notes.append(f"{round(response_rate * 100)}% recruiter response rate")
    elif response_rate >= 0.4:
        score += 6

    interview_rate = signals.get("interview_completion_rate", 0) or 0
    if interview_rate >= 0.75:
        score += 8
        notes.append("strong interview completion")
    elif interview_rate >= 0.45:
        score += 4

    notice = signals.get("notice_period_days", 180)
    if notice <= 30:
        score += 10
        notes.append("short notice period")
    elif notice <= 60:
        score += 5
    elif notice > 90:
        score -= 8
        notes.append("long notice period")

    github = signals.get("github_activity_score", -1)
    if github and github > 60:
        score += 8
        notes.append("strong GitHub activity")
    elif github and github > 25:
        score += 4

    if signals.get("verified_email"):
        score += 2
    if signals.get("verified_phone"):
        score += 2
    if signals.get("linkedin_connected"):
        score += 3

    saved = signals.get("saved_by_recruiters_30d", 0) or 0
    if saved >= 5:
        score += 5
        notes.append("saved by recruiters")

    return score, notes


def location_score(profile, signals):
    text = (
        safe_text(profile.get("location")) + " " +
        safe_text(signals.get("preferred_work_mode")) + " " +
        safe_text(signals.get("willing_to_relocate"))
    ).lower()

    if any(loc in text for loc in TARGET_LOCATIONS):
        return 8

    if signals.get("willing_to_relocate"):
        return 6

    return 0


def service_company_penalty(text):
    count = sum(1 for company in SERVICE_COMPANIES if company in text)
    if count >= 2:
        return 18
    if count == 1:
        return 8
    return 0


def possible_honeypot_penalty(candidate, text):
    penalty = 0

    profile = candidate.get("profile", {})
    years = profile.get("years_of_experience", 0) or 0
    skills = get_skill_names(candidate)

    if years <= 1 and len(skills) >= 18:
        penalty += 25

    if years <= 2 and ("principal" in text or "staff engineer" in text or "head of" in text):
        penalty += 25

    expert_like = len([s for s in skills if "expert" in s])
    if expert_like >= 8:
        penalty += 20

    return penalty


def score_candidate(candidate):
    profile = candidate.get("profile", {})
    signals = candidate.get("redrob_signals", {})
    text = flatten_candidate_text(candidate)

    title = profile.get("current_title", "")
    years = profile.get("years_of_experience", 0)

    score = 0
    evidence = []
    concerns = []

    r_score, role_match = role_score(title)
    score += r_score
    if role_match:
        evidence.append(role_match)

    exp_score = experience_score(years)
    score += exp_score
    if exp_score >= 28:
        evidence.append(f"{years} years experience")

    k_score, matched_terms = keyword_score(text)
    score += min(k_score, 130)
    evidence.extend(matched_terms[:5])

    b_score, behavior_notes = behavioral_score(signals)
    score += b_score
    evidence.extend(behavior_notes[:3])

    score += location_score(profile, signals)

    n_score, negative_terms = negative_score(text)
    score -= n_score
    if negative_terms:
        concerns.extend(negative_terms[:2])

    service_penalty = service_company_penalty(text)
    score -= service_penalty
    if service_penalty:
        concerns.append("service-company-heavy background")

    honeypot_penalty = possible_honeypot_penalty(candidate, text)
    score -= honeypot_penalty
    if honeypot_penalty:
        concerns.append("possible inconsistent profile signals")

    score = max(0, round(score / 250, 6))

    return score, evidence, concerns


def build_reasoning(candidate, score, evidence, concerns):
    profile = candidate.get("profile", {})
    signals = candidate.get("redrob_signals", {})

    title = safe_text(profile.get("current_title")) or "Candidate"
    years = safe_text(profile.get("years_of_experience")) or "unknown"
    location = safe_text(profile.get("location")) or "location not specified"

    evidence_text = ", ".join(dict.fromkeys(evidence[:5])) or "limited direct JD evidence"

    reason = (
        f"{title} with {years} years experience in {location}; evidence includes {evidence_text}, "
        f"which aligns with the JD's AI retrieval/ranking and product-engineering focus."
    )

    if concerns:
        reason += f" Concern: {', '.join(dict.fromkeys(concerns[:2]))}."

    response_rate = signals.get("recruiter_response_rate")
    notice = signals.get("notice_period_days")

    if response_rate is not None or notice is not None:
        reason += (
            f" Behavioral fit considered with response rate {response_rate} "
            f"and notice period {notice} days."
        )

    return reason[:900]


def create_submission(candidates_path, output_path):
    ranked = []

    for candidate in load_candidates(candidates_path):
        candidate_id = candidate.get("candidate_id")

        if not candidate_id:
            continue

        score, evidence, concerns = score_candidate(candidate)
        reasoning = build_reasoning(candidate, score, evidence, concerns)

        ranked.append({
            "candidate_id": candidate_id,
            "score": score,
            "reasoning": reasoning,
        })

    ranked.sort(key=lambda row: (-row["score"], row["candidate_id"]))
    top_100 = ranked[:100]

    output_file = Path(output_path)
    output_file.parent.mkdir(parents=True, exist_ok=True)

    with open(output_file, "w", encoding="utf-8", newline="") as file:
        writer = csv.DictWriter(file, fieldnames=OUTPUT_COLUMNS)
        writer.writeheader()

        for index, row in enumerate(top_100, start=1):
            writer.writerow({
                "candidate_id": row["candidate_id"],
                "rank": index,
                "score": row["score"],
                "reasoning": row["reasoning"],
            })

    print(f"Submission CSV created: {output_file}")
    print(f"Rows written: {len(top_100)}")


def main():
    parser = argparse.ArgumentParser(
        description="Generate Redrob Hackathon top-100 candidate submission CSV."
    )

    parser.add_argument(
        "--candidates",
        required=True,
        help="Path to candidates.jsonl or candidates.jsonl.gz"
    )

    parser.add_argument(
        "--out",
        default="outputs/submission.csv",
        help="Output CSV path"
    )

    args = parser.parse_args()
    create_submission(args.candidates, args.out)


if __name__ == "__main__":
    main()