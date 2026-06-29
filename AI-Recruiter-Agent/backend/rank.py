import argparse
import csv
import gzip
import json
from datetime import datetime, timezone
from pathlib import Path

OUTPUT_COLUMNS = ["candidate_id", "rank", "score", "reasoning"]
REFERENCE_DATE = datetime(2026, 6, 29, tzinfo=timezone.utc)

CORE_SYSTEM_TERMS = {
    "recommendation system": 34, "recommendation systems": 34, "recommender system": 30,
    "ranking model": 30, "ranking models": 30, "learning-to-rank": 32, "learning to rank": 32,
    "search relevance": 30, "retrieval system": 32, "retrieval systems": 32,
    "hybrid retrieval": 34, "hybrid search": 34, "semantic search": 28, "vector search": 28,
    "embedding-based retrieval": 34, "information retrieval": 28,
}

AI_INFRA_TERMS = {
    "embeddings": 18, "embedding": 14, "sentence-transformers": 22, "sentence transformers": 22,
    "openai embeddings": 18, "bge": 14, "e5": 12, "faiss": 20, "qdrant": 20,
    "pinecone": 18, "milvus": 18, "weaviate": 18, "elasticsearch": 18,
    "opensearch": 18, "bm25": 18, "llm": 12, "rag": 12, "fine-tuning": 12,
    "finetuning": 12, "lora": 10, "qlora": 10, "peft": 10, "xgboost": 12,
    "lightgbm": 12, "python": 16,
}

EVALUATION_TERMS = {
    "ndcg": 24, "mrr": 22, "map": 18, "offline evaluation": 22, "online evaluation": 20,
    "a/b testing": 22, "ab testing": 22, "a b testing": 18, "relevance labeling": 18,
    "offline-online": 20, "evaluation framework": 24, "ranking evaluation": 24,
    "recruiter feedback": 14,
}

PRODUCTION_TERMS = {
    "production": 24, "deployed": 18, "deployment": 16, "serving": 14, "inference": 14,
    "monitoring": 12, "model drift": 14, "embedding drift": 18, "index refresh": 18,
    "regression": 10, "scale": 14, "scalable": 12, "latency": 12, "pipeline": 10,
}

PRODUCT_CONTEXT_TERMS = {
    "product company": 16, "marketplace": 18, "hr-tech": 20, "hr tech": 20,
    "recruiting": 16, "talent intelligence": 16, "startup": 12, "saas": 10,
}

STRONG_ROLE_TERMS = {
    "senior ai engineer": 46, "ai engineer": 38, "senior machine learning engineer": 44,
    "machine learning engineer": 38, "ml engineer": 36, "applied ml engineer": 40,
    "search engineer": 42, "ranking engineer": 44, "recommendation systems engineer": 46,
    "recommendation engineer": 42, "data scientist": 26, "ai research engineer": 24,
}

NEGATIVE_TERMS = {
    "marketing manager": 95, "sales executive": 90, "hr manager": 90, "accountant": 75,
    "graphic designer": 70, "content writer": 65, "seo": 45, "customer support": 70,
    "civil engineer": 65, "mechanical engineer": 65, "operations manager": 55,
    "computer vision": 28, "robotics": 28, "speech": 24,
}

PURE_RESEARCH_TERMS = ["research intern", "academic lab", "phd researcher", "research-only", "published papers"]
SERVICE_COMPANIES = ["tcs", "infosys", "wipro", "accenture", "cognizant", "capgemini", "hcl", "tech mahindra"]
TARGET_LOCATIONS = ["noida", "pune", "delhi", "delhi ncr", "gurgaon", "gurugram", "hyderabad", "mumbai", "bangalore", "bengaluru"]


def safe_text(value):
    return "" if value is None else str(value)


def parse_date(value):
    if not value:
        return None
    text = str(value).strip()
    for fmt in ["%Y-%m-%d", "%d-%m-%Y", "%Y/%m/%d", "%d/%m/%Y"]:
        try:
            return datetime.strptime(text[:10], fmt).replace(tzinfo=timezone.utc)
        except ValueError:
            pass
    try:
        return datetime.fromisoformat(text.replace("Z", "+00:00"))
    except Exception:
        return None


def load_candidates(path):
    file_path = Path(path)
    opener = gzip.open if file_path.suffix.lower() == ".gz" else open
    mode = "rt" if file_path.suffix.lower() == ".gz" else "r"
    with opener(file_path, mode, encoding="utf-8") as file:
        for line in file:
            if line.strip():
                yield json.loads(line)


def flatten_candidate_text(candidate):
    profile = candidate.get("profile", {}) or {}
    career_history = candidate.get("career_history", []) or []
    skills = candidate.get("skills", []) or []
    education = candidate.get("education", []) or []
    parts = [
        safe_text(profile.get("headline")), safe_text(profile.get("summary")),
        safe_text(profile.get("current_title")), safe_text(profile.get("current_company")),
        safe_text(profile.get("current_industry")), safe_text(profile.get("location")),
    ]
    for job in career_history:
        if isinstance(job, dict):
            parts.extend([safe_text(job.get("title")), safe_text(job.get("company")), safe_text(job.get("industry")), safe_text(job.get("description"))])
    for skill in skills:
        if isinstance(skill, dict):
            parts.extend([safe_text(skill.get("name")), safe_text(skill.get("proficiency"))])
        else:
            parts.append(safe_text(skill))
    for edu in education:
        if isinstance(edu, dict):
            parts.extend([safe_text(edu.get("degree")), safe_text(edu.get("field")), safe_text(edu.get("institution"))])
    return " ".join(parts).lower()


def get_skill_names(candidate):
    names = []
    for skill in candidate.get("skills", []) or []:
        name = skill.get("name") if isinstance(skill, dict) else skill
        if name:
            names.append(str(name).lower())
    return names


def weighted_keyword_score(text, terms, max_score):
    score = 0
    matches = []
    for term, weight in terms.items():
        if term in text:
            score += weight
            matches.append(term)
    return min(score, max_score), matches


def role_score(title):
    title = safe_text(title).lower()
    for role, points in STRONG_ROLE_TERMS.items():
        if role in title:
            return points, role
    if "engineer" in title and ("ml" in title or "ai" in title or "machine learning" in title):
        return 34, "ai/ml engineer"
    if "software engineer" in title and any(term in title for term in ["search", "ranking", "recommendation"]):
        return 34, "search/ranking software engineer"
    if "software engineer" in title:
        return 14, "software engineer"
    return 0, ""


def experience_score(years):
    try:
        years = float(years or 0)
    except Exception:
        years = 0
    if 6 <= years <= 8:
        return 46
    if 5 <= years < 6 or 8 < years <= 9:
        return 38
    if 4 <= years < 5 or 9 < years <= 11:
        return 18
    if years > 12:
        return 4
    return 0


def behavioral_score(signals):
    if not isinstance(signals, dict):
        return 0, ["missing behavioral signals"]
    score = 0
    notes = []
    if signals.get("open_to_work_flag"):
        score += 16
        notes.append("open to work")
    else:
        score -= 24
        notes.append("not marked open to work")
    response_rate = signals.get("recruiter_response_rate", 0) or 0
    if response_rate >= 0.75:
        score += 18
        notes.append(f"{round(response_rate * 100)}% recruiter response rate")
    elif response_rate >= 0.50:
        score += 10
        notes.append(f"{round(response_rate * 100)}% recruiter response rate")
    elif response_rate < 0.15:
        score -= 55
        notes.append("very low recruiter response rate")
    elif response_rate < 0.35:
        score -= 28
        notes.append("low recruiter response rate")
    interview_rate = signals.get("interview_completion_rate", 0) or 0
    if interview_rate >= 0.80:
        score += 12
        notes.append("strong interview completion")
    elif interview_rate >= 0.50:
        score += 6
    elif interview_rate < 0.20:
        score -= 28
        notes.append("weak interview completion")
    notice = signals.get("notice_period_days", 180)
    if notice <= 30:
        score += 16
        notes.append("short notice period")
    elif notice <= 60:
        score += 8
    elif notice > 120:
        score -= 34
        notes.append("very long notice period")
    elif notice > 90:
        score -= 24
        notes.append("long notice period")
    github = signals.get("github_activity_score", -1)
    if github and github > 70:
        score += 12
        notes.append("strong GitHub activity")
    elif github and github > 35:
        score += 6
    saved = signals.get("saved_by_recruiters_30d", 0) or 0
    if saved >= 8:
        score += 8
        notes.append("frequently saved by recruiters")
    elif saved >= 3:
        score += 4
    search_appearance = signals.get("search_appearance_30d", 0) or 0
    if search_appearance >= 40:
        score += 5
    offer_acceptance = signals.get("offer_acceptance_rate", -1)
    if offer_acceptance != -1 and offer_acceptance is not None:
        if offer_acceptance >= 0.65:
            score += 6
        elif offer_acceptance < 0.25:
            score -= 5
    last_active = parse_date(signals.get("last_active_date"))
    if last_active:
        days_inactive = (REFERENCE_DATE - last_active).days
        if days_inactive <= 30:
            score += 14
            notes.append("recently active")
        elif days_inactive <= 90:
            score += 6
        elif days_inactive > 180:
            score -= 60
            notes.append("inactive for 6+ months")
        elif days_inactive > 120:
            score -= 30
            notes.append("inactive for 4+ months")
    completeness = signals.get("profile_completeness_score", 0) or 0
    if completeness >= 80:
        score += 5
    elif completeness < 35:
        score -= 8
    if signals.get("verified_email"):
        score += 2
    if signals.get("verified_phone"):
        score += 2
    if signals.get("linkedin_connected"):
        score += 4
    return score, notes


def location_score(profile, signals):
    profile_location = safe_text(profile.get("location")).lower()
    work_mode = safe_text(signals.get("preferred_work_mode")).lower()
    if any(loc in profile_location for loc in ["noida", "pune"]):
        return 14, ["preferred Noida/Pune location"]
    if any(loc in profile_location for loc in TARGET_LOCATIONS):
        return 10, ["target India hiring location"]
    if signals.get("willing_to_relocate"):
        return 8, ["willing to relocate"]
    if "hybrid" in work_mode or "flexible" in work_mode:
        return 4, ["hybrid/flexible work preference"]
    return 0, []


def penalty_score(candidate, text):
    score = 0
    concerns = []
    for term, weight in NEGATIVE_TERMS.items():
        if term in text:
            score += weight
            concerns.append(term)
    service_count = sum(1 for company in SERVICE_COMPANIES if company in text)
    product_evidence = any(term in text for term in PRODUCT_CONTEXT_TERMS)
    if service_count >= 2 and not product_evidence:
        score += 28
        concerns.append("consulting/service-heavy background")
    elif service_count == 1 and not product_evidence:
        score += 10
        concerns.append("some service-company signal")
    pure_research_count = sum(1 for term in PURE_RESEARCH_TERMS if term in text)
    has_production = any(term in text for term in PRODUCTION_TERMS)
    if pure_research_count >= 2 and not has_production:
        score += 24
        concerns.append("research-heavy without production signal")
    try:
        years = float(candidate.get("profile", {}).get("years_of_experience", 0) or 0)
    except Exception:
        years = 0
    skills = get_skill_names(candidate)
    if years <= 1 and len(skills) >= 18:
        score += 30
        concerns.append("possible keyword-stuffed low-experience profile")
    if years <= 2 and any(term in text for term in ["principal", "staff engineer", "head of"]):
        score += 30
        concerns.append("possible inconsistent seniority")
    expert_like = sum(1 for skill in skills if "expert" in skill)
    if expert_like >= 8:
        score += 24
        concerns.append("possible over-claimed expertise")
    if "langchain" in text and not has_production and not any(term in text for term in CORE_SYSTEM_TERMS):
        score += 18
        concerns.append("framework-heavy without production retrieval evidence")
    return min(score, 140), concerns[:4]


def score_candidate(candidate):
    profile = candidate.get("profile", {}) or {}
    signals = candidate.get("redrob_signals", {}) or {}
    text = flatten_candidate_text(candidate)
    raw_score = 0
    evidence = []
    concerns = []
    points, role_match = role_score(profile.get("current_title", ""))
    raw_score += points
    if role_match:
        evidence.append(role_match)
    exp_points = experience_score(profile.get("years_of_experience", 0))
    raw_score += exp_points
    if exp_points >= 38:
        evidence.append(f"{profile.get('years_of_experience')} years experience")
    for term_dict, max_score, take in [
        (CORE_SYSTEM_TERMS, 120, 3), (AI_INFRA_TERMS, 95, 3), (EVALUATION_TERMS, 75, 2),
        (PRODUCTION_TERMS, 70, 2), (PRODUCT_CONTEXT_TERMS, 45, 1),
    ]:
        pts, matches = weighted_keyword_score(text, term_dict, max_score)
        raw_score += pts
        evidence.extend(matches[:take])
    behavior_points, behavior_notes = behavioral_score(signals)
    raw_score += behavior_points
    evidence.extend(behavior_notes[:3])
    loc_points, loc_notes = location_score(profile, signals)
    raw_score += loc_points
    evidence.extend(loc_notes)
    penalty, penalty_notes = penalty_score(candidate, text)
    raw_score -= penalty
    concerns.extend(penalty_notes)
    # Keep score differentiated. Do not cap aggressively; capped scores created many 0.999 ties.
    # Validator only needs non-increasing floats, and ranking quality improves when strong candidates separate clearly.
    final_score = max(0.0, round(raw_score / 1000, 6))
    return final_score, evidence, concerns


def unique_items(items, limit):
    output = []
    seen = set()
    for item in items:
        item = str(item).strip()
        if item and item not in seen:
            seen.add(item)
            output.append(item)
        if len(output) >= limit:
            break
    return output


def build_reasoning(candidate, score, evidence, concerns):
    profile = candidate.get("profile", {}) or {}
    signals = candidate.get("redrob_signals", {}) or {}
    title = safe_text(profile.get("current_title")) or "Candidate"
    years = safe_text(profile.get("years_of_experience")) or "unknown"
    location = safe_text(profile.get("location")) or "location not specified"
    evidence_text = ", ".join(unique_items(evidence, 6)) or "limited direct evidence"
    concern_items = unique_items(concerns, 2)
    concern_text = f" Concern: {', '.join(concern_items)}." if concern_items else ""
    reason = (
        f"{title} with {years} years experience in {location}; strongest evidence includes {evidence_text}. "
        f"This connects to the JD's need for production AI systems, retrieval/ranking depth, and shipper-style product engineering."
        f"{concern_text} Behavioral signals considered: open_to_work={signals.get('open_to_work_flag')}, "
        f"response_rate={signals.get('recruiter_response_rate')}, notice_period={signals.get('notice_period_days')} days, "
        f"last_active={signals.get('last_active_date')}."
    )
    return reason[:900]


def create_submission(candidates_path, output_path):
    ranked = []
    for candidate in load_candidates(candidates_path):
        candidate_id = candidate.get("candidate_id")
        if not candidate_id:
            continue
        score, evidence, concerns = score_candidate(candidate)
        ranked.append({
            "candidate_id": candidate_id,
            "score": score,
            "reasoning": build_reasoning(candidate, score, evidence, concerns),
        })
    ranked.sort(key=lambda row: (-row["score"], row["candidate_id"]))
    top_100 = ranked[:100]
    output_file = Path(output_path)
    output_file.parent.mkdir(parents=True, exist_ok=True)
    with open(output_file, "w", encoding="utf-8", newline="") as file:
        writer = csv.DictWriter(file, fieldnames=OUTPUT_COLUMNS)
        writer.writeheader()
        for index, row in enumerate(top_100, start=1):
            writer.writerow({"candidate_id": row["candidate_id"], "rank": index, "score": row["score"], "reasoning": row["reasoning"]})
    print(f"Submission CSV created: {output_file}")
    print(f"Rows written: {len(top_100)}")
    print("Run validator: python validate_submission.py outputs/submission.csv")


def main():
    parser = argparse.ArgumentParser(description="Generate Redrob Hackathon top-100 candidate submission CSV.")
    parser.add_argument("--candidates", required=True, help="Path to candidates.jsonl or candidates.jsonl.gz")
    parser.add_argument("--out", default="outputs/submission.csv", help="Output CSV path")
    args = parser.parse_args()
    create_submission(args.candidates, args.out)


if __name__ == "__main__":
    main()
