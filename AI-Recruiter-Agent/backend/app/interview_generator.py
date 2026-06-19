QUESTION_BANK = {
    "recommendation systems engineer": [
        "How would you design an end-to-end recommendation system for millions of users?",
        "Explain collaborative filtering vs content-based filtering.",
        "How do you evaluate recommendation quality using offline and online metrics?",
        "What is learning-to-rank and where would you use it?",
        "How would you handle cold-start users or new items?",
        "How do embeddings improve recommendation systems?",
        "How would you reduce bias in recommendation results?"
    ],

    "search engineer": [
        "Explain FAISS indexing and approximate nearest neighbor search.",
        "What is the difference between BM25 and dense vector search?",
        "How does Elasticsearch scoring and ranking work?",
        "How would you design a hybrid search system using keywords and embeddings?",
        "What is Retrieval-Augmented Generation and how is it connected to search?",
        "How do you evaluate search relevance using NDCG, MRR, or MAP?",
        "How would you handle query latency in a large-scale search system?"
    ],

    "applied ml engineer": [
        "How do you take a machine learning model from experiment to production?",
        "What is model drift and how would you monitor it?",
        "Explain batch inference vs real-time inference.",
        "How do you design an ML evaluation pipeline?",
        "What is feature leakage and how do you prevent it?",
        "How would you improve a low-performing ML model?",
        "How do you handle imbalanced datasets?"
    ],

    "ml engineer": [
        "Explain model deployment in production.",
        "What is a feature store and why is it useful?",
        "What is concept drift?",
        "Difference between batch and online inference?",
        "Explain MLOps lifecycle.",
        "How would you monitor model performance after deployment?",
        "How do you version datasets and models?"
    ],

    "data scientist": [
        "Explain overfitting and underfitting.",
        "What is cross-validation?",
        "Difference between precision, recall, and F1-score.",
        "Explain feature engineering with an example.",
        "How does Random Forest work?",
        "How would you explain model results to non-technical stakeholders?",
        "What statistical tests would you use to compare two groups?"
    ],

    "data engineer": [
        "How would you design an ETL pipeline?",
        "What is the difference between batch and streaming data pipelines?",
        "Explain data partitioning and indexing.",
        "How do you handle schema changes in production pipelines?",
        "What is data quality monitoring?",
        "How would you optimize a slow SQL query?",
        "Explain Airflow or workflow orchestration."
    ],

    "backend engineer": [
        "Explain REST APIs.",
        "Difference between SQL and NoSQL databases.",
        "What is caching and where would you use it?",
        "Explain database indexing.",
        "What is load balancing?",
        "How would you design a scalable backend service?",
        "How do you handle authentication and authorization?"
    ],

    "software engineer": [
        "Explain object-oriented programming concepts.",
        "How do you debug a production issue?",
        "What is clean code?",
        "Explain time complexity with examples.",
        "How do you design a maintainable system?",
        "What is version control and why is it important?",
        "Describe a project where you solved a difficult technical problem."
    ],
}


def generate_questions(title):
    title = str(title).lower()

    for role, questions in QUESTION_BANK.items():
        if role in title:
            return questions

    if "recommendation" in title:
        return QUESTION_BANK["recommendation systems engineer"]

    if "search" in title:
        return QUESTION_BANK["search engineer"]

    if "machine learning" in title or "ml" in title:
        return QUESTION_BANK["ml engineer"]

    if "data" in title:
        return QUESTION_BANK["data scientist"]

    return [
        "Tell me about yourself.",
        "Describe a challenging project you worked on.",
        "How do you approach solving technical problems?",
        "What are your strongest technical skills?",
        "Why are you a good fit for this role?"
    ]