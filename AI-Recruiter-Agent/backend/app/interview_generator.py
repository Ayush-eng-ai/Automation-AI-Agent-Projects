QUESTION_BANK = {
    "search engineer": [
        "Explain FAISS indexing.",
        "What is vector search?",
        "How does Elasticsearch ranking work?",
        "What is BM25?",
        "What is Retrieval-Augmented Generation?"
    ],

    "data scientist": [
        "Explain overfitting.",
        "What is cross validation?",
        "Difference between precision and recall?",
        "Explain feature engineering.",
        "How does Random Forest work?"
    ],

    "backend engineer": [
        "Explain REST APIs.",
        "Difference between SQL and NoSQL.",
        "What is caching?",
        "Explain database indexing.",
        "What is load balancing?"
    ],

    "ml engineer": [
        "Explain model deployment.",
        "What is feature store?",
        "What is concept drift?",
        "Difference between batch and online inference?",
        "Explain MLOps."
    ]
}


def generate_questions(title):
    title = title.lower()

    for role in QUESTION_BANK:
        if role in title:
            return QUESTION_BANK[role]

    return [
        "Tell me about yourself.",
        "Describe a challenging project.",
        "How do you solve problems?",
        "What are your strengths?",
        "Why should we hire you?"
    ]