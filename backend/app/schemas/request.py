from pydantic import BaseModel, Field


class HealthQuestion(BaseModel):
	question: str = Field(min_length=1)
