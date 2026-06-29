# AI Recruiter Agent — 2–3 Minute Demo Script

Hello everyone, my name is Ayush Rajput. This is my project, **AI Recruiter Agent**, built for the Redrob Intelligent Candidate Discovery and Ranking Challenge.

The problem is that recruiters often need to screen thousands of candidates for one highly specific role. For this challenge, the role is Senior AI Engineer for Redrob AI. The JD is intentionally complex because the best candidate is not simply the person with the most AI keywords. The ideal candidate needs production AI depth, retrieval and ranking experience, strong Python, evaluation knowledge, product-engineering mindset, and good availability signals.

My solution has two parts.

First, I built a reproducible backend ranking pipeline. It reads the 100,000-candidate JSONL file and generates a top-100 submission CSV using one command. The ranker is CPU-only and does not call external LLM APIs during ranking. It scores candidates using role fit, experience fit, retrieval and recommendation evidence, embeddings and vector database evidence, ranking evaluation signals like NDCG, MRR and A/B testing, location and relocation fit, and Redrob behavioral signals such as recruiter response rate, open-to-work status, last active date, interview completion, notice period and GitHub activity. It also down-ranks unrelated roles, weak availability, service-only patterns, and suspicious profile signals.

Second, I converted the hackathon solution into a full-stack AI Recruiter Agent web application. The recruiter can paste a job description, upload candidate data, rank candidates, and view explainable recommendations through a React dashboard. The dashboard shows top candidates, scores, matched skills, confidence, hiring recommendation, strengths, risks, and interview questions.

For submission quality, I also generate reasoning for every top-100 candidate. The reasoning is not generic; it connects each candidate to the JD using specific evidence such as title, years of experience, retrieval or ranking system experience, and behavioral availability signals.

The backend is built with FastAPI and Python. The frontend is built with React, CSS, and Recharts. The project is deployed live on Render, and the full source code is available on GitHub with clear reproduction commands.

In short, this project is more than a keyword matcher. It is an explainable candidate ranking system designed to help recruiters identify a small set of strong, available, and relevant candidates from a large talent pool.
