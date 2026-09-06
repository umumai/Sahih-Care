from typing import Literal

from pydantic import BaseModel, Field


Verdict = Literal["VERIFIED", "FALSE", "MISLEADING", "UNVERIFIED", "NOT_HEALTH"]


class HealthSource(BaseModel):
    name: str
    url: str = ""


class HealthAnswer(BaseModel):
    verdict: Verdict
    title: str
    summary: str
    details: str = ""
    sources: list[HealthSource] = Field(default_factory=list)
