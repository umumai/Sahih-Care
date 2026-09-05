from fastapi import APIRouter

from app.schemas.request import HealthQuestion
from app.schemas.response import HealthAnswer
from app.services.gemini_service import ask_gemini


router = APIRouter()


@router.post("/ask")
def ask_health_question(payload: HealthQuestion) -> HealthAnswer:
	return HealthAnswer(answer=ask_gemini(payload.question))
