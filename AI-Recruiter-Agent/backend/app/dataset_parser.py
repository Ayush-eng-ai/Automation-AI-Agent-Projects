import json
import pandas as pd


def load_dataset(file_path):
    file_path_lower = file_path.lower()

    if file_path_lower.endswith(".csv"):
        df = pd.read_csv(file_path)
        records = df.to_dict(orient="records")

    elif file_path_lower.endswith(".json"):
        with open(file_path, "r", encoding="utf-8") as file:
            data = json.load(file)

        if isinstance(data, dict):
            records = data.get("candidates", [])
            if not records:
                records = data.get("data", [])
            if not records:
                records = [data]
        else:
            records = data

    elif file_path_lower.endswith(".jsonl"):
        records = []

        with open(file_path, "r", encoding="utf-8") as file:
            for line in file:
                if line.strip():
                    records.append(json.loads(line))

    else:
        raise ValueError("Supported formats: CSV, JSON, JSONL")

    return {
        "total_records": len(records),
        "columns": list(records[0].keys()) if records else [],
        "data": records,
    }

