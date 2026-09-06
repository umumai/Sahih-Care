from fastapi import APIRouter

from app.config import get_gemini_api_key
from app.schemas.request import HealthQuestion
from app.schemas.response import HealthAnswer
from app.services.gemini_service import ask_gemini


router = APIRouter()


@router.get("/health")
def healthcheck() -> dict:
    return {"ok": True, "gemini": bool(get_gemini_api_key())}


@router.post("/ask")
def ask_health_question(payload: HealthQuestion) -> HealthAnswer:
    return ask_gemini(payload.question, payload.language)
    return ask_gemini(payload.question, payload.language)
