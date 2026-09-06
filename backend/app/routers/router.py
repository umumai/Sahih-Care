from fastapi import APIRouter

from app.config import get_gemini_api_key
from app.schemas.request import HealthQuestion, VerifyRequest
from app.schemas.response import HealthAnswer, VerifyResponse
from app.services.gemini_service import ask_gemini


router = APIRouter()


@router.get("/health")
def healthcheck() -> dict:
    return {"ok": True, "gemini": bool(get_gemini_api_key())}


@router.post("/ask")
def ask_health_question(payload: HealthQuestion) -> HealthAnswer:
    return ask_gemini(payload.question, payload.language)


@router.post("/verify", response_model=VerifyResponse)
def verify_message(payload: VerifyRequest) -> VerifyResponse:
    answer = ask_gemini(payload.message, "ms")
    explanation = " ".join(
        part for part in (answer.title, answer.summary, answer.details) if part
    ).strip()
    return VerifyResponse(status=answer.verdict, explanation=explanation)
