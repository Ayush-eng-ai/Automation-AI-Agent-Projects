from pydantic import BaseModel


class AnalyzeRequest(BaseModel):
    job_description: str


class RankRequest(BaseModel):
    job_description: str
    top_n: int = 10
    use_full_data: bool = False