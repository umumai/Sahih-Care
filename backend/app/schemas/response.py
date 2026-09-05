from pydantic import BaseModel


class HealthAnswer(BaseModel):
	answer: str
