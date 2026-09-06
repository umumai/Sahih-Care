from fastapi import APIRouter

from app.routers.bulletin_router import router as bulletin_router
from app.routers.health_router import router as health_router
from app.schemas.request import VerifyRequest
from app.schemas.response import VerifyResponse
from app.services.gemini_service import ask_gemini

router = APIRouter()
router.include_router(health_router)
router.include_router(bulletin_router)


@router.post("/verify", response_model=VerifyResponse)
def verify_message(payload: VerifyRequest) -> VerifyResponse:
    """Compatibility shim for the frontend paste-checker (POST /verify)."""
    answer = ask_gemini(payload.message, "ms")
    explanation = " ".join(
        part for part in (answer.title, answer.summary, answer.details) if part
    ).strip()
    return VerifyResponse(status=answer.verdict, explanation=explanation)
