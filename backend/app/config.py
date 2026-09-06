import os
from pathlib import Path

from dotenv import load_dotenv

APP_DIR = Path(__file__).resolve().parent
BACKEND_DIR = APP_DIR.parent
PROJECT_DIR = BACKEND_DIR.parent

ENV_CANDIDATES = (
    BACKEND_DIR / ".env",
    APP_DIR / ".env",
    PROJECT_DIR / ".env",
)


def _load_env(override: bool = False) -> None:
    for env_path in ENV_CANDIDATES:
        load_dotenv(env_path, override=override)
    load_dotenv(override=override)


_load_env(override=False)


def get_gemini_api_key() -> str:
    _load_env(override=True)
    return (
        os.getenv("GEMINI_API_KEY")
        or os.getenv("GOOGLE_API_KEY")
        or os.getenv("GOOGLE_GENAI_API_KEY")
        or ""
    ).strip()


def get_gemini_model() -> str:
    _load_env(override=True)
    return (os.getenv("GEMINI_MODEL") or "gemini-3.6-flash").strip()


GEMINI_API_KEY = get_gemini_api_key()
GEMINI_MODEL = get_gemini_model()

# Static MVP data (GET /api/bulletins). Checked in this order so it also
# works if you later move data/ up to the project root, per the README layout.
_BULLETIN_CANDIDATES = (
    BACKEND_DIR / "data" / "bulletins.json",
    PROJECT_DIR / "data" / "bulletins.json",
)
BULLETINS_PATH = next((p for p in _BULLETIN_CANDIDATES if p.exists()), _BULLETIN_CANDIDATES[0])

MAX_IMAGE_BYTES = 8 * 1024 * 1024  # 8 MB
ALLOWED_IMAGE_MIME_TYPES = {"image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"}
