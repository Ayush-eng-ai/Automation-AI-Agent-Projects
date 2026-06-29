# Prototype Brief — AI Recruiter Agent

**Project Name:** AI Recruiter Agent  
**Track:** Code the AI  
**Built by:** Ayush Rajput

AI Recruiter Agent is a full-stack AI-powered recruitment platform built for the Redrob Intelligent Candidate Discovery and Ranking Challenge. The system helps recruiters evaluate a large candidate pool against a complex job description and identify the best-fit candidates using explainable ranking logic.

For the Redrob Senior AI Engineer JD, the ranker focuses on the real intent of the role: production AI/ML experience, embeddings-based retrieval, hybrid search, recommendation/ranking systems, vector database experience, Python quality, evaluation frameworks, product-engineering mindset, and candidate availability.

The backend ranking pipeline reads `candidates.jsonl` or `candidates.jsonl.gz`, scores all candidates, and generates a validated top-100 CSV using the required format:

```csv
candidate_id,rank,score,reasoning
```

The scoring system combines:

- Role and title alignment
- 5–9 years experience fit
- Retrieval, ranking, search, and recommendation evidence
- Embeddings and vector database evidence
- Evaluation framework evidence such as NDCG, MRR, MAP, and A/B testing
- Production ML and product-company signals
- Redrob behavioral signals including recruiter response rate, last active date, open-to-work status, notice period, interview completion, GitHub activity, and recruiter saves
- Penalties for unrelated profiles, weak availability, service-only patterns, and possible honeypot-like inconsistencies

The project also includes a deployed React-based recruiter dashboard where users can upload a JD and candidate dataset, rank candidates, view candidate cards, inspect recommendations, and understand why a candidate was selected.

**Tech Stack:** FastAPI, Python, Pandas, JSONL processing, React.js, JavaScript, CSS, Recharts, REST API, Render, GitHub.

**Reproduction Command:**

```bash
cd AI-Recruiter-Agent/backend
python rank.py --candidates candidates.jsonl --out outputs/submission.csv
python validate_submission.py outputs/submission.csv
```

**Live Links:**

- Frontend: https://ai-recruiter-agent-frontend.onrender.com/
- Backend API Docs: https://ai-recruiter-backend-7vet.onrender.com/docs
- GitHub: https://github.com/Ayush-eng-ai/Automation-AI-Agent-Projects
- Portfolio: https://data-analysis-portfolio-six.vercel.app/
