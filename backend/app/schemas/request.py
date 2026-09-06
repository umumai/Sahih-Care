from typing import Literal

from pydantic import BaseModel, Field


LanguageCode = Literal["ms", "en", "zh", "ar", "ta"]


class HealthCheckRequest(BaseModel):
    """Body for POST /api/health/check, matching the documented API contract."""

    message: str = Field(min_length=1)
    language: LanguageCode = "ms"


class VerifyRequest(BaseModel):
    """Body for POST /verify (frontend paste-checker)."""

    message: str = Field(min_length=1)
