from fastapi import APIRouter, File, Form, HTTPException, UploadFile

from app.config import ALLOWED_IMAGE_MIME_TYPES, MAX_IMAGE_BYTES, get_gemini_api_key
from app.schemas.request import HealthCheckRequest, LanguageCode
from app.schemas.response import HealthAnswer
from app.services.gemini_service import ask_gemini, ask_gemini_image

router = APIRouter(prefix="/health", tags=["health"])


@router.get("")
def healthcheck() -> dict:
    """Lightweight status probe — NOT the same as POST /health/check."""
    return {"ok": True, "gemini": bool(get_gemini_api_key())}


@router.post("/check", response_model=HealthAnswer)
def check_health_claim(payload: HealthCheckRequest) -> HealthAnswer:
    """Main endpoint: verify a text-based health claim or message."""
    return ask_gemini(payload.message, payload.language)


@router.post("/check-image", response_model=HealthAnswer)
async def check_health_image(
    image: UploadFile = File(...),
    language: LanguageCode = Form("ms"),
) -> HealthAnswer:
    """Verify a health claim contained inside an uploaded screenshot/photo.

    Returns the same HealthAnswer shape as /health/check so the frontend and
    Telegram bot can reuse one result-rendering path for both.
    """
    if image.content_type not in ALLOWED_IMAGE_MIME_TYPES:
        raise HTTPException(
            status_code=415,
            detail=f"Unsupported image type: {image.content_type}. "
            f"Allowed: {', '.join(sorted(ALLOWED_IMAGE_MIME_TYPES))}",
        )

    data = await image.read()
    if not data:
        raise HTTPException(status_code=400, detail="Uploaded image is empty.")
    if len(data) > MAX_IMAGE_BYTES:
        raise HTTPException(
            status_code=413,
            detail=f"Image too large. Max size is {MAX_IMAGE_BYTES // (1024 * 1024)}MB.",
        )

    return ask_gemini_image(data, image.content_type, language)
