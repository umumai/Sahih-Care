from typing import Literal

from pydantic import BaseModel, Field


LanguageCode = Literal["ms", "en", "zh", "ar", "ta"]


class HealthQuestion(BaseModel):
    question: str = Field(min_length=1)
    language: LanguageCode = "ms"
